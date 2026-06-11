import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { mockReservations, mockProjects } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, Eye, X, Plus, BookOpen, Mail, UserRound } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const statusColors: Record<string, string> = {
  upcoming: "bg-[#f0f9ff] text-[#0284c7] border-[#0ea5e9]/40",
  active: "bg-[#ecfdf5] text-[#059669] border-[#10b981]/40",
  completed: "bg-[#f8fafc] text-[#64748b] border-[#94a3b8]/40",
  waitlisted: "bg-[#fefce8] text-[#ca8a04] border-[#fbbf24]/40",
  cancelled: "bg-[#fef2f2] text-[#e11d48] border-[#f43f5e]/40",
};

const MyReservationsPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("active");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState("");
  const [resDate, setResDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [requesterName, setRequesterName] = useState("Jean Pierre Habimana");
  const [requesterEmail, setRequesterEmail] = useState("student@auca.ac.rw");
  const [purpose, setPurpose] = useState("");
  const [notes, setNotes] = useState("");
  const [localReservations, setLocalReservations] = useState<any[]>([]);
  const selectedMaterial = mockProjects.find(p => p.id === selectedBook);

  useEffect(() => {
    const saved = localStorage.getItem("auca_reservations");
    if (saved) {
      setLocalReservations(JSON.parse(saved));
    }
  }, []);

  const allReservations = [...localReservations, ...mockReservations];

  const tabs = [
    { id: "active", label: "Active Now", count: allReservations.filter(r => r.status === "active").length },
    { id: "waitlisted", label: "Waitlisted", count: allReservations.filter(r => r.status === "waitlisted").length },
  ];

  const filtered = allReservations.filter((r) => {
    if (activeTab === "completed") return r.status === "completed";
    return r.status === activeTab;
  });

  const handleReserve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBook || !resDate || !startTime || !requesterName || !requesterEmail || !purpose) {
      toast({ title: "Error", description: "Please fill in all fields", variant: "destructive" });
      return;
    }

    const book = mockProjects.find(p => p.id === selectedBook);
    
    // Calculate end time automatically (+30 mins)
    const startDateTime = new Date(`${resDate}T${startTime}:00`);
    const endDateTime = new Date(startDateTime.getTime() + 30 * 60000); // Add 30 minutes
    const calculatedEndTime = endDateTime.toTimeString().slice(0, 5); // Format HH:mm
    
    const newRes = {
      id: `r-${Date.now()}`,
      userId: "u1",
      projectId: selectedBook,
      projectTitle: book?.title || "Unknown Book",
      slotStart: `${resDate}T${startTime}:00`,
      slotEnd: `${resDate}T${calculatedEndTime}:00`,
      status: "waitlisted", // Sent to moderator
      requesterName,
      requesterEmail,
      purpose,
      notes,
      materialType: book?.type,
      materialDepartment: book?.department,
      materialYear: book?.year,
      materialAuthor: book?.authors?.map((a: any) => a.name).join(", "),
      createdAt: new Date().toISOString()
    };

    const updated = [newRes, ...localReservations];
    setLocalReservations(updated);
    localStorage.setItem("auca_reservations", JSON.stringify(updated));
    
    toast({ 
      title: "Reservation Requested", 
      description: `Your 30-minute session for '${book?.title}' has been sent to the moderator for approval.` 
    });
    
    setIsModalOpen(false);
    setSelectedBook("");
    setResDate("");
    setStartTime("");
    setPurpose("");
    setNotes("");
    setActiveTab("waitlisted");
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
  const formatTime = (d: string) => new Date(d).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  const emptyMessage: Record<string, string> = {
    upcoming: "You have no upcoming reservations.",
    active: "Nothing is checked out right now.",
    completed: "No completed reservations yet.",
    waitlisted: "You are not on a waitlist.",
    setActiveTab("waitlisted");
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
  const formatTime = (d: string) => new Date(d).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  const emptyMessage: Record<string, string> = {
    upcoming: "You have no upcoming reservations.",
    active: "Nothing is checked out right now.",
    completed: "No completed reservations yet.",
    waitlisted: "You are not on a waitlist.",
  };

  return (
    <AppLayout>
      <div className="ds-page-scroll max-w-4xl mx-auto w-full">
        
        {/* Header Section */}
        <section className="ds-student-welcome">
          <div className="ds-student-welcome-inner">
            <div className="flex flex-col items-start gap-1">
              <span className="ds-student-welcome-badge">My Reservation</span>
              <h1 className="text-[18px] font-black text-[#1d3557] leading-tight tracking-tight mt-1">
                Manage Your Reservation
              </h1>
            </div>
            
            <div className="ds-student-welcome-panel">
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#003566] hover:bg-[#0056b3] text-[11px] font-bold shadow-md px-5 rounded-full h-9 uppercase tracking-widest text-white border-none">
                    <Plus className="h-3.5 w-3.5 mr-2" />
                    New Reservation
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-[#1d3557]">Reserve Library Material</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleReserve} className="space-y-4 mt-4 text-left">
                    <div className="space-y-2">
                      <Label className="text-[11px] font-bold uppercase text-slate-500">Available Book / Material (Max 3 slots)</Label>
                      <Select value={selectedBook} onValueChange={setSelectedBook}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a book or project" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockProjects
                            .filter(p => p.availability !== "AUCA Only" && p.slots && p.slots.reserved < 3)
                            .map(book => (
                            <SelectItem key={book.id} value={book.id}>
                              <div className="flex items-center gap-2">
                                <BookOpen className="h-4 w-4 text-slate-400" />
                                <span className="truncate max-w-[200px]">{book.title}</span>
                                <span className="text-[10px] text-slate-400 ml-auto bg-slate-100 px-1.5 rounded">
                                  {3 - (book.slots?.reserved || 0)} left
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {selectedMaterial && (
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-left">
                        <p className="text-[12px] font-black text-[#1d3557]">{selectedMaterial.title}</p>
                        <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] font-bold text-slate-500">
                          <span>Type: {selectedMaterial.type}</span>
                          <span>Year: {selectedMaterial.year}</span>
                          <span>Department: {selectedMaterial.department}</span>
                          <span>Slots left: {(selectedMaterial.slots?.total ?? 3) - (selectedMaterial.slots?.reserved ?? 0)}</span>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label className="text-[11px] font-bold uppercase text-slate-500">Student Name</Label>
                        <Input required value={requesterName} onChange={(e) => setRequesterName(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[11px] font-bold uppercase text-slate-500">Student Email</Label>
                        <Input type="email" required value={requesterEmail} onChange={(e) => setRequesterEmail(e.target.value)} />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-[11px] font-bold uppercase text-slate-500">Reservation Date</Label>
                      <Input 
                        type="date" 
                        required 
                        min={new Date().toISOString().split("T")[0]} 
                        value={resDate} 
                        onChange={(e) => setResDate(e.target.value)} 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-[11px] font-bold uppercase text-slate-500">Start Time (30-Min Session)</Label>
                      <Input type="time" required value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                      <p className="text-[10px] text-slate-400 mt-1">End time will be calculated automatically.</p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[11px] font-bold uppercase text-slate-500">Purpose</Label>
                      <Select value={purpose} onValueChange={setPurpose}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select reservation purpose" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Research reading">Research reading</SelectItem>
                          <SelectItem value="Final year project reference">Final year project reference</SelectItem>
                          <SelectItem value="Course assignment">Course assignment</SelectItem>
                          <SelectItem value="Publication review">Publication review</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[11px] font-bold uppercase text-slate-500">Additional Notes</Label>
                      <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional note for the moderator" />
                    </div>
                    
                    <DialogFooter className="mt-6">
                      <Button type="submit" className="w-full bg-[#1d3557] hover:bg-[#2c4e7d] font-bold">
                        Send Request to Moderator
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </section>

        {/* Centered Tabs */}
        <div className="flex justify-center gap-2 flex-wrap mb-4">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-3 py-1 rounded-md text-[12px] font-bold transition-all duration-300 flex items-center gap-1.5 ${
                activeTab === t.id
                  ? "bg-[#1d3557] text-white shadow-md"
                  : "bg-white border border-slate-200 text-slate-500 hover:border-[#1d3557]/30 hover:bg-slate-50"
              }`}
            >
              {t.label}
              {t.count > 0 && (
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[8px] font-bold ${activeTab === t.id ? "bg-white/20 text-white" : "bg-blue-50 text-[#1d3557]"}`}
                >
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-16 text-center flex flex-col items-center justify-center transition-all hover:bg-slate-50">
            <div className="h-16 w-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-6 border border-slate-100">
              <CalendarDays className="h-6 w-6 text-slate-300" />
            </div>
            <p className="text-[13px] font-bold text-slate-400 uppercase tracking-widest">{emptyMessage[activeTab] ?? "No reservations in this list."}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((r) => (
              <div key={r.id} className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-md hover:border-[#1d3557]/20 transition-all duration-300">
                <div className="space-y-1.5 flex-1 min-w-0">
                  {r.status !== "active" && (
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className={`text-[9px] font-bold uppercase tracking-widest border-transparent px-2 py-0.5 ${statusColors[r.status] || "bg-blue-50 text-[#1d3557]"}`}>
                        {r.status}
                      </Badge>
                    </div>
                  )}
                  <h3 className="text-[14px] font-bold text-slate-800 leading-tight group-hover:text-[#1d3557] transition-colors truncate">{r.projectTitle}</h3>
                  <div className="flex items-center gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex-wrap">
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="h-3 w-3 text-slate-300 group-hover:text-[#1d3557] transition-colors" />
                      {formatDate(r.slotStart)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3 w-3 text-slate-300 group-hover:text-[#1d3557] transition-colors" />
                      {formatTime(r.slotStart)} – {formatTime(r.slotEnd)}
                    </span>
                  </div>
                  {(r.requesterName || r.purpose || r.materialType) && (
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-semibold text-slate-500">
                      {r.requesterName && (
                        <span className="flex items-center gap-1.5">
                          <UserRound className="h-3 w-3" />
                          {r.requesterName}
                        </span>
                      )}
                      {r.requesterEmail && (
                        <span className="flex items-center gap-1.5">
                          <Mail className="h-3 w-3" />
                          {r.requesterEmail}
                        </span>
                      )}
                      {r.purpose && <span>Purpose: {r.purpose}</span>}
                      {r.materialType && <span>{r.materialType} - {r.materialDepartment} {r.materialYear}</span>}
                      {r.notes && <span>Note: {r.notes}</span>}
                    </div>
                  )}
                </div>
                
                <div className="flex-shrink-0 flex gap-2">
                  {r.status === "active" && (
                    <Button 
                      size="sm" 
                      onClick={() => navigate(`/project/${r.projectId}`)}
                      className="h-9 rounded-xl bg-[#1d3557] hover:bg-[#2c4e7d] font-bold px-6 shadow-sm uppercase tracking-widest text-[10px]"
                    >
                      <Eye className="w-3.5 h-3.5 mr-2" />
                      Open viewer
                    </Button>
                  )}
                  {r.status === "waitlisted" && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 font-bold rounded-xl px-5 h-9 text-[10px] uppercase tracking-widest"
                      disabled
                    >
                      Pending Approval
                    </Button>
                  )}
                  {r.status === "upcoming" && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 font-bold rounded-xl px-5 h-9 text-[10px] uppercase tracking-widest"
                      onClick={() => toast({ title: "Reservation Cancelled", description: `Cancelled reservation for '${r.projectTitle}'` })}
                    >
                      <X className="w-3.5 h-3.5 mr-2" />
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default MyReservationsPage;
