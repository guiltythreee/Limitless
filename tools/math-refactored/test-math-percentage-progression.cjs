#!/usr/bin/env node
'use strict';

const assert = require('node:assert/strict');
const E = require('./engine.js');

const SAMPLE_COUNT = 150;
const SEED = 20261028;
let checked = 0;

function near(actual, expected, label) {
  assert.ok(Number.isFinite(actual), label + ': answer is not finite');
  assert.ok(Math.abs(actual - expected) <= 1e-8 * Math.max(1, Math.abs(expected)),
    label + ': independent result ' + expected + ', stored answer ' + actual);
}
function independentlyEvaluate(q) {
  let m, expected;
  if (q.id === 'pctOf') {
    m = q.text.match(/^(\d+(?:\.\d+)?)% of (\d+)$/);
    assert.ok(m, 'Unexpected percentage-of prompt: ' + q.text);
    expected = Number(m[1]) * Number(m[2]) / 100;
  } else if (q.id === 'pctChange') {
    m = q.text.match(/^(\d+) → (\d+)  \(% change\)$/);
    assert.ok(m, 'Unexpected percentage-change prompt: ' + q.text);
    expected = (Number(m[2]) - Number(m[1])) / Number(m[1]) * 100;
  } else if (q.id === 'pctWhat') {
    m = q.text.match(/^(\d+) is what % of (\d+)\?$/);
    assert.ok(m, 'Unexpected find-the-percentage prompt: ' + q.text);
    expected = Number(m[1]) / Number(m[2]) * 100;
  } else {
    assert.fail('No independent percentage evaluator for ' + q.id);
  }
  near(q.answer.n / q.answer.d, expected, q.text);
}

for (const tier of E.TIERS) {
  const ids = tier.recipes.filter(recipe => E.RECIPE_SKILL[recipe[0]] === 'Percentages').map(recipe => recipe[0]);
  assert.ok(ids.includes('pctOf'), tier.id + ': percentage-of questions must be available');
  if (tier.index >= 1) {
    for (const id of ['pctChange', 'pctWhat']) {
      assert.ok(ids.includes(id), tier.id + ': missing percentage question type ' + id);
    }
  }

  for (const recipe of tier.recipes) {
    if (E.RECIPE_SKILL[recipe[0]] !== 'Percentages') continue;
    const [id, , settings] = recipe;
    const rng = E.makeRng(SEED + tier.index * 10000 + id.length);
    for (let i = 0; i < SAMPLE_COUNT; i++) {
      const q = E.GENERATORS[id](rng, settings);
      q.id = id;
      q.tier = tier.id;
      q.settings = settings;
      q.target = E.targetFor(q.diff);
      assert.ok(Number.isFinite(q.diff) && q.diff >= E.BANDS[tier.id][0] && q.diff <= E.BANDS[tier.id][1],
        tier.id + '/' + id + ': difficulty outside its tier band: ' + q.diff);
      assert.equal(E.checkAnswer(q, q.answerText, true).status, 'correct',
        tier.id + '/' + id + ': displayed answer should be accepted');
      independentlyEvaluate(q);
      checked++;
    }
  }

  const rng = E.makeRng(SEED + 90000 + tier.index);
  const ctx = { recent: [] };
  for (let i = 0; i < 50; i++) {
    const q = E.drillQuestion(['Percentages'], null, tier.id, rng, ctx, { generalRate: 0 });
    assert.equal(q.skill, 'Percentages', tier.id + ': focused percentage drill changed skill');
    assert.equal(q.tier, tier.id, tier.id + ': focused percentage drill fell back to another tier');
    assert.equal(E.checkAnswer(q, q.answerText, true).status, 'correct');
  }
}

console.log('Percentage progression checks passed: ' + checked +
  ' independently recomputed percentage questions plus focused-drill coverage at all six tiers.');
