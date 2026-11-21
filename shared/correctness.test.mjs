import assert from "node:assert/strict";
import { buildRewardRecords, calculateReward } from "./rewards.mjs";

const T0 = 1_800_000_000_000;
const q = (n, over = {}) => ({
  eventId: `q${n}`, moduleId: "metallurgy-mt202", itemId: `question:${n}`, ts: T0,
  activityClass: "micro-practice", difficulty: "intermediate", completionEvidence: "submitted", completed: true, ...over,
});
const exp = (input) => calculateReward(input).totalExp;

// Right pays in full (5 x 1.25 = 6.25 + 1 quality bonus); wrong pays half the base; partial credit sits between.
assert.equal(exp(q(1, { quality: 1, correctness: 1 })), 7);
assert.equal(exp(q(2, { quality: 0, correctness: 0 })), 3, "wrong answer: 6.25 x 0.5 = 3.1 -> 3");
assert.equal(exp(q(3, { quality: 0.5, correctness: 0.5 })), 5, "half credit: 6.25 x 0.75 = 4.7 -> 5");
assert.ok(exp(q(1, { quality: 1, correctness: 1 })) > exp(q(2, { quality: 0, correctness: 0 })), "guessing pays less than knowing");

// Callers that do not report correctness are unchanged (Bookkeys and any older adapter).
assert.equal(exp(q(4, { quality: 0 })), 6);
assert.equal(calculateReward(q(4, { quality: 0 })).correctnessWeight, 1);

// Only micro-practice opts in: other classes ignore correctness.
const assessment = calculateReward(q(5, { activityClass: "assessment", questionCount: 20, quality: 0, correctness: 0 }));
assert.equal(assessment.correctnessWeight, 1);

// The weight is stored on the record, so the daily budget counts the reduced effort, not the full base.
const ledger = [];
for (let n = 0; n < 60; n += 1) ledger.push(...buildRewardRecords(q(100 + n, { difficulty: "advanced", quality: 0, correctness: 0 }), ledger));
const first = ledger[0];
assert.equal(first.correctnessWeight, 0.5);
assert.equal(first.totalExp, 4, "advanced wrong answer: 7.5 x 0.5 = 3.75 -> 4");

// Old ledger records without the field load as weight 1.
const legacy = buildRewardRecords(q(900, { quality: 1, correctness: 1 }), []);
delete legacy[0].correctnessWeight;
assert.equal(buildRewardRecords(q(901, { quality: 1, correctness: 1 }), legacy)[0].eligible, true);

console.log("Correctness weighting: all assertions passed.");
