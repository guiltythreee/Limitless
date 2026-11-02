#!/usr/bin/env node
// Detect answer-position runs and local-window patterns in the MT203 four-option bank.
// This guard evaluates MCQs in learner-facing question order, not by aggregate counts alone.
import { TOPIC_IDS } from "../app/mt203/types.ts";

const errors = [];
const MAX_RUN = 3;
const WINDOW = 8;
const MAX_PER_WINDOW = 4;
let checked = 0;

for (const topicId of TOPIC_IDS) {
  const mod = await import(`../app/data/qbank/${topicId}.ts`);
  const questions = mod.default.questions.filter(
    (q) =>
      Array.isArray(q.options) &&
      q.options.length === 4 &&
      q.options.map((o) => o.label).join("") === "abcd" &&
      ["a", "b", "c", "d"].includes(q.answer),
  );
  checked += questions.length;
  const sequence = questions.map((q) => q.answer);
  let run = 0;
  let previous = "";
  for (let i = 0; i < sequence.length; i++) {
    run = sequence[i] === previous ? run + 1 : 1;
    previous = sequence[i];
    if (run > MAX_RUN) {
      errors.push(`${topicId} ${questions[i].id}: answer ${sequence[i].toUpperCase()} continues a run of ${run}`);
    }
  }

  for (let i = 0; i + WINDOW <= sequence.length; i++) {
    const counts = { a: 0, b: 0, c: 0, d: 0 };
    for (const answer of sequence.slice(i, i + WINDOW)) counts[answer]++;
    const values = Object.values(counts);
    if (Math.max(...values) > MAX_PER_WINDOW || Math.min(...values) < 1) {
      errors.push(`${topicId} MCQs ${i + 1}–${i + WINDOW}: unbalanced local window ${JSON.stringify(counts)}`);
    }
  }

  const seen = new Set();
  for (let i = 0; i + 4 <= sequence.length; i++) {
    const pattern = sequence.slice(i, i + 4).join("");
    if (seen.has(pattern)) errors.push(`${topicId} MCQs ${i + 1}–${i + 4}: repeated four-answer pattern ${pattern.toUpperCase()}`);
    seen.add(pattern);
  }
}

if (checked !== 286) errors.push(`Expected 286 four-option questions, found ${checked}`);
if (errors.length) {
  console.error(`Answer-sequence regression FAILED with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}
console.log(`Answer-sequence regression: ${checked} questions passed; maximum run ${MAX_RUN}, local-window balance and four-answer pattern checks passed.`);
