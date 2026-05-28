import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Upload, X, FileText, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const SubmitPublicationPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [pubType, setPubType] = useState("");
  const [department, setDepartment] = useState("");
  const [doi, setDoi] = useState("");
  const [journal, setJournal] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState("");

  const [uploaded, setUploaded] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [versionLabel, setVersionLabel] = useState("");

  const [visibility, setVisibility] = useState("auca-only");

  const addKeyword = () => { if (keywordInput.trim()) { setKeywords([...keywords, keywordInput.trim()]); setKeywordInput(""); } };

  const simulateUpload = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => { if (prev >= 100) { clearInterval(interval); setUploaded(true); return 100; } return prev + 25; });
    }, 300);
  };

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast({ title: "Publication Submitted!", description: "Your publication has been submitted for moderation review." });
      navigate("/my-publications");
    }, 1500);
  };

  const steps = [
    { num: 1, label: "Publication Metadata" },
    { num: 2, label: "Document Upload" },
    { num: 3, label: "Access & Visibility" },
  ];

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-xl font-heading font-bold text-foreground">Submit Publication</h1>

        <div className="flex items-center gap-2">
          {steps.map((s, i) => (
            <div key={s.num} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step > s.num ? "bg-success text-success-foreground" : step === s.num ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>
                {step > s.num ? <CheckCircle className="w-4 h-4" /> : s.num}
              </div>
              <span className={`text-sm ${step === s.num ? "text-foreground font-medium" : "text-muted-foreground"}`}>{s.label}</span>
              {i < steps.length - 1 && <div className={`flex-1 h-0.5 ${step > s.num ? "bg-success" : "bg-border"}`} />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="bg-card rounded-xl border border-border p-6 card-shadow space-y-5">
            <div className="space-y-2"><Label>Title *</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Publication title" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Publication Type *</Label>
                <Select value={pubType} onValueChange={setPubType}>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="research">Research Paper</SelectItem>
                    <SelectItem value="journal">Journal Article</SelectItem>
                    <SelectItem value="conference">Conference Paper</SelectItem>
                    <SelectItem value="book">Book Chapter</SelectItem>
                    <SelectItem value="technical">Technical Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Department *</Label>
                <Select value={department} onValueChange={setDepartment}>
                  <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cs">Computer Science</SelectItem>
                    <SelectItem value="it">Information Technology</SelectItem>
                    <SelectItem value="eco">Economics</SelectItem>
                    <SelectItem value="eng">Engineering</SelectItem>
                    <SelectItem value="edu">Education</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2"><Label>Abstract *</Label><Textarea value={abstract} onChange={(e) => setAbstract(e.target.value)} rows={4} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>DOI (optional)</Label><Input value={doi} onChange={(e) => setDoi(e.target.value)} placeholder="10.xxxx/..." /></div>
              <div className="space-y-2"><Label>Journal / Conference</Label><Input value={journal} onChange={(e) => setJournal(e.target.value)} placeholder="Journal name" /></div>
            </div>
            <div className="space-y-2">
              <Label>Keywords</Label>
              <div className="flex gap-2">
                <Input value={keywordInput} onChange={(e) => setKeywordInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addKeyword())} placeholder="Add keyword" />
                <Button type="button" variant="outline" onClick={addKeyword}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {keywords.map((k) => (
                  <Badge key={k} variant="outline" className="gap-1 bg-primary/5 text-primary">{k} <X className="w-3 h-3 cursor-pointer" onClick={() => setKeywords(keywords.filter((x) => x !== k))} /></Badge>
                ))}
              </div>
            </div>
            <div className="flex justify-end"><Button onClick={() => setStep(2)} disabled={!title || !abstract}>Next: Document Upload</Button></div>
          </div>
        )}

        {step === 2 && (
          <div className="bg-card rounded-xl border border-border p-6 card-shadow space-y-5">
            {!uploaded ? (
              <div className="border-2 border-dashed border-primary/30 rounded-xl p-12 text-center cursor-pointer hover:bg-primary/5 transition-colors" onClick={simulateUpload}>
                <Upload className="w-10 h-10 text-primary mx-auto mb-3" />
                <p className="text-sm font-medium text-foreground">Upload your document (PDF)</p>
                <p className="text-xs text-muted-foreground mt-1">PDF only, max 50MB</p>
              </div>
            ) : null}
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Document.pdf</span><span className="text-primary font-medium">{uploadProgress}%</span></div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden"><div className="h-full bg-primary rounded-full transition-all" style={{ width: `${uploadProgress}%` }} /></div>
              </div>
            )}
            {uploaded && (
              <div className="border border-success/30 bg-success/5 rounded-xl p-5">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-success" />
                  <div><p className="text-sm font-medium text-foreground">Research_Paper_Final.pdf</p><p className="text-xs text-muted-foreground mt-1">42 pages · 2.8 MB</p></div>
                </div>
              </div>
            )}
            {uploaded && (
              <div className="space-y-2"><Label>Version Label</Label><Input value={versionLabel} onChange={(e) => setVersionLabel(e.target.value)} placeholder="e.g., Final Submitted Version" /></div>
            )}
            <div className="flex justify-between"><Button variant="outline" onClick={() => setStep(1)}>Back</Button><Button onClick={() => setStep(3)} disabled={!uploaded}>Next: Access Settings</Button></div>
          </div>
        )}

        {step === 3 && (
          <div className="bg-card rounded-xl border border-border p-6 card-shadow space-y-5">
            <div className="space-y-2">
              <Label>Visibility *</Label>
              <Select value={visibility} onValueChange={setVisibility}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="auca-only">AUCA Members Only (default)</SelectItem>
                  <SelectItem value="restricted">Restricted (Approval Required)</SelectItem>
                  <SelectItem value="embargo">Embargo Until Date</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Access Notes (optional)</Label><Textarea placeholder="Special instructions for viewers..." rows={3} /></div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="notify" defaultChecked className="rounded" />
              <Label htmlFor="notify" className="text-sm font-normal">Notify co-authors via email</Label>
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
              <Button onClick={handleSubmit} disabled={submitting} className="gap-2">
                {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : "Submit for Review"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default SubmitPublicationPage;
