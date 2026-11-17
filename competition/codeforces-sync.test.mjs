import assert from "node:assert/strict";
import { COMPETITION_REWARD_STORAGE_KEY } from "./competition-rewards.mjs";
import {
  CODEFORCES_SYNC_STORAGE_KEY,
  readCodeforcesSyncState,
  syncCodeforcesSubmissions,
} from "./codeforces-sync.mjs";

const values = new Map();
const storage = {
  getItem(key) { return values.has(key) ? values.get(key) : null; },
  setItem(key, value) { values.set(key, value); },
};
const history = [
  {
    id: 100, contestId: 2000, creationTimeSeconds: 1794000000,
    verdict: "WRONG_ANSWER", problem: { contestId: 2000, index: "A", tags: ["greedy"] },
  },
  {
    id: 101, contestId: 2000, creationTimeSeconds: 1794000600,
    verdict: "OK", problem: { contestId: 2000, index: "A", tags: ["greedy"] },
  },
];

const first = syncCodeforcesSubmissions(storage, "ExampleHandle", history, 1795000000000);
assert.equal(first.ok, true);
assert.equal(first.baseline, true, "first sync establishes a baseline");
assert.equal(first.added, 0, "historical submissions never become new learning attempts");
assert.equal(readCodeforcesSyncState(storage).attempts.length, 0);
assert.equal(values.has(CODEFORCES_SYNC_STORAGE_KEY), true);
assert.equal(values.has(COMPETITION_REWARD_STORAGE_KEY), false,
  "the first historical baseline creates no EXP ledger entries");

const newSubmission = {
  id: 102, contestId: 2000, creationTimeSeconds: 1795000001,
  verdict: "WRONG_ANSWER", problem: { contestId: 2000, index: "B", tags: ["dp"] },
};
const second = syncCodeforcesSubmissions(storage, "examplehandle", [newSubmission, history[1]], 1795000005000);
assert.equal(second.ok, true);
assert.equal(second.baseline, false);
assert.equal(second.added, 1, "only the unseen post-baseline submission is projected");
assert.equal(second.state.attempts.length, 1);
assert.equal(second.state.attempts[0].id, "codeforces:102");
assert.equal(second.state.attempts[0].outcome, "incorrect");

const repeated = syncCodeforcesSubmissions(storage, "ExampleHandle", [newSubmission], 1795000009000);
assert.equal(repeated.added, 0, "repeated API results do not duplicate learning attempts");
assert.equal(repeated.state.attempts.length, 1);

const pending = {
  id: 103, contestId: 2000, creationTimeSeconds: 1795000002,
  verdict: "TESTING", problem: { contestId: 2000, index: "C", tags: ["dp"] },
};
const pendingSync = syncCodeforcesSubmissions(storage, "ExampleHandle", [pending], 1795000003000);
assert.equal(pendingSync.added, 0);
const finalized = syncCodeforcesSubmissions(storage, "ExampleHandle", [{ ...pending, verdict: "OK" }], 1795000004000);
assert.equal(finalized.added, 1, "a pending submission is not marked seen before its verdict becomes terminal");
assert.equal(finalized.state.attempts.find((attempt) => attempt.id === "codeforces:103").outcome, "correct");
assert.equal(finalized.rewardAwards, 1, "a newly accepted post-baseline submission earns one reward");
assert.equal(finalized.awardedExp, 24, "a foundational accepted submission receives the LSR-1 focused-practice award");
const repeatedFinalized = syncCodeforcesSubmissions(storage, "ExampleHandle", [{ ...pending, verdict: "OK" }], 1795000005000);
assert.equal(repeatedFinalized.added, 0);
assert.equal(repeatedFinalized.rewardAwards, 0, "repeated sync does not award EXP twice");

// A reward can be persisted even if the separate sync-state write fails.
// Retrying must not report that already-persisted reward as newly awarded.
const flakyValues = new Map();
let failNextSyncWrite = false;
const flakyStorage = {
  getItem(key) { return flakyValues.has(key) ? flakyValues.get(key) : null; },
  setItem(key, value) {
    if (key === CODEFORCES_SYNC_STORAGE_KEY && failNextSyncWrite) {
      failNextSyncWrite = false;
      throw new Error("simulated sync-state quota failure");
    }
    flakyValues.set(key, value);
  },
};
const retryBaseline = syncCodeforcesSubmissions(flakyStorage, "RetryHandle", [], 1795000000000);
assert.equal(retryBaseline.ok, true);
const retrySubmission = {
  id: 104, contestId: 2000, creationTimeSeconds: 1795000001,
  verdict: "OK", problem: { contestId: 2000, index: "D", rating: 800, tags: ["implementation"] },
};
failNextSyncWrite = true;
const failedStateWrite = syncCodeforcesSubmissions(flakyStorage, "RetryHandle", [retrySubmission], 1795000005000);
assert.equal(failedStateWrite.ok, false);
assert.equal(failedStateWrite.error, "storage-write-failed");
assert.equal(flakyValues.has(COMPETITION_REWARD_STORAGE_KEY), true,
  "the independently persisted reward survives a sync-state write failure");
