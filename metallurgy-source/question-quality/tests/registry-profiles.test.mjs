import assert from "node:assert/strict";
import { validateQuestion, getProfile } from "../index.mjs";

const q = {
  id: "q-1", format: "single-choice", stem: "Which statement is correct?",
  options: [
    { id: "a", text: "Statement one" }, { id: "b", text: "Statement two" },
    { id: "c", text: "Statement three" }, { id: "d", text: "All of the above", correct: true },
  ],
  explanation: "All three statements follow from the governing principle.",
  source: { subtopic: "t1.1" }, difficulty: { level: 2, scale: 5 },
};

for (const id of ["general.single-choice.v1", "mt203.single-choice.v1"]) {
  const profile = getProfile(id);
  assert.equal(validateQuestion(q, profile).passed, true, `${id}: valid question`);
  assert.equal(validateQuestion({ ...q, format: "numerical" }, profile).passed, false, `${id}: format mismatch`);
  assert.equal(validateQuestion(null, profile).passed, false, `${id}: null record`);
  assert.equal(validateQuestion(undefined, profile).passed, false, `${id}: undefined record`);
}
console.log("4 registry-profile tests passed");
