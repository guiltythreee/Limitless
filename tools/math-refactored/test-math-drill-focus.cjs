/* Focused and mixed drill skill coverage regression tests.
   Run: node tools/math-refactored/test-math-drill-focus.cjs */
'use strict';
const assert = require('node:assert/strict');
const E = require('./engine.js');

const PER_SKILL_TIER = 500;
const MIXED_SAMPLE = 12000;
const ctx = () => ({ recent: [] });

function assertValid(q, label) {
  assert.ok(q && E.SKILLS.includes(q.skill), label + ': unknown skill');
  assert.ok(Number.isFinite(q.diff) && q.diff > 0, label + ': invalid difficulty');
  assert.ok(Number.isFinite(q.target) && q.target > 0, label + ': invalid target');
  assert.equal(E.checkAnswer(q, q.answerText, true).status, 'correct',
    label + ': generated answer must be accepted');
}

let focusedCount = 0;
for (const tier of E.TIERS) {
  for (let si = 0; si < E.SKILLS.length; si++) {
    const skill = E.SKILLS[si];
    const rng = E.makeRng(761000 + tier.index * 100 + si);
    const recent = ctx();
    for (let i = 0; i < PER_SKILL_TIER; i++) {
      const q = E.drillQuestion([skill], {}, tier.id, rng, recent, { generalRate: 0 });
      assertValid(q, tier.id + '/' + skill + '/' + i);
      assert.equal(q.skill, skill,
        tier.id + '/' + skill + ': focused drill generated ' + q.skill);
      focusedCount++;
    }
  }
}

const selectedSkills = ['Percentages', 'Fractions', 'Powers'];
let generalCount = 0;
for (const tier of E.TIERS) {
  const rng = E.makeRng(872000 + tier.index);
  const recent = ctx();
  for (let i = 0; i < MIXED_SAMPLE; i++) {
    const q = E.drillQuestion(selectedSkills, {}, tier.id, rng, recent, { generalRate: 0.25 });
    assertValid(q, tier.id + '/mixed/' + i);
    if (!selectedSkills.includes(q.skill)) generalCount++;
  }
}
const mixedTotal = MIXED_SAMPLE * E.TIERS.length;
const observedGeneralRate = generalCount / mixedTotal;
assert.ok(observedGeneralRate >= 0.23 && observedGeneralRate <= 0.27,
  'mixed drills should retain about 25% general questions; got ' + observedGeneralRate);

const noFocusRng = E.makeRng(991);
for (const tier of E.TIERS) {
  const q = E.drillQuestion([], {}, tier.id, noFocusRng, ctx(), { generalRate: 0 });
  assertValid(q, tier.id + '/general fallback');
}

console.log('Math drill focus checks passed: ' + focusedCount +
  ' focused questions across all skills/tiers, ' + mixedTotal +
  ' mixed questions, general-question share ' + (100 * observedGeneralRate).toFixed(2) + '%.');
