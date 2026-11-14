import assert from "node:assert/strict";
import test from "node:test";
import {
  BOOKKEYS_REWARD_STORAGE_KEY,
  createBookkeysRewardAdapter,
} from "./bookkeys-reward-adapter";
import { bookkeysRewardPolicy } from "./bookkeys-reward-policy";

class MemoryStorage {
  private readonly values = new Map<string, string>();
  getItem(key: string): string | null { return this.values.get(key) ?? null; }
  setItem(key: string, value: string): void { this.values.set(key, value); }
}

const pageActivity = (eventId: string) => ({
  eventId,
  moduleId: "bookkeys",
  itemId: "bookkeys:page:0123456789abcdef",
  ts: 1_800_000_000_000,
  completionEvidence: "finished-book-page",
  completed: true,
  quality: 0.95,
  contentSignature: "0123456789abcdef",
  characterCount: 240,
});

test("awards a verified page through the canonical LSR-1 policy and persists its ledger", () => {
  const storage = new MemoryStorage();
  const adapter = createBookkeysRewardAdapter(storage, bookkeysRewardPolicy);
  const record = adapter.award(pageActivity("bookkeys:page:bookA:0"));

  assert.ok(record);
  assert.equal(record.totalExp, 11);
  assert.equal(record.activityClass, "standard-task");
  assert.equal(record.difficulty, "foundational");
  assert.equal(adapter.getRecords().length, 1);
  assert.ok(storage.getItem(BOOKKEYS_REWARD_STORAGE_KEY));
});

test("duplicate page events are idempotent", () => {
  const storage = new MemoryStorage();
  const adapter = createBookkeysRewardAdapter(storage, bookkeysRewardPolicy);
  const first = adapter.award(pageActivity("bookkeys:page:bookA:0"));
  const duplicate = adapter.award(pageActivity("bookkeys:page:bookA:0"));

  assert.deepEqual(duplicate, first);
  assert.equal(adapter.getRecords().length, 1);
});

test("page awards reject short passages and malformed content fingerprints", () => {
  const adapter = createBookkeysRewardAdapter(new MemoryStorage(), bookkeysRewardPolicy);
  assert.equal(adapter.award({ ...pageActivity("short"), characterCount: 149 }), null);
  assert.equal(adapter.award({ ...pageActivity("bad-signature"), contentSignature: "not-a-hash" }), null);
});

test("daily repeat caps are enforced by the shared policy", () => {
  const adapter = createBookkeysRewardAdapter(new MemoryStorage(), bookkeysRewardPolicy);
  const records = [1, 2, 3, 4].map((index) =>
    adapter.award(pageActivity("bookkeys:page:bookA:" + index)),
  );

  assert.ok(records.every(Boolean));
  assert.equal(records[0]?.eligible, true);
  assert.equal(records[1]?.eligible, true);
  assert.equal(records[2]?.eligible, true);
  assert.equal(records[3]?.eligible, false);
  assert.equal(records[3]?.reason, "daily-repeat-cap");
  assert.equal(adapter.getRecords().length, 4);
});

test("chapter milestones use the canonical intermediate reward tier", () => {
  const adapter = createBookkeysRewardAdapter(new MemoryStorage(), bookkeysRewardPolicy);
  const record = adapter.award({
    eventId: "bookkeys:milestone:c:bookA:0",
    moduleId: "bookkeys",
    itemId: "bookkeys:chapter:c:bookA:0",
    ts: 1_800_000_000_000,
    completionEvidence: "completed-book-chapter",
    completed: true,
    quality: 0.7,
  });

  assert.ok(record);
  assert.equal(record.totalExp, 63);
  assert.equal(record.activityClass, "unit-milestone");
  assert.equal(record.difficulty, "intermediate");
});
