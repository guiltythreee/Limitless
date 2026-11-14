import assert from "node:assert/strict";
import { buildCrossDisciplineOverview } from "./overview.mjs";

const now = 1_800_000_000_000;
const snapshot = {
  competition: {
    problemLog: [{
      id: "cp-1", date: "2026-11-01", name: "P1", subject: "Combinatorics",
      concept: "Pigeonhole Principle", outcome: "independent", resolve: "yes",
      mistakeType: "", time: "20",
    }],
  },
  mathRuns: [{ id: "r1", mode: "practice" }],
  mathAttempts: [
    { run: "r1", i: 1, t: "adept", g: "m1", s: "Multiplication", r: "wrong", time: 2, ts: now, independent: true, hintCount: 0, mistakeCategory: "mathematical" },
    { run: "r1", i: 2, t: "adept", g: "m2", s: "Multiplication", r: "wrong", time: 3, ts: now + 1, independent: true, hintCount: 0, mistakeCategory: "mathematical" },
    { run: "r1", i: 3, t: "adept", g: "m3", s: "Multiplication", r: "correct", time: 1, ts: now + 2, independent: true, hintCount: 0 },
  ],
  probability: {
    attempts: [
      { id: "p1", q: "lesson1:0", status: "correct", ts: now },
      { id: "p2", q: "lesson1:1", status: "incorrect", ts: now + 1, mistakeCategory: "conceptual" },
      { id: "p3", q: "lesson1:2", status: "incorrect", ts: now + 2, mistakeCategory: "conceptual" },
      { id: "p4", q: "lesson1:3", status: "correct", ts: 0 },
    ],
  },
  metallurgy: {
    mt201: {
      activities: [
        { courseId: "mt201", q: "ch01-q1", topicId: "ch01", picked: "A", correct: true, mode: "practice", ms: 1000, ts: now },
        { courseId: "mt201", q: "ch01-q2", topicId: "ch01", picked: "B", correct: false, mode: "practice", ms: 1200, ts: now + 1 },
        { courseId: "mt201", q: "ch01-q3", topicId: "ch01", picked: "B", correct: false, mode: "practice", ms: 1300, ts: now + 2 },
      ],
    },
    mt202: {
      answered: {
        "ch02-q1": { choice: "C", correct: false, at: now + 3 },
      },
    },
    mt203: {
      attempts: [
        { q: "t1-001", picked: "A", correct: true, mode: "practice", ms: 900, ts: now, independent: true, hintCount: 0 },
        { q: "t1-002", picked: "B", correct: false, mode: "practice", ms: 1100, ts: now + 1, independent: true, hintCount: 0, mistakeCategory: "units" },
        { q: "t1-003", picked: "B", correct: false, mode: "revision", ms: 1200, ts: now + 2, independent: true, hintCount: 0 },
      ],
    },
  },
  classifications: {
    ["mt201|ch01-q2|" + (now + 1) + "|practice|B"]: { category: "observation", reviewedAt: now + 10 },
  },
};

const before = JSON.stringify(snapshot);
const report = buildCrossDisciplineOverview(snapshot);
assert.equal(report.sections.length, 4);
assert.equal(report.sections.find((x) => x.id === "competitive-programming").attempts, 1);
assert.equal(report.sections.find((x) => x.id === "mathematics").attempts, 3);
assert.equal(report.sections.find((x) => x.id === "probability").attempts, 3);
assert.equal(report.sections.find((x) => x.id === "metallurgy").attempts, 7);
assert.equal(report.totalAttempts, 14);
assert.equal(report.trackedConcepts, 6, "concepts stay scoped by discipline and course");
assert.ok(report.mastery.some((item) => item.label === "MT203 t1"));
assert.equal(report.mastery.find((item) => item.disciplineId === "probability")?.independentAttempts, 3);
assert.ok(report.recurringMistakes.some((item) => item.category === "mathematical"));
assert.ok(report.recurringMistakes.some((item) => item.category === "conceptual"));
assert.ok(report.recurringMistakes.some((item) => item.category === "units"));
assert.equal(JSON.stringify(snapshot), before, "overview must never mutate source progress");

console.log("Cross-discipline overview: all assertions passed.");
