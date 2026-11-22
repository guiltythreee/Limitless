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

// ---------------------------------------------------------------------------
// Weighted readiness model
//
// Three evidence sources, each scored 0..1, then combined with weights:
//   coverage : planned study MINUTES ticked off (a 90-min task counts more than a 10-min one)
//   mastery  : topic status credit (mastered / practiced / learning)
//   mock     : recency-weighted score of recent full-format mocks
// Subject weights decide how much each subject matters inside coverage and mastery.
//
// None of the default weights come from a published source (neither QuantFest nor ICPC
// India publishes a topic split). They are a starting assumption and are user-editable.
// ---------------------------------------------------------------------------

export const SUBJECT_IDS = ['probability', 'logic', 'combinatorics', 'graphs', 'dp', 'coding'];
export const DEFAULT_SUBJECT_WEIGHTS = { probability: 25, logic: 15, combinatorics: 20, graphs: 15, dp: 15, coding: 10 };
export const DEFAULT_COMPONENT_WEIGHTS = { coverage: 20, mastery: 30, mock: 50 };
export const MIXED_SHARE = 0.15;          // share of coverage given to review / upsolving / mock tasks
export const FALLBACK_MINUTES = 45;       // used only if a task text has no "(about N min)"
export const MASTERY_CREDIT = { mastered: 1, practiced: 0.7, learning: 0.3, 'not-started': 0 };
export const MOCK_RECENCY = [3, 2, 1];    // newest full mock counts 3x the third newest

export function parseMinutes(text) {
  var m = /\((?:about|up to) (\d+) min\)/i.exec(String(text || ''));
  return m ? Number(m[1]) : null;
}

var PREFIX_TO_SUBJECT = [
  [/^probability:/i, 'probability'],
  [/^logical reasoning:/i, 'logic'],
  [/^combinatorics:/i, 'combinatorics'],
  [/^graph theory:/i, 'graphs'],
  [/^dynamic programming:/i, 'dp'],
  [/^c\+\+/i, 'coding']
];
// Tasks with no subject label (review, upsolving, mocks, mixed practice) are "mixed".
export function classifyTask(text) {
  var s = String(text || '');
  for (var i = 0; i < PREFIX_TO_SUBJECT.length; i++) if (PREFIX_TO_SUBJECT[i][0].test(s)) return PREFIX_TO_SUBJECT[i][1];
  return 'mixed';
}

// Turn any non-negative numbers into shares that sum to 1. Bad or missing values fall back
// to the default; if everything ends up zero, the defaults are used.
export function normalizeWeights(raw, defaults) {
  var keys = Object.keys(defaults), out = {}, sum = 0;
  keys.forEach(function (k) {
    var v = raw && raw[k] !== undefined && raw[k] !== '' ? Number(raw[k]) : defaults[k];
    if (!Number.isFinite(v) || v < 0) v = defaults[k];
    out[k] = v; sum += v;
  });
  if (sum <= 0) { sum = 0; keys.forEach(function (k) { out[k] = defaults[k]; sum += defaults[k]; }); }
  keys.forEach(function (k) { out[k] = out[k] / sum; });
  return out;
}

// tasks: [{ text, done }]. Returns minutes planned/done per subject, for the mixed bucket and in total.
export function coverageByMinutes(tasks) {
  var by = {}, assumed = 0;
  SUBJECT_IDS.concat('mixed').forEach(function (id) { by[id] = { planned: 0, done: 0, fraction: 0 }; });
  var total = { planned: 0, done: 0 };
  tasks.forEach(function (task) {
    var minutes = parseMinutes(task.text);
    if (minutes === null) { minutes = FALLBACK_MINUTES; assumed += 1; }
    var bucket = by[classifyTask(task.text)];
    bucket.planned += minutes; total.planned += minutes;
    if (task.done) { bucket.done += minutes; total.done += minutes; }
  });
  Object.keys(by).forEach(function (id) { by[id].fraction = by[id].planned > 0 ? by[id].done / by[id].planned : 0; });
  return { by: by, total: total, assumedMinuteTasks: assumed };
}

