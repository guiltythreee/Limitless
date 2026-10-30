import assert from "node:assert/strict";
import {
  createLearningPlayerSession,
  navigatePlayer,
  selectPlayerQuestion,
  setPlayerAnswer,
  submitPlayerAnswer,
} from "./runtime.ts";
import { probabilityPlayerAdapter } from "../../probability-source/app/learning-player/adapter.ts";
import {
  allQuestions,
  correctSet,
  grade,
  isMulti,
} from "../../probability-source/app/lib/questions.ts";
import { createMetallurgyPlayerAdapter } from "../../metallurgy-source/app/learning-player/adapter.ts";

// Exercise the production Probability adapter and its real course grader.
const probabilitySingle = allQuestions.find((q) => !isMulti(q));
assert.ok(probabilitySingle, "the real Probability bank contains a single-choice question");
const singleCorrect = correctSet(probabilitySingle.item)[0];
let probability = createLearningPlayerSession([probabilitySingle]);
probability = setPlayerAnswer(probability, probabilityPlayerAdapter, {
  kind: "single-choice",
  optionId: String(singleCorrect),
});
const singleResult = submitPlayerAnswer(probability, probabilityPlayerAdapter, {
  submittedAt: 100,
  mode: "practice",
});
const expectedSingle = grade(probabilitySingle.item, [singleCorrect]);
assert.equal(singleResult.submission.grade.score, expectedSingle.score);
assert.equal(singleResult.submission.grade.status, expectedSingle.status);
assert.equal(singleResult.submission.question.courseId, "probability");

// Multi-select partial credit and over-selection must remain exactly the
// result of Probability's existing grade() implementation.
const probabilityMulti = allQuestions.find((q) =>
  isMulti(q) &&
  correctSet(q.item).length > 1 &&
  q.item.options.length > correctSet(q.item).length
);
assert.ok(probabilityMulti, "the real Probability bank contains a multi-select question");
const right = correctSet(probabilityMulti.item);
const wrong = probabilityMulti.item.options.findIndex((_, i) => !right.includes(i));
let multi = createLearningPlayerSession([probabilityMulti]);
multi = setPlayerAnswer(multi, probabilityPlayerAdapter, {
  kind: "multi-choice",
  optionIds: [String(right[0])],
});
const partial = submitPlayerAnswer(multi, probabilityPlayerAdapter, {
  submittedAt: 200,
  mode: "practice",
});
const expectedPartial = grade(probabilityMulti.item, [right[0]]);
assert.equal(partial.submission.grade.score, expectedPartial.score);
assert.equal(partial.submission.grade.status, expectedPartial.status);
assert.equal(partial.submission.grade.status, "partial");

// Probability permits a second attempt; the shared runtime retains both
// submissions while the production adapter remains the grading authority.
multi = navigatePlayer(partial.session, "previous");
multi = setPlayerAnswer(multi, probabilityPlayerAdapter, {
  kind: "multi-choice",
  optionIds: right.map(String),
});
const retried = submitPlayerAnswer(multi, probabilityPlayerAdapter, {
  submittedAt: 300,
  mode: "practice",
});
assert.equal(retried.submission.grade.correct, true);
assert.equal(retried.session.submissions.length, 2);

// Exercise the production Metallurgy adapter for all three course policies.
const metallurgyQuestion = {
  id: "ch01-q1",
  answer: "B",
  options: [{ label: "A", text: "wrong" }, { label: "B", text: "right" }],
};
for (const courseId of ["mt201", "mt202", "mt203"]) {
  const adapter = createMetallurgyPlayerAdapter(courseId);
  let session = createLearningPlayerSession([metallurgyQuestion]);
  session = setPlayerAnswer(session, adapter, {
    kind: "single-choice",
    optionId: "B",
  });
  const result = submitPlayerAnswer(session, adapter, {
    submittedAt: 400,
    mode: "exam",
  });
  assert.equal(result.submission.grade.correct, true);
  assert.equal(result.submission.question.courseId, courseId);

  session = navigatePlayer(result.session, "previous");
  const changed = setPlayerAnswer(session, adapter, {
    kind: "single-choice",
    optionId: "A",
  });
  if (courseId === "mt203") {
    assert.notEqual(changed, session, "MT203 retains its controlled retry capability");
    const retry = submitPlayerAnswer(changed, adapter, {
      submittedAt: 500,
      mode: "revision",
    });
    assert.equal(retry.submission.grade.correct, false);
    assert.equal(retry.session.submissions.length, 2);
  } else {
    assert.equal(changed, session, courseId + " remains locked after its first attempt");
    assert.equal(submitPlayerAnswer(changed, adapter, {
      submittedAt: 500,
      mode: "practice",
    }).submission, null);
  }
}

// An exam queue may contain unanswered questions. Only answered entries can
// be submitted; selecting an unanswered item must not inherit another answer.
let exam = createLearningPlayerSession([metallurgyQuestion, {
  ...metallurgyQuestion,
  id: "ch01-q2",
}]);
exam = setPlayerAnswer(exam, createMetallurgyPlayerAdapter("mt201"), {
  kind: "single-choice",
  optionId: "B",
});
exam = selectPlayerQuestion(exam, 1);
assert.equal(submitPlayerAnswer(exam, createMetallurgyPlayerAdapter("mt201"), {
  submittedAt: 600,
  mode: "exam",
}).submission, null);
exam = selectPlayerQuestion(exam, 0);
assert.equal(exam.answers["ch01-q1"].optionId, "B", "navigation retains the answer for later batch submission");

console.log("P6 cross-discipline runtime: 20 assertions passed");
