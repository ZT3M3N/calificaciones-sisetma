import { prisma } from "@/lib/prisma";

interface Params {
  params: { id: string };
}


export async function PATCH(req: Request, { params }: Params) {
  try {
    const id = Number(params.id);
    if (isNaN(id)) {
      return new Response(JSON.stringify({ error: "ID inválido" }), { status: 400 });
    }

    const body = await req.json();
    const { asignatura_docenteId, dia_semana, hora_inicio, hora_fin, aula } = body;

    if (!asignatura_docenteId || !dia_semana || !hora_inicio || !hora_fin || !aula) {
      return new Response(JSON.stringify({ error: "Datos incompletos" }), { status: 400 });
    }

    const fechaBase = new Date().toISOString().split("T")[0];
    const horaInicio = new Date(`${fechaBase}T${hora_inicio}`);
    const horaFin = new Date(`${fechaBase}T${hora_fin}`);

    const updatedHorario = await prisma.horario.update({
      where: { id },
      data: {
        asignatura_docenteId: Number(asignatura_docenteId),
        dia_semana,
        hora_inicio: horaInicio,
        hora_fin: horaFin,
        aula,
      },
    });

    return new Response(JSON.stringify(updatedHorario), { status: 200 });
  } catch (error) {
    console.error("Error al actualizar horario:", error);
    return new Response(JSON.stringify({ error: "Error al actualizar horario" }), { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    const id = Number(params.id);
    if (isNaN(id)) {
      return new Response(JSON.stringify({ error: "ID inválido" }), { status: 400 });
    }

    await prisma.horario.delete({ where: { id } });

    return new Response(JSON.stringify({ message: "Horario eliminado correctamente" }), { status: 200 });
  } catch (error) {
    console.error("Error al eliminar horario:", error);
    return new Response(JSON.stringify({ error: "Error al eliminar horario" }), { status: 500 });
  }
}
