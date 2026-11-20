import assert from "node:assert/strict";
import { ratedProblemBaseExp, calculateReward, RATED_PROBLEM_POLICY } from "./rewards.mjs";

// Doubles every 400 rating points, anchored at 10 EXP for an 800.
const expected = { 800: 10, 1000: 14, 1100: 17, 1200: 20, 1400: 28, 1600: 40, 1800: 57, 2000: 80, 2400: 160 };
for (const [rating, exp] of Object.entries(expected)) {
  assert.equal(ratedProblemBaseExp(Number(rating)), exp, `rating ${rating}`);
}
assert.equal(ratedProblemBaseExp(3500), RATED_PROBLEM_POLICY.maxExp, "capped");
assert.equal(ratedProblemBaseExp(500), RATED_PROBLEM_POLICY.baseExp, "floored");
assert.equal(ratedProblemBaseExp(undefined), RATED_PROBLEM_POLICY.baseExp, "unrated -> floor");
assert.equal(ratedProblemBaseExp(NaN), RATED_PROBLEM_POLICY.baseExp);

// The engine, not the adapter, decides EXP: a mislabelled difficulty or quality cannot inflate it.
const r = calculateReward({
  eventId: "e1", moduleId: "competitive-programming", itemId: "p1", ts: 1_800_000_000_000,
  activityClass: "rated-problem", problemRating: 1600, difficulty: "advanced",
  completionEvidence: "x", completed: true, quality: 1,
});
assert.equal(r.baseExp, 40);
assert.equal(r.difficultyMultiplier, 1);
console.log("rated-problem policy: all assertions passed.");

// Assessments scale with question count (never below the same questions as practice).
import { assessmentBaseExp } from "./rewards.mjs";
assert.equal(assessmentBaseExp(undefined), 25, "legacy callers unchanged");
assert.equal(assessmentBaseExp(5), 25);
assert.equal(assessmentBaseExp(10), 50);
assert.equal(assessmentBaseExp(25), 100, "25 questions would be 125; capped at 100");
assert.equal(assessmentBaseExp(65), 100, "capped at the major-completion ceiling");
const asmt = calculateReward({
  eventId: "a1", moduleId: "probability", itemId: "assessment:x", ts: 1_800_000_000_000,
  activityClass: "assessment", questionCount: 20, difficulty: "intermediate",
  completionEvidence: "fully-answered-assessment", completed: true, quality: 0.8,
});
assert.equal(asmt.baseExp, 100);
assert.equal(asmt.totalExp, 125, "100 x 1.25, no quality bonus at 80%");
console.log("assessment scaling: all assertions passed.");
