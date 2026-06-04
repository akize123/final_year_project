import type { FypExternalLinks } from "@/data/fyp-project";

export type FypLinkField = keyof FypExternalLinks;

export interface LinkValidationResult {
  valid: boolean;
  error?: string;
}

function parseUrl(raw: string): URL | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  try {
    const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    return new URL(withProtocol);
  } catch {
    return null;
  }
}

export function validateFypLink(field: FypLinkField, raw: string): LinkValidationResult {
  const value = raw.trim();
  if (!value) return { valid: true };

  const url = parseUrl(value);
  if (!url) {
    return { valid: false, error: "Enter a valid URL (include https://)." };
  }

  const host = url.hostname.toLowerCase().replace(/^www\./, "");

  switch (field) {
    case "github":
      if (!host.includes("github.com")) {
        return { valid: false, error: "GitHub link must be on github.com." };
      }
      if (url.pathname === "/" || url.pathname.length < 2) {
        return { valid: false, error: "Enter a full repository URL (e.g. github.com/user/repo)." };
      }
      break;
    case "youtube":
      if (!host.includes("youtube.com") && host !== "youtu.be") {
        return { valid: false, error: "YouTube link must be on youtube.com or youtu.be." };
      }
      break;
    case "googleDrive":
      if (!host.includes("drive.google.com") && !host.includes("docs.google.com")) {
        return {
          valid: false,
          error: "Google Drive link must be on drive.google.com or docs.google.com.",
        };
      }
      break;
    case "liveDemo":
    case "portfolio":
      if (!["http:", "https:"].includes(url.protocol)) {
        return { valid: false, error: "Link must use http or https." };
      }
      break;
    default:
      break;
  }

  return { valid: true };
}

export function validateAllFypLinks(links: FypExternalLinks): LinkValidationResult {
  const fields = Object.keys(links) as FypLinkField[];
  for (const field of fields) {
    const value = links[field];
    if (!value?.trim()) continue;
    const result = validateFypLink(field, value);
    if (!result.valid) return result;
  }
  return { valid: true };
}

export function normalizeFypLink(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  const url = parseUrl(trimmed);
  return url ? url.href : trimmed;
}
