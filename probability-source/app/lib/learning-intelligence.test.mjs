import assert from "node:assert/strict";
import { allQuestions } from "./questions.ts";
import {
  analyzeProbabilityLearning,
  toProbabilityLearningAttempts,
} from "./learning-intelligence.ts";

const first = allQuestions[0];
const sameLesson = allQuestions.filter((question) => question.lessonId === first.lessonId).slice(0, 3);
const rows = Array.from({ length: 8 }, (_, index) => ({
  id: "prob-" + index,
  q: sameLesson[index % sameLesson.length].key,
  picked: [0],
  score: index < 6 ? 1 : 0,
  status: index < 6 ? "correct" : "incorrect",
  ms: 1200 + index,
  ts: 1_800_000_000_000 + index * 1000,
  ...(index >= 6 ? { mistakeCategory: "conceptual" } : {}),
}));
const legacy = { ...rows[0], id: "legacy", ts: 0 };
const attempts = [...rows, legacy];

const adapted = toProbabilityLearningAttempts(attempts);
assert.equal(adapted.length, 8, "unknown legacy timestamps must not be invented");
assert.equal(adapted[0].disciplineId, "probability");
assert.equal(adapted[0].contentId, first.lessonId);
assert.equal(adapted[0].conceptIds.length, 1);

const report = analyzeProbabilityLearning(attempts);
assert.equal(report.mastery.length, 1);
assert.equal(report.mastery[0].attempts, 8);
assert.equal(report.mastery[0].status, "secure", "absence of independent evidence must not be labelled mastered");
assert.equal(report.recurringMistakes.length, 1);
assert.equal(report.recurringMistakes[0].occurrences, 2);
assert.equal(attempts.length, 9, "adapter must not mutate canonical attempts");

console.log("Probability learning adapter: all assertions passed.");
