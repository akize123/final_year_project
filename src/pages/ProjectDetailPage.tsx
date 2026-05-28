import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { mockProjects } from "@/data/mockData";
import { AuthorProfileCard } from "@/components/AuthorProfileCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye, CalendarDays, Github, Star, GitFork, FileText, ExternalLink, Clock, CheckCircle, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const typeColors: Record<string, string> = {
  "Student Project": "bg-primary/10 text-primary border-primary/20",
  Publication: "bg-success/10 text-success border-success/20",
  Thesis: "bg-ai/10 text-ai border-ai/20",
};

const availColors: Record<string, string> = {
  Available: "bg-success/10 text-success",
  "AUCA Only": "bg-primary/10 text-primary",
  "Reserve to Access": "bg-secondary/10 text-secondary",
  "Fully Reserved": "bg-warning/10 text-warning",
};

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("info");
  const [reserving, setReserving] = useState(false);

  const project = mockProjects.find((p) => p.id === id);
  if (!project) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Project not found.</p>
        </div>
      </AppLayout>
    );
  }

  const tabs = [
    { id: "info", label: "Project Info" },
    ...(project.hasGithub ? [{ id: "github", label: "GitHub Repository" }] : []),
    { id: "memoir", label: project.type === "Publication" ? "Full Document" : "Memoir / Full Document" },
  ];

  const handleReserve = () => {
    setReserving(true);
    setTimeout(() => {
      setReserving(false);
      toast({ title: "Reservation Confirmed!", description: `Reserved '${project.title}' for Mon Mar 17, 8:00 AM – 10:00 AM` });
    }, 1000);
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-4xl pb-12">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate(-1)} 
          className="gap-2 text-slate-500 hover:text-[#1d3557] font-bold text-[11px] uppercase tracking-widest"
        >
          <ArrowLeft className="w-4 h-4" /> Back to archive
        </Button>

        {/* Header */}
        <Card className="group border-slate-200 p-8 shadow-sm transition-all duration-300 hover:shadow-md hover:border-[#1d3557]/30 bg-white">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-[#1d3557] border-transparent">
              {project.type}
            </Badge>
            <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 border-transparent">
              {project.availability}
            </Badge>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 leading-tight group-hover:text-[#1d3557] transition-colors">{project.title}</h1>
          <div className="flex items-center gap-6 mt-6 flex-wrap text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            <span className="flex items-center gap-2"><Building2 className="w-3.5 h-3.5" /> {project.department}</span>
            <span className="flex items-center gap-2"><CalendarDays className="w-3.5 h-3.5" /> CLASS OF {project.year}</span>
            <span className="flex items-center gap-2"><ShieldCheck className="w-3.5 h-3.5" /> {project.level}</span>
          </div>
        </Card>

        {/* Author Profile Cards */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2 px-1">
            <Users className="w-5 h-5 text-[#1d3557]" /> {project.authors.length > 1 ? "Research Authors" : "Research Author"}
          </h3>
          <div className="grid gap-4">
            {project.authors.map((a) => (
              <AuthorProfileCard key={a.initials} author={a} />
            ))}
            {project.supervisor && (
              <AuthorProfileCard
                author={{
                  name: project.supervisor,
                  initials: project.supervisor.split(" ").map(w => w[0]).filter(Boolean).slice(-2).join(""),
                  role: "Lecturer",
                  department: project.department,
                }}
                isSupervisor
              />
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-1 bg-slate-100/50 rounded-xl border border-slate-100">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-2 rounded-lg text-[13px] font-bold transition-all duration-300 ${
                activeTab === tab.id 
                ? "bg-[#1d3557] text-white shadow-md" 
                : "text-slate-500 hover:text-[#1d3557] hover:bg-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "info" && (
          <div className="space-y-6">
            <Card className="border-slate-200 p-8 shadow-sm bg-white">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4">Abstract</h3>
              <p className="text-[14px] text-slate-600 font-medium leading-relaxed">{project.abstract}</p>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-slate-200 p-8 shadow-sm bg-white">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4">Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {project.keywords.map((k) => (
                    <Badge key={k} variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 font-bold text-[10px] uppercase tracking-tight">
                      {k}
                    </Badge>
                  ))}
                </div>
              </Card>
              {project.technologies.length > 0 && (
                <Card className="border-slate-200 p-8 shadow-sm bg-white">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4">Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((t) => (
                      <Badge key={t} variant="outline" className="bg-[#1d3557]/5 text-[#1d3557] border-[#1d3557]/20 font-bold text-[10px] uppercase tracking-tight">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </Card>
              )}
            </div>

            <Card className="border-slate-200 p-8 shadow-sm bg-white">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-6">Archive Metadata</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                {project.supervisor && (
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Supervisor</span>
                    <p className="font-bold text-slate-700 mt-1">{project.supervisor}</p>
                  </div>
                )}
                {project.doi && (
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">DOI ID</span>
                    <p className="font-bold text-slate-700 mt-1">{project.doi}</p>
                  </div>
                )}
                {project.journal && (
                  <div className="col-span-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Published Journal</span>
                    <p className="font-bold text-slate-700 mt-1">{project.journal}</p>
                  </div>
                )}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Submission Date</span>
                  <p className="font-bold text-slate-700 mt-1">{project.submittedDate}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Publish Date</span>
                  <p className="font-bold text-slate-700 mt-1">{project.publishedDate || "—"}</p>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-3 gap-6">
              {[
                { icon: Eye, label: "Total Views", value: project.views },
                { icon: CalendarDays, label: "Reservations", value: project.reservationsMade },
                { icon: FileText, label: "Memoir Access", value: project.timesAccessed },
              ].map((s) => (
                <Card key={s.label} className="group border-slate-200 p-6 shadow-sm text-center bg-white hover:border-[#1d3557]/30 transition-all">
                  <s.icon className="w-5 h-5 text-[#1d3557] mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <p className="text-2xl font-bold text-slate-800">{s.value}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{s.label}</p>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === "github" && project.github && (
          <div className="space-y-6">
            <Card className="border-slate-200 p-8 shadow-sm bg-white">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-3">
                    <Github className="w-6 h-6 text-[#1d3557]" /> {project.github.repoName}
                  </h3>
                  <p className="text-[13px] font-medium text-slate-500 mt-1">{project.github.description}</p>
                </div>
                <Button variant="outline" size="sm" className="h-10 gap-2 border-slate-200 font-bold text-[11px] text-[#1d3557] hover:bg-slate-50 uppercase tracking-widest">
                  <ExternalLink className="w-4 h-4" /> REPOSITORY LINK
                </Button>
              </div>
              <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-amber-500" /> {project.github.stars} STARS</span>
                <span className="flex items-center gap-1.5"><GitFork className="w-4 h-4 text-blue-500" /> {project.github.forks} FORKS</span>
                <Badge variant="outline" className="text-[10px] font-bold bg-slate-50 border-transparent text-slate-500">{project.github.visibility.toUpperCase()}</Badge>
                {project.github.languages.map((l) => (
                  <Badge key={l} variant="outline" className="text-[10px] font-bold bg-[#1d3557]/5 border-transparent text-[#1d3557]">{l.toUpperCase()}</Badge>
                ))}
              </div>
              <div className="mt-8 p-5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                <div>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Latest Commit</p>
                   <p className="text-[13px] font-bold text-slate-700 mt-0.5">{project.github.finalCommit}</p>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Version Tag</p>
                   <p className="text-[13px] font-bold text-[#1d3557] mt-0.5">{project.github.finalTag}</p>
                </div>
              </div>
            </Card>

            <Card className="border-slate-200 p-8 shadow-sm bg-white">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4">README.md</h3>
              <div className="prose prose-sm max-w-none bg-slate-50 rounded-xl p-6 border border-slate-100">
                <pre className="whitespace-pre-wrap text-[13px] text-slate-600 font-medium font-mono">{project.github.readme}</pre>
              </div>
            </Card>
          </div>
        )}

        {activeTab === "memoir" && (
          <Card className="border-slate-200 p-10 shadow-sm bg-white text-center">
            {project.type === "Publication" ? (
              <div className="max-w-md mx-auto">
                <div className="h-16 w-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-blue-100 text-[#1d3557]">
                   <FileText className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Secure Document Viewer</h3>
                <p className="text-[13px] font-medium text-slate-500 mb-8 leading-relaxed">
                  {project.memoirPages} pages · {project.visibility === "auca-only" ? "AUCA Restricted Access" : "Institutional Records"}
                </p>
                <Button className="h-12 px-10 bg-[#1d3557] hover:bg-[#2c4e7d] font-bold text-white shadow-lg shadow-[#1d3557]/20 gap-2">
                  <Eye className="w-5 h-5" /> OPEN FULL DOCUMENT
                </Button>
              </div>
            ) : (
              <div className="max-w-md mx-auto text-left">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-6">Reservation Control</h3>
                <div className="flex items-center gap-4 mb-8 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex gap-2">
                    {Array.from({ length: project.slots?.total || 3 }).map((_, i) => (
                      <div key={i} className={`w-9 h-9 rounded-lg border-2 flex items-center justify-center transition-all ${
                        i < (project.slots?.reserved || 0) 
                        ? "bg-amber-50 border-amber-200 text-amber-600" 
                        : "bg-emerald-50 border-emerald-200 text-emerald-600"
                      }`}>
                        {i < (project.slots?.reserved || 0) ? <Clock className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-slate-700">{(project.slots?.total || 3) - (project.slots?.reserved || 0)} SLOTS FREE</p>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">OF {project.slots?.total || 3} TOTAL CAPACITY</p>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <p className="text-[13px] font-bold text-slate-600 flex items-center gap-3">
                    <div className="h-6 w-6 rounded-md bg-blue-50 flex items-center justify-center text-[#1d3557]">
                       <CalendarDays className="w-3.5 h-3.5" />
                    </div>
                    Mon–Fri Access Only
                  </p>
                  <p className="text-[13px] font-bold text-slate-600 flex items-center gap-3">
                    <div className="h-6 w-6 rounded-md bg-blue-50 flex items-center justify-center text-[#1d3557]">
                       <Clock className="w-3.5 h-3.5" />
                    </div>
                    08:00 AM – 05:00 PM CAT
                  </p>
                </div>

                {project.availability === "Fully Reserved" ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl text-amber-700 text-xs font-bold leading-relaxed flex gap-3">
                       <Info className="h-4 w-4 shrink-0" />
                       All memoir viewing slots for this project are currently fully reserved.
                    </div>
                    <Button variant="outline" className="w-full h-12 font-bold border-amber-200 text-amber-700 hover:bg-amber-50 gap-2 uppercase tracking-widest" onClick={() => toast({ title: "Added to Waitlist", description: "You'll be notified when a slot opens." })}>
                      Join Queue Waitlist
                    </Button>
                  </div>
                ) : (
                  <Button className="w-full h-14 bg-[#1d3557] hover:bg-[#2c4e7d] text-white font-bold shadow-lg shadow-[#1d3557]/20 gap-3 text-[15px] uppercase tracking-wider" onClick={handleReserve} disabled={reserving}>
                    <CalendarDays className="w-5 h-5" />
                    {reserving ? "Processing..." : "Request Secure Reservation"}
                  </Button>
                )}
              </div>
            )}
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default ProjectDetailPage;
