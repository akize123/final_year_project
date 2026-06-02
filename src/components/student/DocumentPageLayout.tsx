import { ReactNode, useState } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { DataCard } from "@/components/dashboard/DataCard";
import { DocumentTable, type DocumentRow } from "@/components/dashboard/DocumentTable";
import { DocumentUploadDialog } from "@/components/dashboard/DocumentUploadDialog";
import type { UploadField } from "@/components/dashboard/DocumentUploadForm";

interface DocumentPageLayoutProps {
  title: string;
  subtitle: string;
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
    <div className="ds-page-frame">
      <PageHeader title={title} subtitle={subtitle} />

      <div className="ds-kpi-grid">
        <KpiCard label="Total" value={rows.length} />
        <KpiCard label="Verified" value={verified} trend={{ direction: "up", text: "approved" }} />
        <KpiCard label="Pending" value={pending} trend={{ direction: "down", text: "review" }} />
      </div>

      <DataCard label="Records">
        <div className="ds-table-toolbar">
          <span className="ds-text-secondary">{rows.length} document(s)</span>
          <button type="button" className="btn btn-primary btn-sm" onClick={() => setUploadOpen(true)}>
            Upload
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
