#!/usr/bin/env node
// Progression Map tests. Run: node roadmap/test-roadmap.mjs
import assert from "node:assert/strict";
import { ROADMAP, NODES } from "./data.mjs";
import { ROADMAP_CATALOG as catalog } from "./catalog.generated.mjs";
import {
  STAGE_STATE, STATUS, daysBetween, evaluateRoadmap, localDateKey, validateRoadmap,
} from "./engine.mjs";
import { EVIDENCE_KINDS, STORAGE_KEYS, createEvidenceReader } from "./evidence.mjs";
import {
  ROADMAP_STORAGE_KEY, readManual, setManualState, setManualValue,
} from "./manual.mjs";

let passed = 0;
function test(name, fn) {
  try { fn(); passed++; } catch (error) {
    console.error(`FAIL: ${name}\n${error.stack}`);
    process.exitCode = 1;
  }
}

/** In-memory storage that records every write, so we can prove reads never write. */
function memoryStorage(initial = {}) {
  const data = new Map(Object.entries(initial).map(([k, v]) => [k, typeof v === "string" ? v : JSON.stringify(v)]));
  const writes = [];
  return {
    getItem: (key) => (data.has(key) ? data.get(key) : null),
    setItem: (key, value) => { writes.push(key); data.set(key, String(value)); },
    removeItem: (key) => { writes.push(key); data.delete(key); },
    writes,
  };
}

const TODAY = "2026-11-07";
const evaluateWith = (storage, today = TODAY, level = 1) =>
  evaluateRoadmap(ROADMAP, createEvidenceReader({ storage, catalog, readLevel: () => level }), today);

// ---------- definition validity ----------
test("the shipped roadmap definition is valid", () => {
  assert.deepEqual(validateRoadmap(ROADMAP, EVIDENCE_KINDS), []);
});

test("validator rejects the mistakes a hand-edit is likely to make", () => {
  const base = () => ({
    tracks: [{ id: "t", title: "T", goal: "g", stages: [{ id: "s1", targetDate: null }, { id: "s2", targetDate: "2027-01-01" }] }],
    nodes: [
      { id: "a", track: "t", stage: "s1", title: "A", evidence: { kind: "manual-check" }, prereqs: [] },
      { id: "b", track: "t", stage: "s2", title: "B", evidence: { kind: "manual-check" }, prereqs: ["a"] },
    ],
  });
  assert.deepEqual(validateRoadmap(base(), EVIDENCE_KINDS), []);

  let r = base(); r.nodes.push({ ...r.nodes[0] });
  assert.ok(validateRoadmap(r, EVIDENCE_KINDS).some((e) => e.includes("duplicate node id")));

  r = base(); r.nodes[1].prereqs = ["missing"];
  assert.ok(validateRoadmap(r, EVIDENCE_KINDS).some((e) => e.includes("unknown prerequisite")));

  r = base(); r.nodes[0].prereqs = ["b"]; // a (stage 1) depends on b (stage 2) and b depends on a
  const errors = validateRoadmap(r, EVIDENCE_KINDS);
  assert.ok(errors.some((e) => e.includes("cycle")), "cycle detected");
  assert.ok(errors.some((e) => e.includes("later stage")), "later-stage prerequisite detected");

  r = base(); r.nodes[0].stage = "nope";
  assert.ok(validateRoadmap(r, EVIDENCE_KINDS).some((e) => e.includes("unknown stage")));

  r = base(); r.tracks[0].stages[1].targetDate = "01/01/2027";
  assert.ok(validateRoadmap(r, EVIDENCE_KINDS).some((e) => e.includes("targetDate")));

  r = base(); r.nodes[0].evidence = { kind: "telepathy" };
  assert.ok(validateRoadmap(r, EVIDENCE_KINDS).some((e) => e.includes("unsupported evidence kind")));

  r = base(); r.nodes[0].weight = 0;
  assert.ok(validateRoadmap(r, EVIDENCE_KINDS).some((e) => e.includes("weight")));
});

test("every catalogue reference in the data resolves (no node reads as unknown on a fresh browser)", () => {
  const result = evaluateWith(memoryStorage());
  const unknownNodes = [...result.nodes.values()].filter((m) => !m.known).map((m) => `${m.node.id}: ${m.detail}`);
  assert.deepEqual(unknownNodes, []);
});

