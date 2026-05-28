import { AlertTriangle, Home, RotateCcw } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocale } from "@/contexts/LocaleContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";

function ErrorFallback({ reset }: { error: unknown; reset: () => void }) {
  const navigate = useNavigate();
  const { t } = useLocale();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] p-6">
      <Card className="w-full max-w-lg border-slate-200 shadow-sm">
        <CardContent className="p-8 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 border border-amber-100">
            <AlertTriangle className="h-7 w-7" />
          </div>
          <h1 className="text-xl font-bold text-slate-800">{t("Something went wrong.")}</h1>
          <p className="mt-2 text-[13px] leading-relaxed text-slate-500">
            {t("An unexpected error occurred while rendering this page. You can try again or go back to safety.")}
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-2 justify-center">
            <Button
              variant="outline"
              className="border-slate-200"
              onClick={() => {
                reset();
              }}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              {t("Try again")}
            </Button>
            <Button
              className="bg-[#1d3557] hover:bg-[#2c4e7d]"
              onClick={() => {
                reset();
                navigate("/dashboard");
              }}
            >
              <Home className="mr-2 h-4 w-4" />
              {t("Go to dashboard")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function AppErrorBoundary({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <ErrorBoundary
      resetKey={location.pathname + location.search}
      fallback={({ error, reset }) => <ErrorFallback error={error} reset={reset} />}
    >
      {children}
    </ErrorBoundary>
  );
}

