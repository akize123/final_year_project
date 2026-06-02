import type { DocumentRow } from "@/components/dashboard/DocumentTable";

function mockDoc(
  id: string,
  filename: string,
  typeLabel: string,
  status: string,
  daysAgo: number,
): DocumentRow {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return {
    documentId: id,
    filename,
    typeLabel,
    status,
    uploadedAt: d.toISOString(),
  };
}

export const mockAcademicDocs: DocumentRow[] = [
  mockDoc("m-ac-1", "transcript_sem1_2025.pdf", "Semester Transcript", "VERIFIED", 12),
  mockDoc("m-ac-2", "registration_s2.pdf", "Registration Form", "PENDING", 5),
  mockDoc("m-ac-3", "exam_attendance_march.pdf", "Exam Attendance", "VERIFIED", 20),
];

export const mockFinancialDocs: DocumentRow[] = [
  mockDoc("m-fin-1", "payment_receipt_jan.pdf", "Payment Receipt", "VERIFIED", 30),
  mockDoc("m-fin-2", "exam_permit_s2.pdf", "Exam Permit", "PENDING", 3),
];

export const mockInternshipDocs: DocumentRow[] = [
  mockDoc("m-int-1", "acceptance_letter_techrw.pdf", "Acceptance Letter", "VERIFIED", 15),
  mockDoc("m-int-2", "internship_logbook_w4.pdf", "Logbook", "UPLOADED", 2),
];

export const mockClearanceDocs: DocumentRow[] = [
  mockDoc("m-cl-1", "graduation_clearance.pdf", "Graduation Clearance", "PENDING", 7),
];

export const mockCertificateDocs: DocumentRow[] = [
  mockDoc("m-cert-1", "aws_cloud_practitioner.pdf", "AWS Cloud Practitioner", "VERIFIED", 40),
  mockDoc("m-cert-2", "google_it_support.pdf", "Google IT Support", "VERIFIED", 60),
  mockDoc("m-cert-3", "cybersecurity_fundamentals.pdf", "Cybersecurity Basics", "UPLOADED", 10),
];

export const mockPersonalProjects: Array<{
  id: string;
  title: string;
  description: string;
  tech: string;
  link?: string;
  updatedAt: string;
}> = [
  {
    id: "pp-1",
    title: "Campus Navigator App",
    description: "Mobile-friendly campus map with room finder and event pins.",
    tech: "React Native, Firebase",
    link: "https://github.com/example/campus-nav",
    updatedAt: "2026-05-10",
  },
  {
    id: "pp-2",
    title: "Budget Tracker API",
    description: "REST API for student expense tracking with monthly reports.",
    tech: "Spring Boot, PostgreSQL",
    updatedAt: "2026-04-22",
  },
];

export function mergeWithMock(apiRows: DocumentRow[], mockRows: DocumentRow[]): DocumentRow[] {
  const apiIds = new Set(apiRows.map((r) => r.documentId));
  const extras = mockRows.filter((m) => !apiIds.has(m.documentId));
  return [...apiRows, ...extras].sort(
    (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
  );
}
