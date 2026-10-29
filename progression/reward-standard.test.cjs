'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const Rewards = require('./reward-standard.js');

function memoryStorage() {
  const values = new Map();
  let writes = 0;
  return {
    getItem(key) { return values.has(key) ? values.get(key) : null; },
    setItem(key, value) { writes++; values.set(key, String(value)); },
    raw(key) { return values.get(key); },
    writes() { return writes; }
  };
}
function setup(start = Date.UTC(2026, 9, 28, 9)) {
  const storage = memoryStorage();
  let now = start;
  const ledger = Rewards.createLedger(storage, () => now, () => {});
  return { storage, ledger, setNow: value => { now = value; } };
}

test('the activity reference line has one stable, explicit base value per class', () => {
  assert.deepEqual(Rewards.BASE_EXP, {
    'micro-practice': 5, 'standard-task': 10, 'focused-practice': 20,
    assessment: 25, milestone: 50, 'course-completion': 100
  });
});

test('difficulty multipliers are explicit and applied before rounding', () => {
  assert.equal(Rewards.calculateAward({ activityClass: 'standard-task', difficulty: 'foundational' }).xp, 10);
  assert.equal(Rewards.calculateAward({ activityClass: 'standard-task', difficulty: 'intermediate' }).xp, 13);
  assert.equal(Rewards.calculateAward({ activityClass: 'standard-task', difficulty: 'advanced' }).xp, 15);
  assert.equal(Rewards.calculateAward({ activityClass: 'unknown', difficulty: 'advanced' }).ok, false);
});

test('quality bonus starts at 80% and is capped at 20% of base EXP', () => {
  assert.equal(Rewards.calculateAward({ activityClass: 'standard-task', difficulty: 'foundational', quality: 0.79 }).xp, 10);
  assert.equal(Rewards.calculateAward({ activityClass: 'standard-task', difficulty: 'foundational', quality: 0.8 }).xp, 10);
  assert.equal(Rewards.calculateAward({ activityClass: 'standard-task', difficulty: 'foundational', quality: 0.9 }).xp, 11);
  assert.equal(Rewards.calculateAward({ activityClass: 'standard-task', difficulty: 'foundational', quality: 1 }).xp, 12);
  assert.equal(Rewards.calculateAward({ activityClass: 'standard-task', difficulty: 'foundational', quality: 99 }).xp, 12);
});

test('award event IDs are idempotent and do not increase total XP twice', () => {
  const { ledger } = setup();
  const input = { module: 'probability', eventId: 'attempt-1', contentKey: 'q-1', activityClass: 'micro-practice', difficulty: 'foundational', evidence: 'submitted-answer' };
  assert.equal(ledger.record(input).xp, 5);
  const duplicate = ledger.record(input);
  assert.equal(duplicate.duplicate, true);
  assert.equal(duplicate.xp, 5);
  assert.equal(ledger.summary().xp, 5);
  assert.equal(ledger.summary().awardCount, 1);
});

test('recordMany batches multiple awards into one persistent write', () => {
  const { ledger, storage } = setup();
  const before = storage.writes();
  const receipts = ledger.recordMany([
    { module: 'math-trainer', eventId: 'run:1:q1', contentKey: 'math:q1', activityClass: 'micro-practice', evidence: 'submitted-answer' },
    { module: 'math-trainer', eventId: 'run:1:q2', contentKey: 'math:q2', activityClass: 'micro-practice', evidence: 'submitted-answer' },
    { module: 'math-trainer', eventId: 'run:1', contentKey: 'math:tier:adept', activityClass: 'focused-practice', evidence: 'completed-session' }
  ]);
  assert.deepEqual(receipts.map((receipt) => receipt.xp), [5, 5, 20]);
  assert.equal(storage.writes() - before, 1);
  assert.equal(ledger.summary().xp, 30);
  const replay = ledger.recordMany([
    { module: 'math-trainer', eventId: 'run:1:q1', contentKey: 'math:q1', activityClass: 'micro-practice', evidence: 'submitted-answer' },
    { module: 'math-trainer', eventId: 'run:1', contentKey: 'math:tier:adept', activityClass: 'focused-practice', evidence: 'completed-session' }
  ]);
  assert.equal(replay.every((receipt) => receipt.duplicate), true);
  assert.equal(ledger.summary().xp, 30);
});

