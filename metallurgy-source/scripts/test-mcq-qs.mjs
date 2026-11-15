#!/usr/bin/env node
// scripts/test-mcq-qs.mjs — proves the MCQ-QS rule engine catches what it should.
// Run: node scripts/test-mcq-qs.mjs
import assert from "node:assert/strict";
import { checkQuestion, decisionFor, levelCounts } from "./lib/mcq-qs-rules.mjs";

const ctx = { subIds: new Set(["T1.1", "T1.2"]) };
const W = "this wrong option reflects a recognisable and specific student mistake in detail";

// Fixture only (not part of the bank): a fully compliant question.
const good = () => ({
  id: "fx-01", type: "concept", diff: 2, qsLevel: 2, sub: "T1.2", qsScore: 88,
  text: "Why can a thermoplastic elastomer be remelted even though it recovers like rubber?",
  options: [
    { label: "a", text: "Its sulfur cross-links break at low temperature and re-form on cooling" },
    { label: "b", text: "Its rubber blocks crystallize at room temperature and the crystals melt" },
    { label: "c", text: "It is lightly cross-linked but weakly enough to flow when it is heated" },
    { label: "d", text: "Glassy end-block domains act as physical cross-links that soften on heating" },
  ],
  answer: "d",
  why: "The hard end-blocks phase-separate into glassy domains that act as physical cross-links, and they soften when heated so the material can flow.",
  distractors: { a: W, b: W, c: W },
  misconceptions: {
    a: { tag: "covalent-links-reversible", kind: "conceptual" },
    b: { tag: "crystalline-domain-confusion", kind: "conceptual" },
    c: { tag: "weak-means-reversible", kind: "conceptual" },
  },
});

const rules = (q) => ({ e: checkQuestion(q, ctx).errors.map((x) => x.rule), w: checkQuestion(q, ctx).warnings.map((x) => x.rule) });
let passed = 0;
const t = (name, fn) => { fn(); passed++; console.log("  ok  " + name); };

t("compliant question: no errors, no warnings", () => {
  const r = rules(good());
  assert.deepEqual(r.e, []); assert.deepEqual(r.w, []);
});
t("S1 three options", () => { const q = good(); q.options.pop(); q.answer = "a"; assert.ok(rules(q).e.includes("S1")); });
t("S2 answer key not among options", () => { const q = good(); q.answer = "z"; assert.ok(rules(q).e.includes("S2")); });
t("S3 all of the above", () => { const q = good(); q.options[0].text = "All of the above"; assert.ok(rules(q).e.includes("S3")); });
t("S4 missing wrong-option explanation", () => { const q = good(); delete q.distractors.b; assert.ok(rules(q).e.includes("S4")); });
t("S4 bare explanation (too short)", () => { const q = good(); q.distractors.a = "does not follow"; assert.ok(rules(q).e.includes("S4")); });
t("S5 missing misconception tag", () => { const q = good(); delete q.misconceptions.c; assert.ok(rules(q).e.includes("S5")); });
t("S5 bad tag format", () => { const q = good(); q.misconceptions.a.tag = "Not Kebab"; assert.ok(rules(q).e.includes("S5")); });
t("S5 bad kind", () => { const q = good(); q.misconceptions.a.kind = "careless"; assert.ok(rules(q).e.includes("S5")); });
t("S5 tag on the correct option", () => { const q = good(); q.misconceptions.d = { tag: "x-y", kind: "conceptual" }; assert.ok(rules(q).e.includes("S5")); });
t("S6 level out of range", () => { const q = good(); q.qsLevel = 6; assert.ok(rules(q).e.includes("S6")); });
t("S7 sub not in topic", () => { const q = good(); q.sub = "T9.9"; assert.ok(rules(q).e.includes("S7")); });
t("S8 score missing", () => { const q = good(); delete q.qsScore; assert.ok(rules(q).e.includes("S8")); });
t("S9 explanation too short", () => { const q = good(); q.why = "Because glassy domains."; assert.ok(rules(q).e.includes("S9")); });
t("S10 accepted score with other failures", () => { const q = good(); delete q.distractors.b; assert.ok(rules(q).e.includes("S10")); });
t("S10 not raised for a low score", () => { const q = good(); delete q.distractors.b; q.qsScore = 60; assert.ok(!rules(q).e.includes("S10")); });
t("H1 correct option uniquely longest", () => {
  const q = good(); q.options[3].text += " and then reform when the material is cooled back down again";
  assert.ok(rules(q).w.includes("H1"));
});
t("H2 absolute-word tell", () => {
  const q = good(); q.options[0].text = "Its cross-links always break at low temperature and never re-form on cooling";
  q.options[1].text = "Its rubber blocks must crystallize at room temperature and the crystals melt";
  assert.ok(rules(q).w.includes("H2"));
});
t("H3 numerical stem without rounding", () => {
  const q = good(); q.type = "numerical"; q.text = "Compute DP_n for Mn = 22,600 g/mol and a repeat unit of 113 g/mol.";
  assert.ok(rules(q).w.includes("H3"));
  q.text += " Give the nearest integer."; assert.ok(!rules(q).w.includes("H3"));
});
t("H4 negative stem needs emphasis", () => {
  const q = good(); q.text = "Which statement about elastomers is not correct?"; assert.ok(rules(q).w.includes("H4"));
  q.text = "Which statement about elastomers is NOT correct?"; assert.ok(!rules(q).w.includes("H4"));
});
t("H5 thin wrong-option explanation", () => {
  const q = good(); q.distractors.a = "That is not how covalent bonds behave on heating."; assert.ok(rules(q).w.includes("H5"));
});
t("decision bands follow the standard", () => {
  assert.equal(decisionFor(95), "excellent"); assert.equal(decisionFor(80), "good");
  assert.equal(decisionFor(79), "revise"); assert.equal(decisionFor(69), "reject"); assert.equal(decisionFor(undefined), "unscored");
});
t("levelCounts ignores questions without a level", () => {
  assert.deepEqual(levelCounts([{ qsLevel: 1 }, { qsLevel: 3 }, { qsLevel: 3 }, {}]), [1, 0, 2, 0, 0]);
});
console.log(`\n${passed} tests passed`);