const recoveredRetry = syncCodeforcesSubmissions(flakyStorage, "RetryHandle", [retrySubmission], 1795000006000);
assert.equal(recoveredRetry.ok, true);
assert.equal(recoveredRetry.added, 1, "the retry restores the missing learning attempt");
assert.equal(recoveredRetry.rewardAwards, 0, "an already-persisted reward is not counted as a new award");
assert.equal(recoveredRetry.awardedExp, 0, "retry does not report previously credited EXP as newly awarded");
assert.equal(recoveredRetry.state.attempts.length, 1);

const switched = syncCodeforcesSubmissions(storage, "DifferentHandle", history, 1796000000000);
assert.equal(switched.baseline, true, "changing accounts establishes a fresh baseline");
assert.equal(switched.added, 0);
assert.equal(switched.state.handle, "differenthandle");
assert.equal(switched.state.attempts.length, 0, "attempts from the previous account are not carried over");

assert.equal(syncCodeforcesSubmissions(storage, "", history).ok, false);
console.log("Codeforces sync baseline: all assertions passed.");


// The bounded seen-ID window must cover the API's maximum safe fetch window
// (100 pages × 1,000 submissions), not just a small arbitrary subset.
{
  const largeStorage = {
    value: JSON.stringify({
      version: 1, handle: "largehandle", baselineAt: 1795000000000, lastSyncAt: 1795000000000,
      seenSubmissionIds: Array.from({ length: 100005 }, (_, index) => 200000 - index),
      attempts: [],
    }),
    getItem() { return this.value; },
    setItem(_key, value) { this.value = value; },
  };
  const normalized = syncCodeforcesSubmissions(largeStorage, "LargeHandle", [], 1795000005000);
  assert.equal(normalized.ok, true);
  const retained = readCodeforcesSyncState(largeStorage).seenSubmissionIds;
  assert.equal(retained.length, 100000);
  assert.equal(retained[0], 100001);
  assert.equal(retained.at(-1), 200000);
}

// Learning history is bounded at 5,000 attempts, retaining the newest records.
{
  const largeStorage = {
    value: null,
    getItem() { return this.value; },
    setItem(_key, value) { this.value = value; },
  };
  syncCodeforcesSubmissions(largeStorage, "AttemptHandle", [], 1795000000000);
  const submissions = Array.from({ length: 5005 }, (_, index) => ({
    id: 300000 + index,
    contestId: 2000,
    creationTimeSeconds: 1795000001 + index,
    verdict: "WRONG_ANSWER",
    problem: { contestId: 2000, index: "A", tags: ["greedy"] },
  }));
  const result = syncCodeforcesSubmissions(largeStorage, "AttemptHandle", submissions, 1796000000000);
  assert.equal(result.ok, true);
  assert.equal(result.added, 5005);
  const retainedAttempts = readCodeforcesSyncState(largeStorage).attempts;
  assert.equal(retainedAttempts.length, 5000);
  assert.equal(retainedAttempts[0].id, "codeforces:300005");
  assert.equal(retainedAttempts.at(-1).id, "codeforces:305004");
}


// Reward repeat caps must be assigned oldest-first even when the API returns
// the accepted submissions newest-first.
{
  const orderedValues = new Map();
  const orderedStorage = {
    getItem(key) { return orderedValues.has(key) ? orderedValues.get(key) : null; },
    setItem(key, value) { orderedValues.set(key, value); },
  };
  syncCodeforcesSubmissions(orderedStorage, "OrderedHandle", [], 1795000000000);
  const sameProblem = [4, 3, 2, 1].map((id) => ({
    id: 200 + id,
    contestId: 2000,
    creationTimeSeconds: 1795000000 + id,
    verdict: "OK",
    problem: { contestId: 2000, index: "A", rating: 800, tags: ["greedy"] },
  }));
  const orderedSync = syncCodeforcesSubmissions(
    orderedStorage, "OrderedHandle", sameProblem, 1795000010000
  );
  assert.equal(orderedSync.rewardAwards, 3);
  const rewardPayload = JSON.parse(orderedStorage.getItem(COMPETITION_REWARD_STORAGE_KEY));
  const archive = rewardPayload.rewardArchive;
  assert.ok(archive.eventIds.includes("codeforces:orderedhandle:201"));
  assert.ok(archive.eventIds.includes("codeforces:orderedhandle:202"));
  assert.ok(archive.eventIds.includes("codeforces:orderedhandle:203"));
  assert.ok(archive.eventIds.includes("codeforces:orderedhandle:204"));
  assert.equal(archive.awardCount, 3, "exactly three of the four same-day completions earned EXP");
  assert.equal(archive.repeatCounts.find((entry) => entry.itemId === "codeforces-problem:2000-A").count, 4,
    "the compact repeat index retains all four same-day attempts");
}
