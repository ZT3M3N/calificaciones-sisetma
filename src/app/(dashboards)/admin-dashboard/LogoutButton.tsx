// app/(dashboards)/admin-dashboard/LogoutButton.tsx
"use client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login-admin");
  };

  return (
    <button
      onClick={handleLogout}
      className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
    >
      Cerrar sesión
    </button>
  );
}
