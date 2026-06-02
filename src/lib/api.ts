import { getAuthToken } from "./auth-token";

export interface ApiResponse<T> {
  data: T;
  message: string;
  timestamp?: string;
}

export interface PagedResponse<T> {
  content: T[];
  pageable: { page: number; size: number };
  totalElements: number;
  totalPages: number;
  last: boolean;
}

const useMocks = import.meta.env.VITE_ENABLE_MOCKS === "true";

function baseUrl(): string {
  if (import.meta.env.DEV && !import.meta.env.VITE_API_BASE_URL) {
    return "";
  }
  return import.meta.env.VITE_API_BASE_URL ?? "";
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  if (useMocks) {
    throw new ApiError("Mock mode — no API call", 0);
  }

  const headers = new Headers(options.headers);
  const token = getAuthToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const isFormData = options.body instanceof FormData;
  if (!isFormData && options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${baseUrl()}${path}`, { ...options, headers });

  if (!res.ok) {
    let message = res.statusText;
    try {
      const err = await res.json();
      message = err.message ?? err.error ?? message;
    } catch {
      /* ignore */
    }
    throw new ApiError(message, res.status);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  const contentType = res.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return res as unknown as T;
  }

  const json = await res.json();
  if (json && typeof json === "object" && "data" in json) {
    return (json as ApiResponse<T>).data;
  }
  return json as T;
}

export async function apiUpload<T>(
  path: string,
  formData: FormData,
  method: "POST" | "PATCH" = "POST",
): Promise<T> {
  return apiRequest<T>(path, { method, body: formData });
}

export { useMocks };
