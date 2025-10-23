"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function CrearPeriodo() {
  const [form, setForm] = React.useState({
    nombre: "",
    fecha_inicio: "",
    fecha_fin: "",
    ciclo_escolar: "",
    porcentaje: "",
  });
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/periodos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Error al registrar periodo");
      setMessage("✅ Periodo registrado correctamente");
      setForm({ nombre: "", fecha_inicio: "", fecha_fin: "", ciclo_escolar: "", porcentaje: "" });
      router.refresh();
    } catch (error: any) {
      setMessage(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center mt-10">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md bg-white p-6 rounded shadow">
        <Label htmlFor="nombre">Nombre del periodo</Label>
        <Input id="nombre" value={form.nombre} onChange={handleChange} required />

        <Label htmlFor="fecha_inicio">Fecha Inicio</Label>
        <Input id="fecha_inicio" type="date" value={form.fecha_inicio} onChange={handleChange} required />

        <Label htmlFor="fecha_fin">Fecha Fin</Label>
        <Input id="fecha_fin" type="date" value={form.fecha_fin} onChange={handleChange} required />

        <Label htmlFor="ciclo_escolar">Ciclo Escolar</Label>
        <Input id="ciclo_escolar" value={form.ciclo_escolar} onChange={handleChange} required />

        <Label htmlFor="porcentaje">Porcentaje</Label>
        <Input id="porcentaje" type="number" value={form.porcentaje} onChange={handleChange} required />

        <Button type="submit" disabled={loading}>{loading ? "Registrando..." : "Registrar Periodo"}</Button>
        {message && <p className="text-center mt-2">{message}</p>}
      </form>
    </div>
  );
}
