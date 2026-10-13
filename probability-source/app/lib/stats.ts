import type { Difficulty } from "../content";
import { questionByKey } from "./questions";
import { dayKey, type Attempt, type State } from "./store";

export type Period = "today" | "week" | "month" | "3m" | "all";
export const PERIODS: { id: Period; label: string }[] = [
  { id: "today", label: "Today" },
  { id: "week", label: "This Week" },
  { id: "month", label: "This Month" },
  { id: "3m", label: "Last 3 Months" },
  { id: "all", label: "All time" },
];
export type Scope = { kind: "all" } | { kind: "rank"; rank: number } | { kind: "lesson"; id: string };

const DAY = 86_400_000;
export function startOfDay(ts: number) { const d = new Date(ts); d.setHours(0, 0, 0, 0); return d.getTime(); }
export function periodStart(p: Period, now = Date.now()): number {
  const today = startOfDay(now);
  if (p === "today") return today;
  if (p === "week") { const dow = (new Date(now).getDay() + 6) % 7; return today - dow * DAY; } // weeks start on Monday
  if (p === "month") { const d = new Date(now); d.setDate(1); d.setHours(0, 0, 0, 0); return d.getTime(); }
  if (p === "3m") return today - 89 * DAY;
  return 0;
}

export function inScope(a: Attempt, scope: Scope): boolean {
  const q = questionByKey[a.q];
  if (!q) return false;
  if (scope.kind === "rank") return q.rank === scope.rank;
  if (scope.kind === "lesson") return q.lessonId === scope.id;
  return true;
}
export function select(attempts: Attempt[], scope: Scope, period: Period, now = Date.now()): Attempt[] {
  const from = periodStart(period, now);
  // Attempts carried over from older versions have no date, so they only count for "All time".
  return attempts.filter((a) => inScope(a, scope) && (period === "all" ? true : a.ts >= from && a.ts > 0));
}

export type Summary = { attempts: number; questions: number; correct: number; partial: number; incorrect: number; accuracy: number; avgMs: number; totalMs: number };
export function summarize(list: Attempt[]): Summary {
  const timed = list.filter((a) => a.ms > 0);
  const totalMs = timed.reduce((s, a) => s + a.ms, 0);
  return {
    attempts: list.length,
    questions: new Set(list.map((a) => a.q)).size,
    correct: list.filter((a) => a.status === "correct").length,
    partial: list.filter((a) => a.status === "partial").length,
    incorrect: list.filter((a) => a.status === "incorrect").length,
    accuracy: list.length ? list.reduce((s, a) => s + a.score, 0) / list.length : 0,
    avgMs: timed.length ? totalMs / timed.length : 0,
    totalMs,
  };
}
export function byDifficulty(list: Attempt[]): Record<Difficulty, Summary> {
  const out = {} as Record<Difficulty, Summary>;
  for (const d of ["easy", "medium", "hard"] as Difficulty[]) out[d] = summarize(list.filter((a) => questionByKey[a.q]?.difficulty === d));
  return out;
}

export type DayBar = { day: string; label: string; total: number; correct: number };
export function history(list: Attempt[], period: Period, now = Date.now()): DayBar[] {
  const dated = list.filter((a) => a.ts > 0);
  const today = startOfDay(now);
  let from = periodStart(period, now);
  if (period === "all") {
    const first = dated.length ? Math.min(...dated.map((a) => a.ts)) : now;
    from = Math.max(startOfDay(first), today - 119 * DAY);
    from = Math.min(from, today - 6 * DAY);
  }
  const to = period === "week" ? from + 6 * DAY : today; // a week is shown in full, Monday to Sunday
  const bars: DayBar[] = [];
  const index: Record<string, DayBar> = {};
  for (let ts = from; ts <= to; ts += DAY) {
    const d = new Date(ts);
    const bar = { day: dayKey(ts), label: period === "week" ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][bars.length] : `${d.getDate()}/${d.getMonth() + 1}`, total: 0, correct: 0 };
    bars.push(bar);
    index[bar.day] = bar;
  }
  for (const a of dated) {
    const bar = index[dayKey(a.ts)];
    if (bar) { bar.total++; if (a.status === "correct") bar.correct++; }
  }
  return bars;
}

// ---------- daily goal and streak ----------
export function attemptsOnDay(attempts: Attempt[], day: string) {
  return attempts.filter((a) => a.ts > 0 && dayKey(a.ts) === day).length;
}
export function goalMet(state: State, day: string, counts: Record<string, number>) {
  return (counts[day] ?? 0) >= (state.goalByDay[day] ?? state.goal);
}
export function goalInfo(state: State, now = Date.now()) {
  const counts: Record<string, number> = {};
  for (const a of state.attempts) if (a.ts > 0) { const k = dayKey(a.ts); counts[k] = (counts[k] ?? 0) + 1; }
  const today = dayKey(now);
  const todayCount = counts[today] ?? 0;
  const goal = state.goalByDay[today] ?? state.goal;
  // Streak: consecutive days that reached their goal. Today does not break the streak until it has passed.
  let streak = 0;
  let ts = startOfDay(now);
  if (!goalMet(state, today, counts)) ts -= DAY;
  while (goalMet(state, dayKey(ts), counts)) { streak++; ts -= DAY; }
  let best = 0, run = 0, prev = 0;
  for (const day of Object.keys(counts).sort()) {
    const t = new Date(day + "T00:00:00").getTime();
    if (goalMet(state, day, counts)) { run = prev && Math.round((t - prev) / DAY) === 1 ? run + 1 : 1; prev = t; best = Math.max(best, run); }
    else { run = 0; prev = 0; }
  }
  const monday = periodStart("week", now);
  const week = Array.from({ length: 7 }, (_, i) => {
    const t = monday + i * DAY;
    const k = dayKey(t);
    return { day: k, name: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i], count: counts[k] ?? 0, met: goalMet(state, k, counts), isToday: k === today, future: t > startOfDay(now) };
  });
  const recent = Array.from({ length: 14 }, (_, i) => {
    const t = startOfDay(now) - (13 - i) * DAY;
    const k = dayKey(t);
    return { day: k, met: goalMet(state, k, counts), count: counts[k] ?? 0 };
  });
  return { week, today: todayCount, goal, reached: todayCount >= goal, streak, best: Math.max(best, streak), recent };
}

export const fmtTime = (ms: number) => {
  const s = Math.round(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};
