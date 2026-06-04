import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, Mail, Lock, ArrowRight, ArrowLeft } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

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
    <div className="h-screen w-full flex font-sans overflow-hidden bg-slate-50 selection:bg-[#152c52]/10 selection:text-[#152c52]">
      {/* Left Side - Login Form (40%) */}
      <div className="flex-[0.4] min-w-[400px] flex flex-col justify-center p-8 lg:p-12 relative z-10 bg-white shadow-2xl">
        <Link 
          to="/" 
          className="absolute top-8 left-8 flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#152c52] transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Home
        </Link>

        <motion.div 
          className="w-full max-w-sm mx-auto space-y-10"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="flex flex-col items-center">
            <div className="h-20 w-20 rounded-full border border-slate-100 bg-white shadow-sm flex items-center justify-center p-2 mb-6">
              <img
                src="/auca_logo1.png"
                alt="AUCA Logo"
                className="h-full w-full object-contain"
              />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight text-center">{t("Welcome Back")}</h1>
            <p className="text-slate-500 mt-2 text-sm font-medium text-center">Sign in to access the Academic Hub</p>
          </motion.div>

          <motion.form variants={fadeInUp} onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-slate-700">Academic identity / Faculty code</Label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-[#152c52] transition-colors" />
                <Input
                  id="email"
                  type="text"
                  inputMode="email"
                  autoComplete="email"
                  placeholder={t("name@auca.ac.rw")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-14 pl-12 border-slate-200 bg-slate-50/50 font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-[#152c52]/20 focus:border-[#152c52] rounded-xl shadow-sm transition-all"
                  required
                />
              </div>
            </div>
 
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-slate-700">{t("Secure password")}</Label>
                <button type="button" className="text-xs font-bold text-slate-500 hover:text-[#152c52] transition-colors">{t("Forgot access?")}</button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-[#152c52] transition-colors" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-14 pl-12 pr-12 border-slate-200 bg-slate-50/50 font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-[#152c52]/20 focus:border-[#152c52] rounded-xl shadow-sm transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#152c52] transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
 
            <Button
              type="submit"
              className="h-14 w-full bg-[#152c52] hover:bg-[#122244] text-white text-[13px] font-bold uppercase tracking-widest rounded-xl shadow-lg shadow-[#152c52]/20 transition-all hover:-translate-y-0.5 active:scale-95 group"
              disabled={verifying}
            >
              {verifying ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <div className="flex items-center justify-center gap-2">
                  {t("Access Portal")}
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </Button>
          </motion.form>
        </motion.div>
      </div>

      {/* Right Side - Photo (60%) */}
      <div className="hidden lg:block flex-[0.6] relative overflow-hidden bg-[#152c52]">
        <div className="absolute inset-0 bg-[#152c52]/40 z-10 mix-blend-multiply" />
        
        {/* Soft glowing orb on top of image */}
        <div className="absolute top-[20%] right-[20%] w-[500px] h-[500px] bg-blue-400/30 blur-[120px] rounded-full z-20 pointer-events-none mix-blend-screen" />
        
        {/* Glassmorphic overlay card describing the portal */}
        <motion.div 
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="absolute bottom-16 left-16 right-16 z-30 rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur-xl shadow-2xl"
        >
          <h2 className="text-3xl font-extrabold text-white mb-3">Academic Excellence</h2>
          <p className="text-white/80 font-medium text-lg leading-relaxed max-w-xl">
            A secure gateway to manage your research, submit projects, and access the institutional archive. Built exclusively for the AUCA community.
          </p>
        </motion.div>

        {/* The existing image */}
        <img
          src="/images/auca1.jpg"
          alt="AUCA Campus"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
      </div>
    </div>
  );
};

export default LoginPage;
