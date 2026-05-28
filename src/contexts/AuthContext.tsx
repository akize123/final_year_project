import { createContext, useContext, useState, ReactNode } from "react";
import type { UserRole } from "@/types/user";

// Re-export the type for backward compatibility
export type { UserRole };

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  campusId: string;
  year?: string;
  avatarInitials: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Mock users for demo
const MOCK_USERS: Record<string, User> = {
  "student@auca.ac.rw": {
    id: "u1", name: "Jean Pierre Habimana", email: "student@auca.ac.rw",
    role: "student", department: "Information Technology", campusId: "AUCA-2023-0147",
    year: "Year 4", avatarInitials: "JH",
  },
  "lecturer@auca.ac.rw": {
    id: "u2", name: "Dr. Sarah Mugisha", email: "lecturer@auca.ac.rw",
    role: "lecturer", department: "Computer Science", campusId: "AUCA-FAC-0032",
    avatarInitials: "SM",
  },
  "hod@auca.ac.rw": {
    id: "u5", name: "Dr. Robert Mugabo", email: "hod@auca.ac.rw",
    role: "hod", department: "Information Technology", campusId: "AUCA-HOD-0004",
    avatarInitials: "RM",
  },
  "moderator@auca.ac.rw": {
    id: "u3", name: "Alice Uwimana", email: "moderator@auca.ac.rw",
    role: "moderator", department: "Library Services", campusId: "AUCA-MOD-0008",
    avatarInitials: "AU",
  },
  "admin@auca.ac.rw": {
    id: "u4", name: "Prof. Emmanuel Nkurunziza", email: "admin@auca.ac.rw",
    role: "admin", department: "Academic Affairs", campusId: "AUCA-ADM-0001",
    avatarInitials: "EN",
  },
  "exam@auca.ac.rw": {
    id: "u6", name: "Exam Office Admin", email: "exam@auca.ac.rw",
    role: "exam_office", department: "Examination Office", campusId: "AUCA-EXM-0001",
    avatarInitials: "EO",
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, _password: string) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    const found = MOCK_USERS[email.toLowerCase()];
    if (!found) throw new Error("ERR-VER-404");
    setUser(found);
    setIsLoading(false);
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
