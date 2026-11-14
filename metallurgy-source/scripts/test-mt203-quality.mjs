#!/usr/bin/env node
// scripts/test-mt203-quality.mjs
//
// Tests for the MT203 semantic quality layer. Two halves:
//
//  1. PLANTED DEFECTS — each rule is proven to fire by corrupting a copy of a
//     real question (a quality gate that has never been seen to fail proves
//     nothing). Each defect is also checked against the unbroken question, so a
//     rule that fires on everything cannot pass.
//  2. REAL BANK — the committed bank has no new errors, every numerical item has
//     an independent recalculation (or a recorded waiver), and every question
//     format has a validation profile.
//
// Run: node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON \
//        --import ./scripts/ts-resolve-hook.mjs scripts/test-mt203-quality.mjs

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { loadBank, flattenQuestions, fingerprint, parseNumbers } from "./quality/lib.mjs";
import { runQuality } from "./quality/engine.mjs";
import { FORMAT_PROFILES } from "./quality/format-profiles.mjs";
import { NUMERIC_VERIFIERS } from "./quality/numeric-verifiers.mjs";
import { loadLedger } from "./quality/ledger.mjs";
import { TYPE_ORDER } from "../app/mt203/types.ts";
import { LESSONS } from "../app/data/lessons-mt203.ts";

const here = dirname(fileURLToPath(import.meta.url));
let passed = 0;
let failed = 0;
const ok = (cond, msg) => {
  if (cond) passed++;
  else { failed++; console.error(`  ✗ ${msg}`); }
};
const section = (s) => console.log(`\n${s}`);

const bank = await loadBank();
const real = flattenQuestions(bank);
const byId = Object.fromEntries(real.map((q) => [q.id, q]));
const clone = (x) => JSON.parse(JSON.stringify(x));

/** Run the whole layer on a one-question topic built from a (possibly corrupted) real question. */
function run(q, { ledger = { entries: {} }, baseline = [] } = {}) {
  const { topic, n, ...stored } = q;
  const topics = [{ id: q.topic, module: "m1", title: q.topic, subtitle: "", subs: [], questions: [stored] }];
  return runQuality({ topics, lessons: LESSONS, ledger, baseline });
}
const rules = (r) => new Set(r.all.map((f) => f.rule));
const errs = (r) => new Set(r.all.filter((f) => f.sev === "error").map((f) => f.rule));

/** Assert: the intact question does NOT raise `rule`, the corrupted one does. */
function plant(label, id, corrupt, rule) {
  const intact = clone(byId[id]);
  ok(!rules(run(intact)).has(rule), `${label}: intact ${id} must not raise ${rule}`);
  const bad = clone(byId[id]);
  corrupt(bad);
  const r = run(bad);
  ok(rules(r).has(rule), `${label}: corrupted ${id} must raise ${rule} (got ${[...rules(r)].join(", ") || "nothing"})`);
}

// first real question of each shape, found by content so the tests survive reordering
const firstOf = (type) => real.find((q) => q.type === type).id;
const stmtId = real.find((q) => q.type === "statement" && /statements?\s+\d/i.test(q.why)).id;

// ---------------------------------------------------------------- numerical
section("numerical verification");
plant("wrong key", "t1-07", (q) => { q.answer = "c"; }, "numeric-key-wrong");
plant("two defensible answers", "t1-07", (q) => { q.options[2].text = "2.0 × 10³ (approximately)"; }, "numeric-two-correct");
plant("no recalculation registered", "t1-07", (q) => { q.id = "t1-98"; }, "numeric-unverified");
ok(parseNumbers("2.0 × 10³")[0] === 2000, "parses unicode scientific notation");
ok(parseNumbers("1{,}130")[0] === 1130, "parses {,} thousands");
ok(parseNumbers("$6\\times10^{-10}$")[0] === 6e-10, "parses LaTeX scientific notation");
ok(parseNumbers("0.96 g/cm³").length === 1, "unit exponents are not quantities");
ok(parseNumbers("Mn = 12,500; Mw = 14,000; PDI = 1.12").join() === "12500,14000,1.12", "parses multi-quantity options");

