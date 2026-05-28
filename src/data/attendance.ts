import type { AttendanceRecord, AttendanceSummary } from "@/types";

/** Mock attendance data — student u1 (Jean Pierre Habimana) in various courses */
export const attendanceRecords: AttendanceRecord[] = [
  // CS301 — Software Engineering
  { id: "att1",  studentId: "u1", studentName: "Jean Pierre Habimana", campusId: "AUCA-2023-0147", courseCode: "CS301", courseName: "Software Engineering", date: "2025-02-03", status: "present", semester: "2025-S1" },
  { id: "att2",  studentId: "u1", studentName: "Jean Pierre Habimana", campusId: "AUCA-2023-0147", courseCode: "CS301", courseName: "Software Engineering", date: "2025-02-05", status: "present", semester: "2025-S1" },
  { id: "att3",  studentId: "u1", studentName: "Jean Pierre Habimana", campusId: "AUCA-2023-0147", courseCode: "CS301", courseName: "Software Engineering", date: "2025-02-10", status: "late",    semester: "2025-S1" },
  { id: "att4",  studentId: "u1", studentName: "Jean Pierre Habimana", campusId: "AUCA-2023-0147", courseCode: "CS301", courseName: "Software Engineering", date: "2025-02-12", status: "present", semester: "2025-S1" },
  { id: "att5",  studentId: "u1", studentName: "Jean Pierre Habimana", campusId: "AUCA-2023-0147", courseCode: "CS301", courseName: "Software Engineering", date: "2025-02-17", status: "absent",  semester: "2025-S1" },
  { id: "att6",  studentId: "u1", studentName: "Jean Pierre Habimana", campusId: "AUCA-2023-0147", courseCode: "CS301", courseName: "Software Engineering", date: "2025-02-19", status: "present", semester: "2025-S1" },
  { id: "att7",  studentId: "u1", studentName: "Jean Pierre Habimana", campusId: "AUCA-2023-0147", courseCode: "CS301", courseName: "Software Engineering", date: "2025-02-24", status: "present", semester: "2025-S1" },
  { id: "att8",  studentId: "u1", studentName: "Jean Pierre Habimana", campusId: "AUCA-2023-0147", courseCode: "CS301", courseName: "Software Engineering", date: "2025-02-26", status: "present", semester: "2025-S1" },
  { id: "att9",  studentId: "u1", studentName: "Jean Pierre Habimana", campusId: "AUCA-2023-0147", courseCode: "CS301", courseName: "Software Engineering", date: "2025-03-03", status: "late",    semester: "2025-S1" },
  { id: "att10", studentId: "u1", studentName: "Jean Pierre Habimana", campusId: "AUCA-2023-0147", courseCode: "CS301", courseName: "Software Engineering", date: "2025-03-05", status: "present", semester: "2025-S1" },
  // IT201 — Web Development
  { id: "att11", studentId: "u1", studentName: "Jean Pierre Habimana", campusId: "AUCA-2023-0147", courseCode: "IT201", courseName: "Web Development",      date: "2025-02-04", status: "present", semester: "2025-S1" },
  { id: "att12", studentId: "u1", studentName: "Jean Pierre Habimana", campusId: "AUCA-2023-0147", courseCode: "IT201", courseName: "Web Development",      date: "2025-02-06", status: "present", semester: "2025-S1" },
  { id: "att13", studentId: "u1", studentName: "Jean Pierre Habimana", campusId: "AUCA-2023-0147", courseCode: "IT201", courseName: "Web Development",      date: "2025-02-11", status: "absent",  semester: "2025-S1" },
  { id: "att14", studentId: "u1", studentName: "Jean Pierre Habimana", campusId: "AUCA-2023-0147", courseCode: "IT201", courseName: "Web Development",      date: "2025-02-13", status: "present", semester: "2025-S1" },
  { id: "att15", studentId: "u1", studentName: "Jean Pierre Habimana", campusId: "AUCA-2023-0147", courseCode: "IT201", courseName: "Web Development",      date: "2025-02-18", status: "present", semester: "2025-S1" },
  { id: "att16", studentId: "u1", studentName: "Jean Pierre Habimana", campusId: "AUCA-2023-0147", courseCode: "IT201", courseName: "Web Development",      date: "2025-02-20", status: "excused", semester: "2025-S1" },
  { id: "att17", studentId: "u1", studentName: "Jean Pierre Habimana", campusId: "AUCA-2023-0147", courseCode: "IT201", courseName: "Web Development",      date: "2025-02-25", status: "present", semester: "2025-S1" },
  { id: "att18", studentId: "u1", studentName: "Jean Pierre Habimana", campusId: "AUCA-2023-0147", courseCode: "IT201", courseName: "Web Development",      date: "2025-02-27", status: "present", semester: "2025-S1" },
];

