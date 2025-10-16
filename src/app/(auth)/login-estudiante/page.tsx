// app/docente/login/page.tsx
import LoginForm from "@/components/LoginForm";

export default function EstudianteLoginPage() {
  return (
    <LoginForm
      role="estudiante"
      apiEndpoint="/api/student/login"
      redirectTo="/estudiante-dashboard"
      title="Inicia sesión en la cuenta de estudiante"
      registerLink="/registro-estudiante"
      registerText="¿Aún no tienes una cuenta de estudiante?"
    />
  );
}
