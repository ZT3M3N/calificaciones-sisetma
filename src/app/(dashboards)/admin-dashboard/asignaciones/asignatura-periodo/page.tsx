"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";

type Asignatura = { id: number; nombre: string };
type DocenteAsignatura = {
  id: number;
  docente: { id: number; nombre: string; apellidos: string };
};

type PeriodoForm = {
  numero: number;
  fecha_inicio: string;
  fecha_fin: string;
  porcentaje: number;
  ciclo_escolar: string;
};

export default function AsignarPeriodosForm() {
  const [asignaturas, setAsignaturas] = useState<Asignatura[]>([]);
  const [docentesOpciones, setDocentesOpciones] = useState<DocenteAsignatura[]>([]);
  const [asignaturaId, setAsignaturaId] = useState(0);
  const [docenteAsignaturaId, setDocenteAsignaturaId] = useState(0);
  const [periodos, setPeriodos] = useState<PeriodoForm[]>([]);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);

  // Cargar asignaturas
  useEffect(() => {
    fetch("/api/asignaturas")
      .then((res) => res.json())
      .then((data) => setAsignaturas(Array.isArray(data) ? data : []))
      .catch(() => console.error("Error cargando asignaturas"));
  }, []);

  // Cargar docentes cuando cambie la asignatura seleccionada
  useEffect(() => {
    if (!asignaturaId) {
      setDocentesOpciones([]);
      return;
    }

    fetch(`/api/asignaturas/${asignaturaId}/docentes`)
      .then((res) => res.json())
      .then((data) => setDocentesOpciones(Array.isArray(data) ? data : []))
      .catch(() => console.error("Error cargando docentes"));
  }, [asignaturaId]);

  // Añadir un nuevo periodo
  const agregarPeriodo = () => {
    setPeriodos([
      ...periodos,
      {
        numero: periodos.length + 1,
        fecha_inicio: "",
        fecha_fin: "",
        porcentaje: 0,
        ciclo_escolar: "",
      },
    ]);
  };

  // Eliminar un periodo
  const eliminarPeriodo = (index: number) => {
    setPeriodos(periodos.filter((_, i) => i !== index));
  };

  // Manejar cambios en campos
  const handlePeriodoChange = (
    index: number,
    field: keyof PeriodoForm,
    value: string | number
  ) => {
    const nuevos = [...periodos];
    (nuevos[index][field] as string | number) = value;
    setPeriodos(nuevos);
  };

  // Enviar datos al backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensaje(null);

    try {
      const payload = {
        asignaturaDocenteId: docenteAsignaturaId,
        periodos,
      };

      const res = await fetch("/api/asignaturas/periodos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setMensaje("✅ Periodos asignados correctamente.");
        setPeriodos([]);
        setAsignaturaId(0);
        setDocenteAsignaturaId(0);
      } else {
        setMensaje(`❌ ${data.error || "Error al asignar periodos."}`);
      }
    } catch (error) {
      console.error(error);
      setMensaje("❌ Error de conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-center text-lg font-semibold">
            Asignar Periodos a una Asignatura
          </CardTitle>
          <p className="text-sm text-gray-500 text-center">
            Selecciona una asignatura, su docente y agrega los periodos de evaluación con sus fechas y porcentajes.
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Selección de Asignatura */}
            <div>
              <Label htmlFor="asignaturaId">Asignatura</Label>
              <select
                id="asignaturaId"
                value={asignaturaId}
                onChange={(e) => setAsignaturaId(Number(e.target.value))}
                className="border rounded p-2 w-full bg-white"
                required
              >
                <option value={0}>Selecciona una asignatura</option>
                {asignaturas.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.nombre}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Selecciona la materia a la que deseas asignar periodos.
              </p>
            </div>

            {/* Selección de Docente */}
            <div>
              <Label htmlFor="docenteAsignaturaId">Docente</Label>
              <select
                id="docenteAsignaturaId"
                value={docenteAsignaturaId}
                onChange={(e) => setDocenteAsignaturaId(Number(e.target.value))}
                disabled={docentesOpciones.length === 0}
                className="border rounded p-2 w-full bg-white"
                required
              >
                <option value={0}>
                  {docentesOpciones.length === 0
                    ? "Selecciona una asignatura primero"
                    : "Selecciona un docente"}
                </option>
                {docentesOpciones.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.docente.nombre} {d.docente.apellidos}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Elige el profesor que impartirá esta asignatura.
              </p>
            </div>

            {/* Lista de Periodos */}
            <div className="flex flex-col gap-4">
              <Label>Periodos de evaluación</Label>
              {periodos.map((p, index) => (
                <div
                  key={index}
                  className="border rounded p-3 grid gap-2 bg-gray-50 relative"
                >
                  <h4 className="font-semibold">Periodo {p.numero}</h4>
                  <div className="grid gap-1 sm:grid-cols-2">
                    <div>
                      <Label>Fecha de inicio</Label>
                      <Input
                        type="date"
                        value={p.fecha_inicio}
                        onChange={(e) =>
                          handlePeriodoChange(index, "fecha_inicio", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label>Fecha de fin</Label>
                      <Input
                        type="date"
                        value={p.fecha_fin}
                        onChange={(e) =>
                          handlePeriodoChange(index, "fecha_fin", e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="grid gap-1 sm:grid-cols-2">
                    <div>
                      <Label>Porcentaje</Label>
                      <Input
                        type="number"
                        placeholder="Ej: 25"
                        value={p.porcentaje}
                        onChange={(e) =>
                          handlePeriodoChange(index, "porcentaje", Number(e.target.value))
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label>Ciclo escolar</Label>
                      <Input
                        type="text"
                        placeholder="Ej: 2025-2026"
                        value={p.ciclo_escolar}
                        onChange={(e) =>
                          handlePeriodoChange(index, "ciclo_escolar", e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    className="absolute top-2 right-2"
                    onClick={() => eliminarPeriodo(index)}
                  >
                    Eliminar
                  </Button>
                </div>
              ))}

              <Button type="button" onClick={agregarPeriodo} variant="secondary">
                + Agregar periodo
              </Button>
            </div>

            {/* Mensaje y botón de envío */}
            <CardFooter className="flex flex-col gap-3">
              <Button type="submit" disabled={loading || !periodos.length}>
                {loading ? "Guardando..." : "Guardar periodos"}
              </Button>
              {mensaje && (
                <p
                  className={`text-sm text-center ${
                    mensaje.includes("✅") ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {mensaje}
                </p>
              )}
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
