import { useState } from "react";
import { DocumentPageLayout } from "@/components/student/DocumentPageLayout";
import type { DocumentRow } from "@/components/dashboard/DocumentTable";
import { mockCertificateDocs } from "@/data/student-documents-mock";
import { toast } from "sonner";

const CERT_STORAGE = "auca_student_certificates";

function loadCerts(): DocumentRow[] {
  try {
    const raw = localStorage.getItem(CERT_STORAGE);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return mockCertificateDocs;
}

function saveCerts(rows: DocumentRow[]) {
  localStorage.setItem(CERT_STORAGE, JSON.stringify(rows));
}

export default function CertificatesPage() {
  const [rows, setRows] = useState<DocumentRow[]>(loadCerts);

  return (
    <DocumentPageLayout
      title="Certificates"
      subtitle="Professional and academic certificates vault"
      rows={rows}
      uploadDialogTitle="Upload Certificate"
      uploadFields={[
        { name: "title", label: "Certificate Name", type: "text", required: true, placeholder: "e.g. AWS Cloud Practitioner" },
        { name: "issuer", label: "Issuing Organization", type: "text", placeholder: "Amazon Web Services" },
        { name: "year", label: "Year Obtained", type: "text", placeholder: "2025" },
      ]}
      onUpload={async (file, values) => {
        if (!file) return;
        const next = [
          {
            documentId: `cert-${Date.now()}`,
            filename: file.name,
            typeLabel: values.title || "Certificate",
            status: "VERIFIED",
            uploadedAt: new Date().toISOString(),
            statusMessage: values.issuer,
          },
          ...rows,
        ];
        setRows(next);
        saveCerts(next);
        toast.success("Certificate saved.");
      }}
      onDelete={(id) => {
        const next = rows.filter((r) => r.documentId !== id);
        setRows(next);
        saveCerts(next);
      }}
    />
  );
}
