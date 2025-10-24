import LoginForm from "@/components/LoginForm";

export default function DocenteLoginPage() {
  return (
    <LoginForm
      role="docente"
      apiEndpoint="/api/docentes/login"
      redirectTo="/docente-dashboard"
      title="Inicia sesión con tu cuenta de docente"
      registerLink="/registro-docente"
      registerText="¿Aún no tienes una cuenta de docente?"
    />
  );
}
