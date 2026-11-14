import assert from "node:assert/strict";
import {
  classifyMistake,
  loadProgress,
  recordAnswer,
} from "../app/lib/mt203-progress.ts";

let progress = loadProgress();
progress = recordAnswer(progress, "t1-001", "A", false, "practice", 1250, 1, false);
const recorded = progress.attempts[progress.attempts.length - 1];
assert.equal(recorded.independent, true);
assert.equal(recorded.hintCount, 0);
assert.equal(recorded.mistakeCategory, undefined);

progress = classifyMistake(progress, "t1-001", recorded.ts, "observation", false);
const classified = progress.attempts[progress.attempts.length - 1];
assert.equal(classified.mistakeCategory, "observation");
assert.equal(classified.independent, true);
assert.equal(classified.hintCount, 0);

globalThis.window = {
  localStorage: {
    getItem: () => JSON.stringify({ attempts: [classified] }),
    setItem: () => {},
  },
};
const reloaded = loadProgress();
assert.equal(reloaded.attempts[0].mistakeCategory, "observation", "classification must survive storage sanitisation");
assert.equal(reloaded.attempts[0].independent, true, "independent evidence must survive reload");
assert.equal(reloaded.attempts[0].hintCount, 0);
delete globalThis.window;

const before = progress;
const unchanged = classifyMistake(progress, "t1-001", recorded.ts + 1, "conceptual", false);
assert.equal(unchanged, before, "unknown attempt timestamps must not alter progress");

const correct = recordAnswer(progress, "t1-002", "B", true, "practice", 900, 1, false);
const correctAttempt = correct.attempts[correct.attempts.length - 1];
const correctUnchanged = classifyMistake(correct, "t1-002", correctAttempt.ts, "conceptual", false);
assert.equal(correctUnchanged, correct, "correct attempts cannot be tagged as mistakes");

console.log("MT203 mistake classification and independent evidence: all assertions passed.");
