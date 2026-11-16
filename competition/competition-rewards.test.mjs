import assert from "node:assert/strict";
import {
  readGlobalRewardSummary,
  buildRewardRecords,
  buildRewardRecordsBatch,
} from "../shared/rewards.mjs";
import {
  COMPETITION_REWARD_MODULE_ID,
  COMPETITION_REWARD_STORAGE_KEY,
  codeforcesDifficulty,
  createCompetitionRewardAdapter,
} from "./competition-rewards.mjs";

const values = new Map();
const storage = {
  getItem(key) { return values.has(key) ? values.get(key) : null; },
  setItem(key, value) { values.set(key, value); },
};
const adapter = createCompetitionRewardAdapter(storage, { now: () => 1_800_000_000_000 });
const accepted = {
  id: 7001,
  contestId: 2100,
  creationTimeSeconds: 1_800_000_000,
  verdict: "OK",
  problem: { contestId: 2100, index: "B", rating: 1400 },
};
assert.equal(codeforcesDifficulty(900), "foundational");
assert.equal(codeforcesDifficulty(1500), "intermediate");
assert.equal(codeforcesDifficulty(2200), "advanced");
assert.equal(codeforcesDifficulty(undefined), "foundational");

assert.equal(adapter.awardCodeforcesSubmission({ ...accepted, verdict: "WRONG_ANSWER" }, "handle"), null,
  "failed submissions never award EXP");
const first = adapter.awardCodeforcesSubmission(accepted, "ExampleHandle");
assert.ok(first);
assert.equal(first.created, true, "a new ledger record is identified as newly created");
assert.equal(first.moduleId, COMPETITION_REWARD_MODULE_ID);
assert.equal(first.itemId, "codeforces-problem:2100-B");
assert.equal(first.activityClass, "focused-practice");
assert.equal(first.difficulty, "intermediate");
assert.equal(first.completionEvidence, "verified-codeforces-accepted-submission");
assert.equal(first.baseExp, 20);
assert.equal(first.totalExp, 29);
const repeated = adapter.awardCodeforcesSubmission(accepted, "examplehandle");
assert.equal(repeated.eventId, first.eventId,
  "the same account/submission pair is idempotent");
assert.equal(repeated.created, false, "an existing ledger record is not reported as a new award");
assert.equal(adapter.getRecords().length, 1);

const sameDay = [7002, 7003, 7004].map((id) => ({
  ...accepted, id, problem: { ...accepted.problem, rating: 800 },
}));
const repeats = sameDay.map((submission) => adapter.awardCodeforcesSubmission(submission, "examplehandle"));
assert.equal(repeats[0].eligible, true);
assert.equal(repeats[1].eligible, true);
assert.equal(repeats[2].eligible, false, "the existing LSR-1 daily repeat cap applies to repeated item completions");
assert.equal(repeats[2].totalExp, 0);

const otherAccount = adapter.awardCodeforcesSubmission({
  ...accepted,
  id: 7001,
  creationTimeSeconds: accepted.creationTimeSeconds + 86400,
  problem: { ...accepted.problem, index: "C" },
}, "differenthandle");
assert.ok(otherAccount);
assert.notEqual(otherAccount.eventId, first.eventId, "event identity is scoped to the linked Codeforces account");

const summary = readGlobalRewardSummary(storage);
assert.equal(summary.byModule.find((item) => item.moduleId === COMPETITION_REWARD_MODULE_ID).awards, 4);
assert.equal(summary.sources.find((item) => item.moduleId === COMPETITION_REWARD_MODULE_ID).exp, 106);

assert.equal(values.has(COMPETITION_REWARD_STORAGE_KEY), true);

