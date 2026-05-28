import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import {
  HelpCircle, BookOpen, FileText, CalendarDays, Shield, Upload,
  GraduationCap, Users, Mail, Phone, Clock, ChevronDown, ChevronUp,
  Search, CheckCircle, AlertTriangle, Info, BookMarked, BarChart3,
  Lock, UserCheck, FileCheck, ArrowRight, Lightbulb, Headphones,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/* ── Data ───────────────────────────────────────────── */
const quickGuides = [
  {
    icon: Upload,
    title: "Submitting a Project",
    color: "bg-blue-50 text-blue-600 border-blue-100",
    badge: "Student",
    badgeColor: "bg-blue-100 text-blue-700",
    steps: [
      "Go to Submit Project from the left sidebar.",
      "Fill in Step 1: project metadata (title, department, supervisor).",
      "Upload your memoir PDF (max 50MB) in Step 2.",
      "Connect your GitHub repository in Step 3.",
      "Submit and wait for HOD/Librarian review (1–3 business days).",
    ],
  },
  {
    icon: CalendarDays,
    title: "Booking a Memoir Reservation",
    color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    badge: "Student",
    badgeColor: "bg-emerald-100 text-emerald-700",
    steps: [
      "Browse the Archive and open a project detail page.",
      "Click the 'Memoir' tab and select 'Request Reservation'.",
      "Choose an available time slot (Mon–Fri, 8 AM–5 PM).",
      "Confirm your booking — an email confirmation will be sent.",
      "You may hold up to 3 active reservations at any time.",
    ],
  },
  {
    icon: FileText,
    title: "Submitting a Document",
    color: "bg-violet-50 text-violet-600 border-violet-100",
    badge: "Student",
    badgeColor: "bg-violet-100 text-violet-700",
    steps: [
      "Navigate to Upload Document from the sidebar.",
      "Select the document type (transcript, clearance, etc.).",
      "Upload your PDF file and fill in required details.",
      "Track the status from My Documents → Pending tab.",
      "Verified documents appear under the Verified tab.",
    ],
  },
  {
    icon: UserCheck,
    title: "Managing Attendance",
    color: "bg-amber-50 text-amber-600 border-amber-100",
    badge: "Lecturer",
    badgeColor: "bg-amber-100 text-amber-700",
    steps: [
      "Go to Attendance Mgmt from the Lecturer Office section.",
      "Select a course and the class date.",
      "Mark each student as Present, Absent, or Late.",
      "Save the session — records are stored automatically.",
      "Students can view their own attendance under My Attendance.",
    ],
  },
  {
    icon: FileCheck,
    title: "Reviewing Exam Papers (HOD)",
    color: "bg-rose-50 text-rose-600 border-rose-100",
    badge: "HOD",
    badgeColor: "bg-rose-100 text-rose-700",
    steps: [
      "Open Exam Validation from the HOD Office section.",
      "Review uploaded exam papers from each lecturer.",
      "Add comments or request corrections if needed.",
      "Approve papers that meet department standards.",
      "Approved papers are forwarded to the Exam Office automatically.",
    ],
  },
  {
    icon: Shield,
    title: "Moderating Submissions",
    color: "bg-slate-50 text-slate-600 border-slate-200",
    badge: "Librarian",
    badgeColor: "bg-slate-100 text-slate-700",
    steps: [
      "Open Moderation Queue from the sidebar.",
      "Review each submitted project for completeness.",
      "Check the plagiarism score and document quality.",
      "Approve to publish, or reject with a reason.",
      "Published projects appear in the Browse Archive.",
    ],
  },
];

const faqs = [
  {
    category: "Account & Access",
    icon: Lock,
    color: "text-blue-600",
    items: [
      { q: "How do I log in to AUCA Connect?", a: "Use your institutional email (name@auca.ac.rw) and your assigned password. Select 'Lecturer' or 'HOD Access' checkbox if applicable before clicking Access Portal." },
      { q: "I forgot my password. What should I do?", a: "Click 'Forgot access?' on the login page and follow the email reset instructions, or contact the IT Help Desk at helpdesk@auca.ac.rw." },
      { q: "Why can't I access certain pages?", a: "Access is role-based. Students, lecturers, HODs, and administrators each see different menu options. If you believe your role is incorrect, contact your department administrator." },
    ],
  },
  {
    category: "Submissions & Documents",
    icon: FileText,
    color: "text-violet-600",
    items: [
      { q: "What file formats are accepted for uploads?", a: "Only PDF files are accepted for memoirs, publications, and documents. Maximum file size is 50MB per upload." },
      { q: "Can I edit a submission after it is sent?", a: "Once submitted, you cannot edit a submission directly. Contact your supervising lecturer or the librarian to request a withdrawal and resubmission." },
      { q: "How long does moderation take?", a: "Most submissions are reviewed within 1–3 business days. You'll receive a system notification and email once a decision is made." },
      { q: "My document shows 'Pending' for too long. What should I do?", a: "If your document has been pending for more than 5 business days, contact the Help Desk or your department's librarian directly." },
    ],
  },
  {
    category: "Reservations",
    icon: CalendarDays,
    color: "text-emerald-600",
    items: [
      { q: "How many reservations can I have at once?", a: "Each student can hold up to 3 active reservations simultaneously. Past or expired reservations do not count." },
      { q: "Can I cancel a reservation?", a: "Yes. Go to My Reservations → Active tab and click 'Cancel'. Cancellations must be made at least 1 hour before the booked time." },
      { q: "What are the memoir viewing hours?", a: "The memoir viewer is available Monday through Friday, 8:00 AM to 5:00 PM (CAT). Weekend reservations are not available." },
      { q: "Can I renew an expired reservation?", a: "Yes. Navigate to My Reservations → Past tab and click 'Request Renewal'. Renewals are subject to availability and admin approval." },
    ],
  },
  {
    category: "Archive & Browse",
    icon: BookMarked,
    color: "text-amber-600",
    items: [
      { q: "How do I search the project archive?", a: "Use the Search bar in the top navigation bar or go to Browse Archive. You can filter by department, year, type, and supervisor." },
      { q: "Can I download a project memoir?", a: "Downloads are restricted. You must make a reservation to access the full memoir viewer. Summaries and abstracts are publicly visible." },
      { q: "How do I get my project published in the archive?", a: "Submit your project through Submit Project in the sidebar. It goes through HOD and Librarian review before being published to the archive." },
    ],
  },
];

const contacts = [
  { icon: Mail, label: "IT Help Desk", value: "helpdesk@auca.ac.rw", sub: "General system support" },
  { icon: Mail, label: "Library Support", value: "library@auca.ac.rw", sub: "Archive & reservation queries" },
  { icon: Mail, label: "Academic Affairs", value: "academics@auca.ac.rw", sub: "Document & clearance issues" },
  { icon: Phone, label: "ICT Department", value: "+250 788 123 456", sub: "Urgent technical issues" },
  { icon: Clock, label: "Support Hours", value: "Mon – Fri, 8:00 AM – 5:00 PM", sub: "Central Africa Time (CAT)" },
];

/* ── Component ─────────────────────────────────────── */
const HelpPage = () => {
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeGuide, setActiveGuide] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredFaqs = faqs.map((section) => ({
    ...section,
    items: section.items.filter(
      (item) =>
        !search ||
        item.q.toLowerCase().includes(search.toLowerCase()) ||
        item.a.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((s) => s.items.length > 0);

  // If search is active, automatically go to page 2 (FAQs) where search is relevant
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    if (e.target.value && currentPage !== 2) {
      setCurrentPage(2);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto flex flex-col h-[calc(100vh-120px)] overflow-hidden">
        
        {/* ── Fixed Hero Banner ── */}
        <div className="relative bg-[#1d3557] rounded-2xl overflow-hidden shadow-lg shadow-[#1d3557]/10 flex-shrink-0 mb-4">
          <div className="absolute inset-0 bg-[url('/images/auca1.jpg')] bg-cover bg-center opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#1d3557] via-[#1d3557]/90 to-transparent" />
          <div className="relative z-10 px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center flex-shrink-0 shadow-inner">
                <Headphones className="h-6 w-6 text-blue-200" />
              </div>
              <div>
                <h1 className="text-xl font-black text-white tracking-tight mb-0.5">Help & Support Center</h1>
                <p className="text-blue-200 text-xs font-medium">Guides, FAQs, and institutional contacts.</p>
              </div>
            </div>
            {/* Search */}
            <div className="flex items-center gap-2 w-full md:w-80 bg-white/10 border border-white/20 backdrop-blur-md rounded-lg px-3 py-2 focus-within:bg-white/20 transition-all shadow-inner">
              <Search className="h-4 w-4 text-white/60 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search FAQs..."
                value={search}
                onChange={handleSearch}
                className="bg-transparent border-none text-xs text-white placeholder:text-white/50 focus:outline-none flex-1 font-medium"
              />
            </div>
          </div>
        </div>

        {/* ── Paginated Content Area ── */}
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6 pb-6">
          
          {currentPage === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: BookOpen, label: "Published Projects", value: "1,240+", color: "text-blue-600 bg-blue-50" },
                  { icon: Users, label: "Active Users", value: "3,800+", color: "text-emerald-600 bg-emerald-50" },
                  { icon: FileText, label: "Documents Verified", value: "12,500+", color: "text-violet-600 bg-violet-50" },
                  { icon: BarChart3, label: "Departments", value: "14", color: "text-amber-600 bg-amber-50" },
                ].map((stat) => (
                  <Card key={stat.label} className="border-slate-200 shadow-sm bg-white rounded-2xl">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${stat.color}`}>
                        <stat.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-slate-800 leading-none mb-1">{stat.value}</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 leading-none">{stat.label}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Guides */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 shadow-sm border border-amber-100">
                    <Lightbulb className="h-5 w-5" />
                  </div>
                  <h2 className="text-sm font-bold text-slate-800 uppercase tracking-[0.2em]">Step-by-Step Guides</h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {quickGuides.map((guide, i) => (
                    <div
                      key={guide.title}
                      className={`group bg-white rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden flex flex-col ${
                        activeGuide === i 
                          ? "ring-2 ring-[#1d3557] border-transparent shadow-lg" 
                          : "border-slate-200 shadow-sm hover:border-[#1d3557]/30"
                      }`}
                      onClick={() => setActiveGuide(activeGuide === i ? null : i)}
                    >
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-4">
                          <div className={`h-10 w-10 rounded-xl border flex items-center justify-center flex-shrink-0 ${guide.color}`}>
                            <guide.icon className="h-5 w-5" />
                          </div>
                          <Badge className={`text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 ${guide.badgeColor} border-0`}>{guide.badge}</Badge>
                        </div>
                        <h3 className={`text-[14px] font-bold leading-tight mb-1 ${activeGuide === i ? "text-[#1d3557]" : "text-slate-800"}`}>{guide.title}</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{guide.steps.length} Actions</p>
                      </div>

                      {activeGuide === i && (
                        <div className="border-t border-slate-50 bg-slate-50/80 px-5 py-5 animate-in fade-in duration-300">
                          <ol className="space-y-3">
                            {guide.steps.map((step, si) => (
                              <li key={si} className="flex items-start gap-3">
                                <span className="flex-shrink-0 h-5 w-5 rounded-full bg-[#1d3557] text-white text-[9px] font-bold flex items-center justify-center shadow-sm">
                                  {si + 1}
                                </span>
                                <span className="text-[12px] text-slate-600 font-medium">{step}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentPage === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 shadow-sm border border-blue-100">
                    <Info className="h-5 w-5" />
                  </div>
                  <h2 className="text-sm font-bold text-slate-800 uppercase tracking-[0.2em]">Frequently Asked Questions</h2>
                </div>
              </div>

              {filteredFaqs.length === 0 && (
                <div className="text-center py-20 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200">
                  <AlertTriangle className="h-10 w-10 mx-auto mb-3 text-slate-300" />
                  <p className="text-sm font-bold text-slate-500">No results found for "{search}"</p>
                </div>
              )}

              <div className="grid grid-cols-1 gap-6">
                {filteredFaqs.map((section) => (
                  <div key={section.category} className="space-y-3">
                    <div className="flex items-center gap-2 px-2">
                      <section.icon className={`h-4 w-4 ${section.color}`} />
                      <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{section.category}</h3>
                    </div>
                    <Card className="border-slate-200 shadow-sm bg-white rounded-2xl overflow-hidden">
                      <div className="divide-y divide-slate-50">
                        {section.items.map((faq) => {
                          const key = `${section.category}-${faq.q}`;
                          const isOpen = openFaq === key;
                          return (
                            <div key={faq.q}>
                              <button
                                onClick={() => setOpenFaq(isOpen ? null : key)}
                                className={`w-full flex items-center justify-between px-6 py-4 text-left transition-all ${isOpen ? "bg-slate-50/50" : "hover:bg-slate-50/30"}`}
                              >
                                <span className={`text-[13px] font-bold ${isOpen ? "text-[#1d3557]" : "text-slate-700"}`}>
                                  {faq.q}
                                </span>
                                <div className={`h-6 w-6 rounded-full flex items-center justify-center ${isOpen ? "bg-[#1d3557] text-white" : "bg-slate-100 text-slate-400"}`}>
                                   {isOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                                </div>
                              </button>
                              {isOpen && (
                                <div className="px-6 pb-5 pt-1 animate-in fade-in duration-300">
                                  <div className="flex gap-3 p-4 rounded-xl bg-[#1d3557]/5 border border-[#1d3557]/10">
                                    <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                                    <p className="text-xs text-slate-600 font-medium leading-relaxed">{faq.a}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentPage === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 max-w-3xl mx-auto w-full pt-10">
              <Card className="border-slate-200 shadow-xl shadow-slate-200/50 bg-white rounded-[2rem] overflow-hidden">
                <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 bg-slate-50/80">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-[#1d3557] flex items-center justify-center text-white shadow-sm">
                      <Headphones className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-[15px] font-bold text-slate-800 uppercase tracking-[0.2em]">Contact & Support</h2>
                      <p className="text-xs font-medium text-slate-500">Official institutional channels</p>
                    </div>
                  </div>
                </div>
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {contacts.map((c) => (
                      <div key={c.label} className="flex items-start gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50 hover:border-[#1d3557]/30 hover:bg-white hover:shadow-md transition-all">
                        <div className="h-10 w-10 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center flex-shrink-0 text-[#1d3557]">
                          <c.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">{c.label}</p>
                          <p className="text-sm font-bold text-slate-800 mb-0.5">{c.value}</p>
                          <p className="text-[10px] text-slate-500 font-medium">{c.sub}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* ── Pagination Controls ── */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 flex-shrink-0 mt-auto">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Page {currentPage} of 3
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="h-8 text-xs font-bold uppercase tracking-wider text-slate-500 border-slate-200"
            >
              Previous
            </Button>
            {[1, 2, 3].map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`h-8 w-8 rounded-lg text-xs font-bold transition-all ${
                  currentPage === page 
                    ? "bg-[#1d3557] text-white shadow-md" 
                    : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-[#1d3557]/30"
                }`}
              >
                {page}
              </button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, 3))}
              disabled={currentPage === 3}
              className="h-8 text-xs font-bold uppercase tracking-wider text-slate-500 border-slate-200"
            >
              Next
            </Button>
          </div>
        </div>

      </div>
    </AppLayout>
  );
};

export default HelpPage;
