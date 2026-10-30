// Browser-local progress for the MT202 archive (mirrors the Probability
// Archive's hc3-progress pattern). Key: mm-mt202-v1.
//
// PHASE 5.1 — an optional `activities` history rides on this same payload and
// is written only through the shared learning core (createActivityLog). The
// storage key, `answered` and `examBest` semantics are unchanged, and loading
// never writes or backfills.
//
// P5.1 REMEDIATION — single-write mutations: every log binds to the caller's
// in-memory root (logFor), so ONE append persists `answered` (+ the exam's
// `examBest`) together with the merged history instead of saving twice.

import {
  MAX_ACTIVITIES,
  DEFAULT_DAILY_GOAL,
  clampDailyGoal,
  createActivityLog,
  dayKey,
  deriveLegacyActivities,
  sanitiseGoalByDay,
} from "../platform/learning";
import type {
  Activity,
  ActivityLog,
  ActivityLogConfig,
  AttemptMode,
  NewActivity,
} from "../platform/learning";
import type { TopicId } from "../courses/types";
import { MT202_MANIFEST } from "../courses/manifests/mt202";

export type QState = { choice: string; correct: boolean; at: number };

export type Progress = {
  answered: Record<string, QState>; // key: "ch01-q12"
  examBest: { score: number; total: number; at: number } | null;
  /** Additive since P5.1; absent on legacy payloads. Written by the log only. */
  activities?: Activity[];
  /** Additive saved-question list; absent on legacy payloads. */
  bookmarks?: string[];
  /** Daily target; absent on legacy payloads. */
  goal?: number;
  /** Historical daily targets, local YYYY-MM-DD keys. */
  goalByDay?: Record<string, number>;
};

const KEY = "mm-mt202-v1";
const THEME_KEY = "mm-theme-v1";

export function qid(chapterId: string, n: number) {
  return `${chapterId}-q${n}`;
}

// Course-owned topic mapping handed to the shared core. The core never
// parses question ids; MT202's own "chNN-qN" scheme resolves to the "chNN"
// chapter (ch09 revision-mix entries included). Unknown ids return
// undefined and are skipped rather than guessed.
function topicOf(q: string): string | undefined {
  return /^(ch\d+)-q\d+$/.exec(q)?.[1];
}

export function loadProgress(): Progress {
  if (typeof window === "undefined") return { answered: {}, examBest: null, bookmarks: [], goal: DEFAULT_DAILY_GOAL, goalByDay: {} };
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { answered: {}, examBest: null, bookmarks: [], goal: DEFAULT_DAILY_GOAL, goalByDay: {} };
    const p = JSON.parse(raw) as Progress;
    // `...p` preserves every unknown root field (activities, future additions).
    // Read-only: load never writes or backfills the activities field.
    return {
      ...p,
      answered: p.answered ?? {},
      examBest: p.examBest ?? null,
      bookmarks: Array.isArray(p.bookmarks) ? [...new Set(p.bookmarks.filter((q) => typeof q === "string" && q.length > 0))] : [],
      goal: clampDailyGoal(p.goal ?? DEFAULT_DAILY_GOAL),
      goalByDay: sanitiseGoalByDay(p.goalByDay),
    };
  } catch {
    return { answered: {}, examBest: null, bookmarks: [], goal: DEFAULT_DAILY_GOAL, goalByDay: {} };
  }
}

export function saveProgress(p: Progress) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* storage unavailable — progress just won't persist */
  }
}

// One log contract, two bindings (P5.1 remediation): `read` is the only
// difference. The exported log below is bound to storage — the course's
// canonical, write-free read path (`load()` derives legacy activities
// read-only). Each mutation instead binds this same contract to its caller's
// in-memory root via logFor(), so the core's single append is also the single
// persistent write: it carries the in-progress `answered` (and the exam's
// `examBest`) down together with the merged history, and no save may follow it.
function withDailyGoalSnapshot(p: Progress, now = Date.now()): Progress {
  const goal = clampDailyGoal(p.goal ?? DEFAULT_DAILY_GOAL);
  const goalByDay = sanitiseGoalByDay(p.goalByDay);
  const today = dayKey(now);
  if (today && goalByDay[today] === undefined) goalByDay[today] = goal;
  return { ...p, goal, goalByDay };
}

export function setDailyGoal(p: Progress, value: number): Progress {
  const goal = clampDailyGoal(value);
  const today = dayKey(Date.now());
  const goalByDay = sanitiseGoalByDay(p.goalByDay);
  if (today) goalByDay[today] = goal;
  const next = { ...p, goal, goalByDay };
  saveProgress(next);
  return next;
}

