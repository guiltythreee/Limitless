#!/usr/bin/env node
// P5.1 regression test for the real MT201 progress module.
// Run with Node's type stripping and scripts/ts-resolve-hook.mjs.

import assert from "node:assert/strict";
import { MT201_ENTRY } from "../app/courses/entries/mt201.ts";
import {
  loadProgress,
  recordAnswer,
  recordExamAnswers,
  resetProgress,
} from "../app/mt201/progress.ts";

const KEY = MT201_ENTRY.manifest.storageKey;
const THEME = "mm-theme-v1";
let checks = 0;
const ok = (condition, message) => { assert.ok(condition, message); checks++; };
const eq = (actual, expected, message) => { assert.deepEqual(actual, expected, message); checks++; };

class MemoryStorage {
  constructor(seed = {}) {
    this.map = new Map(Object.entries(seed));
    this.writes = [];
    this.removes = [];
  }
  getItem(key) { return this.map.has(key) ? this.map.get(key) : null; }
  setItem(key, value) { this.writes.push(key); this.map.set(key, String(value)); }
  removeItem(key) { this.removes.push(key); this.map.delete(key); }
}
const install = (storage) => { globalThis.window = { localStorage: storage }; return storage; };
const legacy = {
  answered: {
    "ch01-q1": { choice: "A", correct: true, at: 1700000000000 },
    "ch01-q2": { choice: "B", correct: false, at: 0 },
  },
  examBest: { score: 8, total: 10, at: 1700000001000 },
};

{
  const s = install(new MemoryStorage({
    [KEY]: JSON.stringify(legacy),
    [THEME]: "light",
  }));
  const before = s.getItem(KEY);
  const p = loadProgress();
  eq(s.writes.length, 0, "loading legacy progress must not write");
  eq(s.getItem(KEY), before, "loading must not backfill the payload");
  eq(p.answered, legacy.answered, "legacy answers are preserved");
  eq(p.examBest, legacy.examBest, "legacy exam best is preserved");
  ok(!("activities" in p), "load does not materialize activities");

  const n = recordAnswer(p, "ch02-q1", "C", true);
  eq(s.writes.length, 1, "a practice answer causes exactly one write");
  eq(s.writes[0], KEY, "practice answer writes only MT201 storage");
  eq(n.answered["ch02-q1"].choice, "C", "answer is returned in progress");
  eq(n.activities.length, 3, "legacy attempts and the new attempt are retained");
  eq(n.activities.filter((a) => a.source === "legacy").length, 2, "legacy attempts are labelled");
  const recorded = n.activities.find((a) => a.q === "ch02-q1");
  eq(recorded.topicId, "ch02", "topic is derived with the MT201-owned mapping");
  eq(recorded.picked, "C", "picked label is retained");
  eq(recorded.mode, "practice", "practice mode is recorded");
  eq(JSON.parse(s.getItem(KEY)).activities.length, 3, "activity history persists");
  eq(s.getItem(THEME), "light", "answer does not change the shared theme");
}

{
  const s = install(new MemoryStorage({
    [KEY]: JSON.stringify(legacy),
    [THEME]: "light",
  }));
  const p = loadProgress();
  const best = { score: 2, total: 3, at: 424242 };
  const result = recordExamAnswers(p, [
    { key: "ch01-q1", topicId: "ch01", choice: "A", correct: true },
    { key: "ch03-q4", topicId: "ch03", choice: "D", correct: true },
    { key: "ch03-q5", topicId: "ch03", choice: "", correct: false },
  ], best, {
    runId: "mt201-atomic-assessment",
    ts: 424243,
    total: 2,
    answered: 2,
    correct: 2,
  });
  eq(s.writes.length, 1, "an exam batch is one write");
  eq(result.rewardLedger.length, 2, "assessment and first-pass reward share the exam batch write");
  eq(result.examBest, best, "exam best is returned with the batch");
  eq(result.activities.filter((a) => a.mode === "exam").length, 2, "only submitted exam answers are logged");
  ok(!result.activities.some((a) => a.q === "ch03-q5"), "blank question has no activity");
  ok(!("ch03-q5" in result.answered), "blank question has no answered entry");
  const stored = JSON.parse(s.getItem(KEY));
  eq(stored.examBest, best, "exam best persists in the same write");
  eq(loadProgress().examBest, best, "exam best survives reload");
  eq(loadProgress().answered["ch03-q4"].choice, "D", "exam answer survives reload");
}

{
  const s = install(new MemoryStorage({
    [KEY]: JSON.stringify({ answered: {}, examBest: { score: 3, total: 5, at: 1 } }),
  }));
  const p = loadProgress();
  const before = s.writes.length;
  const unchanged = p.examBest;
  const r = recordExamAnswers(p, [
    { key: "ch01-q1", topicId: "ch01", choice: "", correct: false },
  ], unchanged);
  eq(s.writes.length - before, 0, "blank-only exam with unchanged best is a no-op");
  eq(r, p, "no-op returns the original progress object");
}

{
  const s = install(new MemoryStorage({ [THEME]: "light" }));
  const p = loadProgress();
  recordAnswer(p, "ch01-q1", "A", true);
  resetProgress();
  const reset = JSON.parse(s.getItem(KEY));
  eq(reset.answered, {}, "reset clears MT201 local answers");
  eq(reset.examBest, null, "reset clears MT201 local exam best");
  eq(reset.activities, [], "reset clears MT201 local activity history");
  eq(reset.rewardLedger.length, 1, "reset preserves lifetime MT201 Meta rewards");
  const afterResetRetry = recordAnswer(reset, "ch01-q1", "A", true);
  eq(afterResetRetry.rewardLedger.length, 1, "reset cannot reopen a previously paid MT201 question");
  eq(s.getItem(THEME), "light", "reset leaves the theme key intact");
}

eq(KEY, "mm-mt201-v1", "MT201 storage key remains stable");
eq(MT201_ENTRY.manifest.capabilities.attemptHistory, true, "attempt-history UI is enabled with the history screen");
console.log(`test-mt201-attempts: ${checks} assertions passed`);