// The compact archive must retain lifetime totals and old event identities.
for (let index = 0; index < 30; index += 1) {
  const record = adapter.awardCodeforcesSubmission({
    ...accepted,
    id: 8000 + index,
    contestId: 3000 + index,
    creationTimeSeconds: accepted.creationTimeSeconds + (index + 1) * 86400,
    problem: { ...accepted.problem, index: "A", rating: 800 },
  }, "examplehandle");
  assert.equal(record?.created, true);
}
const compactPayload = JSON.parse(values.get(COMPETITION_REWARD_STORAGE_KEY));
assert.equal(compactPayload.rewardLedger.length, 20, "only the newest twenty records remain expanded");
assert.equal(compactPayload.rewardLedgerArchive.version, 1);
assert.equal(compactPayload.rewardLedgerArchive.records.length, 15,
  "older records move into the compact archive without being discarded");
assert.equal(adapter.getRecords().length, 35, "the adapter reads the complete logical ledger");
assert.equal(adapter.awardCodeforcesSubmission(accepted, "ExampleHandle").created, false,
  "an archived submission remains idempotent");
const compactSummary = readGlobalRewardSummary(storage);
assert.equal(compactSummary.sources.find((item) => item.moduleId === COMPETITION_REWARD_MODULE_ID).awards, 34);
assert.equal(compactSummary.sources.find((item) => item.moduleId === COMPETITION_REWARD_MODULE_ID).exp, 826);

// A malformed or duplicate recent record must block new awards. Otherwise a
// later compaction could silently rewrite the ledger without the bad record.
const damagedValues = new Map([[COMPETITION_REWARD_STORAGE_KEY, JSON.stringify({
  ...compactPayload,
  rewardLedger: compactPayload.rewardLedger.map((record, index) =>
    index === 0 ? { ...record, eventId: "" } : record),
})]]);
const damagedStorage = {
  getItem(key) { return damagedValues.has(key) ? damagedValues.get(key) : null; },
  setItem(key, value) { damagedValues.set(key, value); },
};
const damagedAdapter = createCompetitionRewardAdapter(damagedStorage);
const damagedBefore = damagedValues.get(COMPETITION_REWARD_STORAGE_KEY);
assert.equal(damagedAdapter.awardCodeforcesSubmission({
  ...accepted, id: 99999, contestId: 99999,
}, "examplehandle"), null, "malformed recent ledger records block new awards");
assert.equal(damagedValues.get(COMPETITION_REWARD_STORAGE_KEY), damagedBefore,
  "a rejected award leaves the damaged source bytes untouched");

// A present but empty storage value is corruption, not an absent ledger.
const emptyLedgerValues = new Map([[COMPETITION_REWARD_STORAGE_KEY, ""]]);
const emptyLedgerStorage = {
  getItem(key) { return emptyLedgerValues.has(key) ? emptyLedgerValues.get(key) : null; },
  setItem(key, value) { emptyLedgerValues.set(key, value); },
};
const emptyLedgerAdapter = createCompetitionRewardAdapter(emptyLedgerStorage);
assert.equal(emptyLedgerAdapter.awardCodeforcesSubmission({
  ...accepted, id: 100001, contestId: 100001,
}, "examplehandle"), null, "an empty existing reward ledger blocks new awards");
assert.equal(emptyLedgerValues.get(COMPETITION_REWARD_STORAGE_KEY), "",
  "rejecting an empty ledger leaves its original bytes untouched");

// Batch syncs calculate rewards in chronological order but persist the
// complete batch exactly once. A failed write must leave the original ledger
// untouched, and retrying a committed batch must remain idempotent.
let batchWrites = 0;
const batchValues = new Map();
const batchStorage = {
  getItem(key) { return batchValues.has(key) ? batchValues.get(key) : null; },
  setItem(key, value) { batchWrites += 1; batchValues.set(key, value); },
};
const batchAdapter = createCompetitionRewardAdapter(batchStorage);
const batchSubmissions = [0, 1, 2, 3].map((index) => ({
  ...accepted,
  id: 110000 + index,
  contestId: 4100,
  creationTimeSeconds: accepted.creationTimeSeconds + index,
  problem: { ...accepted.problem, index: "D", rating: 800 },
}));
const batchResults = batchAdapter.awardCodeforcesSubmissions(
  [...batchSubmissions, batchSubmissions[0]], "batchhandle"
);
assert.equal(batchResults.length, 5);
assert.deepEqual(batchResults.slice(0, 4).map((record) => record.repeatOrdinal), [1, 2, 3, 4],
  "batch reward ordinals follow the supplied chronological order");
