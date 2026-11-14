import assert from "node:assert/strict";
import { buildGlobalActivitySummary } from "./activity.mjs";

const day = (offset) => new Date(2026, 10, 15 + offset, 12).getTime();
const attempts = [
  { id: "a", occurredAt: day(-2) },
  { id: "b", occurredAt: day(-2) },
  { id: "c", occurredAt: day(-1) },
  { id: "d", occurredAt: day(0) },
  { id: "bad", occurredAt: NaN },
  null,
];

const report = buildGlobalActivitySummary(attempts, day(0), 7, 2);
assert.equal(report.todayCount, 1);
assert.equal(report.todayGoalMet, false);
assert.equal(report.streakDays, 3);
assert.equal(report.activeDays, 3);
assert.equal(report.history.length, 7);
assert.equal(report.history.at(-1).date, report.today);
assert.equal(report.history.at(-1).count, 1);

const missedToday = buildGlobalActivitySummary(attempts.slice(0, 3), day(0), 7, 2);
assert.equal(missedToday.streakDays, 2, "a streak remains current through yesterday");
assert.equal(missedToday.todayGoalMet, false);

const empty = buildGlobalActivitySummary([], day(0), 0, 0);
assert.equal(empty.streakDays, 0);
assert.equal(empty.dailyGoal, 1);
assert.equal(empty.history.length, 1);


const longStreakAttempts = Array.from({ length: 90 }, (_, index) => ({
  id: "streak-" + index,
  occurredAt: new Date(2026, 10, 15 - index, 12).getTime(),
}));
const longStreak = buildGlobalActivitySummary(longStreakAttempts, day(0), 7, 1);
assert.equal(longStreak.streakDays, 90, "streak length must not be capped by the visible calendar window");
assert.equal(longStreak.history.length, 7, "visible history remains independently bounded");

console.log("Global activity summary tests passed.");
