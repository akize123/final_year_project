import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { courseSyllabi } from "@/data/exam-papers";

const courseAllocations = [
  { courseCode: "CS301", courseName: "Software Engineering", credits: 4, type: "Core", lecturer: "Dr. Sarah Mugisha", level: "Year 3 - S1" },
  { courseCode: "IT201", courseName: "Web Development", credits: 3, type: "Core", lecturer: "Dr. Sarah Mugisha", level: "Year 2 - S1" },
  { courseCode: "CS401", courseName: "Machine Learning", credits: 4, type: "Elective", lecturer: "Prof. Agnes Ntamwiza", level: "Year 4 - S1" },
  { courseCode: "ENG301", courseName: "Circuit Design", credits: 3, type: "Core", lecturer: "Dr. Jean B. Niyonzima", level: "Year 3 - S1" },
  { courseCode: "IT101", courseName: "Introduction to IT", credits: 3, type: "Core", lecturer: "Mr. Patrick Mugisha", level: "Year 1 - S1" },
  { courseCode: "BUS301", courseName: "Business Ethics", credits: 2, type: "Core", lecturer: "Dr. Celestin Hakizimana", level: "Year 3 - S1" },
];

const academicCalendar = [
  { event: "Start of Semester", date: "Jan 15, 2025", type: "Academic" },
  { event: "Course Registration Deadline", date: "Jan 30, 2025", type: "Administrative" },
  { event: "Mid-Semester Exams", date: "Mar 10-21, 2025", type: "Examination" },
  { event: "Final Exams", date: "May 12-23, 2025", type: "Examination" },
  { event: "Grade Submission Deadline", date: "May 30, 2025", type: "Administrative" },
  { event: "Graduation Clearances due", date: "Jun 06, 2025", type: "Administrative" },
  { event: "Graduation Ceremony", date: "Jun 20, 2025", type: "Academic" },
];

const HodCurriculumPage = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-heading font-bold text-foreground">Curriculum & Course Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage course allocations, view curriculum structure, and track department academic calendar.
          </p>
        </div>

        <Tabs defaultValue="allocation" className="space-y-4">
          <TabsList>
            <TabsTrigger value="allocation">Course Allocation Lists</TabsTrigger>
            <TabsTrigger value="curriculum">Curriculum Structure</TabsTrigger>
            <TabsTrigger value="calendar">Academic Calendar</TabsTrigger>
          </TabsList>

          <TabsContent value="allocation">
            <Card className="border-border shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-heading">Course Allocation — 2025-S1</CardTitle>
                <CardDescription>Lecturer assignments for the current semester</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-[11px] uppercase tracking-wider">Course Code</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider">Course Name</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider">Level</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider">Lecturer Assigned</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider">Credits</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider">Type</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courseAllocations.map(c => (
                      <TableRow key={c.courseCode}>
                        <TableCell className="text-xs font-semibold text-foreground">{c.courseCode}</TableCell>
                        <TableCell className="text-xs text-foreground">{c.courseName}</TableCell>
                        <TableCell className="text-[10px] text-muted-foreground">{c.level}</TableCell>
                        <TableCell className="text-xs font-medium text-foreground">{c.lecturer}</TableCell>
                        <TableCell className="text-[10px] text-muted-foreground">{c.credits}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`text-[9px] ${c.type === "Core" ? "bg-slate-100 text-slate-700" : "bg-blue-50 text-blue-700 border-blue-200"}`}>
                            {c.type}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="curriculum">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {courseSyllabi.map(syllabus => (
                <Card key={syllabus.courseCode} className="border-border shadow-sm">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-sm font-heading">{syllabus.courseCode}</CardTitle>
                        <CardDescription className="text-xs">{syllabus.courseName}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <p className="text-[10px] font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Key Topics</p>
                    <ul className="space-y-1">
                      {syllabus.topics.slice(0, 5).map(topic => (
                        <li key={topic} className="text-xs text-foreground flex items-start gap-2">
                          <span className="text-muted-foreground mt-0.5">•</span>
                          <span>{topic}</span>
                        </li>
                      ))}
                      {syllabus.topics.length > 5 && (
                        <li className="text-[10px] text-muted-foreground italic px-2 pt-1">
                          + {syllabus.topics.length - 5} more topics
                        </li>
                      )}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="calendar">
            <Card className="border-border shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-heading">Department Academic Calendar</CardTitle>
                <CardDescription>Key dates and deadlines for 2025 Semester 1</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-[11px] uppercase tracking-wider">Date</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider">Event</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider">Category</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {academicCalendar.map((event, i) => (
                      <TableRow key={i}>
                        <TableCell className="text-xs font-semibold text-foreground whitespace-nowrap">{event.date}</TableCell>
                        <TableCell className="text-xs text-foreground">{event.event}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`text-[10px] ${
                            event.type === 'Examination' ? 'bg-amber-50 text-amber-700 border-amber-300' :
                            event.type === 'Academic' ? 'bg-emerald-50 text-emerald-700 border-emerald-300' :
                            'bg-blue-50 text-blue-700 border-blue-300'
                          }`}>
                            {event.type}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </AppLayout>
  );
};

export default HodCurriculumPage;
