import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

interface Params {
  params: { id: string };
}

export async function GET(req: Request, { params }: Params) {
  try {
    const docenteId = Number(params.id);
    if (isNaN(docenteId))
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });

    const periodos = await prisma.asignaturaPeriodo.findMany({
      where: {
        asignaturaDocente: { docenteId },
      },
      include: {
        periodoEvaluacion: true,
        asignaturaDocente: {
          include: { asignatura: true },
        },
      },
    });

    return NextResponse.json(periodos);
  } catch (error) {
    console.error("❌ Error obteniendo periodos:", error);
    return NextResponse.json(
      { error: "Error al obtener periodos" },
      { status: 500 }
    );
  }
}
