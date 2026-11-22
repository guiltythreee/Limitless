/*
 * Topic link: shares progress between the CP Learning Centre (codeforces-red/) and the
 * Regionals qualification tracker (competition/) for the topics they have in common.
 *
 * Each linked topic has ONE shared level: not-started, learning, practiced or mastered.
 *   - Regionals stores that level directly (its Topic mastery dropdown).
 *   - The CP Learning Centre stores three ticks per module (concept, C++, practice), which
 *     are read as a level and written back from one.
 *
 * Each page writes only its own data plus a small shared ledger, so neither page needs to
 * understand the other's storage. The ledger remembers, per topic and per side, the last
 * level that side had and when it last changed. Reconciling is then a simple rule:
 * the most recent change wins, and on first contact the higher level wins so that
 * progress made before this feature existed is never erased.
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.LimitlessTopicLink = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var LEDGER_KEY = 'limitless.topic-links.v1';
  var LEVELS = ['not-started', 'learning', 'practiced', 'mastered'];

  // One CP module <-> one Regionals topic (subject + week). Strictly 1:1 on purpose.
  var LINKS = [
    { id: 'io-functions',   cp: 'io-functions',   subject: 'coding',        week: 1, label: 'C++ · Week 1' },
    { id: 'arrays-vectors', cp: 'arrays-vectors', subject: 'coding',        week: 2, label: 'C++ · Week 2' },
    { id: 'sorting',        cp: 'sorting',        subject: 'coding',        week: 5, label: 'C++ · Week 5' },
    { id: 'prefix-sums',    cp: 'prefix-sums',    subject: 'coding',        week: 6, label: 'C++ · Week 6' },
    { id: 'bfs-dfs',        cp: 'bfs-dfs',        subject: 'graphs',        week: 3, label: 'Graph Theory · Week 3' },
    { id: 'shortest-paths', cp: 'shortest-paths', subject: 'graphs',        week: 7, label: 'Graph Theory · Week 7' },
    { id: 'dsu',            cp: 'dsu',            subject: 'graphs',        week: 9, label: 'Graph Theory · Week 9' },
    { id: 'dp',             cp: 'dp',             subject: 'dp',            week: 3, label: 'Dynamic Programming · Week 3' },
    { id: 'combinatorics',  cp: 'combinatorics',  subject: 'combinatorics', week: 3, label: 'Combinatorics · Week 3' }
  ];

  function rank(level) {
    var i = LEVELS.indexOf(level);
    return i === -1 ? 0 : i;
  }
  function validLevel(level) { return LEVELS.indexOf(level) !== -1; }

  // ---- CP ticks <-> level -----------------------------------------------------------------
  // Practice done = practiced; everything done = mastered; any study without practice = learning.
  function cpLevel(checks, id) {
    var c = !!(checks && checks[id + ':concept']);
    var p = !!(checks && checks[id + ':cpp']);
    var r = !!(checks && checks[id + ':practice']);
    if (c && p && r) return 'mastered';
    if (r) return 'practiced';
    if (c || p) return 'learning';
    return 'not-started';
  }
  function cpChecksFor(current, target) {
    var now = { concept: !!current.concept, cpp: !!current.cpp, practice: !!current.practice };
    var key = { 'm:concept': now.concept, 'm:cpp': now.cpp, 'm:practice': now.practice };
    if (cpLevel(key, 'm') === target) return now;   // already reads as the target: keep the exact ticks
    if (target === 'mastered') return { concept: true, cpp: true, practice: true };
    if (target === 'practiced') return { concept: true, cpp: false, practice: true };
    if (target === 'learning') return { concept: true, cpp: false, practice: false };
    return { concept: false, cpp: false, practice: false };
  }

  // ---- Ledger ---------------------------------------------------------------------------------
  function readLedger(store) {
    try {
      var parsed = JSON.parse(store.get(LEDGER_KEY) || 'null');
      if (parsed && typeof parsed === 'object' && parsed.links && typeof parsed.links === 'object') return parsed;
    } catch (_) { /* a damaged ledger is rebuilt from the two sides */ }
    return { v: 1, links: {} };
  }
  function cleanRecord(record) {
    if (!record || typeof record !== 'object' || !validLevel(record.level)) return null;
    return { level: record.level, at: Number.isFinite(record.at) ? record.at : 0 };
  }

  /*
   * Bring one side (side = 'cp' or 'reg') in line with the shared ledger.
   * adapter.get(link) -> that side's current level, adapter.set(link, level) -> change it.
   * Returns { applied: [links whose level on THIS side was changed] } so the page can save and redraw.
   */
  function reconcile(side, adapter, store, now) {
    var other = side === 'cp' ? 'reg' : 'cp';
    var ledger = readLedger(store);
    var before = JSON.stringify(ledger);
    var applied = [];

    LINKS.forEach(function (link) {
      var own = adapter.get(link);
      if (!validLevel(own)) return;                       // this side cannot see the topic: leave it alone
      var entry = ledger.links[link.id];
      if (!entry || typeof entry !== 'object') entry = ledger.links[link.id] = {};
      var mine = cleanRecord(entry[side]);
      var theirs = cleanRecord(entry[other]);

      if (!mine) {
        // First contact for this side.
        if (!theirs) {
          mine = { level: own, at: 0 };                    // just a baseline, nothing to propagate yet
        } else if (rank(own) > rank(theirs.level)) {
          mine = { level: own, at: now };                  // we hold more progress: the other side should follow
        } else {
          if (own !== theirs.level) { adapter.set(link, theirs.level); applied.push(link); }
          mine = { level: theirs.level, at: theirs.at };
        }
      } else {
        if (own !== mine.level) mine = { level: own, at: now };   // edited here since last time
        if (theirs && theirs.level !== mine.level &&
            (theirs.at > mine.at || (theirs.at === mine.at && rank(theirs.level) > rank(mine.level)))) {
          adapter.set(link, theirs.level);
          applied.push(link);
          mine = { level: theirs.level, at: theirs.at };
        }
      }
      entry[side] = mine;
    });

    var after = JSON.stringify(ledger);
    if (after !== before) store.set(LEDGER_KEY, after);
    return { applied: applied };
  }

  // ---- Browser helpers -------------------------------------------------------------------------
  function browserStore() {
    return {
      get: function (key) { try { return localStorage.getItem(key); } catch (_) { return null; } },
      set: function (key, value) { try { localStorage.setItem(key, value); } catch (_) { /* storage unavailable */ } }
    };
  }
  // Calls handler when another tab or the cloud changes any of the given storage keys.
  function watchExternalChanges(keys, handler) {
    if (typeof window === 'undefined') return;
    window.addEventListener('storage', function (event) {
      if (event.key === null || keys.indexOf(event.key) !== -1) handler();
    });
    window.addEventListener('limitless:cloud-sync-hydrated', handler);
  }
  function linkFor(cpId) {
    for (var i = 0; i < LINKS.length; i++) if (LINKS[i].cp === cpId) return LINKS[i];
    return null;
  }
  function linkForTopic(subject, week) {
    for (var i = 0; i < LINKS.length; i++) if (LINKS[i].subject === subject && LINKS[i].week === week) return LINKS[i];
    return null;
  }

  return {
    LEDGER_KEY: LEDGER_KEY, LEVELS: LEVELS, LINKS: LINKS,
    cpLevel: cpLevel, cpChecksFor: cpChecksFor, reconcile: reconcile,
    browserStore: browserStore, watchExternalChanges: watchExternalChanges,
    linkFor: linkFor, linkForTopic: linkForTopic
  };
});
