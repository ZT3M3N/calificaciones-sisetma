"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface LoginFormProps {
  role: string;
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
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [contraseña, serContraseña] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const alert = searchParams.get("alert");
    if (alert === "auth-required") {
      setShowAlert(true);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo: email, contraseña }),
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        window.location.href = redirectTo;
      } else {
        setError(data.error || "Credenciales incorrectas");
      }
    } catch (err) {
      console.error("Error en login:", err);
      setError("Error en el servidor");
    } finally {
      setLoading(false);
    }
  };

  const getRoleName = () => {
    const roleParam = searchParams.get("role");
    return roleParam || role;
  };

  return (
    <>
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
                <Label htmlFor="contraseña">Contraseña:</Label>
                <Input
                  id="contraseña"
                  type="contraseña"
                  required
                  value={contraseña}
                  onChange={(e) => serContraseña(e.target.value)}
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

      {/* Alerta de autenticación requerida */}
      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              Autenticación Requerida
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              Debes iniciar sesión como <strong>{getRoleName()}</strong> para
              acceder a esta sección.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowAlert(false)}>
              Entendido
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
