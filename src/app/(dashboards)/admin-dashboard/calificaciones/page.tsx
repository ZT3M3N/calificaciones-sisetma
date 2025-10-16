import { prisma } from "@/lib/prisma";
import DataTable from "@/components/admin/DataTable";
import ActionButtons from "@/components/admin/ActionButtons";

export default async function CalificacionesAdminView() {
  const calificaciones = await prisma.calificacion.findMany();
  return (
    <DataTable
      title="Calificaciones"
      data={calificaciones}
      columns={[
        { header: "Alumno", accessor: "nombre" },
        { header: "Calificación", accessor: "nombre" },
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
        { label: "Registrar calificación", href: "/registro-docente" },
      ]}
    />
  );
}
