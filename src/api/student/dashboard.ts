import { apiRequest } from "@/lib/api";
import type { DashboardSummaryResponse } from "../types";

export function getDashboardSummary() {
  return apiRequest<DashboardSummaryResponse>("/api/v1/student/dashboard/summary");
}
