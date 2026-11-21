import assert from "node:assert/strict";
import { COMPETITION_REWARD_STORAGE_KEY } from "./competition-rewards.mjs";
import { readCodeforcesSyncState, syncCodeforcesSubmissions } from "./codeforces-sync.mjs";

const values = new Map();
const storage = {
  getItem(key) { return values.has(key) ? values.get(key) : null; },
  setItem(key, value) { values.set(key, value); },
};
const sub = (id, contestId, seconds, verdict, participantType, index = "A", rating = 800) => ({
  id, contestId, creationTimeSeconds: seconds, verdict,
  author: { contestId, participantType },
  problem: { contestId, index, rating, tags: [] },
});
const ledger = () => JSON.parse(values.get(COMPETITION_REWARD_STORAGE_KEY) ?? '{"rewardLedger":[]}').rewardLedger;
const BASE = 1_795_000_000; // seconds

// Baseline: contest 2000 was already under way. It must never be rewarded later.
const first = syncCodeforcesSubmissions(storage, "Handle", [sub(1, 2000, BASE - 100, "OK", "CONTESTANT")], BASE * 1000);
assert.equal(first.baseline, true);
assert.equal(ledger().length, 0);
assert.deepEqual(readCodeforcesSyncState(storage).seenContestIds, [2000]);

// Later submission in the baseline contest: solve is paid, participation is not.
const s2 = syncCodeforcesSubmissions(storage, "handle",
  [sub(2, 2000, BASE + 10, "OK", "CONTESTANT", "B")], (BASE + 20) * 1000);
assert.equal(s2.awardedExp, 10, "800-rated solve only; no participation for a contest already seen at baseline");

// A new official contest: participation (25) + solve (10) = 35, even with a wrong answer first.
const s3 = syncCodeforcesSubmissions(storage, "handle", [
  sub(3, 2100, BASE + 1000, "WRONG_ANSWER", "CONTESTANT"),
  sub(4, 2100, BASE + 1500, "OK", "CONTESTANT"),
], (BASE + 2000) * 1000);
assert.equal(s3.awardedExp, 35);
assert.equal(ledger().filter((r) => r.completionEvidence === "verified-codeforces-contest-participation").length, 1);

// Idempotent: re-syncing the same data and later submissions in the same contest add nothing for participation.
const s4 = syncCodeforcesSubmissions(storage, "handle", [
  sub(5, 2100, BASE + 1600, "OK", "CONTESTANT", "B"),
  sub(4, 2100, BASE + 1500, "OK", "CONTESTANT"),
], (BASE + 2100) * 1000);
assert.equal(s4.awardedExp, 10, "only the new solve is paid, not the contest again");

// Practice, virtual and Gym submissions never earn participation.
const s5 = syncCodeforcesSubmissions(storage, "handle", [
  sub(6, 2200, BASE + 3000, "WRONG_ANSWER", "PRACTICE"),
  sub(7, 2201, BASE + 3100, "WRONG_ANSWER", "VIRTUAL"),
  sub(8, 100500, BASE + 3200, "WRONG_ANSWER", "CONTESTANT"),
], (BASE + 3300) * 1000);
assert.equal(s5.awardedExp, 0);
assert.equal(ledger().filter((r) => r.completionEvidence === "verified-codeforces-contest-participation").length, 1);

console.log("Codeforces contest participation: all assertions passed.");
