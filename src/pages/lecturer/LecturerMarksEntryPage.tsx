import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { teachingLogEntries } from "@/data/teaching-log";
import { departments } from "@/data/departments";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMemo, useState } from "react";
import { format } from "date-fns";

type MarksStatus = "draft" | "submitted_to_hod";
type EvalStatus = "draft" | "submitted_to_hod";

interface MarkRow {
  campusId: string;
  studentName: string;
  cat?: number;
  exam?: number;
}

interface EvaluationReport {
  id: string;
  lecturerId: string;
  lecturerName: string;
  departmentCode: string;
  departmentName: string;
  semester: string;
  courseCode: string;
  courseName: string;
  title: string;
  notes: string;
  createdAt: string; // ISO
  status: EvalStatus;
}

interface MarksSheet {
  id: string;
  lecturerId: string;
  lecturerName: string;
  departmentCode: string;
  departmentName: string;
  semester: string;
  courseCode: string;
  courseName: string;
  maxCat: number;
  maxExam: number;
  createdAt: string; // ISO
  status: MarksStatus;
  rows: MarkRow[];
}

const STORAGE_KEY = "auca_marks_sheets_v1";
const EVAL_STORAGE_KEY = "auca_eval_reports_v1";

function loadSheets(): MarksSheet[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as MarksSheet[];
  } catch {
    return [];
  }
}

function saveSheets(items: MarksSheet[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore (e.g., storage disabled)
  }
}

