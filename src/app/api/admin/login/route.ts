import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET!;

export async function POST(req: Request) {
  try {
    const { correo, password } = await req.json();

    if (!correo || !password) {
      return new Response(
        JSON.stringify({ error: "Correo y contraseña son requeridos" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const admin = await prisma.admin.findUnique({ where: { correo } });
    if (!admin)
      return new Response(
        JSON.stringify({ error: "Credenciales incorrectas" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );

    const passwordMatch = await bcrypt.compare(password, admin.password);
    if (!passwordMatch)
      return new Response(
        JSON.stringify({ error: "Credenciales incorrectas" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );

    // 🔹 Generar token JWT
    const token = jwt.sign({ id: admin.id, correo: admin.correo }, SECRET_KEY, {
      expiresIn: "2h",
    });

    // 🔹 Guardar token en cookie HTTPOnly
    const response = NextResponse.json({ message: "Login exitoso" });
    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      maxAge: 7200, // 2 horas
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    console.log(
      "Setting cookie token, secure:",
      process.env.NODE_ENV === "production"
    );

    return response;
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Error en el servidor" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
