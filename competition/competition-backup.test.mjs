import assert from "node:assert/strict";
import { appendRewardRecords } from "../shared/rewards.mjs";
import {
  CODEFORCES_SYNC_STORAGE_KEY,
  COMPETITION_REWARD_STORAGE_KEY,
  createCompetitionBackup,
  restoreCompetitionBackup,
} from "./competition-backup.mjs";

function makeStorage(seed = new Map()) {
  const values = new Map(seed);
  let failKey = "";
  return {
    values,
    failNextWriteFor(key) { failKey = key; },
    getItem(key) { return values.has(key) ? values.get(key) : null; },
    setItem(key, value) {
      if (key === failKey) {
        failKey = "";
        throw new Error("simulated storage failure");
      }
      values.set(key, String(value));
    },
    removeItem(key) { values.delete(key); },
  };
}

const learning = {
  version: 1,
  handle: "example",
  baselineAt: 1_800_000_000_000,
  lastSyncAt: 1_800_000_001_000,
  seenSubmissionIds: [101, 102],
  attempts: [{
    id: "codeforces:102", disciplineId: "competitive-programming",
    courseId: "codeforces", contentId: "2000A", questionId: "codeforces:2000A",
    subjectId: "implementation", conceptIds: ["implementation"],
    outcome: "correct", occurredAt: 1_800_000_001_000,
  }],
};
const reward = {
  policyVersion: "LSR-1",
  eventId: "codeforces:example:102",
  moduleId: "competitive-programming",
  itemId: "codeforces-problem:2000-A",
  ts: 1_800_000_001_000,
  activityClass: "focused-practice",
  difficulty: "foundational",
  completionEvidence: "verified-codeforces-accepted-submission",
  completed: true,
  eligible: true,
  reason: "awarded",
  countsTowardRepeatCap: true,
  repeatOrdinal: 1,
  baseExp: 20,
  difficultyMultiplier: 1,
  qualityBonus: 0,
  passBonus: 0,
  totalExp: 20,
};
const state = { mastery: { "w1-t0": "practiced" }, problemLog: [], mocks: [] };
const source = makeStorage();
source.setItem(CODEFORCES_SYNC_STORAGE_KEY, JSON.stringify(learning));
const archivedRewards = appendRewardRecords(
  { rewardLedger: [reward] }, [], "competitive-programming", reward.ts + 86_400_000,
);
source.setItem(COMPETITION_REWARD_STORAGE_KEY, JSON.stringify(archivedRewards));

const backup = createCompetitionBackup(source, state, "2026-11-15T00:00:00.000Z");
assert.equal(backup.version, 3);
assert.deepEqual(backup.codeforcesLearning, learning);
assert.deepEqual(backup.codeforcesRewards.rewardLedger, []);
assert.equal(backup.codeforcesRewards.rewardArchive.totalExp, 20);

const restored = makeStorage();
restored.setItem("competition-state", "old-state");
assert.deepEqual(
  restoreCompetitionBackup(restored, "competition-state", state, backup),
  { ok: true },
);
assert.deepEqual(JSON.parse(restored.getItem(CODEFORCES_SYNC_STORAGE_KEY)), learning);
assert.deepEqual(JSON.parse(restored.getItem(COMPETITION_REWARD_STORAGE_KEY)).rewardLedger, []);
assert.equal(JSON.parse(restored.getItem(COMPETITION_REWARD_STORAGE_KEY)).rewardArchive.totalExp, 20);
assert.deepEqual(JSON.parse(restored.getItem("competition-state")), state);

const invalid = { ...backup, codeforcesLearning: { version: 1, attempts: "not-an-array" } };
const invalidTarget = makeStorage();
invalidTarget.setItem("competition-state", "keep-me");
assert.equal(restoreCompetitionBackup(invalidTarget, "competition-state", state, invalid).ok, false);
assert.equal(invalidTarget.getItem("competition-state"), "keep-me",
  "invalid optional backup data must be rejected before any writes");

const legacyTarget = makeStorage();
legacyTarget.setItem(CODEFORCES_SYNC_STORAGE_KEY, "keep-learning");
legacyTarget.setItem(COMPETITION_REWARD_STORAGE_KEY, "keep-rewards");
assert.equal(restoreCompetitionBackup(legacyTarget, "competition-state", state, {
  version: 2, data: state,
}).ok, true);
assert.equal(legacyTarget.getItem(CODEFORCES_SYNC_STORAGE_KEY), "keep-learning",
  "version 2 backups leave separate Codeforces learning data untouched");
assert.equal(legacyTarget.getItem(COMPETITION_REWARD_STORAGE_KEY), "keep-rewards",
  "version 2 backups leave the reward ledger untouched");

const rollbackTarget = makeStorage();
rollbackTarget.setItem("competition-state", "old-state");
rollbackTarget.setItem(CODEFORCES_SYNC_STORAGE_KEY, "old-learning");
rollbackTarget.setItem(COMPETITION_REWARD_STORAGE_KEY, "old-rewards");
rollbackTarget.failNextWriteFor(COMPETITION_REWARD_STORAGE_KEY);
const failedRestore = restoreCompetitionBackup(rollbackTarget, "competition-state", state, backup);
assert.deepEqual(failedRestore, { ok: false, error: "storage-write-failed" });
assert.equal(rollbackTarget.getItem("competition-state"), "old-state");
assert.equal(rollbackTarget.getItem(CODEFORCES_SYNC_STORAGE_KEY), "old-learning");
assert.equal(rollbackTarget.getItem(COMPETITION_REWARD_STORAGE_KEY), "old-rewards",
  "a failed multi-key restore rolls back earlier writes");

console.log("Competition backup integrity: all assertions passed.");
