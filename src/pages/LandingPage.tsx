"use client";

import * as React from "react";
import { Menu, Mail, ArrowRight, BookOpen, Users, FileText, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link } from "react-router-dom";

const centerNav = [
  { label: "Features", href: "#features" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "mailto:support@auca.ac.rw" },
];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-white font-body text-slate-600 antialiased">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <div className="hidden sm:block leading-tight">
              <span className="block text-sm font-semibold text-slate-900">AUCA Connect</span>
              <span className="block text-xs text-slate-500">Academic Archive</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {centerNav.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="hidden sm:inline-flex text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              asChild
            >
              <Link to="/login">Sign in</Link>
            </Button>
            <Button
              size="sm"
              className="hidden sm:inline-flex bg-slate-900 hover:bg-slate-800 text-white"
              asChild
            >
              <Link to="/login">Get started</Link>
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-white">
                <nav className="mt-8 flex flex-col gap-4">
                  {centerNav.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      className="text-sm font-medium text-slate-600 hover:text-slate-900"
                    >
                      {item.label}
                    </a>
                  ))}
                  <div className="mt-6 flex flex-col gap-2 border-t border-slate-200 pt-4">
                    <Button variant="outline" asChild>
                      <Link to="/login">Sign in</Link>
                    </Button>
                    <Button className="bg-slate-900 hover:bg-slate-800" asChild>
                      <Link to="/login">Get started</Link>
                    </Button>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="px-4 py-16 sm:py-24 lg:py-32 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <span className="inline-block text-xs font-semibold tracking-widest text-slate-500 uppercase mb-4">University Archive System</span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 mb-6">
                A unified home for academic work
              </h1>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-2xl mx-auto">
                AUCA Connect centralizes theses, research projects, and publications in one secure, searchable repository. Submit with confidence, discover with ease.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  size="lg"
                  className="bg-slate-900 hover:bg-slate-800 text-white"
                  asChild
                >
                  <Link to="/login" className="gap-2">
                    Get started
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-slate-300 text-slate-900 hover:bg-slate-50"
                  asChild
                >
                  <Link to="/browse">Explore archive</Link>
                </Button>
              </div>
              <p className="text-sm text-slate-500 mt-6">Campus authentication required</p>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="border-t border-slate-100 px-4 py-16 sm:py-24 lg:py-32 lg:px-8 bg-slate-50">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Designed for academic excellence</h2>
              <p className="text-lg text-slate-600">Everything you need to manage and discover scholarly work</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: FileText,
                  title: "Submit Work",
                  description: "Upload theses, projects, and publications with comprehensive metadata."
                },
                {
                  icon: CheckCircle2,
                  title: "Track Status",
                  description: "Monitor submissions through review and approval processes in real time."
                },
                {
                  icon: Users,
                  title: "Collaborate",
                  description: "Manage co-authors and supervisory relationships seamlessly."
                },
                {
                  icon: BookOpen,
                  title: "Discover",
                  description: "Search and explore the full institutional academic archive."
                }
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="rounded-lg border border-slate-200 bg-white p-6 hover:border-slate-300 transition-colors"
                >
                  <feature.icon className="h-6 w-6 text-slate-900 mb-4" />
                  <h3 className="font-semibold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="px-4 py-16 sm:py-24 lg:py-32 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6">Supporting scholarly endeavors</h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-8">
              AUCA Connect preserves institutional knowledge and makes it accessible. From student research to faculty publications, every contribution strengthens our academic community and creates a lasting record of scholarly achievement.
            </p>
            <div className="space-y-3 text-slate-600">
              <p className="flex items-center justify-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-slate-900" />
                <span>Secure, long-term preservation of academic work</span>
              </p>
              <p className="flex items-center justify-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-slate-900" />
                <span>Simple metadata and institutional standards</span>
              </p>
              <p className="flex items-center justify-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-slate-900" />
                <span>Accessible discovery and research support</span>
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-600">
            <span>© {new Date().getFullYear()} Adventist University of Central Africa</span>
            <a href="mailto:support@auca.ac.rw" className="flex items-center gap-2 hover:text-slate-900 transition-colors">
              <Mail className="h-4 w-4" />
              support@auca.ac.rw
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
