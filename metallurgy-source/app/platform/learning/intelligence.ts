import {
  buildConceptMastery,
  buildConceptMistakeSummary,
  recommendConceptPractice,
} from "../../../../shared/studies/intelligence.mjs";
import type { Activity, MistakeCategory } from "./types";

export type StoredMistakeClassification = {
  category: MistakeCategory;
  reviewedAt?: number;
};

export function metallurgyActivityKey(activity: Pick<Activity, "courseId" | "q" | "ts" | "mode" | "picked">): string {
  return [activity.courseId, activity.q, activity.ts, activity.mode, activity.picked].join("|");
}

/** Adapt the existing per-course activity log and local mistake tags read-only. */
export function toMetallurgyLearningAttempts(
  activities: readonly Activity[],
  topics: readonly { id: string; title: string }[],
  classifications: Readonly<Record<string, StoredMistakeClassification>> = {},
) {
  const titles = new Map(topics.map((topic) => [topic.id, topic.title]));
  return activities.flatMap((activity) => {
    if (!Number.isFinite(activity.ts) || activity.ts <= 0) return [];
    const concept = titles.get(activity.topicId);
    if (!concept) return [];
    const classification = classifications[metallurgyActivityKey(activity)];
    return [{
      id: metallurgyActivityKey(activity),
      disciplineId: "metallurgy",
      courseId: activity.courseId,
      contentId: activity.topicId,
      questionId: activity.q,
      subjectId: activity.courseId,
      conceptIds: [concept],
      outcome: activity.correct ? "correct" as const : "incorrect" as const,
      occurredAt: activity.ts,
      elapsedMs: activity.ms,
      mode: activity.mode,
      independent: activity.source === "recorded",
      hintCount: activity.source === "recorded" ? 0 : undefined,
      mistakeCategory: classification?.category ?? activity.mistakeCategory,
      reviewedAt: classification?.reviewedAt ?? activity.reviewedAt,
    }];
  });
}

export function analyzeMetallurgyLearning(
  activities: readonly Activity[],
  topics: readonly { id: string; title: string }[],
  classifications: Readonly<Record<string, StoredMistakeClassification>> = {},
) {
  const attempts = toMetallurgyLearningAttempts(activities, topics, classifications);
  const mastery = buildConceptMastery(attempts);
  return {
    mastery,
    weakConcepts: recommendConceptPractice(mastery, 5),
    recurringMistakes: buildConceptMistakeSummary(attempts).slice(0, 5),
  };
}
