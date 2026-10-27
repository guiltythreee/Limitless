/* Tier-aware ratio/average generator regression tests.
   Run: node tools/math-refactored/test-math-skill-progression.cjs */
'use strict';
const assert = require('node:assert/strict');
const E = require('./engine.js');

const SKILLS_UNDER_TEST = ['Ratios', 'Averages'];
const SAMPLES_PER_TIER = 2500;

function nearestTierForSkill(skill, requestedIndex) {
  return E.TIERS
    .filter(tier => tier.recipes.some(recipe => E.RECIPE_SKILL[recipe[0]] === skill))
    .sort((a, b) => {
      const distance = Math.abs(a.index - requestedIndex) - Math.abs(b.index - requestedIndex);
      return distance || a.index - b.index;
    })[0];
}

function median(values) {
  const sorted = values.slice().sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

const summary = [];
for (const skill of SKILLS_UNDER_TEST) {
  const byTier = [];

  for (const tier of E.TIERS) {
    const rng = E.makeRng(17100 + E.SKILLS.indexOf(skill) * 100 + tier.index);
    const ctx = { recent: [] };
    const targetedDiffs = [];
    const expectedTier = nearestTierForSkill(skill, tier.index);
    assert.ok(expectedTier, skill + ': no recipe exists at any tier');

    for (let i = 0; i < SAMPLES_PER_TIER; i++) {
      const q = E.drillQuestion([skill], null, tier.id, rng, ctx);
      assert.ok(q && E.SKILLS.includes(q.skill), tier.id + '/' + skill + ': missing skill');
      assert.equal(E.checkAnswer(q, q.answerText, true).status, 'correct',
        tier.id + '/' + skill + ': displayed answer rejected');
      assert.ok(Number.isFinite(q.diff) && q.diff > 0, tier.id + '/' + skill + ': invalid difficulty');
      assert.equal(q.target, E.targetFor(q.diff), tier.id + '/' + skill + ': target does not match difficulty');

      if (q.skill === skill) {
        assert.equal(q.tier, expectedTier.id,
          tier.id + '/' + skill + ': drill did not use the nearest available tier variant');
        targetedDiffs.push(q.diff);
      }
    }

    assert.ok(targetedDiffs.length > 1000, tier.id + '/' + skill + ': too few targeted samples');
    byTier.push({
      requestedTier: tier.id,
      actualTier: expectedTier.id,
      targetedSamples: targetedDiffs.length,
      medianDifficulty: median(targetedDiffs),
      minDifficulty: Math.min(...targetedDiffs),
      maxDifficulty: Math.max(...targetedDiffs)
    });
  }

  for (let i = 1; i < byTier.length; i++) {
    assert.ok(byTier[i].medianDifficulty >= byTier[i - 1].medianDifficulty,
      skill + ': median difficulty decreased from ' + byTier[i - 1].requestedTier +
      ' to ' + byTier[i].requestedTier);
    if (i >= 2) {
      assert.ok(byTier[i].medianDifficulty > byTier[i - 1].medianDifficulty,
        skill + ': advanced-tier median did not increase from ' + byTier[i - 1].requestedTier +
        ' to ' + byTier[i].requestedTier);
    }
  }

  summary.push({ skill, byTier });
}

for (const tier of E.TIERS.slice(1)) {
  for (const skill of SKILLS_UNDER_TEST) {
    assert.ok(tier.recipes.some(recipe => E.RECIPE_SKILL[recipe[0]] === skill),
      tier.id + ': ' + skill + ' missing from general tier recipe mix');
  }
}

console.log('Ratio/average tier progression checks passed.');
console.log(JSON.stringify(summary, null, 2));
