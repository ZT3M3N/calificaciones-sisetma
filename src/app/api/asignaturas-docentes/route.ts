import { prisma } from "@/lib/prisma";

// Obtener todas las asignaciones (GET)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const estudianteId = searchParams.get("estudianteId");

    const asignaturasDocentes = await prisma.asignaturaDocente.findMany({
      include: {
        asignatura: { select: { nombre: true } },
        docente: { select: { nombre: true, apellidos: true } },
      },
    });

    const data = asignaturasDocentes.map((item) => ({
      id: item.id,
      asignatura: item.asignatura.nombre,
      docente: `${item.docente.nombre} ${item.docente.apellidos}`,
      cicloEscolar: item.cicloEscolar,
    }));

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Error al obtener asignaturas-docentes:", error);
    return new Response(
      JSON.stringify({ error: "Error al obtener asignaturas-docentes" }),
      { status: 500 }
    );
  }
}

// Registrar una nueva asignación (POST)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { asignaturaId, docenteId, cicloEscolar } = body;

    if (!asignaturaId || !docenteId || !cicloEscolar) {
      return new Response(
        JSON.stringify({ error: "Faltan campos obligatorios" }),
        { status: 400 }
      );
    }

    const nuevaAsignacion = await prisma.asignaturaDocente.create({
      data: {
        asignaturaId: Number(asignaturaId),
        docenteId: Number(docenteId),
        cicloEscolar,
      },
    });

    return new Response(JSON.stringify(nuevaAsignacion), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("❌ Error al registrar asignatura-docente:", error);

    // Detecta si es un error por duplicado de combinación única
    if (error.code === "P2002") {
      return new Response(
        JSON.stringify({
          error:
            "Esta asignatura ya está asignada a este docente en el mismo ciclo escolar",
        }),
        { status: 409 }
      );
    }

    return new Response(
      JSON.stringify({ error: "Error al registrar asignatura-docente" }),
      { status: 500 }
    );
  }
}
