"use client";

import Link from "next/link";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type UserInput = {
  id?: number;
  nombre: string;
  apellidos: string;
  carrera: string;
  matricula: string;
  direccion: string;
  telefono: string;
  correo: string;
  password?: string;
  status?: string;
};

export default function StudentForm({
  student,
  isEdit = false,
}: {
  student?: UserInput;
  isEdit?: boolean;
}) {
  const [form, setForm] = React.useState<UserInput>(
    student || {
      nombre: "",
      apellidos: "",
      carrera: "",
      matricula: "",
      direccion: "",
      telefono: "",
      correo: "",
      password: "",
      status: "activo",
    }
  );
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [openAlert, setOpenAlert] = React.useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(isEdit ? `/api/students/${form.id}` : "/api/students", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) setMessage("✅ Operación exitosa");
      else setMessage(`❌ ${data.error}`);
      setOpenAlert(true);
    } catch {
      setMessage("⚠️ Error de conexión con el servidor");
      setOpenAlert(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">

      <Card className="w-full max-w-xl rounded-xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            {isEdit ? "Editar datos del estudiante" : "Registro de estudiante"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <Label htmlFor="nombre">Nombre(s)</Label>
              <Input id="nombre" value={form.nombre} onChange={handleChange} required />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="apellidos">Apellidos</Label>
              <Input id="apellidos" value={form.apellidos} onChange={handleChange} required />
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="carrera">Carrera</Label>
              <Input id="carrera" value={form.carrera} onChange={handleChange} required />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="matricula">Matrícula</Label>
              <Input id="matricula" value={form.matricula} onChange={handleChange} required />
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="correo">Correo</Label>
              <Input id="correo" type="email" value={form.correo} onChange={handleChange} required />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input id="telefono" value={form.telefono} onChange={handleChange} required />
            </div>

            <div className="flex flex-col gap-1 sm:col-span-2">
              <Label htmlFor="direccion">Dirección</Label>
              <Input id="direccion" value={form.direccion} onChange={handleChange} required />
            </div>

            {!isEdit && (
              <div className="flex flex-col gap-1 sm:col-span-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            {isEdit && (
              <div className="flex flex-col gap-1 sm:col-span-2">
                <Label htmlFor="status">Estado</Label>
                <select
                  id="status"
                  value={form.status}
                  onChange={handleChange}
                  className="p-2 border rounded"
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>
            )}
          </form>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-4 mt-4">
          <Button
            type="submit"
            onClick={(e) => handleSubmit(e as any)}
            className="flex-1"
            disabled={loading}
          >
            {loading
              ? isEdit
                ? "Guardando..."
                : "Registrando..."
              : isEdit
              ? "Guardar Cambios"
              : "Registrar Estudiante"}
          </Button>

          {!isEdit && (
            <Link href="/admin-dashboard/estudiantes" className="flex-1">
              <Button variant="secondary" className="w-full" onClick={() => router.back()}>
                Regresar
              </Button>
            </Link>
          )}
        </CardFooter>
      </Card>

      {/* Alerta */}
      <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{message.startsWith("✅") ? "Éxito" : "Error"}</AlertDialogTitle>
            <AlertDialogDescription>{message}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => {
                setOpenAlert(false);
                if (message.startsWith("✅") && isEdit) {
                  router.push("/admin-dashboard/estudiantes");
                  router.refresh();
                }
              }}
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
