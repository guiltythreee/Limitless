// Readiness baseline: turns plan progress (tasks, topic mastery, mocks) into a
// position measured against previous-year QuantFest and ICPC India numbers.
//
// Every benchmark below was read from a public source (listed in `sources`).
// Boundaries were read from published pages, so spot-check them against the
// source before relying on a single rank. Nothing here is a guaranteed selection result.

export const READY_TOPICS_PER_WEEK = 4; // of 6 topics must be "practiced" or "mastered"

// ICPC India 2026 preliminary: final standings, 3,883 teams, 8 problems (100 points each).
export const ICPC_INDIA_2026 = {
  label: 'ICPC India 2026 preliminary standings',
  url: 'https://indiaicpc.in/selection_pool_2026.html',
  teams: 3883,
  problems: 8,
  // Last rank at each solved-count; the 1-solved band runs to the end of the table.
  bands: [
    { solved: 8, from: 1, to: 6 },
    { solved: 7, from: 7, to: 56 },
    { solved: 6, from: 57, to: 466 },
    { solved: 5, from: 467, to: 1012 },
    { solved: 4, from: 1013, to: 1852 },
    { solved: 3, from: 1853, to: 2552 },
    { solved: 2, from: 2553, to: 3080 },
    { solved: 1, from: 3081, to: null }
  ],
  note: 'Regional selection is not purely rank-based: per-college limits have been reported but I could not verify the official rule. Confirm on indiaicpc.in.'
};

// QuantFest funnel. "10,000+" is a lower bound, so true percentages are slightly smaller.
export const QUANTFEST_HISTORY = [
  {
    edition: 2025,
    participants: 10000,
    toRegionals: 600,
    toFinals: 75,
    summary: '10,000+ took part; top 600 of the prelim ranklist went to regionals; top 75 of regionals reached the finals.',
    sources: [
      { label: 'Tower Research: QuantFest 2025', url: 'https://tower-research.com/building-the-future-of-quantitative-talent-tower-at-iicpc-quantfest-2025/' },
      { label: 'QuantFest 2025 invitation (Codeforces)', url: 'https://codeforces.com/blog/entry/144623' }
    ]
  },
  {
    edition: 2026,
    participants: 10000,
    toRegionals: 600,
    toFinals: 80,
    summary: '10,000+ participants; top 600 (plus 20 reserved for women) advanced from prelims; top 80 of regionals reached the finals.',
    sources: [
      { label: 'QuantFest 2026 challenge page', url: 'https://quantfest.iicpc.com/challenge' }
    ]
  }
];

export function icpcIndiaBand(solved) {
  var n = Math.max(0, Math.min(ICPC_INDIA_2026.problems, Math.floor(Number(solved) || 0)));
  var band = ICPC_INDIA_2026.bands.find(function (b) { return b.solved === n; }) || null;
  if (!band) return { solved: n, from: ICPC_INDIA_2026.bands[ICPC_INDIA_2026.bands.length - 1].to || ICPC_INDIA_2026.teams, to: null, topPercent: null, belowTable: true };
  return {
    solved: n,
    from: band.from,
    to: band.to,
    // Percent of the field at or above the WORST rank in the band; null when open-ended.
    topPercent: band.to ? band.to / ICPC_INDIA_2026.teams * 100 : null,
    bestTopPercent: band.from / ICPC_INDIA_2026.teams * 100,
    belowTable: false
  };
}

// Score percentage of a full mock -> equivalent problems out of 8 (assumes equal weights).
export function equivalentSolved(scorePercent) {
  var pct = Number(scorePercent);
  if (!Number.isFinite(pct) || pct < 0) return null;
  return Math.min(ICPC_INDIA_2026.problems, Math.floor(pct / 100 * ICPC_INDIA_2026.problems + 1e-9));
}

// Mock rank fraction (rank / cohort) -> stage against the 2025 funnel.
export function quantfestStage(rank, cohort) {
  var r = Number(rank), c = Number(cohort);
  if (!Number.isFinite(r) || !Number.isFinite(c) || r < 1 || c < r) return null;
  var fraction = r / c;
  var edition = QUANTFEST_HISTORY[0];
  var finalsLine = edition.toFinals / edition.participants;      // 0.75%
  var prelimLine = edition.toRegionals / edition.participants;   // 6%
  var stage = fraction <= finalsLine ? 'finals-level'
    : fraction <= prelimLine ? 'inside-prelim-line'
    : 'outside-prelim-line';
  return { fraction: fraction, percent: fraction * 100, stage: stage, prelimLinePercent: prelimLine * 100, finalsLinePercent: finalsLine * 100 };
}

// statuses: array (per week) of arrays of mastery strings. subjects: same shape, subject ids.
export function summarizeProgress(statuses, subjects) {
  var counts = { mastered: 0, practiced: 0, learning: 0, 'not-started': 0 };
  var bySubject = {};
  var reachedWeek = 0, stillContiguous = true;
  statuses.forEach(function (week, wi) {
    var ready = 0;
    week.forEach(function (status, ti) {
      var s = counts[status] === undefined ? 'not-started' : status;
      counts[s] += 1;
      var id = subjects[wi][ti];
      bySubject[id] = bySubject[id] || { total: 0, ready: 0, mastered: 0 };
      bySubject[id].total += 1;
      if (s === 'mastered' || s === 'practiced') { ready += 1; bySubject[id].ready += 1; }
      if (s === 'mastered') bySubject[id].mastered += 1;
    });
    if (stillContiguous && ready >= READY_TOPICS_PER_WEEK) reachedWeek = wi + 1;
    else stillContiguous = false;
  });
  return { counts: counts, bySubject: bySubject, reachedWeek: reachedWeek, totalTopics: statuses.reduce(function (n, w) { return n + w.length; }, 0) };
}
