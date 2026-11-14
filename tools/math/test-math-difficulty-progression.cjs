/* Generator score, target-time, and tier-progression audit.
   Run: node tools/math-refactored/test-math-difficulty-progression.cjs */
'use strict';
const assert = require('node:assert/strict');
const E = require('./engine.js');

const SAMPLE_COUNT = 12000;
const summaries = [];

function quantile(sorted, p) {
  return sorted[Math.floor((sorted.length - 1) * p)];
}

for (const tier of E.TIERS) {
  const rng = E.makeRng(123456 + tier.index);
  const ctx = { recent: [] };
  const diffs = [];
  const targets = [];
  const recipeDiffs = Object.create(null);
  let hardTimerFloor = 0;

  for (let i = 0; i < SAMPLE_COUNT; i++) {
    const recentBefore = ctx.recent.slice();
    const q = E.nextQuestion(tier.id, rng, ctx);

    assert.ok(Number.isFinite(q.diff) && q.diff > 0, tier.id + ': invalid difficulty');
    assert.ok(Number.isFinite(q.target) && q.target > 0, tier.id + ': invalid target');
    assert.equal(q.target, E.targetFor(q.diff),
      tier.id + '/' + q.id + ': target must match the engine difficulty-to-time mapping');
    assert.equal(E.checkAnswer(q, q.answerText, true).status, 'correct',
      tier.id + '/' + q.id + ': displayed answer should be accepted');
    assert.ok(!recentBefore.includes(q.text),
      tier.id + '/' + q.id + ': question repeated inside the recent-question window');

    const band = E.BANDS[tier.id];
    assert.ok(q.diff >= band[0] && q.diff <= band[1],
      tier.id + '/' + q.id + ': difficulty ' + q.diff + ' outside observed band [' + band.join(', ') + ']');

    const hardLimit = E.strictLimit(q, 1.36); // 1.6 strict factor × 0.85 Hard-drill multiplier
    const normalLimit = E.strictLimit(q, 1.6);
    assert.ok(Number.isFinite(hardLimit) && hardLimit >= 3 && hardLimit <= 45,
      tier.id + '/' + q.id + ': invalid hard strict-timer limit');
    assert.ok(Number.isFinite(normalLimit) && normalLimit >= 3 && normalLimit <= 45,
      tier.id + '/' + q.id + ': invalid normal strict-timer limit');
    assert.ok(hardLimit <= normalLimit,
      tier.id + '/' + q.id + ': Hard strict timer must not allow more time than Normal');
    if (q.target * 1.36 < 3) hardTimerFloor++;

    diffs.push(q.diff);
    targets.push(q.target);
    (recipeDiffs[q.id] || (recipeDiffs[q.id] = [])).push(q.diff);
  }

  diffs.sort((a, b) => a - b);
  targets.sort((a, b) => a - b);
  const mean = diffs.reduce((sum, x) => sum + x, 0) / diffs.length;
  const belowFive = diffs.filter(x => x < 5).length / diffs.length;
  summaries.push({
    id: tier.id, mean, median: quantile(diffs, 0.5),
    min: diffs[0], p10: quantile(diffs, 0.1), p90: quantile(diffs, 0.9), max: diffs[diffs.length - 1],
    belowFive, targetMin: targets[0], targetMedian: quantile(targets, 0.5), targetMax: targets[targets.length - 1],
    hardTimerFloor, recipeDiffs
  });
}

for (let i = 1; i < summaries.length; i++) {
  assert.ok(summaries[i].mean > summaries[i - 1].mean + 0.25,
    'mean difficulty should rise at each tier: ' + summaries[i - 1].id + ' -> ' + summaries[i].id);
  assert.ok(summaries[i].median > summaries[i - 1].median,
    'median difficulty should rise at each tier: ' + summaries[i - 1].id + ' -> ' + summaries[i].id);
  assert.ok(summaries[i].targetMedian > summaries[i - 1].targetMedian,
    'median target time should rise at each tier: ' + summaries[i - 1].id + ' -> ' + summaries[i].id);
}

assert.equal(E.targetFor(1), 2.1, 'minimum generated difficulty should map to the current 2.1s target');
assert.equal(E.targetFor(40), 30, 'high difficulty targets should respect the 30s ceiling');

const byId = Object.fromEntries(summaries.map(s => [s.id, s]));
assert.ok(byId.magister.belowFive < 0.04, 'Magister should rarely emit very low-score questions');
assert.ok(byId.archon.belowFive < 0.01, 'Archon should almost never emit very low-score questions');
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
assertRecipeMin('archon', 'evDie', 5.5);
assertRecipeMin('archon', 'log', 5.3);
assertRecipeMin('abyss', 'log', 5.1);

console.log('Difficulty progression, target, repeat, and timer checks passed (' +
  (SAMPLE_COUNT * E.TIERS.length) + ' generated questions).');
for (const s of summaries) {
  console.log(s.id + ': score min/p10/median/p90/max=' +
    [s.min, s.p10, s.median, s.p90, s.max].map(x => x.toFixed(1)).join('/') +
    ', mean=' + s.mean.toFixed(2) +
    ', under-5=' + (100 * s.belowFive).toFixed(2) + '%' +
    ', target min/median/max=' + [s.targetMin, s.targetMedian, s.targetMax].map(x => x.toFixed(1)).join('/') + 's' +
    ', hard-timer floor=' + (100 * s.hardTimerFloor / SAMPLE_COUNT).toFixed(1) + '%');
}
