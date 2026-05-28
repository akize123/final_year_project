import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";

const internships = [
  { id: "int1", student: "Grace Uwimana", campusId: "AUCA-2022-0289", company: "BK TecHouse", position: "Mobile Developer Intern", supervisor: "Dr. Sarah Mugisha", startDate: "2024-06-01", endDate: "2024-09-30", status: "completed" as const, hasLetter: true, hasLogbook: true, hasReport: true, marks: 82 },
  { id: "int2", student: "Eric Habimana", campusId: "AUCA-2023-0198", company: "Irembo Ltd", position: "Backend Intern", supervisor: "Dr. Sarah Mugisha", startDate: "2024-06-15", endDate: "2024-09-15", status: "completed" as const, hasLetter: true, hasLogbook: true, hasReport: true, marks: 75 },
  { id: "int3", student: "Marie Claire N.", campusId: "AUCA-2023-0199", company: "MTN Rwanda", position: "Network Intern", supervisor: "Prof. Agnes Ntamwiza", startDate: "2025-01-15", endDate: "2025-04-15", status: "active" as const, hasLetter: true, hasLogbook: false, hasReport: false, marks: null },
  { id: "int4", student: "Patrick Kubwimana", campusId: "AUCA-2023-0200", company: "Andela Rwanda", position: "Full-Stack Intern", supervisor: "Dr. Sarah Mugisha", startDate: "2025-02-01", endDate: "2025-05-01", status: "active" as const, hasLetter: true, hasLogbook: false, hasReport: false, marks: null },
  { id: "int5", student: "David Mugabo", campusId: "AUCA-2023-0201", company: "RISA", position: "Cybersecurity Intern", supervisor: "Dr. Jean B. Niyonzima", startDate: "2025-01-10", endDate: "2025-04-10", status: "active" as const, hasLetter: true, hasLogbook: true, hasReport: false, marks: null },
  { id: "int6", student: "Claudine Ingabire", campusId: "AUCA-2023-0202", company: "Positivo BGH Rwanda", position: "Hardware Intern", supervisor: "Prof. Agnes Ntamwiza", startDate: "2025-03-01", endDate: "2025-06-01", status: "pending_report" as const, hasLetter: true, hasLogbook: true, hasReport: false, marks: null },
  { id: "int7", student: "Jean Paul H.", campusId: "AUCA-2023-0203", company: "None", position: "—", supervisor: "—", startDate: "—", endDate: "—", status: "not_started" as const, hasLetter: false, hasLogbook: false, hasReport: false, marks: null },
];

const statusLabels: Record<string, { label: string; cls: string }> = {
  completed: { label: "Completed", cls: "bg-emerald-500/10 text-emerald-700 border-emerald-400/30" },
  active: { label: "In Progress", cls: "bg-sky-500/10 text-sky-700 border-sky-400/30" },
  pending_report: { label: "Pending Report", cls: "bg-amber-500/10 text-amber-700 border-amber-400/30" },
  not_started: { label: "Not Started", cls: "bg-red-500/10 text-red-700 border-red-400/30" },
};

