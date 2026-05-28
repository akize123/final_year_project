import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Home, LayoutDashboard, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocale } from "@/contexts/LocaleContext";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLocale();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] p-6">
      <Card className="w-full max-w-xl border-slate-200 shadow-sm">
        <CardContent className="p-8">
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1d3557] text-white shadow-sm">
              <Search className="h-7 w-7" />
            </div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900">404</h1>
            <p className="mt-2 text-lg font-semibold text-slate-700">{t("Page not found")}</p>
            <p className="mt-3 text-[13px] leading-relaxed text-slate-500">
              {t("We couldn’t find the page you were looking for.")}{" "}
              <span className="font-mono text-slate-600">{location.pathname}</span>
            </p>

            <div className="mt-7 flex flex-col sm:flex-row gap-2 justify-center">
              <Button
                className="bg-[#1d3557] hover:bg-[#2c4e7d]"
                onClick={() => navigate("/dashboard")}
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                {t("Go to dashboard")}
              </Button>
              <Button variant="outline" className="border-slate-200" onClick={() => navigate("/")}>
                <Home className="mr-2 h-4 w-4" />
                {t("Return to Home")}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
