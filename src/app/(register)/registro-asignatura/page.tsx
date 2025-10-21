"use client";

import * as React from "react";
import Link from "next/link";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type AsignaturaInput = {
  nombre: string;
  clave: string;
  creditos: number;
  horas_semanales: number;
  semestre: number;
  descripcion: string;
  carreraId: number | null;
};

type Carrera = {
  id: number;
  nombre: string;
};

export default function AsignaturaForm() {
  const [form, setForm] = React.useState<AsignaturaInput>({
    nombre: "",
    clave: "",
    creditos: 0,
    horas_semanales: 0,
    semestre: 1,
    descripcion: "",
    carreraId: null,
  });

  const [carreras, setCarreras] = React.useState<Carrera[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState("");

  // Obtener carreras para el dropdown
  React.useEffect(() => {
    const fetchCarreras = async () => {
      try {
        const res = await fetch("/api/carreras");
        const data = await res.json();
        if (res.ok) setCarreras(data);
      } catch (error) {
        console.error("Error cargando carreras:", error);
      }
    };
    fetchCarreras();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setForm({
      ...form,
      [id]: id === "creditos" || id === "horas_semanales" || id === "semestre"
        ? Number(value)
        : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/asignaturas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Asignatura registrada con éxito");
        setForm({
          nombre: "",
          clave: "",
          creditos: 0,
          horas_semanales: 0,
          semestre: 1,
          descripcion: "",
          carreraId: null,
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
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-center">
            Registro de Asignatura
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="nombre">Nombre:</Label>
              <Input
                id="nombre"
                value={form.nombre}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="clave">Clave:</Label>
              <Input
                id="clave"
                value={form.clave}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="creditos">Créditos:</Label>
                <Input
                  id="creditos"
                  type="number"
                  value={form.creditos}
                  onChange={handleChange}
                  min={0}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="horas_semanales">Horas semanales:</Label>
                <Input
                  id="horas_semanales"
                  type="number"
                  value={form.horas_semanales}
                  onChange={handleChange}
                  min={0}
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="semestre">Semestre:</Label>
              <Input
                id="semestre"
                type="number"
                value={form.semestre}
                onChange={handleChange}
                min={1}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="descripcion">Descripción:</Label>
              <Input
                id="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                placeholder="Opcional"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="carreraId">Carrera:</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full">
                    {form.carreraId
                      ? carreras.find((c) => c.id === form.carreraId)?.nombre
                      : "Seleccionar carrera"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  {carreras.length > 0 ? (
                    carreras.map((carrera) => (
                      <DropdownMenuItem
                        key={carrera.id}
                        onClick={() =>
                          setForm({ ...form, carreraId: carrera.id })
                        }
                      >
                        {carrera.nombre}
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <DropdownMenuItem disabled>
                      No hay carreras disponibles
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <CardFooter className="flex-col gap-2">
              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={loading}
              >
                {loading ? "Registrando..." : "Registrar Asignatura"}
              </Button>
              <Link href="/admin-dashboard/asignaturas">
                <Button variant="secondary" className="hover:cursor-pointer">
                  Volver al listado
                </Button>
              </Link>
              {message && <p className="text-sm text-gray-600">{message}</p>}
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
