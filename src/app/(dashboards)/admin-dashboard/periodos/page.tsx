"use client";

import * as React from "react";
import DataTable from "@/components/admin/DataTable";
import ActionButtons from "@/components/admin/ActionButtons";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function PeriodosAdmin() {
  const [periodos, setPeriodos] = React.useState<any[]>([]);
  const router = useRouter();

  React.useEffect(() => {
    fetch("/api/periodos")
      .then((res) => res.json())
      .then(setPeriodos)
      .catch(console.error);
  }, []);

  return (
    <DataTable
      title="Periodos de Evaluación"
      data={periodos}
      columns={[
        { header: "Nombre", accessor: "nombre" },
        { header: "Fecha Inicio", accessor: "fecha_inicio", render: (val: string) => new Date(val).toLocaleDateString() },
        { header: "Fecha Fin", accessor: "fecha_fin", render: (val: string) => new Date(val).toLocaleDateString() },
        { header: "Ciclo Escolar", accessor: "ciclo_escolar" },
        { header: "Porcentaje", accessor: "porcentaje" },
        {
          header: "Acciones",
          accessor: "id",
          render: (_val, row) => <ActionButtons id={row.id} entity="periodos" />,
        },
      ]}
      actionButtons={[
        { label: "Registrar nuevo periodo", href: "/registro-periodo/" },
      ]}
    />
  );
}
