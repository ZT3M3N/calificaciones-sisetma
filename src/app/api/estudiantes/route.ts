import { PrismaClient, Estudiante } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

type EstudianteInput = {
  nombre: string;
  apellidos: string;
  matricula: string;
  correo: string;
  direccion: string;
  telefono: string;
  estado?: string;
  contraseña?: string;
  carreraId: number; // importante
};

export async function POST(req: Request): Promise<Response> {
  try {
    const body: EstudianteInput = await req.json();
    const { nombre, apellidos, matricula, correo, telefono, direccion, estado = "activo", contraseña, carreraId } = body;

    if (!nombre || !apellidos || !matricula || !correo || !direccion || !telefono || !carreraId || !contraseña) {
      return new Response(
        JSON.stringify({ error: "Todos los campos son requeridos" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const hashedPassword = await bcrypt.hash(contraseña, 10);

    const newStudent: Estudiante = await prisma.estudiante.create({
      data: {
        nombre,
        apellidos,
        matricula,
        correo,
        telefono,
        direccion,
        estado,
        contraseña: hashedPassword,
        rol: { connect: { id: 3 } },       // rol estudiante
        carrera: { connect: { id: carreraId } } // conectamos la carrera
      },
    });

    return new Response(
      JSON.stringify({ message: "Estudiante creado", student: newStudent }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error(error);

    if (error.code === "P2002") {
      return new Response(
        JSON.stringify({ error: "Correo, matrícula o teléfono ya registrado" }),
        { status: 409, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Error al crear estudiante" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }): Promise<Response> {
  try {
    const id = parseInt(params.id);
    const body: Partial<EstudianteInput> = await req.json();

    const updateData: any = { ...body };

    if (body.contraseña) {
      updateData.contraseña = await bcrypt.hash(body.contraseña, 10);
    }

    // Conexión de la carrera si se recibe carreraId
    if (body.carreraId) {
      updateData.carrera = { connect: { id: body.carreraId } };
    }

    const updatedStudent = await prisma.estudiante.update({
      where: { id },
      data: updateData,
    });

    return new Response(
      JSON.stringify({ message: "Estudiante actualizado", student: updatedStudent }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Error al actualizar estudiante" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function GET() {
  try {
    const students = await prisma.estudiante.findMany({
      include: { rol: true, carrera: true },
      orderBy: { id: "asc" },
    });

    return new Response(JSON.stringify(students), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Error al obtener estudiantes" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }): Promise<Response> {
  try {
    const id = parseInt(params.id);

    await prisma.estudiante.delete({ where: { id } });

    return new Response(
      JSON.stringify({ message: "Estudiante eliminado" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Error al eliminar estudiante" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
