"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LoginFormProps {
  role: string; // admin, maestro, docente
  apiEndpoint: string;
  redirectTo: string;
  title: string;
  registerLink: string;
  registerText: string;
}

export default function LoginForm({
  role,
  apiEndpoint,
  redirectTo,
  title,
  registerLink,
  registerText,
}: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo: email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // 🔹 Si la API devuelve un token, lo guardamos
        if (data.token) {
          if (data.token) {
            document.cookie = `token=${data.token} path=/; max-age=7200; secure; samesite=strict`;
          }
        }

        // 🔹 Redirigimos al dashboard
        router.push(redirectTo);
      } else {
        setError(data.error || "Credenciales incorrectas");
      }
    } catch (err) {
      setError("Error en el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-sm text-center">
        <CardHeader>
          <CardTitle className="text-center">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Correo:</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Contraseña:</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={loading}
            >
              {loading ? "Ingresando..." : "Iniciar sesión"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            {registerText}{" "}
            <Link
              href={registerLink}
              className="text-black hover:underline font-medium"
            >
              Regístrate
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
