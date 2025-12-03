"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, type User } from "firebase/auth";
import {
  collection,
  getDocs,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import Button from "@/components/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/Card";

// 👈 CAMBIA esto si quieres usar otro correo como admin
const ADMIN_EMAIL = "cliente1@gmail.com";

type OrderItem = {
  service: {
    id: string;
    name: string;
    price: number;
  };
  quantity: number;
};

type Order = {
  id: string;
  userId: string;
  userEmail: string | null;
  total: number;
  createdAt: Date | null;
  cart: OrderItem[];
  bookingName?: string | null;
  bookingDate?: string | null;
  bookingTime?: string | null;
};

type Rating = {
  id: string;
  userId: string;
  userEmail: string | null;
  serviceId: string;
  rating: number;
  createdAt: Date | null;
};

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [orders, setOrders] = useState<Order[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const router = useRouter();

  // ▶️ Escuchamos la sesión
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoadingUser(false);
    });
    return () => unsub();
  }, []);

  // ▶️ Cargamos orders + ratings SOLO si el usuario es el admin
  useEffect(() => {
    if (!user || user.email !== ADMIN_EMAIL) return;

    const load = async () => {
      try {
        // ---- ORDERS ----
        const ordersSnap = await getDocs(
          query(collection(db, "orders"), orderBy("createdAt", "desc"))
        );

        const ordersData: Order[] = ordersSnap.docs.map((doc) => {
          const data = doc.data() as any;
          return {
            id: doc.id,
            userId: data.userId,
            userEmail: data.userEmail ?? null,
            total: data.total ?? 0,
            createdAt:
              data.createdAt instanceof Timestamp
                ? data.createdAt.toDate()
                : null,
            cart: (data.cart ?? []).map((item: any) => ({
              service: {
                id: item.service?.id,
                name: item.service?.name,
                price: item.service?.price ?? 0,
              },
              quantity: item.quantity ?? 1,
            })),
            bookingName: data.bookingName ?? null,
            bookingDate: data.bookingDate ?? null,
            bookingTime: data.bookingTime ?? null,
          };
        });

        // ---- RATINGS ----
        const ratingsSnap = await getDocs(
          query(collection(db, "ratings"), orderBy("createdAt", "desc"))
        );

        const ratingsData: Rating[] = ratingsSnap.docs.map((doc) => {
          const data = doc.data() as any;
          return {
            id: doc.id,
            userId: data.userId,
            userEmail: data.userEmail ?? null,
            serviceId: data.serviceId,
            rating: data.rating,
            createdAt:
              data.createdAt instanceof Timestamp
                ? data.createdAt.toDate()
                : null,
          };
        });

        setOrders(ordersData);
        setRatings(ratingsData);
      } catch (err) {
        console.error("Error cargando datos del admin:", err);
      } finally {
        setLoadingData(false);
      }
    };

    load();
  }, [user]);

  // ---- ESTADOS DE PANTALLA ----

  if (loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-100">
        Comprobando sesión...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-slate-100 gap-4">
        <p>Debes iniciar sesión para ver esta página.</p>
        <Button onClick={() => router.push("/login")}>Ir al login</Button>
      </div>
    );
  }

  if (user.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-slate-100 gap-4">
        <p>Esta página es solo para el administrador.</p>
        <Button onClick={() => router.push("/")}>Volver a la web</Button>
      </div>
    );
  }

  // ---- PÁGINA DE ADMIN ----
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Panel de administración</h1>
          <div className="text-sm text-slate-300">
            Conectado como{" "}
            <span className="font-semibold">{user.email}</span>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* COMPRAS / CITAS */}
          <Card className="bg-slate-800/80">
            <CardHeader>
              <CardTitle>Citas y compras</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {loadingData ? (
                <p>Cargando datos...</p>
              ) : orders.length === 0 ? (
                <p className="text-slate-400">Todavía no hay citas.</p>
              ) : (
                <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="border border-slate-700/70 rounded-lg p-3 space-y-1"
                    >
                      <div className="flex justify-between text-xs text-slate-300">
                        <span>{order.userEmail ?? order.userId}</span>
                        <span>
                          {order.createdAt
                            ? order.createdAt.toLocaleString()
                            : "Sin fecha"}
                        </span>
                      </div>

                      {order.bookingName && (
                        <div className="text-xs text-slate-200">
                          Cliente:{" "}
                          <span className="font-semibold">
                            {order.bookingName}
                          </span>
                          {order.bookingDate && order.bookingTime && (
                            <>
                              {" "}
                              • Cita: {order.bookingDate} a las{" "}
                              {order.bookingTime}
                            </>
                          )}
                        </div>
                      )}

                      <ul className="text-xs text-slate-200">
                        {order.cart.map((item, idx) => (
                          <li key={idx}>
                            {item.quantity}× {item.service.name} (
                            {item.service.price} €)
                          </li>
                        ))}
                      </ul>

                      <div className="text-right text-sm font-semibold text-cyan-400">
                        Total: {order.total} €
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* VALORACIONES */}
          <Card className="bg-slate-800/80">
            <CardHeader>
              <CardTitle>Valoraciones de servicios</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {loadingData ? (
                <p>Cargando datos...</p>
              ) : ratings.length === 0 ? (
                <p className="text-slate-400">
                  Todavía no hay valoraciones de servicios.
                </p>
              ) : (
                <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                  {ratings.map((r) => (
                    <div
                      key={r.id}
                      className="border border-slate-700/70 rounded-lg p-3 text-xs space-y-1"
                    >
                      <div className="flex justify-between">
                        <span>{r.userEmail ?? r.userId}</span>
                        <span>
                          {r.createdAt
                            ? r.createdAt.toLocaleString()
                            : "Sin fecha"}
                        </span>
                      </div>
                      <div>
                        Servicio:{" "}
                        <span className="font-semibold">{r.serviceId}</span>
                      </div>
                      <div>
                        Rating:{" "}
                        <span className="text-yellow-400">
                          {"★".repeat(r.rating)}
                          {"☆".repeat(5 - r.rating)}
                        </span>{" "}
                        ({r.rating}/5)
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


