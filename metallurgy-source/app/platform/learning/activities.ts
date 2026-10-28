// app/platform/learning/activities.ts
//
// Pure activity-log helpers. No storage, no React, no course imports.
//
// The two important invariants:
//   1. Sanitising/reading never invents data. Missing ms stays 0; a missing
//      legacy ts stays 0; a stored entry without a valid ts is dropped.
//      Legacy entries are labelled `source: "legacy"`.
//   2. Appending never mutates its inputs and is idempotent for an identical
//      entry (same course, question, timestamp, mode, pick and source).

import type {
  CourseId,
  Question,
  TopicId,
  UnitId,
} from "../../courses/types";
import type {
  Activity,
  ActivityFilter,
  ActivitySoumary,
  ActivitySource,
  AttemptMode,
  NewActivity,
  QuestionMeta,
  QuestionMetaIndex,
  Scope,
} from "./types";
import { ATTEMPT_MODES, MAX_ACTIVITIES } from "./types";
import { periodStart } from "./time";

const isNum = (v: unknown): v is number =>
  typeof v === "number" && Number.isFinite(v);

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null;

const isMode = (v: unknown): v is AttemptMode =>
  typeof v === "string" && (ATTEMPT_MODES as readonly string[]).includes(v);

const isSource = (v: unknown): v is ActivitySource =>
  v === "recorded" || v === "legacy";

const nonEmpty = (v: unknown): v is string =>
  typeof v === "string" && v.length > 0;

const clampMs = (v: unknown): number =>
  isNum(v) ? Math.max(0, Math.round(v)) : 0;

const clampTs = (v: unknown, fallback = 0): number =>
  isNum(v) && v >= 0 ? Math.round(v) : fallback;

/** Stable key for a question across a mixed-course list. */
export function questionKey(courseId: CourseId, q: string): string {
  return `${courseId}|${q}`;
}

/** Stable key for one activity. Used for dedupe only, not display. */
export function activityKey(a: Activity): string {
  return [a.courseId, a.q, a.ts, a.mode, a.picked, a.source].join("|");
}

/** Project canonical question data into the small metadata index. */
export function metaOfQuestion(
  q: Pick<Question, "id" | "topicId" | "difficulty">,
  courseId: CourseId,
  unitId?: UnitId
): QuestionMeta {
  return {
    q: q.id,
    courseId,
    topicId: q.topicId,
    unitId,
    difficulty: q.difficulty,
  };
}

/** Index by questionKey(courseId, q). Later entries win on duplicate keys. */
export function indexQuestionMeta(
  list: readonly QuestionMeta[]
): QuestionMetaIndex {
  const out: Record<string, QuestionMeta> = {};
  for (const m of list) out[questionKey(m.courseId, m.q)] = m;
  return out;
}

/**
 * Normalise anything found in storage. Malformed entries are dropped, never
 * repaired with fabricated timestamps. Negative ms clamps to 0; a negative or
 * non-finite ts is invalid and is dropped (0 remains valid = unknown date).
 */
export function sanitiseActivities(
  raw: unknown,
  courseId: CourseId,
  cap = MAX_ACTIVITIES
): Activity[] {
  if (!Array.isArray(raw)) return [];

  const out: Activity[] = [];
  for (const item of raw) {
    if (!isRecord(item)) continue;

    if (!nonEmpty(item.q)) continue;
    if (!nonEmpty(item.topicId)) continue;
    if (!nonEmpty(item.picked)) continue;
    if (typeof item.correct !== "boolean") continue;
    if (item.courseId !== courseId) continue;
    if (!isNum(item.ms) || !isNum(item.ts) || item.ts < 0) continue;

    const mode: AttemptMode = isMode(item.mode) ? item.mode : "practice";
    const source: ActivitySource = isSource(item.source)
      ? item.source
      : "recorded";

    out.push({
      courseId,
      q: item.q,
      topicId: item.topicId,
      picked: item.picked,
      correct: item.correct,
      mode,
      ms: Math.max(0, Math.round(item.ms)),
      ts: Math.round(item.ts),
      source,
    });
  }

  const limit = Math.max(0, Math.floor(cap));
  if (limit === 0) return [];
  return out.slice(-limit);
}

/**
 * Append one batch. All entries in the batch share one timestamp unless they
 * already carry a valid `ts`. Identical entries are skipped. Inputs untouched.
 */
export function appendActivities(
  existing: readonly Activity[],
  incoming: readonly NewActivity[],
  opts: { courseId: CourseId; cap?: number; now?: number }
): Activity[] {
  const cap = Math.max(0, Math.floor(opts.cap ?? MAX_ACTIVITIES));
  if (cap === 0) return [];

  const now = isNum(opts.now) ? Math.round(opts.now) : Date.now();
  const out: Activity[] = [...existing];
  const seen = new Set(out.map(activityKey));

  for (const raw of incoming) {
    if (!isRecord(raw)) continue;

    if (!nonEmpty(raw.q)) continue;
    if (!nonEmpty(raw.topicId)) continue;
    if (!nonEmpty(raw.picked)) continue;
    if (typeof raw.correct !== "boolean") continue;

    if (raw.mode !== undefined && !isMode(raw.mode)) continue;
    if (raw.ms !== undefined && !isNum(raw.ms)) continue;
    if (raw.ts !== undefined && (!isNum(raw.ts) || raw.ts < 0)) continue;

    const activity: Activity = {
      courseId: opts.courseId,
      q: raw.q,
      topicId: raw.topicId,
      picked: raw.picked,
      correct: raw.correct,
      mode: isMode(raw.mode) ? raw.mode : "practice",
      ms: clampMs(raw.ms),
      ts: raw.ts === undefined ? now : clampTs(raw.ts, now),
      source: "recorded",
    };

    const key = activityKey(activity);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(activity);
  }

  return out.slice(-cap);
}

