import test from "node:test";
import assert from "node:assert/strict";
import {
  createBookkeysStorage, normalizeShelves, mergeShelves, mergeSettings, normalizeBookProgress
} from "../src/lib/bookkeys/storage.mjs";

function memoryStorage(seed = {}) {
  const values = new Map(Object.entries(seed));
  return {
    getItem: key => values.has(key) ? values.get(key) : null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: key => values.delete(key),
    values
  };
}

test("local storage adapter preserves guarded read/write/delete behaviour", () => {
  const storage = memoryStorage({ "bookkeys:settings": '{"size":18}' });
  let warnings = 0;
  const adapter = createBookkeysStorage(storage, () => warnings++);
  assert.equal(adapter.load("bookkeys:settings"), '{"size":18}');
  assert.equal(adapter.store("bookkeys:settings", '{"size":20}'), true);
  assert.equal(adapter.load("bookkeys:settings"), '{"size":20}');
  assert.equal(adapter.remove("bookkeys:settings"), true);
  assert.equal(adapter.load("bookkeys:settings"), null);

  const unavailable = createBookkeysStorage(null, () => warnings++);
  assert.equal(unavailable.load("bookkeys:settings"), null);
  assert.equal(unavailable.store("bookkeys:settings", "{}"), false);
  assert.equal(unavailable.remove("bookkeys:settings"), false);
  assert.equal(warnings, 1);
});

test("shelf normalization always restores the built-in Library shelf", () => {
  assert.deepEqual(normalizeShelves([]), [{ id: "main", name: "Library" }]);
  assert.deepEqual(normalizeShelves([{ id: "custom", name: "Reading" }]), [
    { id: "main", name: "Library" }, { id: "custom", name: "Reading" }
  ]);
  assert.deepEqual(normalizeShelves([{ id: "main", name: "Library renamed" }]), [
    { id: "main", name: "Library renamed" }
  ]);
});

test("backup shelf merge validates entries, preserves existing names and truncates new names", () => {
  const current = [{ id: "main", name: "Library" }, { id: "s1", name: "Keep local name" }];
  const imported = [
    { id: "s1", name: "Do not overwrite" },
    { id: "s2", name: "x".repeat(80) },
    { id: 4, name: "Invalid ID" },
    null
  ];
  const result = mergeShelves(current, JSON.stringify(imported));
  assert.equal(result.changed, true);
  assert.equal(result.added, 1);
  assert.equal(result.shelves[1].name, "Keep local name");
  assert.equal(result.shelves[2].name.length, 60);
  assert.equal(mergeShelves(current, "{bad").changed, false);
});

test("backup settings merge rejects wrong types and non-finite numbers", () => {
  const defaults = { size: 18, centered: true, skin: "paper" };
  const current = { ...defaults };
  const result = mergeSettings(defaults, current, JSON.stringify({
    size: 24, centered: "yes", skin: "sepia", unknown: 1, extra: true
  }));
  assert.equal(result.changed, 2);
  assert.deepEqual(result.settings, { size: 24, centered: true, skin: "sepia" });
  assert.equal(mergeSettings(defaults, current, '{"size":null}').changed, 0);
  assert.equal(mergeSettings(defaults, current, '{"size":1e999}').changed, 0);
});

test("per-book progress arrays are numeric, unique and sorted", () => {
  assert.deepEqual(normalizeBookProgress({
    p: [4, 2, 4, "3", NaN, Infinity, 1],
    e: [8, 8, 0], c: null, x: [-1, 2, -1], done: "3"
  }), {
    p: [1, 2, 4], e: [0, 8], c: [], x: [-1, 2], done: 3
  });
});
