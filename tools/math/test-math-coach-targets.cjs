/* Regression tests for effective-target pace analysis.
   Run: node tools/math-refactored/test-math-coach-targets.cjs */
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

function statFor(list) {
  attempts = list;
  return coach.localSkillStats().arithmetic;
}
function attempt(time, target, effectiveTarget) {
  const a = { s: 'arithmetic', r: 'correct', time, target };
  if (effectiveTarget !== undefined) a.effectiveTarget = effectiveTarget;
  return a;
}

assert.equal(statFor([attempt(10, 10, 10)]).ratio, 1,
  'Normal target should use the base target');
assert.equal(statFor([attempt(10, 10, 12.5)]).ratio, 0.8,
  'Easy target should use 1.25 × base target');
assert.equal(statFor([attempt(10, 10, 8.5)]).ratio, 10 / 8.5,
  'Hard target should use 0.85 × base target');
assert.ok(statFor([attempt(10, 10, 12.5)]).ratio < statFor([attempt(10, 10, 8.5)]).ratio,
  'Same elapsed time should be assessed as slower against the tighter Hard target');
assert.equal(statFor([attempt(10, 10)]).ratio, 1,
  'Legacy records without effectiveTarget should fall back to target');
assert.equal(statFor([
  attempt(10, 10, 12.5),
  attempt(10, 10),
  { s: 'arithmetic', r: 'skip', time: 1, target: 10 }
]).n, 2, 'Legacy records and skips should aggregate safely');
assert.equal(coach.diagnose(1, 0.8, 3).text, 'Strong',
  'Diagnosis should continue to use the resulting pace ratio and accuracy');
assert.equal(coach.analyse().length, 1,
  'Skill aggregation should remain available');

console.log('PASS: effective-target pace analysis regression checks');
