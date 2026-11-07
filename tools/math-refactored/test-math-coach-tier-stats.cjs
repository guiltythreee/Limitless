/* Regression tests for tier-aware skill statistics and uploaded-profile blending.
   Run: node tools/math-refactored/test-math-coach-tier-stats.cjs */
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

let attempts = [], profile = null;
const storage = {
  KEYS: { att: 'attempts', profile: 'profile' },
  LIMITS: { SKILL_WINDOW: 60 },
  load(key, fallback) {
    if (key === 'attempts') return attempts;
    if (key === 'profile') return profile || fallback;
    return fallback;
  }
};
const ui = {
  median(values) {
    const sorted = values.slice().sort((a, b) => a - b);
    if (!sorted.length) return 0;
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  }
};
const window = { MathEngine: {}, MathStorage: storage, MathUI: ui };
vm.runInNewContext(fs.readFileSync(require.resolve('./math-coach.js'), 'utf8'),
  { window, globalThis: window, module: undefined }, { filename: 'math-coach.js' });
const coach = window.MathCoach;

attempts = [
  { s: 'Multiplication', t: 'adept', r: 'correct', time: 2, target: 3 },
  { s: 'Multiplication', t: 'adept', r: 'wrong', time: 4, target: 3 },
  { s: 'Multiplication', t: 'abyss', r: 'correct', time: 12, target: 8 },
  { s: 'Multiplication', t: 'abyss', r: 'correct', time: 14, target: 8 },
  { s: 'Multiplication', t: 'abyss', r: 'skip', time: 1, target: 8 }
];
let tiers = coach.localSkillTierStats();
assert.equal(tiers.Multiplication.adept.n, 2, 'Adept should aggregate its own attempted questions');
assert.equal(tiers.Multiplication.adept.acc, 0.5, 'Adept accuracy should be independent');
assert.equal(tiers.Multiplication.abyss.n, 2, 'Abyss should aggregate separately');
assert.equal(tiers.Multiplication.abyss.acc, 1, 'skips should not affect tier accuracy');
assert.equal(tiers.Multiplication.abyss.ratio, 1.625, 'tier pace should use effective target when supplied, otherwise base target');

profile = {
  skillTiers: {
    Multiplication: {
      adept: { n: 10, acc: 0.9, ratio: 0.8, medTime: 2.5 },
      archon: { n: 4, acc: 0.5, ratio: 1.5, medTime: 8 }
    }
  }
};
tiers = coach.skillTierStats();
assert.equal(tiers.Multiplication.archon.src, 'uploaded', 'uploaded tier-only data should be retained');
assert.equal(tiers.Multiplication.adept.src, 'mixed', 'local and uploaded tier stats should blend');
assert.ok(tiers.Multiplication.adept.n > 2, 'uploaded sample weight should contribute to blended sample size');

console.log('PASS: tier-specific skill stats, skip handling, pace ratios, and uploaded-profile blending');
