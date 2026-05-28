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
  { label: "Contact", href: "mailto:support@auca.ac.rw" },
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

          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-10 md:flex">
            {centerNav.map((item) =>
              item.href.startsWith("http") || item.href.startsWith("mailto") ? (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-800"
                >
                  {item.label}
                </a>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-800"
                >
                  {item.label}
                </a>
              )
            )}
          </nav>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Button
              variant="outline"
              className="hidden rounded-full border-slate-300 bg-white px-5 text-sm font-medium text-[#152c52] shadow-none hover:bg-slate-50 sm:inline-flex"
              asChild
            >
              <Link to="/login">Register</Link>
            </Button>
            <Button
              className="hidden rounded-full border-0 px-6 text-sm font-medium text-white shadow-sm sm:inline-flex"
              style={{ backgroundColor: navy.DEFAULT }}
              asChild
            >
              <Link to="/login" className="hover:opacity-95">
                Sign in
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
                  <div className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-4">
                    <Button variant="outline" className="rounded-full border-slate-300" asChild>
                      <Link to="/login">Register</Link>
                    </Button>
                    <Button className="rounded-full text-white" style={{ backgroundColor: navy.DEFAULT }} asChild>
                      <Link to="/login">Sign in</Link>
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
              <h1 className="text-[1.35rem] font-medium uppercase leading-[1.35] tracking-[0.06em] text-slate-800 sm:text-2xl sm:leading-tight md:text-[1.75rem] lg:text-[1.85rem]">
                A centralized academic archive system for collecting, preserving, and sharing AUCA research.
              </h1>
              <div className="h-1 w-14 rounded-full" style={{ backgroundColor: navy.DEFAULT }} />
              <p className="max-w-md text-sm leading-relaxed text-slate-500 sm:text-[15px]">
                One place for students and faculty to submit work, follow review, and explore what AUCA has already published — clear, searchable, and kept for the long term.
              </p>
              <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center">
                <Button
                  size="lg"
                  className="rounded-full border-0 px-8 text-[15px] font-medium text-white shadow-md"
                  style={{ backgroundColor: navy.DEFAULT }}
                  asChild
                >
                  <Link to="/login">
                    Get started
                    <ArrowRight className="ml-2 h-4 w-4 opacity-90" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-slate-300 bg-white px-8 text-[15px] font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                  asChild
                >
                  <Link to="/browse">Learn more</Link>
                </Button>
              </div>
              <p className="text-xs text-slate-400">Campus sign-in required for repository access.</p>
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
