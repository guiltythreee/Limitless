import assert from "node:assert/strict";
import {
  analyzeCompetitionLearning,
  toCompetitionLearningAttempts,
  toCodeforcesLearningAttempts,
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

const analysis = analyzeCompetitionLearning(logs, [], Date.parse("2026-11-10T00:00:00Z"));
assert.equal(analysis.mastery.length, 1, "concept variants should group");
assert.equal(analysis.mastery[0].attempts, 3);
assert.equal(analysis.recurringMistakes.length, 1);
assert.equal(analysis.recurringMistakes[0].occurrences, 2);
assert.equal(analysis.recurringMistakes[0].category, "observation");
assert.equal(analysis.revision.length, 2);

const manyUnresolved = Array.from({ length: 27 }, (_, index) => ({
  id: "many-" + index, date: "2026-11-01", name: "Problem " + index,
  subject: "Graph Theory", concept: "BFS", outcome: "unsolved", resolve: "no",
}));
const fullQueue = analyzeCompetitionLearning(manyUnresolved, [], Date.parse("2026-11-10T00:00:00Z"));
assert.equal(fullQueue.revision.length, 27, "the revision queue must not silently hide candidates beyond the first 20");
assert.equal(logs.length, 5, "adapter must not mutate source records");

const successfulRevision = analyzeCompetitionLearning(logs, [
  { id: "rev-1", problemId: "cp-3", date: "2026-11-05T12:00:00.000Z", outcome: "correct" },
], Date.parse("2026-11-10T00:00:00Z"));
const afterSuccess = successfulRevision.revision.find((item) => item.questionId === "cp-3");
assert.ok(afterSuccess, "failed problem remains scheduled after a successful revision");
assert.equal(afterSuccess.lastReviewedAt, Date.parse("2026-11-05T12:00:00.000Z"));
assert.equal(afterSuccess.dueAt, Date.parse("2026-11-12T12:00:00.000Z"), "successful revision advances to the 7-day interval");

const failedAgain = analyzeCompetitionLearning(logs, [
  { id: "rev-1", problemId: "cp-3", date: "2026-11-05T12:00:00.000Z", outcome: "correct" },
  { id: "rev-2", problemId: "cp-3", date: "2026-11-06T12:00:00.000Z", outcome: "incorrect", mistakeType: "observation" },
], Date.parse("2026-11-10T00:00:00Z"));
const afterFailure = failedAgain.revision.find((item) => item.questionId === "cp-3");
assert.ok(afterFailure);
assert.equal(afterFailure.dueAt, Date.parse("2026-11-07T12:00:00.000Z"), "a failed revision resets the interval to one day");
assert.equal(afterFailure.failures, 2);
assert.equal(failedAgain.attempts.length, 5, "revision attempts are included in learning evidence");


const codeforcesSubmissions = [
  {
    id: 9002, contestId: 1900, creationTimeSeconds: 1794000000,
    verdict: "WRONG_ANSWER", timeConsumedMillis: 1200,
    problem: { contestId: 1900, index: "A", tags: ["implementation", " greedy "] },
    author: { participantType: "PRACTICE" },
  },
  {
    id: 9003, contestId: 1900, creationTimeSeconds: 1794000600,
    verdict: "OK", timeConsumedMillis: 900,
    problem: { contestId: 1900, index: "A", tags: ["implementation", "greedy"] },
    author: { participantType: "CONTESTANT" },
  },
  {
    id: 9003, contestId: 1900, creationTimeSeconds: 1794000600,
    verdict: "OK", problem: { contestId: 1900, index: "A", tags: ["implementation"] },
  },
  {
    id: 9004, contestId: 1900, creationTimeSeconds: 1794000700,
    verdict: "TESTING", problem: { contestId: 1900, index: "B" },
  },
  {
    id: 0, contestId: 1900, creationTimeSeconds: 1794000800,
    verdict: "OK", problem: { contestId: 1900, index: "C" },
  },
];
const cfAttempts = toCodeforcesLearningAttempts(codeforcesSubmissions);
assert.equal(cfAttempts.length, 2, "only supported terminal verdicts with valid IDs are included");
assert.equal(cfAttempts[0].id, "codeforces:9002");
assert.equal(cfAttempts[0].outcome, "incorrect");
assert.equal(cfAttempts[0].questionId, "codeforces:1900A");
assert.deepEqual(cfAttempts[0].conceptIds, ["implementation", "greedy"]);
assert.equal(cfAttempts[1].outcome, "correct");
assert.equal(cfAttempts[1].mode, "contest");
assert.equal(cfAttempts[1].independent, true);
assert.equal(cfAttempts[1].elapsedMs, 900);
assert.equal(toCodeforcesLearningAttempts(null).length, 0);

const combined = analyzeCompetitionLearning([], [], Date.parse("2026-11-15T00:00:00Z"), codeforcesSubmissions);
assert.equal(combined.attempts.length, 2, "Codeforces attempts enter the shared learning projection");
assert.equal(combined.mastery.length, 2, "Codeforces problem tags become concept evidence");
assert.ok(combined.revision.some((item) => item.questionId === "codeforces:1900A"),
  "a problem with a failed submission remains eligible for revision");
const persistedProjection = analyzeCompetitionLearning([], [], Date.parse("2026-11-15T00:00:00Z"), cfAttempts);
assert.equal(persistedProjection.attempts.length, 2,
  "already-normalized, persisted Codeforces attempts are accepted without being remapped");


console.log("Competition learning adapter: all assertions passed.");
