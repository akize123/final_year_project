import { useCallback, useEffect, useState } from "react";
import { DocumentPageLayout } from "@/components/student/DocumentPageLayout";
import type { DocumentRow } from "@/components/dashboard/DocumentTable";
import {
  listPaymentReceipts,
  listExamPermits,
  uploadPaymentReceipt,
  uploadExamPermit,
} from "@/api/student/financial";
import { deleteDocument, getPreviewUrl, downloadDocumentUrl } from "@/api/student/documents";
import { mockFinancialDocs, mergeWithMock } from "@/data/student-documents-mock";
import { getAuthToken } from "@/lib/auth-token";
import { toast } from "sonner";

const SEMESTERS = [
  { value: "Semester 1", label: "Semester 1" },
  { value: "Semester 2", label: "Semester 2" },
  { value: "Semester 3", label: "Semester 3" },
];

export default function FinancialDocumentsPage() {
  const [rows, setRows] = useState<DocumentRow[]>(mockFinancialDocs);
  const [loading, setLoading] = useState(true);
  const [uploadType, setUploadType] = useState<"receipt" | "permit">("receipt");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      if (!getAuthToken()) {
        setRows(mockFinancialDocs);
        return;
      }
      const [receipts, permits] = await Promise.all([
        listPaymentReceipts(0, 50),
        listExamPermits(0, 50),
      ]);
      const apiRows = [
        ...receipts.content.map((d) => ({ ...d, typeLabel: "Payment Receipt" })),
        ...permits.content.map((d) => ({ ...d, typeLabel: "Exam Permit" })),
      ];
      setRows(mergeWithMock(apiRows, mockFinancialDocs));
    } catch {
      setRows(mockFinancialDocs);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <DocumentPageLayout
      title="Financial Documents"
      subtitle="Payment receipts and exam permits"
      rows={rows}
      loading={loading}
      uploadDialogTitle="Upload Financial Document"
      uploadExtra={
        <div className="ds-form-group">
          <label className="ds-form-label">Document type</label>
          <select
            className="ds-form-select"
            value={uploadType}
            onChange={(e) => setUploadType(e.target.value as "receipt" | "permit")}
          >
            <option value="receipt">Payment Receipt</option>
            <option value="permit">Exam Permit</option>
          </select>
        </div>
      }
      uploadFields={[
        { name: "semester", label: "Semester", type: "select", required: true, options: SEMESTERS },
        { name: "academicYear", label: "Academic Year", type: "text", placeholder: "2024-2025" },
        { name: "description", label: "Description", type: "textarea" },
      ]}
      onUpload={async (file, values) => {
        if (!file) return;
        if (getAuthToken()) {
          if (uploadType === "receipt") {
            await uploadPaymentReceipt(file, values.semester, values.academicYear, values.description);
          } else {
            await uploadExamPermit(file, values.semester, values.academicYear, values.description);
          }
          await load();
        } else {
          setRows((prev) => [
            {
              documentId: `local-${Date.now()}`,
              filename: file.name,
              typeLabel: uploadType === "receipt" ? "Payment Receipt" : "Exam Permit",
              status: "UPLOADED",
              uploadedAt: new Date().toISOString(),
            },
            ...prev,
          ]);
          toast.success("Document added (demo mode).");
        }
      }}
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
