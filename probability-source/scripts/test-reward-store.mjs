import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import vm from "node:vm";
import ts from "typescript";
import {
  buildRewardRecords,
  sanitiseRewardRecords,
  CHECKPOINT_PASS_THRESHOLD,
} from "../../shared/rewards.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(join(here, "../app/lib/store.ts"), "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2022,
    esModuleInterop: true,
  },
}).outputText;

const questions = [];
for (const lessonId of ["lesson-a", "lesson-b"]) {
  for (let i = 0; i < 5; i++) {
    const key = `${lessonId}:${i}`;
    questions.push({
      key, lessonId, index: i, rank: i, difficulty: "easy",
      item: { id: key, prompt: "Question " + key },
    });
  }
}
const pathways = [
  { id: "path-a", shortLabel: "A", lessonIds: ["lesson-a"] },
  { id: "path-b", shortLabel: "B", lessonIds: ["lesson-b"] },
];

function boot(seed, options = {}) {
  const values = new Map(Object.entries(seed));
  let writes = 0;
  const storage = {
    getItem(key) { return values.get(key) ?? null; },
    setItem(key, value) { writes++; values.set(key, String(value)); },
    removeItem(key) { values.delete(key); },
    writeCount() { return writes; },
  };
  const events = [];
  const listeners = [];
  const fakeWindow = {
    localStorage: storage,
    addEventListener(name, callback) { listeners.push({ name, callback }); },
    dispatchEvent(event) { events.push(event.type); return true; },
  };
  const questionByKey = Object.fromEntries(questions.map((question) => [question.key, question]));
  const fakeQuestions = {
    allQuestions: questions,
    questionByKey,
    grade: (_item, picked) => ({
      score: picked.length ? 1 : 0,
      status: picked.length ? "correct" : "unattempted",
    }),
  };
  const module = { exports: {} };
  const require = (name) => {
    if (name === "react") return { useSyncExternalStore: (_subscribe, getSnapshot) => getSnapshot() };
    if (name === "./questions") return fakeQuestions;
    if (name === "../content") return { pathways };
    if (name === "../../../shared/rewards.mjs") return {
      buildRewardRecords,
      sanitiseRewardRecords,
      CHECKPOINT_PASS_THRESHOLD,
      dispatchRewardUpdate() { fakeWindow.dispatchEvent({ type: "limitless:rewards-updated" }); },
    };
    throw new Error("Unexpected import: " + name);
  };
  vm.runInNewContext(compiled, {
    module,
    exports: module.exports,
    require,
    window: fakeWindow,
    localStorage: storage,
    console,
    Date,
    Math,
  });
  const api = module.exports;
  api.useStore();
  return { api, storage, events, get writes() { return storage.writeCount(); } };
}

const extension = { owner: "another-module", nested: { schema: 4, flags: ["keep", "all"] } };

{
  const { api, storage, events } = boot({
    "hc3-progress-v3": JSON.stringify({
      completed: ["lesson-a"], tests: [], attempts: [], rewardLedger: [],
      bookmarks: [], drafts: {}, goal: 10, goalByDay: {},
      moduleOwnedExtension: extension,
      futureSchemaValue: { untouched: true },
    }),
  });
  api.setGoal(17);
  let persisted = JSON.parse(storage.getItem("hc3-progress-v3"));
  assert.deepEqual(persisted.moduleOwnedExtension, extension);
  assert.deepEqual(persisted.futureSchemaValue, { untouched: true });
  assert.deepEqual(persisted.completed, ["lesson-a"]);
  assert.equal(persisted.goal, 17);

  const legacyExtension = { owner: "legacy-module", token: "keep" };
  const { api: legacyApi, storage: legacyStorage } = boot({
    "hc3-progress-v2": JSON.stringify({
      completed: ["lesson-b"], answered: {},
      moduleOwnedExtension: legacyExtension, futureSchemaValue: 29,
    }),
  });
  legacyApi.setGoal(13);
  persisted = JSON.parse(legacyStorage.getItem("hc3-progress-v3"));
  assert.deepEqual(persisted.moduleOwnedExtension, legacyExtension);
  assert.equal(persisted.futureSchemaValue, 29);
  assert.deepEqual(persisted.completed, ["lesson-b"]);
  assert.equal(Object.hasOwn(persisted, "answered"), false);

  api.resetAll();
  persisted = JSON.parse(storage.getItem("hc3-progress-v3"));
  assert.deepEqual(persisted.moduleOwnedExtension, extension);
  assert.deepEqual(persisted.completed, []);
  assert.deepEqual(persisted.attempts, []);
  assert.equal(persisted.goal, 10);
}

