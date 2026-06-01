import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { 
  Calendar, Users, MapPin, AlertTriangle, ArrowRight
} from "lucide-react";

export function ExamOfficeDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Load shared states from localStorage to stay 100% in sync
  const [timetable] = useState(() => {
    const stored = localStorage.getItem("auca_exam_timetable");
    return stored ? JSON.parse(stored) : [];
  });

  const [invigilators] = useState(() => {
    const stored = localStorage.getItem("auca_invigilators");
    return stored ? JSON.parse(stored) : [];
  });

  const [venues] = useState(() => {
    const stored = localStorage.getItem("auca_venues");
    return stored ? JSON.parse(stored) : [];
  });

  const [clashes] = useState(() => {
    const stored = localStorage.getItem("auca_exam_clashes");
    return stored ? JSON.parse(stored) : [];
  });

  const unresolvedClashesCount = clashes.filter((c: any) => !c.status.includes("Resolved")).length;

  return (
    <div className="space-y-3 pb-3 animate-in fade-in duration-700 h-[calc(100vh-140px)] overflow-hidden flex flex-col">
      
      {/* ── Dashboard Header ── */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 flex-shrink-0">
        <div className="text-left">
          <h1 className="text-sm font-black text-slate-800 uppercase tracking-wider">Institutional Overview</h1>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            onClick={() => navigate("/exam-office/timetable")} 
            className="btn-auca h-8 gap-1.5 text-[9px] font-bold uppercase tracking-wider transition-all active:scale-95"
          >
            <Calendar className="h-4 w-4 ui-icon" /> Manage Calendar
          </Button>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto pr-1 custom-scrollbar space-y-3">
        
        {/* Active Clashes Status */}
        <Card className="border-slate-200 bg-white rounded-2xl overflow-hidden shadow-sm flex flex-col md:flex-row md:items-center justify-between p-2.5 px-3.5 gap-3 text-left">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-100 flex-shrink-0">
              <AlertTriangle className="h-4.5 w-4.5" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Active Clashes</h4>
              <p className="text-[11px] text-slate-700 leading-normal font-semibold">
                {unresolvedClashesCount > 0 
                  ? `There are ${unresolvedClashesCount} active student timetabling clashes requiring isolated makeup lab routing.` 
                  : "All candidate timetabling overlaps are successfully routed and isolated."}
              </p>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="text-[9px] font-bold uppercase tracking-wider border-auca text-auca hover:bg-auca-soft h-7.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1 flex-shrink-0" 
            onClick={() => navigate("/exam-office/clashes")}
          >
            Resolve Clashes <ArrowRight className="h-3 w-3" />
          </Button>
        </Card>

        {/* ── Stats Group ── */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {[
            { label: "Scheduled Exams", value: timetable.length, icon: Calendar, color: "text-blue-600", bg: "bg-blue-50", path: "/exam-office/timetable" },
            { label: "Invigilators Registered", value: invigilators.length, icon: Users, color: "text-purple-600", bg: "bg-purple-50", path: "/exam-office/invigilators" },
            { label: "Venues Registered", value: venues.length, icon: MapPin, color: "text-emerald-600", bg: "bg-emerald-50", path: "/exam-office/venues" },
            { label: "Unresolved Clashes", value: unresolvedClashesCount, icon: AlertTriangle, color: unresolvedClashesCount > 0 ? "text-red-600" : "text-slate-500", bg: unresolvedClashesCount > 0 ? "bg-red-50" : "bg-slate-50", path: "/exam-office/clashes" },
          ].map((stat, i) => (
            <Card 
              key={i} 
              onClick={() => navigate(stat.path)}
              className="group shadow-sm border-slate-200 bg-white rounded-xl overflow-hidden transition-all hover:border-auca cursor-pointer"
            >
              <CardContent className="p-2.5 flex items-center gap-3 text-left">
                <div className={`h-8 w-8 rounded-lg ${stat.bg} flex items-center justify-center ${stat.color} border border-transparent transition-all group-hover:scale-105`}>
                  <stat.icon className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                  <p className="text-sm font-black text-slate-800 tracking-tight">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Comprehensive Quick Operations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* Timetable Overview Quick List */}
          <Card className="border-slate-200 bg-white rounded-2xl overflow-hidden shadow-sm flex flex-col">
            <CardHeader className="bg-slate-50/50 pb-1.5 pt-2 border-b border-slate-100 text-left">
              <CardTitle className="text-xs font-bold text-slate-800 uppercase tracking-wider">Timetable Schedule Preview</CardTitle>
              <CardDescription className="text-[9px]">Latest exam calendar slot allocations</CardDescription>
            </CardHeader>
            <CardContent className="p-0 flex-1 flex flex-col justify-between">
              {timetable.length === 0 ? (
                <p className="text-[11px] font-semibold text-slate-400 py-6 text-center">No exams scheduled.</p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {timetable.slice(0, 2).map((exam: any) => (
                    <div key={exam.id} className="p-2 flex items-center justify-between text-left">
                      <div>
                        <div className="flex items-center gap-1">
                          <Badge className="bg-auca-soft text-auca border-0 text-[8px] font-bold px-1.5 py-0">{exam.courseCode}</Badge>
                          <span className="text-[11px] font-bold text-slate-700 truncate max-w-[120px]">{exam.courseName}</span>
                        </div>
                        <span className="text-[9px] text-slate-400 font-semibold">{exam.date} • {exam.startTime}</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-500"><MapPin className="inline mr-0.5 h-3 w-3" />{exam.venue}</span>
                    </div>
                  ))}
                </div>
              )}
              <Button 
                variant="ghost" 
                className="w-full text-[9px] font-bold uppercase tracking-wider text-auca hover:bg-slate-50 h-7.5 rounded-b-2xl border-t"
                onClick={() => navigate("/exam-office/timetable")}
              >
                View All Sessions
              </Button>
            </CardContent>
          </Card>

          {/* Roster & Coverage Overview */}
          <Card className="border-slate-200 bg-white rounded-2xl overflow-hidden shadow-sm flex flex-col">
            <CardHeader className="bg-slate-50/50 pb-1.5 pt-2 border-b border-slate-100 text-left">
              <CardTitle className="text-xs font-bold text-slate-800 uppercase tracking-wider">Invigilator Coverage</CardTitle>
              <CardDescription className="text-[9px]">Roster substitution check</CardDescription>
            </CardHeader>
            <CardContent className="p-0 flex-1 flex flex-col justify-between">
              {invigilators.length === 0 ? (
                <p className="text-[11px] font-semibold text-slate-400 py-6 text-center">No invigilators listed.</p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {invigilators.slice(0, 2).map((inv: any) => (
                    <div key={inv.id} className="p-2 flex items-center justify-between text-left">
                      <div>
                        <span className="text-[11px] font-bold text-slate-700">{inv.name}</span>
                        <p className="text-[9px] text-slate-400 font-semibold">{inv.department}</p>
                      </div>
                      <Badge variant="outline" className={`text-[8px] font-bold ${
                        inv.status === "On Duty" 
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30" 
                          : "bg-auca-soft text-auca border-auca"
                      }`}>
                        {inv.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
              <Button 
                variant="ghost" 
                className="w-full text-[9px] font-bold uppercase tracking-wider text-auca hover:bg-slate-50 h-7.5 rounded-b-2xl border-t"
                onClick={() => navigate("/exam-office/invigilators")}
              >
                Manage Roster
              </Button>
            </CardContent>
          </Card>

          {/* Venue Utilization Check */}
          <Card className="border-slate-200 bg-white rounded-2xl overflow-hidden shadow-sm flex flex-col">
            <CardHeader className="bg-slate-50/50 pb-1.5 pt-2 border-b border-slate-100 text-left">
              <CardTitle className="text-xs font-bold text-slate-800 uppercase tracking-wider">Venue capacity Status</CardTitle>
              <CardDescription className="text-[9px]">Classroom locks and tech compliance</CardDescription>
            </CardHeader>
            <CardContent className="p-0 flex-1 flex flex-col justify-between">
              {venues.length === 0 ? (
                <p className="text-[11px] font-semibold text-slate-400 py-6 text-center">No venues listed.</p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {venues.slice(0, 2).map((ven: any) => (
                    <div key={ven.id} className="p-2 flex items-center justify-between text-left">
                      <div>
                        <span className="text-[11px] font-bold text-slate-700">{ven.name}</span>
                        <p className="text-[9px] text-slate-400 font-semibold">Max Capacity: {ven.capacity} seats</p>
                      </div>
                      <Badge variant="outline" className={`text-[8px] font-bold ${
                        ven.status === "Active" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30" : "bg-red-500/10 text-red-600 border-red-500/30"
                      }`}>
                        {ven.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
              <Button 
                variant="ghost" 
                className="w-full text-[9px] font-bold uppercase tracking-wider text-auca hover:bg-slate-50 h-7.5 rounded-b-2xl border-t"
                onClick={() => navigate("/exam-office/venues")}
              >
                View Venue registry
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
