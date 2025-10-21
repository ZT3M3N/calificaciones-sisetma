import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type CarreraInput = {
  nombre?: string;
  clave?: string;
  descripcion?: string;
};

// Obtener una carrera específica
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
): Promise<Response> {
  try {
    const carrera = await prisma.carrera.findUnique({
      where: { id: Number(params.id) },
    });

    if (!carrera) {
      return new Response(JSON.stringify({ error: "Carrera no encontrada" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(carrera), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Error al obtener la carrera" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// Actualizar una carrera
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
): Promise<Response> {
  try {
    const body: CarreraInput = await req.json();
    const { nombre, descripcion } = body;

    const updated = await prisma.carrera.update({
      where: { id: Number(params.id) },
      data: { nombre, descripcion },
    });

    return new Response(
      JSON.stringify({ message: "Carrera actualizada", carrera: updated }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error(error);

    if (error.code === "P2025") {
      return new Response(
        JSON.stringify({ error: "Carrera no encontrada para actualizar" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Error al actualizar carrera" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// Eliminar una carrera
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
): Promise<Response> {
  try {
    await prisma.carrera.delete({
      where: { id: Number(params.id) },
    });

    return new Response(
      JSON.stringify({ message: "Carrera eliminada correctamente" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error(error);

    if (error.code === "P2025") {
      return new Response(
        JSON.stringify({ error: "Carrera no encontrada para eliminar" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Error al eliminar carrera" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
