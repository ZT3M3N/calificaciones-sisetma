import { prisma } from "@/lib/prisma";
import DataTable from "@/components/admin/DataTable";
import ActionButtons from "@/components/admin/ActionButtons";

export default async function TutoresAdminView() {
  const tutores = await prisma.tutor.findMany();
  return (
    <DataTable
      title="Tutores"
      data={tutores}
      columns={[
        { header: "Nombre", accessor: "nombre" },
        { header: "Apellidos", accessor: "apellidos" },
        { header: "Correo", accessor: "correo" },
        { header: "Teléfono", accessor: "telefono" },

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
        { label: "Registrar nuevo tutor", href: "/registro-tutor" },
      ]}
    />
  );
}
