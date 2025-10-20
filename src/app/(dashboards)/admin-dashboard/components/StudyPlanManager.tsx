"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetcher } from "@/lib/fetcher";

export default function StudyPlanManager() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [form, setForm] = useState({
    nombre: "",
    clave: "",
    creditos: 0,
    horasSemanales: 0,
    semestre: 1,
    carrera: "",
  });

  async function loadSubjects() {
    const data = await fetcher<any[]>("/api/asignaturas");
    setSubjects(data);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/asignaturas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Error al guardar asignatura");
      setForm({
        nombre: "",
        clave: "",
        creditos: 0,
        horasSemanales: 0,
        semestre: 1,
        carrera: "",
      });
      await loadSubjects();
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadSubjects();
  }, []);

  return (
    <Card className="shadow-md">
      <CardHeader>
        <h2 className="text-lg font-semibold">Gestión de Asignaturas</h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-4">
          <Input
            placeholder="Nombre"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          />
          <Input
            placeholder="Clave"
            value={form.clave}
            onChange={(e) => setForm({ ...form, clave: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Créditos"
            value={form.creditos}
            onChange={(e) => setForm({ ...form, creditos: +e.target.value })}
          />
          <Input
            type="number"
            placeholder="Horas semanales"
            value={form.horasSemanales}
            onChange={(e) =>
              setForm({ ...form, horasSemanales: +e.target.value })
            }
          />
          <Input
            placeholder="Carrera"
            value={form.carrera}
            onChange={(e) => setForm({ ...form, carrera: e.target.value })}
          />
          <Button type="submit">Agregar Asignatura</Button>
        </form>

        <ul className="divide-y">
          {subjects.map((s) => (
            <li key={s.id} className="py-2">
              <span className="font-medium">{s.nombre}</span> ({s.clave}) -{" "}
              {s.carrera}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
