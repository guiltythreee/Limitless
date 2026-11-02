import assert from "node:assert/strict";
import {
  createLearningPlayerSession,
  navigatePlayer,
  selectPlayerQuestion,
  setPlayerAnswer,
  submitPlayerAnswer,
} from "./runtime.ts";
import { probabilityPlayerAdapter } from "../../probability-source/app/learning-player/adapter.ts";
import { grade } from "../../probability-source/app/lib/questions.ts";
import { createMetallurgyPlayerAdapter } from "../../metallurgy-source/app/learning-player/adapter.ts";

// Exercise the production Probability adapter and its real course grader.
const probabilitySingle = {
  key: "fixture:single",
  item: {
    question: "Choose one correct option",
    options: ["A", "B", "C"],
    answer: 1,
    explanation: "",
  },
};
const singleCorrect = 1;
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
const probabilityMulti = {
  key: "fixture:multi",
  item: {
    question: "Choose both correct options",
    options: ["A", "B", "C", "D"],
    answer: 0,
    answers: [0, 2],
    explanation: "",
  },
};
const right = probabilityMulti.item.answers;
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

// Selecting a wrong option in addition to both correct options must preserve
// the existing penalty rule: (2 hits - 1 wrong) / 2 correct = 0.5.
let overSelected = createLearningPlayerSession([probabilityMulti]);
overSelected = setPlayerAnswer(overSelected, probabilityPlayerAdapter, {
  kind: "multi-choice",
  optionIds: [String(right[0]), String(right[1]), "1"],
});
const overSelectionResult = submitPlayerAnswer(overSelected, probabilityPlayerAdapter, {
  submittedAt: 250,
  mode: "practice",
});
const expectedOverSelection = grade(probabilityMulti.item, [right[0], right[1], 1]);
assert.equal(overSelectionResult.submission.grade.score, expectedOverSelection.score);
assert.equal(overSelectionResult.submission.grade.status, expectedOverSelection.status);
assert.equal(overSelectionResult.submission.grade.score, 0.5);

// Invalid option identifiers must be rejected at the adapter boundary.
assert.throws(() => probabilityPlayerAdapter.grade(probabilityMulti, {
  kind: "multi-choice",
  optionIds: ["999"],
}), RangeError);

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

console.log("P6 cross-discipline runtime: 29 assertions passed");
