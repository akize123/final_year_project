import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Clock, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { teachingLogEntries, SEMESTER_TOTAL_SESSIONS } from "@/data/teaching-log";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getMonthDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return { firstDay, daysInMonth };
}

const TeachingLogPage = () => {
  const { user } = useAuth();
  const [currentYear, setCurrentYear] = useState(2025);
  const [currentMonth, setCurrentMonth] = useState(1); // Feb 0-indexed
  const [dialogOpen, setDialogOpen] = useState(false);

  // Filter entries for the current user (lecturer)
  const myEntries = teachingLogEntries.filter((e) => e.lecturerId === user?.id);
  const loggedCount = myEntries.length;
  const logPct = Math.round((loggedCount / SEMESTER_TOTAL_SESSIONS) * 100);

  // Get unique courses
  const courses = [...new Set(myEntries.map((e) => `${e.courseCode} — ${e.courseName}`))];

  // Calendar data
  const { firstDay, daysInMonth } = getMonthDays(currentYear, currentMonth);
  const loggedDates = new Set(myEntries.map((e) => e.date));

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1 text-center">
            <h1 className="text-2xl font-heading font-black tracking-tight text-foreground">Teaching Log</h1>
            <p className="text-[12px] text-muted-foreground mt-1">
              Log your sessions and track semester progress.
            </p>
          </div>
          <div className="flex justify-center sm:justify-end">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 px-2 text-[9px] font-black bg-background text-foreground border-input hover:bg-accent hover:text-accent-foreground gap-2"
                >
                  <Plus className="h-4 w-4" /> Add Entry
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>New Teaching Log Entry</DialogTitle>
                  <DialogDescription>
                    Record today&apos;s teaching session details.
                  </DialogDescription>
                </DialogHeader>
                <form className="space-y-4 mt-2" onSubmit={(e) => { e.preventDefault(); setDialogOpen(false); }}>
                  <div className="space-y-2">
                    <Label htmlFor="tl-course">Course</Label>
                    <Select>
                      <SelectTrigger id="tl-course"><SelectValue placeholder="Select course" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CS301">CS301 — Software Engineering</SelectItem>
                        <SelectItem value="IT201">IT201 — Web Development</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tl-date">Date</Label>
                      <Input id="tl-date" type="date" defaultValue={new Date().toISOString().split("T")[0]} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tl-duration">Duration (min)</Label>
                      <Input id="tl-duration" type="number" defaultValue={90} min={15} max={240} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tl-topics">Topics Covered</Label>
                    <Input id="tl-topics" placeholder="e.g., React Hooks, State Management" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tl-notes">Notes</Label>
                    <Textarea id="tl-notes" placeholder="Additional notes about the session..." rows={3} />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button type="submit">Save Entry</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Card className="border-border shadow-sm">
            <CardContent className="p-3 flex items-center gap-3">
              {/* Completion ring */}
              <div className="relative flex h-12 w-12 shrink-0 items-center justify-center">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--border))" strokeWidth="8" />
                  <circle
                    cx="50" cy="50" r="40" fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={`${logPct * 2.51} ${251 - logPct * 2.51}`}
                  />
                </svg>
                <span className="absolute text-[13px] font-heading font-black text-foreground">{logPct}%</span>
              </div>
              <div>
                <p className="text-lg font-heading font-black text-foreground leading-tight">{loggedCount}</p>
                <p className="text-[10px] text-muted-foreground">of {SEMESTER_TOTAL_SESSIONS} sessions</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border shadow-sm">
            <CardContent className="p-3 flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <BookOpen className="h-[16px] w-[16px] text-primary" />
              </div>
              <div>
                <p className="text-lg font-heading font-black text-foreground leading-tight">{courses.length}</p>
                <p className="text-[10px] text-muted-foreground">Active courses</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border shadow-sm">
            <CardContent className="p-3 flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/10">
                <Clock className="h-[16px] w-[16px] text-amber-600" />
              </div>
              <div>
                <p className="text-lg font-heading font-black text-foreground leading-tight">
                  {myEntries.reduce((sum, e) => sum + e.duration, 0)} min
                </p>
                <p className="text-[10px] text-muted-foreground">Total teaching time</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Calendar (Compact Layout) */}
        <div className="flex justify-center pt-2">
          <Card className="w-full max-w-sm border-border shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-heading font-semibold">
                  {MONTHS[currentMonth]} {currentYear}
                </CardTitle>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={prevMonth}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={nextMonth}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 text-center">
                {DAYS_OF_WEEK.map((d) => (
                  <div key={d} className="text-[10px] font-semibold uppercase text-muted-foreground py-1">{d}</div>
                ))}
                {/* Empty cells for days before first day */}
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {/* Day cells */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                  const hasLog = loggedDates.has(dateStr);
                  const isToday = dateStr === new Date().toISOString().split("T")[0];

                  return (
                    <div
                      key={day}
                      className={`relative flex h-8 w-full items-center justify-center rounded-md text-xs font-medium transition-colors
                        ${hasLog ? "bg-primary/15 text-primary font-semibold" : "text-foreground hover:bg-accent/40"}
                        ${isToday ? "ring-2 ring-primary/40" : ""}`}
                    >
                      {day}
                      {hasLog && (
                        <div className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary" />
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 flex items-center gap-3 text-[10px] text-muted-foreground justify-center">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-primary/30" /> Logged
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full ring-1 ring-primary/40" /> Today
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default TeachingLogPage;
