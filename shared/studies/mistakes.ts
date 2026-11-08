/** Shared mistake-analysis model for every study discipline. */
export const MISTAKE_CATEGORIES = [
  { id: "conceptual", label: "Conceptual error", detail: "The underlying concept was not understood." },
  { id: "observation", label: "Observation error", detail: "The key insight or relevant detail was missed." },
  { id: "mathematical", label: "Mathematical error", detail: "The derivation, algebra or calculation was incorrect." },
  { id: "implementation", label: "Implementation error", detail: "The idea was correct, but its execution or code was incorrect." },
  { id: "time-management", label: "Time-management error", detail: "The problem was solvable, but took too long." },
] as const;

export type MistakeCategory = typeof MISTAKE_CATEGORIES[number]["id"];
export type ClassifiedMistake = {
  questionId: string;
  category: MistakeCategory;
  occurredAt: number;
  reviewedAt?: number;
};

export type MistakeAttempt = {
  questionId: string;
  correct: boolean;
  category?: MistakeCategory;
  occurredAt: number;
};

export type RevisionItem = {
  questionId: string;
  category: MistakeCategory;
  occurrences: number;
  lastOccurredAt: number;
  reviewed: boolean;
  priority: number;
};

const categoryIds = new Set<string>(MISTAKE_CATEGORIES.map((item) => item.id));
export function isMistakeCategory(value: unknown): value is MistakeCategory {
  return typeof value === "string" && categoryIds.has(value);
}

/** A recurring wrong answer is weighted above a one-off error; unresolved items rank first. */
export function buildRevisionList(attempts: readonly MistakeAttempt[]): RevisionItem[] {
  const grouped = new Map<string, { category: MistakeCategory; count: number; last: number; reviewed: boolean }>();
  for (const attempt of attempts) {
    if (attempt.correct || !isMistakeCategory(attempt.category)) continue;
    const key = attempt.questionId + "|" + attempt.category;
    const current = grouped.get(key) ?? { category: attempt.category, count: 0, last: 0, reviewed: true };
    current.count += 1;
    current.last = Math.max(current.last, attempt.occurredAt || 0);
    current.reviewed = current.reviewed && attempt.reviewedAt !== undefined && attempt.reviewedAt >= attempt.occurredAt;
    grouped.set(key, current);
  }
  return [...grouped.entries()].map(([key, value]) => {
    const questionId = key.slice(0, key.lastIndexOf("|"));
    return {
      questionId,
      category: value.category,
      occurrences: value.count,
      lastOccurredAt: value.last,
      reviewed: value.reviewed,
      priority: value.count * 10 + (value.reviewed ? 0 : 100),
    };
  }).sort((a, b) => b.priority - a.priority || b.lastOccurredAt - a.lastOccurredAt || a.questionId.localeCompare(b.questionId));
}

export function mistakeCategoryLabel(category: MistakeCategory): string {
  return MISTAKE_CATEGORIES.find((item) => item.id === category)?.label ?? category;
}
