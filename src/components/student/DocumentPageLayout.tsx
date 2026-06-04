import { ReactNode, useState } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { DataCard } from "@/components/dashboard/DataCard";
import { DocumentTable, type DocumentRow } from "@/components/dashboard/DocumentTable";
import { DocumentUploadDialog } from "@/components/dashboard/DocumentUploadDialog";
import type { UploadField } from "@/components/dashboard/DocumentUploadForm";

interface DocumentPageLayoutProps {
  title: string;
  subtitle?: string;
  headerCentered?: boolean;
  rows: DocumentRow[];
  loading?: boolean;
  uploadDialogTitle: string;
  uploadFields?: UploadField[];
  uploadExtra?: ReactNode;
  onUpload: (file: File | null, values: Record<string, string>) => Promise<void>;
  onPreview?: (id: string) => void;
  onDownload?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function DocumentPageLayout({
  title,
  subtitle,
  headerCentered = false,
  rows,
  loading,
  uploadDialogTitle,
  uploadFields,
  uploadExtra,
  onUpload,
  onPreview,
  onDownload,
  onDelete,
}: DocumentPageLayoutProps) {
  const [uploadOpen, setUploadOpen] = useState(false);
  const verified = rows.filter((r) => String(r.status).toUpperCase().includes("VERIF")).length;
  const pending = rows.filter((r) => String(r.status).toUpperCase().includes("PEND")).length;

  return (
    <div className={`ds-page-frame${headerCentered ? " ds-documents-page" : ""}`}>
      <PageHeader title={title} subtitle={subtitle} centered={headerCentered} />

      <div className="ds-kpi-grid">
        <KpiCard label="Total" value={rows.length} trend={{ direction: "neutral", text: "all records" }} />
        <KpiCard label="Verified" value={verified} trend={{ direction: "up", text: "approved" }} />
        <KpiCard label="Pending" value={pending} trend={{ direction: "down", text: "review" }} />
      </div>

      <DataCard>
        <div className="ds-table-toolbar">
          <h3 className="ds-section-heading-inline">Records</h3>
          <button type="button" className="ds-section-heading-inline ds-upload-link" onClick={() => setUploadOpen(true)}>
            ↑ Upload
          </button>
        </div>
        <DocumentTable
          rows={rows}
          loading={loading}
          pageSize={5}
          onPreview={onPreview}
          onDownload={onDownload}
          onDelete={onDelete}
        />
      </DataCard>

      <DocumentUploadDialog
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        title={uploadDialogTitle}
        fields={uploadFields}
        extraContent={uploadExtra}
        onSubmit={onUpload}
      />
    </div>
  );
}
