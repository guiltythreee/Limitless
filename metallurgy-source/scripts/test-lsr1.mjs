#!/usr/bin/env node
import assert from "node:assert/strict";
import { readGlobalRewardSummary } from "../../shared/rewards.mjs";

class MemoryStorage {
  constructor(initial = {}) { this.data = new Map(Object.entries(initial)); this.writes = 0; }
  getItem(key) { return this.data.has(key) ? this.data.get(key) : null; }
  setItem(key, value) { this.writes++; this.data.set(key, String(value)); }
  removeItem(key) { this.data.delete(key); }
}
const store = new MemoryStorage({
  "mm-mt201-v1": JSON.stringify({
    answered: { "ch01-q1": { choice: "B", correct: true, at: 1700000000000 } },
    examBest: { score: 1, total: 1, at: 1700000001000 },
    legacyExtension: "preserve on additive writes",
  }),
  "mm-mt202-v1": JSON.stringify({
    answered: { "ch01-q1": { choice: "A", correct: false, at: 1700000000000 } },
    examBest: null,
    legacyExtension: "keep",
  }),
  "mm-mt203-v1": JSON.stringify({
    attempts: [{ q: "t1-01", picked: "a", correct: true, mode: "learn", ms: 0, ts: 1700000000000 }],
    theoryRead: ["m1:t1.1"],
    exams: [],
    best: null,
    awarded: { "q:t1-01": 4, "clear:m1": 60, "old-large-value": 987654 },
    days: { "2023-11-14": 3 },
    goal: 12,
  }),
});
globalThis.window = {
  localStorage: store,
  dispatchEvent(event) { return event.type === "limitless:rewards-updated"; },
};

const MT201 = await import("../app/mt201/progress.ts");
const MT202 = await import("../app/lib/progress.ts");
const MT203 = await import("../app/lib/mt203-progress.ts");

function checkLedgerOnly(actual, expected, label) {
  assert.equal(actual.length, expected, label);
  for (const record of actual) {
    assert.equal(record.policyVersion, "LSR-1");
    assert.ok(record.moduleId.startsWith("metallurgy-"));
  }
}

