import assert from "node:assert/strict";
import { validateQuestion, validateBank } from "../core/validate.mjs";

const profile = {
  id: "test.single-choice.v1", discipline: "test", format: "single-choice",
  rules: { optionCount: 4, requireExplanation: true, requireSource: true,
    requireDifficulty: true, allowMultipleCorrect: false },
};
const valid = {
  id: "q-1", format: "single-choice", stem: "Which statement is correct?",
  options: [
    { id: "a", text: "A", correct: true }, { id: "b", text: "B" },
    { id: "c", text: "C" }, { id: "d", text: "D" },
  ],
  explanation: "Because the governing principle gives this result.",
  source: { subtopic: "chapter-1.topic-1" }, difficulty: { level: 2, scale: 5 },
};
const run = (q) => validateQuestion(q, profile);

assert.equal(run(valid).passed, true);
assert.equal(run({ ...valid, stem: "" }).issues[0].rule, "CORE-002");
assert.ok(run({ ...valid, options: valid.options.slice(0, 3) }).issues.some(x => x.rule === "FORMAT-001"));
assert.ok(run({ ...valid, options: valid.options.map(o => ({ ...o, correct: true })) }).issues.some(x => x.rule === "FORMAT-003"));
assert.ok(run({ ...valid, explanation: "" }).issues.some(x => x.rule === "CORE-003"));
assert.ok(run({ ...valid, source: {} }).issues.some(x => x.rule === "CORE-004"));
assert.ok(run({ ...valid, difficulty: { level: 6, scale: 5 } }).issues.some(x => x.rule === "CORE-005"));
assert.ok(run({ ...valid, options: [{ id: "a", text: "", correct: true }, ...valid.options.slice(1)] }).issues.some(x => x.rule === "FORMAT-005"));
assert.ok(run({ ...valid, format: undefined }).issues.some(x => x.rule === "CORE-006"));
assert.ok(run({ ...valid, options: {} }).issues.some(x => x.rule === "FORMAT-000"));
assert.equal(validateQuestion(null, profile).passed, false);
assert.equal(validateQuestion(undefined, profile).passed, false);
assert.equal(validateBank([valid, valid], profile).length, 2);
console.log("12 shared-engine tests passed");
