// src/app/api/asignaturas/[id]/docentes/route.ts
import { prisma } from "@/lib/prisma";

interface Params {
  params: { id: string };
}

export async function GET(req: Request, { params }: Params) {
  try {
    const asignaturaId = Number(params.id);
    if (isNaN(asignaturaId)) {
      return new Response(JSON.stringify({ error: "ID de asignatura inválido" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const asignaciones = await prisma.asignaturaDocente.findMany({
      where: { asignaturaId },
      include: {
        docente: { select: { id: true, nombre: true, apellidos: true } },
        asignatura: { select: { id: true, nombre: true } },
      },
    });

    return new Response(JSON.stringify(asignaciones), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Error interno del servidor" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
