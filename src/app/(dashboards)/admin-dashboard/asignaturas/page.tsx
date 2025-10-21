import { prisma } from "@/lib/prisma";
import DataTable from "@/components/admin/DataTable";
import ActionButtons from "@/components/admin/ActionButtons";

export default async function AsignaturasAdminView() {
  const asignaturas = await prisma.asignatura.findMany();
  return (
    <DataTable
      title="Asignaturas"
      data={asignaturas}
      columns={[
        { header: "Asignatura", accessor: "nombre" },
        { header: "Clave", accessor: "clave" },
        { header: "Creditos", accessor: "creditos" },
        { header: "Horas semanales", accessor: "horas_semanales" },
        { header: "Semestre", accessor: "semestre" },
        {
          header: "Acciones",
          accessor: "id",
          render: (_val, row) => <ActionButtons id={row.id} entity="asignaturas" />,
        },
        {
          header: "Fecha creación",
          accessor: "createdAt",
          render: (val) => new Date(val).toLocaleDateString(),
        },
      ]}
      actionButtons={[
        { label: "Registrar nueva asignatura", href: "/registro-asignatura" },
      ]}
    />
  );
}
