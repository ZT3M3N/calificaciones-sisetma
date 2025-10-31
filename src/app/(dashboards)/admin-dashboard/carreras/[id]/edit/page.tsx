"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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

export default function EditCarrera() {
  const params = useParams(); 
  const router = useRouter();
  const [form, setForm] = useState<CarreraInput>({
    nombre: "",
    clave: "",
    descripcion: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchCarrera() {
      try {
        const res = await fetch(`/api/carreras/${params.id}`);
        const data = await res.json();

        if (res.ok) {
          setForm({
            nombre: data.nombre,
            clave: data.clave,
            descripcion: data.descripcion,
          });
        } else {
          setMessage(`❌ ${data.error}`);
        }
      } catch (error) {
        setMessage("⚠️ Error de conexión con el servidor");
      }
    }

    fetchCarrera();
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`/api/carreras/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Carrera actualizada exitosamente");
        router.refresh();
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
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle>Editar Carrera</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="nombre">Nombre:</Label>
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

            <CardFooter className="flex flex-col gap-2">
              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={loading}
              >
                {loading ? "Actualizando..." : "Actualizar Carrera"}
              </Button>
              {message && (
                <p className="text-sm text-gray-600">{message}</p>
              )}
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
