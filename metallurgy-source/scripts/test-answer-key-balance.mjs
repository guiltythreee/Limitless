#!/usr/bin/env node
// Regression guard against answer-position bias in the MT203 four-option bank.

import { TOPIC_IDS } from "../app/mt203/types.ts";

const errors = [];
const totals = { a: 0, b: 0, c: 0, d: 0 };
let checked = 0;
let maxTopicSpread = 0;

for (const topicId of TOPIC_IDS) {
  const mod = await import(`../app/data/qbank/${topicId}.ts`);
  const topic = mod.default;
  const questions = topic.questions.filter(
    (q) =>
      Array.isArray(q.options) &&
      q.options.length === 4 &&
      q.options.map((o) => o.label).join("") === "abcd" &&
      ["a", "b", "c", "d"].includes(q.answer),
  );
  const counts = { a: 0, b: 0, c: 0, d: 0 };
  for (const q of questions) {
    counts[q.answer]++;
    totals[q.answer]++;
    checked++;
  }
  const values = Object.values(counts);
  const spread = Math.max(...values) - Math.min(...values);
  maxTopicSpread = Math.max(maxTopicSpread, spread);
  if (spread > 1) {
    errors.push(`${topicId}: answer-position spread ${spread} exceeds 1 (${JSON.stringify(counts)})`);
  }
}

const globalValues = Object.values(totals);
const globalSpread = Math.max(...globalValues) - Math.min(...globalValues);
if (globalSpread > 1) {
  errors.push(`global answer-position spread ${globalSpread} exceeds 1 (${JSON.stringify(totals)})`);
}

if (errors.length) {
  console.error(`Answer-key balance FAILED with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}
console.log(
  `Answer-key balance: ${checked} four-option questions; A=${totals.a}, B=${totals.b}, C=${totals.c}, D=${totals.d}; global spread ${globalSpread}; maximum topic spread ${maxTopicSpread}. All checks passed.`,
);
