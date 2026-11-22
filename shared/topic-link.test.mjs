import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const TL = require("./topic-link.js");

// A tiny in-memory stand-in for localStorage; counts writes so we can prove "no change, no write".
function memoryStore() {
  const data = new Map();
  return { data, writes: 0,
    get(key) { return data.has(key) ? data.get(key) : null; },
    set(key, value) { this.writes++; data.set(key, value); } };
}
// One side's view of the world: a plain map of link id -> level.
function sideAdapter(initial = {}) {
  const levels = { ...initial };
  return { levels, sets: [],
    get(link) { return levels[link.id] || "not-started"; },
    set(link, level) { levels[link.id] = level; this.sets.push([link.id, level]); } };
}

// ---- 1. The link table is a clean 1:1 pairing --------------------------------------------
assert.ok(TL.LINKS.length >= 8, "expected the overlapping topics to be linked");
assert.equal(new Set(TL.LINKS.map((l) => l.id)).size, TL.LINKS.length, "link ids must be unique");
assert.equal(new Set(TL.LINKS.map((l) => l.subject + ":" + l.week)).size, TL.LINKS.length,
  "no two CP modules may share one regionals topic (that would make two-way sync ambiguous)");
for (const link of TL.LINKS) {
  assert.equal(link.id, link.cp, "link id is the CP module id");
  assert.ok(["logic", "combinatorics", "probability", "graphs", "dp", "coding"].includes(link.subject), link.id);
  assert.ok(Number.isInteger(link.week) && link.week >= 1 && link.week <= 16, link.id + " week must be 1..16");
  assert.ok(link.label && link.label.length > 3, link.id + " needs a human-readable label");
}

// ---- 2. CP ticks -> shared level ------------------------------------------------------------
const lvl = (concept, cpp, practice) =>
  TL.cpLevel({ "m:concept": concept, "m:cpp": cpp, "m:practice": practice }, "m");
assert.equal(lvl(false, false, false), "not-started");
assert.equal(lvl(true, false, false), "learning");
assert.equal(lvl(false, true, false), "learning", "C++ studied alone is still only learning");
assert.equal(lvl(true, true, false), "learning", "no practice yet means still learning");
assert.equal(lvl(true, false, true), "practiced");
assert.equal(lvl(false, false, true), "practiced", "practice done is practiced");
assert.equal(lvl(true, true, true), "mastered");

// ---- 3. Shared level -> CP ticks, and it round-trips ----------------------------------------
const combos = [];
for (const c of [false, true]) for (const p of [false, true]) for (const r of [false, true]) combos.push({ concept: c, cpp: p, practice: r });
for (const current of combos) {
  for (const target of ["not-started", "learning", "practiced", "mastered"]) {
    const next = TL.cpChecksFor(current, target);
    const back = TL.cpLevel({ "m:concept": next.concept, "m:cpp": next.cpp, "m:practice": next.practice }, "m");
    assert.equal(back, target, `ticks ${JSON.stringify(current)} -> ${target} must read back as ${target}`);
  }
  const same = TL.cpChecksFor(current, TL.cpLevel({ "m:concept": current.concept, "m:cpp": current.cpp, "m:practice": current.practice }, "m"));
  assert.deepEqual(same, current, "when the level already matches, the individual ticks are left exactly as they are");
}

// ---- 4. First contact -----------------------------------------------------------------------
{
  const store = memoryStore(), cp = sideAdapter({ "bfs-dfs": "learning" });
  const result = TL.reconcile("cp", cp, store, 1000);
  assert.deepEqual(result.applied, [], "a first visit with nothing to compare against changes nothing");
  assert.equal(cp.sets.length, 0);
}
{
  // Regionals already had 'practiced' before this feature; CP has nothing. Higher level wins.
  const store = memoryStore(), reg = sideAdapter({ "bfs-dfs": "practiced" }), cp = sideAdapter();
  TL.reconcile("reg", reg, store, 1000);
  const result = TL.reconcile("cp", cp, store, 2000);
  assert.equal(cp.levels["bfs-dfs"], "practiced", "CP adopts the higher pre-existing level instead of erasing it");
  assert.ok(result.applied.some((l) => l.id === "bfs-dfs"));
  TL.reconcile("reg", reg, store, 3000);
  assert.equal(reg.levels["bfs-dfs"], "practiced", "regionals keeps its level");
}
{
  // The reverse: CP is ahead, regionals visits second.
  const store = memoryStore(), cp = sideAdapter({ dp: "mastered" }), reg = sideAdapter({ dp: "learning" });
  TL.reconcile("cp", cp, store, 1000);
  TL.reconcile("reg", reg, store, 2000);
  assert.equal(reg.levels.dp, "mastered");
}