// ---------- engine rules ----------
test("status rules: done / active / ready / locked", () => {
  const roadmap = {
    tracks: [{ id: "t", title: "T", goal: "", stages: [{ id: "s", targetDate: null }] }],
    nodes: [
      { id: "a", track: "t", stage: "s", title: "A", evidence: { kind: "x" }, prereqs: [] },
      { id: "b", track: "t", stage: "s", title: "B", evidence: { kind: "x" }, prereqs: ["a"] },
      { id: "c", track: "t", stage: "s", title: "C", evidence: { kind: "x" }, prereqs: ["a"] },
      { id: "d", track: "t", stage: "s", title: "D", evidence: { kind: "x" }, prereqs: [] },
    ],
  };
  const fractions = { a: 1, b: 0, c: 0.4, d: 0 };
  const result = evaluateRoadmap(roadmap, (node) => ({ fraction: fractions[node.id], known: true, detail: "" }), TODAY);
  assert.equal(result.nodes.get("a").status, STATUS.DONE);
  assert.equal(result.nodes.get("b").status, STATUS.READY, "prereq done, no progress");
  assert.equal(result.nodes.get("c").status, STATUS.ACTIVE, "some progress");
  assert.equal(result.nodes.get("d").status, STATUS.READY);

  fractions.a = 0;
  const locked = evaluateRoadmap(roadmap, (node) => ({ fraction: fractions[node.id], known: true, detail: "" }), TODAY);
  assert.equal(locked.nodes.get("b").status, STATUS.LOCKED, "prereq not done, no progress");
  assert.equal(locked.nodes.get("c").status, STATUS.ACTIVE, "progress wins over locked");
  assert.equal(locked.nodes.get("c").aheadOfPrereqs, true);
});

test("unknown evidence never becomes progress; a throwing reader is contained", () => {
  const roadmap = {
    tracks: [{ id: "t", title: "T", goal: "", stages: [{ id: "s", targetDate: null }] }],
    nodes: [{ id: "a", track: "t", stage: "s", title: "A", evidence: { kind: "x" }, prereqs: [] }],
  };
  const result = evaluateRoadmap(roadmap, () => { throw new Error("boom"); }, TODAY);
  const a = result.nodes.get("a");
  assert.equal(a.fraction, 0);
  assert.equal(a.known, false);
  assert.equal(a.status, STATUS.READY);
});

test("stage states: done, overdue, active, upcoming; deadline maths", () => {
  const roadmap = {
    tracks: [{ id: "t", title: "T", goal: "", stages: [
      { id: "s1", targetDate: "2026-11-01" }, { id: "s2", targetDate: "2026-11-01" },
      { id: "s3", targetDate: "2026-12-01" }, { id: "s4", targetDate: null },
    ] }],
    nodes: ["s1", "s2", "s3", "s4"].map((s) => ({ id: `n-${s}`, track: "t", stage: s, title: s, evidence: { kind: "x" }, prereqs: [] })),
  };
  const fractions = { "n-s1": 1, "n-s2": 0.2, "n-s3": 0.2, "n-s4": 0 };
  const result = evaluateRoadmap(roadmap, (node) => ({ fraction: fractions[node.id], known: true, detail: "" }), TODAY);
  const states = result.tracks[0].stages.map((s) => s.state);
  assert.deepEqual(states, [STAGE_STATE.DONE, STAGE_STATE.OVERDUE, STAGE_STATE.ACTIVE, STAGE_STATE.UPCOMING]);
  assert.equal(result.tracks[0].stages[2].daysLeft, 24);
  assert.equal(result.tracks[0].stages[3].daysLeft, null);
  assert.deepEqual(result.tracks[0].behind.map((m) => m.node.id), ["n-s2"]);
  assert.equal(daysBetween("2026-11-07", "2026-11-08"), 1);
  assert.match(localDateKey(new Date(2026, 10, 7)), /^2026-11-07$/);
});

