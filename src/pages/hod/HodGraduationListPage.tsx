import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

const graduatingStudents = [
  { id: "gs1", name: "Grace Uwimana", campusId: "AUCA-2022-0289", gpa: 3.72, credits: 142, finClearance: true, libClearance: true, deptClearance: true, internship: true, project: true, status: "eligible" },
  { id: "gs2", name: "Eric Habimana", campusId: "AUCA-2023-0198", gpa: 3.41, credits: 140, finClearance: true, libClearance: true, deptClearance: true, internship: true, project: true, status: "eligible" },
  { id: "gs3", name: "Patrick Kubwimana", campusId: "AUCA-2023-0200", gpa: 3.15, credits: 138, finClearance: true, libClearance: false, deptClearance: true, internship: true, project: false, status: "pending" },
  { id: "gs4", name: "Marie Claire N.", campusId: "AUCA-2023-0199", gpa: 3.55, credits: 142, finClearance: true, libClearance: true, deptClearance: true, internship: false, project: true, status: "pending" },
  { id: "gs5", name: "David Mugabo", campusId: "AUCA-2023-0201", gpa: 2.89, credits: 136, finClearance: false, libClearance: true, deptClearance: true, internship: true, project: true, status: "pending" },
  { id: "gs6", name: "Joseph Nsengimana", campusId: "AUCA-2023-0204", gpa: 3.25, credits: 142, finClearance: true, libClearance: true, deptClearance: true, internship: true, project: true, status: "eligible" },
  { id: "gs7", name: "Claudine Ingabire", campusId: "AUCA-2023-0202", gpa: 2.45, credits: 130, finClearance: true, libClearance: false, deptClearance: false, internship: false, project: false, status: "not_eligible" },
];

const check = (ok: boolean) => ok ? "Yes" : "No";
const checkCls = (ok: boolean) => ok
  ? "bg-emerald-50 text-emerald-700 border-emerald-300"
  : "bg-red-50 text-red-700 border-red-300";

const HodGraduationListPage = () => {
  const eligible = graduatingStudents.filter(s => s.status === "eligible").length;
  const pending = graduatingStudents.filter(s => s.status === "pending").length;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-heading font-bold text-foreground">Graduation Lists</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Students eligible for graduation — May 2025 ceremony. Verify clearance status across all departments.
            </p>
          </div>
          <Button onClick={() => toast.success("Graduation list exported to PDF")}>Export List</Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Total Candidates", value: graduatingStudents.length },
            { label: "Fully Eligible", value: eligible },
            { label: "Pending Clearance", value: pending },
            { label: "Not Eligible", value: graduatingStudents.length - eligible - pending },
          ].map(s => (
            <Card key={s.label} className="border-border shadow-sm text-center">
              <CardContent className="p-4">
                <p className="text-2xl font-heading font-bold text-foreground">{s.value}</p>
                <p className="text-[10px] font-medium text-muted-foreground mt-1">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-heading">Graduation Clearance Status</CardTitle>
            <CardDescription>All clearance requirements must be met for eligibility</CardDescription>
          </CardHeader>
          <CardContent className="pt-0 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[11px] uppercase tracking-wider">Student</TableHead>
                  <TableHead className="text-center text-[11px] uppercase tracking-wider">GPA</TableHead>
                  <TableHead className="text-center text-[11px] uppercase tracking-wider">Credits</TableHead>
                  <TableHead className="text-center text-[11px] uppercase tracking-wider">Finance</TableHead>
                  <TableHead className="text-center text-[11px] uppercase tracking-wider">Library</TableHead>
                  <TableHead className="text-center text-[11px] uppercase tracking-wider">Dept</TableHead>
                  <TableHead className="text-center text-[11px] uppercase tracking-wider">Internship</TableHead>
                  <TableHead className="text-center text-[11px] uppercase tracking-wider">Project</TableHead>
                  <TableHead className="text-center text-[11px] uppercase tracking-wider">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {graduatingStudents.map(s => (
                  <TableRow key={s.id} className={s.status === "not_eligible" ? "bg-red-50/30" : s.status === "pending" ? "bg-amber-50/30" : ""}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-[10px] font-semibold">
                          {s.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-foreground">{s.name}</p>
                          <p className="text-[10px] text-muted-foreground">{s.campusId}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center text-xs font-mono font-bold text-foreground">{s.gpa.toFixed(2)}</TableCell>
                    <TableCell className="text-center text-xs font-mono text-muted-foreground">{s.credits}/142</TableCell>
                    <TableCell className="text-center"><Badge variant="outline" className={`text-[9px] ${checkCls(s.finClearance)}`}>{check(s.finClearance)}</Badge></TableCell>
                    <TableCell className="text-center"><Badge variant="outline" className={`text-[9px] ${checkCls(s.libClearance)}`}>{check(s.libClearance)}</Badge></TableCell>
                    <TableCell className="text-center"><Badge variant="outline" className={`text-[9px] ${checkCls(s.deptClearance)}`}>{check(s.deptClearance)}</Badge></TableCell>
                    <TableCell className="text-center"><Badge variant="outline" className={`text-[9px] ${checkCls(s.internship)}`}>{check(s.internship)}</Badge></TableCell>
                    <TableCell className="text-center"><Badge variant="outline" className={`text-[9px] ${checkCls(s.project)}`}>{check(s.project)}</Badge></TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className={`text-[10px] ${
                        s.status === "eligible" ? "bg-emerald-500/10 text-emerald-700 border-emerald-400/30" :
                        s.status === "pending" ? "bg-amber-500/10 text-amber-700 border-amber-400/30" :
                        "bg-red-500/10 text-red-700 border-red-400/30"
                      }`}>
                        {s.status === "eligible" ? "Eligible" : s.status === "pending" ? "Pending" : "Not Eligible"}
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

export default HodGraduationListPage;
