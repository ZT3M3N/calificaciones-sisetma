"use client";

import { useEffect, useState } from "react";
import { Users, FileText, Timer } from "lucide-react";

type Alumno = {
  id: number;
  nombre: string;
  apellidos: string;
  matricula: string;
  correo: string;
  carrera: { nombre: string };
  asignaciones: {
    id: number;
    asignatura_docente: {
      asignatura: { nombre: string };
      docente: { nombre: string; apellidos: string };
      horarios: {
        dia_semana: string;
        hora_inicio: string;
        hora_fin: string;
        aula: string;
      }[];
    };
  }[];
  calificaciones: {
    id: number;
    calificacion: number;
    faltas: number;
    observaciones: string | null;
    asignatura_docente: {
      asignatura: { nombre: string };
      docente: { nombre: string; apellidos: string };
      horarios: {
        dia_semana: string;
        hora_inicio: string;
        hora_fin: string;
        aula: string;
      }[];
    };
  }[];
};

export default function EstudianteDashboard() {
  const [alumno, setAlumno] = useState<Alumno | null>(null);
  const [tab, setTab] = useState<"horarios" | "calificaciones">("horarios");

  useEffect(() => {
    async function fetchAlumno() {
      const res = await fetch("/api/estudiantes/me", {
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) setAlumno(data);
      else console.error(data.error);
    }
    fetchAlumno();
  }, []);

  if (!alumno) return <p className="p-6">Cargando...</p>;

  // Función para formatear horas en formato 12h AM/PM
  const formatHora12h = (hora: string) => {
    const date = new Date(hora);
    let horas = date.getHours();
    const minutos = date.getMinutes().toString().padStart(2, "0");
    const ampm = horas >= 12 ? "PM" : "AM";
    horas = horas % 12;
    if (horas === 0) horas = 12;
    return `${horas}:${minutos} ${ampm}`;
  };

  const cards = [
    {
      title: "Horarios",
      icon: Timer,
      color: "bg-teal-500",
      key: "horarios",
      count: alumno.asignaciones.reduce(
        (acc, a) => acc + a.asignatura_docente.horarios.length,
        0
      ),
    },
    {
      title: "Calificaciones",
      icon: FileText,
      color: "bg-blue-500",
      key: "calificaciones",
      count: alumno.calificaciones.length,
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Bienvenido, {alumno.nombre} {alumno.apellidos}
      </h1>
      <p className="mb-6">Carrera: {alumno.carrera.nombre}</p>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.key}
              onClick={() => setTab(card.key as any)}
              className={`cursor-pointer flex items-center gap-2 p-4 rounded-lg shadow-md transition-colors duration-200 ${
                tab === card.key
                  ? card.color + " text-white"
                  : "bg-white text-gray-800"
              }`}
            >
              <Icon className="w-6 h-6" />
              <span>{card.title}</span>
            </div>
          );
        })}
      </div>

      {/* Tab content */}
      <div>
        {tab === "horarios" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {alumno.asignaciones.map((a) =>
              a.asignatura_docente.horarios.map((h, idx) => (
                <div
                  key={`${a.id}-${idx}`}
                  className="border p-4 rounded-lg shadow-sm"
                >
                  <p className="font-semibold">
                    {a.asignatura_docente.asignatura.nombre}
                  </p>
                  <p>
                    Docente: {a.asignatura_docente.docente.nombre}{" "}
                    {a.asignatura_docente.docente.apellidos}
                  </p>
                  <p>
                    {h.dia_semana}: {formatHora12h(h.hora_inicio)} -{" "}
                    {formatHora12h(h.hora_fin)} | Aula: {h.aula}
                  </p>
                </div>
              ))
            )}
          </div>
        )}

        {tab === "calificaciones" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {alumno.calificaciones.map((c) => (
              <div key={c.id} className="border p-4 rounded-lg shadow-sm">
                <p className="font-semibold">
                  {c.asignatura_docente.asignatura.nombre}
                </p>
                <p>
                  Docente: {c.asignatura_docente.docente.nombre}{" "}
                  {c.asignatura_docente.docente.apellidos}
                </p>
                <p>Calificación: {c.calificacion}</p>
                <p>Faltas: {c.faltas}</p>
                {c.observaciones && <p>Observaciones: {c.observaciones}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
