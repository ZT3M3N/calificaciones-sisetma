"use client";
import Link from "next/link";
import { Users } from "lucide-react";

export default function AsignacionesCards() {
  const cards = [
    {
      title: "Asignar Docentes-Asignaturas a Horarios",
      icon: Users,
      color: "bg-teal-500",
      href: "asignaciones/asignatura-horario",
    },
    {
      title: "Asignar Docentes-Asignaturas-Horarios a Alumnos",
      icon: Users,
      color: "bg-teal-500",
      href: "asignaciones/asignatura-alumno",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
          >
            <div className={`${card.color} h-2`} />
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`${card.color} bg-opacity-10 p-3 rounded-lg`}>
                  <Icon
                    className={`w-8 h-8 ${card.color.replace("bg-", "text-")}`}
                  />
                </div>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {card.title}
              </h2>
              <p className="text-3xl font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-500 mt-2">Total registrados</p>
              <Link href={card.href}>
                <button
                  className={`mt-4 w-full ${card.color} text-white font-semibold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity duration-200`}
                >
                  Entrar
                </button>
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
