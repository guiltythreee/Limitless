import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import vm from "node:vm";
import test from "node:test";
import ts from "typescript";

const here = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(join(here, "../app/lib/store.ts"), "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2022,
    esModuleInterop: true,
  },
}).outputText;

function boot(seed, questionList = []) {
  const values = new Map(Object.entries(seed));
  let writes = 0;
  const storage = {
    getItem(key) { return values.get(key) ?? null; },
    setItem(key, value) { writes++; values.set(key, String(value)); },
    removeItem(key) { values.delete(key); },
    writeCount() { return writes; },
  };
  const fakeWindow = {
    localStorage: storage,
    addEventListener() {},
    removeEventListener() {},
  };
  const fakeQuestions = {
    allQuestions: questionList,
    questionByKey: Object.fromEntries(questionList.map((question) => [question.key, question])),
    grade: (_item, picked) => ({ score: picked.length ? 1 : 0, status: picked.length ? "correct" : "unattempted" }),
  };
  const module = { exports: {} };
  const require = (name) => {
    if (name === "react") return { useSyncExternalStore: (_subscribe, getSnapshot) => getSnapshot() };
    if (name === "./questions") return fakeQuestions;
    if (name === "../content") return { lessons: [] };
    throw new Error("Unexpected import: " + name);
  };
  vm.runInNewContext(compiled, {
    module,
    exports: module.exports,
    require,
    window: fakeWindow,
    localStorage: storage,
    console,
    setTimeout,
    clearTimeout,
  });
  const api = module.exports;
  api.useStore();
  return { api, storage };
}

test("current Probability progress roots preserve unknown extension fields through later writes", () => {
  const extension = { owner: "another-module", nested: { version: 7, flags: ["keep", "all"] } };
  const seed = {
    completed: ["sample-space"],
    tests: [],
    attempts: [],
    bookmarks: [],
    drafts: {},
    goal: 10,
    goalByDay: {},
    moduleOwnedExtension: extension,
    futureSchemaValue: { untouched: true },
  };
  const { api, storage } = boot({ "hc3-progress-v3": JSON.stringify(seed) });
  api.setGoal(17);
  const persisted = JSON.parse(storage.getItem("hc3-progress-v3"));
  assert.deepEqual(persisted.moduleOwnedExtension, extension);
  assert.deepEqual(persisted.futureSchemaValue, { untouched: true });
  assert.deepEqual(persisted.completed, ["sample-space"]);
  assert.equal(persisted.goal, 17);
});

test("legacy Probability migrations also preserve unknown root extensions", () => {
  const extension = { owner: "legacy-module", token: "retain-me" };
  const legacy = {
    completed: ["conditional"],
    answered: {},
    moduleOwnedExtension: extension,
    futureSchemaValue: 42,
  };
  const { api, storage } = boot({ "hc3-progress-v2": JSON.stringify(legacy) });
  api.setGoal(13);
  const persisted = JSON.parse(storage.getItem("hc3-progress-v3"));
  assert.deepEqual(persisted.moduleOwnedExtension, extension);
  assert.equal(persisted.futureSchemaValue, 42);
  assert.deepEqual(persisted.completed, ["conditional"]);
  assert.equal(persisted.goal, 13);
  assert.equal(Object.hasOwn(persisted, "answered"), false);
});


test("resetting Probability clears its known fields without deleting unknown root extensions", () => {
  const extension = { ownedElsewhere: true, opaque: [1, 2, 3] };
  const seed = {
    completed: ["sample-space"], tests: [], attempts: [], bookmarks: [], drafts: {},
    goal: 10, goalByDay: {}, moduleOwnedExtension: extension,
  };
  const { api, storage } = boot({ "hc3-progress-v3": JSON.stringify(seed) });
  api.resetAll();
  const persisted = JSON.parse(storage.getItem("hc3-progress-v3"));
  assert.deepEqual(persisted.moduleOwnedExtension, extension);
  assert.deepEqual(persisted.completed, []);
  assert.deepEqual(persisted.attempts, []);
  assert.equal(persisted.goal, 10);
});

test("Probability test answers and their assessment record use one canonical storage write", () => {
  const questionList = [
    { key: "lesson-a:0", lessonId: "lesson-a", index: 0, rank: 9, item: {}, difficulty: "easy" },
    { key: "lesson-a:1", lessonId: "lesson-a", index: 1, rank: 9, item: {}, difficulty: "medium" },
  ];
  const seed = {
    completed: [], tests: [], attempts: [], bookmarks: [], drafts: {}, goal: 10, goalByDay: {},
    moduleOwnedExtension: { mustRemain: true },
  };
  const { api, storage } = boot({ "hc3-progress-v3": JSON.stringify(seed) }, questionList);
  const before = storage.writeCount();
  const testRecord = {
    id: "test-one-write",
    ts: Date.now(),
    label: "Lesson A",
    total: 2,
    answered: 2,
    correct: 2,
    score: 2,
    ms: 1000,
    results: [
      { q: "lesson-a:0", status: "correct", ms: 400 },
      { q: "lesson-a:1", status: "correct", ms: 600 },
    ],
  };
  api.recordTestWithAttempts(testRecord, [
    { q: "lesson-a:0", picked: [0], ms: 400 },
    { q: "lesson-a:1", picked: [1], ms: 600 },
  ]);
  assert.equal(storage.writeCount() - before, 1, "test attempt and result should be persisted atomically");
  const persisted = JSON.parse(storage.getItem("hc3-progress-v3"));
  assert.equal(persisted.tests.length, 1);
  assert.equal(persisted.attempts.length, 2);
  assert.deepEqual(persisted.moduleOwnedExtension, { mustRemain: true });
});
