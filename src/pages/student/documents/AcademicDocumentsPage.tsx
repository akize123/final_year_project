import { useCallback, useEffect, useState } from "react";
import { DocumentPageLayout } from "@/components/student/DocumentPageLayout";
import type { DocumentRow } from "@/components/dashboard/DocumentTable";
import {
  listTranscripts,
  listRegistrationForms,
  listExamAttendance,
  uploadSemesterTranscript,
  uploadOfficialTranscript,
  uploadRegistrationForm,
  uploadExamAttendance,
} from "@/api/student/academic";
import { deleteDocument, getPreviewUrl, downloadDocumentUrl } from "@/api/student/documents";
import { mockAcademicDocs, mergeWithMock } from "@/data/student-documents-mock";
import { getAuthToken } from "@/lib/auth-token";
import { validateDocument } from "@/lib/document-scanner";
import { toast } from "sonner";

const SEMESTERS = [
  { value: "Semester 1", label: "Semester 1" },
  { value: "Semester 2", label: "Semester 2" },
  { value: "Semester 3", label: "Semester 3" },
];

export default function AcademicDocumentsPage() {
  const [rows, setRows] = useState<DocumentRow[]>(mockAcademicDocs);
  const [loading, setLoading] = useState(true);
  const [uploadType, setUploadType] = useState("SEMESTER_TRANSCRIPT");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      if (!getAuthToken()) {
        setRows(mockAcademicDocs);
        return;
      }
      const [t, r, e] = await Promise.all([
        listTranscripts(0, 50),
        listRegistrationForms(0, 50),
        listExamAttendance(0, 50),
      ]);
      const apiRows: DocumentRow[] = [
        ...t.content.map((d) => ({ ...d, typeLabel: "Semester Transcript" })),
        ...r.content.map((d) => ({ ...d, typeLabel: "Registration Form" })),
        ...e.content.map((d) => ({ ...d, typeLabel: "Exam Attendance" })),
      ];
      setRows(mergeWithMock(apiRows, mockAcademicDocs));
    } catch {
      setRows(mockAcademicDocs);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <DocumentPageLayout
      title="Academic Records"
      headerCentered
      rows={rows}
      loading={loading}
      uploadDialogTitle="Upload Academic Document"
      uploadExtra={
        <div className="ds-form-group">
          <label className="ds-form-label" htmlFor="uploadType">
            Document type
          </label>
          <select
            id="uploadType"
            className="ds-form-select"
            value={uploadType}
            onChange={(e) => setUploadType(e.target.value)}
          >
            <option value="SEMESTER_TRANSCRIPT">Semester Transcript</option>
            <option value="OFFICIAL_TRANSCRIPT">Official Transcript</option>
            <option value="REGISTRATION_FORM">Registration Form</option>
            <option value="EXAM_ATTENDANCE">Exam Attendance</option>
          </select>
        </div>
      }
      uploadFields={[
        ...(uploadType !== "OFFICIAL_TRANSCRIPT"
          ? [
              {
                name: "semester",
                label: "Semester",
                type: "select" as const,
                required: true,
                options: SEMESTERS,
              },
            ]
          : []),
        { name: "academicYear", label: "Academic Year", type: "text" as const, placeholder: "2024-2025" },
        { name: "description", label: "Description", type: "textarea" as const },
      ]}
      onUpload={async (file, values) => {
        if (!file) return;

        // Run AI Document Scanner
        const docType = uploadType.includes("TRANSCRIPT") ? "transcript" : "general";
        const validation = await validateDocument(file, docType as any);
        if (!validation.valid) {
          throw new Error(validation.error);
        }

        if (getAuthToken()) {
          switch (uploadType) {
            case "OFFICIAL_TRANSCRIPT":
              await uploadOfficialTranscript(file, values.academicYear, values.description);
              break;
            case "REGISTRATION_FORM":
              await uploadRegistrationForm(file, values.semester, values.academicYear, values.description);
              break;
            case "EXAM_ATTENDANCE":
              await uploadExamAttendance(file, values.semester, values.academicYear, values.description);
              break;
            default:
              await uploadSemesterTranscript(file, values.semester, values.academicYear, values.description);
          }
          await load();
        } else {
          setRows((prev) => [
            {
              documentId: `local-${Date.now()}`,
              filename: file.name,
              typeLabel: uploadType.replace(/_/g, " "),
              status: "UPLOADED",
              uploadedAt: new Date().toISOString(),
            },
            ...prev,
          ]);
          toast.success("Document added (demo mode).");
        }
      }}
      onPreview={async (id) => {
        if (id.startsWith("m-") || id.startsWith("local-")) {
          toast.info("📄 Demo mode: preview opens for server-uploaded documents.", {
            description: "Upload a real document to view it as a PDF.",
          });
          return;
        }
        try {
          const url = await getPreviewUrl(id);
          window.open(url, "_blank", "noopener,noreferrer");
        } catch {
          toast.error("Could not open preview. Please try again.");
        }
      }}
      onDownload={(id) => {
        const row = rows.find((r) => r.documentId === id);
        if (id.startsWith("m-") || id.startsWith("local-")) {
          toast.info(`📥 Demo mode: "${row?.filename ?? "document"}" download available after server upload.`);
          return;
        }
        const url = downloadDocumentUrl(id);
        const a = document.createElement("a");
        a.href = url;
        a.download = row?.filename ?? "document";
        a.target = "_blank";
        a.rel = "noopener";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        toast.success(`Downloading "${row?.filename ?? "document"}"…`);
      }}
      onDelete={async (id) => {
        const row = rows.find((r) => r.documentId === id);
        const name = row?.filename ?? "this document";
        if (id.startsWith("m-") || id.startsWith("local-")) {
          if (!window.confirm(`Delete "${name}" from the list?`)) return;
          setRows((prev) => prev.filter((r) => r.documentId !== id));
          toast.success(`"${name}" removed.`);
          return;
        }
        if (!window.confirm(`Permanently delete "${name}"? This cannot be undone.`)) return;
        try {
          await deleteDocument(id);
          toast.success(`"${name}" deleted.`);
          load();
        } catch {
          toast.error("Could not delete document. Please try again.");
        }
      }}
    />
  );
}
