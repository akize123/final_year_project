import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { mockUsers } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Edit, Ban, KeyRound, Eye, Download, Megaphone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const roleColors: Record<string, string> = {
  student: "bg-primary/10 text-primary border-primary/20",
  lecturer: "bg-success/10 text-success border-success/20",
  moderator: "bg-warning/10 text-warning border-warning/20",
  admin: "bg-ai/10 text-ai border-ai/20",
};

const AdminUsersPage = () => {
  const { toast } = useToast();
  const [searchQ, setSearchQ] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const filtered = mockUsers.filter((u) => {
    if (roleFilter !== "all" && u.role !== roleFilter) return false;
    if (searchQ) {
      const q = searchQ.toLowerCase();
      return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.campusId.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-heading font-bold text-foreground">User Management</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2"><Download className="w-4 h-4" /> Export</Button>
            <Button variant="outline" size="sm" className="gap-2"><Megaphone className="w-4 h-4" /> Send Announcement</Button>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input value={searchQ} onChange={(e) => setSearchQ(e.target.value)} placeholder="Search users..." className="pl-9" />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="student">Students</SelectItem>
              <SelectItem value="lecturer">Lecturers</SelectItem>
              <SelectItem value="moderator">Moderators</SelectItem>
              <SelectItem value="admin">Admins</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="bg-card rounded-xl border border-border card-shadow overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground">
                <th className="text-left px-5 py-3 font-medium">User</th>
                <th className="text-left px-5 py-3 font-medium">Campus ID</th>
                <th className="text-left px-5 py-3 font-medium">Role</th>
                <th className="text-left px-5 py-3 font-medium">Department</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
                <th className="text-left px-5 py-3 font-medium">Last Login</th>
                <th className="text-right px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3">
                    <p className="text-sm font-medium text-foreground">{u.name}</p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                  </td>
                  <td className="px-5 py-3 text-sm text-muted-foreground font-mono">{u.campusId}</td>
                  <td className="px-5 py-3">
                    <Badge variant="outline" className={`text-xs capitalize ${roleColors[u.role]}`}>{u.role}</Badge>
                  </td>
                  <td className="px-5 py-3 text-sm text-muted-foreground">{u.department}</td>
                  <td className="px-5 py-3">
                    <Badge variant="outline" className={`text-xs ${u.status === "Active" ? "bg-success/10 text-success border-success/20" : "bg-destructive/10 text-destructive border-destructive/20"}`}>
                      {u.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-3 text-xs text-muted-foreground">{u.lastLogin}</td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => toast({ title: "Edit Role", description: `Editing role for ${u.name}` })}>
                        <Edit className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => toast({ title: u.status === "Active" ? "User Suspended" : "User Reactivated", description: `${u.name} has been ${u.status === "Active" ? "suspended" : "reactivated"}.` })}>
                        <Ban className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => toast({ title: "Password Reset", description: `Password reset email sent to ${u.email}` })}>
                        <KeyRound className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0"><Eye className="w-3.5 h-3.5" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
};

export default AdminUsersPage;