test("next actions: overdue first, then earliest stage, then what unlocks most", () => {
  const roadmap = {
    tracks: [{ id: "t", title: "T", goal: "", stages: [{ id: "s1", targetDate: "2026-12-01" }, { id: "s2", targetDate: "2026-11-01" }] }],
    nodes: [
      { id: "early-small", track: "t", stage: "s1", title: "x", evidence: { kind: "x" }, prereqs: [] },
      { id: "early-big", track: "t", stage: "s1", title: "x", evidence: { kind: "x" }, prereqs: [] },
      { id: "late-overdue", track: "t", stage: "s2", title: "x", evidence: { kind: "x" }, prereqs: [] },
      { id: "child1", track: "t", stage: "s2", title: "x", evidence: { kind: "x" }, prereqs: ["early-big"] },
      { id: "child2", track: "t", stage: "s2", title: "x", evidence: { kind: "x" }, prereqs: ["early-big"] },
    ],
  };
  const result = evaluateRoadmap(roadmap, () => ({ fraction: 0, known: true, detail: "" }), TODAY);
  const order = result.tracks[0].next.map((m) => m.node.id);
  assert.equal(order[0], "late-overdue", "overdue stage outranks stage order");
  assert.equal(order[1], "early-big", "unlocks 2 later nodes");
  assert.equal(order[2], "early-small");
  assert.ok(!order.includes("child1"), "locked nodes are never suggested");
});

// ---------- evidence readers ----------
test("Probability pathway: counts completed lessons, missing key is zero, bad JSON is unknown", () => {
  const foundations = catalog.probability.pathways.foundations;
  const node = NODES.find((n) => n.id === "q-prob-foundations");
  const half = foundations.slice(0, Math.floor(foundations.length / 2));
  const reader = (storage) => createEvidenceReader({ storage, catalog })(node);

  let result = reader(memoryStorage({ [STORAGE_KEYS.probability]: { completed: half } }));
  assert.ok(Math.abs(result.fraction - half.length / foundations.length) < 1e-9);
  assert.equal(result.known, true);

  result = reader(memoryStorage({ [STORAGE_KEYS.probability]: { completed: [...foundations, "not-a-lesson", 7] } }));
  assert.equal(result.fraction, 1);

  assert.equal(reader(memoryStorage()).fraction, 0);
  assert.equal(reader(memoryStorage()).known, true);
  assert.equal(reader(memoryStorage({ [STORAGE_KEYS.probability]: "{oops" })).known, false);
  assert.equal(reader(memoryStorage({ [STORAGE_KEYS.probability]: { completed: "nope" } })).known, false);
});

test("Probability minFraction: 75% of the pathway is enough for the 75% node", () => {
  const foundations = catalog.probability.pathways.foundations;
  const node = NODES.find((n) => n.id === "q-prob-foundations-start");
  const need = Math.ceil(foundations.length * 0.75);
  const storage = memoryStorage({ [STORAGE_KEYS.probability]: { completed: foundations.slice(0, need) } });
  assert.equal(createEvidenceReader({ storage, catalog })(node).fraction, 1);
});

test("Competition: only 'mastered' counts, and week ranges are respected", () => {
  const node = NODES.find((n) => n.id === "q-comp-foundations"); // weeks 1-4, all subjects, 75%
  const weeks14 = Object.values(catalog.competition.subjects).flat().filter((k) => Number(k.match(/^w(\d+)-/)[1]) <= 4);
  assert.equal(weeks14.length, 24);
  const mastery = {};
  weeks14.slice(0, 12).forEach((k) => { mastery[k] = "mastered"; });
  weeks14.slice(12, 24).forEach((k) => { mastery[k] = "practiced"; }); // practiced is NOT mastery
  mastery["w9-t0"] = "mastered"; // outside the range
  const storage = memoryStorage({ [STORAGE_KEYS.competition]: { mastery } });
  const result = createEvidenceReader({ storage, catalog })(node);
  assert.ok(Math.abs(result.fraction - 12 / 24 / 0.75) < 1e-9, `got ${result.fraction}`);
});

test("Course coverage: MT201 answered map, MT203 attempts, invalid ids ignored", () => {
  const mt201 = NODES.find((n) => n.id === "m-mt201-coverage");
  const answered = {};
  for (let i = 1; i <= 200; i++) answered[`ch01-q${i}`] = { choice: "a", correct: true, at: 1 };
  answered["ch01-q999"] = { choice: "a", correct: false, at: 1 }; // wrong answers do not count
  answered["zz99-q1"] = { choice: "a", correct: true, at: 1 };      // unknown chapter is ignored
  let storage = memoryStorage({ "mm-mt201-v1": { answered } });
  let result = createEvidenceReader({ storage, catalog })(mt201);
  assert.ok(Math.abs(result.fraction - 200 / 289 / 0.8) < 1e-9);

  const mt203 = NODES.find((n) => n.id === "m-mt203-coverage");
  const attempts = [];
  for (let i = 0; i < 100; i++) attempts.push({ q: `t1-q${i}`, correct: true, ts: 1 });
  attempts.push({ q: "t1-q0", correct: true, ts: 2 }); // repeat of the same question counts once
  storage = memoryStorage({ "mm-mt203-v1": { attempts } });
  result = createEvidenceReader({ storage, catalog })(mt203);
  assert.ok(Math.abs(result.fraction - 100 / 286 / 0.8) < 1e-9);

  storage = memoryStorage({ "mm-mt201-v1": { answered: [] } });
  assert.equal(createEvidenceReader({ storage, catalog })(mt201).known, false);
});

