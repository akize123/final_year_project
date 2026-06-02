import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import type { UserRole } from "@/types/user";
import { loginApi } from "@/api/auth";
import {
  getAuthToken,
  setAuthToken,
  clearAuthToken,
  getStoredUser,
  setStoredUser,
} from "@/lib/auth-token";
import { useMocks } from "@/lib/api";

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

const MOCK_USERS: Record<string, User> = {
  "student@auca.ac.rw": {
    id: "u1",
    name: "Jean Pierre Habimana",
    email: "student@auca.ac.rw",
    role: "student",
    department: "Information Technology",
    campusId: "AUCA-2023-0147",
    year: "Year 4",
    avatarInitials: "JH",
  },
  "lecturer@auca.ac.rw": {
    id: "u2",
    name: "Dr. Sarah Mugisha",
    email: "lecturer@auca.ac.rw",
    role: "lecturer",
    department: "Computer Science",
    campusId: "AUCA-FAC-0032",
    avatarInitials: "SM",
  },
  "hod@auca.ac.rw": {
    id: "u5",
    name: "Dr. Robert Mugabo",
    email: "hod@auca.ac.rw",
    role: "hod",
    department: "Information Technology",
    campusId: "AUCA-HOD-0004",
    avatarInitials: "RM",
  },
  "moderator@auca.ac.rw": {
    id: "u3",
    name: "Alice Uwimana",
    email: "moderator@auca.ac.rw",
    role: "moderator",
    department: "Library Services",
    campusId: "AUCA-MOD-0008",
    avatarInitials: "AU",
  },
  "admin@auca.ac.rw": {
    id: "u4",
    name: "Prof. Emmanuel Nkurunziza",
    email: "admin@auca.ac.rw",
    role: "admin",
    department: "Academic Affairs",
    campusId: "AUCA-ADM-0001",
    avatarInitials: "EN",
  },
  "exam@auca.ac.rw": {
    id: "u6",
    name: "Exam Office Admin",
    email: "exam@auca.ac.rw",
    role: "exam_office",
    department: "Examination Office",
    campusId: "AUCA-EXM-0001",
    avatarInitials: "EO",
  },
};

function mapBackendRole(role: string): UserRole {
  const r = role.toLowerCase();
  if (r === "student") return "student";
  if (r === "lecturer") return "lecturer";
  if (r === "moderator") return "moderator";
  if (r === "admin") return "admin";
  return "student";
}

function userFromAuthResponse(data: {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  department?: string;
  academicYear?: string;
}): User {
  const name = `${data.firstName} ${data.lastName}`.trim();
  const initials =
    `${data.firstName?.[0] ?? ""}${data.lastName?.[0] ?? ""}`.toUpperCase() || "U";
  return {
    id: data.userId,
    name,
    email: data.email,
    role: mapBackendRole(data.role),
    department: data.department ?? "",
    campusId: data.userId.slice(0, 8),
    year: data.academicYear,
    avatarInitials: initials,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = getStoredUser();
    if (stored && getAuthToken()) {
      try {
        return JSON.parse(stored) as User;
      } catch {
        return null;
      }
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) setStoredUser(JSON.stringify(user));
  }, [user]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      if (useMocks) {
        await new Promise((r) => setTimeout(r, 800));
        const found = MOCK_USERS[email.toLowerCase()];
        if (!found) throw new Error("ERR-VER-404");
        setUser(found);
        return;
      }

      try {
        const response = await loginApi({ email, password: password || "demo" });
        setAuthToken(response.token);
        const mapped = userFromAuthResponse(response);
        setUser(mapped);
        setStoredUser(JSON.stringify(mapped));
      } catch {
        const found = MOCK_USERS[email.toLowerCase()];
        if (!found) throw new Error("ERR-VER-404");
        setUser(found);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    clearAuthToken();
  };

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
