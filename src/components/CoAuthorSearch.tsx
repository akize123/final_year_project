import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, X, UserPlus, Loader2 } from "lucide-react";
import { AuthorProfileCard } from "@/components/AuthorProfileCard";
import type { AuthorProfile } from "@/data/mockData";

// Mock student directory for lookup
const STUDENT_DIRECTORY: AuthorProfile[] = [
  { name: "Grace Uwimana", initials: "GU", role: "Student", email: "g.uwimana@auca.ac.rw", department: "Computer Science", campusId: "AUCA-2022-0289", year: "Year 5" },
  { name: "Eric Habimana", initials: "EH", role: "Student", email: "e.habimana@auca.ac.rw", department: "Information Technology", campusId: "AUCA-2023-0198", year: "Year 4" },
  { name: "David Mugabo", initials: "DM", role: "Student", email: "d.mugabo@auca.ac.rw", department: "Computer Science", campusId: "AUCA-2022-0312", year: "Year 5" },
  { name: "Patrick Kamanzi", initials: "PK", role: "Student", email: "p.kamanzi@auca.ac.rw", department: "Engineering", campusId: "AUCA-2023-0256", year: "Year 4" },
  { name: "Diane Mukamana", initials: "DK", role: "Student", email: "d.mukamana@auca.ac.rw", department: "Information Technology", campusId: "AUCA-2023-0301", year: "Year 3" },
  { name: "Samuel Nshimiye", initials: "SN", role: "Student", email: "s.nshimiye@auca.ac.rw", department: "Computer Science", campusId: "AUCA-2024-0045", year: "Year 2" },
  { name: "Claudine Iradukunda", initials: "CI", role: "Student", email: "c.iradukunda@auca.ac.rw", department: "Economics", campusId: "AUCA-2023-0178", year: "Year 4" },
  { name: "Thierry Bizimana", initials: "TB", role: "Student", email: "t.bizimana@auca.ac.rw", department: "Engineering", campusId: "AUCA-2022-0410", year: "Year 5" },
];

interface CoAuthorSearchProps {
  coAuthors: AuthorProfile[];
  onAdd: (author: AuthorProfile) => void;
  onRemove: (campusId: string) => void;
  currentUserCampusId?: string;
}

export function CoAuthorSearch({ coAuthors, onAdd, onRemove, currentUserCampusId }: CoAuthorSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AuthorProfile[]>([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = (value: string) => {
    setQuery(value);
    if (value.trim().length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setSearching(true);
    setShowResults(true);

    // Simulate async lookup
    setTimeout(() => {
      const q = value.toLowerCase();
      const found = STUDENT_DIRECTORY.filter(
        (s) =>
          (s.campusId?.toLowerCase().includes(q) || s.name.toLowerCase().includes(q) || s.email?.toLowerCase().includes(q)) &&
          s.campusId !== currentUserCampusId &&
          !coAuthors.some((c) => c.campusId === s.campusId)
      );
      setResults(found);
      setSearching(false);
    }, 400);
  };

  return (
    <div className="space-y-3">
      <Label className="flex items-center gap-2">
        <UserPlus className="w-4 h-4 text-primary" /> Co-Authors (Optional)
      </Label>
      <p className="text-xs text-muted-foreground">Search by campus ID, name, or email to add co-authors.</p>

      {/* Search input */}
      <div className="relative" ref={wrapperRef}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => query.trim().length >= 2 && setShowResults(true)}
            placeholder="e.g. AUCA-2023-0198 or Eric Habimana"
            className="pl-9"
          />
        </div>

        {/* Results dropdown */}
        {showResults && (
          <div className="absolute z-50 mt-1 w-full bg-card border border-border rounded-xl shadow-lg max-h-64 overflow-y-auto">
            {searching ? (
              <div className="flex items-center justify-center gap-2 p-4 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" /> Searching AUCA directory…
              </div>
            ) : results.length === 0 ? (
              <div className="p-4 text-sm text-muted-foreground text-center">
                {query.trim().length < 2 ? "Type at least 2 characters" : "No students found matching your search."}
              </div>
            ) : (
              results.map((student) => (
                <button
                  key={student.campusId}
                  type="button"
                  onClick={() => {
                    onAdd(student);
                    setQuery("");
                    setResults([]);
                    setShowResults(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/50 transition-colors border-b border-border last:border-0"
                >
                  <div className="w-9 h-9 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center shrink-0">
                    {student.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{student.name}</p>
                    <p className="text-xs text-muted-foreground">{student.campusId} · {student.department}</p>
                  </div>
                  <Badge variant="outline" className="text-[10px] bg-primary/5 text-primary border-primary/20 shrink-0">Add</Badge>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* Added co-authors */}
      {coAuthors.length > 0 && (
        <div className="space-y-2">
          {coAuthors.map((author) => (
            <div key={author.campusId} className="relative">
              <AuthorProfileCard author={author} />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6 text-muted-foreground hover:text-destructive"
                onClick={() => onRemove(author.campusId!)}
              >
                <X className="w-3.5 h-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
