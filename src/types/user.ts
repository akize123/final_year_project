export type UserRole = "student" | "lecturer" | "hod" | "moderator" | "admin" | "exam_office";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  campusId: string;
  year?: string;
  avatarInitials: string;
  status?: "Active" | "Suspended" | "Inactive";
  lastLogin?: string;
}