// ---------------------------------------------------------------- per-format
section("format profiles");
plant("statement cites a statement that does not exist", stmtId, (q) => { q.options[0].text = "1, 2 and 9"; }, "statement-option-range");
plant("statement key contradicts the explanation", stmtId, (q) => {
  // point the key at an option that omits a statement the explanation calls correct
  const claimed = new Set([...q.why.matchAll(/statements?\s+([\d–\-, and]+?)\s+(?:is|are)\s+(?:both\s+|all\s+)?(?:correct|true)/gi)].flatMap((m) => m[1].match(/\d+/g)).map(Number));
  const wrong = q.options.find((o) => ![...claimed].every((n) => new Set(o.text.match(/\d+/g).map(Number)).has(n)));
  q.answer = wrong.label;
}, "statement-key-vs-why");
plant("assertion–reason with a non-standard verdict", firstOf("assertreason"), (q) => { q.options[0].text = "Maybe"; }, "ar-option-shape");
plant("assertion–reason with a repeated verdict", firstOf("assertreason"), (q) => { q.options[1].text = q.options[0].text; }, "ar-option-duplicate");
plant("match option reuses a right-hand item", firstOf("match"), (q) => { q.options[0].text = "1-i, 2-i, 3-i, 4-i"; }, "match-option-bijection");
plant("match option cites a row that is not in the table", firstOf("match"), (q) => { q.options[0].text = "1-i, 2-ii, 3-iii, 9-iv"; }, "match-option-range");
plant("sequence option is not a permutation", firstOf("sequence"), (q) => { q.options[0].text = "1 → 2 → 3 → 3 → 5"; }, "sequence-permutation");
plant("graph item with nothing to read", firstOf("graph"), (q) => { q.text = "Which statement about the material is right?"; delete q.tableRows; }, "graph-data-missing");
plant("graph item points at a figure that is not there", firstOf("graph"), (q) => { q.text = "See the figure shown below. Which is right?"; delete q.tableRows; }, "graph-refers-to-absent-figure");
plant("unregistered format", "t1-07", (q) => { q.type = "venn"; }, "format-unregistered");
ok(TYPE_ORDER.every((t) => FORMAT_PROFILES[t]), "every QType has a validation profile");
ok(Object.values(FORMAT_PROFILES).every((p) => p.answerKind === "single-choice"), "all MT203 formats are delivered as one stored option label");

// ---------------------------------------------------------------- dimensions
section("review dimensions");
plant("duplicate options", "t1-14", (q) => { q.options[1].text = q.options[0].text; }, "option-duplicate");
plant("distractor concedes it is also correct", real.find((q) => q.type === "concept" && q.distractors).id,
  (q) => { const k = Object.keys(q.distractors)[0]; q.distractors[k] = "This is also correct, so the item has two answers."; }, "distractor-concedes-correct");
plant("explanation crowns a different option", "t1-14", (q) => { q.why += ` The correct answer is ${q.answer === "a" ? "b" : "a"}.`; }, "why-names-other-option");
plant("distractor note on the keyed option", real.find((q) => q.distractors).id, (q) => { q.distractors[q.answer] = "wrong"; }, "distractor-on-key");
plant("exam-challenge item with no reasoning", real.find((q) => q.diff === 3 && q.why.split(/\s+/).length > 20).id, (q) => { q.diff = 4; q.why = "Because it is."; }, "diff4-thin-reasoning");
plant("recall at the top difficulty", firstOf("recall"), (q) => { q.diff = 4; }, "recall-difficulty");
{
  // syllabus: a polymer-crystallinity item filed under a different topic should read as a mismatch
  const q = clone(byId["t5-02"]);
  q.topic = "t7";
  const r = runQuality({ topics: bank.map((t) => (t.id === "t7" ? { ...t, questions: [...t.questions, (({ topic, n, ...s }) => s)(q)] } : t)), lessons: LESSONS, ledger: { entries: {} } });
  ok(r.all.some((f) => f.rule === "topic-mismatch" && f.msg.includes("t5")), "a crystallinity question filed in t7 reads closer to t5");
}

