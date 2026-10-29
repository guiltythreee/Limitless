'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const vm = require('node:vm');

const source = readFileSync(join(__dirname, 'game.js'), 'utf8');
const start = source.indexOf('  function globalInputsForMathRun(run) {');
const end = source.indexOf('\n  function processPendingGlobalMathRewards', start);
if (start < 0 || end < 0) throw new Error('Could not locate the real Math Trainer global reward adapter');
const functionSource = source.slice(start, end).trim();
const E = {
  TIER_BY_ID: {
    acolyte: { id: 'acolyte', index: 0 },
    adept: { id: 'adept', index: 2 },
    oracle: { id: 'oracle', index: 4 },
  },
};
const globalInputsForMathRun = vm.runInNewContext('(' + functionSource + ')', { E });

function inputsFor(diff, tier) {
  return globalInputsForMathRun({
    id: 'run-' + diff + '-' + tier,
    ts: 123,
    mode: 'practice',
    tier,
    topTier: tier,
    diff,
    attempted: 12,
    accuracy: 0.9,
    cleared: false,
  });
}

test('Math Trainer global difficulty reflects the selected Easy/Normal/Hard setting', () => {
  assert.equal(inputsFor('easy', 'acolyte')[0].difficulty, 'foundational');
  assert.equal(inputsFor('normal', 'acolyte')[0].difficulty, 'foundational');
  assert.equal(inputsFor('hard', 'acolyte')[0].difficulty, 'intermediate');

  assert.equal(inputsFor('easy', 'adept')[0].difficulty, 'foundational');
  assert.equal(inputsFor('normal', 'adept')[0].difficulty, 'intermediate');
  assert.equal(inputsFor('hard', 'adept')[0].difficulty, 'advanced');

  assert.equal(inputsFor('easy', 'oracle')[0].difficulty, 'intermediate');
  assert.equal(inputsFor('normal', 'oracle')[0].difficulty, 'advanced');
  assert.equal(inputsFor('hard', 'oracle')[0].difficulty, 'advanced');
});

test('Math Trainer global repeat identity distinguishes difficulty settings', () => {
  const easy = inputsFor('easy', 'adept')[0];
  const normal = inputsFor('normal', 'adept')[0];
  const hard = inputsFor('hard', 'adept')[0];
  assert.notEqual(easy.contentKey, normal.contentKey);
  assert.notEqual(normal.contentKey, hard.contentKey);
  assert.match(easy.reason, /easy difficulty/);
  assert.match(hard.reason, /hard difficulty/);
});

test('short or empty Math Trainer runs do not earn a global session award', () => {
  for (const attempted of [0, 1, 2]) {
    const inputs = globalInputsForMathRun({ id: 'short-' + attempted, attempted, mode: 'practice', tier: 'adept', diff: 'normal' });
    assert.deepEqual(inputs, []);
  }
});

test('a cleared tier produces an assessment and one-time mastery event using standardized evidence', () => {
  const inputs = globalInputsForMathRun({
    id: 'cleared-tier', mode: 'practice', tier: 'adept', topTier: 'adept',
    diff: 'hard', attempted: 12, accuracy: 0.95, cleared: true,
  });
  assert.equal(inputs.length, 3);
  assert.deepEqual(inputs.map((input) => input.evidence), ['completed-session', 'scored-assessment', 'unit-mastery']);
  assert.equal(inputs[1].passed, true);
  assert.equal(inputs[1].passKey, 'math:tier-clear:adept');
  assert.equal(inputs[2].oneTimeKey, 'math:tier-mastery:adept');
});
