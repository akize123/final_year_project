import type { FypResponse } from "@/api/types";

export const FYP_STORAGE_KEY = "auca_student_fyp_projects";
export const FYP_PROFILE_STORAGE_KEY = "auca_student_fyp_profile";

export const FYP_GENDER_OPTIONS = [
  { value: "female", label: "Female" },
  { value: "male", label: "Male" },
  { value: "non-binary", label: "Non-binary" },
  { value: "prefer-not", label: "Prefer not to say" },
] as const;

export interface FypStudentProfile {
  fullName: string;
  registrationNumber: string;
  email: string;
  phoneNumber: string;
  gender: string;
  nationality: string;
  biography: string;
  skills: string;
  /** Data URL or remote URL for portfolio profile picture */
  profilePhotoUrl?: string;
  updatedAt: string;
}

export interface FypProfileInput {
  fullName: string;
  registrationNumber: string;
  email: string;
  phoneNumber: string;
  gender: string;
  nationality: string;
  biography: string;
  skills: string;
}

export const FYP_PROJECT_CATEGORIES = [
  { value: "research", label: "Research & Thesis" },
  { value: "software", label: "Software Development" },
  { value: "hardware", label: "Hardware / Embedded Systems" },
  { value: "data-ai", label: "Data Science & AI" },
  { value: "design", label: "Design & Multimedia" },
  { value: "business", label: "Business Innovation" },
  { value: "community", label: "Community / Social Impact" },
] as const;

export const FYP_ACADEMIC_YEARS = [
  "2024-2025",
  "2025-2026",
  "2026-2027",
] as const;

export interface FypCreateInput {
  title: string;
  abstractText: string;
  keywords: string;
  department: string;
  academicYear: string;
  supervisorName: string;
  researchArea: string;
  projectCategory: string;
}

export type FypDocumentType =
  | "final-report"
  | "proposal"
  | "presentation"
  | "source-code"
  | "research-media";

export interface FypUploadedDocument {
  id: string;
  type: FypDocumentType;
  filename: string;
  size: number;
  uploadedAt: string;
}

export interface FypExternalLinks {
  github?: string;
  liveDemo?: string;
  youtube?: string;
  googleDrive?: string;
  portfolio?: string;
}

export const FYP_DOCUMENT_SPECS: {
  type: FypDocumentType;
  label: string;
  hint: string;
  accept: string;
  maxMb: number;
}[] = [
  {
    type: "final-report",
    label: "Final Report",
    hint: "PDF or DOCX",
    accept: ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    maxMb: 15,
  },
  {
    type: "proposal",
    label: "Proposal",
    hint: "PDF or DOCX",
    accept: ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    maxMb: 10,
  },
  {
    type: "presentation",
    label: "Presentation Slides",
    hint: "PDF, PPT, or PPTX",
    accept: ".pdf,.ppt,.pptx,application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation",
    maxMb: 20,
  },
  {
    type: "source-code",
    label: "Source Code ZIP",
    hint: "ZIP archive only",
    accept: ".zip,application/zip,application/x-zip-compressed",
    maxMb: 50,
  },
  {
    type: "research-media",
    label: "Research Images / Videos",
    hint: "Images or video files",
    accept: "image/*,video/*,.jpg,.jpeg,.png,.webp,.mp4,.mov,.webm",
    maxMb: 100,
  },
];

export const FYP_LINK_FIELDS: {
  key: keyof FypExternalLinks;
  label: string;
  placeholder: string;
}[] = [
  { key: "github", label: "GitHub repository", placeholder: "https://github.com/username/project" },
  { key: "liveDemo", label: "Live deployed system", placeholder: "https://myapp.example.com" },
  { key: "youtube", label: "YouTube demo video", placeholder: "https://youtube.com/watch?v=…" },
  {
    key: "googleDrive",
    label: "Google Drive",
    placeholder: "https://drive.google.com/file/d/…",
  },
  { key: "portfolio", label: "Portfolio website", placeholder: "https://yourportfolio.com" },
];

export type StoredFypProject = FypResponse & {
  supervisorName?: string;
  researchArea?: string;
  projectCategory?: string;
  documents?: FypUploadedDocument[];
  externalLinks?: FypExternalLinks;
};

export function documentSpec(type: FypDocumentType) {
  return FYP_DOCUMENT_SPECS.find((s) => s.type === type)!;
}

export function getProjectDocuments(project: StoredFypProject, type: FypDocumentType) {
  return (project.documents ?? []).filter((d) => d.type === type);
}

