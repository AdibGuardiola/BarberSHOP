"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import Button from "@/components/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/Card";
import { CartSidebar } from "@/components/CartSidebar";
import { LocationsPage } from "@/components/LocationsPage";

import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, type User, signOut } from "firebase/auth";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export type Service = {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: number;
  image: string;
  ctaLabel: string;
};

export type CartItem = {
  service: Service;
  quantity: number;
};

type Page = "services" | "locations";

const SERVICES: Service[] = [
  {
    id: "haircut",
    name: "Corte y peinado",
    description:
      "Corte profesional personalizado según el estilo que buscas. Incluye lavado, secado y peinado final.",
    duration: "45–60 min",
    price: 25,
    image:
      "https://images.pexels.com/photos/3992875/pexels-photo-3992875.jpeg?auto=compress&cs=tinysrgb&w=600",
    ctaLabel: "Reservar corte y peinado",
  },
  {
    id: "dye",
    name: "Coloración completa",
    description:
      "Tinte completo con asesoría personalizada y tratamiento de brillo.",
    duration: "90–120 min",
    price: 45,
    image: "https://images.pexels.com/photos/973401/pexels-photo-973401.jpeg",
    ctaLabel: "Reservar coloración",
  },
  {
    id: "highlights",
    name: "Mechas / Balayage",
    description:
      "Aclara tu cabello con efecto natural y degradado. Incluye matiz y styling.",
    duration: "120–180 min",
    price: 85,
    image: "https://images.pexels.com/photos/3993461/pexels-photo-3993461.jpeg",
    ctaLabel: "Reservar mechas o balayage",
  },
  {
    id: "keratin",
    name: "Alisado de keratina",
    description:
      "Tratamiento anti-frizz de larga duración que aporta suavidad y brillo.",
    duration: "120–180 min",
    price: 120,
    image:
      "https://images.pexels.com/photos/3738349/pexels-photo-3738349.jpeg?auto=compress&cs=tinysrgb&w=600",
    ctaLabel: "Reservar alisado de keratina",
  },
  {
    id: "barber",
    name: "Corte masculino + barba",
    description:
      "Corte moderno y arreglo de barba con navaja. Acabado con aceites.",
    duration: "30–50 min",
    price: 20,
    image: "https://images.pexels.com/photos/3998415/pexels-photo-3998415.jpeg",
    ctaLabel: "Reservar corte + barba",
  },
  {
    id: "extensions",
    name: "Extensiones",
    description:
      "Extensiones naturales o sintéticas para volumen o longitud.",
    duration: "120–240 min",
    price: 150,
    image: "https://images.pexels.com/photos/3993469/pexels-photo-3993469.jpeg",
    ctaLabel: "Reservar extensiones",
  },
];

const CART_STORAGE_KEY = "barbershop-cart";

