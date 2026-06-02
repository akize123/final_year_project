import { useAuth } from "@/contexts/AuthContext";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { DataCard } from "@/components/dashboard/DataCard";
import { attendanceRecords, computeAttendanceSummaries } from "@/data/attendance";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";

const ELIGIBILITY_THRESHOLD = 75;

const statusLabel: Record<string, string> = {
  present: "Present",
  absent: "Absent",
  late: "Late",
  excused: "Excused",
};

const MyAttendancePage = () => {
  const { user } = useAuth();
  if (!user) return null;

  const summaries = computeAttendanceSummaries(attendanceRecords, user.id);
  const myRecords = attendanceRecords.filter((r) => r.studentId === user.id);
  const overallPct =
    summaries.length > 0
      ? Math.round(
          summaries.reduce((s, c) => s + c.attendancePct, 0) / summaries.length,
        )
      : 0;
  const allEligible = summaries.every((s) => s.eligible);

  const chartData = summaries.map((s) => ({
    course: s.courseCode,
    attendance: s.attendancePct,
    eligible: s.eligible,
  }));

  return (
    <div>
      <PageHeader title="Attendance" subtitle="Session participation and eligibility" />

      <div className="ds-kpi-grid">
        <KpiCard
          label="Overall Rate"
          value={`${overallPct}%`}
          trend={{
            direction: overallPct >= ELIGIBILITY_THRESHOLD ? "up" : "down",
            text: `${summaries.length} courses`,
          }}
          subLabel="vs 75% threshold"
        />
        <KpiCard
          label="Eligibility"
          value={allEligible ? "Eligible" : "At Risk"}
          trend={{
            direction: allEligible ? "up" : "down",
            text: allEligible ? "met" : "review",
          }}
        />
        <KpiCard label="Present" value={myRecords.filter((r) => r.status === "present").length} />
        <KpiCard
          label="Absent"
          value={myRecords.filter((r) => r.status === "absent").length}
          trend={{ direction: "down", text: "sessions" }}
        />
      </div>

      <div className="ds-card-grid">
        <DataCard label="Attendance by Course">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData}>
              <CartesianGrid stroke="#E8EAF2" vertical={false} />
              <XAxis
                dataKey="course"
                tick={{ fontSize: 11, fill: "#8A8FA8" }}
                axisLine={{ stroke: "#E8EAF2" }}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 11, fill: "#8A8FA8" }}
                axisLine={{ stroke: "#E8EAF2" }}
                unit="%"
              />
              <Tooltip
                contentStyle={{
                  fontSize: 12,
                  border: "1px solid #E8EAF2",
                  borderRadius: 8,
                }}
              />
              <Bar dataKey="attendance" radius={[6, 6, 0, 0]} maxBarSize={48}>
                {chartData.map((entry, i) => (
                  <Cell
                    key={`cell-${i}`}
                    fill={entry.eligible ? "#5B6CF9" : "#D0D4F7"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", gap: 16, marginTop: 12, justifyContent: "center" }}>
            <span className="ds-text-secondary">
              <span
                style={{
                  display: "inline-block",
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#5B6CF9",
                  marginRight: 6,
                }}
              />
              Eligible
            </span>
            <span className="ds-text-secondary">
              <span
                style={{
                  display: "inline-block",
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#D0D4F7",
                  marginRight: 6,
                }}
              />
              Below threshold
            </span>
          </div>
        </DataCard>

        <DataCard label="Session History">
          <div className="ds-table-wrap">
            <table className="ds-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Course</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {myRecords
                  .sort((a, b) => b.date.localeCompare(a.date))
                  .slice(0, 12)
                  .map((rec) => (
                    <tr key={rec.id}>
                      <td>
                        {new Date(rec.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td>{rec.courseCode}</td>
                      <td>{statusLabel[rec.status] ?? rec.status}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </DataCard>
      </div>
    </div>
  );
};

export default MyAttendancePage;
