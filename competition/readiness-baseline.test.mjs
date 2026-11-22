import assert from 'node:assert/strict';
import {
  ICPC_INDIA_2026, QUANTFEST_HISTORY, icpcIndiaBand, equivalentSolved, quantfestStage,
  summarizeProgress, READY_TOPICS_PER_WEEK,
  parseMinutes, classifyTask, normalizeWeights, coverageByMinutes, masteryFractions,
  mockPerformance, computeIndex, DEFAULT_SUBJECT_WEIGHTS, DEFAULT_COMPONENT_WEIGHTS, MIXED_SHARE
} from './readiness-baseline.mjs';

// ICPC India bands: contiguous, start at rank 1, and end inside the field.
var bands = ICPC_INDIA_2026.bands;
assert.equal(bands[0].from, 1);
for (var i = 1; i < bands.length; i++) {
  assert.equal(bands[i].from, bands[i - 1].to + 1, 'bands must be contiguous at ' + bands[i].solved);
  assert.equal(bands[i].solved, bands[i - 1].solved - 1, 'solved counts must step down by one');
}
assert.ok(bands[bands.length - 1].from < ICPC_INDIA_2026.teams);

// Lookups and percentages.
assert.equal(icpcIndiaBand(8).to, 6);
assert.equal(icpcIndiaBand(6).to, 466);
assert.ok(Math.abs(icpcIndiaBand(6).topPercent - 466 / 3883 * 100) < 1e-9);
assert.equal(icpcIndiaBand(1).to, null);
assert.equal(icpcIndiaBand(0).belowTable, true);
assert.equal(icpcIndiaBand(99).solved, 8, 'counts above the problem total are clamped');

// Mock score percent -> equivalent solved out of 8.
assert.equal(equivalentSolved(100), 8);
assert.equal(equivalentSolved(75), 6);
assert.equal(equivalentSolved(74.9), 5);
assert.equal(equivalentSolved(0), 0);
assert.equal(equivalentSolved('x'), null);

// QuantFest stages use the 2025 funnel: 600 of 10,000 = 6%, 75 of 10,000 = 0.75%.
assert.equal(quantfestStage(50, 10000).stage, 'finals-level');
assert.equal(quantfestStage(600, 10000).stage, 'inside-prelim-line');
assert.equal(quantfestStage(601, 10000).stage, 'outside-prelim-line');
assert.equal(quantfestStage(0, 100), null);
assert.equal(quantfestStage(5, 4), null, 'rank cannot exceed cohort');
assert.equal(QUANTFEST_HISTORY[0].toRegionals, 600);
assert.equal(QUANTFEST_HISTORY[0].toFinals, 75);

// Reached week: contiguous weeks with enough practiced/mastered topics.
var subjectsRow = ['logic', 'combinatorics', 'probability', 'graphs', 'dp', 'coding'];
function week(statusList) { return statusList; }
var strong = ['mastered', 'practiced', 'mastered', 'practiced', 'learning', 'not-started'];
var weak = ['mastered', 'learning', 'not-started', 'not-started', 'not-started', 'not-started'];
var result = summarizeProgress([week(strong), week(strong), week(weak), week(strong)], [subjectsRow, subjectsRow, subjectsRow, subjectsRow]);
assert.equal(READY_TOPICS_PER_WEEK, 4);
assert.equal(result.reachedWeek, 2, 'a weak week stops the contiguous run even if later weeks are strong');
assert.equal(result.totalTopics, 24);
assert.equal(result.counts.mastered, 2 * 2 + 1 + 2);
assert.equal(result.bySubject.logic.total, 4);
assert.equal(result.bySubject.logic.ready, 4);
assert.equal(summarizeProgress([week(weak)], [subjectsRow]).reachedWeek, 0);


// ---- Weighted model -------------------------------------------------------
var near = function (a, b, msg) { assert.ok(Math.abs(a - b) < 1e-9, (msg || '') + ' expected ' + b + ' got ' + a); };

