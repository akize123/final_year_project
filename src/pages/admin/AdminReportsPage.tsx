import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, Legend 
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Download, Search, BarChart3, FileText, Eye, Users, 
  Shield, Github, CalendarDays, TrendingUp, CheckCircle, AlertTriangle 
} from "lucide-react";

/* ─── Mock Data for Charts ─── */
const submissionData = [
  { date: "Apr 01", submissions: 45, approvals: 40 },
  { date: "Apr 05", submissions: 52, approvals: 48 },
  { date: "Apr 10", submissions: 38, approvals: 35 },
  { date: "Apr 15", submissions: 65, approvals: 58 },
  { date: "Apr 20", submissions: 48, approvals: 42 },
  { date: "Apr 25", submissions: 70, approvals: 68 },
  { date: "Apr 30", submissions: 85, approvals: 82 },
];

const facultyActivity = [
  { name: "IT", projects: 120, papers: 45 },
  { name: "Business", projects: 85, papers: 30 },
  { name: "Theology", projects: 40, papers: 15 },
  { name: "Education", projects: 55, papers: 20 },
];

const integrityStats = [
  { name: "Fully Verified (3/3 Stamps)", value: 65, color: "#10b981" },
  { name: "Partially Verified (1-2 Stamps)", value: 25, color: "#f59e0b" },
  { name: "Failed/Missing Elements", value: 10, color: "#ef4444" },
];

const COLORS = ["#1d3557", "#457b9d", "#a8dadc", "#e63946"];

const AdminReportsPage = () => {
  const [dateRange, setDateRange] = useState({ start: "2025-04-01", end: "2025-04-30" });

  return (
    <AppLayout 
      title="Institutional Analytics & Reports" 
      subtitle="Comprehensive data visualization of university academic and administrative integrity."
    >
      <div className="space-y-8 pb-12">
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reporting Period</p>
              <div className="flex items-center gap-2">
                <Input type="date" value={dateRange.start} className="h-9 w-36 text-xs" onChange={(e) => setDateRange({...dateRange, start: e.target.value})} />
                <span className="text-slate-400 text-xs">to</span>
                <Input type="date" value={dateRange.end} className="h-9 w-36 text-xs" onChange={(e) => setDateRange({...dateRange, end: e.target.value})} />
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="font-bold gap-2 text-xs h-10 border-slate-200">
              <Download className="h-4 w-4" /> EXPORT PDF
            </Button>
            <Button className="bg-[#1d3557] hover:bg-[#2c4e7d] font-bold gap-2 text-xs h-10">
              <TrendingUp className="h-4 w-4" /> GENERATE AUDIT
            </Button>
          </div>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Chart 1: Submission & Approval Trends */}
          <Card className="border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="border-b border-slate-50">
              <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-tight">Submission & Approval Velocity</CardTitle>
              <CardDescription className="text-xs">Daily volume of document uploads vs archival approvals</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={submissionData}>
                  <defs>
                    <linearGradient id="colorSub" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1d3557" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#1d3557" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ fontSize: '11px', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="submissions" stroke="#1d3557" strokeWidth={3} fillOpacity={1} fill="url(#colorSub)" />
                  <Area type="monotone" dataKey="approvals" stroke="#10b981" strokeWidth={3} fillOpacity={0} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Chart 2: Integrity Guard Distribution */}
          <Card className="border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="border-b border-slate-50">
              <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-tight">Document Integrity Audit</CardTitle>
              <CardDescription className="text-xs">Classification of documents based on Stamp/Signature detection</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 h-[300px] flex flex-col items-center">
              <ResponsiveContainer width="100%" height="80%">
                <PieChart>
                  <Pie
                    data={integrityStats}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {integrityStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="text-center mt-2">
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-bold">
                  92% INSTITUTIONAL COMPLIANCE
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Chart 3: Faculty Activity Comparison */}
          <Card className="border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="border-b border-slate-50">
              <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-tight">Faculty Research Output</CardTitle>
              <CardDescription className="text-xs">Comparison of projects and publications across departments</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={facultyActivity}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="projects" fill="#1d3557" radius={[4, 4, 0, 0]} barSize={30} />
                  <Bar dataKey="papers" fill="#457b9d" radius={[4, 4, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Data Table: System Audit Log */}
          <Card className="border-slate-200 shadow-sm overflow-hidden lg:col-span-1">
            <CardHeader className="border-b border-slate-50 flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-tight">Real-Time Audit Stream</CardTitle>
                <CardDescription className="text-xs">Latest administrative actions and system events</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="h-8 text-[10px] font-bold text-[#1d3557]">VIEW LOGS</Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-50">
                {[
                  { user: "Alice Lib.", action: "Archived Document", target: "AUCA-TR-2025", time: "2 mins ago", status: "success" },
                  { user: "System", action: "Failed OCR Match", target: "Receipt_443.pdf", time: "15 mins ago", status: "warning" },
                  { user: "HOD IT", action: "Approved Final Exam", target: "IT_NET_2025", time: "1 hour ago", status: "success" },
                  { user: "Admin", action: "Updated User Role", target: "John Doe (Lecturer)", time: "3 hours ago", status: "info" },
                ].map((log, i) => (
                  <div key={i} className="px-5 py-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                        log.status === "success" ? "bg-emerald-50 text-emerald-600" : 
                        log.status === "warning" ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"
                      }`}>
                        <Shield className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">{log.action}</p>
                        <p className="text-[10px] text-slate-500 font-medium">{log.user} · {log.target}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">{log.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Global Performance Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <Card className="bg-slate-900 text-white border-0 overflow-hidden relative">
             <div className="absolute top-0 right-0 p-4 opacity-10">
               <BarChart3 className="h-20 w-20" />
             </div>
             <CardContent className="p-6">
               <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Verification Precision</p>
               <h4 className="text-3xl font-bold mb-1">99.4%</h4>
               <p className="text-xs text-slate-500">System-wide AI accuracy rating</p>
             </CardContent>
           </Card>
           <Card className="bg-slate-900 text-white border-0 overflow-hidden relative">
             <div className="absolute top-0 right-0 p-4 opacity-10">
               <Users className="h-20 w-20" />
             </div>
             <CardContent className="p-6">
               <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Total Researchers</p>
               <h4 className="text-3xl font-bold mb-1">2,450</h4>
               <p className="text-xs text-slate-500">Active contributors this semester</p>
             </CardContent>
           </Card>
           <Card className="bg-slate-900 text-white border-0 overflow-hidden relative">
             <div className="absolute top-0 right-0 p-4 opacity-10">
               <Shield className="h-20 w-20" />
             </div>
             <CardContent className="p-6">
               <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Security Events</p>
               <h4 className="text-3xl font-bold mb-1">0</h4>
               <p className="text-xs text-slate-500">Integrity breaches detected</p>
             </CardContent>
           </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default AdminReportsPage;
