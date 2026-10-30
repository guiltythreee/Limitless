// Browser-local progress for the MT203 Polymers archive.
// Follows the MT202 "mm-*" localStorage pattern (mm-mt202-v1) but is richer:
// it keeps a full attempt history (needed for spaced revision and weak-area
// detection), theory-read flags, exam records, and an idempotent reward
// ledger so no completion bonus can ever be paid twice.
//
// Key: mm-mt203-v1.  All writes go through the helpers below so a malformed
// or older saved payload can never crash the UI — bad fields are dropped.

import type { Difficulty } from "../mt203/types";
import { sanitiseRewardRecords, type RewardRecord } from "../../../shared/rewards.mjs";
import {
  appendLsrActivity,
  announceLsrRewardWrite,
  assessmentActivity,
  questionActivity,
} from "./lsr1-rewards";

export type { Difficulty };

export type Mode = "learn" | "practice" | "exam" | "revision";

export type Attempt = {
  q: string; // question id
  picked: string; // option label chosen
  correct: boolean;
  mode: Mode;
  ms: number; // 0 = unknown (carried over / not timed)
  ts: number;
};

export type ExamRecord = {
  id: string;
  ts: number;
  label: string;
  total: number;
  correct: number;
  ms: number;
  breakdown: Record<string, { done: number; right: number }>; // module id -> counts
  /** Count of questions the learner actually answered; absent on legacy records. */
  answered?: number;
};

export type Progress = {
  attempts: Attempt[];
  theoryRead: string[]; // lesson section keys "m1:T1.1"
  exams: ExamRecord[];
  best: { score: number; total: number; at: number } | null;
  /** one-time reward ledger: key -> true. Rewards are keyed, never re-awarded. */
  awarded: Record<string, number>;
  /** daily goal met flags, keyed by YYYY-MM-DD — drives the streak */
  days: Record<string, number>;
  goal: number;
  /** Additive saved-question list, kept separate from attempt/reward ledgers. */
  bookmarks: string[];
  /** Additive shared LSR-1 lifetime EXP ledger; legacy XP remains in awarded[]. */
  rewardLedger: RewardRecord[];
};

const KEY = "mm-mt203-v1";
const THEME_KEY = "mm-theme-v1";
const MAX_ATTEMPTS = 4000; // keep localStorage bounded; oldest dropped first

export const DEFAULT_GOAL = 10;

const EMPTY: Progress = {
  attempts: [],
  theoryRead: [],
  exams: [],
  best: null,
  awarded: {},
  days: {},
  goal: DEFAULT_GOAL,
  bookmarks: [],
  rewardLedger: [],
};

const isNum = (v: unknown): v is number => typeof v === "number" && isFinite(v);
const pad = (n: number) => (n < 10 ? `0${n}` : String(n));

