import { useRef, useState } from "react";
import { toast } from "sonner";

export interface UploadField {
  name: string;
  label: string;
  type: "text" | "select" | "textarea";
  required?: boolean;
  options?: { value: string; label: string }[];
  placeholder?: string;
}

interface DocumentUploadFormProps {
  title: string;
  fields?: UploadField[];
  accept?: string;
  fileRequired?: boolean;
  showFileZone?: boolean;
  onSubmit: (file: File | null, values: Record<string, string>) => Promise<void>;
  submitLabel?: string;
}

export function DocumentUploadForm({
  title,
  fields = [],
  accept = ".pdf,.doc,.docx,.jpg,.jpeg,.png",
  fileRequired = true,
  showFileZone = true,
  onSubmit,
  submitLabel = "Upload",
}: DocumentUploadFormProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (fileRequired && !file) {
      toast.error("Please select a file to upload.");
      return;
    }
    for (const f of fields) {
      if (f.required && !values[f.name]?.trim()) {
        toast.error(`${f.label} is required.`);
        return;
      }
    }
    setLoading(true);
    try {
      await onSubmit(file, values);
      toast.success("Document uploaded successfully.");
      setFile(null);
      setValues({});
      if (inputRef.current) inputRef.current.value = "";
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={title ? "ds-card" : ""} style={title ? { marginBottom: 24 } : undefined}>
      {title ? <h3 className="ds-section-heading">{title}</h3> : null}
      <form onSubmit={handleSubmit}>
        {fields.map((field) => (
          <div key={field.name} className="ds-form-group">
            <label className="ds-form-label" htmlFor={field.name}>
              {field.label}
            </label>
            {field.type === "select" ? (
              <select
                id={field.name}
                className="ds-form-select"
                value={values[field.name] ?? ""}
                onChange={(e) =>
                  setValues((v) => ({ ...v, [field.name]: e.target.value }))
                }
                required={field.required}
              >
                <option value="">Select…</option>
                {field.options?.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            ) : field.type === "textarea" ? (
              <textarea
                id={field.name}
                className="ds-form-textarea"
                rows={3}
                placeholder={field.placeholder}
                value={values[field.name] ?? ""}
                onChange={(e) =>
                  setValues((v) => ({ ...v, [field.name]: e.target.value }))
                }
                required={field.required}
              />
            ) : (
              <input
                id={field.name}
                type="text"
                className="ds-form-input"
                placeholder={field.placeholder}
                value={values[field.name] ?? ""}
                onChange={(e) =>
                  setValues((v) => ({ ...v, [field.name]: e.target.value }))
                }
                required={field.required}
              />
            )}
          </div>
        ))}

        {showFileZone && (
          <div
            className="ds-upload-zone"
            onClick={() => inputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
          >
            <input
              ref={inputRef}
              type="file"
              accept={accept}
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
            <p className="ds-body-text" style={{ marginBottom: 8 }}>
              {file ? file.name : "Click to choose a file or drag here"}
            </p>
            <p className="ds-text-secondary">PDF, Word, or image — max 105MB</p>
          </div>
        )}

        <div className="ds-form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Uploading…" : submitLabel}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setFile(null);
              setValues({});
              if (inputRef.current) inputRef.current.value = "";
            }}
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}

