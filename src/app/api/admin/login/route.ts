import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET!;

export async function POST(req: Request) {
  try {
    const { correo, contraseña } = await req.json();
    console.log(correo, contraseña);
    

    if (!correo || !contraseña) {
      return NextResponse.json(
        { error: "Correo y contraseña son requeridos" },
        { status: 400 }
      );
    }

    const admin = await prisma.administrador.findUnique({ where: { correo } });
    
    if (!admin) {
      return NextResponse.json(
        
        { error: "Credenciales incorrectas" },
        { status: 401 }
      );
    }

    const passwordMatch = await bcrypt.compare(contraseña, admin.contraseña);
    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Credenciales incorrectas" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { id: admin.id, correo: admin.correo, rol: "admin" },
      SECRET_KEY,
      { expiresIn: "2h" }
    );

    const response = NextResponse.json({
      message: "Login exitoso",
      user: { id: admin.id, nombre: admin.nombre, correo: admin.correo }
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
    console.error("Error en login:", error);
    return NextResponse.json(
      { error: "Error en el servidor" },
      { status: 500 }
    );
  }
}