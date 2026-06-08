import { createContext, useContext, useEffect, useState } from "react";
import { Bell, ChevronDown } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { SidebarProvider } from "@/components/ui/sidebar";
import { StudentSidebar } from "@/components/StudentSidebar";
import { StudentDocumentsSubnav } from "@/components/student/StudentDocumentsSubnav";
import { AppSidebar } from "@/components/AppSidebar";
import { loadStoredNotifications } from "@/lib/notifications";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AppLayoutProps {
  children: React.ReactNode;
}

const LayoutContext = createContext(false);

export function AppLayout({ children }: AppLayoutProps) {
  const alreadyInLayout = useContext(LayoutContext);
  if (alreadyInLayout) return <>{children}</>;
  return <LayoutShell>{children}</LayoutShell>;
}

function LayoutShell({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    const checkInitial = () => {
      const stored = loadStoredNotifications().filter((n) => n.userId === user.id);
      if (stored.length === 0) {
        let initial: any[] = [];
        if (user.role === "exam_office") {
          initial = [
            {
              id: "ex-n1",
              userId: user.id,
              type: "approved",
              title: "Exam Paper Moderated by HOD",
              body: "HOD has approved the CS301 final exam paper.",
              read: false,
              createdAt: new Date(Date.now() - 3600000).toISOString(),
            },
          ];
        } else if (user.role === "student" && user.id === "u1") {
          initial = [
            { id: "n1", userId: "u1", type: "approved", title: "Project Approved", body: "Your project 'Smart Parking System using IoT Sensors' has been approved and published.", read: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
            { id: "n2", userId: "u1", type: "reservation", title: "Reservation Confirmed", body: "Reservation confirmed for 'ML Crop Disease Detection' on March 17 at 8:00 AM.", read: false, createdAt: new Date(Date.now() - 7200000).toISOString() },
            { id: "n3", userId: "u1", type: "reminder", title: "Session Reminder", body: "Reminder: Your reserved session starts in 15 minutes for 'ML Crop Disease Detection'.", read: false, createdAt: new Date(Date.now() - 15 * 60000).toISOString() }
          ];
        }
        if (initial.length > 0) {
          const STORAGE_KEY = "auca_notifications_v1";
          const currentAll = (() => {
            try {
              const raw = localStorage.getItem(STORAGE_KEY);
              return raw ? JSON.parse(raw) : [];
            } catch { return []; }
          })();
          localStorage.setItem(STORAGE_KEY, JSON.stringify([...initial, ...currentAll]));
        }
      }
    };
    checkInitial();

    const updateCount = () => {
      const stored = loadStoredNotifications().filter((n) => n.userId === user.id && !n.read);
      setUnreadCount(stored.length);
    };

    updateCount();
    window.addEventListener("storage", updateCount);
    return () => {
      window.removeEventListener("storage", updateCount);
    };
  }, [user]);
  const [headerSearch, setHeaderSearch] = useState("");
  const isStudent = user?.role === "student";
  const showDocsSubnav =
    isStudent && location.pathname.startsWith("/student/documents");

  useEffect(() => {
    if (location.pathname !== "/browse") setHeaderSearch("");
  }, [location.pathname]);

  if (!user) return <>{children}</>;

  if (isStudent) {
    return (
      <LayoutContext.Provider value={true}>
        <div
          className={`ds-app-shell ds-student-layout${showDocsSubnav ? " ds-has-docs-subnav" : ""}`}
        >
          <StudentSidebar />
          <header className="ds-top-navbar ds-top-navbar-student">
            <div className="ds-search-wrap">
              <input
                type="search"
                className="ds-search-input"
                placeholder="Search repository…"
                value={headerSearch}
                onChange={(e) => setHeaderSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key !== "Enter") return;
                  const q = headerSearch.trim();
                  navigate(q ? `/browse?q=${encodeURIComponent(q)}` : "/browse");
                }}
              />
            </div>
            <div className="ds-navbar-right">
              <button
                type="button"
                className="ds-notification-btn"
                onClick={() => navigate("/notifications")}
                aria-label="Notifications"
              >
                <Bell size={20} />
                {unreadCount > 0 && <span className="ds-notification-badge" />}
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button type="button" className="ds-user-menu">
                    <span className="ds-avatar">{user.avatarInitials}</span>
                    <span className="ds-user-name">{user.name}</span>
                    <ChevronDown size={14} className="ds-caret" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate("/student/profile")}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/student/settings")}>
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      logout();
                      navigate("/login");
                    }}
                  >
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <StudentDocumentsSubnav />
          <main className="ds-main-content">{children}</main>
        </div>
      </LayoutContext.Provider>
    );
  }

  return (
    <LayoutContext.Provider value={true}>
      <div className="ds-app-shell">
        <header className="ds-top-navbar">
          <div className="ds-brand">
            <img src="/auca-logo.png" alt="" className="ds-brand-logo" aria-hidden />
            AUCA ARCHIVE
          </div>
          <div className="ds-search-wrap">
            <input
              type="search"
              className="ds-search-input"
              placeholder="SearchGǪ"
              value={headerSearch}
              onChange={(e) => setHeaderSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const q = headerSearch.trim();
                  navigate(q ? `/browse?q=${encodeURIComponent(q)}` : "/browse");
                }
              }}
            />
          </div>
          <div className="ds-navbar-right">
            <button
              type="button"
              className="ds-notification-btn"
              onClick={() => navigate("/notifications")}
              aria-label="Notifications"
            >
              <Bell size={20} />
              {unreadCount > 0 && <span className="ds-notification-badge" />}
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button type="button" className="ds-user-menu">
                  <span className="ds-avatar">{user.avatarInitials}</span>
                  <span className="ds-user-name">{user.name}</span>
                  <ChevronDown size={14} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <SidebarProvider defaultOpen>
          <div className="ds-layout-body">
            <AppSidebar />
            <main className="ds-main-content">
              {children}
            </main>
          </div>
        </SidebarProvider>
      </div>
    </LayoutContext.Provider>
  );
}
