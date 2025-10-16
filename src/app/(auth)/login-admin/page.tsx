import LoginForm from "@/components/LoginForm";

export default function AdminLoginPage() {
  return (
    <LoginForm
      role="admin"
      apiEndpoint="/api/admin/login"
      redirectTo="/admin-dashboard"
      title="Inicia sesión en tu cuenta de administrador"
      registerLink="/registro-admin"
      registerText="¿Aún no tienes una cuenta de administrador?"
    />
  );
}
