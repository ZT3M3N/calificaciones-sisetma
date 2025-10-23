import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const periodos = await prisma.periodoEvaluacion.findMany({
      orderBy: { fecha_inicio: "asc" },
    });
    return new Response(JSON.stringify(periodos), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "No se pudieron obtener los periodos" }), { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nombre, fecha_inicio, fecha_fin, ciclo_escolar, porcentaje } = body;

    const nuevoPeriodo = await prisma.periodoEvaluacion.create({
      data: {
        nombre,
        fecha_inicio: new Date(fecha_inicio),
        fecha_fin: new Date(fecha_fin),
        ciclo_escolar,
        porcentaje: Number(porcentaje),
      },
    });

    return new Response(JSON.stringify(nuevoPeriodo), { status: 201, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Error al crear periodo" }), { status: 500 });
  }
}
