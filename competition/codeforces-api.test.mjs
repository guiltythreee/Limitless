import assert from "node:assert/strict";
import { createCodeforcesApiRequester, fetchCodeforcesSubmissionsSince } from "./codeforces-api.mjs";

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
{
  const pages = [
    { status: "OK", result: [
      { id: 9, creationTimeSeconds: 300 },
      { id: 8, creationTimeSeconds: 250 },
      { id: 7, creationTimeSeconds: 200 },
    ] },
    { status: "OK", result: [
      { id: 7, creationTimeSeconds: 200 },
      { id: 6, creationTimeSeconds: 150 },
      { id: 5, creationTimeSeconds: 100 },
    ] },
    { status: "OK", result: [
      { id: 4, creationTimeSeconds: 90 },
    ] },
  ];
  const calls = [];
  const recent = await fetchCodeforcesSubmissionsSince("example_handle", 150, {
    pageSize: 3,
    overlap: 1,
    request: async (url) => { calls.push(url); return pages.shift(); },
  });
  assert.deepEqual(recent.map((item) => item.id), [9, 8, 7, 6],
    "recent fetch keeps submissions at/after the boundary and deduplicates overlap");
  assert.equal(calls.length, 3, "recent fetch stops only after a whole page is older than the requested boundary");
  assert.match(calls[0], /from=1&count=3$/);
  assert.match(calls[1], /from=3&count=3$/);
}

{
  await assert.rejects(
    fetchCodeforcesSubmissionsSince("example_handle", 100, {
      pageSize: 2,
      maxPages: 1,
      request: async () => ({ status: "OK", result: [
        { id: 2, creationTimeSeconds: 300 },
        { id: 1, creationTimeSeconds: 200 },
      ] }),
    }),
    /safe pagination limit/,
    "an incomplete recent window must fail rather than return partial submissions"
  );
}



// Complete-history pagination: pages overlap, but submission IDs are unique.
{
  const pages = [
    { status: "OK", result: [{ id: 5 }, { id: 4 }, { id: 3 }] },
    { status: "OK", result: [{ id: 3 }, { id: 2 }, { id: 1 }] },
    { status: "OK", result: [{ id: 1 }] },
  ];
  const calls = [];
  const result = await (await import("./codeforces-api.mjs")).fetchAllCodeforcesSubmissions(
    "example_handle",
    {
      pageSize: 3,
      overlap: 1,
      request: async (url) => {
        calls.push(url);
        return pages.shift();
      },
    }
  );
  assert.deepEqual(result.map((item) => item.id), [5, 4, 3, 2, 1]);
  assert.equal(calls.length, 3);
  assert.match(calls[0], /from=1&count=3$/);
  assert.match(calls[1], /from=3&count=3$/);
  assert.match(calls[2], /from=5&count=3$/);
}

{
  await assert.rejects(
    (await import("./codeforces-api.mjs")).fetchAllCodeforcesSubmissions("example_handle", {
      pageSize: 2,
      maxPages: 1,
      request: async () => ({ status: "OK", result: [{ id: 2 }, { id: 1 }] }),
    }),
    /safe pagination limit/
  );
}
