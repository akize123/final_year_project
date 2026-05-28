import { AppLayout } from "@/components/AppLayout";
import { mockProjects } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Eye, FileText, Trash2, Upload, Replace } from "lucide-react";
import { useMemo } from "react";
import { toast } from "sonner";

type PublicationOverrides = {
  deletedIds: string[];
  replacedAtById: Record<string, string>;
};

const STORAGE_KEY = "auca_publications_overrides_v1";

function loadOverrides(): PublicationOverrides {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { deletedIds: [], replacedAtById: {} };
    const parsed = JSON.parse(raw) as PublicationOverrides;
    return {
      deletedIds: Array.isArray(parsed?.deletedIds) ? parsed.deletedIds : [],
      replacedAtById: parsed?.replacedAtById && typeof parsed.replacedAtById === "object" ? parsed.replacedAtById : {},
    };
  } catch {
    return { deletedIds: [], replacedAtById: {} };
  }
}

function saveOverrides(next: PublicationOverrides) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
}

const MyPublicationsPage = () => {
  const navigate = useNavigate();
  const overrides = useMemo(() => loadOverrides(), []);

  const pubs = useMemo(() => {
    const deleted = new Set(overrides.deletedIds);
    return mockProjects.filter((p) => p.type === "Publication" && !deleted.has(p.id));
  }, [overrides.deletedIds]);

  const markDeleted = (id: string) => {
    const next = loadOverrides();
    if (!next.deletedIds.includes(id)) next.deletedIds = [id, ...next.deletedIds];
    saveOverrides(next);
    toast.success("Publication removed");
    navigate(0);
  };

  const markReplaced = (id: string) => {
    const next = loadOverrides();
    next.replacedAtById = { ...next.replacedAtById, [id]: new Date().toISOString() };
    saveOverrides(next);
    toast.success("Publication replaced");
    navigate(0);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-3 sm:items-center">
          <div className="hidden sm:block" />
          <div className="text-center">
            <h1 className="text-xl font-heading font-black text-foreground">My Publications</h1>
          </div>
          <div className="flex justify-center sm:justify-end">
            <Button
              type="button"
              onClick={() => navigate("/submit/publication")}
              className="h-10 gap-2 bg-[#1d3557] hover:bg-[#2c4e7d] font-bold shadow-sm"
            >
              <Upload className="w-4 h-4" /> Submit Publication
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50/50">
              <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="text-left px-4 py-3">Title</th>
                <th className="text-left px-4 py-3">Type</th>
                <th className="text-left px-4 py-3">Journal</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Views</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pubs.map((p) => (
                <tr key={p.id} className="group hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-sm font-bold text-slate-700 group-hover:text-[#1d3557] transition-colors">{p.title}</p>
                    <p className="text-[11px] font-medium text-slate-400 mt-0.5">{p.department} · {p.year}</p>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className="text-[10px] font-bold border-slate-200 text-slate-600 bg-white">
                      Research Paper
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-xs font-bold text-slate-500">{p.journal || "—"}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className="text-[10px] font-bold border-transparent bg-emerald-50 text-emerald-600">
                      {p.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-[11px] font-bold">{p.views}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/projects/${p.id}`)}
                        className="h-7 px-2 text-slate-600 hover:text-[#1d3557] hover:bg-white border border-transparent hover:border-slate-200 shadow-none text-[11px] font-bold"
                      >
                        <FileText className="w-4 h-4" /> Open
                      </Button>

                      <label className="inline-flex">
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (!f) return;
                            markReplaced(p.id);
                            e.target.value = "";
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-7 px-2 text-[11px] font-bold"
                        >
                          <Replace className="w-4 h-4" /> Replace
                        </Button>
                      </label>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => markDeleted(p.id)}
                        className="h-7 px-2 text-[11px] font-bold text-destructive border-destructive/30 hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
};

export default MyPublicationsPage;
