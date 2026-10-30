#!/usr/bin/env node
// P5.2 bookmarks persistence gate for all three real course progress stores.
// No browser is required; a key-instrumented localStorage substitute is used.

import assert from "node:assert/strict";
import { MT201_MANIFEST } from "../app/courses/manifests/mt201.ts";
import { MT202_MANIFEST } from "../app/courses/manifests/mt202.ts";
import { MT203_MANIFEST } from "../app/courses/manifests/mt203.ts";
import {
  loadProgress as load201,
  toggleBookmark as toggle201,
} from "../app/mt201/progress.ts";
import {
  loadProgress as load202,
  toggleBookmark as toggle202,
} from "../app/lib/progress.ts";
import {
  loadProgress as load203,
  toggleBookmark as toggle203,
} from "../app/lib/mt203-progress.ts";

let checks = 0;
const ok = (condition, message) => { assert.ok(condition, message); checks++; };
const eq = (actual, expected, message) => { assert.deepEqual(actual, expected, message); checks++; };

class MemoryStorage {
  constructor(seed = {}) {
    this.map = new Map(Object.entries(seed));
    this.writes = [];
  }
  getItem(key) { return this.map.has(key) ? this.map.get(key) : null; }
  setItem(key, value) {
    this.writes.push(key);
    this.map.set(key, String(value));
  }
  removeItem(key) { this.map.delete(key); }
}

const keys = {
  mt201: MT201_MANIFEST.storageKey,
  mt202: MT202_MANIFEST.storageKey,
  mt203: MT203_MANIFEST.storageKey,
};
const themeKey = "mm-theme-v1";
const s = new MemoryStorage({
  [keys.mt201]: JSON.stringify({ answered: {}, examBest: null, activities: [], bookmarks: ["ch01-q1", "ch01-q1", 42, ""] }),
  [keys.mt202]: JSON.stringify({ answered: {}, examBest: null, activities: [], bookmarks: ["ch02-q3"] }),
  [keys.mt203]: JSON.stringify({ attempts: [], theoryRead: [], exams: [], best: null, awarded: {}, days: {}, goal: 10, bookmarks: ["t1-01", "t1-01", null] }),
  [themeKey]: "light",
});
globalThis.window = { localStorage: s };

for (const manifest of [MT201_MANIFEST, MT202_MANIFEST, MT203_MANIFEST]) {
  ok(manifest.capabilities.bookmarks, `${manifest.id} enables bookmarks only with its UI and store`);
  eq(keys[manifest.id], manifest.storageKey, `${manifest.id} retains its established storage key`);
}

{
  const p = load201();
  eq(p.bookmarks, ["ch01-q1"], "MT201 sanitises and deduplicates old bookmark data");
  eq(s.writes.length, 0, "loading MT201 does not rewrite old progress");
  const added = toggle201(p, "ch02-q8");
  eq(added.bookmarks, ["ch01-q1", "ch02-q8"], "MT201 adds a bookmark");
  eq(s.writes.at(-1), keys.mt201, "MT201 writes only its own key");
  const removed = toggle201(added, "ch01-q1");
  eq(removed.bookmarks, ["ch02-q8"], "MT201 removes a bookmark");
  eq(load201().bookmarks, ["ch02-q8"], "MT201 bookmark survives reload");
}

{
  const p = load202();
  eq(p.bookmarks, ["ch02-q3"], "MT202 loads its bookmarks");
  const added = toggle202(p, "ch05-q4");
  eq(added.bookmarks, ["ch02-q3", "ch05-q4"], "MT202 adds a bookmark");
  eq(s.writes.at(-1), keys.mt202, "MT202 writes only its own key");
  const removed = toggle202(added, "ch02-q3");
  eq(removed.bookmarks, ["ch05-q4"], "MT202 removes a bookmark");
  eq(load202().bookmarks, ["ch05-q4"], "MT202 bookmark survives reload");
}

{
  const p = load203();
  eq(p.bookmarks, ["t1-01"], "MT203 sanitises and deduplicates old bookmark data");
  const added = toggle203(p, "t2-014");
  eq(added.bookmarks, ["t1-01", "t2-014"], "MT203 adds a bookmark");
  eq(s.writes.at(-1), keys.mt203, "MT203 writes only its own key");
  const removed = toggle203(added, "t1-01");
  eq(removed.bookmarks, ["t2-014"], "MT203 removes a bookmark");
  eq(load203().bookmarks, ["t2-014"], "MT203 bookmark survives reload");
}

eq(s.getItem(themeKey), "light", "bookmark changes never modify the shared theme");
eq(JSON.parse(s.getItem(keys.mt201)).answered, {}, "MT201 answers are preserved");
eq(JSON.parse(s.getItem(keys.mt202)).examBest, null, "MT202 exam-best field is preserved");
eq(JSON.parse(s.getItem(keys.mt203)).goal, 10, "MT203 goal is preserved");
ok(new Set([keys.mt201, keys.mt202, keys.mt203]).size === 3, "every course keeps a separate storage key");
console.log(`test-bookmarks: ${checks} assertions passed`);
