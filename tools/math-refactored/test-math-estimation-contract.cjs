/* Estimation rounding/tolerance contract regression tests.
   Run: node tools/math-refactored/test-math-estimation-contract.cjs */
'use strict';
const assert = require('node:assert/strict');
const E = require('./engine.js');

const cases = [
  { label: 'Archon division', settings: { kind: 'div', nlo: 2000, nhi: 99999, dlo: 13, dhi: 98 } },
  { label: 'Abyss division', settings: { kind: 'div', nlo: 20000, nhi: 999999, dlo: 113, dhi: 987 } },
  { label: 'Archon multiplication', settings: { kind: 'mul', alo: 31, ahi: 99, dpa: 1, blo: 201, bhi: 999, dpb: 1 } },
  { label: 'Abyss multiplication', settings: { kind: 'mul', alo: 301, ahi: 999, dpa: 2, blo: 301, bhi: 999, dpb: 1 } }
];

const SAMPLES = 3000;
let total = 0;
for (let c = 0; c < cases.length; c++) {
  const { label, settings } = cases[c];
  const rng = E.makeRng(731900 + c);
  for (let i = 0; i < SAMPLES; i++) {
    const q = E.GENERATORS.est(rng, settings);
    const truth = q.tol.center;
    const canonical = q.answer.n / q.answer.d;
    const limit = Math.abs(truth) * q.tol.rel;
    assert.ok(Math.abs(canonical - truth) <= limit + 1e-9,
      label + ' sample ' + i + ': canonical answer ' + canonical +
      ' falls outside stated tolerance around ' + truth + ' (limit ' + limit + ')');
    assert.equal(E.checkAnswer(q, q.answerText, true).status, 'correct',
      label + ' sample ' + i + ': displayed answer was not accepted');
    assert.equal(canonical, Math.floor(truth + 0.5),
      label + ' sample ' + i + ': canonical estimate must be rounded to nearest integer');
    total++;
  }
}
console.log('Estimation rounding/tolerance contract passed (' + total + ' generated questions).');
