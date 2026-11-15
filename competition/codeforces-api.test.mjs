import assert from "node:assert/strict";
import { createCodeforcesApiRequester, fetchCodeforcesSubmissionsSince, fetchAllCodeforcesSubmissions } from "./codeforces-api.mjs";

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
    { status: "OK", result: [{ id: 5, creationTimeSeconds: 500 }, { id: 4, creationTimeSeconds: 400 }, { id: 3, creationTimeSeconds: 300 }] },
    { status: "OK", result: [{ id: 3, creationTimeSeconds: 300 }, { id: 2, creationTimeSeconds: 200 }, { id: 1, creationTimeSeconds: 100 }] },
    { status: "OK", result: [{ id: 1, creationTimeSeconds: 100 }] },
    // Final one-record probe verifies that the newest ID did not move mid-scan.
    { status: "OK", result: [{ id: 5, creationTimeSeconds: 500 }] },
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
  assert.equal(calls.length, 4);
  assert.match(calls[0], /from=1&count=3$/);
  assert.match(calls[1], /from=3&count=3$/);
  assert.match(calls[2], /from=5&count=3$/);
  assert.match(calls[3], /from=1&count=1$/,
    "complete-history pagination rechecks the newest ID before returning");
}

{
  await assert.rejects(
    (await import("./codeforces-api.mjs")).fetchAllCodeforcesSubmissions("example_handle", {
      pageSize: 2,
      maxPages: 1,
      request: async () => ({ status: "OK", result: [{ id: 2, creationTimeSeconds: 200 }, { id: 1, creationTimeSeconds: 100 }] }),
    }),
    /safe pagination limit/
  );
}


// A full page entirely older than the incremental boundary safely ends the scan.
{
  const pages = [
    { status: "OK", result: [
      { id: 12, creationTimeSeconds: 300 },
      { id: 11, creationTimeSeconds: 200 },
    ] },
    { status: "OK", result: [
      { id: 10, creationTimeSeconds: 99 },
      { id: 9, creationTimeSeconds: 98 },
    ] },
  ];
  let calls = 0;
  const result = await fetchCodeforcesSubmissionsSince("example_handle", 100, {
    pageSize: 2,
    overlap: 1,
    request: async () => { calls += 1; return pages.shift(); },
  });
  assert.deepEqual(result.map((item) => item.id), [12, 11]);
  assert.equal(calls, 2, "a full page strictly older than the boundary ends incremental pagination");
}

// If new submissions shift offsets during a full-history scan, reject the
// scan instead of silently establishing an incomplete historical baseline.
{
  const pages = [
    { status: "OK", result: [
      { id: 30, creationTimeSeconds: 300 },
      { id: 29, creationTimeSeconds: 290 },
      { id: 28, creationTimeSeconds: 280 },
    ] },
    { status: "OK", result: [
      { id: 27, creationTimeSeconds: 270 },
      { id: 26, creationTimeSeconds: 260 },
      { id: 25, creationTimeSeconds: 250 },
    ] },
    // A new submission appeared while pagination was in progress.
    { status: "OK", result: [{ id: 31, creationTimeSeconds: 310 }] },
  ];
  let calls = 0;
  await assert.rejects(
    fetchAllCodeforcesSubmissions("moving_handle", {
      pageSize: 3,
      overlap: 1,
      request: async () => { calls += 1; return pages.shift(); },
    }),
    /history changed during pagination/,
    "a moving history must not be returned as a complete baseline"
  );
  assert.equal(calls, 3);
}

// API pages must preserve descending submission-ID order.
await assert.rejects(
  fetchAllCodeforcesSubmissions("reordered_handle", {
    pageSize: 3,
    request: async () => ({ status: "OK", result: [
      { id: 10, creationTimeSeconds: 100 },
      { id: 12, creationTimeSeconds: 120 },
      { id: 9, creationTimeSeconds: 90 },
    ] }),
  }),
  /out of descending ID order/
);

// Malformed records must fail closed in both full and incremental history fetches.
for (const malformed of [
  { id: 0, creationTimeSeconds: 200 },
  { id: 2.5, creationTimeSeconds: 200 },
  { id: 2, creationTimeSeconds: Number.NaN },
  null,
]) {
  await assert.rejects(
    fetchAllCodeforcesSubmissions("example_handle", {
      pageSize: 2,
      request: async () => ({ status: "OK", result: [malformed, { id: 1, creationTimeSeconds: 100 }] }),
    }),
    /malformed submission record/,
    "full-history fetch must reject malformed records rather than return partial history"
  );
  await assert.rejects(
    fetchCodeforcesSubmissionsSince("example_handle", 100, {
      pageSize: 2,
      request: async () => ({ status: "OK", result: [malformed, { id: 1, creationTimeSeconds: 100 }] }),
    }),
    /malformed submission record/,
    "incremental fetch must reject malformed records rather than silently skip them"
  );
}

// An empty page is a valid terminal page for either pagination mode.
{
  let calls = 0;
  const empty = await fetchAllCodeforcesSubmissions("example_handle", {
    request: async () => { calls += 1; return { status: "OK", result: [] }; },
  });
  assert.deepEqual(empty, []);
  assert.equal(calls, 2, "even an empty baseline is checked for submissions arriving during the scan");
}
