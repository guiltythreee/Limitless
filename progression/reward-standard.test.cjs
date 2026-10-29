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
  const events = [];
  const ledger = Rewards.createLedger(storage, () => now, detail => events.push(detail));
  return { storage, ledger, events, setNow: value => { now = value; } };
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

test('every fixed activity class is covered for every difficulty tier', () => {
  const matrix = {
    'micro-practice': [5, 6, 8],
    'standard-task': [10, 13, 15],
    'focused-practice': [20, 25, 30],
    assessment: [25, 31, 38],
    milestone: [50, 63, 75],
    'course-completion': [100, 125, 150],
  };
  const tiers = ['foundational', 'intermediate', 'advanced'];
  for (const [activityClass, expected] of Object.entries(matrix)) {
    for (let i = 0; i < tiers.length; i++) {
      const result = Rewards.calculateAward({ activityClass, difficulty: tiers[i] });
      assert.equal(result.ok, true, activityClass + ' / ' + tiers[i]);
      assert.equal(result.xp, expected[i], activityClass + ' / ' + tiers[i]);
      assert.equal(result.version, 'LSR-1');
    }
  }
});

test('only explicitly registered modules can post standard rewards', () => {
  const { ledger } = setup();
  const result = ledger.record({
    module: 'future-module-not-registered',
    eventId: 'unregistered-attempt',
    contentKey: 'q1',
    activityClass: 'micro-practice',
    evidence: 'submitted-answer'
  });
  assert.equal(result.ok, false);
  assert.equal(result.error, 'unregistered-module');
  assert.equal(ledger.summary().xp, 0);
  assert.deepEqual(Rewards.REGISTERED_MODULES.map((module) => module.id), [
    'bookkeys', 'math-trainer', 'probability', 'metallurgy', 'personal-projects'
  ]);
  const personalTask = ledger.record({
    module: 'personal-projects',
    eventId: 'unregistered-project-task',
    contentKey: 'arbitrary-task',
    activityClass: 'standard-task',
    evidence: 'completed-session'
  });
  assert.equal(personalTask.ok, false);
  assert.equal(personalTask.error, 'module-only-supports-registered-projects');
  const metallurgy = ledger.record({
    module: 'metallurgy',
    eventId: 'metallurgy-attempt',
    contentKey: 'metallurgy:q1',
    activityClass: 'micro-practice',
    evidence: 'submitted-answer'
  });
  assert.equal(metallurgy.ok, true);
});

test('arbitrary multiplier values and unknown difficulty tiers are rejected', () => {
  const { ledger } = setup();
  const result = ledger.record({
    module: 'probability',
    eventId: 'arbitrary-multiplier',
    contentKey: 'q',
    activityClass: 'standard-task',
    evidence: 'completed-session',
    difficulty: 'x100',
  });
  assert.equal(result.ok, false);
  assert.equal(result.error, 'unknown-difficulty');
  assert.equal(ledger.summary().xp, 0);
});

test('a fresh ledger instance reloads the saved total and recovers duplicates safely', () => {
  const { ledger, storage } = setup();
  const input = {
    module: 'probability',
    eventId: 'reload-safe:attempt:1',
    contentKey: 'probability:question:reload-safe',
    activityClass: 'micro-practice',
    evidence: 'submitted-answer',
    difficulty: 'foundational',
  };
  const first = ledger.record(input);
  assert.equal(first.xp, 5);
  const reloaded = Rewards.createLedger(storage, () => Date.UTC(2026, 9, 28, 9), () => {});
  assert.equal(reloaded.summary().xp, 5);
  const duplicate = reloaded.record(input);
  assert.equal(duplicate.ok, true);
  assert.equal(duplicate.duplicate, true);
  assert.equal(reloaded.summary().xp, 5);
  assert.equal(reloaded.read().awards.length, 1);
});

test('callers cannot inject arbitrary XP into a fixed activity award', () => {
  const { ledger } = setup();
  const receipt = ledger.record({
    module: 'probability',
    eventId: 'ignored-xp-field',
    contentKey: 'probability:question:fixed-base',
    activityClass: 'standard-task',
    evidence: 'completed-session',
    difficulty: 'foundational',
    xp: 1000000,
    baseExp: 999999,
    multiplier: 99,
  });
  assert.equal(receipt.ok, true);
  assert.equal(receipt.xp, 10);
  assert.equal(ledger.summary().xp, 10);
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
  assert.deepEqual(Rewards.unlocksForLevel(25).map((reward) => reward.level), [2, 5, 10, 10, 15, 20, 20, 25]);
  assert.equal(Rewards.nextUnlockForLevel(30), null);
  const { ledger } = setup();
  ledger.recordMany(Array.from({ length: 20 }, (_, i) => ({
    module: 'probability', eventId: `unlock-${i}`, contentKey: `question-${i}`, activityClass: 'standard-task', evidence: 'completed-session'
  })));
  assert.equal(ledger.summary().level, 2);
  assert.deepEqual(ledger.summary().unlockedRewards.map((reward) => reward.id), ['first-light']);
});

