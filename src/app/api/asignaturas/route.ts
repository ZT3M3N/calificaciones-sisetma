import { prisma } from "@/lib/prisma";

type AsignaturaInput = {
  nombre: string;
  clave: string;
  creditos: number;
  horasSemanales: number;
  semestre: number;
  carrera: string;
  descripcion?: string;
};

export async function POST(req: Request) {
  try {
    const body: AsignaturaInput = await req.json();
    const { nombre, clave, creditos, horasSemanales, semestre, carrera, descripcion } = body;

    if (!nombre || !clave || !creditos || !horasSemanales || !semestre || !carrera) {
      return new Response(JSON.stringify({ error: "Todos los campos son requeridos" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const newAsignatura = await prisma.asignatura.create({
      data: {
        nombre,
        clave,
        creditos,
        horasSemanales,
        semestre,
        carrera,
        descripcion,
      },
    });

    return new Response(JSON.stringify(newAsignatura), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error(error);

    if (error.code === "P2002") {
      return new Response(JSON.stringify({ error: "Clave ya existente" }), {
        status: 409,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Error al crear asignatura" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function GET() {
  try {
    const asignaturas = await prisma.asignatura.findMany({
      orderBy: { id: "asc" },
    });

    return new Response(JSON.stringify(asignaturas), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Error al obtener asignaturas" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
