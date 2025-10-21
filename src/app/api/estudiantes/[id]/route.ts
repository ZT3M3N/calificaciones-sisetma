import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.estudiante.delete({
      where: { id: Number(params.id) },
    });
    return NextResponse.json({ message: "Estudiante eliminado" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al eliminar estudiante" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await req.json();

    const student = await prisma.estudiante.update({
      where: { id: Number(id) },
      data: {
        nombre: data.nombre,
        apellidos: data.apellidos,
        carrera: data.carreraId
          ? { connect: { id: Number(data.carreraId) } }
          : undefined,
        matricula: data.matricula,
        correo: data.correo,
        direccion: data.direccion,
        telefono: data.telefono,
        estado: data.estado,
      },
      include: {
        carrera: true,
      },
    });

    return NextResponse.json(student, { status: 200 });
  } catch (error: any) {
    console.error("❌ Error en PUT /estudiantes/[id]:", error);
    return NextResponse.json(
      { error: "No se pudo actualizar el estudiante" },
      { status: 500 }
    );
  }
}
