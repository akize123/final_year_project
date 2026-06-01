import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { teachingLogEntries, SEMESTER_TOTAL_SESSIONS } from "@/data/teaching-log";
import { examPapers } from "@/data/exam-papers";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  FileUp,
  GraduationCap,
  PenTool,
} from "lucide-react";

export function LecturerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showAllActions, setShowAllActions] = useState(false);

  const toggleActions = () => {
    const y = window.scrollY;
    setShowAllActions((v) => !v);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo({ top: y });
      });
    });
  };

  const myTeachingLog = useMemo(() => {
    return teachingLogEntries
      .filter((e) => e.lecturerId === user?.id)
      .slice()
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [user?.id]);

  const myCourses = useMemo(() => {
    return Array.from(new Set(myTeachingLog.map((e) => e.courseCode))).sort();
  }, [myTeachingLog]);

  const teachingCompletionPct = Math.min(
    100,
    Math.round((myTeachingLog.length / Math.max(1, SEMESTER_TOTAL_SESSIONS)) * 100),
  );

  const myExamPapers = useMemo(() => {
    return examPapers
      .filter((p) => p.lecturerId === user?.id)
      .slice()
      .sort((a, b) => b.uploadDate.localeCompare(a.uploadDate));
  }, [user?.id]);

  const examStatusCounts = myExamPapers.reduce<Record<string, number>>((acc, p) => {
    acc[p.status] = (acc[p.status] ?? 0) + 1;
    return acc;
  }, {});

  const quickActions = [
    {
      title: "Teaching Log",
      description: "Record sessions and track topic coverage.",
      icon: ClipboardList,
      to: "/teaching-log",
    },
    {
      title: "Marks Entry",
      description: "Enter CAT & exam marks and submit reports.",
      icon: PenTool,
      to: "/marks-entry",
    },
    {
      title: "Exam Upload",
      description: "Upload exams and resolve topic coverage flags.",
      icon: FileUp,
      to: "/exam-upload",
    },
    {
      title: "Supervised Students",
      description: "Review progress and supervise submissions.",
      icon: GraduationCap,
      to: "/supervised",
    },
    {
      title: "My Publications",
      description: "Manage publications and submissions.",
      icon: BookOpen,
      to: "/my-publications",
    },
  ] as const;

  const actionsToShow = showAllActions ? quickActions : quickActions.slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto space-y-4 pb-4 animate-in fade-in duration-500 overflow-hidden">
      {/* Overview */}
      <Card className="overflow-hidden border-slate-200 shadow-sm">
        <CardContent className="p-0">
          <div className="bg-auca px-4 py-2.5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-8 w-8 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-white text-[10px] font-black flex-shrink-0">
                  {user?.avatarInitials ?? "LD"}
                </div>
                <div className="min-w-0">
                  <p className="text-[7px] font-black uppercase tracking-widest text-white/70">Lecturer</p>
                  <h1 className="text-sm font-black text-white truncate">{user?.name}</h1>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/teaching-log")}
                  className="h-7 px-2 text-[9px] bg-white/10 text-white border-white/10 hover:bg-white/20 hover:text-white"
                >
                  <ClipboardList className="h-4 w-4 mr-1.5" />
                  Teaching Log
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/exam-upload")}
                  className="h-7 px-2 text-[9px] bg-white/10 text-white border-white/10 hover:bg-white/20 hover:text-white"
                >
                  <FileUp className="h-4 w-4 mr-1.5" />
                  Exam Upload
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/marks-entry")}
                  className="h-7 px-2 text-[9px] bg-white/10 text-white border-white/10 hover:bg-white/20 hover:text-white hidden sm:inline-flex"
                >
                  <PenTool className="h-4 w-4 mr-1.5" />
                  Marks
                </Button>
              </div>
            </div>
          </div>

          <div className="p-4 bg-white">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/40 p-3">
                <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Courses</p>
                <p className="mt-1 text-sm font-black text-slate-900">{myCourses.length}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50/40 p-3">
                <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Logged sessions</p>
                <p className="mt-1 text-sm font-black text-slate-900">{myTeachingLog.length}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50/40 p-3">
                <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Completion</p>
                <p className="mt-1 text-sm font-black text-slate-900">{teachingCompletionPct}%</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50/40 p-3">
                <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Flagged exams</p>
                <p className="mt-1 text-sm font-black text-slate-900">{examStatusCounts.flagged ?? 0}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick actions */}
      <div className="space-y-2">
        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={toggleActions}
            className="h-6 text-[8px] font-black"
          >
            {showAllActions ? "View less" : "View more"}
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {actionsToShow.map((a) => (
            <button
              key={a.to}
              type="button"
              onClick={() => navigate(a.to)}
              className="text-left group border border-slate-200 bg-white rounded-2xl p-3 shadow-sm hover:shadow-md hover:border-auca transition-all duration-300"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[8px] font-black uppercase tracking-widest text-slate-500">Action</p>
                  <p className="text-[10px] font-black text-slate-900 truncate group-hover:text-auca transition-colors">
                    {a.title}
                  </p>
                  <p className="text-[8px] text-slate-500 leading-relaxed line-clamp-1">{a.description}</p>
                </div>
                <div className="h-8 w-8 rounded-xl bg-auca-soft border border-auca flex items-center justify-center text-auca flex-shrink-0">
                  <a.icon className="h-[16px] w-[16px]" />
                </div>
              </div>
              <div className="mt-2 flex items-center justify-end text-auca opacity-80 text-[7px] font-black uppercase tracking-widest gap-1.5">
                Open <ArrowRight className="h-[12px] w-[12px] transition-transform group-hover:translate-x-0.5" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
