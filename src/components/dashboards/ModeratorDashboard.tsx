import { useRef } from "react";
import { DataCard } from "@/components/dashboard/DataCard";
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
import { CheckCircle2, XCircle, FileText, Download } from "lucide-react";

/* ─── Mock data ─── */
const reviewsThisWeek = [
  { day: "Mon", completed: 4, rejected: 0 },
  { day: "Tue", completed: 6, rejected: 1 },
  { day: "Wed", completed: 5, rejected: 0 },
  { day: "Thu", completed: 8, rejected: 1 },
  { day: "Fri", completed: 7, rejected: 0 },
  { day: "Sat", completed: 2, rejected: 0 },
  { day: "Sun", completed: 1, rejected: 0 },
];

const recentDecisions = [
  { title: "Blockchain-Based Land Registry for Rwanda", author: "Eric Habimana", decision: "Approved", date: "Mar 10, 2025", reason: "All requirements met; well-structured submission", icon: CheckCircle2, type: "success" },
  { title: "Smart Parking System using IoT Sensors", author: "Jean Pierre H.", decision: "Approved", date: "Mar 9, 2025", reason: "Complete documentation with proper citations", icon: CheckCircle2, type: "success" },
  { title: "Water Quality Monitoring using ML", author: "Patrick K.", decision: "Rejected", date: "Mar 8, 2025", reason: "Missing abstract; plagiarism check failed", icon: XCircle, type: "error" },
  { title: "E-Commerce Platform for Local Artisans", author: "Marie Claire N.", decision: "Resubmit", date: "Mar 7, 2025", reason: "Bibliography incomplete; missing sections", icon: FileText, type: "warning" },
];

const CHART_PRIMARY = "#5B6CF9";
const CHART_SECONDARY = "#D0D4F7";
const CHART_GRID = "#E8EAF2";
const CHART_AXIS = "#8A8FA8";

const getDecisionStyles = (type: string) => {
  switch (type) {
    case "success":
      return { bg: "#dcfce7", text: "#166534", border: "#86efac" };
    case "error":
      return { bg: "#fee2e2", text: "#991b1b", border: "#fca5a5" };
    case "warning":
      return { bg: "#fef3c7", text: "#92400e", border: "#fde047" };
    default:
      return { bg: "#f3f4f6", text: "#374151", border: "#d1d5db" };
  }
};

