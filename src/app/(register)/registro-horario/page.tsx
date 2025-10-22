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

type HorarioInput = {
  asignatura_docenteId: number;
  dia_semana: string;
  hora_inicio: string;
  hora_fin: string;
  aula: string;
};

type AsignaturaDocente = {
  id: number;
  asignatura: string;
  docente: string;
};

export default function RegistroHorario() {
  const [form, setForm] = React.useState<HorarioInput>({
    asignatura_docenteId: 0,
    dia_semana: "",
    hora_inicio: "",
    hora_fin: "",
    aula: "",
  });

  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [asignaturasDocentes, setAsignaturasDocentes] = React.useState<
    AsignaturaDocente[]
  >([]);

  // Cargar asignaturas-docentes desde el backend
  React.useEffect(() => {
    async function fetchAsignaturasDocentes() {
      try {
        const res = await fetch("/api/asignaturas-docentes");
        if (!res.ok) {
          throw new Error("Error al cargar asignaturas-docentes");
        }
        const data = await res.json();

        // Verifica que sea un array
        if (!Array.isArray(data)) {
          console.error("Data no es un array:", data);
          setAsignaturasDocentes([]); // evita errores
          return;
        }

        setAsignaturasDocentes(data);
      } catch (error) {
        console.error("Error al cargar asignaturas-docentes:", error);
        setAsignaturasDocentes([]); // evita errores
      }
    }
    fetchAsignaturasDocentes();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const value =
      e.target.type === "number" ? Number(e.target.value) : e.target.value;
    setForm({ ...form, [e.target.id]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/horarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Horario registrado correctamente");
        setForm({
          asignatura_docenteId: 0,
          dia_semana: "",
          hora_inicio: "",
          hora_fin: "",
          aula: "",
        });
      } else {
        setMessage(`❌ ${data.error}`);
      }
    } catch (error) {
      setMessage("⚠️ Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-sm text-center">
        <CardHeader>
          <CardTitle>Registrar nuevo horario</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="asignatura_docenteId">
                Asignatura - Docente:
              </Label>
              <select
                id="asignatura_docenteId"
                value={form.asignatura_docenteId}
                onChange={handleChange}
                required
                className="border rounded p-2"
              >
                <option value={0}>Selecciona una opción</option>
                {asignaturasDocentes.map((ad) => (
                  <option key={ad.id} value={ad.id}>
                    {ad.asignatura} - {ad.docente}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="dia_semana">Día de la semana:</Label>
              <select
                id="dia_semana"
                value={form.dia_semana}
                onChange={handleChange}
                required
                className="border rounded p-2"
              >
                <option value="">Selecciona un día</option>
                <option value="Lunes">Lunes</option>
                <option value="Martes">Martes</option>
                <option value="Miércoles">Miércoles</option>
                <option value="Jueves">Jueves</option>
                <option value="Viernes">Viernes</option>
                <option value="Sábado">Sábado</option>
                <option value="Domingo">Domingo</option>
              </select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="hora_inicio">Hora de inicio:</Label>
              <Input
                id="hora_inicio"
                type="time"
                value={form.hora_inicio}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="hora_fin">Hora de fin:</Label>
              <Input
                id="hora_fin"
                type="time"
                value={form.hora_fin}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="aula">Aula:</Label>
              <Input
                id="aula"
                value={form.aula}
                onChange={handleChange}
                required
              />
            </div>

            <CardFooter className="flex-col gap-2">
              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={loading}
              >
                {loading ? "Registrando..." : "Registrar horario"}
              </Button>
              <Link href={"/admin-dashboard/horarios"}>
                <Button className="hover:cursor-pointer w-full">
                  Volver al listado
                </Button>
              </Link>
              {message && (
                <p className="text-sm text-gray-600 text-center mt-2">
                  {message}
                </p>
              )}
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
