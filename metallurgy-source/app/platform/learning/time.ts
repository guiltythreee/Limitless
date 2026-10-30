// app/platform/learning/time.ts
//
// Local-calendar period helpers for the shared learning layer.
//
// Deliberate choices:
//   - "today" starts at local midnight, not UTC midnight.
//   - "week" starts on Monday, matching the Probability reference.
//   - "3m" subtracts 89 calendar days (setDate), so DST does not shift a day.
//   - "all" starts at 0; ts === 0 entries are only visible in "all".

import type { Period, PeriodOption } from "./types";

export const PERIODS: readonly PeriodOption[] = [
  { id: "today", label: "Today" },
  { id: "week", label: "This Week" },
  { id: "month", label: "This Month" },
  { id: "3m", label: "Last 3 Months" },
  { id: "all", label: "All time" },
];

const pad = (n: number) => (n < 10 ? `0${n}` : String(n));

/** Local midnight for the day containing `ts`. */
export function startOfDay(ts: number): number {
  if (!Number.isFinite(ts)) return 0;
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

/** Local calendar day key: YYYY-MM-DD. */
export function dayKey(ts: number): string {
  if (!Number.isFinite(ts)) return "";
  const d = new Date(ts);
  if (!Number.isFinite(d.getTime())) return "";
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/**
 * Inclusive lower bound for a period. `all` returns 0, which callers must
 * treat as "no bound", not as the epoch.
 */
export function periodStart(period: Period, now = Date.now()): number {
  if (period === "all") return 0;

  if (period === "today") return startOfDay(now);

  if (period === "week") {
    const d = new Date(startOfDay(now));
    const dow = (d.getDay() + 6) % 7; // Monday = 0
    d.setDate(d.getDate() - dow);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }

  if (period === "month") {
    const d = new Date(now);
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }

  // "3m": 89 calendar days back, preserving local midnight across DST.
  const d = new Date(startOfDay(now));
  d.setDate(d.getDate() - 89);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}
