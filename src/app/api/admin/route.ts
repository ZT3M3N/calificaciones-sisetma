import { PrismaClient, Administrador } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

type AdminInput = {
  nombre: string;
  apellidos: string;
  correo: string;
  password: string;
};

export async function POST(req: Request): Promise<Response> {
  try {
    const body: AdminInput = await req.json();
    const { nombre, apellidos, correo, password } = body;
    console.log(body)

    if (!nombre || !apellidos || !correo || !password) {
      return new Response(
        JSON.stringify({ error: "Todos los campos son requeridos" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newStudent: Administrador = await prisma.administrador.create({
      data: {
        nombre,
        apellidos,
        correo,
        contraseña: hashedPassword,
        rolId: 1,
      },
    });

    return new Response(
      JSON.stringify({ message: "Administrador creado", student: newStudent }),
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
      JSON.stringify({ error: "Error al crear administrador" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