function logConfig(read: () => Progress): ActivityLogConfig<Progress> {
  return {
    courseId: MT202_MANIFEST.id,
    storageKey: KEY,
    read,
    write: saveProgress,
    getStored: (root) => root.activities,
    setStored: (root, activities) => ({ ...root, activities: [...activities] }),
    deriveLegacy: (root) =>
      deriveLegacyActivities(root.answered ?? {}, {
        courseId: MT202_MANIFEST.id,
        topicOf,
      }),
    cap: MAX_ACTIVITIES,
  };
}

// The course's storage-bound log. The shared core sanitises the stored list
// (or derives it read-only from `answered` on legacy payloads), merges
// `activities` into the root, preserves every other field, and keeps the
// newest MAX_ACTIVITIES (4000) entries.
export const activityLog = createActivityLog<Progress>(logConfig(loadProgress));

/**
 * The same contract bound to ONE caller-supplied root: `read` is the caller's
 * in-memory root (every mutation here persists immediately), `write` is this
 * file's own saveProgress, so the log can neither invent a storage key nor
 * replace a whole payload — and its append IS the single write.
 */
function logFor(root: Progress): ActivityLog {
  return createActivityLog<Progress>(logConfig(() => root));
}

/** Append through the shared log and hand back the root it persisted. */
function appendAndReturn(
  root: Progress,
  incoming: readonly NewActivity[]
): Progress {
  return { ...root, activities: logFor(root).append(incoming) };
}

export function recordAnswer(
  p: Progress,
  key: string,
  choice: string,
  correct: boolean,
  mode: AttemptMode = "practice",
  ms = 0
): Progress {
  const now = Date.now();
  const next: Progress = {
    ...p,
    answered: { ...p.answered, [key]: { choice, correct, at: now } },
  };

  const topicId = topicOf(key);
  if (!topicId) {
    // Not an MT202 question id: record the answer exactly as before.
    saveProgress(next);
    return next;
  }

  // Snapshot the stored-or-derived history BEFORE this answer lands, so the
  // answer is logged exactly once and never duplicated as a legacy twin
  // (legacy derives from the PRE-answer `answered`). `load()` only reads;
  // the append below is the ONE write of this answer — answered + history
  // (and every other root field, known or unknown) persist together.
  const goalSnapshot = withDailyGoalSnapshot(next, now);
  return appendAndReturn({ ...goalSnapshot, activities: logFor(p).load() }, [
    { q: key, topicId, picked: choice, correct, mode, ms, ts: now },
  ]);
}

/** One attempted question of a submitted exam. Blanks never reach the log. */
export type ExamAnswer = {
  /** Progress key, `qid(chapterId, n)` — the same string `answered` uses. */
  key: string;
  /** Topic taken from the question itself, never parsed out of the key. */
  topicId: TopicId;
  choice: string;
  correct: boolean;
};

const sameExamBest = (a: Progress["examBest"], b: Progress["examBest"]) =>
  a === b ||
  (!!a && !!b && a.score === b.score && a.total === b.total && a.at === b.at);

/**
 * PHASE 5.1 — record a submitted exam: one `answered` entry and one `exam`
 * activity per attempted question, PLUS the caller's already-computed
 * `examBest`, all inside ONE persistent write.
 *
 * The best has to arrive here rather than be patched onto the returned root
 * afterwards: this function's append is the final write of the exam flow, so a
 * best applied by the caller afterwards would live only in memory until some
 * later answer happened to save it, and would vanish on reload.
 *
 * A submission with nothing attempted writes only when a genuinely new best
 * arrived, and writes nothing when the caller omits `examBest`.
 */
export function recordExamAnswers(
  p: Progress,
  attempted: readonly ExamAnswer[],
  examBest?: Progress["examBest"]
): Progress {
  // Blanks are skipped here as well as by the caller: no `answered` entry and
  // no activity for an unanswered question.
  const worked = attempted.filter((a) => Boolean(a.choice));
  const best = examBest === undefined ? p.examBest : examBest;

  if (worked.length === 0) {
    // Nothing to batch: keep storage untouched unless a real new best came in
    // (a first-place paper can still be blank), in which case one write carries it.
    if (examBest === undefined || sameExamBest(best, p.examBest)) return p;
    const only: Progress = { ...p, examBest: best };
    saveProgress(only);
    return only;
  }

  const now = Date.now();
  const answered: Record<string, QState> = { ...p.answered };
  for (const a of worked) {
    answered[a.key] = { choice: a.choice, correct: a.correct, at: now };
  }

  // The single write of the exam flow: the shared log appends the activity
  // batch onto THIS root, so answered + activities + examBest persist together.
  // Nothing may be saved after it.
  const root = withDailyGoalSnapshot({
    ...p,
    answered,
    examBest: best,
    activities: logFor(p).load(),
  }, now);

  return appendAndReturn(
    root,
    worked.map((a) => ({
      q: a.key,
      topicId: a.topicId,
      picked: a.choice,
      correct: a.correct,
      mode: "exam",
      ts: now,
    }))
  );
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
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

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
