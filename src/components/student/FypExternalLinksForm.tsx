import { FormEvent, useState } from "react";
import { Link2 } from "lucide-react";
import { toast } from "sonner";
import { FYP_LINK_FIELDS, type FypExternalLinks } from "@/data/fyp-project";
import {
  normalizeFypLink,
  validateAllFypLinks,
  validateFypLink,
  type FypLinkField,
} from "@/lib/fyp-link-validator";

interface FypExternalLinksFormProps {
  initial?: FypExternalLinks;
  onSubmit: (links: FypExternalLinks) => Promise<void>;
  onCancel?: () => void;
}

const emptyLinks: FypExternalLinks = {
  github: "",
  liveDemo: "",
  youtube: "",
  googleDrive: "",
  portfolio: "",
};

export function FypExternalLinksForm({ initial, onSubmit, onCancel }: FypExternalLinksFormProps) {
  const [values, setValues] = useState<FypExternalLinks>({ ...emptyLinks, ...initial });
  const [errors, setErrors] = useState<Partial<Record<FypLinkField, string>>>({});
  const [loading, setLoading] = useState(false);

  const setLink = (key: FypLinkField, value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) {
      setErrors((e) => {
        const next = { ...e };
        delete next[key];
        return next;
      });
    }
  };

  const validateField = (key: FypLinkField) => {
    const result = validateFypLink(key, values[key] ?? "");
    if (!result.valid) {
      setErrors((e) => ({ ...e, [key]: result.error }));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const nextErrors: Partial<Record<FypLinkField, string>> = {};
    let valid = true;
    for (const { key } of FYP_LINK_FIELDS) {
      const result = validateFypLink(key, values[key] ?? "");
      if (!result.valid) {
        nextErrors[key] = result.error;
        valid = false;
      }
    }
    setErrors(nextErrors);
    if (!valid) {
      toast.error("Fix invalid links before saving.");
      return;
    }

    const normalized: FypExternalLinks = {};
    for (const { key } of FYP_LINK_FIELDS) {
      const v = normalizeFypLink(values[key] ?? "");
      if (v) normalized[key] = v;
    }

    const check = validateAllFypLinks(normalized);
    if (!check.valid) {
      toast.error(check.error ?? "Invalid link.");
      return;
    }

    const hasAny = Object.values(normalized).some(Boolean);
    if (!hasAny) {
      toast.error("Add at least one external link.");
      return;
    }

    setLoading(true);
    try {
      await onSubmit(normalized);
      toast.success("External links saved.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="ds-fyp-create-form" onSubmit={handleSubmit}>
      <div className="ds-fyp-links-grid">
        {FYP_LINK_FIELDS.map(({ key, label, placeholder }) => (
          <div key={key} className="ds-form-group">
            <label className="ds-form-label" htmlFor={`fyp-link-${key}`}>
              <Link2 size={14} style={{ marginRight: 6, verticalAlign: -2 }} aria-hidden />
              {label}
            </label>
            <input
              id={`fyp-link-${key}`}
              type="url"
              className={`ds-form-input${errors[key] ? " ds-input-invalid" : ""}`}
              placeholder={placeholder}
              value={values[key] ?? ""}
              onChange={(e) => setLink(key, e.target.value)}
              onBlur={() => validateField(key)}
            />
            {errors[key] && (
              <p className="ds-form-error" role="alert">
                {errors[key]}
              </p>
            )}
          </div>
        ))}
      </div>
      <div className="ds-fyp-form-actions">
        {onCancel && (
          <button type="button" className="ds-schedule-btn ds-schedule-btn-outline" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="ds-schedule-btn ds-schedule-btn-primary"
          disabled={loading}
        >
          {loading ? "Saving…" : "Save links"}
        </button>
      </div>
    </form>
  );
}
