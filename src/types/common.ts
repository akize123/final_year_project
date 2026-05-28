export interface Department {
  code: string;
  name: string;
  faculty: string;
  hodName?: string;
  hodEmail?: string;
  studentCount?: number;
  staffCount?: number;
}

export interface Notification {
  id: string;
  userId: string;
  type: "approved" | "rejected" | "review" | "reservation" | "reminder" | "reupload" | "system" | "renewal" | "attendance" | "eligibility";
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}

export interface Reservation {
  id: string;
  userId: string;
  projectId: string;
  projectTitle: string;
  slotStart: string;
  slotEnd: string;
  status: "upcoming" | "active" | "completed" | "cancelled" | "waitlisted";
  createdAt: string;
}

export interface ModerationEntry {
  id: string;
  itemId: string;
  itemTitle: string;
  moderator: string;
  action: "Approved" | "Rejected" | "Requested Re-upload" | "Marked Duplicate" | "Hidden" | "Archived";
  reason: string;
  createdAt: string;
}

export interface AuditEntry {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entityType: string;
  entityId: string;
  timestamp: string;
  details: string;
  ip?: string;
}

export interface TeachingLogEntry {
  id: string;
  lecturerId: string;
  courseCode: string;
  courseName: string;
  date: string;
  topicsCovered: string;
  duration: number; // minutes
  notes: string;
  semester: string;
}

/* ─── Attendance tracking ─── */

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  campusId: string;
  courseCode: string;
  courseName: string;
  date: string;
  status: "present" | "absent" | "late" | "excused";
  semester: string;
}

export interface AttendanceSummary {
  studentId: string;
  studentName: string;
  campusId: string;
  courseCode: string;
  courseName: string;
  totalSessions: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  attendancePct: number;
  eligible: boolean;    // >= 75%
}

/* ─── Document verification / classification ─── */

export type VerificationStatus = "verified" | "partial" | "failed" | "pending";

export interface DocumentVerification {
  id: string;
  documentId: string;
  fileName: string;
  uploadedBy: string;
  uploadDate: string;
  detectedType: string | null;
  confidence: number;           // 0-100
  status: VerificationStatus;
  keywordsFound: string[];
  requiredElements: {
    label: string;
    found: boolean;
  }[];
  stampCount: number;
  signatureDetected: boolean;
  ocrText: string;              // extracted text snippet
}

/* ─── Student academic records ─── */

export interface AcademicRecord {
  id: string;
  studentId: string;
  type: "transcript" | "registration_form" | "clearance_form" | "attendance_form" | "tuition_receipt" | "internship_letter" | "internship_logbook" | "internship_report";
  title: string;
  semester: string;
  uploadDate: string;
  status: "uploaded" | "verified" | "rejected" | "pending_verification";
  verificationId?: string;
  fileSize: string;
}

/* ─── Exam Office ─── */

export interface ExamTimetableEntry {
  id: string;
  courseCode: string;
  courseName: string;
  department: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  seatCapacity: number;
  invigilator: string;
}

export interface SeatingArrangement {
  id: string;
  examId: string;
  courseCode: string;
  venue: string;
  rows: number;
  columns: number;
  totalSeats: number;
  assignedStudents: number;
}

/* ─── Internship records ─── */

export interface InternshipRecord {
  id: string;
  studentId: string;
  companyName: string;
  position: string;
  startDate: string;
  endDate: string;
  supervisorName: string;
  status: "active" | "completed" | "pending_report";
  hasAcceptanceLetter: boolean;
  hasLogbook: boolean;
  hasFinalReport: boolean;
}

/** Chart color constants per the design system */
export const CHART_COLORS = {
  projects: "#378ADD",
  theses: "#1D9E75",
  publications: "#BA7517",
  staff: "#7F77DD",
  rejected: "#D85A30",
  pending: "#EF9F27",
  present: "#1D9E75",
  absent: "#DC2626",
  late: "#EF9F27",
  excused: "#0EA5E9",
} as const;
