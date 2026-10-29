'use strict';
/*
 * LSR-1 representative-week calibration.
 *
 * This is a transparent scenario, not a claim about measured user behaviour.
 * Change the workload counts only when there is real study-log data to compare.
 * The check is deliberately about avoiding a large reward imbalance caused by
 * event granularity alone; it does not tune EXP values automatically.
 */
const assert = require('node:assert/strict');
const Rewards = require('./reward-standard.js');

const MONDAY = Date.UTC(2026, 9, 26, 12, 0, 0);
let now = MONDAY;
const values = new Map();
const storage = {
  getItem(key) { return values.has(key) ? values.get(key) : null; },
  setItem(key, value) { values.set(key, String(value)); }
};
const ledger = Rewards.createLedger(storage, () => now, () => {});
function day(offset) { now = MONDAY + offset * 24 * 60 * 60 * 1000; }
function award(input) {
  const receipt = ledger.record(input);
  assert.equal(receipt.ok, true, JSON.stringify({ input, receipt }));
  return receipt.xp;
}

// Bookkeys: 13 newly completed pages across a single real book, followed by
// its one-time completed-book milestone. It awards by completed page, not key.
let bookkeysXp = 0;
for (let page = 0; page < 13; page++) {
  day(Math.min(4, Math.floor(page * 5 / 13)));
  bookkeysXp += award({
    module: 'bookkeys',
    eventId: 'bookkeys:calibration-book:page:' + page,
    contentKey: 'bookkeys:passage:calibration-page-' + page,
    activityClass: 'standard-task',
    evidence: 'typed-page',
    difficulty: 'foundational',
    reason: 'Calibration: one newly typed page'
  });
}
day(4);
bookkeysXp += award({
  module: 'bookkeys',
  eventId: 'bookkeys:calibration-book:complete',
  contentKey: 'bookkeys:calibration-book',
  activityClass: 'milestone',
  evidence: 'milestone-complete',
  difficulty: 'foundational',
  oneTimeKey: 'bookkeys:calibration-book:complete',
  reason: 'Calibration: 13-page book completed'
});

// Math Trainer: three substantial sessions spread across the week. One session
// clears its tier, earning a distinct assessment and one-time mastery reward.
// It intentionally rewards at the session level, not per answer click.
let mathXp = 0;
const qualities = [0.85, 0.9, 0.95];
for (let i = 0; i < qualities.length; i++) {
  day(i * 2);
  mathXp += award({
    module: 'math-trainer',
    eventId: 'math:calibration:run:' + i,
    contentKey: 'math:session:practice:adept:normal',
    activityClass: 'focused-practice',
    evidence: 'completed-session',
    difficulty: 'intermediate',
    quality: qualities[i],
    reason: 'Calibration: 12 answered questions in a finished session'
  });
}
day(4);
mathXp += award({
  module: 'math-trainer',
  eventId: 'math:calibration:tier-pass',
  contentKey: 'math:tier-pass:adept',
  activityClass: 'assessment',
  evidence: 'scored-assessment',
  difficulty: 'intermediate',
  quality: 0.95,
  passed: true,
  passKey: 'math:tier-clear:adept',
  reason: 'Calibration: the selected tier was cleared'
});
mathXp += award({
  module: 'math-trainer',
  eventId: 'math:calibration:tier-mastery',
  contentKey: 'math:tier-mastery:adept',
  activityClass: 'milestone',
  evidence: 'unit-mastery',
  difficulty: 'intermediate',
  quality: 0.95,
  oneTimeKey: 'math:tier-mastery:adept',
  reason: 'Calibration: first verified tier mastery'
});

// Probability: twelve practice questions that complete one topic's mastery
// threshold, plus one meaningful 12-question assessment. The test's own answer
// attempts are NOT paid a second time as standalone micro-practice.
let probabilityXp = 0;
for (let question = 0; question < 12; question++) {
  day(Math.floor(question / 3));
  probabilityXp += award({
    module: 'probability',
    eventId: 'probability:calibration:practice-attempt:' + question,
    contentKey: 'probability:question:calibration-lesson-' + question,
    activityClass: 'micro-practice',
    evidence: 'submitted-answer',
    difficulty: 'intermediate',
    quality: 0.9,
    reason: 'Calibration: one submitted question attempt'
  });
}
day(4);
probabilityXp += award({
  module: 'probability',
  eventId: 'probability:calibration:assessment',
  contentKey: 'probability:assessment:calibration-set',
  activityClass: 'assessment',
  evidence: 'scored-assessment',
  difficulty: 'intermediate',
  quality: 0.9,
  passed: true,
  passKey: 'probability:assessment-pass:calibration-set',
  reason: 'Calibration: meaningful scored assessment completed'
});
probabilityXp += award({
  module: 'probability',
  eventId: 'probability:calibration:topic-mastery',
  contentKey: 'probability:lesson-mastery:calibration-lesson',
  activityClass: 'milestone',
  evidence: 'topic-mastery',
  difficulty: 'intermediate',
  quality: 0.9,
  oneTimeKey: 'probability:lesson-mastery:calibration-lesson',
  reason: 'Calibration: all questions in one topic mastered'
});

const summary = ledger.summary();
const totals = {
  bookkeys: bookkeysXp,
  'math-trainer': mathXp,
  probability: probabilityXp
};
const valuesByModule = Object.values(totals);
const minimum = Math.min(...valuesByModule);
const maximum = Math.max(...valuesByModule);
const ratio = maximum / minimum;
assert.equal(summary.xp, Object.values(summary.xpByModule).reduce((sum, value) => sum + value, 0));
assert.deepEqual(summary.xpByModule, totals);
assert.ok(ratio <= 1.25, 'Expected weekly module totals within 25%; got ' + ratio.toFixed(3));

const report = {
  standard: Rewards.VERSION,
  scenario: 'Representative five-day study week (synthetic, stated assumptions)',
  assumptions: {
    bookkeys: '13 newly typed pages and one completed-book milestone',
    mathTrainer: '3 substantive sessions, one tier clear, and one first tier-mastery milestone',
    probability: '12 practice question attempts, one passed 12-question assessment (assessment answers excluded from per-question awards), and one topic-mastery milestone',
    policy: 'Shared LSR-1 class values, difficulty multipliers, quality rules, and one-time keys'
  },
  expByModule: totals,
  totalExp: summary.xp,
  minToMaxRatio: Number(ratio.toFixed(3)),
  criterion: 'largest weekly total is no more than 1.25 times the smallest in this scenario',
  result: 'PASS'
};
process.stdout.write(JSON.stringify(report, null, 2) + '\n');