// Legacy MT201/MT202 progress loads without a migration write and without XP conversion.
{
  const before = store.getItem("mm-mt201-v1");
  const p = MT201.loadProgress();
  assert.equal(p.answered["ch01-q1"].correct, true);
  assert.deepEqual(p.rewardLedger, []);
  assert.equal(store.getItem("mm-mt201-v1"), before, "MT201 load must not rewrite legacy data");

  const practiced = MT201.recordAnswer(p, "ch01-q2", "C", true, "practice", 3);
  checkLedgerOnly(practiced.rewardLedger, 1, "MT201 practice logs one LSR-1 record");
  assert.equal(practiced.rewardLedger[0].moduleId, "metallurgy-mt201");
  assert.equal(practiced.rewardLedger[0].difficulty, "advanced");
  assert.equal(practiced.answered["ch01-q1"].correct, true);
  assert.equal(JSON.parse(store.getItem("mm-mt201-v1")).legacyExtension, "preserve on additive writes");

  const repeated = MT201.recordAnswer(practiced, "ch01-q2", "C", true, "practice", 3);
  checkLedgerOnly(repeated.rewardLedger, 1, "MT201 locked question retry must not award again");

  const underfilled = MT201.recordExamAssessment(repeated, {
    runId: "mt201-exam-underfilled", ts: 1700000002000, total: 10, answered: 4, correct: 4,
  });
  checkLedgerOnly(underfilled.rewardLedger, 1, "under-half answered MT201 assessment gets no EXP");
  const partial = MT201.recordExamAssessment(underfilled, {
    runId: "mt201-exam-partial", ts: 1700000002500, total: 10, answered: 5, correct: 4,
  });
  checkLedgerOnly(partial.rewardLedger, 1, "half-answered MT201 assessment earns no assessment EXP");
  const exam = MT201.recordExamAssessment({
    ...partial, examBest: { score: 4, total: 10, at: 1700000003000 },
  }, {
    runId: "mt201-exam-valid", ts: 1700000003000, total: 10, answered: 10, correct: 4,
  });
  checkLedgerOnly(exam.rewardLedger, 2, "qualified MT201 exam earns one assessment award, not per-answer awards");
  assert.equal(exam.rewardLedger[1].activityClass, "assessment");
  assert.equal(JSON.parse(store.getItem("mm-mt201-v1")).examBest.score, 4);

  const passedExam = MT201.recordExamAssessment(exam, {
    runId: "mt201-exam-passed", ts: 1700000005000, total: 10, answered: 10, correct: 8,
  });
  checkLedgerOnly(passedExam.rewardLedger, 4, "first passed MT201 assessment adds one separate +15 EXP record");
  assert.ok(passedExam.rewardLedger.some((record) =>
    record.eventId === "lsr1:pass-bonus:metallurgy-mt201:metallurgy-mt201:assessment:first-pass" &&
    record.totalExp === 15
  ));
  assert.equal(passedExam.rewardLedger.filter((record) => record.eventId.includes("pass-bonus")).length, 1);

  MT201.resetProgress();
  const reset = MT201.loadProgress();
  assert.deepEqual(reset.answered, {});
  checkLedgerOnly(reset.rewardLedger, 4, "MT201 reset preserves lifetime Meta EXP");
}
{
  const before = store.getItem("mm-mt202-v1");
  const p = MT202.loadProgress();
  assert.equal(p.answered["ch01-q1"].correct, false);
  assert.deepEqual(p.rewardLedger, []);
  assert.equal(store.getItem("mm-mt202-v1"), before, "MT202 load must not rewrite legacy data");

  const practiced = MT202.recordAnswer(p, "ch02-q3", "D", false, "practice", 2);
  checkLedgerOnly(practiced.rewardLedger, 1, "MT202 practice logs a submitted answer");
  assert.equal(practiced.rewardLedger[0].moduleId, "metallurgy-mt202");
  assert.equal(practiced.rewardLedger[0].baseExp, 5, "wrong answers use the shared micro-practice base");
  assert.equal(practiced.rewardLedger[0].qualityBonus, 0, "wrong answers get no quality bonus");
  assert.equal(practiced.answered["ch01-q1"].correct, false);
  assert.equal(JSON.parse(store.getItem("mm-mt202-v1")).legacyExtension, "keep");

  const examAnswer = MT202.recordAnswer(practiced, "ch09-q1", "A", true, "exam", 4);
  checkLedgerOnly(examAnswer.rewardLedger, 1, "MT202 exam question does not also pay per-answer LSR-1 EXP");
  const partial = MT202.recordExamAssessment(examAnswer, {
    runId: "mt202-exam-partial", ts: 1700000003500, total: 10, answered: 5, correct: 4,
  });
  checkLedgerOnly(partial.rewardLedger, 1, "half-answered MT202 assessment earns no assessment EXP");
  const exam = MT202.recordExamAssessment(partial, {
    runId: "mt202-exam-valid", ts: 1700000004000, total: 10, answered: 10, correct: 4,
  });
  checkLedgerOnly(exam.rewardLedger, 2, "MT202 fully answered exam earns one assessment award");
  assert.equal(exam.rewardLedger[1].activityClass, "assessment");

  MT202.resetProgress();
  const reset = MT202.loadProgress();
  assert.deepEqual(reset.answered, {});
  checkLedgerOnly(reset.rewardLedger, 2, "MT202 reset preserves lifetime Meta EXP");
}
{
  const before = store.getItem("mm-mt203-v1");
  const p = MT203.loadProgress();
  assert.equal(p.attempts.length, 1);
  assert.equal(p.awarded["q:t1-01"], 4);
  assert.equal(p.awarded["old-large-value"], 987654);
  assert.deepEqual(p.rewardLedger, []);
  assert.equal(store.getItem("mm-mt203-v1"), before, "MT203 load must not rewrite legacy data");

  const practised = MT203.recordAnswer(p, "t1-01", "b", false, "practice", 0, 4);
  checkLedgerOnly(practised.rewardLedger, 1, "MT203 practice attempt earns a fresh LSR-1 activity");
  assert.equal(practised.rewardLedger[0].moduleId, "metallurgy-mt203");
  assert.equal(practised.rewardLedger[0].difficulty, "advanced");
  assert.equal(practised.attempts.length, 2);
  assert.equal(practised.awarded["old-large-value"], 987654, "legacy XP map remains untouched");
  assert.equal(practised.awarded["q:t1-01"], 4);

  const examAnswer = MT203.recordAnswer(practised, "t1-02", "a", true, "exam", 0, 3);
  checkLedgerOnly(examAnswer.rewardLedger, 1, "MT203 exam answer does not also pay per-question shared EXP");
  const underfilled = MT203.recordExam(examAnswer, {
    id: "mt203-underfilled", ts: 1700000005000, label: "Module 1", total: 10, answered: 4, correct: 4,
    ms: 600000, breakdown: {},
  });
  checkLedgerOnly(underfilled.rewardLedger, 1, "MT203 underfilled assessment earns no shared EXP");
  const partial = MT203.recordExam(underfilled, {
    id: "mt203-partial-exam", ts: 1700000005500, label: "Whole course", total: 10, answered: 5, correct: 4,
    ms: 600000, breakdown: {},
  });
  checkLedgerOnly(partial.rewardLedger, 1, "MT203 half-answered exam earns no assessment EXP");
  const exam = MT203.recordExam(partial, {
    id: "mt203-qualified-exam", ts: 1700000006000, label: "Whole course", total: 10, answered: 10, correct: 4,
    ms: 600000, breakdown: {},
  });
  checkLedgerOnly(exam.rewardLedger, 2, "MT203 fully answered exam earns one assessment award");
  assert.equal(exam.rewardLedger[1].activityClass, "assessment");
  assert.equal(exam.awarded["old-large-value"], 987654, "legacy XP is never converted into LSR-1");
  assert.equal(JSON.parse(store.getItem("mm-mt203-v1")).exams[0].answered, 10);
  assert.equal(JSON.parse(store.getItem("mm-mt203-v1")).exams[1].answered, 5, "partial assessment history is retained without an EXP award");

  MT203.resetProgress();
  const reset = MT203.loadProgress();
  assert.equal(reset.attempts.length, 0);
  assert.deepEqual(reset.awarded, {});
  checkLedgerOnly(reset.rewardLedger, 2, "MT203 reset preserves lifetime Meta EXP");
}

const summary = readGlobalRewardSummary(store);
assert.deepEqual(
  summary.sources.map((source) => source.moduleId),
  ["metallurgy-mt201", "metallurgy-mt202", "metallurgy-mt203"],
  "only ledger roots present in fake storage contribute sources",
);
assert.ok(summary.registeredModules.some((source) => source.moduleId === "metallurgy-mt201"));
assert.ok(summary.registeredModules.some((source) => source.moduleId === "metallurgy-mt202"));
assert.ok(summary.registeredModules.some((source) => source.moduleId === "metallurgy-mt203"));
assert.ok(summary.totalExp < 987654, "legacy MT203 XP is excluded from global LSR-1 EXP");

console.log("Metallurgy LSR-1: all checks passed.");
console.log("- MT201/MT202 legacy progress, practice and single-award assessments verified.");
console.log("- MT203 separate shared ledger, legacy XP isolation and exam gate verified.");
console.log("- Lifetime Meta EXP survives course resets.");
