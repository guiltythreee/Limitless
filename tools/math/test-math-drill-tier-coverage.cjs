/* Skill-specific drill tier coverage regression tests.
   Run: node tools/math-refactored/test-math-drill-tier-coverage.cjs */
'use strict';
const assert = require('node:assert/strict');
const E = require('./engine.js');

const SAMPLES_PER_PAIR = 200;
const TIER_INDEX = Object.fromEntries(E.TIERS.map((tier, index) => [tier.id, index]));
const summary = [];
let total = 0;

for (const skill of E.SKILLS) {
  for (const selectedTier of E.TIERS) {
    const rng = E.makeRng(921000 + E.SKILLS.indexOf(skill) * 10 + selectedTier.index);
    const ctx = { recent: [] };
    const sourceCounts = {};
    let maxGap = 0;

    for (let i = 0; i < SAMPLES_PER_PAIR; i++) {
      const q = E.drillQuestion([skill], {}, selectedTier.id, rng, ctx, { generalRate: 0 });
      const actualSkill = q.skill || E.RECIPE_SKILL[q.id];
      assert.equal(actualSkill, skill,
        selectedTier.id + '/' + skill + ': focused drill returned a different skill');
      assert.ok(Number.isFinite(q.diff) && q.diff > 0,
        selectedTier.id + '/' + skill + ': invalid difficulty');
      assert.ok(Number.isFinite(q.target) && q.target > 0,
        selectedTier.id + '/' + skill + ': invalid timing target');
      assert.equal(E.checkAnswer(q, q.answerText, true).status, 'correct',
        selectedTier.id + '/' + skill + ': generated answer was not accepted');
      if (q.id === 'chain' && q.settings && ['G', 'H'].includes(q.settings.kind)) {
        assert.ok(q.answer.n > 0,
          selectedTier.id + '/' + skill + ': introductory mixed-operation answer should be positive');
      }

      const gap = Math.abs(TIER_INDEX[q.tier] - selectedTier.index);
      assert.ok(gap <= 1,
        selectedTier.id + '/' + skill + ': question came from ' + q.tier +
        ' (tier distance ' + gap + ')');
      maxGap = Math.max(maxGap, gap);
      sourceCounts[q.tier] = (sourceCounts[q.tier] || 0) + 1;
      total++;
    }

    summary.push({
      skill,
      selectedTier: selectedTier.id,
      samples: SAMPLES_PER_PAIR,
      sourceCounts,
      maxTierGap: maxGap
    });
  }
}

/* Beginner and intermediate estimation presets intentionally use wider tolerances.
   Existing standard-tier estimation recipes must retain their original 1% contract. */
const estimationRng = E.makeRng(55301);
const easyEstimation = E.drillQuestion(['Estimation'], {}, 'scribe', estimationRng,
  { recent: [] }, { generalRate: 0 });
assert.equal(easyEstimation.tol.rel, 0.05);
assert.ok(easyEstimation.text.includes('within 5%'));
assert.equal(E.checkAnswer(easyEstimation, easyEstimation.answerText, true).status, 'correct');

const standardEstimationRng = E.makeRng(55302);
const standardEstimation = E.GENERATORS.est(standardEstimationRng, {
  kind: 'mul', alo: 10, ahi: 99, dpa: 0, blo: 10, bhi: 99, dpb: 0
});
assert.equal(standardEstimation.tol.rel, 0.01);
assert.ok(standardEstimation.text.includes('within 1%'));

console.log('Skill-specific drill tier coverage passed (' + total +
  ' focused questions across ' + summary.length + ' skill/tier pairs).');
console.log(JSON.stringify({
  skillCount: E.SKILLS.length,
  tierCount: E.TIERS.length,
  pairsChecked: summary.length,
  samplesPerPair: SAMPLES_PER_PAIR,
  maxObservedTierGap: Math.max(...summary.map(row => row.maxTierGap))
}, null, 2));
