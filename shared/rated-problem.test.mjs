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
