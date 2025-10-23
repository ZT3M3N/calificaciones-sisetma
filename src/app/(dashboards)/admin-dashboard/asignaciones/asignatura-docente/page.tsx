"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

type Docente = { id: number; nombre: string; apellidos: string };
type Asignatura = { id: number; nombre: string };

type AsignaturaDocenteInput = {
  docenteId: number;
  asignaturaId: number;
  cicloEscolar: string;
};

export default function RegistroAsignaturaDocente() {
  const [form, setForm] = useState<AsignaturaDocenteInput>({
    docenteId: 0,
    asignaturaId: 0,
    cicloEscolar: "",
  });

  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [asignaturas, setAsignaturas] = useState<Asignatura[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const router = useRouter();

  // Cargar docentes
  useEffect(() => {
    fetch("/api/docentes")
      .then((res) => res.json())
      .then((data) => setDocentes(data))
      .catch((err) => console.error("Error cargando docentes:", err));
  }, []);

  // Cargar asignaturas
  useEffect(() => {
    fetch("/api/asignaturas")
      .then((res) => res.json())
      .then((data) => setAsignaturas(data))
      .catch((err) => console.error("Error cargando asignaturas:", err));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/asignaturas-docentes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Asignación registrada correctamente");
        setForm({ docenteId: 0, asignaturaId: 0, cicloEscolar: "" });
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
          <CardTitle>Registrar Asignatura-Docente</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="docenteId">Docente:</Label>
              <select
                id="docenteId"
                value={form.docenteId}
                onChange={handleChange}
                required
                className="border rounded p-2"
              >
                <option value={0}>Selecciona un docente</option>
                {docentes.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.nombre} {d.apellidos}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="asignaturaId">Asignatura:</Label>
              <select
                id="asignaturaId"
                value={form.asignaturaId}
                onChange={handleChange}
                required
                className="border rounded p-2"
              >
                <option value={0}>Selecciona una asignatura</option>
                {asignaturas.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="cicloEscolar">Ciclo escolar:</Label>
              <Input
                id="cicloEscolar"
                value={form.cicloEscolar}
                onChange={handleChange}
                placeholder="Ej: 2025-2026"
                required
              />
            </div>

            <CardFooter className="flex-col gap-2">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Registrando..." : "Registrar asignación"}
              </Button>
              {message && <p className="text-sm text-gray-600 mt-2">{message}</p>}
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
