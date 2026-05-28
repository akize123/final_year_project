import React from "react";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { NavLink } from "@/components/NavLink";
import {
  LayoutDashboard, Search, FileText, CalendarDays, Upload,
  BookOpen, Users, Shield, Settings, BarChart3, Clock, LogOut, ClipboardList,
  FileCheck, GraduationCap, FolderOpen, Stamp, UserCheck, FileUp,
  ClipboardCheck, CalendarClock, Armchair, ListChecks, ScrollText,
  FileSearch, FileScan, BookMarked, Briefcase, Kanban, Award, TrendingUp, PenTool, BookType,
  Globe, Sparkles, ShieldCheck, CreditCard, CheckCircle, LifeBuoy, ArrowRight, Bell, MapPin, AlertTriangle
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter, useSidebar,
  SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton, SidebarMenuAction,
} from "@/components/ui/sidebar";
import { useLocale } from "@/contexts/LocaleContext";

interface NavItem {
  title: string;
  url: string;
  icon: React.ElementType;
  badge?: number;
  roles: UserRole[];
  children?: NavItem[];
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

/**
 * Sidebar structure organized by OFFICE / WORKFLOW
 * Each group maps to a distinct office in the university hierarchy.
 */
const navGroups: NavGroup[] = [
  {
    label: "AUCA Connect Archive System",
    items: [
      { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard, roles: ["student", "lecturer", "hod", "moderator", "admin", "exam_office"] },
    ],
  },

  /* ─── Student Office ─── */
  {
    label: "Student Records",
    items: [
      { title: "My Documents", url: "/my-documents", icon: FolderOpen, roles: ["student"] },
      { title: "Submit Project", url: "/submit/project", icon: FileUp, roles: ["student"] },
      { title: "Upload Document", url: "/submit/document", icon: FileUp, roles: ["student"] },
      { title: "My Reservations", url: "/my-reservations", icon: CalendarDays, roles: ["student"] },
    ],
  },

  /* ─── Lecturer Office ─── */
  {
    label: "Lecturer Office",
    items: [
      { title: "Course Materials", url: "/course-materials", icon: BookType, roles: ["lecturer"] },
      { title: "Teaching Log", url: "/teaching-log", icon: ClipboardList, roles: ["lecturer"] },
      { title: "Marks Entry", url: "/marks-entry", icon: PenTool, roles: ["lecturer"] },
      { title: "Exam Upload", url: "/exam-upload", icon: FileUp, roles: ["lecturer"] },
      { title: "Supervised Students", url: "/supervised", icon: GraduationCap, roles: ["lecturer"] },
      { title: "My Publications", url: "/my-publications", icon: BookOpen, roles: ["lecturer"] },
    ],
  },

  /* ─── Head of Department ─── */
  {
    label: "HOD Office",
    items: [
      { title: "Curriculum", url: "/hod/curriculum", icon: BookType, roles: ["hod"] },
      { title: "Teaching Prog", url: "/hod/teaching-progress", icon: TrendingUp, roles: ["hod"] },
      { title: "Exam Review", url: "/hod/exam-review", icon: FileCheck, roles: ["hod"] },
      { title: "Moderation", url: "/hod/marks-moderation", icon: ScrollText, roles: ["hod"] },
      { title: "Reports", url: "/hod/reports", icon: BarChart3, roles: ["hod"] },
      { title: "More", url: "#hod-more", icon: FolderOpen, roles: ["hod"], children: [
        { title: "Projects", url: "/hod/projects", icon: Kanban, roles: ["hod"] },
        { title: "Internships", url: "/hod/internships", icon: Briefcase, roles: ["hod"] },
        { title: "Graduations", url: "/hod/graduations", icon: Award, roles: ["hod"] },
        { title: "Eligibility", url: "/hod/eligibility", icon: ListChecks, roles: ["hod"] },
      ] },
    ],
  },

  /* ─── Examination Office ─── */
  {
    label: "Exam Office",
    items: [
      { title: "Timetable / Approved", url: "/exam-office/timetable", icon: CalendarClock, roles: ["hod", "admin", "exam_office"] },
      { title: "Invigilator Hub", url: "/exam-office/invigilators", icon: Users, roles: ["hod", "admin", "exam_office"] },
      { title: "Venue Registry", url: "/exam-office/venues", icon: MapPin, roles: ["hod", "admin", "exam_office"] },
      { title: "Clash Resolver", url: "/exam-office/clashes", icon: AlertTriangle, roles: ["hod", "admin", "exam_office"] },
    ],
  },

  /* ─── Moderator / Library ─── */
  {
    label: "Library / Moderation",
    items: [
      { title: "Moderation Queue", url: "/moderation", icon: Shield, badge: 5, roles: ["moderator", "admin"] },
      { title: "Reservations", url: "/my-reservations", icon: CalendarDays, roles: ["moderator", "admin"] },
      { title: "Published Archive", url: "/browse", icon: BookMarked, roles: ["moderator"] },
    ],
  },

  /* ─── Admin ─── */
  {
    label: "Administration",
    items: [
      { title: "User Management", url: "/admin/users", icon: Users, roles: ["admin"] },
      { title: "Reports & Audit", url: "/admin/reports", icon: BarChart3, roles: ["admin"] },
      { title: "System Settings", url: "/admin/settings", icon: Settings, roles: ["admin"] },
    ],
  },

  /* ─── Public Resources ─── */
  {
    label: "Public Resources",
    items: [
      
      { title: "Notifications", url: "/notifications", badge: "2", icon: Bell, roles: ["student", "lecturer", "hod", "moderator", "admin", "exam_office"] },
      
    ],
  },
];

interface AppSidebarProps {
  onHelpClick?: () => void;
}

export function AppSidebar({ onHelpClick: _onHelpClick }: AppSidebarProps) {
  const { user, logout } = useAuth();
  const { t } = useLocale();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const [openMenus, setOpenMenus] = React.useState<Record<string, boolean>>({});
  if (!user) return null;

  const isLargeSidebar = ["lecturer", "hod", "exam_office"].includes(user?.role ?? "");

  const linkBaseLarge = "group relative z-10 flex w-full items-center rounded-md px-3 py-3 text-base font-semibold text-slate-700 transition-all hover:bg-slate-100 hover:text-slate-900 border-l-2 border-l-transparent";
  const linkBaseSmall = "group relative z-10 flex w-full items-center rounded-md px-3 py-2 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-100 hover:text-slate-900";

  const linkActive = isLargeSidebar
    ? "bg-gradient-to-r from-[#1d3557] to-[#2b4c7e] text-white hover:from-[#1d3557] hover:to-[#2b4c7e] hover:text-white shadow-sm font-semibold border-l-2 border-l-amber-500"
    : "bg-[#1d3557] text-white hover:bg-[#1d3557] hover:text-white shadow-sm font-black";

  return (
    <Sidebar collapsible="icon" className="z-10 border-r border-slate-200 bg-white font-body">
      <SidebarContent className="bg-transparent">
        {/* Brand header */}
        <div className="border-b border-[#1d3557]/20 px-3 h-9 flex items-center bg-[#1d3557]">
          <div className="flex items-center gap-3">
            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white p-1 shadow-sm">
              <img
                src="/auca_logo1.png"
                alt="AUCA Logo"
                className="h-full w-full object-contain"
              />
            </div>
            {!collapsed && (
              <div>
                <p className="text-[10px] font-semibold leading-tight tracking-tight text-white">AUCA Connect</p>
                <p className="mt-0.5 text-[7px] font-bold uppercase tracking-widest text-blue-300">{t("Archive System")}</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation items */}
        <SidebarGroup className="bg-transparent mt-1">
          <SidebarGroupContent className="px-2">
            <SidebarMenu>
              {navGroups
                .flatMap((group) => group.items)
                .filter((item) => item.roles.includes(user.role))
                .map((item) => {
                  // If item has children, render a collapsible submenu
                  if (item.children && item.children.length > 0) {
                    const key = item.url + item.title;
                    const open = !!openMenus[key];
                    return (
                      <SidebarMenuItem key={key}>
                        <SidebarMenuButton
                          onClick={() => setOpenMenus((s) => ({ ...s, [key]: !s[key] }))}
                          size={isLargeSidebar ? "lg" : "default"}
                          aria-expanded={open}
                        >
                          <div className={(isLargeSidebar || item.roles.includes("student")) ? linkBaseLarge : linkBaseSmall}>
                            <item.icon className={(isLargeSidebar || item.roles.includes("student")) ? "mr-3 !h-[18px] !w-[18px] shrink-0" : "mr-2 h-3.5 w-3.5 shrink-0"} />
                            {!collapsed && <span className="flex-1 truncate">{t(item.title)}</span>}
                          </div>
                        </SidebarMenuButton>

                        {open && (
                          <SidebarMenuSub>
                            {item.children.map((sub) => (
                              <SidebarMenuSubItem key={sub.url + sub.title}>
                                <SidebarMenuSubButton asChild size="md">
                                  <NavLink to={sub.url} className="flex items-center gap-2">
                                    <sub.icon className="!h-4 !w-4" />
                                    {!collapsed && <span className="truncate">{t(sub.title)}</span>}
                                  </NavLink>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        )}
                      </SidebarMenuItem>
                    );
                  }

                  // Regular single-level item
                  return (
                    <SidebarMenuItem key={item.url + item.title}>
                      <SidebarMenuButton asChild size={isLargeSidebar ? "lg" : "default"}>
                        <NavLink
                          to={item.url}
                          end={item.url === "/dashboard"}
                          className={(isLargeSidebar || item.roles.includes("student")) ? linkBaseLarge : linkBaseSmall}
                          activeClassName={linkActive}
                        >
                          <item.icon className={(isLargeSidebar || item.roles.includes("student")) ? "mr-3 !h-[18px] !w-[18px] shrink-0" : "mr-2 h-3.5 w-3.5 shrink-0"} />
                          {!collapsed && <span className="flex-1 truncate">{t(item.title)}</span>}
                          {!collapsed && item.badge && (
                            <div
                              className={(isLargeSidebar || item.roles.includes("student"))
                                ? "ml-auto flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-destructive px-1 text-[9px] font-bold text-destructive-foreground"
                                : "ml-auto flex h-[14px] min-w-[14px] items-center justify-center rounded-full bg-destructive px-1 text-[8px] font-semibold text-destructive-foreground"
                              }
                            >
                              {item.badge}
                            </div>
                          )}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>

      {/* User footer */}
      <SidebarFooter className="border-t border-slate-100 bg-white p-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-[#f0f7ff] border border-blue-100 text-[11px] font-bold text-[#1d3557] shadow-sm">
            {user.avatarInitials}
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-[10px] font-bold text-slate-800">{user.email}</p>
              <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400 mt-0.5">
                {user.role === "hod" ? t("Head of Dept.") : user.role === "moderator" ? t("Librarian") : t(user.role)}
              </p>
            </div>
          )}
          {!collapsed && (
            <button
              type="button"
              onClick={logout}
              className="text-slate-300 transition-colors hover:text-red-500 p-1.5 hover:bg-red-50 rounded-lg"
              aria-label={t("Log out")}
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
