import { prisma } from "@/lib/prisma";

// Obtener todas las calificaciones
export async function GET() {
  try {
    const calificaciones = await prisma.calificacion.findMany({
      include: {
        estudiante: { select: { nombre: true, apellidos: true } },
        asignatura_docente: {
          include: {
            asignatura: { select: { nombre: true } },
            docente: { select: { nombre: true, apellidos: true } },
          },
        },
        periodo_evaluacion: { select: { nombre: true } },
      },
    });

    const data = calificaciones.map((c) => ({
      id: c.id,
      estudiante: `${c.estudiante.nombre} ${c.estudiante.apellidos}`,
      asignatura: c.asignatura_docente.asignatura.nombre,
      docente: `${c.asignatura_docente.docente.nombre} ${c.asignatura_docente.docente.apellidos}`,
      periodo: c.periodo_evaluacion.nombre,
      calificacion: c.calificacion,
      faltas: c.faltas,
      observaciones: c.observaciones,
      fecha_registro: c.fecha_registro,
    }));

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.error("❌ Error al obtener calificaciones:", error);
    return new Response(JSON.stringify({ error: "Error al obtener calificaciones" }), { status: 500 });
  }
}

// Registrar nueva calificación
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { estudianteId, asignatura_docenteId, periodo_evaluacionId, calificacion, faltas, observaciones } = body;

    const nuevaCalificacion = await prisma.calificacion.create({
      data: {
        estudianteId: Number(estudianteId),
        asignatura_docenteId: Number(asignatura_docenteId),
        periodo_evaluacionId: Number(periodo_evaluacionId),
        calificacion: parseFloat(calificacion),
        faltas: Number(faltas),
        observaciones,
      },
    });

    return new Response(JSON.stringify(nuevaCalificacion), { status: 201 });
  } catch (error) {
    console.error("❌ Error al registrar calificación:", error);
    return new Response(JSON.stringify({ error: "Error al registrar calificación" }), { status: 500 });
  }
}