export function ModeratorDashboard() {
  const reportRef = useRef<HTMLDivElement | null>(null);
  const verified = 42;
  const pending = 24;
  const totalQueue = verified + pending;
  const reviewedThisWeekTotal = reviewsThisWeek.reduce(
    (sum, day) => sum + day.completed + day.rejected,
    0,
  );
  const approvedCount = recentDecisions.filter((item) => item.decision === "Approved").length;
  const rejectedCount = recentDecisions.filter((item) => item.decision === "Rejected").length;
  const resubmitCount = recentDecisions.filter((item) => item.decision === "Resubmit").length;

  const handleExportPdf = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="ds-page-scroll ds-dashboard-page ds-dashboard-main-page ds-dashboard-report-shell" ref={reportRef}>
      <section className="ds-student-welcome">
        <div className="ds-student-welcome-inner">
          <span className="ds-student-welcome-badge">Moderator Portal</span>
          <div className="ds-student-welcome-panel">
            <div className="ds-student-welcome-chip">
              <span className="ds-student-welcome-chip-label">Queue</span>
              <span className="ds-student-welcome-chip-value">{totalQueue}</span>
            </div>
            <div className="ds-student-welcome-chip">
              <span className="ds-student-welcome-chip-label">Verified</span>
              <span className="ds-student-welcome-chip-value">{verified}</span>
            </div>
            <button
              type="button"
              onClick={handleExportPdf}
              className="ds-export-pdf-btn"
              aria-label="Export moderation report to PDF"
            >
              <Download className="h-4 w-4" />
              Export PDF
            </button>
          </div>
        </div>
      </section>

      <div className="ds-dashboard-grid">
        <DataCard label="Review Completion" className="ds-card-compact">
          <p className="ds-kpi-label" style={{ margin: 0 }}>Items reviewed this week</p>
          <p className="ds-chart-metric">{reviewedThisWeekTotal}</p>
          <p className="ds-kpi-trend up" style={{ marginBottom: 12 }}>
            + 8% from the previous cycle
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={reviewsThisWeek} barGap={4}>
              <CartesianGrid stroke={CHART_GRID} vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: CHART_AXIS }} axisLine={{ stroke: CHART_GRID }} />
              <YAxis tick={{ fontSize: 11, fill: CHART_AXIS }} axisLine={{ stroke: CHART_GRID }} />
              <Tooltip />
              <Bar dataKey="completed" name="Approved" fill={CHART_PRIMARY} radius={[4, 4, 0, 0]} />
              <Bar dataKey="rejected" name="Rejected" fill={CHART_SECONDARY} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="ds-chart-legend">
            <span className="ds-chart-legend-item">
              <span className="ds-chart-legend-dot" style={{ background: CHART_PRIMARY }} />
              Approved
            </span>
            <span className="ds-chart-legend-item">
              <span className="ds-chart-legend-dot" style={{ background: CHART_SECONDARY }} />
              Rejected
            </span>
          </div>
        </DataCard>

        <DataCard label="Decision Mix" className="ds-card-compact">
          <p className="ds-kpi-label" style={{ margin: 0 }}>Current moderation balance</p>
          <p className="ds-chart-metric">{pending} pending</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={[
                  { name: "Approved", value: approvedCount, color: "#22c55e" },
                  { name: "Rejected", value: rejectedCount, color: "#ef4444" },
                  { name: "Resubmit", value: resubmitCount, color: "#f59e0b" },
                ]}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={2}
              >
                {[
                  { name: "Approved", value: approvedCount, color: "#22c55e" },
                  { name: "Rejected", value: rejectedCount, color: "#ef4444" },
                  { name: "Resubmit", value: resubmitCount, color: "#f59e0b" },
                ].map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="ds-chart-legend">
            {[
              { name: "Approved", value: approvedCount, color: "#22c55e" },
              { name: "Rejected", value: rejectedCount, color: "#ef4444" },
              { name: "Resubmit", value: resubmitCount, color: "#f59e0b" },
            ].map((item) => (
              <span key={item.name} className="ds-chart-legend-item">
                <span className="ds-chart-legend-dot" style={{ background: item.color }} />
                {item.name} ({item.value})
              </span>
            ))}
          </div>
        </DataCard>
      </div>

      {/* ─── Recent Decisions Section ─── */}
      <div style={{ marginTop: "2rem" }}>
        <DataCard label="Recent Decisions" className="ds-card-full-width">
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {recentDecisions.map((item, idx) => {
              const IconComponent = item.icon;
              const styles = getDecisionStyles(item.type);
              return (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                    padding: "12px",
                    borderRadius: "8px",
                    backgroundColor: styles.bg,
                    borderLeft: `3px solid ${styles.border}`,
                  }}
                >
                  <IconComponent
                    style={{
                      width: "20px",
                      height: "20px",
                      marginTop: "2px",
                      flexShrink: 0,
                      color: styles.text,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        margin: "0 0 4px 0",
                        fontWeight: "600",
                        fontSize: "14px",
                        color: styles.text,
                        wordBreak: "break-word",
                      }}
                    >
                      {item.title}
                    </p>
                    <p
                      style={{
                        margin: "0 0 4px 0",
                        fontSize: "13px",
                        color: styles.text,
                        opacity: 0.8,
                      }}
                    >
                      By <strong>{item.author}</strong> • {item.date}
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "13px",
                        color: styles.text,
                      }}
                    >
                      {item.reason}
                    </p>
                  </div>
                  <span
                    style={{
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      fontWeight: "600",
                      backgroundColor: styles.border,
                      color: styles.text,
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                    }}
                  >
                    {item.decision}
                  </span>
                </div>
              );
            })}
          </div>
        </DataCard>
      </div>
    </div>
  );
}