import assert from 'node:assert/strict';
import {
  ICPC_INDIA_2026, QUANTFEST_HISTORY, icpcIndiaBand, equivalentSolved, quantfestStage,
  summarizeProgress, READY_TOPICS_PER_WEEK
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

console.log('Readiness baseline: all assertions passed.');