assert.deepEqual(batchResults.map((record) => record.eligible), [true, true, true, false],
  "the daily repeat cap is preserved inside a batch");
assert.equal(batchResults[4].created, false,
  "a duplicate event repeated inside one batch resolves to the first result without a second award");
assert.equal(batchWrites, 1, "a reward batch is committed with one storage write");
const batchRetry = batchAdapter.awardCodeforcesSubmissions(batchSubmissions, "batchhandle");
assert.ok(batchRetry.every((record) => record.created === false),
  "retrying a committed batch returns existing records without creating new awards");
assert.equal(batchWrites, 1, "an idempotent retry performs no storage write");
assert.equal(batchAdapter.getRecords().length, 4);

let failedBatchWrites = 0;
const failedBatchStorage = {
  getItem() { return null; },
  setItem() { failedBatchWrites += 1; throw new Error("quota exceeded"); },
};
const failedBatchAdapter = createCompetitionRewardAdapter(failedBatchStorage);
assert.equal(failedBatchAdapter.awardCodeforcesSubmissions(batchSubmissions, "batchhandle"), null,
  "a failed batch commit is reported as failure");
assert.equal(failedBatchWrites, 1, "the batch attempts only one commit");
assert.equal(failedBatchAdapter.getRecords().length, 0,
  "a failed batch commit does not expose unpersisted reward records");

// The indexed batch calculator must be byte-for-byte equivalent to
// sequential policy evaluation, including daily caps and one-time checkpoint
// bonuses, while scaling to a large batch without rescanning the full ledger.
const parityInputs = [
  ...[0, 1, 2, 3].map((index) => ({
    eventId: "parity:repeat:" + index,
    moduleId: "parity-module",
    itemId: "same-item",
    ts: 1_800_000_000_000 + index,
    activityClass: "standard-task",
    difficulty: "foundational",
    completionEvidence: "test-evidence",
    completed: true,
    quality: 1,
  })),
  ...[0, 1].map((index) => ({
    eventId: "parity:checkpoint:" + index,
    moduleId: "parity-module",
    itemId: "checkpoint-item-" + index,
    ts: 1_800_000_000_100 + index,
    activityClass: "assessment",
    difficulty: "foundational",
    completionEvidence: "test-checkpoint",
    completed: true,
    passed: true,
    checkpointId: "unit-1",
    quality: 1,
  })),
];
let sequentialPrior = [];
const sequentialBatches = parityInputs.map((input) => {
  const records = buildRewardRecords(input, sequentialPrior);
  sequentialPrior = [...sequentialPrior, ...records];
  return records;
});
assert.deepEqual(buildRewardRecordsBatch(parityInputs, []), sequentialBatches,
  "indexed batch calculation matches sequential reward policy exactly");

const largeRewardBatches = buildRewardRecordsBatch(
  Array.from({ length: 5000 }, (_, index) => ({
    eventId: "large-batch:" + index,
    moduleId: "large-batch-module",
    itemId: "single-repeated-item",
    ts: 1_800_000_000_000 + index,
    activityClass: "focused-practice",
    difficulty: "foundational",
    completionEvidence: "verified-batch-test",
    completed: true,
    quality: 1,
  })),
  []
);
assert.equal(largeRewardBatches.length, 5000);
assert.equal(largeRewardBatches[0][0].repeatOrdinal, 1);
assert.equal(largeRewardBatches[4999][0].repeatOrdinal, 5000);
assert.equal(largeRewardBatches[4999][0].eligible, false,
  "large batches preserve the daily repeat cap without dropping event records");

console.log("Competition LSR-1 rewards: all assertions passed.");