/**
 * Reconstruct one legacy activity per `answered` entry. This is a read
 * projection: callers must not persist it on load. Unknown question ids are
 * skipped rather than assigned a fabricated topic.
 */
export function deriveLegacyActivities(
  answered: Readonly<
    Record<
      string,
      { choice?: string; picked?: string; correct: boolean; at?: number }
    >
  >,
  opts: {
    courseId: CourseId;
    topicOf: (q: string) => TopicId | undefined;
    mode?: AttemptMode;
  }
): Activity[] {
  if (!isRecord(answered)) return [];

  const mode: AttemptMode = isMode(opts.mode) ? opts.mode : "practice";
  const out: Activity[] = [];

  for (const [q, raw] of Object.entries(answered)) {
    if (!nonEmpty(q) || !isRecord(raw)) continue;
    if (typeof raw.correct !== "boolean") continue;

    const picked = nonEmpty(raw.picked) ? raw.picked : raw.choice;
    if (!nonEmpty(picked)) continue;

    const topicId = opts.topicOf(q);
    if (!nonEmpty(topicId)) continue;

    out.push({
      courseId: opts.courseId,
      q,
      topicId,
      picked,
      correct: raw.correct,
      mode,
      ms: 0,
      ts: clampTs(raw.at, 0),
      source: "legacy",
    });
  }

  // Deterministic order: oldest first, then question id for ts === 0 ties.
  out.sort((a, b) => a.ts - b.ts || a.q.localeCompare(b.q));
  return out;
}

/**
 * Adapt an existing per-course attempt list (MT203's `Attempt[]` today) into
 * canonical activities in memory. Unknown topics are skipped.
 */
export function toActivities(
  attempts: readonly {
    q: string;
    picked: string;
    correct: boolean;
    mode?: AttemptMode;
    ms?: number;
    ts?: number;
  }[],
  opts: {
    courseId: CourseId;
    topicOf: (q: string) => TopicId | undefined;
    source?: ActivitySource;
  }
): Activity[] {
  if (!Array.isArray(attempts)) return [];

  const source: ActivitySource = isSource(opts.source)
    ? opts.source
    : "recorded";
  const out: Activity[] = [];

  for (const raw of attempts) {
    if (!isRecord(raw)) continue;
    if (!nonEmpty(raw.q)) continue;
    if (!nonEmpty(raw.picked)) continue;
    if (typeof raw.correct !== "boolean") continue;

    const topicId = opts.topicOf(raw.q);
    if (!nonEmpty(topicId)) continue;

    out.push({
      courseId: opts.courseId,
      q: raw.q,
      topicId,
      picked: raw.picked,
      correct: raw.correct,
      mode: isMode(raw.mode) ? raw.mode : "practice",
      ms: clampMs(raw.ms),
      ts: clampTs(raw.ts, 0),
      source,
    });
  }

  return out;
}

/** Content scope check. Unit scope needs a metadata entry; missing meta fails. */
export function inScope(
  a: Activity,
  scope: Scope,
  meta: QuestionMetaIndex
): boolean {
  if (scope.kind === "all") return true;
  if (scope.kind === "topic") return a.topicId === scope.topicId;
  if (scope.kind === "topics") return scope.topicIds.includes(a.topicId);
  if (scope.kind === "unit") {
    const m = meta[questionKey(a.courseId, a.q)];
    return m?.unitId === scope.unitId;
  }
  return false;
}

/**
 * Filter by period, mode and scope. `ts === 0` is included only for "all".
 * No upper bound is applied; a future timestamp still counts as "today".
 */
export function selectActivities(
  list: readonly Activity[],
  filter: ActivityFilter,
  meta: QuestionMetaIndex,
  now = Date.now()
): Activity[] {
  const period = filter.period ?? "all";
  const scope: Scope = filter.scope ?? { kind: "all" };
  const mode = filter.mode ?? "any";
  const from = periodStart(period, now);

  return list.filter(
    (a) =>
      (period === "all" || (a.ts > 0 && a.ts >= from)) &&
      (mode === "any" || a.mode === mode) &&
      inScope(a, scope, meta)
  );
}

/**
 * Latest activity per question. Later list order wins on equal timestamps;
 * an older timestamp never replaces a newer one just because it appears later.
 */
export function latestByQuestion(
  list: readonly Activity[]
): Record<string, Activity> {
  const out: Record<string, Activity> = {};
  for (const a of list) {
    const key = questionKey(a.courseId, a.q);
    const prev = out[key];
    if (!prev || a.ts >= prev.ts) out[key] = a;
  }
  return out;
}

/** Summary over all supplied attempts. Only ms > 0 contributes to timing. */
export function summarise(list: readonly Activity[]): ActivitySummary {
  const questions = new Set<string>();
  let correct = 0;
  let timed = 0;
  let totalMs = 0;

  for (const a of list) {
    questions.add(questionKey(a.courseId, a.q));
    if (a.correct) correct++;
    if (a.ms > 0) {
      timed++;
      totalMs += a.ms;
    }
  }

  const attempts = list.length;
  return {
    attempts,
    questions: questions.size,
    correct,
    incorrect: attempts - correct,
    accuracy: attempts > 0 ? correct / attempts : 0,
    timed,
    totalMs,
    avgMs: timed > 0 ? totalMs / timed : 0,
  };
}

