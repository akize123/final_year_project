import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { mockProjects } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Eye, FileText, Upload } from "lucide-react";

const statusColors: Record<string, string> = {
  Published: "bg-success/10 text-success border-success/20",
  Pending: "bg-warning/10 text-warning border-warning/20",
  Draft: "bg-muted text-muted-foreground border-border",
  Rejected: "bg-destructive/10 text-destructive border-destructive/20",
};

const MySubmissionsPage = () => {
  const navigate = useNavigate();
  const submissions = mockProjects.filter(
    (p) => p.type !== "Publication" && ["u1"].some(() => true)
  ).slice(0, 1); // Restricted to only one submission

  const [filter, setFilter] = useState("All");
  const filters = ["All", "Published", "Pending", "Draft", "Rejected"];

  const filtered = filter === "All" ? submissions : submissions.filter((s) => s.status === filter);
  const hasSubmission = submissions.length >= 1;

  return (
    <AppLayout 
      title="Research Submission" 
      subtitle="Institutional project submission and tracking."
    >
      <div className="space-y-4 overflow-hidden h-[calc(100vh-160px)] flex flex-col">
        <div className="flex justify-end items-center flex-shrink-0">
          <Button 
            onClick={() => navigate("/submit/project")} 
            disabled={hasSubmission}
            className={`h-8 gap-2 font-bold shadow-sm rounded-lg text-[11px] ${
              hasSubmission 
              ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
              : "bg-[#1d3557] hover:bg-[#2c4e7d] text-white"
            }`}
          >
            <Upload className="w-3.5 h-3.5" /> 
            {hasSubmission ? "Limit Reached (1/1)" : "Submit New Project"}
          </Button>
        </div>

        <div className="flex flex-wrap gap-1.5 pt-1 flex-shrink-0">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all duration-300 ${
                filter === f 
                ? "bg-[#1d3557] text-white shadow-md" 
                : "bg-white border border-slate-200 text-slate-500 hover:border-[#1d3557]/30 hover:bg-slate-50"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex-1">
          <table className="w-full">
            <thead className="bg-slate-50/50">
              <tr className="border-b border-slate-100 text-[9px] font-bold uppercase tracking-wider text-slate-500">
                <th className="text-left px-4 py-3">Title & Dept</th>
                <th className="text-left px-4 py-3">Type</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3 text-center">Metrics</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((s) => (
                <tr key={s.id} className="group hover:bg-slate-50/80 transition-colors h-14">
                  <td className="px-4 py-2">
                    <p className="text-[13px] font-bold text-slate-700 group-hover:text-[#1d3557] transition-colors line-clamp-1">{s.title}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight mt-0.5">{s.department} • {s.submittedDate}</p>
                  </td>
                  <td className="px-4 py-2">
                    <Badge variant="outline" className="text-[8px] font-bold border-slate-200 text-slate-600 bg-white uppercase">
                      {s.type}
                    </Badge>
                  </td>
                  <td className="px-4 py-2">
                    <Badge variant="outline" className={`text-[8px] font-bold border-transparent uppercase ${
                      s.status === 'Published' ? 'bg-emerald-50 text-emerald-600' :
                      s.status === 'Pending' ? 'bg-amber-50 text-amber-600' :
                      s.status === 'Rejected' ? 'bg-red-50 text-red-600' :
                      'bg-slate-100 text-slate-500'
                    }`}>
                      {s.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <div className="flex items-center justify-center gap-1 text-slate-400">
                      <Eye className="w-3 h-3" /> 
                      <span className="text-[10px] font-bold text-slate-500">{s.views}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2 text-right">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => navigate(`/projects/${s.id}`)}
                      className="h-7 gap-1.5 px-3 font-bold text-[10px] uppercase border-slate-200 hover:border-[#1d3557]/30 hover:text-[#1d3557] bg-white shadow-sm"
                    >
                      <FileText className="w-3 h-3" /> View Detail
                    </Button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-10">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No matching submissions found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
};

export default MySubmissionsPage;
