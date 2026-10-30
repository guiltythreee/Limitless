import assert from "node:assert/strict";
import {
  createLearningPlayerSession,
  navigatePlayer,
  setPlayerAnswer,
  submitPlayerAnswer,
  tickPlayer,
} from "./runtime.ts";

const singleQuestion = { id: "mt201-q1", correct: "B" };
const singleAdapter = {
  courseId: "mt201",
  questionId: (q) => q.id,
  grade: (q, answer) => ({
    correct: answer.optionId === q.correct,
    score: answer.optionId === q.correct ? 1 : 0,
    status: answer.optionId === q.correct ? "correct" : "incorrect",
  }),
};

let single = createLearningPlayerSession([singleQuestion]);
assert.equal(submitPlayerAnswer(single, singleAdapter, {
  submittedAt: 10, mode: "practice",
}).submission, null, "unanswered questions cannot be submitted");

single = setPlayerAnswer(single, singleAdapter, {
  kind: "single-choice", optionId: "B",
});
single = tickPlayer(single, 1250.4);
const singleResult = submitPlayerAnswer(single, singleAdapter, {
  submittedAt: 20, mode: "practice",
});
assert.equal(singleResult.submission.grade.correct, true);
assert.equal(singleResult.submission.elapsedMs, 1250);
assert.equal(singleResult.submission.question.courseId, "mt201");
assert.equal(singleResult.session.state.phase, "review");
assert.equal(submitPlayerAnswer(singleResult.session, singleAdapter, {
  submittedAt: 30, mode: "practice",
}).submission, null, "a reviewed question cannot be double-submitted");
assert.equal(setPlayerAnswer(singleResult.session, singleAdapter, {
  kind: "single-choice", optionId: "A",
}), singleResult.session, "answers are locked during review");

const multiQuestion = { id: "prob-lesson1:0", correct: [0, 2] };
const multiAdapter = {
  courseId: "probability",
  questionId: (q) => q.id,
  // Mirrors the Probability grader's result shape; the adapter is authoritative.
  grade: (q, answer) => {
    const hits = answer.optionIds.filter((i) => q.correct.includes(i)).length;
    const wrong = answer.optionIds.length - hits;
    const score = Math.max(0, (hits - wrong) / q.correct.length);
    return {
      correct: score === 1,
      score,
      status: score === 1 ? "correct" : score > 0 ? "partial" : "incorrect",
    };
  },
};

let multi = createLearningPlayerSession([multiQuestion]);
multi = setPlayerAnswer(multi, multiAdapter, {
  kind: "multi-choice", optionIds: [0],
});
const multiResult = submitPlayerAnswer(multi, multiAdapter, {
  submittedAt: 40, mode: "exam",
});
assert.equal(multiResult.submission.grade.score, 0.5);
assert.equal(multiResult.submission.grade.status, "partial");
assert.deepEqual(multiResult.submission.answer.optionIds, [0]);

// Probability permits retries: a later submission is a new attempt.
multi = navigatePlayer(multiResult.session, "previous");
multi = setPlayerAnswer(multi, multiAdapter, {
  kind: "multi-choice", optionIds: [0, 2],
});
const retry = submitPlayerAnswer(multi, multiAdapter, {
  submittedAt: 50, mode: "practice",
});
assert.equal(retry.submission.grade.correct, true);
assert.equal(retry.session.submissions.length, 2);

// Metallurgy locks a question after its first recorded answer.
const lockedAdapter = { ...singleAdapter, canRetry: () => false };
let locked = createLearningPlayerSession([singleQuestion, { ...singleQuestion, id: "q2" }]);
locked = setPlayerAnswer(locked, lockedAdapter, {
  kind: "single-choice", optionId: "B",
});
locked = submitPlayerAnswer(locked, lockedAdapter, {
  submittedAt: 60, mode: "practice",
}).session;
locked = navigatePlayer(locked, "next");
locked = navigatePlayer(locked, "previous");
assert.equal(setPlayerAnswer(locked, lockedAdapter, {
  kind: "single-choice", optionId: "A",
}), locked, "non-retryable course answers stay locked after revisiting");
assert.equal(submitPlayerAnswer(locked, lockedAdapter, {
  submittedAt: 70, mode: "practice",
}).submission, null, "non-retryable course submissions cannot duplicate");

const queue = createLearningPlayerSession([singleQuestion, { ...singleQuestion, id: "q2" }]);
assert.equal(navigatePlayer(queue, "next").state.index, 1);
assert.equal(navigatePlayer(queue, "previous").state.index, 0);
assert.equal(navigatePlayer(queue, "previous").state.index, 0);

console.log("P6 player runtime: 19 assertions passed");
