import { useCallback, useEffect, useState } from "react";
import { DocumentPageLayout } from "@/components/student/DocumentPageLayout";
import type { DocumentRow } from "@/components/dashboard/DocumentTable";
import { listDocuments, uploadDocument, deleteDocument, getPreviewUrl, downloadDocumentUrl } from "@/api/student/documents";
import { mockClearanceDocs, mergeWithMock } from "@/data/student-documents-mock";
import { getAuthToken } from "@/lib/auth-token";
import { toast } from "sonner";

const SEMESTERS = [
  { value: "Semester 1", label: "Semester 1" },
  { value: "Semester 2", label: "Semester 2" },
  { value: "Semester 3", label: "Semester 3" },
];

export default function ClearanceDocumentsPage() {
  const [rows, setRows] = useState<DocumentRow[]>(mockClearanceDocs);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      if (!getAuthToken()) {
        setRows(mockClearanceDocs);
        return;
      }
      const page = await listDocuments("ACADEMIC", 0, 100);
      setRows(mergeWithMock(
        page.content.map((d) => ({ ...d, typeLabel: "Clearance" })),
        mockClearanceDocs,
      ));
    } catch {
      setRows(mockClearanceDocs);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <DocumentPageLayout
      title="Clearance Documents"
      subtitle="Graduation and departmental clearance forms"
      rows={rows}
      loading={loading}
      uploadDialogTitle="Upload Clearance Form"
      uploadFields={[
        { name: "semester", label: "Semester", type: "select", required: true, options: SEMESTERS },
        { name: "academicYear", label: "Academic Year", type: "text" },
        { name: "description", label: "Notes", type: "textarea", placeholder: "Graduation clearance" },
      ]}
      onUpload={async (file, values) => {
        if (!file) return;
        if (getAuthToken()) {
          await uploadDocument(file, {
            category: "ACADEMIC",
            documentType: "REGISTRATION_FORM",
            semester: values.semester,
            academicYear: values.academicYear,
            description: values.description || "Graduation clearance",
          });
          await load();
        } else {
          setRows((prev) => [
            {
              documentId: `local-${Date.now()}`,
              filename: file.name,
              typeLabel: "Graduation Clearance",
              status: "PENDING",
              uploadedAt: new Date().toISOString(),
            },
            ...prev,
          ]);
          toast.success("Clearance form added (demo).");
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
