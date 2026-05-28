import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Upload, Github, X, FileText, Lightbulb, Loader2, User, ArrowRight, ShieldCheck, FileUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { AuthorProfileCard } from "@/components/AuthorProfileCard";
import { CoAuthorSearch } from "@/components/CoAuthorSearch";
import type { AuthorProfile } from "@/data/mockData";

const SubmitProjectPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // Step 1
  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [department, setDepartment] = useState("");
  const [category, setCategory] = useState("");
  const [year, setYear] = useState("2025");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [techInput, setTechInput] = useState("");
  const [coAuthors, setCoAuthors] = useState<AuthorProfile[]>([]);

  // Step 2
  const [fileName, setFileName] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploaded, setUploaded] = useState(false);

  // Step 3
  const [githubConnected, setGithubConnected] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState("");
  const [markedFinal, setMarkedFinal] = useState(false);

  const addKeyword = () => { if (keywordInput.trim() && keywords.length < 10) { setKeywords([...keywords, keywordInput.trim()]); setKeywordInput(""); } };
  const addTech = () => { if (techInput.trim() && technologies.length < 10) { setTechnologies([...technologies, techInput.trim()]); setTechInput(""); } };

  const simulateUpload = () => {
    setFileName("Final_Year_Project_Report.pdf");
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) { clearInterval(interval); setUploaded(true); return 100; }
        return prev + 20;
      });
    }, 300);
  };

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast({ title: "Project Submitted!", description: "Your project has been submitted for review. You'll be notified once it's approved." });
      navigate("/my-submissions");
    }, 1500);
  };

  const steps = [
    { num: 1, label: "Project Metadata" },
    { num: 2, label: "Memoir Upload" },
    { num: 3, label: "GitHub Repository" },
  ];

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-8 pb-12">
        <div className="text-center mb-3">
          <h1 className="text-lg font-black text-[#1d3557] tracking-widest uppercase">Submit New Project</h1>
        </div>

        {/* Stepper */}
        <div className="relative mb-6">
          <div className="absolute top-1/2 left-0 w-full h-px bg-slate-200 -translate-y-1/2 z-0" />
          <div className="relative z-10 flex items-center justify-between gap-4">
            {steps.map((s, i) => {
              const isActive = step === s.num;
              const isDone = step > s.num;
              return (
                <div key={s.num} className="flex flex-col items-center gap-1.5 flex-1 group bg-slate-50 py-1">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 border-2
                    ${isDone ? "bg-emerald-500 border-emerald-500 text-white" : isActive ? "bg-[#1d3557] border-[#1d3557] text-white z-20" : "bg-white border-slate-200 text-slate-400"}
                  `}>
                    {isDone ? <CheckCircle className="w-4 h-4" /> : s.num}
                  </div>
                  <span className={`text-[9px] font-bold uppercase tracking-widest ${isActive ? "text-[#1d3557]" : isDone ? "text-emerald-600" : "text-slate-400"}`}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <Card className="p-4 border-slate-200 shadow-sm bg-white space-y-3 rounded-2xl">
            {/* Author Profile */}
            <div className="flex items-center gap-2">
              <User className="w-3 h-3 text-[#1d3557]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Lead Researcher: {user?.name}
              </span>
            </div>

            <div className="space-y-1">
              <Label className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Full Research Title <span className="text-red-500">*</span></Label>
              <Input 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="Enter project title..." 
                className="h-8 bg-slate-50/30 border-slate-200 text-xs font-bold text-slate-800 rounded-lg shadow-sm focus:bg-white focus:ring-2 focus:ring-[#1d3557]/10 transition-all" 
              />
            </div>

            <div className="space-y-1">
              <Label className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Research Abstract <span className="text-red-500">*</span></Label>
              <Textarea 
                value={abstract} 
                onChange={(e) => setAbstract(e.target.value)} 
                placeholder="Summary of research..." 
                rows={2} 
                className="bg-slate-50/30 border-slate-200 text-xs font-medium text-slate-700 rounded-lg shadow-sm focus:bg-white focus:ring-2 focus:ring-[#1d3557]/10 transition-all resize-none" 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Department <span className="text-red-500">*</span></Label>
                <Select value={department} onValueChange={setDepartment}>
                  <SelectTrigger className="h-8 bg-slate-50/30 border-slate-200 text-xs font-bold text-slate-800 rounded-lg shadow-sm focus:bg-white focus:ring-2 focus:ring-[#1d3557]/10 transition-all">
                    <SelectValue placeholder="Select primary department" />
                  </SelectTrigger>
                  <SelectContent className="text-xs font-bold text-slate-700 rounded-lg">
                    <SelectItem value="it">Information Technology</SelectItem>
                    <SelectItem value="cs">Computer Science</SelectItem>
                    <SelectItem value="eng">Engineering</SelectItem>
                    <SelectItem value="bus">Business Administration</SelectItem>
                    <SelectItem value="eco">Economics</SelectItem>
                    <SelectItem value="edu">Education</SelectItem>
                    <SelectItem value="theo">Theology</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Classification <span className="text-red-500">*</span></Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="h-8 bg-slate-50/30 border-slate-200 text-xs font-bold text-slate-800 rounded-lg shadow-sm focus:ring-[#1d3557]/10">
                    <SelectValue placeholder="Select research category" />
                  </SelectTrigger>
                  <SelectContent className="text-xs font-bold text-slate-700 rounded-lg">
                    <SelectItem value="software">Software Engineering Project</SelectItem>
                    <SelectItem value="research">Academic Research Study</SelectItem>
                    <SelectItem value="data">Data Analysis & Insights</SelectItem>
                    <SelectItem value="other">Institutional Case Study</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <Button 
                onClick={() => setStep(2)} 
                disabled={!title || !abstract} 
                className="h-8 px-6 bg-[#1d3557] hover:bg-[#2c4e7d] text-white font-bold text-[10px] rounded-lg shadow-sm disabled:opacity-50 group"
              >
                Continue <ArrowRight className="ml-2 w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </Card>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <Card className="p-6 border-slate-200 shadow-sm bg-white space-y-6 rounded-2xl">
            {!uploaded ? (
              <div
                className="border-2 border-dashed border-slate-200 rounded-xl p-10 text-center cursor-pointer hover:border-[#1d3557]/40 hover:bg-slate-50/50 transition-all group bg-slate-50/30"
                onClick={simulateUpload}
              >
                <FileUp className="w-8 h-8 text-[#1d3557] mx-auto mb-3 opacity-60 group-hover:opacity-100 transition-opacity" />
                <p className="text-sm font-bold text-slate-800">Select Research Memoir</p>
                <p className="text-[10px] text-slate-400 mt-1 font-bold">MAX 50MB // PDF ONLY</p>
              </div>
            ) : null}
 
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="space-y-3 py-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-slate-800">{fileName}</p>
                  <span className="text-xs font-bold text-[#1d3557]">{uploadProgress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#1d3557] rounded-full transition-all" style={{ width: `${uploadProgress}%` }} />
                </div>
              </div>
            )}
   
            {uploaded && (
              <div className="border border-emerald-100 bg-emerald-50/50 rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <CheckCircle className="w-8 h-8 text-emerald-500 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-slate-800">{fileName}</p>
                    <p className="text-xs text-emerald-600 mt-1 font-bold">READY FOR ARCHIVE</p>
                  </div>
                </div>
              </div>
            )}
   
            <div className="flex justify-between pt-2">
              <Button variant="ghost" onClick={() => setStep(1)} className="h-10 px-6 font-bold text-slate-400 text-xs rounded-xl">Back</Button>
              <Button onClick={() => setStep(3)} disabled={!uploaded} className="h-10 px-8 bg-[#1d3557] hover:bg-[#2c4e7d] text-white font-bold text-xs rounded-xl shadow-md group">
                Next <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </Card>
        )}
        {/* Step 3 */}
        {step === 3 && (
          <Card className="p-6 border-slate-200 shadow-sm bg-white space-y-6 rounded-2xl">
            {!githubConnected ? (
              <div className="text-center py-12 bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-xl">
                <Github className="w-8 h-8 mx-auto mb-3 text-slate-400" />
                <p className="text-sm font-bold text-slate-800 mb-4">Connect GitHub Repository</p>
                <Button onClick={() => setGithubConnected(true)} className="h-10 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm">
                  Link Account
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="p-4 bg-emerald-50 rounded-xl flex items-center justify-between border border-emerald-100">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                    <div>
                      <p className="text-xs font-bold text-slate-800">GitHub Connected</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setGithubConnected(false)} className="text-emerald-700 hover:bg-emerald-100 text-xs font-bold">Switch</Button>
                </div>
  
                <div className="space-y-3">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Select Repository</Label>
                  <Select value={selectedRepo} onValueChange={setSelectedRepo}>
                    <SelectTrigger className="h-10 bg-slate-50/30 border-slate-200 text-xs font-bold text-slate-800 rounded-lg focus:ring-2 focus:ring-[#1d3557]/10 transition-all">
                      <SelectValue placeholder="Select codebase..." />
                    </SelectTrigger>
                    <SelectContent className="text-xs font-bold text-slate-700">
                      <SelectItem value="auca-hub">auca-academiq-hub</SelectItem>
                      <SelectItem value="lib-system">library-moderation-v2</SelectItem>
                      <SelectItem value="research-api">research-backend-services</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input type="checkbox" id="final" checked={markedFinal} onChange={(e) => setMarkedFinal(e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-[#1d3557] focus:ring-[#1d3557]" />
                  <Label htmlFor="final" className="text-xs font-bold text-slate-700 cursor-pointer">Mark as Final Release</Label>
                </div>
              </div>
            )}
  
            <div className="flex justify-between pt-2">
              <Button variant="ghost" onClick={() => setStep(2)} className="h-10 px-6 font-bold text-slate-400 text-xs rounded-xl">Back</Button>
              <Button onClick={handleSubmit} disabled={submitting} className="h-10 px-8 bg-[#1d3557] hover:bg-[#2c4e7d] text-white font-bold text-xs rounded-xl shadow-md">
                {submitting ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Processing...</> : "Submit"}
              </Button>
            </div>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default SubmitProjectPage;
