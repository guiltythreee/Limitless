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

function boot(seed) {
  const values = new Map(Object.entries(seed));
  const storage = {
    getItem(key) { return values.get(key) ?? null; },
    setItem(key, value) { values.set(key, String(value)); },
    removeItem(key) { values.delete(key); },
  };
  const fakeWindow = {
    localStorage: storage,
    addEventListener() {},
    removeEventListener() {},
  };
  const fakeQuestions = {
    allQuestions: [],
    questionByKey: {},
    grade: () => ({ score: 1, status: "correct" }),
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
