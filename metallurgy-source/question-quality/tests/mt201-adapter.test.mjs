import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { adaptMT201Question } from "../adapters/mt201.mjs";
import { validateQuestion, getProfile } from "../index.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const dataRoot = resolve(here, "../../public/data/mt201");
const index = JSON.parse(readFileSync(resolve(dataRoot, "index.json"), "utf8"));
const profileByType = {
  A: "mt201.single-choice.v1",
  B: "mt201.statement-selection.v1",
  C: "mt201.assertion-reason.v1",
  D: "mt201.match.v1",
  E: "mt201.numerical.v1",
  F: "mt201.true-false.v1",
};
const expectedCounts = { A: 219, B: 17, C: 13, D: 3, E: 112, F: 15 };
const seen = new Set();
const counts = {};
let total = 0;

for (const row of index.chapters) {
  const chapter = JSON.parse(readFileSync(resolve(dataRoot, `${row.id}.json`), "utf8"));
  assert.equal(chapter.id, row.id);
  assert.equal(chapter.questions.length, row.count);

  for (const native of chapter.questions) {
    const normalized = adaptMT201Question(native, chapter);
    const profile = getProfile(profileByType[native.type]);
    const result = validateQuestion(normalized, profile);

    assert.equal(result.passed, true,
      `${chapter.id} Q${native.n} (${native.type}): ${result.issues.map(x => x.rule + " " + x.message).join("; ")}`);
    assert.equal(normalized.id, `${chapter.id}-q${native.n}`);
    assert.equal(normalized.options.filter(o => o.correct).length, 1);
    assert.equal(normalized.difficulty.scale, 4);
    assert.ok(normalized.difficulty.level >= 1 && normalized.difficulty.level <= 4);
    assert.equal(normalized.source.course, "MT201");
    assert.equal(normalized.source.chapter, chapter.id);
    assert.equal(normalized.metadata.nativeType, native.type);
    assert.ok(normalized.explanation.trim().length > 0);

    assert.ok(!seen.has(normalized.id), `duplicate stable question id: ${normalized.id}`);
    seen.add(normalized.id);
    counts[native.type] = (counts[native.type] || 0) + 1;
    total++;
  }
}

assert.equal(total, index.total, "all indexed MT201 records are covered");
assert.equal(total, 379);
assert.deepEqual(counts, expectedCounts);

const fixtureChapter = { id: "ch01", title: "Foundations & System Concepts" };
const assertionReason = adaptMT201Question({
  n: 6, type: "C", stars: 2, assertion: "Assertion text", reason: "Reason text",
  options: [{ label: "a", text: "A" }, { label: "b", text: "B" }, { label: "c", text: "C" }, { label: "d", text: "D" }],
  answer: "b", detailed: "The reason correctly explains the assertion.",
}, fixtureChapter);
assert.equal(assertionReason.stem, "Assertion text\\nReason text");
assert.equal(assertionReason.difficulty.scale, 4);
assert.throws(() => adaptMT201Question({ n: 1, type: "X" }, fixtureChapter), /Unsupported MT201 question type/);

console.log(`MT201 adapter: ${total} source questions passed across 6 native types`);
