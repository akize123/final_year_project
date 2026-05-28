import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { StudentDashboard } from "@/components/dashboards/StudentDashboard";
import { LecturerDashboard } from "@/components/dashboards/LecturerDashboard";
import { HodDashboard } from "@/components/dashboards/HodDashboard";
import { ModeratorDashboard } from "@/components/dashboards/ModeratorDashboard";
import { AdminDashboard } from "@/components/dashboards/AdminDashboard";
import { ExamOfficeDashboard } from "@/components/dashboards/ExamOfficeDashboard";

const DashboardPage = () => {
  const { user } = useAuth();
  if (!user) return null;

  const dashboards = {
    student: StudentDashboard,
    lecturer: LecturerDashboard,
    hod: HodDashboard,
    moderator: ModeratorDashboard,
    admin: AdminDashboard,
    exam_office: ExamOfficeDashboard,
  };

  const Dashboard = dashboards[user.role];
  if (!Dashboard) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-bold text-foreground">Access unavailable</h1>
        <p className="text-sm text-muted-foreground">
          Your role does not currently have a dedicated dashboard. Please contact the system administrator.
        </p>
      </div>
    );
  }

  return <Dashboard />;
};

export default DashboardPage;
