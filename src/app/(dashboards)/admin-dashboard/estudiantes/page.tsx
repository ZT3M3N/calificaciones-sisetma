import { prisma } from "@/lib/prisma";
import DataTable from "@/components/admin/DataTable";
import ActionButtons from "@/components/admin/ActionButtons";

export default async function EstudiantesAdminView() {
  const students = await prisma.estudiante.findMany({
    include: { carrera: true },
  });

  return (
    <DataTable
      title="Estudiantes"
      data={students}
      columns={[
        { header: "Nombre", accessor: "nombre" },
        { header: "Apellidos", accessor: "apellidos" },
        { header: "Correo", accessor: "correo" },
        { header: "Matrícula", accessor: "matricula" },
        {
          header: "Carrera",
          accessor: "carrera",
          render: (_val, row) => row.carrera?.nombre || "Sin asignar",
        },
        { header: "Teléfono", accessor: "telefono" },
        { header: "Dirección", accessor: "direccion" },
        {
          header: "Status",
          accessor: "estado",
          render: (val) => (
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                val === "activo"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {val}
            </span>
          ),
        },
        {
          header: "Acciones",
          accessor: "id",
          render: (_val, row) => (
            <ActionButtons id={row.id} entity="estudiantes" />
          ),
        },
        {
          header: "Fecha creación",
          accessor: "createdAt",
          render: (val) => new Date(val).toLocaleDateString(),
        },
      ]}
      actionButtons={[
        { label: "Registrar nuevo estudiante", href: "/registro-estudiante" },
      ]}
    />
  );
}
