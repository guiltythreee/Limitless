/**
 * Shared learning intelligence for CP, Maths Trainer and Studies.
 *
 * Pure projections only: this module never reads or writes storage, grades
 * questions, changes course content, or awards rewards. Each application
 * adapts its existing attempt history into these records and remains the
 * authority for persistence and discipline-specific evaluation.
 */

export type LearningOutcome = "correct" | "partial" | "incorrect" | "skipped";
export type LearningMode = "learn" | "practice" | "exam" | "revision" | "contest";
export type LearningMistakeCategory =
  | "conceptual"
  | "observation"
  | "mathematical"
  | "implementation"
  | "time-management"
  | "recall"
  | "formula-selection"
  | "units"
  | "procedure";

export interface LearningAttempt {
  id: string;
  disciplineId: string;
  courseId: string;
  contentId: string;
  questionId?: string;
  subjectId?: string;
  conceptIds: readonly string[];
  outcome: LearningOutcome;
  occurredAt: number;
  elapsedMs?: number;
  hintCount?: number;
  independent?: boolean;
  mode?: LearningMode;
  mistakeCategory?: LearningMistakeCategory;
  reviewedAt?: number;
}

export interface ConceptMastery {
  key: string;
  disciplineId: string;
  subjectId: string;
  conceptId: string;
  label: string;
  attempts: number;
  correct: number;
  partial: number;
  incorrect: number;
  accuracy: number;
  independentAttempts: number;
  independentAccuracy: number | null;
  lastPractisedAt: number;
  status: "insufficient-data" | "developing" | "secure" | "mastered";
}

export interface ConceptMistakeSummary {
  key: string;
  disciplineId: string;
  subjectId: string;
  conceptId: string;
  conceptLabel: string;
  category: LearningMistakeCategory;
  occurrences: number;
  lastOccurredAt: number;
}

export interface RevisionCandidate {
  key: string;
  disciplineId: string;
  courseId: string;
  contentId: string;
  questionId?: string;
  conceptIds: readonly string[];
  failures: number;
  lastFailureAt: number;
  lastReviewedAt?: number;
  dueAt: number;
  overdueDays: number;
  priority: number;
}

const DAY_MS = 86_400_000;
const VALID_OUTCOMES = new Set<LearningOutcome>(["correct", "partial", "incorrect", "skipped"]);

function validAttempt(value: LearningAttempt): boolean {
  return !!value &&
    typeof value.id === "string" && value.id.trim().length > 0 &&
    typeof value.disciplineId === "string" && value.disciplineId.trim().length > 0 &&
    typeof value.courseId === "string" && value.courseId.trim().length > 0 &&
    typeof value.contentId === "string" && value.contentId.trim().length > 0 &&
    Array.isArray(value.conceptIds) &&
    VALID_OUTCOMES.has(value.outcome) &&
    Number.isFinite(value.occurredAt) && value.occurredAt > 0;
}

function cleanLabel(value: string): string {
  return value.normalize("NFKC").trim().replace(/\s+/g, " ");
}