{
  const { api, storage, events } = boot({
    "hc3-progress-v3": JSON.stringify({
      completed: [], tests: [], attempts: [], rewardLedger: [], bookmarks: [],
      drafts: {}, goal: 10, goalByDay: {}, moduleOwnedExtension: extension,
    }),
  });
  const testId = "assessment-one-write";
  const ts = Date.now();
  const submitted = questions.filter((question) => question.lessonId === "lesson-a").map((question, index) => ({
    q: question.key, picked: [index], ms: 400 + index,
  }));
  const record = {
    id: testId, ts, label: "All of A", total: 5, answered: 5, correct: 5,
    score: 5, ms: 4000,
    results: submitted.map((attempt) => ({ q: attempt.q, status: "correct", ms: attempt.ms })),
  };
  const before = storage.writeCount();
  const attempts = api.recordTestWithAttempts(record, submitted);
  assert.equal(attempts.length, 5);
  assert.equal(storage.writeCount() - before, 1, "five answers, test result, and all rewards must share one root write");
  let persisted = JSON.parse(storage.getItem("hc3-progress-v3"));
  assert.equal(persisted.tests.length, 1);
  assert.equal(persisted.attempts.length, 5);
  assert.deepEqual(persisted.moduleOwnedExtension, extension);
  assert.ok(persisted.rewardLedger.some((reward) => reward.activityClass === "assessment" && reward.totalExp > 0));
  assert.ok(persisted.rewardLedger.some((reward) => reward.eventId === "lsr1:pass-bonus:probability:probability:pathway:path-a" && reward.totalExp === 15));
  assert.ok(persisted.rewardLedger.some((reward) => reward.completionEvidence === "topic-mastery" && reward.totalExp > 0));
  assert.ok(persisted.rewardLedger.some((reward) => reward.eventId === "probability:pathway-mastery:probability-lsr1-pathways-v1:path-a"));
  assert.ok(!persisted.rewardLedger.some((reward) => reward.eventId.includes("lesson-b")), "untouched topics cannot be claimed as mastered");
  assert.ok(events.includes("limitless:rewards-updated"), "notifications fire after the canonical save");

  const beforeDuplicate = storage.writeCount();
  assert.equal(api.recordTestWithAttempts(record, submitted).length, 0, "duplicate test returns no new attempts");
  assert.equal(storage.writeCount(), beforeDuplicate, "duplicate assessment completion does not write or pay again");
  persisted = JSON.parse(storage.getItem("hc3-progress-v3"));
  assert.equal(persisted.tests.length, 1);
  assert.equal(persisted.attempts.length, 5);
}

{
  const { api, storage } = boot({
    "hc3-progress-v3": JSON.stringify({
      completed: [], tests: [], attempts: [], rewardLedger: [], bookmarks: [],
      drafts: {}, goal: 10, goalByDay: {},
    }),
  });
  const short = {
    id: "too-short-for-assessment",
    ts: Date.now(),
    label: "Tiny quiz",
    total: 2,
    answered: 2,
    correct: 2,
    score: 2,
    ms: 200,
    results: [
      { q: "lesson-a:0", status: "correct", ms: 100 },
      { q: "lesson-a:1", status: "correct", ms: 100 },
    ],
  };
  api.recordTestWithAttempts(short, [
    { q: "lesson-a:0", picked: [0], ms: 100 },
    { q: "lesson-a:1", picked: [1], ms: 100 },
  ]);
  const persisted = JSON.parse(storage.getItem("hc3-progress-v3"));
  assert.equal(persisted.rewardLedger.filter((reward) => reward.activityClass === "assessment" && reward.totalExp > 0).length, 0,
    "a two-question test is not a meaningful assessment reward");
}

console.log("Probability LSR-1 store integration: all checks passed.");
console.log("- Atomic test submission, idempotency, one-time pass record, topic/pathway mastery, and meaningful assessment gate verified.");
console.log("- Legacy and unknown progress-root fields survive writes and reset.");
