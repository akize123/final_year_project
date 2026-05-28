import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  CheckCircle, AlertTriangle, UserCheck, TrendingUp,
} from "lucide-react";
import { attendanceRecords, computeAttendanceSummaries } from "@/data/attendance";
import {
  Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell,
} from "recharts";

const ELIGIBILITY_THRESHOLD = 75;

const statusConfig: Record<string, { label: string; className: string }> = {
  present: { label: "Present", className: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  absent: { label: "Absent", className: "bg-red-50 text-red-600 border-red-100" },
  late: { label: "Late", className: "bg-amber-50 text-amber-600 border-amber-100" },
  excused: { label: "Excused", className: "bg-blue-50 text-[#1d3557] border-blue-100" },
};

const MyAttendancePage = () => {
  const { user } = useAuth();
  if (!user) return null;

  const summaries = computeAttendanceSummaries(attendanceRecords, user.id);
  const myRecords = attendanceRecords.filter((r) => r.studentId === user.id);
  const overallPct = summaries.length > 0
    ? Math.round(summaries.reduce((s, c) => s + c.attendancePct, 0) / summaries.length)
    : 0;
  const allEligible = summaries.every((s) => s.eligible);

  const chartData = summaries.map((s) => ({
    course: s.courseCode,
    attendance: s.attendancePct,
    fill: s.eligible ? "#1d3557" : "#ef4444",
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="group border-slate-200 shadow-sm transition-all duration-300 hover:shadow-md hover:border-[#1d3557]/30 hover:-translate-y-1 bg-white">
          <CardContent className="p-6 flex items-center gap-5 text-left">
            <div className="relative flex h-20 w-20 shrink-0 items-center justify-center">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                <circle
                  cx="50" cy="50" r="40" fill="none"
                  stroke={overallPct >= ELIGIBILITY_THRESHOLD ? "#1d3557" : "#ef4444"}
                  strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={`${overallPct * 2.51} ${251 - overallPct * 2.51}`}
                  className="transition-all duration-1000"
                />
              </svg>
              <span className="absolute text-lg font-bold text-slate-800">{overallPct}%</span>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Cumulative Rate</p>
              <p className="text-sm font-bold text-slate-700 group-hover:text-[#1d3557] transition-colors">Overall Attendance</p>
              <p className="text-[11px] font-medium text-slate-500 mt-0.5">{summaries.length} active modules</p>
            </div>
          </CardContent>
        </Card>

        <Card className={`group border-slate-200 shadow-sm transition-all duration-300 hover:shadow-md hover:border-[#1d3557]/30 hover:-translate-y-1 bg-white ${allEligible ? "" : "ring-1 ring-red-400/20"}`}>
          <CardContent className="p-6 flex items-center gap-5 text-left">
            <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ${allEligible ? "bg-emerald-50" : "bg-red-50"}`}>
              {allEligible ? (
                <CheckCircle className="h-8 w-8 text-emerald-600" />
              ) : (
                <AlertTriangle className="h-8 w-8 text-red-600" />
              )}
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
              <p className="text-sm font-bold text-slate-700 group-hover:text-[#1d3557] transition-colors">
                {allEligible ? "Fully Eligible" : "Eligibility Alert"}
              </p>
              <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                {allEligible ? "Threshold requirements met" : `${summaries.filter(s => !s.eligible).length} modules below 75%`}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm transition-all duration-300 hover:shadow-md hover:border-[#1d3557]/30 bg-white">
          <CardContent className="p-6 grid grid-cols-2 gap-4">
            <div className="text-left">
              <p className="text-xl font-bold text-emerald-600">{myRecords.filter(r => r.status === "present").length}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Present</p>
            </div>
            <div className="text-left">
              <p className="text-xl font-bold text-red-600">{myRecords.filter(r => r.status === "absent").length}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Absent</p>
            </div>
            <div className="text-left">
              <p className="text-xl font-bold text-amber-600">{myRecords.filter(r => r.status === "late").length}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Late</p>
            </div>
            <div className="text-left">
              <p className="text-xl font-bold text-[#1d3557]">{myRecords.filter(r => r.status === "excused").length}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Excused</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Visual Analytics</h3>
              <p className="text-[11px] text-slate-500">Session participation by course code</p>
            </div>
            <TrendingUp className="h-4 w-4 text-slate-400" />
          </div>
          <CardContent className="pt-8">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData} margin={{ left: -20, right: 10, top: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="course" tickLine={false} axisLine={false} tickMargin={10} fontSize={10} fontWeight="bold" />
                <YAxis domain={[0, 100]} tickLine={false} axisLine={false} fontSize={10} unit="%" />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)", fontSize: 11, fontWeight: "bold" }}
                  cursor={{ fill: "#f8f9fa" }}
                />
                <Bar dataKey="attendance" radius={[6, 6, 0, 0]} maxBarSize={40}>
                  {chartData.map((entry, i) => (
                    <Cell key={`cell-${i}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-6 flex items-center justify-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-[#1d3557]" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Eligible</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-[#ef4444]" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">At Risk</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-50 bg-slate-50/30">
            <h3 className="text-sm font-bold text-slate-800">Session History</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Chronological log of all recorded sessions</p>
          </div>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="hover:bg-transparent border-slate-50">
                  <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-500 pl-6">Session Date</TableHead>
                  <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Course</TableHead>
                  <TableHead className="text-right text-[11px] font-bold uppercase tracking-wider text-slate-500 pr-6">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myRecords.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 10).map((rec) => {
                  const st = statusConfig[rec.status];
                  return (
                    <TableRow key={rec.id} className="group hover:bg-slate-50 transition-colors border-slate-50">
                      <TableCell className="pl-6 text-[12px] font-bold text-slate-700 whitespace-nowrap group-hover:text-[#1d3557]">
                        {new Date(rec.date).toLocaleDateString("en-US", { month: "short", day: "numeric", weekday: "short" })}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[9px] font-bold border-slate-200 text-slate-600 bg-white">{rec.courseCode}</Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <Badge variant="outline" className={`text-[9px] font-bold border-transparent ${st.className}`}>
                          {st.label}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {summaries.map((s) => (
          <Card key={s.courseCode} className={`group border-slate-200 shadow-sm transition-all duration-300 hover:shadow-md hover:border-[#1d3557]/30 bg-white ${!s.eligible ? "ring-1 ring-red-100" : ""}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[#1d3557]">
                  <UserCheck className="h-5 w-5" />
                </div>
                <Badge className={`text-[9px] font-bold uppercase tracking-[0.1em] border-transparent ${s.eligible ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>
                  {s.eligible ? "Eligible" : "Warning"}
                </Badge>
              </div>
              <div className="mb-4">
                <h4 className="text-[13px] font-bold text-slate-800 group-hover:text-[#1d3557] transition-colors truncate">{s.courseName}</h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.courseCode}</p>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Attendance Rate</span>
                  <span className={`text-sm font-bold ${s.eligible ? "text-[#1d3557]" : "text-red-600"}`}>{s.attendancePct}%</span>
                </div>
                <Progress value={s.attendancePct} className={`h-[3px] ${s.eligible ? "[&>div]:bg-[#1d3557]" : "[&>div]:bg-red-500"}`} />
                <div className="flex justify-between text-[10px] font-medium text-slate-500">
                  <span>{s.present + s.excused} of {s.totalSessions} sessions</span>
                  <span>Threshold: 75%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MyAttendancePage;
