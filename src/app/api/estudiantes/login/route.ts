import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET!;

export async function POST(req: Request) {
  try {
    const { correo, contraseña } = await req.json();

    if (!correo || !contraseña) {
      return NextResponse.json(
        { error: "Correo y contraseña son requeridos" },
        { status: 400 }
      );
    }

    const estudiante = await prisma.estudiante.findUnique({
      where: { correo },
      include: {
        carrera: { select: { nombre: true } },
      },
    });

    if (!estudiante) {
      return NextResponse.json(
        { error: "Credenciales incorrectas" },
        { status: 401 }
      );
    }

    const passwordMatch = await bcrypt.compare(contraseña, estudiante.contraseña);
    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Credenciales incorrectas" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      {
        id: estudiante.id,
        correo: estudiante.correo,
        rol: "estudiante",
      },
      SECRET_KEY,
      { expiresIn: "2h" }
    );

    const response = NextResponse.json({
      message: "✅ Login exitoso",
      user: {
        id: estudiante.id,
        nombre: estudiante.nombre,
        apellidos: estudiante.apellidos,
        correo: estudiante.correo,
        matricula: estudiante.matricula,
        carrera: estudiante.carrera?.nombre,
      },
    });

    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      maxAge: 7200, 
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error("Error en login del estudiante:", error);
    return NextResponse.json(
      { error: "Error en el servidor" },
      { status: 500 }
    );
  }
}
