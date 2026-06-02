import { Fragment, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { DataCard } from "@/components/dashboard/DataCard";
import { DocumentUploadDialog } from "@/components/dashboard/DocumentUploadDialog";
import { Pagination, paginate, totalPages } from "@/components/dashboard/Pagination";
import { attendanceRecords, computeAttendanceSummaries } from "@/data/attendance";
import { attendanceTimeline } from "@/data/student-dashboard-mock";
import {
  DAYS,
  TIME_SLOTS,
  TIMETABLE_COLOR_PRESETS,
  type TimetableSlot,
  loadTimetable,
  saveTimetable,
  ocrExtractedTimetable,
  slotColor,
  isValidTimeBlock,
} from "@/data/student-timetable";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";

const ELIGIBILITY_THRESHOLD = 75;
const PAGE_SIZE = 5;

function slotFitsHour(slot: TimetableSlot, hour: string): boolean {
  return slot.startTime <= hour && slot.endTime > hour;
}

const statusLabel: Record<string, string> = {
  present: "Present",
  absent: "Absent",
  late: "Late",
  excused: "Excused",
};

export default function StudentSchedulePage() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [tab, setTab] = useState<"timetable" | "attendance">(
    tabParam === "attendance" ? "attendance" : "timetable",
  );

  useEffect(() => {
    if (tabParam === "attendance" || tabParam === "timetable") {
      setTab(tabParam);
    }
  }, [tabParam]);

  const switchTab = (next: "timetable" | "attendance") => {
    setTab(next);
    setSearchParams({ tab: next }, { replace: true });
  };
  const [slots, setSlots] = useState<TimetableSlot[]>(loadTimetable);
  const [ocrOpen, setOcrOpen] = useState(false);
  const [blockOpen, setBlockOpen] = useState(false);
  const [ocrProcessing, setOcrProcessing] = useState(false);
  const [attPage, setAttPage] = useState(1);
  const [selectedColor, setSelectedColor] = useState(TIMETABLE_COLOR_PRESETS[0].hex);

  const summaries = user
    ? computeAttendanceSummaries(attendanceRecords, user.id)
    : [];
  const myRecords = user
    ? attendanceRecords.filter((r) => r.studentId === user.id)
    : [];
  const sortedRecords = [...myRecords].sort((a, b) => b.date.localeCompare(a.date));
  const attTotalPages = totalPages(sortedRecords.length, PAGE_SIZE);
  const attPageRows = paginate(sortedRecords, attPage, PAGE_SIZE);

  const overallPct =
    summaries.length > 0
      ? Math.round(summaries.reduce((s, c) => s + c.attendancePct, 0) / summaries.length)
      : 0;

  const chartData = summaries.map((s) => ({
    course: s.courseCode,
    attendance: s.attendancePct,
    eligible: s.eligible,
  }));

  const slotsByDay = useMemo(() => {
    const map: Record<string, TimetableSlot[]> = {};
    DAYS.forEach((d) => {
      map[d] = slots.filter((s) => s.day === d);
    });
    return map;
  }, [slots]);

  const applyOcr = () => {
    setOcrProcessing(true);
    setTimeout(() => {
      const merged = [
        ...slots,
        ...ocrExtractedTimetable.filter((o) => !slots.some((s) => s.id === o.id)),
      ];
      setSlots(merged);
      saveTimetable(merged);
      setOcrProcessing(false);
      setOcrOpen(false);
      toast.success("Timetable extracted (mock OCR).");
    }, 1200);
  };

  if (!user) return null;

  return (
    <div className="ds-page-scroll">
      <PageHeader
        title="Schedule & Attendance"
        subtitle="Weekly timetable, custom blocks, and attendance timeline"
      />

      <div className="ds-tab-bar">
        <button
          type="button"
          className={`ds-tab-btn${tab === "timetable" ? " active" : ""}`}
          onClick={() => switchTab("timetable")}
        >
          Timetable
        </button>
        <button
          type="button"
          className={`ds-tab-btn${tab === "attendance" ? " active" : ""}`}
          onClick={() => switchTab("attendance")}
        >
          Attendance
        </button>
      </div>

      {tab === "timetable" && (
        <>
          <div className="ds-form-actions" style={{ marginBottom: 16 }}>
            <button type="button" className="btn btn-primary btn-sm" onClick={() => setOcrOpen(true)}>
              Upload Timetable (OCR)
            </button>
            <button type="button" className="btn btn-success btn-sm" onClick={() => setBlockOpen(true)}>
              Add Time Block
            </button>
          </div>
          {ocrProcessing && (
            <p className="ds-text-secondary" style={{ marginBottom: 12 }}>
              Extracting schedule from image…
            </p>
          )}
          <DataCard label="Weekly Timetable">
            <div className="ds-timetable-scroll">
            <div className="ds-timetable-grid ds-timetable-compact">
              <div className="ds-tt-head" />
              {DAYS.map((d) => (
                <div key={d} className="ds-tt-head">
                  {d.slice(0, 3)}
                </div>
              ))}
              {TIME_SLOTS.map((hour) => (
                <Fragment key={hour}>
                  <div className="ds-tt-time">{hour}</div>
                  {DAYS.map((day) => {
                    const cellSlots = slotsByDay[day].filter((s) => slotFitsHour(s, hour));
                    return (
                      <div key={`${day}-${hour}`} className="ds-tt-cell">
                        {cellSlots.map((slot) => (
                          <div
                            key={slot.id}
                            className="ds-tt-slot"
                            style={{ background: slotColor(slot) }}
                            role="button"
                            tabIndex={0}
                            title="Click to remove"
                            onClick={() => {
                              if (!confirm(`Remove "${slot.title}"?`)) return;
                              const next = slots.filter((s) => s.id !== slot.id);
                              setSlots(next);
                              saveTimetable(next);
                            }}
                            onKeyDown={() => {}}
                          >
                            <div className="ds-tt-slot-title">{slot.title}</div>
                            <div className="ds-tt-slot-meta">
                              {slot.startTime}–{slot.endTime}
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </Fragment>
              ))}
            </div>
            </div>
          </DataCard>
        </>
      )}

      {tab === "attendance" && (
        <>
          <div className="ds-kpi-grid" style={{ marginBottom: 16 }}>
            <KpiCard label="Overall Rate" value={`${overallPct}%`} />
            <KpiCard label="Courses" value={summaries.length} />
          </div>

          <div className="ds-attendance-charts-connected">
            <DataCard label="Attendance Timeline" className="ds-attendance-chart-panel">
              <div className="ds-attendance-chart-area">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={attendanceTimeline} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
                    <CartesianGrid stroke="#E8EAF2" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#8A8FA8" }} />
                    <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: "#8A8FA8" }} unit="%" width={42} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="rate"
                      stroke="#5B6CF9"
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: "#5B6CF9" }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </DataCard>

            <DataCard label="By Course" className="ds-attendance-chart-panel">
              <div className="ds-attendance-chart-area">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
                    <CartesianGrid stroke="#E8EAF2" vertical={false} />
                    <XAxis dataKey="course" tick={{ fontSize: 11, fill: "#8A8FA8" }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#8A8FA8" }} width={42} />
                    <Tooltip />
                    <Bar dataKey="attendance" radius={[6, 6, 0, 0]} maxBarSize={48}>
                      {chartData.map((entry, i) => (
                        <Cell key={i} fill={entry.eligible ? "#5B6CF9" : "#D0D4F7"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </DataCard>
          </div>

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
                  {attPageRows.map((rec) => (
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
            <Pagination
              page={attPage}
              totalPages={attTotalPages}
              totalItems={sortedRecords.length}
              pageSize={PAGE_SIZE}
              onPageChange={setAttPage}
            />
          </DataCard>
        </>
      )}

      <DocumentUploadDialog
        open={ocrOpen}
        onClose={() => setOcrOpen(false)}
        title="Upload Timetable Image"
        fields={[]}
        submitLabel="Extract with OCR"
        onSubmit={async () => applyOcr()}
      />

      <DocumentUploadDialog
        open={blockOpen}
        onClose={() => setBlockOpen(false)}
        title="Add Time Block"
        fileRequired={false}
        showFileZone={false}
        submitLabel="Add to Timetable"
        extraContent={
          <div className="ds-form-group">
            <label className="ds-form-label">Block color</label>
            <div className="ds-color-picker">
              {TIMETABLE_COLOR_PRESETS.map((c) => (
                <button
                  key={c.hex}
                  type="button"
                  className={`ds-color-swatch${selectedColor === c.hex ? " selected" : ""}`}
                  style={{ background: c.hex }}
                  title={c.label}
                  onClick={() => setSelectedColor(c.hex)}
                />
              ))}
            </div>
          </div>
        }
        fields={[
          {
            name: "day",
            label: "Day",
            type: "select",
            required: true,
            options: DAYS.map((d) => ({ value: d, label: d })),
          },
          { name: "startTime", label: "Start", type: "text", required: true, placeholder: "08:00" },
          { name: "endTime", label: "End (max midnight)", type: "text", required: true, placeholder: "10:00" },
          { name: "title", label: "Title", type: "text", required: true, placeholder: "Study session" },
          { name: "location", label: "Location", type: "text" },
        ]}
        onSubmit={async (_file, values) => {
          if (!isValidTimeBlock(values.startTime, values.endTime)) {
            toast.error("Times must be between 08:00 and midnight (24:00), with end after start.");
            throw new Error("Invalid time range");
          }
          const slot: TimetableSlot = {
            id: `custom-${Date.now()}`,
            day: values.day as TimetableSlot["day"],
            startTime: values.startTime,
            endTime: values.endTime,
            title: values.title,
            location: values.location,
            type: "custom",
            color: selectedColor,
          };
          const next = [...slots, slot];
          setSlots(next);
          saveTimetable(next);
          toast.success("Block added.");
        }}
      />
    </div>
  );
}
