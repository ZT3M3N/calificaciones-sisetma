import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  params: { id: string };
}

// GET: Obtener calificaciones de un docente para un periodo
export async function GET(req: Request, { params }: Params) {
  try {
    const docenteId = Number(params.id);
    if (isNaN(docenteId)) {
      return NextResponse.json(
        { error: "ID de docente inválido" },
        { status: 400 }
      );
    }

    // Obtener periodo activo desde query string, opcional
    const url = new URL(req.url);
    const periodoId = url.searchParams.get("periodo")
      ? Number(url.searchParams.get("periodo"))
      : null;

    // Buscar asignaturas asignadas al docente
    const asignaturas = await prisma.asignaturaDocente.findMany({
      where: { docenteId },
      include: {
        asignatura: true,
        AsignacionesAlumnos: { include: { estudiante: true } },
        calificaciones: periodoId
          ? { where: { periodo_evaluacionId: periodoId } }
          : true,
      },
    });

    const result: Record<number, Record<number, number>> = {};

    asignaturas.forEach((asig) => {
      result[asig.id] = {};
      asig.calificaciones.forEach((c) => {
        result[asig.id][c.estudianteId] = c.calificacion;
      });
    });

    return NextResponse.json(result);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || "Error desconocido" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request, { params }: Params) {
  try {
    const docenteId = Number(params.id);
    if (isNaN(docenteId)) {
      return NextResponse.json(
        { error: "ID de docente inválido" },
        { status: 400 }
      );
    }

    const body = (await req.json()) as {
      periodoId: number;
      data: Record<number, Record<number, number>>;
    };

    const { data, periodoId } = body;

    if (!data || typeof data !== "object") {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    if (!periodoId || isNaN(periodoId)) {
      return NextResponse.json({ error: "Periodo inválido" }, { status: 400 });
    }

    // Iterar por cada asignatura y alumno
    for (const [asignaturaIdStr, alumnos] of Object.entries(data)) {
      const asignaturaId = Number(asignaturaIdStr);

      // ✅ Tipar alumnos como Record<number, number>
      const alumnosMap = alumnos as Record<number, number>;

      for (const [alumnoIdStr, calificacion] of Object.entries(alumnosMap)) {
        const alumnoId = Number(alumnoIdStr);

        if (isNaN(alumnoId) || typeof calificacion !== "number") continue;

        await prisma.calificacion.upsert({
          where: {
            unico_calificacion: {
              estudianteId: alumnoId,
              asignatura_docenteId: asignaturaId,
              periodo_evaluacionId: periodoId,
            },
          },
          update: { calificacion },
          create: {
            estudianteId: alumnoId,
            asignatura_docenteId: asignaturaId,
            periodo_evaluacionId: periodoId,
            calificacion,
          },
        });
      }
    }

    return NextResponse.json({
      message: "Calificaciones guardadas correctamente",
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || "Error desconocido" },
      { status: 500 }
    );
  }
}
