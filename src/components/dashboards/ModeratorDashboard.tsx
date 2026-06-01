import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from "recharts";
import { 
  Filter, ChevronDown, CheckCircle2,
  Users, Activity, ChevronRight, BarChart2, ShieldCheck, XCircle, FileText, Clock
} from "lucide-react";

/* ─── Mock data ─── */
const reviewsThisWeek = [
  { day: "Mon", completed: 4, rejected: 0 },
  { day: "Tue", completed: 6, rejected: 1 },
  { day: "Wed", completed: 5, rejected: 0 },
  { day: "Thu", completed: 8, rejected: 1 },
  { day: "Fri", completed: 7, rejected: 0 },
  { day: "Sat", completed: 2, rejected: 0 },
  { day: "Sun", completed: 1, rejected: 0 },
];

const queue = [
  { title: "Mobile Health Tracking Application", author: "David Mugabo", initials: "DM", dept: "IT", type: "Student Project", date: "Mar 15, 2025", pages: 48, confidence: 92 },
  { title: "Impact of Microfinance on Rural Communities", author: "Dr. Jean B. Niyonzima", initials: "JN", dept: "Economics", type: "Publication", date: "Mar 14, 2025", pages: 24, confidence: 85 },
  { title: "Solar Energy Management Dashboard", author: "Grace Uwimana", initials: "GU", dept: "Engineering", type: "Student Project", date: "Mar 13, 2025", pages: 62, confidence: 98 },
  { title: "Machine Learning in Agricultural Yield Prediction", author: "Prof. Agnes Ntamwiza", initials: "AN", dept: "CS", type: "Publication", date: "Mar 12, 2025", pages: 18, confidence: 75 },
  { title: "Kinyarwanda NLP Text Classifier", author: "Eric Habimana", initials: "EH", dept: "IT", type: "Student Project", date: "Mar 11, 2025", pages: 55, confidence: 95 },
];

const queuePreview = queue.slice(0, 1);

const recentDecisions = [
  { title: "Blockchain-Based Land Registry for Rwanda", author: "Eric Habimana", decision: "Approved", date: "Mar 10, 2025", reason: "All requirements met; well-structured submission", icon: CheckCircle2, type: "success" },
  { title: "Smart Parking System using IoT Sensors", author: "Jean Pierre H.", decision: "Approved", date: "Mar 9, 2025", reason: "Complete documentation with proper citations", icon: CheckCircle2, type: "success" },
  { title: "Water Quality Monitoring using ML", author: "Patrick K.", decision: "Rejected", date: "Mar 8, 2025", reason: "Missing abstract; plagiarism check failed", icon: XCircle, type: "error" },
  { title: "E-Commerce Platform for Local Artisans", author: "Marie Claire N.", decision: "Resubmit", date: "Mar 7, 2025", reason: "Bibliography incomplete; missing sections", icon: FileText, type: "warning" },
];

