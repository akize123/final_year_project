/** Mock analytics for student dashboard charts */

export const documentUploadsByWeek = [
  { week: "W1", academic: 2, financial: 1, internship: 0, other: 1 },
  { week: "W2", academic: 3, financial: 2, internship: 1, other: 0 },
  { week: "W3", academic: 1, financial: 1, internship: 2, other: 1 },
  { week: "W4", academic: 4, financial: 0, internship: 1, other: 2 },
  { week: "W5", academic: 2, financial: 3, internship: 0, other: 1 },
  { week: "W6", academic: 3, financial: 1, internship: 2, other: 0 },
];

export const documentStatusDonut = [
  { name: "Verified", value: 12, color: "#5B6CF9" },
  { name: "Pending", value: 5, color: "#A0A8F5" },
  { name: "Draft", value: 3, color: "#D0D4F7" },
];

export const attendanceTimeline = [
  { date: "Feb 3", rate: 100, sessions: 2 },
  { date: "Feb 10", rate: 85, sessions: 2 },
  { date: "Feb 17", rate: 72, sessions: 2 },
  { date: "Feb 24", rate: 90, sessions: 2 },
  { date: "Mar 3", rate: 88, sessions: 2 },
  { date: "Mar 10", rate: 94, sessions: 2 },
  { date: "Mar 17", rate: 91, sessions: 2 },
];

export const attendanceComparison = [
  { date: "Feb 3", current: 100, previous: 95 },
  { date: "Feb 10", current: 85, previous: 88 },
  { date: "Feb 17", current: 72, previous: 80 },
  { date: "Feb 24", current: 90, previous: 82 },
  { date: "Mar 3", current: 88, previous: 86 },
  { date: "Mar 10", current: 94, previous: 90 },
];

export const recentUploadsList = [
  { name: "Semester 1 Transcript", category: "Academic", date: "Jun 1, 2026", status: "Verified" },
  { name: "Tuition Receipt S2", category: "Financial", date: "May 28, 2026", status: "Pending" },
  { name: "Internship Acceptance", category: "Internship", date: "May 20, 2026", status: "Verified" },
  { name: "AWS Cloud Certificate", category: "Certificate", date: "May 15, 2026", status: "Verified" },
];
