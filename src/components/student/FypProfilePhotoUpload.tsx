import { useRef, useState } from "react";
import { Camera, X } from "lucide-react";
import { toast } from "sonner";

const MAX_PHOTO_BYTES = 2 * 1024 * 1024;
const ACCEPT = "image/jpeg,image/png,image/webp";

interface FypProfilePhotoUploadProps {
  currentPhotoUrl?: string;
  onSave: (dataUrl: string) => Promise<void>;
  compact?: boolean;
}

export function FypProfilePhotoUpload({
  currentPhotoUrl,
  onSave,
  compact = false,
}: FypProfilePhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const displayUrl = previewUrl ?? currentPhotoUrl ?? null;

  const pickFile = (file: File | undefined) => {
    if (!file) return;
    if (!ACCEPT.split(",").includes(file.type)) {
      toast.error("Please upload a JPG, PNG, or WebP image.");
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      toast.error("Photo must be 2 MB or smaller.");
      return;
    }
    setPendingFile(file);
    const reader = new FileReader();
    reader.onload = () => setPreviewUrl(reader.result as string);
    reader.onerror = () => toast.error("Could not read image file.");
    reader.readAsDataURL(file);
  };

  const clearPreview = () => {
    setPreviewUrl(null);
    setPendingFile(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleSave = async () => {
    if (!previewUrl) {
      toast.error("Choose a photo to preview first.");
      return;
    }
    setSaving(true);
    try {
      await onSave(previewUrl);
      setPendingFile(null);
      setPreviewUrl(null);
      if (inputRef.current) inputRef.current.value = "";
      toast.success("Profile photo saved.");
    } catch {
      toast.error("Could not save photo.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`ds-fyp-photo-upload${compact ? " compact" : ""}`}>
      <div className="ds-fyp-photo-preview-wrap">
        {displayUrl ? (
          <img src={displayUrl} alt="" className="ds-fyp-photo-preview" />
        ) : (
          <div className="ds-fyp-photo-placeholder" aria-hidden>
            <Camera size={28} strokeWidth={1.75} />
          </div>
        )}
        {previewUrl && (
          <button
            type="button"
            className="ds-fyp-photo-clear"
            aria-label="Clear preview"
            onClick={clearPreview}
          >
            <X size={14} />
          </button>
        )}
      </div>

      <div className="ds-fyp-photo-actions">
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          className="ds-fyp-photo-input"
          onChange={(e) => pickFile(e.target.files?.[0])}
        />
        <button
          type="button"
          className="ds-schedule-btn ds-schedule-btn-outline"
          onClick={() => inputRef.current?.click()}
        >
          {currentPhotoUrl && !previewUrl ? "Change photo" : "Upload profile photo"}
        </button>
        {previewUrl && (
          <>
            <button
              type="button"
              className="ds-schedule-btn ds-schedule-btn-primary"
              disabled={saving}
              onClick={handleSave}
            >
              {saving ? "Saving…" : "Save photo"}
            </button>
            <button
              type="button"
              className="ds-schedule-btn ds-schedule-btn-outline"
              disabled={saving}
              onClick={clearPreview}
            >
              Cancel
            </button>
          </>
        )}
      </div>

      {!compact && (
        <p className="ds-text-secondary ds-fyp-photo-hint">
          JPG, PNG, or WebP · max 2 MB. Preview your photo before saving — it will appear on your
          portfolio profile{pendingFile ? `: ${pendingFile.name}` : ""}.
        </p>
      )}
    </div>
  );
}