export function ModeratorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const myAssignedCount = 12;
  const pendingGlobal = 24;

  return (
    <div className="space-y-6 pb-10 animate-in fade-in duration-700">
      {/* ── Quality Assurance Roadmap ── */}
      <Card className="group w-full max-w-[44rem] mx-auto border-slate-100 shadow-xl shadow-slate-200/15 bg-white rounded-[1.25rem] overflow-hidden hover:shadow-2xl transition-all duration-500">
        <CardContent className="p-0">
          <div className="bg-auca px-2.5 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-xl bg-white/10 flex items-center justify-center border border-white/10">
                <ShieldCheck className="h-3.5 w-3.5 text-white" />
              </div>
              <h3 className="text-[9px] font-bold text-white uppercase tracking-[0.18em]">Quality Assurance Roadmap</h3>
            </div>
            <Badge className="bg-white/10 text-white border-white/20 text-[7px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full">Archive Moderation 2025</Badge>
          </div>
          
          <div className="p-3 lg:p-4">
            <div className="relative flex justify-between">
              <div className="absolute top-4 left-0 w-full h-[2px] bg-slate-100 -z-0" />
              <div className="absolute top-4 left-0 w-[45%] h-[2px] bg-emerald-500 -z-0 transition-all duration-1000" />

              {[
                { label: "Audit", status: "completed", icon: CheckCircle2 },
                { label: "Triage", status: "completed", icon: CheckCircle2 },
                { label: "Plagiarism", status: "current", icon: Clock },
                { label: "Signing", status: "pending", icon: ShieldCheck },
                { label: "Archive", status: "pending", icon: BarChart2 },
              ].map((step, i) => (
                <div key={i} className="relative z-10 flex flex-col items-center group">
                  <div className={`h-8 w-8 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 ${
                    step.status === "completed" ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20" :
                    step.status === "current" ? "bg-white border-auca text-auca shadow-2xl scale-110 z-20" :
                    "bg-white border-slate-100 text-slate-300 group-hover:border-slate-200"
                  }`}>
                    <step.icon className={`h-3.5 w-3.5 ${step.status === "current" ? "animate-pulse" : ""}`} />
                  </div>
                  <span className={`mt-2 text-[7px] font-bold uppercase tracking-[0.12em] transition-colors ${
                    step.status === "pending" ? "text-slate-400" : step.status === "current" ? "text-auca" : "text-emerald-600"
                  }`}>{step.label}</span>
                </div>
              ))}
            </div>
            
          </div>
        </CardContent>
      </Card>

      {/* Header filters removed for a tighter layout */}

      {/* Summary stats grid removed per request */}

      {/* ── Main Content Split ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Col: Verification Queue */}
        <div className="xl:col-span-2 space-y-8">
          <Card className="shadow-2xl shadow-slate-200/20 border-slate-100 bg-white rounded-[1.5rem] overflow-hidden transition-all duration-500 hover:shadow-3xl">
            <CardContent className="p-0">
              <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-white flex items-center justify-center text-auca border border-slate-100 shadow-sm">
                    <ShieldCheck className="h-4.5 w-4.5" />
                  </div>
                  <h2 className="text-[13px] font-bold text-slate-800 uppercase tracking-widest">Verification Queue</h2>
                </div>
                <Button variant="ghost" className="text-[9px] font-bold text-auca hover:bg-slate-100 px-4 py-2 rounded-xl uppercase tracking-widest" onClick={() => navigate("/moderation") }>
                  Full Report <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              
              <div className="p-4">
                {/* Status Mini Grid */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="bg-emerald-50 rounded-2xl p-3 border border-emerald-100 shadow-sm transition-all hover:shadow-md">
                    <p className="text-[7px] font-bold text-emerald-800 mb-1 uppercase tracking-[0.18em] opacity-75">VERIFIED</p>
                    <p className="text-lg font-bold text-emerald-950">42</p>
                  </div>
                  <div className="bg-blue-50 rounded-2xl p-3 border border-blue-100 shadow-sm transition-all hover:shadow-md">
                    <p className="text-[7px] font-bold text-blue-800 mb-1 uppercase tracking-[0.18em] opacity-75">PENDING</p>
                    <p className="text-lg font-bold text-blue-950">{pendingGlobal}</p>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 shadow-sm transition-all hover:shadow-md">
                    <p className="text-[7px] font-bold text-slate-600 mb-1 uppercase tracking-[0.18em] opacity-75">TOTAL QUEUE</p>
                    <p className="text-lg font-bold text-slate-800">{pendingGlobal + 42}</p>
                  </div>
                </div>

                {/* Queue Items */}
                <div className="space-y-6">
                  {queuePreview.map((item, idx) => (
                    <div key={item.title} className="group cursor-pointer p-4 rounded-3xl border border-slate-100 hover:bg-slate-50 transition-all duration-300">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-[13px] font-bold text-slate-800 group-hover:text-auca transition-colors">{item.title}</h4>
                        <Badge className="bg-auca text-white border-0 text-[8px] font-bold uppercase tracking-widest px-2 py-1 rounded-full shadow-lg shadow-auca">
                          {item.dept}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 mb-3 text-[10px] text-slate-500 font-semibold">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-[9px] text-slate-600 border border-slate-200 group-hover:bg-auca group-hover:text-white transition-all duration-300">
                            {item.initials}
                          </div>
                          <span className="uppercase tracking-widest">{item.author}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <span className="uppercase tracking-widest">{item.pages}p</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-[4px] flex-1 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-emerald-500 rounded-full transition-all duration-1000" 
                            style={{ width: `${item.confidence}%` }} 
                          />
                        </div>
                        <span className="text-[10px] text-slate-500 font-bold w-12 text-right tracking-tighter">{item.confidence}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Col: Recent Decisions */}
        <div className="xl:col-span-1 space-y-6">
          <Card className="shadow-2xl shadow-slate-200/20 border-slate-100 bg-white rounded-[1.75rem] overflow-hidden transition-all duration-500 hover:shadow-3xl">
            <CardContent className="p-0">
              <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
                <div>
                  <h2 className="text-[14px] font-bold text-slate-800 uppercase tracking-widest">Master Feed</h2>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest opacity-60">Verified decisions logs</p>
                </div>
                <Activity className="h-5 w-5 text-auca animate-pulse" />
              </div>
              
              <div className="p-4 text-center space-y-2">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-3xl bg-auca/10 text-auca shadow-sm">
                  <Activity className="h-5 w-5" />
                </div>
                <Button className="mx-auto w-full max-w-xs h-10 btn-auca transition-all" onClick={() => navigate("/moderation") }>
                  View Master Feed
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
