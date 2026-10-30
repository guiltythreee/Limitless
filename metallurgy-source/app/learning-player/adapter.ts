import type { LearningPlayerAdapter } from "../../../shared/learning-player/contracts";
import type { Question } from "../courses/types";

export type MetallurgyPlayerAnswer = {
  kind: "single-choice";
  /** Original course option label, e.g. "a" or "B". */
  optionId: string;
};

export type MetallurgyCourseId = "mt201" | "mt202" | "mt203";

/** All three canonical Metallurgy courses persist one selected option label. */
export function createMetallurgyPlayerAdapter<TQuestion extends Question = Question>(
  courseId: MetallurgyCourseId,
): LearningPlayerAdapter<TQuestion, MetallurgyPlayerAnswer> {
  return {
    courseId,
    questionId: (question) => question.id,
    canRetry: () => courseId === "mt203",
    grade(question, answer) {
      const correct = answer.optionId === question.answer;
      return {
        correct,
        score: correct ? 1 : 0,
        status: correct ? "correct" : "incorrect",
      };
    },
  };
}
