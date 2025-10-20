"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { fetcher } from "@/lib/fetcher";

export default function EnrollmentForm() {
  const [students, setStudents] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [form, setForm] = useState({
    studentId: "",
    grupoId: "",
    cicloEscolar: "",
  });

  useEffect(() => {
    async function loadData() {
      const [studentsData, groupsData] = await Promise.all([
        fetcher<any[]>("/api/students"),
        fetcher<any[]>("/api/grupos"),
      ]);
      setStudents(studentsData);
      setGroups(groupsData);
    }
    loadData();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/inscripciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          fechaInscripcion: new Date().toISOString(),
        }),
      });

      if (!res.ok) throw new Error("Error al registrar inscripción");
      setForm({ studentId: "", grupoId: "", cicloEscolar: "" });
      alert("Inscripción creada correctamente");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Card className="shadow-md">
      <CardHeader>
        <h2 className="text-lg font-semibold">Registrar Inscripción</h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <Select onValueChange={(v) => setForm({ ...form, studentId: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona estudiante" />
            </SelectTrigger>
            <SelectContent>
              {students.map((s) => (
                <SelectItem key={s.id} value={String(s.id)}>
                  {s.nombre} {s.apellidos}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={(v) => setForm({ ...form, grupoId: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona grupo" />
            </SelectTrigger>
            <SelectContent>
              {groups.map((g) => (
                <SelectItem key={g.id} value={String(g.id)}>
                  {g.nombre} - {g.carrera}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            placeholder="Ciclo escolar (Ej. 2025-A)"
            value={form.cicloEscolar}
            onChange={(e) => setForm({ ...form, cicloEscolar: e.target.value })}
          />

          <Button type="submit">Registrar inscripción</Button>
        </form>
      </CardContent>
    </Card>
  );
}