test('completion evidence must match the normalized activity class', () => {
  const { ledger } = setup();
  const result = ledger.record({
    module: 'probability', eventId: 'wrong-evidence', contentKey: 'q1',
    activityClass: 'micro-practice', evidence: 'completed-session'
  });
  assert.equal(result.ok, false);
  assert.equal(result.error, 'completion-evidence-does-not-fit-activity');
  assert.equal(ledger.summary().xp, 0);
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

test('legacy awards remain in the ledger with explicit fallback evidence and duplicate IDs counted once', () => {
  const { ledger, storage } = setup();
  storage.setItem(Rewards.STORAGE_KEY, JSON.stringify({
    standard: 'LSR-1',
    totalXp: 999,
    awards: [
      { id: 'legacy-row', c: 'old:content', d: '2026-10-28', x: 7, t: 1 },
      { id: 'legacy-row', c: 'old:content', d: '2026-10-28', x: 11, t: 2 }
    ]
  }));
  const summary = ledger.summary();
  assert.equal(summary.xp, 7);
  assert.equal(summary.awardCount, 1);
  assert.equal(summary.recentAwards[0].evidence, 'legacy-record');
  assert.match(summary.recentAwards[0].reason, /Legacy award retained/);
  assert.equal(JSON.parse(storage.raw(Rewards.STORAGE_KEY)).totalXp, 999, 'summary is read-only until the next successful write');
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

test('the module summary reconciles EXP and exposes earned discipline milestones', () => {
  const { ledger } = setup();
  ledger.record({
    module: 'bookkeys', eventId: 'book-page', contentKey: 'book:abc:page:1',
    activityClass: 'standard-task', evidence: 'typed-page'
  });
  ledger.record({
    module: 'bookkeys', eventId: 'book-mastery', contentKey: 'book:abc',
    activityClass: 'milestone', evidence: 'milestone-complete', oneTimeKey: 'book:abc:complete'
  });
  ledger.record({
    module: 'probability', eventId: 'probability-answer', contentKey: 'probability:q1',
    activityClass: 'micro-practice', evidence: 'submitted-answer'
  });
  const summary = ledger.summary();
  assert.equal(summary.xp, 65);
  assert.equal(summary.xpByModule.bookkeys, 60);
  assert.equal(summary.xpByModule.probability, 5);
  assert.equal(Object.values(summary.xpByModule).reduce((sum, xp) => sum + xp, 0), summary.xp);
  assert.equal(summary.disciplineAchievements.length, 1);
  assert.equal(summary.disciplineAchievements[0].module, 'bookkeys');
  assert.equal(summary.disciplineAchievements[0].contentKey, 'book:abc');
});

test('unlocked titles and emblems can be equipped without changing lifetime EXP', () => {
  const { ledger } = setup();
  const inputs = Array.from({ length: 12 }, (_, i) => ({
    module: 'probability', eventId: `lesson-${i}`, contentKey: `lesson-${i}`,
    activityClass: 'standard-task', evidence: 'completed-session'
  }));
  ledger.recordMany(inputs);
  const before = ledger.summary().xp;
  assert.equal(ledger.summary().level, 2);
  assert.equal(ledger.equipReward('first-light', 'title').ok, true);
  assert.equal(ledger.summary().equippedTitle.id, 'first-light');
  assert.equal(ledger.equipReward('polymath', 'title').error, 'reward-not-unlocked');
  assert.equal(ledger.equipReward('scholars-mark', 'emblem').error, 'reward-not-unlocked');
  assert.equal(ledger.equipReward('', 'title').ok, true);
  assert.equal(ledger.summary().equippedTitle, null);
  assert.equal(ledger.summary().xp, before, 'equipment changes must never alter earned EXP');
});

test('Level 10 and later unlocks include equipable profile effects', () => {
  const { ledger, events } = setup();
  ledger.recordMany(Array.from({ length: 180 }, (_, i) => ({
    module: 'probability', eventId: `profile-effect-${i}`, contentKey: `profile-effect-content-${i}`,
    activityClass: 'standard-task', evidence: 'completed-session'
  })));
  assert.equal(ledger.summary().level, 10);
  const levelEvent = events.find((event) => event && event.levelUp);
  assert.ok(levelEvent);
  assert.deepEqual(levelEvent.levelsCrossed, [2, 3, 4, 5, 6, 7, 8, 9, 10]);
  assert.equal(ledger.equipReward('polymath-glow', 'profile-effect').ok, true);
  assert.equal(ledger.summary().equippedProfileEffect.id, 'polymath-glow');
  assert.equal(ledger.equipReward('limitless-aura', 'profile-effect').error, 'reward-not-unlocked');
});

test('each level-up emits a durable acknowledgement event only after persistence', () => {
  const { ledger, events } = setup();
  for (let i = 0; i < 10; i++) {
    ledger.record({
      module: 'probability', eventId: `level-up-${i}`, contentKey: `level-up-content-${i}`,
      activityClass: 'standard-task', evidence: 'completed-session'
    });
  }
  const levelEvent = events.find(event => event && event.levelUp);
  assert.ok(levelEvent);
  assert.equal(levelEvent.levelBefore, 1);
  assert.equal(levelEvent.levelAfter, 2);
  assert.ok(levelEvent.xpGained > 0);
  assert.equal(ledger.summary().level, 2);
});

test('bespoke projects require a pre-registered immutable 20–100 EXP definition', () => {
  const { ledger } = setup();
  assert.deepEqual(Rewards.PROJECT_EXP_RANGE, { min: 20, max: 100 });
  assert.equal(ledger.registerProject({
    module: 'probability', projectId: 'mini-study', baseExp: 19,
    title: 'Mini study', scope: 'One lesson', criteria: 'Deliver a valid result'
  }).error, 'invalid-project-base-exp');
  assert.equal(ledger.registerProject({
    module: 'probability', projectId: 'oversized-study', baseExp: 101,
    title: 'Oversized study', scope: 'One lesson', criteria: 'Deliver a valid result'
  }).error, 'invalid-project-base-exp');

  const completion = {
    module: 'probability',
    eventId: 'project-completion:probability:mini-study',
    contentKey: 'project:probability:mini-study',
    activityClass: 'bespoke-project',
    evidence: 'project-complete',
    difficulty: 'advanced',
    projectId: 'mini-study',
    oneTimeKey: 'project-completion:probability:mini-study'
  };
  assert.equal(ledger.record(completion).error, 'unregistered-project');

  const boundaryLedger = setup().ledger;
  assert.equal(boundaryLedger.registerProject({
    module: 'personal-projects', projectId: 'minimum-reward', baseExp: 20,
    title: 'Minimum project', scope: 'Small scope', criteria: 'Meet the exact minimum project criteria'
  }).ok, true);
  assert.equal(boundaryLedger.registerProject({
    module: 'personal-projects', projectId: 'maximum-reward', baseExp: 100,
    title: 'Maximum project', scope: 'Large scope', criteria: 'Meet the exact maximum project criteria'
  }).ok, true);
  assert.equal(ledger.registerProject({
    module: 'arbitrary-module', projectId: 'bad-namespace', baseExp: 50,
    title: 'Invalid namespace', scope: 'Scope', criteria: 'Criteria'
  }).error, 'unsupported-project-module');
  assert.equal(ledger.registerProject({
    module: 'probability', projectId: 'invalid:id', baseExp: 50,
    title: 'Invalid ID', scope: 'Scope', criteria: 'Criteria'
  }).error, 'invalid-project-id');

  const definition = {
    module: 'probability',
    projectId: 'mini-study',
    baseExp: 60,
    title: 'Probability mini-study',
    scope: 'Develop and explain a small probability model',
    criteria: 'Include a verified result, a worked argument, and a limitations note'
  };
  const registered = ledger.registerProject(definition);
  assert.equal(registered.ok, true);
  assert.equal(registered.project.baseExp, 60);
  assert.equal(ledger.registerProject(definition).duplicate, true);
  assert.equal(ledger.registerProject({ ...definition, baseExp: 80 }).error, 'project-definition-immutable');
  assert.equal(ledger.registerProject({ ...definition, criteria: 'Changed after starting' }).error, 'project-definition-immutable');

  assert.equal(ledger.record({ ...completion, eventId: 'project-completion:probability:mini-study:retry' }).error, 'invalid-project-event-key');
  const receipt = ledger.record(completion);
  assert.equal(receipt.ok, true);
  assert.equal(receipt.xp, 90);
  assert.equal(receipt.breakdown.baseExp, 60);
  assert.equal(receipt.breakdown.difficultyMultiplier, 1.5);
  assert.equal(ledger.record(completion).duplicate, true);
  assert.equal(ledger.summary().xp, 90);
  assert.equal(ledger.summary().xpByModule.probability, 90);
  assert.equal(ledger.summary().disciplineAchievements.length, 1);
  assert.equal(ledger.summary().disciplineAchievements[0].activityClass, 'bespoke-project');
  assert.equal(ledger.summary().recentAwards[0].projectTitle, 'Probability mini-study');
  assert.equal(ledger.read().projects.length, 1);
});

test('invalid events do not alter the ledger and storage errors fail closed', () => {
  const { ledger } = setup();
  assert.equal(ledger.record({ module: 'probability' }).ok, false);
  assert.equal(ledger.summary().xp, 0);
  const broken = Rewards.createLedger({ getItem() { return null; }, setItem() { throw new Error('quota'); } }, () => 1, () => {});
  assert.equal(broken.record({ module: 'probability', eventId: 'x', contentKey: 'y', activityClass: 'standard-task', evidence: 'completed-session' }).ok, false);
  assert.equal(ledger.summary().xp, 0);
});