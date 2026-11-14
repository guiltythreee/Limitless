/* Verify that each tier's declared difficulty envelope covers its configured recipes.
   Run from the repository root:
     node tools/math-refactored/test-math-difficulty-bands.cjs
*/
'use strict';

const assert = require('node:assert/strict');
const E = require('./engine.js');

const SAMPLE_PER_RECIPE = 500;
const summaries = [];

for (const tier of E.TIERS) {
  const band = E.BANDS[tier.id];
  assert.ok(Array.isArray(band) && band.length === 2, tier.id + ': difficulty band must have lower and upper bounds');
  assert.ok(Number.isFinite(band[0]) && Number.isFinite(band[1]) && band[0] <= band[1],
    tier.id + ': difficulty band must be a valid finite range');

  const observed = [];
  const recipeSummary = [];

  for (let recipeIndex = 0; recipeIndex < tier.recipes.length; recipeIndex++) {
    const recipe = tier.recipes[recipeIndex];
    const generate = E.GENERATORS[recipe[0]];
    assert.equal(typeof generate, 'function', tier.id + ': missing generator ' + recipe[0]);

    const rng = E.makeRng(0xD1FF1C + tier.index * 1009 + recipeIndex * 9176);
    let recipeMin = Infinity;
    let recipeMax = -Infinity;

    for (let i = 0; i < SAMPLE_PER_RECIPE; i++) {
      const q = generate(rng, recipe[2]);
      assert.ok(q && Number.isFinite(q.diff), tier.id + '/' + recipe[0] + ': invalid difficulty at sample ' + i);
      assert.ok(q.diff >= band[0] && q.diff <= band[1],
        tier.id + '/' + recipe[0] + ': difficulty ' + q.diff + ' outside declared envelope [' + band.join(', ') + ']');
      recipeMin = Math.min(recipeMin, q.diff);
      recipeMax = Math.max(recipeMax, q.diff);
      observed.push(q.diff);
    }
    recipeSummary.push({ recipe: recipe[0], min: recipeMin, max: recipeMax });
  }

  // Also check the public tier-selection path, not just individual generators.
  const rng = E.makeRng(0x71E2 + tier.index);
  const ctx = { recent: [] };
  let selectedMin = Infinity;
  let selectedMax = -Infinity;
  for (let i = 0; i < 5000; i++) {
    const q = E.nextQuestion(tier.id, rng, ctx);
    assert.ok(q.diff >= band[0] && q.diff <= band[1],
      tier.id + ': selected question difficulty ' + q.diff + ' outside declared envelope');
    selectedMin = Math.min(selectedMin, q.diff);
    selectedMax = Math.max(selectedMax, q.diff);
    assert.ok(Number.isFinite(q.target) && q.target > 0, tier.id + ': target must remain positive');
  }

  observed.sort((a, b) => a - b);
  summaries.push({
    tier: tier.id,
    declaredBand: band,
    recipeSamples: observed.length,
    recipeMin: observed[0],
    recipeP90: observed[Math.floor((observed.length - 1) * 0.9)],
    recipeMax: observed[observed.length - 1],
    selectedMin,
    selectedMax,
    recipes: recipeSummary.length
  });
}

console.log('PASS: generated difficulty stays inside every declared tier envelope');
console.log(JSON.stringify(summaries, null, 2));