export function addProjectDocument(
  projectId: string,
  type: FypDocumentType,
  file: File,
): StoredFypProject | null {
  const projects = loadLocalFypProjects();
  const index = projects.findIndex((p) => p.id === projectId);
  if (index < 0) return null;

  const spec = documentSpec(type);
  const maxBytes = spec.maxMb * 1024 * 1024;
  if (file.size > maxBytes) {
    throw new Error(`File exceeds ${spec.maxMb} MB limit for ${spec.label}.`);
  }

  const entry: FypUploadedDocument = {
    id: `doc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type,
    filename: file.name,
    size: file.size,
    uploadedAt: new Date().toISOString(),
  };

  const project = projects[index];
  const existing = project.documents ?? [];
  const documents =
    type === "research-media"
      ? [...existing, entry]
      : [...existing.filter((d) => d.type !== type), entry];
  const updated: StoredFypProject = { ...project, documents };
  projects[index] = updated;
  saveLocalFypProjects(projects);
  return updated;
}

export function removeProjectDocument(projectId: string, docId: string): StoredFypProject | null {
  const projects = loadLocalFypProjects();
  const index = projects.findIndex((p) => p.id === projectId);
  if (index < 0) return null;
  const project = projects[index];
  const updated: StoredFypProject = {
    ...project,
    documents: (project.documents ?? []).filter((d) => d.id !== docId),
  };
  projects[index] = updated;
  saveLocalFypProjects(projects);
  return updated;
}

export function saveProjectExternalLinks(
  projectId: string,
  links: FypExternalLinks,
): StoredFypProject | null {
  const projects = loadLocalFypProjects();
  const index = projects.findIndex((p) => p.id === projectId);
  if (index < 0) return null;
  const updated: StoredFypProject = { ...projects[index], externalLinks: links };
  projects[index] = updated;
  saveLocalFypProjects(projects);
  return updated;
}

export function countUploadedDocTypes(project: StoredFypProject): number {
  const types = new Set((project.documents ?? []).map((d) => d.type));
  return types.size;
}

export function loadLocalFypProjects(): StoredFypProject[] {
  try {
    const raw = localStorage.getItem(FYP_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return [];
}

export function saveLocalFypProjects(projects: StoredFypProject[]) {
  localStorage.setItem(FYP_STORAGE_KEY, JSON.stringify(projects));
}

export function createLocalFyp(input: FypCreateInput): StoredFypProject {
  const project: StoredFypProject = {
    id: `fyp-${Date.now()}`,
    title: input.title.trim(),
    abstractText: input.abstractText.trim(),
    keywords: input.keywords.trim(),
    department: input.department,
    academicYear: input.academicYear,
    supervisorName: input.supervisorName.trim(),
    researchArea: input.researchArea.trim(),
    projectCategory: input.projectCategory,
    projectType: input.projectCategory,
    status: "DRAFT",
    hasThesis: false,
    hasReport: false,
    hasCodeArchive: false,
    githubConnected: false,
    documents: [],
    externalLinks: {},
    createdAt: new Date().toISOString(),
  };
  const list = loadLocalFypProjects();
  saveLocalFypProjects([project, ...list]);
  return project;
}

export function categoryLabel(value: string | undefined): string {
  if (!value) return "—";
  return FYP_PROJECT_CATEGORIES.find((c) => c.value === value)?.label ?? value;
}

export function genderLabel(value: string | undefined): string {
  if (!value) return "—";
  return FYP_GENDER_OPTIONS.find((g) => g.value === value)?.label ?? value;
}

export function loadFypProfile(): FypStudentProfile | null {
  try {
    const raw = localStorage.getItem(FYP_PROFILE_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return null;
}

export function saveFypProfile(input: FypProfileInput): FypStudentProfile {
  const existing = loadFypProfile();
  const profile: FypStudentProfile = {
    fullName: input.fullName.trim(),
    registrationNumber: input.registrationNumber.trim(),
    email: input.email.trim(),
    phoneNumber: input.phoneNumber.trim(),
    gender: input.gender,
    nationality: input.nationality.trim(),
    biography: input.biography.trim(),
    skills: input.skills.trim(),
    profilePhotoUrl: existing?.profilePhotoUrl,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(FYP_PROFILE_STORAGE_KEY, JSON.stringify(profile));
  return profile;
}

export function saveFypProfilePhoto(photoDataUrl: string): FypStudentProfile | null {
  const existing = loadFypProfile();
  if (!existing) return null;
  const profile: FypStudentProfile = {
    ...existing,
    profilePhotoUrl: photoDataUrl,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(FYP_PROFILE_STORAGE_KEY, JSON.stringify(profile));
  return profile;
}
