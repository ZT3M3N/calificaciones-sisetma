"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"

interface Props {
  id: number
  status: string
}

export default function StatusSwitch({ id, status }: Props) {
  const [checked, setChecked] = useState(status === "activo")

  const handleChange = async (value: boolean) => {
    setChecked(value)
    const newStatus = value ? "activo" : "inactivo"

    await fetch(`/api/estudiantes/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    })
  }

  return (
    <Switch
      checked={checked}
      onCheckedChange={handleChange}
      className={checked ? "bg-green-500" : "bg-red-500"}
    />
  )
}
