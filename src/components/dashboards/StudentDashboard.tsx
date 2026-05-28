import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  Bell, FileText, Upload, CalendarDays, BookOpen, 
  CheckCircle, TrendingUp, Sparkles, Award, Search, Eye, User, Briefcase, ArrowRight, MapPin, Clock, Filter
} from "lucide-react";
import { mockProjects } from "@/data/mockData";
import { examTimetable } from "@/data/academic-records";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Compact Pagination Component
const Pagination = ({ current, total, onChange }: { current: number; total: number; onChange: (p: number) => void }) => {
  if (total <= 1) return null;
  return (
    <div className="flex items-center justify-between border-t border-slate-100 px-6 py-3 bg-slate-50/50 rounded-b-2xl mt-4">
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

export const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState<string>("All");
  
  // Timetable and seat-check states
  const [examSearch, setExamSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState<string>("All");

  // Pagination states
  const [projectPage, setProjectPage] = useState(1);
  const [examPage, setExamPage] = useState(1);
  const [selectedPDFPlan, setSelectedPDFPlan] = useState<any>(null);
  const ITEMS_PER_PAGE = 3;

  const departments = ["All", ...Array.from(new Set(mockProjects.map(p => p.department)))];

  const filteredProjects = mockProjects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          project.abstract.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === "All" || project.department === selectedDept;
    return matchesSearch && matchesDept && project.status === "Published";
  });

  // Load Exam Timetable dynamically from localStorage
  const [timetable] = useState<any[]>(() => {
    const stored = localStorage.getItem("auca_exam_timetable");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error(e);
      }
    }
    return examTimetable;
  });

  // Unique sorted list of dates from exams
  const uniqueDates = Array.from(new Set(timetable.map((e: any) => e.date))).sort() as string[];

  const filteredExams = timetable.filter(exam => {
    const matchesSearch = exam.courseCode.toLowerCase().includes(examSearch.toLowerCase()) ||
                          exam.courseName.toLowerCase().includes(examSearch.toLowerCase()) ||
                          exam.venue.toLowerCase().includes(examSearch.toLowerCase()) ||
                          exam.invigilator.toLowerCase().includes(examSearch.toLowerCase());
    const matchesDate = selectedDate === "All" || exam.date === selectedDate;
    return matchesSearch && matchesDate;
  });

  const getPaginatedItems = (list: any[], page: number) => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    return list.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4 pb-4 animate-in fade-in duration-500 max-h-[calc(100vh-140px)] overflow-hidden flex flex-col">
      
      {/* ── Dynamic Welcome Card ── */}
      <div className="relative bg-[#1d3557] rounded-2xl overflow-hidden shadow-lg shadow-[#1d3557]/20 border border-white/10 group flex-shrink-0">
        <div className="absolute inset-0 bg-[url('/images/auca1.jpg')] bg-cover bg-center opacity-10 group-hover:scale-105 transition-transform duration-1000" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#1d3557] via-[#1d3557]/90 to-[#1d3557]/40" />
        <div className="relative z-10 px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
          <h1 className="text-lg md:text-xl font-black text-white tracking-tight">
            Welcome back, {user?.name || "Student"}!
          </h1>
          <div className="flex flex-row items-center gap-3 flex-shrink-0">
            <Button 
              onClick={() => navigate('/submit/project')}
              className="bg-emerald-500 text-white hover:bg-emerald-600 h-8 px-4 rounded-xl font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all hover:scale-105 border-0 text-[10px] flex items-center"
            >
              <Sparkles className="mr-2 h-3.5 w-3.5" /> Submit Project
            </Button>
            <Button 
              onClick={() => navigate('/submit/document')}
              className="bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white hover:text-[#1d3557] h-8 px-4 rounded-xl font-bold shadow-sm transition-all hover:scale-105 text-[10px] flex items-center"
            >
              <Upload className="mr-2 h-3.5 w-3.5" /> Upload Document
            </Button>
          </div>
        </div>
      </div>

      {/* ── Dashboard Content Tabs ── */}
      <Tabs defaultValue="projects" className="flex-1 flex flex-col min-h-0 space-y-4">
        <div className="flex items-center justify-between flex-shrink-0">
          <TabsList className="bg-slate-100 p-1 rounded-xl border border-slate-200">
            <TabsTrigger value="projects" className="gap-2 px-5 py-2 text-[10px] font-bold uppercase tracking-wider data-[state=active]:bg-[#1d3557] data-[state=active]:text-white rounded-lg transition-all">
              <BookOpen className="h-3.5 w-3.5" /> Archive Explorer
            </TabsTrigger>
            <TabsTrigger value="timetable" className="gap-2 px-5 py-2 text-[10px] font-bold uppercase tracking-wider data-[state=active]:bg-[#1d3557] data-[state=active]:text-white rounded-lg transition-all">
              <CalendarDays className="h-3.5 w-3.5" /> Seating & Exam Finder
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto pr-2 custom-scrollbar">
          {/* ── TabContent: Archive Explorer ── */}
          <TabsContent value="projects" className="space-y-4 m-0 animate-in fade-in duration-300">
            <div className="flex flex-wrap gap-2 flex-shrink-0">
              {departments.map(dept => (
                <button
                  key={dept}
                  onClick={() => {
                    setSelectedDept(dept);
                    setProjectPage(1);
                  }}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedDept === dept 
                      ? "bg-[#1d3557] text-white shadow-md scale-105" 
                      : "bg-white border border-slate-200 text-slate-500 hover:border-[#1d3557]/30 hover:bg-slate-50"
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>

            {filteredProjects.length === 0 ? (
              <div className="text-center py-16 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200">
                <Search className="h-10 w-10 mx-auto mb-3 text-slate-300" />
                <p className="text-xs font-bold text-slate-500">No projects found matching your criteria</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getPaginatedItems(filteredProjects, projectPage).map((project) => (
                    <Card 
                      key={project.id} 
                      className="group border-slate-200 shadow-sm hover:shadow-xl hover:border-[#1d3557]/30 transition-all duration-300 rounded-2xl bg-white overflow-hidden flex flex-col cursor-pointer"
                      onClick={() => navigate(`/projects/${project.id}`)}
                    >
                      <div className="p-5 flex-1 flex flex-col justify-between gap-4 text-left">
                        <div>
                          <div className="flex justify-between items-start mb-3">
                            <Badge className={`px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest border-0 ${
                              project.type === 'Thesis' ? 'bg-amber-50 text-amber-600' :
                              project.type === 'Publication' ? 'bg-emerald-50 text-emerald-600' :
                              'bg-blue-50 text-blue-600'
                            }`}>
                              {project.type}
                            </Badge>
                            <div className="flex items-center gap-1 text-slate-400 text-xs font-medium">
                              <Eye className="h-3.5 w-3.5" /> {project.views}
                            </div>
                          </div>
                          
                          <h3 className="text-sm font-black text-slate-800 leading-snug mb-2 group-hover:text-[#1d3557] transition-colors line-clamp-2">
                            {project.title}
                          </h3>
                        </div>
                        
                        <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                          {project.abstract}
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>
                <Pagination 
                  current={projectPage} 
                  total={Math.ceil(filteredProjects.length / ITEMS_PER_PAGE)} 
                  onChange={setProjectPage} 
                />
              </div>
            )}
          </TabsContent>

          {/* ── TabContent: Seating & Exam Finder ── */}
          <TabsContent value="timetable" className="m-0 space-y-4 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between w-full flex-shrink-0">
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-inner w-full sm:max-w-md">
                <Search className="h-4 w-4 text-slate-400" />
                <input 
                  type="text"
                  value={examSearch}
                  onChange={(e) => {
                    setExamSearch(e.target.value);
                    setExamPage(1);
                  }}
                  placeholder="Search code, course, room or invigilator..."
                  className="bg-transparent border-none text-xs font-bold text-slate-700 placeholder:text-slate-400 focus:outline-none w-full"
                />
              </div>

              {/* Dynamic Day Selector */}
              <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-2 rounded-xl w-full sm:w-auto text-left shadow-sm">
                <Filter className="h-3.5 w-3.5 text-slate-400" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider whitespace-nowrap">Filter Day:</span>
                <select 
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setExamPage(1);
                  }}
                  className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer border-0 p-0 w-full"
                >
                  <option value="All">All Scheduled Days</option>
                  {uniqueDates.map(dateStr => (
                    <option key={dateStr} value={dateStr}>
                      {new Date(dateStr).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {filteredExams.length === 0 ? (
              <div className="text-center py-16 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200">
                <CalendarDays className="h-10 w-10 mx-auto mb-3 text-slate-300" />
                <p className="text-xs font-bold text-slate-500">No examinations scheduled for this query or filtered day.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getPaginatedItems(filteredExams, examPage).map((exam) => {
                    let rowSeed = ((exam.courseCode.charCodeAt(2) || 0) % 5) + 1;
                    let seatSeed = ((exam.courseCode.charCodeAt(3) || 0) % 8) + 1;
                    let assignedDept = exam.department || "General";
                    let isLive = false;

                    try {
                      const storedPlans = localStorage.getItem("auca_seating_plans");
                      if (storedPlans) {
                        const parsed = JSON.parse(storedPlans);
                        const matchedPlan = parsed.find((p: any) => p.examId === exam.id);
                        if (matchedPlan && matchedPlan.uploaded) {
                          assignedDept = matchedPlan.department;
                          isLive = true;
                        }
                      }
                    } catch (err) {
                      console.error(err);
                    }

                    return (
                      <Card 
                        key={exam.id} 
                        className="group border-slate-200 shadow-sm hover:shadow-xl hover:border-[#1d3557]/30 transition-all duration-300 rounded-2xl bg-white overflow-hidden flex flex-col cursor-default"
                      >
                        <div className="bg-[#1d3557] px-5 py-3 flex items-center justify-between text-white">
                          <Badge variant="outline" className="text-[9px] font-bold text-white border-white/20 bg-white/10 uppercase tracking-wider">{exam.courseCode}</Badge>
                          <Badge className="bg-emerald-500 text-white border-0 text-[8px] font-bold uppercase tracking-wider">Scheduled Exam</Badge>
                        </div>
                        <CardContent className="p-5 flex-1 flex flex-col justify-between gap-4">
                          <div className="space-y-1">
                            <h4 className="text-[13px] font-black text-slate-800 leading-tight group-hover:text-[#1d3557] transition-colors text-left">{exam.courseName}</h4>
                            <div className="flex items-center gap-2 text-slate-500 font-bold uppercase tracking-wider text-[9px] text-left">
                              <Badge variant="outline" className="border-slate-100 text-slate-400 text-[8px] bg-slate-50">{assignedDept} Dept</Badge>
                            </div>
                          </div>

                          {/* Seating Room & Time Details */}
                          <div className="space-y-2 pt-2 border-t border-slate-100 text-left">
                            <div className="flex items-center gap-2 text-xs text-slate-600 font-semibold">
                              <CalendarDays className="h-4 w-4 text-[#1d3557]/80" />
                              <span>
                                {new Date(exam.date).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-600 font-semibold">
                              <Clock className="h-4 w-4 text-[#1d3557]/80" />
                              <span className="font-mono">{exam.startTime} — {exam.endTime}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-600 font-semibold">
                              <MapPin className="h-4 w-4 text-[#1d3557]/80" />
                              <span>Room Location: <span className="font-black text-[#1d3557]">{exam.venue}</span></span>
                            </div>
                          </div>

                          {/* Assigned desk and location panel (no capacity shown) */}
                          <div className="bg-[#1d3557]/5 border border-[#1d3557]/10 rounded-xl p-3 space-y-2 text-left">
                            <div className="flex justify-between items-center">
                              <p className="text-[8px] font-black uppercase tracking-widest text-[#1d3557]">My Personal Seating Desk</p>
                              {isLive ? (
                                <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-0 text-[7.5px] font-bold uppercase px-1.5 py-0">Live Synced Roster</Badge>
                              ) : (
                                <Badge variant="outline" className="text-[7.5px] font-bold uppercase tracking-wider text-amber-500 border-amber-200 bg-amber-50/50">Draft Setup</Badge>
                              )}
                            </div>
                            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                              <span>Desk Position:</span>
                              <span className="font-mono bg-[#1d3557] text-white px-2 py-0.5 rounded text-[10px]">{isLive ? "Desk 01" : "Desk " + seatSeed}</span>
                            </div>
                            <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                              <span>Invigilator:</span>
                              <span className="text-slate-600 font-bold">{exam.invigilator}</span>
                            </div>

                            {/* PDF Button */}
                            {isLive ? (
                              <Button
                                onClick={() => {
                                  try {
                                    const storedPlans = localStorage.getItem("auca_seating_plans");
                                    if (storedPlans) {
                                      const parsed = JSON.parse(storedPlans);
                                      const matchedPlan = parsed.find((p: any) => p.examId === exam.id);
                                      if (matchedPlan) {
                                        setSelectedPDFPlan({ ...matchedPlan, examName: exam.courseName, examDate: exam.date, examStart: exam.startTime, invigilator: exam.invigilator });
                                      }
                                    }
                                  } catch(e) {
                                    console.error(e);
                                  }
                                }}
                                className="w-full h-8 mt-1.5 bg-[#1d3557] hover:bg-[#2c4e7d] text-white text-[9px] font-black uppercase tracking-wider rounded-lg gap-1 border-0 flex items-center justify-center transition-all active:scale-95"
                              >
                                <FileText className="h-3.5 w-3.5" /> View Seating Roster PDF
                              </Button>
                            ) : (
                              <div className="text-[8px] font-bold text-amber-600 uppercase bg-amber-50 rounded-lg p-1.5 border border-amber-100/60 text-center mt-1">
                                Roster PDF pending upload by Exam Office
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
                <Pagination 
                  current={examPage} 
                  total={Math.ceil(filteredExams.length / ITEMS_PER_PAGE)} 
                  onChange={setExamPage} 
                />
              </div>
            )}
          </TabsContent>
        </div>
      </Tabs>

      {/* ─── OFFICIAL SEATING PLAN ROSTER PDF OVERLAY MODAL ─── */}
      {selectedPDFPlan && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden flex flex-col justify-between animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-[#1d3557] text-white px-6 py-4 flex items-center justify-between text-left">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-emerald-400" />
                <span className="text-[12px] font-black uppercase tracking-wider">AUCA Official Seating PDF</span>
              </div>
              <button 
                onClick={() => setSelectedPDFPlan(null)} 
                className="text-white/80 hover:text-white font-black text-xs uppercase bg-white/10 hover:bg-white/20 h-6 px-2 rounded-lg transition-all"
              >
                Close
              </button>
            </div>

            {/* Document PDF Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(100vh-220px)] custom-scrollbar bg-slate-100">
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg relative overflow-hidden text-left">
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#1d3557]" />
                
                {/* School Header */}
                <div className="text-center pb-2.5 border-b border-slate-200 mb-4">
                  <h4 className="text-[10px] font-extrabold tracking-wider text-slate-800 uppercase">Adventist University of Central Africa</h4>
                  <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Office of the Registrar • Seating Arrangement</p>
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-2 gap-2 text-[9px] mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-slate-400 font-bold uppercase block text-[6.5px]">Course Code & Title</span>
                    <span className="font-extrabold text-[#1d3557]">{selectedPDFPlan.courseCode} — {selectedPDFPlan.examName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold uppercase block text-[6.5px]">Target Department</span>
                    <span className="font-extrabold text-slate-700">{selectedPDFPlan.department}</span>
                  </div>
                  <div className="mt-1">
                    <span className="text-slate-400 font-bold uppercase block text-[6.5px]">Assigned Venue</span>
                    <span className="font-bold text-slate-600">{selectedPDFPlan.venue}</span>
                  </div>
                  <div className="mt-1">
                    <span className="text-slate-400 font-bold uppercase block text-[6.5px]">Invigilator</span>
                    <span className="font-bold text-slate-600">{selectedPDFPlan.invigilator}</span>
                  </div>
                </div>

                {/* Listing Table */}
                <div className="space-y-1.5">
                  <div className="grid grid-cols-12 gap-1 text-[7.5px] font-black uppercase text-slate-400 tracking-wider pb-1 border-b border-slate-200">
                    <span className="col-span-3">Student ID</span>
                    <span className="col-span-6">Student Name</span>
                    <span className="col-span-3 text-right">Seat Desk</span>
                  </div>
                  <div className="space-y-1 max-h-[160px] overflow-y-auto custom-scrollbar">
                    {selectedPDFPlan.students && selectedPDFPlan.students.map((stud: any, idx: number) => {
                      const isCurrentUser = stud.name.toLowerCase().includes("jean") || stud.name.toLowerCase().includes("pierre") || stud.name.toLowerCase().includes("habimana");
                      return (
                        <div 
                          key={idx} 
                          className={`grid grid-cols-12 gap-1 text-[9px] py-1 border-b border-slate-50 last:border-0 items-center font-medium ${
                            isCurrentUser ? "bg-emerald-50 text-emerald-800 font-bold px-1 rounded" : "text-slate-600"
                          }`}
                        >
                          <span className="col-span-3 font-mono text-slate-400">{stud.id}</span>
                          <span className="col-span-6 truncate">
                            {stud.name} {isCurrentUser && <span className="text-[7.5px] text-emerald-600 uppercase font-black tracking-widest">(You)</span>}
                          </span>
                          <span className="col-span-3 text-right">
                            <Badge className={`border-0 text-[8px] font-bold py-0.5 px-1.5 ${
                              isCurrentUser ? "bg-emerald-500 text-white" : "bg-[#1d3557]/10 text-[#1d3557]"
                            }`}>{stud.desk}</Badge>
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Footer seal */}
                <div className="mt-4 pt-2 border-t border-slate-200 flex justify-between items-center text-[7px] text-slate-400 font-bold uppercase tracking-wider">
                  <span>Authorized digitally by AUCA</span>
                  <span>Roster PDF Page 1 / 1</span>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex gap-3">
              <Button
                onClick={() => {
                  toast.success(`PDF downloaded successfully!`, {
                    description: `Saved AUCA_Seating_${selectedPDFPlan.courseCode}_Roster.pdf to device.`,
                  });
                }}
                className="flex-1 h-9 bg-[#1d3557] hover:bg-[#2c4e7d] text-white text-[10px] font-black uppercase tracking-wider rounded-xl gap-1.5"
              >
                Download PDF Document
              </Button>
              <Button
                variant="outline"
                onClick={() => setSelectedPDFPlan(null)}
                className="h-9 border-slate-200 text-slate-500 text-[10px] font-black uppercase tracking-wider rounded-xl px-4"
              >
                Dismiss
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
