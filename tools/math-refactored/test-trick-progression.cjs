#!/usr/bin/env node
'use strict';

const assert = require('node:assert/strict');
const P = require('./trick-progression.js');

const baseline = { n: 6, acc: 0.5, med: 5, ratio: 1.1, ts: 1 };
const masteredPost = { n: 6, acc: 1, med: 4, ratio: 0.9, ts: 2 };
const noImprovementPost = { n: 6, acc: 1, med: 4.5, ratio: 0.9, ts: 2 };

assert.equal(P.isMastered({ post: masteredPost }), false, 'mastery requires a real baseline');
assert.equal(P.isMastered({ base: baseline, post: { ...masteredPost, acc: 0.89 } }), false, 'mastery requires at least 90% accuracy');
assert.equal(P.isMastered({ base: baseline, post: noImprovementPost }), false, 'target ratio alone must not substitute for demonstrated improvement');
assert.equal(P.isMastered({ base: baseline, post: masteredPost }), true, '90%+ accuracy and 20% speed-up should master');

const sixCorrect = Array.from({ length: 6 }, () => ({ result: 'correct' }));
const threeCorrect = sixCorrect.slice(0, 3);
const fiveAndSkip = [...sixCorrect.slice(0, 5), { result: 'skip' }];
assert.equal(P.assessmentValid('baseline', 6, sixCorrect), true, 'complete baseline is valid');
assert.equal(P.assessmentValid('post', 6, threeCorrect), false, 'early post-test cannot be recorded');
assert.equal(P.assessmentValid('baseline', 6, fiveAndSkip), false, 'baseline with a skip is invalid');
assert.equal(P.assessmentValid('post', 6, sixCorrect.slice(0, 5)), false, 'short post-test is invalid');
assert.equal(P.assessmentValid('practice', 10, Array.from({ length: 5 }, () => ({ result: 'wrong' }))), true, 'practice retains its half-sample rule');
assert.equal(P.assessmentValid('unknown', 6, sixCorrect), false, 'unknown phase is invalid');

const record = { base: baseline, post: masteredPost, masteryRewarded: false };
assert.equal(P.replaceBaseline(record, { ...baseline, med: 8 }), true, 'retake is detected');
assert.equal(record.post, null, 'retaking baseline invalidates the previous post-test');
assert.equal(record.practiceSinceBaseline, 0, 'retaking baseline resets the practice requirement');
assert.equal(P.canTakePostTest(record), false, 'post-test stays locked until practice after the latest baseline');
assert.equal(P.awardFirstMastery(record), false, 'cannot award mastery while post-test is invalidated');
record.skipBase = true;
assert.equal(P.canTakePostTest(record), false, 'skipping baseline does not skip the practice requirement');
record.practiceSinceBaseline = 1;
assert.equal(P.canTakePostTest(record), true, 'practice unlocks the post-test');
record.practiceSinceBaseline = 0;
record.skipBase = false;
record.post = masteredPost;
assert.equal(P.awardFirstMastery(record), true, 'first mastery grants the one-time flag');
assert.equal(P.awardFirstMastery(record), false, 'mastery reward cannot be repeated');
const legacy = { base: baseline, post: masteredPost };
P.migrateMasteryReward(legacy);
assert.equal(legacy.masteryRewarded, true, 'existing mastered records are migrated without re-awarding');

console.log('Trick Chamber progression tests passed: mastery thresholds, complete assessments, baseline invalidation, and one-time reward migration.');
