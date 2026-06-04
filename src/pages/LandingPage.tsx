"use client";

import * as React from "react";
import { Menu, ArrowRight, Shield, BookOpen } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link } from "react-router-dom";

/** Navy used across the page */
const navy = {
  DEFAULT: "#152c52",
  light: "#1e3f75",
  line: "rgb(21 44 82 / 0.35)",
};

const centerNav = [
  { label: "Home", href: "#top" },
  { label: "About", href: "#about" },
];

/** Abstract network — thin navy lines, soft node glows */
function NetworkGraphic() {
  const nodes = React.useMemo(
    () =>
      [
        { x: 200, y: 55 },
        { x: 105, y: 118 },
        { x: 295, y: 108 },
        { x: 58, y: 218 },
        { x: 200, y: 175 },
        { x: 342, y: 205 },
        { x: 130, y: 298 },
        { x: 268, y: 285 },
        { x: 200, y: 345 },
      ] as const,
    []
  );

  const edges: [number, number][] = [
    [0, 1],
    [0, 2],
    [1, 3],
    [1, 4],
    [2, 4],
    [2, 5],
    [3, 4],
    [4, 6],
    [4, 7],
    [5, 7],
    [6, 8],
    [7, 8],
    [3, 6],
  ];

  return (
    <div className="relative flex min-h-[280px] w-full items-center justify-center sm:min-h-[360px] lg:min-h-[420px]">
      <svg
        viewBox="0 0 400 400"
        className="h-full w-full max-w-[min(100%,420px)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <defs>
          <filter id="nodeGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="lineFade" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={navy.DEFAULT} stopOpacity="0.15" />
            <stop offset="50%" stopColor={navy.DEFAULT} stopOpacity="0.45" />
            <stop offset="100%" stopColor={navy.DEFAULT} stopOpacity="0.15" />
          </linearGradient>
        </defs>

        {edges.map(([a, b], i) => {
          const A = nodes[a];
          const B = nodes[b];
          return (
            <motion.line
              key={i}
              x1={A.x}
              y1={A.y}
              x2={B.x}
              y2={B.y}
              stroke="url(#lineFade)"
              strokeWidth={1.25}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.15 + i * 0.03, ease: "easeOut" }}
            />
          );
        })}

        {nodes.map((n, i) => (
          <g key={i} filter="url(#nodeGlow)">
            <circle cx={n.x} cy={n.y} r={10} fill="white" stroke={navy.DEFAULT} strokeWidth={1.5} opacity={0.95} />
            <motion.circle
              cx={n.x}
              cy={n.y}
              r={3.5}
              fill={navy.DEFAULT}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: [0.45, 1, 0.45] }}
              transition={{ duration: 2.5 + i * 0.2, repeat: Infinity, ease: "easeInOut" }}
            />
          </g>
        ))}
      </svg>
    </div>
  );
}

// Fade up animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
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

