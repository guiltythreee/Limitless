import assert from "node:assert/strict";
import {
  createLearningPlayerState,
  reduceLearningPlayerState,
} from "./state.ts";

let state = createLearningPlayerState();
assert.deepEqual(state, { index: 0, phase: "answering", elapsedMs: 0 });

state = reduceLearningPlayerState(state, { type: "tick", elapsedMs: 1250.6 });
assert.equal(state.elapsedMs, 1251);

state = reduceLearningPlayerState(state, { type: "submit" });
assert.equal(state.phase, "review");
assert.equal(
  reduceLearningPlayerState(state, { type: "tick", elapsedMs: 9000 }),
  state,
  "elapsed time must not advance after submission"
);

state = reduceLearningPlayerState(state, { type: "next", questionCount: 3 });
assert.deepEqual(state, { index: 1, phase: "answering", elapsedMs: 0 });

state = reduceLearningPlayerState(state, { type: "previous" });
assert.equal(state.index, 0);
state = reduceLearningPlayerState(state, { type: "previous" });
assert.equal(state.index, 0, "previous must clamp at the first question");

state = reduceLearningPlayerState(state, { type: "next", questionCount: 1 });
assert.equal(state.index, 0, "next must clamp at the last question");

state = reduceLearningPlayerState(state, { type: "tick", elapsedMs: -10 });
assert.equal(state.elapsedMs, 0, "elapsed time must not be negative");

state = reduceLearningPlayerState(state, { type: "reset-question" });
assert.deepEqual(state, { index: 0, phase: "answering", elapsedMs: 0 });

state = reduceLearningPlayerState(state, { type: "next", questionCount: 0 });
assert.equal(state.index, 0, "empty queues must stay at index zero");

console.log("P6 player lifecycle: 13 assertions passed");
