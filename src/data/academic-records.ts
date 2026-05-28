import type { AcademicRecord, ExamTimetableEntry, DocumentVerification } from "@/types";

/** Student u1 academic records */
export const academicRecords: AcademicRecord[] = [
  { id: "ar1",  studentId: "u1", type: "transcript",          title: "Official Transcript — 2024–2025",        semester: "2025-S1", uploadDate: "2025-01-15", status: "verified",              fileSize: "892 KB" },
  { id: "ar2",  studentId: "u1", type: "registration_form",   title: "Semester Registration — 2025 S1",        semester: "2025-S1", uploadDate: "2025-01-10", status: "verified",              fileSize: "245 KB" },
  { id: "ar3",  studentId: "u1", type: "attendance_form",     title: "Attendance Sheet — CS301 Feb 2025",       semester: "2025-S1", uploadDate: "2025-02-28", status: "verified",              fileSize: "128 KB" },
  { id: "ar4",  studentId: "u1", type: "clearance_form",      title: "Graduation Clearance Form",               semester: "2025-S1", uploadDate: "2025-03-01", status: "pending_verification",  fileSize: "1.2 MB" },
  { id: "ar5",  studentId: "u1", type: "tuition_receipt",     title: "Tuition Payment Receipt — Jan 2025",      semester: "2025-S1", uploadDate: "2025-01-08", status: "verified",              fileSize: "340 KB" },
  { id: "ar7",  studentId: "u1", type: "internship_letter",   title: "Internship Acceptance — BK TecHouse",     semester: "2024-S2", uploadDate: "2024-06-15", status: "verified",              fileSize: "320 KB" },
  { id: "ar8",  studentId: "u1", type: "internship_logbook",  title: "Internship Logbook — BK TecHouse",        semester: "2024-S2", uploadDate: "2024-09-10", status: "verified",              fileSize: "2.4 MB" },
  { id: "ar9",  studentId: "u1", type: "internship_report",   title: "Final Internship Report — Mobile App Dev", semester: "2024-S2", uploadDate: "2024-09-20", status: "verified",              fileSize: "4.1 MB" },
  { id: "ar10", studentId: "u1", type: "clearance_form",      title: "Library Clearance Form",                    semester: "2025-S1", uploadDate: "2025-03-05", status: "rejected",             fileSize: "680 KB" },
];

/** Exam timetable for IT department */
export const examTimetable: ExamTimetableEntry[] = [
  { id: "et1", courseCode: "CS301", courseName: "Software Engineering",    department: "IT", date: "2025-05-12", startTime: "08:00", endTime: "11:00", venue: "AUCA Hall A", seatCapacity: 120, invigilator: "Dr. Sarah Mugisha" },
  { id: "et2", courseCode: "IT201", courseName: "Web Development",         department: "IT", date: "2025-05-14", startTime: "08:00", endTime: "11:00", venue: "AUCA Hall B", seatCapacity: 100, invigilator: "Dr. Sarah Mugisha" },
  { id: "et3", courseCode: "CS401", courseName: "Machine Learning",        department: "CS", date: "2025-05-16", startTime: "14:00", endTime: "17:00", venue: "AUCA Hall A", seatCapacity: 120, invigilator: "Prof. Agnes Ntamwiza" },
  { id: "et4", courseCode: "ENG301", courseName: "Circuit Design",         department: "ENG", date: "2025-05-18", startTime: "08:00", endTime: "11:00", venue: "Engineering Lab", seatCapacity: 60, invigilator: "Dr. Jean B. Niyonzima" },
  { id: "et5", courseCode: "IT101", courseName: "Introduction to IT",      department: "IT", date: "2025-05-20", startTime: "14:00", endTime: "17:00", venue: "AUCA Hall C", seatCapacity: 200, invigilator: "Mr. Patrick Mugisha" },
  { id: "et6", courseCode: "BUS301", courseName: "Strategic Management",   department: "Business", date: "2025-05-13", startTime: "14:00", endTime: "17:00", venue: "Business Lecture Hall", seatCapacity: 80, invigilator: "Dr. Claire M." },
];

/** Simulated document verification results */
export const documentVerifications: DocumentVerification[] = [
  {
    id: "dv1", documentId: "ar1", fileName: "transcript_2024_2025.pdf", uploadedBy: "Jean Pierre Habimana",
    uploadDate: "2025-01-15", detectedType: "Official Transcript", confidence: 96, status: "verified",
    keywordsFound: ["Transcript", "Grades", "GPA", "Semester", "Credit Hours"],
    requiredElements: [
      { label: "Student Name", found: true }, { label: "Course List", found: true },
      { label: "Grades", found: true }, { label: "GPA", found: true },
      { label: "Official Stamp", found: true }, { label: "Registrar Signature", found: true },
    ],
    stampCount: 2, signatureDetected: true,
    ocrText: "ADVENTIST UNIVERSITY OF CENTRAL AFRICA — OFFICIAL ACADEMIC TRANSCRIPT ... Student: Jean Pierre Habimana ... Campus ID: AUCA-2023-0147 ... GPA: 3.65 / 4.00 ...",
  },
  {
    id: "dv2", documentId: "ar2", fileName: "registration_2025_S1.pdf", uploadedBy: "Jean Pierre Habimana",
    uploadDate: "2025-01-10", detectedType: "Registration Form", confidence: 92, status: "verified",
    keywordsFound: ["Registration", "Courses", "Semester", "Department", "Academic Year"],
    requiredElements: [
      { label: "Semester", found: true }, { label: "Course List", found: true },
      { label: "Registration Details", found: true }, { label: "Student Signature", found: true },
      { label: "Department Approval", found: true },
    ],
    stampCount: 1, signatureDetected: true,
    ocrText: "SEMESTER REGISTRATION FORM ... Semester: 2025-S1 ... Department: Information Technology ... Courses: CS301, IT201, CS401 ...",
  },
  {
    id: "dv3", documentId: "ar4", fileName: "graduation_clearance.pdf", uploadedBy: "Jean Pierre Habimana",
    uploadDate: "2025-03-01", detectedType: "Clearance Form", confidence: 78, status: "partial",
    keywordsFound: ["Clearance", "Finance", "Library", "Department"],
    requiredElements: [
      { label: "Finance Section", found: true }, { label: "Library Section", found: true },
      { label: "Department Section", found: true }, { label: "Finance Stamp", found: true },
      { label: "Library Stamp", found: false }, { label: "Department Stamp", found: false },
    ],
    stampCount: 1, signatureDetected: true,
    ocrText: "GRADUATION CLEARANCE FORM ... Finance: CLEARED ... Library: PENDING ... Department: PENDING ...",
  },
  {
    id: "dv4", documentId: "ar10", fileName: "library_clearance.pdf", uploadedBy: "Jean Pierre Habimana",
    uploadDate: "2025-03-05", detectedType: "Clearance Form", confidence: 45, status: "failed",
    keywordsFound: ["Clearance", "Library"],
    requiredElements: [
      { label: "Finance Section", found: false }, { label: "Library Section", found: true },
      { label: "Department Section", found: false }, { label: "Min 3 Stamps/Signatures", found: false },
    ],
    stampCount: 0, signatureDetected: false,
    ocrText: "LIBRARY CLEARANCE ... Status: NOT CLEARED — Outstanding fines: 5,000 RWF ...",
  },
];
