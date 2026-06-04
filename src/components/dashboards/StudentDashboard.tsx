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
} from "@/data/student-dashboard-mock";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
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

  const handleDocumentUploadsReport = () => {
    const rows = documentUploadsByWeek
      .map((week) => {
        const total = week.academic + week.financial + week.internship + week.other;
        return `<tr><td>${week.week}</td><td>${week.academic}</td><td>${week.financial}</td><td>${week.internship}</td><td>${week.other}</td><td>${total}</td></tr>`;
      })
      .join("");

    const statusRows = documentStatusDonut
      .map((status) => `<tr><td>${status.name}</td><td>${status.value}</td></tr>`)
      .join("");

    const popup = window.open("", "_blank", "width=900,height=700");
    if (!popup) return;

    popup.document.write(`<!doctype html><html><head><title>Student Document Report</title><style>body{font-family:Arial,sans-serif;color:#1d3557;padding:32px}h1{font-size:24px;margin:0 0 6px}h2{font-size:16px;margin:28px 0 10px}p{color:#475569;margin:0 0 18px}table{border-collapse:collapse;width:100%;margin-top:10px}th,td{border:1px solid #dbe3ef;padding:10px;text-align:left;font-size:13px}th{background:#1d3557;color:#fff}.metric{display:inline-block;margin:14px 0;padding:12px 16px;background:#eef4ff;border-radius:10px;font-weight:700}@media print{button{display:none}body{padding:18px}}</style></head><body><h1>Student Document Uploads Report</h1><p>${user?.name ?? "Student"} - Generated from the dashboard chart</p><div class="metric">Total uploads this period: ${totalUploads}</div><h2>Uploads by Week</h2><table><thead><tr><th>Week</th><th>Academic</th><th>Financial</th><th>Internship</th><th>Other</th><th>Total</th></tr></thead><tbody>${rows}</tbody></table><h2>Document Status</h2><table><thead><tr><th>Status</th><th>Count</th></tr></thead><tbody>${statusRows}</tbody></table><script>window.onload=()=>setTimeout(()=>window.print(),300);</script></body></html>`);
    popup.document.close();
    popup.focus();
  };
  return (
    <div className="ds-page-scroll ds-dashboard-page ds-dashboard-main-page">
      <div className="mb-8 p-6 bg-gradient-to-r from-[#152c52] to-[#2c4e7d] rounded-2xl shadow-lg relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-white/10 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 rounded-full bg-blue-400/20 blur-xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {user?.name || "Student"}
            </h1>
            <p className="mt-2 text-blue-100/90 font-medium text-sm sm:text-base">
              Here is what's happening with your academic progress today.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-xl text-white text-sm font-semibold shadow-sm">
            <span>Student Dashboard</span>
          </div>
        </div>
      </div>

      <div className="ds-dashboard-grid">
        <DataCard label="Document Uploads" viewReportLabel="View Report" onViewReport={handleDocumentUploadsReport} className="ds-card-compact">
          <p className="ds-kpi-label" style={{ margin: 0 }}>Total this period</p>
          <p className="ds-chart-metric">{totalUploads}</p>
          <p className="ds-kpi-trend up" style={{ marginBottom: 12 }}>
            + 12% vs last month
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

        <DataCard label="Document Status" className="ds-card-compact">
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
      <div className="ds-dashboard-actions">
        <button type="button" className="btn btn-primary btn-sm" onClick={() => navigate("/student/dashboard-more")}>
          View More
        </button>
      </div>
    </div>
  );
};
