export type LearningOutcome = "correct" | "partial" | "incorrect" | "skipped";
export type LearningMode = "learn" | "practice" | "exam" | "revision" | "contest";
export type LearningMistakeCategory =
  | "conceptual" | "observation" | "mathematical" | "implementation"
  | "time-management" | "recall" | "formula-selection" | "units" | "procedure";

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

export function normalizeConceptKey(disciplineId: string, subjectId: string | undefined, concept: string): string;
export function buildConceptMastery(
  attempts: readonly LearningAttempt[],
  options?: { minSecureAttempts?: number; minMasteryAttempts?: number },
): ConceptMastery[];
export function buildConceptMistakeSummary(attempts: readonly LearningAttempt[]): ConceptMistakeSummary[];
export function buildRevisionCandidates(
  attempts: readonly LearningAttempt[],
  now?: number,
  intervalsDays?: readonly number[],
): RevisionCandidate[];
export function recommendConceptPractice(mastery: readonly ConceptMastery[], limit?: number): ConceptMastery[];
