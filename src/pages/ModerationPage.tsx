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
  History, FileText, Send, Globe, Info, ChevronRight, Sparkles
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { pushNotification } from "@/lib/notifications";

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

function getStudentUserId(projectId: string): string {
  if (projectId.startsWith("fyp-")) return "u1";
  if (projectId === "sub1") return "u1";
  if (projectId === "sub2") return "u5";
  if (projectId === "sub3") return "u6";
  return "u1";
}

function getFypQueueItems(): ModerationItem[] {
  try {
    const raw = localStorage.getItem("auca_student_fyp_projects");
    if (!raw) return [];
    const projects = JSON.parse(raw);
    if (!Array.isArray(projects)) return [];
    
    const profileRaw = localStorage.getItem("auca_student_fyp_profile");
    let authorName = "Jean Pierre Habimana";
    if (profileRaw) {
      try {
        const p = JSON.parse(profileRaw);
        if (p.fullName) authorName = p.fullName;
      } catch {}
    }

    return projects
      .filter((p: any) => p.status && p.status !== "DRAFT")
      .map((p: any) => {
        let status: ModerationItem["status"] = "Pending";
        if (p.status === "SUBMITTED") status = "Pending";
        else if (p.status === "Published" || p.status === "APPROVED") status = "Published";
        else if (p.status === "REJECTED" || p.status === "Correction Requested") status = "Rejected";

        return {
          id: p.id,
          title: p.title,
          author: authorName,
          department: p.department || "Information Technology",
          type: "Student Project",
          status,
          assignedTo: "Alice Librarian",
          submittedDate: p.createdAt ? p.createdAt.slice(0, 10) : new Date().toISOString().slice(0, 10),
          workflowStep: 3,
          plagiarismScore: 12,
          comments: p.comments || [],
          recommended: !!p.recommended
        } as ModerationItem & { recommended?: boolean };
      });
  } catch {
    return [];
  }
}

const updateLocalFypProject = (
  projectId: string,
  updates: {
    status?: string;
    comments?: any[];
    recommended?: boolean;
  }
) => {
  try {
    const raw = localStorage.getItem("auca_student_fyp_projects");
    if (!raw) return;
    const projects = JSON.parse(raw);
    if (!Array.isArray(projects)) return;
    const index = projects.findIndex((p: any) => p.id === projectId);
    if (index >= 0) {
      projects[index] = { ...projects[index], ...updates };
      localStorage.setItem("auca_student_fyp_projects", JSON.stringify(projects));
      window.dispatchEvent(new Event("storage"));
    }
  } catch (e) {
    console.error(e);
  }
};

const ModerationPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [queueItems, setQueueItems] = useState<ModerationItem[]>([]);
  const [view, setView] = useState<"assigned" | "all">("assigned");
  const [activeTab, setActiveTab] = useState("Pending");
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const fypItems = getFypQueueItems();
    const merged = [...fypItems, ...mockModerationQueue];
    setQueueItems(merged);
  }, []);

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
    let projectTitle = "";
    let finalComments: any[] = [];

    setQueueItems((current) =>
      current.map((item) => {
        if (item.id !== id) return item;
        projectTitle = item.title;
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
          finalComments = newComments;
          return { ...item, status: "Rejected", comments: newComments };
        }

        finalComments = newComments;
        return {
          ...item,
          status: action === "Published" ? "Published" : "Rejected",
          comments: newComments,
        };
      })
    );

    if (id.startsWith("fyp-")) {
      const localStatus = action === "Published" ? "APPROVED" : "Correction Requested";
      updateLocalFypProject(id, { status: localStatus, comments: finalComments });
    }

    const studentId = getStudentUserId(id);
    
    if (feedback.trim()) {
      pushNotification({
        userId: studentId,
        type: "comment",
        title: "New Moderator Comment",
        body: `Alice Librarian commented on your project "${projectTitle}": "${feedback.trim()}"`,
        fromRole: "moderator",
        fromName: "Alice Librarian",
      });
    }

    if (action === "Published") {
      pushNotification({
        userId: studentId,
        type: "approved",
        title: "Project Submission Approved",
        body: `Your project "${projectTitle}" has been approved and published to the archive.`,
        fromRole: "moderator",
        fromName: "Alice Librarian",
      });
    } else if (action === "Rejected") {
      pushNotification({
        userId: studentId,
        type: "rejected",
        title: "Submission Rejected",
        body: `Your project submission "${projectTitle}" was rejected. Please see comments.`,
        fromRole: "moderator",
        fromName: "Alice Librarian",
      });
    } else if (action === "Request Re-Upload") {
      pushNotification({
        userId: studentId,
        type: "reupload",
        title: "Correction & Re-upload Requested",
        body: `Correction requested for "${projectTitle}". Please re-upload with requested documentation.`,
        fromRole: "moderator",
        fromName: "Alice Librarian",
      });
    }

    toast({
      title: action === "Request Re-Upload" ? "Re-upload requested" : `Submission ${action}`,
      description:
        action === "Request Re-Upload"
          ? "The student has been asked to submit an updated version."
          : `The document has been successfully ${action.toLowerCase()}.`,
    });
    setFeedback("");
  };

  const handleRecommend = (id: string) => {
    let projectTitle = "";
    let isNowRecommended = false;

    setQueueItems((current) =>
      current.map((item) => {
        if (item.id !== id) return item;
        projectTitle = item.title;
        isNowRecommended = !(item as any).recommended;
        
        const newComments = [...item.comments];
        if (isNowRecommended) {
          newComments.push({
            id: `c-rec-${Date.now()}`,
            user: "Alice Librarian",
            text: "Recommended for display in the public AUCA Archive Research Showcase.",
            date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          });
        }
        
        return {
          ...item,
          recommended: isNowRecommended,
          comments: newComments,
        } as any;
      })
    );

    if (id.startsWith("fyp-")) {
      const raw = localStorage.getItem("auca_student_fyp_projects");
      let currentComments: any[] = [];
      if (raw) {
        const projects = JSON.parse(raw);
        const p = projects.find((x: any) => x.id === id);
        if (p) currentComments = p.comments || [];
      }
      
      if (isNowRecommended) {
        currentComments.push({
          id: `c-rec-${Date.now()}`,
          user: "Alice Librarian",
          text: "Recommended for display in the public AUCA Archive Research Showcase.",
          date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        });
      }

      updateLocalFypProject(id, { recommended: isNowRecommended, comments: currentComments });
    }

    const studentId = getStudentUserId(id);
    if (isNowRecommended) {
      pushNotification({
        userId: studentId,
        type: "recommendation",
        title: "Project Nominated for Showcase",
        body: `Congratulations! Your project "${projectTitle}" has been recommended for the Research Showcase.`,
        fromRole: "moderator",
        fromName: "Alice Librarian",
      });
      toast.success("Project recommended for Research Showcase!");
    } else {
      toast.message("Recommendation removed.");
    }
  };

  return (
    <AppLayout 
      title="Library Content Moderation" 
      subtitle="Final review and archival management of academic submissions."
    >
      <div className="space-y-8 pb-10">

        {/* Header Section with Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { 
              label: "My Assignments", 
              value: queueItems.filter(i => i.assignedTo === "Alice Librarian" && i.status === "Pending").length,
              desc: "Pending your final review",
              icon: UserCheck,
              color: "text-emerald-600",
              bg: "bg-emerald-50",
              borderColor: "border-emerald-200"
            },
            { 
              label: "Global Queue", 
              value: queueItems.filter(i => i.status === "Pending").length,
              desc: "Total pending submissions",
              icon: Globe,
              color: "text-[#003566]",
              bg: "bg-blue-50",
              borderColor: "border-blue-200"
            },
          ].map((stat, i) => (
            <Card key={i} className={`group shadow-md border ${stat.borderColor} transition-all duration-500 hover:shadow-lg bg-white rounded-[1.25rem] overflow-hidden`}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-[11px] font-bold text-[#8a8fa8] uppercase tracking-[0.18em] mb-2">{stat.label}</h3>
                    <span className="text-3xl font-bold text-[#1a1d2e]">{stat.value}</span>
                  </div>
                  <div className={`h-10 w-10 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color} shadow-sm`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-[12px] text-[#8a8fa8] font-medium">{stat.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 border-b border-[#e8eaf2] pb-0">
          {["Pending", "Published", "Rejected", "All"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-[12px] font-bold uppercase tracking-[0.14em] transition-all border-b-2 ${
                activeTab === tab ? "border-[#003566] text-[#003566]" : "border-transparent text-[#8a8fa8] hover:text-[#1a1d2e]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Moderation List */}
        <div className="space-y-4">
          {filtered.map((item) => (
            <Card key={item.id} className={`group border-[#e8eaf2] overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md rounded-[1.25rem] ${expandedItem === item.id ? "ring-2 ring-[#003566] shadow-lg" : "hover:border-[#003566]/20"}`}>
              <CardContent className="p-0">
                <div className="flex items-center gap-4 p-5 hover:bg-[#f7f8fd] transition-colors">
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center transition-all font-bold ${expandedItem === item.id ? "bg-[#003566] text-white" : "bg-[#e8f2fc] text-[#003566]"}`}>
                    <FileText className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="text-[10px] font-bold uppercase tracking-[0.12em] bg-[#f0f2f8] text-[#8a8fa8] border border-[#e8eaf2] rounded-full px-3">{item.type}</Badge>
                      <Badge className={`text-[10px] font-bold uppercase tracking-[0.12em] rounded-full px-3 ${
                        item.plagiarismScore > 30 ? "bg-red-50 text-red-700 border border-red-200" : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      }`}>
                        {item.plagiarismScore}% Sim
                      </Badge>
                    </div>
                    <h4 className="text-[14px] font-bold text-[#1a1d2e] group-hover:text-[#003566] transition-colors line-clamp-1">{item.title}</h4>
                    <div className="flex items-center gap-2 mt-1.5 text-[12px]">
                      <p className="text-[#8a8fa8] font-medium">{item.author} · {item.department}</p>
                      <span className="text-[#e8eaf2]">•</span>
                      <p className="text-[#8a8fa8] font-medium">{item.submittedDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="hidden sm:flex flex-col items-end">
                       <p className="text-[10px] font-bold text-[#8a8fa8] uppercase tracking-[0.12em] mb-1">{item.assignedTo ? "Assigned" : "Unassigned"}</p>
                       <p className="text-[12px] font-bold text-[#003566]">{item.assignedTo ? item.assignedTo.split(" ")[0] : "—"}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={`h-10 w-10 p-0 rounded-xl transition-all ${expandedItem === item.id ? "bg-[#003566] text-white hover:bg-[#003566] hover:text-white" : "hover:bg-[#f7f8fd]"}`} 
                      onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                    >
                      {expandedItem === item.id ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </Button>
                  </div>
                </div>

                {expandedItem === item.id && (
                  <div className="border-t border-[#e8eaf2] bg-[#f7f8fd] p-8 space-y-8 animate-in slide-in-from-top-4 duration-500">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Left: Supervision & Progress */}
                      <div className="lg:col-span-1 space-y-6">
                        <div className="space-y-4">
                          <p className="text-[11px] font-bold text-[#003566] uppercase tracking-[0.18em]">Archival Progress</p>
                          <div className="flex items-center gap-4">
                            <div className="flex-1">
                              <Progress value={item.workflowStep * 33.3} className="h-2 [&>div]:bg-emerald-500" />
                            </div>
                            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">STEP {item.workflowStep}/3</span>
                          </div>
                          <div className="flex flex-col gap-2 mt-4">
                            <div className="flex items-center gap-3 text-[12px] text-emerald-700 font-bold bg-white p-3 rounded-[0.875rem] border border-emerald-100 shadow-sm hover:shadow-md transition-all">
                              <CheckCircle className="h-4 w-4 flex-shrink-0" /> Supervisor Verification
                            </div>
                            <div className="flex items-center gap-3 text-[12px] text-emerald-700 font-bold bg-white p-3 rounded-[0.875rem] border border-emerald-100 shadow-sm hover:shadow-md transition-all">
                              <CheckCircle className="h-4 w-4 flex-shrink-0" /> HOD Content Approval
                            </div>
                            <div className="flex items-center gap-3 text-[12px] text-[#003566] font-bold bg-white p-3 rounded-[0.875rem] border-2 border-[#003566] shadow-md ring-1 ring-[#003566]/10 scale-105 transition-transform">
                              <ShieldCheck className="h-4 w-4 flex-shrink-0" /> Librarian Final Moderation
                            </div>
                          </div>
                        </div>

                        <div className="rounded-[1.125rem] border border-[#e8eaf2] bg-white p-5 shadow-sm hover:shadow-md transition-all">
                          <div className="flex items-center justify-between mb-4">
                            <p className="text-[11px] font-bold text-[#8a8fa8] uppercase tracking-[0.14em]">Departmental Log</p>
                            <History className="h-4 w-4 text-[#e8eaf2]" />
                          </div>
                          <div className="space-y-4">
                            {item.comments.length > 0 ? item.comments.map(c => (
                              <div key={c.id} className="relative pl-4 border-l-2 border-[#e8eaf2] space-y-1">
                                <div className="absolute -left-1.5 top-0 h-3 w-3 rounded-full bg-white border-2 border-[#e8eaf2]" />
                                <div className="flex justify-between text-[11px]">
                                  <span className="font-bold text-[#1a1d2e]">{c.user}</span>
                                  <span className="text-[#8a8fa8] font-medium">{c.date}</span>
                                </div>
                                <p className="text-[12px] text-[#8a8fa8] leading-relaxed">{c.text}</p>
                              </div>
                            )) : (
                               <div className="text-center py-4 text-[#8a8fa8] text-[11px]">No previous comments found.</div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Librarian Actions & New Feedback */}
                      <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-[1.125rem] border border-[#e8eaf2] p-6 shadow-sm hover:shadow-md transition-all">
                          <p className="text-[11px] font-bold text-[#003566] uppercase tracking-[0.18em] mb-4">Final Librarian Feedback</p>
                          <div className="space-y-4">
                            <Textarea 
                              placeholder="Add your moderation comments and final feedback for the student..."
                              className="bg-[#f7f8fd] border-[#e8eaf2] text-[13px] text-[#1a1d2e] h-32 focus:bg-white focus:border-[#003566]/50 transition-all rounded-[0.875rem] p-4 leading-relaxed placeholder:text-[#8a8fa8]"
                              value={feedback}
                              onChange={(e) => setFeedback(e.target.value)}
                            />
                            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                              <Button 
                                className="w-full sm:flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11 gap-2 text-[11px] tracking-[0.12em] shadow-md hover:shadow-lg transition-all rounded-[0.875rem]"
                                onClick={() => handleAction(item.id, "Published")}
                              >
                                <CheckCircle className="h-4 w-4" /> APPROVE & PUBLISH
                              </Button>
                              <Button 
                                variant="outline" 
                                className="w-full sm:flex-1 border-red-200 text-red-600 hover:bg-red-50 font-bold h-11 gap-2 text-[11px] tracking-[0.12em] rounded-[0.875rem]"
                                onClick={() => handleAction(item.id, "Rejected")}
                              >
                                <X className="h-4 w-4" /> REJECT SUBMISSION
                              </Button>
                            </div>
                            
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-4 border-t border-[#e8eaf2]">
                               <Button size="sm" variant="ghost" className="text-[11px] font-bold text-[#8a8fa8] h-9 gap-2 hover:bg-[#f7f8fd] hover:text-[#003566] rounded-[0.75rem] transition-all" onClick={() => handleAction(item.id, "Request Re-Upload") }>
                                 <RefreshCw className="h-3.5 w-3.5" /> REQUEST RE-UPLOAD
                               </Button>
                               <Button 
                                 size="sm" 
                                 variant="ghost" 
                                 className={`text-[11px] font-bold h-9 gap-2 rounded-[0.75rem] transition-all ${
                                   (item as any).recommended 
                                   ? "text-amber-600 hover:bg-amber-50" 
                                   : "text-[#8a8fa8] hover:bg-[#f7f8fd] hover:text-[#003566]"
                                 }`}
                                 onClick={() => handleRecommend(item.id)}
                               >
                                 <Sparkles className="h-3.5 w-3.5" /> 
                                 {(item as any).recommended ? "RECOMMENDED" : "RECOMMEND SHOWCASE"}
                               </Button>
                               <Button size="sm" variant="ghost" className="col-span-2 sm:col-span-1 text-[11px] font-bold text-[#003566] h-9 gap-2 ml-auto group hover:bg-[#f7f8fd] rounded-[0.75rem] transition-all" onClick={() => toast({ title: "View document", description: "Opening the full document viewer." }) }>
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
