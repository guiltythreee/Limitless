import test from "node:test";
import assert from "node:assert/strict";
import {
  BOOKKEYS_REWARD_MODULE_ID,
  BOOKKEYS_REWARD_STORAGE_KEY,
  createBookkeysRewardAdapter,
} from "../bookkeys-rewards.mjs";
import { readGlobalRewardSummary } from "../../../shared/rewards.mjs";

function createStorage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    values,
    writes: 0,
    getItem(key) { return values.has(key) ? values.get(key) : null; },
    setItem(key, value) { this.writes += 1; values.set(key, value); },
  };
}

const day1 = new Date(2026, 9, 29, 12, 0, 0).getTime();
const day2 = new Date(2026, 9, 30, 12, 0, 0).getTime();
const storage = createStorage({
  // Never read or convert this old module-specific XP value.
  "bookkeys:game": JSON.stringify({ xp: 987654, books: 12, chapters: 41, pages: 900 }),
  [BOOKKEYS_REWARD_STORAGE_KEY]: JSON.stringify({ retained: "keep this field", rewardLedger: [] }),
});
const adapter = createBookkeysRewardAdapter(storage, { now: () => day1 });

function page(eventId, overrides = {}) {
  return {
    eventId,
    moduleId: BOOKKEYS_REWARD_MODULE_ID,
    itemId: "bookkeys:page:sample-book:7",
    ts: day1,
    activityClass: "micro-practice",
    difficulty: "foundational",
    completionEvidence: "finished-book-page",
    completed: true,
    quality: 1,
    ...overrides,
  };
}

test("does not create EXP for incomplete or unrecognized Bookkeys events", () => {
  assert.equal(adapter.award(page("incomplete", { completed: false })), null);
  assert.equal(adapter.award(page("pasted", { completionEvidence: "pasted-page" })), null);
  assert.equal(adapter.award(page("wrong-module", { moduleId: "probability" })), null);
  assert.equal(adapter.award(page("wrong-item", { itemId: "bookkeys:book:sample-book" })), null);
  assert.equal(storage.writes, 0);
});

test("a freshly finished real-book page uses shared LSR-1 policy and preserves root fields", () => {
  const record = adapter.award(page("bookkeys:page:sample-book:7:run-1"));
  assert.equal(record.moduleId, "bookkeys");
  assert.equal(record.activityClass, "micro-practice");
  assert.equal(record.difficulty, "foundational");
  assert.equal(record.baseExp, 5);
  assert.equal(record.qualityBonus, 1);
  assert.equal(record.totalExp, 6);
  assert.equal(record.eligible, true);
  assert.equal(storage.writes, 1);
  assert.equal(JSON.parse(storage.getItem(BOOKKEYS_REWARD_STORAGE_KEY)).retained, "keep this field");
});

test("duplicate activity IDs are idempotent and do not write twice", () => {
  const first = adapter.award(page("bookkeys:page:duplicate-test"));
  const before = storage.writes;
  const second = adapter.award(page("bookkeys:page:duplicate-test", { quality: 0 }));
  assert.deepEqual(second, first);
  assert.equal(storage.writes, before);
});

test("a same-item daily repeat cap applies and begins a new window the next day", () => {
  const itemId = "bookkeys:page:repeat-book:1";
  const one = adapter.award(page("repeat-1", { itemId }));
  const two = adapter.award(page("repeat-2", { itemId }));
  const three = adapter.award(page("repeat-3", { itemId }));
  const four = adapter.award(page("repeat-4", { itemId }));
  assert.equal(one.totalExp, 6);
  assert.equal(two.totalExp, 6);
  assert.equal(three.totalExp, 6);
  assert.equal(four.eligible, false);
  assert.equal(four.reason, "daily-repeat-cap");
  assert.equal(four.totalExp, 0);

  const next = adapter.award(page("repeat-next-day", { itemId, ts: day2 }));
  assert.equal(next.eligible, true);
  assert.equal(next.repeatOrdinal, 1);
});

test("verified chapter and whole-book completion use shared milestone classes", () => {
  const chapter = adapter.award({
    eventId: "bookkeys:chapter:sample-book:0",
    moduleId: "bookkeys",
    itemId: "bookkeys:chapter:sample-book:0",
    ts: day1,
    activityClass: "unit-milestone",
    difficulty: "intermediate",
    completionEvidence: "completed-book-chapter",
    completed: true,
    quality: 1,
  });
  assert.equal(chapter.activityClass, "unit-milestone");
  assert.equal(chapter.eligible, true);

  const book = adapter.award({
    eventId: "bookkeys:book:sample-book",
    moduleId: "bookkeys",
    itemId: "bookkeys:book:sample-book",
    ts: day1,
    activityClass: "major-completion",
    difficulty: "advanced",
    completionEvidence: "completed-required-book-sections",
    completed: true,
    quality: 1,
    passed: true,
    checkpointId: "bookkeys:book-completion:sample-book",
  });
  assert.equal(book.activityClass, "major-completion");
  assert.equal(book.passBonus, 15);
  assert.equal(book.eligible, true);
});

test("Meta includes the isolated ledger only and excludes legacy Bookkeys XP", () => {
  const before = readGlobalRewardSummary(storage);
  assert.ok(before.registeredModules.some((module) => module.moduleId === "bookkeys"));
  const ledger = adapter.getRecords();
  const expected = ledger.filter((record) => record.eligible && record.totalExp > 0)
    .reduce((sum, record) => sum + record.totalExp, 0);
  assert.equal(before.sources.find((source) => source.moduleId === "bookkeys").exp, expected);
  assert.ok(before.totalExp < 987654, "old bookkeys:game XP must not leak into global Meta EXP");
});
