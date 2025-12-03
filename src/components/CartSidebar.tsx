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

const MONDAY_FIRST_WEEKDAY = 1;
const TIME_SLOTS = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
];

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
  const [monthCursor, setMonthCursor] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const hasItems = cart.length > 0;
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const toggle = () => setIsOpen((prev) => !prev);

  const today = new Date();
  const todayAtMidnight = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  const isCurrentMonth =
    monthCursor.getFullYear() === todayAtMidnight.getFullYear() &&
    monthCursor.getMonth() === todayAtMidnight.getMonth();

  const goToMonth = (increment: number) => {
    const next = new Date(monthCursor);
    next.setMonth(monthCursor.getMonth() + increment, 1);
    setMonthCursor(next);
  };

  const formatDateKey = (value: Date) => value.toISOString().split("T")[0];

  const monthLabel = monthCursor.toLocaleDateString("es-ES", {
    month: "long",
    year: "numeric",
  });

  const firstDayOfMonth = new Date(
    monthCursor.getFullYear(),
    monthCursor.getMonth(),
    1,
  );
  const daysInMonth = new Date(
    monthCursor.getFullYear(),
    monthCursor.getMonth() + 1,
    0,
  ).getDate();
  const startOffset =
    (firstDayOfMonth.getDay() + 7 - MONDAY_FIRST_WEEKDAY) % 7;

  const dayLabels = ["L", "M", "X", "J", "V", "S", "D"];

  const isDisabledDate = (value: Date) => {
    const weekday = value.getDay();
    const isSunday = weekday === 0;
    return isSunday || value < todayAtMidnight;
  };

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
                  <div className="space-y-3 text-xs mt-2">
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

                    <div className="space-y-2">
                      <label className="block text-slate-300">Fecha</label>
                      <div className="rounded-lg border border-slate-700 bg-slate-900 p-3">
                        <div className="mb-2 flex items-center justify-between text-[11px] text-slate-300">
                          <button
                            type="button"
                            className="rounded-md bg-slate-800 px-2 py-1 text-slate-200 transition hover:bg-slate-700 disabled:opacity-40"
                            onClick={() => goToMonth(-1)}
                            disabled={isCurrentMonth}
                          >
                            ← Anterior
                          </button>
                          <span className="font-semibold capitalize">{monthLabel}</span>
                          <button
                            type="button"
                            className="rounded-md bg-slate-800 px-2 py-1 text-slate-200 transition hover:bg-slate-700"
                            onClick={() => goToMonth(1)}
                          >
                            Siguiente →
                          </button>
                        </div>

                        <div className="grid grid-cols-7 gap-2 text-center text-[11px] text-slate-400">
                          {dayLabels.map((label) => (
                            <span key={label}>{label}</span>
                          ))}
                        </div>

                        <div className="mt-1 grid grid-cols-7 gap-2 text-sm">
                          {Array.from({ length: startOffset }).map((_, idx) => (
                            <span key={`offset-${idx}`} />
                          ))}

                          {Array.from({ length: daysInMonth }).map((_, idx) => {
                            const dayNumber = idx + 1;
                            const currentDate = new Date(
                              monthCursor.getFullYear(),
                              monthCursor.getMonth(),
                              dayNumber,
                            );
                            const disabled = isDisabledDate(currentDate);
                            const dateKey = formatDateKey(currentDate);
                            const isSelected = date === dateKey;

                            return (
                              <button
                                key={dayNumber}
                                type="button"
                                onClick={() => setDate(dateKey)}
                                disabled={disabled}
                                className={`w-full rounded-md border px-2 py-2 text-center transition ${
                                  disabled
                                    ? "cursor-not-allowed border-slate-800 bg-slate-900 text-slate-600"
                                    : isSelected
                                      ? "border-cyan-400 bg-cyan-500/90 text-slate-900 font-semibold shadow-sm shadow-cyan-500/40"
                                      : "border-slate-700 bg-slate-800 text-slate-100 hover:border-cyan-500 hover:text-cyan-100"
                                }`}
                              >
                                {dayNumber}
                              </button>
                            );
                          })}
                        </div>
                        <p className="mt-2 text-[11px] text-slate-500">
                          Agenda disponible de lunes a sábado, de 9:00 a 13:00 y de
                          16:00 a 20:00.
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="block mb-1 text-slate-300">Hora</label>
                      <select
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full rounded-md bg-slate-900 border border-slate-700 px-2 py-1 text-xs text-slate-100 outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
                      >
                        <option value="">Selecciona una hora</option>
                        {TIME_SLOTS.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
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