test('the daily repeat rule gives three full awards, three half awards, then zero', () => {
  const { ledger } = setup();
  const xp = [];
  for (let i = 1; i <= 8; i++) xp.push(ledger.record({ module: 'probability', eventId: `event-${i}`, contentKey: 'probability:question:q1', activityClass: 'micro-practice', difficulty: 'foundational', evidence: 'submitted-answer' }).xp);
  assert.deepEqual(xp, [5, 5, 5, 3, 3, 3, 0, 0]);
  assert.equal(ledger.summary().xp, 24);
});

test('repeat caps reset on the next local calendar day', () => {
  const { ledger, setNow } = setup(Date.UTC(2026, 9, 28, 23, 59));
  assert.equal(ledger.record({ module: 'probability', eventId: 'late', contentKey: 'same-q', activityClass: 'micro-practice', evidence: 'submitted-answer' }).xp, 5);
  setNow(Date.UTC(2026, 9, 29, 0, 1));
  assert.equal(ledger.record({ module: 'probability', eventId: 'early-next-day', contentKey: 'same-q', activityClass: 'micro-practice', evidence: 'submitted-answer' }).xp, 5);
});

test('a successful assessment receives the 15 EXP first-pass bonus once per pass key', () => {
  const { ledger } = setup();
  const common = { module: 'probability', contentKey: 'bayes-test', activityClass: 'assessment', difficulty: 'intermediate', passed: true, passKey: 'probability:bayes-test', evidence: 'scored-assessment' };
  const first = ledger.record({ ...common, eventId: 'test-1' });
  assert.equal(first.xp, 46); // round(25 * 1.25 + 5) + 15
  const second = ledger.record({ ...common, eventId: 'test-2' });
  assert.equal(second.xp, 31); // still within the first-three-repeat window; no second pass bonus
  assert.equal(ledger.summary().xp, 77);
});

test('milestone one-time keys prevent a reward from being paid under a different event ID', () => {
  const { ledger } = setup();
  const base = { module: 'bookkeys', contentKey: 'book-abc', activityClass: 'milestone', oneTimeKey: 'bookkeys:book:abc', evidence: 'milestone-complete' };
  assert.equal(ledger.record({ ...base, eventId: 'complete-1' }).xp, 50);
  const duplicateMilestone = ledger.record({ ...base, eventId: 'complete-2' });
  assert.equal(duplicateMilestone.xp, 0);
  assert.equal(duplicateMilestone.oneTimeAlreadyAwarded, true);
  assert.equal(ledger.summary().xp, 50);
});

test('milestone classes require a stable one-time key', () => {
  const { ledger } = setup();
  const result = ledger.record({ module: 'bookkeys', eventId: 'bad-milestone', contentKey: 'book-abc', activityClass: 'milestone', evidence: 'milestone-complete' });
  assert.equal(result.ok, false);
  assert.equal(result.error, 'missing-one-time-key');
  assert.equal(ledger.summary().xp, 0);
});

test('the level curve begins at 100 EXP and each next level costs 25 more', () => {
  assert.deepEqual(Rewards.levelForXp(0), { level: 1, xp: 0, xpIntoLevel: 0, xpForNextLevel: 100, nextLevelAt: 100, progress: 0 });
  assert.equal(Rewards.levelForXp(99).level, 1);
  assert.equal(Rewards.levelForXp(100).level, 2);
  assert.equal(Rewards.levelForXp(224).level, 2);
  assert.equal(Rewards.levelForXp(225).level, 3);
  assert.equal(Rewards.levelForXp(225).xpForNextLevel, 150);
});

