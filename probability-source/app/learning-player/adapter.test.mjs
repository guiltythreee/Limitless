import assert from "node:assert/strict";
import { createProbabilityPlayerAdapter } from "./adapter-core.ts";
import { probabilityPlayerAdapter } from "./adapter.ts";

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

// End-to-end adapter proof: this instance is bound to app/lib/questions.ts grade().
const realSingle = {
  key: "fixture-single",
  item: { question: "single", options: ["A", "B", "C"], answer: 1, explanation: "" },
};
assert.deepEqual(probabilityPlayerAdapter.grade(realSingle, {
  kind: "single-choice", optionId: "1",
}), { correct: true, score: 1, status: "correct" });
assert.deepEqual(probabilityPlayerAdapter.grade(realSingle, {
  kind: "single-choice", optionId: "0",
}), { correct: false, score: 0, status: "incorrect" });

const realMulti = {
  key: "fixture-multi",
  item: {
    question: "multi", options: ["A", "B", "C", "D"], answer: 1,
    answers: [1, 2], explanation: "",
  },
};
assert.deepEqual(probabilityPlayerAdapter.grade(realMulti, {
  kind: "multi-choice", optionIds: ["1"],
}), { correct: false, score: 0.5, status: "partial" });
assert.deepEqual(probabilityPlayerAdapter.grade(realMulti, {
  kind: "multi-choice", optionIds: ["1", "2"],
}), { correct: true, score: 1, status: "correct" });
assert.deepEqual(probabilityPlayerAdapter.grade(realMulti, {
  kind: "multi-choice", optionIds: ["1", "2", "0"],
}), { correct: false, score: 0.5, status: "partial" });

console.log("Probability player adapter: 13 assertions passed");