export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);

  return (
    <div id="top" className="relative min-h-screen overflow-hidden bg-slate-50 font-body text-slate-600 antialiased selection:bg-[#152c52]/10 selection:text-[#152c52]">
      {/* Background Gradients */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-[20%] left-[10%] h-[600px] w-[600px] rounded-full bg-blue-100/40 blur-[100px]" />
        <div className="absolute top-[10%] right-[5%] h-[500px] w-[500px] rounded-full bg-indigo-100/40 blur-[100px]" />
        <div className="absolute top-[60%] left-[50%] h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-[#152c52]/5 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      <header className="sticky top-0 z-50 border-b border-slate-200/50 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex min-w-0 items-center gap-3">
            <motion.div 
              whileHover={{ rotate: 5, scale: 1.05 }}
              className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white shadow-sm"
            >
              <img src="/auca-logo.png" alt="AUCA Logo" className="h-8 w-8 object-contain" />
            </motion.div>
            <div className="min-w-0 leading-tight">
              <span className="block truncate text-[14px] font-bold text-slate-900 sm:text-base">AUCA Connect</span>
              <span className="block truncate text-[11px] font-medium text-slate-500">Publication Hub</span>
            </div>
          </Link>

          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
            {centerNav.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="group relative text-sm font-semibold text-slate-500 transition-colors hover:text-[#152c52]"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 rounded-full bg-[#152c52] transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-3">
            <Button
              className="group relative overflow-hidden rounded-full border-0 bg-[#152c52] px-6 text-sm font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg sm:inline-flex"
              asChild
            >
              <Link to="/login">
                <span className="relative z-10 flex items-center gap-2">
                  Get Started
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:animate-shimmer" />
              </Link>
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-slate-600 hover:bg-slate-100 rounded-full">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="border-slate-200 bg-white/95 backdrop-blur-xl font-body">
                <nav className="mt-10 flex flex-col gap-2">
                  {centerNav.map((item) => (
                    <a key={item.label} href={item.href} className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-[#152c52] transition-colors">
                      {item.label}
                    </a>
                  ))}
                  <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-6">
                    <Button className="rounded-full bg-[#152c52] py-6 text-white hover:bg-[#122244] shadow-md" asChild>
                      <Link to="/login">Get Started Free</Link>
                    </Button>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main>
        {/* HERO SECTION */}
        <section className="relative px-4 pb-20 pt-16 sm:px-6 sm:pb-28 sm:pt-20 lg:px-8 lg:pt-24 min-h-[90vh] flex items-center">
          <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="order-2 max-w-2xl space-y-8 lg:order-1 relative z-10"
            >
              <div className="flex w-full justify-center lg:justify-start">
                <motion.div variants={fadeInUp} className="inline-flex items-center gap-2.5 rounded-full border border-blue-200/80 bg-gradient-to-r from-blue-50/90 to-indigo-50/90 px-5 py-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-800 backdrop-blur-sm shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300 cursor-default">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
                  </span>
                  AUCA Academic Repository
                </motion.div>
              </div>
              
              <motion.h1 variants={fadeInUp} className="text-[2.25rem] font-extrabold leading-[1.05] tracking-tight text-slate-900 sm:text-[3rem] md:text-[3.5rem] lg:text-[4rem]">
                Preserving Knowledge.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#152c52] to-blue-600">
                  Enabling Discovery.
                </span>
              </motion.h1>
              
              <motion.p variants={fadeInUp} className="max-w-xl text-lg leading-relaxed text-slate-600 sm:text-xl font-medium">
                The official platform for AUCA students, lecturers, and researchers to publish, manage, and share academic work.
              </motion.p>

              <motion.div variants={fadeInUp} className="flex flex-col gap-4 pt-4 sm:flex-row sm:items-center">
                <Button
                  size="lg"
                  className="rounded-full border-0 bg-[#152c52] px-8 h-14 text-base font-bold text-white shadow-xl shadow-[#152c52]/20 hover:bg-[#122244] hover:-translate-y-1 transition-all"
                  asChild
                >
                  <Link to="/login">Start Publishing</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full px-8 h-14 text-base font-bold border-slate-300 text-slate-700 bg-white/50 backdrop-blur-sm hover:bg-slate-100 hover:text-slate-900 hover:-translate-y-1 transition-all"
                  asChild
                >
                  <a href="#how-it-works">Explore Features</a>
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="order-1 flex justify-center lg:order-2 lg:justify-end relative"
            >
              <div className="relative w-full max-w-lg lg:max-w-none perspective-[1000px]">
                {/* Glowing orb behind network */}
                <div
                  className="absolute inset-0 -z-10 scale-110 rounded-full blur-[80px] opacity-70 animate-pulse"
                  style={{ background: `radial-gradient(circle at center, ${navy.line}, transparent 70%)` }}
                />
                
                {/* Floating glass card effect containing the network graphic */}
                <motion.div 
                  style={{ y }}
                  className="relative rounded-[2.5rem] border border-white/40 bg-white/20 p-8 backdrop-blur-xl shadow-2xl shadow-blue-900/10"
                >
                  <div className="absolute inset-0 rounded-[2.5rem] border border-white/50 bg-gradient-to-br from-white/40 to-white/10" />
                  <NetworkGraphic />
                </motion.div>

                {/* Floating decorative elements */}
                <motion.div 
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-6 -right-6 rounded-2xl bg-white p-4 shadow-xl border border-slate-100 hidden sm:block"
                >
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </motion.div>
                <motion.div 
                  animate={{ y: [10, -10, 10] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute -bottom-8 -left-4 rounded-2xl bg-white p-4 shadow-xl border border-slate-100 hidden sm:block"
                >
                  <Shield className="h-6 w-6 text-emerald-500" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* STATS SECTION */}
        <section className="relative z-20 border-y border-slate-200/50 bg-white py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-12">
              {[
                { label: "Publications Indexed", value: "1,240+" },
                { label: "Active Researchers", value: "340+" },
                { label: "Academic Departments", value: "48" },
                { label: "Years of Excellence", value: "12" },
              ].map((stat, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="text-center"
                >
                  <div className="text-3xl font-extrabold text-[#152c52] md:text-4xl lg:text-5xl">{stat.value}</div>
                  <div className="mt-2 text-sm font-semibold uppercase tracking-wider text-slate-500">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section id="how-it-works" className="py-24 bg-slate-100/50 border-t border-slate-200/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <span className="inline-flex rounded-full bg-slate-200/60 px-4 py-1.5 text-sm font-bold text-slate-700 tracking-wide mb-4">
                Simple Process
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">From research to publication</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-12 relative">
              {/* Connecting Line (desktop only) */}
              <div className="hidden md:block absolute top-8 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />

              {[
                { step: "1", title: "Create your account", desc: "Sign up with your AUCA campus email and set up your researcher profile in minutes." },
                { step: "2", title: "Submit your research", desc: "Upload your paper or thesis, add metadata, and submit it through our structured review pipeline." },
                { step: "3", title: "Get published & cited", desc: "Your work goes live in the AUCA institutional archive, indexed and discoverable by the community." }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className="relative text-center z-10"
                >
                  <div className="w-16 h-16 mx-auto bg-[#152c52] rounded-full flex items-center justify-center text-2xl font-bold text-white mb-6 shadow-xl ring-8 ring-slate-100/50">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-slate-600 font-medium leading-relaxed max-w-xs mx-auto">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[#152c52]">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
            <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 rounded-full bg-blue-500/20 blur-[100px]" />
            <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-96 h-96 rounded-full bg-indigo-500/20 blur-[100px]" />
          </div>
          
          <div className="relative mx-auto max-w-4xl text-center z-10">
            <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl mb-6">
              Ready to share your research <br className="hidden sm:block"/>with the world?
            </h2>
            <p className="text-xl text-blue-100/80 mb-10 font-medium max-w-2xl mx-auto">
              Join 340+ AUCA researchers already publishing on the platform. Your knowledge deserves to be discovered.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="rounded-full bg-white text-[#152c52] hover:bg-slate-50 h-14 px-8 text-base font-bold shadow-xl transition-all hover:scale-105" asChild>
                <Link to="/login">Get Started Free</Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full border-white/30 text-white bg-white/5 hover:bg-white/10 h-14 px-8 text-base font-bold transition-all" asChild>
                <a href="mailto:support@auca.ac.rw">Contact Support</a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer id="about" className="bg-slate-900 py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 p-2">
                <img src="/auca-logo.png" alt="AUCA Logo" className="h-full w-full object-contain brightness-0 invert" />
              </div>
              <div>
                <span className="block text-lg font-bold text-white">AUCA Connect</span>
                <span className="block text-sm text-slate-400">Publication Hub</span>
              </div>
            </Link>
            <p className="text-slate-400 max-w-sm font-medium leading-relaxed">
              Supporting the university's mission by keeping theses, projects, and publications organized under one institutional archive.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Platform</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors font-medium text-sm">Browse Publications</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors font-medium text-sm">Submit Research</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors font-medium text-sm">Thesis Repository</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Support</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors font-medium text-sm">Help Center</a></li>
              <li><a href="mailto:support@auca.ac.rw" className="text-slate-400 hover:text-white transition-colors font-medium text-sm">Contact Us</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors font-medium text-sm">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mx-auto max-w-7xl pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-sm font-medium text-slate-500">
          <span>© {new Date().getFullYear()} Adventist University of Central Africa</span>
          <span className="flex items-center gap-2">Built for AUCA researchers</span>
        </div>
      </footer>
    </div>
  );
}