test("Course exam, Math Trainer 80-in-8 and global level", () => {
  const exam = NODES.find((n) => n.id === "m-mt201-exam");
  let result = createEvidenceReader({ storage: memoryStorage({ "mm-mt201-v1": { examBest: { score: 35, total: 50, at: 1 } } }), catalog })(exam);
  assert.ok(Math.abs(result.fraction - 0.7 / 0.7) < 1e-9, "35/50 = 70% meets the 70% target");
  result = createEvidenceReader({ storage: memoryStorage({ "mm-mt201-v1": { examBest: null } }), catalog })(exam);
  assert.equal(result.fraction, 0);

  const math = NODES.find((n) => n.id === "q-mental-40");
  const runs = [
    { mode: "test80", correct: 55, accuracy: 0.8 },   // too inaccurate: does not count
    { mode: "test80", correct: 30, accuracy: 0.95 },
    { mode: "drill", correct: 90, accuracy: 1 },       // not the 80-in-8 mode
  ];
  result = createEvidenceReader({ storage: memoryStorage({ [STORAGE_KEYS.mathRuns]: runs }), catalog })(math);
  assert.ok(Math.abs(result.fraction - 30 / 40) < 1e-9);
  runs.push({ mode: "test80", correct: 44, accuracy: 0.91 });
  result = createEvidenceReader({ storage: memoryStorage({ [STORAGE_KEYS.mathRuns]: runs }), catalog })(math);
  assert.equal(result.fraction, 1);
  assert.equal(createEvidenceReader({ storage: memoryStorage({ [STORAGE_KEYS.mathRuns]: "x" }), catalog })(math).known, false);

  const level = NODES.find((n) => n.id === "q-level-5");
  assert.equal(createEvidenceReader({ storage: memoryStorage(), catalog, readLevel: () => 1 })(level).fraction, 0);
  assert.equal(createEvidenceReader({ storage: memoryStorage(), catalog, readLevel: () => 3 })(level).fraction, 0.5);
  assert.equal(createEvidenceReader({ storage: memoryStorage(), catalog, readLevel: () => 9 })(level).fraction, 1);
  assert.equal(createEvidenceReader({ storage: memoryStorage(), catalog, readLevel: () => null })(level).known, false);
});

// ---------- manual store ----------
test("manual store: states, numbers, validation, unknown fields preserved", () => {
  const storage = memoryStorage({ [ROADMAP_STORAGE_KEY]: { schemaVersion: 1, futureField: { keep: true }, manual: {} } });
  assert.equal(setManualState(storage, "q-linalg", "done", 10).ok, true);
  assert.equal(setManualValue(storage, "q-cf-1200", 1130, 11).ok, true);
  assert.equal(setManualState(storage, "q-linalg", "bogus").error, "invalid-state");
  assert.equal(setManualValue(storage, "q-cf-1200", Number.NaN).error, "invalid-value");
  assert.equal(setManualState(storage, "Bad ID!", "done").error, "invalid-node-id");

  const manual = readManual(storage);
  assert.equal(manual["q-linalg"].state, "done");
  assert.equal(manual["q-cf-1200"].value, 1130);
  assert.deepEqual(JSON.parse(storage.getItem(ROADMAP_STORAGE_KEY)).futureField, { keep: true });
  assert.equal(setManualValue(storage, "q-cf-1200", null).ok, true);
  assert.equal(readManual(storage)["q-cf-1200"].value, null);
  assert.deepEqual(readManual(memoryStorage({ [ROADMAP_STORAGE_KEY]: "{broken" })), {});
  assert.equal(setManualState({ getItem() { return null; }, setItem() { throw new Error("quota"); } }, "q-linalg", "done").error, "storage-unavailable");
});

