"use client";

import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline";
};

export default function Button({
  children,
  variant = "primary",
  ...props
}: ButtonProps) {
  const base =
    "px-4 py-2 rounded-md text-sm font-medium cursor-pointer transition";

  const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
    primary: "bg-black text-white hover:opacity-80",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
    outline:
      "border border-slate-600 bg-transparent text-slate-100 hover:bg-slate-800",
  };

  return (
    <button className={`${base} ${variants[variant]}`} {...props}>
      {children}
    </button>
  );
}



