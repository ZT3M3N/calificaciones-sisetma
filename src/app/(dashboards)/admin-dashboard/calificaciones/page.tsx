"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CalificacionesPage() {
  const [estudiantes, setEstudiantes] = useState([]);
  const [selectedEstudiante, setSelectedEstudiante] = useState("");
  const [materias, setMaterias] = useState([]);
  const [calificaciones, setCalificaciones] = useState([]);
  const [promedio, setPromedio] = useState(0);

  const [formData, setFormData] = useState({
    asignatura_docenteId: "",
    periodo_evaluacionId: "",
    calificacion: "",
    faltas: "",
    observaciones: "",
  });

  // 🔹 Obtener lista de estudiantes
  useEffect(() => {
    async function fetchEstudiantes() {
      const res = await fetch("/api/estudiantes");
      const data = await res.json();
      setEstudiantes(data);
    }
    fetchEstudiantes();
  }, []);

  // 🔹 Obtener materias cuando se selecciona un estudiante
  useEffect(() => {
    if (selectedEstudiante) {
      async function fetchMaterias() {
        const res = await fetch(`/api/asignaturas-docentes?estudianteId=${selectedEstudiante}`);
        const data = await res.json();
        setMaterias(data);
      }
      fetchMaterias();
    }
  }, [selectedEstudiante]);

  // 🔹 Manejo del cambio de formulario
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Enviar calificación
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const res = await fetch("/api/calificaciones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, estudianteId: selectedEstudiante }),
    });

    if (res.ok) {
      alert("✅ Calificación registrada correctamente");
      setFormData({
        asignatura_docenteId: "",
        periodo_evaluacionId: "",
        calificacion: "",
        faltas: "",
        observaciones: "",
      });
    } else {
      alert("❌ Error al registrar calificación");
    }
  };



  return (
    <div className="max-w-6xl mx-auto py-10 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>📘 Registro de Calificaciones</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Selección de estudiante */}
          <div className="mb-4">
            <Label>Selecciona un estudiante</Label>
            <Select onValueChange={setSelectedEstudiante}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un estudiante" />
              </SelectTrigger>
              <SelectContent>
                {estudiantes.map((est: any) => (
                  <SelectItem key={est.id} value={String(est.id)}>
                    {est.nombre} {est.apellidos}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Mostrar materias del estudiante */}
          {materias.length > 0 && (
            <div className="mb-6">
              <Label>Selecciona una materia</Label>
              <select
                name="asignatura_docenteId"
                value={formData.asignatura_docenteId}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              >
                <option value="">Selecciona una materia</option>
                {materias.map((mat: any) => (
                  <option key={mat.id} value={mat.id}>
                    {mat.asignatura} - {mat.docente}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Formulario de calificación */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Periodo de Evaluación</Label>
              <Input
                name="periodo_evaluacionId"
                value={formData.periodo_evaluacionId}
                onChange={handleChange}
                placeholder="Ej. 1, 2, 3..."
              />
            </div>

            <div>
              <Label>Calificación</Label>
              <Input
                type="number"
                name="calificacion"
                value={formData.calificacion}
                onChange={handleChange}
                placeholder="Ej. 9.5"
              />
            </div>

            <div>
              <Label>Faltas</Label>
              <Input
                type="number"
                name="faltas"
                value={formData.faltas}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label>Observaciones</Label>
              <Input
                name="observaciones"
                value={formData.observaciones}
                onChange={handleChange}
                placeholder="Comentarios opcionales"
              />
            </div>

            <Button type="submit" className="bg-blue-600 text-white">
              Registrar Calificación
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Promedio final */}
      {promedio > 0 && (
        <div className="text-center mt-4">
          <p className="text-lg font-semibold">
            Promedio general: <span className="text-blue-700">{promedio.toFixed(2)}</span>
          </p>
        </div>
      )}
    </div>
  );
}