/** Normalise equivalent labels while keeping C++, C# and subject boundaries distinct. */
export function normalizeConceptKey(
  disciplineId: string,
  subjectId: string | undefined,
  concept: string,
): string {
  const normalise = (value: string) => cleanLabel(value)
    .toLocaleLowerCase()
    .replace(/[^\p{L}\p{N}+#]+/gu, " ")
    .trim()
    .replace(/\s+/g, " ");
  return [normalise(disciplineId), normalise(subjectId || "general"), normalise(concept)].join("::");
}

/** Build an evidence-based mastery projection; unknown/low-sample data is never called mastered. */
export function buildConceptMastery(
  attempts: readonly LearningAttempt[],
  options: { minSecureAttempts?: number; minMasteryAttempts?: number } = {},
): ConceptMastery[] {
  const minSecure = options.minSecureAttempts ?? 5;
  const minMastery = options.minMasteryAttempts ?? 8;
  const groups = new Map<string, {
    disciplineId: string; subjectId: string; conceptId: string; label: string;
    attempts: LearningAttempt[];
  }>();

  for (const attempt of attempts) {
    if (!validAttempt(attempt) || attempt.outcome === "skipped") continue;
    const subjectId = attempt.subjectId || "general";
    for (const rawConcept of attempt.conceptIds) {
      if (typeof rawConcept !== "string" || !rawConcept.trim()) continue;
      const label = cleanLabel(rawConcept);
      const key = normalizeConceptKey(attempt.disciplineId, subjectId, label);
      const group = groups.get(key) ?? {
        disciplineId: attempt.disciplineId, subjectId, conceptId: key, label, attempts: [],
      };
      group.attempts.push(attempt);
      groups.set(key, group);
    }
  }

  return [...groups.entries()].map(([key, group]) => {
    const rows = group.attempts;
    const correct = rows.filter((row) => row.outcome === "correct").length;
    const partial = rows.filter((row) => row.outcome === "partial").length;
    const incorrect = rows.filter((row) => row.outcome === "incorrect").length;
    const score = correct + partial * 0.5;
    const accuracy = score / rows.length;
    const independentRows = rows.filter((row) => row.independent === true && row.hintCount !== undefined && row.hintCount === 0);
    const independentCorrect = independentRows.filter((row) => row.outcome === "correct").length;
    const independentAccuracy = independentRows.length ? independentCorrect / independentRows.length : null;
    const status: ConceptMastery["status"] =
      rows.length < 3 ? "insufficient-data" :
      rows.length >= minMastery && accuracy >= 0.9 && independentRows.length >= 3 && (independentAccuracy ?? 0) >= 0.85 ? "mastered" :
      rows.length >= minSecure && accuracy >= 0.75 ? "secure" : "developing";
    return {
      key, disciplineId: group.disciplineId, subjectId: group.subjectId,
      conceptId: group.conceptId, label: group.label, attempts: rows.length,
      correct, partial, incorrect, accuracy, independentAttempts: independentRows.length,
      independentAccuracy, lastPractisedAt: Math.max(...rows.map((row) => row.occurredAt)), status,
    };
  }).sort((a, b) => a.disciplineId.localeCompare(b.disciplineId) ||
    a.subjectId.localeCompare(b.subjectId) || a.label.localeCompare(b.label));
}

/** Find recurring concept-level mistakes without merging concepts across disciplines or subjects. */
export function buildConceptMistakeSummary(
  attempts: readonly LearningAttempt[],
): ConceptMistakeSummary[] {
  const groups = new Map<string, ConceptMistakeSummary>();
  for (const attempt of attempts) {
    if (!validAttempt(attempt) || (attempt.outcome !== "incorrect" && attempt.outcome !== "partial") || !attempt.mistakeCategory) continue;
    const subjectId = attempt.subjectId || "general";
    for (const rawConcept of attempt.conceptIds) {
      if (typeof rawConcept !== "string" || !rawConcept.trim()) continue;
      const conceptLabel = cleanLabel(rawConcept);
      const conceptKey = normalizeConceptKey(attempt.disciplineId, subjectId, conceptLabel);
      const key = conceptKey + "::" + attempt.mistakeCategory;
      const current = groups.get(key) ?? {
        key, disciplineId: attempt.disciplineId, subjectId, conceptId: conceptKey,
        conceptLabel, category: attempt.mistakeCategory, occurrences: 0, lastOccurredAt: 0,
      };
      current.occurrences += 1;
      current.lastOccurredAt = Math.max(current.lastOccurredAt, attempt.occurredAt);
      groups.set(key, current);
    }
  }
  return [...groups.values()].sort((a, b) =>
    b.occurrences - a.occurrences || b.lastOccurredAt - a.lastOccurredAt || a.key.localeCompare(b.key));
}

/**
 * Build a due queue from recorded failures. A later successful revision attempt
 * resets the interval ladder; the next due interval grows 1, 7, 14, then 30 days.
 * No attempt is modified and no source progress is written.
 */
export function buildRevisionCandidates(
  attempts: readonly LearningAttempt[],
  now = Date.now(),
  intervalsDays: readonly number[] = [1, 7, 14, 30],
): RevisionCandidate[] {
  const groups = new Map<string, LearningAttempt[]>();
  for (const attempt of attempts) {
    if (!validAttempt(attempt) || !attempt.questionId) continue;
    const key = [attempt.disciplineId, attempt.courseId, attempt.questionId].join("::");
    const rows = groups.get(key) ?? [];
    rows.push(attempt);
    groups.set(key, rows);
  }

  const result: RevisionCandidate[] = [];
  for (const [key, rows] of groups) {
    rows.sort((a, b) => a.occurredAt - b.occurredAt);
    let lastFailure: LearningAttempt | undefined;
    let successfulRevisions = 0;
    let failures = 0;
    for (const row of rows) {
      if (row.outcome === "incorrect" || row.outcome === "partial") {
        lastFailure = row;
        failures += 1;
        successfulRevisions = 0;
      } else if (row.mode === "revision" && row.outcome === "correct" && lastFailure && row.occurredAt > lastFailure.occurredAt) {
        successfulRevisions += 1;
      }
    }
    if (!lastFailure) continue;
    const interval = intervalsDays[Math.min(successfulRevisions, intervalsDays.length - 1)] ?? 30;
    const dueAt = lastFailure.occurredAt + interval * DAY_MS;
    const overdueDays = Math.max(0, Math.floor((now - dueAt) / DAY_MS));
    const latest = rows[rows.length - 1];
    const candidate: RevisionCandidate = {
      key, disciplineId: lastFailure.disciplineId, courseId: lastFailure.courseId,
      contentId: lastFailure.contentId, questionId: lastFailure.questionId,
      conceptIds: [...new Set(rows.flatMap((row) => row.conceptIds))],
      failures, lastFailureAt: lastFailure.occurredAt,
      dueAt, overdueDays,
      priority: (now >= dueAt ? 100 : 0) + failures * 10 + overdueDays,
    };
    if (latest.mode === "revision" && latest.outcome === "correct" && latest.occurredAt > lastFailure.occurredAt) {
      candidate.lastReviewedAt = latest.occurredAt;
    }
    result.push(candidate);
  }
  return result.sort((a, b) => b.priority - a.priority || a.dueAt - b.dueAt || a.key.localeCompare(b.key));
}

/** Prioritise weak concepts, but return no recommendation when evidence is insufficient. */
export function recommendConceptPractice(
  mastery: readonly ConceptMastery[],
  limit = 3,
): ConceptMastery[] {
  return mastery
    .filter((item) => item.status === "developing" || item.status === "insufficient-data")
    .sort((a, b) => {
      const evidenceA = a.attempts < 3 ? -1 : a.accuracy;
      const evidenceB = b.attempts < 3 ? -1 : b.accuracy;
      return evidenceA - evidenceB || b.incorrect - a.incorrect || a.lastPractisedAt - b.lastPractisedAt;
    })
    .slice(0, Math.max(0, limit));
}
