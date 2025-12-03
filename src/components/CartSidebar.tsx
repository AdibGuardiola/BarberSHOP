// src/components/CartSidebar.tsx
"use client";

import { useState } from "react";
import Button from "./Button";
import { Card, CardHeader, CardTitle, CardContent } from "./Card";
import type { CartItem } from "@/app/page";

type CartSidebarProps = {
  cart: CartItem[];
  total: number;
  onClear: () => void;
  onConfirm: (booking: { name: string; date: string; time: string }) => void;
};

export function CartSidebar({
  cart,
  total,
  onClear,
  onConfirm,
}: CartSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const hasItems = cart.length > 0;
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const toggle = () => setIsOpen((prev) => !prev);

  const handleConfirmClick = () => {
    if (!name || !date || !time) return;
    onConfirm({ name, date, time });
    setName("");
    setDate("");
    setTime("");
    setIsOpen(false);
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:bg-transparent"
          onClick={toggle}
        />
      )}

      <div className="fixed bottom-6 right-6 z-40 space-y-3">
        {isOpen && (
          <Card className="w-80 max-h-[70vh] overflow-y-auto bg-slate-900 shadow-xl shadow-black/50 border border-slate-700">
            <CardHeader>
              <CardTitle>Carrito</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              {!hasItems ? (
                <p className="text-slate-400">
                  Aún no has añadido ningún servicio. Selecciona uno para verlo
                  aquí.
                </p>
              ) : (
                <>
                  <ul className="space-y-3">
                    {cart.map((item) => (
                      <li
                        key={item.service.id}
                        className="flex items-start justify-between gap-3 border-b border-slate-700/70 pb-2 last:border-0"
                      >
                        <div>
                          <p className="font-medium">{item.service.name}</p>
                          <p className="text-xs text-slate-400">
                            {item.quantity} ×{" "}
                            {item.service.price > 0
                              ? `${item.service.price} €`
                              : "Presupuesto"}
                          </p>
                        </div>
                        <div className="text-right text-sm font-semibold text-cyan-300">
                          {item.service.price > 0
                            ? `${item.service.price * item.quantity} €`
                            : "-"}
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-2 flex items-center justify-between border-t border-slate-700/70 pt-3 text-sm">
                    <span className="font-semibold text-slate-200">
                      Total servicios:
                    </span>
                    <span className="text-lg font-bold text-cyan-400">
                      {total} €
                    </span>
                  </div>

                  {/* Datos cita */}
                  <div className="space-y-2 text-xs mt-2">
                    <div>
                      <label className="block mb-1 text-slate-300">
                        Nombre
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-1 text-xs text-slate-100 outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
                        placeholder="Tu nombre"
                      />
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="block mb-1 text-slate-300">
                          Fecha
                        </label>
                        <input
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-1 text-xs text-slate-100 outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block mb-1 text-slate-300">
                          Hora
                        </label>
                        <input
                          type="time"
                          value={time}
                          onChange={(e) => setTime(e.target.value)}
                          className="w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-1 text-xs text-slate-100 outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      className="flex-1"
                      disabled={
                        total === 0 || !hasItems || !name || !date || !time
                      }
                      onClick={handleConfirmClick}
                    >
                      Confirmar cita
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={onClear}
                    >
                      Vaciar
                    </Button>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    * Los servicios marcados como “Presupuesto” se confirman en
                    tienda según el estado del cabello y el tipo de servicio.
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        )}

        <Button
          className="flex items-center gap-2 rounded-full bg-cyan-500 px-5 py-2 text-slate-900 shadow-lg shadow-black/40 hover:bg-cyan-400"
          onClick={toggle}
        >
          <span>🛒</span>
          <span className="text-sm font-semibold">
            {itemCount > 0 ? `${itemCount} item(s)` : "Carrito"}
          </span>
          <span className="text-sm font-bold">
            {total > 0 ? `${total} €` : ""}
          </span>
        </Button>
      </div>
    </>
  );
}
