import { PrismaClient, Docente } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

type TeacherInput = {
  nombre: string;
  apellidos: string;
  correo: string;
  password?: string;
  telefono?: string;
};

// Obtener un docente por ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const teacher = await prisma.docente.findUnique({
      where: { id: Number(id) },
      include: { rol: true },
    });

    if (!teacher) {
      return new Response(JSON.stringify({ error: "Docente no encontrado" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(teacher), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Error al obtener docente" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Actualizar un docente
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body: TeacherInput = await req.json();
    const { nombre, apellidos, correo, password, telefono } = body;

    if (!nombre || !apellidos || !correo) {
      return new Response(JSON.stringify({ error: "Todos los campos son requeridos" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const updateData: any = { nombre, apellidos, correo };
    if (password) {
      updateData.contraseña = await bcrypt.hash(password, 10);
    }
    if (telefono) {
      updateData.telefono = telefono;
    }

    const updatedTeacher = await prisma.docente.update({
      where: { id: Number(id) },
      data: updateData,
    });

    return new Response(JSON.stringify({ message: "Docente actualizado", teacher: updatedTeacher }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error(error);

    if (error.code === "P2002") {
      return new Response(JSON.stringify({ error: "Correo ya registrado" }), {
        status: 409,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Error al actualizar docente" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Eliminar un docente
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    await prisma.docente.delete({
      where: { id: Number(id) },
    });

    return new Response(JSON.stringify({ message: "Docente eliminado" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Error al eliminar docente" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
