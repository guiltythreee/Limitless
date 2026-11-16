#!/usr/bin/env node
// Focused MCQ-QS v1.0 regression for the eight source-grounded MT203 gap additions.
// This keeps the new source-traceable items on the accepted-quality ratchet.
import { TOPIC_IDS } from "../app/mt203/types.ts";
import { checkQuestion, decisionFor } from "./lib/mcq-qs-rules.mjs";

const expected = [
  ["t1", "t1-33", "T1.5"],
  ["t1", "t1-34", "T1.1"],
  ["t3", "t3-23", "T3.2"],
  ["t3", "t3-24", "T3.3"],
  ["t4", "t4-31", "T4.3"],
  ["t6", "t6-23", "T6.3"],
  ["t7", "t7-17", "T7.4"],
  ["t8", "t8-31", "T8.4"],
];

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