export function dayKey(ts: number): string {
  const d = new Date(ts);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Normalise anything from storage into a safe Progress object. */
function sanitise(raw: unknown): Progress {
  const p = (raw ?? {}) as Partial<Progress>;
  const attempts: Attempt[] = Array.isArray(p.attempts)
    ? p.attempts
        .filter((a): a is Attempt => {
          if (!a || typeof a !== "object") return false;
          const t = a as Attempt;
          return typeof t.q === "string" && typeof t.picked === "string" &&
            typeof t.correct === "boolean" && isNum(t.ts);
        })
        .map((a) => ({
          q: a.q, picked: a.picked, correct: a.correct,
          mode: (["learn", "practice", "exam", "revision"] as Mode[]).includes(a.mode) ? a.mode : "practice",
          ms: isNum(a.ms) ? Math.max(0, Math.round(a.ms)) : 0,
          ts: a.ts,
        }))
        .slice(-MAX_ATTEMPTS)
    : [];

  const awarded: Record<string, number> = {};
  if (p.awarded && typeof p.awarded === "object") {
    for (const [k, v] of Object.entries(p.awarded as Record<string, unknown>)) {
      if (isNum(v)) awarded[k] = v;
    }
  }

  const days: Record<string, number> = {};
  if (p.days && typeof p.days === "object") {
    for (const [k, v] of Object.entries(p.days as Record<string, unknown>)) {
      if (/^\d{4}-\d{2}-\d{2}$/.test(k) && isNum(v)) days[k] = v;
    }
  }

  return {
    attempts,
    theoryRead: Array.isArray(p.theoryRead) ? p.theoryRead.filter((s) => typeof s === "string") : [],
    exams: Array.isArray(p.exams) ? p.exams.filter((e) => e && typeof e.id === "string" && isNum(e.ts)).slice(0, 50) : [],
    best: p.best && isNum(p.best.score) && isNum(p.best.total) ? p.best : null,
    awarded,
    days,
    goal: isNum(p.goal) && p.goal > 0 ? Math.min(200, Math.round(p.goal)) : DEFAULT_GOAL,
    bookmarks: Array.isArray(p.bookmarks)
      ? [...new Set(p.bookmarks.filter((q): q is string => typeof q === "string" && q.length > 0))]
      : [],
    rewardLedger: sanitiseRewardRecords(p.rewardLedger),
  };
}

export function loadProgress(): Progress {
  if (typeof window === "undefined") return { ...EMPTY, awarded: {}, days: {} };
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { ...EMPTY, awarded: {}, days: {} };
    return sanitise(JSON.parse(raw));
  } catch {
    return { ...EMPTY, awarded: {}, days: {} };
  }
}

export function saveProgress(p: Progress, notifyMeta = false) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(p));
    if (notifyMeta) announceLsrRewardWrite();
  } catch {
    /* storage unavailable or full — progress just will not persist */
  }
}

export function toggleBookmark(p: Progress, questionId: string): Progress {
  if (!questionId) return p;
  const current = Array.isArray(p.bookmarks) ? p.bookmarks : [];
  const bookmarks = current.includes(questionId)
    ? current.filter((q) => q !== questionId)
    : [...current, questionId];
  const next = { ...p, bookmarks };
  saveProgress(next);
  return next;
}

export function resetProgress() {
  const saved = loadProgress();
  saveProgress({ ...EMPTY, rewardLedger: saved.rewardLedger });
}

/** Latest attempt per question id (last write wins). */
export function latestByQuestion(p: Progress): Record<string, Attempt> {
  const map: Record<string, Attempt> = {};
  for (const a of p.attempts) map[a.q] = a;
  return map;
}

/**
 * Record a submitted answer. Returns the updated progress and saves it.
 * A retry is a new attempt (history preserved for spaced revision) but the
 * *current* state of a question is always its most recent attempt.
 */
export function recordAnswer(
  p: Progress,
  qid: string,
  picked: string,
  correct: boolean,
  mode: Mode = "practice",
  ms = 0,
  difficulty = 1,
  persist = true
): Progress {
  const now = Date.now();
  const day = dayKey(now);
  let next: Progress = {
    ...p,
    attempts: [...p.attempts, { q: qid, picked, correct, mode, ms, ts: now }].slice(-MAX_ATTEMPTS),
    days: { ...p.days, [day]: (p.days[day] ?? 0) + 1 },
  };
  if (mode !== "exam") {
    next = appendLsrActivity(next, questionActivity(
      "metallurgy-mt203", qid, now, correct, p.attempts.length, difficulty
    )).progress;
    if (persist) saveProgress(next, true);
  } else if (persist) {
    saveProgress(next);
  }
  return next;
}

/** Idempotent one-time award. Returns xp gained (0 if already awarded). */
export function awardOnce(p: Progress, key: string, xp: number, persist = true): { xp: number; progress: Progress } {
  if (p.awarded[key]) return { xp: 0, progress: p };
  const next: Progress = { ...p, awarded: { ...p.awarded, [key]: xp } };
  if (persist) saveProgress(next);
  return { xp, progress: next };
}

