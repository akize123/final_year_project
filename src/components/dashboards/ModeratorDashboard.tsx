import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line, PieChart, Pie, Cell
} from "recharts";
import { useState } from "react";
import { 
  Filter, ChevronDown, CheckCircle2,
  Users, Activity, ChevronRight, BarChart2, ShieldCheck, XCircle, FileText, Clock,
  MessageSquare, Send, Download, Eye, AlertCircle, TrendingUp, Calendar, Award, Zap
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

const weeklyTrendData = [
  { week: "Week 1", verified: 8, rejected: 2, pending: 12 },
  { week: "Week 2", verified: 12, rejected: 3, pending: 18 },
  { week: "Week 3", verified: 15, rejected: 1, pending: 16 },
  { week: "Week 4", verified: 10, rejected: 2, pending: 24 },
];

const queue = [
  { id: 1, title: "Mobile Health Tracking Application", author: "David Mugabo", initials: "DM", dept: "IT", type: "Student Project", date: "Mar 15, 2025", pages: 48, confidence: 92 },
  { id: 2, title: "Impact of Microfinance on Rural Communities", author: "Dr. Jean B. Niyonzima", initials: "JN", dept: "Economics", type: "Publication", date: "Mar 14, 2025", pages: 24, confidence: 85 },
  { id: 3, title: "Solar Energy Management Dashboard", author: "Grace Uwimana", initials: "GU", dept: "Engineering", type: "Student Project", date: "Mar 13, 2025", pages: 62, confidence: 98 },
  { id: 4, title: "Machine Learning in Agricultural Yield Prediction", author: "Prof. Agnes Ntamwiza", initials: "AN", dept: "CS", type: "Publication", date: "Mar 12, 2025", pages: 18, confidence: 75 },
  { id: 5, title: "Kinyarwanda NLP Text Classifier", author: "Eric Habimana", initials: "EH", dept: "IT", type: "Student Project", date: "Mar 11, 2025", pages: 55, confidence: 95 },
];

const communications = [
  { id: 1, type: "system", message: "New submission from David Mugabo", time: "10:45 AM", avatar: "DM", name: "David Mugabo" },
  { id: 2, type: "user", message: "Please review the document for plagiarism", time: "10:30 AM", avatar: "YOU", name: "You" },
  { id: 3, type: "system", message: "Submission status updated to pending verification", time: "10:15 AM", avatar: "SYS", name: "System" },
];

export function ModeratorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState<number | null>(1);
  const [messageInput, setMessageInput] = useState("");
  const [allMessages, setAllMessages] = useState(communications);

  const myAssignedCount = 12;
  const pendingGlobal = 24;
  const approvedCount = 42;
  const rejectedCount = 8;

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    const newMessage = {
      id: allMessages.length + 1,
      type: "user" as const,
      message: messageInput,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      avatar: "YOU",
      name: "You"
    };
    setAllMessages([...allMessages, newMessage]);
    setMessageInput("");
  };

  return (
    <div className="space-y-8 pb-10">
      {/* ── Welcome Header ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[20px] font-bold text-[#1a1d2e]">Content Moderation Hub</h1>
            <p className="text-[12px] text-[#8a8fa8] font-medium mt-1">Manage submissions, reviews, and communications</p>
          </div>
          <Button 
            onClick={() => navigate("/moderation")}
            className="h-10 bg-[#003566] hover:bg-[#003566]/90 text-white font-bold text-[11px] tracking-[0.12em] gap-2 rounded-[0.875rem]"
          >
            <Eye className="h-4 w-4" /> FULL MODERATION VIEW
          </Button>
        </div>
      </div>

      {/* ── Key Metrics Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Verified", value: approvedCount, icon: CheckCircle2, color: "emerald", bgColor: "bg-emerald-50" },
          { label: "Pending Review", value: pendingGlobal, icon: Clock, color: "blue", bgColor: "bg-blue-50" },
          { label: "Rejected", value: rejectedCount, icon: XCircle, color: "red", bgColor: "bg-red-50" },
          { label: "This Week", value: 33, icon: TrendingUp, color: "purple", bgColor: "bg-purple-50" },
        ].map((metric, i) => (
          <Card key={i} className="border-[#e8eaf2] shadow-sm hover:shadow-md transition-all rounded-[1.125rem] bg-white">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-bold text-[#8a8fa8] uppercase tracking-[0.12em] mb-2">{metric.label}</p>
                  <p className="text-2xl font-bold text-[#1a1d2e]">{metric.value}</p>
                </div>
                <div className={`${metric.bgColor} h-10 w-10 rounded-xl flex items-center justify-center`}>
                  <metric.icon className="h-5 w-5" style={{
                    color: metric.color === "emerald" ? "#047857" : metric.color === "blue" ? "#003566" : metric.color === "red" ? "#dc2626" : "#7c3aed"
                  }} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Main Content Grid ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Col: Verification Queue + Weekly Trend */}
        <div className="xl:col-span-2 space-y-8">
          {/* Verification Queue */}
          <Card className="border-[#e8eaf2] shadow-md hover:shadow-lg transition-all rounded-[1.25rem] bg-white overflow-hidden">
            <CardContent className="p-0">
              <div className="flex items-center justify-between p-5 border-b border-[#e8eaf2] bg-[#f7f8fd]">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-[#e8f2fc] flex items-center justify-center text-[#003566]">
                    <FileText className="h-5 w-5" />
                  </div>
                  <h2 className="text-[12px] font-bold text-[#1a1d2e] uppercase tracking-[0.14em]">Pending Submissions</h2>
                </div>
              </div>
              
              <div className="p-5">
                {/* Queue Items */}
                <div className="space-y-3">
                  {queue.slice(0, 3).map((item) => (
                    <div 
                      key={item.id} 
                      onClick={() => setSelectedItem(item.id)}
                      className={`group cursor-pointer p-4 rounded-[0.875rem] border transition-all duration-300 ${
                        selectedItem === item.id 
                          ? "border-[#003566] bg-[#e8f2fc] shadow-md" 
                          : "border-[#e8eaf2] hover:bg-[#f7f8fd] hover:border-[#003566]/30"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-[13px] font-bold text-[#1a1d2e] line-clamp-1">{item.title}</h4>
                        <Badge className="bg-[#e8f2fc] text-[#003566] border border-[#003566]/20 text-[9px] font-bold uppercase tracking-[0.1em] px-2 py-1 rounded-full">
                          {item.dept}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mb-2 text-[11px] text-[#8a8fa8]">
                        <div className="h-5 w-5 rounded-full bg-[#e8eaf2] flex items-center justify-center text-[8px] font-bold text-[#003566]">
                          {item.initials}
                        </div>
                        <span>{item.author}</span>
                        <span>•</span>
                        <span>{item.pages}p</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 flex-1 bg-[#e8eaf2] rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-emerald-500 rounded-full transition-all" 
                            style={{ width: `${item.confidence}%` }} 
                          />
                        </div>
                        <span className="text-[10px] font-bold text-[#8a8fa8]">{item.confidence}%</span>
                      </div>
                    </div>
                  ))}
                </div>
                <Button 
                  variant="ghost"
                  className="w-full mt-4 text-[11px] font-bold text-[#003566] hover:bg-[#f7f8fd]"
                  onClick={() => navigate("/moderation")}
                >
                  View All {queue.length} Submissions <ChevronRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Trend Chart */}
          <Card className="border-[#e8eaf2] shadow-md hover:shadow-lg transition-all rounded-[1.25rem] bg-white overflow-hidden">
            <CardContent className="p-0">
              <div className="flex items-center justify-between p-5 border-b border-[#e8eaf2] bg-[#f7f8fd]">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-[#e8f2fc] flex items-center justify-center text-[#003566]">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <h2 className="text-[12px] font-bold text-[#1a1d2e] uppercase tracking-[0.14em]">Weekly Trend</h2>
                </div>
              </div>
              
              <div className="p-5">
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart data={weeklyTrendData}>
                    <CartesianGrid stroke="#e8eaf2" vertical={false} />
                    <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#8a8fa8" }} axisLine={{ stroke: "#e8eaf2" }} />
                    <YAxis tick={{ fontSize: 11, fill: "#8a8fa8" }} axisLine={{ stroke: "#e8eaf2" }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e8eaf2", borderRadius: "8px" }}
                      labelStyle={{ color: "#1a1d2e" }}
                    />
                    <Line type="monotone" dataKey="verified" stroke="#10b981" strokeWidth={2} dot={{ fill: "#10b981", r: 4 }} />
                    <Line type="monotone" dataKey="pending" stroke="#3b82f6" strokeWidth={2} dot={{ fill: "#3b82f6", r: 4 }} />
                    <Line type="monotone" dataKey="rejected" stroke="#ef4444" strokeWidth={2} dot={{ fill: "#ef4444", r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
                <div className="flex items-center justify-center gap-6 mt-4 text-[11px] font-bold">
                  <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Verified</span>
                  <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-blue-500" /> Pending</span>
                  <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-red-500" /> Rejected</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Col: Communication Hub */}
        <div className="space-y-8">
          {/* Communication Panel */}
          <Card className="border-[#e8eaf2] shadow-md hover:shadow-lg transition-all rounded-[1.25rem] bg-white overflow-hidden flex flex-col h-full">
            <CardContent className="p-0 flex flex-col h-full">
              <div className="flex items-center justify-between p-5 border-b border-[#e8eaf2] bg-[#f7f8fd]">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-[#e8f2fc] flex items-center justify-center text-[#003566]">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <h2 className="text-[12px] font-bold text-[#1a1d2e] uppercase tracking-[0.14em]">Communications</h2>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-96">
                {allMessages.map((msg) => (
                  <div key={msg.id} className={`flex gap-3 ${msg.type === "user" ? "flex-row-reverse" : ""}`}>
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0 ${
                      msg.type === "user" ? "bg-[#003566] text-white" : msg.type === "system" ? "bg-[#e8eaf2] text-[#8a8fa8]" : "bg-[#e8f2fc] text-[#003566]"
                    }`}>
                      {msg.avatar}
                    </div>
                    <div className={`flex flex-col gap-1 flex-1 ${msg.type === "user" ? "items-end" : "items-start"}`}>
                      <div className={`px-3 py-2 rounded-[0.875rem] max-w-xs ${
                        msg.type === "user" 
                          ? "bg-[#003566] text-white" 
                          : msg.type === "system"
                          ? "bg-[#e8eaf2] text-[#8a8fa8]"
                          : "bg-[#f7f8fd] text-[#1a1d2e] border border-[#e8eaf2]"
                      }`}>
                        <p className="text-[12px] font-medium leading-relaxed break-words">{msg.message}</p>
                      </div>
                      <span className="text-[10px] text-[#8a8fa8]">{msg.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-[#e8eaf2] p-4 space-y-3">
                <div className="flex gap-2">
                  <Input 
                    placeholder="Type message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="bg-[#f7f8fd] border-[#e8eaf2] text-[12px] text-[#1a1d2e] placeholder:text-[#8a8fa8] rounded-[0.75rem] h-9"
                  />
                  <Button
                    onClick={handleSendMessage}
                    className="h-9 w-9 p-0 bg-[#003566] hover:bg-[#003566]/90 text-white rounded-[0.75rem]"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm"
                    variant="outline"
                    className="flex-1 text-[10px] font-bold h-8 border-[#e8eaf2] text-[#8a8fa8] hover:bg-[#f7f8fd]"
                  >
                    <Download className="h-3.5 w-3.5" /> EXPORT
                  </Button>
                  <Button 
                    size="sm"
                    className="flex-1 text-[10px] font-bold h-8 bg-[#003566] hover:bg-[#003566]/90 text-white"
                  >
                    <Award className="h-3.5 w-3.5" /> ASSIGN
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
