/* Regression checks for measured difficulty progression. Run: node tools/math-refactored/test-math-difficulty-progression.cjs */
'use strict';
const assert = require('node:assert/strict');
const E = require('./engine.js');

const SAMPLE_COUNT = 12000;
const summaries = [];

for (const tier of E.TIERS) {
  const rng = E.makeRng(123456 + tier.index);
  const ctx = { recent: [] };
  const diffs = [];
  const recipeDiffs = Object.create(null);

  for (let i = 0; i < SAMPLE_COUNT; i++) {
    const q = E.nextQuestion(tier.id, rng, ctx);
    assert.ok(Number.isFinite(q.diff) && q.diff > 0, tier.id + ': invalid difficulty');
    assert.ok(Number.isFinite(q.target) && q.target > 0, tier.id + ': invalid target');
    assert.equal(E.checkAnswer(q, q.answerText, true).status, 'correct',
      tier.id + '/' + q.id + ': displayed answer should be accepted');
    diffs.push(q.diff);
    (recipeDiffs[q.id] || (recipeDiffs[q.id] = [])).push(q.diff);
  }

  diffs.sort((a, b) => a - b);
  const mean = diffs.reduce((sum, x) => sum + x, 0) / diffs.length;
  const median = diffs[Math.floor(diffs.length / 2)];
  const belowFive = diffs.filter(x => x < 5).length / diffs.length;
  summaries.push({ id: tier.id, mean, median, belowFive, recipeDiffs });
}

for (let i = 1; i < summaries.length; i++) {
  assert.ok(summaries[i].mean > summaries[i - 1].mean + 0.25,
    'mean difficulty should rise at each tier: ' + summaries[i - 1].id + ' -> ' + summaries[i].id);
  assert.ok(summaries[i].median > summaries[i - 1].median,
    'median difficulty should rise at each tier: ' + summaries[i - 1].id + ' -> ' + summaries[i].id);
}

const byId = Object.fromEntries(summaries.map(s => [s.id, s]));
assert.ok(byId.magister.belowFive < 0.04, 'Magister should rarely emit very low-score questions');
assert.ok(byId.archon.belowFive < 0.06, 'Archon should rarely emit very low-score questions');
assert.ok(byId.abyss.belowFive < 0.01, 'Abyss should almost never emit very low-score questions');

function assertRecipeMin(tierId, recipeId, min) {
  const values = byId[tierId].recipeDiffs[recipeId];
  assert.ok(values && values.length > 0, tierId + '/' + recipeId + ': recipe was not sampled');
  assert.ok(Math.min(...values) >= min,
    tierId + '/' + recipeId + ': minimum diff ' + Math.min(...values) + ' < ' + min);
}
assertRecipeMin('magister', 'cube', 4.7);
assertRecipeMin('magister', 'cbrtPerfect', 4.8);
assertRecipeMin('magister', 'fracToDec', 4.5);
assertRecipeMin('magister', 'pctWhat', 5.3);
assertRecipeMin('archon', 'pctOf', 6.9);
assertRecipeMin('archon', 'square', 4.9);

console.log('Difficulty progression checks passed (' + (SAMPLE_COUNT * E.TIERS.length) + ' generated questions).');
for (const s of summaries) {
  console.log(s.id + ': mean=' + s.mean.toFixed(2) +
    ', median=' + s.median.toFixed(1) +
    ', under-5=' + (100 * s.belowFive).toFixed(1) + '%');
}
