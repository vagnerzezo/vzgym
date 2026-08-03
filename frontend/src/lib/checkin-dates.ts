/** Local calendar helpers — week always Mon→Sun */

const WEEKDAY_LABELS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"] as const;

export type WeekDay = {
  label: (typeof WEEKDAY_LABELS)[number];
  /** ISO weekday 1–7 (Mon–Sun) */
  weekday: number;
  /** YYYY-MM-DD in local timezone */
  date: string;
  isToday: boolean;
  isFuture: boolean;
};

export function toLocalDateString(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function parseLocalDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** Monday of the week containing `ref` (local) */
export function startOfWeekLocal(ref: Date = new Date()): Date {
  const d = new Date(ref.getFullYear(), ref.getMonth(), ref.getDate());
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

export function getCurrentWeekDays(ref: Date = new Date()): WeekDay[] {
  const monday = startOfWeekLocal(ref);
  const todayStr = toLocalDateString(ref);

  return WEEKDAY_LABELS.map((label, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    const dateStr = toLocalDateString(date);
    return {
      label,
      weekday: index + 1,
      date: dateStr,
      isToday: dateStr === todayStr,
      isFuture: dateStr > todayStr,
    };
  });
}

/** Normalize API checkinDate (ISO string or Date) to YYYY-MM-DD */
export function normalizeCheckinDate(value: string): string {
  if (/^\d{4}-\d{2}-\d{2}/.test(value)) return value.slice(0, 10);
  return toLocalDateString(new Date(value));
}
