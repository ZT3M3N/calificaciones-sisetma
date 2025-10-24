import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET!;

// LOGIN DE DOCENTE
export async function POST(req: Request) {
  try {
    const { correo, contraseña } = await req.json();

    if (!correo || !contraseña) {
      return NextResponse.json(
        { error: "Correo y contraseña son requeridos" },
        { status: 400 }
      );
    }

    // Buscar docente en la base de datos
    const docente = await prisma.docente.findUnique({
      where: { correo },
      // puedes incluir información adicional si quieres, ej. asignaturas, rol
      include: {
        rol: true,
      },
    });

    if (!docente) {
      return NextResponse.json(
        { error: "Credenciales incorrectas" },
        { status: 401 }
      );
    }

    // Comparar contraseña
    const passwordMatch = await bcrypt.compare(contraseña, docente.contraseña);
    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Credenciales incorrectas" },
        { status: 401 }
      );
    }

    // Crear token JWT
    const token = jwt.sign(
      {
        id: docente.id,
        correo: docente.correo,
        rol: "docente",
      },
      SECRET_KEY,
      { expiresIn: "2h" }
    );

    // Respuesta con cookie HTTPOnly
    const response = NextResponse.json({
      message: "✅ Login exitoso",
      user: {
        id: docente.id,
        nombre: docente.nombre,
        apellidos: docente.apellidos,
        correo: docente.correo,
        rol: docente.rol.nombre,
      },
    });

    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      maxAge: 7200, // 2 horas
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error("Error en login del docente:", error);
    return NextResponse.json(
      { error: "Error en el servidor" },
      { status: 500 }
    );
  }
}
