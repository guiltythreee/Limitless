import assert from "node:assert/strict";
import {
  MATH_REWARD_MODULE_ID,
  MATH_REWARD_STORAGE_KEY,
  createMathRewardAdapter,
} from "./math-rewards.mjs";
import { readGlobalRewardSummary } from "../../shared/rewards.mjs";

function createStorage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    values,
    writes: 0,
    getItem(key) { return values.has(key) ? values.get(key) : null; },
    setItem(key, value) { this.writes += 1; values.set(key, value); },
  };
}

const day1 = new Date(2026, 9, 29, 12, 0, 0).getTime();
const day2 = new Date(2026, 9, 30, 12, 0, 0).getTime();
const storage = createStorage({
  // Legacy rank XP must never be imported or counted as global EXP.
  "limitless.math.v1.meta": JSON.stringify({ xp: 999999, streak: { count: 123 } }),
  // Prove the dedicated reward root preserves extension fields if any exist.
  [MATH_REWARD_STORAGE_KEY]: JSON.stringify({ schemaNote: "preserve me", rewardLedger: [] }),
});
const adapter = createMathRewardAdapter(storage, { now: () => day1 });

function run(overrides = {}) {
  return {
    runId: "run-1",
    completedAt: day1,
    completed: true,
    mode: "drill",
    tier: "adept",
    topTier: "adept",
    tierIndex: 2,
    attempted: 40,
    accuracy: 0.9,
    qualifying: false,
    cleared: false,
    drillSkills: ["addition"],
    ...overrides,
  };
}

// Empty/abandoned sessions and incomplete test attempts do not write rewards.
assert.equal(adapter.awardRun(run({ attempted: 0 })), null);
assert.equal(adapter.awardRun(run({ completed: false })), null);
assert.equal(adapter.awardRun(run({ mode: "test80", attempted: 59, qualifying: false })), null);
assert.equal(storage.writes, 0);
assert.equal(storage.getItem(MATH_REWARD_STORAGE_KEY).includes("rewardLedger"), true);

// A valid drill uses the shared base, tier multiplier and quality policy.
const first = adapter.awardRun(run());
assert.equal(first.moduleId, MATH_REWARD_MODULE_ID);
assert.equal(first.activityClass, "focused-practice");
assert.equal(first.difficulty, "intermediate");
assert.equal(first.baseExp, 20);
assert.equal(first.difficultyMultiplier, 1.25);
assert.equal(first.qualityBonus, 3);
assert.equal(first.totalExp, 28);
assert.equal(first.eligible, true);
assert.equal(storage.writes, 1);

// Event IDs are idempotent: retrying the same run doesn't write or award again.
const afterFirstWrite = storage.writes;
assert.deepEqual(adapter.awardRun(run({ accuracy: 0 })), first);
assert.equal(storage.writes, afterFirstWrite);

// Four same-item assessments on one local day: only the first three get full EXP,
// and the recognized tier checkpoint pass bonus can be granted only once.
function assessment(runId, ts, overrides = {}) {
  return run({
    runId,
    completedAt: ts,
    mode: "test80",
    tier: "adept",
    topTier: "adept",
    tierIndex: 2,
    attempted: 80,
    accuracy: 0.9,
    qualifying: true,
    cleared: true,
    drillSkills: [],
    ...overrides,
  });
}
const a1 = adapter.awardRun(assessment("assessment-1", day1));
const a2 = adapter.awardRun(assessment("assessment-2", day1 + 1000));
const a3 = adapter.awardRun(assessment("assessment-3", day1 + 2000));
const a4 = adapter.awardRun(assessment("assessment-4", day1 + 3000));
assert.equal(a1.activityClass, "assessment");
assert.equal(a1.passBonus, 15);
assert.equal(a1.checkpointId, "math-tier-clear:adept");
assert.equal(a2.passBonus, 0);
assert.equal(a3.eligible, true);
assert.equal(a4.eligible, false);
assert.equal(a4.reason, "daily-repeat-cap");
assert.equal(a4.totalExp, 0);

const nextDay = adapter.awardRun(assessment("assessment-next-day", day2));
assert.equal(nextDay.eligible, true);
assert.equal(nextDay.repeatOrdinal, 1);
assert.equal(nextDay.passBonus, 0, "checkpoint pass bonus remains lifetime-once after the day changes");

// Trick Chamber phases require the game's verified completion gate, and mastery
// uses a separate canonical checkpoint from a tier-clear event.
assert.equal(adapter.awardTrickPhase({
  runId: "trick-bad", trickId: "doubling", phase: "post", completed: true,
  verified: false, attempted: 6, questionCount: 6, requiredCount: 6, skipped: 0,
  accuracy: 1, firstMastery: true, completedAt: day1,
}), null);
const trick = adapter.awardTrickPhase({
  runId: "trick-post-1", trickId: "doubling", phase: "post", completed: true,
  verified: true, attempted: 6, questionCount: 6, requiredCount: 6, skipped: 0,
  accuracy: 1, firstMastery: true, completedAt: day2,
});
assert.equal(trick.itemId, "math-trick:doubling:post");
assert.equal(trick.activityClass, "assessment");
assert.equal(trick.checkpointId, "math-trick-mastery:doubling");
assert.equal(trick.passBonus, 15);
assert.equal(adapter.awardTrickPhase({
  runId: "trick-practice-short", trickId: "doubling", phase: "practice", completed: true,
  verified: true, attempted: 4, questionCount: 5, requiredCount: 10, skipped: 1,
  accuracy: 1, firstMastery: false, completedAt: day2,
}), null, "a practice phase below the existing half-answered threshold is ineligible");
const practice = adapter.awardTrickPhase({
  runId: "trick-practice-valid", trickId: "doubling", phase: "practice", completed: true,
  verified: true, attempted: 5, questionCount: 6, requiredCount: 10, skipped: 1,
  accuracy: 0.8, firstMastery: false, completedAt: day2,
});
assert.equal(practice.activityClass, "focused-practice");
assert.equal(practice.eligible, true, "valid Trick Chamber practice may finish after half the questions");
assert.equal(adapter.awardTrickPhase({
  runId: "trick-skip", trickId: "multiplication", phase: "post", completed: true,
  verified: true, attempted: 5, questionCount: 6, requiredCount: 6, skipped: 1,
  accuracy: 1, firstMastery: true, completedAt: day2,
}), null);

// LSR-1 totals include the dedicated ledger but do not import legacy MathXP.
const payload = JSON.parse(storage.getItem(MATH_REWARD_STORAGE_KEY));
assert.equal(payload.schemaNote, "preserve me");
assert.ok(Array.isArray(payload.rewardLedger));
const global = readGlobalRewardSummary(storage);
assert.equal(global.sources.length, 1);
assert.equal(global.sources[0].moduleId, "math-trainer");
assert.equal(global.totalExp, payload.rewardLedger.filter((record) => record.eligible && record.totalExp > 0)
  .reduce((total, record) => total + record.totalExp, 0));
assert.ok(global.totalExp < 999999, "legacy Math Trainer rank XP must not leak into global EXP");
assert.ok(global.registeredModules.some((module) => module.moduleId === "probability"));
assert.ok(global.registeredModules.some((module) => module.moduleId === "math-trainer"));

console.log("Math Trainer LSR-1 adapter: all checks passed.");
