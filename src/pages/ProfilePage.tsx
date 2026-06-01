import { useAuth } from "@/contexts/AuthContext";

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="rounded-[2rem] bg-white border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-blue-50 text-blue-900 text-3xl font-black shadow-sm">
              {user.avatarInitials}
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900">My Profile</h1>
              <p className="text-sm font-medium text-slate-500">View your AUCA account details and profile summary.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 pt-6 sm:grid-cols-2">
          <div className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">Full Name</p>
            <p className="mt-2 text-sm font-bold text-slate-900">{user.name}</p>
          </div>
          <div className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">Email Address</p>
            <p className="mt-2 text-sm font-bold text-slate-900">{user.email}</p>
          </div>
          <div className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">Role</p>
            <p className="mt-2 text-sm font-bold text-slate-900">{user.role === "exam_office" ? "Exam Office" : user.role}</p>
          </div>
          <div className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">Department</p>
            <p className="mt-2 text-sm font-bold text-slate-900">{user.department}</p>
          </div>
          <div className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">Campus ID</p>
            <p className="mt-2 text-sm font-bold text-slate-900">{user.campusId}</p>
          </div>
          {user.year && (
            <div className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">Class Year</p>
              <p className="mt-2 text-sm font-bold text-slate-900">{user.year}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
