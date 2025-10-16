import StudentForm from "@/components/StudentForm";
import { prisma } from "@/lib/prisma";

export default async function EditStudentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const student = await prisma.student.findUnique({
    where: { id: Number(id) },
  });

  if (!student) {
    return <p className="text-center mt-10">❌ Estudiante no encontrado</p>;
  }

  return <StudentForm student={student} isEdit />;
}
