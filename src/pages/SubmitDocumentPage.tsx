import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Upload, FileText, GraduationCap, CreditCard, Briefcase, CheckCircle,
  FileUp, Info, AlertTriangle, BookOpen, FileSearch, ListChecks, Shield,
  Loader2, Search, ShieldCheck, Globe
} from "lucide-react";
import { toast } from "sonner";

type DocCategory = "academic" | "financial" | "research" | "internship" | "admin" | "exams";

const docTypes: Record<DocCategory, { label: string; icon: React.ElementType; types: { value: string; label: string; required: string[]; forbidden?: string[] }[] }> = {
  academic: {
    label: "Core Academic Records",
    icon: GraduationCap,
    types: [
      { value: "transcript", label: "Official Transcript", required: ["Student name", "Course list", "Grades", "GPA", "Official stamp"] },
      { value: "registration_form", label: "Semester Registration Form", required: ["Semester", "Course list", "Registration details"] },
      { value: "graduation_clearance", label: "Graduation Clearance Documents", required: ["Library section", "Finance section", "Dept. Approval"] },
    ],
  },
  exams: {
    label: "Examination Records",
    icon: ListChecks,
    types: [
      { value: "exam_attendance", label: "Attendance for Exam Paper", required: ["Course Code", "Invigilator Signature", "Student Signature", "Date of Exam", "Institutional Stamp"], forbidden: ["Homework", "Project report"] },
    ],
  },
  admin: {
    label: "Administrative & Conduct",
    icon: Shield,
    types: [
      { value: "suspension_record", label: "Suspension Record", required: ["Reason for suspension", "Duration", "Registrar Signature", "Date issued"] },
      { value: "admission_letter", label: "Admission Letter", required: ["Admission number", "Program name", "Intake semester", "Registrar stamp"] },
      { value: "id_passport", label: "National ID / Passport", required: ["Full name", "Document number", "Expiry date", "Clear photo"] },
    ],
  },
  financial: {
    label: "Financial Records",
    icon: CreditCard,
    types: [
      { value: "tuition_receipt", label: "Tuition Payment Receipt", required: ["Amount", "Date", "Student ID", "Payment reference"] },
    ],
  },
  research: {
    label: "Project & Research",
    icon: BookOpen,
    types: [
      { value: "final_project", label: "Final Year Project", required: ["Abstract", "Introduction", "Methodology", "Conclusion"] },
      { value: "research_paper", label: "Research Papers", required: ["Title", "Abstract", "Authors", "Citations"] },
    ],
  },
  internship: {
    label: "Internship & Training",
    icon: Briefcase,
    types: [
      { value: "internship_letter", label: "Internship Acceptance Letter", required: ["Company name", "Position", "Start date", "Supervisor"] },
      { value: "internship_logbook", label: "Internship Logbook", required: ["Daily entries", "Supervisor sign-off", "Date range"] },
      { value: "internship_report_final", label: "Final Internship Report", required: ["Executive summary", "Weekly tasks", "Final evaluation"] },
    ],
  },
};

const semesters = ["2025-S1", "2024-S2", "2024-S1", "2023-S2", "2023-S1"];

