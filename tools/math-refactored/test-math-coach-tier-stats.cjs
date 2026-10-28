#!/usr/bin/env node
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

let attempts = [];
const storage = {
  KEYS: { att: 'attempts', profile: 'profile' },
  LIMITS: { SKILL_WINDOW: 60 },
  load(key, fallback) {
    if (key === 'attempts') return attempts;
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
vm.runInNewContext(
  fs.readFileSync(require.resolve('./math-coach.js'), 'utf8'),
  { window, globalThis: window, module: undefined },
  { filename: 'math-coach.js' }
);
const coach = window.MathCoach;

function attempt(skill, tier, result, time, target = 10) {
  return { s: skill, t: tier, r: result, time, target, effectiveTarget: target };
}

attempts = [
  ...Array.from({ length: 5 }, () => attempt('Multiplication', 'scribe', 'correct', 8)),
  attempt('Multiplication', 'scribe', 'skip', 1),
  ...Array.from({ length: 2 }, () => attempt('Multiplication', 'abyss', 'correct', 20)),
  ...Array.from({ length: 3 }, () => attempt('Multiplication', 'abyss', 'wrong', 20)),
  attempt('Division', 'adept', 'correct', 7),
  attempt('Division', null, 'correct', 7)
];

const stats = coach.localSkillTierStats();
assert.equal(stats.length, 3, 'Tier stats should group skill/tier pairs and ignore missing tiers');
const scribe = stats.find(row => row.skill === 'Multiplication' && row.tier === 'scribe');
const abyss = stats.find(row => row.skill === 'Multiplication' && row.tier === 'abyss');
assert.equal(scribe.n, 5, 'Skips should not count toward tier sample size');
assert.equal(scribe.acc, 1, 'Scribe accuracy should remain separate');
assert.equal(abyss.n, 5, 'Abyss sample size should remain separate');
assert.equal(abyss.acc, 0.4, 'Abyss accuracy should not be hidden by Scribe results');

const analysed = coach.analyseByTier();
assert.equal(analysed.find(row => row.skill === 'Multiplication' && row.tier === 'scribe').diag.text, 'Strong');
assert.equal(analysed.find(row => row.skill === 'Multiplication' && row.tier === 'abyss').diag.text, 'Needs practice');

const overall = coach.analyse().find(row => row.skill === 'Multiplication');
assert.equal(overall.n, 10, 'Existing overall skill aggregation remains available');
assert.ok(coach.prescription(coach.analyse()) !== null, 'Existing prescription API remains available');

console.log('PASS: tier-aware coaching keeps easy- and hard-tier skill performance separate.');
