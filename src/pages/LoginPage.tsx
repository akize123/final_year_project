import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, Mail, Lock, ArrowRight, Sparkles } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";

// Simplified login form with credential-based role selection

const LoginPage = () => {
  const { login } = useAuth();
  const { toast } = useToast();
  const { t } = useLocale();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setVerifying(true);
    try {
      await login(email, password || "any");
      toast({ title: t("Welcome back!"), description: t("Accessing your departmental dashboard...") });
      navigate("/dashboard", { replace: true });
    } catch {
      toast({ title: t("Authentication Failed"), description: t("Please check your credentials."), variant: "destructive" });
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="h-screen w-full flex font-sans overflow-hidden bg-white">
      {/* Left Side - Login Form (40%) - Clear/White Theme */}
      <div className="flex-[0.4] flex flex-col items-center justify-center p-8 lg:p-12 relative z-10 bg-white border-r border-slate-100 shadow-xl">
        <div className="w-full max-w-sm space-y-10">

          {/* AUCA Logo Container - Centered and Smaller */}
          <div className="auca-logo-container flex flex-col items-center">
            <img
              src="/auca_logo1.png"
              alt="AUCA Logo"
              className="h-20 w-auto object-contain"
            />
          </div>

          <div className="space-y-2 text-center">
            <h1 className="text-5xl font-medium text-slate-800 tracking-tight">{t("Login")}</h1>
          </div>

          {/* Form remains clean, role selector removed as requested */}


          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-bold tracking-wide text-slate-900">{t("Academic identity / Faculty code")}</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="email"
                  type="text"
                  inputMode="email"
                  autoComplete="email"
                  placeholder={t("name@auca.ac.rw")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 pl-12 border-slate-200 font-normal text-slate-700 placeholder:text-slate-300 focus:ring-[#1d3557] focus:border-[#1d3557] rounded-xl shadow-sm"
                  required
                />
              </div>
            </div>
 
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-bold tracking-wide text-slate-900">{t("Secure password")}</Label>
                <button type="button" className="text-sm font-bold text-slate-900 hover:underline tracking-wide">{t("Forgot access?")}</button>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 pl-12 pr-12 border-slate-200 font-normal text-slate-700 placeholder:text-slate-300 focus:ring-[#1d3557] focus:border-[#1d3557] rounded-xl shadow-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
 
 
            <Button
              type="submit"
              className="h-14 w-full bg-[#1d3557] hover:bg-[#2c4e7d] text-white text-[13px] font-bold uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-[#1d3557]/20 transition-all active:scale-95 group"
              disabled={verifying}
            >
              {verifying ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <div className="flex items-center justify-center gap-3">
                  {t("Access Portal")}
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
                </div>
              )}
            </Button>
          </form>

          <div className="text-center space-y-4">
          </div>
        </div>
      </div>

      {/* Right Side - Photo (60%) */}
      <div className="hidden lg:block flex-[0.6] relative overflow-hidden bg-[#1d3557]">
        {/* Blurred Background Layer to fill all sides */}
        <div className="absolute inset-0 bg-[url('/images/auca1.jpg')] bg-cover bg-center blur-3xl opacity-30 scale-125 animate-pulse" />

        {/* Cloud/Gradient Overlay at bottom only for smooth blending */}
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#1d3557] to-transparent z-20 opacity-60" />

        {/* Sharp Full Image - Filling the entire panel top-to-bottom */}
        <img
          src="/images/auca1.jpg"
          alt="AUCA Campus"
          className="absolute inset-0 w-full h-full object-cover relative z-10"
        />
      </div>

      {/* Floating Sparkle for Visual Premium feel */}
      <div className="fixed bottom-8 right-8 h-12 w-12 bg-[#1d3557] rounded-full flex items-center justify-center text-white shadow-2xl animate-bounce">
        <Sparkles className="h-5 w-5" />
      </div>
    </div>
  );
};

export default LoginPage;
