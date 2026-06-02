import { getAuthToken } from "./auth-token";

export async function downloadAuthenticatedFile(
  path: string,
  filename: string,
): Promise<void> {
  const base = import.meta.env.VITE_API_BASE_URL ?? "";
  const token = getAuthToken();
  const res = await fetch(`${base}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error("Download failed");
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
