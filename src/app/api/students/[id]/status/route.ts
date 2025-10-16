import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await req.json()

    const updatedStudent = await prisma.student.update({
      where: { id: Number(params.id) },
      data: { status },
    })

    return NextResponse.json(updatedStudent)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Error updating status" }, { status: 500 })
  }
}
