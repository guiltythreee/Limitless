import assert from "node:assert/strict";
import { adaptMT203Question } from "../adapters/mt203.mjs";
import { validateQuestion } from "../core/validate.mjs";

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
console.log("5 MT203 adapter tests passed");
