import { useEffect, useMemo, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { mockNotifications } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, X, CalendarDays, Clock, RefreshCw, Mail, Shield, Bell, Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

type AppNotification = {
  id: string;
  userId: string;
  type: string;
  title: string;
  body?: string;
  read: boolean;
  createdAt: string; // ISO
  fromRole?: string;
  fromName?: string;
};

const STORAGE_KEY = "auca_notifications_v1";

function loadStoredNotifications(): AppNotification[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as AppNotification[];
  } catch {
    return [];
  }
}

function saveStoredNotifications(items: AppNotification[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

const typeIcons: Record<string, React.ReactNode> = {
  approved: <CheckCircle className="w-5 h-5 text-emerald-600" />,
  rejected: <X className="w-5 h-5 text-red-500" />,
  reservation: <CalendarDays className="w-5 h-5 text-[#1d3557]" />,
  reminder: <Clock className="w-5 h-5 text-amber-500" />,
  reupload: <RefreshCw className="w-5 h-5 text-blue-500" />,
  review: <Mail className="w-5 h-5 text-[#1d3557]" />,
  renewal: <Shield className="w-5 h-5 text-emerald-600" />,
  system: <Bell className="w-5 h-5 text-slate-400" />,
};

const NotificationsPage = () => {
  const { user } = useAuth();

  const getInitialNotifications = () => {
    if (user?.role === "exam_office") {
      return [
        {
          id: "ex-n1",
          userId: user.id,
          type: "approved",
          title: "Exam Paper Moderated by HOD",
          body: "HOD Dr. Robert Mugabo has approved the CS301 Software Engineering final exam paper. Authorized for duplication and print queue.",
          read: false,
          createdAt: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: "ex-n2",
          userId: user.id,
          type: "reminder",
          title: "HOD Eligibility Approval Request",
          body: "HOD Dr. Robert Mugabo has submitted the official Student Eligibility List for IT201 Web Development for final endorsement.",
          read: false,
          createdAt: new Date(Date.now() - 7200000).toISOString(),
        },
        {
          id: "ex-n3",
          userId: user.id,
          type: "reupload",
          title: "Correction Completed by HOD",
          body: "Correction submitted by Computer Science HOD for ML Midterm (CS401). Please verify security seals.",
          read: true,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: "ex-n4",
          userId: user.id,
          type: "review",
          title: "Marks Validation Approved by HOD",
          body: "HOD Dr. Robert Mugabo has validated the final grades of ENG301 (Circuit Design) and signed off the report.",
          read: true,
          createdAt: new Date(Date.now() - 172800000).toISOString(),
        },
      ];
    }
    return mockNotifications;
  };

  const [notifications, setNotifications] = useState<AppNotification[]>(getInitialNotifications as unknown as AppNotification[]);

  useEffect(() => {
    if (!user) return;
    const stored = loadStoredNotifications().filter((n) => n.userId === user.id);
    if (stored.length === 0) return;
    setNotifications((prev) => {
      const existing = new Set(prev.map((p) => p.id));
      const merged = [...stored.filter((s) => !existing.has(s.id)), ...prev];
      return merged.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    });
  }, [user?.id]);

  const markAllRead = () => setNotifications(notifications.map((n) => ({ ...n, read: true })));
  const markRead = (id: string) => setNotifications(notifications.map((n) => n.id === id ? { ...n, read: true } : n));

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  useEffect(() => {
    if (!user) return;
    const stored = loadStoredNotifications();
    const map = new Map(stored.map((n) => [n.id, n]));
    notifications.forEach((n) => {
      if (n.userId !== user.id) return;
      const existing = map.get(n.id);
      if (!existing) return;
      if (existing.read !== n.read) map.set(n.id, { ...existing, read: n.read });
    });
    saveStoredNotifications(Array.from(map.values()));
  }, [notifications, user?.id]);

  return (
    <AppLayout>
      <div className="space-y-4 max-w-md mx-auto pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-heading font-black text-foreground">Notifications</h1>
            {unreadCount > 0 && <Badge className="bg-[#1d3557] text-white font-bold text-[10px]">{unreadCount} UNREAD</Badge>}
          </div>
          <Button type="button" variant="outline" size="sm" onClick={markAllRead} className="h-8 gap-2 border-slate-200 bg-white font-bold text-[10px] text-slate-600 hover:bg-slate-50 shadow-sm">
            <Check className="w-4 h-4" /> MARK ALL
          </Button>
        </div>

        <div className="space-y-2">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
              <Bell className="w-8 h-8 text-slate-300 mb-2" />
              <p className="text-xs font-semibold text-slate-500">No notifications</p>
            </div>
          ) : (
            notifications.slice(0, 3).map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => markRead(n.id)}
                className={`w-full text-left rounded-xl border px-3 py-2.5 transition-colors shadow-sm ${
                  n.read ? "bg-white border-slate-100" : "bg-blue-50/20 border-[#1d3557]/20"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 w-7 h-7 rounded-lg bg-white border border-slate-100 shadow-sm flex items-center justify-center flex-shrink-0">
                    <span className="scale-75">{typeIcons[n.type] || <Bell className="w-4 h-4 text-slate-400" />}</span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className={`text-[11px] leading-snug line-clamp-1 ${n.read ? "font-semibold text-slate-600" : "font-black text-slate-800"}`}>
                        {n.title}
                      </p>
                      {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-[#1d3557]" />}
                    </div>
                    {n.body && (
                      <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-2">{n.body}</p>
                    )}
                    <div className="flex items-center justify-between text-[9px] font-bold text-slate-400 uppercase tracking-tight mt-1.5">
                      <span className="flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        {new Date(n.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                      {(n.fromRole || n.fromName) && (
                        <span className="truncate max-w-[120px]">{n.fromName ? n.fromName : n.fromRole}</span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default NotificationsPage;
