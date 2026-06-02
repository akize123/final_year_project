import { apiRequest, apiUpload } from "@/lib/api";
import type { DocumentUploadResponse, FypResponse } from "../types";

export function listFyp() {
  return apiRequest<FypResponse[]>("/api/v1/student/fyp");
}

export function createFyp(body: {
  title: string;
  abstractText?: string;
  keywords?: string;
  department?: string;
  projectType?: string;
  academicYear?: string;
}) {
  return apiRequest<FypResponse>("/api/v1/student/fyp", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function uploadFypDoc(
  fypId: string,
  type: "thesis" | "report" | "code-archive",
  file: File,
) {
  const fd = new FormData();
  fd.append("file", file);
  return apiUpload<DocumentUploadResponse>(
    `/api/v1/student/fyp/${fypId}/${type}`,
    fd,
  );
}

export function submitFyp(fypId: string) {
  return apiRequest<FypResponse>(`/api/v1/student/fyp/${fypId}/submit`, {
    method: "POST",
  });
}

export function deleteFyp(fypId: string) {
  return apiRequest<void>(`/api/v1/student/fyp/${fypId}`, { method: "DELETE" });
}
