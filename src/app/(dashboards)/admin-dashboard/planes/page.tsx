import StatsCards from "@/app/(dashboards)/admin-dashboard/components/StatsCards";
import StudyPlanManager from "@/app/(dashboards)/admin-dashboard/components/StudyPlanManager";
import EnrollmentForm from "@/app/(dashboards)/admin-dashboard/components/EnrollmentForm";
import EnrollmentTable from "@/app/(dashboards)/admin-dashboard/components/EnrollmentTable";

export default function AdminDashboard() {
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Panel Académico</h1>

      <StatsCards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StudyPlanManager />
        <EnrollmentForm />
      </div>

      <EnrollmentTable />
    </div>
  );
}
