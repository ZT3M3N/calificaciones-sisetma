import AdminCards from "./AdminCards";
import LogoutButton from "./LogoutButton";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <LogoutButton />
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          Panel de Administrador 🧑‍💼
        </h1>
        <h3 className="font-bold text-gray-800 mb-8 text-center">Sesión actual:</h3>
        <AdminCards />
      </div>
    </div>
  );
}
