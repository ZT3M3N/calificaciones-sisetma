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

type HorarioInput = {
  diaSemana: string;
  horaInicio: string;
  horaFin: string;
  aula: string;
};

type AsignaturaDocenteInput = {
  docenteId: number;
  asignaturaId: number;
  cicloEscolar: string;
  horarios: HorarioInput[];
};

const DIAS_SEMANA = [
  { value: "lunes", label: "Lunes" },
  { value: "martes", label: "Martes" },
  { value: "miercoles", label: "Miércoles" },
  { value: "jueves", label: "Jueves" },
  { value: "viernes", label: "Viernes" },
  { value: "sabado", label: "Sábado" },
  { value: "domingo", label: "Domingo" },
];

export default function RegistroAsignaturaDocenteConHorarios() {
  const [form, setForm] = useState<AsignaturaDocenteInput>({
    docenteId: 0,
    asignaturaId: 0,
    cicloEscolar: "",
    horarios: [{ diaSemana: "", horaInicio: "", horaFin: "", aula: "" }],
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
    const value = e.target.id === "docenteId" || e.target.id === "asignaturaId" 
      ? Number(e.target.value) 
      : e.target.value;
    setForm({ ...form, [e.target.id]: value });
  };

  const handleHorarioChange = (
    index: number, 
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const newHorarios = [...form.horarios];
    newHorarios[index] = { 
      ...newHorarios[index], 
      [e.target.name]: e.target.value 
    };
    setForm({ ...form, horarios: newHorarios });
  };

  const agregarHorario = () => {
    setForm({
      ...form,
      horarios: [...form.horarios, { diaSemana: "", horaInicio: "", horaFin: "", aula: "" }],
    });
  };

  const removerHorario = (index: number) => {
    const newHorarios = form.horarios.filter((_, i) => i !== index);
    setForm({ ...form, horarios: newHorarios });
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
        setForm({
          docenteId: 0,
          asignaturaId: 0,
          cicloEscolar: "",
          horarios: [{ diaSemana: "", horaInicio: "", horaFin: "", aula: "" }],
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
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-center">Registrar Asignatura-Docente con Horarios</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="docenteId">Docente</Label>
                <select
                  id="docenteId"
                  value={form.docenteId}
                  onChange={handleChange}
                  required
                  className="border rounded p-2 bg-white"
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
                <Label htmlFor="asignaturaId">Asignatura</Label>
                <select
                  id="asignaturaId"
                  value={form.asignaturaId}
                  onChange={handleChange}
                  required
                  className="border rounded p-2 bg-white"
                >
                  <option value={0}>Selecciona una asignatura</option>
                  {asignaturas.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="cicloEscolar">Ciclo escolar</Label>
              <Input
                id="cicloEscolar"
                value={form.cicloEscolar}
                onChange={handleChange}
                placeholder="Ej: 2025-2026"
                required
              />
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">Horarios</h3>
                <Button type="button" onClick={agregarHorario} size="sm">
                  + Agregar horario
                </Button>
              </div>
              
              <div className="space-y-3">
                {form.horarios.map((h, idx) => (
                  <div key={idx} className="border p-4 rounded-lg bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                      <div className="grid gap-1">
                        <Label className="text-xs">Día de la semana</Label>
                        <select
                          name="diaSemana"
                          value={h.diaSemana}
                          onChange={(e) => handleHorarioChange(idx, e)}
                          required
                          className="border rounded p-2 bg-white text-sm"
                        >
                          <option value="">Selecciona día</option>
                          {DIAS_SEMANA.map((dia) => (
                            <option key={dia.value} value={dia.value}>
                              {dia.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid gap-1">
                        <Label className="text-xs">Hora inicio</Label>
                        <Input
                          type="time"
                          name="horaInicio"
                          value={h.horaInicio}
                          onChange={(e) => handleHorarioChange(idx, e)}
                          required
                          className="text-sm"
                        />
                      </div>

                      <div className="grid gap-1">
                        <Label className="text-xs">Hora fin</Label>
                        <Input
                          type="time"
                          name="horaFin"
                          value={h.horaFin}
                          onChange={(e) => handleHorarioChange(idx, e)}
                          required
                          className="text-sm"
                        />
                      </div>

                      <div className="grid gap-1">
                        <Label className="text-xs">Aula</Label>
                        <Input
                          name="aula"
                          placeholder="Ej: A-101"
                          value={h.aula}
                          onChange={(e) => handleHorarioChange(idx, e)}
                          required
                          className="text-sm"
                        />
                      </div>

                      <div className="flex items-end">
                        {form.horarios.length > 1 && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removerHorario(idx)}
                            className="w-full"
                          >
                            🗑️ Eliminar
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <CardFooter className="flex flex-col gap-2 px-0">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Registrando..." : "Registrar asignación"}
              </Button>
              {message && (
                <p className={`text-sm mt-2 ${message.includes("✅") ? "text-green-600" : "text-red-600"}`}>
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