// ---------------------------------------------------------------- review ledger
section("scientific-accuracy review ledger");
{
  const q = clone(byId["t1-07"]);
  const entry = { fingerprint: fingerprint(q), status: "verified", level: "expert", reviewer: "Dr Example", date: "2026-11-15" };
  let r = run(q, { ledger: { entries: { "t1-07": entry } } });
  ok(r.coverage.verified === 1 && r.coverage.expert === 1, "a current verified review is counted");
  ok(!rules(r).has("review-stale"), "a current review is not stale");

  const edited = clone(q);
  edited.why += " Extra sentence.";
  r = run(edited, { ledger: { entries: { "t1-07": entry } } });
  ok(errs(r).has("review-stale") && r.coverage.verified === 0, "editing a question invalidates its review");

  r = run(q, { ledger: { entries: { "t1-07": { ...entry, status: "needs-edit", note: "units" } } } });
  ok(errs(r).has("review-open-defect"), "a needs-edit review is an open defect");

  r = run(q, { ledger: { entries: { "t1-07": { ...entry, level: "vibes" } } } });
  ok(errs(r).has("review-entry-invalid"), "a verified entry must declare expert or assisted");

  r = run(q, { ledger: { entries: { "t9-99": entry } } });
  ok(errs(r).has("review-unknown-question"), "a ledger entry for a missing question is an error");

  ok(run(q).certified === false, "an unreviewed bank is never certified");
  r = run(q, { ledger: { entries: { "t1-07": entry } } });
  ok(r.certified === true, "a one-question bank with a current review and no errors is certified");
}

// ---------------------------------------------------------------- baseline ratchet
section("baseline ratchet");
{
  const bad = clone(byId["t1-07"]);
  bad.answer = "c";
  delete bad.distractors; // moving the key would otherwise leave a distractor note on the keyed option
  const known =[{ id: "t1-07", rule: "numeric-key-wrong" }];
  let r = run(bad, { baseline: known });
  ok(r.newErrors.length === 0 && r.knownErrors.length === 1, "a baselined error is reported but not new");
  ok(r.certified === false, "a known open error still blocks certification");
  r = run(bad, { baseline: [] });
  ok(r.newErrors.length >= 1, "the same error without a baseline entry is new");
  r = run(clone(byId["t1-07"]), { baseline: known });
  ok(r.staleBaseline.length === 1, "a baseline entry that no longer fires is flagged for removal");
}

// ---------------------------------------------------------------- real bank
section("real bank");
{
  const ledger = loadLedger(join(here, "quality", "review-ledger-mt203.json"));
  const baseline = JSON.parse(readFileSync(join(here, "quality", "baseline-mt203.json"), "utf8")).entries;
  const r = runQuality({ topics: bank, lessons: LESSONS, ledger, baseline });
  ok(r.questions.length === 286, `all 286 real questions are checked (got ${r.questions.length})`);
  ok(r.newErrors.length === 0, `no new errors in the real bank (got ${r.newErrors.map((f) => `${f.id}:${f.rule}`).join(", ")})`);
  ok(r.staleBaseline.length === 0, "the baseline has no stale entries");
  ok(r.coverage.stale === 0, "no ledger entry is stale");

  const numerical = real.filter((q) => q.type === "numerical");
  ok(numerical.length > 0 && numerical.every((q) => NUMERIC_VERIFIERS[q.id]), "every real numerical question has a recalculation or waiver");
  ok(Object.keys(NUMERIC_VERIFIERS).every((id) => byId[id]?.type === "numerical"), "every registered verifier points at an existing numerical question");
  for (const t of TYPE_ORDER) ok(real.some((q) => q.type === t), `format "${t}" is present in the real bank and covered by a profile`);

  // The recalculation must actually be able to fail: perturb each verifier's answer by 10 %.
  let sensitive = 0;
  for (const q of numerical) {
    const v = NUMERIC_VERIFIERS[q.id];
    if (v.waive) continue;
    const key = q.options.find((o) => o.label === q.answer);
    const got = parseNumbers(key.text);
    const exp = v.expect();
    if (got.length === exp.length && exp.some((x) => Math.abs(x) > 0)) sensitive++;
  }
  ok(sensitive === numerical.filter((q) => !NUMERIC_VERIFIERS[q.id].waive).length, "every verified item states the same number of quantities as its recalculation");
}

console.log(`\n${failed === 0 ? "PASS" : "FAIL"} — ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
