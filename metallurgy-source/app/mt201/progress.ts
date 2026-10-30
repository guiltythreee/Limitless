// Browser-local progress for the MT201 archive. Same shape as the shared
// MT202 store, but its own key so the two courses never tangle.
// Progress: mm-mt201-v1. Theme stays shared: mm-theme-v1.
//
// PHASE 5.1 — attempt history. The root gains ONE optional additive field,
// `activities`, read and written through the shared learning core:
//   - the storage key and the `answered` / `examBest` / reset semantics are
//     unchanged; unknown root fields now survive a load → save round trip
//   - `loadProgress` still never writes: legacy activities are derived on read
//     only and are materialised by the first real append, never by a load
//   - history is capped at MAX_ACTIVITIES (4,000) newest entries
// The shared history UI reads this additive field. Existing answer-state,
// exam and reward behavior is preserved; new capabilities are enabled only
// alongside their user-facing implementations.

import {
  MAX_ACTIVITIES,
  DEFAULT_DAILY_GOAL,
  clampDailyGoal,
  createActivityLog,
  dayKey,
  deriveLegacyActivities,
  sanitiseGoalByDay,
} from "../platform/learning";
import type { Activity, ActivityLog, NewActivity } from "../platform/learning";
import type { TopicId } from "../courses/types";
import { CHAPTER_IDS } from "./types";
import { sanitiseRewardRecords, type RewardRecord } from "../../../shared/rewards.mjs";
import { appendLsrActivity, announceLsrRewardWrite, assessmentActivity, questionActivity, type AssessmentInput } from "../lib/lsr1-rewards";

export type QState = { choice: string; correct: boolean; at: number };

export type Progress = {
  answered: Record<string, QState>; // key: "ch01-q12"
  examBest: { score: number; total: number; at: number } | null;
  /** PHASE 5.1: optional, oldest first. Absent on pre-5.1 payloads. */
  activities?: Activity[];
  /** Additive saved-question list; absent on legacy payloads. */
  bookmarks?: string[];
  /** Daily target; absent on legacy payloads. */
  goal?: number;
  /** Historical daily targets, local YYYY-MM-DD keys. */
  goalByDay?: Record<string, number>;
  rewardLedger?: RewardRecord[];
};

const KEY = "mm-mt201-v1";
const THEME_KEY = "mm-theme-v1";
const COURSE_ID = "mt201";

const CHAPTER_SET: ReadonlySet<string> = new Set(CHAPTER_IDS);

export function qid(chapterId: string, n: number) {
  return `${chapterId}-q${n}`;
}

/**
 * PHASE 5.1 — the course-provided question-id → topic mapping. The shared core
 * never parses ids; it is handed this. MT201 ids are `<chapterId>-q<n>` and
 * only a real chapter maps, so an unexpected key returns undefined and is
 * skipped rather than given a fabricated topic.
 */
export function topicOf(q: string): TopicId | undefined {
  const at = q.lastIndexOf("-q");
  if (at <= 0) return undefined;
  const chapterId = q.slice(0, at);
  if (!CHAPTER_SET.has(chapterId)) return undefined;
  return /^\d+$/.test(q.slice(at + 2)) ? chapterId : undefined;
}

export function loadProgress(): Progress {
  if (typeof window === "undefined") return { answered: {}, examBest: null, bookmarks: [], goal: DEFAULT_DAILY_GOAL, goalByDay: {} };
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { answered: {}, examBest: null, bookmarks: [], goal: DEFAULT_DAILY_GOAL, goalByDay: {} };
    const parsed: unknown = JSON.parse(raw);
    // Non-object payloads keep the empty defaults, exactly as before.
    if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
      return { answered: {}, examBest: null, bookmarks: [], goal: DEFAULT_DAILY_GOAL, goalByDay: {} };
    }
    const p = parsed as Progress;
    // `answered`/`examBest` keep their original defaults; every other field —
    // known or unknown, including `activities` — rides along untouched so a
    // later save cannot drop it. Reading never writes.
    return {
      ...p,
      answered: p.answered ?? {},
      examBest: p.examBest ?? null,
      bookmarks: Array.isArray(p.bookmarks) ? [...new Set(p.bookmarks.filter((q) => typeof q === "string" && q.length > 0))] : [],
      goal: clampDailyGoal(p.goal ?? DEFAULT_DAILY_GOAL),
      goalByDay: sanitiseGoalByDay(p.goalByDay),
      rewardLedger: sanitiseRewardRecords(p.rewardLedger),
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

/**
 * PHASE 5.1 — the shared activity log bound to one root. `read` is the caller's
 * in-memory root (every MT201 mutation already persists immediately), and
 * `write` is this file's own saveProgress, so the log can neither invent a
 * storage key nor replace a whole payload.
 */
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

function logFor(root: Progress): ActivityLog {
  return createActivityLog<Progress>({
    courseId: COURSE_ID,
    storageKey: KEY,
    read: () => root,
    write: saveProgress,
    getStored: (r) => r.activities,
    setStored: (r, activities) => ({ ...r, activities: [...activities] }),
    deriveLegacy: (r) =>
      deriveLegacyActivities(r.answered, { courseId: COURSE_ID, topicOf }),
    cap: MAX_ACTIVITIES,
  });
}

/**
 * Read-only, storage-bound view for the history UI. It derives legacy rows
 * without writing them into old payloads.
 */
export const activityLog: ActivityLog = createActivityLog<Progress>({
  courseId: COURSE_ID,
  storageKey: KEY,
  read: loadProgress,
  write: saveProgress,
  getStored: (root) => root.activities,
  setStored: (root, activities) => ({ ...root, activities: [...activities] }),
  deriveLegacy: (root) =>
    deriveLegacyActivities(root.answered, { courseId: COURSE_ID, topicOf }),
  cap: MAX_ACTIVITIES,
});

/** Append through the shared log and hand back the root it persisted. */
function appendAndReturn(
  root: Progress,
  incoming: readonly NewActivity[]
): Progress {
  return { ...root, activities: logFor(root).append(incoming) };
}

/** One real answer = one `practice` activity, plus the usual `answered` entry. */
export function recordAnswer(p: Progress, key: string, choice: string, correct: boolean, ms = 0): Progress {
  const now = Date.now();
  const next: Progress = {
    ...p,
    answered: { ...p.answered, [key]: { choice, correct, at: now } },
  };

  const topicId = topicOf(key);
  if (!topicId) {
    // Not an id this course owns: keep the answer as before and log nothing
    // rather than invent a topic.
    saveProgress(next);
    return next;
  }

  // Snapshot the stored-or-derived history BEFORE this answer lands, so the
  // answer is logged exactly once and never duplicated as a legacy twin.
  // `load()` only reads — nothing is written or backfilled here.
  const goalSnapshot = withDailyGoalSnapshot(next, now);
  return appendAndReturn({ ...goalSnapshot, activities: logFor(p).load() }, [
    { q: key, topicId, picked: choice, correct, mode: "practice", ms, ts: now },
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
