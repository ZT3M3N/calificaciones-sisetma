import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { asignaturaDocenteId, periodos } = body as {
      asignaturaDocenteId: number;
      periodos: {
        numero: number;
        fecha_inicio: string;
        fecha_fin: string;
        ciclo_escolar: string;
        porcentaje: number;
      }[];
    };

    if (!asignaturaDocenteId || !periodos || periodos.length === 0) {
      return new Response(
        JSON.stringify({ error: "Faltan datos requeridos" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const asignaciones = [];

    for (const periodo of periodos) {
      let periodoExistente = await prisma.periodoEvaluacion.findUnique({
        where: { id: periodo.numero },
      });

      if (!periodoExistente) {
        periodoExistente = await prisma.periodoEvaluacion.create({
          data: {
            id: periodo.numero,
            nombre: `Periodo ${periodo.numero}`,
            fecha_inicio: new Date(periodo.fecha_inicio),
            fecha_fin: new Date(periodo.fecha_fin),
            ciclo_escolar: periodo.ciclo_escolar,
            porcentaje: periodo.porcentaje,
          },
        });
      }

      const asignacion = await prisma.asignaturaPeriodo.upsert({
        where: {
          unico_asignatura_periodo: {
            asignatura_docenteId: asignaturaDocenteId,
            periodo_evaluacionId: periodoExistente.id,
          },
        },
        update: {},
        create: {
          asignatura_docenteId: asignaturaDocenteId,
          periodo_evaluacionId: periodoExistente.id,
        },
      });

      asignaciones.push(asignacion);
    }

    return new Response(JSON.stringify(asignaciones), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error: any) {
    console.error("❌ Error asignando periodos:", error);
    return new Response(
      JSON.stringify({ error: "Error interno al asignar periodos" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
