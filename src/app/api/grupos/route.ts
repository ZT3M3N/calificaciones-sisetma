import { prisma } from "@/lib/prisma";

type GrupoInput = {
  nombre: string;
  semestre: number;
  carrera: string;
  turnoId: number;
  teacherId?: number;
  capacidadMaxima?: number;
};

export async function POST(req: Request) {
  try {
    const body: GrupoInput = await req.json();
    const { nombre, semestre, carrera, turnoId, teacherId, capacidadMaxima } = body;

    if (!nombre || !semestre || !carrera || !turnoId) {
      return new Response(JSON.stringify({ error: "Todos los campos obligatorios deben llenarse" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const newGrupo = await prisma.grupo.create({
      data: {
        nombre,
        semestre,
        carrera,
        turnoId,
        teacherId,
        capacidadMaxima,
      },
    });

    return new Response(JSON.stringify(newGrupo), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Error al crear grupo" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function GET() {
  try {
    const grupos = await prisma.grupo.findMany({
      include: {
        turno: true,
        teacher: true,
      },
      orderBy: { id: "asc" },
    });

    return new Response(JSON.stringify(grupos), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Error al obtener grupos" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
