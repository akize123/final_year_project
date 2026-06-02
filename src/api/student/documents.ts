import { apiRequest, apiUpload, type PagedResponse } from "@/lib/api";
import type { DocumentCategory, DocumentUploadResponse } from "../types";

export function listDocuments(
  category: DocumentCategory,
  page = 0,
  size = 20,
  semester?: string,
): Promise<PagedResponse<DocumentUploadResponse>> {
  const params = new URLSearchParams({
    category,
    page: String(page),
    size: String(size),
  });
  if (semester) params.set("semester", semester);
  return apiRequest(`/api/v1/student/documents?${params}`);
}

export function uploadDocument(
  file: File,
  fields: {
    category: DocumentCategory;
    documentType: string;
    semester?: string;
    academicYear?: string;
    description?: string;
    parentEntityId?: string;
  },
): Promise<DocumentUploadResponse> {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("category", fields.category);
  fd.append("documentType", fields.documentType);
  if (fields.semester) fd.append("semester", fields.semester);
  if (fields.academicYear) fd.append("academicYear", fields.academicYear);
  if (fields.description) fd.append("description", fields.description);
  if (fields.parentEntityId) fd.append("parentEntityId", fields.parentEntityId);
  return apiUpload("/api/v1/student/documents/upload", fd);
}

export function deleteDocument(documentId: string): Promise<void> {
  return apiRequest(`/api/v1/student/documents/${documentId}`, { method: "DELETE" });
}

export function getPreviewUrl(documentId: string): Promise<string> {
  return apiRequest(`/api/v1/student/documents/${documentId}/preview-url`);
}

export function downloadDocumentUrl(documentId: string): string {
  const base = import.meta.env.VITE_API_BASE_URL ?? "";
  return `${base}/api/v1/student/documents/${documentId}/download`;
}
