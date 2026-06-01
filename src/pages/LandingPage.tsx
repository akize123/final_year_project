"use client";

import * as React from "react";
import { Menu, Mail, ArrowRight, BookOpen, Users, FileText, CheckCircle2, TrendingUp, Award } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link } from "react-router-dom";

const centerNav = [
  { label: "Research", href: "#statistics" },
  { label: "Publications", href: "#publications" },
  { label: "About", href: "#about" },
];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-white font-body text-slate-600 antialiased">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-blue-100 bg-white/98 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/auca-logo.png" alt="AUCA Logo" className="h-10 w-10 object-contain" />
            <div className="hidden sm:block leading-tight">
              <span className="block text-sm font-semibold text-blue-900">AUCA Connect</span>
              <span className="block text-xs text-amber-600 font-medium">Research Portal</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-10">
            {centerNav.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-blue-900 transition-colors hover:text-amber-600 relative group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-500 transition-all group-hover:w-full" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Button
              size="sm"
              className="hidden sm:inline-flex bg-blue-900 hover:bg-blue-800 text-white"
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
                      className="text-sm font-medium text-blue-900 hover:text-amber-600"
                    >
                      {item.label}
                    </a>
                  ))}
                  <div className="mt-6 flex flex-col gap-2 border-t border-blue-100 pt-4">
                    <Button className="bg-blue-900 hover:bg-blue-800" asChild>
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
        <section className="relative overflow-hidden px-4 py-8 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-16 items-stretch min-h-[650px]">
              {/* Left Content */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="flex flex-col justify-center py-12 lg:py-0"
              >
                <div className="mb-4 flex items-center gap-3">
                  <span className="inline-block h-1 w-10 bg-blue-900 rounded-full"></span>
                  <span className="text-xs font-semibold tracking-widest text-blue-900 uppercase">Research Archive</span>
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-blue-900 mb-6 leading-tight">
                  Preserve and Share AUCA&apos;s Scholarly Legacy
                </h1>
                <p className="text-base text-blue-800 mb-8 leading-relaxed max-w-lg">
                  A comprehensive institutional repository for AUCA research, theses, and publications. Secure, discoverable, and built for long-term preservation of academic excellence.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="bg-blue-900 hover:bg-blue-800 text-white rounded-md"
                    asChild
                  >
                    <Link to="/login" className="gap-2">
                      Submit Research
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-blue-300 text-blue-900 hover:bg-blue-50 rounded-md"
                    asChild
                  >
                    <Link to="/browse">Browse Archive</Link>
                  </Button>
                </div>
                <p className="text-xs text-blue-700 mt-8 font-medium">Campus sign-in required • Free for AUCA members</p>
              </motion.div>

              {/* Right Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                className="hidden lg:block relative"
              >
                <img
                  src="/images/auca1.jpg"
                  alt="AUCA Campus"
                  className="rounded-xl shadow-xl object-cover h-full w-full"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Research Statistics Section */}
        <section id="statistics" className="bg-blue-900 text-white px-4 py-12 sm:py-16 lg:py-20 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3">AUCA Research at a Glance</h2>
              <p className="text-base text-blue-100">Supporting academic excellence and institutional growth</p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { number: "2,847", label: "Academic Works", icon: BookOpen },
                { number: "1,250+", label: "Active Researchers", icon: Users },
                { number: "98%", label: "Accessibility", icon: CheckCircle2 },
                { number: "25+", label: "Research Fields", icon: Award }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <stat.icon className="h-6 w-6 text-white mx-auto mb-3" />
                  <div className="text-3xl font-bold text-white mb-1">{stat.number}</div>
                  <p className="text-sm text-blue-100 font-medium">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="border-t border-blue-100 px-4 py-16 sm:py-24 lg:py-32 lg:px-8 bg-white">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-blue-900 mb-3">Built for Institutional Excellence</h2>
              <p className="text-base text-blue-800">Complete research management and discovery platform</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: FileText,
                  title: "Submit Work",
                  description: "Upload and manage theses, projects, and publications with comprehensive metadata."
                },
                {
                  icon: CheckCircle2,
                  title: "Review Process",
                  description: "Streamlined workflow for institutional review and approval cycles."
                },
                {
                  icon: TrendingUp,
                  title: "Analytics",
                  description: "Track research impact and institutional metrics in real time."
                },
                {
                  icon: BookOpen,
                  title: "Discovery",
                  description: "Powerful search and browse across your entire research archive."
                }
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="rounded-lg border border-blue-200 bg-blue-50 p-6 hover:border-blue-400 hover:shadow-md transition-all group"
                >
                  <div className="h-12 w-12 rounded-lg bg-blue-900 flex items-center justify-center mb-4 group-hover:bg-blue-800 transition-colors">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-blue-900 mb-2 text-lg">{feature.title}</h3>
                  <p className="text-sm text-blue-700 leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Latest Publications Section */}
        <section id="publications" className="px-4 py-16 sm:py-24 lg:py-32 lg:px-8 bg-blue-50">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-blue-900 mb-3">Latest Publications</h2>
              <p className="text-base text-blue-800">Recent scholarly contributions from our community</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Advanced Machine Learning Applications in Agricultural Systems",
                  author: "Dr. Emmanuel Ntakarutimana & Team",
                  date: "March 2024",
                  category: "Computer Science",
                  reads: "342"
                },
                {
                  title: "Sustainable Development Practices in Sub-Saharan Africa",
                  author: "Prof. Marie Umuhire",
                  date: "February 2024",
                  category: "Environmental Studies",
                  reads: "287"
                },
                {
                  title: "Theological Perspectives on Modern Educational Reform",
                  author: "Dr. Paul Mwenemeire",
                  date: "January 2024",
                  category: "Theology",
                  reads: "156"
                }
              ].map((pub, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="border border-blue-200 rounded-lg p-6 hover:border-blue-400 hover:shadow-md transition-all bg-white"
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full">
                      {pub.category}
                    </span>
                    <span className="text-xs text-blue-600 font-medium">{pub.reads} reads</span>
                  </div>
                  <h3 className="font-semibold text-blue-900 mb-3 text-base leading-tight">
                    {pub.title}
                  </h3>
                  <p className="text-sm text-blue-700 mb-4 font-medium">{pub.author}</p>
                  <p className="text-xs text-blue-600">{pub.date}</p>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <Button
                size="lg"
                className="bg-blue-900 hover:bg-blue-800 text-white rounded-md"
                asChild
              >
                <Link to="/browse">View All Publications</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="px-4 py-16 sm:py-24 lg:py-32 lg:px-8 bg-white">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-blue-900 mb-4">Our Mission</h2>
              <p className="text-base text-blue-800 leading-relaxed">
                AUCA Connect preserves, protects, and promotes the scholarly achievements of our academic community. We ensure knowledge created at AUCA is discoverable, accessible, and preserved for future generations.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Institutional Credibility",
                  description: "Internationally recognized standards for research preservation and metadata management."
                },
                {
                  title: "Accessible Discovery",
                  description: "Advanced search and browse capabilities making research easy to find and share globally."
                },
                {
                  title: "Long-Term Preservation",
                  description: "Secure infrastructure ensuring your academic work remains accessible for decades."
                }
              ].map((item, i) => (
                <div key={i} className="border border-blue-200 rounded-lg p-6 bg-blue-50 hover:border-blue-400 hover:shadow-md transition-all">
                  <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-blue-900"></span>
                    {item.title}
                  </h3>
                  <p className="text-blue-700 text-sm leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-blue-100 bg-blue-900 text-blue-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-white mb-4">About AUCA Connect</h3>
              <p className="text-sm text-blue-100 leading-relaxed">
                The institutional repository for Adventist University of Central Africa, supporting research preservation and scholarly discovery.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="text-blue-100 hover:text-amber-400 transition-colors">Features</a></li>
                <li><a href="#publications" className="text-blue-100 hover:text-amber-400 transition-colors">Publications</a></li>
                <li><a href="#about" className="text-blue-100 hover:text-amber-400 transition-colors">About</a></li>
                <li><a href="mailto:support@auca.ac.rw" className="text-blue-100 hover:text-amber-400 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Support</h3>
              <div className="space-y-3 text-sm">
                <p className="flex items-center gap-2 text-blue-100">
                  <Mail className="h-4 w-4 text-amber-400" />
                  <a href="mailto:support@auca.ac.rw" className="hover:text-amber-400 transition-colors">support@auca.ac.rw</a>
                </p>
                <p className="text-blue-100">AUCA Campus, Kigali Rwanda</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-blue-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-blue-100">
            <span>© {new Date().getFullYear()} Adventist University of Central Africa. All rights reserved.</span>
            <div className="flex gap-6">
              <a href="#" className="hover:text-amber-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-amber-400 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
