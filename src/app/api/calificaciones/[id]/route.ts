import { prisma } from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    const body = await req.json();

    const updated = await prisma.calificacion.update({
      where: { id },
      data: {
        calificacion: parseFloat(body.calificacion),
        faltas: Number(body.faltas),
        observaciones: body.observaciones,
      },
    });

    return new Response(JSON.stringify(updated), { status: 200 });
  } catch (error) {
    console.error("❌ Error al actualizar calificación:", error);
    return new Response(JSON.stringify({ error: "Error al actualizar calificación" }), { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    await prisma.calificacion.delete({ where: { id } });
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("❌ Error al eliminar calificación:", error);
    return new Response(JSON.stringify({ error: "Error al eliminar calificación" }), { status: 500 });
  }
}
