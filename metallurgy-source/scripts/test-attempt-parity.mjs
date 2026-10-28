#!/usr/bin/env node
// Cross-course parity gate for P5.1 persistence adapters.
// Tests both real course modules against the same instrumented localStorage.

import assert from "node:assert/strict";
import { MT201_ENTRY } from "../app/courses/entries/mt201.ts";
import { MT202_ENTRY } from "../app/courses/entries/mt202.ts";
import {
  loadProgress as load201,
  recordAnswer as answer201,
  recordExamAnswers as exam201,
} from "../app/mt201/progress.ts";
import {
  loadProgress as load202,
  recordAnswer as answer202,
  recordExamAnswers as exam202,
} from "../app/lib/progress.ts";
import { activityKey, summarise } from "../app/platform/learning/index.ts";

const K201 = MT201_ENTRY.manifest.storageKey;
const K202 = MT202_ENTRY.manifest.storageKey;
const THEME = "mm-theme-v1";
let checks = 0;
const ok = (condition, message) => { assert.ok(condition, message); checks++; };
const eq = (actual, expected, message) => { assert.deepEqual(actual, expected, message); checks++; };

class MemoryStorage {
  constructor(seed = {}) {
    this.map = new Map(Object.entries(seed));
    this.writes = [];
  }
  getItem(key) { return this.map.has(key) ? this.map.get(key) : null; }
  setItem(key, value) { this.writes.push(key); this.map.set(key, String(value)); }
  removeItem(key) { this.map.delete(key); }
}
const store = new MemoryStorage({
  [K201]: JSON.stringify({ answered: {}, examBest: null }),
  [K202]: JSON.stringify({ answered: {}, examBest: null }),
  [THEME]: "dark",
});
globalThis.window = { localStorage: store };

{
  let p201 = load201();
  let p202 = load202();
  eq(store.writes.length, 0, "both course loads are write-free");

  const before201 = store.writes.length;
  p201 = answer201(p201, "ch01-q1", "A", true);
  eq(store.writes.length - before201, 1, "MT201 practice answer is one write");
  eq(store.writes.at(-1), K201, "MT201 writes only its own key");

  const before202 = store.writes.length;
  p202 = answer202(p202, "ch01-q1", "A", true, "practice");
  eq(store.writes.length - before202, 1, "MT202 practice answer is one write");
  eq(store.writes.at(-1), K202, "MT202 writes only its own key");

  eq(p201.activities.length, 1, "MT201 has one activity");
  eq(p202.activities.length, 1, "MT202 has one activity");
  eq(p201.activities[0].courseId, "mt201", "MT201 activity identifies its course");
  eq(p202.activities[0].courseId, "mt202", "MT202 activity identifies its course");
  eq(p201.activities[0].q, p202.activities[0].q, "matching IDs can be compared without losing course identity");
  ok(activityKey(p201.activities[0]) !== activityKey(p202.activities[0]), "activity keys remain course-isolated");

  const best201 = { score: 1, total: 1, at: 101 };
  const best202 = { score: 0, total: 1, at: 202 };
  const beforeExam201 = store.writes.length;
  p201 = exam201(p201, [
    { key: "ch02-q1", topicId: "ch02", choice: "B", correct: false },
    { key: "ch02-q2", topicId: "ch02", choice: "", correct: false },
  ], best201);
  eq(store.writes.length - beforeExam201, 1, "MT201 exam batch is one write");

  const beforeExam202 = store.writes.length;
  p202 = exam202(p202, [
    { key: "ch02-q1", topicId: "ch02", choice: "B", correct: false },
    { key: "ch02-q2", topicId: "ch02", choice: "", correct: false },
  ], best202);
  eq(store.writes.length - beforeExam202, 1, "MT202 exam batch is one write");

  eq(p201.examBest, best201, "MT201 best is part of the returned batch");
  eq(p202.examBest, best202, "MT202 best is part of the returned batch");
  eq(p201.activities.filter((a) => a.mode === "exam").length, 1, "MT201 skips blank exam questions");
  eq(p202.activities.filter((a) => a.mode === "exam").length, 1, "MT202 skips blank exam questions");
  eq(p201.activities.at(-1).mode, p202.activities.at(-1).mode, "exam mode label is consistent");
  eq(p201.activities.at(-1).topicId, p202.activities.at(-1).topicId, "topic snapshot shape is consistent");

  const stored201 = JSON.parse(store.getItem(K201));
  const stored202 = JSON.parse(store.getItem(K202));
  eq(stored201.examBest, best201, "MT201 best persists");
  eq(stored202.examBest, best202, "MT202 best persists");
  eq(stored201.activities.length, 2, "MT201 stored history includes practice + exam");
  eq(stored202.activities.length, 2, "MT202 stored history includes practice + exam");
  eq(store.getItem(THEME), "dark", "neither adapter touches the shared theme");

  eq(summarise(p201.activities).attempts, summarise(p202.activities).attempts, "shared summaries behave equally");
  eq(summarise(p201.activities).questions, summarise(p202.activities).questions, "shared unique-question counting behaves equally");
}

eq(K201, "mm-mt201-v1", "MT201 storage key is unchanged");
eq(K202, "mm-mt202-v1", "MT202 storage key is unchanged");
ok(K201 !== K202, "course storage keys are isolated");
console.log(`test-attempt-parity: ${checks} assertions passed`);