export default function Page() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [page, setPage] = useState<Page>("services");
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // Escuchar login/logout
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  // Cargar carrito
  useEffect(() => {
    if (typeof window === "undefined") return;

    const saved = localStorage.getItem(CART_STORAGE_KEY);
    if (saved) setCart(JSON.parse(saved));
  }, []);

  // Guardar carrito
  useEffect(() => {
    if (typeof window !== "undefined")
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const addToCart = (service: Service) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.service.id === service.id);
      if (existing) {
        return prev.map((i) =>
          i.service.id === service.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { service, quantity: 1 }];
    });
  };

  const clearCart = () => setCart([]);

  const total = cart.reduce(
    (sum, item) => sum + item.service.price * item.quantity,
    0
  );

  const handleConfirmOrder = async (booking: {
    name: string;
    date: string;
    time: string;
  }) => {
    if (!user) return router.push("/login");

    if (cart.length === 0) return;

    try {
      await addDoc(collection(db, "orders"), {
        userId: user.uid,
        userEmail: user.email,
        cart,
        total,
        createdAt: serverTimestamp(),
        bookingName: booking.name,
        bookingDate: booking.date,
        bookingTime: booking.time,
      });

      setCart([]);
      alert("¡Cita confirmada en Firebase! ✅");
    } catch (err) {
      console.error(err);
      alert("Error al guardar la cita.");
    }
  };

  const handleRateService = async (serviceId: string, rating: number) => {
    if (!user) return router.push("/login");

    try {
      await addDoc(collection(db, "ratings"), {
        userId: user.uid,
        userEmail: user.email,
        serviceId,
        rating,
        createdAt: serverTimestamp(),
      });

      alert(`Has valorado con ${rating} ⭐`);
    } catch (err) {
      console.error(err);
      alert("Error guardando valoración.");
    }
  };

  // Recargar introducción
  const goToIntro = () => {
    window.location.assign("/intro");
  };

  return (
    <div className="min-h-full bg-slate-900 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/80 px-6 py-4">
        <div className="mx-auto max-w-6xl flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold">BarberShop • Peluquería</h1>
            <p className="text-sm text-slate-300">
              Reserva tus servicios en nuestras sedes.
            </p>
          </div>

          {/* NAV CON LOGIN + EMAIL */}
          <nav className="flex flex-col items-end gap-2 text-sm">
            <div className="flex gap-2">
              <button
                onClick={goToIntro}
                className="rounded-full px-4 py-1.5 bg-slate-800 text-slate-200 hover:bg-slate-700"
              >
                Introducción
              </button>

              <button
                onClick={() => setPage("services")}
                className={`rounded-full px-4 py-1.5 ${
                  page === "services"
                    ? "bg-cyan-500 text-slate-900 font-semibold"
                    : "bg-slate-800 text-slate-200 hover:bg-slate-700"
                }`}
              >
                Servicios
              </button>

              <button
                onClick={() => setPage("locations")}
                className={`rounded-full px-4 py-1.5 ${
                  page === "locations"
                    ? "bg-cyan-500 text-slate-900 font-semibold"
                    : "bg-slate-800 text-slate-200 hover:bg-slate-700"
                }`}
              >
                Locales
              </button>

              {/* BOTÓN LOGIN / LOGOUT */}
              {user ? (
                <button
                  onClick={async () => {
                    await signOut(auth);
                    setUser(null);
                    router.push("/");
                  }}
                  className="rounded-full px-4 py-1.5 bg-red-500 text-slate-900 font-semibold hover:bg-red-400"
                >
                  Cerrar sesión
                </button>
              ) : (
                <button
                  onClick={() => router.push("/login")}
                  className="rounded-full px-4 py-1.5 bg-emerald-500 text-slate-900 font-semibold hover:bg-emerald-400"
                >
                  Iniciar sesión
                </button>
              )}
            </div>

            {/* TEXTO USUARIO CONECTADO */}
            {user && (
              <p className="text-xs text-slate-400">
                Conectado como:{" "}
                <span className="font-semibold">{user.email}</span>
              </p>
            )}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl p-6">
        {page === "services" ? (
          <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service) => (
              <Card
                key={service.id}
                className="bg-slate-800/70 shadow-lg shadow-black/30 overflow-hidden"
              >
                <img
                  src={service.image}
                  alt={service.name}
                  className="h-40 w-full object-cover"
                />

                <CardHeader>
                  <CardTitle>{service.name}</CardTitle>
                </CardHeader>

                <CardContent className="space-y-2 text-sm">
                  <p className="text-slate-300">{service.description}</p>

                  <div className="flex justify-between text-xs">
                    <span className="text-cyan-300">{service.duration}</span>
                    <span className="text-cyan-400 font-bold">
                      {service.price} €
                    </span>
                  </div>

                  <Button
                    onClick={() => addToCart(service)}
                    className="w-full mt-2"
                  >
                    {service.ctaLabel}
                  </Button>

                  <div className="flex gap-1 text-yellow-400 mt-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        onClick={() => handleRateService(service.id, s)}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </section>
        ) : (
          <LocationsPage />
        )}
      </main>

      <CartSidebar
        cart={cart}
        total={total}
        onClear={clearCart}
        onConfirm={handleConfirmOrder}
      />
    </div>
  );
}
