#!/usr/bin/env node
// P5.3 per-question timing persistence gate across all Metallurgy courses.

import assert from "node:assert/strict";
import { MT201_MANIFEST } from "../app/courses/manifests/mt201.ts";
import { MT202_MANIFEST } from "../app/courses/manifests/mt202.ts";
import { MT203_MANIFEST } from "../app/courses/manifests/mt203.ts";
import {
  loadProgress as load201,
  recordAnswer as answer201,
} from "../app/mt201/progress.ts";
import {
  loadProgress as load202,
  recordAnswer as answer202,
} from "../app/lib/progress.ts";
import {
  loadProgress as load203,
  recordAnswer as answer203,
} from "../app/lib/mt203-progress.ts";

let checks = 0;
const ok = (condition, message) => { assert.ok(condition, message); checks++; };
const eq = (actual, expected, message) => { assert.deepEqual(actual, expected, message); checks++; };

class MemoryStorage {
  constructor(seed = {}) { this.map = new Map(Object.entries(seed)); this.writes = []; }
  getItem(key) { return this.map.has(key) ? this.map.get(key) : null; }
  setItem(key, value) { this.writes.push(key); this.map.set(key, String(value)); }
  removeItem(key) { this.map.delete(key); }
}

const keys = {
  mt201: MT201_MANIFEST.storageKey,
  mt202: MT202_MANIFEST.storageKey,
  mt203: MT203_MANIFEST.storageKey,
};
const s = new MemoryStorage({
  [keys.mt201]: JSON.stringify({ answered: {}, examBest: null }),
  [keys.mt202]: JSON.stringify({ answered: {}, examBest: null }),
  [keys.mt203]: JSON.stringify({ attempts: [], theoryRead: [], exams: [], best: null, awarded: {}, days: {}, goal: 10 }),
});
globalThis.window = { localStorage: s };

for (const manifest of [MT201_MANIFEST, MT202_MANIFEST, MT203_MANIFEST]) {
  ok(manifest.capabilities.timers, `${manifest.id} only advertises a timer with per-question timing`);
}

{
  const p = answer201(load201(), "ch01-q1", "A", true, 1234);
  eq(p.activities?.at(-1)?.ms, 1234, "MT201 activity stores measured milliseconds");
  eq(JSON.parse(s.getItem(keys.mt201)).activities.at(-1).ms, 1234, "MT201 time persists on the course key");
  eq(s.writes.at(-1), keys.mt201, "MT201 timing writes only its own progress key");
}

{
  const p = answer202(load202(), "ch02-q3", "B", false, "practice", 2345);
  eq(p.activities?.at(-1)?.ms, 2345, "MT202 activity stores measured milliseconds");
  eq(JSON.parse(s.getItem(keys.mt202)).activities.at(-1).ms, 2345, "MT202 time persists on the course key");
  eq(s.writes.at(-1), keys.mt202, "MT202 timing writes only its own progress key");
}

{
  const p = answer203(load203(), "t1-01", "C", false, "learn", 3456);
  eq(p.attempts.at(-1)?.ms, 3456, "MT203 attempt stores measured milliseconds");
  eq(JSON.parse(s.getItem(keys.mt203)).attempts.at(-1).ms, 3456, "MT203 time persists on the course key");
  eq(s.writes.at(-1), keys.mt203, "MT203 timing writes only its own progress key");
}

eq(s.getItem("mm-theme-v1"), null, "timing does not create or mutate the shared theme key");
eq(new Set(Object.values(keys)).size, 3, "every course keeps a separate storage key");
console.log(`test-question-timers: ${checks} assertions passed`);
