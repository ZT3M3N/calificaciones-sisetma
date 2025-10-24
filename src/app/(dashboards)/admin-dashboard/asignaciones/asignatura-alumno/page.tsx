"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "sonner";

export default function AsignarAlumnoPage() {
  const [estudiantes, setEstudiantes] = useState<any[]>([]);
  const [asignaturasDocentes, setAsignaturasDocentes] = useState<any[]>([]);
  const [selectedEstudiante, setSelectedEstudiante] = useState("");
  const [selectedAsignaturaDocente, setSelectedAsignaturaDocente] = useState("");
  const [asignaciones, setAsignaciones] = useState<any[]>([]);

  useEffect(() => {
    fetchEstudiantes();
    fetchAsignaturasDocentes();
    fetchAsignaciones();
  }, []);

  const fetchEstudiantes = async () => {
    const res = await fetch("/api/estudiantes");
    const data = await res.json();
    setEstudiantes(data);
  };

  const fetchAsignaturasDocentes = async () => {
    const res = await fetch("/api/asignaturas-docentes");
    const data = await res.json();
    setAsignaturasDocentes(data);
  };

  const fetchAsignaciones = async () => {
    try {
      const res = await fetch("/api/asignaciones-alumnos");
      const data = await res.json();
      setAsignaciones(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error al cargar asignaciones:", err);
      setAsignaciones([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedEstudiante || !selectedAsignaturaDocente) {
      toast.error("Debes seleccionar un alumno y una materia");
      return;
    }

    const res = await fetch("/api/asignaciones-alumnos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        estudianteId: Number(selectedEstudiante),
        asignatura_docenteId: Number(selectedAsignaturaDocente),
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error || "Error al asignar materia");
      return;
    }

    toast.success("Materia asignada correctamente 🎓");
    fetchAsignaciones();
  };

  return (
    <div className="p-6 space-y-8">
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle>Asignar Materia a Alumno</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Seleccionar Alumno</Label>
              <Select onValueChange={setSelectedEstudiante}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un alumno" />
                </SelectTrigger>
                <SelectContent>
                  {estudiantes.map((est) => (
                    <SelectItem key={est.id} value={String(est.id)}>
                      {est.nombre} {est.apellidos} ({est.matricula})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Seleccionar Materia (Docente)</Label>
              <Select onValueChange={setSelectedAsignaturaDocente}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione una materia" />
                </SelectTrigger>
                <SelectContent>
                  {asignaturasDocentes.map((asig) => (
                    <SelectItem key={asig.id} value={String(asig.id)}>
                      {asig.asignatura} — {asig.docente}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full">
              Asignar Materia
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="max-w-4xl mx-auto shadow">
        <CardHeader>
          <CardTitle>Asignaciones Registradas</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y">
            {asignaciones.map((a) => (
              <li key={a.id} className="py-3">
                <strong>{a.estudiante.nombre} {a.estudiante.apellidos}</strong> →{" "}
                {a.asignatura_docente.asignatura.nombre} ({a.asignatura_docente.docente.nombre}{" "}
                {a.asignatura_docente.docente.apellidos})
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
