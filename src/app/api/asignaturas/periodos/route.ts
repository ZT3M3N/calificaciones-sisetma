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

    // Validación de datos básicos
    if (!asignaturaDocenteId || !periodos || periodos.length === 0) {
      return new Response(
        JSON.stringify({ error: "Faltan datos requeridos" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Array donde almacenaremos las asignaciones creadas
    const asignaciones = [];

    // Iterar sobre cada periodo recibido
    for (const periodo of periodos) {
      // 🔹 Verificar si ya existe el periodo en la BD
      let periodoExistente = await prisma.periodoEvaluacion.findUnique({
        where: { id: periodo.numero },
      });

      // 🔹 Si no existe, lo creamos
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

      // 🔹 Crear (o mantener si ya existe) la relación con la asignatura_docente
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
