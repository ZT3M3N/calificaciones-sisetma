import { prisma } from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { asignatura_docenteId, dia_semana, hora_inicio, hora_fin, aula } = body;

    if (!asignatura_docenteId || !dia_semana || !hora_inicio || !hora_fin || !aula) {
      return new Response(JSON.stringify({ error: "Todos los campos son requeridos" }), { status: 400 });
    }

    const horarioActualizado = await prisma.horario.update({
      where: { id: Number(params.id) },
      data: {
        asignatura_docenteId: Number(asignatura_docenteId),
        dia_semana,
        hora_inicio: new Date(hora_inicio),
        hora_fin: new Date(hora_fin),
        aula,
      },
    });

    return new Response(JSON.stringify(horarioActualizado), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error: any) {
    console.error("Error al actualizar horario:", error);
    if (error.code === "P2025") {
      return new Response(JSON.stringify({ error: "Horario no encontrado" }), { status: 404 });
    }
    return new Response(JSON.stringify({ error: "Error al actualizar horario" }), { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.horario.delete({
      where: { id: Number(params.id) },
    });

    return new Response(JSON.stringify({ message: "Horario eliminado correctamente" }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error: any) {
    console.error("Error al eliminar horario:", error);
    if (error.code === "P2025") {
      return new Response(JSON.stringify({ error: "Horario no encontrado" }), { status: 404 });
    }
    return new Response(JSON.stringify({ error: "Error al eliminar horario" }), { status: 500 });
  }
}
