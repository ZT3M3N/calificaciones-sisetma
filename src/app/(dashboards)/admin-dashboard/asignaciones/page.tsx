import AsignacionesCards from "../components/AsignacionesCards";

export default function AsignacionesView() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          Panel de asignaciones
        </h1>
        <AsignacionesCards />
      </div>
    </div>
  );
}
