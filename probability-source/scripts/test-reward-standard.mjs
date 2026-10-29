import assert from "node:assert/strict";
import {
  ACTIVITY_BASE_EXP,
  CHECKPOINT_PASS_THRESHOLD,
  REPEAT_POLICY,
  calculateReward,
  levelForExp,
  readGlobalRewardSummary,
  sanitiseRewardRecords,
  summariseRewards,
} from "../../shared/rewards.mjs";

const ts = new Date(2026, 9, 29, 12, 0, 0).getTime();
const activity = (overrides = {}) => ({
  eventId: "probability:test-event",
  moduleId: "probability",
  itemId: "question:sample-space:0",
  ts,
  activityClass: "micro-practice",
  difficulty: "foundational",
  completionEvidence: "submitted-answer",
  completed: true,
  quality: 0,
  ...overrides,
});

assert.deepEqual(ACTIVITY_BASE_EXP, {
  "micro-practice": 5,
  "standard-task": 10,
  "focused-practice": 20,
  assessment: 25,
  "unit-milestone": 50,
  "major-completion": 100,
});
assert.equal(CHECKPOINT_PASS_THRESHOLD, 0.7);
assert.equal(REPEAT_POLICY.fullAwardsPerItemPerDay, 3);

// Exhaustively test each activity class against every difficulty tier without bonuses.
const classCases = [
  ["micro-practice", 5],
  ["standard-task", 10],
  ["focused-practice", 20],
  ["assessment", 25],
  ["unit-milestone", 50],
  ["major-completion", 100],
  ["bespoke-project", 20],
];
const tiers = [
  ["foundational", 1],
  ["intermediate", 1.25],
  ["advanced", 1.5],
];
for (const [activityClass, baseExp] of classCases) {
  for (const [difficulty, multiplier] of tiers) {
    const result = calculateReward(activity({
      eventId: "matrix-" + activityClass + "-" + difficulty,
      itemId: "matrix-item-" + activityClass + "-" + difficulty,
      activityClass,
      difficulty,
      assignedBaseExp: activityClass === "bespoke-project" ? baseExp : undefined,
      quality: 0,
    }), []);
    assert.equal(result.eligible, true, activityClass + " / " + difficulty + " should be eligible");
    assert.equal(result.baseExp, baseExp);
    assert.equal(result.difficultyMultiplier, multiplier);
    assert.equal(result.totalExp, Math.round(baseExp * multiplier), activityClass + " / " + difficulty + " award");
  }
}

const wrong = calculateReward(activity(), []);
assert.equal(wrong.totalExp, 5, "a completed but incorrect practice attempt earns base EXP");
assert.equal(wrong.qualityBonus, 0);
assert.equal(wrong.policyVersion, "LSR-1");

const correctFoundation = calculateReward(activity({ eventId: "correct-foundation", quality: 1 }), []);
assert.equal(correctFoundation.totalExp, 6, "foundational correct response gets a capped quality bonus");
assert.equal(correctFoundation.qualityBonus, 1);

const correctIntermediate = calculateReward(activity({
  eventId: "correct-intermediate", difficulty: "intermediate", quality: 1,
}), []);
assert.equal(correctIntermediate.totalExp, 7);

const correctAdvanced = calculateReward(activity({
  eventId: "correct-advanced", difficulty: "advanced", quality: 1,
}), []);
assert.equal(correctAdvanced.totalExp, 9);

const incomplete = calculateReward(activity({ eventId: "incomplete", completed: false, quality: 1 }), []);
assert.equal(incomplete.totalExp, 0);
assert.equal(incomplete.reason, "incomplete");
assert.equal(incomplete.countsTowardRepeatCap, false);

const repeated = [];
for (let i = 1; i <= 4; i++) {
  repeated.push(calculateReward(activity({ eventId: "repeat-" + i }), repeated));
}
assert.deepEqual(repeated.map((r) => r.totalExp), [5, 5, 5, 0]);
assert.equal(repeated[3].reason, "daily-repeat-cap");
assert.equal(repeated[3].repeatOrdinal, 4);

const nextDay = calculateReward(activity({
  eventId: "next-day",
  ts: new Date(2026, 9, 30, 12, 0, 0).getTime(),
}), repeated);
assert.equal(nextDay.totalExp, 5, "the repeat cap resets on the next local day");

