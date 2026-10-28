#!/usr/bin/env node
// scripts/test-learning-core.mjs
//
// PHASE 5.0 read-only test for the shared learning core.
//
// Proves the contract without touching any course file or browser storage:
//   - local-calendar period boundaries
//   - sanitising malformed/foreign activities without inventing ms or ts
//   - append idempotence, batching, cap and input immutability
//   - legacy derivation from an answered map
//   - MT203-shaped attempt adapters
//   - period/mode/scope selectors and latest-by-question tie-breaks
//   - summary arithmetic
//   - createActivityLog never writes on load, merges the root, and persists
//     legacy + new exactly once
//
// Run:
//   node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON \
//     --import ./scripts/ts-resolve-hook.mjs scripts/test-learning-core.mjs

import assert from "node:assert/strict";

import {
  ATTEMPT_MODES,
  MAX_ACTIVITIES,
  PERIODS,
  activityKey,
  appendActivities,
  createActivityLog,
  dayKey,
  deriveLegacyActivities,
  inScope,
  indexQuestionMeta,
  latestByQuestion,
  metaOfQuestion,
  periodStart,
  questionKey,
  sanitiseActivities,
  selectActivities,
  startOfDay,
  summarise,
  toActivities,
} from "../app/platform/learning/index.ts";

let checks = 0;
const check = (cond, msg) => {
  assert.ok(cond, msg);
  checks++;
};
const eq = (actual, expected, msg) => {
  assert.deepEqual(actual, expected, msg);
  checks++;
};

const A = (over = {}) => ({
  courseId: "mt201",
  q: "ch01-q1",
  topicId: "ch01",
  picked: "A",
  correct: true,
  mode: "practice",
  ms: 0,
  ts: 1000,
  source: "recorded",
  ...over,
});

// --------------------------------------------------------------- constants

eq([...ATTEMPT_MODES], ["learn", "practice", "exam", "revision"], "attempt modes");
eq(MAX_ACTIVITIES, 4000, "activity cap");
eq(
  PERIODS.map((p) => p.id),
  ["today", "week", "month", "3m", "all"],
  "period ids"
);

// ------------------------------------------------------------------- time

const now = new Date(2026, 0, 15, 12, 0, 0).getTime(); // Thursday 15 Jan 2026
eq(dayKey(now), "2026-01-15", "dayKey is local calendar date");
eq(startOfDay(now), new Date(2026, 0, 15).getTime(), "startOfDay is local midnight");
eq(periodStart("today", now), new Date(2026, 0, 15).getTime(), "today");
eq(periodStart("week", now), new Date(2026, 0, 12).getTime(), "week starts Monday");
eq(periodStart("month", now), new Date(2026, 0, 1).getTime(), "month starts on the 1st");
eq(periodStart("3m", now), new Date(2025, 9, 18).getTime(), "3m is 89 calendar days");
eq(periodStart("all", now), 0, "all has no lower bound");
eq(dayKey(Number.NaN), "", "invalid date key is empty");

// --------------------------------------------------------------- sanitise

const raw = [
  A(),
  A({ courseId: "mt202" }),
  A({ q: "" }),
  A({ ms: -5 }),
  A({ ts: 0 }),
  A({ ts: Number.NaN }),
  A({ source: "legacy" }),
];

const clean = sanitiseActivities(raw, "mt201", 10);
eq(clean.length, 4, "sanitise drops foreign, empty and non-finite-ts entries");
eq(clean[1].ms, 0, "negative ms clamps to 0");
check(clean.some((a) => a.ts === 0), "ts 0 is preserved as unknown date");
check(clean.some((a) => a.source === "legacy"), "legacy source is preserved");
eq(raw.length, 7, "sanitise does not mutate the input array");
eq(raw[3].ms, -5, "sanitise does not mutate input entries");
eq(sanitiseActivities(raw, "mt201", 2).length, 2, "sanitise honours cap");
eq(
  sanitiseActivities(raw, "mt201", 0).length,
  0,
  "zero cap returns an empty history"
);
eq(sanitiseActivities(null, "mt201").length, 0, "non-array storage is empty");

