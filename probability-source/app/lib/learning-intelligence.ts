import { lessons } from "../content";
import { questionByKey } from "./questions";
import {
  buildConceptMastery,
  buildConceptMistakeSummary,
  recommendConceptPractice,
} from "../../../shared/studies/intelligence.mjs";
import type { Attempt } from "./store";
import type { LearningAttempt } from "../../../shared/studies/intelligence.mjs";

const lessonTitles = new Map(lessons.map((lesson) => [lesson.id, lesson.title]));

/** Adapt Probability's canonical attempt log; unknown legacy timestamps stay excluded. */
export function toProbabilityLearningAttempts(attempts: readonly Attempt[]): LearningAttempt[] {
  return attempts.flatMap((attempt) => {
    const question = questionByKey[attempt.q];
    if (!question || !Number.isFinite(attempt.ts) || attempt.ts <= 0) return [];
    const concept = lessonTitles.get(question.lessonId) ?? question.lessonId;
    return [{
      id: attempt.id,
      disciplineId: "probability",
      courseId: "probability-archive",
      contentId: question.lessonId,
      questionId: attempt.q,
      subjectId: question.lessonId,
      conceptIds: [concept],
      outcome: attempt.status,
      occurredAt: attempt.ts,
      elapsedMs: attempt.ms,
      independent: true,
      hintCount: 0,
      mistakeCategory: attempt.mistakeCategory,
      reviewedAt: attempt.reviewedAt,
    }];
  });
}

export function analyzeProbabilityLearning(attempts: readonly Attempt[]) {
  const adapted = toProbabilityLearningAttempts(attempts);
  const mastery = buildConceptMastery(adapted);
  return {
    mastery,
    weakConcepts: recommendConceptPractice(mastery, 5),
    recurringMistakes: buildConceptMistakeSummary(adapted).slice(0, 5),
  };
}
