import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

const moderationItems = [
  { id: "mm1", course: "CS301", courseName: "Software Engineering", lecturer: "Dr. Sarah Mugisha", originalAvg: 68, moderatedAvg: 70, adjustment: "+2", status: "approved", moderator: "Prof. Agnes Ntamwiza", date: "2025-03-12" },
  { id: "mm2", course: "IT201", courseName: "Web Development", lecturer: "Dr. Sarah Mugisha", originalAvg: 71, moderatedAvg: 71, adjustment: "0", status: "approved", moderator: "Dr. Jean B. Niyonzima", date: "2025-03-13" },
  { id: "mm3", course: "CS401", courseName: "Machine Learning", lecturer: "Prof. Agnes Ntamwiza", originalAvg: 55, moderatedAvg: 58, adjustment: "+3", status: "pending", moderator: "—", date: "—" },
  { id: "mm4", course: "ENG301", courseName: "Circuit Design", lecturer: "Dr. Jean B. Niyonzima", originalAvg: 62, moderatedAvg: null, adjustment: "—", status: "pending", moderator: "—", date: "—" },
];

const plagiarismList = [
  { student: "Student A", campusId: "AUCA-2023-0210", document: "Final Year Project Report", similarity: 32, tool: "Turnitin", status: "flagged", date: "Mar 14, 2025" },
  { student: "Student B", campusId: "AUCA-2023-0215", document: "Research Paper — AI in Agriculture", similarity: 18, tool: "Turnitin", status: "cleared", date: "Mar 12, 2025" },
  { student: "Student C", campusId: "AUCA-2023-0220", document: "Internship Final Report", similarity: 45, tool: "Turnitin", status: "under_review", date: "Mar 15, 2025" },
];

const warningsList = [
  { student: "Eric Habimana", campusId: "AUCA-2023-0198", reason: "GPA below 2.0 for two consecutive semesters", level: "Probation", date: "Mar 01, 2025" },
  { student: "Student D", campusId: "AUCA-2023-0225", reason: "Attendance below 60% in 3 courses", level: "Warning", date: "Feb 28, 2025" },
  { student: "Student E", campusId: "AUCA-2023-0230", reason: "Failed to submit required clearance documents", level: "Warning", date: "Mar 05, 2025" },
];

const HodMarksModeration = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-heading font-bold text-foreground">Marks Moderation and Academic Integrity</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Review moderated marks, plagiarism reports, and academic warnings across the department.
          </p>
        </div>

        {/* Marks Moderation */}
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-heading">Marks Moderation Reports</CardTitle>
                <CardDescription>Grade adjustments after external moderation</CardDescription>
              </div>
              <Button size="sm" variant="outline" onClick={() => toast.success("Moderation report exported")}>Export</Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[11px] uppercase tracking-wider">Course</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider">Lecturer</TableHead>
                  <TableHead className="text-center text-[11px] uppercase tracking-wider">Original Avg</TableHead>
                  <TableHead className="text-center text-[11px] uppercase tracking-wider">Moderated Avg</TableHead>
                  <TableHead className="text-center text-[11px] uppercase tracking-wider">Adjustment</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider">Moderator</TableHead>
                  <TableHead className="text-center text-[11px] uppercase tracking-wider">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {moderationItems.map(m => (
                  <TableRow key={m.id} className={m.status === "pending" ? "bg-amber-50/30" : ""}>
                    <TableCell>
                      <span className="text-xs font-semibold text-foreground">{m.course}</span>
                      <span className="block text-[10px] text-muted-foreground">{m.courseName}</span>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{m.lecturer}</TableCell>
                    <TableCell className="text-center text-sm font-mono font-bold">{m.originalAvg}%</TableCell>
                    <TableCell className="text-center text-sm font-mono font-bold">{m.moderatedAvg ?? "—"}%</TableCell>
                    <TableCell className="text-center text-xs font-mono text-foreground">{m.adjustment}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{m.moderator}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className={`text-[10px] ${m.status === "approved" ? "bg-emerald-50 text-emerald-700 border-emerald-300" : "bg-amber-50 text-amber-700 border-amber-300"}`}>
                        {m.status === "approved" ? "Approved" : "Pending"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Plagiarism */}
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-heading">Plagiarism Detection Results</CardTitle>
            <CardDescription>Documents flagged by similarity detection tools</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[11px] uppercase tracking-wider">Student</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider">Document</TableHead>
                  <TableHead className="text-center text-[11px] uppercase tracking-wider">Similarity</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider">Tool</TableHead>
                  <TableHead className="text-center text-[11px] uppercase tracking-wider">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plagiarismList.map((p, i) => (
                  <TableRow key={i} className={p.similarity >= 30 ? "bg-red-50/30" : ""}>
                    <TableCell>
                      <p className="text-xs font-semibold text-foreground">{p.student}</p>
                      <p className="text-[10px] text-muted-foreground">{p.campusId}</p>
                    </TableCell>
                    <TableCell className="text-xs text-foreground">{p.document}</TableCell>
                    <TableCell className="text-center">
                      <span className={`text-sm font-mono font-bold ${p.similarity >= 30 ? "text-red-700" : p.similarity >= 15 ? "text-amber-700" : "text-emerald-700"}`}>{p.similarity}%</span>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{p.tool}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className={`text-[10px] ${
                        p.status === "flagged" ? "bg-red-50 text-red-700 border-red-300" :
                        p.status === "cleared" ? "bg-emerald-50 text-emerald-700 border-emerald-300" :
                        "bg-amber-50 text-amber-700 border-amber-300"
                      }`}>
                        {p.status === "under_review" ? "Under Review" : p.status === "flagged" ? "Flagged" : "Cleared"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Academic warnings */}
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-heading">Academic Warnings and Probation</CardTitle>
            <CardDescription>Students on academic warning or probation status</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[11px] uppercase tracking-wider">Student</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider">Reason</TableHead>
                  <TableHead className="text-center text-[11px] uppercase tracking-wider">Level</TableHead>
                  <TableHead className="text-right text-[11px] uppercase tracking-wider">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {warningsList.map((w, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <p className="text-xs font-semibold text-foreground">{w.student}</p>
                      <p className="text-[10px] text-muted-foreground">{w.campusId}</p>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-[250px]">{w.reason}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className={`text-[10px] ${w.level === "Probation" ? "bg-red-50 text-red-700 border-red-300" : "bg-amber-50 text-amber-700 border-amber-300"}`}>
                        {w.level}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-[10px] text-muted-foreground">{w.date}</TableCell>
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

export default HodMarksModeration;
