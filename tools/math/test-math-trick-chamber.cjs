#!/usr/bin/env node
'use strict';

const assert = require('node:assert/strict');
const E = require('./engine.js');

const SAMPLE_COUNT = 2000;
const SEED_BASE = 20261028;
const expectedTricks = ['eleven', 'nearHundred', 'endsIn5', 'times5', 'times25', 'times99', 'diffSquares', 'pctFlip'];
assert.deepEqual(E.TRICKS.map(t => t.id), expectedTricks, 'Trick list and test coverage must stay in sync');

function expectedValue(id, q) {
  let m;
  switch (id) {
    case 'eleven':
      m = q.text.match(/^(\d+) × 11$|^11 × (\d+)$/);
      assert.ok(m, 'Unexpected ×11 prompt: ' + q.text);
      return Number(m[1] || m[2]) * 11;
    case 'nearHundred':
    case 'times5':
    case 'times25':
    case 'times99':
    case 'diffSquares':
      m = q.text.match(/^(\d+) × (\d+)$/);
      assert.ok(m, 'Unexpected multiplication prompt: ' + q.text);
      return Number(m[1]) * Number(m[2]);
    case 'endsIn5':
      m = q.text.match(/^(\d+)²$/);
      assert.ok(m, 'Unexpected square prompt: ' + q.text);
      return Number(m[1]) ** 2;
    case 'pctFlip':
      m = q.text.match(/^(\d+(?:\.\d+)?)% of (\d+)$/);
      assert.ok(m, 'Unexpected percent prompt: ' + q.text);
      return Number(m[1]) * Number(m[2]) / 100;
    default: throw new Error('Missing independent formula for ' + id);
  }
}

let checked = 0;
for (let t = 0; t < E.TRICKS.length; t++) {
  const trick = E.TRICKS[t], rng = E.makeRng(SEED_BASE + t * 1009), ctx = { recent: [] };
  let previousText = null;
  for (let i = 0; i < SAMPLE_COUNT; i++) {
    const q = E.trickQuestion(trick.id, rng, ctx);
    assert.equal(q.answer.n / q.answer.d, expectedValue(trick.id, q), trick.id + ': formula mismatch: ' + q.text);
    assert.equal(E.checkAnswer(q, q.answerText, true).status, 'correct', trick.id + ': displayed answer rejected');
    assert.ok(q.hint && q.hint.includes(q.answerText), trick.id + ': hint omits answer: ' + q.hint);
    assert.ok(Number.isFinite(q.diff) && q.diff >= 1, trick.id + ': invalid difficulty');
    assert.ok(Number.isFinite(q.target) && q.target > 0, trick.id + ': invalid target');
    assert.notEqual(q.text, previousText, trick.id + ': immediate repeat');
    previousText = q.text;
    checked++;
  }
}
assert.equal(E.checkAnswer({ answer: { n: 1, d: 2 } }, '2/4', true).status, 'correct', 'Equivalent fractions should be accepted');
assert.equal(E.checkAnswer({ answer: { n: 1, d: 2 } }, '0.5', true).status, 'correct', 'Equivalent decimal should be accepted');
assert.equal(E.parseInput(''), null, 'Empty answer must be incomplete');
assert.equal(E.parseInput('1/0'), null, 'Zero denominator must be rejected');
assert.equal(E.parseInput('abc'), null, 'Non-numeric input must be rejected');
assert.equal(E.checkAnswer({ answer: { n: 1, d: 2 } }, '0.4', true).status, 'wrong', 'Incorrect answer must be marked wrong');
console.log('Trick Chamber regression tests passed: ' + checked + ' generated questions, 8 tricks, formula/hint/answer/target/repeat checks, and input edge cases.');
