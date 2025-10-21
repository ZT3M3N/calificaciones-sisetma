import { PrismaClient, Docente } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

type TeacherInput = {
  nombre: string;
  apellidos: string;
  correo: string;
  telefono: string;
  password: string;
};

export async function POST(req: Request): Promise<Response> {
  try {
    const body: TeacherInput = await req.json();
    const { nombre, apellidos, correo, telefono, password } = body;

    if (!nombre || !apellidos || !correo || !password) {
      return new Response(
        JSON.stringify({ error: "Todos los campos son requeridos" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newTeacher: Docente = await prisma.docente.create({
      data: {
        nombre,
        apellidos,
        correo,
        telefono,
        contraseña: hashedPassword,
        rolId: 2,
      },
    });

    return new Response(
      JSON.stringify({ message: "Docente creado", teacher: newTeacher }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error(error);

    if (error.code === "P2002") {
      return new Response(JSON.stringify({ error: "Correo ya registrado" }), {
        status: 409,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Error al crear docente" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function GET() {
  try {
    const teachers = await prisma.docente.findMany({
      include: { rol: true },
      orderBy: { id: "asc" },
    });

    return new Response(JSON.stringify(teachers), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Error al obtener docentes" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
