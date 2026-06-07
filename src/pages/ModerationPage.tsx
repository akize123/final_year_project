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
      title="Moderation Queue" 
      subtitle="Review and manage academic submissions."
    >
      <div className="space-y-4 pb-8">

        {/* Header & Metrics */}
        <div className="flex items-end justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-[#1a1d2e]">Queue</h1>
            <p className="text-sm text-[#8a8fa8] mt-0.5">{filtered.length} items total</p>
          </div>
          <div className="flex gap-2">
            <Select value={activeTab} onValueChange={setActiveTab}>
              <SelectTrigger className="h-9 w-40 bg-white border-[#e8eaf2] text-sm rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["All", "Pending", "Published", "Rejected"].map(tab => (
                  <SelectItem key={tab} value={tab}>{tab}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Quick Stats - Compact Inline */}
        <div className="flex gap-4 pb-2 border-b border-[#e8eaf2]">
          <div className="text-center">
            <p className="text-xs text-[#8a8fa8] font-medium">Assigned</p>
            <p className="text-lg font-bold text-[#1a1d2e]">{queueItems.filter(i => i.assignedTo === "Alice Librarian" && i.status === "Pending").length}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-[#8a8fa8] font-medium">Pending</p>
            <p className="text-lg font-bold text-[#003566]">{queueItems.filter(i => i.status === "Pending").length}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-[#8a8fa8] font-medium">Published</p>
            <p className="text-lg font-bold text-emerald-600">{queueItems.filter(i => i.status === "Published").length}</p>
          </div>
        </div>

        {/* Moderation List - Table-like */}
        <div className="divide-y divide-[#e8eaf2] border border-[#e8eaf2] rounded-lg bg-white overflow-hidden">
          {filtered.map((item) => (
            <div key={item.id} className={`transition-colors ${expandedItem === item.id ? "bg-[#e8f2fc]" : "hover:bg-[#f9fafb]"}`}>
              <button 
                onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                className="w-full px-5 py-3.5 flex items-center gap-4 text-left"
              >
                <div className={`h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 font-semibold text-sm ${expandedItem === item.id ? "bg-[#003566] text-white" : "bg-[#f0f2f8] text-[#003566]"}`}>
                  <FileText className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#1a1d2e] truncate">{item.title}</p>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-[#8a8fa8]">
                    <span>{item.author}</span>
                    <span>•</span>
                    <span>{item.department}</span>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-3">
                  <Badge className={`text-xs font-medium px-2 py-1 ${
                    item.plagiarismScore > 30 ? "bg-red-50 text-red-700 border border-red-200" : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  }`}>
                    {item.plagiarismScore}%
                  </Badge>
                  <Badge className="bg-[#f0f2f8] text-[#8a8fa8] text-xs font-medium px-2 py-1">{item.type}</Badge>
                  <span className="text-xs text-[#8a8fa8] font-medium min-w-[60px] text-right">{item.submittedDate}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 hover:bg-[#f0f2f8]"
                >
                  {expandedItem === item.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </button>

              {expandedItem === item.id && (
                <div className="border-t border-[#e8eaf2] bg-white px-5 py-4 space-y-4 animate-in slide-in-from-top-2 duration-300">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Progress & Log */}
                    <div className="lg:col-span-1 space-y-4">
                      <div className="bg-[#f9fafb] border border-[#e8eaf2] rounded-lg p-4">
                        <p className="text-xs font-semibold text-[#003566] mb-3">Workflow</p>
                        <div className="space-y-2.5">
                          <div className="flex items-center gap-2 text-xs">
                            <CheckCircle className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                            <span className="text-[#1a1d2e] font-medium">Supervisor Verified</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <CheckCircle className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                            <span className="text-[#1a1d2e] font-medium">HOD Approved</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <ShieldCheck className="h-4 w-4 text-[#003566] flex-shrink-0" />
                            <span className="text-[#003566] font-semibold">Final Review (You)</span>
                          </div>
                        </div>
                      </div>

                      {item.comments.length > 0 && (
                        <div className="bg-[#f9fafb] border border-[#e8eaf2] rounded-lg p-4">
                          <p className="text-xs font-semibold text-[#8a8fa8] mb-2">Comments</p>
                          <div className="space-y-2 max-h-32 overflow-y-auto text-xs">
                            {item.comments.map(c => (
                              <div key={c.id} className="text-[#8a8fa8]">
                                <span className="font-medium text-[#1a1d2e]">{c.user}:</span> {c.text}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right: Feedback & Actions */}
                    <div className="lg:col-span-2 space-y-4">
                      <div className="border border-[#e8eaf2] rounded-lg p-4">
                        <p className="text-xs font-semibold text-[#1a1d2e] mb-2">Feedback</p>
                        <Textarea 
                          placeholder="Add comments..."
                          className="bg-white border border-[#e8eaf2] text-sm text-[#1a1d2e] h-20 rounded-lg placeholder:text-[#8a8fa8] resize-none"
                          value={feedback}
                          onChange={(e) => setFeedback(e.target.value)}
                        />
                        <div className="grid grid-cols-2 gap-2 pt-3">
                          <Button 
                            className="h-9 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-lg gap-1.5"
                            onClick={() => handleAction(item.id, "Published")}
                          >
                            <CheckCircle className="h-3.5 w-3.5" /> Approve
                          </Button>
                          <Button 
                            className="h-9 border border-red-300 text-red-600 hover:bg-red-50 font-semibold text-sm rounded-lg gap-1.5"
                            variant="outline"
                            onClick={() => handleAction(item.id, "Rejected")}
                          >
                            <X className="h-3.5 w-3.5" /> Reject
                          </Button>
                          <Button 
                            size="sm"
                            variant="ghost"
                            className="h-8 text-xs font-medium text-[#8a8fa8] hover:bg-[#f9fafb]"
                            onClick={() => handleAction(item.id, "Request Re-Upload")}
                          >
                            <RefreshCw className="h-3 w-3" />
                          </Button>
                          <Button 
                            size="sm"
                            variant="ghost"
                            className={`h-8 text-xs font-medium ${(item as any).recommended ? "text-amber-600" : "text-[#8a8fa8]"}`}
                            onClick={() => handleRecommend(item.id)}
                          >
                            <Sparkles className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default ModerationPage;
