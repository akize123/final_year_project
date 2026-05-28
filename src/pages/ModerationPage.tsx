import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  CheckCircle, X, Eye, RefreshCw, Copy, Archive, ChevronDown, 
  ChevronUp, MessageSquare, ShieldCheck, UserCheck, AlertTriangle,
  History, FileText, Send, Globe, Info, ChevronRight
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

/* ─── Advanced Mock Data for Librarian ─── */
interface ModerationItem {
  id: string;
  title: string;
  author: string;
  department: string;
  type: "Student Project" | "Publication" | "Thesis";
  status: "Pending" | "Published" | "Hidden" | "Archived" | "Rejected";
  assignedTo: string | null;
  submittedDate: string;
  workflowStep: number; // 1: Supervisor, 2: HOD, 3: Librarian (Final)
  plagiarismScore: number;
  comments: { id: string; user: string; text: string; date: string }[];
}

const mockModerationQueue: ModerationItem[] = [
  {
    id: "sub1",
    title: "AI-Driven Crop Disease Prediction for Rwandan Farmers",
    author: "Emmanuel Kwizera",
    department: "Information Technology",
    type: "Student Project",
    status: "Pending",
    assignedTo: "Alice Librarian",
    submittedDate: "2025-03-10",
    workflowStep: 3,
    plagiarismScore: 12,
    comments: [
      { id: "c1", user: "Dr. Sarah (Supervisor)", text: "Excellent work, methodology is sound.", date: "Mar 12" },
      { id: "c2", user: "HOD IT", text: "Approved for library publication.", date: "Mar 14" },
    ],
  },
  {
    id: "sub2",
    title: "Impact of Microfinance on Rural Communities",
    author: "Grace Uwimana",
    department: "Business Administration",
    type: "Thesis",
    status: "Pending",
    assignedTo: null,
    submittedDate: "2025-03-14",
    workflowStep: 3,
    plagiarismScore: 45,
    comments: [],
  },
  {
    id: "sub3",
    title: "Blockchain Framework for Secure Academic Credentialing",
    author: "Fiona Umutoni",
    department: "Information Technology",
    type: "Publication",
    status: "Published",
    assignedTo: "Alice Librarian",
    submittedDate: "2025-03-05",
    workflowStep: 3,
    plagiarismScore: 5,
    comments: [],
  },
];

const ModerationPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [queueItems, setQueueItems] = useState<ModerationItem[]>(mockModerationQueue);
  const [view, setView] = useState<"assigned" | "all">("assigned");
  const [activeTab, setActiveTab] = useState("Pending");
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (location.pathname.endsWith("/all")) {
      setActiveTab("All");
      setView("all");
    } else if (location.pathname.endsWith("/plagiarism")) {
      setActiveTab("Pending");
      setView("all");
    }
  }, [location.pathname]);

  const filtered = queueItems.filter(item => {
    const matchesView = view === "all" || item.assignedTo === "Alice Librarian";
    const matchesTab = activeTab === "All" || item.status === activeTab;
    return matchesView && matchesTab;
  });

  const handleAction = (id: string, action: "Published" | "Rejected" | "Request Re-Upload") => {
    setQueueItems((current) =>
      current.map((item) => {
        if (item.id !== id) return item;
        const newComments = [...item.comments];
        if (feedback.trim()) {
          newComments.push({
            id: `c-${Date.now()}`,
            user: "Alice Librarian",
            text: feedback.trim(),
            date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          });
        }

        if (action === "Request Re-Upload") {
          newComments.push({
            id: `c-${Date.now()}-req`,
            user: "Alice Librarian",
            text: "Please re-upload with missing documentation and corrected metadata.",
            date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          });
          return { ...item, comments: newComments };
        }

        return {
          ...item,
          status: action === "Published" ? "Published" : "Rejected",
          comments: newComments,
        };
      })
    );

    toast({
      title: action === "Request Re-Upload" ? "Re-upload requested" : `Submission ${action}`,
      description:
        action === "Request Re-Upload"
          ? "The student has been asked to submit an updated version."
          : `The document has been successfully ${action.toLowerCase()}.`,
    });
    setFeedback("");
  };

  return (
    <AppLayout 
      title="Library Content Moderation" 
      subtitle="Final review and archival management of academic submissions."
    >
      <div className="space-y-6">

        {/* Statistics & Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { 
              label: "My Assignments", 
              value: queueItems.filter(i => i.assignedTo === "Alice Librarian" && i.status === "Pending").length,
              desc: "Pending your final review",
              icon: UserCheck,
              color: "text-emerald-600",
              bg: "bg-emerald-50"
            },
            { 
              label: "Global Queue", 
              value: queueItems.filter(i => i.status === "Pending").length,
              desc: "Total pending submissions",
              icon: Globe,
              color: "text-[#1d3557]",
              bg: "bg-slate-100"
            },
          ].map((stat, i) => (
            <Card key={i} className="group shadow-sm border-slate-200 transition-all duration-300 hover:shadow-md bg-white">
              <CardContent className="p-3 text-left">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.22em] group-hover:text-[#1d3557] transition-colors">{stat.label}</h3>
                  <div className={`h-7 w-7 rounded-lg ${stat.bg} flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="h-3.5 w-3.5" />
                  </div>
                </div>
                <div className="flex items-end gap-2 mb-1">
                  <span className="text-xl font-bold text-slate-800">{stat.value}</span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium">{stat.desc}</p>
              </CardContent>
            </Card>
          ))}
          
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-0">
          {["Pending", "Published", "Rejected", "All"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-xs font-bold uppercase tracking-widest transition-all border-b-2 ${
                activeTab === tab ? "border-[#1d3557] text-[#1d3557]" : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Moderation List */}
        <div className="space-y-4">
          {filtered.map((item) => (
            <Card key={item.id} className={`group border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-md ${expandedItem === item.id ? "ring-2 ring-[#1d3557] shadow-lg" : "hover:border-[#1d3557]/30"}`}>
              <CardContent className="p-0">
                <div className="flex items-center gap-4 p-5">
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center transition-colors ${expandedItem === item.id ? "bg-[#1d3557] text-white" : "bg-slate-100 text-[#1d3557]"}`}>
                    <FileText className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-widest bg-slate-50 text-slate-500 border-slate-200">{item.type}</Badge>
                      <Badge variant="outline" className={`text-[9px] font-bold uppercase tracking-widest ${
                        item.plagiarismScore > 30 ? "bg-red-50 text-red-600 border-red-200" : "bg-emerald-50 text-emerald-600 border-emerald-200"
                      }`}>
                        {item.plagiarismScore}% Similarity
                      </Badge>
                    </div>
                    <h4 className="text-[15px] font-bold text-slate-800 group-hover:text-[#1d3557] transition-colors truncate">{item.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-[11px] text-slate-500 font-medium">{item.author} · {item.department}</p>
                      <span className="text-slate-300">|</span>
                      <p className="text-[11px] text-slate-400 font-bold uppercase tracking-tighter">Submitted {item.submittedDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="hidden sm:flex flex-col items-end mr-2">
                       <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Assigned To</p>
                       <p className="text-[11px] font-bold text-[#1d3557]">{item.assignedTo || "Unassigned"}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={`h-10 w-10 p-0 rounded-xl transition-all ${expandedItem === item.id ? "bg-[#1d3557] text-white hover:bg-[#1d3557] hover:text-white" : "hover:bg-slate-100"}`} 
                      onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                    >
                      {expandedItem === item.id ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </Button>
                  </div>
                </div>

                {expandedItem === item.id && (
                  <div className="border-t border-slate-100 bg-slate-50/50 p-8 space-y-8 animate-in slide-in-from-top-4 duration-500">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Left: Supervision & Progress */}
                      <div className="lg:col-span-1 space-y-6">
                        <div className="space-y-3">
                          <p className="text-[10px] font-bold text-[#1d3557] uppercase tracking-[0.2em]">Archival Progress</p>
                          <div className="flex items-center gap-4">
                            <div className="flex-1">
                              <Progress value={item.workflowStep * 33.3} className="h-2 [&>div]:bg-emerald-500" />
                            </div>
                            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">STEP {item.workflowStep}/3</span>
                          </div>
                          <div className="flex flex-col gap-3 mt-4">
                            <div className="flex items-center gap-3 text-[12px] text-emerald-600 font-bold bg-white p-3 rounded-xl border border-emerald-100 shadow-sm">
                              <CheckCircle className="h-4 w-4" /> Supervisor Verification
                            </div>
                            <div className="flex items-center gap-3 text-[12px] text-emerald-600 font-bold bg-white p-3 rounded-xl border border-emerald-100 shadow-sm">
                              <CheckCircle className="h-4 w-4" /> HOD Content Approval
                            </div>
                            <div className="flex items-center gap-3 text-[12px] text-slate-800 font-bold bg-white p-3 rounded-xl border border-[#1d3557]/20 shadow-md ring-1 ring-[#1d3557]/10 scale-105 transition-transform">
                              <ShieldCheck className="h-4 w-4 text-[#1d3557]" /> Librarian Final Moderation
                            </div>
                          </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                          <div className="flex items-center justify-between mb-4">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Departmental Log</p>
                            <History className="h-3.5 w-3.5 text-slate-300" />
                          </div>
                          <div className="space-y-4">
                            {item.comments.length > 0 ? item.comments.map(c => (
                              <div key={c.id} className="relative pl-4 border-l-2 border-slate-100 space-y-1">
                                <div className="absolute -left-1.5 top-0 h-3 w-3 rounded-full bg-white border-2 border-slate-200" />
                                <div className="flex justify-between text-[10px]">
                                  <span className="font-bold text-[#1d3557]">{c.user}</span>
                                  <span className="text-slate-400 font-medium">{c.date}</span>
                                </div>
                                <p className="text-[12px] text-slate-600 leading-relaxed italic">"{c.text}"</p>
                              </div>
                            )) : (
                               <div className="text-center py-4 text-slate-400 italic text-[11px]">No previous comments found.</div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Librarian Actions & New Feedback */}
                      <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                          <p className="text-[10px] font-bold text-[#1d3557] uppercase tracking-[0.2em] mb-4">Final Librarian Feedback</p>
                          <div className="space-y-4">
                            <Textarea 
                              placeholder="Add your moderation comments and final feedback for the student..."
                              className="bg-slate-50 border-slate-100 text-[13px] h-32 focus:bg-white transition-all rounded-xl p-4 leading-relaxed"
                              value={feedback}
                              onChange={(e) => setFeedback(e.target.value)}
                            />
                            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                              <Button 
                                className="w-full sm:flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 gap-2 text-[11px] tracking-widest shadow-lg shadow-emerald-600/20"
                                onClick={() => handleAction(item.id, "Published")}
                              >
                                <CheckCircle className="h-4 w-4" /> APPROVE & PUBLISH
                              </Button>
                              <Button 
                                variant="outline" 
                                className="w-full sm:flex-1 border-red-200 text-red-600 hover:bg-red-50 font-bold h-12 gap-2 text-[11px] tracking-widest"
                                onClick={() => handleAction(item.id, "Rejected")}
                              >
                                <X className="h-4 w-4" /> REJECT SUBMISSION
                              </Button>
                            </div>
                            
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-4 border-t border-slate-50">
                               <Button size="sm" variant="ghost" className="text-[11px] font-bold text-slate-500 h-9 gap-2 hover:bg-slate-100" onClick={() => handleAction(item.id, "Request Re-Upload") }>
                                 <RefreshCw className="h-3.5 w-3.5" /> REQUEST RE-UPLOAD
                               </Button>
                               <Button size="sm" variant="ghost" className="text-[11px] font-bold text-slate-500 h-9 gap-2 hover:bg-amber-50 hover:text-amber-600" onClick={() => toast({ title: "Flagged for review", description: "This item now requires additional integrity validation." }) }>
                                 <AlertTriangle className="h-3.5 w-3.5" /> FLAG WARNING
                               </Button>
                               <Button size="sm" variant="ghost" className="col-span-2 sm:col-span-1 text-[11px] font-bold text-[#1d3557] h-9 gap-2 ml-auto group" onClick={() => toast({ title: "View document", description: "Opening the full document viewer." }) }>
                                 <Eye className="h-3.5 w-3.5" /> VIEW FULL DOCUMENT
                                 <ChevronRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                               </Button>
                            </div>
                          </div>
                        </div>

                        {/* Quick Tips for Moderators */}
                        <div className="bg-[#1d3557]/5 border border-[#1d3557]/10 rounded-2xl p-5 flex gap-4 items-start">
                          <div className="h-10 w-10 rounded-xl bg-[#1d3557] text-white flex items-center justify-center flex-shrink-0 shadow-md">
                            <Info className="h-5 w-5" />
                          </div>
                          <div>
                            <h5 className="text-[12px] font-bold text-[#1d3557] mb-1">Moderator Quick Guide</h5>
                            <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                              Ensure the document is a valid PDF, plagiarism score is under 20%, and all metadata (Title, Author) matches the uploaded file before publishing to the public archive.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default ModerationPage;
