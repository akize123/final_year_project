import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, AreaChart, Area
} from "recharts";
import {
  GraduationCap, ClipboardList, FileCheck, Calendar, Users, BarChart3, Download,
  BookType, Shield, FileText, AlertTriangle, ShieldAlert, ExternalLink, BookOpen
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

/* ─── HOD Analytics Data ─── */
const coverageTrendData = [
  { week: "Week 1", coverage: 10, average: 8 },
  { week: "Week 3", coverage: 25, average: 20 },
  { week: "Week 6", coverage: 45, average: 42 },
  { week: "Week 9", coverage: 70, average: 65 },
  { week: "Week 12", coverage: 85, average: 80 },
  { week: "Week 15", coverage: 100, average: 95 },
];

const facultyWorkload = [
  { name: "Dr. Mugisha", load: 12, max: 15 },
  { name: "Prof. Ntamwiza", load: 9, max: 15 },
  { name: "Dr. Niyonzima", load: 14, max: 15 },
  { name: "Mr. Mugisha", load: 11, max: 15 },
];

const policyComplianceData = [
  { name: "Syllabus", score: 95 },
  { name: "Attendance", score: 88 },
  { name: "Marks", score: 72 },
  { name: "Moderation", score: 64 },
];

/* ─── Mock data ─── */
const statusColors: Record<string, string> = {
  Eligible: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
  "Pending Clearance": "bg-amber-500/10 text-amber-600 border-amber-500/30",
  "On Track": "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
  Ahead: "bg-[#1d3557]/10 text-[#1d3557] border-[#1d3557]/30",
  Behind: "bg-red-500/10 text-red-600 border-red-500/30",
};

const graduationList = [
  { name: "Jean Pierre Habimana", id: "AUCA-2023-0147", program: "IT", gpa: 3.65, status: "Eligible" },
  { name: "Grace Uwimana", id: "AUCA-2022-0289", program: "CS", gpa: 3.82, status: "Eligible" },
  { name: "Marie Claire Niyonsaba", id: "AUCA-2023-0198", program: "IT", gpa: 3.55, status: "Pending Clearance" },
];

const plagiarismList = [
  { student: "Alice Keza", course: "IT201", match: "45%", source: "Internet", status: "Under Review" },
  { student: "Carol Umutoni", course: "IT201", match: "82%", source: "External Paper", status: "Flagged" },
];

const teachingProgress = [
  { lecturer: "Dr. Sarah Mugisha", course: "CS301", sessions: "16/28", pct: 57, status: "On Track" },
  { lecturer: "Prof. Agnes Ntamwiza", course: "CS401", sessions: "22/28", pct: 79, status: "Ahead" },
  { lecturer: "Dr. Jean B. Niyonzima", course: "ENG301", sessions: "8/28", pct: 29, status: "Behind" },
];

const HodReportsPage = () => {
  return (
    <AppLayout
      title="HOD Strategic Reports"
      subtitle="Complete oversight of academic quality, faculty performance, and student progression."
    >
      <div className="space-y-6 pb-12">
        <div className="flex justify-end">
          <Button variant="outline" className="gap-2 border-slate-200 text-slate-600 hover:text-[#1d3557] hover:border-[#1d3557]/30">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
        {/* Strategic Overview Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Students", value: "1,284", change: "+12%", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Active Research", value: "42", change: "+5", icon: BookOpen, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Pending Moderation", value: "18", change: "Urgent", icon: FileCheck, color: "text-amber-600", bg: "bg-amber-50" },
            { label: "Faculty Members", value: "34", change: "Full Strength", icon: GraduationCap, color: "text-[#1d3557]", bg: "bg-slate-50" },
          ].map((stat, i) => (
            <Card key={i} className="border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`h-10 w-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <Badge variant="outline" className="text-[10px] font-bold">{stat.change}</Badge>
                </div>
                <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="academic" className="space-y-6">
          <TabsList className="bg-slate-100 p-1 rounded-xl">
            <TabsTrigger value="academic" className="px-6 gap-2 rounded-lg data-[state=active]:bg-[#1d3557] data-[state=active]:text-white">
              <GraduationCap className="h-4 w-4" /> Academic & Student
            </TabsTrigger>
            <TabsTrigger value="faculty" className="px-6 gap-2 rounded-lg data-[state=active]:bg-[#1d3557] data-[state=active]:text-white">
              <ClipboardList className="h-4 w-4" /> Faculty & Teaching
            </TabsTrigger>
            <TabsTrigger value="admin" className="px-6 gap-2 rounded-lg data-[state=active]:bg-[#1d3557] data-[state=active]:text-white">
              <BarChart3 className="h-4 w-4" /> Admin & Policy
            </TabsTrigger>
          </TabsList>

          {/* Academic Pillar */}
          <TabsContent value="academic" className="space-y-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Coverage Chart */}
              <Card className="lg:col-span-2 border-slate-200 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-tight">Syllabus Coverage Trend</CardTitle>
                  <CardDescription className="text-xs">Curriculum completion vs university benchmark</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] pt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={coverageTrendData}>
                      <defs>
                        <linearGradient id="colorCov" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1d3557" stopOpacity={0.1} />
                          <stop offset="95%" stopColor="#1d3557" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="week" fontSize={10} axisLine={false} tickLine={false} />
                      <YAxis fontSize={10} axisLine={false} tickLine={false} unit="%" />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                      <Area type="monotone" dataKey="coverage" stroke="#1d3557" strokeWidth={3} fillOpacity={1} fill="url(#colorCov)" />
                      <Area type="monotone" dataKey="average" stroke="#cbd5e1" strokeWidth={2} strokeDasharray="5 5" fillOpacity={0} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Integrity Stats */}
              <div className="space-y-4">
                <Card className="bg-red-500 text-white border-0 shadow-lg shadow-red-500/20">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <ShieldAlert className="h-6 w-6" />
                      <Badge className="bg-white/20 text-white border-0 text-[10px]">URGENT</Badge>
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">Plagiarism Flags</p>
                    <h4 className="text-3xl font-bold">12 Active</h4>
                    <p className="text-[11px] opacity-70 mt-1">Submissions exceeding 40% similarity</p>
                  </CardContent>
                </Card>
                <Card className="border-slate-200 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xs font-bold text-slate-800 uppercase">Graduation Eligibility</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500 font-medium">Fully Cleared</span>
                      <span className="text-xs font-bold text-emerald-600">84%</span>
                    </div>
                    <Progress value={84} className="h-1.5 [&>div]:bg-emerald-500" />
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500 font-medium">Pending Finance</span>
                      <span className="text-xs font-bold text-amber-500">12%</span>
                    </div>
                    <Progress value={12} className="h-1.5 [&>div]:bg-amber-500" />
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Plagiarism Table */}
            <Card className="border-slate-200 shadow-sm overflow-hidden">
              <CardHeader className="border-b border-slate-50">
                <CardTitle className="text-sm font-bold">Recent Integrity Flags</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-slate-50/50">
                    <TableRow>
                      <TableHead className="text-[10px] uppercase">Student</TableHead>
                      <TableHead className="text-[10px] uppercase">Match</TableHead>
                      <TableHead className="text-[10px] uppercase">Source</TableHead>
                      <TableHead className="text-right text-[10px] uppercase">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {plagiarismList.map((p, i) => (
                      <TableRow key={i}>
                        <TableCell className="text-xs font-bold">{p.student}</TableCell>
                        <TableCell className="text-xs font-bold text-red-600">{p.match}</TableCell>
                        <TableCell className="text-xs text-slate-500">{p.source}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="h-7 text-[10px] font-bold text-[#1d3557]">REVIEW</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Graduation Candidates */}
            <Card className="border-slate-200 shadow-sm overflow-hidden">
              <CardHeader className="border-b border-slate-50 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold">Graduation Candidates</CardTitle>
                  <CardDescription className="text-[10px]">Students pending final HOD clearance</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="h-7 text-[10px] font-bold">VIEW ALL</Button>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-slate-50/50">
                    <TableRow>
                      <TableHead className="text-[10px] uppercase">Candidate</TableHead>
                      <TableHead className="text-[10px] uppercase">Program</TableHead>
                      <TableHead className="text-[10px] uppercase">GPA</TableHead>
                      <TableHead className="text-right text-[10px] uppercase">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {graduationList.map((s, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-xs font-bold">{s.name}</span>
                            <span className="text-[10px] text-slate-400">{s.id}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs font-medium">{s.program}</TableCell>
                        <TableCell className="text-xs font-bold text-[#1d3557]">{s.gpa}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant="outline" className={`text-[9px] font-bold ${statusColors[s.status]}`}>{s.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Faculty Pillar */}
          <TabsContent value="faculty" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-sm font-bold uppercase">Lecturer Workload (hrs/wk)</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={facultyWorkload} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                      <XAxis type="number" fontSize={10} axisLine={false} tickLine={false} />
                      <YAxis dataKey="name" type="category" fontSize={10} axisLine={false} tickLine={false} width={100} />
                      <Tooltip cursor={{ fill: '#f8fafc' }} />
                      <Bar dataKey="load" fill="#1d3557" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="border-b border-slate-50">
                  <CardTitle className="text-sm font-bold">Course Coverage Report</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-slate-50/50">
                      <TableRow>
                        <TableHead className="text-[10px] uppercase">Lecturer</TableHead>
                        <TableHead className="text-[10px] uppercase">Course</TableHead>
                        <TableHead className="text-center text-[10px] uppercase">Coverage</TableHead>
                        <TableHead className="text-right text-[10px] uppercase">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {teachingProgress.map((row, i) => (
                        <TableRow key={i}>
                          <TableCell className="text-xs font-medium">{row.lecturer}</TableCell>
                          <TableCell className="text-xs font-bold">{row.course}</TableCell>
                          <TableCell className="text-xs font-bold text-[#1d3557] text-center">{row.pct}%</TableCell>
                          <TableCell className="text-right">
                            <Badge variant="outline" className={`text-[9px] font-bold ${statusColors[row.status]}`}>{row.status}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Admin Pillar */}
          <TabsContent value="admin" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <Card className="lg:col-span-3 border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-tight">Policy Compliance Index</CardTitle>
                  <CardDescription className="text-xs">Departmental adherence to university academic standards</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={policyComplianceData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
                      <YAxis fontSize={10} axisLine={false} tickLine={false} unit="%" />
                      <Tooltip
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        cursor={{ fill: '#f8fafc' }}
                      />
                      <Bar dataKey="score" fill="#1d3557" radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <div className="space-y-6">
                {/* Policy Documents */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Resources</h4>
                  {[
                    { title: "Curriculum Structure", icon: BookType },
                    { title: "Department Policies", icon: Shield },
                  ].map((item, i) => (
                    <Card key={i} className="border-slate-200 hover:border-[#1d3557]/30 transition-all cursor-pointer group">
                      <CardContent className="p-3 flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-[#1d3557]/10">
                          <item.icon className="h-4 w-4 text-slate-400 group-hover:text-[#1d3557]" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <h4 className="text-[11px] font-bold text-slate-800 truncate">{item.title}</h4>
                        </div>
                        <Download className="h-3 w-3 text-slate-300 group-hover:text-[#1d3557]" />
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Recent Activity Feed */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Recent Activity</h4>
                  <div className="space-y-4">
                    {[
                      { user: "Dr. Mugisha", action: "Submitted Marks", time: "2h ago", color: "bg-blue-500" },
                      { user: "System", action: "Plagiarism Alert", time: "5h ago", color: "bg-red-500" },
                      { user: "Prof. Agnes", action: "Updated Syllabus", time: "1d ago", color: "bg-emerald-500" },
                    ].map((activity, i) => (
                      <div key={i} className="flex gap-3 items-start">
                        <div className={`h-1.5 w-1.5 rounded-full mt-1.5 shrink-0 ${activity.color}`} />
                        <div>
                          <p className="text-[11px] font-bold text-slate-800">{activity.user}</p>
                          <p className="text-[10px] text-slate-500">{activity.action}</p>
                          <p className="text-[9px] text-slate-400 mt-0.5">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default HodReportsPage;
