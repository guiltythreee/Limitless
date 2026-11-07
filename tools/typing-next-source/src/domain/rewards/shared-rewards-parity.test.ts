import assert from "node:assert/strict";
import test from "node:test";
import * as canonical from "../../../../../shared/rewards.mjs";
import * as bundled from "./shared-rewards.mjs";

test("isolated Bookkeys build uses the same LSR-1 award calculation as Limitless", () => {
  const activity = {
    eventId: "bookkeys:page:fixture:0",
    moduleId: "bookkeys",
    itemId: "bookkeys:page:0123456789abcdef",
    ts: 1_800_000_000_000,
    activityClass: "standard-task",
    difficulty: "foundational",
    completionEvidence: "finished-book-page",
    completed: true,
    quality: 0.95,
    contentSignature: "0123456789abcdef",
    characterCount: 240,
  } as const;
  assert.deepEqual(
    bundled.buildRewardRecords(activity, []),
    canonical.buildRewardRecords(activity, []),
  );
});

test("isolated and canonical LSR-1 ledgers sanitize identically", () => {
  const records = canonical.buildRewardRecords({
    eventId: "bookkeys:chapter:fixture",
    moduleId: "bookkeys",
    itemId: "bookkeys:chapter:c:fixture:0",
    ts: 1_800_000_000_000,
    activityClass: "unit-milestone",
    difficulty: "intermediate",
    completionEvidence: "completed-book-chapter",
    completed: true,
    quality: 0.8,
  }, []);
  assert.deepEqual(
    bundled.sanitiseRewardRecords(records),
    canonical.sanitiseRewardRecords(records),
  );
});
