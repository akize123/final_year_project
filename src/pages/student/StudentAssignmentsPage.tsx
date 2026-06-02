import { PageHeader } from "@/components/dashboard/PageHeader";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { DataCard } from "@/components/dashboard/DataCard";

const assignments = [
  { title: "Network Lab Report", course: "CSC303", due: "2026-06-10", status: "Pending" },
  { title: "ER Diagram Submission", course: "CSC302", due: "2026-06-05", status: "Submitted" },
  { title: "Sprint Retrospective", course: "CSC301", due: "2026-06-01", status: "Graded" },
];

export default function StudentAssignmentsPage() {
  const pending = assignments.filter((a) => a.status === "Pending").length;

  return (
    <div>
      <PageHeader title="Assignments" subtitle="Submissions and due dates" />
      <div className="ds-kpi-grid">
        <KpiCard label="Pending" value={pending} trend={{ direction: "down", text: "2 due soon" }} />
        <KpiCard label="Submitted" value={1} />
        <KpiCard label="Graded" value={1} trend={{ direction: "up", text: "on track" }} />
      </div>
      <DataCard label="Assignment List">
        <div className="ds-table-wrap">
          <table className="ds-table">
            <thead>
              <tr>
                <th>Assignment</th>
                <th>Course</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((a) => (
                <tr key={a.title}>
                  <td>{a.title}</td>
                  <td>{a.course}</td>
                  <td>{a.due}</td>
                  <td>
                    <span
                      className={`ds-badge ${
                        a.status === "Pending"
                          ? "ds-badge-warning"
                          : a.status === "Graded"
                            ? "ds-badge-success"
                            : "ds-badge-muted"
                      }`}
                    >
                      {a.status}
                    </span>
                  </td>
                  <td>
                    {a.status === "Pending" ? (
                      <button type="button" className="btn btn-primary btn-sm">
                        Submit
                      </button>
                    ) : (
                      <button type="button" className="btn btn-secondary btn-sm">
                        View
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DataCard>
    </div>
  );
}
