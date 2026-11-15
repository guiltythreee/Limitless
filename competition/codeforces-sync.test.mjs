import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { COMPETITION_REWARD_STORAGE_KEY } from "./competition-rewards.mjs";
import { analyzeCompetitionLearning } from "./learning-intelligence.mjs";
import {
  CODEFORCES_SYNC_STORAGE_KEY,
  CODEFORCES_ACCOUNT_HISTORY_STORAGE_KEY,
  readCodeforcesSyncState,
  activateCodeforcesAccount,
  syncCodeforcesSubmissions,
  appendCodeforcesRevisionAttempt,
  getCodeforcesSyncFetchPlan,
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

assert.deepEqual(getCodeforcesSyncFetchPlan(storage, "EXAMPLEHANDLE"),
  { mode: "since", sinceSeconds: 1794913600 },
  "repeat sync uses a 24-hour overlap from the successful active-account cursor");
assert.deepEqual(getCodeforcesSyncFetchPlan(storage, "newhandle"),
  { mode: "all", sinceSeconds: null },
  "a new handle must fetch full history to establish its own baseline");
assert.deepEqual(getCodeforcesSyncFetchPlan(storage, ""),
  { mode: "invalid", sinceSeconds: null },
  "an empty handle must not produce a fetch plan");

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
assert.equal(switched.state.attempts.length, 0, "a new account starts with isolated learning history");
assert.ok(JSON.parse(storage.getItem(CODEFORCES_ACCOUNT_HISTORY_STORAGE_KEY)).accounts.examplehandle);
assert.deepEqual(getCodeforcesSyncFetchPlan(storage, "DifferentHandle"),
  { mode: "since", sinceSeconds: 1795913600 },
  "the newly active account uses its own cursor after its baseline");
assert.deepEqual(getCodeforcesSyncFetchPlan(storage, "ExampleHandle"),
  { mode: "since", sinceSeconds: 1794913605 },
  "an inactive saved handle retains its own incremental cursor");
const returned = syncCodeforcesSubmissions(storage, "ExampleHandle", [], 1797000000000);
assert.equal(returned.ok, true);
assert.equal(returned.baseline, false, "returning to a known handle restores its original baseline");
assert.equal(returned.state.attempts.length, 2, "switching back restores prior attempts");
assert.equal(returned.state.handle, "examplehandle");
assert.equal(readCodeforcesSyncState(storage, "DifferentHandle").handle, "differenthandle");
assert.equal(readCodeforcesSyncState(storage, "DifferentHandle").lastSyncAt, 1796000000000,
  "incremental fetch planning can read the saved cursor for an inactive account");

// Account switching must reject malformed saved snapshots and roll back both
// storage keys if persisting the active account fails after the collection write.
{
  const activeKey = CODEFORCES_SYNC_STORAGE_KEY;
  const historyKey = CODEFORCES_ACCOUNT_HISTORY_STORAGE_KEY;
  const initialActive = JSON.stringify({
    version: 1, handle: "outgoing", baselineAt: 1000, lastSyncAt: 2000,
    seenSubmissionIds: [1], attempts: [], revisionState: [],
  });
  const initialHistory = JSON.stringify({
    version: 1,
    accounts: {
      incoming: {
        version: 1, handle: "incoming", baselineAt: 1500, lastSyncAt: 1800,
        seenSubmissionIds: [2], attempts: [], revisionState: [],
      },
    },
  });
  const values = new Map([[activeKey, initialActive], [historyKey, initialHistory]]);
  let failActiveWrite = false;
  const transactionalStorage = {
    getItem(key) { return values.has(key) ? values.get(key) : null; },
    setItem(key, value) {
      if (key === activeKey && failActiveWrite) throw new Error("simulated active-account write failure");
      values.set(key, value);
    },
    removeItem(key) { values.delete(key); },
  };
  failActiveWrite = true;
  const failedSwitch = activateCodeforcesAccount(transactionalStorage, "incoming");
  assert.equal(failedSwitch.ok, false);
  assert.equal(failedSwitch.error, "storage-write-failed");
  assert.equal(values.get(activeKey), initialActive,
    "failed account activation restores the previous active record");
  assert.equal(values.get(historyKey), initialHistory,
    "failed account activation restores the previous account collection");

  const malformedHistory = JSON.stringify({
    version: 1,
    accounts: {
      incoming: {
        version: 1, handle: "incoming", baselineAt: 1000, lastSyncAt: 1000,
        seenSubmissionIds: [0], attempts: [], revisionState: [],
      },
    },
  });
  values.set(historyKey, malformedHistory);
  const rejectedHistory = activateCodeforcesAccount(transactionalStorage, "incoming");
  assert.equal(rejectedHistory.ok, false);
  assert.equal(rejectedHistory.error, "invalid-account-history",
    "invalid submission IDs in a saved account are rejected rather than silently filtered");
  assert.equal(values.get(historyKey), malformedHistory,
    "invalid saved history remains byte-for-byte untouched");
}

assert.equal(syncCodeforcesSubmissions(storage, "", history).ok, false);
const accountsSource = await readFile(new URL("./accounts.js", import.meta.url), "utf8");
assert.match(accountsSource, /getCodeforcesSyncFetchPlan\(localStorage, handle\)/,
  "account linking must select a fetch window using the requested handle's saved cursor");
assert.match(accountsSource, /fetchCodeforcesSubmissionsSince\(handle, plan\.sinceSeconds\)/,
  "repeat connections must fetch incrementally with a 24-hour overlap");
assert.match(accountsSource, /fetchAllCodeforcesSubmissions\(handle\)/,
  "first connections and unknown handles must establish a complete historical baseline");
const invalidPlanGuard = accountsSource.indexOf('if (plan.mode === "invalid")');
const sinceSubmissionFetch = accountsSource.indexOf("fetchCodeforcesSubmissionsSince(handle, plan.sinceSeconds)");
const fullSubmissionFetch = accountsSource.indexOf("fetchAllCodeforcesSubmissions(handle)");
assert.ok(invalidPlanGuard >= 0 && invalidPlanGuard < sinceSubmissionFetch && invalidPlanGuard < fullSubmissionFetch,
  "an invalid sync plan is rejected before either submission-history endpoint is called");

const corruptArchiveStorage = {
  value: JSON.stringify({
    version: 1,
    handle: "corrupt",
    baselineAt: 1795000000000,
    lastSyncAt: 1795000000000,
    seenSubmissionIds: [],
    attempts: [],
    attemptsArchive: { version: 1, strings: [], records: [[999]] },
  }),
  getItem(key) { return key === CODEFORCES_SYNC_STORAGE_KEY ? this.value : null; },
  setItem(_key, value) { this.value = value; },
};
const corruptBefore = corruptArchiveStorage.value;
const corruptSync = syncCodeforcesSubmissions(corruptArchiveStorage, "corrupt", history, 1796000000000);
assert.equal(corruptSync.ok, false);
assert.equal(corruptSync.error, "invalid-active-learning-record",
  "account activation rejects a corrupted archive before sync can mutate it");
const corruptRead = readCodeforcesSyncState(corruptArchiveStorage);
assert.equal(corruptRead.attemptsArchiveValid, false);
assert.equal(corruptRead.attempts.length, 0,
  "consumers do not mistake a partial recent window for complete history");
assert.equal(corruptArchiveStorage.value, corruptBefore,
  "sync refuses to overwrite an unreadable archive");

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
    getItem(key) { return key === CODEFORCES_SYNC_STORAGE_KEY ? this.value : null; },
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
    getItem(key) { return key === CODEFORCES_SYNC_STORAGE_KEY ? this.value : null; },
    setItem(_key, value) { this.value = value; },
  };
  syncCodeforcesSubmissions(largeStorage, "AttemptHandle", [], 1795000000000);
  const submissions = Array.from({ length: 5005 }, (_, index) => ({
    id: 300000 + index,
    contestId: 2000 + index,
    creationTimeSeconds: 1795000001 + index,
    verdict: "WRONG_ANSWER",
    problem: { contestId: 2000 + index, index: "A", tags: ["greedy"] },
  }));
  const result = syncCodeforcesSubmissions(largeStorage, "AttemptHandle", submissions, 1796000000000);
  assert.equal(result.ok, true);
  assert.equal(result.added, 5005);
  const retainedAttempts = readCodeforcesSyncState(largeStorage).attempts;
  assert.equal(retainedAttempts.length, 5005,
    "older attempts remain available to revision and mastery calculations");
  assert.equal(retainedAttempts[0].id, "codeforces:300000");
  assert.equal(retainedAttempts.at(-1).id, "codeforces:305004");
  const persisted = JSON.parse(largeStorage.value);
  assert.equal(persisted.attempts.length, 5000,
    "only the newest 5,000 attempts remain expanded");
  assert.equal(persisted.attemptsArchive.version, 1);
  assert.equal(persisted.attemptsArchive.records.length, 5,
    "older attempts move into a compact archive rather than being evicted");
  assert.ok(
    JSON.stringify(persisted.attemptsArchive).length <
      JSON.stringify(submissions.slice(0, 5).map((submission) => ({
        id: "codeforces:" + submission.id,
        disciplineId: "competitive-programming",
        courseId: "codeforces",
        contentId: String(submission.contestId) + "A",
        questionId: "codeforces:" + submission.contestId + "A",
        subjectId: "codeforces",
        conceptIds: ["greedy"],
        outcome: "incorrect",
        occurredAt: submission.creationTimeSeconds * 1000,
        mode: "practice",
      }))).length,
    "dictionary archive is smaller than expanded attempt objects",
  );
  const noOpSync = syncCodeforcesSubmissions(largeStorage, "AttemptHandle", [], 1796000005000);
  assert.equal(noOpSync.ok, true);
  assert.equal(readCodeforcesSyncState(largeStorage).attempts.length, 5005,
    "subsequent syncs do not discard archived learning history");
  const revisionAt = 1796000005000;
  const revisionWrite = appendCodeforcesRevisionAttempt(
    largeStorage, "codeforces:2000A", "correct", revisionAt
  );
  assert.equal(revisionWrite.ok, true,
    "a problem retained only in the archive can still receive revision feedback");
  const afterRevision = readCodeforcesSyncState(largeStorage);
  assert.equal(afterRevision.attempts.length, 5006);
  assert.ok(afterRevision.attempts.some((attempt) =>
    attempt.questionId === "codeforces:2000A" && attempt.mode === "revision"
  ));
  assert.equal(JSON.parse(largeStorage.value).attemptsArchive.records.length, 6,
    "adding a revision does not discard the archived original attempt");
  const revisionAnalysis = analyzeCompetitionLearning([], [], revisionAt, afterRevision.attempts);
  const revisedCandidate = revisionAnalysis.revision.find((item) => item.questionId === "codeforces:2000A");
  assert.ok(revisedCandidate);
  assert.equal(revisedCandidate.lastReviewedAt, revisionAt);
  assert.equal(revisedCandidate.dueAt, revisionAt + 7 * 86400000,
    "an archived problem's successful revision advances the normal 1/7/14/30-day schedule");
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
  const ledger = JSON.parse(orderedStorage.getItem(COMPETITION_REWARD_STORAGE_KEY)).rewardLedger;
  const byEvent = new Map(ledger.map((record) => [record.eventId, record]));
  assert.equal(byEvent.get("codeforces:orderedhandle:201").eligible, true);
  assert.equal(byEvent.get("codeforces:orderedhandle:202").eligible, true);
  assert.equal(byEvent.get("codeforces:orderedhandle:203").eligible, true);
  assert.equal(byEvent.get("codeforces:orderedhandle:204").reason, "daily-repeat-cap");
}


