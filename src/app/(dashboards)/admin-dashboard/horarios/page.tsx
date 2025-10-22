import { prisma } from "@/lib/prisma";
import DataTable from "@/components/admin/DataTable";
import ActionButtons from "@/components/admin/ActionButtons";

export default async function HorariosAdminView() {
  const horarios = await prisma.horario.findMany({
    include: {
      asignatura_docente: {
        include: {
          asignatura: true,
          docente: true,
        },
      },
    },
  });

  const data = horarios.map((h) => ({
    id: h.id,
    asignatura: h.asignatura_docente.asignatura.nombre,
    docente: `${h.asignatura_docente.docente.nombre} ${h.asignatura_docente.docente.apellidos}`,
    dia_semana: h.dia_semana,
    hora_inicio: h.hora_inicio,
    hora_fin: h.hora_fin,
    aula: h.aula,
  }));

  return (
    <DataTable
      title="Horarios"
      data={data}
      columns={[
        { header: "Asignatura", accessor: "asignatura" },
        { header: "Docente", accessor: "docente" },
        { header: "Día de la semana", accessor: "dia_semana" },
        { header: "Hora de inicio", accessor: "hora_inicio" },
        { header: "Hora de fin", accessor: "hora_fin" },
        { header: "Aula", accessor: "aula" },
        {
          header: "Acciones",
          accessor: "id",
          render: (_val, row) => (
            <ActionButtons id={row.id} entity="horarios" />
          ),
        },
      ]}
      actionButtons={[
        { label: "Registrar nuevo horario", href: "/registro-horario" },
      ]}
    />
  );
}
