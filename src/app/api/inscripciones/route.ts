import { PrismaClient, InscripcionGrupo } from "@prisma/client";

const prisma = new PrismaClient();

type InscripcionInput = {
  studentId: number;
  grupoId: number;
  cicloEscolar: string;
  fechaInscripcion: string;
  status?: string;
};

export async function POST(req: Request): Promise<Response> {
  try {
    const body: InscripcionInput = await req.json();
    const { studentId, grupoId, cicloEscolar, fechaInscripcion, status } = body;

    if (!studentId || !grupoId || !cicloEscolar || !fechaInscripcion) {
      return new Response(
        JSON.stringify({ error: "Todos los campos son requeridos" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const newInscripcion: InscripcionGrupo = await prisma.inscripcionGrupo.create({
      data: {
        studentId,
        grupoId,
        cicloEscolar,
        fechaInscripcion: new Date(fechaInscripcion),
        status: status ?? "Activo",
      },
    });

    return new Response(
      JSON.stringify({ message: "Inscripción registrada", inscripcion: newInscripcion }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error(error);

    if (error.code === "P2002") {
      return new Response(
        JSON.stringify({ error: "El alumno ya está inscrito en este grupo para ese ciclo" }),
        { status: 409, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Error al crear inscripción" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function GET(): Promise<Response> {
  try {
    const inscripciones = await prisma.inscripcionGrupo.findMany({
      include: {
        student: true,
        grupo: {
          include: {
            turno: true,
            teacher: true,
          },
        },
      },
      orderBy: { id: "asc" },
    });

    return new Response(JSON.stringify(inscripciones), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Error al obtener inscripciones" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
