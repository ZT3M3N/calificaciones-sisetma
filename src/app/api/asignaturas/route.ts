import { prisma } from "@/lib/prisma";

type AsignaturaInput = {
  nombre: string;
  clave: string;
  creditos: number;
  horas_semanales: number;
  semestre: number;
  descripcion?: string;
  carreraId: number;
};

// ========================
// 📦 Crear una asignatura
// ========================
export async function POST(req: Request) {
  try {
    const body: AsignaturaInput = await req.json();
    const { nombre, clave, creditos, horas_semanales, semestre, descripcion, carreraId } = body;

    if (!nombre || !clave || !creditos || !horas_semanales || !semestre || !carreraId) {
      return new Response(
        JSON.stringify({ error: "Todos los campos son requeridos" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const newAsignatura = await prisma.asignatura.create({
      data: {
        nombre,
        clave,
        creditos,
        horas_semanales,
        semestre,
        descripcion,
        carrera: { connect: { id: carreraId } },
      },
      include: { carrera: true },
    });

    return new Response(JSON.stringify(newAsignatura), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error: any) {
    console.error("Error en POST /api/asignaturas:", error);

    if (error.code === "P2002") {
      return new Response(JSON.stringify({ error: "La clave ya está registrada" }), {
        status: 409,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Error al crear la asignatura" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// =========================
// 📋 Obtener todas las asignaturas
// =========================
export async function GET() {
  try {
    const asignaturas = await prisma.asignatura.findMany({
      include: { carrera: true },
      orderBy: { id: "asc" },
    });

    return new Response(JSON.stringify(asignaturas), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error en GET /api/asignaturas:", error);

    return new Response(JSON.stringify({ error: "Error al obtener las asignaturas" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// =========================
// ✏️ Editar una asignatura
// =========================
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, nombre, clave, creditos, horas_semanales, semestre, descripcion, carreraId } = body;

    if (!id) {
      return new Response(JSON.stringify({ error: "ID requerido para actualizar" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const updated = await prisma.asignatura.update({
      where: { id },
      data: {
        nombre,
        clave,
        creditos,
        horas_semanales,
        semestre,
        descripcion,
        carrera: carreraId ? { connect: { id: carreraId } } : undefined,
      },
      include: { carrera: true },
    });

    return new Response(JSON.stringify(updated), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error: any) {
    console.error("Error en PUT /api/asignaturas:", error);

    if (error.code === "P2025") {
      return new Response(JSON.stringify({ error: "Asignatura no encontrada" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Error al actualizar la asignatura" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// =========================
// 🗑️ Eliminar una asignatura
// =========================
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return new Response(JSON.stringify({ error: "ID requerido para eliminar" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    await prisma.asignatura.delete({ where: { id } });

    return new Response(JSON.stringify({ message: "Asignatura eliminada correctamente" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error: any) {
    console.error("Error en DELETE /api/asignaturas:", error);

    if (error.code === "P2025") {
      return new Response(JSON.stringify({ error: "Asignatura no encontrada" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Error al eliminar la asignatura" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
