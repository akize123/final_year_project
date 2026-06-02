import { ReactNode } from "react";
import { DocumentUploadForm, type UploadField } from "./DocumentUploadForm";

interface DocumentUploadDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  fields?: UploadField[];
  extraContent?: ReactNode;
  fileRequired?: boolean;
  showFileZone?: boolean;
  submitLabel?: string;
  onSubmit: (file: File | null, values: Record<string, string>) => Promise<void>;
}

export function DocumentUploadDialog({
  open,
  onClose,
  title,
  fields,
  extraContent,
  fileRequired = true,
  showFileZone = true,
  submitLabel,
  onSubmit,
}: DocumentUploadDialogProps) {
  if (!open) return null;

  return (
    <div className="ds-modal-overlay" role="presentation" onClick={onClose}>
      <div
        className="ds-modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="upload-dialog-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="ds-modal-header">
          <h3 id="upload-dialog-title" className="ds-section-heading" style={{ margin: 0 }}>
            {title}
          </h3>
          <button type="button" className="ds-modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        {extraContent}
        <DocumentUploadForm
          title=""
          fields={fields}
          fileRequired={fileRequired}
          showFileZone={showFileZone}
          submitLabel={submitLabel}
          onSubmit={async (file, values) => {
            await onSubmit(file, values);
            onClose();
          }}
        />
      </div>
    </div>
  );
}
