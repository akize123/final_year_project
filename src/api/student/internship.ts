import { apiRequest, apiUpload } from "@/lib/api";
import type { DocumentUploadResponse, InternshipResponse } from "../types";

export function listInternships() {
  return apiRequest<InternshipResponse[]>("/api/v1/student/internship");
}

export function createInternship(body: {
  companyName: string;
  supervisorName?: string;
  supervisorEmail?: string;
  startDate: string;
  endDate: string;
  department?: string;
  academicYear?: string;
}) {
  return apiRequest<InternshipResponse>("/api/v1/student/internship", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function uploadInternshipDoc(
  internshipId: string,
  type: "recommendation-letter" | "acceptance-letter" | "logbook" | "report",
  file: File,
) {
  const fd = new FormData();
  fd.append("file", file);
  return apiUpload<DocumentUploadResponse>(
    `/api/v1/student/internship/${internshipId}/${type}`,
    fd,
  );
}

export function listInternshipDocuments(internshipId: string) {
  return apiRequest<DocumentUploadResponse[]>(
    `/api/v1/student/internship/${internshipId}/documents`,
  );
}
