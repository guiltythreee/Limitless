import type {
  LearningPlayerAdapter,
  PlayerAnswer,
  PlayerGrade,
} from "./contracts";

const single: PlayerAnswer = { kind: "single-choice", optionId: "B" };
const multi: PlayerAnswer = { kind: "multi-choice", optionIds: ["A", "C"] };
const numeric: PlayerAnswer = { kind: "numeric", value: 3.14, unit: "m/s" };
const text: PlayerAnswer = { kind: "text", value: "independent events" };

const partial: PlayerGrade = {
  correct: false,
  score: 0.5,
  status: "partial",
};

type SampleQuestion = { id: string; options: readonly string[] };
const sampleAdapter: LearningPlayerAdapter<SampleQuestion, Extract<PlayerAnswer, { kind: "multi-choice" }>, { picked: number[] }> = {
  courseId: "probability",
  questionId: (question) => question.id,
  grade: (_question, answer) => ({
    correct: answer.optionIds.length === 2,
    score: answer.optionIds.length / 2,
    status: answer.optionIds.length === 2 ? "correct" : "partial",
  }),
  saveDraft: (_question, answer, elapsedMs) => ({
    picked: answer.optionIds.map((id) => Number(id)),
  }),
  restoreDraft: (_question, draft) => ({
    answer: { kind: "multi-choice", optionIds: draft.picked.map(String) },
    elapsedMs: 0,
  }),
};

// @ts-expect-error Multi-choice requires an array of option IDs.
const invalidMulti: PlayerAnswer = { kind: "multi-choice", optionId: "A" };

void [single, multi, numeric, text, partial, sampleAdapter, invalidMulti];
