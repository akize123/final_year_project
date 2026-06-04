import { toast } from "sonner";

export type DocumentType = "timetable" | "transcript" | "medical" | "general";

interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * An AI Scanner utility that validates documents based on their intended type,
 * checking file format, size limits, and basic heuristics.
 */
export async function validateDocument(
  file: File,
  type: DocumentType = "general"
): Promise<ValidationResult> {
  // 1. File Size Validation (1 MB Limit)
  const maxSizeMB = 1;
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  
  if (file.size > maxSizeBytes) {
    const errorMsg = `File is too large. Maximum size is ${maxSizeMB}MB.`;
    toast.error(errorMsg);
    return { valid: false, error: errorMsg };
  }

  // 2. MIME Type Validation
  const allowedTypes = [
    "application/pdf",
    "image/png",
    "image/jpeg",
    "image/webp"
  ];
  
  if (!allowedTypes.includes(file.type)) {
    const errorMsg = "Invalid format. Please upload a PDF or an image (PNG, JPG).";
    toast.error(errorMsg);
    return { valid: false, error: errorMsg };
  }

  // 3. Document Type Heuristics (Fuzzy Matching on Name for Extra Smartness)
  // This doesn't strictly reject, but warns the user if it looks completely wrong.
  const name = file.name.toLowerCase();
  
  if (type === "timetable") {
    // If it's explicitly named something like "vacation" or "meme", warn them.
    if (name.includes("meme") || name.includes("vacation") || name.includes("selfie")) {
      toast.warning("AI Scanner Warning: This document doesn't look like a timetable, but we will try to process it anyway.");
    }
  }

  // In a real application, you could run Tesseract.js here to extract 
  // text from images or use pdf.js to parse PDF text and look for keywords.

  return { valid: true };
}
