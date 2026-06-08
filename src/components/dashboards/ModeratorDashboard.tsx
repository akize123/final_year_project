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
import { jsPDF } from "jspdf";
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

  // Calculate real metrics from queue data
  const pendingCount = queue.length;
  const totalVerified = weeklyTrendData.reduce((sum, w) => sum + w.verified, 0);
  const totalRejected = weeklyTrendData.reduce((sum, w) => sum + w.rejected, 0);
  const avgConfidence = Math.round(queue.reduce((sum, q) => sum + q.confidence, 0) / queue.length);
  
  // Department breakdown
  const deptBreakdown = queue.reduce((acc, item) => {
    const existing = acc.find(d => d.name === item.dept);
    if (existing) existing.value += 1;
    else acc.push({ name: item.dept, value: 1 });
    return acc;
  }, [] as Array<{name: string; value: number}>);

  // Type breakdown
  const typeBreakdown = queue.reduce((acc, item) => {
    const existing = acc.find(t => t.name === item.type);
    if (existing) existing.value += 1;
    else acc.push({ name: item.type, value: 1 });
    return acc;
  }, [] as Array<{name: string; value: number}>);

  // Recent activity
  const recentActivity = queue.slice(0, 3).map((q, i) => ({
    id: q.id,
    action: i === 0 ? "submitted" : i === 1 ? "awaiting review" : "high confidence",
    item: q.title.substring(0, 35) + "...",
    time: "just now"
  }));

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

  const generatePDFReport = () => {
    const doc = new jsPDF();
    const timestamp = new Date().toLocaleString();
    const totalVerified = weeklyTrendData.reduce((sum, w) => sum + w.verified, 0);
    const totalRejected = weeklyTrendData.reduce((sum, w) => sum + w.rejected, 0);
    const totalPending = weeklyTrendData.reduce((sum, w) => sum + w.pending, 0);
    const totalSubmissions = totalVerified + totalRejected + totalPending;

    let yPosition = 20;

    // Header
    doc.setFontSize(18);
    doc.setFont(undefined, "bold");
    doc.text("MODERATION ACTIVITY REPORT", 20, yPosition);
    
    yPosition += 10;
    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    doc.text(`Generated: ${timestamp}`, 20, yPosition);

    // Summary Metrics
    yPosition += 15;
    doc.setFontSize(12);
    doc.setFont(undefined, "bold");
    doc.text("SUMMARY METRICS", 20, yPosition);
    
    yPosition += 8;
    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    doc.text(`Verified Submissions: ${totalVerified}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Rejected Submissions: ${totalRejected}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Pending Submissions: ${totalPending}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Total Submissions: ${totalSubmissions}`, 20, yPosition);

    // Weekly Breakdown
    yPosition += 12;
    doc.setFontSize(12);
    doc.setFont(undefined, "bold");
    doc.text("WEEKLY BREAKDOWN", 20, yPosition);
    
    yPosition += 8;
    doc.setFontSize(9);
    doc.setFont(undefined, "normal");
    weeklyTrendData.forEach(week => {
      doc.text(`${week.week}: Verified=${week.verified}, Rejected=${week.rejected}, Pending=${week.pending}`, 20, yPosition);
      yPosition += 6;
    });

    // Queue Status
    yPosition += 8;
    doc.setFontSize(12);
    doc.setFont(undefined, "bold");
    doc.text("SUBMISSION QUEUE STATUS", 20, yPosition);
    
    yPosition += 8;
    doc.setFontSize(9);
    doc.setFont(undefined, "normal");
    queue.forEach((q, i) => {
      const text = `${i + 1}. ${q.title.substring(0, 40)}... - ${q.author} (${q.dept}) - ${q.confidence}%`;
      doc.text(text, 20, yPosition);
      yPosition += 6;
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
    });

    // Save PDF
    doc.save(`moderation-report-${new Date().toISOString().split("T")[0]}.pdf`);
  };

  return (
    <div className="space-y-4 pb-8">
      {/* ── Header Section ── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1d2e]">Moderation Hub</h1>
          <p className="text-sm text-[#8a8fa8] mt-1">Review and manage {pendingCount} submissions</p>
        </div>
        <Button 
          onClick={() => navigate("/moderation")}
          className="h-9 bg-[#003566] hover:bg-[#003566]/90 text-white font-semibold text-sm gap-2 rounded-lg"
        >
          <Eye className="h-4 w-4" /> Full Queue
        </Button>
      </div>

      {/* ── Metrics Grid (Real Data - 4-column) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Verified", value: totalVerified, icon: CheckCircle2, color: "#10b981", bg: "#ecfdf5" },
          { label: "Pending", value: pendingCount, icon: Clock, color: "#3b82f6", bg: "#eff6ff" },
          { label: "Rejected", value: totalRejected, icon: XCircle, color: "#ef4444", bg: "#fef2f2" },
          { label: "Avg Quality", value: `${avgConfidence}%`, icon: TrendingUp, color: "#8b5cf6", bg: "#faf5ff" },
        ].map((metric, i) => (
          <div key={i} className="bg-white border border-[#e8eaf2] rounded-lg p-4 hover:border-[#003566]/20 transition-colors duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-[#8a8fa8] mb-1">{metric.label}</p>
                <p className="text-xl font-bold text-[#1a1d2e]">{metric.value}</p>
              </div>
              <div className="p-2 rounded-lg" style={{ backgroundColor: metric.bg }}>
                <metric.icon className="h-5 w-5" style={{ color: metric.color }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main Grid: Queue + Side Panels ── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        
        {/* Left: Queue Table View */}
        <div className="lg:col-span-2.5 space-y-4">
          {/* Queue Card */}
          <div className="bg-white border border-[#e8eaf2] rounded-lg overflow-hidden hover:border-[#003566]/10 transition-colors">
            <div className="flex items-center justify-between px-5 py-3 border-b border-[#e8eaf2] bg-[#f9fafb]">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#003566]" />
                <h3 className="text-sm font-semibold text-[#1a1d2e]">Pending Queue</h3>
                <span className="text-xs font-medium text-[#8a8fa8] bg-[#f3f4f6] px-2 py-1 rounded">{queue.length}</span>
              </div>
              <Button 
                variant="ghost" 
                onClick={() => navigate("/moderation")}
                className="h-8 text-xs font-medium text-[#003566] hover:bg-[#f3f4f6]"
              >
                View All <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
            
            {/* Table-style List */}
            <div className="divide-y divide-[#e8eaf2]">
              {queue.slice(0, 4).map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => setSelectedItem(item.id)}
                  className={`px-5 py-3 cursor-pointer transition-colors ${
                    selectedItem === item.id 
                      ? "bg-[#e8f2fc]" 
                      : "hover:bg-[#f9fafb]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#1a1d2e] truncate">{item.title}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="flex items-center gap-1">
                          <div className="h-5 w-5 rounded-full bg-[#e8eaf2] flex items-center justify-center text-[8px] font-bold text-[#003566]">
                            {item.initials}
                          </div>
                          <span className="text-xs text-[#8a8fa8]">{item.author}</span>
                        </div>
                        <span className="text-xs text-[#8a8fa8]">•</span>
                        <span className="text-xs text-[#8a8fa8]">{item.dept}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="w-16 h-1.5 bg-[#e8eaf2] rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-emerald-500 transition-all" 
                            style={{ width: `${item.confidence}%` }} 
                          />
                        </div>
                        <p className="text-xs font-semibold text-[#8a8fa8] mt-1">{item.confidence}%</p>
                      </div>
                      <Badge className="bg-[#e8f2fc] text-[#003566] border-0 text-xs font-medium px-2 py-1">{item.pages}p</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Trend Chart - Compact */}
          <div className="bg-white border border-[#e8eaf2] rounded-lg overflow-hidden hover:border-[#003566]/10 transition-colors">
            <div className="flex items-center justify-between px-5 py-3 border-b border-[#e8eaf2] bg-[#f9fafb]">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-[#003566]" />
                <h3 className="text-sm font-semibold text-[#1a1d2e]">Weekly Trend</h3>
              </div>
              <Button
                size="sm"
                className="h-8 text-xs font-medium bg-[#003566] hover:bg-[#003566]/90 text-white gap-1.5 rounded-lg"
                onClick={generatePDFReport}
              >
                <Download className="h-3.5 w-3.5" /> Export
              </Button>
            </div>
            
            <div className="p-4">
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={weeklyTrendData}>
                  <CartesianGrid stroke="#e8eaf2" vertical={false} strokeDasharray="0" />
                  <XAxis dataKey="week" tick={{ fontSize: 12, fill: "#8a8fa8" }} axisLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: "#8a8fa8" }} axisLine={false} width={40} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e8eaf2", borderRadius: "6px" }}
                    labelStyle={{ color: "#1a1d2e" }}
                  />
                  <Line type="monotone" dataKey="verified" stroke="#10b981" strokeWidth={2.5} dot={{ fill: "#10b981", r: 3 }} />
                  <Line type="monotone" dataKey="pending" stroke="#3b82f6" strokeWidth={2.5} dot={{ fill: "#3b82f6", r: 3 }} />
                  <Line type="monotone" dataKey="rejected" stroke="#ef4444" strokeWidth={2.5} dot={{ fill: "#ef4444", r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
              <div className="flex items-center justify-center gap-4 mt-3 text-xs font-medium">
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Verified</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-blue-500" /> Pending</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-red-500" /> Rejected</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar: 3 Panels */}
        <div className="space-y-4">
          {/* Quick Stats Panel */}
          <div className="bg-white border border-[#e8eaf2] rounded-lg overflow-hidden hover:border-[#003566]/10 transition-colors">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-[#e8eaf2] bg-[#f9fafb]">
              <BarChart2 className="h-4 w-4 text-[#003566]" />
              <h3 className="text-sm font-semibold text-[#1a1d2e]">Breakdown</h3>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <p className="text-xs font-medium text-[#8a8fa8] mb-2">By Type</p>
                <div className="space-y-1.5">
                  {typeBreakdown.map(item => (
                    <div key={item.name} className="flex items-center justify-between text-xs">
                      <span className="text-[#1a1d2e]">{item.name}</span>
                      <span className="font-semibold text-[#003566]">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t border-[#e8eaf2] pt-3">
                <p className="text-xs font-medium text-[#8a8fa8] mb-2">By Department</p>
                <div className="space-y-1.5">
                  {deptBreakdown.map(item => (
                    <div key={item.name} className="flex items-center justify-between text-xs">
                      <span className="text-[#1a1d2e]">{item.name}</span>
                      <span className="font-semibold text-[#003566]">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity Panel */}
          <div className="bg-white border border-[#e8eaf2] rounded-lg overflow-hidden hover:border-[#003566]/10 transition-colors">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-[#e8eaf2] bg-[#f9fafb]">
              <Activity className="h-4 w-4 text-[#003566]" />
              <h3 className="text-sm font-semibold text-[#1a1d2e]">Recent Activity</h3>
            </div>
            <div className="divide-y divide-[#e8eaf2]">
              {recentActivity.map(activity => (
                <div key={activity.id} className="px-4 py-3 hover:bg-[#f9fafb] transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-[#1a1d2e] truncate">{activity.item}</p>
                      <p className="text-xs text-[#8a8fa8] mt-0.5">{activity.action}</p>
                    </div>
                  </div>
                  <p className="text-xs text-[#8a8fa8] mt-1">{activity.time}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Communication Panel */}
          {/* Communication Panel */}
          <div className="bg-white border border-[#e8eaf2] rounded-lg overflow-hidden flex flex-col hover:border-[#003566]/10 transition-colors">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-[#e8eaf2] bg-[#f9fafb]">
            <MessageSquare className="h-4 w-4 text-[#003566]" />
              <h3 className="text-sm font-semibold text-[#1a1d2e]">Messages</h3>
            </div>
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2.5 max-h-60">
            {allMessages.slice(-5).reverse().map((msg) => (
              <div key={msg.id} className={`flex gap-2.5 ${msg.type === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`h-7 w-7 rounded-full flex items-center justify-center text-[8px] font-bold flex-shrink-0 text-white ${
                  msg.type === "user" ? "bg-[#003566]" : msg.type === "system" ? "bg-[#d1d5db]" : "bg-[#003566]"
                }`}>
                  {msg.avatar.substring(0, 1)}
                </div>
                <div className={`flex-1 ${msg.type === "user" ? "items-end" : "items-start"}`}>
                  <div className={`px-2.5 py-1.5 rounded text-xs leading-relaxed ${
                    msg.type === "user" 
                      ? "bg-[#003566] text-white" 
                      : "bg-[#f3f4f6] text-[#1a1d2e]"
                  }`}>
                    {msg.message}
                  </div>
                  <span className="text-[10px] text-[#8a8fa8] mt-0.5 block">{msg.time}</span>
                </div>
              </div>
              ))}
            </div>
            
            {/* Input */}
            <div className="border-t border-[#e8eaf2] p-3 space-y-2">
              <div className="flex gap-2">
                <Input 
                  placeholder="Message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="bg-[#f9fafb] border-[#e8eaf2] text-xs text-[#1a1d2e] placeholder:text-[#8a8fa8] rounded-lg h-8"
                />
                <Button
                  onClick={handleSendMessage}
                  className="h-8 w-8 p-0 bg-[#003566] hover:bg-[#003566]/90 text-white rounded-lg"
                >
                  <Send className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