// Minutes: both "about" and "up to" forms parse; missing -> null.
assert.equal(parseMinutes('Probability: study X (about 60 min).'), 60);
assert.equal(parseMinutes('Take a timed mixed contest or the week’s assessment (up to 150 min).'), 150);
assert.equal(parseMinutes('No time stated here'), null);

// Subject classification from the task label; unlabelled review/mock tasks are "mixed".
assert.equal(classifyTask('Probability: study'), 'probability');
assert.equal(classifyTask('Logical reasoning: proofs'), 'logic');
assert.equal(classifyTask('Combinatorics: read'), 'combinatorics');
assert.equal(classifyTask('Graph theory: trace'), 'graphs');
assert.equal(classifyTask('Dynamic programming: study'), 'dp');
assert.equal(classifyTask('C++: practise'), 'coding');
assert.equal(classifyTask('C++ / implementation: solve 2'), 'coding');
assert.equal(classifyTask('Mixed practice: timed set'), 'mixed');
assert.equal(classifyTask('Re-solve two previously missed problems (about 60 min).'), 'mixed');
assert.equal(classifyTask('Solve the linked CSES graph tasks and one independent counting problem'), 'mixed');

// Weight normalisation.
var nw = normalizeWeights({ a: 3, b: 1 }, { a: 1, b: 1 });
near(nw.a, 0.75); near(nw.b, 0.25);
var bad = normalizeWeights({ a: -5, b: 'x' }, { a: 1, b: 3 });
near(bad.a, 0.25, 'negative falls back to default'); near(bad.b, 0.75, 'NaN falls back to default');
var zero = normalizeWeights({ a: 0, b: 0 }, { a: 1, b: 1 });
near(zero.a, 0.5, 'all-zero weights fall back to defaults');
near(Object.values(normalizeWeights({}, DEFAULT_SUBJECT_WEIGHTS)).reduce(function (x, y) { return x + y; }, 0), 1);
near(Object.values(normalizeWeights({}, DEFAULT_COMPONENT_WEIGHTS)).reduce(function (x, y) { return x + y; }, 0), 1);

// Coverage is minute-weighted: 60 of 100 probability minutes done -> 0.6, not 1 of 2 tasks.
var cov = coverageByMinutes([
  { text: 'Probability: a (about 60 min).', done: true },
  { text: 'Probability: b (about 40 min).', done: false },
  { text: 'Logical reasoning: c (about 100 min).', done: true },
  { text: 'Graph theory: d (about 30 min).', done: false },
  { text: 'Upsolve missed problems (about 50 min).', done: true },
  { text: 'A task with no minutes', done: false }
]);
near(cov.by.probability.fraction, 0.6);
near(cov.by.logic.fraction, 1);
near(cov.by.graphs.fraction, 0);
near(cov.by.mixed.planned, 50 + 45, 'unparseable task uses the fallback minutes');
assert.equal(cov.assumedMinuteTasks, 1);
near(cov.total.planned, 60 + 40 + 100 + 30 + 50 + 45);
near(cov.total.done, 60 + 100 + 50);

// Mastery credit: (1 + 0.7 + 0.3 + 0) / 4 = 0.5 ; empty subjects score 0.
var mf = masteryFractions([['mastered', 'practiced', 'learning', 'not-started']], [['probability', 'probability', 'probability', 'probability']]);
near(mf.probability, 0.5); near(mf.dp, 0);