/** Compute summaries from raw records */
export function computeAttendanceSummaries(records: AttendanceRecord[], studentId: string): AttendanceSummary[] {
  const courses = [...new Set(records.filter(r => r.studentId === studentId).map(r => r.courseCode))];
  return courses.map(code => {
    const recs = records.filter(r => r.studentId === studentId && r.courseCode === code);
    const present = recs.filter(r => r.status === "present" || r.status === "late").length;
    const absent = recs.filter(r => r.status === "absent").length;
    const late = recs.filter(r => r.status === "late").length;
    const excused = recs.filter(r => r.status === "excused").length;
    const total = recs.length;
    const pct = total > 0 ? Math.round(((present + excused) / total) * 100) : 0;
    return {
      studentId,
      studentName: recs[0]?.studentName ?? "",
      campusId: recs[0]?.campusId ?? "",
      courseCode: code,
      courseName: recs[0]?.courseName ?? "",
      totalSessions: total,
      present,
      absent,
      late,
      excused,
      attendancePct: pct,
      eligible: pct >= 75,
    };
  });
}

/** Lecturer-view: all students' attendance for a course */
export const courseAttendanceData: AttendanceRecord[] = [
  // CS301 roster — multiple students
  ...attendanceRecords.filter(r => r.courseCode === "CS301"),
  { id: "att-g1", studentId: "u-g1", studentName: "Grace Uwimana",       campusId: "AUCA-2022-0289", courseCode: "CS301", courseName: "Software Engineering", date: "2025-02-03", status: "present", semester: "2025-S1" },
  { id: "att-g2", studentId: "u-g1", studentName: "Grace Uwimana",       campusId: "AUCA-2022-0289", courseCode: "CS301", courseName: "Software Engineering", date: "2025-02-05", status: "present", semester: "2025-S1" },
  { id: "att-g3", studentId: "u-g1", studentName: "Grace Uwimana",       campusId: "AUCA-2022-0289", courseCode: "CS301", courseName: "Software Engineering", date: "2025-02-10", status: "present", semester: "2025-S1" },
  { id: "att-g4", studentId: "u-g1", studentName: "Grace Uwimana",       campusId: "AUCA-2022-0289", courseCode: "CS301", courseName: "Software Engineering", date: "2025-02-12", status: "absent",  semester: "2025-S1" },
  { id: "att-g5", studentId: "u-g1", studentName: "Grace Uwimana",       campusId: "AUCA-2022-0289", courseCode: "CS301", courseName: "Software Engineering", date: "2025-02-17", status: "present", semester: "2025-S1" },
  { id: "att-e1", studentId: "u-e1", studentName: "Eric Habimana",       campusId: "AUCA-2023-0198", courseCode: "CS301", courseName: "Software Engineering", date: "2025-02-03", status: "present", semester: "2025-S1" },
  { id: "att-e2", studentId: "u-e1", studentName: "Eric Habimana",       campusId: "AUCA-2023-0198", courseCode: "CS301", courseName: "Software Engineering", date: "2025-02-05", status: "absent",  semester: "2025-S1" },
  { id: "att-e3", studentId: "u-e1", studentName: "Eric Habimana",       campusId: "AUCA-2023-0198", courseCode: "CS301", courseName: "Software Engineering", date: "2025-02-10", status: "absent",  semester: "2025-S1" },
  { id: "att-e4", studentId: "u-e1", studentName: "Eric Habimana",       campusId: "AUCA-2023-0198", courseCode: "CS301", courseName: "Software Engineering", date: "2025-02-12", status: "absent",  semester: "2025-S1" },
  { id: "att-e5", studentId: "u-e1", studentName: "Eric Habimana",       campusId: "AUCA-2023-0198", courseCode: "CS301", courseName: "Software Engineering", date: "2025-02-17", status: "late",    semester: "2025-S1" },
  { id: "att-m1", studentId: "u-m1", studentName: "Marie Claire Niyonsaba", campusId: "AUCA-2023-0199", courseCode: "CS301", courseName: "Software Engineering", date: "2025-02-03", status: "present", semester: "2025-S1" },
  { id: "att-m2", studentId: "u-m1", studentName: "Marie Claire Niyonsaba", campusId: "AUCA-2023-0199", courseCode: "CS301", courseName: "Software Engineering", date: "2025-02-05", status: "present", semester: "2025-S1" },
  { id: "att-m3", studentId: "u-m1", studentName: "Marie Claire Niyonsaba", campusId: "AUCA-2023-0199", courseCode: "CS301", courseName: "Software Engineering", date: "2025-02-10", status: "present", semester: "2025-S1" },
  { id: "att-m4", studentId: "u-m1", studentName: "Marie Claire Niyonsaba", campusId: "AUCA-2023-0199", courseCode: "CS301", courseName: "Software Engineering", date: "2025-02-12", status: "present", semester: "2025-S1" },
  { id: "att-m5", studentId: "u-m1", studentName: "Marie Claire Niyonsaba", campusId: "AUCA-2023-0199", courseCode: "CS301", courseName: "Software Engineering", date: "2025-02-17", status: "present", semester: "2025-S1" },
];
