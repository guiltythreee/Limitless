import assert from "node:assert/strict";
import {
  buildConceptMastery,
  buildConceptMistakeSummary,
  buildRevisionCandidates,
  normalizeConceptKey,
  recommendConceptPractice,
} from "./intelligence.ts";

const base = {
  disciplineId: "maths",
  courseId: "algebra",
  contentId: "linear-equations",
  questionId: "q-1",
  subjectId: "algebra",
  conceptIds: ["Linear Equations"],
  outcome: "correct",
  occurredAt: 1_800_000_000_000,
  mode: "practice",
  independent: true,
  hintCount: 0,
};

const attempt = (id, patch = {}) => ({ ...base, id, ...patch });

assert.equal(
  normalizeConceptKey("Maths", "Algebra", "Linear   Equations!"),
  normalizeConceptKey("maths", "algebra", "linear-equations"),
  "case, punctuation and whitespace variants should normalize",
);
assert.notEqual(
  normalizeConceptKey("cp", "coding", "C++"),
  normalizeConceptKey("cp", "coding", "C"),
  "C++ must remain distinct from C",
);
assert.notEqual(
  normalizeConceptKey("maths", "algebra", "Functions"),
  normalizeConceptKey("physics", "algebra", "Functions"),
  "concept keys must be discipline-scoped",
);
assert.notEqual(
  normalizeConceptKey("maths", "algebra", "Functions"),
  normalizeConceptKey("maths", "calculus", "Functions"),
  "concept keys must be subject-scoped",
);

const mastered = buildConceptMastery(Array.from({ length: 8 }, (_, i) =>
  attempt("m" + i, { occurredAt: base.occurredAt + i * 1000 }),
));
assert.equal(mastered.length, 1);
assert.equal(mastered[0].status, "mastered");
assert.equal(mastered[0].accuracy, 1);
assert.equal(mastered[0].independentAttempts, 8);

const assisted = buildConceptMastery(Array.from({ length: 8 }, (_, i) =>
  attempt("a" + i, { independent: false, hintCount: 2 }),
));
assert.equal(assisted[0].status, "secure", "hint-assisted performance must not be labelled mastered");

const lowSample = buildConceptMastery([
  attempt("s1"),
  attempt("s2", { outcome: "incorrect" }),
]);
assert.equal(lowSample[0].status, "insufficient-data");
assert.equal(recommendConceptPractice(lowSample).length, 1);

const mixed = buildConceptMastery([
  attempt("p1", { outcome: "correct" }),
  attempt("p2", { outcome: "partial" }),
  attempt("p3", { outcome: "incorrect" }),
]);
assert.equal(mixed[0].accuracy, 0.5, "partial credit contributes half weight");

const mistakes = buildConceptMistakeSummary([
  attempt("e1", { outcome: "incorrect", mistakeCategory: "mathematical" }),
  attempt("e2", { outcome: "partial", mistakeCategory: "mathematical", conceptIds: ["linear equations!"] }),
  attempt("e3", { outcome: "incorrect", mistakeCategory: "conceptual", conceptIds: ["Linear Equations"] }),
  attempt("e4", { outcome: "correct", mistakeCategory: "mathematical" }),
]);
assert.equal(mistakes.length, 2);
assert.equal(mistakes[0].occurrences, 2);
assert.equal(mistakes[0].category, "mathematical");

const t0 = base.occurredAt;
const day = 86_400_000;
const firstFailure = attempt("r1", { outcome: "incorrect", occurredAt: t0, independent: false });
let revision = buildRevisionCandidates([firstFailure], t0 + day);
assert.equal(revision.length, 1);
assert.equal(revision[0].dueAt, t0 + day, "first revision is due after one day");
assert.equal(revision[0].overdueDays, 0);

const firstReview = attempt("r2", {
  outcome: "correct", mode: "revision", occurredAt: t0 + day,
});
revision = buildRevisionCandidates([firstFailure, firstReview], t0 + day);
assert.equal(revision[0].dueAt, t0 + day * 8, "second interval is seven days after the successful review");
assert.equal(revision[0].lastReviewedAt, t0 + day);

const repeatedFailure = attempt("r3", {
  outcome: "incorrect", mode: "revision", occurredAt: t0 + day * 4, independent: false,
});
revision = buildRevisionCandidates([firstFailure, firstReview, repeatedFailure], t0 + day * 4);
assert.equal(revision[0].dueAt, t0 + day * 5, "a failed revision resets the interval ladder");
assert.equal(revision[0].lastReviewedAt, undefined);

const invalid = attempt("bad", { occurredAt: Number.NaN });
assert.equal(buildConceptMastery([invalid]).length, 0);
assert.equal(buildRevisionCandidates([invalid]).length, 0);

console.log("Shared learning intelligence: all assertions passed.");
