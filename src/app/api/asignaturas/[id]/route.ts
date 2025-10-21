import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);

    if (isNaN(id)) {
      return new Response(JSON.stringify({ error: "ID inválido" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const asignatura = await prisma.asignatura.findUnique({
      where: { id },
      include: { carrera: true },
    });

    if (!asignatura) {
      return new Response(JSON.stringify({ error: "Asignatura no encontrada" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(asignatura), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error en GET /api/asignaturas/:id", error);
    return new Response(JSON.stringify({ error: "Error al obtener la asignatura" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
