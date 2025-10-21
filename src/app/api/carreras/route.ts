import { PrismaClient, Carrera } from "@prisma/client";

const prisma = new PrismaClient();

type CarreraInput = {
  nombre: string;
  clave: string;
  descripcion: string;
};

export async function POST(req: Request): Promise<Response> {
  try {
    const body: CarreraInput = await req.json();
    const { nombre, clave, descripcion } = body;

    if (!nombre || !clave || !descripcion) {
      return new Response(
        JSON.stringify({ error: "Todos los campos son requeridos" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const newCarrera: Carrera = await prisma.carrera.create({
      data: {
        nombre,
        clave,
        descripcion,
      },
    });

    return new Response(
      JSON.stringify({ message: "Carrera creada", carrera: newCarrera }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error(error);

    if (error.code === "P2002") {
      return new Response(
        JSON.stringify({ error: "La clave o el nombre ya existen" }),
        {
          status: 409,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ error: "Error al crear carrera" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function GET() {
  try {
    const carreras = await prisma.carrera.findMany({
      orderBy: { id: "asc" },
    });

    return new Response(JSON.stringify(carreras), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Error al obtener las carreras" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
