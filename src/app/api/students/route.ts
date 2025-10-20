import { PrismaClient, Student } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

type StudentInput = {
  nombre: string;
  apellidos: string;
  matricula: string;
  correo: string;
  direccion: string;
  telefono: string;
  carrera: string;
  password: string;
  status: string;
};

export async function POST(req: Request): Promise<Response> {
  try {
    const body: StudentInput = await req.json();
    const {
      nombre,
      apellidos,
      matricula,
      correo,
      telefono,
      direccion,
      status,
      carrera,
      password,
    } = body;

    if (!nombre || !apellidos || !matricula || !correo || !password || !direccion || !telefono || !carrera) {
      return new Response(
        JSON.stringify({ error: "Todos los campos son requeridos" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newStudent: Student = await prisma.student.create({
      data: {
        nombre,
        apellidos,
        matricula,
        correo,
        telefono,
        direccion,
        carrera,
        status,
        password: hashedPassword,
        rolId: 3,
      },
    });

    return new Response(
      JSON.stringify({ message: "Estudiante creado", student: newStudent }),
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

    return new Response(
      JSON.stringify({ error: "Error al crear estudiante" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function GET() {
  try {
    const students = await prisma.student.findMany({
      include: { rol: true },
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