// ----------------------------------------------------------------- append

const existing = [A({ q: "ch01-q1", ts: 1000 })];
const incoming = [
  { q: "ch01-q2", topicId: "ch01", picked: "B", correct: false },
  { q: "ch01-q2", topicId: "ch01", picked: "B", correct: false },
  { q: "ch01-q2", topicId: "ch01", picked: "C", correct: false, ts: 2000 },
  { q: "", topicId: "ch01", picked: "A", correct: true },
];

const appended = appendActivities(existing, incoming, {
  courseId: "mt201",
  now: 5000,
  cap: 10,
});
eq(appended.length, 3, "append dedupes identical entries and drops invalid ones");
eq(appended[1].ts, 5000, "batch entries share the supplied now");
eq(appended[2].ts, 2000, "explicit ts is respected");
eq(appended[1].mode, "practice", "missing mode defaults to practice");
eq(appended[1].ms, 0, "missing ms defaults to 0");
eq(appended[1].source, "recorded", "appended entries are recorded");
eq(existing.length, 1, "append does not mutate existing");
eq("ts" in incoming[0], false, "append does not mutate incoming");

const capped = appendActivities(existing, incoming, {
  courseId: "mt201",
  now: 5000,
  cap: 2,
});
eq(capped.length, 2, "append honours cap");
eq(capped[1].ts, 2000, "append cap keeps the newest entries");

// ----------------------------------------------------------- legacy derive

const legacy = deriveLegacyActivities(
  {
    "ch01-q1": { choice: "A", correct: true, at: 1000 },
    "ch01-q2": { choice: "B", correct: false, at: 0 },
    "ch01-q3": { choice: "D", correct: true },
    bad: { choice: "C", correct: true, at: 2000 },
  },
  {
    courseId: "mt201",
    topicOf: (q) => (q.startsWith("ch01-") ? "ch01" : undefined),
  }
);

eq(legacy.length, 3, "legacy derivation skips unknown question ids");
eq(
  legacy.map((a) => a.q),
  ["ch01-q2", "ch01-q3", "ch01-q1"],
  "legacy entries are ordered by timestamp then question id"
);
eq(legacy[0].ts, 0, "missing legacy timestamp stays 0");
eq(legacy[1].ts, 0, "missing at stays 0");
eq(legacy[2].ts, 1000, "legacy at is preserved");
check(legacy.every((a) => a.ms === 0), "legacy ms is always 0");
check(legacy.every((a) => a.source === "legacy"), "legacy source is marked");
check(legacy.every((a) => a.topicId === "ch01"), "legacy topic is derived");

// --------------------------------------------------------- MT203 adapter

const mapped = toActivities(
  [
    { q: "t4-014", picked: "b", correct: true, mode: "exam", ms: 1234, ts: 5000 },
    { q: "t9-001", picked: "c", correct: false, mode: "learn", ms: 0, ts: 0 },
    { q: "missing-1", picked: "a", correct: true, mode: "practice", ms: 1, ts: 1 },
  ],
  {
    courseId: "mt203",
    topicOf: (q) =>
      q.startsWith("t4-") ? "t4" : q.startsWith("t9-") ? "t9" : undefined,
  }
);

eq(mapped.length, 2, "adapter skips unknown topics");
eq(mapped[0].courseId, "mt203", "adapter binds courseId");
eq(mapped[0].topicId, "t4", "adapter maps topic");
eq(mapped[0].mode, "exam", "adapter preserves mode");
eq(mapped[0].ms, 1234, "adapter preserves ms");
eq(mapped[0].ts, 5000, "adapter preserves ts");
eq(mapped[0].source, "recorded", "adapter defaults to recorded");
eq(mapped[1].ts, 0, "adapter preserves unknown ts");
eq(
  toActivities([{ q: "t4-014", picked: "b", correct: true }], {
    courseId: "mt203",
    topicOf: () => "t4",
    source: "legacy",
  })[0].source,
  "legacy",
  "adapter can mark legacy entries"
);

