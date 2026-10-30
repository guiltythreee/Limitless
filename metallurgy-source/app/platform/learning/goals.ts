// Shared local-calendar daily goals and streak calculations.
// The caller owns persistence; this module is pure and safe to use across courses.

import type { Activity } from "./types";
import { dayKey, startOfDay } from "./time";

export const DEFAULT_DAILY_GOAL = 10;
export const MAX_DAILY_GOAL = 200;

export function clampDailyGoal(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return DEFAULT_DAILY_GOAL;
  return Math.min(MAX_DAILY_GOAL, Math.max(1, Math.round(value)));
}

export function sanitiseGoalByDay(raw: unknown): Record<string, number> {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const out: Record<string, number> = {};
  for (const [key, value] of Object.entries(raw)) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(key)) continue;
    if (typeof value !== "number" || !Number.isFinite(value)) continue;
    out[key] = clampDailyGoal(value);
  }
  return out;
}

export interface GoalDay {
  key: string;
  label: string;
  count: number;
  goal: number;
  met: boolean;
  today: boolean;
  future: boolean;
}

export interface DailyGoalInfo {
  todayCount: number;
  goal: number;
  reached: boolean;
  streak: number;
  bestStreak: number;
  week: GoalDay[];
}

function shiftDay(ts: number, amount: number): number {
  const date = new Date(ts);
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + amount);
  return date.getTime();
}

function dayTimestamp(key: string): number {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(key);
  if (!match) return Number.NaN;
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3])).getTime();
}

/**
 * Count answer activities per local-calendar day. Unknown-date legacy records
 * (ts === 0) remain in general history but cannot be credited to a goal day.
 */
export function dailyGoalInfo(
  activities: readonly Activity[],
  rawGoal: unknown = DEFAULT_DAILY_GOAL,
  rawGoalByDay: unknown = {},
  now = Date.now(),
): DailyGoalInfo {
  const goal = clampDailyGoal(rawGoal);
  const goalByDay = sanitiseGoalByDay(rawGoalByDay);
  const counts: Record<string, number> = {};

  for (const activity of activities) {
    if (!Number.isFinite(activity.ts) || activity.ts <= 0) continue;
    const key = dayKey(activity.ts);
    if (!key) continue;
    counts[key] = (counts[key] ?? 0) + 1;
  }

  const goalFor = (key: string) => goalByDay[key] ?? goal;
  const countFor = (key: string) => counts[key] ?? 0;
  const met = (key: string) => countFor(key) >= goalFor(key);

  const todayTs = startOfDay(now);
  const todayKey = dayKey(now);
  const todayCount = countFor(todayKey);
  const reached = todayCount >= goalFor(todayKey);

  // Current streak: continue from today if today's goal is already met;
  // otherwise preserve yesterday's streak while today is still in progress.
  let cursor = reached ? todayTs : shiftDay(todayTs, -1);
  let streak = 0;
  for (let i = 0; i < 3650 && met(dayKey(cursor)); i++) {
    streak++;
    cursor = shiftDay(cursor, -1);
  }

  // Best streak is computed over observed days, checking actual calendar
  // adjacency so missing dates cannot accidentally join two streaks.
  const candidateDays = [...new Set([...Object.keys(counts), ...Object.keys(goalByDay)])]
    .filter((key) => Number.isFinite(dayTimestamp(key)))
    .sort();
  let run = 0;
  let bestStreak = 0;
  let previousQualifiedTs: number | null = null;
  for (const key of candidateDays) {
    const ts = dayTimestamp(key);
    if (!met(key)) {
      run = 0;
      previousQualifiedTs = null;
      continue;
    }
    run = previousQualifiedTs !== null && shiftDay(previousQualifiedTs, 1) === ts ? run + 1 : 1;
    bestStreak = Math.max(bestStreak, run);
    previousQualifiedTs = ts;
  }

  const weekday = (new Date(todayTs).getDay() + 6) % 7; // Monday = 0
  const monday = shiftDay(todayTs, -weekday);
  const week: GoalDay[] = Array.from({ length: 7 }, (_, index) => {
    const ts = shiftDay(monday, index);
    const key = dayKey(ts);
    const d = new Date(ts);
    return {
      key,
      label: d.toLocaleDateString(undefined, { weekday: "short" }),
      count: countFor(key),
      goal: goalFor(key),
      met: met(key),
      today: key === todayKey,
      future: ts > todayTs,
    };
  });

  return { todayCount, goal: goalFor(todayKey), reached, streak, bestStreak, week };
}
