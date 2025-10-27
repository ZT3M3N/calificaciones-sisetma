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

type Asignatura = { id: number; nombre: string };
type DocenteAsignatura = {
  id: number;
  docente: { id: string; nombre: string; apellidos: string };
  asignatura: { id: string; nombre: string };
};

type PeriodoForm = {
  numero: number;
  fecha_inicio: string;
  fecha_fin: string;
  porcentaje: number;
  ciclo_escolar: string;
};

type FormPeriodos = {
  asignaturaId: number;
  docenteAsignaturaId: number;
  periodos: PeriodoForm[];
};

export default function AsignarPeriodosForm() {
  const [form, setForm] = useState<FormPeriodos>({
    asignaturaId: 0,
    docenteAsignaturaId: 0,
    periodos: [],
  });

  const [asignaturas, setAsignaturas] = useState<Asignatura[]>([]);
  const [docentesOpciones, setDocentesOpciones] = useState<DocenteAsignatura[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  // Cargar asignaturas
  useEffect(() => {
    fetch("/api/asignaturas")
      .then((res) => res.json())
      .then((data) => setAsignaturas(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error cargando asignaturas:", err));
  }, []);

  // Cargar docentes según asignatura
  useEffect(() => {
    if (form.asignaturaId === 0) {
      setDocentesOpciones([]);
      setForm((f) => ({ ...f, docenteAsignaturaId: 0 }));
      return;
    }

    fetch(`/api/asignaturas/${form.asignaturaId}/docentes`)
      .then((res) => res.json())
      .then((data) => setDocentesOpciones(Array.isArray(data) ? data : []))
      .catch(() => setDocentesOpciones([]));
  }, [form.asignaturaId]);

  // Cambios generales (asignatura/docente)
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Number(e.target.value);
    setForm({ ...form, [e.target.id]: value });
  };

  // Cambios en periodos (tipado correcto)
  const handleChangePeriodo = (
    index: number,
    field: keyof PeriodoForm,
    value: string
  ) => {
    const nuevosPeriodos = [...form.periodos];

    if (field === "numero" || field === "porcentaje") {
      nuevosPeriodos[index][field] = Number(value) as any;
    } else {
      nuevosPeriodos[index][field] = value as any;
    }

    setForm({ ...form, periodos: nuevosPeriodos });
  };

  // Agregar periodo vacío
  const agregarPeriodo = () => {
    setForm({
      ...form,
      periodos: [
        ...form.periodos,
        {
          numero: 0,
          fecha_inicio: "",
          fecha_fin: "",
          porcentaje: 0,
          ciclo_escolar: "",
        },
      ],
    });
  };

  // Eliminar periodo
  const eliminarPeriodo = (index: number) => {
    const nuevosPeriodos = form.periodos.filter((_, i) => i !== index);
    setForm({ ...form, periodos: nuevosPeriodos });
  };

  // Submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (form.periodos.length === 0) {
        setMessage("❌ Debes agregar al menos un periodo");
        setLoading(false);
        return;
      }

      const payload = {
        docenteAsignaturaId: form.docenteAsignaturaId,
        periodos: form.periodos,
      };

      const res = await fetch("/api/asignaturas/periodos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Periodos asignados correctamente");
        setForm({ asignaturaId: 0, docenteAsignaturaId: 0, periodos: [] });
        setDocentesOpciones([]);
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
          <CardTitle className="text-center">
            Asignar Periodos a Asignatura
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Asignatura */}
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

            {/* Docente */}
            <div className="grid gap-2">
              <Label htmlFor="docenteAsignaturaId">Docente</Label>
              <select
                id="docenteAsignaturaId"
                value={form.docenteAsignaturaId}
                onChange={handleChange}
                required
                disabled={docentesOpciones.length === 0}
                className="border rounded p-2 bg-white"
              >
                <option value={0}>
                  {docentesOpciones.length === 0
                    ? "Selecciona una asignatura primero"
                    : "Selecciona un docente"}
                </option>
                {docentesOpciones.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.docente.nombre} {opt.docente.apellidos}
                  </option>
                ))}
              </select>
            </div>

            {/* Periodos dinámicos */}
            <div className="flex flex-col gap-4">
              <Label>Periodos</Label>
              {form.periodos.map((p, i) => (
                <div
                  key={i}
                  className="border p-3 rounded flex flex-col gap-2 relative"
                >
                  <button
                    type="button"
                    onClick={() => eliminarPeriodo(i)}
                    className="absolute top-2 right-2 text-red-500"
                  >
                    ✕
                  </button>

                  {/* Número de periodo */}
                  <div className="flex flex-col">
                    <Label htmlFor={`numero-${i}`}>Número de periodo</Label>
                    <Input
                      id={`numero-${i}`}
                      type="number"
                      value={p.numero}
                      onChange={(e) =>
                        handleChangePeriodo(i, "numero", e.target.value)
                      }
                      placeholder="Ej: 1"
                      required
                    />
                    <p className="text-xs text-gray-500">
                      Indica el número de este periodo de evaluación.
                    </p>
                  </div>

                  {/* Fecha de inicio */}
                  <div className="flex flex-col">
                    <Label htmlFor={`fecha_inicio-${i}`}>Fecha de inicio</Label>
                    <Input
                      id={`fecha_inicio-${i}`}
                      type="date"
                      value={p.fecha_inicio}
                      onChange={(e) =>
                        handleChangePeriodo(i, "fecha_inicio", e.target.value)
                      }
                      required
                    />
                    <p className="text-xs text-gray-500">
                      Fecha en la que inicia este periodo.
                    </p>
                  </div>

                  {/* Fecha de fin */}
                  <div className="flex flex-col">
                    <Label htmlFor={`fecha_fin-${i}`}>Fecha de fin</Label>
                    <Input
                      id={`fecha_fin-${i}`}
                      type="date"
                      value={p.fecha_fin}
                      onChange={(e) =>
                        handleChangePeriodo(i, "fecha_fin", e.target.value)
                      }
                      required
                    />
                    <p className="text-xs text-gray-500">
                      Fecha en la que finaliza este periodo.
                    </p>
                  </div>

                  {/* Porcentaje */}
                  <div className="flex flex-col">
                    <Label htmlFor={`porcentaje-${i}`}>Porcentaje</Label>
                    <Input
                      id={`porcentaje-${i}`}
                      type="number"
                      value={p.porcentaje}
                      onChange={(e) =>
                        handleChangePeriodo(i, "porcentaje", e.target.value)
                      }
                      placeholder="Ej: 25"
                      required
                    />
                    <p className="text-xs text-gray-500">
                      Porcentaje que representa este periodo en la calificación
                      final.
                    </p>
                  </div>

                  {/* Ciclo escolar */}
                  <div className="flex flex-col">
                    <Label htmlFor={`ciclo_escolar-${i}`}>Ciclo escolar</Label>
                    <Input
                      id={`ciclo_escolar-${i}`}
                      type="text"
                      value={p.ciclo_escolar}
                      onChange={(e) =>
                        handleChangePeriodo(i, "ciclo_escolar", e.target.value)
                      }
                      placeholder="Ej: 2025-2026"
                      required
                    />
                    <p className="text-xs text-gray-500">
                      Indica el ciclo escolar al que pertenece este periodo.
                    </p>
                  </div>
                </div>
              ))}

              <Button type="button" onClick={agregarPeriodo}>
                Agregar periodo
              </Button>
            </div>

            <CardFooter className="flex flex-col gap-2 px-0">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Asignando..." : "Asignar periodos"}
              </Button>
              {message && (
                <p
                  className={`text-sm mt-2 ${
                    message.includes("✅") ? "text-green-600" : "text-red-600"
                  }`}
                >
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
