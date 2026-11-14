#!/usr/bin/env node
// scripts/test-mt203-player-grading.mjs
//
// The Metallurgy player adapter test (app/learning-player/adapter.test.mjs) grades
// ONE synthetic question. That proves the adapter's logic, not that every real
// MT203 question is gradable. This test runs the production player adapter over
// the REAL bank, through the same MT203 course adapter the app uses:
//
//   - every question of every format is delivered with exactly one option label
//     the player can store, and the key is one of them
//   - grading the key is "correct" (score 1) and grading each other option is
//     "incorrect" (score 0) — for all 286 questions and every option
//   - an option label that does not exist is never graded correct
//   - each of the 11 formats is represented, so a format cannot silently fall
//     outside this check
//
// Run: node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON \
//        --import ./scripts/ts-resolve-hook.mjs scripts/test-mt203-player-grading.mjs

import { MT203_MANIFEST } from "../app/courses/manifests/mt203.ts";
import { createMt203Adapter } from "../app/courses/adapters/mt203.ts";
import { createMetallurgyPlayerAdapter } from "../app/learning-player/adapter.ts";
import { TYPE_ORDER } from "../app/mt203/types.ts";

let passed = 0;
let failed = 0;
const ok = (cond, msg) => {
  if (cond) passed++;
  else { failed++; console.error(`  ✗ ${msg}`); }
};

const course = createMt203Adapter(MT203_MANIFEST);
const player = createMetallurgyPlayerAdapter("mt203");

const questions = [];
for (const topic of MT203_MANIFEST.topics) {
  const content = await course.loadTopic(topic.id);
  ok(content.questions.length === topic.count, `${topic.id}: adapter serves ${topic.count} questions (got ${content.questions.length})`);
  questions.push(...content.questions);
}
ok(questions.length === 286, `adapter serves all 286 real questions (got ${questions.length})`);
ok(new Set(questions.map((q) => q.id)).size === questions.length, "question ids are unique across the bank");

const perType = Object.fromEntries(TYPE_ORDER.map((t) => [t, { questions: 0, graded: 0 }]));
let gradings = 0;
for (const q of questions) {
  const labels = q.options.map((o) => o.label);
  ok(labels.includes(q.answer), `${q.id}: key "${q.answer}" is one of the options`);
  ok(player.questionId(q) === q.id, `${q.id}: player keeps the source question id`);

  const right = player.grade(q, { kind: "single-choice", optionId: q.answer });
  ok(right.correct === true && right.score === 1 && right.status === "correct", `${q.id}: the key grades correct`);
  gradings++;
  for (const label of labels.filter((l) => l !== q.answer)) {
    const wrong = player.grade(q, { kind: "single-choice", optionId: label });
    ok(wrong.correct === false && wrong.score === 0 && wrong.status === "incorrect", `${q.id}: option ${label} grades incorrect`);
    gradings++;
  }
  const ghost = player.grade(q, { kind: "single-choice", optionId: "z" });
  ok(ghost.correct === false, `${q.id}: a label that does not exist is never correct`);

  if (perType[q.type]) {
    perType[q.type].questions++;
    perType[q.type].graded++;
  } else ok(false, `${q.id}: format "${q.type}" is not in TYPE_ORDER`);
}
for (const t of TYPE_ORDER) ok(perType[t].questions > 0, `format "${t}" appears in the real bank and was graded (${perType[t].questions} questions)`);
ok(player.canRetry(questions[0]) === true, "MT203 allows retry");

console.log(`\nGraded ${gradings} real option selections across ${questions.length} questions in ${TYPE_ORDER.length} formats.`);
console.log(`${failed === 0 ? "PASS" : "FAIL"} — ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
