import { FormEvent, useState } from "react";
import { toast } from "sonner";
import {
  FYP_GENDER_OPTIONS,
  type FypProfileInput,
  type FypStudentProfile,
} from "@/data/fyp-project";

interface FypStudentProfileFormProps {
  initial?: FypStudentProfile | null;
  defaultValues?: Partial<FypProfileInput>;
  onSubmit: (input: FypProfileInput) => Promise<void>;
  onCancel?: () => void;
}

export function FypStudentProfileForm({
  initial,
  defaultValues,
  onSubmit,
  onCancel,
}: FypStudentProfileFormProps) {
  const [values, setValues] = useState<FypProfileInput>({
    fullName: initial?.fullName ?? defaultValues?.fullName ?? "",
    registrationNumber:
      initial?.registrationNumber ?? defaultValues?.registrationNumber ?? "",
    email: initial?.email ?? defaultValues?.email ?? "",
    phoneNumber: initial?.phoneNumber ?? defaultValues?.phoneNumber ?? "",
    gender: initial?.gender ?? defaultValues?.gender ?? "",
    nationality: initial?.nationality ?? defaultValues?.nationality ?? "",
    biography: initial?.biography ?? defaultValues?.biography ?? "",
    skills: initial?.skills ?? defaultValues?.skills ?? "",
  });
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const set = (name: keyof FypProfileInput, value: string) =>
    setValues((v) => ({ ...v, [name]: value }));

  const canContinue =
    values.fullName.trim() &&
    values.registrationNumber.trim() &&
    values.email.trim() &&
    values.phoneNumber.trim() &&
    values.gender;

  const handleNext = (e: FormEvent) => {
    e.preventDefault();
    if (!canContinue) {
      toast.error("Please complete the visible fields before continuing.");
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (
      !values.fullName.trim() ||
      !values.registrationNumber.trim() ||
      !values.email.trim() ||
      !values.phoneNumber.trim() ||
      !values.gender ||
      !values.nationality.trim() ||
      !values.biography.trim() ||
      !values.skills.trim()
    ) {
      toast.error("Please fill in all required fields on this page.");
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        fullName: values.fullName.trim(),
        registrationNumber: values.registrationNumber.trim(),
        email: values.email.trim(),
        phoneNumber: values.phoneNumber.trim(),
        gender: values.gender,
        nationality: values.nationality.trim() || "",
        biography: values.biography.trim() || "",
        skills: values.skills.trim() || "",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="ds-fyp-create-form" onSubmit={step === 1 ? handleNext : handleSubmit}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <span className="ds-text-secondary" style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.16em" }}>
          Step {step} of 2
        </span>
        <span className="ds-text-secondary" style={{ fontSize: 12 }}>
          {step === 1 ? "Basic profile details" : "Additional profile details"}
        </span>
      </div>

      <div className="ds-fyp-form-grid">
        <div className="ds-form-group ds-fyp-form-span-2">
          <label className="ds-form-label" htmlFor="fyp-full-name">
            Full Name <span className="ds-required">*</span>
          </label>
          <input
            id="fyp-full-name"
            type="text"
            className="ds-form-input"
            placeholder="Jean Pierre Habimana"
            value={values.fullName}
            onChange={(e) => set("fullName", e.target.value)}
            required
          />
        </div>

        <div className="ds-form-group">
          <label className="ds-form-label" htmlFor="fyp-reg">
            Registration Number <span className="ds-required">*</span>
          </label>
          <input
            id="fyp-reg"
            type="text"
            className="ds-form-input"
            placeholder="AUCA-2023-0147"
            value={values.registrationNumber}
            onChange={(e) => set("registrationNumber", e.target.value)}
            required
          />
        </div>

        <div className="ds-form-group">
          <label className="ds-form-label" htmlFor="fyp-email">
            Email Address <span className="ds-required">*</span>
          </label>
          <input
            id="fyp-email"
            type="email"
            className="ds-form-input"
            placeholder="student@auca.ac.rw"
            value={values.email}
            onChange={(e) => set("email", e.target.value)}
            required
          />
        </div>

        <div className="ds-form-group">
          <label className="ds-form-label" htmlFor="fyp-phone">
            Phone Number <span className="ds-required">*</span>
          </label>
          <input
            id="fyp-phone"
            type="tel"
            className="ds-form-input"
            placeholder="+250 788 000 000"
            value={values.phoneNumber}
            onChange={(e) => set("phoneNumber", e.target.value)}
            required
          />
        </div>

        <div className="ds-form-group">
          <label className="ds-form-label" htmlFor="fyp-gender">
            Gender <span className="ds-required">*</span>
          </label>
          <select
            id="fyp-gender"
            className="ds-form-select"
            value={values.gender}
            onChange={(e) => set("gender", e.target.value)}
            required
          >
            <option value="">Select…</option>
            {FYP_GENDER_OPTIONS.map((g) => (
              <option key={g.value} value={g.value}>
                {g.label}
              </option>
            ))}
          </select>
        </div>

        {step === 1 && (
          <div className="ds-form-group ds-fyp-form-span-2" style={{ marginTop: 4 }}>
            <div className="ds-fyp-inline-cta" style={{ justifyContent: "flex-start", marginTop: 0 }}>
              <button
                type="submit"
                className="ds-schedule-btn ds-schedule-btn-primary"
                style={{ minHeight: 36, padding: "0 14px", fontSize: 13 }}
                disabled={loading}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <>
            <div className="ds-form-group ds-fyp-form-span-2">
              <label className="ds-form-label" htmlFor="fyp-nationality">
                Nationality <span className="ds-required">*</span>
              </label>
              <input
                id="fyp-nationality"
                type="text"
                className="ds-form-input"
                placeholder="Rwandan"
                value={values.nationality}
                onChange={(e) => set("nationality", e.target.value)}
                required
              />
            </div>

            <div className="ds-form-group ds-fyp-form-span-2">
              <label className="ds-form-label" htmlFor="fyp-bio">
                Biography / About <span className="ds-required">*</span>
              </label>
              <textarea
                id="fyp-bio"
                className="ds-form-textarea"
                rows={2}
                placeholder="A short professional summary for your portfolio profile…"
                value={values.biography}
                onChange={(e) => set("biography", e.target.value)}
                required
              />
            </div>

            <div className="ds-form-group ds-fyp-form-span-2">
              <label className="ds-form-label" htmlFor="fyp-skills">
                Skills <span className="ds-required">*</span>
              </label>
              <textarea
                id="fyp-skills"
                className="ds-form-textarea"
                rows={1}
                placeholder="React, Python, UI/UX, Research writing (comma-separated)"
                value={values.skills}
                onChange={(e) => set("skills", e.target.value)}
                required
              />
            </div>
          </>
        )}
      </div>

      <div className="ds-fyp-form-actions">
        {step === 2 && (
          <button
            type="button"
            className="ds-schedule-btn ds-schedule-btn-outline"
            onClick={() => setStep(1)}
          >
            Back
          </button>
        )}
        {onCancel && (
          <button type="button" className="ds-schedule-btn ds-schedule-btn-outline" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="ds-schedule-btn ds-schedule-btn-primary"
          style={{ minHeight: 36, padding: "0 14px", fontSize: 13 }}
          disabled={loading}
        >
          {loading ? "Saving…" : step === 1 ? "Continue" : initial ? "Update profile" : "Save profile"}
        </button>
      </div>
    </form>
  );
}
