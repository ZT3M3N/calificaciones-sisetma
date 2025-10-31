"use client";

import { useEffect, useState } from "react";
import { Timer, Users, Calendar1, FileText } from "lucide-react";

type Alumno = {
  id: number;
  nombre: string;
  apellidos: string;
  matricula: string;
};

type AsignaturaDocente = {
  id: number;
  asignatura: { nombre: string };
  horarios: {
    dia_semana: string;
    hora_inicio: string;
    hora_fin: string;
    aula: string;
  }[];
  AsignacionesAlumnos: { id: number; estudiante: Alumno }[];
};

type Docente = {
  id: number;
  nombre: string;
  apellidos: string;
  asignaturasAsignadas: AsignaturaDocente[];
};

type Periodo = {
  id: number;
  nombre: string;
  fecha_inicio: string;
  fecha_fin: string;
  ciclo_escolar: string;
  porcentaje: number;
};

type PeriodosAsignatura = {
  [asignaturaId: number]: Periodo[];
};

type Asistencias = Record<number, Record<number, Record<string, boolean>>>;

type Calificaciones = Record<number, Record<number, Record<number, number>>>;

export default function DocenteDashboard() {
  const [docente, setDocente] = useState<Docente | null>(null);
  const [periodosAsignatura, setPeriodosAsignatura] = useState<PeriodosAsignatura>({});
  const [tab, setTab] = useState<"horarios" | "alumnos" | "asistencias" | "calificaciones">("horarios");
  const [asistencias, setAsistencias] = useState<Asistencias>({});
  const [calificaciones, setCalificaciones] = useState<Calificaciones>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchDocente() {
      try {
        const res = await fetch("/api/docentes/me", { credentials: "include" });
        const data = await res.json();
        if (res.ok) setDocente(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchDocente();
  }, []);

  useEffect(() => {
    if (!docente) return;

    async function fetchPeriodos() {
      try {
        const res = await fetch(`/api/docentes/${docente.id}/periodos`);
        const data = await res.json();
        if (!res.ok) {
          console.error("Error al obtener periodos:", data.error);
          return;
        }

        const periodosPorAsignatura: PeriodosAsignatura = {};
        data.forEach((item: any) => {
          const asignaturaId = item.asignatura_docenteId;
          if (!periodosPorAsignatura[asignaturaId]) periodosPorAsignatura[asignaturaId] = [];
          periodosPorAsignatura[asignaturaId].push({
            id: item.periodoEvaluacion.id,
            nombre: item.periodoEvaluacion.nombre,
            fecha_inicio: item.periodoEvaluacion.fecha_inicio,
            fecha_fin: item.periodoEvaluacion.fecha_fin,
            ciclo_escolar: item.periodoEvaluacion.ciclo_escolar,
            porcentaje: item.periodoEvaluacion.porcentaje,
          });
        });

        Object.keys(periodosPorAsignatura).forEach((key) => {
          periodosPorAsignatura[Number(key)].sort((a, b) => a.id - b.id);
        });

        setPeriodosAsignatura(periodosPorAsignatura);
      } catch (error) {
        console.error(error);
      }
    }

    fetchPeriodos();
  }, [docente]);

  useEffect(() => {
    if (tab !== "asistencias" || !docente) return;

    async function fetchAsistencias() {
      try {
        const res = await fetch(`/api/docentes/${docente.id}/asistencias`);
        const data: Asistencias = await res.json();
        if (!res.ok) {
          console.error("Error al obtener asistencias:", (data as any).error);
          return;
        }
        setAsistencias(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchAsistencias();
  }, [tab, docente]);

  useEffect(() => {
    if (tab !== "calificaciones" || !docente) return;

    async function fetchCalificaciones() {
      try {
        const res = await fetch(`/api/docentes/${docente.id}/calificaciones`);
        const data = await res.json();
        if (!res.ok) {
          console.error("Error al obtener calificaciones:", data.error);
          return;
        }
        setCalificaciones(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchCalificaciones();
  }, [tab, docente]);

  if (!docente) return <p className="p-6">Cargando...</p>;

  const handleAsistenciaChange = (alumnoId: number, asignaturaId: number, fecha: string, valor: boolean) => {
    setAsistencias((prev) => ({
      ...prev,
      [asignaturaId]: {
        ...(prev[asignaturaId] || {}),
        [alumnoId]: {
          ...(prev[asignaturaId]?.[alumnoId] || {}),
          [fecha]: valor,
        },
      },
    }));
  };

  const guardarAsistencias = async (asignaturaId: number) => {
    try {
      setLoading(true);
      const asistenciasAsignatura = asistencias[asignaturaId] || {};
      const dataAsignatura = { [asignaturaId]: asistenciasAsignatura };

      const res = await fetch(`/api/docentes/${docente.id}/asistencias`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: dataAsignatura }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error desconocido");
      alert(`✅ ${data.message || "Asistencias guardadas correctamente"}`);
    } catch (err: any) {
      console.error(err);
      alert("❌ Error guardando asistencias: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCalificacionChange = (alumnoId: number, asignaturaId: number, periodoId: number, valor: number) => {
    setCalificaciones((prev) => ({
      ...prev,
      [asignaturaId]: {
        ...(prev[asignaturaId] || {}),
        [periodoId]: {
          ...(prev[asignaturaId]?.[periodoId] || {}),
          [alumnoId]: valor,
        },
      },
    }));
  };

  const guardarCalificaciones = async (asignaturaId: number, periodoId: number) => {
    try {
      setLoading(true);
      const dataAsignatura = calificaciones[asignaturaId]?.[periodoId] || {};
      const res = await fetch(`/api/docentes/${docente.id}/calificaciones`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ periodoId, data: { [asignaturaId]: dataAsignatura } }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error desconocido");
      alert(`✅ ${data.message || "Calificaciones guardadas correctamente"}`);
    } catch (err: any) {
      console.error(err);
      alert("❌ Error guardando calificaciones: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const calcularPromedio = (alumnoId: number, asignaturaId: number): string => {
    const periodos = periodosAsignatura[asignaturaId] || [];
    if (periodos.length === 0) return "-";
    let sumaCalificaciones = 0;
    let sumaPorcentajes = 0;
    periodos.forEach((periodo) => {
      const calif = calificaciones[asignaturaId]?.[periodo.id]?.[alumnoId];
      if (calif != null && !isNaN(calif)) {
        sumaCalificaciones += calif * (periodo.porcentaje / 100);
        sumaPorcentajes += periodo.porcentaje;
      }
    });
    if (sumaPorcentajes === 0) return "-";
    return ((sumaCalificaciones / sumaPorcentajes) * 100).toFixed(2);
  };

  const cards = [
    { title: "Horarios", key: "horarios", icon: Timer, color: "bg-teal-500" },
    { title: "Alumnos", key: "alumnos", icon: Users, color: "bg-blue-500" },
    { title: "Asistencias", key: "asistencias", icon: Calendar1, color: "bg-yellow-500" },
    { title: "Calificaciones", key: "calificaciones", icon: FileText, color: "bg-green-500" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Bienvenido, {docente.nombre} {docente.apellidos}
      </h1>

      <div className="flex gap-4 mb-6">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.key}
              onClick={() => setTab(c.key as any)}
              className={`cursor-pointer flex items-center gap-2 p-4 rounded-lg shadow-md transition-colors duration-200 ${
                tab === c.key ? c.color + " text-white" : "bg-white text-gray-800"
              }`}
            >
              <Icon className="w-6 h-6" /> <span>{c.title}</span>
            </div>
          );
        })}
      </div>

      {/* Contenido */}
      {tab === "horarios" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {docente.asignaturasAsignadas.map((a) =>
            a.horarios.map((h, idx) => (
              <div key={`${a.id}-${idx}`} className="border p-4 rounded-lg shadow-sm">
                <p className="font-semibold">{a.asignatura.nombre}</p>
                <p>
                  {h.dia_semana}: {new Date(h.hora_inicio).toLocaleTimeString()} -{" "}
                  {new Date(h.hora_fin).toLocaleTimeString()} | Aula: {h.aula}
                </p>
              </div>
            ))
          )}
        </div>
      )}

      {tab === "alumnos" && (
        <div className="space-y-4">
          {docente.asignaturasAsignadas.map((a) => (
            <div key={a.id} className="border p-4 rounded-lg shadow-sm">
              <p className="font-semibold mb-2">{a.asignatura.nombre}</p>
              <ul>
                {a.AsignacionesAlumnos.map((al) => (
                  <li key={al.id}>
                    {al.estudiante.nombre} {al.estudiante.apellidos} ({al.estudiante.matricula})
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {tab === "asistencias" && (
        <div className="space-y-6">
          {docente.asignaturasAsignadas.map((asig) => {
            const fechas = asig.horarios.length ? Array.from({ length: 7 }, (_, i) => {
              const d = new Date();
              d.setDate(d.getDate() + i);
              return d.toISOString().split("T")[0];
            }) : [];
            return (
              <div key={asig.id} className="border p-4 rounded-lg shadow-sm">
                <p className="font-bold mb-2">{asig.asignatura.nombre}</p>
                <div className="overflow-x-auto">
                  <table className="w-full border">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-2 border">Alumno</th>
                        {fechas.map((f) => (
                          <th key={f} className="p-2 border text-xs">{f}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {asig.AsignacionesAlumnos.map((a) => (
                        <tr key={a.id}>
                          <td className="p-2 border whitespace-nowrap">{a.estudiante.nombre} {a.estudiante.apellidos}</td>
                          {fechas.map((f) => (
                            <td key={f} className="p-2 border text-center">
                              <input
                                type="checkbox"
                                checked={!!asistencias[asig.id]?.[a.estudiante.id]?.[f]}
                                onChange={(e) => handleAsistenciaChange(a.estudiante.id, asig.id, f, e.target.checked)}
                                className="w-4 h-4 cursor-pointer"
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button
                  disabled={loading}
                  className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                  onClick={() => guardarAsistencias(asig.id)}
                >
                  {loading ? "Guardando..." : "Guardar asistencias"}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {tab === "calificaciones" && (
        <div className="space-y-6">
          {docente.asignaturasAsignadas.map((asig) => {
            const periodos = periodosAsignatura[asig.id] || [];
            if (!periodos.length) return (
              <div key={asig.id} className="border p-4 rounded-lg shadow-sm">
                <p className="font-bold mb-2">{asig.asignatura.nombre}</p>
                <p className="text-yellow-600">No hay periodos asignados a esta materia.</p>
              </div>
            );
            return (
              <div key={asig.id} className="border p-4 rounded-lg shadow-sm">
                <p className="font-bold mb-4">{asig.asignatura.nombre}</p>
                <div className="overflow-x-auto">
                  <table className="w-full border">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-2 border sticky left-0 bg-gray-100 z-10">Alumno</th>
                        {periodos.map((periodo) => (
                          <th key={periodo.id} className="p-2 border text-center min-w-[120px]">
                            <div>{periodo.nombre}</div>
                            <div className="text-xs text-gray-600">({periodo.porcentaje}%)</div>
                          </th>
                        ))}
                        <th className="p-2 border text-center bg-blue-50">Promedio</th>
                      </tr>
                    </thead>
                    <tbody>
                      {asig.AsignacionesAlumnos.map((a) => (
                        <tr key={a.id}>
                          <td className="p-2 border whitespace-nowrap sticky left-0 bg-white">{a.estudiante.nombre} {a.estudiante.apellidos}</td>
                          {periodos.map((periodo) => (
                            <td key={periodo.id} className="p-2 border text-center">
                              <input
                                type="number"
                                min={0}
                                max={100}
                                step={0.01}
                                className="border px-2 py-1 w-20 text-center"
                                value={calificaciones[asig.id]?.[periodo.id]?.[a.estudiante.id] ?? ""}
                                onChange={(e) => handleCalificacionChange(a.estudiante.id, asig.id, periodo.id, Number(e.target.value))}
                              />
                            </td>
                          ))}
                          <td className="p-2 border text-center font-semibold bg-blue-50">{calcularPromedio(a.estudiante.id, asig.id)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {periodos.map((periodo) => (
                    <button
                      key={periodo.id}
                      disabled={loading}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                      onClick={() => guardarCalificaciones(asig.id, periodo.id)}
                    >
                      {loading ? "Guardando..." : `Guardar ${periodo.nombre}`}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
