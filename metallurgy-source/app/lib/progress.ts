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
  NewActivity,
} from "../platform/learning";
import type { TopicId } from "../courses/types";
import { MT202_MANIFEST } from "../courses/manifests/mt202";
import { sanitiseRewardRecords, type RewardRecord } from "../../../shared/rewards.mjs";
import {
  appendLsrActivity,
  announceLsrRewardWrite,
  assessmentActivity,
  difficultyTier,
  questionActivity,
  type AssessmentInput,
  type LsrActivityMode,
} from "./lsr1-rewards";

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
  /** Additive lifetime Meta ledger; legacy payloads are normalised on load. */
  rewardLedger?: RewardRecord[];
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
  if (typeof window === "undefined") return { answered: {}, examBest: null, bookmarks: [], goal: DEFAULT_DAILY_GOAL, goalByDay: {}, rewardLedger: [] };
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
      rewardLedger: sanitiseRewardRecords(p.rewardLedger),
    };
  } catch {
    return { answered: {}, examBest: null, bookmarks: [], goal: DEFAULT_DAILY_GOAL, goalByDay: {} };
  }
}

export function saveProgress(p: Progress, notifyMeta = false) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(p));
    if (notifyMeta) announceLsrRewardWrite();
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

function logConfig(read: () => Progress, notifyMeta = false): ActivityLogConfig<Progress> {
  return {
    courseId: MT202_MANIFEST.id,
    storageKey: KEY,
    read,
    write: (root) => saveProgress(root, notifyMeta),
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
function logFor(root: Progress, notifyMeta = false): ActivityLog {
  return createActivityLog<Progress>(logConfig(() => root, notifyMeta));
}

/** Append through the shared log and hand back the root it persisted. */
function appendAndReturn(
  root: Progress,
  incoming: readonly NewActivity[],
  notifyMeta = false
): Progress {
  return { ...root, activities: logFor(root, notifyMeta).append(incoming) };
}

export function recordAnswer(
  p: Progress,
  key: string,
  choice: string,
  correct: boolean,
  mode: LsrActivityMode = "practice",
  difficultyOrMs = 0,
  elapsedMs?: number
): Progress {
  // Six-argument P5 callers pass elapsed ms; the LSR-1 quiz passes both
  // difficulty and elapsed ms as the seventh argument.
  const difficulty = elapsedMs === undefined ? 1 : difficultyOrMs;
  const ms = elapsedMs === undefined ? difficultyOrMs : elapsedMs;
  const now = Date.now();
  const fresh = p.answered[key] === undefined;
  const alreadyRewarded = (p.rewardLedger ?? []).some((record) =>
    record.moduleId === "metallurgy-mt202" &&
    record.itemId === "question:" + key &&
    record.totalExp > 0
  );
  const next: Progress = {
    ...p,
    answered: { ...p.answered, [key]: { choice, correct, at: now } },
  };

  const topicId = topicOf(key);
  if (!topicId) {
    saveProgress(next);
    return next;
  }

  const goalSnapshot = withDailyGoalSnapshot(next, now);
  let root: Progress = { ...goalSnapshot, activities: logFor(p).load() };
  let notifyMeta = false;
  if (fresh && !alreadyRewarded && mode === "practice") {
    const reward = appendLsrActivity(root, {
      ...questionActivity("metallurgy-mt202", key, now, correct),
      difficulty: difficultyTier(difficulty),
    });
    root = reward.progress;
    notifyMeta = Boolean(reward.record && reward.record.totalExp > 0);
  }

  return appendAndReturn(root, [
    { q: key, topicId, picked: choice, correct, mode, ms, ts: now },
  ], notifyMeta);
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
  examBest?: Progress["examBest"],
  assessment?: AssessmentInput
): Progress {
  const worked = attempted.filter((a) => Boolean(a.choice));
  const best = examBest === undefined ? p.examBest : examBest;

  if (worked.length === 0) {
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

  let root = withDailyGoalSnapshot({
    ...p,
    answered,
    examBest: best,
    activities: logFor(p).load(),
  }, now);

  let notifyMeta = false;
  if (assessment) {
    const activity = assessmentActivity("metallurgy-mt202", assessment);
    if (activity) {
      const reward = appendLsrActivity(root, activity);
      root = reward.progress;
      notifyMeta = Boolean(reward.record && reward.record.totalExp > 0);
    }
  }

  return appendAndReturn(
    root,
    worked.map((a) => ({
      q: a.key,
      topicId: a.topicId,
      picked: a.choice,
      correct: a.correct,
      mode: "exam",
      ts: now,
    })),
    notifyMeta
  );
}

/** Record a completed assessment reward without changing local attempt history. */
export function recordExamAssessment(p: Progress, input: AssessmentInput): Progress {
  const activity = assessmentActivity("metallurgy-mt202", input);
  if (!activity) return p;
  const reward = appendLsrActivity(p, activity);
  saveProgress(reward.progress, Boolean(reward.record && reward.record.totalExp > 0));
  return reward.progress;
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
  saveProgress({
    answered: {},
    examBest: null,
    activities: [],
    bookmarks: [],
    goal: DEFAULT_DAILY_GOAL,
    goalByDay: {},
    rewardLedger: saved.rewardLedger ?? [],
  });
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
