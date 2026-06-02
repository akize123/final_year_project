export type TimetableSlotType = "class" | "exam" | "study" | "custom";

export interface TimetableSlot {
  id: string;
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";
  startTime: string;
  endTime: string;
  title: string;
  location?: string;
  type: TimetableSlotType;
  courseCode?: string;
  /** Custom block color (hex) */
  color?: string;
}

export const TIMETABLE_COLOR_PRESETS = [
  { hex: "#0066CC", label: "AUCA Blue" },
  { hex: "#2EC4B6", label: "Teal" },
  { hex: "#F9A826", label: "Amber" },
  { hex: "#A0A8F5", label: "Lavender" },
  { hex: "#198754", label: "Green" },
  { hex: "#dc3545", label: "Red" },
] as const;

export const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export const TIME_SLOTS = Array.from({ length: 16 }, (_, i) => {
  const hour = 8 + i;
  return `${String(hour).padStart(2, "0")}:00`;
});

/** Latest allowed end time (midnight) */
export const TIMETABLE_MIDNIGHT = "24:00";

export function timeToMinutes(time: string): number {
  const normalized = time.trim();
  if (normalized === "24:00" || normalized === "00:00") return 24 * 60;
  const [h, m] = normalized.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return -1;
  return h * 60 + m;
}

export function isValidTimeBlock(startTime: string, endTime: string): boolean {
  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);
  const dayStart = timeToMinutes("08:00");
  const midnight = timeToMinutes(TIMETABLE_MIDNIGHT);
  return start >= dayStart && end <= midnight && start < end;
}

export const defaultWeeklyTimetable: TimetableSlot[] = [
  { id: "t1", day: "Monday", startTime: "08:00", endTime: "10:00", title: "Software Engineering", courseCode: "CS301", location: "Lab 3", type: "class" },
  { id: "t2", day: "Monday", startTime: "14:00", endTime: "16:00", title: "Database Systems", courseCode: "CS302", location: "Room 201", type: "class" },
  { id: "t3", day: "Tuesday", startTime: "10:00", endTime: "12:00", title: "Web Development", courseCode: "IT201", location: "Lab 1", type: "class" },
  { id: "t4", day: "Wednesday", startTime: "08:00", endTime: "10:00", title: "Applied Statistics", courseCode: "MAT201", location: "Room 105", type: "class" },
  { id: "t5", day: "Thursday", startTime: "13:00", endTime: "15:00", title: "Group Study — FYP", location: "Library", type: "study" },
  { id: "t6", day: "Friday", startTime: "09:00", endTime: "11:00", title: "Computer Networks", courseCode: "CS303", location: "Lab 2", type: "class" },
];

/** Simulated OCR extraction result after timetable image upload */
export const ocrExtractedTimetable: TimetableSlot[] = [
  { id: "ocr-1", day: "Monday", startTime: "08:00", endTime: "10:00", title: "Software Engineering", courseCode: "CS301", location: "Lab 3", type: "class" },
  { id: "ocr-2", day: "Tuesday", startTime: "10:00", endTime: "12:00", title: "Web Development", courseCode: "IT201", location: "Lab 1", type: "class" },
  { id: "ocr-3", day: "Wednesday", startTime: "08:00", endTime: "10:00", title: "Applied Statistics", courseCode: "MAT201", location: "Room 105", type: "class" },
  { id: "ocr-4", day: "Thursday", startTime: "14:00", endTime: "16:00", title: "Database Systems", courseCode: "CS302", location: "Room 201", type: "class" },
  { id: "ocr-5", day: "Friday", startTime: "09:00", endTime: "11:00", title: "Computer Networks", courseCode: "CS303", location: "Lab 2", type: "class" },
];

export const TIMETABLE_STORAGE_KEY = "auca_student_weekly_timetable";

export function loadTimetable(): TimetableSlot[] {
  try {
    const raw = localStorage.getItem(TIMETABLE_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return defaultWeeklyTimetable;
}

export function saveTimetable(slots: TimetableSlot[]) {
  localStorage.setItem(TIMETABLE_STORAGE_KEY, JSON.stringify(slots));
}

export function slotColor(slot: TimetableSlot | TimetableSlotType): string {
  if (typeof slot === "object" && slot.color) return slot.color;
  const type = typeof slot === "object" ? slot.type : slot;
  switch (type) {
    case "exam":
      return "#ffc107";
    case "study":
    case "custom":
      return "#2EC4B6";
    case "class":
    default:
      return "#0066CC";
  }
}