test("manual nodes drive status: logged number starts a node, done tick finishes it", () => {
  const storage = memoryStorage();
  setManualValue(storage, "q-cf-1200", 1100);
  setManualState(storage, "q-linalg", "doing");
  setManualState(storage, "q-python", "done");
  const result = evaluateWith(storage);
  assert.equal(result.nodes.get("q-cf-1200").status, STATUS.ACTIVE);
  assert.ok(Math.abs(result.nodes.get("q-cf-1200").fraction - 0.5) < 1e-9);
  assert.equal(result.nodes.get("q-linalg").status, STATUS.ACTIVE);
  assert.equal(result.nodes.get("q-python").status, STATUS.DONE);
  assert.equal(result.nodes.get("q-project").status, STATUS.READY, "python done unlocks the project");
});

// ---------- whole-map behaviour ----------
test("reading evidence never writes to storage", () => {
  const storage = memoryStorage({
    [STORAGE_KEYS.probability]: { completed: ["sample-space"] },
    [STORAGE_KEYS.competition]: { mastery: { "w1-t0": "mastered" } },
    "mm-mt201-v1": { answered: {} },
  });
  evaluateWith(storage, TODAY, 2);
  assert.deepEqual(storage.writes, []);
});

test("fresh browser: the first steps are ready, deep steps are locked, nothing is overdue-done", () => {
  const result = evaluateWith(memoryStorage());
  assert.equal(result.nodes.get("q-cf-1200").status, STATUS.READY);
  assert.equal(result.nodes.get("q-offer").status, STATUS.LOCKED);
  assert.equal(result.nodes.get("m-exit-route").status, STATUS.LOCKED);
  const quant = result.tracks.find((t) => t.track.id === "quant");
  assert.equal(quant.progress, 0);
  assert.equal(quant.doneCount, 0);
  assert.equal(quant.stages[0].state, STAGE_STATE.UPCOMING);
  assert.ok(quant.next.length > 0 && quant.next.length <= 5);
});

test("a fully completed browser marks every node done and every stage done", () => {
  const seed = {};
  seed[STORAGE_KEYS.probability] = { completed: [...new Set(Object.values(catalog.probability.pathways).flat())] };
  seed[STORAGE_KEYS.competition] = { mastery: Object.fromEntries(Object.values(catalog.competition.subjects).flat().map((k) => [k, "mastered"])) };
  seed[STORAGE_KEYS.mathRuns] = [{ mode: "test80", correct: 80, accuracy: 1 }];
  for (const course of ["mt201", "mt202"]) {
    const info = catalog.courses[course];
    const answered = {};
    for (const topic of info.topics) for (let i = 1; i <= topic.count; i++) answered[`${topic.id}-q${i}`] = { correct: true, at: 1 };
    seed[info.storageKey] = { answered, examBest: { score: 50, total: 50, at: 1 } };
  }
  seed[catalog.courses.mt203.storageKey] = {
    attempts: catalog.courses.mt203.topics.flatMap((t) => Array.from({ length: t.count }, (_, i) => ({ q: `${t.id}-q${i}`, correct: true, ts: 1 }))),
  };
  const storage = memoryStorage(seed);
  for (const node of NODES) {
    if (node.evidence.kind === "manual-check") setManualState(storage, node.id, "done");
    if (node.evidence.kind === "manual-number") setManualValue(storage, node.id, node.evidence.target);
  }
  const result = evaluateWith(storage, TODAY, 30);
  const notDone = [...result.nodes.values()].filter((m) => m.status !== STATUS.DONE).map((m) => `${m.node.id}:${m.fraction}`);
  assert.deepEqual(notDone, []);
  for (const track of result.tracks) {
    assert.equal(track.progress, 1);
    assert.ok(track.stages.every((s) => s.state === STAGE_STATE.DONE));
    assert.equal(track.next.length, 0);
  }
});

test("past-deadline unfinished stages are reported as behind; finished ones are not", () => {
  const late = evaluateWith(memoryStorage(), "2027-01-10");
  const quant = late.tracks.find((t) => t.track.id === "quant");
  assert.equal(quant.stages[0].state, STAGE_STATE.OVERDUE);
  assert.equal(quant.stages[1].state, STAGE_STATE.OVERDUE);
  assert.equal(quant.stages[2].state, STAGE_STATE.UPCOMING);
  assert.ok(quant.behind.length > 5);
  assert.equal(quant.next[0].overdue, true);
  const metallurgy = late.tracks.find((t) => t.track.id === "metallurgy");
  assert.equal(metallurgy.behind.length, 0, "no dates, so never behind");
});

console.log(`${passed} roadmap tests passed${process.exitCode ? " (with failures)" : ""}`);
