import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  FileCheck, AlertTriangle, CheckCircle, XCircle, MessageSquare,
} from "lucide-react";

/* ─── Mock data ─── */

interface ExamQuestion {
  number: string;
  topic: string;
  matchStatus: "matched" | "partial" | "unmatched" | "untaught";
  logEntry: string | null;
  logDate: string | null;
}

interface ExamPaper {
  id: string;
  courseCode: string;
  courseName: string;
  lecturer: string;
  submittedDate: string;
  totalQuestions: number;
  matchedCount: number;
  unmatchedCount: number;
  untaughtCount: number;
  missingKeyTopics: string[];
  status: "pending" | "approved" | "rejected";
  questions: ExamQuestion[];
}

const examPapers: ExamPaper[] = [
  {
    id: "ex1",
    courseCode: "CS301",
    courseName: "Software Engineering",
    lecturer: "Dr. Sarah Mugisha",
    submittedDate: "2025-03-10",
    totalQuestions: 8,
    matchedCount: 8,
    unmatchedCount: 0,
    untaughtCount: 0,
    missingKeyTopics: [],
    status: "pending",
    questions: [
      { number: "Q1", topic: "SDLC Waterfall vs Agile", matchStatus: "matched", logEntry: "Introduction to Software Development Life Cycle", logDate: "Feb 3" },
      { number: "Q2", topic: "Use case diagrams", matchStatus: "matched", logEntry: "Requirements Engineering & Use Cases", logDate: "Feb 5" },
      { number: "Q3", topic: "UML class diagrams", matchStatus: "matched", logEntry: "UML Diagrams – Class and Sequence Diagrams", logDate: "Feb 10" },
      { number: "Q4", topic: "Singleton design pattern", matchStatus: "matched", logEntry: "Design Patterns – Singleton, Factory, Observer", logDate: "Feb 12" },
      { number: "Q5", topic: "Unit testing with JUnit", matchStatus: "matched", logEntry: "Testing Fundamentals – Unit, Integration, System", logDate: "Feb 17" },
      { number: "Q6", topic: "Git branching strategies", matchStatus: "matched", logEntry: "Version Control with Git & Branching Strategies", logDate: "Feb 19" },
      { number: "Q7", topic: "REST API design principles", matchStatus: "matched", logEntry: "API Design and RESTful Web Services", logDate: "Mar 3" },
      { number: "Q8", topic: "CI/CD pipeline setup", matchStatus: "matched", logEntry: "CI/CD Pipelines and DevOps Basics", logDate: "Feb 24" },
    ],
  },
  {
    id: "ex2",
    courseCode: "IT201",
    courseName: "Web Development",
    lecturer: "Dr. Sarah Mugisha",
    submittedDate: "2025-03-14",
    totalQuestions: 8,
    matchedCount: 5,
    unmatchedCount: 2,
    untaughtCount: 1,
    missingKeyTopics: ["Authentication with JWT", "Redux State Management"],
    status: "pending",
    questions: [
      { number: "Q1", topic: "HTML5 semantic elements", matchStatus: "matched", logEntry: "HTML5 and Semantic Markup", logDate: "Feb 4" },
      { number: "Q2", topic: "CSS Grid layout", matchStatus: "matched", logEntry: "CSS Flexbox and Grid Layout", logDate: "Feb 6" },
      { number: "Q3", topic: "Docker containerization", matchStatus: "untaught", logEntry: null, logDate: null },
      { number: "Q4", topic: "React component lifecycle", matchStatus: "matched", logEntry: "React Fundamentals – Components and Props", logDate: "Feb 13" },
      { number: "Q5", topic: "React hooks (useState, useEffect)", matchStatus: "matched", logEntry: "State Management with Hooks", logDate: "Feb 18" },
      { number: "Q6", topic: "Client-side routing", matchStatus: "matched", logEntry: "React Router and Client-Side Navigation", logDate: "Feb 20" },
      { number: "Q7", topic: "GraphQL API design", matchStatus: "unmatched", logEntry: null, logDate: null },
      { number: "Q8", topic: "ES6 destructuring", matchStatus: "partial", logEntry: "JavaScript ES6+ Features", logDate: "Feb 11" },
    ],
  },
];

