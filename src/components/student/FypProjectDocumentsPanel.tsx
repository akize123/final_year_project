import {
  FYP_DOCUMENT_SPECS,
  getProjectDocuments,
  type FypDocumentType,
  type StoredFypProject,
} from "@/data/fyp-project";
import { FypDocumentDropzone } from "./FypDocumentDropzone";

interface FypProjectDocumentsPanelProps {
  project: StoredFypProject;
  onUpload: (type: FypDocumentType, file: File) => Promise<void>;
  onRemove: (docId: string) => void;
}

export function FypProjectDocumentsPanel({
  project,
  onUpload,
  onRemove,
}: FypProjectDocumentsPanelProps) {
  return (
    <div className="ds-fyp-docs-grid">
      {FYP_DOCUMENT_SPECS.map((spec) => (
        <FypDocumentDropzone
          key={spec.type}
          type={spec.type}
          files={getProjectDocuments(project, spec.type)}
          onUpload={(file) => onUpload(spec.type, file)}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}
