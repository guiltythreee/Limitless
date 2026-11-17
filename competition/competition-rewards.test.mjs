import assert from "node:assert/strict";
import { readGlobalRewardSummary } from "../shared/rewards.mjs";
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

console.log("Competition LSR-1 rewards: all assertions passed.");
