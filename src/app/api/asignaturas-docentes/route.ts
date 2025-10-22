import { prisma } from "@/lib/prisma";

// Obtener todas las asignaciones
export async function GET() {
  try {
    const asignaturasDocentes = await prisma.asignaturaDocente.findMany({
      include: {
        asignatura: { select: { nombre: true } },
        docente: { select: { nombre: true, apellidos: true } },
      },
    });

    const data = asignaturasDocentes.map((item) => ({
      id: item.id,
      asignatura: item.asignatura.nombre,
      docente: `${item.docente.nombre} ${item.docente.apellidos}`,
      cicloEscolar: item.cicloEscolar,
    }));

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error al obtener asignaturas-docentes:", error);
    return new Response(JSON.stringify({ error: "Error al obtener asignaturas-docentes" }), {
      status: 500,
    });
  }
}

// Crear nueva asignación
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { docenteId, asignaturaId, cicloEscolar } = body;

    if (!docenteId || !asignaturaId || !cicloEscolar) {
      return new Response(JSON.stringify({ error: "Todos los campos son requeridos" }), { status: 400 });
    }

    const nuevaAsignacion = await prisma.asignaturaDocente.create({
      data: {
        docenteId: Number(docenteId),
        asignaturaId: Number(asignaturaId),
        cicloEscolar,
      },
    });

    return new Response(JSON.stringify(nuevaAsignacion), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error al crear asignación:", error);
    if (error.code === "P2002") {
      return new Response(JSON.stringify({ error: "Esta asignación ya existe para el ciclo escolar" }), { status: 409 });
    }
    return new Response(JSON.stringify({ error: "Error al crear asignación" }), { status: 500 });
  }
}

// Actualizar asignación (PUT)
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, docenteId, asignaturaId, cicloEscolar } = body;

    if (!id || !docenteId || !asignaturaId || !cicloEscolar) {
      return new Response(JSON.stringify({ error: "Todos los campos son requeridos" }), { status: 400 });
    }

    const asignacionActualizada = await prisma.asignaturaDocente.update({
      where: { id: Number(id) },
      data: {
        docenteId: Number(docenteId),
        asignaturaId: Number(asignaturaId),
        cicloEscolar,
      },
    });

    return new Response(JSON.stringify(asignacionActualizada), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error al actualizar asignación:", error);
    if (error.code === "P2025") {
      return new Response(JSON.stringify({ error: "Asignación no encontrada" }), { status: 404 });
    }
    if (error.code === "P2002") {
      return new Response(JSON.stringify({ error: "Esta combinación ya existe" }), { status: 409 });
    }
    return new Response(JSON.stringify({ error: "Error al actualizar asignación" }), { status: 500 });
  }
}

// Eliminar asignación (DELETE)
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return new Response(JSON.stringify({ error: "Se requiere el ID" }), { status: 400 });
    }

    await prisma.asignaturaDocente.delete({
      where: { id: Number(id) },
    });

    return new Response(JSON.stringify({ message: "Asignación eliminada correctamente" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error al eliminar asignación:", error);
    if (error.code === "P2025") {
      return new Response(JSON.stringify({ error: "Asignación no encontrada" }), { status: 404 });
    }
    return new Response(JSON.stringify({ error: "Error al eliminar asignación" }), { status: 500 });
  }
}
