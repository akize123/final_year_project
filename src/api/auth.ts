import { apiRequest } from "@/lib/api";
import type { AuthResponse } from "./types";

export interface LoginPayload {
  email: string;
  password: string;
}

export async function loginApi(payload: LoginPayload): Promise<AuthResponse> {
  return apiRequest<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