// ------------------------------------------------------------ meta + scope

const meta = indexQuestionMeta([
  metaOfQuestion({ id: "ch01-q1", topicId: "ch01", difficulty: 1 }, "mt201", "m1"),
  metaOfQuestion({ id: "ch02-q1", topicId: "ch02", difficulty: 2 }, "mt201"),
]);

eq(questionKey("mt201", "ch01-q1"), "mt201|ch01-q1", "questionKey");
eq(activityKey(A()), "mt201|ch01-q1|1000|practice|A|recorded", "activityKey");
eq(meta["mt201|ch01-q1"].unitId, "m1", "meta index includes unit");
eq(meta["mt201|ch02-q1"].unitId, undefined, "meta index leaves unit undefined");

const todayTs = new Date(2026, 0, 15, 9).getTime();
const weekTs = new Date(2026, 0, 13, 9).getTime();
const monthTs = new Date(2026, 0, 2, 9).getTime();
const list = [
  A({ q: "ch01-q1", topicId: "ch01", ts: todayTs, mode: "practice" }),
  A({ q: "ch01-q2", topicId: "ch01", ts: weekTs, mode: "exam" }),
  A({ q: "ch02-q1", topicId: "ch02", ts: monthTs, mode: "exam" }),
  A({ q: "ch01-q3", topicId: "ch01", ts: 0, mode: "revision" }),
];

eq(selectActivities(list, { period: "today" }, meta, now).length, 1, "today");
eq(selectActivities(list, { period: "week" }, meta, now).length, 2, "week");
eq(selectActivities(list, { period: "month" }, meta, now).length, 3, "month");
eq(selectActivities(list, { period: "all" }, meta, now).length, 4, "all includes ts 0");
eq(
  selectActivities(list, { period: "all", mode: "exam" }, meta, now).length,
  2,
  "mode filter"
);
eq(
  selectActivities(list, { scope: { kind: "topic", topicId: "ch01" } }, meta, now)
    .length,
  3,
  "topic scope"
);
eq(
  selectActivities(
    list,
    { scope: { kind: "topics", topicIds: ["ch01", "ch02"] } },
    meta,
    now
  ).length,
  4,
  "topics scope"
);
eq(
  selectActivities(list, { scope: { kind: "unit", unitId: "m1" } }, meta, now)
    .length,
  1,
  "unit scope uses meta"
);
eq(
  selectActivities(
    list,
    { scope: { kind: "unit", unitId: "missing" } },
    meta,
    now
  ).length,
  0,
  "unknown unit scope is empty"
);
check(inScope(list[0], { kind: "all" }, meta), "all scope matches");
check(
  !inScope(list[0], { kind: "unit", unitId: "m2" }, meta),
  "wrong unit does not match"
);

// ---------------------------------------------------------------- latest

const latest = latestByQuestion([
  A({ q: "ch01-q1", ts: 100 }),
  A({ q: "ch01-q1", ts: 200 }),
  A({ q: "ch01-q2", ts: 300 }),
  A({ q: "ch01-q2", ts: 100 }),
  A({ q: "ch01-q3", ts: 5, picked: "A" }),
  A({ q: "ch01-q3", ts: 5, picked: "B" }),
]);
eq(latest["mt201|ch01-q1"].ts, 200, "latest by higher timestamp");
eq(latest["mt201|ch01-q2"].ts, 300, "older later entry does not replace newer");
eq(latest["mt201|ch01-q3"].picked, "B", "equal ts uses later list order");

// --------------------------------------------------------------- summary

