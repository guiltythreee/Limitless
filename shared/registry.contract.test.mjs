/**
 * Contract test for the extensible reward system. It iterates the registries,
 * so a newly added discipline or activity class is checked automatically.
 */
import assert from "node:assert/strict";
import {
  ACTIVITY_CLASS_DEFS, DIFFICULTY_MULTIPLIER, REWARD_SOURCE_REGISTRY, REPEAT_POLICY, calculateReward,
} from "./rewards.mjs";
import { createLedgerAdapter } from "./ledger-adapter.mjs";

// 1) Source registry: every discipline has a unique id and storage key.
const ids = new Set(); const keys = new Set();
for (const source of REWARD_SOURCE_REGISTRY) {
  assert.ok(source.moduleId && source.label && source.storageKey, `incomplete source ${JSON.stringify(source)}`);
  assert.ok(!ids.has(source.moduleId), `duplicate moduleId ${source.moduleId}`);
  assert.ok(!keys.has(source.storageKey), `duplicate storageKey ${source.storageKey}`);
  ids.add(source.moduleId); keys.add(source.storageKey);
}

// 2) Class registry: every class yields a sane integer EXP for a representative input.
const sample = { problemRating: 1200, questionCount: 10, assignedBaseExp: 40 };
const T0 = 1_800_000_000_000;
for (const [name, def] of Object.entries(ACTIVITY_CLASS_DEFS)) {
  assert.ok(Number.isFinite(def.baseExp) && def.baseExp >= 0, `${name}: baseExp`);
  let previous = -1;
  for (const tier of ["foundational", "intermediate", "advanced"]) {
    const r = calculateReward({
      eventId: `c:${name}:${tier}`, moduleId: "contract", itemId: `i:${name}`, ts: T0,
      activityClass: name, difficulty: tier, completionEvidence: "contract-test", completed: true, quality: 0, ...sample,
    });
    assert.equal(r.eligible, true, `${name}/${tier} should be eligible`);
    assert.ok(Number.isInteger(r.totalExp) && r.totalExp > 0, `${name}/${tier}: totalExp ${r.totalExp}`);
    assert.ok(r.totalExp >= previous, `${name}: EXP must not fall as difficulty rises`);
    previous = r.totalExp;
  }
}
assert.deepEqual(Object.keys(DIFFICULTY_MULTIPLIER), ["foundational", "intermediate", "advanced"]);

// 3) A brand-new discipline works with no engine edit: only an id, a key and a mapping.
const values = new Map();
const storage = { getItem: (k) => values.get(k) ?? null, setItem: (k, v) => values.set(k, v) };
const future = createLedgerAdapter(storage, { moduleId: "future-discipline", storageKey: "future-discipline-lsr1-v1" });
const activity = (n, item = "lesson-1") => ({
  eventId: `future:${n}`, itemId: item, ts: T0, activityClass: "standard-task", difficulty: "foundational",
  completionEvidence: "contract-test", completed: true, quality: 0,
});
assert.equal(future.award(activity(1)).created, true);
assert.equal(future.award(activity(1)).created, false, "same eventId is idempotent");
assert.equal(future.getRecords().length, 1);
for (let n = 2; n <= REPEAT_POLICY.fullAwardsPerItemPerDay + 1; n += 1) future.award(activity(n));
const last = future.getRecords().at(-1);
assert.equal(last.totalExp, REPEAT_POLICY.laterRepeatExp, "daily repeat cap applies to new disciplines automatically");

// 4) Ledgers are isolated per module.
const other = createLedgerAdapter(storage, { moduleId: "other-discipline", storageKey: "other-discipline-lsr1-v1" });
assert.equal(other.getRecords().length, 0);
assert.equal(other.award(activity(1)).created, true, "same eventId in another module is independent");
assert.throws(() => createLedgerAdapter(storage, { moduleId: "", storageKey: "x" }), TypeError);

console.log("Reward registry contract: all assertions passed.");