const HodInternshipsPage = () => {
  const [marksDialog, setMarksDialog] = useState<string | null>(null);
  const [marksValue, setMarksValue] = useState("");

  const completed = internships.filter(i => i.status === "completed").length;
  const active = internships.filter(i => i.status === "active").length;
  const pending = internships.filter(i => i.status === "pending_report").length;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-heading font-bold text-foreground">Internship Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track student internships, verify documents, and record internship marks for the IT Department.
          </p>
        </div>

        {/* Summary counters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Total Students", value: internships.length },
            { label: "Active Internships", value: active },
            { label: "Completed", value: completed },
            { label: "Pending Report", value: pending },
          ].map(s => (
            <Card key={s.label} className="border-border shadow-sm text-center">
              <CardContent className="p-4">
                <p className="text-2xl font-heading font-bold text-foreground">{s.value}</p>
                <p className="text-[10px] font-medium text-muted-foreground mt-1">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Internships</TabsTrigger>
            <TabsTrigger value="marks">Upload Marks</TabsTrigger>
            <TabsTrigger value="documents">Document Status</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <Card className="border-border shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-heading">Department Internships — 2024/2025</CardTitle>
                <CardDescription>{internships.length} students tracked</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-[11px] uppercase tracking-wider">Student</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider">Company</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider">Supervisor</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider">Period</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider">Status</TableHead>
                      <TableHead className="text-right text-[11px] uppercase tracking-wider">Marks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {internships.map(i => {
                      const st = statusLabels[i.status];
                      return (
                        <TableRow key={i.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-[10px] font-semibold">
                                {i.student.split(" ").map(n => n[0]).join("").slice(0, 2)}
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-foreground">{i.student}</p>
                                <p className="text-[10px] text-muted-foreground">{i.campusId}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="text-xs text-foreground">{i.company}</p>
                            <p className="text-[10px] text-muted-foreground">{i.position}</p>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">{i.supervisor}</TableCell>
                          <TableCell className="text-[10px] text-muted-foreground">
                            {i.startDate === "—" ? "—" : `${i.startDate} to ${i.endDate}`}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={`text-[10px] ${st.cls}`}>{st.label}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {i.marks !== null ? (
                              <span className="text-sm font-mono font-bold text-foreground">{i.marks}/100</span>
                            ) : i.status === "completed" || i.status === "pending_report" ? (
                              <Button size="sm" variant="outline" className="h-6 text-[10px]" onClick={() => { setMarksDialog(i.id); setMarksValue(""); }}>
                                Enter Marks
                              </Button>
                            ) : (
                              <span className="text-[10px] text-muted-foreground">—</span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="marks">
            <Card className="border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm font-heading">Internship Marks Entry</CardTitle>
                <CardDescription>Upload or update marks for completed internships</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-[11px] uppercase tracking-wider">Student</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider">Company</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider">Docs Submitted</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider">Marks</TableHead>
                      <TableHead className="text-right text-[11px] uppercase tracking-wider">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {internships.filter(i => i.status === "completed" || i.status === "pending_report").map(i => (
                      <TableRow key={i.id}>
                        <TableCell className="text-xs font-semibold text-foreground">{i.student}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{i.company}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Badge variant="outline" className={`text-[9px] ${i.hasLetter ? "bg-emerald-50 text-emerald-700 border-emerald-300" : "bg-red-50 text-red-700 border-red-300"}`}>
                              Letter {i.hasLetter ? "Yes" : "No"}
                            </Badge>
                            <Badge variant="outline" className={`text-[9px] ${i.hasLogbook ? "bg-emerald-50 text-emerald-700 border-emerald-300" : "bg-red-50 text-red-700 border-red-300"}`}>
                              Logbook {i.hasLogbook ? "Yes" : "No"}
                            </Badge>
                            <Badge variant="outline" className={`text-[9px] ${i.hasReport ? "bg-emerald-50 text-emerald-700 border-emerald-300" : "bg-red-50 text-red-700 border-red-300"}`}>
                              Report {i.hasReport ? "Yes" : "No"}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm font-mono font-bold">{i.marks !== null ? `${i.marks}/100` : "—"}</TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => { setMarksDialog(i.id); setMarksValue(i.marks?.toString() ?? ""); }}>
                            {i.marks !== null ? "Update" : "Enter Marks"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card className="border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm font-heading">Internship Document Tracker</CardTitle>
                <CardDescription>Required: Acceptance Letter, Logbook, Final Report</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {internships.filter(i => i.status !== "not_started").map(i => {
                    const docsComplete = [i.hasLetter, i.hasLogbook, i.hasReport].filter(Boolean).length;
                    return (
                      <div key={i.id} className="rounded-lg border border-border p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="text-sm font-semibold text-foreground">{i.student}</p>
                            <p className="text-[10px] text-muted-foreground">{i.company} — {i.position}</p>
                          </div>
                          <span className="text-xs font-bold text-foreground">{docsComplete}/3 documents</span>
                        </div>
                        <Progress value={(docsComplete / 3) * 100} className={`h-1.5 ${docsComplete < 3 ? "[&>div]:bg-amber-500" : ""}`} />
                        <div className="grid grid-cols-3 gap-2 mt-3">
                          {[
                            { label: "Acceptance Letter", ok: i.hasLetter },
                            { label: "Logbook", ok: i.hasLogbook },
                            { label: "Final Report", ok: i.hasReport },
                          ].map(doc => (
                            <div key={doc.label} className={`rounded-md border px-3 py-2 text-center text-[10px] font-medium ${doc.ok ? "border-emerald-300 bg-emerald-50 text-emerald-700" : "border-red-300 bg-red-50 text-red-700"}`}>
                              {doc.label}: {doc.ok ? "Submitted" : "Missing"}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Marks entry dialog */}
        <Dialog open={!!marksDialog} onOpenChange={() => setMarksDialog(null)}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Enter Internship Marks</DialogTitle>
              <DialogDescription>
                {internships.find(i => i.id === marksDialog)?.student} — {internships.find(i => i.id === marksDialog)?.company}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label>Marks (out of 100)</Label>
                <Input type="number" min={0} max={100} value={marksValue} onChange={e => setMarksValue(e.target.value)} className="mt-1" />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setMarksDialog(null)}>Cancel</Button>
                <Button onClick={() => { toast.success("Marks saved successfully"); setMarksDialog(null); }}>Save Marks</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default HodInternshipsPage;