// Durable scheduler snapshots survive raw-attempt compaction and remain isolated per handle.
{
  const schedulerValues = new Map();
  const schedulerStorage = {
    getItem(key) { return schedulerValues.has(key) ? schedulerValues.get(key) : null; },
    setItem(key, value) { schedulerValues.set(key, value); },
    removeItem(key) { schedulerValues.delete(key); },
  };
  syncCodeforcesSubmissions(schedulerStorage, "SchedulerA", [], 1_795_000_000_000);
  const failedSubmission = {
    id: 990001, contestId: 9900, creationTimeSeconds: 1_795_000_001,
    verdict: "WRONG_ANSWER", problem: { contestId: 9900, index: "A", tags: ["dp", "greedy"] },
  };
  syncCodeforcesSubmissions(schedulerStorage, "SchedulerA", [failedSubmission], 1_795_000_002_000);
  const afterFailure = readCodeforcesSyncState(schedulerStorage);
  assert.equal(afterFailure.revisionState.length, 1);
  assert.equal(afterFailure.revisionState[0].questionId, "codeforces:9900A");
  assert.equal(afterFailure.revisionState[0].failures, 1);
  assert.equal(afterFailure.revisionState[0].successfulRevisions, 0);

  const revision = appendCodeforcesRevisionAttempt(schedulerStorage, "codeforces:9900A", "correct", 1_795_086_403_000);
  assert.equal(revision.ok, true);
  const afterRevision = readCodeforcesSyncState(schedulerStorage);
  assert.equal(afterRevision.revisionState[0].successfulRevisions, 1);
  assert.equal(afterRevision.revisionState[0].lastSuccessfulRevisionAt, 1_795_086_403_000);

  syncCodeforcesSubmissions(schedulerStorage, "SchedulerB", [], 1_795_100_000_000);
  assert.equal(readCodeforcesSyncState(schedulerStorage).revisionState.length, 0,
    "a new account must not inherit another handle's revision candidates");
  syncCodeforcesSubmissions(schedulerStorage, "SchedulerA", [], 1_795_200_000_000);
  assert.equal(readCodeforcesSyncState(schedulerStorage).revisionState[0].successfulRevisions, 1,
    "switching back restores the original account's scheduler snapshot");

assert.deepEqual(getCodeforcesSyncFetchPlan(storage, "ExampleHandle"),
  { mode: "since", sinceSeconds: 1796913600 },
  "switching back advances the restored account's cursor independently");}