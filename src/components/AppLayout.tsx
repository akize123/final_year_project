import { useEffect, useState, createContext, useContext } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useNavigate, useLocation } from "react-router-dom";
import { Bell, Search, HelpCircle, Globe, LogOut } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

// Prevent double-wrapping when pages still import AppLayout directly
const LayoutContext = createContext(false);

export function AppLayout({ children, title: manualTitle, subtitle: manualSubtitle }: AppLayoutProps) {
  const alreadyInLayout = useContext(LayoutContext);
  if (alreadyInLayout) return <>{children}</>;
  return <LayoutShell>{children}</LayoutShell>;
}

function LayoutShell({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { locale, setLocale, t } = useLocale();
  const { logout } = useAuth();
  const [headerSearch, setHeaderSearch] = useState("");

  useEffect(() => {
    // Clear the header search when navigating away from browse.
    if (location.pathname !== "/browse") setHeaderSearch("");
  }, [location.pathname]);

  return (
    <LayoutContext.Provider value={true}>
      <SidebarProvider defaultOpen={true}>
        <div className="relative flex min-h-screen w-full font-sans bg-[#f8fafc]">
          <AppSidebar />

          <main className="flex-1 flex flex-col min-w-0">
            {/* ── Sticky Header ── */}
            <header className="sticky top-0 z-40 w-full bg-[#1d3557] shadow-md">
              <div className="flex h-9 items-center justify-between px-3">

                {/* Brand identity (Left) */}
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex flex-col">
                    <h1 className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-white leading-tight">
                      AUCA Connect
                    </h1>
                    <p className="text-[7px] font-bold uppercase tracking-[0.25em] text-blue-300/80 leading-tight">
                      {t("Archive System")}
                    </p>
                  </div>
                </div>

                {/* Utility Controls (Center) */}
                <div className="hidden lg:flex items-center justify-center gap-4 flex-1 px-4">
                  
                  {/* Logout */}
                  <button
                    onClick={() => {
                      logout();
                      navigate("/login");
                    }}
                    title={t("Logout")}
                    className="group relative flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-xl transition-all duration-300 text-white/40 hover:text-white hover:bg-white/5"
                  >
                    <LogOut className="h-[16px] w-[16px] transition-transform group-hover:scale-110" />
                    <span className="text-[7px] font-bold uppercase tracking-widest leading-none opacity-80 group-hover:opacity-100">{t("Logout")}</span>
                  </button>
                </div>

                {/* Search & Actions (Right) */}
                <div className="flex items-center justify-end gap-3 flex-1">

                  {/* Desktop Search bar */}
                  <div className="hidden md:flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-xl px-2.5 py-0.5 transition-all hover:bg-white/10 hover:border-white/20 shadow-inner group w-full max-w-[200px]">
                    <Search className="h-[13px] w-[13px] text-white/40 group-hover:text-white/60 transition-colors" />
                    <input
                      type="text"
                      value={headerSearch}
                      onChange={(e) => setHeaderSearch(e.target.value)}
                      placeholder={t("Search repository...")}
                      className="bg-transparent border-none text-[9px] font-bold text-white placeholder:text-white/30 focus:outline-none w-full"
                      onKeyDown={(e) => {
                        if (e.key !== "Enter") return;
                        const q = headerSearch.trim();
                        navigate(q ? `/browse?q=${encodeURIComponent(q)}` : "/browse");
                      }}
                    />
                  </div>

                  {/* Mobile utilities icon */}
                  <div className="flex lg:hidden items-center gap-1">
                    <button
                      onClick={() => navigate("/browse")}
                      className="p-1 text-white/60 hover:text-white transition-all"
                    >
                      <Search className="h-[18px] w-[18px]" />
                    </button>
                    <button
                      onClick={() => navigate("/notifications")}
                      className="p-1 text-white/60 hover:text-white transition-all relative"
                    >
                      <Bell className="h-[18px] w-[18px]" />
                      <span className="absolute top-1 right-1 h-1.5 w-1.5 bg-red-500 rounded-full" />
                    </button>
                  </div>

                </div>
              </div>
            </header>

            {/* Page content */}
            <div className="flex-1 p-5 animate-in fade-in slide-in-from-bottom-2 duration-500 transition-all">
              {children}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </LayoutContext.Provider>
  );
}
