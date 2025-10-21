import LoginForm from "@/components/LoginForm";

export default function EstudianteLoginPage() {
  return (
    <LoginForm
      role="estudiante"
      apiEndpoint="/api/estudiantes/login"
      redirectTo="/estudiante-dashboard"
      title="Inicia sesión en la cuenta de estudiante"
      registerLink="/registro-estudiante"
      registerText="¿Aún no tienes una cuenta de estudiante?"
    />
  );
}
