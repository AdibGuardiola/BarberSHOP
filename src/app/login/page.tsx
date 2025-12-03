"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import { auth } from "../../lib/firebase";
import Button from "../../components/Button";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/Card";

type Mode = "login" | "register";

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [user, setUser] = useState<User | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // escuchar cambios de sesión
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      setEmail("");
      setPassword("");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Algo ha salido mal.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Card className="bg-slate-800/80 shadow-xl shadow-black/50">
          <CardHeader className="text-center">
            <CardTitle>
              {user
                ? "Tu cuenta"
                : mode === "login"
                ? "Iniciar sesión"
                : "Crear cuenta"}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 text-sm">
            {user ? (
              <>
                <p className="text-slate-300">
                  Sesión iniciada como{" "}
                  <span className="font-semibold">{user.email}</span>
                </p>
                <div className="flex gap-2 pt-2">
                  <Button className="flex-1" onClick={handleLogout}>
                    Cerrar sesión
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Link href="/">Volver a la página principal</Link>
                  </Button>
                </div>
              </>
            ) : (
              <>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-slate-300">
                      Correo electrónico
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                      placeholder="tucorreo@ejemplo.com"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-slate-300">
                      Contraseña
                    </label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                      placeholder="••••••••"
                    />
                  </div>

                  {error && (
                    <p className="text-xs text-red-400 whitespace-pre-line">
                      {error}
                    </p>
                  )}

                  <Button
                    type="submit"
                    className="w-full mt-2"
                    disabled={loading}
                  >
                    {loading
                      ? "Cargando..."
                      : mode === "login"
                      ? "Entrar"
                      : "Registrarme"}
                  </Button>
                </form>

                <div className="pt-2 text-xs text-center text-slate-400">
                  {mode === "login" ? (
                    <>
                      ¿No tienes cuenta?{" "}
                      <button
                        type="button"
                        className="text-cyan-400 hover:underline"
                        onClick={() => setMode("register")}
                      >
                        Crear una cuenta
                      </button>
                    </>
                  ) : (
                    <>
                      ¿Ya tienes cuenta?{" "}
                      <button
                        type="button"
                        className="text-cyan-400 hover:underline"
                        onClick={() => setMode("login")}
                      >
                        Inicia sesión
                      </button>
                    </>
                  )}
                </div>

                <div className="pt-1 text-center">
                  <Link
                    href="/"
                    className="text-[11px] text-slate-500 hover:text-slate-300"
                  >
                    ← Volver a TechFix
                  </Link>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}






