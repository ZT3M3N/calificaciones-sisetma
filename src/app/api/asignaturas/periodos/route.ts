import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { docenteAsignaturaId, periodo } = body as {
      docenteAsignaturaId: number;
      periodo: number;
    };

    if (!docenteAsignaturaId || !periodo) {
      return new Response(
        JSON.stringify({ error: "Faltan datos requeridos" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // 🔹 Buscar si el periodo ya existe
    let periodoExistente = await prisma.periodoEvaluacion.findUnique({
      where: { id: periodo },
    });

    // 🔹 Si no existe, crearlo automáticamente
    if (!periodoExistente) {
      periodoExistente = await prisma.periodoEvaluacion.create({
        data: {
          id: periodo,
          nombre: `Periodo ${periodo}`,
          fecha_inicio: new Date(), // puedes ajustar la fecha
          fecha_fin: new Date(), // puedes ajustarla también
          ciclo_escolar: "2025-2026", // ejemplo de ciclo
          porcentaje: 100, // ejemplo de porcentaje total
        },
      });
    }

    // 🔹 Upsert del periodo asignado al docente/asignatura
    const asignacion = await prisma.asignaturaPeriodo.upsert({
      where: {
        unico_asignatura_periodo: {
          asignatura_docenteId: docenteAsignaturaId,
          periodo_evaluacionId: periodo,
        },
      },
      update: {},
      create: {
        asignatura_docenteId: docenteAsignaturaId,
        periodo_evaluacionId: periodo,
      },
    });

    return new Response(JSON.stringify(asignacion), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("❌ Error asignando periodo:", error);
    return new Response(
      JSON.stringify({ error: "Error interno al asignar periodo" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
