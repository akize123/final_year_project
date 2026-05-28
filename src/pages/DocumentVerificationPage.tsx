import { useState, useCallback } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  CheckCircle, XCircle, AlertTriangle, Upload, FileScan, FileText,
  Stamp, Signature, Eye, Loader2, ShieldCheck,
} from "lucide-react";
import { documentVerifications } from "@/data/academic-records";
import type { DocumentVerification, VerificationStatus } from "@/types";

const statusConfig: Record<VerificationStatus, { label: string; className: string; icon: React.ElementType }> = {
  verified: { label: "Verified", className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30", icon: CheckCircle },
  partial: { label: "Partial", className: "bg-amber-500/10 text-amber-600 border-amber-500/30", icon: AlertTriangle },
  failed: { label: "Failed", className: "bg-red-500/10 text-red-600 border-red-500/30", icon: XCircle },
  pending: { label: "Pending", className: "bg-primary/10 text-primary border-primary/30", icon: Loader2 },
};

/* Simulated OCR keywords for classification */
const classificationRules = [
  { type: "Official Transcript", keywords: ["transcript", "grades", "gpa", "credit hours"] },
  { type: "Registration Form", keywords: ["registration", "courses", "semester", "department"] },
  { type: "Clearance Form", keywords: ["clearance", "finance", "library", "department"] },
  { type: "Tuition Receipt", keywords: ["payment", "tuition", "receipt", "amount", "rwf"] },
  { type: "Internship Report", keywords: ["internship", "company", "supervisor", "logbook"] },
  { type: "Suspension Record", keywords: ["suspension", "reason", "duration", "disciplinary", "conduct"] },
  { type: "Attendance for Exam Paper", keywords: ["exam", "attendance", "invigilator", "course code", "seat"] },
];

const DocumentVerificationPage = () => {
  const [selectedDoc, setSelectedDoc] = useState<DocumentVerification | null>(null);
  const [simulating, setSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<DocumentVerification | null>(null);

  const handleSimulate = useCallback(() => {
    setSimulating(true);
    // Simulate OCR + classification process
    setTimeout(() => {
      const mockResult: DocumentVerification = {
        id: "sim-" + Math.random().toString(36).substr(2, 9),
        documentId: "sim-doc",
        fileName: "exam_attendance_2025.pdf",
        uploadedBy: "Student 001",
        uploadDate: new Date().toISOString().slice(0, 10),
        detectedType: "Attendance for Exam Paper",
        confidence: 94,
        status: "verified",
        keywordsFound: ["Exam", "Attendance", "Invigilator", "CS101"],
        requiredElements: [
          { label: "Course Code", found: true },
          { label: "Invigilator Signature", found: true },
          { label: "Student Signature", found: true },
          { label: "Institutional Stamp", found: true },
        ],
        stampCount: 1,
        signatureDetected: true,
        ocrText: "ATTENDANCE LIST ... EXAMINATION PAPER ... Course: CS101 ... Invigilator: Prof. Smith ... Student: Jane Doe ...",
      };
      setSimulationResult(mockResult);
      setSimulating(false);
    }, 2500);
  }, []);

  const currentDoc = selectedDoc ?? simulationResult;

  return (
    <AppLayout>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-lg font-heading font-bold text-foreground">Document Verification</h1>
            <p className="text-xs text-muted-foreground mt-1 max-w-xl">
              Automated document classification, OCR analysis and stamp/signature checks.
            </p>
          </div>
          <Button size="sm" className="h-9 gap-2 px-3 text-[10px] font-bold uppercase tracking-[0.24em]" onClick={handleSimulate} disabled={simulating}>
            {simulating ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing...</>
            ) : (
              <><FileScan className="h-4 w-4" /> Simulate</>
            )}
          </Button>
        </div>

        {/* Processing pipeline */}
        <Card className="border-slate-200 shadow-xl shadow-slate-200/20 overflow-hidden rounded-[1.5rem] bg-white">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row items-stretch divide-y md:divide-y-0 md:divide-x divide-slate-100">
              {[
                { step: 1, label: "Upload", desc: "PDF source", icon: Upload, color: "bg-blue-50 text-[#1d3557]" },
                { step: 2, label: "OCR", desc: "Neural extract", icon: FileText, color: "bg-violet-50 text-violet-600" },
                { step: 3, label: "Classify", desc: "AI label", icon: FileScan, color: "bg-amber-50 text-amber-600" },
                { step: 4, label: "Validate", desc: "Integrity", icon: CheckCircle, color: "bg-emerald-50 text-emerald-600" },
              ].map((s) => (
                <div key={s.step} className="flex-1 flex items-center gap-3 p-4 group cursor-default hover:bg-slate-50 transition-colors">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl transition-all duration-500 shadow-sm ${s.color} group-hover:scale-110`}>
                    <s.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.24em] text-slate-400">Step {s.step}</p>
                    <p className="text-[13px] font-bold text-slate-800">{s.label}</p>
                    <p className="text-[10px] text-slate-500 font-medium">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-3 lg:grid-cols-2">
          {/* Verification results list */}
          <Card className="border-slate-200 shadow-sm bg-white rounded-2xl overflow-hidden">
            <CardHeader className="pb-3 bg-slate-50/50 border-b border-slate-100">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-[14px] font-bold text-slate-800 tracking-tight">Recent Verifications</CardTitle>
                  <CardDescription className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-1">{documentVerifications.length} Files</CardDescription>
                </div>
                <Badge variant="outline" className="bg-white text-[#1d3557] border-slate-200 font-bold px-2 py-1 text-[10px]">BETA</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-3">
              <div className="space-y-2.5">
                {[...documentVerifications, ...(simulationResult ? [simulationResult] : [])].map((v) => {
                  const st = statusConfig[v.status];
                  const StIcon = st.icon;
                  const isActive = currentDoc?.id === v.id;
                  return (
                    <button
                      key={v.id}
                      onClick={() => { setSelectedDoc(v); setSimulationResult(null); }}
                      className={`group w-full text-left rounded-2xl border transition-all duration-300 ${
                        isActive 
                          ? "border-[#1d3557] bg-[#1d3557]/5 shadow-md scale-[1.01] z-10 p-3" 
                          : "border-slate-100 bg-white hover:border-[#1d3557]/30 hover:shadow-lg"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <p className={`text-[12px] font-bold truncate max-w-[200px] transition-colors ${isActive ? "text-[#1d3557]" : "text-slate-800"}`}>{v.fileName}</p>
                        <Badge variant="outline" className={`text-[8px] font-bold uppercase tracking-[0.24em] px-2 py-0.5 ${st.className} border-0 shadow-sm`}>
                          <StIcon className="mr-1 h-3 w-3" /> {st.label}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-[9px]">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-[8px] font-bold uppercase tracking-[0.24em] bg-slate-100 text-slate-500">{v.detectedType ?? "Unknown"}</Badge>
                          <span className="text-slate-400 font-bold">{v.confidence}%</span>
                        </div>
                        <span className="text-slate-300">{v.uploadDate}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Detail panel */}
          <Card className="border-slate-200 shadow-sm bg-white rounded-2xl overflow-hidden">
            <CardHeader className="pb-3 bg-slate-50/50 border-b border-slate-100">
              <CardTitle className="text-[14px] font-bold text-slate-800 tracking-tight">Verification Intelligence</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {!currentDoc ? (
                <div className="py-16 text-center">
                  <div className="h-14 w-14 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-3 border border-slate-100 text-slate-300">
                    <FileScan className="h-6 w-6" />
                  </div>
                  <p className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.24em]">Select a document</p>
                  <p className="text-[10px] text-slate-300 mt-2 font-medium">Choose an item or simulate upload to inspect verification details.</p>
                </div>
              ) : (
                <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
                  {/* Integrity & Classification */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 space-y-3 shadow-inner">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.24em]">Classification</span>
                        <Badge variant="outline" className="bg-white text-[#1d3557] border-[#1d3557]/20 font-bold px-2 py-1 text-[9px]">
                          {currentDoc.detectedType ?? "Unknown"}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-bold">
                          <span className="text-slate-400">Confidence</span>
                          <span className="text-[#1d3557]">{currentDoc.confidence}%</span>
                        </div>
                        <Progress
                          value={currentDoc.confidence}
                          className={`h-2 [&>div]:transition-all [&>div]:duration-1000 ${currentDoc.confidence < 60 ? "[&>div]:bg-red-500" : currentDoc.confidence < 80 ? "[&>div]:bg-amber-500" : "[&>div]:bg-[#1d3557]"}`}
                        />
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {currentDoc.keywordsFound.map((kw) => (
                          <Badge key={kw} variant="secondary" className="text-[8px] font-bold uppercase tracking-[0.24em] bg-white border border-slate-100 text-slate-500">
                            {kw}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-[#1d3557]/10 bg-white p-4 flex flex-col items-center justify-center text-center shadow-sm overflow-hidden">
                      <div className="relative h-16 w-16 rounded-full border-[5px] border-slate-50 flex items-center justify-center mb-2 shadow-inner">
                         <svg className="absolute inset-0 h-full w-full -rotate-90">
                           <circle 
                             cx="34" cy="34" r="29" 
                             fill="transparent" 
                             stroke="currentColor" 
                             strokeWidth="5" 
                             className="text-emerald-500/20"
                           />
                           <circle 
                             cx="34" cy="34" r="29" 
                             fill="transparent" 
                             stroke="currentColor" 
                             strokeWidth="5" 
                             strokeDasharray={182.2}
                             strokeDashoffset={182.2 * (1 - (currentDoc.confidence > 90 ? 1 : currentDoc.confidence / 100))}
                             className="text-emerald-500 transition-all duration-1000 ease-out"
                           />
                         </svg>
                        <span className="text-lg font-bold text-slate-800">{currentDoc.confidence > 90 ? 100 : currentDoc.confidence}%</span>
                      </div>
                      <p className="text-[10px] font-bold text-[#1d3557] uppercase tracking-[0.24em]">Integrity Score</p>
                      <p className="text-[10px] text-slate-400 mt-1 font-medium">Cross-referenced data</p>
                    </div>
                  </div>

                  {/* Required elements */}
                  <div className="rounded-2xl border border-slate-100 p-4 space-y-3 bg-white shadow-sm">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.24em]">Checklist</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {currentDoc.requiredElements.map((el) => (
                        <div key={el.label} className={`flex items-center justify-between p-2 rounded-xl border ${el.found ? "border-emerald-100 bg-emerald-50/30" : "border-red-100 bg-red-50/30"}`}>
                          <span className="text-[10px] font-bold text-slate-700">{el.label}</span>
                          <div className={`h-5 w-5 rounded-lg flex items-center justify-center ${el.found ? "bg-emerald-500 text-white" : "bg-red-500 text-white"}`}>
                            {el.found ? <CheckCircle className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Stamp & Signature */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-slate-100 p-4 text-center bg-slate-50/50 shadow-sm">
                      <Stamp className="h-7 w-7 mx-auto text-[#1d3557] opacity-80" />
                      <p className="text-xl font-bold text-slate-800 tracking-tight mt-2">{currentDoc.stampCount}</p>
                      <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">Validated Stamps</p>
                    </div>
                    <div className="rounded-2xl border border-slate-100 p-4 text-center bg-slate-50/50 shadow-sm">
                      {currentDoc.signatureDetected ? (
                        <Signature className="h-7 w-7 mx-auto text-emerald-600 opacity-80" />
                      ) : (
                        <AlertTriangle className="h-7 w-7 mx-auto text-red-500 opacity-80" />
                      )}
                      <p className={`text-[11px] font-bold ${currentDoc.signatureDetected ? "text-emerald-600" : "text-red-600"} uppercase tracking-[0.24em] mt-2`}>
                        {currentDoc.signatureDetected ? "DETECTED" : "NOT FOUND"}
                      </p>
                      <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">Institutional Sig</p>
                    </div>
                  </div>

                  {/* OCR Text */}
                  <div className="rounded-2xl border border-slate-100 p-4 space-y-3 bg-slate-50/30">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.24em]">OCR Preview</span>
                      <FileText className="h-4 w-4 text-slate-300" />
                    </div>
                    <div className="bg-white border border-slate-100 p-3 rounded-xl text-[11px] font-mono leading-relaxed text-slate-500 shadow-inner max-h-20 overflow-y-auto">
                      {currentDoc.ocrText}
                    </div>
                  </div>

                  <Button variant="ghost" className="w-full text-[9px] font-bold text-[#1d3557] uppercase tracking-[0.24em] h-10 gap-2 hover:bg-slate-50">
                    <Eye className="h-4 w-4" /> View Document
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default DocumentVerificationPage;
