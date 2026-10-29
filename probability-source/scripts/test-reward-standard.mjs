import assert from "node:assert/strict";
import {
  completeProject,
  listRegisteredProjects,
  registerProject,
} from "../../shared/projects.mjs";
import {
  equipReward,
  PROFILE_EQUIPMENT_STORAGE_KEY,
  readEquippedRewards,
  unequipReward,
} from "../../shared/profile.mjs";
import {
  acknowledgeLevelNotification,
  LEVEL_NOTIFICATION_STORAGE_KEY,
  syncLevelNotifications,
} from "../../shared/level-notifications.mjs";
import {
  ACTIVITY_BASE_EXP,
  CHECKPOINT_PASS_THRESHOLD,
  REPEAT_POLICY,
  buildRewardRecords,
  calculateReward,
  levelForExp,
  nextRewardForLevel,
  unlockedRewardsForLevel,
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

// Persistent adapters must store the first-pass bonus as a separate record.
const firstPassRecords = buildRewardRecords(activity({
  eventId: "assessment-split",
  itemId: "assessment:split-checkpoint",
  activityClass: "assessment",
  difficulty: "intermediate",
  completionEvidence: "fully-answered-assessment",
  quality: 1,
  passed: true,
  checkpointId: "split-checkpoint",
}), []);
assert.equal(firstPassRecords.length, 2);
assert.equal(firstPassRecords[0].eventId, "assessment-split");
assert.equal(firstPassRecords[0].passBonus, 0);
assert.equal(firstPassRecords[1].eventId, "lsr1:pass-bonus:probability:split-checkpoint");
assert.equal(firstPassRecords[1].totalExp, 15);
assert.equal(firstPassRecords[1].countsTowardRepeatCap, false);
assert.equal(buildRewardRecords(activity({
  eventId: "assessment-split-retry",
  itemId: "assessment:split-checkpoint",
  activityClass: "assessment",
  difficulty: "intermediate",
  completionEvidence: "fully-answered-assessment",
  quality: 1,
  passed: true,
  checkpointId: "split-checkpoint",
}), firstPassRecords).length, 1, "retries do not create a second checkpoint bonus");

// Unlocks derive from the global level only, and have a clear next milestone.
assert.equal(unlockedRewardsForLevel(1).length, 0);
assert.ok(unlockedRewardsForLevel(2).some((reward) => reward.id === "first-light"));
assert.ok(unlockedRewardsForLevel(10).some((reward) => reward.id === "polymath-glow"));
assert.equal(nextRewardForLevel(9).id, "polymath");
assert.equal(nextRewardForLevel(30), null);

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
assert.equal(global.sources.length, 1, "a registered module without a saved LSR-1 ledger contributes no EXP");
assert.deepEqual(global.registeredModules.map((module) => module.moduleId), [
  "probability", "math-trainer", "bookkeys",
  "metallurgy-mt201", "metallurgy-mt202", "metallurgy-mt203", "personal-projects",
], "the registry lists only modules actually integrated with LSR-1");

// Bespoke projects must be registered in advance with immutable criteria/value,
// then completed once into the same authoritative module reward ledger.
const projectValues = new Map();
let projectWrites = 0;
const projectStorage = {
  getItem(key) { return projectValues.get(key) ?? null; },
  setItem(key, value) { projectWrites++; projectValues.set(key, String(value)); },
};
const projectInput = {
  projectId: "probability-flashcards",
  moduleId: "personal-projects",
  title: "Create probability flashcards",
  scope: "Create a bounded deck covering core distributions and conditional probability.",
  criteria: "Provide 30 checked cards with correct answers and one worked explanation per topic.",
  baseExp: 50,
  difficulty: "advanced",
};
const registered = registerProject(projectStorage, projectInput, () => ts);
assert.equal(registered.ok, true);
assert.equal(registerProject(projectStorage, projectInput, () => ts).error, "project-id-already-registered");
assert.equal(completeProject(projectStorage, projectInput.projectId, { confirmed: false, now: ts }).error,
  "acceptance-criteria-not-confirmed");
const completedProject = completeProject(projectStorage, projectInput.projectId, { confirmed: true, now: ts });
assert.equal(completedProject.ok, true);
assert.equal(completedProject.record.totalExp, 75);
assert.equal(completeProject(projectStorage, projectInput.projectId, { confirmed: true, now: ts }).duplicate, true);
assert.equal(projectWrites, 2, "registration and the single completion each write once; repeat completion does not write");
const listedProject = listRegisteredProjects(projectStorage)[0];
assert.equal(listedProject.completed, true);
assert.equal(listedProject.award.totalExp, 75);
assert.equal(readGlobalRewardSummary(projectStorage).totalExp, 75);

// Universal reward equipment is a separate, non-spendable profile preference.
// It cannot equip locked items and never changes the global EXP total.
const equipmentValues = new Map([[PROFILE_EQUIPMENT_STORAGE_KEY, JSON.stringify({
  extensionOwnedByAnotherFeature: { retained: true },
  slots: {},
})]]);
let equipmentWrites = 0;
const equipmentStorage = {
  getItem(key) { return equipmentValues.get(key) ?? null; },
  setItem(key, value) { equipmentWrites++; equipmentValues.set(key, String(value)); },
};
assert.equal(equipReward(equipmentStorage, "scholars-mark", 2).error, "reward-not-unlocked");
assert.equal(equipReward(equipmentStorage, "first-light", 2).ok, true);
const writesAfterFirstEquip = equipmentWrites;
assert.equal(equipReward(equipmentStorage, "first-light", 2).duplicate, true);
assert.equal(equipmentWrites, writesAfterFirstEquip);
assert.equal(equipReward(equipmentStorage, "scholars-mark", 5).ok, true);
assert.equal(equipReward(equipmentStorage, "polymath-glow", 10).ok, true);
let equipped = readEquippedRewards(equipmentStorage, 10);
assert.equal(equipped.title.id, "first-light");
assert.equal(equipped.emblem.id, "scholars-mark");
assert.equal(equipped.effect.id, "polymath-glow");
assert.equal(readEquippedRewards(equipmentStorage, 1).title, null, "locked equipment is hidden if not unlocked at current level");
assert.equal(unequipReward(equipmentStorage, "title").ok, true);
equipped = readEquippedRewards(equipmentStorage, 10);
assert.equal(equipped.title, null);
const equipmentPayload = JSON.parse(equipmentStorage.getItem(PROFILE_EQUIPMENT_STORAGE_KEY));
assert.deepEqual(equipmentPayload.extensionOwnedByAnotherFeature, { retained: true });
assert.equal(readGlobalRewardSummary(projectStorage).totalExp, 75, "equipping cosmetics does not spend or alter EXP");

// Every observed global level crossing gets a durable acknowledgement record.
// Initializing the feature does not manufacture retroactive notifications.
const noticeValues = new Map();
let noticeWrites = 0;
const noticeStorage = {
  getItem(key) { return noticeValues.get(key) ?? null; },
  setItem(key, value) { noticeWrites++; noticeValues.set(key, String(value)); },
};
assert.equal(syncLevelNotifications(noticeStorage, 1, () => ts).notifications.length, 0);
const created = syncLevelNotifications(noticeStorage, 3, () => ts + 1000);
assert.deepEqual(created.notifications.map((notice) => notice.level), [2, 3]);
const noticeWriteCount = noticeWrites;
assert.deepEqual(syncLevelNotifications(noticeStorage, 3, () => ts + 2000).notifications.map((notice) => notice.level), [2, 3]);
assert.equal(noticeWrites, noticeWriteCount, "a refresh must not create duplicate level-up notices");
assert.equal(acknowledgeLevelNotification(noticeStorage, 2, () => ts + 3000), true);
assert.equal(acknowledgeLevelNotification(noticeStorage, 2, () => ts + 4000), false);
const savedNotices = JSON.parse(noticeStorage.getItem(LEVEL_NOTIFICATION_STORAGE_KEY));
assert.equal(savedNotices.notifications.find((notice) => notice.level === 2).acknowledgedAt, ts + 3000);
assert.equal(savedNotices.notifications.find((notice) => notice.level === 3).acknowledgedAt, null);

console.log("LSR-1 reward standard tests passed.");
console.log("- 21 activity-class × difficulty combinations verified.");
console.log("- Repeat cap, duplicate event protection and one-time pass bonus verified.");
console.log("- Level boundaries, persisted summary and legacy-XP exclusion verified.");