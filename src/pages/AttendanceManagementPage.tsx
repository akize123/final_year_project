import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  CheckCircle, XCircle, AlertTriangle, Users, UserCheck, Clock,
} from "lucide-react";
import { courseAttendanceData, computeAttendanceSummaries } from "@/data/attendance";

const ELIGIBILITY_THRESHOLD = 75;

const courses = [
  { code: "CS301", name: "Software Engineering" },
  { code: "IT201", name: "Web Development" },
];

const AttendanceManagementPage = () => {
  const [selectedCourse, setSelectedCourse] = useState("CS301");

  // Get all unique students for the selected course
  const courseRecords = courseAttendanceData.filter((r) => r.courseCode === selectedCourse);
  const studentIds = [...new Set(courseRecords.map((r) => r.studentId))];

  const summaries = studentIds.map((sid) => {
    const recs = courseRecords.filter((r) => r.studentId === sid);
    const present = recs.filter((r) => r.status === "present" || r.status === "late").length;
    const absent = recs.filter((r) => r.status === "absent").length;
    const late = recs.filter((r) => r.status === "late").length;
    const excused = recs.filter((r) => r.status === "excused").length;
    const total = recs.length;
    const pct = total > 0 ? Math.round(((present + excused) / total) * 100) : 0;
    return {
      studentId: sid,
      studentName: recs[0]?.studentName ?? "",
      campusId: recs[0]?.campusId ?? "",
      totalSessions: total,
      present: present - late, // corrected for double count
      absent,
      late,
      excused,
      attendancePct: pct,
      eligible: pct >= ELIGIBILITY_THRESHOLD,
    };
  });

  const eligible = summaries.filter((s) => s.eligible).length;
  const atRisk = summaries.filter((s) => !s.eligible).length;

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-heading font-bold text-foreground">Attendance Management</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Track student attendance. Students below {ELIGIBILITY_THRESHOLD}% are ineligible for exams.
            </p>
          </div>
          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger className="w-[240px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {courses.map((c) => (
                <SelectItem key={c.code} value={c.code}>
                  {c.code} — {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="group border-slate-100 shadow-xl shadow-slate-200/20 bg-white rounded-2xl overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
            <CardContent className="p-6 flex items-center gap-5">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#1d3557] group-hover:scale-110 transition-transform duration-500 shadow-sm border border-blue-100">
                <Users className="h-7 w-7" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800 tracking-tight">{summaries.length}</p>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Total Enrolled</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="group border-slate-100 shadow-xl shadow-slate-200/20 bg-white rounded-2xl overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
            <CardContent className="p-6 flex items-center gap-5">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 group-hover:scale-110 transition-transform duration-500 shadow-sm border border-emerald-100">
                <UserCheck className="h-7 w-7" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800 tracking-tight">{eligible}</p>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Exam Eligible</p>
              </div>
            </CardContent>
          </Card>

          <Card className={`group border-slate-100 shadow-xl shadow-slate-200/20 bg-white rounded-2xl overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 ${atRisk > 0 ? "ring-2 ring-red-100" : ""}`}>
            <CardContent className="p-6 flex items-center gap-5">
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${atRisk > 0 ? "bg-red-50 text-red-600 border-red-100" : "bg-slate-50 text-slate-400 border-slate-100"} group-hover:scale-110 transition-transform duration-500 shadow-sm border`}>
                <AlertTriangle className="h-7 w-7" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800 tracking-tight">{atRisk}</p>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">At Academic Risk</p>
              </div>
            </CardContent>
          </Card>

          <Card className="group border-slate-100 shadow-xl shadow-slate-200/20 bg-white rounded-2xl overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
            <CardContent className="p-6 flex items-center gap-5">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 group-hover:scale-110 transition-transform duration-500 shadow-sm border border-amber-100">
                <Clock className="h-7 w-7" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800 tracking-tight">
                  {summaries.length > 0 ? summaries[0].totalSessions : 0}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Lectures Held</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Student roster table */}
        <Card className="border-slate-200 shadow-xl shadow-slate-200/10 bg-white rounded-2xl overflow-hidden">
          <CardHeader className="pb-6 bg-slate-50/50 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-[15px] font-bold text-slate-800 tracking-tight">Student Attendance Roster</CardTitle>
                <CardDescription className="text-[11px] font-medium text-slate-400 uppercase tracking-widest mt-1">
                  {selectedCourse} — {courses.find((c) => c.code === selectedCourse)?.name}
                </CardDescription>
              </div>
              <Button size="sm" variant="outline" className="h-9 border-slate-200 bg-white text-[10px] font-bold uppercase tracking-widest gap-2 px-4 hover:text-[#1d3557] hover:border-[#1d3557]/30">
                <UserCheck className="h-3.5 w-3.5" /> Mark Today's Session
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/30">
                <TableRow className="hover:bg-transparent border-slate-50">
                  <TableHead className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 py-5 px-6">Student Identity</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 text-center">Stats</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Attendance Pipeline</TableHead>
                  <TableHead className="text-right text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 px-6">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {summaries
                  .sort((a, b) => a.attendancePct - b.attendancePct)
                  .map((s) => (
                    <TableRow key={s.studentId} className={`border-slate-50 transition-colors group ${!s.eligible ? "bg-red-50/30 hover:bg-red-50/50" : "hover:bg-slate-50/50"}`}>
                      <TableCell className="py-5 px-6">
                        <div className="flex flex-col">
                          <span className="text-[14px] font-bold text-slate-800 group-hover:text-[#1d3557] transition-colors">{s.studentName}</span>
                          <span className="text-[11px] font-bold font-mono text-slate-400">{s.campusId}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-3">
                          <div className="text-center px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-100">
                            <p className="text-[11px] font-bold text-emerald-600 leading-none">{s.present}</p>
                            <p className="text-[8px] font-bold text-emerald-400 uppercase tracking-tighter mt-1">Pres</p>
                          </div>
                          <div className="text-center px-3 py-1.5 rounded-lg bg-red-50 border border-red-100">
                            <p className="text-[11px] font-bold text-red-600 leading-none">{s.absent}</p>
                            <p className="text-[8px] font-bold text-red-400 uppercase tracking-tighter mt-1">Abs</p>
                          </div>
                          <div className="text-center px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-100">
                            <p className="text-[11px] font-bold text-amber-600 leading-none">{s.late}</p>
                            <p className="text-[8px] font-bold text-amber-400 uppercase tracking-tighter mt-1">Late</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="min-w-[200px]">
                        <div className="space-y-2">
                          <div className="flex justify-between items-end">
                            <span className={`text-[12px] font-bold ${s.attendancePct < ELIGIBILITY_THRESHOLD ? "text-red-500" : "text-[#1d3557]"}`}>{s.attendancePct}%</span>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{s.totalSessions} Total Sessions</span>
                          </div>
                          <Progress
                            value={s.attendancePct}
                            className={`h-2 rounded-full overflow-hidden bg-slate-100 ${s.attendancePct < ELIGIBILITY_THRESHOLD ? "[&>div]:bg-red-500" : "[&>div]:bg-[#1d3557]"}`}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-right px-6">
                        <Badge variant="outline" className={`text-[9px] font-bold uppercase tracking-[0.15em] px-3 py-1 border-0 shadow-sm ${
                          s.eligible
                            ? "bg-emerald-500 text-white"
                            : "bg-red-500 text-white"
                        }`}>
                          {s.eligible ? (
                            <><CheckCircle className="mr-1.5 h-3 w-3" /> Eligible</>
                          ) : (
                            <><XCircle className="mr-1.5 h-3 w-3" /> Ineligible</>
                          )}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default AttendanceManagementPage;
