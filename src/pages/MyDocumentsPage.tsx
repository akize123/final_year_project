import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import {
  FileText, Upload, GraduationCap, CreditCard, Briefcase, BookOpen,
  CheckCircle, Clock, XCircle, Eye, Download, FileScan, ScrollText,
} from "lucide-react";
import { academicRecords, documentVerifications } from "@/data/academic-records";
import { mockProjects } from "@/data/mockData";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type RecordCategory = "all" | "academic" | "financial" | "internship" | "clearance" | "final_project";

const categoryConfig: Record<RecordCategory, { label: string; icon: React.ElementType; types: string[] }> = {
  all: { label: "All Documents", icon: FileText, types: [] },
  academic: { label: "Academic", icon: GraduationCap, types: ["transcript", "registration_form", "attendance_form"] },
  financial: { label: "Financial", icon: CreditCard, types: ["tuition_receipt"] },
  internship: { label: "Internship", icon: Briefcase, types: ["internship_letter", "internship_logbook", "internship_report"] },
  clearance: { label: "Clearance", icon: BookOpen, types: ["clearance_form"] },
  final_project: { label: "Final Year Project", icon: ScrollText, types: ["project"] },
};

const statusConfig: Record<string, { label: string; icon: React.ElementType; className: string }> = {
  verified: { label: "Verified", icon: CheckCircle, className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30" },
  pending_verification: { label: "Pending", icon: Clock, className: "bg-amber-500/10 text-amber-600 border-amber-500/30" },
  rejected: { label: "Rejected", icon: XCircle, className: "bg-red-500/10 text-red-600 border-red-500/30" },
  uploaded: { label: "Uploaded", icon: FileText, className: "bg-primary/10 text-primary border-primary/30" },
  Published: { label: "Verified", icon: CheckCircle, className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30" },
  Pending: { label: "Pending", icon: Clock, className: "bg-amber-500/10 text-amber-600 border-amber-500/30" },
};

const typeLabels: Record<string, string> = {
  transcript: "Official Transcript",
  registration_form: "Registration Form",
  attendance_form: "Attendance Form",
  clearance_form: "Clearance Form",
  tuition_receipt: "Tuition Receipt",
  internship_letter: "Internship Acceptance",
  internship_logbook: "Internship Logbook",
  internship_report: "Internship Report",
  final_project: "Final Year Project",
};

const ITEMS_PER_PAGE = 5;

const MyDocumentsPage = () => {
  const { user } = useAuth();
  const [category, setCategory] = useState<RecordCategory>("all");
  const [verificationDialog, setVerificationDialog] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [localUploads, setLocalUploads] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("auca_user_uploads");
    if (saved) {
      setLocalUploads(JSON.parse(saved));
    }
  }, []);

  const myRecords = [...localUploads, ...academicRecords.filter((r) => r.studentId === user?.id)];
  
  // Get all projects from mockProjects and normalize them for the table
  const systemProjects = mockProjects
    .filter(p => p.type !== "Publication")
    .map(p => ({
      id: p.id,
      title: p.title,
      type: "final_project",
      semester: (p as any).year ?? p.submittedDate?.split(" ")[2] ?? "2025",
      status: p.status,
      fileSize: "2.4 MB",
    }));

  const filtered = category === "all"
    ? myRecords
    : category === "final_project"
      ? systemProjects
      : myRecords.filter((r) => categoryConfig[category].types.includes(r.type));

  const verified = myRecords.filter((r) => r.status === "verified").length;
  const pending = myRecords.filter((r) => r.status === "pending_verification").length;
  const completionPct = myRecords.length > 0 ? Math.round((verified / myRecords.length) * 100) : 0;

  const selectedV = verificationDialog
    ? documentVerifications.find((v) => v.documentId === verificationDialog)
    : null;

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedResults = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-3 overflow-hidden h-[calc(100vh-150px)] flex flex-col pb-2">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 flex-shrink-0">
        {[
          { label: "Total Docs", value: myRecords.length, icon: FileText, color: "text-[#1d3557]", bg: "bg-blue-50" },
          { label: "Verified", value: verified, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Pending", value: pending, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
        ].map((stat, i) => (
          <Card key={i} className="group border-slate-200 shadow-sm transition-all bg-white rounded-xl">
            <CardContent className="p-3 flex items-center gap-2.5 text-left">
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              <div>
                <p className="text-lg font-bold text-slate-800 leading-tight">{stat.value}</p>
                <p className="text-[8px] font-bold uppercase tracking-wider text-slate-500 leading-none">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
        
        <Card className="border-slate-200 shadow-sm bg-white rounded-xl">
          <CardContent className="p-3 flex flex-col justify-center h-full">
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-[8px] font-bold uppercase tracking-wider text-slate-500">Completion</span>
                <span className="text-[10px] font-bold text-slate-800">{completionPct}%</span>
              </div>
              <Progress value={completionPct} className="h-[2px] [&>div]:bg-emerald-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-1.5 py-1">
        {Object.entries(categoryConfig).map(([key, config]) => (
          <button
            key={key}
            onClick={() => { setCategory(key as RecordCategory); setCurrentPage(1); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all duration-300 ${
              category === key 
              ? "bg-[#1d3557] text-white shadow-md" 
              : "bg-white border border-slate-200 text-slate-500 hover:border-[#1d3557]/30 hover:bg-slate-50"
            }`}
          >
            <config.icon className="h-3 w-3" />
            {config.label}
            <Badge className={`text-[8px] ml-1 border-0 px-1.5 h-4 ${category === key ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
              {key === "all" 
                ? myRecords.length 
                : key === "final_project" 
                  ? systemProjects.length 
                  : myRecords.filter((r) => config.types.includes(r.type)).length}
            </Badge>
          </button>
        ))}
      </div>

      <Card className="border-slate-200 shadow-sm bg-white rounded-xl overflow-hidden flex-1">
        <CardContent className="p-0 h-full">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent border-slate-100 h-8">
                <TableHead className="text-[9px] font-bold uppercase tracking-wider text-slate-500 px-4">Document Name</TableHead>
                <TableHead className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Classification</TableHead>
                <TableHead className="text-[9px] font-bold uppercase tracking-wider text-slate-500 text-center">Period</TableHead>
                <TableHead className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Status</TableHead>
                <TableHead className="text-right text-[9px] font-bold uppercase tracking-wider text-slate-500 px-4">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-50">
              {paginatedResults.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10">
                     <FileText className="h-8 w-8 text-slate-200 mx-auto mb-2" />
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No documents found</p>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedResults.map((rec) => {
                  const st = statusConfig[rec.status];
                  const StIcon = st.icon;
                  const hasVerification = documentVerifications.some((v) => v.documentId === rec.id);
                  return (
                    <TableRow key={rec.id} className="hover:bg-accent/40 group h-14">
                      <TableCell className="px-4 py-2">
                        <p className="text-[13px] font-bold text-slate-700 group-hover:text-[#1d3557] transition-colors line-clamp-1">{rec.title}</p>
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tight mt-0.5">{rec.fileSize} · READY</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[8px] font-bold uppercase tracking-wider bg-slate-50 border-slate-200 text-slate-500 px-1.5 py-0">
                          {typeLabels[rec.type] ?? rec.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-[10px] font-bold text-slate-500 uppercase text-center">{rec.semester}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-[8px] font-bold uppercase tracking-wider border-transparent px-1.5 py-0 ${
                          rec.status === 'verified' ? 'bg-emerald-50 text-emerald-600' :
                          rec.status === 'pending_verification' ? 'bg-amber-50 text-amber-600' :
                          rec.status === 'rejected' ? 'bg-red-50 text-red-600' :
                          'bg-blue-50 text-[#1d3557]'
                        }`}>
                          <StIcon className="mr-1 h-2.5 w-2.5" />
                          {st.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-2 text-right">
                        <div className="flex justify-end gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                          {hasVerification && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-6 gap-1 px-2 font-bold text-[8px] uppercase tracking-wider border-slate-200 hover:border-[#1d3557]/30 hover:text-[#1d3557] bg-white shadow-sm"
                              onClick={() => setVerificationDialog(rec.id)}
                            >
                              <FileScan className="h-2.5 w-2.5" /> SCAN
                            </Button>
                          )}
                          <Button variant="outline" size="sm" className="h-6 gap-1 px-2 font-bold text-[8px] uppercase tracking-wider border-slate-200 hover:border-[#1d3557]/30 hover:text-[#1d3557] bg-white shadow-sm">
                            <Eye className="h-2.5 w-2.5" /> VIEW
                          </Button>
                          <Button variant="outline" size="sm" className="h-6 w-6 p-0 border-slate-200 hover:border-[#1d3557]/30 hover:text-[#1d3557] bg-white shadow-sm">
                            <Download className="h-2.5 w-2.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-2 pb-2 flex-shrink-0">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 px-3 text-[11px] font-bold uppercase tracking-wide border-slate-200 hover:border-[#1d3557]/30 hover:text-[#1d3557]"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`h-7 w-7 rounded-md text-[10px] font-bold transition-all ${
                  currentPage === i + 1 
                  ? "bg-[#1d3557] text-white shadow-sm" 
                  : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 px-3 text-[11px] font-bold uppercase tracking-wide border-slate-200 hover:border-[#1d3557]/30 hover:text-[#1d3557]"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      <Dialog open={!!verificationDialog} onOpenChange={() => setVerificationDialog(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-sm">
              <FileScan className="h-4 w-4 text-primary" />
              Document Verification Report
            </DialogTitle>
          </DialogHeader>

          {selectedV && (
            <div className="mt-2 space-y-4">
              <div className="rounded-lg border border-border p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground">Detected Document Type</span>
                  <Badge variant="outline" className="text-[10px] font-semibold">
                    {selectedV.detectedType ?? "Unknown"}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-muted-foreground">Classification confidence</span>
                    <span className="font-bold text-foreground">{selectedV.confidence}%</span>
                  </div>
                  <Progress
                    value={selectedV.confidence}
                    className={`h-1 ${selectedV.confidence < 60 ? "[&>div]:bg-red-500" : selectedV.confidence < 80 ? "[&>div]:bg-amber-500" : ""}`}
                  />
                </div>
              </div>

              <div className="rounded-lg border border-border p-3 space-y-2">
                <span className="text-xs font-semibold text-foreground">Required Elements Check</span>
                <div className="space-y-1">
                  {selectedV.requiredElements.map((el) => (
                    <div key={el.label} className="flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground">{el.label}</span>
                      {el.found ? (
                        <Badge variant="outline" className="text-[9px] bg-emerald-500/10 text-emerald-600 border-emerald-500/30 px-1.5 py-0">
                          Found
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[9px] bg-red-500/10 text-red-600 border-red-500/30 px-1.5 py-0">
                          Missing
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className={`rounded-lg p-3 text-center ${
                selectedV.status === "verified" ? "bg-emerald-50 border border-emerald-200" :
                selectedV.status === "partial" ? "bg-amber-50 border border-amber-200" :
                "bg-red-50 border border-red-200"
              }`}>
                {selectedV.status === "verified" && <p className="text-xs font-semibold text-emerald-700">✅ Document fully verified</p>}
                {selectedV.status === "partial" && <p className="text-xs font-semibold text-amber-700">⚠️ Partial verification</p>}
                {selectedV.status === "failed" && <p className="text-xs font-semibold text-red-700">❌ Verification failed</p>}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyDocumentsPage;