// Average mastery credit per subject (0..1). Subjects with no topics score 0.
export function masteryFractions(statuses, subjects) {
  var sum = {}, n = {};
  statuses.forEach(function (week, wi) {
    week.forEach(function (status, ti) {
      var id = subjects[wi][ti];
      var credit = MASTERY_CREDIT[status] === undefined ? 0 : MASTERY_CREDIT[status];
      sum[id] = (sum[id] || 0) + credit; n[id] = (n[id] || 0) + 1;
    });
  });
  var out = {};
  SUBJECT_IDS.forEach(function (id) { out[id] = n[id] ? sum[id] / n[id] : 0; });
  return out;
}

// Recency-weighted mean score (percent) of up to the last three valid full-format mocks.
export function mockPerformance(mocks) {
  var valid = (mocks || []).filter(function (mock) {
    return mock && mock.type === 'full-format' && Number(mock.oneMax) > 0 && Number(mock.twoMax) > 0 &&
      Number.isFinite(Number(mock.oneScore)) && Number.isFinite(Number(mock.twoScore));
  }).map(function (mock, order) {
    var pct = (Number(mock.oneScore) + Number(mock.twoScore)) / (Number(mock.oneMax) + Number(mock.twoMax)) * 100;
    return { date: String(mock.date || ''), order: order, percent: Math.max(0, Math.min(100, pct)) };
  }).sort(function (a, b) { return a.date === b.date ? b.order - a.order : b.date.localeCompare(a.date); });
  if (!valid.length) return null;
  var used = valid.slice(0, MOCK_RECENCY.length), num = 0, den = 0;
  used.forEach(function (mock, i) { num += mock.percent * MOCK_RECENCY[i]; den += MOCK_RECENCY[i]; });
  return { percent: num / den, count: used.length, latestPercent: used[0].percent };
}

// coverage: output of coverageByMinutes. mastery: output of masteryFractions.
// mockPercent: number 0..100 or null. Raw weights may be unnormalised.
export function computeIndex(input) {
  var sw = normalizeWeights(input.subjectWeights, DEFAULT_SUBJECT_WEIGHTS);
  var cw = normalizeWeights(input.componentWeights, DEFAULT_COMPONENT_WEIGHTS);
  var coverage = 0, mastery = 0;
  SUBJECT_IDS.forEach(function (id) {
    coverage += sw[id] * input.coverage.by[id].fraction;
    mastery += sw[id] * (input.mastery[id] || 0);
  });
  coverage = (1 - MIXED_SHARE) * coverage + MIXED_SHARE * input.coverage.by.mixed.fraction;

  var prepDen = cw.coverage + cw.mastery;
  var preparation = prepDen > 0 ? (cw.coverage * coverage + cw.mastery * mastery) / prepDen : 0;
  var hasMock = input.mockPercent !== null && input.mockPercent !== undefined;
  var mock = hasMock ? input.mockPercent / 100 : null;
  var readiness = null;
  if (hasMock) readiness = cw.coverage * coverage + cw.mastery * mastery + cw.mock * mock;
  else if (cw.mock === 0) readiness = preparation;

  // Where the next hour pays off most: weight x (1 - subject score).
  var gaps = SUBJECT_IDS.map(function (id) {
    var score = prepDen > 0 ? (cw.coverage * input.coverage.by[id].fraction + cw.mastery * (input.mastery[id] || 0)) / prepDen : 0;
    return { id: id, weight: sw[id], score: score, points: sw[id] * (1 - score) * 100 };
  }).sort(function (a, b) { return b.points - a.points; });

  return {
    subjectWeights: sw, componentWeights: cw,
    coverage: coverage * 100, mastery: mastery * 100, mock: hasMock ? mock * 100 : null,
    preparation: preparation * 100, readiness: readiness === null ? null : readiness * 100,
    gaps: gaps
  };
}