function loadEvalReports(): EvaluationReport[] {
  try {
    const raw = localStorage.getItem(EVAL_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as EvaluationReport[];
  } catch {
    return [];
  }
}

function saveEvalReports(items: EvaluationReport[]) {
  try {
    localStorage.setItem(EVAL_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

function clampNumber(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function safeId() {
  try {
    const c = (globalThis as unknown as { crypto?: Crypto }).crypto;
    if (c?.randomUUID) return c.randomUUID();
  } catch {
    // ignore
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function gradeFromTotal(totalPct: number) {
  if (!Number.isFinite(totalPct)) return "—";
  if (totalPct >= 90) return "A+";
  if (totalPct >= 80) return "A";
  if (totalPct >= 75) return "B+";
  if (totalPct >= 70) return "B";
  if (totalPct >= 60) return "C";
  if (totalPct >= 50) return "D";
  return "F";
}

function parseCsvMarks(text: string) {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length === 0) return { rows: [] as MarkRow[], errors: ["CSV file is empty."] };

  const first = lines[0].toLowerCase();
  const hasHeader = first.includes("campus") || first.includes("student") || first.includes("cat") || first.includes("exam");
  const dataLines = hasHeader ? lines.slice(1) : lines;

  const rows: MarkRow[] = [];
  const errors: string[] = [];

  dataLines.forEach((line, index) => {
    const cols = line.split(",").map((c) => c.trim());
    const [campusId, studentName, catRaw, examRaw] = cols;
    if (!campusId || !studentName) {
      errors.push(`Row ${index + 1}: campusId and studentName are required.`);
      return;
    }
    const cat = catRaw === undefined || catRaw === "" ? undefined : Number(catRaw);
    const exam = examRaw === undefined || examRaw === "" ? undefined : Number(examRaw);
    if (cat !== undefined && Number.isNaN(cat)) errors.push(`Row ${index + 1}: CAT mark is not a number.`);
    if (exam !== undefined && Number.isNaN(exam)) errors.push(`Row ${index + 1}: Exam mark is not a number.`);
    rows.push({
      campusId,
      studentName,
      cat: cat === undefined || Number.isNaN(cat) ? undefined : cat,
      exam: exam === undefined || Number.isNaN(exam) ? undefined : exam,
    });
  });

  return { rows, errors };
}

const LecturerMarksEntryPage = () => {
  const { user } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [evalDialogOpen, setEvalDialogOpen] = useState(false);
  const [editingEvalId, setEditingEvalId] = useState<string | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<string>("");
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedDept, setSelectedDept] = useState<string>("");
  const [maxCat, setMaxCat] = useState<number>(40);
  const [maxExam, setMaxExam] = useState<number>(60);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvError, setCsvError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [evalTitle, setEvalTitle] = useState("");
  const [evalNotes, setEvalNotes] = useState("");

  const myTeaching = useMemo(() => {
    return teachingLogEntries
      .filter((e) => e.lecturerId === user?.id)
      .slice()
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [user?.id]);

  const semesters = useMemo(() => {
    const set = new Set(myTeaching.map((e) => e.semester).filter(Boolean));
    const list = Array.from(set).sort().reverse();
    return list.length ? list : ["2025-S1"];
  }, [myTeaching]);

  const coursesForSemester = useMemo(() => {
    const filtered = selectedSemester ? myTeaching.filter((e) => e.semester === selectedSemester) : myTeaching;
    const map = new Map<string, { courseCode: string; courseName: string }>();
    for (const e of filtered) {
      if (!map.has(e.courseCode)) map.set(e.courseCode, { courseCode: e.courseCode, courseName: e.courseName });
    }
    return Array.from(map.values()).sort((a, b) => a.courseCode.localeCompare(b.courseCode));
  }, [myTeaching, selectedSemester]);

  const defaultDeptCode = useMemo(() => {
    const byName = departments.find((d) => d.name === user?.department);
    return byName?.code ?? departments[0]?.code ?? "IT";
  }, [user?.department]);

  const selectedDepartment = useMemo(() => {
    const code = selectedDept || defaultDeptCode;
    return departments.find((d) => d.code === code) ?? departments[0];
  }, [defaultDeptCode, selectedDept]);

  const mySheets = useMemo(() => {
    if (!user) return [];
    return loadSheets()
      .filter((s) => s.lecturerId === user.id)
      .slice()
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [user, dialogOpen, isSaving]);

  const myEvalReports = useMemo(() => {
    if (!user) return [];
    return loadEvalReports()
      .filter((r) => r.lecturerId === user.id)
      .slice()
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [user, evalDialogOpen, isSaving]);

  const statusBadge = (status: MarksStatus) => {
    if (status === "submitted_to_hod") return "bg-blue-50 text-blue-700 border-blue-200";
    return "bg-slate-50 text-slate-700 border-slate-200";
  };

  const evalStatusBadge = (status: EvalStatus) => {
    if (status === "submitted_to_hod") return "bg-blue-50 text-blue-700 border-blue-200";
    return "bg-slate-50 text-slate-700 border-slate-200";
  };

  const resetForm = () => {
    setSelectedSemester("");
    setSelectedCourse("");
    setSelectedDept("");
    setMaxCat(40);
    setMaxExam(60);
    setCsvFile(null);
    setCsvError(null);
  };

  const resetEvalForm = () => {
    setEditingEvalId(null);
    setEvalTitle("");
    setEvalNotes("");
    setSelectedSemester("");
    setSelectedCourse("");
    setSelectedDept("");
  };

  const handleCreateSheet = async (status: MarksStatus) => {
    if (!user) return;
    const semester = selectedSemester || semesters[0];
    const course = coursesForSemester.find((c) => c.courseCode === selectedCourse) ?? coursesForSemester[0];
    const dept = selectedDepartment;
    if (!course) {
      toast.error("No course available", { description: "Add teaching log entries so we can detect your courses." });
      return;
    }

    const maxCatSafe = clampNumber(Number(maxCat) || 40, 0, 100);
    const maxExamSafe = clampNumber(Number(maxExam) || 60, 0, 100);

    setIsSaving(true);
    setCsvError(null);

    let rows: MarkRow[] = [];
    if (csvFile) {
      const text = await csvFile.text();
      const parsed = parseCsvMarks(text);
      if (parsed.errors.length) {
        setCsvError(parsed.errors.slice(0, 3).join(" "));
        setIsSaving(false);
        return;
      }
      rows = parsed.rows;
    }

    const sheet: MarksSheet = {
      id: safeId(),
      lecturerId: user.id,
      lecturerName: user.name,
      departmentCode: dept.code,
      departmentName: dept.name,
      semester,
      courseCode: course.courseCode,
      courseName: course.courseName,
      maxCat: maxCatSafe,
      maxExam: maxExamSafe,
      createdAt: new Date().toISOString(),
      status,
      rows,
    };

    const all = loadSheets();
    saveSheets([sheet, ...all]);

    setIsSaving(false);
    setDialogOpen(false);
    resetForm();

    toast.success(status === "submitted_to_hod" ? "Marks submitted to HOD" : "Marks saved as draft", {
      description: `${sheet.courseCode} • ${sheet.semester} • ${sheet.departmentCode}`,
    });
  };

  const openEvalDialog = (id?: string) => {
    if (!user) return;
    if (!id) {
      resetEvalForm();
      setEvalDialogOpen(true);
      return;
    }
    const existing = myEvalReports.find((r) => r.id === id);
    if (!existing) return;
    setEditingEvalId(existing.id);
    setEvalTitle(existing.title);
    setEvalNotes(existing.notes);
    setSelectedSemester(existing.semester);
    setSelectedCourse(existing.courseCode);
    setSelectedDept(existing.departmentCode);
    setEvalDialogOpen(true);
  };

  const handleSaveEval = (status: EvalStatus) => {
    if (!user) return;
    const semester = selectedSemester || semesters[0];
    const course = coursesForSemester.find((c) => c.courseCode === selectedCourse) ?? coursesForSemester[0];
    const dept = selectedDepartment;

    if (!course) {
      toast.error("No course available", { description: "Add teaching log entries so we can detect your courses." });
      return;
    }
    if (!evalTitle.trim()) {
      toast.error("Title required", { description: "Add a short report title." });
      return;
    }

    setIsSaving(true);

    const all = loadEvalReports();
    const nowIso = new Date().toISOString();
    const report: EvaluationReport = {
      id: editingEvalId ?? safeId(),
      lecturerId: user.id,
      lecturerName: user.name,
      departmentCode: dept.code,
      departmentName: dept.name,
      semester,
      courseCode: course.courseCode,
      courseName: course.courseName,
      title: evalTitle.trim(),
      notes: evalNotes.trim(),
      createdAt: editingEvalId ? (all.find((r) => r.id === editingEvalId)?.createdAt ?? nowIso) : nowIso,
      status,
    };

    const next = [report, ...all.filter((r) => r.id !== report.id)];
    saveEvalReports(next);

    setIsSaving(false);
    setEvalDialogOpen(false);
    resetEvalForm();

    toast.success(status === "submitted_to_hod" ? "Report submitted to HOD" : "Report saved as draft", {
      description: `${report.courseCode} • ${report.semester} • ${report.departmentCode}`,
    });
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-heading font-bold text-foreground">Marks & Evaluations</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Upload marks sheets per course, department, and semester for verification.
          </p>
        </div>

        <Tabs defaultValue="marks" className="space-y-4">
          <TabsList>
            <TabsTrigger value="marks">Marks Sheets</TabsTrigger>
            <TabsTrigger value="evaluations">Evaluation Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="marks">
            <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-heading font-bold text-foreground">Upload marks sheets</h2>
                </div>
              <Dialog
                open={dialogOpen}
                onOpenChange={(o) => {
                  setDialogOpen(o);
                  if (!o) resetForm();
                }}
              >
                 <DialogTrigger asChild>
                   <Button type="button" size="sm">Upload marks</Button>
                 </DialogTrigger>
                <DialogContent className="sm:max-w-[520px]">
                  <DialogHeader>
                    <DialogTitle>Upload marks sheet</DialogTitle>
                    <DialogDescription>
                      Select department, semester, and a course you teach, then upload your CSV for HOD verification.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 mt-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Department</Label>
                        <Select value={selectedDept || defaultDeptCode} onValueChange={setSelectedDept}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            {departments.map((d) => (
                              <SelectItem key={d.code} value={d.code}>
                                {d.code} — {d.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {selectedDepartment && (
                          <p className="text-[11px] text-muted-foreground">
                            HOD: {selectedDepartment.hodName} • {selectedDepartment.hodEmail}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Semester</Label>
                        <Select
                          value={selectedSemester || semesters[0]}
                          onValueChange={(v) => {
                            setSelectedSemester(v);
                            setSelectedCourse("");
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select semester" />
                          </SelectTrigger>
                          <SelectContent>
                            {semesters.map((s) => (
                              <SelectItem key={s} value={s}>
                                {s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Course</Label>
                        <Select
                          value={selectedCourse || coursesForSemester[0]?.courseCode || ""}
                          onValueChange={setSelectedCourse}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select course" />
                          </SelectTrigger>
                          <SelectContent>
                            {coursesForSemester.map((c) => (
                              <SelectItem key={c.courseCode} value={c.courseCode}>
                                {c.courseCode} — {c.courseName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Mark limits</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            type="number"
                            min={0}
                            max={100}
                            value={maxCat}
                            onChange={(e) => setMaxCat(Number(e.target.value))}
                            placeholder="Max CAT"
                          />
                          <Input
                            type="number"
                            min={0}
                            max={100}
                            value={maxExam}
                            onChange={(e) => setMaxExam(Number(e.target.value))}
                            placeholder="Max Exam"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>CSV upload</Label>
                      <Input type="file" accept=".csv,text/csv" onChange={(e) => setCsvFile(e.target.files?.[0] ?? null)} />
                      {csvError && <p className="text-xs text-destructive">{csvError}</p>}
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2">
                      <Button type="button" variant="outline" disabled={isSaving} onClick={() => handleCreateSheet("draft")}>
                        Save draft
                      </Button>
                      <Button type="button" disabled={isSaving} onClick={() => handleCreateSheet("submitted_to_hod")}>
                        Submit to HOD
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card className="border-border shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-heading font-bold text-foreground">My uploads</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-[11px] uppercase tracking-wider">Course</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider">Semester</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider">Dept</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider">Rows</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider">Status</TableHead>
                      <TableHead className="text-right text-[11px] uppercase tracking-wider">Uploaded</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mySheets.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                          No marks sheets uploaded yet.
                        </TableCell>
                      </TableRow>
                    ) : (
                      mySheets.map((s) => {
                        const totalMax = Math.max(1, s.maxCat + s.maxExam);
                        const filledRows = s.rows.filter((r) => r.cat !== undefined || r.exam !== undefined);
                        const avgPct = filledRows.length
                          ? Math.round(
                              filledRows.reduce((sum, r) => {
                                const cat = clampNumber(r.cat ?? 0, 0, s.maxCat);
                                const exam = clampNumber(r.exam ?? 0, 0, s.maxExam);
                                return sum + ((cat + exam) / totalMax) * 100;
                              }, 0) / filledRows.length,
                            )
                          : null;

                        return (
                          <TableRow key={s.id}>
                            <TableCell className="text-xs font-semibold text-foreground">
                              <div className="space-y-0.5">
                                <p className="leading-tight">
                                  {s.courseCode} — {s.courseName}
                                </p>
                                {avgPct !== null && (
                                  <p className="text-[10px] text-muted-foreground">Avg grade: {gradeFromTotal(avgPct)}</p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-xs text-foreground">{s.semester}</TableCell>
                            <TableCell className="text-xs text-foreground">{s.departmentCode}</TableCell>
                            <TableCell className="text-xs text-foreground">{s.rows.length}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={`text-[10px] ${statusBadge(s.status)}`}>
                                {s.status === "submitted_to_hod" ? "Submitted to HOD" : "Draft"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right text-[10px] text-muted-foreground">
                              {format(new Date(s.createdAt), "MMM d, yyyy")}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="evaluations">
            <div className="flex justify-end mb-3">
              <Button type="button" size="sm" onClick={() => openEvalDialog()}>
                Create New Report
              </Button>
            </div>
            <Card className="border-border shadow-sm">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-[11px] uppercase tracking-wider">Course</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider">Report Title</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider">Date</TableHead>
                      <TableHead className="text-center text-[11px] uppercase tracking-wider">Status</TableHead>
                      <TableHead className="text-right text-[11px] uppercase tracking-wider">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {myEvalReports.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                          No evaluation reports yet.
                        </TableCell>
                      </TableRow>
                    ) : (
                      myEvalReports.map((r) => (
                        <TableRow key={r.id}>
                          <TableCell className="text-xs font-semibold text-foreground">{r.courseCode}</TableCell>
                          <TableCell className="text-xs text-foreground">{r.title}</TableCell>
                          <TableCell className="text-[10px] text-muted-foreground">{format(new Date(r.createdAt), "MMM d, yyyy")}</TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline" className={`text-[10px] ${evalStatusBadge(r.status)}`}>
                              {r.status === "submitted_to_hod" ? "Submitted to HOD" : "Draft"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs"
                              onClick={() => openEvalDialog(r.id)}
                            >
                              {r.status === "draft" ? "Edit" : "View"}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Dialog
              open={evalDialogOpen}
              onOpenChange={(o) => {
                setEvalDialogOpen(o);
                if (!o) resetEvalForm();
              }}
            >
              <DialogContent className="sm:max-w-[560px]">
                <DialogHeader>
                  <DialogTitle>{editingEvalId ? "Evaluation report" : "Create evaluation report"}</DialogTitle>
                  <DialogDescription>
                    Select semester and course you teach, then save as draft or submit to HOD.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 mt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Department</Label>
                      <Select value={selectedDept || defaultDeptCode} onValueChange={setSelectedDept}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((d) => (
                            <SelectItem key={d.code} value={d.code}>
                              {d.code} â€” {d.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Semester</Label>
                      <Select
                        value={selectedSemester || semesters[0]}
                        onValueChange={(v) => {
                          setSelectedSemester(v);
                          setSelectedCourse("");
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select semester" />
                        </SelectTrigger>
                        <SelectContent>
                          {semesters.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                      <Label>Course</Label>
                      <Select value={selectedCourse || coursesForSemester[0]?.courseCode || ""} onValueChange={setSelectedCourse}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select course" />
                        </SelectTrigger>
                        <SelectContent>
                          {coursesForSemester.map((c) => (
                            <SelectItem key={c.courseCode} value={c.courseCode}>
                              {c.courseCode} â€” {c.courseName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                      <Label>Report title</Label>
                      <Input value={evalTitle} onChange={(e) => setEvalTitle(e.target.value)} placeholder="e.g., CAT moderation summary" />
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                      <Label>Notes</Label>
                      <Input value={evalNotes} onChange={(e) => setEvalNotes(e.target.value)} placeholder="Short notes / findings" />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <Button type="button" variant="outline" disabled={isSaving} onClick={() => handleSaveEval("draft")}>
                      Save draft
                    </Button>
                    <Button type="button" disabled={isSaving} onClick={() => handleSaveEval("submitted_to_hod")}>
                      Submit to HOD
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </TabsContent>

        </Tabs>
      </div>
    </AppLayout>
  );
};

export default LecturerMarksEntryPage;
