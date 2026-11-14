import assert from "node:assert/strict";
import {
  analyzeMathTrainerLearning,
  toMathTrainerLearningAttempts,
} from "./learning-intelligence.mjs";

const runs = [{ id: "run-a", mode: "drill" }];
const attempts = [
  { run: "run-a", i: 1, t: "adept", g: "q-a", s: "Multiplication", r: "correct", time: 2.5, ts: 1_800_000_000_000, independent: true, hintCount: 0 },
  { run: "run-a", i: 2, t: "adept", g: "q-b", s: "Multiplication", r: "wrong", time: 4, ts: 1_800_000_000_000, independent: true, hintCount: 0, mistakeCategory: "mathematical" },
  { run: "run-a", i: 3, t: "adept", g: "q-c", s: "Multiplication", r: "timeout", time: 5, ts: 1_800_000_000_000, independent: false, hintCount: 1, mistakeCategory: "time-management" },
  { run: "run-a", i: 4, t: "adept", g: "q-d", s: "Division", r: "skip", time: 1, ts: 1_800_000_000_000 },
  { run: "", i: 5, t: "adept", g: "q-e", s: "Bad", r: "wrong", time: 1, ts: 1_800_000_000_000 },
];

const adapted = toMathTrainerLearningAttempts(attempts, runs);
assert.equal(adapted.length, 4);
assert.equal(adapted[0].mode, "practice", "drill maps to practice, not a new storage mode");
assert.equal(adapted[0].independent, true);
assert.equal(adapted[1].outcome, "incorrect");
assert.equal(adapted[2].mistakeCategory, "time-management");
assert.equal(adapted[3].outcome, "skipped");

const report = analyzeMathTrainerLearning(attempts, runs, 1_800_000_100_000);
assert.equal(report.mastery.length, 1, "skipped questions do not count as mastery evidence");
assert.equal(report.recurringMistakes.length, 2);
assert.equal(report.revision.length, 2);
assert.equal(attempts.length, 5, "adapter must not mutate original attempt history");

console.log("Math Trainer learning adapter: all assertions passed.");
