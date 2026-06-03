"use client";

import * as React from "react";
import { Menu, Mail, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link } from "react-router-dom";

/** Navy used across the page (not pure black) */
const navy = {
  DEFAULT: "#152c52",
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

export default function LandingPage() {
  const heroHighlights = [
    "Centralized research repository",
    "Submit and track projects",
    "Search AUCA archives fast",
    "Protect faculty publications",
  ];
  const [activeHighlight, setActiveHighlight] = React.useState(0);

  React.useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveHighlight((current) => (current + 1) % heroHighlights.length);
    }, 3200);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div id="top" className="relative z-10 min-h-screen overflow-x-hidden bg-white font-body text-slate-600 antialiased">
      <header className="sticky top-0 z-50 border-b border-slate-200/90 bg-white">
        <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white shadow-sm">
              <img src="/auca-logo.png" alt="" className="h-8 w-8 object-contain" />
            </div>
            <div className="min-w-0 leading-tight">
              <span className="block truncate text-[13px] font-medium text-slate-800 sm:text-sm">AUCA Connect</span>
              <span className="block truncate text-[11px] text-slate-500">Academic archive &amp; repository</span>
            </div>
          </Link>

          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
            {centerNav.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-semibold text-slate-600 transition-colors hover:text-slate-900"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <span className="hidden rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 md:inline-flex">
              AUCA Connect
            </span>
            <Button
              className="rounded-full border-0 bg-[#152c52] px-6 text-sm font-semibold text-white shadow-sm sm:inline-flex hover:bg-[#122244]"
              asChild
            >
              <Link to="/login" className="hover:opacity-95">
                Register
              </Link>
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-slate-600">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="border-slate-200 bg-white font-body">
                <nav className="mt-10 flex flex-col gap-1">
                  {centerNav.map((item) =>
                    item.href.startsWith("mailto") ? (
                      <a
                        key={item.label}
                        href={item.href}
                        className="rounded-lg px-3 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
                      >
                        {item.label}
                      </a>
                    ) : (
                      <a key={item.label} href={item.href} className="rounded-lg px-3 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50">
                        {item.label}
                      </a>
                    )
                  )}
                  <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4">
                    <Button className="rounded-full bg-[#152c52] text-white hover:bg-[#122244]" asChild>
                      <Link to="/login">Register</Link>
                    </Button>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main>
        <section className="px-4 pb-16 pt-10 sm:px-6 sm:pb-24 sm:pt-14 lg:px-8 lg:pt-16">
          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-10 xl:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="order-2 max-w-xl space-y-7 lg:order-1"
            >
              <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-600">
                Academic archive system
              </div>
              <h1 className="text-[1.75rem] font-bold uppercase leading-[1.1] tracking-[0.14em] text-slate-900 sm:text-[2.2rem] md:text-[2.55rem] lg:text-[2.75rem]">
                AUCA Connect
              </h1>
              <p className="max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
                Academic archive &amp; repository for AUCA’s student research, faculty publications, and institutional knowledge.
              </p>

              <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 shadow-sm">
                <div className="flex items-center justify-between gap-3 text-sm text-slate-600 sm:text-base">
                  <span className="font-semibold text-slate-900">Right now</span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-500 shadow-sm">
                    {heroHighlights[activeHighlight]}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-6 sm:flex-row sm:items-center">
                <Button
                  size="lg"
                  className="rounded-full border-0 bg-[#152c52] px-8 text-[15px] font-semibold text-white shadow-xl shadow-[#152c52]/15 hover:bg-[#122244]"
                  asChild
                >
                  <Link to="/login">Register</Link>
                </Button>
                <div className="text-sm text-slate-500">
                  <span className="font-semibold text-slate-900">Built for AUCA research workflows</span>
                </div>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl border border-slate-200 bg-white p-5 text-sm text-slate-700 shadow-md shadow-slate-100">
                  <p className="font-semibold text-slate-900">Structured submissions</p>
                  <p className="mt-2 text-[13px] leading-relaxed text-slate-600">Keep academic work organized with submission stages, approvals, and archive history.</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-white p-5 text-sm text-slate-700 shadow-md shadow-slate-100">
                  <p className="font-semibold text-slate-900">Fast discovery</p>
                  <p className="mt-2 text-[13px] leading-relaxed text-slate-600">Search across projects, theses, and publications with cleaner results and filters.</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-white p-5 text-sm text-slate-700 shadow-md shadow-slate-100">
                  <p className="font-semibold text-slate-900">Protected access</p>
                  <p className="mt-2 text-[13px] leading-relaxed text-slate-600">Ensure only AUCA members and authorized partners can view confidential research.</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.06, ease: "easeOut" }}
              className="order-1 flex justify-center lg:order-2 lg:justify-end"
            >
              <div className="relative w-full max-w-md lg:max-w-none">
                <div
                  className="absolute inset-0 -z-10 scale-105 rounded-[2rem] blur-3xl"
                  style={{ background: `radial-gradient(ellipse at center, ${navy.line}, transparent 65%)` }}
                />
                <div className="absolute right-0 top-0 z-20 hidden h-28 w-28 rounded-full bg-white/80 blur-3xl sm:block" />
                <NetworkGraphic />
              </div>
            </motion.div>
          </div>
        </section>

        <section id="about" className="border-t border-slate-100 bg-white px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm leading-relaxed text-slate-500">
              AUCA Connect supports the university&apos;s mission by keeping theses, projects, and publications organized under one institutional archive — so knowledge stays findable
              for students, staff, and partners.
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-100 bg-white px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-center text-xs text-slate-500 sm:flex-row sm:text-left">
          <span>© {new Date().getFullYear()} Adventist University of Central Africa · AUCA Connect</span>
          <a href="mailto:support@auca.ac.rw" className="inline-flex items-center gap-2 font-medium transition-colors hover:text-slate-800">
            <Mail className="h-3.5 w-3.5 opacity-70" />
            support@auca.ac.rw
          </a>
        </div>
      </footer>
    </div>
  );
}
