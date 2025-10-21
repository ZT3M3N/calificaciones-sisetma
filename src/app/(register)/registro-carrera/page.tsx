"use client";

import Link from "next/link";
import * as React from "react";
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

type CarreraInput = {
  nombre: string;
  clave: string;
  descripcion: string;
};

export default function RegistroCarrera() {
  const [form, setForm] = React.useState<CarreraInput>({
    nombre: "",
    clave: "",
    descripcion: "",
  });

  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/carreras", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Carrera registrada correctamente");
        setForm({
          nombre: "",
          clave: "",
          descripcion: "",
        });
      } else {
        setMessage(`❌ ${data.error}`);
      }
    } catch (error) {
      setMessage("⚠️ Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-sm text-center">
        <CardHeader>
          <CardTitle className="text-center">
            Registrar nueva carrera
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="nombre">Nombre de la carrera:</Label>
              <Input
                id="nombre"
                value={form.nombre}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="clave">Clave:</Label>
              <Input
                id="clave"
                value={form.clave}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="descripcion">Descripción:</Label>
              <Input
                id="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                required
              />
            </div>

            <CardFooter className="flex-col gap-2">
              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={loading}
              >
                {loading ? "Registrando..." : "Registrar carrera"}
              </Button>
              <Link href={"/admin-dashboard/carreras"}>
                <Button className="hover:cursor-pointer w-full">
                  Volver al listado
                </Button>
              </Link>
              {message && (
                <p className="text-sm text-gray-600 text-center mt-2">
                  {message}
                </p>
              )}
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
