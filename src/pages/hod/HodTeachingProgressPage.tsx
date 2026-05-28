import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { teachingLogEntries, SEMESTER_TOTAL_SESSIONS } from "@/data/teaching-log";
import { courseSyllabi } from "@/data/exam-papers";

const lecturers = [
  { id: "u2", name: "Dr. Sarah Mugisha", initials: "SM", courses: ["CS301", "IT201"] },
  { id: "u9", name: "Prof. Agnes Ntamwiza", initials: "AN", courses: ["CS401"] },
  { id: "u10", name: "Dr. Jean B. Niyonzima", initials: "JN", courses: ["ENG301"] },
  { id: "u11", name: "Mr. Patrick Mugisha", initials: "PM", courses: ["IT101"] },
  { id: "u12", name: "Dr. Celestin Hakizimana", initials: "CH", courses: ["BUS301"] },
];

const HodTeachingProgressPage = () => {
  const lecturerData = lecturers.map(lec => {
    const entries = teachingLogEntries.filter(e => e.lecturerId === lec.id);
    const byCourse: Record<string, { count: number; topics: string[] }> = {};
    entries.forEach(e => {
      if (!byCourse[e.courseCode]) byCourse[e.courseCode] = { count: 0, topics: [] };
      byCourse[e.courseCode].count++;
      byCourse[e.courseCode].topics.push(e.topicsCovered);
    });
    const totalLogged = entries.length;
    const logPct = Math.round((totalLogged / SEMESTER_TOTAL_SESSIONS) * 100);
    return { ...lec, entries, byCourse, totalLogged, logPct };
  });

  const overallSessionsLogged = lecturerData.reduce((s, l) => s + l.totalLogged, 0);
  const totalExpected = lecturers.length * SEMESTER_TOTAL_SESSIONS;
  const overallPct = Math.round((overallSessionsLogged / totalExpected) * 100);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-heading font-bold text-foreground">Teaching Progress Report</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor teaching log completion and syllabus coverage across all lecturers in the department.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Total Sessions Logged", value: overallSessionsLogged },
            { label: "Expected This Semester", value: totalExpected },
            { label: "Department Average", value: `${overallPct}%` },
            { label: "Active Lecturers", value: lecturers.length },
          ].map(s => (
            <Card key={s.label} className="border-border shadow-sm text-center">
              <CardContent className="p-4">
                <p className="text-2xl font-heading font-bold text-foreground">{s.value}</p>
                <p className="text-[10px] font-medium text-muted-foreground mt-1">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Per-lecturer breakdown */}
        {lecturerData.map(lec => (
          <Card key={lec.id} className="border-border shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-xs font-semibold">{lec.initials}</div>
                <div className="flex-1">
                  <CardTitle className="text-sm font-heading">{lec.name}</CardTitle>
                  <CardDescription>{lec.courses.join(", ")} · {lec.totalLogged}/{SEMESTER_TOTAL_SESSIONS} sessions ({lec.logPct}%)</CardDescription>
                </div>
                <Badge variant="outline" className={`text-[10px] ${lec.logPct >= 70 ? "bg-emerald-50 text-emerald-700 border-emerald-300" : lec.logPct >= 40 ? "bg-amber-50 text-amber-700 border-amber-300" : "bg-red-50 text-red-700 border-red-300"}`}>
                  {lec.logPct >= 70 ? "On Track" : lec.logPct >= 40 ? "Behind" : "Critical"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Progress value={lec.logPct} className={`h-2 ${lec.logPct < 40 ? "[&>div]:bg-red-500" : lec.logPct < 70 ? "[&>div]:bg-amber-500" : ""}`} />

              {/* Course-level syllabus matching */}
              {Object.entries(lec.byCourse).map(([code, data]) => {
                const syllabus = courseSyllabi.find(s => s.courseCode === code);
                return (
                  <div key={code} className="rounded-lg border border-border p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-foreground">{code} — {data.count} sessions</span>
                      {syllabus && (
                        <span className="text-[10px] text-muted-foreground">{syllabus.topics.length} syllabus topics</span>
                      )}
                    </div>
                    {syllabus && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                        {syllabus.topics.map(topic => {
                          const covered = data.topics.some(t =>
                            t.toLowerCase().includes(topic.toLowerCase().split(" ")[0]) ||
                            topic.toLowerCase().includes(t.toLowerCase().split(" ")[0])
                          );
                          return (
                            <div key={topic} className={`rounded-md border px-2 py-1.5 text-[10px] ${covered ? "border-emerald-300/50 bg-emerald-50/50 text-emerald-700" : "border-red-300/50 bg-red-50/50 text-red-700"}`}>
                              <span className="font-semibold">{covered ? "DONE" : "PENDING"}</span> {topic}
                            </div>
                          );
                        })}
                      </div>
                    )}
                    {!syllabus && (
                      <Table>
                        <TableHeader><TableRow><TableHead className="text-[11px]">Date</TableHead><TableHead className="text-[11px]">Topic</TableHead></TableRow></TableHeader>
                        <TableBody>
                          {lec.entries.filter(e => e.courseCode === code).map(e => (
                            <TableRow key={e.id}>
                              <TableCell className="text-[10px] text-muted-foreground">{e.date}</TableCell>
                              <TableCell className="text-xs text-foreground">{e.topicsCovered}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        ))}
      </div>
    </AppLayout>
  );
};

export default HodTeachingProgressPage;
