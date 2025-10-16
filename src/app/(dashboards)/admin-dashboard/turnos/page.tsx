import { prisma } from "@/lib/prisma";
import DataTable from "@/components/admin/DataTable";
import ActionButtons from "@/components/admin/ActionButtons";

export default async function TurnosAdminView() {
  const turnos = await prisma.turno.findMany();
  return (
      <DataTable
            title="Turnos"
            data={turnos}
            columns={[
              { header: "Turno", accessor: "nombre" },
              
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
              { label: "Registrar horario", href: "/registro-docente" },
            ]}
          />
    )
}
