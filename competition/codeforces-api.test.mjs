import assert from "node:assert/strict";
import { createCodeforcesApiRequester } from "./codeforces-api.mjs";

let clock = 10_000;
const starts = [];
const waits = [];
const request = createCodeforcesApiRequester(async (url) => {
  starts.push({ url, at: clock });
  return { ok: true, json: async () => ({ status: "OK", result: url }) };
}, {
  minIntervalMs: 2100,
  now: () => clock,
  sleep: async (ms) => { waits.push(ms); clock += ms; },
});

const results = await Promise.all(["user.info", "user.rating", "user.status"].map(request));
assert.deepEqual(results.map((item) => item.result), ["user.info", "user.rating", "user.status"]);
assert.deepEqual(waits, [2100, 2100], "parallel callers are serialized with the documented spacing");
assert.deepEqual(starts.map((item) => item.at), [10_000, 12_100, 14_200]);

let fail = true;
const recovery = createCodeforcesApiRequester(async () => {
  if (fail) {
    fail = false;
    return { ok: false, json: async () => ({}) };
  }
  return { ok: true, json: async () => ({ status: "OK", result: "recovered" }) };
}, { minIntervalMs: 0, now: () => clock, sleep: async () => {} });
await assert.rejects(recovery("failed"), /Codeforces API request failed/);
assert.equal((await recovery("retry")).result, "recovered", "a failed request must not poison the queue");

const apiFailure = createCodeforcesApiRequester(async () => ({
  ok: true, json: async () => ({ status: "FAILED", comment: "Call limit exceeded" }),
}), { minIntervalMs: 0 });
await assert.rejects(apiFailure("rate-limited"), /Call limit exceeded/);

console.log("Codeforces API rate limiting: all assertions passed.");
