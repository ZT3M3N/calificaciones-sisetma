import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Obtener todas las asignaciones (GET)
export async function GET() {
  try {
    const asignaturasDocentes = await prisma.asignaturaDocente.findMany({
      include: {
        asignatura: { select: { nombre: true } },
        docente: { select: { nombre: true, apellidos: true } },
      },
      orderBy: { id: "asc" },
    });

    const data = asignaturasDocentes.map((item) => ({
      id: item.id,
      asignatura: item.asignatura.nombre,
      docente: `${item.docente.nombre} ${item.docente.apellidos}`,
      cicloEscolar: item.cicloEscolar,
    }));

    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ Error al obtener asignaturas-docentes:", error);
    return NextResponse.json(
      { error: "Error al obtener asignaturas-docentes" },
      { status: 500 }
    );
  }
}

// Crear nueva asignación con horarios (POST)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { docenteId, asignaturaId, cicloEscolar, horarios } = body;

    console.log("📥 Datos recibidos:", body);

    // Validaciones
    if (!docenteId || !asignaturaId || !cicloEscolar) {
      return NextResponse.json(
        { error: "Faltan datos obligatorios: docenteId, asignaturaId o cicloEscolar" },
        { status: 400 }
      );
    }

    if (!horarios || !Array.isArray(horarios) || horarios.length === 0) {
      return NextResponse.json(
        { error: "Debe proporcionar al menos un horario" },
        { status: 400 }
      );
    }

    // Validar que el docente existe
    const docente = await prisma.docente.findUnique({
      where: { id: Number(docenteId) },
    });

    if (!docente) {
      return NextResponse.json(
        { error: "El docente no existe" },
        { status: 404 }
      );
    }

    // Validar que la asignatura existe
    const asignatura = await prisma.asignatura.findUnique({
      where: { id: Number(asignaturaId) },
    });

    if (!asignatura) {
      return NextResponse.json(
        { error: "La asignatura no existe" },
        { status: 404 }
      );
    }

    // Verificar si ya existe la asignación
    const existente = await prisma.asignaturaDocente.findFirst({
      where: {
        asignaturaId: Number(asignaturaId),
        docenteId: Number(docenteId),
        cicloEscolar: cicloEscolar,
      },
    });

    if (existente) {
      return NextResponse.json(
        { error: "Esta asignación ya existe para este ciclo escolar" },
        { status: 409 }
      );
    }

    // Crear la asignación con los horarios en una transacción
    const nuevaAsignacion = await prisma.asignaturaDocente.create({
      data: {
        asignaturaId: Number(asignaturaId),
        docenteId: Number(docenteId),
        cicloEscolar,
        horarios: {
          create: horarios.map((h: any) => ({
            dia_semana: h.diaSemana,
            hora_inicio: new Date(`1970-01-01T${h.horaInicio}:00Z`),
            hora_fin: new Date(`1970-01-01T${h.horaFin}:00Z`),
            aula: h.aula,
          })),
        },
      },
      include: {
        asignatura: { select: { nombre: true } },
        docente: { select: { nombre: true, apellidos: true } },
        horarios: true,
      },
    });

    console.log("✅ Asignación creada:", nuevaAsignacion);

    return NextResponse.json({
      success: true,
      message: "Asignación y horarios registrados correctamente",
      data: nuevaAsignacion,
    });
  } catch (error: any) {
    console.error("❌ Error al crear asignación:", error);
    
    // Manejar error de constraint único de Prisma
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Ya existe una asignación igual para este docente y asignatura" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Error al crear asignación" },
      { status: 500 }
    );
  }
}