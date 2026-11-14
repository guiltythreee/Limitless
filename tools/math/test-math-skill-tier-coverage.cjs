#!/usr/bin/env node
'use strict';

const assert = require('node:assert/strict');
const E = require('./engine.js');

const SAMPLE_COUNT = 40;
const SEED = 20261028;
const REQUIRE_CURRENT_TIER = new Set([
  'Addition', 'Subtraction', 'Multiplication', 'Division'
]);
const REQUIRE_CURRENT_TIER_AFTER_ACOLYTE = new Set([
  'Decimals', 'Fractions', 'Ratios', 'Averages'
]);
const coverage = [];
const fallbackSummary = [];

for (const tier of E.TIERS) {
  for (const skill of E.SKILLS) {
    const rng = E.makeRng(SEED + tier.index * 10000 + E.SKILLS.indexOf(skill) * 97);
    const ctx = { recent: [] };
    const actual = {};
    const recipes = {};
    for (let i = 0; i < SAMPLE_COUNT; i++) {
      const q = E.drillQuestion([skill], null, tier.id, rng, ctx, { generalRate: 0 });
      assert.ok(q && E.SKILLS.includes(q.skill), tier.id + '/' + skill + ': question has an unknown skill');
      assert.equal(q.skill, skill, tier.id + '/' + skill + ': focused drill escaped the selected skill');
      assert.ok(E.TIER_BY_ID[q.tier], tier.id + '/' + skill + ': question has no known actual tier');
      assert.equal(E.checkAnswer(q, q.answerText, true).status, 'correct',
        tier.id + '/' + skill + ': displayed answer should be accepted');
      assert.ok(Number.isFinite(q.diff) && q.diff > 0, tier.id + '/' + skill + ': invalid difficulty');
      assert.equal(q.target, E.targetFor(q.diff), tier.id + '/' + skill + ': target/difficulty mismatch');
      actual[q.tier] = (actual[q.tier] || 0) + 1;
      recipes[q.id] = (recipes[q.id] || 0) + 1;
    }

    if (REQUIRE_CURRENT_TIER.has(skill) ||
        (tier.index > 0 && REQUIRE_CURRENT_TIER_AFTER_ACOLYTE.has(skill))) {
      assert.deepEqual(Object.keys(actual), [tier.id],
        tier.id + '/' + skill + ': core skill drill should use a recipe at the requested tier; got ' +
        JSON.stringify(actual));
    }

    const row = { requestedTier: tier.id, skill, actualTiers: actual, recipes };
    coverage.push(row);
    if (Object.keys(actual).some(id => id !== tier.id)) fallbackSummary.push(row);
  }
}

console.log('Skill-by-tier drill coverage checks passed: ' +
  (E.TIERS.length * E.SKILLS.length * SAMPLE_COUNT) + ' focused questions.');
console.log('Observed nearest-tier fallbacks for skills without a recipe at the requested tier:');
console.log(JSON.stringify(fallbackSummary, null, 2));