// Mock performance: recency-weighted 3:2:1, newest first. (70*3 + 60*2 + 50*1) / 6.
function mk(date, pct) { return { type: 'full-format', date: date, oneScore: pct, oneMax: 100, twoScore: pct, twoMax: 100 }; }
var perf = mockPerformance([mk('2026-11-01', 50), mk('2026-11-20', 70), mk('2026-11-10', 60)]);
near(perf.percent, (70 * 3 + 60 * 2 + 50 * 1) / 6); assert.equal(perf.count, 3); near(perf.latestPercent, 70);
var perf4 = mockPerformance([mk('2026-10-01', 0), mk('2026-11-01', 50), mk('2026-11-10', 60), mk('2026-11-20', 70)]);
assert.equal(perf4.count, 3, 'only the three newest mocks are used');
near(perf4.percent, (70 * 3 + 60 * 2 + 50) / 6);
assert.equal(mockPerformance([]), null);
assert.equal(mockPerformance([{ type: 'topic', date: '2026-11-01', oneScore: 5, oneMax: 10, twoScore: 5, twoMax: 10 }]), null, 'only full-format mocks count');
assert.equal(mockPerformance([{ type: 'full-format', date: '2026-11-01', oneScore: 5, oneMax: 0, twoScore: 5, twoMax: 10 }]), null, 'zero max is ignored');

// Composite index, hand computed. Only probability and logic carry weight (50/50).
// coverage = 0.85 * (0.5*0.6 + 0.5*1) + 0.15 * (50/95)  [mixed fraction = 50/95]
var mixedFrac = 50 / 95;
var expectCoverage = ((1 - MIXED_SHARE) * (0.5 * 0.6 + 0.5 * 1) + MIXED_SHARE * mixedFrac) * 100;
var mastery = { probability: 0.5, logic: 1, combinatorics: 0, graphs: 0, dp: 0, coding: 0 };
var idx = computeIndex({
  coverage: cov, mastery: mastery, mockPercent: perf.percent,
  subjectWeights: { probability: 50, logic: 50, combinatorics: 0, graphs: 0, dp: 0, coding: 0 },
  componentWeights: { coverage: 20, mastery: 30, mock: 50 }
});
near(idx.coverage, expectCoverage, 'coverage');
near(idx.mastery, 75, 'mastery = 0.5*0.5 + 0.5*1');
near(idx.preparation, (0.2 * expectCoverage + 0.3 * 75) / 0.5, 'preparation excludes the mock');
near(idx.readiness, 0.2 * expectCoverage + 0.3 * 75 + 0.5 * perf.percent, 'readiness');
// Biggest gap: probability score = (0.2*0.6 + 0.3*0.5)/0.5 = 0.54 -> 0.5*(1-0.54)*100 = 23 points.
assert.equal(idx.gaps[0].id, 'probability');
near(idx.gaps[0].points, 23, 'probability gap points');
near(idx.gaps.find(function (g) { return g.id === 'logic'; }).points, 0, 'logic is fully covered and mastered');

// No mock -> no readiness number (preparation only), unless the mock weight is zero.
var noMock = computeIndex({ coverage: cov, mastery: mastery, mockPercent: null, subjectWeights: {}, componentWeights: {} });
assert.equal(noMock.readiness, null); assert.equal(noMock.mock, null);
var zeroMock = computeIndex({ coverage: cov, mastery: mastery, mockPercent: null, subjectWeights: {}, componentWeights: { coverage: 1, mastery: 1, mock: 0 } });
near(zeroMock.readiness, zeroMock.preparation, 'zero mock weight collapses readiness to preparation');

// Moving weight changes the answer in the expected direction.
var heavyLogic = computeIndex({ coverage: cov, mastery: mastery, mockPercent: null,
  subjectWeights: { probability: 1, logic: 99, combinatorics: 0, graphs: 0, dp: 0, coding: 0 }, componentWeights: {} });
var heavyProb = computeIndex({ coverage: cov, mastery: mastery, mockPercent: null,
  subjectWeights: { probability: 99, logic: 1, combinatorics: 0, graphs: 0, dp: 0, coding: 0 }, componentWeights: {} });
assert.ok(heavyLogic.preparation > heavyProb.preparation, 'logic is stronger than probability here, so weighting logic raises the score');

console.log('Readiness baseline: all assertions passed.');
