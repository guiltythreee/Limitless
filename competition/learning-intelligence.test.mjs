import assert from "node:assert/strict";
import {
  analyzeCompetitionLearning,
  toCompetitionLearningAttempts,
} from "./learning-intelligence.mjs";

const logs = [
  {
    id: "cp-1", date: "2026-11-01", name: "A", subject: "Combinatorics",
    concept: "Pigeonhole Principle", outcome: "independent", resolve: "yes",
    mistakeType: "", time: "20",
  },
  {
    id: "cp-2", date: "2026-11-02", name: "B", subject: "Combinatorics",
    concept: "pigeonhole principle!", outcome: "hint", resolve: "no",
    mistakeType: "observation", time: "35",
  },
  {
    id: "cp-3", date: "2026-11-03", name: "C", subject: "Combinatorics",
    concept: "Pigeonhole Principle", outcome: "unsolved", resolve: "no",
    mistakeType: "observation", time: "45",
  },
  { id: "bad-date", date: "not-a-date", subject: "Combinatorics", concept: "X", outcome: "unsolved" },
  { id: "", date: "2026-11-03", subject: "Combinatorics", concept: "X", outcome: "unsolved" },
];

const attempts = toCompetitionLearningAttempts(logs);
assert.equal(attempts.length, 3);
assert.equal(attempts[0].outcome, "correct");
assert.equal(attempts[1].outcome, "partial");
assert.equal(attempts[2].outcome, "incorrect");
assert.equal(attempts[0].independent, true);
assert.equal(attempts[1].hintCount, 1);
assert.equal(attempts[1].elapsedMs, 35 * 60_000);
assert.equal(attempts[1].conceptIds[0], "pigeonhole principle!");

const analysis = analyzeCompetitionLearning(logs, Date.parse("2026-11-10T00:00:00Z"));
assert.equal(analysis.mastery.length, 1, "concept variants should group");
assert.equal(analysis.mastery[0].attempts, 3);
assert.equal(analysis.recurringMistakes.length, 1);
assert.equal(analysis.recurringMistakes[0].occurrences, 2);
assert.equal(analysis.recurringMistakes[0].category, "observation");
assert.equal(analysis.revision.length, 2);
assert.equal(logs.length, 5, "adapter must not mutate source records");

console.log("Competition learning adapter: all assertions passed.");
