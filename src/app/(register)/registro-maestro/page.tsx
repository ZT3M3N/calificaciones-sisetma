"use client";
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
import { useRouter } from "next/router";

type TeacherInput = {
  nombre: string;
  apellidos: string;
  correo: string;
  password: string;
};

export default function RegistroMaestro() {
  const [form, setForm] = React.useState<TeacherInput>({
    nombre: "",
    apellidos: "",
    correo: "",
    password: "",
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
      const res = await fetch("/api/teachers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Registro exitoso");
        setForm({ nombre: "", apellidos: "", correo: "", password: "" });
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
            Rellena el siguiente formulario con tus datos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="nombre">Nombre(s):</Label>
              <Input
                id="nombre"
                value={form.nombre}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="apellidos">Apellidos:</Label>
              <Input
                id="apellidos"
                value={form.apellidos}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="correo">Correo:</Label>
              <Input
                id="correo"
                value={form.correo}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Contraseña:</Label>
              <Input
                id="password"
                type="password"
                value={form.password}
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
                {loading
                  ? "Registrando..."
                  : "Registrar Información del docente"}
              </Button>
              {message && <p className="text-sm text-gray-600">{message}</p>}
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
