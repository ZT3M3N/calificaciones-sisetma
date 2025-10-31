import Link from "next/link";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type RowData = {
  id: number;
  [key: string]: any;
};

interface Column {
  header: string;
  accessor: string;
  render?: (value: any, row: RowData) => React.ReactNode;
}

interface ActionButton {
  label: string;
  href: string;
}

interface DataTableProps {
  title: string;
  caption?: string;
  data: RowData[];
  columns: Column[];
  actionButtons?: ActionButton[];
}

export default function DataTable({
  title,
  caption,
  data,
  columns = [],
  actionButtons = [],
}: DataTableProps) {
  function formatValue(value: any) {
    if (value instanceof Date) {
      return value.toLocaleString("es-MX", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    if (value === null || value === undefined) {
      return "";
    }

    if (typeof value === "object") {
      return JSON.stringify(value);
    }

    return value;
  }

  return (
    <div className="max-w-7xl mx-auto my-10 p-6 bg-white rounded-xl shadow-lg border border-gray-200">
      {/* 🔹 Encabezado con botones */}
      <div className="flex justify-between items-center mb-4">
        {/* Botón regresar */}
        <Link href="/admin-dashboard">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded hover:cursor-pointer">
            Regresar al panel principal
          </button>
        </Link>

        {/* Título */}
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>

        {/* Botones dinámicos */}
        <div className="flex gap-2">
          {actionButtons.map((btn, idx) => (
            <Link key={idx} href={btn.href}>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded hover:cursor-pointer">
                {btn.label}
              </button>
            </Link>
          ))}
        </div>
      </div>

      {/* Tabla */}
      <Table>
        <TableCaption className="text-gray-600 text-sm italic p-2">
          {caption || `Lista de ${title}`}
        </TableCaption>
        <TableHeader>
          <TableRow className="bg-gray-100">
            {columns.map((col, idx) => (
              <TableHead key={idx} className="font-bold text-gray-700 border">
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((row, idx) => (
            <TableRow
              key={row.id}
              className={`${
                idx % 2 === 0 ? "bg-gray-50" : "bg-white"
              } hover:bg-teal-50 transition-colors`}
            >
              {columns.map((col, i) => (
                <TableCell key={i} className="text-gray-700 border">
                  {col.render
                    ? col.render(row[col.accessor], row)
                    : formatValue(row[col.accessor])}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
