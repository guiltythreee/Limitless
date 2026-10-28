/* Limitless Reward Standard (LSR-1)
 * Shared, local-first global EXP ledger for every Limitless discipline.
 * This file deliberately uses classic-script/ES5 syntax so it can be shared by
 * the static tools and the Next.js Probability app without a build step.
 */
(function attachLimitlessRewards(root, factory) {
  'use strict';
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.LimitlessRewards = api;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this), function createRewardApi() {
  'use strict';

  var VERSION = 'LSR-1';
  var STORAGE_KEY = 'limitless.reward-ledger.v1';
  var BASE_EXP = {
    'micro-practice': 5,
    'standard-task': 10,
    'focused-practice': 20,
    assessment: 25,
    milestone: 50,
    'course-completion': 100
  };
  var DIFFICULTY = { foundational: 1, intermediate: 1.25, advanced: 1.5 };
  var FIRST_PASS_EXP = 15;
  var QUALITY_THRESHOLD = 0.8;
  var MAX_QUALITY_BONUS = 0.2;
  var FULL_REPEATS_PER_DAY = 3;
  var HALF_REPEATS_PER_DAY = 3;

  function finiteNumber(value, fallback) {
    return typeof value === 'number' && isFinite(value) ? value : fallback;
  }
  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }
  function asDayKey(ts) {
    var date = new Date(ts);
    var month = String(date.getMonth() + 1).padStart(2, '0');
    var day = String(date.getDate()).padStart(2, '0');
    return date.getFullYear() + '-' + month + '-' + day;
  }
  function cleanString(value) {
    return typeof value === 'string' ? value.trim() : '';
  }
  function isOneTimeClass(activityClass) {
    return activityClass === 'milestone' || activityClass === 'course-completion';
  }
  function emptyLedger() {
    return { version: 1, standard: VERSION, totalXp: 0, awards: [] };
  }
  function sanitizeLedger(value) {
    var result = emptyLedger();
    if (!value || typeof value !== 'object') return result;
    if (Array.isArray(value.awards)) {
      result.awards = value.awards.filter(function (award) {
        return award && typeof award === 'object' && typeof award.id === 'string' &&
          typeof award.c === 'string' && typeof award.d === 'string' &&
          typeof award.x === 'number' && isFinite(award.x) && award.x >= 0;
      });
    }
    var sum = result.awards.reduce(function (total, award) { return total + award.x; }, 0);
    result.totalXp = Math.max(0, Math.round(finiteNumber(value.totalXp, sum)));
    // An old or partially written record must never make the displayed total
    // lower than the sum of its retained award records.
    result.totalXp = Math.max(result.totalXp, sum);
    return result;
  }

  function levelForXp(value) {
    var xp = Math.max(0, Math.floor(finiteNumber(value, 0)));
    var level = 1;
    var remaining = xp;
    var cost = 100;
    while (remaining >= cost && level < 100000) {
      remaining -= cost;
      level += 1;
      cost = 100 + 25 * (level - 1);
    }
    return {
      level: level,
      xp: xp,
      xpIntoLevel: remaining,
      xpForNextLevel: cost,
      nextLevelAt: xp + (cost - remaining),
      progress: cost > 0 ? clamp(remaining / cost, 0, 1) : 1
    };
  }

  function calculate(input, context) {
    var args = input || {};
    var prior = context || {};
    var activityClass = cleanString(args.activityClass);
    var difficulty = cleanString(args.difficulty || 'foundational');
    var base = BASE_EXP[activityClass];
    var multiplier = DIFFICULTY[difficulty];
    if (typeof base !== 'number') return { ok: false, error: 'unknown-activity-class', xp: 0 };
    if (typeof multiplier !== 'number') return { ok: false, error: 'unknown-difficulty', xp: 0 };

    var quality = typeof args.quality === 'number' && isFinite(args.quality) ? clamp(args.quality, 0, 1) : null;
    var qualityBonus = quality === null ? 0 : base * MAX_QUALITY_BONUS * clamp((quality - QUALITY_THRESHOLD) / (1 - QUALITY_THRESHOLD), 0, 1);
    var repeatMultiplier = typeof prior.repeatMultiplier === 'number' ? prior.repeatMultiplier : 1;
    var firstPassBonus = prior.firstPassBonus ? FIRST_PASS_EXP : 0;
    var rawXp = (base * multiplier + qualityBonus) * repeatMultiplier + firstPassBonus;
    return {
      ok: true,
      version: VERSION,
      baseExp: base,
      difficulty: difficulty,
      difficultyMultiplier: multiplier,
      quality: quality,
      qualityBonus: qualityBonus,
      repeatMultiplier: repeatMultiplier,
      firstPassBonus: firstPassBonus,
      xp: Math.max(0, Math.round(rawXp))
    };
  }

  function createLedger(storage, clock, notify) {
    var now = typeof clock === 'function' ? clock : Date.now;
    var signal = typeof notify === 'function' ? notify : function () {};

    function read() {
      if (!storage || typeof storage.getItem !== 'function') return emptyLedger();
      try {
        var raw = storage.getItem(STORAGE_KEY);
        return raw ? sanitizeLedger(JSON.parse(raw)) : emptyLedger();
      } catch (error) {
        throw error;
      }
    }

    function summary() {
      try {
        var ledger = read();
        var level = levelForXp(ledger.totalXp);
        var counts = {};
        ledger.awards.forEach(function (award) {
          if (award.x > 0) counts[award.m || 'unknown'] = (counts[award.m || 'unknown'] || 0) + 1;
        });
        return {
          standard: VERSION,
          xp: ledger.totalXp,
          level: level.level,
          xpIntoLevel: level.xpIntoLevel,
          xpForNextLevel: level.xpForNextLevel,
          nextLevelAt: level.nextLevelAt,
          progress: level.progress,
          awardCount: ledger.awards.length,
          countsByModule: counts
        };
      } catch (error) {
        return {
          standard: VERSION, xp: 0, level: 1, xpIntoLevel: 0,
          xpForNextLevel: 100, nextLevelAt: 100, progress: 0,
          awardCount: 0, countsByModule: {}, available: false
        };
      }
    }

    function record(input) {
      var args = input || {};
      var eventId = cleanString(args.eventId);
      var moduleId = cleanString(args.module);
      var contentKey = cleanString(args.contentKey);
      var activityClass = cleanString(args.activityClass);
      var difficulty = cleanString(args.difficulty || 'foundational');
      if (!eventId || !moduleId || !contentKey) return { ok: false, xp: 0, error: 'missing-event-module-or-content-key' };
      if (typeof BASE_EXP[activityClass] !== 'number') return { ok: false, xp: 0, error: 'unknown-activity-class' };
      if (typeof DIFFICULTY[difficulty] !== 'number') return { ok: false, xp: 0, error: 'unknown-difficulty' };

      try {
        var ledger = read();
        var existing = ledger.awards.find(function (award) { return award.id === eventId; });
        if (existing) {
          var existingSummary = summary();
          return { ok: true, duplicate: true, xp: existing.x, totalXp: existingSummary.xp, level: existingSummary.level };
        }

        var ts = Math.max(0, Math.floor(finiteNumber(now(), Date.now())));
        var day = asDayKey(ts);
        var oneTimeKey = cleanString(args.oneTimeKey || '');
        var passKey = cleanString(args.passKey || '');
        var alreadyOneTime = isOneTimeClass(activityClass) && oneTimeKey && ledger.awards.some(function (award) {
          return award.o === oneTimeKey && award.x > 0;
        });
        var alreadyPassed = !!(args.passed && passKey && ledger.awards.some(function (award) {
          return award.p === passKey;
        }));
        var firstPass = !!(args.passed && passKey && !alreadyPassed);
        var repeatMultiplier = 1;
        if (!isOneTimeClass(activityClass)) {
          var sameDayCount = ledger.awards.filter(function (award) {
            return award.c === contentKey && award.d === day && !isOneTimeClass(award.a);
          }).length;
          if (sameDayCount >= FULL_REPEATS_PER_DAY + HALF_REPEATS_PER_DAY) repeatMultiplier = 0;
          else if (sameDayCount >= FULL_REPEATS_PER_DAY) repeatMultiplier = 0.5;
        }

        var breakdown = calculate(args, {
          repeatMultiplier: repeatMultiplier,
          firstPassBonus: firstPass
        });
        if (!breakdown.ok) return breakdown;
        if (alreadyOneTime) {
          breakdown.xp = 0;
          breakdown.oneTimeAlreadyAwarded = true;
        }
        var award = {
          id: eventId,
          m: moduleId,
          c: contentKey,
          a: activityClass,
          d: day,
          t: ts,
          x: breakdown.xp,
          r: breakdown.repeatMultiplier,
          v: VERSION
        };
        if (oneTimeKey && breakdown.xp > 0 && isOneTimeClass(activityClass)) award.o = oneTimeKey;
        if (firstPass && breakdown.xp > 0) award.p = passKey;
        ledger.awards.push(award);
        ledger.totalXp += breakdown.xp;
        if (!storage || typeof storage.setItem !== 'function') return { ok: false, xp: 0, error: 'storage-unavailable' };
        storage.setItem(STORAGE_KEY, JSON.stringify(ledger));
        signal();
        var fresh = summary();
        return {
          ok: true,
          duplicate: false,
          xp: breakdown.xp,
          totalXp: fresh.xp,
          level: fresh.level,
          breakdown: breakdown,
          oneTimeAlreadyAwarded: !!breakdown.oneTimeAlreadyAwarded
        };
      } catch (error) {
        return { ok: false, xp: 0, error: 'storage-unavailable' };
      }
    }

    function exportLedger() {
      return read();
    }

    return { record: record, summary: summary, read: exportLedger };
  }

  var browserStorage = {
    getItem: function (key) {
      try { return typeof window !== 'undefined' ? window.localStorage.getItem(key) : null; }
      catch (error) { throw error; }
    },
    setItem: function (key, value) {
      if (typeof window === 'undefined') throw new Error('No browser storage');
      window.localStorage.setItem(key, value);
    }
  };
  var defaultLedger = createLedger(browserStorage, Date.now, function () {
    try {
      if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function' && typeof window.CustomEvent === 'function') {
        window.dispatchEvent(new window.CustomEvent('limitless:rewards-updated'));
      }
    } catch (error) { /* The ledger is already saved; UI notification is optional. */ }
  });

  return {
    VERSION: VERSION,
    STORAGE_KEY: STORAGE_KEY,
    BASE_EXP: BASE_EXP,
    DIFFICULTY: DIFFICULTY,
    FIRST_PASS_EXP: FIRST_PASS_EXP,
    calculateAward: function (input) { return calculate(input, {}); },
    levelForXp: levelForXp,
    createLedger: createLedger,
    record: defaultLedger.record,
    summary: defaultLedger.summary,
    read: defaultLedger.read
  };
});