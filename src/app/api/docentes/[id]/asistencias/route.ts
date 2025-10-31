import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function getDocenteIdFromUrl(req: NextRequest) {
  const segments = req.nextUrl.pathname.split("/").filter(Boolean);
  const idStr = segments[2]; 
  const id = Number(idStr);
  if (isNaN(id)) throw new Error("ID de docente inválido");
  return id;
}

export async function GET(req: NextRequest) {
  try {
    const docenteId = getDocenteIdFromUrl(req);

    const asignaturas = await prisma.asignaturaDocente.findMany({
      where: { docenteId },
      include: {
        asignatura: { select: { nombre: true } },
        AsignacionesAlumnos: {
          include: {
            estudiante: { select: { id: true, nombre: true, apellidos: true, matricula: true } },
          },
        },
        asistencias: true,
      },
    });

    const result: Record<number, Record<number, Record<string, boolean>>> = {};

    asignaturas.forEach((a) => {
      const asignaturaId = a.id;
      result[asignaturaId] = {};

      a.AsignacionesAlumnos.forEach((al) => {
        const alumnoId = al.estudiante.id;
        result[asignaturaId][alumnoId] = {};

        a.asistencias
          .filter((asis) => asis.estudianteId === alumnoId)
          .forEach((asis) => {
            const fecha = asis.fecha.toISOString().split("T")[0];
            result[asignaturaId][alumnoId][fecha] = asis.estado === "presente";
          });
      });
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error GET /asistencias:", error.message);
    return NextResponse.json(
      { error: error.message || "Error obteniendo asistencias" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const docenteId = getDocenteIdFromUrl(req);

    const body = await req.json();
    const { data } = body;

    if (!data || typeof data !== "object") {
      return NextResponse.json(
        { error: "No se recibió data válida" },
        { status: 400 }
      );
    }

    console.log("📥 Datos recibidos completos:", JSON.stringify(data, null, 2));

    let totalProcesados = 0;
    let errores = 0;

    for (const [asignaturaIdStr, alumnos] of Object.entries(data)) {
      const asignatura_docenteId = Number(asignaturaIdStr);
      if (isNaN(asignatura_docenteId)) {
        console.warn(`⚠️ ID de asignatura inválido: ${asignaturaIdStr}`);
        continue;
      }

      const asignaturaValida = await prisma.asignaturaDocente.findFirst({
        where: { id: asignatura_docenteId, docenteId },
      });
      if (!asignaturaValida) {
        console.warn(`⚠️ Asignatura ${asignatura_docenteId} no pertenece al docente ${docenteId}`);
        continue;
      }

      if (typeof alumnos !== "object" || alumnos === null) {
        console.warn(`⚠️ Datos de alumnos inválidos para asignatura ${asignatura_docenteId}`);
        continue;
      }

      for (const [alumnoIdStr, fechas] of Object.entries(alumnos)) {
        const alumnoId = Number(alumnoIdStr);
        if (isNaN(alumnoId)) {
          console.warn(`⚠️ ID de alumno inválido: "${alumnoIdStr}"`);
          continue;
        }

        if (typeof fechas !== "object" || fechas === null) {
          console.warn(`⚠️ Datos de fechas inválidos para alumno ${alumnoId}`);
          continue;
        }

        for (const [fechaStr, presente] of Object.entries(fechas)) {
          try {
            const [year, month, day] = fechaStr.split("-").map(Number);
            const fecha = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
            const estado = presente ? "presente" : "ausente";

            const existente = await prisma.asistencia.findUnique({
              where: {
                unico_asistencia: { estudianteId: alumnoId, asignatura_docenteId, fecha },
              },
            });

            if (existente) {
              await prisma.asistencia.update({
                where: { id: existente.id },
                data: { estado },
              });
            } else {
              await prisma.asistencia.create({
                data: { estudianteId: alumnoId, asignatura_docenteId, fecha, estado },
              });
            }

            totalProcesados++;
          } catch (error: any) {
            errores++;
            console.error(`❌ Error procesando asistencia alumno ${alumnoId}, fecha ${fechaStr}:`, error.message);
          }
        }
      }
    }

    console.log(`✅ Total de asistencias procesadas: ${totalProcesados}`);
    console.log(`❌ Total de errores: ${errores}`);

    return NextResponse.json({
      success: true,
      message: `${totalProcesados} asistencias procesadas correctamente`,
      errores: errores > 0 ? `${errores} errores encontrados` : undefined,
    });
  } catch (error: any) {
    console.error("❌ Error POST /asistencias:", error.message);
    return NextResponse.json(
      { error: error.message || "Error desconocido", details: error.stack },
      { status: 500 }
    );
  }
}
