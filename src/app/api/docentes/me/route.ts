import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const dynamic = "force-dynamic";

const SECRET_KEY = process.env.JWT_SECRET!;

export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie");
    const token = cookieHeader
      ?.split("; ")
      .find((c) => c.startsWith("token="))
      ?.split("=")[1];

    if (!token)
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });

    const decoded = jwt.verify(token, SECRET_KEY) as { id: number; rol: string };

    if (decoded.rol !== "docente")
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });

    const docente = await prisma.docente.findUnique({
      where: { id: decoded.id },
      include: {
        rol: true,
        asignaturasAsignadas: {
          include: {
            asignatura: { select: { nombre: true } },
            horarios: true,
            AsignacionesAlumnos: {
              include: {
                estudiante: {
                  select: { 
                    id: true,
                    nombre: true, 
                    apellidos: true, 
                    matricula: true 
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!docente)
      return NextResponse.json({ error: "Docente no encontrado" }, { status: 404 });

    return NextResponse.json(docente);
  } catch (error) {
    console.error("Error obteniendo docente logueado:", error);
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }
}