#!/usr/bin/env node
// Focused MCQ-QS v1.0 regression for all 37 source-grounded MT203 additions.
// This keeps the T1–T11 source-traceable items on the accepted-quality ratchet.
import { TOPIC_IDS } from "../app/mt203/types.ts";
import { checkQuestion, decisionFor } from "./lib/mcq-qs-rules.mjs";

const expected = [
  ["t9", "t9-29", "T9.4"],
  ["t9", "t9-30", "T9.4"],
  ["t9", "t9-31", "T9.6"],
  ["t9", "t9-32", "T9.6"],
  ["t9", "t9-33", "T9.6"],
  ["t9", "t9-34", "T9.7"],
  ["t9", "t9-35", "T9.7"],
  ["t10", "t10-37", "T10.1"],
  ["t10", "t10-38", "T10.1"],
  ["t10", "t10-39", "T10.1"],
  ["t10", "t10-40", "T10.1"],
  ["t10", "t10-41", "T10.1"],
  ["t10", "t10-42", "T10.2"],
  ["t10", "t10-43", "T10.2"],
  ["t10", "t10-44", "T10.3"],
  ["t10", "t10-45", "T10.8"],
  ["t11", "t11-34", "T11.3"],
  ["t11", "t11-35", "T11.3"],
  ["t11", "t11-36", "T11.3"],
  ["t11", "t11-37", "T11.3"],
  ["t11", "t11-38", "T11.3"],
  ["t11", "t11-39", "T11.3"],
  ["t11", "t11-40", "T11.4"],
  ["t11", "t11-41", "T11.3"],
  ["t11", "t11-42", "T11.7"],
  ["t11", "t11-43", "T11.6"],
  ["t11", "t11-44", "T11.6"],
  ["t11", "t11-45", "T11.6"],
  ["t11", "t11-46", "T11.6"],
  ["t1", "t1-33", "T1.5"],
  ["t1", "t1-34", "T1.1"],
  ["t3", "t3-23", "T3.2"],
  ["t3", "t3-24", "T3.3"],
  ["t4", "t4-31", "T4.3"],
  ["t6", "t6-23", "T6.3"],
  ["t7", "t7-17", "T7.4"],
  ["t8", "t8-31", "T8.4"],
];

const expectedAnswers = {
  "t1-33": "b",
  "t1-34": "c",
  "t3-23": "a",
  "t3-24": "c",
  "t4-31": "d",
  "t6-23": "b",
  "t7-17": "a",
  "t8-31": "d",
  "t9-29": "d",
  "t9-30": "a",
  "t9-31": "c",
  "t9-32": "b",
  "t9-33": "c",
  "t9-34": "a",
  "t9-35": "b",
  "t10-37": "c",
  "t10-38": "a",
  "t10-39": "d",
  "t10-40": "d",
  "t10-41": "b",
  "t10-42": "a",
  "t10-43": "b",
  "t10-44": "d",
  "t10-45": "c",
  "t11-34": "d",
  "t11-35": "c",
  "t11-36": "a",
  "t11-37": "b",
  "t11-38": "b",
  "t11-39": "d",
  "t11-40": "c",
  "t11-41": "c",
  "t11-42": "a",
  "t11-43": "d",
  "t11-44": "d",
  "t11-45": "a",
  "t11-46": "b",
};

const errors = [];
const warnings = [];
const byTopic = new Map();
for (const [topic, id, sub] of expected) {
  if (!TOPIC_IDS.includes(topic)) { errors.push(`${id}: unknown topic ${topic}`); continue; }
  if (!byTopic.has(topic)) {
    const src = (await import(`../app/data/qbank/${topic}.ts`)).default;
    byTopic.set(topic, src);
  }
  const src = byTopic.get(topic);
  const matches = src.questions.filter((q) => q.id === id);
  if (matches.length !== 1) { errors.push(`${id}: expected exactly one live question, found ${matches.length}`); continue; }
  const q = matches[0];
  if (q.sub !== sub) errors.push(`${id}: source subtopic ${q.sub} != ${sub}`);
  if (expectedAnswers[id] && q.answer !== expectedAnswers[id]) errors.push(`${id}: answer key ${q.answer} != audited key ${expectedAnswers[id]}`);
  if (!Number.isInteger(q.qsScore) || q.qsScore < 90) errors.push(`${id}: score must be at least 90, got ${q.qsScore}`);
  const result = checkQuestion(q, { subIds: new Set(src.subs.map((s) => s.id)) });
  for (const item of result.errors) errors.push(`${id} ${item.rule}: ${item.msg}`);
  for (const item of result.warnings) warnings.push(`${id} ${item.rule}: ${item.msg}`);
  if (!result.errors.length && !result.warnings.length) console.log(`${id}: ${decisionFor(q.qsScore)} (${q.qsScore}/100), MCQ-QS checks passed`);
}
for (const warning of warnings) errors.push(`heuristic review required — ${warning}`);
if (errors.length) {
  console.error(`MCQ-QS gap-addition audit FAILED (${errors.length} issue(s)):`);
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}
console.log(`PASS — ${expected.length} source-grounded MT203 additions meet MCQ-QS v1.0 without errors or heuristic warnings.`);
