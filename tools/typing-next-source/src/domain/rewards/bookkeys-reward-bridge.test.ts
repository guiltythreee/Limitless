import assert from "node:assert/strict";
import test from "node:test";
import {
  installBookkeysRewardBridge,
  type BookkeysRewardBridgeAdapter,
} from "./bookkeys-reward-bridge";

function storageChange(target: EventTarget, oldValue: unknown, newValue: unknown): void {
  const event = new Event("storage");
  Object.defineProperties(event, {
    key: { value: "bookkeys:game" },
    oldValue: { value: JSON.stringify(oldValue) },
    newValue: { value: JSON.stringify(newValue) },
  });
  target.dispatchEvent(event);
}

test("awards a newly completed page only when visible-page evidence is supplied", () => {
  const target = new EventTarget();
  const activities: Record<string, unknown>[] = [];
  const adapter: BookkeysRewardBridgeAdapter = {
    award(activity) { activities.push(activity); return activity; },
  };
  const stop = installBookkeysRewardBridge(target, adapter, {
    now: () => 1_000,
    getPageEvidence: () => ({ contentSignature: "0123456789abcdef", characterCount: 240 }),
  });

  const before = { check: null, paid: {}, book: { bookA: { p: [], x: [] } } };
  const after = { check: { key: "bookA", page: 0 }, paid: {}, book: { bookA: { p: [0], x: [] } } };
  storageChange(target, before, after);

  assert.equal(activities.length, 1);
  assert.equal(activities[0].eventId, "bookkeys:page:bookA:0");
  assert.equal(activities[0].itemId, "bookkeys:page:0123456789abcdef");
  assert.equal(activities[0].completionEvidence, "finished-book-page");
  stop();
});

test("does not award a page when rendered evidence is unavailable", () => {
  const target = new EventTarget();
  const activities: unknown[] = [];
  const stop = installBookkeysRewardBridge(target, {
    award(activity) { activities.push(activity); return activity; },
  }, { getPageEvidence: () => null });

  storageChange(
    target,
    { check: null, paid: {}, book: { bookA: { p: [], x: [] } } },
    { check: { key: "bookA", page: 0 }, paid: {}, book: { bookA: { p: [0], x: [] } } },
  );

  assert.equal(activities.length, 0);
  stop();
});

test("awards a verified chapter milestone only after the completion marker clears", () => {
  const target = new EventTarget();
  const activities: Record<string, unknown>[] = [];
  const stop = installBookkeysRewardBridge(target, {
    award(activity) { activities.push(activity); return activity; },
  }, {
    now: () => 2_000,
    getPageEvidence: () => ({ contentSignature: "fedcba9876543210", characterCount: 180 }),
  });

  const before = { check: null, paid: {}, book: { bookA: { p: [], x: [] } } };
  const pageSaved = { check: { key: "bookA", page: 2 }, paid: {}, book: { bookA: { p: [2], x: [2] } } };
  storageChange(target, before, pageSaved);
  const milestoneSaved = {
    check: null,
    paid: { "c:bookA:chapter-1": 250 },
    book: { bookA: { p: [2], x: [2] } },
  };
  storageChange(target, pageSaved, milestoneSaved);

  assert.equal(activities.length, 2);
  assert.equal(activities[1].completionEvidence, "completed-book-chapter");
  assert.equal(activities[1].itemId, "bookkeys:chapter:c:bookA:chapter-1");
  stop();
});
