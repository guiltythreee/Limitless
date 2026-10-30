import assert from "node:assert/strict";
import { createMetallurgyPlayerAdapter } from "./adapter.ts";

const question = {
  id: "ch01-q1", n: 1, topicId: "ch01", type: "B", difficulty: 2,
  options: [
    { label: "a", text: "1 only" },
    { label: "b", text: "1 and 2" },
    { label: "c", text: "1, 2 and 3" },
  ],
  answer: "c",
  solution: { keyExplanation: "Combination option." },
};

for (const courseId of ["mt201", "mt202", "mt203"]) {
  const adapter = createMetallurgyPlayerAdapter(courseId);
  assert.equal(adapter.courseId, courseId);
  assert.equal(adapter.questionId(question), "ch01-q1");
  assert.equal(adapter.canRetry(question), false);
  assert.deepEqual(adapter.grade(question, { kind: "single-choice", optionId: "c" }),
    { correct: true, score: 1, status: "correct" });
  assert.deepEqual(adapter.grade(question, { kind: "single-choice", optionId: "a" }),
    { correct: false, score: 0, status: "incorrect" });
}

console.log("Metallurgy player adapter: 12 assertions passed");
