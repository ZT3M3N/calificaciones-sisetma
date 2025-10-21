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

type DocenteInput = {
  nombre: string;
  apellidos: string;
  correo: string;
  telefono?: string;
};

export default function EditDocentePage() {
  const params = useParams();
  const router = useRouter();

  const [form, setForm] = useState<DocenteInput>({
    nombre: "",
    apellidos: "",
    correo: "",
    telefono: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Cargar datos del docente al montar
  useEffect(() => {
    async function fetchDocente() {
      try {
        const res = await fetch(`/api/docentes/${params.id}`);
        const data = await res.json();
        if (res.ok) {
          setForm({
            nombre: data.nombre,
            apellidos: data.apellidos,
            correo: data.correo,
            telefono: data.telefono || "",
          });
        } else {
          setMessage(`❌ ${data.error}`);
        }
      } catch (error) {
        setMessage("⚠️ Error de conexión con el servidor");
      }
    }

    fetchDocente();
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`/api/docentes/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Docente actualizado exitosamente");
        router.refresh(); // Refresca la lista de docentes
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
          <CardTitle>Editar Docente</CardTitle>
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
                type="email"
                value={form.correo}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="telefono">Teléfono:</Label>
              <Input
                id="telefono"
                value={form.telefono}
                onChange={handleChange}
              />
            </div>

            <CardFooter className="flex flex-col gap-2">
              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={loading}
              >
                {loading ? "Actualizando..." : "Actualizar Docente"}
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
