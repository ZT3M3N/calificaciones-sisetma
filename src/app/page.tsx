import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GraduationCapIcon, UserStar, ShieldUser } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex flex-wrap justify-center items-start min-h-screen gap-12 px-12 py-36">
      {/* Estudiante */}
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-center">
            Ingresar al panel de estudiante
          </CardTitle>
        </CardHeader>
        <CardContent className="text-justify">
          <div className="flex justify-center mb-4">
            <GraduationCapIcon size={64} />
          </div>
          Accede a tus clases, calificaciones, materiales y más. Este espacio
          está diseñado para acompañarte en tu formación académica y facilitar
          tu experiencia educativa.
        </CardContent>
        <div className="flex justify-center pb-4">
          <Button asChild className="w-1/3">
            <Link href="/login-estudiante">Ingresar</Link>
          </Button>
        </div>
      </Card>

      {/* Docente */}
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-center">
            Ingresar al panel de docente
          </CardTitle>
        </CardHeader>
        <CardContent className="text-justify">
          <div className="flex justify-center mb-4">
            <UserStar size={64} />
          </div>
          Bienvenido al espacio donde puedes gestionar tus clases, consultar el
          progreso académico de tus estudiantes y acceder a herramientas
          pedagógicas.
        </CardContent>
        <div className="flex justify-center pb-4">
          <Button asChild className="w-1/3">
            <Link href="/login-docente">Ingresar</Link>
          </Button>
        </div>
      </Card>

      {/* Administrador */}
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-center">
            Ingresar al panel de administrador
          </CardTitle>
        </CardHeader>
        <CardContent className="text-justify">
          <div className="flex justify-center mb-4">
            <ShieldUser size={64} />
          </div>
          Bienvenido al centro de control institucional. Desde aquí puedes
          gestionar usuarios, supervisar el rendimiento académico y configurar
          parámetros del sistema.
        </CardContent>
        <div className="flex justify-center pb-4">
          <Button asChild className="w-1/3">
            <Link href="/login-admin">Ingresar</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
