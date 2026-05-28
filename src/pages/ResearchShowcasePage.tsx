import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, BookOpen, GraduationCap, Award, ExternalLink, 
  Download, Filter, Share2, Sparkles, TrendingUp, Mail
} from "lucide-react";

/* ─── Mock Research Data (AUCA Specific) ─── */
const AUCA_FACULTIES = [
  "All Departments",
  "Information Technology",
  "Business Administration",
  "Theology",
  "Education",
];

const featuredProjects = [
  {
    id: "rp1",
    title: "AI-Driven Crop Disease Prediction for Rwandan Farmers",
    student: "Emmanuel Kwizera",
    supervisor: "Dr. Sarah Mugisha",
    department: "Information Technology",
    year: "2024",
    grade: "A+",
    tags: ["Machine Learning", "Agriculture", "Mobile Development"],
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=60",
    abstract: "A deep learning model trained on local potato and maize crops to identify early-stage blight using smartphone cameras, achieving 94% accuracy in field tests.",
  },
  {
    id: "rp2",
    title: "Blockchain Framework for Secure Academic Credentialing",
    student: "Fiona Umutoni",
    supervisor: "Prof. Agnes Ntamwiza",
    department: "Information Technology",
    year: "2024",
    grade: "A",
    tags: ["Blockchain", "Security", "Web3"],
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&auto=format&fit=crop&q=60",
    abstract: "Implementing an Ethereum-based private ledger for AUCA transcripts to eliminate document forgery and automate credential verification.",
  },
  {
    id: "biz1",
    title: "Impact of Mobile Money on Small Scale Business Growth in Kigali",
    student: "Jean Luc Ndayisaba",
    supervisor: "Dr. Paul Mutara",
    department: "Business Administration",
    year: "2024",
    grade: "A",
    tags: ["FinTech", "Economy", "SMEs"],
    image: "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?w=800&auto=format&fit=crop&q=60",
    abstract: "An empirical study on how digital payment systems have increased the turnover of small-scale retail businesses in urban Rwanda.",
  },
];

const ResearchShowcasePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("All Departments");

  const filteredProjects = featuredProjects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.student.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDept = selectedDept === "All Departments" || p.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-body">
      <div className="max-w-7xl mx-auto px-6 mt-4 pb-10">
        {/* Filters and Title */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4 rounded-2xl bg-[#1d3557] px-4 py-3 shadow-sm">
          <div className="relative w-full sm:w-56">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70 pointer-events-none" />
            <select
              aria-label="Filter by department"
              className="w-full pl-10 pr-3 py-2 border border-transparent rounded-lg bg-[#1f4075] text-white shadow-sm font-semibold text-sm appearance-none bg-no-repeat bg-[length:0_0] focus:outline-none"
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
            >
              {AUCA_FACULTIES.map(dept => <option key={dept} value={dept}>{dept}</option>)}
            </select>
          </div>
          <h1 className="text-right text-xs font-semibold uppercase tracking-wide text-white">
            Academic Discovery Hub
          </h1>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="group border-border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col text-xs">
              <div className="h-32 overflow-hidden relative">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <Badge className="absolute top-3 right-3 bg-emerald-500 text-white border-0 px-2 py-0.5 text-[9px] font-semibold">
                  {project.grade}
                </Badge>
              </div>
              
              <CardHeader className="pb-2 pt-2 px-3">
                <CardTitle className="text-sm font-heading font-bold leading-snug group-hover:text-[#1d3557] transition-colors">
                  {project.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 px-3 pb-2">
                <p className="text-[10px] text-slate-600 leading-5 line-clamp-2">
                  {project.abstract}
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {project.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-[8px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              
              <CardFooter className="pt-2 border-t border-slate-100 px-3 pb-2 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1 text-[9px] font-semibold text-slate-500">
                  <TrendingUp className="h-3 w-3" /> 1.2k
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                    <Share2 className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="outline" size="sm" className="h-7 gap-1 px-2 text-[9px] font-semibold border-[#1d3557] text-[#1d3557] hover:bg-[#1d3557] hover:text-white">
                    READ <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

      </div>
    </div>
  );
};

export default ResearchShowcasePage;
