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

type PeriodoInput = {
  nombre: string;
  fecha_inicio: string;
  fecha_fin: string;
  ciclo_escolar: string;
  porcentaje: string;
};

export default function EditPeriodoPage() {
  const params = useParams();
  const router = useRouter();

  const [form, setForm] = useState<PeriodoInput>({
    nombre: "",
    fecha_inicio: "",
    fecha_fin: "",
    ciclo_escolar: "",
    porcentaje: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Cargar datos del periodo al montar
  useEffect(() => {
    async function fetchPeriodo() {
      try {
        const res = await fetch(`/api/periodos/${params.id}`);
        const data = await res.json();
        if (res.ok) {
          setForm({
            nombre: data.nombre,
            fecha_inicio: data.fecha_inicio.split("T")[0], // Ajustar formato para <input type="date" />
            fecha_fin: data.fecha_fin.split("T")[0],
            ciclo_escolar: data.ciclo_escolar,
            porcentaje: data.porcentaje.toString(),
          });
        } else {
          setMessage(`❌ ${data.error}`);
        }
      } catch (error) {
        setMessage("⚠️ Error de conexión con el servidor");
      }
    }

    fetchPeriodo();
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`/api/periodos/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          porcentaje: parseFloat(form.porcentaje),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Periodo actualizado exitosamente");
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
          <CardTitle>Editar Periodo de Evaluación</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="nombre">Nombre del periodo:</Label>
              <Input
                id="nombre"
                value={form.nombre}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="fecha_inicio">Fecha de inicio:</Label>
              <Input
                id="fecha_inicio"
                type="date"
                value={form.fecha_inicio}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="fecha_fin">Fecha de fin:</Label>
              <Input
                id="fecha_fin"
                type="date"
                value={form.fecha_fin}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="ciclo_escolar">Ciclo escolar:</Label>
              <Input
                id="ciclo_escolar"
                value={form.ciclo_escolar}
                onChange={handleChange}
                placeholder="Ej. 2025-2026"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="porcentaje">Porcentaje (%):</Label>
              <Input
                id="porcentaje"
                type="number"
                step="0.01"
                value={form.porcentaje}
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
                {loading ? "Actualizando..." : "Actualizar Periodo"}
              </Button>
              {message && <p className="text-sm text-gray-600">{message}</p>}
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
