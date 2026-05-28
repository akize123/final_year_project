import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Settings, Save } from "lucide-react";

const AdminReservationsPage = () => {
  const { toast } = useToast();
  const [enabled, setEnabled] = useState(true);
  const [maxConcurrent, setMaxConcurrent] = useState("3");
  const [slotDuration, setSlotDuration] = useState("2h");
  const [cancellationWindow, setCancellationWindow] = useState("30");
  const [noShowThreshold, setNoShowThreshold] = useState("3");
  const [waitlistMode, setWaitlistMode] = useState("auto");

  const handleSave = () => {
    toast({ title: "Settings Saved", description: "Reservation settings have been updated successfully." });
  };

  return (
    <AppLayout>
      <div className="max-w-2xl space-y-6">
        <h1 className="text-xl font-heading font-bold text-foreground">Reservation Settings</h1>

        <div className="bg-card rounded-xl border border-border p-6 card-shadow space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Enable Reservation System</Label>
              <p className="text-xs text-muted-foreground mt-1">Toggle the entire reservation system on or off</p>
            </div>
            <Switch checked={enabled} onCheckedChange={setEnabled} />
          </div>

          <div className="border-t border-border pt-6 space-y-5">
            <div className="space-y-2">
              <Label>Max Concurrent Users per Project</Label>
              <Select value={maxConcurrent} onValueChange={setMaxConcurrent}>
                <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                    <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Slot Duration</Label>
              <Select value={slotDuration} onValueChange={setSlotDuration}>
                <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">1 hour</SelectItem>
                  <SelectItem value="2h">2 hours</SelectItem>
                  <SelectItem value="4h">4 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Cancellation Window (minutes before slot)</Label>
              <Input type="number" value={cancellationWindow} onChange={(e) => setCancellationWindow(e.target.value)} className="w-32" />
            </div>

            <div className="space-y-2">
              <Label>No-Show Threshold (before access restriction)</Label>
              <Input type="number" value={noShowThreshold} onChange={(e) => setNoShowThreshold(e.target.value)} className="w-32" />
            </div>

            <div className="space-y-2">
              <Label>Waitlist Mode</Label>
              <Select value={waitlistMode} onValueChange={setWaitlistMode}>
                <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto-assign</SelectItem>
                  <SelectItem value="manual">Manual Approval</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="border-t border-border pt-6">
            <h3 className="font-heading font-semibold text-foreground mb-4">Regulated Access Hours</h3>
            <div className="space-y-3">
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
                <div key={day} className="flex items-center gap-4">
                  <span className="w-24 text-sm text-foreground">{day}</span>
                  <Input type="time" defaultValue="08:00" className="w-32" />
                  <span className="text-muted-foreground">to</span>
                  <Input type="time" defaultValue="17:00" className="w-32" />
                  <Switch defaultChecked />
                </div>
              ))}
              {["Saturday", "Sunday"].map((day) => (
                <div key={day} className="flex items-center gap-4">
                  <span className="w-24 text-sm text-muted-foreground">{day}</span>
                  <Input type="time" defaultValue="08:00" className="w-32" disabled />
                  <span className="text-muted-foreground">to</span>
                  <Input type="time" defaultValue="17:00" className="w-32" disabled />
                  <Switch defaultChecked={false} />
                </div>
              ))}
            </div>
          </div>

          <Button onClick={handleSave} className="gap-2"><Save className="w-4 h-4" /> Save Settings</Button>
        </div>
      </div>
    </AppLayout>
  );
};

export default AdminReservationsPage;
