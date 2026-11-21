import assert from "node:assert/strict";
import { DAILY_PRACTICE_POLICY, applyDailyPracticeBudget, buildRewardRecords } from "./rewards.mjs";

const DAY = 1_800_000_000_000;
const NEXT_DAY = DAY + 36 * 3600 * 1000;
const mk = (n, over = {}) => ({
  eventId: `e${n}${over.tag ?? ""}`, moduleId: over.moduleId ?? "probability", itemId: `question:${n}`, ts: over.ts ?? DAY,
  activityClass: over.activityClass ?? "micro-practice", difficulty: "advanced", completionEvidence: "test",
  completed: true, quality: 0, ...over.extra,
});
const run = (inputs) => inputs.reduce((ledger, input) => [...ledger, ...buildRewardRecords(input, ledger)], []);
const sum = (records) => records.reduce((s, r) => s + r.totalExp, 0);

// Curve shape: full, quarter, then nothing.
const P = DAILY_PRACTICE_POLICY;
assert.equal(applyDailyPracticeBudget(10, 0), 10);
assert.equal(applyDailyPracticeBudget(10, P.fullRateExp), Math.round(10 * P.reducedMultiplier));
assert.equal(applyDailyPracticeBudget(10, P.reducedRateExp), 0);
assert.equal(applyDailyPracticeBudget(300, 0), 225, "200 at full value + the remaining 100 at a quarter");
assert.equal(applyDailyPracticeBudget(500, 0), 250, "the reduced band is capped at 200 raw EXP, so the daily maximum is 250");

// 480 distinct questions in one day can no longer farm thousands of EXP (before: 8 EXP x 480 = 3,840).
const heavyDay = run(Array.from({ length: 480 }, (_, i) => mk(i)));
const total = sum(heavyDay);
assert.ok(total <= P.fullRateExp + (P.reducedRateExp - P.fullRateExp) * P.reducedMultiplier + 5, `heavy day total ${total}`);
assert.ok(total >= P.fullRateExp, "the first part of the budget is paid at full value");
assert.equal(heavyDay.at(-1).totalExp, 0, "past the daily limit practice pays nothing");

// The budget resets the next local day.
const twoDays = run([...Array.from({ length: 100 }, (_, i) => mk(i)), mk(999, { ts: NEXT_DAY })]);
assert.equal(twoDays.at(-1).totalExp, 8, "advanced micro-practice pays 8 again on a new day");

// Modules are independent.
const mixed = run([...Array.from({ length: 100 }, (_, i) => mk(i)), mk(5000, { moduleId: "metallurgy-mt202" })]);
assert.equal(mixed.at(-1).totalExp, 8);

// One-time awards and pass bonuses never count toward, or get cut by, the budget.
const withMilestone = run([
  ...Array.from({ length: 100 }, (_, i) => mk(i)),
  mk(7000, { activityClass: "unit-milestone" }),
  mk(7001, { activityClass: "major-completion" }),
]);
assert.equal(withMilestone.at(-2).totalExp, 75, "unit milestone: 50 x 1.5, unaffected by a spent budget");
assert.equal(withMilestone.at(-1).totalExp, 150, "major completion: 100 x 1.5");
const passAfterBudget = run([
  ...Array.from({ length: 100 }, (_, i) => mk(i)),
  mk(8000, { activityClass: "assessment", extra: { passed: true, checkpointId: "cp:first-pass", questionCount: 20 } }),
]).at(-1);
assert.equal(passAfterBudget.passBonus, 15);
assert.equal(passAfterBudget.totalExp, 15, "assessment EXP is budget-limited but the one-time pass bonus is still paid");

// Bookkeys is exempt until its pace is calibrated: its pages keep paying in full.
const bookkeys = run(Array.from({ length: 100 }, (_, i) => mk(i, { moduleId: "bookkeys" })));
assert.equal(bookkeys.at(-1).totalExp, 8, "exempt module is not tapered");

console.log("Daily practice budget: all assertions passed.");
