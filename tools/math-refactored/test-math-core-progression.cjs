#!/usr/bin/env node
'use strict';

const assert = require('node:assert/strict');
const E = require('./engine.js');

const SEED = 20261028;
const CORE = ['add', 'sub', 'div', 'divRem'];
const EXTENDED = ['decAdd', 'fracAdd', 'fracMul', 'fracDiv'];
let generated = 0;

function assertNear(actual, expected, label) {
  assert.ok(Number.isFinite(actual), label + ': actual result is not finite');
  assert.ok(Math.abs(actual - expected) <= 1e-8 * Math.max(1, Math.abs(expected)),
    label + ': independent result ' + expected + ' disagrees with stored answer ' + actual);
}

function independentlyEvaluate(q) {
  let m;
  if (q.id === 'divRem') {
    m = q.text.match(/^Remainder: (\d+) ÷ (\d+)$/);
    assert.ok(m, 'Unexpected remainder prompt: ' + q.text);
    const dividend = Number(m[1]), divisor = Number(m[2]);
    assert.notEqual(dividend % divisor, 0, q.text + ': remainder questions should not be exact divisions');
    assertNear(q.answer.n / q.answer.d, dividend % divisor, q.text);
    return;
  }
  if (q.id === 'add' || q.id === 'sub' || q.id === 'div') {
    if (q.id === 'div') {
      m = q.text.match(/^(\d+) ÷ (\d+)$/);
      assert.ok(m, 'Unexpected division prompt: ' + q.text);
      assertNear(q.answer.n / q.answer.d, Number(m[1]) / Number(m[2]), q.text);
      assert.equal(Number(m[1]) % Number(m[2]), 0, 'Core division recipes should produce exact quotients');
      return;
    }
    m = q.text.match(/^(\d+) ([+−-]) (\d+)$/);
    assert.ok(m, 'Unexpected integer arithmetic prompt: ' + q.text);
    const expected = q.id === 'add' ? Number(m[1]) + Number(m[3]) : Number(m[1]) - Number(m[3]);
    assertNear(q.answer.n / q.answer.d, expected, q.text);
    return;
  }

  if (q.id === 'decAdd') {
    m = q.text.match(/^(-?\d+(?:\.\d+)?) ([+−-]) (-?\d+(?:\.\d+)?)$/);
    assert.ok(m, 'Unexpected decimal addition/subtraction prompt: ' + q.text);
    const expected = m[2] === '+' ? Number(m[1]) + Number(m[3]) : Number(m[1]) - Number(m[3]);
    assertNear(q.answer.n / q.answer.d, expected, q.text);
    return;
  }

  if (q.id === 'fracAdd' || q.id === 'fracMul' || q.id === 'fracDiv') {
    m = q.text.match(/^(\d+)\/(\d+) ([×÷+−-]) (\d+)\/(\d+)$/);
    assert.ok(m, 'Unexpected fraction operation prompt: ' + q.text);
    const a = Number(m[1]), b = Number(m[2]), c = Number(m[4]), d = Number(m[5]);
    const expected = q.id === 'fracMul' ? (a * c) / (b * d)
      : q.id === 'fracDiv' ? (a * d) / (b * c)
      : m[3] === '+' ? a / b + c / d : a / b - c / d;
    assertNear(q.answer.n / q.answer.d, expected, q.text);
    return;
  }
  assert.fail('No independent evaluator for recipe ' + q.id);
}

function validate(q, tierId, recipeId) {
  assert.ok(q && typeof q.text === 'string' && q.text.length > 0, 'Question text required');
  assert.equal(q.id, recipeId);
  assert.equal(q.tier, tierId);
  assert.equal(E.checkAnswer(q, q.answerText, true).status, 'correct',
    tierId + '/' + recipeId + ': displayed answer must be accepted');
  assert.ok(Number.isFinite(q.diff) && q.diff > 0, tierId + '/' + recipeId + ': difficulty must be positive');
  assert.ok(Number.isFinite(q.target) && q.target > 0, tierId + '/' + recipeId + ': target must be positive');
  const band = E.BANDS[tierId];
  assert.ok(q.diff >= band[0] && q.diff <= band[1],
    tierId + '/' + recipeId + ': difficulty ' + q.diff + ' outside tier band [' + band.join(', ') + ']');
  independentlyEvaluate(q);
  generated++;
}

for (const tier of E.TIERS) {
  for (const recipeId of CORE) {
    assert.ok(tier.recipes.some(recipe => recipe[0] === recipeId),
      tier.id + ': missing dedicated ' + recipeId + ' recipe');
  }
  if (tier.index >= 1) {
    for (const recipeId of EXTENDED) {
      assert.ok(tier.recipes.some(recipe => recipe[0] === recipeId),
        tier.id + ': missing dedicated ' + recipeId + ' recipe');
    }
  }

  for (const recipe of tier.recipes) {
    if (![...CORE, ...(tier.index >= 1 ? EXTENDED : [])].includes(recipe[0])) continue;
    const [recipeId, , settings] = recipe;
    const rng = E.makeRng(SEED + tier.index * 1000 + E.TIERS.indexOf(tier) * 17 + recipeId.length);
    for (let i = 0; i < 100; i++) {
      const q = E.GENERATORS[recipeId](rng, settings);
      q.id = recipeId;
      q.tier = tier.id;
      q.settings = settings;
      q.target = E.targetFor(q.diff);
      validate(q, tier.id, recipeId);
    }
  }

  const focusedSkills = tier.index === 0
    ? ['Addition', 'Subtraction', 'Division']
    : ['Addition', 'Subtraction', 'Division', 'Decimals', 'Fractions'];
  for (const skill of focusedSkills) {
    const rng = E.makeRng(SEED + 50000 + tier.index * 100 + E.SKILLS.indexOf(skill));
    const ctx = { recent: [] };
    for (let i = 0; i < 50; i++) {
      const q = E.drillQuestion([skill], null, tier.id, rng, ctx, { generalRate: 0 });
      assert.equal(q.skill, skill, tier.id + '/' + skill + ': focused drill escaped the selected skill');
      assert.equal(q.tier, tier.id, tier.id + '/' + skill + ': focused drill silently fell back to another tier');
      assert.equal(E.checkAnswer(q, q.answerText, true).status, 'correct',
        tier.id + '/' + skill + ': focused drill answer must be accepted');
    }
  }
}

console.log('Core arithmetic progression checks passed: ' + generated +
  ' independently evaluated recipe questions, plus focused tier checks for Addition, Subtraction, Division, Decimals and Fractions.');
