/* Regression tests for rounded-answer validation in the maths engine.
   Run from the repository root:
     node tools/math-refactored/test-math-answer-validation.cjs
*/
'use strict';

const assert = require('node:assert/strict');
const E = require('./engine.js');

// sqrt(2) is displayed to two decimal places as 1.41.
// Values that round to 1.41 should pass; values that round to 1.42 must not.
const q = E.GENERATORS.sqrtApprox(E.makeRng(0xA11CE), { lo: 2, hi: 2 });
assert.equal(q.answerText, '1.41');
assert.equal(E.checkAnswer(q, '1.41', true).status, 'correct');
assert.equal(E.checkAnswer(q, '1.414', true).status, 'correct');
assert.equal(E.checkAnswer(q, '1.405', true).status, 'correct');
assert.equal(E.checkAnswer(q, '1.42', true).status, 'wrong');
assert.equal(E.checkAnswer(q, '1.415', true).status, 'wrong');
assert.equal(E.checkAnswer(q, '1.42', false).status, 'pending');

// Estimation still uses its separate relative tolerance and must not be
// accidentally converted to fixed-decimal rounding semantics.
const estimate = E.GENERATORS.est(E.makeRng(0xE571), {
  kind: 'mul', alo: 11, ahi: 11, dpa: 0, blo: 13, bhi: 13, dpb: 0
});
assert.equal(estimate.tol.dp, undefined);
assert.equal(E.checkAnswer(estimate, String(estimate.tol.center), true).status, 'correct');

console.log('PASS: two-decimal root rounding and unchanged estimation tolerance');