const summary = summarise([
  A({ q: "ch01-q1", correct: true, ms: 500 }),
  A({ q: "ch01-q2", correct: false, ms: 0 }),
  A({ q: "ch01-q1", correct: true, ms: 2500 }),
  A({ q: "ch01-q2", correct: false, ms: 0 }),
]);
eq(summary.attempts, 4, "summary attempts");
eq(summary.questions, 2, "summary unique questions");
eq(summary.correct, 2, "summary correct");
eq(summary.incorrect, 2, "summary incorrect");
eq(summary.accuracy, 0.5, "summary accuracy");
eq(summary.timed, 2, "summary timed count");
eq(summary.totalMs, 3000, "summary total ms");
eq(summary.avgMs, 1500, "summary average over timed only");
eq(summarise([]).avgMs, 0, "empty summary average is 0");

// ----------------------------------------------------------- activity log

let root = {
  answered: { "ch01-q1": { choice: "A", correct: true, at: 1000 } },
  examBest: { score: 1, total: 2, at: 2000 },
  awarded: { "q:ch01-q1": 4 },
  days: { "2026-01-01": 3 },
};
let writes = 0;

const log = createActivityLog({
  courseId: "mt201",
  storageKey: "mm-mt201-v1",
  read: () => root,
  write: (next) => {
    writes++;
    root = next;
  },
  getStored: (r) => r.activities,
  setStored: (r, activities) => ({ ...r, activities: [...activities] }),
  deriveLegacy: (r) =>
    deriveLegacyActivities(r.answered, {
      courseId: "mt201",
      topicOf: (q) => (q.startsWith("ch01-") ? "ch01" : undefined),
    }),
  cap: 10,
  now: () => 5000,
});

const loaded = log.load();
eq(writes, 0, "load never writes");
eq(loaded.length, 1, "load derives legacy when activities is absent");
eq(loaded[0].source, "legacy", "derived load entry is legacy");
eq(loaded[0].ms, 0, "derived load entry has unknown ms");
check(!("activities" in root), "load does not add the field to the root");

const firstAppend = log.append({
  q: "ch01-q2",
  topicId: "ch01",
  picked: "B",
  correct: false,
});
eq(writes, 1, "append writes exactly once");
eq(firstAppend.length, 2, "append persists legacy + new");
eq(root.answered["ch01-q1"].choice, "A", "append preserves answered");
eq(root.examBest.score, 1, "append preserves examBest");
eq(root.awarded["q:ch01-q1"], 4, "append preserves awarded");
eq(root.days["2026-01-01"], 3, "append preserves days");
eq(root.activities.length, 2, "append writes the additive field");

const reloaded = log.load();
eq(writes, 1, "reload after append does not write");
eq(reloaded.length, 2, "reload has no duplicate legacy entries");

const duplicate = log.append({
  q: "ch01-q2",
  topicId: "ch01",
  picked: "B",
  correct: false,
});
eq(writes, 2, "second append writes once");
eq(duplicate.length, 2, "identical append is idempotent");

let emptyRoot = {
  answered: { "ch01-q1": { choice: "A", correct: true, at: 1000 } },
  activities: [],
};
let emptyWrites = 0;
const emptyLog = createActivityLog({
  courseId: "mt201",
  storageKey: "mm-mt201-v1",
  read: () => emptyRoot,
  write: (next) => {
    emptyWrites++;
    emptyRoot = next;
  },
  getStored: (r) => r.activities,
  setStored: (r, activities) => ({ ...r, activities: [...activities] }),
  deriveLegacy: (r) =>
    deriveLegacyActivities(r.answered, {
      courseId: "mt201",
      topicOf: () => "ch01",
    }),
});

eq(emptyLog.load().length, 0, "empty activities field suppresses legacy derivation");
eq(emptyWrites, 0, "empty load still does not write");

console.log(`test-learning-core: ${checks} checks passed`);
