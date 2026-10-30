import assert from "node:assert/strict";
import { createProbabilityPlayerAdapter } from "./adapter-core.ts";

const question = {
  key: "lesson-a:0",
  item: { options: ["A", "B", "C", "D"] },
};
const calls = [];
const adapter = createProbabilityPlayerAdapter((q, picked) => {
  calls.push({ q, picked });
  if (picked.length === 1 && picked[0] === 1) return { score: 1, status: "correct" };
  if (picked.length === 1 && picked[0] === 0) return { score: 0.5, status: "partial" };
  return { score: 0, status: "incorrect" };
});

assert.equal(adapter.questionId(question), "lesson-a:0");
assert.deepEqual(adapter.grade(question, { kind: "single-choice", optionId: "1" }),
  { correct: true, score: 1, status: "correct" });
assert.deepEqual(calls.at(-1).picked, [1]);
assert.deepEqual(adapter.grade(question, { kind: "multi-choice", optionIds: ["0"] }),
  { correct: false, score: 0.5, status: "partial" });
assert.deepEqual(calls.at(-1).picked, [0]);
assert.deepEqual(adapter.grade(question, { kind: "multi-choice", optionIds: ["0", "2"] }),
  { correct: false, score: 0, status: "incorrect" });
assert.deepEqual(calls.at(-1).picked, [0, 2]);
assert.throws(() => adapter.grade(question, { kind: "single-choice", optionId: "8" }), RangeError);

console.log("Probability player adapter: 8 assertions passed");