export function markTheoryRead(p: Progress, key: string): Progress {
  if (p.theoryRead.includes(key)) return p;
  const next: Progress = { ...p, theoryRead: [...p.theoryRead, key] };
  saveProgress(next);
  return next;
}

export function recordExam(p: Progress, rec: ExamRecord, persist = true): Progress {
  let next: Progress = { ...p, exams: [rec, ...p.exams].slice(0, 50) };
  if (!p.best || rec.correct / Math.max(1, rec.total) > p.best.score / Math.max(1, p.best.total)) {
    next.best = { score: rec.correct, total: rec.total, at: rec.ts };
  }
  const activity = assessmentActivity("metallurgy-mt203", {
    runId: rec.id,
    ts: rec.ts,
    total: rec.total,
    answered: typeof rec.answered === "number" ? rec.answered : 0,
    correct: rec.correct,
  });
  if (activity) next = appendLsrActivity(next, activity).progress;
  if (persist) saveProgress(next, Boolean(activity));
  return next;
}

// ---------------------------------------------------------------- theme

export function loadTheme(): "dark" | "light" {
  if (typeof window === "undefined") return "dark";
  try {
    return window.localStorage.getItem(THEME_KEY) === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
}

export function saveTheme(t: "dark" | "light") {
  try {
    window.localStorage.setItem(THEME_KEY, t);
  } catch {
    /* ignore */
  }
}

// ------------------------------------------------------- stats & mastery

export type QStat = {
  id: string;
  attempts: number;
  correct: number; // consecutive-correct run, most recent first
  totalCorrect: number;
  lastTs: number;
  seen: boolean;
  mastered: boolean;
};

const MASTERY_STREAK = 2; // consecutive correct answers to master a question
const MASTERY_MIN_ATTEMPTS = 2;

/** Per-question statistics used by weak-area detection and revision. */
export function questionStats(p: Progress, ids: string[]): Record<string, QStat> {
  const out: Record<string, QStat> = {};
  for (const id of ids) {
    out[id] = { id, attempts: 0, correct: 0, totalCorrect: 0, lastTs: 0, seen: false, mastered: false };
  }
  for (const a of p.attempts) {
    const s = out[a.q];
    if (!s) continue;
    s.attempts++;
    s.seen = true;
    s.lastTs = Math.max(s.lastTs, a.ts);
    if (a.correct) {
      s.totalCorrect++;
      s.correct++;
    } else {
      s.correct = 0;
    }
  }
  for (const s of Object.values(out)) {
    s.mastered = s.attempts >= MASTERY_MIN_ATTEMPTS && s.correct >= MASTERY_STREAK;
  }
  return out;
}

export type TopicAgg = {
  done: number;
  total: number;
  right: number;
  pct: number;
  acc: number; // 0..1 over attempted
  mastered: number;
  weak: boolean;
  untried: boolean;
};

/** Aggregate per-topic performance across a set of question ids. */
export function topicAggregate(
  p: Progress,
  topicOf: Record<string, string>,
  ids: string[]
): Record<string, TopicAgg> {
  const stats = questionStats(p, ids);
  const agg: Record<string, TopicAgg> = {};
  for (const id of ids) {
    const t = topicOf[id];
    if (!t) continue;
    const a = agg[t] ?? (agg[t] = { done: 0, total: 0, right: 0, pct: 0, acc: 0, mastered: 0, weak: false, untried: false });
    a.total++;
    const s = stats[id];
    if (s.seen) {
      a.done++;
      const last = lastAttempt(p, id);
      if (last?.correct) a.right++;
      if (s.mastered) a.mastered++;
    }
  }
  for (const a of Object.values(agg)) {
    a.pct = a.total ? Math.round((a.done / a.total) * 100) : 0;
    a.acc = a.done ? a.right / a.done : 0;
    // Weak only when enough evidence exists: attempted, and accuracy poor.
    a.untried = a.done === 0;
    a.weak = a.done >= 4 && a.acc < 0.6;
  }
  return agg;
}

export function lastAttempt(p: Progress, qid: string): Attempt | undefined {
  for (let i = p.attempts.length - 1; i >= 0; i--) if (p.attempts[i].q === qid) return p.attempts[i];
  return undefined;
}

// ------------------------------------------------------- spaced revision

const STEPS_DAYS = [1, 3, 7, 14, 30, 60]; // interval grows with each clean streak

/** Days until a question is due again (0 = due now, negative = overdue). */
export function dueInDays(s: QStat, now = Date.now()): number {
  if (!s.seen) return 0; // unseen is always eligible
  if (s.correct === 0) return 0; // just got one wrong — due immediately
  const step = STEPS_DAYS[Math.min(s.correct, STEPS_DAYS.length) - 1];
  const due = new Date(s.lastTs + step * 86_400_000);
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  return Math.round((due.getTime() - today.getTime()) / 86_400_000);
}

/**
 * Select revision questions: overdue / just-missed first, then the least
 * recently seen. Never repeats a question inside one revision set.
 */
export function selectRevision(
  p: Progress,
  ids: string[],
  limit: number,
  now = Date.now()
): string[] {
  const stats = questionStats(p, ids);
  const scored = ids
    .filter((id) => stats[id].attempts > 0) // revision only re-serves seen questions
    .map((id) => {
      const s = stats[id];
      const due = dueInDays(s, now);
      // priority: wrong-now (0) > overdue (small) > not-yet-due (larger)
      const priority = due <= 0 ? 0 : 1000 + due;
      return { id, priority, lastTs: s.lastTs };
    })
    .sort((a, b) => a.priority - b.priority || a.lastTs - b.lastTs);
  return scored.slice(0, limit).map((x) => x.id);
}

// ------------------------------------------------------------ xp rewards

/**
 * Canonical per-question XP. Difficulty-scaled, following the difficulty
 * convention used across Limitless trainers (higher difficulty pays more).
 * Used with awardOnce so a question can never be XP-farmed by re-answering.
 */
export function xpForQuestion(diff: Difficulty): number {
  return ({ 1: 4, 2: 8, 3: 14, 4: 22 } as Record<Difficulty, number>)[diff] ?? 4;
}

/** One-time completion bonuses (module mastery, chapter clear). */
export const BONUS = {
  moduleClear: (num: number) => 60 * num, // finish every question in a module
  mastery: (num: number) => 120 * num, // reach mastery criteria on a module
} as const;

/**
 * Award XP for one submitted answer. Pays only on the first *correct*
 * answer of a question (key `q:<id>`), so replaying a question — in any
 * mode, after refresh, or through an exam replay — can never pay twice.
 * Returns the XP gained and the updated (saved) progress.
 */
export function awardAnswer(
  p: Progress,
  qid: string,
  diff: Difficulty,
  correct: boolean,
  persist = true
): { xp: number; progress: Progress } {
  if (!correct) return { xp: 0, progress: p };
  const key = `q:${qid}`;
  if (p.awarded[key]) return { xp: 0, progress: p };
  const xp = xpForQuestion(diff);
  const next: Progress = { ...p, awarded: { ...p.awarded, [key]: xp } };
  if (persist) saveProgress(next);
  return { xp, progress: next };
}

/** Total XP = the ledger itself (recomputable, never drifts). */
export function totalXp(p: Progress): number {
  return Object.values(p.awarded).reduce((a, b) => a + b, 0);
}

// ------------------------------------------------------------ ranks

/**
 * Module-local honour ranks. MT203 (like the other Limitless courses) has no
 * shared cross-module XP economy, so these thresholds are declared here and
 * read only against this module's own ledger.
 */
export const RANKS: { at: number; name: string }[] = [
  { at: 0, name: "Novice" },
  { at: 150, name: "Apprentice" },
  { at: 450, name: "Formulator" },
  { at: 900, name: "Compounder" },
  { at: 1500, name: "Polymer Technologist" },
  { at: 2400, name: "Materials Engineer" },
  { at: 3600, name: "Polymer Master" },
];

export function rankFor(xp: number): { name: string; floor: number; next: number | null; pct: number } {
  let floor = 0;
  let name = RANKS[0].name;
  let next: number | null = null;
  for (let i = 0; i < RANKS.length; i++) {
    if (xp >= RANKS[i].at) {
      floor = RANKS[i].at;
      name = RANKS[i].name;
      next = i + 1 < RANKS.length ? RANKS[i + 1].at : null;
    }
  }
  const pct = next === null ? 100 : Math.round(((xp - floor) / Math.max(1, next - floor)) * 100);
  return { name, floor, next, pct };
}

/** Update the daily-answer goal (bounded 1–200). */
export function setGoal(p: Progress, goal: number): Progress {
  const next: Progress = { ...p, goal: Math.max(1, Math.min(200, Math.round(goal) || DEFAULT_GOAL)) };
  saveProgress(next);
  return next;
}

/**
 * Daily goal → streak. A day counts when at least `goal` answers were
 * submitted that day. The current streak runs from today (or yesterday,
 * if today is not yet met) backwards.
 */
export function streakInfo(p: Progress, now = Date.now()): {
  streak: number;
  best: number;
  today: number;
  goal: number;
} {
  const counts = { ...p.days };
  const goal = p.goal;
  const today = counts[dayKey(now)] ?? 0;

  const dayList = Object.keys(counts).sort();
  // best = longest run of consecutive qualifying days
  let best = 0;
  let run = 0;
  let prev: number | null = null;
  for (const d of dayList) {
    if (counts[d] < goal) {
      run = 0;
      prev = null;
      continue;
    }
    const t = new Date(`${d}T00:00:00`).getTime();
    run = prev !== null && t - prev === 86_400_000 ? run + 1 : 1;
    prev = t;
    best = Math.max(best, run);
  }

  // current streak: walk back from today (today may still be in progress)
  let streak = 0;
  let cursor = today >= goal ? now : now - 86_400_000;
  for (;;) {
    const k = dayKey(cursor);
    if ((counts[k] ?? 0) >= goal) {
      streak++;
      cursor -= 86_400_000;
    } else break;
    if (streak > 3650) break;
  }
  return { streak, best, today, goal };
}

// ------------------------------------------------------ module statistics

export type ModuleAgg = {
  id: string;
  total: number;
  seen: number; // attempted at least once (latest attempt counts)
  right: number; // latest attempt correct
  mastered: number; // question-level mastery (2-in-a-row)
  topicAgg: Record<string, TopicAgg>;
  clear: boolean; // every question attempted
  mastery: boolean; // mastery criteria met (enforced below)
};

/**
 * Mastery criteria for a module — all three must hold, and they are checked
 * against real recorded attempts (not a stored flag, so a hand-edited or
 * stale flag cannot claim mastery):
 *   1. every topic has at least 40% of its questions attempted
 *   2. at least 70% of the module's questions attempted
 *   3. accuracy ≥ 75% over attempted questions (latest attempt each)
 */
export function moduleAgg(
  p: Progress,
  moduleId: string,
  questionIds: string[],
  topicOf: Record<string, string>,
  topicsInModule: string[]
): ModuleAgg {
  const agg = topicAggregate(p, topicOf, questionIds);
  const stats = questionStats(p, questionIds);
  let seen = 0;
  let right = 0;
  let mastered = 0;
  for (const id of questionIds) {
    const s = stats[id];
    if (s.seen) {
      seen++;
      if (lastAttempt(p, id)?.correct) right++;
      if (s.mastered) mastered++;
    }
  }
  const total = questionIds.length;
  const topicOk = topicsInModule.every(
    (t) => (agg[t]?.done ?? 0) >= Math.ceil((agg[t]?.total ?? 1) * 0.4)
  );
  return {
    id: moduleId,
    total,
    seen,
    right,
    mastered,
    topicAgg: agg,
    clear: total > 0 && seen === total,
    mastery:
      total > 0 && topicOk && seen / total >= 0.7 && (right / Math.max(1, seen)) >= 0.75,
  };
}
