import { useState } from "react";
import { toast } from "sonner";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CalendarClock, MapPin, Users, Download, CheckCircle, Plus, Trash2, UploadCloud, Sparkles, AlertTriangle, Printer, Truck
} from "lucide-react";
import { examTimetable } from "@/data/academic-records";
import type { ExamTimetableEntry } from "@/types";
import { useLocation, useNavigate } from "react-router-dom";

const initialApprovedPapers = [
  { id: "ap1", courseCode: "CS301", title: "Software Engineering Final", approvedBy: "Registrar Office", approvalDate: "2025-04-20", printStatus: "Ready" },
  { id: "ap2", courseCode: "IT201", title: "Web Development Final", approvedBy: "Registrar Office", approvalDate: "2025-04-21", printStatus: "Printed" },
];

// Compact Pagination Component Helper
const Pagination = ({ current, total, onChange }: { current: number; total: number; onChange: (p: number) => void }) => {
  if (total <= 1) return null;
  return (
    <div className="flex items-center justify-between border-t border-slate-100 px-6 py-3 bg-slate-50/50 flex-shrink-0">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Page {current} of {total}</p>
      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          disabled={current === 1}
          onClick={() => onChange(current - 1)}
          className="h-7 px-3 text-[9px] font-bold uppercase tracking-wider border-slate-200"
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={current === total}
          onClick={() => onChange(current + 1)}
          className="h-7 px-3 text-[9px] font-bold uppercase tracking-wider border-slate-200"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

const ExamOfficePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const activeTab = location.pathname.includes("timetable")
    ? "timetable"
    : location.pathname.includes("approved")
      ? "approved"
      : location.pathname.includes("invigilators")
        ? "invigilators"
        : location.pathname.includes("venues")
          ? "venues"
          : location.pathname.includes("clashes")
            ? "clashes"
            : "timetable";

  // Shared State loaders from LocalStorage
  const [timetable, setTimetable] = useState<ExamTimetableEntry[]>(() => {
    const stored = localStorage.getItem("auca_exam_timetable");
    if (stored) {
      try { return JSON.parse(stored); } catch (e) { console.error(e); }
    }
    localStorage.setItem("auca_exam_timetable", JSON.stringify(examTimetable));
    return examTimetable;
  });

  const [approved, setApproved] = useState(() => {
    const stored = localStorage.getItem("auca_approved_papers");
    if (stored) return JSON.parse(stored);
    return initialApprovedPapers;
  });

  const [invigilators, setInvigilators] = useState(() => {
    const stored = localStorage.getItem("auca_invigilators");
    if (stored) return JSON.parse(stored);
    const initial = [
      { id: "inv1", name: "Dr. Sarah Mugisha", department: "Information Technology", assignedHours: 12, status: "On Duty", substitute: "" },
      { id: "inv2", name: "Prof. Agnes Ntamwiza", department: "Software Engineering", assignedHours: 9, status: "On Duty", substitute: "" },
      { id: "inv3", name: "Dr. Jean B. Niyonzima", department: "Networking", assignedHours: 6, status: "On Duty", substitute: "" },
      { id: "inv4", name: "Mr. Patrick Mugisha", department: "Information Technology", assignedHours: 15, status: "Excused", substitute: "Dr. Sarah Mugisha" },
      { id: "inv5", name: "Dr. Claire M.", department: "Business Administration", assignedHours: 8, status: "On Duty", substitute: "" },
    ];
    localStorage.setItem("auca_invigilators", JSON.stringify(initial));
    return initial;
  });

  const [venues, setVenues] = useState(() => {
    const stored = localStorage.getItem("auca_venues");
    if (stored) return JSON.parse(stored);
    const initial = [
      { id: "ven1", name: "AUCA Hall A", capacity: 120, computerEquipped: false, status: "Active" },
      { id: "ven2", name: "AUCA Hall B", capacity: 100, computerEquipped: true, status: "Active" },
      { id: "ven3", name: "Engineering Lab", capacity: 60, computerEquipped: true, status: "Active" },
      { id: "ven4", name: "Business Hall", capacity: 80, computerEquipped: false, status: "Maintenance" },
      { id: "ven5", name: "AUCA Hall C", capacity: 200, computerEquipped: false, status: "Active" },
    ];
    localStorage.setItem("auca_venues", JSON.stringify(initial));
    return initial;
  });

  const [clashes, setClashes] = useState(() => {
    const stored = localStorage.getItem("auca_exam_clashes");
    if (stored) return JSON.parse(stored);
    const initial = [
      { id: "clash1", studentId: "AUCA-24018", studentName: "Jean Pierre Habimana", course1: "CS301", course2: "IT201", date: "2025-05-12", time: "08:00", status: "Conflict Detected" },
      { id: "clash2", studentId: "AUCA-24041", studentName: "Diane Mutoni", course1: "ENG301", course2: "CS401", date: "2025-05-18", time: "08:00", status: "Conflict Detected" },
    ];
    localStorage.setItem("auca_exam_clashes", JSON.stringify(initial));
    return initial;
  });

  // Pagination states
  const [timetablePage, setTimetablePage] = useState(1);
  const [approvedPage, setApprovedPage] = useState(1);
  const [invigilatorsPage, setInvigilatorsPage] = useState(1);
  const [venuesPage, setVenuesPage] = useState(1);
  const [clashesPage, setClashesPage] = useState(1);
  const [showVenueForm, setShowVenueForm] = useState(false);

  const ITEMS_PER_PAGE = 3;

  // Active Handlers

  // 1. Timetable Clear/Import
  const handleClearTimetable = () => {
    setTimetable([]);
    setTimetablePage(1);
    localStorage.setItem("auca_exam_timetable", JSON.stringify([]));
    toast.error("Timetable cleared!", {
      description: "All scheduled exams have been removed from the database.",
    });
  };

  const handleAddEntry = (newEntry: Omit<ExamTimetableEntry, "id">) => {
    const entryWithId: ExamTimetableEntry = {
      ...newEntry,
      id: "et_" + Date.now(),
    };
    const updated = [...timetable, entryWithId];
    setTimetable(updated);
    localStorage.setItem("auca_exam_timetable", JSON.stringify(updated));
    toast.success("Exam entry scheduled!", {
      description: `${newEntry.courseCode} added to the official calendar.`,
    });
  };

  const handleBulkImport = () => {
    setTimetable(examTimetable);
    localStorage.setItem("auca_exam_timetable", JSON.stringify(examTimetable));
    toast.success("Bulk template loaded successfully!", {
      description: "Re-published 6 standard examination schedules.",
    });
  };



  const handlePrintPaper = (id: string, courseCode: string) => {
    const updatedApproved = approved.map(p => p.id === id ? { ...p, printStatus: "Printed" } : p);
    setApproved(updatedApproved);
    localStorage.setItem("auca_approved_papers", JSON.stringify(updatedApproved));
    toast.success(`Booklet printing complete for ${courseCode}!`, {
      description: "Duplicate booklets sealed and sent to strongroom.",
    });
  };

  const handleDeliverPaper = (courseCode: string) => {
    toast.success(`Sealed box dispatched for ${courseCode}!`, {
      description: "Handed over to authorized coordinator.",
    });
  };

  // Invigilator swap handler
  const handleSwapInvigilator = (invId: string, subName: string) => {
    const updated = invigilators.map(inv =>
      inv.id === invId
        ? { ...inv, status: "Substitute Assigned", substitute: subName }
        : inv
    );
    setInvigilators(updated);
    localStorage.setItem("auca_invigilators", JSON.stringify(updated));
    toast.success(`Substitute assigned successfully!`, {
      description: `${subName} will invigilate in place of the supervisor.`,
    });
  };

  // Venue toggle status/lock handler
  const handleLockVenue = (venueId: string) => {
    const updated = venues.map(ven =>
      ven.id === venueId
        ? { ...ven, status: ven.status === "Active" ? "Locked/Maintenance" : "Active" }
        : ven
    );
    setVenues(updated);
    localStorage.setItem("auca_venues", JSON.stringify(updated));
    toast.info(`Venue status updated!`, {
      description: `Target venue status has been toggled successfully.`,
    });
  };

  // Clash resolver action handler
  const handleResolveClash = (clashId: string) => {
    const updated = clashes.map(cl =>
      cl.id === clashId
        ? { ...cl, status: "Clash Resolved (Routed to Makeup Room)" }
        : cl
    );
    setClashes(updated);
    localStorage.setItem("auca_exam_clashes", JSON.stringify(updated));
    toast.success(`Exam schedule clash resolved!`, {
      description: `Student redirected to separate makeup examination session.`,
    });
  };
  // Pagination filters
  const getPaginatedItems = (list: any[], page: number) => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    return list.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  };

  return (
    <AppLayout
      title="Examination Office"
      subtitle="Comprehensive management of AUCA examination timetables, approved finals, invigilator duty rosters, venues, and student clash resolutions."
    >
      <div className="space-y-6 max-h-[calc(100vh-140px)] overflow-hidden flex flex-col">
        <Tabs key={activeTab} value={activeTab} onValueChange={(val) => navigate(`/exam-office/${val}`)} className="flex-1 flex flex-col min-h-0 space-y-4">
          <div className="flex-1 min-h-0 overflow-y-auto pr-2 custom-scrollbar">
            {/* ─── Timetable ─── */}
            <TabsContent value="timetable" className="space-y-6 m-0 animate-in fade-in duration-300">
              {/* Examiner Timetable Controls */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-shrink-0">
                <Card className="lg:col-span-2 border-slate-200 bg-white shadow-sm rounded-2xl overflow-hidden">
                  <CardHeader className="bg-slate-50/50 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-lg bg-[#1d3557]/10 flex items-center justify-center text-[#1d3557]">
                        <Plus className="h-4 w-4" />
                      </div>
                      <div className="text-left">
                        <CardTitle className="text-xs font-bold text-slate-800 uppercase tracking-wider">Schedule New Examination</CardTitle>
                        <CardDescription className="text-[10px]">Add a single exam session directly to the calendar</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      const newEntry = {
                        courseCode: formData.get("courseCode") as string,
                        courseName: formData.get("courseName") as string,
                        department: formData.get("department") as string,
                        date: formData.get("date") as string,
                        startTime: formData.get("startTime") as string,
                        endTime: formData.get("endTime") as string,
                        venue: formData.get("venue") as string,
                        seatCapacity: parseInt(formData.get("seatCapacity") as string || "100"),
                        invigilator: formData.get("invigilator") as string,
                      };
                      if (!newEntry.courseCode || !newEntry.courseName || !newEntry.date) {
                        toast.error("Please fill in all required fields.");
                        return;
                      }
                      handleAddEntry(newEntry);
                      e.currentTarget.reset();
                    }} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="space-y-0.5 text-left">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Course Code</label>
                        <input name="courseCode" required placeholder="e.g. CS301" className="w-full text-xs font-bold px-2.5 py-1.5 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1d3557]" />
                      </div>
                      <div className="space-y-0.5 text-left">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Course Name</label>
                        <input name="courseName" required placeholder="e.g. Software Engineering" className="w-full text-xs font-bold px-2.5 py-1.5 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1d3557]" />
                      </div>
                      <div className="space-y-0.5 text-left">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Department</label>
                        <select name="department" className="w-full text-xs font-bold px-2.5 py-1.5 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1d3557]">
                          <option value="IT">IT</option>
                          <option value="CS">CS</option>
                          <option value="ENG">ENG</option>
                          <option value="Business">Business</option>
                        </select>
                      </div>
                      <div className="space-y-0.5 text-left">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Exam Date</label>
                        <input name="date" required type="date" className="w-full text-xs font-bold px-2.5 py-1.5 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1d3557]" />
                      </div>
                      <div className="space-y-0.5 text-left">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Start Time</label>
                        <input name="startTime" defaultValue="08:00" placeholder="08:00" className="w-full text-xs font-bold px-2.5 py-1.5 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1d3557]" />
                      </div>
                      <div className="space-y-0.5 text-left">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">End Time</label>
                        <input name="endTime" defaultValue="11:00" placeholder="11:00" className="w-full text-xs font-bold px-2.5 py-1.5 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1d3557]" />
                      </div>
                      <div className="space-y-0.5 text-left">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Venue</label>
                        <input name="venue" defaultValue="AUCA Hall A" placeholder="e.g. AUCA Hall A" className="w-full text-xs font-bold px-2.5 py-1.5 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1d3557]" />
                      </div>
                      <div className="space-y-0.5 text-left">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Capacity</label>
                        <input name="seatCapacity" type="number" defaultValue="100" className="w-full text-xs font-bold px-2.5 py-1.5 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1d3557]" />
                      </div>
                      <div className="space-y-0.5 text-left">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Invigilator</label>
                        <input name="invigilator" defaultValue="Dr. Sarah Mugisha" placeholder="e.g. Dr. Sarah Mugisha" className="w-full text-xs font-bold px-2.5 py-1.5 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1d3557]" />
                      </div>
                      <div className="md:col-span-3 flex justify-end pt-1">
                        <Button type="submit" className="bg-[#1d3557] hover:bg-[#2c4e7d] text-white text-[9px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-xl h-8">
                          Add to Calendar
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>


                <Card className="border-slate-200 bg-white shadow-sm rounded-2xl overflow-hidden flex flex-col justify-between">
                  <CardHeader className="bg-slate-50/50 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
                        <UploadCloud className="h-4 w-4" />
                      </div>
                      <div className="text-left">
                        <CardTitle className="text-xs font-bold text-slate-800 uppercase tracking-wider">Bulk Integration</CardTitle>
                        <CardDescription className="text-[10px]">Restore or load schedules</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 flex-1 flex flex-col justify-center gap-3">
                    <div
                      onClick={handleBulkImport}
                      className="border-2 border-dashed border-slate-200 rounded-xl p-3 text-center cursor-pointer hover:bg-slate-50 hover:border-[#1d3557]/30 transition-all flex flex-col items-center justify-center"
                    >
                      <Sparkles className="h-5 w-5 text-slate-400 mb-1" />
                      <p className="text-[10px] font-bold text-slate-600">Import Institutional Schedule</p>
                      <p className="text-[8px] text-slate-400">Restore default verified schedules</p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={handleClearTimetable}
                      className="w-full text-red-600 border-red-200 hover:bg-red-50 font-bold uppercase text-[9px] tracking-widest py-1.5 h-8 rounded-xl gap-2 transition-all"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Clean Timetable
                    </Button>
                  </CardContent>
                </Card>
              </div>


              <Card className="border-slate-200 shadow-sm bg-white overflow-hidden rounded-2xl">

                <CardContent className="p-0">
                  <Table>

                    <TableBody>
                      {getPaginatedItems(timetable.sort((a, b) => a.date.localeCompare(b.date)), timetablePage).map((exam) => (
                        <TableRow key={exam.id} className="hover:bg-slate-50 transition-colors border-slate-100">
                          <TableCell className="pl-6 text-[12px] font-bold text-slate-700 whitespace-nowrap">
                            {new Date(exam.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                          </TableCell>
                          <TableCell className="text-[12px] font-mono font-bold text-slate-500">
                            {exam.startTime} — {exam.endTime}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-[9px] font-bold border-slate-200 text-[#1d3557] bg-white">{exam.courseCode}</Badge>
                              <span className="text-[11px] font-medium text-slate-600">{exam.courseName}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-[12px] font-semibold text-slate-500">
                            <MapPin className="inline mr-1 h-3.5 w-3.5 text-slate-400" />{exam.venue}
                          </TableCell>
                          <TableCell className="text-[12px] font-mono font-bold text-slate-700">{exam.seatCapacity}</TableCell>
                          <TableCell className="text-right pr-6 text-[12px] font-bold text-slate-600">{exam.invigilator}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
                <Pagination
                  current={timetablePage}
                  total={Math.ceil(timetable.length / ITEMS_PER_PAGE)}
                  onChange={setTimetablePage}
                />
              </Card>
            </TabsContent>

            {/* ─── Approved Papers ─── */}
            <TabsContent value="approved" className="m-0 animate-in fade-in duration-300">
              <Card className="border-slate-200 shadow-sm bg-white overflow-hidden rounded-2xl">
                <CardHeader className="bg-slate-50/10 pb-2 border-b border-slate-100">
                  <div className="text-left">
                    <CardTitle className="text-[13px] font-bold text-slate-800 uppercase tracking-wider">Approved Final Exam Papers</CardTitle>
                    <CardDescription className="text-[10px]">Finalized materials ready for duplication and distribution</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-slate-50/50">
                      <TableRow className="hover:bg-transparent border-slate-100">
                        <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-500 pl-6">Course</TableHead>
                        <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Document Title</TableHead>
                        <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Authorized By</TableHead>
                        <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Approved Date</TableHead>
                        <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-500 text-center">Status</TableHead>
                        <TableHead className="text-right text-[10px] font-bold uppercase tracking-wider text-slate-500 pr-6">Duplication Queue</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getPaginatedItems(approved, approvedPage).map((paper) => (
                        <TableRow key={paper.id} className="hover:bg-slate-50 transition-colors border-slate-100">
                          <TableCell className="pl-6">
                            <Badge variant="outline" className="text-[9px] font-bold border-slate-200 text-[#1d3557] bg-white">{paper.courseCode}</Badge>
                          </TableCell>
                          <TableCell className="text-[12px] font-bold text-slate-800">{paper.title}</TableCell>
                          <TableCell className="text-[12px] font-medium text-slate-500">{paper.approvedBy}</TableCell>
                          <TableCell className="text-[12px] font-medium text-slate-400">{paper.approvalDate}</TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline" className={`text-[9px] font-bold ${paper.printStatus === "Printed" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30" : "bg-[#1d3557]/10 text-[#1d3557] border-[#1d3557]/30"
                              }`}>
                              {paper.printStatus}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right pr-6">
                            <div className="flex items-center justify-end gap-1.5">
                              {paper.printStatus !== "Printed" ? (
                                <Button
                                  size="sm"
                                  onClick={() => handlePrintPaper(paper.id, paper.courseCode)}
                                  className="h-7 px-2.5 bg-[#1d3557] hover:bg-[#2c4e7d] text-white text-[9px] font-bold uppercase tracking-wider rounded-lg gap-1 shadow-sm"
                                >
                                  <Printer className="h-3 w-3" /> Print Booklet
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDeliverPaper(paper.courseCode)}
                                  className="h-7 px-2.5 text-emerald-600 border-emerald-100 hover:bg-emerald-50 text-[9px] font-bold uppercase rounded-lg gap-1"
                                >
                                  <Truck className="h-3 w-3" /> Dispatch Box
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
                <Pagination
                  current={approvedPage}
                  total={Math.ceil(approved.length / ITEMS_PER_PAGE)}
                  onChange={setApprovedPage}
                />
              </Card>
            </TabsContent>

            {/* ─── Invigilator Hub ─── */}
            <TabsContent value="invigilators" className="m-0 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 border-slate-200 shadow-sm bg-white overflow-hidden rounded-2xl">
                  <CardHeader className="pb-2 bg-slate-50/10 flex flex-row items-center justify-between space-y-0">
                    <div className="text-left">
                      <CardTitle className="text-[13px] font-bold text-slate-800 uppercase tracking-wider">AUCA Invigilator registry & supervisor Hub</CardTitle>
                      <CardDescription className="text-[10px]">Coordinate exam-room invigilation rosters and substitute coverage</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Badge className="bg-[#1d3557] text-white text-[9px] font-bold py-1 px-2.5 rounded-full border-0 uppercase">Total Duty Hours: 50h</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader className="bg-slate-50/50">
                        <TableRow className="hover:bg-transparent border-slate-100">
                          <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-500 pl-6">Supervisor Name</TableHead>
                          <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Department</TableHead>
                          <TableHead className="text-right text-[10px] font-bold uppercase tracking-wider text-slate-500 pr-6">Substitute</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getPaginatedItems(invigilators, invigilatorsPage).map((inv) => (
                          <TableRow key={inv.id} className="hover:bg-slate-50 transition-colors border-slate-100">
                            <TableCell className="pl-6 text-left">
                              <span className="text-[12px] font-extrabold text-slate-800">{inv.name}</span>
                            </TableCell>
                            <TableCell className="text-[11px] font-medium text-slate-500 text-left">
                              {inv.department}
                            </TableCell>
                            <TableCell className="text-right pr-6">
                              {inv.substitute ? (
                                <Badge variant="outline" className="border-slate-200 text-slate-500 bg-slate-50 text-[9px] py-0 px-2 font-bold inline-block">
                                  👤 {inv.substitute}
                                </Badge>
                              ) : (
                                <span className="text-slate-300 font-normal italic">None</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                  <Pagination
                    current={invigilatorsPage}
                    total={Math.ceil(invigilators.length / ITEMS_PER_PAGE)}
                    onChange={setInvigilatorsPage}
                  />
                </Card>

                <Card className="lg:col-span-1 border-slate-200 shadow-sm bg-white overflow-hidden rounded-2xl h-fit">
                  <CardHeader className="bg-slate-50/50 pb-3 border-b border-slate-100 text-left">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-lg bg-[#1d3557]/10 flex items-center justify-center text-[#1d3557]">
                        <Plus className="h-4 w-4" />
                      </div>
                      <div>
                        <CardTitle className="text-xs font-bold text-slate-800 uppercase tracking-wider">New Invigilator</CardTitle>
                        <CardDescription className="text-[10px]">Add a supervisor to the registry</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      const name = formData.get("name") as string;
                      const dept = formData.get("department") as string;
                      const hours = parseInt(formData.get("hours") as string || "8");
                      if (!name) {
                        toast.error("Please specify a name.");
                        return;
                      }
                      const newInv = {
                        id: "inv_" + Date.now(),
                        name,
                        department: dept,
                        assignedHours: hours,
                        status: "On Duty",
                        substitute: ""
                      };
                      const updated = [...invigilators, newInv];
                      setInvigilators(updated);
                      localStorage.setItem("auca_invigilators", JSON.stringify(updated));
                      toast.success(`${name} registered successfully!`, {
                        description: "Added to the official invigilation roster.",
                      });
                      e.currentTarget.reset();
                    }} className="space-y-3">
                      <div className="space-y-0.5 text-left">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                        <input name="name" required placeholder="e.g. Prof. John Doe" className="w-full text-xs font-bold px-2.5 py-1.5 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1d3557]" />
                      </div>
                      <div className="space-y-0.5 text-left">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Department</label>
                        <select name="department" className="w-full text-xs font-bold px-2.5 py-1.5 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1d3557]">
                          <option value="Information Technology">Information Technology</option>
                          <option value="Software Engineering">Software Engineering</option>
                          <option value="Networking">Networking</option>
                          <option value="Business Administration">Business Administration</option>
                        </select>
                      </div>
                      <div className="space-y-0.5 text-left">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Duty Hours</label>
                        <input name="hours" type="number" defaultValue="8" className="w-full text-xs font-bold px-2.5 py-1.5 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1d3557]" />
                      </div>
                      <div className="flex justify-end pt-1">
                        <Button type="submit" className="bg-[#1d3557] hover:bg-[#2c4e7d] text-white text-[9px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-xl h-8 w-full border-0">
                          Register Invigilator
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* ─── Venue Registry ─── */}
            <TabsContent value="venues" className="m-0 animate-in fade-in duration-300">
              <Card className="border-slate-200 shadow-sm bg-white overflow-hidden rounded-2xl">
                <CardHeader className="pb-2 bg-slate-50/10 flex flex-row items-center justify-between space-y-0">
                  <div className="text-left">
                    <CardTitle className="text-[13px] font-bold text-slate-800 uppercase tracking-wider">AUCA Venue Registry &amp; Capacity Tracker</CardTitle>
                    <CardDescription className="text-[10px]">Monitor student room allocations, overcrowding alerts, and maintenance locks</CardDescription>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => setShowVenueForm(!showVenueForm)}
                    className={`h-7 gap-1.5 text-[9px] font-bold uppercase tracking-wider rounded-xl px-3 border-0 transition-all ${showVenueForm
                      ? "bg-slate-200 text-slate-700 hover:bg-slate-300"
                      : "bg-[#1d3557] hover:bg-[#2c4e7d] text-white shadow-sm"
                      }`}
                  >
                    <Plus className={`h-3.5 w-3.5 transition-transform duration-200 ${showVenueForm ? "rotate-45" : ""}`} />
                    {showVenueForm ? "Cancel" : "Add Venue"}
                  </Button>
                </CardHeader>

                {/* Inline collapsible form */}
                {showVenueForm && (
                  <div className="border-b border-slate-100 bg-slate-50/60 px-6 py-3 animate-in slide-in-from-top-2 duration-200">
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      const name = formData.get("name") as string;
                      const capacity = parseInt(formData.get("capacity") as string || "100");
                      const computerEquipped = formData.get("computerEquipped") === "yes";
                      if (!name) { toast.error("Please enter a venue name."); return; }
                      const newVenue = { id: "ven_" + Date.now(), name, capacity, computerEquipped, status: "Active" };
                      const updated = [...venues, newVenue];
                      setVenues(updated);
                      localStorage.setItem("auca_venues", JSON.stringify(updated));
                      toast.success(`${name} registered!`, { description: "Venue added to the official registry." });
                      setShowVenueForm(false);
                      e.currentTarget.reset();
                    }} className="grid grid-cols-2 md:grid-cols-4 gap-2.5 items-end">
                      <div className="space-y-0.5 text-left">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Venue Name</label>
                        <input name="name" required placeholder="e.g. AUCA Hall C" className="w-full text-xs font-bold px-2.5 py-1.5 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1d3557] bg-white" />
                      </div>
                      <div className="space-y-0.5 text-left">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Capacity</label>
                        <input name="capacity" type="number" defaultValue="100" className="w-full text-xs font-bold px-2.5 py-1.5 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1d3557] bg-white" />
                      </div>
                      <div className="space-y-0.5 text-left">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Lab Type</label>
                        <select name="computerEquipped" className="w-full text-xs font-bold px-2.5 py-1.5 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1d3557] bg-white">
                          <option value="no">Desk Hall</option>
                          <option value="yes">Computer Lab</option>
                        </select>
                      </div>
                      <Button type="submit" className="bg-[#1d3557] hover:bg-[#2c4e7d] text-white text-[9px] font-bold uppercase tracking-widest h-8 rounded-xl border-0 w-full">
                        Register Venue
                      </Button>
                    </form>
                  </div>
                )}

                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-slate-50/50">
                      <TableRow className="hover:bg-transparent border-slate-100">
                        <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-500 pl-6">Venue Name</TableHead>
                        <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Seating Capacity</TableHead>
                        <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Lab Tech</TableHead>
                        <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-500 text-center">Safety status</TableHead>
                        <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-500 text-center">Status</TableHead>
                        <TableHead className="text-right text-[10px] font-bold uppercase tracking-wider text-slate-500 pr-6">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getPaginatedItems(venues, venuesPage).map((ven) => {
                        const isOvercrowded = ven.capacity < 80;
                        return (
                          <TableRow key={ven.id} className="hover:bg-slate-50 transition-colors border-slate-100">
                            <TableCell className="pl-6 text-left">
                              <span className="text-[12px] font-extrabold text-slate-800">{ven.name}</span>
                            </TableCell>
                            <TableCell className="text-[12px] font-mono font-bold text-slate-600 text-left">
                              {ven.capacity} Desks
                            </TableCell>
                            <TableCell className="text-[11px] font-bold text-slate-500 text-left">
                              {ven.computerEquipped ? (
                                <Badge className="bg-emerald-500/10 text-emerald-600 border-0 text-[8px] font-bold uppercase py-0.5 px-2">💻 Computer Lab</Badge>
                              ) : (
                                <Badge variant="outline" className="border-slate-200 text-slate-400 bg-white text-[8px] font-bold uppercase py-0.5 px-2">Desk Hall</Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              {isOvercrowded ? (
                                <Badge className="bg-red-500/10 text-red-600 border-0 text-[9px] font-extrabold uppercase tracking-wide py-0.5 px-2">⚠️ Overcap Risk (85/60)</Badge>
                              ) : (
                                <Badge className="bg-emerald-500/10 text-emerald-600 border-0 text-[9px] font-extrabold uppercase tracking-wide py-0.5 px-2">🟢 Safe Capacity</Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge variant="outline" className={`text-[9px] font-bold ${ven.status === "Active" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30" : "bg-red-500/10 text-red-600 border-red-500/30"
                                }`}>
                                {ven.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right pr-6">
                              <Button
                                size="sm"
                                variant={ven.status === "Active" ? "outline" : "default"}
                                onClick={() => handleLockVenue(ven.id)}
                                className={`h-7 px-3 text-[9px] font-bold uppercase tracking-wider rounded-lg border-slate-200 ${ven.status === "Active" ? "text-red-600 hover:bg-red-50" : "bg-emerald-600 hover:bg-emerald-700 text-white border-0"
                                  }`}
                              >
                                {ven.status === "Active" ? "Lock for Maintenance" : "Activate Room"}
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
                <Pagination
                  current={venuesPage}
                  total={Math.ceil(venues.length / ITEMS_PER_PAGE)}
                  onChange={setVenuesPage}
                />
              </Card>
            </TabsContent>


            {/* ─── Clash Resolver ─── */}
            <TabsContent value="clashes" className="m-0 animate-in fade-in duration-300">
              <Card className="border-slate-200 shadow-sm bg-white overflow-hidden rounded-2xl">
                <CardHeader className="pb-2 bg-slate-50/10 flex flex-row items-center justify-between space-y-0">
                  <div className="text-left">
                    <CardTitle className="text-[13px] font-bold text-slate-800 uppercase tracking-wider">AUCA Student Exam Clash Resolver</CardTitle>
                    <CardDescription className="text-[10px]">Detect overlap conflicts automatically and isolate affected candidates into secure makeup session labs</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge className="bg-red-500 text-white text-[9px] font-black py-1 px-2.5 rounded-full border-0 uppercase">Clash Alerts Active</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-slate-50/50">
                      <TableRow className="hover:bg-transparent border-slate-100">
                        <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-500 pl-6">Student ID & Name</TableHead>
                        <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Overlapping Courses</TableHead>
                        <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Date & Slot</TableHead>
                        <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-500 text-center">Resolution status</TableHead>
                        <TableHead className="text-right text-[10px] font-bold uppercase tracking-wider text-slate-500 pr-6">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getPaginatedItems(clashes, clashesPage).map((cl) => (
                        <TableRow key={cl.id} className="hover:bg-slate-50 transition-colors border-slate-100">
                          <TableCell className="pl-6 text-left">
                            <div className="flex flex-col">
                              <span className="text-[12px] font-extrabold text-slate-800">{cl.studentName}</span>
                              <span className="text-[9px] font-mono font-bold text-slate-400">{cl.studentId}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-left py-2">
                            <div className="flex items-center gap-1.5">
                              <Badge className="bg-red-500/10 text-red-600 border-0 text-[8.5px] font-bold py-0.5 px-2">{cl.course1}</Badge>
                              <span className="text-[10px] text-slate-400 font-extrabold">VS</span>
                              <Badge className="bg-red-500/10 text-red-600 border-0 text-[8.5px] font-bold py-0.5 px-2">{cl.course2}</Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-[11px] font-bold text-slate-500 text-left">
                            {cl.date} at {cl.time}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline" className={`text-[9.5px] font-bold ${cl.status.includes("Resolved") ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30" : "bg-amber-500/10 text-amber-600 border-amber-500/30"
                              }`}>
                              {cl.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right pr-6">
                            {cl.status.includes("Resolved") ? (
                              <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider"> Safe & Isolated </span>
                            ) : (
                              <Button
                                size="sm"
                                onClick={() => handleResolveClash(cl.id)}
                                className="h-7 px-3 bg-amber-500 hover:bg-amber-600 text-white text-[9px] font-bold uppercase tracking-wider rounded-lg gap-1 border-0"
                              >
                                Resolve & Route Student
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
                <Pagination
                  current={clashesPage}
                  total={Math.ceil(clashes.length / ITEMS_PER_PAGE)}
                  onChange={setClashesPage}
                />
              </Card>
            </TabsContent>

          </div>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default ExamOfficePage;
