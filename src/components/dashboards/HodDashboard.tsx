import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import {
  LayoutGrid,
  GraduationCap as ProgressIcon,
  BookOpen,
  Bell,
  Activity,
  Users,
  Shield,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Filter,
  BarChart2,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const progressWidthClass = (coverage: number) => {
  if (coverage >= 90) return "w-[90%]";
  if (coverage >= 80) return "w-[80%]";
  if (coverage >= 70) return "w-[70%]";
  if (coverage >= 60) return "w-[60%]";
  if (coverage >= 50) return "w-[50%]";
  if (coverage >= 40) return "w-[40%]";
  if (coverage >= 30) return "w-[30%]";
  if (coverage >= 20) return "w-[20%]";
  if (coverage >= 10) return "w-[10%]";
  return "w-0";
};

/* ─── Mock data ─── */
const examPapersQueue = [
  { id: "ex1", course: "CS301 — Software Engineering", lecturer: "Dr. Sarah Mugisha", submitted: "Mar 10, 2025", coverage: 100, flags: 0, status: "cleared" },
  { id: "ex2", course: "IT201 — Web Development", lecturer: "Dr. Sarah Mugisha", submitted: "Mar 14, 2025", coverage: 58, flags: 3, status: "flagged" },
  { id: "ex3", course: "CS401 — Machine Learning", lecturer: "Prof. Agnes Ntamwiza", submitted: "Mar 15, 2025", coverage: 83, flags: 1, status: "flagged" },
  { id: "ex4", course: "ENG301 — Circuit Design", lecturer: "Dr. Jean B. Niyonzima", submitted: "Mar 16, 2025", coverage: 42, flags: 3, status: "flagged" },
];

const mismatchAlerts = [
  { course: "IT201", question: "Q3: Docker containerization", detail: "Docker was not covered in teaching log", severity: "high", time: "2h ago" },
  { course: "ENG301", question: "Q2: FPGA design", detail: "FPGA not in teaching log", severity: "high", time: "5h ago" },
  { course: "CS401", question: "Q5: Reinforcement Learning", detail: "RL was partially covered (1 session only)", severity: "medium", time: "1d ago" },
  { course: "ENG301", question: "Q6: Power electronics", detail: "Topic not found in log entries", severity: "medium", time: "2d ago" },
];

const deptStats = {
  totalStudents: 247,
  totalLecturers: 12,
  coursesOffered: 18,
  graduatingStudents: 34,
  examsPending: examPapersQueue.filter((e) => e.status === "flagged").length,
  examsCleared: examPapersQueue.filter((e) => e.status === "cleared").length,
};

export function HodDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [visibleExams, setVisibleExams] = useState(3);
  const [visibleAlerts, setVisibleAlerts] = useState(3);

  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-4 pb-4 animate-in fade-in duration-700 h-[calc(100vh-140px)] overflow-hidden flex flex-col">
      {/* ── Dashboard Header ── */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 flex-shrink-0">
        <div className="flex items-center gap-6">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">HOD Command Center</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">School of IT • Academic Session 2025</p>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="hidden lg:block">
            <TabsList className="bg-slate-100/50 p-1 rounded-xl border border-slate-200">
              <TabsTrigger value="overview" className="gap-2 px-6 py-2 text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-auca data-[state=active]:text-white rounded-lg transition-all">
                <LayoutGrid className="h-3.5 w-3.5" /> Departmental
              </TabsTrigger>
              <TabsTrigger value="validation" className="gap-2 px-6 py-2 text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-auca data-[state=active]:text-white rounded-lg transition-all">
                <ShieldCheck className="h-3.5 w-3.5" /> Exam Validation
              </TabsTrigger>
              <TabsTrigger value="alerts" className="gap-2 px-6 py-2 text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-auca data-[state=active]:text-white rounded-lg transition-all">
                <AlertTriangle className="h-3.5 w-3.5" /> Audit Alerts
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-10 gap-2 font-bold text-slate-600 bg-white shadow-sm border-slate-200 rounded-xl hover:text-auca hover:border-auca transition-all">
            <Filter className="h-4 w-4" /> Filters
          </Button>
          <Button 
            onClick={() => navigate("/hod/reports")} 
            className="h-11 gap-2 btn-auca font-bold shadow-auca px-6 rounded-2xl transition-all active:scale-95"
          >
            <BarChart2 className="h-5 w-5" /> Generate Reports
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsContent value="overview" className="m-0 h-full overflow-y-auto space-y-6 pr-2 custom-scrollbar">
            {/* ── Progress Group ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="group border-slate-100 shadow-xl shadow-slate-200/20 bg-white rounded-[2rem] overflow-hidden">
                  <CardContent className="p-0">
                    <div className="bg-auca px-6 py-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <ProgressIcon className="h-4 w-4 text-white/70" />
                        <h3 className="text-[11px] font-bold text-white uppercase tracking-[0.2em]">Academic Roadmap</h3>
                      </div>
                      <Badge className="bg-white/10 text-white border-white/20 text-[9px] font-bold uppercase px-3 py-1 rounded-full">School of IT</Badge>
                    </div>
                    <div className="p-6">
                      <div className="relative flex justify-between px-4">
                        <div className="absolute top-5 left-0 w-full h-[2px] bg-slate-100 -z-0" />
                        <div className="absolute top-5 left-0 w-[55%] h-[2px] bg-emerald-500 -z-0 transition-all duration-1000" />
                        {[
                          { label: "Planning", status: "completed", icon: CheckCircle2 },
                          { label: "Loading", status: "completed", icon: CheckCircle2 },
                          { label: "Moderation", status: "current", icon: Clock },
                          { label: "Graduation", status: "pending", icon: ProgressIcon },
                        ].map((step, i) => (
                          <div key={i} className="relative z-10 flex flex-col items-center">
                            <div className={`h-10 w-10 rounded-xl flex items-center justify-center border transition-all duration-500 ${
                              step.status === "completed" ? "bg-emerald-500 border-emerald-500 text-white" :
                              step.status === "current" ? "bg-white border-auca text-auca scale-110 shadow-lg" :
                              "bg-white border-slate-100 text-slate-300"
                            }`}>
                              <step.icon className="h-4 w-4" />
                            </div>
                            <span className="mt-3 text-[9px] font-bold uppercase tracking-widest text-slate-400">{step.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-1">
                <Card className="h-full shadow-xl shadow-slate-200/20 border-slate-100 bg-white rounded-[2rem] overflow-hidden">
                  <CardContent className="p-6 flex flex-col justify-center h-full">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-100">
                        <AlertCircle className="h-5 w-5" />
                      </div>
                      <h4 className="text-[12px] font-bold text-slate-800 uppercase tracking-widest">HOD Action</h4>
                    </div>
                    <p className="text-[13px] text-slate-600 font-medium leading-relaxed mb-6">
                      3 course syllabi remain unverified for the next session. Review faculty loads.
                    </p>
                    <Button variant="outline" className="w-full text-[10px] font-bold uppercase tracking-widest border-slate-200 hover:text-auca rounded-xl" onClick={() => navigate("/hod/faculty")}>
                      Manage Faculty
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* ── Stats Group ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Students", value: deptStats.totalStudents, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
                { label: "Faculty", value: deptStats.totalLecturers, icon: Users, color: "text-emerald-600", bg: "bg-emerald-50" },
                { label: "Courses", value: deptStats.coursesOffered, icon: BookOpen, color: "text-amber-600", bg: "bg-amber-50" },
                { label: "Exams Flagged", value: deptStats.examsPending, icon: Shield, color: "text-red-600", bg: "bg-red-50" },
              ].map((stat, i) => (
                <Card key={i} className="group shadow-lg shadow-slate-200/10 border-slate-100 bg-white rounded-2xl overflow-hidden transition-all hover:border-auca">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color} border border-transparent transition-all`}>
                      <stat.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                      <p className="text-lg font-bold text-slate-800 tracking-tight">{stat.value}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="validation" className="m-0 h-full">
            <Card className="h-full shadow-2xl shadow-slate-200/20 border-slate-100 bg-white rounded-[2rem] overflow-hidden">
              <CardContent className="p-0 h-full flex flex-col">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <h2 className="text-[14px] font-bold text-slate-800 uppercase tracking-widest">Exam Validation Queue</h2>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                  {examPapersQueue.map((exam, idx) => (
                    <div key={idx} className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-md transition-all">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-[14px] font-bold text-slate-800">{exam.course}</h4>
                        <Badge className={exam.status === "cleared" ? "bg-emerald-500" : "bg-red-500"}>{exam.status}</Badge>
                      </div>
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase">
                        <span>Lecturer: {exam.lecturer}</span>
                        <span>Coverage: {exam.coverage}%</span>
                      </div>
                      <div className="mt-3 h-[2px] w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${exam.coverage >= 80 ? "bg-emerald-500" : "bg-amber-500"} ${progressWidthClass(exam.coverage)}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="m-0 h-full">
            <Card className="h-full shadow-2xl shadow-slate-200/20 border-slate-100 bg-white rounded-[2rem] overflow-hidden">
              <CardContent className="p-0 h-full flex flex-col">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                  <h2 className="text-[14px] font-bold text-slate-800 uppercase tracking-widest">Audit Alerts</h2>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  {mismatchAlerts.map((alert, idx) => (
                    <div key={idx} className="flex gap-4 p-6 border-b border-slate-50 hover:bg-slate-50 transition-all last:border-0 group">
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center border ${alert.severity === "high" ? "bg-red-50 text-red-600 border-red-100" : "bg-amber-50 text-amber-600 border-amber-100"}`}>
                        <AlertTriangle className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-slate-400">
                          <span className="text-auca">{alert.course}</span>
                          <span>•</span>
                          <span>{alert.time}</span>
                        </div>
                        <p className="text-[13px] text-slate-700 font-medium leading-relaxed group-hover:text-auca">
                          {alert.question}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-6 border-t border-slate-100 bg-slate-50/50">
                  <Button className="w-full h-11 btn-auca text-[10px] font-bold uppercase tracking-widest rounded-xl shadow-lg">
                    Access Department Hub
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
