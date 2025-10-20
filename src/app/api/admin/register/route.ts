import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(req: Request): Promise<Response> {
  try {
    const body = await req.json();
    const { nombre, apellidos, correo, password } = body;

    if (!nombre || !apellidos || !correo || !password) {
      return new Response(
        JSON.stringify({ error: "Todos los campos son requeridos" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await prisma.admin.create({
      data: {
        nombre,
        apellidos,
        correo,
        password: hashedPassword,
        rolId: 1, 
      },
    });

    return new Response(
      JSON.stringify({ message: "Administrador creado", admin: newAdmin }),
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
