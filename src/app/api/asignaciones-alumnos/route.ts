import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { estudianteId, asignatura_docenteId } = body;

    // Validar datos obligatorios
    if (!estudianteId || !asignatura_docenteId) {
      return new Response(
        JSON.stringify({ error: "Faltan datos obligatorios" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Evitar duplicados (un estudiante no puede tener la misma asignatura_docente dos veces)
    const existe = await prisma.asignacionesAlumnos.findFirst({
      where: {
        estudianteId: Number(estudianteId),
        asignatura_docenteId: Number(asignatura_docenteId),
      },
    });

    if (existe) {
      return new Response(
        JSON.stringify({ error: "El alumno ya está asignado a esta materia" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Crear la asignación
    const asignacion = await prisma.asignacionesAlumnos.create({
      data: {
        estudianteId: Number(estudianteId),
        asignatura_docenteId: Number(asignatura_docenteId),
      },
      include: {
        estudiante: { select: { nombre: true, apellidos: true, matricula: true } },
        asignatura_docente: {
          include: {
            asignatura: { select: { nombre: true } },
            docente: { select: { nombre: true, apellidos: true } },
          },
        },
      },
    });

    return new Response(JSON.stringify(asignacion), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error al crear la asignación:", error);
    return new Response(
      JSON.stringify({ error: "Error interno del servidor" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}


export async function GET() {
  try {
    const asignaciones = await prisma.asignacionesAlumnos.findMany({
      include: {
        estudiante: { select: { nombre: true, apellidos: true, matricula: true } },
        asignatura_docente: {
          include: {
            asignatura: { select: { nombre: true } },
            docente: { select: { nombre: true, apellidos: true } },
          },
        },
      },
      orderBy: { id: "desc" },
    });

    // Siempre devolver un array (aunque esté vacío)
    return new Response(JSON.stringify(asignaciones || []), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("❌ Error al obtener asignaciones:", error);

    // También devolver un array vacío en caso de error
    return new Response(JSON.stringify([]), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
