import assert from "node:assert/strict";
import {
  activitySnapshot,
  completedSnapshot,
  isRecord,
  readStoredProgress,
} from "./progress.ts";

const missing = readStoredProgress(() => null, "key");
assert.deepEqual(missing, { status: "available", value: {} });

const valid = readStoredProgress((key) => {
  assert.equal(key, "key");
  return JSON.stringify({ answered: { "ch01-q1": { at: 123 } }, extension: true });
}, "key");
assert.equal(valid.status, "available");
if (valid.status === "available") {
  assert.equal((valid.value.answered as Record<string, unknown>)["ch01-q1"] !== undefined, true);
  assert.equal(valid.value.extension, true);
}

for (const raw of ["{broken", "null", "[]", '"text"', "42"]) {
  assert.deepEqual(readStoredProgress(() => raw, "key"), { status: "invalid" });
}
assert.deepEqual(readStoredProgress(() => { throw new Error("blocked"); }, "key"), { status: "invalid" });

assert.equal(isRecord({ a: 1 }), true);
assert.equal(isRecord([]), false);
assert.deepEqual(activitySnapshot("lesson-1", 0), {
  contentId: "lesson-1",
  status: "not-started",
});
assert.deepEqual(activitySnapshot("lesson-1", 3, 123), {
  contentId: "lesson-1",
  status: "in-progress",
  lastActivityAt: 123,
});
assert.deepEqual(activitySnapshot("lesson-1", 3, Number.NaN), {
  contentId: "lesson-1",
  status: "in-progress",
});
assert.deepEqual(completedSnapshot("lesson-1", 456), {
  contentId: "lesson-1",
  status: "completed",
  lastActivityAt: 456,
});
console.log("Studies progress projection checks passed.");
