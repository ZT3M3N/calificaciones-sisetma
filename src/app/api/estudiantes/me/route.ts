import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

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

    const decoded = jwt.verify(token, SECRET_KEY) as {
      id: number;
      rol: string;
    };

    if (decoded.rol !== "estudiante")
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });

    const alumno = await prisma.estudiante.findUnique({
      where: { id: decoded.id },
      include: {
        rol: true,
        carrera: { select: { nombre: true } },
        calificaciones: {
          include: {
            asignatura_docente: {
              include: {
                asignatura: true,
                docente: true,
                horarios: true,
              },
            },
            periodo_evaluacion: true,
          },
        },
        asignaciones: {
          // <-- usar el nombre correcto de la relación
          include: {
            asignatura_docente: {
              include: {
                asignatura: true,
                docente: true,
                horarios: true,
              },
            },
          },
        },
        asistencias: true,
      },
    });

    if (!alumno)
      return NextResponse.json(
        { error: "Alumno no encontrado" },
        { status: 404 }
      );

    return NextResponse.json(alumno);
  } catch (error) {
    console.error("Error obteniendo alumno logueado:", error);
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }
}