const matchStatusConfig = {
  matched: { label: "Matched", icon: CheckCircle, className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30" },
  partial: { label: "Partial", icon: AlertTriangle, className: "bg-amber-500/10 text-amber-600 border-amber-500/30" },
  unmatched: { label: "Unmatched", icon: XCircle, className: "bg-red-500/10 text-red-600 border-red-500/30" },
  untaught: { label: "Untaught Topic", icon: AlertTriangle, className: "bg-orange-500/10 text-orange-600 border-orange-500/30" },
};

const HodExamReviewPage = () => {
  const [selectedExam, setSelectedExam] = useState<ExamPaper>(examPapers[0]);
  const [comment, setComment] = useState("");

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-xl font-heading font-bold text-foreground">Exam Paper Validation</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Compare exam questions against teaching log entries. Approve or reject papers based on coverage.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-4">
          {/* Exam list panel */}
          <Card className="border-border shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-heading">Exam Papers</CardTitle>
              <CardDescription>{examPapers.filter((e) => e.status === "pending").length} awaiting review</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {examPapers.map((exam) => (
                <button
                  key={exam.id}
                  type="button"
                  onClick={() => setSelectedExam(exam)}
                  className={`w-full text-left rounded-lg border p-3 transition-colors ${
                    selectedExam.id === exam.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-accent/40"
                  }`}
                >
                  <p className="text-sm font-semibold text-foreground">{exam.courseCode}</p>
                  <p className="text-xs text-muted-foreground truncate">{exam.courseName}</p>
                  <div className="mt-2 flex items-center gap-2">
                    {exam.unmatchedCount > 0 ? (
                      <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/30 text-[10px]">
                        {exam.unmatchedCount} issue{exam.unmatchedCount > 1 ? "s" : ""}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-[10px]">
                        All matched
                      </Badge>
                    )}
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Question-topic comparison table */}
          <Card className="lg:col-span-3 border-border shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-heading">
                    {selectedExam.courseCode} — {selectedExam.courseName}
                  </CardTitle>
                  <CardDescription>
                    {selectedExam.lecturer} · Submitted {selectedExam.submittedDate} · {selectedExam.totalQuestions} questions
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-[10px]">
                    <CheckCircle className="mr-1 h-3 w-3" /> {selectedExam.matchedCount} matched
                  </Badge>
                  {selectedExam.untaughtCount > 0 && (
                    <Badge variant="outline" className="bg-orange-500/10 text-orange-600 border-orange-500/30 text-[10px]">
                      <AlertTriangle className="mr-1 h-3 w-3" /> {selectedExam.untaughtCount} untaught
                    </Badge>
                  )}
                  {selectedExam.unmatchedCount > 0 && (
                    <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/30 text-[10px]">
                      <XCircle className="mr-1 h-3 w-3" /> {selectedExam.unmatchedCount} unmatched
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-6">
              {/* Validation Flags Summary */}
              {(selectedExam.untaughtCount > 0 || selectedExam.missingKeyTopics.length > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {selectedExam.untaughtCount > 0 && (
                    <div className="rounded-lg border border-orange-200 bg-orange-50/50 p-3">
                      <div className="flex items-center gap-2 text-orange-700 mb-2">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Untaught Topics Flagged</span>
                      </div>
                      <p className="text-xs text-orange-800">
                        {selectedExam.questions.filter(q => q.matchStatus === "untaught").map(q => q.topic).join(", ")}
                      </p>
                    </div>
                  )}
                  {selectedExam.missingKeyTopics.length > 0 && (
                    <div className="rounded-lg border border-red-200 bg-red-50/50 p-3">
                      <div className="flex items-center gap-2 text-red-700 mb-2">
                        <XCircle className="h-4 w-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Missing Key Syllabus Topics</span>
                      </div>
                      <ul className="text-xs text-red-800 list-disc list-inside">
                        {selectedExam.missingKeyTopics.map(topic => <li key={topic}>{topic}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-[11px] uppercase tracking-wider w-16">#</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wider">Exam Question Topic</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wider">Teaching Log Entry</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wider w-20">Date</TableHead>
                    <TableHead className="text-right text-[11px] uppercase tracking-wider w-24">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedExam.questions.map((q) => {
                    const config = matchStatusConfig[q.matchStatus];
                    const StatusIcon = config.icon;
                    return (
                      <TableRow key={q.number} className={q.matchStatus === "unmatched" ? "bg-red-50/50" : ""}>
                        <TableCell className="text-sm font-semibold text-foreground">{q.number}</TableCell>
                        <TableCell className="text-sm font-medium text-foreground">{q.topic}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {q.logEntry ?? <span className="italic text-red-500">Not found in log</span>}
                        </TableCell>
                        <TableCell className="text-xs font-mono text-muted-foreground">
                          {q.logDate ?? "—"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant="outline" className={`text-[10px] ${config.className}`}>
                            <StatusIcon className="mr-1 h-3 w-3" />
                            {config.label}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {/* Approval actions */}
              <div className="mt-6 rounded-lg border border-border p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-semibold text-foreground">HOD Comment</span>
                </div>
                <Textarea
                  placeholder="Add a comment for the lecturer (optional)..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                />
                <div className="flex justify-end gap-3">
                  <Button variant="outline" className="gap-2 text-red-600 border-red-500/30 hover:bg-red-50">
                    <XCircle className="h-4 w-4" /> Reject
                  </Button>
                  <Button className="gap-2">
                    <CheckCircle className="h-4 w-4" /> Approve
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default HodExamReviewPage;
