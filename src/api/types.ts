export type DocumentCategory = "ACADEMIC" | "FINANCIAL" | "INTERNSHIP" | "FYP" | "CAPSTONE";

export type DocumentStatus = "PENDING" | "VERIFIED" | "REJECTED" | "UPLOADED" | string;

export interface DocumentUploadResponse {
  documentId: string;
  filename: string;
  storagePath?: string;
  previewUrl?: string;
  uploadedAt: string;
  status: DocumentStatus;
  checksum?: string;
  virusScanResult?: string;
  statusMessage?: string;
}

export interface FypResponse {
  id: string;
  title: string;
  abstractText?: string;
  keywords?: string;
  department?: string;
  projectType?: string;
  projectCategory?: string;
  supervisorName?: string;
  researchArea?: string;
  status: string;
  academicYear?: string;
  hasThesis?: boolean;
  hasReport?: boolean;
  hasCodeArchive?: boolean;
  githubConnected?: boolean;
  githubRepositoryUrl?: string;
  createdAt?: string;
  submittedAt?: string;
}

export interface InternshipResponse {
  id: string;
  companyName: string;
  supervisorName?: string;
  supervisorEmail?: string;
  startDate?: string;
  endDate?: string;
  department?: string;
  academicYear?: string;
  status: string;
  completionPercentage?: number;
  hasRecommendationLetter?: boolean;
  hasAcceptanceLetter?: boolean;
  hasLogBook?: boolean;
  hasReport?: boolean;
  createdAt?: string;
}

export interface DashboardSummaryResponse {
  studentId: string;
  academicDocuments?: {
    transcripts?: Record<string, number>;
    registrationForms?: number;
    examAttendance?: number;
    completionRate?: number;
  };
  financialDocuments?: {
    paymentReceipts?: number;
    examPermits?: number;
    pendingSemesters?: string[];
  };
  internship?: {
    totalRecords?: number;
    latestStatus?: string;
    documentsCompletionRate?: number;
  };
  finalYearProject?: {
    exists?: boolean;
    status?: string;
    githubConnected?: boolean;
  };
  recentActivity?: Array<{
    action: string;
    documentType: string;
    timestamp: string;
  }>;
}

export interface AuthResponse {
  userId: string;
  token: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  department?: string;
  academicYear?: string;
  faculty?: string;
}
