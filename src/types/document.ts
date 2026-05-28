/** All document types supported by the archive system */
export type DocumentType =
  // Student academic records
  | "final_year_project"
  | "internship_report"
  | "research_paper"
  | "official_transcript"
  | "registration_form"
  | "clearance_form"
  | "attendance_form"
  | "tuition_receipt"
  | "financial_clearance"
  | "graduation_clearance"
  // Internship & industrial training
  | "internship_letter"
  | "internship_logbook"
  // Staff / Lecturer
  | "course_outline"
  | "lecture_notes"
  | "marking_scheme"
  | "teaching_log"
  | "exam_paper"
  | "research_publication"
  | "evaluation_report"
  | "lecturer_grades"
  // HOD / Exam Office
  | "moderated_exam"
  | "approved_exam"
  | "exam_timetable"
  | "seating_arrangement"
  | "eligibility_list"
  | "marks_moderation_report"
  | "grade_distribution_report"
  | "teaching_progress_report"
  | "graduation_list"
  | "curriculum_structure"
  | "course_allocation_list"
  | "department_policy"
  | "academic_calendar"
  | "recommendation_letter"
  // Reports
  | "plagiarism_report"
  | "academic_warning"
  | "probation_notice";

export type DocumentStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "approved"
  | "published"
  | "rejected"
  | "archived"
  | "duplicate"
  | "hidden";

export type AvailabilityStatus =
  | "Available"
  | "Reserve to Access"
  | "Fully Reserved"
  | "AUCA Only";

export type DocumentLevel =
  | "Undergraduate"
  | "Postgraduate"
  | "Faculty Research"
  | "Administrative";

export interface DocumentGithub {
  repoName: string;
  repoUrl: string;
  description: string;
  visibility: "public" | "private";
  finalCommit: string;
  finalTag: string;
  readme: string;
  stars: number;
  forks: number;
  languages: string[];
}

export interface Document {
  id: string;
  title: string;
  type: DocumentType;
  typeLabel: string;
  authors: AuthorProfile[];
  supervisor?: string;
  department: string;
  year: string;
  level: DocumentLevel;
  abstract: string;
  keywords: string[];
  technologies: string[];
  views: number;
  reservationsMade: number;
  timesAccessed: number;
  hasGithub: boolean;
  availability: AvailabilityStatus;
  status: DocumentStatus;
  submittedDate: string;
  publishedDate: string | null;
  github?: DocumentGithub;
  doi?: string;
  journal?: string;
  visibility?: string;
  memoirPages: number;
  slots: { total: number; reserved: number };
}

export interface AuthorProfile {
  name: string;
  initials: string;
  role: string;
  email?: string;
  department?: string;
  campusId?: string;
  year?: string;
}
