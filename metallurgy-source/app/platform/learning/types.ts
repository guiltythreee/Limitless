// app/platform/learning/types.ts
//
// PHASE 5.0 — shared learning contract.
//
// These types are deliberately separate from app/courses/types.ts. The course
// schema describes content and capabilities; this module describes the
// *activity* layer that will later power attempt history, bookmarks, mistakes,
// analytics and revision. Keeping it separate means P5.1 can add storage to
// MT201/MT202 without touching the canonical course or manifest schemas.
//
// Rules that must not change without a new contract:
//   - `picked` is a single option label. All live courses are single-answer.
//   - `ms === 0` means unknown / not timed. Never infer it.
//   - `ts === 0` means unknown date. Never replace it with Date.now().
//   - `source === "legacy"` marks an entry reconstructed from `answered`.
//   - Storage keys stay mm-mt201-v1 / mm-mt202-v1 / mm-mt203-v1.

import type { CourseId, Difficulty, TopicId, UnitId } from "../../courses/types";

/** The four modes already used by MT203. Reused exactly for lossless adapters. */
export type AttemptMode = "learn" | "practice" | "exam" | "revision";

/** `recorded` is a real submission; `legacy` is derived from older progress. */
export type ActivitySource = "recorded" | "legacy";

/**
 * One submitted answer. This is a per-course log entry, not the current state
 * of a question (`answered` remains the current-state map).
 */
export interface Activity {
  courseId: CourseId;
  /** Verbatim question id: "ch01-q12" (MT201/MT202) or "t4-014" (MT203). */
  q: string;
  /** Topic at answer time. Topic scoping uses this snapshot. */
  topicId: TopicId;
  /** Option label as submitted, never an index. */
  picked: string;
  correct: boolean;
  mode: AttemptMode;
  /** Milliseconds on task, >= 0. 0 means unknown / not timed. */
  ms: number;
  /** Epoch milliseconds. 0 means unknown date (legacy). */
  ts: number;
  source: ActivitySource;
}

/**
 * Input to an activity log. `courseId`, `source` and (usually) `ts` are
 * supplied by the log. `mode` defaults to "practice"; `ms` defaults to 0.
 */
export type NewActivity = Omit<
  Activity,
  "courseId" | "ts" | "source" | "mode" | "ms"
> & {
  mode?: AttemptMode;
  ms?: number;
  ts?: number;
};

/**
 * Course-level answer input. `topicId` is optional because a course can derive
 * it from its own question id. The shared core never parses course id formats.
 */
export type AnswerInput = Pick<
  NewActivity,
  "q" | "picked" | "correct" | "mode" | "ms"
> & {
  topicId?: TopicId;
};

/**
 * Read-only question metadata. Built from canonical Question data when a view
 * needs difficulty or unit grouping; never stored as progress.
 */
export interface QuestionMeta {
  /** Same verbatim id as Activity.q. */
  q: string;
  courseId: CourseId;
  topicId: TopicId;
  /** Present only for courses with module grouping (MT203). */
  unitId?: UnitId;
  difficulty: Difficulty;
}

/** Keyed by questionKey(courseId, q). */
export type QuestionMetaIndex = Readonly<Record<string, QuestionMeta>>;

/** Calendar periods. Weeks start Monday; all dates are local. */
export type Period = "today" | "week" | "month" | "3m" | "all";

export interface PeriodOption {
  id: Period;
  label: string;
}

/** Content scope for a history/analytics filter. */
export type Scope =
  | { kind: "all" }
  | { kind: "unit"; unitId: UnitId }
  | { kind: "topic"; topicId: TopicId }
  | { kind: "topics"; topicIds: readonly TopicId[] };

export interface ActivityFilter {
  /** Default "all". */
  period?: Period;
  /** Default { kind: "all" }. */
  scope?: Scope;
  /** Default "any". */
  mode?: AttemptMode | "any";
}

/** Summary over a set of activities. `partial` is intentionally absent. */
export interface ActivitySummary {
  attempts: number;
  /** Unique (courseId, q) pairs. */
  questions: number;
  correct: number;
  incorrect: number;
  /** 0..1 over all attempts. */
  accuracy: number;
  /** Attempts with ms > 0. */
  timed: number;
  totalMs: number;
  /** Over timed attempts only; 0 when timed === 0. */
  avgMs: number;
}

export const ATTEMPT_MODES: readonly AttemptMode[] = [
  "learn",
  "practice",
  "exam",
  "revision",
];

/** Bounded per-course activity history. Oldest entries are dropped first. */
export const MAX_ACTIVITIES = 4000;

/**
 * Read/write façade for one course's additive activity field. Implementations
 * must preserve every other root field (answered, examBest, awarded, days…).
 */
export interface ActivityLog {
  readonly courseId: CourseId;
  readonly storageKey: string;
  /** Sanitise; derive legacy only when the field is absent. Never writes. */
  load(): Activity[];
  /** Read root, append, persist once, return the new list. */
  append(input: NewActivity | readonly NewActity[]): Activity[];
}

/**
 * Storage-agnostic configuration. The course supplies its existing
 * loadProgress/saveProgress pair, so the shared core never constructs a
 * storage key or writes a partial root object.
 */
export interface ActivityLogConfig<TRoot> {
  courseId: CourseId;
  storageKey: string;
  read: () => TRoot;
  write: (root: TRoot) => void;
  /*** The raw value of root.activities (may be undefined on old payloads). */
  getStored: (root: TRoot) => unknown;
  /** Must merge, e.g. (root, activities) => ({ ...root, activities }). */
  setStored: (root: TRoot, activities: readonly Activity[]) => TRoot;
  /** Only called when getStored(root) is not an array. */
  deriveLegacy?: (root: TRoot) => readonly Activity[];
  /** Defaults to MAX_ACTIVITIES. */
  cap?: number;
  /** Injectable clock for deterministic tests. */
  now?: () => number;
}

