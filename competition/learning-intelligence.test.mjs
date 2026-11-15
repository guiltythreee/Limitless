import assert from "node:assert/strict";
import {
  analyzeCompetitionLearning,
  toCompetitionLearningAttempts,
  toCodeforcesLearningAttempts,
  getCodeforcesProblemUrl,
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
  { id: "impossible-date", date: "2026-02-30", subject: "Combinatorics", concept: "X", outcome: "unsolved" },
  { id: "bad-date-format", date: "2026-2-03", subject: "Combinatorics", concept: "X", outcome: "unsolved" },
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

const revisionEvidence = toCompetitionLearningAttempts(logs, [
  {
    id: "revision:cp-3-1:1794000000000",
    problemId: "cp-3",
    date: "2026-11-06T12:00:00.000Z",
    outcome: "correct",
  },
  {
    id: "revision:cp-2-7:1794000001000",
    problemId: "cp-2",
    date: "2026-11-07T12:00:00.000Z",
    outcome: "incorrect",
    mistakeType: "observation",
  },
  {
    id: "revision:invalid",
    problemId: "missing-problem",
    date: "2026-11-07T12:00:00.000Z",
    outcome: "correct",
  },
  {
    id: "revision:impossible-date",
    problemId: "cp-3",
    date: "2026-02-30T12:00:00.000Z",
    outcome: "correct",
  },
  {
    id: "revision:bad-date",
    problemId: "cp-3",
    date: "2026-2-03T12:00:00.000Z",
    outcome: "correct",
  },
]);
assert.equal(revisionEvidence.length, 5, "only revisions linked to known problems enter learning evidence");
assert.equal(revisionEvidence[3].mode, "revision");
assert.equal(revisionEvidence[3].questionId, "cp-3");
assert.equal(revisionEvidence[3].outcome, "correct");
assert.equal(revisionEvidence[3].independent, true);
assert.equal(revisionEvidence[4].outcome, "incorrect");
assert.equal(revisionEvidence[4].mistakeCategory, "observation");

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
assert.equal(logs.length, 7, "adapter must not mutate source records");

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
assert.equal(cfAttempts[0].subjectId, "codeforces",
  "Codeforces tags are concepts, not mutually exclusive subject buckets");
assert.equal(cfAttempts[1].outcome, "correct");
assert.equal(cfAttempts[1].mode, "contest");
assert.equal(cfAttempts[1].independent, undefined,
  "an accepted public verdict does not prove the solve was independent");
assert.equal(cfAttempts[1].hintCount, undefined,
  "the public API does not expose whether hints were used");
assert.equal(cfAttempts[1].elapsedMs, 900);
assert.equal(toCodeforcesLearningAttempts(null).length, 0);
assert.equal(getCodeforcesProblemUrl("codeforces:1900A"),
  "https://codeforces.com/problemset/problem/1900/A",
  "regular Codeforces contest problems use the problemset route");
assert.equal(getCodeforcesProblemUrl("codeforces:100153E"),
  "https://codeforces.com/gym/100153/problem/E",
  "Gym problems use the Gym route rather than the regular problemset route");
assert.equal(getCodeforcesProblemUrl("codeforces:invalid"), "",
  "malformed question IDs must not produce a broken problem link");

const combined = analyzeCompetitionLearning([], [], Date.parse("2026-11-15T00:00:00Z"), codeforcesSubmissions);
assert.equal(combined.attempts.length, 2, "Codeforces attempts enter the shared learning projection");
assert.equal(combined.mastery.length, 2, "Codeforces problem tags become concept evidence");
assert.ok(combined.revision.some((item) => item.questionId === "codeforces:1900A"),
  "a problem with a failed submission remains eligible for revision");
const persistedProjection = analyzeCompetitionLearning([], [], Date.parse("2026-11-15T00:00:00Z"), cfAttempts);
assert.equal(persistedProjection.attempts.length, 2,
  "already-normalized, persisted Codeforces attempts are accepted without being remapped");
assert.ok(persistedProjection.attempts.every((attempt) => attempt.subjectId === "codeforces"),
  "legacy persisted attempts are normalized to the shared Codeforces subject");
assert.ok(persistedProjection.attempts.every((attempt) =>
  !/^codeforces:\d+$/.test(attempt.id) || (attempt.independent === undefined && attempt.hintCount === undefined)),
  "legacy accepted submissions must not retain inferred independent-solve evidence");
const mixedTagOrder = analyzeCompetitionLearning([], [], Date.parse("2026-11-15T00:00:00Z"), [
  { ...cfAttempts[0], id: "codeforces:9100", subjectId: "implementation", conceptIds: ["implementation", "greedy"] },
  { ...cfAttempts[0], id: "codeforces:9101", subjectId: "greedy", conceptIds: ["greedy", "implementation"] },
]);
assert.equal(mixedTagOrder.mastery.find((item) => item.label === "implementation").attempts, 2,
  "the same tag accumulates mastery regardless of its position in a problem's tag list");
assert.equal(mixedTagOrder.mastery.find((item) => item.label === "greedy").attempts, 2);

// Codeforces revision feedback is persisted as a revision-mode learning attempt.
// A successful independent re-solve advances the same problem to the 7-day step.
const codeforcesRevision = analyzeCompetitionLearning([], [], Date.parse("2026-11-15T00:00:00Z"), [
  { ...cfAttempts[0], id: "codeforces:9200", questionId: "codeforces:1900A", occurredAt: Date.parse("2026-11-01T12:00:00Z") },
  {
    ...cfAttempts[0], id: "codeforces:revision:1", questionId: "codeforces:1900A",
    occurredAt: Date.parse("2026-11-02T12:00:00Z"), outcome: "correct",
    independent: true, hintCount: 0, mode: "revision",
  },
]);
const codeforcesAfterSuccess = codeforcesRevision.revision.find((item) => item.questionId === "codeforces:1900A");
assert.ok(codeforcesAfterSuccess, "a failed Codeforces problem remains scheduled after successful revision");
assert.equal(codeforcesAfterSuccess.lastReviewedAt, Date.parse("2026-11-02T12:00:00Z"));
assert.equal(codeforcesAfterSuccess.dueAt, Date.parse("2026-11-09T12:00:00Z"),
  "successful Codeforces revision advances to the 7-day interval");
assert.equal(codeforcesRevision.mastery.find((item) => item.label === "implementation").independentAttempts, 1,
  "only the explicitly reported independent revision contributes independent mastery evidence");

// A subsequent failed re-solve resets the Codeforces problem to the 1-day interval.
const codeforcesFailedAgain = analyzeCompetitionLearning([], [], Date.parse("2026-11-15T00:00:00Z"), [
  { ...cfAttempts[0], id: "codeforces:9201", questionId: "codeforces:1900A", occurredAt: Date.parse("2026-11-01T12:00:00Z") },
  {
    ...cfAttempts[0], id: "codeforces:revision:2", questionId: "codeforces:1900A",
    occurredAt: Date.parse("2026-11-02T12:00:00Z"), outcome: "correct",
    independent: true, hintCount: 0, mode: "revision",
  },
  {
    ...cfAttempts[0], id: "codeforces:revision:3", questionId: "codeforces:1900A",
    occurredAt: Date.parse("2026-11-03T12:00:00Z"), outcome: "incorrect",
    independent: false, mode: "revision",
  },
]);
const codeforcesAfterFailure = codeforcesFailedAgain.revision.find((item) => item.questionId === "codeforces:1900A");
assert.equal(codeforcesAfterFailure.dueAt, Date.parse("2026-11-04T12:00:00Z"),
  "failed Codeforces revision resets the schedule to one day");


console.log("Competition learning adapter: all assertions passed.");
