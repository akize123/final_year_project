import { PageHeader } from "@/components/dashboard/PageHeader";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { DataCard } from "@/components/dashboard/DataCard";

const grades = [
  { course: "CSC301", name: "Software Engineering", grade: "A", credits: 3, semester: "Semester 1" },
  { course: "CSC302", name: "Database Systems", grade: "B+", credits: 3, semester: "Semester 1" },
  { course: "CSC303", name: "Computer Networks", grade: "A-", credits: 3, semester: "Semester 1" },
  { course: "MAT201", name: "Applied Statistics", grade: "B", credits: 3, semester: "Semester 2" },
];

export default function StudentGradesPage() {
  const gpa = 3.72;

  return (
    <div className="ds-page-scroll">
      <PageHeader title="Grades" subtitle="Semester results and cumulative performance" />
      <div className="ds-kpi-grid">
        <KpiCard label="Current GPA" value={gpa.toFixed(2)} trend={{ direction: "up", text: "0.12" }} subLabel="vs last semester" />
        <KpiCard label="Courses" value={grades.length} />
        <KpiCard label="Credits" value={grades.reduce((s, g) => s + g.credits, 0)} />
      </div>
      <DataCard label="Results" viewReportHref="#">
        <div className="ds-table-wrap">
          <table className="ds-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Course</th>
                <th>Semester</th>
                <th>Grade</th>
                <th>Credits</th>
              </tr>
            </thead>
            <tbody>
              {grades.map((g) => (
                <tr key={g.course}>
                  <td>{g.course}</td>
                  <td>{g.name}</td>
                  <td>{g.semester}</td>
                  <td>{g.grade}</td>
                  <td>{g.credits}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DataCard>
    </div>
  );
}
