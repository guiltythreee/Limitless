/* Deterministic property/regression tests for the maths question engine.
   Run from the repository root:
     node tools/math-refactored/test-math-engine.cjs
*/
'use strict';

const assert = require('node:assert/strict');
const E = require('./engine.js');

function validateQuestion(q, context) {
  assert.ok(q && typeof q.text === 'string' && q.text.length > 0, 'question text is required');
  assert.ok(typeof q.id === 'string' && q.id.length > 0, 'recipe id is required');
  assert.ok(Number.isFinite(q.diff) && q.diff >= 1, 'difficulty must be finite and positive');
  assert.ok(Number.isFinite(q.target) && q.target > 0, 'target must be finite and positive');
  assert.ok(q.answer && Number.isFinite(q.answer.n) && Number.isFinite(q.answer.d) && q.answer.d > 0,
    'answer must be a finite rational');
  const parsed = E.parseInput(q.answerText);
  assert.ok(parsed && E.ratEq(parsed, q.answer),
    'displayed answer must parse back to the exact stored answer: ' + q.text + ' => ' + q.answerText);

  // For ordinary arithmetic expressions, independently evaluate the recipe's
  // machine-readable expression and compare it with the stored exact answer.
  // Root/log/probability-verification and approximation recipes have their own
  // verification semantics; exponent notation uses ^, which is not JS power.
  if (q.expr && !q.verify && !q.tol && !/[\^]/.test(q.expr)) {
    let evaluated;
    try {
      evaluated = Function('"use strict"; return (' + q.expr + ');')();
    } catch (error) {
      assert.fail('expression should be evaluable: ' + q.text + ' [' + q.expr + ']: ' + error.message);
    }
    const expected = q.answer.n / q.answer.d;
    assert.ok(Number.isFinite(evaluated) &&
      Math.abs(evaluated - expected) <= 1e-7 * Math.max(1, Math.abs(expected)),
      'expression and stored answer disagree: ' + q.text + ' [' + q.expr + '] got ' + evaluated + ', expected ' + expected);
  }
}

function generatedSequence(tierId, seed, count) {
  const rng = E.makeRng(seed);
  const ctx = { recent: [] };
  const questions = [];
  for (let i = 0; i < count; i++) {
    const previous = new Set(ctx.recent);
    const q = E.nextQuestion(tierId, rng, ctx);
    assert.ok(!previous.has(q.text), tierId + ' repeated a question inside the recent-question window at index ' + i);
    validateQuestion(q);
    assert.ok(ctx.recent.length <= 20, 'recent-question history must remain bounded');
    questions.push({ id: q.id, text: q.text, answerText: q.answerText, diff: q.diff, target: q.target });
  }
  return questions;
}

// A fixed seed must produce an identical sequence, and every tier must sustain
// a long run without invalid answers, non-finite metadata, or recent repeats.
for (const tier of E.TIERS) {
  const first = generatedSequence(tier.id, 0x51A7 + tier.index, 1000);
  const second = generatedSequence(tier.id, 0x51A7 + tier.index, 1000);
  assert.deepEqual(second, first, tier.id + ' must be reproducible for a fixed seed');
}

// Every declared recipe must resolve to a generator function.
for (const tier of E.TIERS) {
  for (const recipe of tier.recipes) {
    assert.equal(typeof E.GENERATORS[recipe[0]], 'function',
      'missing generator ' + recipe[0] + ' in tier ' + tier.id);
  }
}

// Fixed-size decks must preserve their requested length and 80/20 tier mix.
for (const tier of E.TIERS) {
  const rng = E.makeRng(0xD3C + tier.index);
  const deck = E.buildDeck(tier.id, 80, rng);
  assert.equal(deck.length, 80, tier.id + ' deck should contain exactly 80 slots');
  const lowerTier = tier.index > 0 ? E.TIERS[tier.index - 1].id : null;
  const lowerCount = deck.filter(slot => slot.tier === lowerTier).length;
  assert.equal(lowerCount, tier.index > 0 ? 16 : 0, tier.id + ' deck should contain the expected lower-tier mix');
  const ctx = { recent: [] };
  for (const slot of deck) validateQuestion(E.deckQuestion(slot, rng, ctx));
}

// Drill pools and retry generation must remain usable for every exposed skill.
for (const tier of E.TIERS) {
  for (const skill of E.SKILLS) {
    const rng = E.makeRng(0xBEEF + tier.index * 100 + E.SKILLS.indexOf(skill));
    const ctx = { recent: [] };
    for (let i = 0; i < 12; i++) {
      const q = E.drillQuestion([skill], null, tier.id, rng, ctx);
      validateQuestion(q);
    }
  }
}
{
  const rng = E.makeRng(0xA11CE);
  const ctx = { recent: [] };
  const original = E.nextQuestion('adept', rng, ctx);
  const retry = E.retryQuestion(original, rng, ctx);
  assert.ok(retry, 'retry should return a question for a generated question');
  assert.equal(retry.id, original.id, 'retry should preserve the original recipe');
  validateQuestion(retry);
}

// Trick generators have intentionally small pools, so repeats are permitted;
// their answers and metadata must still remain valid.
for (const trick of E.TRICKS) {
  const rng = E.makeRng(0x7A1C + E.TRICKS.indexOf(trick));
  const ctx = { recent: [] };
  for (let i = 0; i < 40; i++) validateQuestion(E.trickQuestion(trick.id, rng, ctx));
}

console.log('PASS: maths engine generation, answer consistency, seeded reproducibility, recent-repeat avoidance, decks, drills, retries, and tricks');