const duplicate = calculateReward(activity({ eventId: "repeat-1" }), repeated);
assert.equal(duplicate.totalExp, 0);
assert.equal(duplicate.reason, "duplicate-event");

const assessmentItem = "assessment:quiz-a";
const assessment = calculateReward(activity({
  eventId: "assessment-one",
  itemId: assessmentItem,
  activityClass: "assessment",
  difficulty: "intermediate",
  completionEvidence: "fully-answered-assessment",
  quality: 1,
  passed: true,
  checkpointId: assessmentItem,
}), []);
assert.equal(assessment.passBonus, 15);
assert.equal(assessment.qualityBonus, 5);
assert.equal(assessment.totalExp, 51);

const assessmentRetry = calculateReward(activity({
  eventId: "assessment-two",
  itemId: assessmentItem,
  activityClass: "assessment",
  difficulty: "intermediate",
  completionEvidence: "fully-answered-assessment",
  quality: 1,
  passed: true,
  checkpointId: assessmentItem,
}), [assessment]);
assert.equal(assessmentRetry.passBonus, 0, "a checkpoint pass bonus is one-time");
assert.equal(assessmentRetry.totalExp, 36);

const badProject = calculateReward(activity({
  eventId: "bad-project", activityClass: "bespoke-project", assignedBaseExp: undefined,
}), []);
assert.equal(badProject.totalExp, 0, "bespoke projects require a preassigned base");
assert.equal(badProject.reason, "invalid-activity");
const belowRangeProject = calculateReward(activity({
  eventId: "project-below-range", activityClass: "bespoke-project", assignedBaseExp: 10,
}), []);
assert.equal(belowRangeProject.totalExp, 0, "project base must be at least 20 EXP");
const aboveRangeProject = calculateReward(activity({
  eventId: "project-above-range", activityClass: "bespoke-project", assignedBaseExp: 101,
}), []);
assert.equal(aboveRangeProject.totalExp, 0, "project base cannot exceed 100 EXP");
const unclassifiedActivity = calculateReward(activity({
  eventId: "unclassified", activityClass: "page-open",
}), []);
assert.equal(unclassifiedActivity.totalExp, 0);
assert.equal(unclassifiedActivity.reason, "invalid-activity");
const invalidDifficulty = calculateReward(activity({
  eventId: "invalid-difficulty", difficulty: "impossible",
}), []);
assert.equal(invalidDifficulty.totalExp, 0);
assert.equal(invalidDifficulty.reason, "invalid-activity");
const validProject = calculateReward(activity({
  eventId: "valid-project", activityClass: "bespoke-project", assignedBaseExp: 50,
  difficulty: "advanced", quality: 0,
}), []);
assert.equal(validProject.baseExp, 50);
assert.equal(validProject.totalExp, 75);

assert.equal(levelForExp(0).level, 1);
assert.equal(levelForExp(99).level, 1);
assert.equal(levelForExp(100).level, 2);
assert.equal(levelForExp(224).level, 2);
assert.equal(levelForExp(225).level, 3);
assert.equal(levelForExp(100).nextLevelAt, 225);

const duplicateRecords = sanitiseRewardRecords([correctFoundation, correctFoundation]);
assert.equal(duplicateRecords.length, 1, "summary source is deduplicated by event identity");
assert.equal(summariseRewards([correctFoundation, correctFoundation]).totalExp, 6);

const fakeStorage = {
  getItem(key) {
    if (key !== "hc3-progress-v3") return null;
    return JSON.stringify({
      rewardLedger: [wrong, correctFoundation],
      awarded: { "legacy-local-xp": 999999 },
    });
  },
};
const global = readGlobalRewardSummary(fakeStorage);
assert.equal(global.totalExp, 11);
assert.equal(global.sources.length, 1);
assert.equal(global.sources[0].moduleId, "probability");
assert.equal(global.registeredModules.length, 1, "unmigrated module-local XP is not presented as global LSR-1 EXP");

console.log("LSR-1 reward standard tests passed.");
console.log("- 21 activity-class × difficulty combinations verified.");
console.log("- Repeat cap, duplicate event protection and one-time pass bonus verified.");
console.log("- Level boundaries, persisted summary and legacy-XP exclusion verified.");