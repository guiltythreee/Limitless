/* Mixed-skill variety and 80-in-8 deck ordering regression tests.
   Run: node tools/math-refactored/test-math-skill-variety.cjs */
'use strict';
const assert = require('node:assert/strict');
const E = require('./engine.js');

const SAMPLE_COUNT = 12000;
const DECK_SESSIONS = 250;

function skillOfQuestion(q) {
  return q.skill || E.RECIPE_SKILL[q.id];
}

function assertValidQuestion(q, label) {
  assert.ok(q && E.SKILLS.includes(skillOfQuestion(q)), label + ': missing/unknown skill');
  assert.ok(Number.isFinite(q.diff) && q.diff > 0, label + ': invalid difficulty');
  assert.ok(Number.isFinite(q.target) && q.target > 0, label + ': invalid target');
  assert.equal(E.checkAnswer(q, q.answerText, true).status, 'correct',
    label + ': displayed answer should be accepted');
}

function longestRun(items, key) {
  let previous = null, current = 0, longest = 0;
  for (const item of items) {
    const value = key(item);
    current = value === previous ? current + 1 : 1;
    previous = value;
    longest = Math.max(longest, current);
  }
  return longest;
}

/* Mirror the public deck allocation rule so tests can ensure ordering does not
   accidentally add, drop, or change any recipe slots. */
function allocate(recipes, total) {
  const sum = recipes.reduce((n, recipe) => n + recipe[1], 0);
  const raw = recipes.map(recipe => recipe[1] / sum * total);
  const base = raw.map(Math.floor);
  const used = base.reduce((n, count) => n + count, 0);
  const order = raw.map((value, index) => [value - base[index], index])
    .sort((a, b) => b[0] - a[0]);
  for (let i = 0; i < total - used; i++) base[order[i][1]]++;
  return base;
}

function slotKey(tierId, recipe) {
  return tierId + '|' + recipe[0] + '|' + JSON.stringify(recipe[2]);
}

const nextQuestionSummaries = [];
for (const tier of E.TIERS) {
  const rng = E.makeRng(884200 + tier.index);
  const ctx = { recent: [] };
  let previousSkill = null, skillRun = 0, longestSkillRun = 0;
  let previousRecipe = null, recipeRun = 0, longestRecipeRun = 0;

  for (let i = 0; i < SAMPLE_COUNT; i++) {
    const recentBefore = ctx.recent.slice();
    const q = E.nextQuestion(tier.id, rng, ctx);
    assertValidQuestion(q, tier.id + '/question ' + i);
    assert.ok(!recentBefore.includes(q.text),
      tier.id + '/' + q.id + ': repeated question inside the recent-question window');

    const skill = skillOfQuestion(q);
    skillRun = skill === previousSkill ? skillRun + 1 : 1;
    recipeRun = q.id === previousRecipe ? recipeRun + 1 : 1;
    previousSkill = skill;
    previousRecipe = q.id;
    longestSkillRun = Math.max(longestSkillRun, skillRun);
    longestRecipeRun = Math.max(longestRecipeRun, recipeRun);

    assert.ok(skillRun <= 2, tier.id + ': three consecutive questions from ' + skill);
    assert.ok(recipeRun <= 2, tier.id + ': three consecutive questions from recipe ' + q.id);
  }

  nextQuestionSummaries.push({
    tier: tier.id,
    samples: SAMPLE_COUNT,
    longestSkillRun,
    longestRecipeRun
  });
}

const deckSummaries = [];
for (const tier of E.TIERS) {
  const rng = E.makeRng(991700 + tier.index);
  let longestSkillRun = 0, longestRecipeRun = 0, decksChecked = 0;

  for (let session = 0; session < DECK_SESSIONS; session++) {
    const deck = E.buildDeck(tier.id, 80, rng);
    assert.equal(deck.length, 80, tier.id + ': deck must contain exactly 80 slots');

    const below = tier.index > 0 ? E.TIERS[tier.index - 1] : null;
    const belowCount = below ? Math.round(80 * 0.2) : 0;
    assert.equal(deck.filter(slot => slot.tier === tier.id).length, 80 - belowCount,
      tier.id + ': selected-tier slot count changed');
    if (below) {
      assert.equal(deck.filter(slot => slot.tier === below.id).length, belowCount,
        tier.id + ': lower-tier slot count changed');
    }

    const expected = new Map();
    function addExpected(t, count) {
      const counts = allocate(t.recipes, count);
      counts.forEach((n, index) => {
        if (n) expected.set(slotKey(t.id, t.recipes[index]), n);
      });
    }
    addExpected(tier, 80 - belowCount);
    if (below) addExpected(below, belowCount);

    const actual = new Map();
    deck.forEach(slot => {
      const key = slotKey(slot.tier, slot.rec);
      actual.set(key, (actual.get(key) || 0) + 1);
    });
    assert.deepEqual(actual, expected, tier.id + ': deck shuffle changed allocated recipe counts');

    for (let i = 1; i < deck.length; i++) {
      assert.notEqual(deck[i].rec[0], deck[i - 1].rec[0],
        tier.id + ': adjacent slots use the same recipe');
    }

    const ctx = { recent: [] };
    const questions = deck.map((slot, index) => {
      const q = E.deckQuestion(slot, rng, ctx);
      assertValidQuestion(q, tier.id + '/deck ' + session + '/question ' + index);
      assert.equal(skillOfQuestion(q), E.RECIPE_SKILL[slot.rec[0]],
        tier.id + ': question skill does not match its recipe');
      return q;
    });

    const skillRun = longestRun(questions, skillOfQuestion);
    const recipeRun = longestRun(questions, q => q.id);
    assert.ok(skillRun <= 2, tier.id + ': deck contains a three-question skill streak');
    assert.ok(recipeRun <= 2, tier.id + ': deck contains a three-question recipe streak');
    longestSkillRun = Math.max(longestSkillRun, skillRun);
    longestRecipeRun = Math.max(longestRecipeRun, recipeRun);
    decksChecked++;
  }

  deckSummaries.push({
    tier: tier.id,
    decksChecked,
    longestSkillRun,
    longestRecipeRun
  });
}

console.log('Mixed-skill variety checks passed (' +
  (SAMPLE_COUNT * E.TIERS.length) + ' standard questions and ' +
  (DECK_SESSIONS * E.TIERS.length) + ' decks).');
console.log(JSON.stringify({ nextQuestionSummaries, deckSummaries }, null, 2));
