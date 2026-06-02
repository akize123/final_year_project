import { useCallback, useEffect, useState } from "react";
import { DocumentPageLayout } from "@/components/student/DocumentPageLayout";
import type { DocumentRow } from "@/components/dashboard/DocumentTable";
import {
  listInternships,
  createInternship,
  uploadInternshipDoc,
  listInternshipDocuments,
} from "@/api/student/internship";
import { deleteDocument, getPreviewUrl, downloadDocumentUrl } from "@/api/student/documents";
import { mockInternshipDocs, mergeWithMock } from "@/data/student-documents-mock";
import { getAuthToken } from "@/lib/auth-token";
import { toast } from "sonner";

export default function InternshipDocumentsPage() {
  const [rows, setRows] = useState<DocumentRow[]>(mockInternshipDocs);
  const [loading, setLoading] = useState(true);
  const [internshipId, setInternshipId] = useState<string>("");
  const [docType, setDocType] = useState<
    "recommendation-letter" | "acceptance-letter" | "logbook" | "report"
  >("acceptance-letter");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      if (!getAuthToken()) {
        setRows(mockInternshipDocs);
        return;
      }
      const list = await listInternships();
      if (!list.length) {
        setRows(mockInternshipDocs);
        return;
      }
      const id = internshipId || list[0].id;
      setInternshipId(id);
      const docs = await listInternshipDocuments(id);
      setRows(mergeWithMock(docs.map((d) => ({ ...d, typeLabel: d.filename })), mockInternshipDocs));
    } catch {
      setRows(mockInternshipDocs);
    } finally {
      setLoading(false);
    }
  }, [internshipId]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <DocumentPageLayout
      title="Internship Documents"
      subtitle="Acceptance letters, logbooks, and internship reports"
      rows={rows}
      loading={loading}
      uploadDialogTitle="Upload Internship Document"
      uploadExtra={
        <div className="ds-form-group">
          <label className="ds-form-label">Document type</label>
          <select
            className="ds-form-select"
            value={docType}
            onChange={(e) => setDocType(e.target.value as typeof docType)}
          >
            <option value="acceptance-letter">Acceptance Letter</option>
            <option value="recommendation-letter">Recommendation Letter</option>
            <option value="logbook">Logbook</option>
            <option value="report">Internship Report</option>
          </select>
        </div>
      }
      onUpload={async (file, values) => {
        if (!file) return;
        if (getAuthToken() && internshipId) {
          await uploadInternshipDoc(internshipId, docType, file);
          await load();
        } else if (getAuthToken() && !internshipId) {
          const created = await createInternship({
            companyName: values.companyName || "Host Company",
            startDate: values.startDate || "2026-01-01",
            endDate: values.endDate || "2026-06-30",
          });
          setInternshipId(created.id);
          await uploadInternshipDoc(created.id, docType, file);
          await load();
        } else {
          setRows((prev) => [
            {
              documentId: `local-${Date.now()}`,
              filename: file.name,
              typeLabel: docType.replace(/-/g, " "),
              status: "UPLOADED",
              uploadedAt: new Date().toISOString(),
            },
            ...prev,
          ]);
          toast.success("Document added (demo).");
        }
      }}
      uploadFields={[
        { name: "companyName", label: "Company (if new record)", type: "text" },
        { name: "startDate", label: "Start date", type: "text", placeholder: "YYYY-MM-DD" },
        { name: "endDate", label: "End date", type: "text", placeholder: "YYYY-MM-DD" },
      ]}
      onPreview={async (id) => {
        if (id.startsWith("m-") || id.startsWith("local-")) return;
        try {
          window.open(await getPreviewUrl(id), "_blank");
        } catch {
          toast.error("Preview unavailable.");
        }
      }}
      onDownload={(id) => {
        if (!id.startsWith("m-") && !id.startsWith("local-")) {
          window.open(downloadDocumentUrl(id), "_blank");
        }
      }}
      onDelete={async (id) => {
        if (id.startsWith("m-") || id.startsWith("local-")) {
          setRows((prev) => prev.filter((r) => r.documentId !== id));
          return;
        }
        if (!confirm("Delete?")) return;
        await deleteDocument(id);
        load();
      }}
    />
  );
}
