// src/app/api/docentes/[id]/asistencias/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface Params {
  params: { id: string };
}

// --- GET: obtener asistencias de un docente ---
export async function GET(req: Request, context: Params) {
  try {
    const { params } = context;
    const docenteId = Number(params.id);
    if (isNaN(docenteId)) {
      return NextResponse.json({ error: "ID de docente inválido" }, { status: 400 });
    }

    const asignaturas = await prisma.asignaturaDocente.findMany({
      where: { docenteId },
      include: {
        asignatura: { select: { nombre: true } },
        AsignacionesAlumnos: {
          include: { 
            estudiante: { 
              select: { id: true, nombre: true, apellidos: true, matricula: true } 
            } 
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
  } catch (error) {
    console.error("Error GET /asistencias:", error);
    return NextResponse.json({ error: "Error obteniendo asistencias" }, { status: 500 });
  }
}

// --- POST: guardar o actualizar asistencias ---
export async function POST(req: Request, context: Params) {
  try {
    const { params } = context;
    const docenteId = Number(params.id);
    
    if (isNaN(docenteId)) {
      return NextResponse.json({ error: "ID de docente inválido" }, { status: 400 });
    }

    const body = await req.json();
    const { data } = body;
    
    if (!data || typeof data !== 'object') {
      return NextResponse.json({ error: "No se recibió data válida" }, { status: 400 });
    }

    console.log("📥 Datos recibidos completos:", JSON.stringify(data, null, 2));

    let totalProcesados = 0;
    let errores = 0;

    // Recorrer cada asignatura
    for (const [asignaturaIdStr, alumnos] of Object.entries(data)) {
      const asignatura_docenteId = Number(asignaturaIdStr);
      
      if (isNaN(asignatura_docenteId)) {
        console.warn(`⚠️ ID de asignatura inválido: ${asignaturaIdStr}`);
        continue;
      }

      console.log(`📚 Procesando asignatura ID: ${asignatura_docenteId}`);

      // Verificar que la asignatura pertenece al docente
      const asignaturaValida = await prisma.asignaturaDocente.findFirst({
        where: { 
          id: asignatura_docenteId,
          docenteId 
        }
      });

      if (!asignaturaValida) {
        console.warn(`⚠️ Asignatura ${asignatura_docenteId} no pertenece al docente ${docenteId}`);
        continue;
      }

      // Verificar que alumnos sea un objeto
      if (typeof alumnos !== 'object' || alumnos === null) {
        console.warn(`⚠️ Datos de alumnos inválidos para asignatura ${asignatura_docenteId}`);
        continue;
      }

      // Recorrer cada alumno
      for (const [alumnoIdStr, fechas] of Object.entries(alumnos)) {
        const alumnoId = Number(alumnoIdStr);
        
        if (isNaN(alumnoId)) {
          console.warn(`⚠️ ID de alumno inválido: "${alumnoIdStr}"`);
          continue;
        }

        console.log(`👤 Procesando alumno ID: ${alumnoId}`);

        // Verificar que fechas sea un objeto
        if (typeof fechas !== 'object' || fechas === null) {
          console.warn(`⚠️ Datos de fechas inválidos para alumno ${alumnoId}`);
          continue;
        }

        // Recorrer cada fecha
        for (const [fechaStr, presente] of Object.entries(fechas)) {
          try {
            // Normalizar la fecha: crear Date en UTC a medianoche
            const [year, month, day] = fechaStr.split('-').map(Number);
            const fecha = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
            
            const estado = presente ? "presente" : "ausente";

            console.log(`📝 Guardando: Alumno ${alumnoId}, Asignatura ${asignatura_docenteId}, Fecha ${fechaStr}, Estado: ${estado}`);

            // Primero intentar encontrar el registro existente
            const existente = await prisma.asistencia.findUnique({
              where: { 
                unico_asistencia: { 
                  estudianteId: alumnoId, 
                  asignatura_docenteId, 
                  fecha 
                } 
              }
            });

            if (existente) {
              // Si existe, actualizar
              await prisma.asistencia.update({
                where: { id: existente.id },
                data: { estado }
              });
              console.log(`✏️ Asistencia actualizada ID: ${existente.id}`);
            } else {
              // Si no existe, crear
              const nuevaAsistencia = await prisma.asistencia.create({
                data: {
                  estudianteId: alumnoId,
                  asignatura_docenteId,
                  fecha,
                  estado
                }
              });
              console.log(`✅ Asistencia creada ID: ${nuevaAsistencia.id}`);
            }

            totalProcesados++;
          } catch (error: any) {
            errores++;
            console.error(`❌ Error procesando asistencia para alumno ${alumnoId}, fecha ${fechaStr}:`, error.message);
          }
        }
      }
    }

    console.log(`✅ Total de asistencias procesadas: ${totalProcesados}`);
    console.log(`❌ Total de errores: ${errores}`);
    
    return NextResponse.json({ 
      success: true, 
      message: `${totalProcesados} asistencias procesadas correctamente`,
      errores: errores > 0 ? `${errores} errores encontrados` : undefined
    });

  } catch (error: any) {
    console.error("❌ Error POST /asistencias:", error);
    return NextResponse.json({ 
      error: error.message || "Error desconocido",
      details: error.stack 
    }, { status: 500 });
  }
}