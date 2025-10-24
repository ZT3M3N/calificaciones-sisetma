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
type Asistencias = Record<number, Record<number, Record<string, boolean>>>;

export default function DocenteDashboard() {
  const [docente, setDocente] = useState<Docente | null>(null);
  const [tab, setTab] = useState<
    "horarios" | "alumnos" | "asistencias" | "calificaciones"
  >("horarios");
  const [asistencias, setAsistencias] = useState<Asistencias>({});
  const [loading, setLoading] = useState(false);

  // --- Cargar datos del docente ---
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
    if (tab !== "asistencias" || !docente) return;

    const docenteId = docente.id; // Capturar el ID antes de la función async

    async function fetchAsistencias() {
      try {
        const res = await fetch(`/api/docentes/${docenteId}/asistencias`);
        const data: Asistencias = await res.json();

        if (!res.ok) {
          console.error("Error al obtener asistencias:", (data as any).error);
          return;
        }

        // data ya viene en el formato correcto
        setAsistencias(data);
      } catch (error) {
        console.error("Error al obtener asistencias:", error);
      }
    }

    fetchAsistencias();
  }, [tab, docente]);

  if (!docente) return <p className="p-6">Cargando...</p>;

  const handleAsistenciaChange = (
    alumnoId: number,
    asignaturaId: number,
    fecha: string,
    valor: boolean
  ) => {
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
      
      // Filtrar y limpiar los datos antes de enviar
      const asistenciasAsignatura = asistencias[asignaturaId] || {};
      const datosLimpios: Record<number, Record<string, boolean>> = {};
      
      // Solo incluir alumnos con ID válido (número)
      Object.entries(asistenciasAsignatura).forEach(([alumnoIdStr, fechas]) => {
        const alumnoId = Number(alumnoIdStr);
        if (!isNaN(alumnoId) && alumnoId > 0) {
          datosLimpios[alumnoId] = fechas;
        }
      });
      
      const dataAsignatura = {
        [asignaturaId]: datosLimpios
      };
      
      console.log("📤 Datos a enviar:", JSON.stringify(dataAsignatura, null, 2));
      
      const res = await fetch(`/api/docentes/${docente.id}/asistencias`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: dataAsignatura }),
      });
      
      const data = await res.json();
      console.log("📨 Respuesta del servidor:", data);
      
      if (!res.ok) throw new Error(data.error || "Error desconocido");
      
      alert(`✅ ${data.message || 'Asistencias guardadas correctamente'}`);
    } catch (err: any) {
      console.error("❌ Error completo:", err);
      alert("❌ Error guardando asistencias: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const generarFechas = (horarios: AsignaturaDocente["horarios"]) => {
    const diasSemana: Record<string, number> = {
      lunes: 1,
      martes: 2,
      miercoles: 3,
      jueves: 4,
      viernes: 5,
      sabado: 6,
      domingo: 0,
    };
    const hoy = new Date();
    const fechas: string[] = [];
    for (let i = 0; fechas.length < 7; i++) {
      const fecha = new Date(hoy);
      fecha.setDate(hoy.getDate() + i);
      if (
        horarios.some(
          (h) => diasSemana[h.dia_semana.toLowerCase()] === fecha.getDay()
        )
      ) {
        fechas.push(fecha.toISOString().split("T")[0]);
      }
    }
    return fechas;
  };

  const TablaAsistencias = ({ asig }: { asig: AsignaturaDocente }) => {
    const fechas = generarFechas(asig.horarios);
    
    console.log("🔍 Debug TablaAsistencias:", {
      asignaturaId: asig.id,
      nombreAsignatura: asig.asignatura.nombre,
      totalAlumnos: asig.AsignacionesAlumnos?.length || 0,
      fechasGeneradas: fechas,
    });
    
    // Validar que hay alumnos
    if (!asig.AsignacionesAlumnos || asig.AsignacionesAlumnos.length === 0) {
      return (
        <div className="border p-4 rounded-lg shadow-sm">
          <p className="font-bold mb-2">{asig.asignatura.nombre}</p>
          <p className="text-gray-500">No hay alumnos asignados a esta materia.</p>
        </div>
      );
    }
    
    return (
      <div className="border p-4 rounded-lg shadow-sm">
        <p className="font-bold mb-2">{asig.asignatura.nombre}</p>
        <div className="overflow-x-auto">
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Alumno</th>
                {fechas.map((f) => (
                  <th key={f} className="p-2 border text-xs">
                    {f}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {asig.AsignacionesAlumnos.map((a) => {
                // Debug para cada alumno
                console.log("👤 Alumno:", {
                  asignacionId: a.id,
                  estudiante: a.estudiante,
                  tieneId: !!a.estudiante?.id
                });
                
                // Validar que el estudiante existe y tiene ID
                if (!a.estudiante || !a.estudiante.id) {
                  console.warn("⚠️ Estudiante sin ID en asignación:", a);
                  return null;
                }
                
                return (
                  <tr key={a.id}>
                    <td className="p-2 border whitespace-nowrap">
                      {a.estudiante.nombre} {a.estudiante.apellidos}
                    </td>
                    {fechas.map((f) => {
                      const checkboxId = `asist-${asig.id}-${a.estudiante.id}-${f}`;
                      const isChecked = !!asistencias[asig.id]?.[a.estudiante.id]?.[f];
                      
                      return (
                        <td key={f} className="p-2 border text-center">
                          <input
                            type="checkbox"
                            id={checkboxId}
                            checked={isChecked}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleAsistenciaChange(
                                a.estudiante.id,
                                asig.id,
                                f,
                                e.target.checked
                              );
                            }}
                            className="cursor-pointer w-4 h-4"
                          />
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
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
  };

  const cards = [
    { title: "Horarios", key: "horarios", icon: Timer, color: "bg-teal-500" },
    { title: "Alumnos", key: "alumnos", icon: Users, color: "bg-blue-500" },
    {
      title: "Asistencias",
      key: "asistencias",
      icon: Calendar1,
      color: "bg-yellow-500",
    },
    {
      title: "Calificaciones",
      key: "calificaciones",
      icon: FileText,
      color: "bg-green-500",
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Bienvenido, {docente.nombre} {docente.apellidos}
      </h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.key}
              onClick={() => setTab(c.key as any)}
              className={`cursor-pointer flex items-center gap-2 p-4 rounded-lg shadow-md transition-colors duration-200 ${
                tab === c.key
                  ? c.color + " text-white"
                  : "bg-white text-gray-800"
              }`}
            >
              <Icon className="w-6 h-6" /> <span>{c.title}</span>
            </div>
          );
        })}
      </div>

      <div>
        {tab === "horarios" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {docente.asignaturasAsignadas.map((a) =>
              a.horarios.map((h, idx) => (
                <div
                  key={`${a.id}-${idx}`}
                  className="border p-4 rounded-lg shadow-sm"
                >
                  <p className="font-semibold">{a.asignatura.nombre}</p>
                  <p>
                    {h.dia_semana}:{" "}
                    {new Date(h.hora_inicio).toLocaleTimeString()} -{" "}
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
                      {al.estudiante.nombre} {al.estudiante.apellidos} (
                      {al.estudiante.matricula})
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {tab === "asistencias" && (
          <div className="space-y-6">
            {docente.asignaturasAsignadas.map((asig) => (
              <TablaAsistencias key={asig.id} asig={asig} />
            ))}
          </div>
        )}

        {tab === "calificaciones" && (
          <p>Calificaciones (adaptar de forma similar a asistencias)</p>
        )}
      </div>
    </div>
  );
}