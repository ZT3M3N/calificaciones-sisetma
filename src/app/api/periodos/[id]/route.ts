import { prisma } from "@/lib/prisma";

// 🔹 Obtener un solo periodo por ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    if (isNaN(id)) {
      return new Response(JSON.stringify({ error: "ID inválido" }), { status: 400 });
    }

    const periodo = await prisma.periodoEvaluacion.findUnique({
      where: { id },
    });

    if (!periodo) {
      return new Response(JSON.stringify({ error: "Periodo no encontrado" }), { status: 404 });
    }

    return new Response(JSON.stringify(periodo), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Error al obtener periodo:", error);
    return new Response(
      JSON.stringify({ error: "Error interno al obtener el periodo" }),
      { status: 500 }
    );
  }
}

// 🔹 Actualizar periodo
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    if (isNaN(id)) {
      return new Response(JSON.stringify({ error: "ID inválido" }), { status: 400 });
    }

    const body = await req.json();
    const { nombre, fecha_inicio, fecha_fin, ciclo_escolar, porcentaje } = body;

    const actualizado = await prisma.periodoEvaluacion.update({
      where: { id },
      data: {
        nombre,
        fecha_inicio: new Date(fecha_inicio),
        fecha_fin: new Date(fecha_fin),
        ciclo_escolar,
        porcentaje: parseFloat(porcentaje),
      },
    });

    return new Response(JSON.stringify(actualizado), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Error al actualizar periodo:", error);
    return new Response(
      JSON.stringify({ error: "Error interno al actualizar el periodo" }),
      { status: 500 }
    );
  }
}

// 🔹 Eliminar periodo
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    if (isNaN(id)) {
      return new Response(JSON.stringify({ error: "ID inválido" }), { status: 400 });
    }

    await prisma.periodoEvaluacion.delete({ where: { id } });

    return new Response(
      JSON.stringify({ message: "✅ Periodo eliminado correctamente" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("❌ Error al eliminar periodo:", error);

    if (error.code === "P2025") {
      return new Response(JSON.stringify({ error: "Periodo no encontrado" }), {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({ error: "Error interno al eliminar el periodo" }),
      { status: 500 }
    );
  }
}
