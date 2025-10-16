import { prisma } from "@/lib/prisma";
import DataTable from "@/components/admin/DataTable";
import ActionButtons from "@/components/admin/ActionButtons";

export default async function GruposAdminView() {
  const grupos = await prisma.grupo.findMany();
  return (
    <DataTable
      title="Grupos"
      data={grupos}
      columns={[
        { header: "Nombre del grupo", accessor: "nombre" },
        {
          header: "Acciones",
          accessor: "id",
          render: (_val, row) => <ActionButtons studentId={row.id} />,
        },
        {
          header: "Fecha creación",
          accessor: "createdAt",
          render: (val) => new Date(val).toLocaleDateString(),
        },
      ]}
      actionButtons={[
        { label: "Registrar nueva asignatura", href: "/registro-docente" },
      ]}
    />
  );
}
