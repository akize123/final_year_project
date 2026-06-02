import { apiRequest, apiUpload, type PagedResponse } from "@/lib/api";
import type { DocumentUploadResponse } from "../types";

function appendOptional(fd: FormData, key: string, value?: string) {
  if (value) fd.append(key, value);
}

export function listTranscripts(page = 0, size = 20) {
  return apiRequest<PagedResponse<DocumentUploadResponse>>(
    `/api/v1/student/academic/transcripts?page=${page}&size=${size}`,
  );
}

export function listRegistrationForms(page = 0, size = 20) {
  return apiRequest<PagedResponse<DocumentUploadResponse>>(
    `/api/v1/student/academic/registration-forms?page=${page}&size=${size}`,
  );
}

export function listExamAttendance(page = 0, size = 20) {
  return apiRequest<PagedResponse<DocumentUploadResponse>>(
    `/api/v1/student/academic/exam-attendance?page=${page}&size=${size}`,
  );
}

export function uploadSemesterTranscript(
  file: File,
  semester: string,
  academicYear?: string,
  description?: string,
) {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("semester", semester);
  appendOptional(fd, "academicYear", academicYear);
  appendOptional(fd, "description", description);
  return apiUpload<DocumentUploadResponse>(
    "/api/v1/student/academic/transcripts/semester",
    fd,
  );
}

export function uploadOfficialTranscript(
  file: File,
  academicYear?: string,
  description?: string,
) {
  const fd = new FormData();
  fd.append("file", file);
  appendOptional(fd, "academicYear", academicYear);
  appendOptional(fd, "description", description);
  return apiUpload<DocumentUploadResponse>(
    "/api/v1/student/academic/transcripts/official",
    fd,
  );
}

export function uploadRegistrationForm(
  file: File,
  semester: string,
  academicYear?: string,
  description?: string,
) {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("semester", semester);
  appendOptional(fd, "academicYear", academicYear);
  appendOptional(fd, "description", description);
  return apiUpload<DocumentUploadResponse>(
    "/api/v1/student/academic/registration-forms",
    fd,
  );
}

export function uploadExamAttendance(
  file: File,
  semester: string,
  academicYear?: string,
  description?: string,
) {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("semester", semester);
  appendOptional(fd, "academicYear", academicYear);
  appendOptional(fd, "description", description);
  return apiUpload<DocumentUploadResponse>(
    "/api/v1/student/academic/exam-attendance",
    fd,
  );
}
