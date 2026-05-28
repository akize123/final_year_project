import { AppLayout } from "@/components/AppLayout";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { AlertCircle, CheckCircle, Clock, FileText } from "lucide-react";
import { useMemo } from "react";

type SupervisionAssignment = {
  projectId: string;
  studentName: string;
  campusId: string;
  dept: string;
  projectTitle: string;
  semester: string;
  lecturerId: string;
  lecturerName: string;
  status: string;
};

const STORAGE_KEY = "auca_supervision_assignments_v1";

function loadAssignments(): SupervisionAssignment[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as SupervisionAssignment[];
  } catch {
    return [];
  }
}

const statusIcon: Record<string, React.ReactNode> = {
  Published: <CheckCircle className="w-4 h-4 text-success" />,
  Pending: <Clock className="w-4 h-4 text-warning" />,
  Draft: <FileText className="w-4 h-4 text-muted-foreground" />,
  "Not Started": <AlertCircle className="w-4 h-4 text-destructive" />,
};

const statusColors: Record<string, string> = {
  Published: "bg-success/10 text-success border-success/20",
  Pending: "bg-warning/10 text-warning border-warning/20",
  Draft: "bg-muted text-muted-foreground border-border",
  "Not Started": "bg-destructive/10 text-destructive border-destructive/20",
};

const SupervisedStudentsPage = () => {
  const { user } = useAuth();

  const myAssignments = useMemo(() => {
    if (!user) return [];
    return loadAssignments()
      .filter((a) => a.lecturerId === user.id)
      .sort((a, b) => a.studentName.localeCompare(b.studentName));
  }, [user]);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-xl font-heading font-black text-foreground">Supervised Students</h1>
          <p className="text-xs text-muted-foreground mt-1">Your current supervision list.</p>
        </div>

        <div className="bg-card rounded-xl border border-border card-shadow overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground">
                <th className="text-left px-5 py-3 font-medium">Student</th>
                <th className="text-left px-5 py-3 font-medium">Campus ID</th>
                <th className="text-left px-5 py-3 font-medium">Project</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {myAssignments.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-sm text-muted-foreground">
                    No assigned students yet.
                  </td>
                </tr>
              ) : (
                myAssignments.map((s) => (
                  <tr key={s.projectId} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3">
                      <p className="text-sm font-medium text-foreground">{s.studentName}</p>
                      <p className="text-xs text-muted-foreground">{s.dept}</p>
                    </td>
                    <td className="px-5 py-3 text-sm text-muted-foreground font-mono">{s.campusId}</td>
                    <td className="px-5 py-3 text-sm text-muted-foreground">{s.projectTitle || "—"}</td>
                    <td className="px-5 py-3">
                      <Badge variant="outline" className={`text-xs ${statusColors[s.status]}`}>
                        <span className="mr-1">{statusIcon[s.status]}</span> {s.status}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
};

export default SupervisedStudentsPage;

