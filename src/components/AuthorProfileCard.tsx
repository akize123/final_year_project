import { Badge } from "@/components/ui/badge";
import { Mail, Building2, IdCard, GraduationCap } from "lucide-react";
import type { AuthorProfile } from "@/data/mockData";

interface AuthorProfileCardProps {
  author: AuthorProfile;
  isSupervisor?: boolean;
}

export function AuthorProfileCard({ author, isSupervisor }: AuthorProfileCardProps) {
  return (
    <div className="group flex items-start gap-4 p-5 rounded-xl border border-slate-200 bg-white transition-all duration-300 hover:shadow-md hover:border-[#1d3557]/30 text-left">
      {/* Avatar */}
      <div className="w-12 h-12 rounded-xl bg-[#f0f7ff] border border-blue-100 font-bold text-[#1d3557] text-base flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
        {author.initials}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-slate-800 group-hover:text-[#1d3557] transition-colors">{author.name}</span>
          <Badge variant="outline" className={`text-[9px] font-bold uppercase tracking-wider border-transparent ${
            author.role === "Student"
              ? "bg-blue-50 text-[#1d3557]"
              : "bg-emerald-50 text-emerald-600"
          }`}>
            {isSupervisor ? "Supervisor" : author.role}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-[11px] font-bold text-slate-400">
          {author.department && (
            <span className="flex items-center gap-1.5 uppercase tracking-tight">
              <Building2 className="w-3.5 h-3.5 text-slate-300" /> {author.department}
            </span>
          )}
          {author.campusId && (
            <span className="flex items-center gap-1.5 uppercase tracking-tight">
              <IdCard className="w-3.5 h-3.5 text-slate-300" /> {author.campusId}
            </span>
          )}
          {author.year && (
            <span className="flex items-center gap-1.5 uppercase tracking-tight">
              <GraduationCap className="w-3.5 h-3.5 text-slate-300" /> CLASS OF {author.year}
            </span>
          )}
          {author.email && (
            <span className="flex items-center gap-1.5 text-slate-500 lowercase">
              <Mail className="w-3.5 h-3.5 text-slate-300" /> {author.email}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
