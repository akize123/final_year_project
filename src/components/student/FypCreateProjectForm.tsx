import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { departments } from "@/data/departments";
import {
  FYP_ACADEMIC_YEARS,
  FYP_PROJECT_CATEGORIES,
  type FypCreateInput,
} from "@/data/fyp-project";

const emptyForm: FypCreateInput = {
  title: "",
  abstractText: "",
  keywords: "",
  department: "",
  academicYear: FYP_ACADEMIC_YEARS[1],
  supervisorName: "",
  researchArea: "",
  projectCategory: "",
};

interface FypCreateProjectFormProps {
  onSubmit: (input: FypCreateInput) => Promise<void>;
  onCancel?: () => void;
}

export function FypCreateProjectForm({ onSubmit, onCancel }: FypCreateProjectFormProps) {
  const [values, setValues] = useState<FypCreateInput>(emptyForm);
  const [loading, setLoading] = useState(false);

  const set = (name: keyof FypCreateInput, value: string) =>
    setValues((v) => ({ ...v, [name]: value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (
      !values.title.trim() ||
      !values.abstractText.trim() ||
      !values.department ||
      !values.academicYear ||
      !values.supervisorName.trim() ||
      !values.researchArea.trim() ||
      !values.projectCategory
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        ...values,
        title: values.title.trim(),
        abstractText: values.abstractText.trim(),
        keywords: values.keywords.trim(),
        supervisorName: values.supervisorName.trim(),
        researchArea: values.researchArea.trim(),
      });
      setValues(emptyForm);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="ds-fyp-create-form" onSubmit={handleSubmit}>
      <div className="ds-fyp-form-grid">
        <div className="ds-form-group ds-fyp-form-span-2">
          <label className="ds-form-label" htmlFor="fyp-title">
            Project Title <span className="ds-required">*</span>
          </label>
          <input
            id="fyp-title"
            type="text"
            className="ds-form-input"
            placeholder="e.g. Blockchain-Based Land Registry for Rwanda"
            value={values.title}
            onChange={(e) => set("title", e.target.value)}
            required
          />
        </div>

        <div className="ds-form-group ds-fyp-form-span-2">
          <label className="ds-form-label" htmlFor="fyp-abstract">
            Abstract <span className="ds-required">*</span>
          </label>
          <textarea
            id="fyp-abstract"
            className="ds-form-textarea"
            rows={5}
            placeholder="Summarize the problem, approach, and expected outcomes…"
            value={values.abstractText}
            onChange={(e) => set("abstractText", e.target.value)}
            required
          />
        </div>

        <div className="ds-form-group ds-fyp-form-span-2">
          <label className="ds-form-label" htmlFor="fyp-keywords">
            Keywords
          </label>
          <input
            id="fyp-keywords"
            type="text"
            className="ds-form-input"
            placeholder="blockchain, land registry, smart contracts (comma-separated)"
            value={values.keywords}
            onChange={(e) => set("keywords", e.target.value)}
          />
        </div>

        <div className="ds-form-group">
          <label className="ds-form-label" htmlFor="fyp-department">
            Department <span className="ds-required">*</span>
          </label>
          <select
            id="fyp-department"
            className="ds-form-select"
            value={values.department}
            onChange={(e) => set("department", e.target.value)}
            required
          >
            <option value="">Select department…</option>
            {departments.map((d) => (
              <option key={d.code} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        <div className="ds-form-group">
          <label className="ds-form-label" htmlFor="fyp-year">
            Academic Year <span className="ds-required">*</span>
          </label>
          <select
            id="fyp-year"
            className="ds-form-select"
            value={values.academicYear}
            onChange={(e) => set("academicYear", e.target.value)}
            required
          >
            {FYP_ACADEMIC_YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <div className="ds-form-group">
          <label className="ds-form-label" htmlFor="fyp-supervisor">
            Supervisor Name <span className="ds-required">*</span>
          </label>
          <input
            id="fyp-supervisor"
            type="text"
            className="ds-form-input"
            placeholder="Dr. Jane Uwase"
            value={values.supervisorName}
            onChange={(e) => set("supervisorName", e.target.value)}
            required
          />
        </div>

        <div className="ds-form-group">
          <label className="ds-form-label" htmlFor="fyp-research">
            Research Area <span className="ds-required">*</span>
          </label>
          <input
            id="fyp-research"
            type="text"
            className="ds-form-input"
            placeholder="e.g. Distributed Systems, FinTech, Public Health Informatics"
            value={values.researchArea}
            onChange={(e) => set("researchArea", e.target.value)}
            required
          />
        </div>

        <div className="ds-form-group ds-fyp-form-span-2">
          <label className="ds-form-label" htmlFor="fyp-category">
            Project Category <span className="ds-required">*</span>
          </label>
          <select
            id="fyp-category"
            className="ds-form-select"
            value={values.projectCategory}
            onChange={(e) => set("projectCategory", e.target.value)}
            required
          >
            <option value="">Select category…</option>
            {FYP_PROJECT_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
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
          {loading ? "Creating…" : "Save project (Step 2)"}
        </button>
      </div>
    </form>
  );
}