// ---- 5. Edits travel both ways ----------------------------------------------------------------
{
  const store = memoryStore(), cp = sideAdapter(), reg = sideAdapter();
  TL.reconcile("cp", cp, store, 100); TL.reconcile("reg", reg, store, 100);
  cp.levels.sorting = "mastered";               // user ticks everything in the CP Learning Centre
  TL.reconcile("cp", cp, store, 200);           // CP page records the edit
  const result = TL.reconcile("reg", reg, store, 300); // regionals page opens later
  assert.equal(reg.levels.sorting, "mastered", "a CP edit appears in regionals");
  assert.deepEqual(result.applied.map((l) => l.id), ["sorting"]);
  reg.levels.sorting = "practiced";             // user lowers it from the regionals dropdown
  TL.reconcile("reg", reg, store, 400);
  TL.reconcile("cp", cp, store, 500);
  assert.equal(cp.levels.sorting, "practiced", "a regionals edit appears in CP, including a downgrade");
}

// ---- 6. Conflicts: the most recent edit wins -----------------------------------------------------
{
  const store = memoryStore(), cp = sideAdapter(), reg = sideAdapter();
  TL.reconcile("cp", cp, store, 100); TL.reconcile("reg", reg, store, 100);
  cp.levels.dsu = "mastered";  TL.reconcile("cp", cp, store, 200);   // edited first (e.g. offline tab)
  reg.levels.dsu = "learning"; TL.reconcile("reg", reg, store, 300); // edited later, and lower
  TL.reconcile("cp", cp, store, 400);
  assert.equal(cp.levels.dsu, "learning", "the later edit wins, even when it lowers the level");
  assert.equal(reg.levels.dsu, "learning");
}

// ---- 7. Late first contact never wipes pre-existing progress ----------------------------------------
{
  const store = memoryStore(), cp = sideAdapter(), reg = sideAdapter({ "shortest-paths": "mastered" });
  TL.reconcile("cp", cp, store, 100);              // CP page visited first, regionals never opened yet
  cp.levels["shortest-paths"] = "learning";
  TL.reconcile("cp", cp, store, 200);              // a small CP edit made before regionals has ever synced
  TL.reconcile("reg", reg, store, 300);            // regionals first visit holds the higher, older level
  assert.equal(reg.levels["shortest-paths"], "mastered", "regionals keeps the higher level it already had");
  TL.reconcile("cp", cp, store, 400);
  assert.equal(cp.levels["shortest-paths"], "mastered", "and CP then follows it");
}

// ---- 8. Quiet when nothing changed ---------------------------------------------------------------------
{
  const store = memoryStore(), cp = sideAdapter({ dp: "learning" }), reg = sideAdapter({ dp: "learning" });
  TL.reconcile("cp", cp, store, 100); TL.reconcile("reg", reg, store, 100);
  const writesBefore = store.writes;
  const a = TL.reconcile("cp", cp, store, 500), b = TL.reconcile("reg", reg, store, 600);
  assert.equal(store.writes, writesBefore, "an unchanged state must not rewrite the shared ledger (it syncs to the cloud)");
  assert.deepEqual([a.applied.length, b.applied.length], [0, 0]);
}

// ---- 9. Bad data cannot break a page ---------------------------------------------------------------------
{
  const store = memoryStore(); store.data.set(TL.LEDGER_KEY, "{not json");
  const cp = sideAdapter({ dp: "learning" });
  assert.doesNotThrow(() => TL.reconcile("cp", cp, store, 100), "a corrupt ledger is treated as empty");
  const odd = memoryStore(); odd.data.set(TL.LEDGER_KEY, JSON.stringify({ v: 1, links: { dp: { cp: { level: "banana", at: "x" } } } }));
  assert.doesNotThrow(() => TL.reconcile("reg", sideAdapter(), odd, 100));
  const skip = sideAdapter(); skip.get = () => null;   // a side that cannot find the topic
  assert.doesNotThrow(() => TL.reconcile("cp", skip, memoryStore(), 100), "an adapter that returns nothing is skipped");
}

console.log("Topic link: all assertions passed.");
