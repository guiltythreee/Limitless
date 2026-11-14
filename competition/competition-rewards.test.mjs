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
assert.equal(first.moduleId, COMPETITION_REWARD_MODULE_ID);
assert.equal(first.itemId, "codeforces-problem:2100-B");
assert.equal(first.activityClass, "focused-practice");
assert.equal(first.difficulty, "intermediate");
assert.equal(first.completionEvidence, "verified-codeforces-accepted-submission");
assert.equal(first.baseExp, 20);
assert.equal(first.totalExp, 29);
assert.equal(adapter.awardCodeforcesSubmission(accepted, "examplehandle").eventId, first.eventId,
  "the same account/submission pair is idempotent");
assert.equal(adapter.getRecords().length, 1);

const sameDay = [7002, 7003, 7004].map((id) => ({
  ...accepted, id, problem: { ...accepted.problem, rating: 800 },
}));
const repeats = sameDay.map((submission) => adapter.awardCodeforcesSubmission(submission, "examplehandle"));
assert.equal(repeats[0].eligible, true);
assert.equal(repeats[1].eligible, true);
assert.equal(repeats[2].eligible, false, "the existing LSR-1 daily repeat cap applies to repeated item completions");
assert.equal(repeats[2].totalExp, 0);

const otherAccount = adapter.awardCodeforcesSubmission({ ...accepted, id: 7001 }, "differenthandle");
assert.ok(otherAccount);
assert.notEqual(otherAccount.eventId, first.eventId, "event identity is scoped to the linked Codeforces account");

const summary = readGlobalRewardSummary(storage);
assert.equal(summary.byModule.find((item) => item.moduleId === COMPETITION_REWARD_MODULE_ID).awards, 4);
assert.equal(summary.sources.find((item) => item.moduleId === COMPETITION_REWARD_MODULE_ID).exp, 94);
assert.equal(values.has(COMPETITION_REWARD_STORAGE_KEY), true);
console.log("Competition LSR-1 rewards: all assertions passed.");
