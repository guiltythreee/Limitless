import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { adaptMT202Question } from "../adapters/mt202.mjs";
import { validateQuestion, getProfile } from "../index.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const dataRoot = resolve(here, "../../public/data/mt202");
const index = JSON.parse(readFileSync(resolve(dataRoot, "index.json"), "utf8"));
const profileByType = {
  A: "mt202.single-choice.v1",
  B: "mt202.statement-selection.v1",
  C: "mt202.assertion-reason.v1",
  D: "mt202.match.v1",
  E: "mt202.numerical.v1",
  F: "mt202.true-false.v1",
  G: "mt202.data-reading.v1",
};
const seen = new Set();
const counts = {};
let total = 0;

for (const row of index.chapters) {
  const chapter = JSON.parse(readFileSync(resolve(dataRoot, `${row.id}.json`), "utf8"));
  assert.equal(chapter.id, row.id);
  assert.equal(chapter.questions.length, row.count);

  for (const native of chapter.questions) {
    const normalized = adaptMT202Question(native, chapter);
    const profile = getProfile(profileByType[native.type]);
    const result = validateQuestion(normalized, profile);

    assert.equal(result.passed, true,
      `${chapter.id} Q${native.n} (${native.type}): ${result.issues.map(x => x.rule + " " + x.message).join("; ")}`);
    assert.equal(normalized.id, `${chapter.id}-q${native.n}`);
    assert.equal(normalized.options.filter(o => o.correct).length, 1);
    assert.equal(normalized.difficulty.scale, 3);
    assert.equal(normalized.source.course, "MT202");
    assert.equal(normalized.metadata.nativeType, native.type);
    assert.ok(normalized.explanation.trim().length > 0);

    assert.ok(!seen.has(normalized.id), `duplicate stable question id: ${normalized.id}`);
    seen.add(normalized.id);
    counts[native.type] = (counts[native.type] || 0) + 1;
    total++;
  }
}

assert.equal(total, 522, "all 522 MT202 records are covered");
assert.deepEqual(counts, { B: 133, A: 122, E: 84, D: 21, F: 13, C: 52, G: 97 });

const fixtureChapter = { id: "ch01", title: "Atomic Structure and Interatomic Bonding" };
const assertionReason = adaptMT202Question({
  n: 14, type: "C", stars: 2, assertion: "Assertion text", reason: "Reason text",
  options: [{ label: "a", text: "A" }, { label: "b", text: "B" }, { label: "c", text: "C" }, { label: "d", text: "D" }],
  answer: "c", keyExplanation: "The reason correctly explains the assertion.",
}, fixtureChapter);
assert.equal(assertionReason.stem, "Assertion text\\nReason text");
assert.throws(() => adaptMT202Question({ n: 1, type: "X" }, fixtureChapter), /Unsupported MT202 question type/);

console.log(`MT202 adapter: ${total} source questions passed across 7 native types`);
