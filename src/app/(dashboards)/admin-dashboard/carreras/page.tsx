import { prisma } from "@/lib/prisma";
import DataTable from "@/components/admin/DataTable";
import ActionButtons from "@/components/admin/ActionButtons";

export default async function CarrerasAdminView() {
  const students = await prisma.carrera.findMany();

  return (
    <DataTable
      title="Carreras"
      data={students}
      columns={[
        { header: "Nombre", accessor: "nombre" },
        { header: "Clave", accessor: "clave" },
        { header: "Descripción", accessor: "descripcion" },
        {
          header: "Acciones",
          accessor: "id",
          render: (_val, row) => (
            <ActionButtons id={row.id} entity="carreras" />
          ),
        },
      ]}
      actionButtons={[
        { label: "Registrar nueva carrera", href: "/registro-carrera" },
      ]}
    />
  );
}
