import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { estado } = await req.json()

    const updatedStudent = await prisma.estudiante.update({
      where: { id: Number(params.id) },
      data: { estado },
    })

    return NextResponse.json(updatedStudent)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Error updating status" }, { status: 500 })
  }
}
