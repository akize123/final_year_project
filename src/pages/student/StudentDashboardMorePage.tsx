import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { DataCard } from "@/components/dashboard/DataCard";
import {
  attendanceComparison,
  attendanceTimeline,
  recentUploadsList,
} from "@/data/student-dashboard-mock";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const CHART_PRIMARY = "#5B6CF9";
const CHART_SECONDARY = "#D0D4F7";
const CHART_GRID = "#E8EAF2";
const CHART_AXIS = "#8A8FA8";

export default function StudentDashboardMorePage() {
  const navigate = useNavigate();
  const avgAttendance = Math.round(
    attendanceTimeline.reduce((sum, day) => sum + day.rate, 0) / attendanceTimeline.length,
  );

  return (
    <div className="ds-page-scroll ds-dashboard-page">
      <PageHeader
        title="Dashboard Details"
        subtitle="Attendance and recent uploads"
      />

      <div className="ds-dashboard-grid-bottom">
        <DataCard label="Attendance Timeline" viewReportHref="/student/schedule">
          <p className="ds-kpi-label" style={{ margin: 0 }}>Weekly rate</p>
          <p className="ds-chart-metric">{avgAttendance}%</p>
          <p className="ds-kpi-trend up" style={{ marginBottom: 8 }}>+ 3% vs last week</p>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={attendanceTimeline}>
              <CartesianGrid stroke={CHART_GRID} vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: CHART_AXIS }} />
              <YAxis domain={[60, 100]} tick={{ fontSize: 10, fill: CHART_AXIS }} unit="%" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="rate"
                stroke={CHART_PRIMARY}
                strokeWidth={2}
                dot={{ fill: CHART_PRIMARY, r: 3 }}
                name="Attendance %"
              />
            </LineChart>
          </ResponsiveContainer>
        </DataCard>

        <DataCard label="Attendance vs Previous">
          <p className="ds-kpi-label" style={{ margin: 0 }}>Sessions tracked</p>
          <p className="ds-chart-metric">{attendanceTimeline.length * 2}</p>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={attendanceComparison}>
              <CartesianGrid stroke={CHART_GRID} vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: CHART_AXIS }} />
              <YAxis domain={[60, 100]} tick={{ fontSize: 10, fill: CHART_AXIS }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="current"
                stroke={CHART_PRIMARY}
                strokeWidth={2}
                name="Current"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="previous"
                stroke={CHART_SECONDARY}
                strokeWidth={1}
                strokeDasharray="4 4"
                name="Previous"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </DataCard>

        <DataCard label="Recent Uploads">
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {recentUploadsList.map((item) => (
              <li
                key={item.name}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 0",
                  borderBottom: "1px solid #E8EAF2",
                }}
              >
                <div>
                  <p className="ds-body-text" style={{ fontWeight: 600, margin: 0 }}>
                    {item.name}
                  </p>
                  <p className="ds-text-secondary" style={{ margin: "2px 0 0" }}>
                    {item.category} - {item.date}
                  </p>
                </div>
                <span
                  className={`ds-badge ${
                    item.status === "Verified" ? "ds-badge-success" : "ds-badge-warning"
                  }`}
                >
                  {item.status}
                </span>
              </li>
            ))}
          </ul>
        </DataCard>
      </div>

      <div className="ds-dashboard-actions">
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
