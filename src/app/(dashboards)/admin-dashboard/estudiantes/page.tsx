// app/(dashboards)/admin-dashboard/estudiantes/page.tsx
import { prisma } from "@/lib/prisma";
import DataTable from "@/components/admin/DataTable";
import { TableHead, TableCell } from "@/components/ui/table";
import StatusSwitch from "@/components/admin/StatusSwitch";
import ActionButtons from "@/components/admin/ActionButtons";

export default async function EstudiantesAdminView() {
  const students = await prisma.student.findMany();

  return (
    <DataTable
      title="Estudiantes"
      data={students}
      columns={[
        { header: "Nombre", accessor: "nombre" },
        { header: "Apellidos", accessor: "apellidos" },
        { header: "Correo", accessor: "correo" },
        { header: "Matrícula", accessor: "matricula" },
        { header: "Carrera", accessor: "carrera" },
        { header: "Teléfono", accessor: "telefono" },
        { header: "Dirección", accessor: "direccion" },
        {
          header: "Status",
          accessor: "status",
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
          render: (_val, row) => <ActionButtons studentId={row.id} />,
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
