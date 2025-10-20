"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { fetcher } from "@/lib/fetcher";

export default function EnrollmentTable() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetcher<any[]>("/api/inscripciones").then(setData).catch(console.error);
  }, []);

  return (
    <Card className="shadow-md">
      <CardHeader>
        <h2 className="text-lg font-semibold">Inscripciones Registradas</h2>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Alumno</th>
                <th className="p-2 border">Grupo</th>
                <th className="p-2 border">Ciclo</th>
                <th className="p-2 border">Estado</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id}>
                  <td className="p-2 border">
                    {item.student?.nombre} {item.student?.apellidos}
                  </td>
                  <td className="p-2 border">{item.grupo?.nombre}</td>
                  <td className="p-2 border">{item.cicloEscolar}</td>
                  <td className="p-2 border">{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
