#!/usr/bin/env node
// P5.5 daily goal persistence checks for the MT201/MT202 shared stores.

import assert from "node:assert/strict";
import { MT201_MANIFEST } from "../app/courses/manifests/mt201.ts";
import { MT202_MANIFEST } from "../app/courses/manifests/mt202.ts";
import { dayKey } from "../app/platform/learning/index.ts";
import {
  loadProgress as load201,
  recordAnswer as answer201,
  setDailyGoal as setGoal201,
} from "../app/mt201/progress.ts";
import {
  loadProgress as load202,
  recordAnswer as answer202,
  setDailyGoal as setGoal202,
} from "../app/lib/progress.ts";

let checks = 0;
const ok = (condition, message) => { assert.ok(condition, message); checks++; };
const eq = (actual, expected, message) => { assert.deepEqual(actual, expected, message); checks++; };

class MemoryStorage {
  constructor(seed = {}) { this.map = new Map(Object.entries(seed)); this.writes = []; }
  getItem(key) { return this.map.has(key) ? this.map.get(key) : null; }
  setItem(key, value) { this.writes.push(key); this.map.set(key, String(value)); }
  removeItem(key) { this.map.delete(key); }
}

const k201 = MT201_MANIFEST.storageKey;
const k202 = MT202_MANIFEST.storageKey;
const store = new MemoryStorage({
  [k201]: JSON.stringify({ answered: {}, examBest: null }),
  [k202]: JSON.stringify({ answered: {}, examBest: null }),
});
globalThis.window = { localStorage: store };
const today = dayKey(Date.now());

for (const manifest of [MT201_MANIFEST, MT202_MANIFEST]) {
  ok(manifest.capabilities.goals, `${manifest.id} exposes the daily goal panel`);
  ok(manifest.capabilities.streaks, `${manifest.id} exposes streak tracking`);
}

{
  const before = store.getItem(k201);
  const p = load201();
  eq(p.goal, 10, "MT201 legacy payload gets the default goal in memory");
  eq(p.goalByDay, {}, "MT201 legacy payload gets an empty goal history in memory");
  eq(store.writes.length, 0, "MT201 load does not migrate or backfill goal fields");
  eq(store.getItem(k201), before, "MT201 legacy JSON remains untouched on load");

  const goal = setGoal201(p, 6);
  eq(store.writes.length, 1, "changing MT201 goal performs one write");
  eq(goal.goal, 6, "MT201 accepts a valid daily target");
  eq(goal.goalByDay[today], 6, "MT201 records the goal for the current date");
  eq(store.writes.at(-1), k201, "MT201 goal writes only the MT201 key");

  const answered = answer201(goal, "ch01-q1", "A", true, 1250);
  eq(store.writes.length, 2, "answer plus activity is one additional write");
  eq(answered.goalByDay[today], 6, "answer preserves today's goal snapshot");
  eq(store.writes.at(-1), k201, "MT201 answer remains course-isolated");
  const stored = JSON.parse(store.getItem(k201));
  eq(stored.activities.at(-1).ms, 1250, "answer retains timer data alongside the goal");
  eq(stored.goal, 6, "daily goal persists beside attempts");
  eq(stored.goalByDay[today], 6, "goal history persists beside attempts");
  eq(load201().goal, 6, "daily goal survives reload");
}

{
  const before = store.getItem(k202);
  const p = load202();
  eq(p.goal, 10, "MT202 legacy payload gets the default goal in memory");
  eq(store.writes.length, 2, "MT202 load adds no writes");
  eq(store.getItem(k202), before, "MT202 legacy JSON remains untouched on load");

  const goal = setGoal202(p, 12);
  eq(store.writes.length, 3, "changing MT202 goal performs one write");
  eq(goal.goal, 12, "MT202 accepts a valid daily target");
  eq(goal.goalByDay[today], 12, "MT202 records the goal for the current date");
  eq(store.writes.at(-1), k202, "MT202 goal writes only the MT202 key");

  const answered = answer202(goal, "ch02-q3", "B", false, "practice", 2220);
  eq(store.writes.length, 4, "MT202 answer plus activity is one additional write");
  eq(answered.goalByDay[today], 12, "MT202 answer preserves today's goal snapshot");
  eq(store.writes.at(-1), k202, "MT202 answer remains course-isolated");
  const stored = JSON.parse(store.getItem(k202));
  eq(stored.activities.at(-1).ms, 2220, "MT202 timer data persists with the goal");
  eq(stored.goal, 12, "MT202 daily goal persists beside attempts");
  eq(stored.goalByDay[today], 12, "MT202 goal history persists beside attempts");
  eq(load202().goal, 12, "MT202 daily goal survives reload");

  const capped = setGoal202(load202(), 999);
  eq(capped.goal, 200, "MT202 daily goal is clamped to the supported maximum");
  eq(capped.goalByDay[today], 200, "changing the target updates today's goal snapshot");
}

eq(new Set([k201, k202]).size, 2, "goal data remains isolated by course storage keys");
console.log(`test-daily-goals: ${checks} assertions passed`);
