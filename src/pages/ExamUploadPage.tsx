import { useState, useMemo, useEffect } from "react";
import { AppLayout } from "@/components/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, Upload, ChevronRight, 
  ShieldCheck, AlertCircle, Loader2, ArrowRight, 
  FileUp, Sparkles, Database, GraduationCap,
  History, ArrowLeft, RefreshCw, FileText
} from "lucide-react";
import { toast } from "sonner";
import { courseSyllabi, type ExamQuestion } from "@/data/exam-papers";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const STEPS = [
  { id: 1, title: "Course", icon: GraduationCap },
  { id: 2, title: "Upload", icon: Upload },
  { id: 3, title: "Extract", icon: Sparkles },
  { id: 4, title: "Verify", icon: ShieldCheck },
  { id: 5, title: "Finalize", icon: CheckCircle2 },
];

export default function ExamUploadPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { step } = useParams<{ step?: string }>();

  const stepFromSlug = (slug?: string) => {
    switch ((slug ?? "").toLowerCase()) {
      case "course":
        return 1;
      case "upload":
        return 2;
      case "extract":
        return 3;
      case "verify":
        return 4;
      case "finalize":
        return 5;
      default:
        return 1;
    }
  };

  const slugFromStep = (n: number) => {
    switch (n) {
      case 1:
        return "course";
      case 2:
        return "upload";
      case 3:
        return "extract";
      case 4:
        return "verify";
      case 5:
        return "finalize";
      default:
        return "course";
    }
  };

  const [currentStep, setCurrentStep] = useState(() => stepFromSlug(step));
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [extractedData, setExtractedData] = useState<ExamQuestion[] | null>(null);

  // Mock available courses for the lecturer
  const myCourses = useMemo(() => {
    return courseSyllabi.filter(s => ["CS301", "IT201", "CS401"].includes(s.courseCode));
  }, []);

  const currentCourse = myCourses.find(c => c.courseCode === selectedCourse);

  const goToStep = (n: number) => {
    const slug = slugFromStep(n);
    const y = window.scrollY;
    setCurrentStep(n);
    navigate(`/exam-upload/${slug}`);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo({ top: y });
      });
    });
  };

  useEffect(() => {
    const n = stepFromSlug(step);
    setCurrentStep(n);
    if (!step) navigate("/exam-upload/course", { replace: true });
  }, [step, navigate]);

  // Simulation: File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadedFile(file);
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          goToStep(3); // Auto-advance to extraction
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  // Simulation: AI Topic Extraction
  useEffect(() => {
    if (currentStep === 3) {
      setIsAnalyzing(true);
      const timer = setTimeout(() => {
        // Mock extracted data based on the course
        const mockQuestions: Record<string, ExamQuestion[]> = {
          "CS301": [
            { number: 1, text: "Explain SDLC models: Waterfall vs Agile.", topicKeywords: ["Software Development Life Cycle", "Agile"], marks: 15 },
            { number: 2, text: "Draw a Use Case diagram for a library system.", topicKeywords: ["Requirements Engineering", "UML Diagrams"], marks: 15 },
            { number: 3, text: "Describe Design Patterns: Singleton & Factory.", topicKeywords: ["Design Patterns"], marks: 10 }
          ],
          "IT201": [
            { number: 1, text: "Describe Semantic HTML elements.", topicKeywords: ["HTML5 and Semantic Markup"], marks: 10 },
            { number: 2, text: "Center a div using CSS Grid.", topicKeywords: ["CSS Flexbox and Grid"], marks: 10 },
            { number: 3, text: "Explain Docker containerization benefits.", topicKeywords: ["Docker Containerization"], marks: 15 }
          ]
        };
        
        setExtractedData(mockQuestions[selectedCourse || "CS301"] || mockQuestions["CS301"]);
        setIsAnalyzing(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentStep, selectedCourse]);

  const handleFinalSubmit = () => {
    toast.success("Exam Paper Successfully Submitted", {
      description: `Your ${selectedCourse} exam has been forwarded to the HOD for final validation.`,
    });
    setTimeout(() => navigate("/dashboard"), 2000);
  };

  return (
    <AppLayout>
      <div className="space-y-6 pb-8 animate-in fade-in duration-700">
        
        {/* ── Header ── */}
        <div className="flex items-center justify-center border-b border-slate-100 pb-4">
          <div className="inline-flex rounded-2xl bg-[#1d3557] px-4 py-2 text-center shadow-2xl shadow-[#1d3557]/20">
            <h1 className="text-xs font-black text-white uppercase tracking-[0.2em]">Paper Upload & Verification</h1>
          </div>
        </div>

        {/* ── Stepper ── */}
        <div className="relative max-w-4xl mx-auto">
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-slate-100 -translate-y-1/2 -z-0" />
          <div className="relative z-10 flex justify-between">
            {STEPS.map((s) => (
              <div key={s.id} className="flex flex-col items-center group cursor-pointer" onClick={() => s.id < currentStep && goToStep(s.id)}>
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 ${
                  s.id < currentStep ? "bg-emerald-500 border-emerald-500 text-white shadow-lg" :
                  s.id === currentStep ? "bg-white border-[#1d3557] text-[#1d3557] shadow-xl scale-110" :
                  "bg-white border-slate-100 text-slate-300"
                }`}>
                  {s.id < currentStep ? <CheckCircle2 className="h-6 w-6" /> : <s.icon className={`h-5 w-5 ${s.id === currentStep ? "animate-pulse" : ""}`} />}
                </div>
                <span className={`mt-3 text-[9px] font-bold uppercase tracking-widest ${
                  s.id <= currentStep ? "text-[#1d3557]" : "text-slate-300"
                }`}>{s.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Step Content ── */}
        <div className="max-w-4xl mx-auto">
          
          {/* Step 1: Course Selection */}
          {currentStep === 1 && (
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
               <h2 className="text-sm font-black text-slate-800 text-center uppercase tracking-widest">Select Course for Upload</h2>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {myCourses.map(course => (
                   <Card 
                     key={course.courseCode} 
                     className={`cursor-pointer transition-all duration-300 rounded-[2rem] overflow-hidden border-2 ${
                       selectedCourse === course.courseCode ? "border-[#1d3557] shadow-2xl bg-slate-50" : "border-slate-50 hover:border-slate-200 hover:shadow-xl bg-white"
                     }`}
                     onClick={() => setSelectedCourse(course.courseCode)}
                   >
                      <CardContent className="p-4 flex flex-col items-center text-center space-y-2">
                        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${selectedCourse === course.courseCode ? "bg-[#1d3557] text-white" : "bg-slate-50 text-slate-400"} transition-colors`}>
                          <Database className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-black text-slate-800 text-sm uppercase tracking-tight">{course.courseCode}</h3>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{course.courseName}</p>
                        </div>
                        <div className="pt-1">
                          <Badge variant="outline" className="text-[8px] font-bold border-slate-200 text-slate-400 uppercase tracking-widest px-2 py-0.5">2025 Semester I</Badge>
                        </div>
                      </CardContent>
                   </Card>
                 ))}
               </div>
               <div className="flex justify-center pt-6">
                  <Button 
                    disabled={!selectedCourse} 
                    className="h-14 px-12 bg-[#1d3557] hover:bg-[#2c4e7d] rounded-2xl font-bold text-sm uppercase tracking-[0.2em] shadow-2xl shadow-[#1d3557]/20 transition-all active:scale-95"
                    onClick={() => goToStep(2)}
                  >
                    Proceed to Upload <ArrowRight className="ml-3 h-5 w-5" />
                  </Button>
                </div>
            </div>
          )}

          {/* Step 2: File Upload */}
          {currentStep === 2 && (
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
              <div className="text-center space-y-2">
                <h2 className="text-xl font-bold text-slate-800 uppercase tracking-widest">Upload Exam Document</h2>
                <p className="text-sm text-slate-500 font-medium">Please provide the final version of the exam for {selectedCourse}.</p>
              </div>
              
              <Card className="rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-white/50 p-12 transition-all hover:bg-white hover:border-[#1d3557]/30 group relative">
                <input 
                  type="file" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" 
                  onChange={handleFileUpload}
                  accept=".pdf,.docx"
                />
                <div className="flex flex-col items-center space-y-6">
                  <div className={`h-24 w-24 rounded-3xl flex items-center justify-center transition-all duration-500 ${isUploading ? "bg-emerald-50 text-emerald-500 scale-110" : "bg-slate-50 text-slate-300 group-hover:bg-[#1d3557] group-hover:text-white"}`}>
                    {isUploading ? <Loader2 className="h-10 w-10 animate-spin" /> : <Upload className="h-10 w-10" />}
                  </div>
                  
                  {isUploading ? (
                    <div className="w-full max-w-sm space-y-4">
                      <p className="text-sm font-bold text-slate-700 uppercase tracking-widest text-center">Uploading {uploadedFile?.name}...</p>
                      <div className="h-[3px] w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                      </div>
                      <p className="text-[10px] text-slate-400 font-bold text-center uppercase tracking-widest">{uploadProgress}% Complete</p>
                    </div>
                  ) : (
                    <div className="text-center space-y-2">
                      <p className="text-lg font-bold text-slate-800">Drag & Drop or Click to Browse</p>
                      <p className="text-sm text-slate-400 font-medium">Standard PDF format preferred. Max 20MB.</p>
                    </div>
                  )}
                </div>
              </Card>

              <div className="flex justify-between items-center">
                <Button type="button" variant="ghost" className="h-12 px-8 font-bold text-slate-400 hover:text-slate-600 rounded-2xl uppercase tracking-widest" onClick={() => goToStep(1)}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Change Course
                </Button>
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">
                  <ShieldCheck className="h-4 w-4" /> Secure Submission Channel
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Analysis & Topic Extraction */}
          {currentStep === 3 && (
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
              <div className="text-center space-y-2">
                <h2 className="text-xl font-bold text-slate-800 uppercase tracking-widest">AI Topic Extraction</h2>
                <p className="text-sm text-slate-500 font-medium">The system is scanning your PDF to identify core academic topics.</p>
              </div>

              <Card className="rounded-[2.5rem] border-slate-100 shadow-2xl bg-white overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-[#1d3557] p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-xs font-bold text-white uppercase tracking-widest">{uploadedFile?.name || "exam_paper_final.pdf"}</span>
                    </div>
                    {isAnalyzing && <Loader2 className="h-5 w-5 text-blue-300 animate-spin" />}
                  </div>

                  <div className="p-10 space-y-10">
                    {isAnalyzing ? (
                      <div className="flex flex-col items-center py-10 space-y-6 text-center">
                        <div className="relative">
                           <Loader2 className="h-16 w-16 text-[#1d3557] animate-spin opacity-20" />
                           <Sparkles className="h-8 w-8 text-[#1d3557] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                        </div>
                        <div className="space-y-2">
                          <p className="text-lg font-bold text-slate-800">Processing Document...</p>
                          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Matching keywords against {selectedCourse} syllabus</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-8 animate-in fade-in zoom-in-95 duration-700">
                        <div className="grid grid-cols-1 gap-6">
                          {extractedData?.map((q, i) => (
                            <div key={i} className="group p-6 rounded-3xl border border-slate-50 bg-slate-50/30 hover:bg-white hover:border-[#1d3557]/20 hover:shadow-xl transition-all duration-300">
                              <div className="flex items-start justify-between mb-4">
                                <div className="space-y-1">
                                  <span className="text-[10px] font-bold text-[#1d3557] uppercase tracking-widest opacity-60">Question {q.number} — {q.marks} Marks</span>
                                  <p className="text-sm font-bold text-slate-800 leading-relaxed">{q.text}</p>
                                </div>
                                <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-sm">
                                  <CheckCircle2 className="h-4 w-4" />
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {q.topicKeywords.map(kw => (
                                  <Badge key={kw} variant="outline" className="bg-white border-slate-200 text-slate-500 font-bold text-[9px] px-3 py-1 uppercase tracking-widest group-hover:border-[#1d3557]/30 group-hover:text-[#1d3557] transition-all">
                                    {kw}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-center pt-4">
                          <Button 
                            className="h-14 px-12 bg-[#1d3557] hover:bg-[#2c4e7d] rounded-2xl font-bold text-sm uppercase tracking-[0.2em] shadow-2xl shadow-[#1d3557]/20 transition-all active:scale-95"
                            onClick={() => goToStep(4)}
                          >
                            Proceed to Verification <ArrowRight className="ml-3 h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 4: Log Verification */}
          {currentStep === 4 && (
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
              <div className="text-center space-y-2">
                <h2 className="text-xl font-bold text-slate-800 uppercase tracking-widest">Teaching Log Verification</h2>
                <p className="text-sm text-slate-500 font-medium">Cross-referencing exam topics with your submitted teaching sessions.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left: Exam Topics */}
                <Card className="rounded-[2.5rem] border-slate-100 shadow-2xl bg-white overflow-hidden">
                  <div className="p-8 border-b border-slate-50 bg-slate-50/50">
                    <h3 className="text-xs font-bold text-[#1d3557] uppercase tracking-[0.2em]">Exam Topics Found</h3>
                  </div>
                  <div className="p-8 space-y-4">
                    {extractedData?.flatMap(q => q.topicKeywords).filter((v, i, a) => a.indexOf(v) === i).map(topic => (
                      <div key={topic} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                        <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">{topic}</span>
                        <Badge className="bg-emerald-500 text-white border-0 text-[8px] font-bold px-3 py-1 rounded-full shadow-lg shadow-emerald-500/20">EXTRACTED</Badge>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Right: Log Status */}
                <Card className="rounded-[2.5rem] border-slate-100 shadow-2xl bg-white overflow-hidden">
                  <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <h3 className="text-xs font-bold text-[#1d3557] uppercase tracking-[0.2em]">Teaching Log Status</h3>
                    <Button variant="ghost" size="sm" className="text-[10px] font-bold text-[#1d3557] gap-1 px-3">
                      <RefreshCw className="h-3 w-3" /> Sync Logs
                    </Button>
                  </div>
                  <div className="p-8 space-y-4">
                    {extractedData?.flatMap(q => q.topicKeywords).filter((v, i, a) => a.indexOf(v) === i).map(topic => {
                      const isFound = !topic.includes("Docker") && !topic.includes("Patterns"); // Simulation: some flags
                      return (
                        <div key={topic} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${isFound ? "bg-emerald-50/30 border-emerald-100 text-emerald-800" : "bg-red-50/30 border-red-100 text-red-800 shadow-inner"}`}>
                          <div className="flex items-center gap-3">
                            <div className={`h-6 w-6 rounded-full flex items-center justify-center ${isFound ? "bg-emerald-500 text-white" : "bg-red-500 text-white animate-pulse"}`}>
                              {isFound ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertCircle className="h-3.5 w-3.5" />}
                            </div>
                            <span className="text-xs font-bold uppercase tracking-widest">{isFound ? "Matched" : "Gaps Found"}</span>
                          </div>
                          {!isFound && <span className="text-[10px] font-bold uppercase tracking-tighter opacity-70 underline cursor-pointer hover:opacity-100">Add Session</span>}
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </div>

              <div className="flex justify-center pt-8">
                  <Button 
                    className="h-14 px-12 bg-[#1d3557] hover:bg-[#2c4e7d] rounded-2xl font-bold text-sm uppercase tracking-[0.2em] shadow-2xl shadow-[#1d3557]/20 transition-all active:scale-95"
                    onClick={() => goToStep(5)}
                  >
                    Final Review <ArrowRight className="ml-3 h-5 w-5" />
                  </Button>
               </div>
            </div>
          )}

          {/* Step 5: Finalize */}
          {currentStep === 5 && (
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
              <div className="text-center space-y-2">
                <h2 className="text-xl font-bold text-slate-800 uppercase tracking-widest">Final Submission Review</h2>
                <p className="text-sm text-slate-500 font-medium">Confirm the details before forwarding to the HOD.</p>
              </div>

              <Card className="rounded-[2.5rem] border-slate-100 shadow-3xl bg-[#1d3557] text-white overflow-hidden p-12 text-center space-y-8 relative">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-5 pointer-events-none">
                  <Database className="h-64 w-64 absolute -top-20 -right-20 rotate-12" />
                </div>
                
                <div className="relative z-10 flex flex-col items-center space-y-6">
                  <div className="h-24 w-24 rounded-3xl bg-white/10 flex items-center justify-center border border-white/20 shadow-2xl">
                    <ShieldCheck className="h-12 w-12 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold tracking-tight mb-2">Ready for Validation</h3>
                    <p className="text-blue-200/60 font-medium text-sm max-w-md mx-auto">All identified topics have been verified against institutional logs. The paper is compliant with department standards.</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Course Code</p>
                      <p className="text-sm font-bold uppercase">{selectedCourse}</p>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Total Marks</p>
                      <p className="text-sm font-bold uppercase">100 Pts</p>
                    </div>
                  </div>

                  <div className="pt-6 w-full max-w-md space-y-4">
                    <Button 
                      className="w-full h-16 bg-white text-[#1d3557] hover:bg-slate-100 rounded-[1.5rem] font-bold text-sm uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95"
                      onClick={handleFinalSubmit}
                    >
                      Forward to HOD Office
                    </Button>
                    <Button type="button" variant="ghost" className="text-white/40 hover:text-white hover:bg-white/10 uppercase tracking-widest text-[10px] font-bold" onClick={() => goToStep(4)}>
                      Back to Verification
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}

        </div>
      </div>
    </AppLayout>
  );
}
