import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { DataCard } from "@/components/dashboard/DataCard";
import { getDashboardSummary } from "@/api/student/dashboard";
import { getAuthToken } from "@/lib/auth-token";
import type { DashboardSummaryResponse } from "@/api/types";
import {
  documentUploadsByWeek,
  documentStatusDonut,
  attendanceTimeline,
  attendanceComparison,
  recentUploadsList,
} from "@/data/student-dashboard-mock";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const CHART_PRIMARY = "#5B6CF9";
const CHART_SECONDARY = "#D0D4F7";
const CHART_GRID = "#E8EAF2";
const CHART_AXIS = "#8A8FA8";

export const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [summary, setSummary] = useState<DashboardSummaryResponse | null>(null);

  useEffect(() => {
    if (!getAuthToken()) return;
    getDashboardSummary()
      .then(setSummary)
      .catch(() => setSummary(null));
  }, []);

  const academicRate = summary?.academicDocuments?.completionRate ?? 68;
  const totalUploads = documentUploadsByWeek.reduce(
    (s, w) => s + w.academic + w.financial + w.internship + w.other,
    0,
  );
  const avgAttendance = Math.round(
    attendanceTimeline.reduce((s, d) => s + d.rate, 0) / attendanceTimeline.length,
  );

  return (
    <div className="ds-page-scroll">
      <PageHeader
        title="Dashboard"
        subtitle={user ? `Welcome back, ${user.name}` : undefined}
      />

      <div className="ds-dashboard-grid">
        <DataCard label="Document Uploads" viewReportHref="/student/documents/academic">
          <p className="ds-kpi-label" style={{ margin: 0 }}>Total this period</p>
          <p className="ds-chart-metric">{totalUploads}</p>
          <p className="ds-kpi-trend up" style={{ marginBottom: 12 }}>
            ↑ 12% vs last month
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={documentUploadsByWeek} barGap={4}>
              <CartesianGrid stroke={CHART_GRID} vertical={false} />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: CHART_AXIS }} axisLine={{ stroke: CHART_GRID }} />
              <YAxis tick={{ fontSize: 11, fill: CHART_AXIS }} axisLine={{ stroke: CHART_GRID }} />
              <Tooltip />
              <Bar dataKey="academic" name="Academic" fill={CHART_PRIMARY} radius={[4, 4, 0, 0]} />
              <Bar dataKey="financial" name="Financial" fill={CHART_SECONDARY} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="ds-chart-legend">
            <span className="ds-chart-legend-item">
              <span className="ds-chart-legend-dot" style={{ background: CHART_PRIMARY }} />
              Academic
            </span>
            <span className="ds-chart-legend-item">
              <span className="ds-chart-legend-dot" style={{ background: CHART_SECONDARY }} />
              Financial
            </span>
          </div>
        </DataCard>

        <DataCard label="Document Status">
          <p className="ds-kpi-label" style={{ margin: 0 }}>Completion rate</p>
          <p className="ds-chart-metric">{academicRate}%</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={documentStatusDonut}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={2}
              >
                {documentStatusDonut.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="ds-chart-legend">
            {documentStatusDonut.map((d) => (
              <span key={d.name} className="ds-chart-legend-item">
                <span className="ds-chart-legend-dot" style={{ background: d.color }} />
                {d.name} ({d.value})
              </span>
            ))}
          </div>
        </DataCard>
      </div>

      <div className="ds-dashboard-grid-bottom">
        <DataCard label="Attendance Timeline" viewReportHref="/student/schedule">
          <p className="ds-kpi-label" style={{ margin: 0 }}>Weekly rate</p>
          <p className="ds-chart-metric">{avgAttendance}%</p>
          <p className="ds-kpi-trend up" style={{ marginBottom: 8 }}>↑ 3% vs last week</p>
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
                    {item.category} · {item.date}
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

      <DataCard label="Quick Access">
        <div className="ds-table-wrap">
          <table className="ds-table">
            <thead>
              <tr>
                <th>Area</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Academic Documents", "/student/documents/academic"],
                ["Certificates", "/student/documents/certificates"],
                ["Personal Projects", "/student/projects"],
                ["Schedule & Attendance", "/student/schedule"],
                ["Final Year Project", "/student/documents/final-year-project"],
              ].map(([label, path]) => (
                <tr key={path}>
                  <td>{label}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => navigate(path)}
                    >
                      Open
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DataCard>
    </div>
  );
};
