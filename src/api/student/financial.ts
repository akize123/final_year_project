import { apiRequest, apiUpload, type PagedResponse } from "@/lib/api";
import type { DocumentUploadResponse } from "../types";

function buildUpload(
  path: string,
  file: File,
  semester: string,
  academicYear?: string,
  description?: string,
) {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("semester", semester);
  if (academicYear) fd.append("academicYear", academicYear);
  if (description) fd.append("description", description);
  return apiUpload<DocumentUploadResponse>(path, fd);
}

export function listPaymentReceipts(page = 0, size = 20) {
  return apiRequest<PagedResponse<DocumentUploadResponse>>(
    `/api/v1/student/financial/payment-receipts?page=${page}&size=${size}`,
  );
}

export function listExamPermits(page = 0, size = 20) {
  return apiRequest<PagedResponse<DocumentUploadResponse>>(
    `/api/v1/student/financial/exam-permits?page=${page}&size=${size}`,
  );
}

export function getFinancialSummary() {
  return apiRequest<{
    paymentReceipts: number;
    examPermits: number;
    paymentReceiptCount: number;
    examPermitCount: number;
    pendingSemesters: string[];
  }>("/api/v1/student/financial/summary");
}

export function uploadPaymentReceipt(
  file: File,
  semester: string,
  academicYear?: string,
  description?: string,
) {
  return buildUpload(
    "/api/v1/student/financial/payment-receipts",
    file,
    semester,
    academicYear,
    description,
  );
}

export function uploadExamPermit(
  file: File,
  semester: string,
  academicYear?: string,
  description?: string,
) {
  return buildUpload(
    "/api/v1/student/financial/exam-permits",
    file,
    semester,
    academicYear,
    description,
  );
}