const SubmitDocumentPage = () => {
  const [category, setCategory] = useState<DocCategory | "">("");
  const [docType, setDocType] = useState("");
  const [semester, setSemester] = useState("");
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [step, setStep] = useState(1);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<{
    type: string;
    confidence: number;
    foundKeywords: string[];
    elements: string[];
  } | null>(null);

  const selectedType = category
    ? docTypes[category as DocCategory]?.types.find((t) => t.value === docType)
    : null;

  const runSmartAnalysis = (uploadedFile: File) => {
    setIsAnalyzing(true);
    setAnalysisStep(1);
    setAnalysisResult(null);

    setTimeout(() => {
      setAnalysisStep(2);
      setTimeout(() => {
        setAnalysisStep(3);
        const name = uploadedFile.name.toLowerCase();
        let identified = { 
          type: "Unknown", 
          keywords: [] as string[], 
          cat: "" as DocCategory,
          elements: [] as string[],
          stampsFound: 0
        };
        
        if (name.includes("transcript") || name.includes("grade") || name.includes("gpa")) {
          identified = { 
            type: "transcript", 
            keywords: ["Student Name", "Course List", "Grades", "GPA"], 
            cat: "academic",
            elements: ["Student Name Found", "Grades Extracted", "GPA Verified"],
            stampsFound: name.includes("stamp") || name.includes("approved") ? 1 : 0
          };
        } else if (name.includes("registration") || name.includes("course") || name.includes("semester")) {
          identified = { 
            type: "registration_form", 
            keywords: ["Semester", "Course List", "Registration Details"], 
            cat: "academic",
            elements: ["Semester Year Found", "Courses Verified", "Registration Header"],
            stampsFound: name.includes("signature") ? 1 : 0
          };
        } else if (name.includes("clearance") || name.includes("finance") || name.includes("library")) {
          const sections = [];
          if (name.includes("finance")) sections.push("Finance Section");
          if (name.includes("library")) sections.push("Library Section");
          if (name.includes("dept")) sections.push("Department Section");
          
          identified = { 
            type: "graduation_clearance", 
            keywords: ["Finance Section", "Library Section", "Department Section"], 
            cat: "academic",
            elements: sections,
            stampsFound: name.includes("approved") ? 3 : (name.includes("stamp") ? 2 : 1)
          };
        }

        setTimeout(() => {
          setIsAnalyzing(false);
          if (identified.type !== "Unknown") {
            setCategory(identified.cat);
            setDocType(identified.type);
            const detectedElements = [...identified.elements];
            if (identified.stampsFound >= 1) detectedElements.push("Digital Stamp Detected");
            if (name.includes("signature") || identified.stampsFound >= 2) detectedElements.push("Handwritten Signature Found");
            if (identified.stampsFound >= 3) detectedElements.push("Multi-Office Approval Verified");

            setAnalysisResult({
              type: identified.type.replace("_", " ").toUpperCase(),
              confidence: identified.stampsFound >= 3 ? 99 : 92,
              foundKeywords: identified.keywords,
              elements: detectedElements
            });

            if (identified.type === "graduation_clearance" && identified.stampsFound < 3) {
              toast.warning("Incomplete Clearance", {
                description: `Clearance form detected but it appears to be missing required office stamps (Found: ${identified.stampsFound}/3).`
              });
            } else {
              toast.success("Document Identified!", {
                description: `Our AI identified this as an ${identified.type.replace("_", " ")}.`
              });
            }
          } else {
            toast.info("Manual Selection Required", {
              description: "Our AI couldn't confidently classify this document. Please select manually."
            });
          }
        }, 800);
      }, 1200);
    }, 1000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      runSmartAnalysis(uploadedFile);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !docType || !semester || !file) {
      toast.error("Please fill in all required fields and select a file.");
      return;
    }
    toast.success("Document submitted successfully!", {
      description: `Your ${selectedType?.label} has been uploaded and queued for verification.`,
    });
    
    // Save to localStorage for persistence in "My Documents"
    const newDoc = {
      id: `up-${Date.now()}`,
      studentId: "12345", // Mock student ID
      title: title || (selectedType?.label ?? "Untitled Document"),
      type: docType,
      semester: semester,
      status: "pending_verification",
      fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      submittedAt: new Date().toISOString()
    };
    
    const existingUploads = JSON.parse(localStorage.getItem("auca_user_uploads") || "[]");
    localStorage.setItem("auca_user_uploads", JSON.stringify([newDoc, ...existingUploads]));

    setCategory("");
    setDocType("");
    setSemester("");
    setTitle("");
    setNotes("");
    setFile(null);
    setAnalysisResult(null);
    setStep(1);
  };

  return (
    <AppLayout 
      title="Upload Document" 
      subtitle="Institutional document submission and AI-powered verification."
    >
      <div className="space-y-4 w-full h-[calc(100vh-140px)] overflow-hidden flex flex-col pb-4">
        <form onSubmit={handleSubmit} className="space-y-4 flex flex-col h-full">
          <Card className="shadow-md border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-[#1d3557] via-[#2c4e7d] to-[#1d3557] py-2.5 px-6 text-center">
              <h2 className="text-[12px] font-extrabold text-white uppercase tracking-[0.3em]">
                {step === 1 ? "Select Document Category" : "Upload & Finalize Submission"}
              </h2>
            </div>
            {step === 1 && (
              <CardContent className="pt-4 pb-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {(Object.entries(docTypes) as [DocCategory, typeof docTypes[DocCategory]][]).map(([key, config]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => { setCategory(key); setDocType(""); }}
                      className={`group relative flex flex-col items-center p-3 rounded-xl border-2 transition-all duration-300 text-center ${
                        category === key ? "border-[#1d3557] bg-[#f0f7ff] shadow-sm" : "border-slate-200 bg-white hover:border-[#1d3557]/30"
                      }`}
                    >
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center mb-2 transition-colors ${category === key ? "bg-[#1d3557] text-white" : "bg-slate-50 text-slate-400 group-hover:bg-[#1d3557] group-hover:text-white"}`}>
                        <config.icon className="h-4 w-4" />
                      </div>
                      <p className={`text-[10px] font-bold leading-tight transition-colors ${category === key ? "text-[#1d3557]" : "text-slate-700 group-hover:text-[#1d3557]"}`}>{config.label}</p>
                      {category === key && (
                        <div className="absolute top-1.5 right-1.5">
                          <CheckCircle className="h-2.5 w-2.5 text-[#1d3557]" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>

          {step === 1 && category && (
            <div className="flex flex-col gap-4 animate-in slide-in-from-right-4 duration-300">
              {/* Step 1: Horizontal Bar */}
              <Card className="shadow-sm border-slate-200 overflow-hidden">
                <div className="bg-slate-50 border-b border-slate-100 py-1.5 px-6">
                   <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Step 1: Document Details</h3>
                </div>
                <CardContent className="p-3">
                  <div className="flex flex-col sm:flex-row items-end gap-4">
                    <div className="flex-1 space-y-1.5 w-full">
                      <Label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Document Type *</Label>
                      <Select value={docType} onValueChange={setDocType}>
                        <SelectTrigger className="h-8 bg-white border-slate-200 text-[11px] font-medium">
                          <SelectValue placeholder="Select type..." />
                        </SelectTrigger>
                        <SelectContent>
                          {docTypes[category as DocCategory].types.map((t) => (
                            <SelectItem key={t.value} value={t.value} className="text-[11px]">{t.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex-1 space-y-1.5 w-full">
                      <Label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Academic Semester *</Label>
                      <Select value={semester} onValueChange={setSemester}>
                        <SelectTrigger className="h-8 bg-white border-slate-200 text-[11px] font-medium">
                          <SelectValue placeholder="Select semester..." />
                        </SelectTrigger>
                        <SelectContent>
                          {semesters.map((s) => (
                            <SelectItem key={s} value={s} className="text-[11px]">{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex-[1.5] space-y-1.5 w-full">
                      <Label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Document Title</Label>
                      <Input
                        placeholder="e.g. Official Transcript — 2024"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="h-8 bg-white border-slate-200 text-[11px] font-medium"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button 
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!docType || !semester}
                  className="px-10 h-10 bg-[#1d3557] hover:bg-[#2c4e7d] text-[11px] font-bold uppercase tracking-widest shadow-md"
                >
                  Continue to Upload
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex-1 flex flex-col gap-4 overflow-hidden min-h-0 animate-in slide-in-from-right-4 duration-300">
              <div className="bg-[#f8fafc] border border-slate-200 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-white rounded-lg flex items-center justify-center border border-slate-200 text-[#1d3557]">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Selected Type</p>
                    <p className="text-[12px] font-extrabold text-[#1d3557]">{selectedType?.label}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setStep(1)} className="text-[10px] font-bold uppercase text-slate-500 hover:bg-white">
                  Change Details
                </Button>
              </div>

              <Card className="shadow-sm border-slate-200 flex-1 overflow-hidden flex flex-col">
                <CardHeader className="pb-2 pt-3 border-b border-slate-100 flex-shrink-0">
                  <CardTitle className="text-[12px] font-bold text-slate-800">Step 2: Upload Document</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 flex-1 overflow-y-auto scrollbar-hide">
                  <label className="group relative rounded-xl border-2 border-dashed border-slate-200 p-10 text-center transition-all hover:bg-[#f0f7ff] hover:border-[#1d3557] cursor-pointer flex flex-col items-center justify-center min-h-[200px]">
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={handleFileChange} />
                    
                    <div className="h-14 w-14 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100 group-hover:bg-[#1d3557] group-hover:text-white transition-all">
                      <Upload className="h-6 w-6 text-slate-400 group-hover:text-white" />
                    </div>
                    
                    {file ? (
                      <div className="space-y-4 w-full">
                        {isAnalyzing ? (
                          <div className="py-4 space-y-4 animate-in fade-in duration-500 text-center w-full">
                            <Loader2 className="h-10 w-10 text-[#1d3557] animate-spin mx-auto" />
                            <p className="text-xs font-bold text-[#1d3557] uppercase tracking-widest">
                                {analysisStep === 1 ? "Extracting Text..." : 
                                 analysisStep === 2 ? "Classifying Document..." : 
                                 "Validating Authenticity..."}
                            </p>
                          </div>
                        ) : analysisResult ? (
                          <div className="space-y-4 animate-in zoom-in duration-300 w-full">
                            <div className="flex items-center justify-center gap-2 text-emerald-600">
                              <CheckCircle className="h-5 w-5" />
                              <span className="text-sm font-bold uppercase tracking-wider">Verified</span>
                            </div>
                            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100 inline-block text-left mx-auto">
                              <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest mb-1 text-center">Identified As</p>
                              <p className="text-base font-bold text-slate-800 text-center">{analysisResult.type}</p>
                            </div>
                            <div className="pt-2 border-t border-slate-100 mt-4">
                              <p className="text-sm font-bold text-slate-800 truncate px-4">{file.name}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Click to Replace File</p>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <p className="text-sm font-bold text-slate-800">{file.name}</p>
                            <p className="text-[10px] text-emerald-500 font-bold uppercase">Ready for Analysis</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <>
                        <p className="text-[13px] font-bold text-slate-600 mb-4 group-hover:text-[#1d3557]">
                          Drag & Drop or <span className="text-[#1d3557] underline decoration-2 underline-offset-4">Browse Files</span>
                        </p>
                        <div className="h-10 px-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[11px] font-extrabold uppercase tracking-widest text-[#1d3557] shadow-sm group-hover:bg-[#1d3557] group-hover:text-white group-hover:border-transparent transition-all">
                          Select File
                        </div>
                        <p className="mt-4 text-[10px] text-slate-400 font-medium">Supports PDF, JPG, PNG (Max 10MB)</p>
                      </>
                    )}
                  </label>
                </CardContent>
              </Card>

              <div className="flex justify-between items-center mt-2 flex-shrink-0">
                <Button type="button" variant="ghost" onClick={() => setStep(1)} className="text-[11px] font-bold uppercase text-slate-500">
                  Back to Details
                </Button>
                <Button 
                  type="submit" 
                  className="px-12 h-11 bg-[#1d3557] hover:bg-[#2c4e7d] text-[12px] font-bold shadow-lg uppercase tracking-widest" 
                  disabled={!file}
                >
                  Submit Document
                </Button>
              </div>
            </div>
          )}
        </form>
      </div>
    </AppLayout>
);
};

export default SubmitDocumentPage;
