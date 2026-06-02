import { useState } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { DataCard } from "@/components/dashboard/DataCard";
import { useLocale } from "@/contexts/LocaleContext";
import type { Locale } from "@/i18n/translations";
import { toast } from "sonner";

export default function StudentSettingsPage() {
  const { locale, setLocale } = useLocale();
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);

  return (
    <div className="ds-page-scroll">
      <PageHeader title="Settings" subtitle="Preferences and notifications" />
      <DataCard label="Preferences">
        <div className="ds-form-group">
          <label className="ds-form-label" htmlFor="language">
            Language
          </label>
          <select
            id="language"
            className="ds-form-select"
            style={{ maxWidth: 280 }}
            value={locale}
            onChange={(e) => setLocale(e.target.value as Locale)}
          >
            <option value="en">English</option>
            <option value="fr">Français</option>
          </select>
        </div>
        <div className="ds-form-group">
          <label className="ds-form-label">
            <input
              type="checkbox"
              checked={emailNotif}
              onChange={(e) => setEmailNotif(e.target.checked)}
              style={{ marginRight: 8 }}
            />
            Email notifications
          </label>
        </div>
        <div className="ds-form-group">
          <label className="ds-form-label">
            <input
              type="checkbox"
              checked={pushNotif}
              onChange={(e) => setPushNotif(e.target.checked)}
              style={{ marginRight: 8 }}
            />
            In-app notifications
          </label>
        </div>
        <div className="ds-form-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => toast.success("Preferences saved.")}
          >
            Save Changes
          </button>
          <button type="button" className="btn btn-secondary">
            Cancel
          </button>
        </div>
      </DataCard>
    </div>
  );
}
