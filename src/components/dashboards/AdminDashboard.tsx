import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { 
  ArrowDown, LayoutGrid, GraduationCap as ProgressIcon, BookOpen, Bell, Activity, Users, ShieldCheck, Database, Server, AlertTriangle, FileText, Settings, ShieldAlert, Filter
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

/* ─── Mock data ─── */
const systemStats = {
  totalUsers: 1245,
  activeSessions: 84,
  pendingVerifications: 42,
  storageUsed: 78, // percentage
};

const recentSubmissions = [
  { id: 1, title: "Machine Learning for Early Crop Disease Detection", author: "Grace Uwimana", type: "Thesis", status: "published", size: "12 MB" },
  { id: 2, title: "E-Commerce Platform for Local Artisans", author: "Marie Claire N.", type: "Project", status: "under_review", size: "8.4 MB" },
  { id: 3, title: "Kinyarwanda Sentiment Analysis using NLP", author: "Prof. Agnes N.", type: "Publication", status: "published", size: "2.1 MB" },
  { id: 4, title: "Solar Energy Management Dashboard", author: "Patrick K.", type: "Project", status: "pending", size: "15 MB" },
];

const systemLogs = [
  { action: "Database backup completed successfully", time: "2 hours ago", type: "success" as const, icon: Database },
  { action: "High memory usage detected on Web Node 2", time: "5 hours ago", type: "warning" as const, icon: Server },
  { action: "New faculty accounts provisioned (12 users)", time: "1 day ago", type: "info" as const, icon: Users },
  { action: "Failed login attempts spike from IP 192.168.1.45", time: "2 days ago", type: "error" as const, icon: AlertTriangle },
];

export function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [visibleSubmissions, setVisibleSubmissions] = useState(3);
  const [visibleLogs, setVisibleLogs] = useState(3);

  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-4 pb-4 animate-in fade-in duration-700 h-[calc(100vh-140px)] overflow-hidden flex flex-col">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 flex-shrink-0">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">System Administration</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Infrastructure Control • System Build v4.2</p>
        </div>
      </div>

      <div className="p-6">
        <Card className="rounded-2xl bg-white shadow">
          <CardContent className="p-6">
            <h2 className="text-lg font-bold text-slate-800">Admin Overview</h2>
            <p className="text-sm text-slate-500 mt-2">Compact overview — tabs and detailed sections temporarily collapsed for clarity.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
