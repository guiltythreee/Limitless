import type {
  LearningPlayerAdapter,
  PlayerGrade,
} from "../../../shared/learning-player/contracts";

export type ProbabilityPlayerAnswer =
  | { kind: "single-choice"; optionId: string }
  | { kind: "multi-choice"; optionIds: readonly string[] };

export interface ProbabilityQuestionLike {
  key: string;
  item: { options: readonly unknown[] };
}

export type ProbabilityGrade = {
  score: number;
  status: "correct" | "partial" | "incorrect";
};

function parseOptionId(id: string, optionCount: number): number {
  const index = Number(id);
  if (!Number.isInteger(index) || index < 0 || index >= optionCount) {
    throw new RangeError(`Invalid Probability option id: ${id}`);
  }
  return index;
}

/**
 * Builds the Probability bridge around its existing grade function.
 * The caller supplies the real grader; this layer only translates answer
 * representation and preserves its score/status without recalculating them.
 */
export function createProbabilityPlayerAdapter<
  TQuestion extends ProbabilityQuestionLike,
>(
  gradeQuestion: (question: TQuestion, picked: number[]) => ProbabilityGrade,
): LearningPlayerAdapter<TQuestion, ProbabilityPlayerAnswer> {
  return {
    courseId: "probability",
    questionId: (question) => question.key,
    canRetry: () => true,
    grade(question, answer): PlayerGrade {
      const picked = answer.kind === "single-choice"
        ? [parseOptionId(answer.optionId, question.item.options.length)]
        : answer.optionIds.map((id) => parseOptionId(id, question.item.options.length));
      const result = gradeQuestion(question, picked);
      return {
        correct: result.status === "correct",
        score: result.score,
        status: result.status,
      };
    },
  };
}