test('universal reward unlocks are derived from the global level, not any discipline', () => {
  assert.equal(Rewards.nextUnlockForLevel(1).name, 'First Light');
  assert.deepEqual(Rewards.unlocksForLevel(1), []);
  assert.deepEqual(Rewards.unlocksForLevel(5).map((reward) => reward.id), ['first-light', 'scholars-mark']);
  assert.equal(Rewards.nextUnlockForLevel(5).name, 'Polymath');
  assert.equal(Rewards.nextUnlockForLevel(14).name, 'Wayfinder');
  assert.equal(Rewards.nextUnlockForLevel(24).name, 'Luminous Archive');
  assert.deepEqual(Rewards.unlocksForLevel(25).map((reward) => reward.level), [2, 5, 10, 15, 20, 25]);
  assert.equal(Rewards.nextUnlockForLevel(30), null);
  const { ledger } = setup();
  ledger.recordMany(Array.from({ length: 20 }, (_, i) => ({
    module: 'probability', eventId: `unlock-${i}`, contentKey: `question-${i}`, activityClass: 'standard-task', evidence: 'completed-session'
  })));
  assert.equal(ledger.summary().level, 2);
  assert.deepEqual(ledger.summary().unlockedRewards.map((reward) => reward.id), ['first-light']);
});

test('stored totalXp is only a cache; authoritative award history controls the total', () => {
  const { ledger, storage } = setup();
  storage.setItem(Rewards.STORAGE_KEY, JSON.stringify({
    standard: 'LSR-1', totalXp: 9999,
    awards: [{ id: 'real-award', m: 'probability', c: 'q1', a: 'micro-practice', e: 'submitted-answer', d: '2026-10-28', t: 1, x: 5, v: 'LSR-1' }]
  }));
  assert.equal(ledger.summary().xp, 5);
  assert.equal(ledger.record({ module: 'probability', eventId: 'second-award', contentKey: 'q2', activityClass: 'micro-practice', evidence: 'submitted-answer' }).xp, 5);
  const persisted = JSON.parse(storage.raw(Rewards.STORAGE_KEY));
  assert.equal(persisted.totalXp, 10);
  assert.equal(persisted.awards.reduce((sum, award) => sum + award.x, 0), 10);
});

test('pass bonus is a separate, idempotent, explainable award record', () => {
  const { ledger, storage } = setup();
  const event = { module: 'probability', contentKey: 'midterm', activityClass: 'assessment', evidence: 'scored-assessment', difficulty: 'intermediate', passed: true, passKey: 'probability:midterm' };
  const receipt = ledger.record({ ...event, eventId: 'assessment-attempt-1' });
  assert.equal(receipt.xp, 46);
  const rows = ledger.read().awards;
  assert.equal(rows.length, 2);
  assert.equal(rows[0].id, 'assessment-attempt-1');
  assert.equal(rows[0].x, 31);
  assert.equal(rows[1].id, 'first-pass:probability:midterm');
  assert.equal(rows[1].x, 15);
  assert.equal(rows[1].bonusType, 'first-pass');
  assert.equal(ledger.record({ ...event, eventId: 'assessment-attempt-1' }).xp, 46);
  assert.equal(ledger.summary().xp, 46);
  assert.equal(JSON.parse(storage.raw(Rewards.STORAGE_KEY)).awards.reduce((sum, award) => sum + award.x, 0), 46);
});

test('completion evidence is required for any saved reward', () => {
  const { ledger } = setup();
  const receipt = ledger.record({ module: 'probability', eventId: 'no-evidence', contentKey: 'q1', activityClass: 'micro-practice' });
  assert.equal(receipt.ok, false);
  assert.equal(receipt.error, 'missing-or-unknown-completion-evidence');
  assert.equal(ledger.summary().xp, 0);
});

test('invalid events do not alter the ledger and storage errors fail closed', () => {
  const { ledger } = setup();
  assert.equal(ledger.record({ module: 'probability' }).ok, false);
  assert.equal(ledger.summary().xp, 0);
  const broken = Rewards.createLedger({ getItem() { return null; }, setItem() { throw new Error('quota'); } }, () => 1, () => {});
  assert.equal(broken.record({ module: 'probability', eventId: 'x', contentKey: 'y', activityClass: 'standard-task', evidence: 'completed-session' }).ok, false);
  assert.equal(ledger.summary().xp, 0);
});