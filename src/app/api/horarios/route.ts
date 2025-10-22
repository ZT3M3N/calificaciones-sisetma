import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const horarios = await prisma.horario.findMany({
      include: {
        asignatura_docente: {
          include: {
            asignatura: { select: { nombre: true } },
            docente: { select: { nombre: true, apellidos: true } },
          },
        },
      },
      orderBy: { id: "asc" },
    });

    const data = horarios.map((h) => ({
      id: h.id,
      asignatura: h.asignatura_docente.asignatura.nombre,
      docente: `${h.asignatura_docente.docente.nombre} ${h.asignatura_docente.docente.apellidos}`,
      dia_semana: h.dia_semana,
      hora_inicio: h.hora_inicio,
      hora_fin: h.hora_fin,
      aula: h.aula,
      createdAt: h.createdAt,
    }));

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error al obtener horarios:", error);
    return new Response(JSON.stringify({ error: "Error al obtener horarios" }), {
      status: 500,
    });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { asignatura_docenteId, dia_semana, hora_inicio, hora_fin, aula } = body;

    if (
      !asignatura_docenteId ||
      !dia_semana ||
      !hora_inicio ||
      !hora_fin ||
      !aula
    ) {
      return new Response(JSON.stringify({ error: "Datos incompletos" }), {
        status: 400,
      });
    }

    // Convertimos las horas a DateTime compatible
    const fechaBase = new Date().toISOString().split("T")[0]; // fecha actual (solo día)
    const horaInicio = new Date(`${fechaBase}T${hora_inicio}`);
    const horaFin = new Date(`${fechaBase}T${hora_fin}`);

    const horario = await prisma.horario.create({
      data: {
        asignatura_docenteId: Number(asignatura_docenteId),
        dia_semana,
        hora_inicio: horaInicio,
        hora_fin: horaFin,
        aula,
      },
    });

    return new Response(JSON.stringify(horario), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error al registrar horario:", error);
    return new Response(JSON.stringify({ error: "Error al registrar horario" }), {
      status: 500,
    });
  }
}
