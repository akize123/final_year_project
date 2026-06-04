import { useRef, useState } from "react";
import { FileUp, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { FypDocumentType, FypUploadedDocument } from "@/data/fyp-project";
import { documentSpec } from "@/data/fyp-project";

interface FypDocumentDropzoneProps {
  type: FypDocumentType;
  files: FypUploadedDocument[];
  onUpload: (file: File) => Promise<void>;
  onRemove: (docId: string) => void;
}

function fileMatchesAccept(file: File, accept: string): boolean {
  const tokens = accept.split(",").map((t) => t.trim().toLowerCase());
  const name = file.name.toLowerCase();
  const mime = file.type.toLowerCase();

  return tokens.some((token) => {
    if (token.startsWith(".")) return name.endsWith(token);
    if (token.endsWith("/*")) {
      const prefix = token.slice(0, -1);
      return mime.startsWith(prefix);
    }
    return mime === token;
  });
}

export function FypDocumentDropzone({
  type,
  files,
  onUpload,
  onRemove,
}: FypDocumentDropzoneProps) {
  const spec = documentSpec(type);
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);

  const processFile = async (file: File) => {
    if (!fileMatchesAccept(file, spec.accept)) {
      toast.error(`${spec.label}: use ${spec.hint}.`);
      return;
    }
    setUploading(true);
    try {
      await onUpload(file);
      toast.success(`${spec.label} uploaded.`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void processFile(file);
  };

  return (
    <div className="ds-fyp-doc-slot">
      <div className="ds-fyp-doc-slot-head">
        <h4 className="ds-fyp-doc-slot-title">{spec.label}</h4>
        <span className="ds-fyp-doc-slot-hint">{spec.hint} · max {spec.maxMb} MB</span>
      </div>

      <div
        className={`ds-fyp-dropzone${dragOver ? " drag-over" : ""}${uploading ? " uploading" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => !uploading && inputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        role="button"
        tabIndex={0}
      >
        <input
          ref={inputRef}
          type="file"
          className="ds-fyp-photo-input"
          accept={spec.accept}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void processFile(file);
          }}
        />
        <FileUp size={22} strokeWidth={1.75} aria-hidden />
        <p className="ds-fyp-dropzone-text">
          {uploading ? "Uploading…" : "Drag & drop or click to upload"}
        </p>
      </div>

      {files.length > 0 && (
        <ul className="ds-fyp-doc-file-list">
          {files.map((f) => (
            <li key={f.id} className="ds-fyp-doc-file-item">
              <span className="ds-fyp-doc-file-name" title={f.filename}>
                {f.filename}
              </span>
              <span className="ds-fyp-doc-file-meta">
                {(f.size / 1024 / 1024).toFixed(2)} MB
              </span>
              <button
                type="button"
                className="ds-fyp-doc-remove"
                aria-label={`Remove ${f.filename}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(f.id);
                }}
              >
                <Trash2 size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
