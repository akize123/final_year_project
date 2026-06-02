import { createContext, useContext, useEffect, useState } from "react";
import { Bell, ChevronDown } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { SidebarProvider } from "@/components/ui/sidebar";
import { StudentSidebar } from "@/components/StudentSidebar";
import { AppSidebar } from "@/components/AppSidebar";
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
  const [headerSearch, setHeaderSearch] = useState("");
  const isStudent = user?.role === "student";

  useEffect(() => {
    if (location.pathname !== "/browse") setHeaderSearch("");
  }, [location.pathname]);

  if (!user) return <>{children}</>;

  if (isStudent) {
    return (
      <LayoutContext.Provider value={true}>
        <div className="ds-app-shell ds-student-layout">
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
                <span className="ds-notification-badge" />
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
              placeholder="Search…"
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
            <main className="ds-main-content" style={{ marginLeft: "var(--sidebar-width, 16rem)" }}>
              {children}
            </main>
          </div>
        </SidebarProvider>
      </div>
    </LayoutContext.Provider>
  );
}
