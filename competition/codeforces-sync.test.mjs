import assert from "node:assert/strict";
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

const pending = {
  id: 103, contestId: 2000, creationTimeSeconds: 1795000002,
  verdict: "TESTING", problem: { contestId: 2000, index: "C", tags: ["dp"] },
};
const pendingSync = syncCodeforcesSubmissions(storage, "ExampleHandle", [pending], 1795000003000);
assert.equal(pendingSync.added, 0);
const finalized = syncCodeforcesSubmissions(storage, "ExampleHandle", [{ ...pending, verdict: "OK" }], 1795000004000);
assert.equal(finalized.added, 1, "a pending submission is not marked seen before its verdict becomes terminal");
assert.equal(finalized.state.attempts[0].outcome, "correct");

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

const switched = syncCodeforcesSubmissions(storage, "DifferentHandle", history, 1796000000000);
assert.equal(switched.baseline, true, "changing accounts establishes a fresh baseline");
assert.equal(switched.added, 0);
assert.equal(switched.state.handle, "differenthandle");
assert.equal(switched.state.attempts.length, 0, "attempts from the previous account are not carried over");

assert.equal(syncCodeforcesSubmissions(storage, "", history).ok, false);
console.log("Codeforces sync baseline: all assertions passed.");
