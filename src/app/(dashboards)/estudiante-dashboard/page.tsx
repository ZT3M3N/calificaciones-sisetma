"use client";

import { useEffect, useState } from "react";
import { Users, FileText, Timer, Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type PeriodoEvaluacion = {
  id: number;
  nombre: string;
  porcentaje: number;
};

type Calificacion = {
  id: number;
  calificacion: number;
  faltas: number;
  observaciones: string | null;
  periodo_evaluacion: PeriodoEvaluacion;
  asignatura_docente: {
    cicloEscolar: string;
    asignatura: { nombre: string };
    docente: { nombre: string; apellidos: string };
    horarios: {
      dia_semana: string;
      hora_inicio: string;
      hora_fin: string;
      aula: string;
    }[];
  };
};

type Alumno = {
  id: number;
  nombre: string;
  apellidos: string;
  matricula: string;
  correo: string;
  carrera: { nombre: true };
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
  calificaciones: Calificacion[];
};

export default function EstudianteDashboard() {
  const [alumno, setAlumno] = useState<Alumno | null>(null);
  const [tab, setTab] = useState<"horarios" | "calificaciones">("horarios");
  const [generandoPDF, setGenerandoPDF] = useState(false);

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

  const formatHora12h = (hora: string) => {
    const date = new Date(hora);
    let horas = date.getHours();
    const minutos = date.getMinutes().toString().padStart(2, "0");
    const ampm = horas >= 12 ? "PM" : "AM";
    horas = horas % 12;
    if (horas === 0) horas = 12;
    return `${horas}:${minutos} ${ampm}`;
  };

  const organizarCalificaciones = () => {
    if (!alumno) return [];

    const materias = new Map<string, {
      asignatura: string;
      docente: string;
      cicloEscolar: string;
      periodos: { nombre: string; calificacion: number; porcentaje: number }[];
    }>();

    alumno.calificaciones.forEach((calif) => {
      const key = `${calif.asignatura_docente.asignatura.nombre}-${calif.asignatura_docente.cicloEscolar}`;
      
      if (!materias.has(key)) {
        materias.set(key, {
          asignatura: calif.asignatura_docente.asignatura.nombre,
          docente: `${calif.asignatura_docente.docente.nombre} ${calif.asignatura_docente.docente.apellidos}`,
          cicloEscolar: calif.asignatura_docente.cicloEscolar,
          periodos: [],
        });
      }

      materias.get(key)!.periodos.push({
        nombre: calif.periodo_evaluacion.nombre,
        calificacion: calif.calificacion,
        porcentaje: calif.periodo_evaluacion.porcentaje,
      });
    });

    return Array.from(materias.values()).map((materia) => {
      materia.periodos.sort((a, b) => a.nombre.localeCompare(b.nombre));
      
      const promedio = materia.periodos.reduce((acc, p) => 
        acc + (p.calificacion * p.porcentaje / 100), 0
      );

      return { ...materia, promedio };
    });
  };

  const generarBoletaPDF = () => {
    if (!alumno) return;

    setGenerandoPDF(true);

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      const marginLeft = 14;
      let yPosition = 20;

      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("BOLETA DE CALIFICACIONES", pageWidth / 2, yPosition, { align: "center" });
      yPosition += 10;

      doc.setLineWidth(0.5);
      doc.line(marginLeft, yPosition, pageWidth - marginLeft, yPosition);
      yPosition += 10;

      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("DATOS DEL ESTUDIANTE", marginLeft, yPosition);
      yPosition += 7;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`Nombre: ${alumno.nombre} ${alumno.apellidos}`, marginLeft, yPosition);
      yPosition += 6;
      doc.text(`Matrícula: ${alumno.matricula}`, marginLeft, yPosition);
      yPosition += 6;
      doc.text(`Carrera: ${alumno.carrera.nombre}`, marginLeft, yPosition);
      yPosition += 10;

      const materiasOrganizadas = organizarCalificaciones();

      if (materiasOrganizadas.length === 0) {
        doc.text("No hay calificaciones registradas.", marginLeft, yPosition);
      } else {
        materiasOrganizadas.forEach((materia, index) => {
          if (yPosition > 250) {
            doc.addPage();
            yPosition = 20;
          }

          doc.setFontSize(11);
          doc.setFont("helvetica", "bold");
          doc.text(`${index + 1}. ${materia.asignatura}`, marginLeft, yPosition);
          yPosition += 6;

          doc.setFontSize(9);
          doc.setFont("helvetica", "normal");
          doc.text(`Docente: ${materia.docente}`, marginLeft + 5, yPosition);
          yPosition += 5;
          doc.text(`Ciclo Escolar: ${materia.cicloEscolar}`, marginLeft + 5, yPosition);
          yPosition += 7;

          const tablaPeriodos = materia.periodos.map((p) => [
            p.nombre,
            p.calificacion.toFixed(2),
            `${p.porcentaje}%`,
          ]);

          tablaPeriodos.push([
            "PROMEDIO FINAL",
            materia.promedio.toFixed(2),
            "100%",
          ]);

          autoTable(doc, {
            startY: yPosition,
            head: [["Periodo", "Calificación", "Porcentaje"]],
            body: tablaPeriodos,
            theme: "striped",
            headStyles: {
              fillColor: [41, 128, 185],
              textColor: 255,
              fontStyle: "bold",
              fontSize: 9,
            },
            bodyStyles: {
              fontSize: 9,
            },
            footStyles: {
              fillColor: [52, 73, 94],
              textColor: 255,
              fontStyle: "bold",
            },
            columnStyles: {
              0: { cellWidth: 80 },
              1: { cellWidth: 50, halign: "center" },
              2: { cellWidth: 50, halign: "center" },
            },
            margin: { left: marginLeft + 5 },
            didDrawPage: (data) => {
              yPosition = data.cursor?.y || yPosition;
            },
          });

          yPosition = (doc as any).lastAutoTable.finalY + 10;
        });
      }

      const totalPages = (doc as any).internal.getNumberOfPages();
      
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        const pageHeight = doc.internal.pageSize.height;
        
        doc.setFontSize(8);
        doc.setFont("helvetica", "italic");
        doc.text(
          `Fecha de generación: ${new Date().toLocaleDateString("es-MX", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}`,
          marginLeft,
          pageHeight - 10
        );
        
        doc.text(
          `Página ${i} de ${totalPages}`,
          pageWidth - marginLeft - 20,
          pageHeight - 10
        );
      }

      doc.save(`Boleta_${alumno.matricula}_${new Date().getTime()}.pdf`);
      
    } catch (error) {
      console.error("Error generando PDF:", error);
      alert("Error al generar la boleta. Por favor, intente nuevamente.");
    } finally {
      setGenerandoPDF(false);
    }
  };

  if (!alumno) return <p className="p-6">Cargando...</p>;

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
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-2xl font-bold">
            Bienvenido, {alumno.nombre} {alumno.apellidos}
          </h1>
          <p className="mt-2">Carrera: {alumno.carrera.nombre}</p>
        </div>
        
        {/* Botón de descarga de boleta */}
        <button
          onClick={generarBoletaPDF}
          disabled={generandoPDF || alumno.calificaciones.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Download className="w-5 h-5" />
          {generandoPDF ? "Generando..." : "Descargar Boleta PDF"}
        </button>
      </div>

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
          <div className="space-y-6">
            {organizarCalificaciones().map((materia, index) => (
              <div key={index} className="border p-4 rounded-lg shadow-sm">
                <p className="font-semibold text-lg mb-2">{materia.asignatura}</p>
                <p className="text-sm text-gray-600 mb-1">
                  Docente: {materia.docente}
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  Ciclo: {materia.cicloEscolar}
                </p>
                
                <div className="overflow-x-auto">
                  <table className="w-full border">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-2 border">Periodo</th>
                        <th className="p-2 border">Calificación</th>
                        <th className="p-2 border">Porcentaje</th>
                      </tr>
                    </thead>
                    <tbody>
                      {materia.periodos.map((periodo, idx) => (
                        <tr key={idx}>
                          <td className="p-2 border">{periodo.nombre}</td>
                          <td className="p-2 border text-center">
                            {periodo.calificacion.toFixed(2)}
                          </td>
                          <td className="p-2 border text-center">
                            {periodo.porcentaje}%
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-blue-50 font-semibold">
                        <td className="p-2 border">PROMEDIO FINAL</td>
                        <td className="p-2 border text-center">
                          {materia.promedio.toFixed(2)}
                        </td>
                        <td className="p-2 border text-center">100%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
            
            {alumno.calificaciones.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                No hay calificaciones registradas todavía.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}