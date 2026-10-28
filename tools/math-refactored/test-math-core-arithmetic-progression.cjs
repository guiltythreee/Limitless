/* Core arithmetic and fraction progression regression tests.
   Run: node tools/math-refactored/test-math-core-arithmetic-progression.cjs */
'use strict';
const assert = require('node:assert/strict');
const E = require('./engine.js');

const expected = {
  Addition: ['acolyte', 'scribe', 'adept', 'magister', 'archon', 'abyss'],
  Subtraction: ['acolyte', 'scribe', 'adept', 'magister', 'archon', 'abyss'],
  Division: ['acolyte', 'scribe', 'adept', 'magister', 'archon', 'abyss'],
  Decimals: ['scribe', 'adept', 'magister', 'archon', 'abyss'],
  Fractions: ['adept', 'magister', 'archon', 'abyss'],
  Percentages: ['scribe', 'adept', 'magister', 'archon', 'abyss']
};
const tiers = E.TIERS.map(t => t.id);
const settingsFor = (tierId, recipeId) => E.TIER_BY_ID[tierId].recipes.find(r => r[0] === recipeId);
const skillFor = recipeId => E.RECIPE_SKILL[recipeId];

for (const [skill, available] of Object.entries(expected)) {
  for (const tierId of available) {
    const tier = E.TIER_BY_ID[tierId];
    assert.ok(tier.recipes.some(r => skillFor(r[0]) === skill),
      skill + ' must have a recipe in ' + tierId);
  }
}

for (const [skill, available] of Object.entries(expected)) {
  const eligible = E.TIERS.filter(t => t.recipes.some(r => skillFor(r[0]) === skill));
  for (let requested = 0; requested < tiers.length; requested++) {
    const nearest = eligible.slice().sort((a, b) =>
      Math.abs(a.index - requested) - Math.abs(b.index - requested) || a.index - b.index)[0];
    const rng = E.makeRng(720000 + requested * 100 + E.SKILLS.indexOf(skill));
    const q = E.drillQuestion([skill], {}, tiers[requested], rng, { recent: [] }, { generalRate: 0 });
    assert.equal(q.skill, skill, 'focused drill must preserve selected skill: ' + skill + '/' + tiers[requested]);
    assert.equal(q.tier, nearest.id, 'focused drill must choose nearest tier with this skill: ' + skill + '/' + tiers[requested]);
  }
}

function assertExprMatches(q, label) {
  assert.ok(q && q.answer && q.expr, label + ': generated question needs answer and expression');
  const evaluated = Function('"use strict"; return (' + q.expr + ');')();
  const actual = q.answer.n / q.answer.d;
  assert.ok(Number.isFinite(evaluated) && Math.abs(evaluated - actual) <= 1e-7 * Math.max(1, Math.abs(actual)),
    label + ': expression gives ' + evaluated + ', stored answer is ' + actual + ' for ' + q.text);
  assert.equal(E.checkAnswer(q, q.answerText, true).status, 'correct', label + ': displayed answer must be accepted');
}

const addedRecipes = [
  ['magister', 'add', { da: 4, db: 4 }],
  ['magister', 'sub', { da: 4, db: 4 }],
  ['magister', 'div', { dq: 3, dd: 3 }],
  ['magister', 'divRem', { qd: 3, dd: 2 }],
  ['magister', 'decAdd', { ia: 3, ib: 3, dpa: 2, dpb: 1 }],
  ['magister', 'fracMul', { dens: [3, 4, 5, 6, 8, 9, 10, 12] }],
  ['magister', 'fracDiv', { dens: [3, 4, 5, 6, 8, 9, 10, 12] }],
  ['archon', 'add', { da: 5, db: 4 }],
  ['archon', 'sub', { da: 5, db: 4 }],
  ['archon', 'div', { dq: 4, dd: 3 }],
  ['archon', 'divRem', { qd: 4, dd: 2 }],
  ['archon', 'decAdd', { ia: 4, ib: 3, dpa: 2, dpb: 2 }],
  ['archon', 'fracMul', { dens: [7, 9, 11, 12, 14, 15, 18] }],
  ['archon', 'fracDiv', { dens: [7, 9, 11, 12, 14, 15, 18] }],
  ['archon', 'pctWhat', { set: [2.5, 7.5, 12.5, 17.5, 22.5, 37.5, 62.5, 87.5], lo: 400, hi: 4000 }],
  ['abyss', 'add', { da: 9, db: 8 }],
  ['abyss', 'sub', { da: 9, db: 8 }],
  ['abyss', 'div', { dq: 5, dd: 3 }],
  ['abyss', 'divRem', { qd: 5, dd: 3 }],
  ['abyss', 'decAdd', { ia: 5, ib: 4, dpa: 2, dpb: 2 }],
  ['abyss', 'fracMul', { dens: [11, 13, 14, 15, 16, 18, 21] }],
  ['abyss', 'fracDiv', { dens: [11, 13, 14, 15, 16, 18, 21] }],
  ['abyss', 'pctWhat', { set: [12.5, 17.5, 22.5, 27.5, 32.5, 37.5, 42.5, 47.5], lo: 4000, hi: 80000 }]
];

let checked = 0;
for (const [tierId, recipeId, settings] of addedRecipes) {
  assert.ok(settingsFor(tierId, recipeId), tierId + ' must declare ' + recipeId);
  const rng = E.makeRng(880000 + checked);
  for (let i = 0; i < 200; i++) {
    const q = E.GENERATORS[recipeId](rng, settings);
    q.id = recipeId;
    q.tier = tierId;
    q.target = E.targetFor(q.diff);
    assert.equal(q.skill, skillFor(recipeId), tierId + '/' + recipeId + ': skill mapping');
    assertExprMatches(q, tierId + '/' + recipeId + '/' + i);
    checked++;
  }
}

console.log('Core arithmetic progression passed: six skill families, nearest-tier drill routing, and ' + checked + ' independently evaluated generated questions.');
