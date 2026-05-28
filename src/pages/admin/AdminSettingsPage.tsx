import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Save, Upload, Database, Mail, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminSettingsPage = () => {
  const { toast } = useToast();
  const [platformName, setPlatformName] = useState("AUCA Connect Publication Hub");
  const [maxFileSize, setMaxFileSize] = useState("50");

  const handleSave = () => {
    toast({ title: "Settings Saved", description: "Platform settings have been updated." });
  };

  const handleBackup = () => {
    toast({ title: "Backup Started", description: "Manual backup initiated. You'll be notified when complete." });
  };

  return (
    <AppLayout>
      <div className="max-w-2xl space-y-6">
        <h1 className="text-xl font-heading font-bold text-foreground">Platform Settings</h1>

        {/* Branding */}
        <div className="bg-card rounded-xl border border-border p-6 card-shadow space-y-5">
          <h2 className="font-heading font-semibold text-foreground flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" /> Branding & Identity
          </h2>
          <div className="space-y-2">
            <Label>Platform Name</Label>
            <Input value={platformName} onChange={(e) => setPlatformName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Institution Logo</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">Upload AUCA logo (PNG, SVG, max 2MB)</p>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Primary Color Override</Label>
            <div className="flex items-center gap-3">
              <input type="color" defaultValue="#1A4B8C" className="w-10 h-10 rounded cursor-pointer" />
              <Input defaultValue="#1A4B8C" className="w-32 font-mono" />
            </div>
          </div>
        </div>

        {/* Email Templates */}
        <div className="bg-card rounded-xl border border-border p-6 card-shadow space-y-5">
          <h2 className="font-heading font-semibold text-foreground flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" /> Email Notification Templates
          </h2>
          <div className="space-y-2">
            <Label>Approval Email Template</Label>
            <Textarea defaultValue="Dear {name},\n\nYour submission '{title}' has been approved and published on AUCA Connect Publication Hub.\n\nBest regards,\nAUCA Publication Hub Team" rows={4} />
          </div>
          <div className="space-y-2">
            <Label>Rejection Email Template</Label>
            <Textarea defaultValue="Dear {name},\n\nYour submission '{title}' has been reviewed and requires revisions.\n\nReason: {reason}\n\nPlease address the feedback and resubmit.\n\nBest regards,\nAUCA Publication Hub Team" rows={4} />
          </div>
          <div className="space-y-2">
            <Label>Reservation Confirmation Template</Label>
            <Textarea defaultValue="Dear {name},\n\nYour reservation for '{title}' has been confirmed.\n\nDate: {date}\nTime: {time}\n\nPlease arrive on time. Access will be revoked after the reserved period.\n\nBest regards,\nAUCA Publication Hub Team" rows={4} />
          </div>
        </div>

        {/* File Upload Policy */}
        <div className="bg-card rounded-xl border border-border p-6 card-shadow space-y-5">
          <h2 className="font-heading font-semibold text-foreground">File Upload Policies</h2>
          <div className="space-y-2">
            <Label>Maximum File Size (MB)</Label>
            <Input type="number" value={maxFileSize} onChange={(e) => setMaxFileSize(e.target.value)} className="w-32" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Allow PDF only</Label>
              <p className="text-xs text-muted-foreground">Restrict uploads to PDF format</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable malware scanning</Label>
              <p className="text-xs text-muted-foreground">Scan uploaded files for malware</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>

        {/* Backup */}
        <div className="bg-card rounded-xl border border-border p-6 card-shadow space-y-5">
          <h2 className="font-heading font-semibold text-foreground flex items-center gap-2">
            <Database className="w-5 h-5 text-primary" /> Backup & Recovery
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <p className="text-sm font-medium text-foreground">Last Backup</p>
                <p className="text-xs text-muted-foreground">March 15, 2025, 2:00 AM · 12.4 GB</p>
              </div>
              <Badge variant="outline" className="bg-success/10 text-success border-success/20">Complete</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <p className="text-sm font-medium text-foreground">Previous Backup</p>
                <p className="text-xs text-muted-foreground">March 14, 2025, 2:00 AM · 12.3 GB</p>
              </div>
              <Badge variant="outline" className="bg-success/10 text-success border-success/20">Complete</Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleBackup} className="gap-2"><Database className="w-4 h-4" /> Manual Backup</Button>
            <Button variant="outline" className="gap-2">Restore from Backup</Button>
          </div>
        </div>

        <Button onClick={handleSave} className="gap-2"><Save className="w-4 h-4" /> Save All Settings</Button>
      </div>
    </AppLayout>
  );
};

export default AdminSettingsPage;
