import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { teachingLogEntries } from "@/data/teaching-log";
import { format } from "date-fns";
import { useMemo, useRef, useState } from "react";

type MaterialType = "outline" | "notes" | "scheme";

interface CourseMaterial {
  id: string;
  lecturerId: string;
  courseCode: string;
  courseName?: string;
  title: string;
  materialType: MaterialType;
  fileName: string;
  mimeType?: string;
  sizeBytes: number;
  dataUrl?: string;
  uploadedAt: string; // ISO
}

const STORAGE_KEY = "auca_course_materials_v1";

function loadAllMaterials(): CourseMaterial[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as CourseMaterial[];
  } catch {
    return [];
  }
}

function saveAllMaterials(items: CourseMaterial[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.readAsDataURL(file);
  });
}

function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "—";
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  const rounded = value >= 10 || unitIndex === 0 ? Math.round(value) : Math.round(value * 10) / 10;
  return `${rounded} ${units[unitIndex]}`;
}

function labelForType(t: MaterialType) {
  switch (t) {
    case "outline":
      return "Course Outline";
    case "notes":
      return "Lecture Notes";
    case "scheme":
      return "Marking Scheme";
  }
}

const LecturerCourseMaterialsPage = () => {
  const { user } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const replaceInputRef = useRef<HTMLInputElement | null>(null);
  const [replaceTargetId, setReplaceTargetId] = useState<string | null>(null);

  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedType, setSelectedType] = useState<MaterialType | "">("");
  const [docTitle, setDocTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const myCourses = useMemo(() => {
    const mine = teachingLogEntries.filter((e) => e.lecturerId === user?.id);
    const map = new Map<string, string>();
    for (const c of mine) {
      if (!map.has(c.courseCode)) map.set(c.courseCode, c.courseName);
    }
    return Array.from(map.entries())
      .map(([courseCode, courseName]) => ({ courseCode, courseName }))
      .sort((a, b) => a.courseCode.localeCompare(b.courseCode));
  }, [user?.id]);

  const myMaterials = useMemo(() => {
    return loadAllMaterials()
      .filter((m) => m.lecturerId === user?.id)
      .slice()
      .sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
  }, [user?.id, dialogOpen, refreshKey]);

  const persistAll = (nextAll: CourseMaterial[]) => {
    saveAllMaterials(nextAll);
    setRefreshKey((k) => k + 1);
  };

  const handleOpen = (m: CourseMaterial) => {
    if (!m.dataUrl) {
      toast.error("File content not available.");
      return;
    }
    window.open(m.dataUrl, "_blank", "noopener,noreferrer");
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this material?")) return;
    const all = loadAllMaterials();
    persistAll(all.filter((m) => m.id !== id));
    toast.success("Material deleted");
  };

  const startReplace = (id: string) => {
    setReplaceTargetId(id);
    replaceInputRef.current?.click();
  };

  const handleReplaceSelected = async (nextFile: File | null) => {
    if (!user) return;
    if (!replaceTargetId) return;
    if (!nextFile) {
      setReplaceTargetId(null);
      if (replaceInputRef.current) replaceInputRef.current.value = "";
      return;
    }

    if (nextFile.size > 4 * 1024 * 1024) {
      toast.error("File too large for local storage. Please upload a file under 4 MB.");
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(nextFile);
      const all = loadAllMaterials();
      const nextAll = all.map((m) => (
        m.id !== replaceTargetId ? m : {
          ...m,
          fileName: nextFile.name,
          mimeType: nextFile.type || "application/octet-stream",
          sizeBytes: nextFile.size,
          dataUrl,
          uploadedAt: new Date().toISOString(),
        }
      ));
      persistAll(nextAll);
      toast.success("Material replaced");
    } catch {
      toast.error("Replace failed. Please try again.");
    } finally {
      setReplaceTargetId(null);
      if (replaceInputRef.current) replaceInputRef.current.value = "";
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!selectedCourse || !selectedType || !docTitle.trim() || !file) return;

    if (file.size > 4 * 1024 * 1024) {
      toast.error("File too large for local storage. Please upload a file under 4 MB.");
      return;
    }

    try {
      setIsUploading(true);
      const dataUrl = await readFileAsDataUrl(file);
      const courseMeta = myCourses.find((c) => c.courseCode === selectedCourse);
      const newItem: CourseMaterial = {
        id: crypto.randomUUID(),
        lecturerId: user.id,
        courseCode: selectedCourse,
        courseName: courseMeta?.courseName,
        title: docTitle.trim(),
        materialType: selectedType as MaterialType,
        fileName: file.name,
        mimeType: file.type || "application/octet-stream",
        sizeBytes: file.size,
        dataUrl,
        uploadedAt: new Date().toISOString(),
      };

      const all = loadAllMaterials();
      persistAll([newItem, ...all]);
      toast.success("Course material uploaded successfully");
      setDialogOpen(false);
      setSelectedCourse("");
      setSelectedType("");
      setDocTitle("");
      setFile(null);
    } catch {
      toast.error("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-heading font-bold text-foreground">Course Materials</h1>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#1d3557] hover:bg-[#2c4e7d] text-white font-bold rounded-xl transition-all shadow-md active:scale-95 h-9 px-4 text-[12px]">
                Upload
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Upload Course Material</DialogTitle>
                <DialogDescription>Add a new document to your course repository.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleUpload} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Course</Label>
                  <Select required value={selectedCourse} onValueChange={setSelectedCourse}>
                    <SelectTrigger><SelectValue placeholder="Select course" /></SelectTrigger>
                    <SelectContent>
                      {myCourses.length > 0 ? (
                        myCourses.map((c) => (
                          <SelectItem key={c.courseCode} value={c.courseCode}>
                            {c.courseCode} - {c.courseName}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="CS301">CS301 - Software Engineering</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Material Type</Label>
                  <Select required value={selectedType} onValueChange={(v) => setSelectedType(v as MaterialType)}>
                    <SelectTrigger><SelectValue placeholder="Select document type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="outline">Course Outline / Syllabus</SelectItem>
                      <SelectItem value="notes">Lecture Notes (PDF/Slides)</SelectItem>
                      <SelectItem value="scheme">Marking Scheme</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Document Title</Label>
                  <Input
                    required
                    value={docTitle}
                    onChange={(e) => setDocTitle(e.target.value)}
                    placeholder="e.g. Chapter 1 Slides"
                  />
                </div>
                <div className="space-y-2">
                  <Label>File Upload</Label>
                  <Input
                    type="file"
                    required
                    className="cursor-pointer"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  />
                </div>
                <div className="pt-2 flex justify-end">
                  <Button
                    type="submit"
                    disabled={isUploading}
                    className="bg-[#1d3557] hover:bg-[#2c4e7d] text-white font-bold rounded-xl transition-all shadow-md active:scale-95 h-9 px-4 text-[12px]"
                  >
                    {isUploading ? "Uploading..." : "Upload Document"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="border-border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-heading">Uploaded</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 overflow-x-auto">
            <Input
              ref={replaceInputRef}
              type="file"
              className="hidden"
              onChange={(e) => handleReplaceSelected(e.target.files?.[0] ?? null)}
            />
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[11px] uppercase tracking-wider">Title</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider">Course</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider">Type</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider">Actions</TableHead>
                  <TableHead className="text-right text-[11px] uppercase tracking-wider">Uploaded</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myMaterials.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                      No materials uploaded yet.
                    </TableCell>
                  </TableRow>
                ) : myMaterials.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="text-xs font-semibold text-foreground">
                      <div className="space-y-0.5">
                        <p className="leading-tight">{m.title}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{m.fileName}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs font-medium text-foreground">{m.courseCode}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-[10px] ${
                        m.materialType === "outline" ? "bg-purple-50 text-purple-700 border-purple-200" :
                        m.materialType === "notes" ? "bg-blue-50 text-blue-700 border-blue-200" :
                        "bg-emerald-50 text-emerald-700 border-emerald-200"
                      }`}>
                        {labelForType(m.materialType)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 px-2 text-[10px]"
                          onClick={() => handleOpen(m)}
                        >
                          Open
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 px-2 text-[10px]"
                          onClick={() => startReplace(m.id)}
                        >
                          Replace
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="h-7 px-2 text-[10px]"
                          onClick={() => handleDelete(m.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-[10px] text-muted-foreground">
                      {format(new Date(m.uploadedAt), "MMM d, yyyy")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default LecturerCourseMaterialsPage;
