// components/admin/ActionButtons.tsx
"use client"

import { useRouter } from "next/navigation"

interface Props {
  studentId: number
}

export default function ActionButtons({ studentId }: Props) {
  const router = useRouter()

  const handleEdit = () => {
    // Redirigir a la página de edición del estudiante
    router.push(`/admin-dashboard/estudiantes/${studentId}/edit`)
  }

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de eliminar este estudiante?")) return

    await fetch(`/api/students/${studentId}`, {
      method: "DELETE",
    })

    // Recargar la página después de eliminar
    router.refresh()
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={handleEdit}
        className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm hover:cursor-pointer"
      >
        Editar
      </button>
      <button
        onClick={handleDelete}
        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm hover:cursor-pointer"
      >
        Eliminar
      </button>
    </div>
  )
}
