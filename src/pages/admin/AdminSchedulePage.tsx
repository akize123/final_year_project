import { AppLayout } from "@/components/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const slots = ["8:00–10:00", "10:00–12:00", "12:00–14:00", "14:00–16:00", "16:00–17:00"];

const schedule: Record<string, string[]> = {
  Monday: ["8:00–10:00", "10:00–12:00", "12:00–14:00", "14:00–16:00", "16:00–17:00"],
  Tuesday: ["8:00–10:00", "10:00–12:00", "12:00–14:00", "14:00–16:00", "16:00–17:00"],
  Wednesday: ["8:00–10:00", "10:00–12:00", "12:00–14:00", "14:00–16:00", "16:00–17:00"],
  Thursday: ["8:00–10:00", "10:00–12:00", "12:00–14:00", "14:00–16:00", "16:00–17:00"],
  Friday: ["8:00–10:00", "10:00–12:00", "14:00–16:00"],
};

const holidays = [
  { date: "2025-04-18", name: "Good Friday" },
  { date: "2025-04-21", name: "Easter Monday" },
  { date: "2025-07-01", name: "Independence Day" },
  { date: "2025-07-04", name: "Liberation Day" },
];

const AdminSchedulePage = () => {
  const { toast } = useToast();

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-xl font-heading font-bold text-foreground">Access Schedule</h1>

        {/* Weekly Calendar */}
        <div className="bg-card rounded-xl border border-border card-shadow overflow-hidden">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <h2 className="font-heading font-semibold text-foreground">Weekly Access Hours</h2>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-success/20 border border-success/30" /> Open</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-muted border border-border" /> Closed</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium w-28">Day</th>
                  {slots.map((s) => (
                    <th key={s} className="text-center px-2 py-3 text-xs text-muted-foreground font-medium">{s}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {days.map((day) => (
                  <tr key={day} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 text-sm font-medium text-foreground">{day}</td>
                    {slots.map((slot) => (
                      <td key={slot} className="px-2 py-3 text-center">
                        <div
                          className={`w-full h-10 rounded-md flex items-center justify-center text-xs cursor-pointer transition-colors ${
                            schedule[day]?.includes(slot)
                              ? "bg-success/10 border border-success/30 text-success hover:bg-success/20"
                              : "bg-muted border border-border text-muted-foreground hover:bg-muted/80"
                          }`}
                          onClick={() => toast({ title: "Schedule Updated", description: `Toggled ${day} ${slot}` })}
                        >
                          {schedule[day]?.includes(slot) ? "Open" : "—"}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
                {["Saturday", "Sunday"].map((day) => (
                  <tr key={day} className="border-b border-border last:border-0 bg-muted/30">
                    <td className="px-4 py-3 text-sm text-muted-foreground">{day}</td>
                    {slots.map((slot) => (
                      <td key={slot} className="px-2 py-3 text-center">
                        <div className="w-full h-10 rounded-md bg-muted border border-border flex items-center justify-center text-xs text-muted-foreground">
                          Closed
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Holidays */}
        <div className="bg-card rounded-xl border border-border card-shadow">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <h2 className="font-heading font-semibold text-foreground">Holidays & Closures</h2>
            <Button size="sm" variant="outline" className="gap-2" onClick={() => toast({ title: "Add Holiday", description: "Holiday date picker would open here." })}>
              <Plus className="w-4 h-4" /> Add Holiday
            </Button>
          </div>
          <div className="divide-y divide-border">
            {holidays.map((h) => (
              <div key={h.date} className="px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CalendarDays className="w-4 h-4 text-destructive" />
                  <span className="text-sm text-foreground">{h.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">{h.date}</span>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive"><X className="w-4 h-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default AdminSchedulePage;
