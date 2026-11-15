import assert from "node:assert/strict";
import { adaptMT203Question } from "../adapters/mt203.mjs";
import { validateQuestion } from "../core/validate.mjs";
import { getProfile } from "../index.mjs";

const topic = { id: "t1", module: "m1" };
const source = {
  id: "t1-01", type: "recall", diff: 1, text: "A polymer is built from:",
  options: [{ label: "a", text: "monomers" }, { label: "b", text: "repeat units" },
    { label: "c", text: "oligomers" }, { label: "d", text: "ions" }],
  answer: "a", why: "Monomers are the small reactive molecules that link together to form polymer chains.",
};
const normalized = adaptMT203Question(source, topic);
assert.equal(normalized.id, source.id);
assert.equal(normalized.options.filter(o => o.correct).length, 1);
assert.equal(normalized.difficulty.scale, 4);
assert.equal(normalized.source.course, "MT203");
assert.equal(validateQuestion(normalized, {
  id: "test", rules: { optionCount: 4, requireExplanation: true, requireDifficulty: true },
}).passed, true);

const expectedFormats = {
  recall: "single-choice",
  concept: "single-choice",
  compare: "single-choice",
  apply: "single-choice",
  higher: "single-choice",
  numerical: "numerical",
  assertreason: "assertion-reason",
  statement: "statement-selection",
  match: "match",
  sequence: "sequence",
  graph: "graph-data",
};
for (const [type, format] of Object.entries(expectedFormats)) {
  assert.equal(adaptMT203Question({ ...source, type }, topic).format, format, type);
}
for (const format of new Set(Object.values(expectedFormats))) {
  assert.equal(getProfile(`mt203.${format}.v1`).format, format, `registered profile: ${format}`);
}
assert.throws(() => adaptMT203Question({ ...source, type: "unmapped" }, topic), /Unsupported MT203 question type/);
const assertionReason = adaptMT203Question({
  ...source, type: "assertreason", text: undefined,
  assertion: "Assertion text", reason: "Reason text",
}, topic);
assert.equal(assertionReason.stem, "Assertion text\nReason text");
assert.equal(assertionReason.metadata.assertion, "Assertion text");
assert.equal(assertionReason.metadata.reason, "Reason text");
assert.equal(validateQuestion(assertionReason, getProfile("mt203.assertion-reason.v1")).passed, true);

const statementQuestion = adaptMT203Question({
  ...source, type: "statement", statements: [
    { num: 1, text: "Statement one" }, { num: 2, text: "Statement two" },
  ],
}, topic);
assert.equal(statementQuestion.format, "statement-selection");
assert.equal(validateQuestion(statementQuestion, getProfile("mt203.statement-selection.v1")).passed, true);
assert.equal(validateQuestion({ ...statementQuestion, metadata: {} }, getProfile("mt203.statement-selection.v1")).passed, false);

const matchQuestion = adaptMT203Question({
  ...source, type: "match", tableRows: [["1", "Term", "", "Definition"]],
}, topic);
assert.equal(validateQuestion(matchQuestion, getProfile("mt203.match.v1")).passed, true);
assert.equal(validateQuestion({ ...matchQuestion, metadata: {} }, getProfile("mt203.match.v1")).passed, false);

console.log("MT203 adapter tests passed (native taxonomy mapping + unknown-type guard)");
