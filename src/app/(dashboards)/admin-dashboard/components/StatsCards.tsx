"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Users, BookOpen, GraduationCap, Layers } from "lucide-react";
import { fetcher } from "@/lib/fetcher";

export default function StatsCards() {
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    grupos: 0,
    asignaturas: 0,
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const [students, teachers, grupos, asignaturas] = await Promise.all([
          fetcher<any[]>("/api/students"),
          fetcher<any[]>("/api/teachers"),
          fetcher<any[]>("/api/grupos"),
          fetcher<any[]>("/api/asignaturas"),
        ]);

        setStats({
          students: students.length,
          teachers: teachers.length,
          grupos: grupos.length,
          asignaturas: asignaturas.length,
        });
      } catch (error) {
        console.error("Error cargando estadísticas:", error);
      }
    }

    loadStats();
  }, []);

  const cards = [
    { title: "Estudiantes", value: stats.students, icon: <GraduationCap /> },
    { title: "Docentes", value: stats.teachers, icon: <Users /> },
    { title: "Grupos", value: stats.grupos, icon: <Layers /> },
    { title: "Asignaturas", value: stats.asignaturas, icon: <BookOpen /> },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => (
        <Card key={idx} className="shadow-md">
          <CardHeader className="flex items-center justify-between">
            <span className="font-semibold">{card.title}</span>
            <div className="text-gray-500">{card.icon}</div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-center">{card.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
