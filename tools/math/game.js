/* ==================================================================
   Limitless Math Trainer — game logic and screens
   Needs engine.js (window.MathEngine). Everything is saved in this
   browser only (localStorage). Because the website has no accounts,
   the "weak-spot analysis" file lets you carry your training between
   sessions: download it after training, upload it next time.
   ================================================================== */
(function () {
  'use strict';

  var E = window.MathEngine;
  var $ = function (id) { return document.getElementById(id); };
  var MINUS = '−';

  /* ---------- the rules ---------- */
  var MODES = {
    test80: { name: '80 in 8', desc: '80 questions in 8 minutes. The test-style run.', count: 80, seconds: 480, usesTier: true, minSample: 60 },
    blitz: { name: 'Tier Blitz', desc: '2 minutes. Answer as many as you can.', seconds: 120, usesTier: true, minSample: 25 },
    limitless: { name: 'Limitless', desc: 'Endless. 3 lives. The tier climbs as you score.', usesTier: false, forcePenalty: 'sudden' },
    drill: { name: 'Weak-Spot Drill', desc: '40 questions aimed at your weak skills, or any skill you pick.', count: 40, usesTier: true }
  };
  var TRICK_MODE = { name: 'Trick Chamber', usesTier: false };
  var TRICK_PHASES = {
    baseline: { name: 'Baseline', count: 6 },
    practice: { name: 'Practice', count: 10 },
    post: { name: 'Post-test', count: 6 }
  };
  var PENALTIES = {
    practice: { name: 'Practice', desc: 'Wrong answers cost nothing. Combo resets.', wrong: function () { return 0; } },
    fair: { name: 'Fair', desc: 'Wrong: −5 points. Guessing is a bad bet.', wrong: function () { return 5; } },
    strict: { name: 'Strict', desc: 'Wrong: −10 points, as much as a correct answer earns.', wrong: function () { return 10; } },
    escalating: { name: 'Escalating', desc: 'Wrong in a row: −5, −10, then −20 each.', wrong: function (row) { return [5, 10, 20][Math.min(row, 3) - 1]; } },
    sudden: { name: 'Sudden Death', desc: 'Wrong: −25 points and lose 1 of 3 lives.', wrong: function () { return 25; }, lives: 3 }
  };
  var PENALTY_NOTES = {
    practice: 'Best for learning a new tier: no fear, just reps.',
    fair: 'Recommended for daily training.',
    strict: 'Use for the 80 in 8 test run. The real test’s marking rules are not confirmed, so this is a practice guess.',
    escalating: 'Stops panic streaks: the third wrong answer in a row hurts.',
    sudden: 'Best for Abyss and Limitless.'
  };
  var TIMERS = {
    off: { name: 'Pace only', desc: 'No limit per question. Your pace is measured against each question’s target time.' },
    strict: { name: 'Strict timer', desc: 'Every question has a hard limit (1.6 × its target time). Too slow counts as a wrong answer.' }
  };
  var DRILL_KINDS = {
    speed: { name: 'Speed drill', text: 'hard time limit of 1.25 × the target on every question', next: 'Speed drill' },
    accuracy: { name: 'Accuracy drill', text: 'Strict penalty, and every miss comes back three questions later', next: 'Accuracy drill' },
    standard: { name: 'Mixed drill', text: 'a balanced mix of your weak skills and general questions', next: 'Mixed drill' }
  };
  var RANKS = [
    [0, 'Novice'], [450, 'Student'], [1500, 'Calculator'], [3500, 'Savant'],
    [7500, 'Sage'], [14000, 'Oracle'], [24000, 'Archmage'], [38000, 'Limitless']
  ];

  /* ---------- the XP economy ----------
     XP for a run = points/10 x TIER x PENALTY x FADE, plus bonuses.
     TIER:    harder tiers pay more per point.
     PENALTY: riskier penalty rules pay more (Practice pays half).
     FADE:    each tier has a "comfort rank". Up to that rank it pays full XP.
              Every rank above it, the tier pays less (FADE list), never below FADE_FLOOR.
              So easy tiers stop being worth it as you rank up, and you have to climb. */
  var TIER_XP = [1.0, 1.25, 1.6, 2.1, 2.8, 3.8];          /* acolyte … abyss */
  var TIER_COMFORT = [0, 1, 2, 3, 5, 7];                   /* rank index where each tier stops paying full XP */
  var FADE = [1, 0.6, 0.35, 0.18, 0.08];                   /* 0, 1, 2, 3, 4 ranks above comfort */
  var FADE_FLOOR = 0.05;                                   /* 5 ranks or more above: a trickle, never zero */
  var PENALTY_XP = { practice: 0.5, fair: 1, strict: 1.25, escalating: 1.25, sudden: 1.5 };
  var FIRST_CLEAR_XP = [60, 90, 140, 220, 350, 550];       /* one-time bonus the first time you clear each tier */
  var REPEAT_CLEAR_SHARE = 0.15;                           /* later clears pay this share of that, times FADE */

  var KEY_RUNS = 'limitless.math.v1.runs';
  var KEY_ATT = 'limitless.math.v1.attempts';
  var KEY_PREFS = 'limitless.math.v1.prefs';
  var KEY_META = 'limitless.math.v1.meta';
  var KEY_PROFILE = 'limitless.math.v1.profile';
  var MAX_ATTEMPTS = 5000, MAX_RUNS = 500, SKILL_WINDOW = 60;

  /* ---------- saving (never lets a storage problem break the page) ---------- */
  function load(key, fallback) {
    try { var s = localStorage.getItem(key); return s ? JSON.parse(s) : fallback; } catch (e) { return fallback; }
  }
  function save(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); return true; } catch (e) { return false; }
  }

  /* ---------- tiny DOM helper ---------- */
  function h(tag, cls, text) {
    var el = document.createElement(tag);
    if (cls) el.className = cls;
    if (text !== undefined && text !== null) el.textContent = text;
    return el;
  }
  function clear(el) { while (el.firstChild) el.removeChild(el.firstChild); }
  var SCREENS = ['screen-menu', 'screen-play', 'screen-results', 'screen-tricks'];
  function show(id) {
    SCREENS.forEach(function (s) { $(s).hidden = (s !== id); });
    document.body.setAttribute('data-screen', id.replace('screen-', ''));
    setMood();
    updateNav();
    window.scrollTo(0, 0);
  }
  /* "back to current topic" shows only while a Trick Chamber topic is open and you are somewhere else */
  function updateNav() {
    var btn = $('nav-topic'); if (!btn) return;
    var tr = openTrickId && E.TRICK_BY_ID[openTrickId];
    btn.hidden = !tr || document.body.getAttribute('data-screen') === 'tricks';
    if (tr) { $('nav-topic-name').textContent = tr.name; btn.title = 'Back to ' + tr.name; }
  }
  /* tells the theme layer which tier mood to paint (see math-theme.css) */
  function setMood() {
    var m = (prefs && prefs.mode === 'limitless') ? 'limitless' : (prefs && prefs.tier) || 'adept';
    document.documentElement.setAttribute('data-mood', m);
  }

  /* ---------- maths helpers ---------- */
  function median(arr) {
    if (!arr.length) return 0;
    var a = arr.slice().sort(function (x, y) { return x - y; }), m = Math.floor(a.length / 2);
    return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2;
  }
  function mean(arr) { return arr.length ? arr.reduce(function (s, x) { return s + x; }, 0) / arr.length : 0; }
  function fmtClock(sec) {
    sec = Math.max(0, Math.ceil(sec));
    return Math.floor(sec / 60) + ':' + ('0' + (sec % 60)).slice(-2);
  }
  function fmtSec(x) { return (Math.round(x * 10) / 10).toFixed(1) + ' s'; }
  function pct(x) { return Math.round(x * 100) + '%'; }
  function num(v, lo, hi, dflt) { v = +v; return isFinite(v) ? Math.min(hi, Math.max(lo, v)) : dflt; }
  function pad(n) { return n < 10 ? '0' + n : String(n); }
  function dayKey(d) { d = d || new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }

  /* ==================================================================
     PREFERENCES, XP, RANKS, STREAK, TRICK RECORDS  (the "meta" record)
     ================================================================== */
  var prefs = Object.assign({ mode: 'test80', tier: 'adept', penalty: 'fair', timer: 'off', drillFocus: 'auto' }, load(KEY_PREFS, {}));
  if (!MODES[prefs.mode]) prefs.mode = 'test80';
  if (!E.TIER_BY_ID[prefs.tier]) prefs.tier = 'adept';
  if (!PENALTIES[prefs.penalty]) prefs.penalty = 'fair';
  if (!TIMERS[prefs.timer]) prefs.timer = 'off';
  if (prefs.drillFocus !== 'auto' && E.SKILLS.indexOf(prefs.drillFocus) < 0) prefs.drillFocus = 'auto';

  var meta = (function () {
    var m = load(KEY_META, {}) || {};
    return {
      xp: num(m.xp, 0, 1e7, 0),
      streak: { day: (m.streak && typeof m.streak.day === 'string') ? m.streak.day : '', count: num(m.streak && m.streak.count, 0, 100000, 0), best: num(m.streak && m.streak.best, 0, 100000, 0) },
      tricks: (m.tricks && typeof m.tricks === 'object') ? m.tricks : {},
      tierClears: (m.tierClears && typeof m.tierClears === 'object') ? m.tierClears : {},
      tierBonus: (m.tierBonus && typeof m.tierBonus === 'object') ? m.tierBonus : {}
    };
  })();
  function saveMeta() { save(KEY_META, meta); }

  function rankFor(xp) {
    var i = 0;
    while (i + 1 < RANKS.length && xp >= RANKS[i + 1][0]) i++;
    var floor = RANKS[i][0], next = RANKS[i + 1] ? RANKS[i + 1][0] : null;
    return { idx: i, name: RANKS[i][1], floor: floor, next: next, nextName: RANKS[i + 1] ? RANKS[i + 1][1] : null,
      progress: next ? (xp - floor) / (next - floor) : 1 };
  }
  function streakAlive() {
    var s = meta.streak, y = new Date();
    y.setDate(y.getDate() - 1);
    return (s.day === dayKey() || s.day === dayKey(y)) ? s.count : 0;
  }
  function touchStreak() {
    var s = meta.streak, today = dayKey();
    if (s.day === today) return;
    var y = new Date(); y.setDate(y.getDate() - 1);
    s.count = (s.day === dayKey(y)) ? s.count + 1 : 1;
    s.day = today;
    s.best = Math.max(s.best || 0, s.count);
  }
  function awardXp(n) {
    n = Math.max(0, Math.round(n));
    var before = rankFor(meta.xp).idx;
    meta.xp = Math.min(1e7, meta.xp + n);
    var after = rankFor(meta.xp);
    saveMeta();
    return { gained: n, rankUp: after.idx > before ? after.name : null };
  }

  /* how much of a tier's XP you keep at your current rank (1 = full) */
  function fadeFor(tierIdx, rankIdx) {
    var gap = Math.max(0, rankIdx - TIER_COMFORT[tierIdx]);
    return gap < FADE.length ? FADE[gap] : FADE_FLOOR;
  }
  /* pure: works out the XP for a finished run and shows every step (nothing is saved here) */
  function xpBreakdown(r, s, rankIdx) {
    var tierIdx = r.tier ? E.TIER_BY_ID[r.tier].index : r.topTierIndex;
    var tierId = E.TIERS[tierIdx].id;
    var base = Math.max(0, r.points) / 10;
    var tierMult = TIER_XP[tierIdx], penMult = PENALTY_XP[r.penalty] || 1, fade = fadeFor(tierIdx, rankIdx);
    var core = base * tierMult * penMult * fade;
    var clearBonus = 0, firstClear = false;
    if (s.cleared) {
      if (!meta.tierBonus[tierId]) { clearBonus = FIRST_CLEAR_XP[tierIdx]; firstClear = true; }
      else clearBonus = FIRST_CLEAR_XP[tierIdx] * REPEAT_CLEAR_SHARE * fade;
    }
    var drillBonus = (r.mode === 'drill' && s.attempted >= 10) ? 10 * fade : 0;
    return { tierIdx: tierIdx, tierId: tierId, base: base, tierMult: tierMult, penMult: penMult, fade: fade,
      core: core, clearBonus: clearBonus, firstClear: firstClear, drillBonus: drillBonus,
      total: Math.max(0, Math.round(core + clearBonus + drillBonus)) };
  }

  function renderProfile() {
    var box = $('profile-strip'); clear(box);
    var rk = rankFor(meta.xp);
    var left = h('div');
    left.appendChild(h('div', 'rank-name', rk.name));
    left.appendChild(h('div', 'rank-sub', meta.xp + ' XP' + (rk.next ? ' · ' + (rk.next - meta.xp) + ' to ' + rk.nextName : ' · highest rank')));
    box.appendChild(left);
    var mid = h('div', 'xp-wrap');
    var bar = h('div', 'bar'); bar.setAttribute('role', 'progressbar'); bar.setAttribute('aria-label', 'Progress to next rank');
    bar.setAttribute('aria-valuemin', '0'); bar.setAttribute('aria-valuemax', '100'); bar.setAttribute('aria-valuenow', String(Math.round(rk.progress * 100)));
    var fill = h('div'); fill.style.width = Math.round(rk.progress * 100) + '%'; bar.appendChild(fill);
    mid.appendChild(bar);
    box.appendChild(mid);
    var st = h('div', 'streak');
    var n = streakAlive();
    var b = h('b', '', String(n)); st.appendChild(b);
    st.appendChild(document.createTextNode(' day streak'));
    st.appendChild(h('div', 'rank-sub', 'best ' + Math.max(meta.streak.best, n) + ' days'));
    box.appendChild(st);
  }

  /* ==================================================================
     SKILL ANALYSIS (the coach)
     ================================================================== */
  function diagnose(acc, ratio, n) {
    if (n < 3) return { text: 'Too few to judge', cls: '' };
    if (acc >= 0.95 && ratio <= 1) return { text: 'Strong', cls: 'strong' };
    if (acc >= 0.95) return { text: 'Accurate but slow', cls: 'warn' };
    if (acc < 0.8) return { text: 'Needs practice', cls: 'bad' };
    if (ratio <= 1) return { text: 'Fast but sloppy', cls: 'bad' };
    return { text: 'Developing', cls: 'warn' };
  }
  function kindFor(diagText) {
    if (diagText === 'Accurate but slow') return 'speed';
    if (diagText === 'Fast but sloppy' || diagText === 'Needs practice') return 'accuracy';
    return 'standard';
  }

  function localSkillStats() {
    var atts = load(KEY_ATT, []), by = {}, out = {};
    for (var i = atts.length - 1; i >= 0; i--) {
      var a = atts[i];
      if (!a || typeof a.s !== 'string' || a.r === 'skip' || !(a.target > 0)) continue;
      var list = by[a.s] || (by[a.s] = []);
      if (list.length < SKILL_WINDOW) list.push(a);
    }
    Object.keys(by).forEach(function (skill) {
      var list = by[skill];
      var right = list.filter(function (a) { return a.r === 'correct'; }).length;
      out[skill] = { n: list.length, acc: right / list.length,
        ratio: median(list.map(function (a) { return a.time / a.target; })),
        medTime: median(list.map(function (a) { return a.time; })) };
    });
    return out;
  }
  /* local attempts blended with an uploaded analysis (the uploaded one counts a little less) */
  function skillStats() {
    var loc = localSkillStats(), prof = load(KEY_PROFILE, null), pri = (prof && prof.skills) || {}, out = {};
    var keys = {};
    Object.keys(loc).forEach(function (k) { keys[k] = 1; });
    Object.keys(pri).forEach(function (k) { keys[k] = 1; });
    Object.keys(keys).forEach(function (k) {
      var l = loc[k], p = pri[k];
      if (l && !p) { out[k] = { n: l.n, acc: l.acc, ratio: l.ratio, medTime: l.medTime, src: 'local' }; return; }
      if (p && !l) { out[k] = { n: p.n, acc: p.acc, ratio: p.ratio, medTime: p.medTime, src: 'uploaded' }; return; }
      var wl = l.n, wp = Math.min(p.n, SKILL_WINDOW) * 0.7, w = wl + wp;
      out[k] = { n: l.n + Math.round(wp), acc: (l.acc * wl + p.acc * wp) / w, ratio: (l.ratio * wl + p.ratio * wp) / w,
        medTime: (l.medTime * wl + p.medTime * wp) / w, src: 'mixed' };
    });
    return out;
  }
  function analyse() {
    var st = skillStats(), rows = [];
    Object.keys(st).forEach(function (skill) {
      var s = st[skill], dg = diagnose(s.acc, s.ratio, s.n);
      rows.push({ skill: skill, n: s.n, acc: s.acc, ratio: s.ratio, medTime: s.medTime, diag: dg, src: s.src,
        kind: kindFor(dg.text),
        weakness: (1 - s.acc) * 3 + Math.max(0, Math.min(3, s.ratio) - 1) * 1.2 });
    });
    rows.sort(function (a, b) { return b.weakness - a.weakness; });
    return rows;
  }
  function prescription(rows) {
    var weak = rows.filter(function (r) { return r.n >= 5 && r.diag.text !== 'Strong' && r.diag.text !== 'Too few to judge'; }).slice(0, 3);
    if (!weak.length) return null;
    var weights = {};
    weak.forEach(function (r) { weights[r.skill] = Math.max(0.5, r.weakness); });
    return { skills: weak.map(function (r) { return r.skill; }), weights: weights, kind: weak[0].kind, rows: weak };
  }
  function snapshotBefore(skills) {
    var st = skillStats(), out = {};
    skills.forEach(function (k) { if (st[k]) out[k] = { acc: st[k].acc, ratio: st[k].ratio, n: st[k].n }; });
    return out;
  }
  function buildDrillCfg(forceAuto) {
    var rows = analyse(), focus = forceAuto ? 'auto' : prefs.drillFocus;
    var skills = [], weights = {}, kind = 'standard';
    if (focus !== 'auto' && E.SKILLS.indexOf(focus) >= 0) {
      skills = [focus];
      var row = rows.filter(function (r) { return r.skill === focus; })[0];
      if (row && row.n >= 5) kind = row.kind;
    } else {
      var rx = prescription(rows);
      if (rx) { skills = rx.skills; weights = rx.weights; kind = rx.kind; }
    }
    return { skills: skills, weights: weights, kind: kind, before: snapshotBefore(skills) };
  }

  function sentenceList(arr) {
    if (arr.length <= 1) return arr.join('');
    return arr.slice(0, -1).join(', ') + ' and ' + arr[arr.length - 1];
  }

  function renderCoach() {
    var box = $('coach'); clear(box);
    var rows = analyse().filter(function (r) { return r.n >= 3; });
    var rx = prescription(rows);
    var prof = load(KEY_PROFILE, null);
    $('profile-note').textContent = prof && prof.exportedAt
      ? 'Includes an uploaded analysis from ' + new Date(prof.exportedAt).toLocaleDateString() + '.' : '';
    if (!rows.length) {
      box.appendChild(h('p', 'coach-line', 'No data yet. Play a few runs and your weak skills will appear here, or upload a weak-spot analysis from an earlier session.'));
      $('btn-coach-drill').textContent = 'Start a general drill';
      return;
    }
    var line = h('p', 'coach-line');
    if (rx) {
      line.appendChild(document.createTextNode('Prescription: '));
      line.appendChild(h('b', '', DRILL_KINDS[rx.kind].name));
      line.appendChild(document.createTextNode(' on ' + sentenceList(rx.skills) + ' (' + DRILL_KINDS[rx.kind].text + ').'));
      $('btn-coach-drill').textContent = 'Start ' + DRILL_KINDS[rx.kind].name.toLowerCase();
    } else {
      line.appendChild(document.createTextNode('No weak spots found yet. Keep playing, or pick any skill in Weak-Spot Drill mode.'));
      $('btn-coach-drill').textContent = 'Start a general drill';
    }
    box.appendChild(line);

    var table = h('table', 'skill-table');
    var head = h('tr');
    ['Skill', 'Questions', 'Accuracy', 'Pace vs target', 'Diagnosis', 'Next step'].forEach(function (t) { head.appendChild(h('th', '', t)); });
    table.appendChild(head);
    rows.slice(0, 8).forEach(function (r) {
      var tr = h('tr');
      tr.appendChild(h('td', '', r.skill));
      tr.appendChild(h('td', '', String(r.n)));
      tr.appendChild(h('td', '', pct(r.acc)));
      tr.appendChild(h('td', '', r.ratio.toFixed(1) + '×'));
      var td = h('td'); td.appendChild(h('span', 'diag ' + r.diag.cls, r.diag.text)); tr.appendChild(td);
      tr.appendChild(h('td', '', r.diag.text === 'Strong' ? '–' : DRILL_KINDS[r.kind].next));
      table.appendChild(tr);
    });
    var wrap = h('div', 'table-wrap'); wrap.appendChild(table); box.appendChild(wrap);
    if (rows.length > 8) box.appendChild(h('p', 'note', 'Showing the 8 weakest of ' + rows.length + ' skills.'));
  }

  /* ---------- weak-spot analysis file: download / upload ---------- */
  function tierStatus(tierId) {
    var runs = load(KEY_RUNS, []).filter(function (r) { return r.tier === tierId && r.qualifying; }).slice(-3);
    var cleared = runs.filter(function (r) { return r.cleared; }).length;
    return { runs: runs.length, cleared: cleared, isCleared: cleared >= 2 || meta.tierClears[tierId] === true };
  }
  function round(x, d) { var p = Math.pow(10, d); return Math.round(x * p) / p; }

  function buildProfile() {
    var rows = analyse(), skills = {}, tiers = {};
    rows.forEach(function (r) {
      skills[r.skill] = { n: r.n, acc: round(r.acc, 4), ratio: round(r.ratio, 3), medianTime: round(r.medTime, 2), diagnosis: r.diag.text };
    });
    var rx = prescription(rows);
    E.TIERS.forEach(function (t) {
      var st = tierStatus(t.id);
      tiers[t.id] = { cleared: st.isCleared, runs: st.runs, clears: st.cleared };
    });
    var recent = load(KEY_RUNS, []).slice(-10).map(function (r) {
      return { ts: r.ts, mode: r.mode, tier: r.tier, accuracy: round(r.accuracy || 0, 3), medianTime: round(r.medianTime || 0, 2), points: r.points, cleared: !!r.cleared };
    });
    return {
      app: 'limitless-math-profile', version: 1, exportedAt: new Date().toISOString(),
      skills: skills, weak: rx ? rx.skills : [],
      prescription: rx ? { kind: rx.kind, skills: rx.skills } : null,
      tiers: tiers, meta: { xp: meta.xp, streak: meta.streak, tricks: meta.tricks, tierBonus: meta.tierBonus }, recent: recent
    };
  }
  function downloadJson(obj, filename) {
    var blob = new Blob([JSON.stringify(obj, null, 1)], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  }
  function exportProfile() {
    var p = buildProfile();
    downloadJson(p, 'limitless-weak-spots-' + new Date().toISOString().slice(0, 10) + '.json');
    $('profile-note').textContent = 'Downloaded your weak-spot analysis (' + Object.keys(p.skills).length + ' skills). Keep the file safe and upload it next time.';
  }

  function cleanTrickRecord(t) {
    function stat(s) {
      if (!s || typeof s !== 'object') return null;
      return { n: num(s.n, 0, 100, 0), acc: num(s.acc, 0, 1, 0), med: num(s.med, 0, 300, 0), ratio: num(s.ratio, 0, 20, 0), ts: num(s.ts, 0, 4e12, 0) };
    }
    return { base: stat(t.base), post: stat(t.post), practice: num(t.practice, 0, 10000, 0), skipBase: t.skipBase === true, lastTs: num(t.lastTs, 0, 4e12, 0) };
  }
  /* bring in xp / streak / tricks / tier clears from another file, never lowering what is already here */
  function mergeMeta(m, tiers) {
    if (m && typeof m === 'object') {
      meta.xp = Math.max(meta.xp, num(m.xp, 0, 1e7, 0));
      if (m.streak && typeof m.streak === 'object') {
        meta.streak.best = Math.max(meta.streak.best, num(m.streak.best, 0, 100000, 0), num(m.streak.count, 0, 100000, 0));
        if (typeof m.streak.day === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(m.streak.day) && m.streak.day > meta.streak.day) {
          meta.streak.day = m.streak.day; meta.streak.count = num(m.streak.count, 0, 100000, 0);
        }
      }
      if (m.tricks && typeof m.tricks === 'object') {
        E.TRICKS.forEach(function (tr) {
          var inc = m.tricks[tr.id];
          if (!inc || typeof inc !== 'object') return;
          var clean = cleanTrickRecord(inc), have = meta.tricks[tr.id];
          if (!have || clean.lastTs > (have.lastTs || 0)) meta.tricks[tr.id] = clean;
        });
      }
    }
    if (tiers && typeof tiers === 'object') {
      E.TIERS.forEach(function (t) { if (tiers[t.id] && tiers[t.id].cleared === true) meta.tierClears[t.id] = true; });
    }
    if (m && m.tierBonus && typeof m.tierBonus === 'object') {
      E.TIERS.forEach(function (t) { if (m.tierBonus[t.id] === true) meta.tierBonus[t.id] = true; });
    }
    saveMeta();
  }

  function importProfile(file) {
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var data = JSON.parse(reader.result);
        if (data && data.app === 'limitless-math') {
          $('profile-note').textContent = 'That is a full progress file. Use “Import progress” under Your records. To upload a weak-spot analysis, choose the file called limitless-weak-spots-….json.';
          return;
        }
        if (!data || data.app !== 'limitless-math-profile' || !data.skills || typeof data.skills !== 'object') throw new Error('not an analysis');
        var skills = {}, count = 0;
        E.SKILLS.forEach(function (k) {
          var s = data.skills[k];
          if (!s || typeof s !== 'object') return;
          skills[k] = { n: Math.round(num(s.n, 0, 1000, 0)), acc: num(s.acc, 0, 1, 0), ratio: num(s.ratio, 0, 10, 1), medianTime: num(s.medianTime, 0, 300, 0) };
          skills[k].medTime = skills[k].medianTime;
          if (skills[k].n > 0) count++;
        });
        var exportedAt = (typeof data.exportedAt === 'string' && !isNaN(Date.parse(data.exportedAt))) ? data.exportedAt : new Date().toISOString();
        save(KEY_PROFILE, { importedAt: new Date().toISOString(), exportedAt: exportedAt, skills: skills });
        mergeMeta(data.meta, data.tiers);
        renderMenu();
        var rx = prescription(analyse());
        $('profile-note').textContent = 'Loaded your analysis from ' + new Date(exportedAt).toLocaleDateString() + ' (' + count + ' skills). ' +
          (rx ? 'Your drill is ready: ' + DRILL_KINDS[rx.kind].name + ' on ' + sentenceList(rx.skills) + '.' : 'No weak spots in it. Nice.');
      } catch (e) {
        $('profile-note').textContent = 'That file could not be read as a weak-spot analysis.';
      }
    };
    reader.readAsText(file);
  }

  /* ==================================================================
     MENU
     ================================================================== */
  function makeChip(group, value, name, desc, selected, disabled, onPick) {
    var label = h('label', 'chip' + (selected ? ' is-selected' : '') + (disabled ? ' is-disabled' : ''));
    var input = document.createElement('input');
    input.type = 'radio'; input.name = group; input.value = value;
    input.checked = selected; input.disabled = !!disabled;
    input.addEventListener('change', function () { onPick(value); });
    label.appendChild(input);
    label.appendChild(h('div', 'chip-name', name));
    label.appendChild(h('div', 'chip-desc', desc));
    return label;
  }

  function refocus(name) {
    var el = document.querySelector('input[name="' + name + '"]:checked');
    if (el) el.focus();
  }

  function renderDrillFocus() {
    var sel = $('drill-focus');
    if (!sel.options.length) {
      var o = document.createElement('option'); o.value = 'auto'; o.textContent = 'Prescribed: my weakest skills'; sel.appendChild(o);
      E.SKILLS.forEach(function (k) { var op = document.createElement('option'); op.value = k; op.textContent = k; sel.appendChild(op); });
    }
    sel.value = prefs.drillFocus;
    var rx = prescription(analyse());
    $('drill-note').textContent = prefs.drillFocus === 'auto'
      ? (rx ? 'Will drill ' + sentenceList(rx.skills) + ' as a ' + DRILL_KINDS[rx.kind].name.toLowerCase() + '.' : 'No weak spots yet, so you will get a general drill at your chosen tier.')
      : 'Will drill ' + prefs.drillFocus + ' at about your chosen tier’s level.';
  }

  function renderTrickSummary() {
    var mastered = E.TRICKS.filter(function (t) { return isMastered(meta.tricks[t.id]); }).length;
    $('trick-summary').textContent = mastered + ' of ' + E.TRICKS.length + ' shortcuts mastered. Each one is measured: a baseline, a lesson, practice, then a post-test, so you see whether it really made you faster.';
  }

  function renderMenu() {
    setMood();
    var mode = MODES[prefs.mode];
    var forcedPenalty = mode.forcePenalty || null;
    var activePenalty = forcedPenalty || prefs.penalty;

    renderProfile();
    renderCoach();

    var modeBox = $('mode-chips'); clear(modeBox);
    Object.keys(MODES).forEach(function (id) {
      modeBox.appendChild(makeChip('mode', id, MODES[id].name, MODES[id].desc, id === prefs.mode, false, function (v) { prefs.mode = v; save(KEY_PREFS, prefs); renderMenu(); refocus('mode'); }));
    });
    $('drill-panel').hidden = prefs.mode !== 'drill';
    if (prefs.mode === 'drill') renderDrillFocus();

    var tierBox = $('tier-chips'); clear(tierBox);
    E.TIERS.forEach(function (t) {
      var st = tierStatus(t.id);
      var sel = t.id === prefs.tier;
      var label = h('label', 'tier-chip' + (sel && mode.usesTier ? ' is-selected' : '') + (mode.usesTier ? '' : ' is-disabled'));
      var input = document.createElement('input');
      input.type = 'radio'; input.name = 'tier'; input.value = t.id; input.checked = sel; input.disabled = !mode.usesTier;
      input.addEventListener('change', function () { prefs.tier = t.id; save(KEY_PREFS, prefs); renderMenu(); refocus('tier'); });
      label.appendChild(input);
      label.appendChild(h('div', 'tier-emblem', t.emblem));
      label.appendChild(h('div', 'tier-name', t.name));
      label.appendChild(h('div', 'tier-label', t.label));
      label.appendChild(h('div', 'tier-blurb', t.blurb));
      label.appendChild(h('div', 'tier-badge' + (st.isCleared ? ' is-cleared' : ''),
        st.isCleared ? '✓ Cleared' : (st.runs ? st.cleared + '/' + st.runs + ' clears' : 'Not tried')));
      var fd = fadeFor(t.index, rankFor(meta.xp).idx);
      if (mode.usesTier && fd < 1) label.appendChild(h('div', 'tier-xp', 'XP ' + pct(fd)));
      tierBox.appendChild(label);
    });
    $('tier-panel').style.opacity = mode.usesTier ? '1' : '.55';

    var penBox = $('penalty-chips'); clear(penBox);
    Object.keys(PENALTIES).forEach(function (id) {
      penBox.appendChild(makeChip('penalty', id, PENALTIES[id].name, PENALTIES[id].desc, id === activePenalty,
        !!forcedPenalty, function (v) { prefs.penalty = v; save(KEY_PREFS, prefs); renderMenu(); refocus('penalty'); }));
    });
    $('penalty-note').textContent = forcedPenalty
      ? 'Limitless always uses Sudden Death.'
      : PENALTY_NOTES[activePenalty];

    var timerBox = $('timer-chips'); clear(timerBox);
    Object.keys(TIMERS).forEach(function (id) {
      timerBox.appendChild(makeChip('timer', id, TIMERS[id].name, TIMERS[id].desc, id === prefs.timer, false,
        function (v) { prefs.timer = v; save(KEY_PREFS, prefs); renderMenu(); refocus('timer'); }));
    });

    var line = [];
    if (mode.count) line.push(mode.count + ' questions');
    if (mode.seconds) line.push(fmtClock(mode.seconds));
    if (mode.usesTier) line.push(E.TIER_BY_ID[prefs.tier].name); else line.push('starts at Adept');
    line.push(PENALTIES[activePenalty].name);
    if (mode.usesTier) { var fr = fadeFor(E.TIER_BY_ID[prefs.tier].index, rankFor(meta.xp).idx); line.push(fr >= 1 ? 'full XP' : 'XP at ' + pct(fr)); }
    if (prefs.timer === 'strict') line.push('strict timer');
    $('start-note').textContent = line.join(' · ');

    renderTrickSummary();
    renderHistory();
  }

  function renderHistory() {
    var box = $('history'); clear(box);
    var runs = load(KEY_RUNS, []).slice(-8).reverse();
    if (!runs.length) { box.appendChild(h('p', 'empty', 'No runs yet. Your first run will appear here.')); return; }
    var table = h('table', 'history-table');
    var head = h('tr');
    ['Date', 'Mode', 'Tier', 'Right / Wrong / Skip', 'Accuracy', 'Median', 'Points', ''].forEach(function (t) { head.appendChild(h('th', '', t)); });
    table.appendChild(head);
    runs.forEach(function (r) {
      var tr = h('tr');
      var d = new Date(r.ts);
      [d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' }) + ' ' + d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
        (MODES[r.mode] ? MODES[r.mode].name : r.mode),
        r.mode === 'limitless' ? ('to ' + (E.TIER_BY_ID[r.topTier] ? E.TIER_BY_ID[r.topTier].name : '')) : (E.TIER_BY_ID[r.tier] ? E.TIER_BY_ID[r.tier].name : r.tier),
        r.correct + ' / ' + r.wrong + ' / ' + r.skipped,
        r.attempted ? pct(r.accuracy) : '–', r.attempted ? fmtSec(r.medianTime) : '–', String(r.points),
        r.cleared ? '✓' : ''
      ].forEach(function (t) { tr.appendChild(h('td', '', t)); });
      table.appendChild(tr);
    });
    var wrap = h('div', 'table-wrap'); wrap.appendChild(table); box.appendChild(wrap);
  }

  /* ==================================================================
     A RUN
     cfg (all optional): { mode, drill:{skills,weights,kind,before}, trick:{id,phase} }
     ================================================================== */
  var run = null, tickTimer = null, lastCfg = null;

  function modeOf(r) { return r.trick ? TRICK_MODE : MODES[r.mode]; }

  function startRun(cfg) {
    cfg = cfg || {};
    var trick = cfg.trick || null;
    var modeId = trick ? 'trick' : (cfg.mode || prefs.mode);
    var mode = trick ? TRICK_MODE : MODES[modeId];
    var drill = (modeId === 'drill') ? (cfg.drill || buildDrillCfg(false)) : null;
    var penaltyId = trick ? 'practice' : (mode.forcePenalty || (drill && drill.kind === 'accuracy' ? 'strict' : prefs.penalty));
    var pen = PENALTIES[penaltyId];
    var factor = 0;
    if (!trick) {
      if (drill && drill.kind === 'speed') factor = 1.25;
      else if (prefs.timer === 'strict') factor = 1.6;
    }
    var rng = E.makeRng((Math.random() * 4294967296) >>> 0);
    var tierId = mode.usesTier ? (cfg.tier || prefs.tier) : null;
    lastCfg = trick ? null : { mode: modeId, tier: tierId, penalty: penaltyId, drill: drill };
    run = {
      id: 'r' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      ts: Date.now(), mode: modeId, tier: tierId, penalty: penaltyId,
      rng: rng, ctx: { recent: [] }, trick: trick, drill: drill, factor: factor,
      count: trick ? TRICK_PHASES[trick.phase].count : (mode.count || 0),
      deck: (modeId === 'test80') ? E.buildDeck(tierId, mode.count, rng) : null,
      retry: [], timeouts: 0,
      attempts: [], points: 0, streak: 0, bestStreak: 0, wrongRow: 0,
      lives: pen.lives || 0, correct: 0, wrong: 0, skipped: 0, topTierIndex: 0,
      q: null, qStart: 0, qLimit: 0, t0: performance.now(), ended: false, busy: false
    };
    $('hud-lives-wrap').hidden = !pen.lives;
    $('hud-clock-label').textContent = mode.seconds ? 'Time left' : 'Time';
    $('feedback').textContent = ' '; $('feedback').className = 'feedback';
    show('screen-play');
    nextQuestion();
    updateHud();
    clearInterval(tickTimer);
    tickTimer = setInterval(tick, 100);
    $('answer').value = '';
    $('answer').focus();
  }

  function currentTierId() {
    if (run.mode === 'limitless') return E.limitlessTier(run.correct);
    return run.tier;
  }

  function nextQuestion() {
    var q = null;
    if (run.trick) {
      q = E.trickQuestion(run.trick.id, run.rng, run.ctx);
    } else {
      if (run.retry.length && run.attempts.length >= run.retry[0].at) {
        q = E.retryQuestion(run.retry.shift().q, run.rng, run.ctx);
        if (q) q.tag = 'Retry';
      }
      if (!q) {
        if (run.mode === 'drill') q = E.drillQuestion(run.drill.skills, run.drill.weights, run.tier, run.rng, run.ctx);
        else if (run.mode === 'test80') q = E.deckQuestion(run.deck[Math.min(run.attempts.length, run.deck.length - 1)], run.rng, run.ctx);
        else q = E.nextQuestion(currentTierId(), run.rng, run.ctx);
      }
    }
    run.q = q;
    $('answer').setAttribute('inputmode', (q.answer.n < 0 || q.tag === 'Fraction or decimal' || /\//.test(q.answerText) || (q.tol && q.tol.center < 0)) ? 'text' : 'decimal');
    if (q.tier) run.topTierIndex = Math.max(run.topTierIndex, E.TIER_BY_ID[q.tier].index);
    run.qStart = performance.now();
    run.qLimit = run.factor ? E.strictLimit(q, run.factor) : 0;
    $('qbar').hidden = !run.qLimit;
    $('qbar-fill').style.width = '100%'; $('qbar-fill').classList.remove('is-low');
    $('question').textContent = q.text;
    $('q-tag').textContent = q.tag || ' ';
    $('method').textContent = (run.trick && run.trick.phase === 'practice') ? 'Method: ' + E.TRICK_BY_ID[run.trick.id].short : '';
    $('answer').value = '';
  }

  function elapsed() { return (performance.now() - run.t0) / 1000; }

  function tick() {
    if (!run || run.ended) return;
    var mode = modeOf(run);
    if (mode.seconds && elapsed() >= mode.seconds) { finishRun('Time is up'); return; }
    if (run.qLimit && !run.busy) {
      var qt = (performance.now() - run.qStart) / 1000, left = 1 - qt / run.qLimit;
      $('qbar-fill').style.width = Math.max(0, left * 100) + '%';
      $('qbar-fill').classList.toggle('is-low', left < 0.3);
      if (qt >= run.qLimit) { resolve('timeout', ''); return; }
    }
    updateClock();
  }

  function updateClock() {
    var mode = modeOf(run);
    var clock = $('hud-clock');
    if (mode.seconds) {
      var left = mode.seconds - elapsed();
      clock.textContent = fmtClock(left);
      clock.classList.toggle('is-low', left <= 10);
    } else {
      clock.textContent = fmtClock(elapsed());
      clock.classList.remove('is-low');
    }
  }

  function updateHud() {
    updateClock();
    $('hud-progress').textContent = run.count ? (Math.min(run.attempts.length + 1, run.count) + ' / ' + run.count) : String(run.attempts.length + 1);
    $('hud-points').textContent = String(run.points);
    $('hud-combo').textContent = String(run.streak);
    if (PENALTIES[run.penalty].lives) {
      var hearts = '';
      for (var i = 0; i < PENALTIES[run.penalty].lives; i++) hearts += i < run.lives ? '♥' : '♡';
      $('hud-lives').textContent = hearts;
    }
  }

  /* result: 'correct' | 'wrong' | 'skip' | 'timeout' */
  function resolve(result, given) {
    if (!run || run.ended || run.busy) return;
    run.busy = true;
    var q = run.q, time = (performance.now() - run.qStart) / 1000;
    if (result === 'timeout') time = run.qLimit;
    var fb = $('feedback'), msg = '', cls = 'feedback';
    var pen = PENALTIES[run.penalty];
    var showHint = !!(run.trick && run.trick.phase === 'practice' && q.hint);

    if (result === 'correct') {
      run.correct++; run.streak++; run.wrongRow = 0;
      run.bestStreak = Math.max(run.bestStreak, run.streak);
      var gained = 10 + Math.min(5, Math.floor(run.streak / 2));
      run.points += gained;
      msg = showHint ? '✓ ' + q.hint : '✓ +' + gained; cls += ' is-good';
    } else if (result === 'wrong' || result === 'timeout') {
      run.wrong++; run.streak = 0; run.wrongRow++;
      if (result === 'timeout') run.timeouts++;
      var cost = pen.wrong(run.wrongRow);
      run.points -= cost;
      if (pen.lives) run.lives--;
      var lead = result === 'timeout' ? '⏱ Too slow · ' : '✗ ';
      msg = lead + (showHint ? q.hint : E.withCommas(q.answerText)) + (cost ? '  (' + MINUS + cost + ')' : '');
      cls += ' is-bad';
      $('answer').classList.remove('is-shake'); void $('answer').offsetWidth; $('answer').classList.add('is-shake');
      if (run.drill && run.drill.kind === 'accuracy') run.retry.push({ at: run.attempts.length + 4, q: q });
    } else {
      run.skipped++; run.streak = 0;
      msg = 'Skipped · ' + (showHint ? q.hint : E.withCommas(q.answerText));
    }
    fb.textContent = msg; fb.className = cls;

    run.attempts.push({
      i: run.attempts.length + 1, gen: q.id, skill: q.skill, text: q.text, answerText: q.answerText,
      given: given, result: result, time: Math.round(time * 100) / 100, target: q.target, diff: q.diff,
      tier: q.tier
    });

    var done = (run.count && run.attempts.length >= run.count) || (pen.lives && run.lives <= 0);
    if (done) { updateHud(); finishRun(pen.lives && run.lives <= 0 ? 'Out of lives' : 'Run complete'); return; }
    nextQuestion();
    updateHud();
    run.busy = false;
    $('answer').focus();
  }

  function finishRun(reason) {
    if (!run || run.ended) return;
    run.ended = true;
    clearInterval(tickTimer);
    if (run.trick) { finishTrick(); return; }
    if (!run.attempts.length) { show('screen-menu'); renderMenu(); return; }
    var summary = summarise(run, reason);
    touchStreak();
    persist(run, summary);
    renderResults(run, summary);
  }

  /* ==================================================================
     SCORING AND SAVING
     ================================================================== */
  function summarise(r, reason) {
    var answered = r.attempts.filter(function (a) { return a.result !== 'skip'; });
    var rights = r.attempts.filter(function (a) { return a.result === 'correct'; });
    var attempted = r.correct + r.wrong;
    var accuracy = attempted ? r.correct / attempted : 0;
    var times = answered.map(function (a) { return a.time; });
    var ratios = answered.map(function (a) { return a.time / a.target; });
    var speed = rights.length ? mean(rights.map(function (a) { return Math.min(1, a.target / Math.max(a.time, 0.2)); })) * 100 : 0;
    var mode = MODES[r.mode];
    var tier = r.tier ? E.TIER_BY_ID[r.tier] : null;
    var qualifying = !!(mode.minSample && attempted >= mode.minSample);
    var medianRatio = median(ratios);
    var cleared = !!(qualifying && tier && accuracy >= tier.accuracy && medianRatio <= 1);
    return {
      reason: reason, attempted: attempted, accuracy: accuracy,
      medianTime: median(times), medianTarget: median(answered.map(function (a) { return a.target; })),
      medianRatio: medianRatio, speed: Math.round(speed), qualifying: qualifying, cleared: cleared,
      duration: elapsed()
    };
  }

  function persist(r, s) {
    /* XP first, so the saved run knows what it earned */
    var info = xpBreakdown(r, s, rankFor(meta.xp).idx);
    if (info.firstClear) meta.tierBonus[info.tierId] = true;
    var award = awardXp(info.total);
    s.xp = award.gained; s.rankUp = award.rankUp; s.xpInfo = info;

    var runs = load(KEY_RUNS, []);
    runs.push({
      id: r.id, ts: r.ts, mode: r.mode, tier: r.tier, penalty: r.penalty,
      topTier: E.TIERS[r.topTierIndex].id,
      correct: r.correct, wrong: r.wrong, skipped: r.skipped, timeouts: r.timeouts, attempted: s.attempted,
      accuracy: s.accuracy, medianTime: s.medianTime, medianRatio: s.medianRatio,
      points: r.points, speed: s.speed, bestStreak: r.bestStreak, duration: s.duration,
      qualifying: s.qualifying, cleared: s.cleared, xp: s.xp
    });
    save(KEY_RUNS, runs.slice(-MAX_RUNS));

    var atts = load(KEY_ATT, []);
    r.attempts.forEach(function (a) {
      atts.push({ run: r.id, i: a.i, t: a.tier, g: a.gen, s: a.skill, q: a.text, a: a.answerText,
        x: a.given, r: a.result, time: a.time, target: a.target, d: a.diff, ts: r.ts });
    });
    save(KEY_ATT, atts.slice(-MAX_ATTEMPTS));
  }

  /* ==================================================================
     RESULTS SCREEN
     ================================================================== */
  function tile(label, value, sub) {
    var t = h('div', 'tile');
    t.appendChild(h('div', 'tile-label', label));
    t.appendChild(h('div', 'tile-value', value));
    t.appendChild(h('div', 'tile-sub', sub));
    return t;
  }

  function renderResults(r, s) {
    var mode = MODES[r.mode];
    $('res-title').textContent = mode.name + ' — ' + (r.tier ? E.TIER_BY_ID[r.tier].name : 'reached ' + E.TIERS[r.topTierIndex].name);
    $('res-sub').textContent = s.reason + ' · ' + PENALTIES[r.penalty].name + ' · ' + fmtClock(s.duration);

    var tiles = $('res-tiles'); clear(tiles);
    tiles.appendChild(tile('Accuracy', s.attempted ? pct(s.accuracy) : '–', r.correct + ' right, ' + r.wrong + ' wrong' + (r.skipped ? ', ' + r.skipped + ' skipped' : '') + (r.timeouts ? ' (' + r.timeouts + ' too slow)' : '')));
    tiles.appendChild(tile('Speed score', String(s.speed), 'how close to the target times'));
    tiles.appendChild(tile('Points', String(r.points), 'best combo ' + r.bestStreak));
    tiles.appendChild(tile('Median time', s.attempted ? fmtSec(s.medianTime) : '–', 'target ' + fmtSec(s.medianTarget)));
    var rk = rankFor(meta.xp);
    tiles.appendChild(tile('XP', '+' + s.xp, s.rankUp ? 'New rank: ' + s.rankUp + '!' : rk.name + ' · ' + meta.xp + ' XP'));

    var v = $('res-verdict');
    v.className = 'verdict' + (s.cleared ? ' is-cleared' : '');
    var tier = r.tier ? E.TIER_BY_ID[r.tier] : null;
    if (r.mode === 'drill') {
      v.textContent = (r.drill && r.drill.skills.length ? 'Drill on ' + sentenceList(r.drill.skills) + ' (' + DRILL_KINDS[r.drill.kind].name.toLowerCase() + '). ' : 'General drill. ') +
        'Accuracy ' + pct(s.accuracy) + ', median ' + fmtSec(s.medianTime) + ' against a target of ' + fmtSec(s.medianTarget) + '.';
    } else if (tier && s.qualifying) {
      if (s.cleared) {
        v.textContent = '✓ Tier run cleared: accuracy ' + pct(s.accuracy) + ' (needed ' + pct(tier.accuracy) + ') and median time within target. Clear 2 of your last 3 runs to ascend.';
      } else if (s.accuracy >= tier.accuracy) {
        v.textContent = 'Accurate but slow: your median time was above the target. Next run, trust your first method and move faster.';
      } else if (s.medianRatio <= 1) {
        v.textContent = 'Fast but sloppy: you were quick but accuracy was ' + pct(s.accuracy) + ' (needed ' + pct(tier.accuracy) + '). Slow down slightly and check carry digits.';
      } else {
        v.textContent = 'Not cleared yet: both accuracy and speed need work. Review the mistakes below, then try again.';
      }
    } else if (tier) {
      v.textContent = 'Too few questions answered for a tier clear (needs ' + MODES[r.mode].minSample + '). Keep going next time.';
    } else {
      v.textContent = 'You reached ' + E.TIERS[r.topTierIndex].name + ' with a best combo of ' + r.bestStreak + '.';
    }

    /* drills: did the targeted skills improve compared with before? */
    var extra = $('res-extra'); clear(extra);
    var lines = [];
    var xi = s.xpInfo;
    if (xi) {
      var f2 = function (x) { return String(Math.round(x * 100) / 100); };
      lines.push('XP: ' + Math.round(xi.base) + ' base × tier ' + f2(xi.tierMult) + ' × penalty ' + f2(xi.penMult) + ' × rank fade ' + f2(xi.fade) +
        (xi.clearBonus ? ' + ' + Math.round(xi.clearBonus) + (xi.firstClear ? ' first-clear bonus' : ' clear bonus') : '') +
        (xi.drillBonus ? ' + ' + Math.round(xi.drillBonus) + ' drill bonus' : '') + ' = +' + xi.total);
      if (xi.fade < 1) lines.push('This tier is below your rank, so it pays ' + pct(xi.fade) + ' of full XP. A higher tier pays full value.');
    }
    if (r.drill && r.drill.skills.length) {
      r.drill.skills.forEach(function (skill) {
        var list = r.attempts.filter(function (a) { return a.skill === skill && a.result !== 'skip'; });
        if (list.length < 3) return;
        var acc = list.filter(function (a) { return a.result === 'correct'; }).length / list.length;
        var ratio = median(list.map(function (a) { return a.time / a.target; }));
        var b = r.drill.before[skill];
        lines.push(skill + ': accuracy ' + (b ? pct(b.acc) + ' → ' : '') + pct(acc) + ', pace ' + (b ? b.ratio.toFixed(1) + '× → ' : '') + ratio.toFixed(1) + '× target (' + list.length + ' questions)');
      });
    }
    extra.hidden = !lines.length;
    lines.forEach(function (t) { extra.appendChild(h('div', '', t)); });

    renderPace(r);
    renderSkills(r);
    renderMistakes(r);
    renderResultCoach();
    show('screen-results');
  }

  function renderResultCoach() {
    var box = $('res-coach'); clear(box);
    var rx = prescription(analyse());
    if (rx) {
      var p = h('p', 'coach-line');
      p.appendChild(document.createTextNode('Next: '));
      p.appendChild(h('b', '', DRILL_KINDS[rx.kind].name));
      p.appendChild(document.createTextNode(' on ' + sentenceList(rx.skills) + ' (' + DRILL_KINDS[rx.kind].text + ').'));
      box.appendChild(p);
      $('btn-res-drill').hidden = false;
    } else {
      box.appendChild(h('p', 'coach-line', 'No weak spots stand out yet. Keep training, then download your analysis to carry it to your next session.'));
      $('btn-res-drill').hidden = true;
    }
  }

  function svgEl(name, attrs) {
    var el = document.createElementNS('http://www.w3.org/2000/svg', name);
    for (var k in attrs) el.setAttribute(k, attrs[k]);
    return el;
  }

  function renderPace(r) {
    var box = $('res-pace'); clear(box);
    var n = r.attempts.length, W = 800, H = 220, L = 38, B = 24, T = 10;
    var svg = svgEl('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'pace-svg', role: 'img', 'aria-label': 'Time taken for each question' });
    var times = r.attempts.map(function (a) { return a.time; });
    var cap = Math.min(20, Math.max(8, Math.max.apply(null, times)));
    var plotH = H - B - T, plotW = W - L - 6, slot = plotW / Math.max(n, 1);
    var bw = Math.max(1.5, Math.min(14, slot * 0.72));
    svg.appendChild(svgEl('line', { x1: L, y1: H - B, x2: W - 6, y2: H - B, class: 'axis' }));
    [0, cap / 2, cap].forEach(function (val) {
      var y = H - B - (val / cap) * plotH;
      var t = svgEl('text', { x: L - 6, y: y + 4, 'text-anchor': 'end' }); t.textContent = Math.round(val) + 's';
      svg.appendChild(t);
    });
    r.attempts.forEach(function (a, idx) {
      var hgt = Math.max(1.5, (Math.min(a.time, cap) / cap) * plotH);
      var cls = a.result === 'correct' ? 'bar-ok' : (a.result === 'wrong' || a.result === 'timeout') ? 'bar-bad' : 'bar-skip';
      var rect = svgEl('rect', { x: L + idx * slot + (slot - bw) / 2, y: H - B - hgt, width: bw, height: hgt, class: cls });
      var title = svgEl('title', {}); title.textContent = 'Q' + a.i + ': ' + a.time.toFixed(1) + ' s · ' + a.result + ' · ' + a.text;
      rect.appendChild(title); svg.appendChild(rect);
    });
    var avgTarget = mean(r.attempts.map(function (a) { return a.target; }));
    var ty = H - B - (Math.min(avgTarget, cap) / cap) * plotH;
    svg.appendChild(svgEl('line', { x1: L, y1: ty, x2: W - 6, y2: ty, class: 'target' }));
    var lab = svgEl('text', { x: W - 8, y: ty - 5, 'text-anchor': 'end' }); lab.textContent = 'avg target ' + avgTarget.toFixed(1) + 's';
    svg.appendChild(lab);
    var xl = svgEl('text', { x: L, y: H - 6 }); xl.textContent = 'Q1'; svg.appendChild(xl);
    var xr = svgEl('text', { x: W - 6, y: H - 6, 'text-anchor': 'end' }); xr.textContent = 'Q' + n; svg.appendChild(xr);
    box.appendChild(svg);
  }

  function renderSkills(r) {
    var table = $('res-skills'); clear(table);
    var head = h('tr');
    ['Skill', 'Questions', 'Accuracy', 'Median time', 'Diagnosis', 'Next step'].forEach(function (t) { head.appendChild(h('th', '', t)); });
    table.appendChild(head);
    var bySkill = {};
    r.attempts.forEach(function (a) { (bySkill[a.skill] = bySkill[a.skill] || []).push(a); });
    Object.keys(bySkill).sort().forEach(function (skill) {
      var list = bySkill[skill];
      var answered = list.filter(function (a) { return a.result !== 'skip'; });
      var right = answered.filter(function (a) { return a.result === 'correct'; }).length;
      var acc = answered.length ? right / answered.length : 0;
      var ratio = median(answered.map(function (a) { return a.time / a.target; }));
      var dg = diagnose(acc, ratio, answered.length);
      var tr = h('tr');
      tr.appendChild(h('td', '', skill));
      tr.appendChild(h('td', '', String(list.length)));
      tr.appendChild(h('td', '', answered.length ? pct(acc) : '–'));
      tr.appendChild(h('td', '', answered.length ? fmtSec(median(answered.map(function (a) { return a.time; }))) : '–'));
      var td = h('td'); td.appendChild(h('span', 'diag ' + dg.cls, dg.text)); tr.appendChild(td);
      tr.appendChild(h('td', '', (dg.text === 'Strong' || dg.text === 'Too few to judge') ? '–' : DRILL_KINDS[kindFor(dg.text)].next));
      table.appendChild(tr);
    });
  }

  function renderMistakes(r) {
    var box = $('res-mistakes'); clear(box);
    var bad = r.attempts.filter(function (a) { return a.result !== 'correct'; });
    $('res-mistakes-panel').hidden = !bad.length;
    bad.forEach(function (a) {
      var row = h('div', 'mistake');
      row.appendChild(h('div', 'm-q', a.text));
      var yours = h('div');
      yours.appendChild(h('span', 'm-label', a.result === 'skip' ? 'Skipped' : a.result === 'timeout' ? 'Too slow' : 'Your answer'));
      yours.appendChild(document.createTextNode((a.result === 'skip' || a.result === 'timeout') ? '–' : (a.given || '–')));
      var right = h('div'); right.appendChild(h('span', 'm-label', 'Correct'));
      right.appendChild(document.createTextNode(E.withCommas(a.answerText)));
      row.appendChild(yours); row.appendChild(right);
      box.appendChild(row);
    });
  }

  /* ==================================================================
     TRICK CHAMBER
     ================================================================== */
  var openTrickId = null, trickBanner = '';
  var KEY_TOPIC = 'limitless.math.v1.topic';   /* sessionStorage: remembered for this tab only */
  try { var savedTopic = sessionStorage.getItem(KEY_TOPIC); if (savedTopic && E.TRICK_BY_ID[savedTopic]) openTrickId = savedTopic; } catch (e) {}
  function setOpenTrick(id) {
    openTrickId = id;
    try { sessionStorage.setItem(KEY_TOPIC, id || ''); } catch (e) {}
    updateNav();
  }

  function isMastered(t) {
    if (!t || !t.post) return false;
    return t.post.acc >= 0.9 && (t.post.ratio <= 1 || (t.base && t.post.med <= t.base.med * 0.8));
  }
  function trickStatus(t) {
    if (isMastered(t)) return 'Mastered';
    if (t && t.post) return 'Post-test done';
    if (t && t.practice) return 'Practised';
    if (t && (t.base || t.skipBase)) return 'Lesson unlocked';
    return 'Not started';
  }

  function renderTrickList() {
    var box = $('trick-list'); clear(box);
    E.TRICKS.forEach(function (tr) {
      var rec = meta.tricks[tr.id];
      var card = h('button', 'trick-card' + (openTrickId === tr.id ? ' is-open' : ''));
      card.type = 'button';
      card.appendChild(h('div', 't-name', tr.name));
      card.appendChild(h('div', 't-blurb', tr.blurb));
      card.appendChild(h('span', 't-status' + (isMastered(rec) ? ' is-mastered' : ''), trickStatus(rec)));
      card.addEventListener('click', function () { setOpenTrick(tr.id); trickBanner = ''; renderTricks(); $('trick-detail').scrollIntoView({ behavior: 'smooth', block: 'start' }); });
      box.appendChild(card);
    });
  }

  function statCell(s) { return s ? pct(s.acc) + ' right · ' + fmtSec(s.med) + ' median' : '–'; }

  function renderTrickDetail() {
    var box = $('trick-detail'); clear(box);
    if (!openTrickId) { box.hidden = true; return; }
    box.hidden = false; box.className = 'panel trick-detail';
    var tr = E.TRICK_BY_ID[openTrickId], rec = meta.tricks[tr.id] || {};
    box.appendChild(h('h3', '', tr.name));
    box.appendChild(h('p', 'note', tr.when));
    if (trickBanner) box.appendChild(h('div', 'trick-banner', trickBanner));

    var unlocked = !!(rec.base || rec.skipBase);
    var steps = h('div', 'trick-steps');

    /* step 1: baseline */
    var s1 = h('div', 'trick-step');
    var t1 = h('div', 's-text'); t1.appendChild(h('b', '', '1. Baseline. ')); t1.appendChild(document.createTextNode(rec.base ? 'Done: ' + statCell(rec.base) + '.' : '6 questions before you see the lesson, so we can measure how much the trick helps.'));
    s1.appendChild(t1);
    var b1 = h('button', 'button button-secondary small', rec.base ? 'Retake baseline' : 'Take baseline'); b1.type = 'button';
    b1.addEventListener('click', function () { startRun({ trick: { id: tr.id, phase: 'baseline' } }); });
    s1.appendChild(b1);
    if (!unlocked) {
      var skip = h('button', 'button button-secondary small', 'Skip, show lesson'); skip.type = 'button';
      skip.addEventListener('click', function () { var t = tk(tr.id); t.skipBase = true; saveMeta(); renderTricks(); });
      s1.appendChild(skip);
    }
    steps.appendChild(s1);

    /* step 2: lesson */
    var s2 = h('div', 'trick-step');
    var t2 = h('div', 's-text'); t2.appendChild(h('b', '', '2. Lesson. '));
    if (!unlocked) t2.appendChild(document.createTextNode('Unlocks after the baseline (or skip it).'));
    else t2.appendChild(document.createTextNode('Read it below, then practise.'));
    s2.appendChild(t2);
    steps.appendChild(s2);

    if (unlocked) {
      var lesson = h('div');
      lesson.appendChild(h('p', 'coach-line', 'The method: ' + tr.short));
      var ol = h('ol');
      tr.steps.forEach(function (st) { ol.appendChild(h('li', '', st)); });
      lesson.appendChild(ol);
      lesson.appendChild(h('div', 'trick-example', 'Example: ' + tr.example));
      steps.appendChild(lesson);
    }

    /* step 3: practice */
    var s3 = h('div', 'trick-step');
    var t3 = h('div', 's-text'); t3.appendChild(h('b', '', '3. Practice. ')); t3.appendChild(document.createTextNode('10 questions. The method is shown on screen and the worked answer after each one.' + (rec.practice ? ' Practice runs so far: ' + rec.practice + '.' : '')));
    s3.appendChild(t3);
    var b3 = h('button', 'button button-secondary small', 'Practise'); b3.type = 'button'; b3.disabled = !unlocked;
    b3.addEventListener('click', function () { startRun({ trick: { id: tr.id, phase: 'practice' } }); });
    s3.appendChild(b3);
    steps.appendChild(s3);

    /* step 4: post-test */
    var s4 = h('div', 'trick-step');
    var t4 = h('div', 's-text'); t4.appendChild(h('b', '', '4. Post-test. ')); t4.appendChild(document.createTextNode(rec.post ? 'Latest: ' + statCell(rec.post) + '.' : '6 fresh questions with no help, compared with your baseline.'));
    s4.appendChild(t4);
    var b4 = h('button', 'button button-primary small', rec.post ? 'Retake post-test' : 'Take post-test'); b4.type = 'button'; b4.disabled = !unlocked;
    b4.addEventListener('click', function () { startRun({ trick: { id: tr.id, phase: 'post' } }); });
    s4.appendChild(b4);
    steps.appendChild(s4);
    box.appendChild(steps);

    /* before / after */
    if (rec.base && rec.post) {
      var change = (rec.base.med - rec.post.med) / Math.max(rec.base.med, 0.1);
      box.appendChild(h('h3', '', 'Before and after'));
      var table = h('table', 'compare');
      var head = h('tr'); ['', 'Accuracy', 'Median time'].forEach(function (x) { head.appendChild(h('th', '', x)); }); table.appendChild(head);
      [['Before (baseline)', rec.base], ['After (post-test)', rec.post]].forEach(function (row) {
        var trw = h('tr'); trw.appendChild(h('td', '', row[0])); trw.appendChild(h('td', '', pct(row[1].acc))); trw.appendChild(h('td', '', fmtSec(row[1].med))); table.appendChild(trw);
      });
      box.appendChild(table);
      box.appendChild(h('p', 'coach-line', change > 0.05
        ? 'You are ' + Math.round(change * 100) + '% faster with this trick (' + fmtSec(rec.base.med) + ' → ' + fmtSec(rec.post.med) + ').' + (isMastered(rec) ? ' Mastered.' : ' Practise a little more to master it (90% accuracy and a clear speed-up).')
        : change < -0.05 ? 'Slower than your baseline for now (' + fmtSec(rec.base.med) + ' → ' + fmtSec(rec.post.med) + '). Practise the steps until they are automatic, then retake the post-test.'
        : 'About the same speed as your baseline. Practise until the steps are automatic, then retake the post-test.'));
    }
  }

  function tk(id) {
    if (!meta.tricks[id]) meta.tricks[id] = { base: null, post: null, practice: 0, skipBase: false, lastTs: 0 };
    return meta.tricks[id];
  }

  function renderTricks() { renderTrickList(); renderTrickDetail(); }

  function finishTrick() {
    var id = run.trick.id, phase = run.trick.phase, tr = E.TRICK_BY_ID[id];
    var answered = run.attempts.filter(function (a) { return a.result !== 'skip'; });
    if (answered.length < Math.ceil(run.count / 2)) {
      trickBanner = 'That ' + TRICK_PHASES[phase].name.toLowerCase() + ' ended early, so it was not recorded.';
    } else {
      var right = answered.filter(function (a) { return a.result === 'correct'; }).length;
      var stat = { n: answered.length, acc: right / answered.length, med: median(answered.map(function (a) { return a.time; })),
        ratio: median(answered.map(function (a) { return a.time / a.target; })), ts: Date.now() };
      var rec = tk(id);
      rec.lastTs = Date.now();
      var xp = 0, wasMastered = isMastered(rec);
      if (phase === 'baseline') { xp = rec.base ? 2 : 15; rec.base = stat; trickBanner = 'Baseline recorded: ' + pct(stat.acc) + ' right, ' + fmtSec(stat.med) + ' median. The lesson is unlocked below.'; }
      else if (phase === 'practice') { xp = Math.max(2, 10 - 2 * (rec.practice || 0)); rec.practice = (rec.practice || 0) + 1; trickBanner = 'Practice done: ' + pct(stat.acc) + ' right. Take the post-test when the steps feel automatic.'; }
      else {
        xp = rec.post ? 3 : 25; rec.post = stat;
        if (isMastered(rec) && !wasMastered) xp += 30;
        trickBanner = 'Post-test recorded: ' + pct(stat.acc) + ' right, ' + fmtSec(stat.med) + ' median.' + (rec.base ? ' Baseline was ' + fmtSec(rec.base.med) + '.' : '') + (isMastered(rec) ? ' ' + tr.name + ' mastered!' : '');
      }
      touchStreak();
      var award = awardXp(xp);
      trickBanner += ' +' + award.gained + ' XP' + (award.rankUp ? ' · new rank: ' + award.rankUp + '!' : '') + '.';
      saveMeta();
    }
    setOpenTrick(id);
    run = null;
    renderTricks();
    show('screen-tricks');
  }

  /* ==================================================================
     EXPORT / IMPORT  (full progress file: every run and every question)
     ================================================================== */
  function exportProgress() {
    var data = { app: 'limitless-math', version: 2, exportedAt: new Date().toISOString(),
      runs: load(KEY_RUNS, []), attempts: load(KEY_ATT, []), meta: meta };
    downloadJson(data, 'limitless-math-progress-' + new Date().toISOString().slice(0, 10) + '.json');
    $('io-note').textContent = 'Exported ' + data.runs.length + ' runs.';
  }

  function importProgress(file) {
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var data = JSON.parse(reader.result);
        if (data && data.app === 'limitless-math-profile') {
          $('io-note').textContent = 'That is a weak-spot analysis. Use “Upload analysis” in the coach panel at the top.';
          return;
        }
        if (!data || data.app !== 'limitless-math' || !Array.isArray(data.runs) || !Array.isArray(data.attempts)) throw new Error('not a progress file');
        var runs = load(KEY_RUNS, []), have = {};
        runs.forEach(function (x) { have[x.id] = true; });
        var added = 0;
        data.runs.forEach(function (x) {
          if (x && typeof x.id === 'string' && !have[x.id] && typeof x.ts === 'number') { runs.push(x); have[x.id] = true; added++; }
        });
        runs.sort(function (a, b) { return a.ts - b.ts; });
        var atts = load(KEY_ATT, []), seen = {};
        atts.forEach(function (x) { seen[x.run + ':' + x.i] = true; });
        data.attempts.forEach(function (x) {
          if (x && typeof x.run === 'string' && !seen[x.run + ':' + x.i]) { atts.push(x); seen[x.run + ':' + x.i] = true; }
        });
        save(KEY_RUNS, runs.slice(-MAX_RUNS)); save(KEY_ATT, atts.slice(-MAX_ATTEMPTS));
        if (data.meta) mergeMeta(data.meta, null);
        $('io-note').textContent = 'Imported ' + added + ' new runs.';
        renderMenu();
      } catch (e) {
        $('io-note').textContent = 'That file could not be read as Limitless progress.';
      }
    };
    reader.readAsText(file);
  }

  /* ==================================================================
     WIRING
     ================================================================== */
  $('btn-start').addEventListener('click', function () { startRun(); });
  $('btn-again').addEventListener('click', function () {
    if (!lastCfg) { startRun(); return; }
    prefs.mode = lastCfg.mode; if (lastCfg.tier) prefs.tier = lastCfg.tier;
    if (lastCfg.mode === 'drill') {
      var d = lastCfg.drill; d.before = snapshotBefore(d.skills);
      startRun({ mode: 'drill', drill: d });
    } else startRun();
  });
  $('btn-menu').addEventListener('click', function () { show('screen-menu'); renderMenu(); });
  $('btn-export').addEventListener('click', exportProgress);
  $('file-import').addEventListener('change', function (e) {
    if (e.target.files && e.target.files[0]) importProgress(e.target.files[0]);
    e.target.value = '';
  });
  $('btn-profile-export').addEventListener('click', exportProfile);
  $('btn-res-profile').addEventListener('click', function () { exportProfile(); $('res-coach').appendChild(h('p', 'note', 'Downloaded. Upload that file next time to start drilling straight away.')); });
  $('file-profile').addEventListener('change', function (e) {
    if (e.target.files && e.target.files[0]) importProfile(e.target.files[0]);
    e.target.value = '';
  });
  $('btn-coach-drill').addEventListener('click', function () { prefs.mode = 'drill'; save(KEY_PREFS, prefs); startRun({ mode: 'drill', drill: buildDrillCfg(true) }); });
  $('btn-res-drill').addEventListener('click', function () { prefs.mode = 'drill'; save(KEY_PREFS, prefs); startRun({ mode: 'drill', drill: buildDrillCfg(true) }); });
  $('drill-focus').addEventListener('change', function (e) { prefs.drillFocus = e.target.value; save(KEY_PREFS, prefs); renderDrillFocus(); });
  $('btn-tricks').addEventListener('click', function () { trickBanner = ''; renderTricks(); show('screen-tricks'); });
  $('btn-tricks-back').addEventListener('click', function () { show('screen-menu'); renderMenu(); });

  /* navbar: Math Trainer home / back to the open topic.
     Leaves at once, exactly like "Back to Limitless": an unfinished run is dropped, not saved. */
  function navigate(target) {
    if (run && !run.ended) { run.ended = true; clearInterval(tickTimer); run = null; }
    if (target === 'topic' && openTrickId) {
      trickBanner = ''; renderTricks(); show('screen-tricks');
      $('trick-detail').scrollIntoView({ block: 'start' });
    } else { show('screen-menu'); renderMenu(); }
  }
  $('nav-home').addEventListener('click', function () { navigate('home'); });
  $('nav-topic').addEventListener('click', function () { navigate('topic'); });

  var answerBox = $('answer');
  /* the answer box only accepts the characters an answer can contain:
     digits, one decimal point, one slash (fractions like 5/36) and a leading minus */
  function cleanAnswer(v) {
    var out = '', dot = false, slash = false, i, c;
    for (i = 0; i < v.length; i++) {
      c = v.charAt(i);
      if (c >= '0' && c <= '9') out += c;
      else if (c === '-' && out === '') out += c;
      else if (c === '.' && !dot && !slash) { dot = true; out += c; }
      else if (c === '/' && !slash && /\d$/.test(out)) { slash = true; out += c; }
    }
    return out.slice(0, 14);
  }
  answerBox.addEventListener('beforeinput', function (e) {
    if (e.inputType && e.inputType.indexOf('insert') === 0 && e.data && e.data.length === 1 && !/^[0-9.\/-]$/.test(e.data)) e.preventDefault();   /* pastes are cleaned afterwards */
  });
  answerBox.addEventListener('input', function () {
    var cleaned = cleanAnswer(answerBox.value);      /* also catches paste and autofill */
    if (cleaned !== answerBox.value) {
      var pos = answerBox.selectionStart, removed = answerBox.value.length - cleaned.length;
      answerBox.value = cleaned;
      try { answerBox.setSelectionRange(Math.max(0, pos - removed), Math.max(0, pos - removed)); } catch (er) {}
    }
    if (!run || run.ended || run.busy) return;
    var res = E.checkAnswer(run.q, answerBox.value, false);
    if (res.status === 'correct') resolve('correct', answerBox.value.trim());
  });
  answerBox.addEventListener('keydown', function (e) {
    if (!run || run.ended) return;
    if (e.key === 'Enter') {
      e.preventDefault();
      var val = answerBox.value;
      if (!val.trim()) return;
      var res = E.checkAnswer(run.q, val, true);
      if (res.status === 'correct') resolve('correct', val.trim());
      else if (res.status === 'wrong') resolve('wrong', val.trim());
      else { answerBox.classList.remove('is-shake'); void answerBox.offsetWidth; answerBox.classList.add('is-shake'); }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      resolve('skip', '');
    } else if (e.key === 'Escape') {
      e.preventDefault();
      finishRun('Run ended early');
    }
  });
  document.querySelector('.arena').addEventListener('click', function () { answerBox.focus(); });

  /* small hook for automated tests; harmless for players */
  window.MathGame = {
    state: function () { return run; }, prefs: prefs, MODES: MODES, meta: meta,
    analyse: analyse, prescription: prescription, buildProfile: buildProfile, rankFor: rankFor,
    xpBreakdown: xpBreakdown, fadeFor: fadeFor,
    startRun: startRun, KEYS: { runs: KEY_RUNS, att: KEY_ATT, meta: KEY_META, profile: KEY_PROFILE }
  };

  renderMenu();
  show('screen-menu');
})();
