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
  var PROJECT_EXP_MIN = 20;
  var PROJECT_EXP_MAX = 100;
  // Fixed module namespaces keep the self-service project form from minting
  // duplicate projects under arbitrary module names.
  var PROJECT_MODULES = {
    'bookkeys': true,
    'math-trainer': true,
    'probability': true,
    'metallurgy': true,
    'personal-projects': true
  };
  var EVIDENCE_TYPES = {
    'submitted-answer': true,
    'completed-session': true,
    'typed-page': true,
    'scored-assessment': true,
    'topic-mastery': true,
    'unit-mastery': true,
    'milestone-complete': true,
    'pathway-complete': true,
    'project-complete': true
  };
  // Level 5 unlocks are modest; each multiple of 10 is a larger universal reward.
  var REWARD_UNLOCKS = [
    { level: 2, id: 'first-light', name: 'First Light', kind: 'title', description: 'Your first global level-up.' },
    { level: 5, id: 'scholars-mark', name: "Scholar's Mark", kind: 'emblem', description: 'A mark earned through steady cross-discipline learning.' },
    { level: 10, id: 'polymath', name: 'Polymath', kind: 'title', description: 'A profile title for learning across disciplines.' },
    { level: 10, id: 'polymath-glow', name: 'Polymath Glow', kind: 'profile-effect', description: 'A luminous profile treatment for broad learning.' },
    { level: 15, id: 'wayfinder', name: 'Wayfinder', kind: 'emblem', description: 'A milestone for continuing beyond the early levels.' },
    { level: 20, id: 'keeper-of-knowledge', name: 'Keeper of Knowledge', kind: 'title', description: 'A long-term commitment to learning across fields.' },
    { level: 20, id: 'radiant-archive', name: 'Radiant Archive', kind: 'profile-effect', description: 'A stronger light effect for sustained study.' },
    { level: 25, id: 'luminous-archive', name: 'Luminous Archive', kind: 'emblem', description: 'A rare emblem for sustained progression.' },
    { level: 30, id: 'limitless-sigil', name: 'Limitless Sigil', kind: 'emblem', description: 'A rare mark for sustained global progression.' },
    { level: 30, id: 'limitless-aura', name: 'Limitless Aura', kind: 'profile-effect', description: 'The highest currently defined global profile effect.' }
  ];

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
  function isKnownActivityClass(activityClass) {
    return typeof BASE_EXP[activityClass] === 'number' || activityClass === 'bespoke-project';
  }
  function isOneTimeClass(activityClass) {
    return activityClass === 'milestone' || activityClass === 'course-completion' || activityClass === 'bespoke-project';
  }
  function isCountableActivityAward(award) {
    return !!(award && (typeof BASE_EXP[award.a] === 'number' ||
      (award.a === 'bespoke-project' && typeof award.baseExp === 'number' &&
       award.baseExp >= PROJECT_EXP_MIN && award.baseExp <= PROJECT_EXP_MAX)));
  }
  function projectBaseIsValid(value) {
    return typeof value === 'number' && isFinite(value) && Math.floor(value) === value &&
      value >= PROJECT_EXP_MIN && value <= PROJECT_EXP_MAX;
  }
  function evidenceFitsActivity(activityClass, evidence) {
    var allowed = {
      'micro-practice': { 'submitted-answer': true },
      'standard-task': { 'typed-page': true, 'completed-session': true, 'submitted-answer': true },
      'focused-practice': { 'completed-session': true },
      assessment: { 'scored-assessment': true },
      milestone: { 'topic-mastery': true, 'unit-mastery': true, 'milestone-complete': true },
      'course-completion': { 'pathway-complete': true },
      'bespoke-project': { 'project-complete': true }
    };
    return !!(allowed[activityClass] && allowed[activityClass][evidence]);
  }
  function emptyLedger() {
    return {
      version: 1, standard: VERSION, totalXp: 0, awards: [], projects: [],
      equippedTitleId: '', equippedEmblemId: '', equippedProfileEffectId: ''
    };
  }
  function sanitizeLedger(value) {
    var result = emptyLedger();
    if (!value || typeof value !== 'object') return result;
    var seenIds = Object.create(null);
    if (Array.isArray(value.awards)) {
      result.awards = value.awards.filter(function (award) {
        if (!award || typeof award !== 'object' || typeof award.id !== 'string' ||
            typeof award.c !== 'string' || typeof award.d !== 'string' ||
            typeof award.x !== 'number' || !isFinite(award.x) || award.x < 0 ||
            seenIds[award.id]) return false;
        seenIds[award.id] = true;
        return true;
      }).map(function (award) {
        // Keep pre-revision LSR-1 records visible and explain them explicitly,
        // rather than dropping historical EXP whose new evidence fields are absent.
        var normalized = Object.assign({}, award);
        normalized.m = cleanString(award.m || '') || 'unknown';
        normalized.a = cleanString(award.a || '') || 'legacy-record';
        normalized.e = cleanString(award.e || '') || 'legacy-record';
        normalized.v = cleanString(award.v || '') || VERSION;
        normalized.t = Math.max(0, Math.floor(finiteNumber(award.t, 0)));
        normalized.x = Math.max(0, Math.round(award.x));
        normalized.reason = cleanString(award.reason || '') || (normalized.e === 'legacy-record'
          ? 'Legacy award retained from an earlier LSR-1 build; the original completion-evidence breakdown is unavailable'
          : '');
        return normalized;
      });
    }
    // Award history is authoritative. Never trust a parallel cached running
    // total: a torn/old write must not create EXP with no explainable award.
    result.totalXp = result.awards.reduce(function (total, award) { return total + award.x; }, 0);
    var seenProjects = Object.create(null);
    if (Array.isArray(value.projects)) {
      result.projects = value.projects.filter(function (project) {
        if (!project || typeof project !== 'object' || !cleanString(project.id) || !cleanString(project.m) ||
            !projectBaseIsValid(project.baseExp) || !cleanString(project.title) ||
            !cleanString(project.scope) || !cleanString(project.criteria)) return false;
        var key = project.m + ':' + project.id;
        if (seenProjects[key]) return false;
        seenProjects[key] = true;
        return true;
      }).map(function (project) {
        return {
          id: cleanString(project.id), m: cleanString(project.m),
          baseExp: project.baseExp, title: cleanString(project.title),
          scope: cleanString(project.scope), criteria: cleanString(project.criteria),
          registeredAt: Math.max(0, Math.floor(finiteNumber(project.registeredAt, 0))),
          v: cleanString(project.v || '') || VERSION
        };
      });
    }
    result.equippedTitleId = cleanString(value.equippedTitleId || '');
    result.equippedEmblemId = cleanString(value.equippedEmblemId || '');
    result.equippedProfileEffectId = cleanString(value.equippedProfileEffectId || '');
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

  function unlocksForLevel(value) {
    var level = Math.max(1, Math.floor(finiteNumber(value, 1)));
    return REWARD_UNLOCKS.filter(function (reward) { return reward.level <= level; }).map(function (reward) {
      return { level: reward.level, id: reward.id, name: reward.name, kind: reward.kind, description: reward.description };
    });
  }
  function nextUnlockForLevel(value) {
    var level = Math.max(1, Math.floor(finiteNumber(value, 1)));
    var reward = REWARD_UNLOCKS.find(function (item) { return item.level > level; });
    return reward ? { level: reward.level, id: reward.id, name: reward.name, kind: reward.kind, description: reward.description } : null;
  }

  function calculate(input, context) {
    var args = input || {};
    var prior = context || {};
    var activityClass = cleanString(args.activityClass);
    var difficulty = cleanString(args.difficulty || 'foundational');
    var base = BASE_EXP[activityClass];
    if (activityClass === 'bespoke-project') {
      base = args.projectBaseExp;
      if (!projectBaseIsValid(base)) return { ok: false, error: 'invalid-project-base-exp', xp: 0 };
    }
    var multiplier = DIFFICULTY[difficulty];
    if (!isKnownActivityClass(activityClass)) return { ok: false, error: 'unknown-activity-class', xp: 0 };
    if (typeof base !== 'number') return { ok: false, error: 'invalid-project-base-exp', xp: 0 };
    if (typeof multiplier !== 'number') return { ok: false, error: 'unknown-difficulty', xp: 0 };

    var quality = typeof args.quality === 'number' && isFinite(args.quality) ? clamp(args.quality, 0, 1) : null;
    var qualityBonus = quality === null ? 0 : base * MAX_QUALITY_BONUS * clamp((quality - QUALITY_THRESHOLD) / (1 - QUALITY_THRESHOLD), 0, 1);
    var repeatMultiplier = typeof prior.repeatMultiplier === 'number' ? prior.repeatMultiplier : 1;
    var firstPassBonus = prior.firstPassBonus ? FIRST_PASS_EXP : 0;
    // The ordinary activity and its one-time pass bonus are persisted as two
    // unique award records. Keeping the calculator's activity XP separate
    // makes each line in the ledger independently explainable.
    var rawXp = (base * multiplier + qualityBonus) * repeatMultiplier;
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
        var xpByModule = {};
        var achievements = [];
        ledger.awards.forEach(function (award) {
          var moduleId = award.m || 'unknown';
          xpByModule[moduleId] = (xpByModule[moduleId] || 0) + award.x;
          if (award.x > 0 && isCountableActivityAward(award)) counts[moduleId] = (counts[moduleId] || 0) + 1;
          if (award.x > 0 && (award.a === 'milestone' || award.a === 'course-completion' || award.a === 'bespoke-project')) {
            achievements.push({
              id: award.o || award.id,
              module: moduleId,
              projectId: award.projectId || undefined,
              contentKey: award.c,
              activityClass: award.a,
              evidence: award.e || 'legacy-record',
              xp: award.x,
              timestamp: award.t || 0,
              reason: cleanString(award.reason || '')
            });
          }
        });
        achievements.reverse();
        var equippedTitle = null, equippedEmblem = null, equippedProfileEffect = null;
        var earnedUnlocks = unlocksForLevel(level.level);
        earnedUnlocks.forEach(function (reward) {
          if (reward.kind === 'title' && reward.id === ledger.equippedTitleId) equippedTitle = reward;
          if (reward.kind === 'emblem' && reward.id === ledger.equippedEmblemId) equippedEmblem = reward;
          if (reward.kind === 'profile-effect' && reward.id === ledger.equippedProfileEffectId) equippedProfileEffect = reward;
        });
        return {
          standard: VERSION,
          xp: ledger.totalXp,
          registeredProjects: ledger.projects.map(function (project) {
            return { id: project.id, module: project.m, baseExp: project.baseExp, title: project.title, scope: project.scope, criteria: project.criteria, registeredAt: project.registeredAt, version: project.v };
          }),
          level: level.level,
          xpIntoLevel: level.xpIntoLevel,
          xpForNextLevel: level.xpForNextLevel,
          nextLevelAt: level.nextLevelAt,
          progress: level.progress,
          awardCount: ledger.awards.length,
          countsByModule: counts,
          xpByModule: xpByModule,
          disciplineAchievements: achievements,
          equippedTitle: equippedTitle,
          equippedEmblem: equippedEmblem,
          equippedProfileEffect: equippedProfileEffect,
          recentAwards: ledger.awards.slice(-8).reverse().map(function (award) {
            return {
              id: award.id, module: award.m, contentKey: award.c,
              projectId: award.projectId || undefined,
              projectTitle: award.projectTitle || undefined,
              activityClass: award.a, evidence: award.e,
              difficulty: award.difficulty || 'foundational',
              baseExp: finiteNumber(award.baseExp, 0),
              difficultyMultiplier: finiteNumber(award.difficultyMultiplier, 1),
              quality: typeof award.quality === 'number' ? award.quality : null,
              qualityBonus: finiteNumber(award.qualityBonus, 0),
              repeatMultiplier: finiteNumber(award.repeatMultiplier, 1),
              xp: award.x, timestamp: finiteNumber(award.t, 0), version: award.v,
              reason: cleanString(award.reason || ''),
              bonusType: award.bonusType || null
            };
          }),
          unlockedRewards: unlocksForLevel(level.level),
          nextReward: nextUnlockForLevel(level.level)
        };
      } catch (error) {
        return {
          standard: VERSION, xp: 0, level: 1, xpIntoLevel: 0,
          xpForNextLevel: 100, nextLevelAt: 100, progress: 0,
          awardCount: 0, countsByModule: {}, xpByModule: {}, disciplineAchievements: [], registeredProjects: [], equippedTitle: null, equippedEmblem: null, equippedProfileEffect: null, recentAwards: [], unlockedRewards: [], nextReward: nextUnlockForLevel(1), available: false
        };
      }
    }

    function registerProject(input) {
      var args = input || {};
      var moduleId = cleanString(args.module);
      var projectId = cleanString(args.projectId);
      var title = cleanString(args.title);
      var scope = cleanString(args.scope);
      var criteria = cleanString(args.criteria);
      var baseExp = args.baseExp;
      if (!moduleId || !projectId || !title || !scope || !criteria) return { ok: false, error: 'missing-project-definition-field' };
      if (!PROJECT_MODULES[moduleId]) return { ok: false, error: 'unsupported-project-module' };
      if (!/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,127}$/.test(projectId)) return { ok: false, error: 'invalid-project-id' };
      if (moduleId.length > 64 || projectId.length > 128 || title.length > 160 || scope.length > 500 || criteria.length > 1000) {
        return { ok: false, error: 'project-definition-field-too-long' };
      }
      if (!projectBaseIsValid(baseExp)) return { ok: false, error: 'invalid-project-base-exp' };
      try {
        var ledger = read();
        var existing = ledger.projects.find(function (project) {
          return project.m === moduleId && project.id === projectId;
        });
        if (existing) {
          var sameDefinition = existing.baseExp === baseExp && existing.title === title &&
            existing.scope === scope && existing.criteria === criteria;
          var existingView = {
            id: existing.id, module: existing.m, baseExp: existing.baseExp,
            title: existing.title, scope: existing.scope, criteria: existing.criteria,
            registeredAt: existing.registeredAt, version: existing.v
          };
          return sameDefinition
            ? { ok: true, duplicate: true, project: existingView }
            : { ok: false, error: 'project-definition-immutable', project: existingView };
        }
        var project = {
          id: projectId, m: moduleId, baseExp: baseExp,
          title: title, scope: scope, criteria: criteria,
          registeredAt: Math.max(0, Math.floor(finiteNumber(now(), Date.now()))),
          v: VERSION
        };
        ledger.projects.push(project);
        ledger.totalXp = ledger.awards.reduce(function (total, award) { return total + award.x; }, 0);
        if (!storage || typeof storage.setItem !== 'function') return { ok: false, error: 'storage-unavailable' };
        storage.setItem(STORAGE_KEY, JSON.stringify(ledger));
        signal({ type: 'project-registered', module: moduleId, projectId: projectId });
        return {
          ok: true,
          duplicate: false,
          project: {
            id: project.id, module: project.m, baseExp: project.baseExp,
            title: project.title, scope: project.scope, criteria: project.criteria,
            registeredAt: project.registeredAt, version: project.v
          }
        };
      } catch (error) {
        return { ok: false, error: 'storage-unavailable' };
      }
    }

    function record(input) {
      var args = Object.assign({}, input || {});
      var eventId = cleanString(args.eventId);
      var moduleId = cleanString(args.module);
      var contentKey = cleanString(args.contentKey);
      var activityClass = cleanString(args.activityClass);
      var difficulty = cleanString(args.difficulty || 'foundational');
      var evidence = cleanString(args.evidence);
      var oneTimeKey = cleanString(args.oneTimeKey || '');
      var passKey = cleanString(args.passKey || '');
      if (!eventId || !moduleId || !contentKey) return { ok: false, xp: 0, error: 'missing-event-module-or-content-key' };
      if (eventId.length > 256 || moduleId.length > 64 || contentKey.length > 256) return { ok: false, xp: 0, error: 'identifier-too-long' };
      if (!isKnownActivityClass(activityClass)) return { ok: false, xp: 0, error: 'unknown-activity-class' };
      if (typeof DIFFICULTY[difficulty] !== 'number') return { ok: false, xp: 0, error: 'unknown-difficulty' };
      if (!EVIDENCE_TYPES[evidence]) return { ok: false, xp: 0, error: 'missing-or-unknown-completion-evidence' };
      if (!evidenceFitsActivity(activityClass, evidence)) return { ok: false, xp: 0, error: 'completion-evidence-does-not-fit-activity' };
      if (isOneTimeClass(activityClass) && !oneTimeKey) return { ok: false, xp: 0, error: 'missing-one-time-key' };
      if (args.passed && (activityClass !== 'assessment' || !passKey)) return { ok: false, xp: 0, error: 'passed-assessment-needs-pass-key' };

      try {
        var ledger = read();
        var registeredProject = null;
        if (activityClass === 'bespoke-project') {
          var projectId = cleanString(args.projectId);
          registeredProject = ledger.projects.find(function (project) {
            return project.m === moduleId && project.id === projectId;
          });
          if (!registeredProject) return { ok: false, xp: 0, error: 'unregistered-project' };
          var canonicalProjectKey = moduleId + ':' + registeredProject.id;
          if (eventId !== 'project-completion:' + canonicalProjectKey ||
              contentKey !== 'project:' + canonicalProjectKey ||
              oneTimeKey !== 'project-completion:' + canonicalProjectKey) {
            return { ok: false, xp: 0, error: 'invalid-project-event-key' };
          }
          if (Math.max(0, Math.floor(finiteNumber(now(), Date.now()))) < registeredProject.registeredAt) {
            return { ok: false, xp: 0, error: 'project-completion-predates-registration' };
          }
          args.projectBaseExp = registeredProject.baseExp;
          args.reason = 'Completed registered project: ' + registeredProject.title + ' · ' + registeredProject.criteria;
        }
        var existing = ledger.awards.find(function (award) { return award.id === eventId; });
        if (existing) {
          var existingSummary = summary();
          var priorPassBonus = existing.passKey ? ledger.awards.find(function (award) {
            return award.id === 'first-pass:' + existing.passKey;
          }) : null;
          return {
            ok: true, duplicate: true,
            xp: existing.x + (priorPassBonus ? priorPassBonus.x : 0),
            totalXp: existingSummary.xp, level: existingSummary.level
          };
        }

        var totalBefore = ledger.totalXp;
        var levelBefore = levelForXp(totalBefore).level;
        var ts = Math.max(0, Math.floor(finiteNumber(now(), Date.now())));
        var day = asDayKey(ts);
        var alreadyOneTime = isOneTimeClass(activityClass) && ledger.awards.some(function (award) {
          return award.o === oneTimeKey && award.x > 0;
        });
        var alreadyPassed = !!(args.passed && passKey && ledger.awards.some(function (award) {
          return award.id === 'first-pass:' + passKey || award.p === passKey;
        }));
        var firstPass = !!(args.passed && passKey && !alreadyPassed);
        var repeatMultiplier = 1;
        if (!isOneTimeClass(activityClass)) {
          var sameDayCount = ledger.awards.filter(function (award) {
            return award.c === contentKey && award.d === day && isCountableActivityAward(award);
          }).length;
          if (sameDayCount >= FULL_REPEATS_PER_DAY + HALF_REPEATS_PER_DAY) repeatMultiplier = 0;
          else if (sameDayCount >= FULL_REPEATS_PER_DAY) repeatMultiplier = 0.5;
        }

        var breakdown = calculate(args, { repeatMultiplier: repeatMultiplier, firstPassBonus: firstPass });
        if (!breakdown.ok) return breakdown;
        if (alreadyOneTime) {
          breakdown.xp = 0;
          breakdown.oneTimeAlreadyAwarded = true;
        }
        var activityAward = {
          id: eventId,
          m: moduleId,
          c: contentKey,
          a: activityClass,
          e: evidence,
          d: day,
          t: ts,
          x: breakdown.xp,
          r: breakdown.repeatMultiplier,
          v: VERSION,
          difficulty: difficulty,
          baseExp: breakdown.baseExp,
          difficultyMultiplier: breakdown.difficultyMultiplier,
          quality: breakdown.quality,
          qualityBonus: breakdown.qualityBonus,
          repeatMultiplier: breakdown.repeatMultiplier,
          reason: cleanString(args.reason || ''),
          passed: !!args.passed
        };
        if (registeredProject) {
          activityAward.projectId = registeredProject.id;
          activityAward.projectTitle = registeredProject.title;
          activityAward.projectScope = registeredProject.scope;
          activityAward.projectCriteria = registeredProject.criteria;
        }
        if (oneTimeKey && breakdown.xp > 0 && isOneTimeClass(activityClass)) activityAward.o = oneTimeKey;
        if (args.passed && passKey) activityAward.passKey = passKey;
        ledger.awards.push(activityAward);

        var passXp = 0;
        if (firstPass && !alreadyOneTime) {
          passXp = FIRST_PASS_EXP;
          ledger.awards.push({
            id: 'first-pass:' + passKey,
            m: moduleId,
            c: contentKey,
            a: 'first-pass-bonus',
            e: 'first-pass',
            d: day,
            t: ts,
            x: passXp,
            r: 1,
            v: VERSION,
            difficulty: difficulty,
            baseExp: 0,
            difficultyMultiplier: 1,
            quality: null,
            qualityBonus: 0,
            repeatMultiplier: 1,
            bonusType: 'first-pass',
            p: passKey,
            reason: 'First successful pass of ' + contentKey
          });
        }
        breakdown.firstPassBonus = passXp;
        ledger.totalXp = ledger.awards.reduce(function (total, award) { return total + award.x; }, 0);
        if (!storage || typeof storage.setItem !== 'function') return { ok: false, xp: 0, error: 'storage-unavailable' };
        storage.setItem(STORAGE_KEY, JSON.stringify(ledger));
        var fresh = summary();
        var awardedXp = breakdown.xp + passXp;
        var levelsCrossed = [];
        for (var nextLevel = levelBefore + 1; nextLevel <= fresh.level; nextLevel++) levelsCrossed.push(nextLevel);
        signal({
          type: 'award',
          module: moduleId,
          xpGained: awardedXp,
          levelBefore: levelBefore,
          levelAfter: fresh.level,
          levelUp: fresh.level > levelBefore,
          levelsCrossed: levelsCrossed,
          eventId: eventId,
          reason: cleanString(args.reason || ''),
          awardsCreated: 1 + (passXp > 0 ? 1 : 0)
        });
        return {
          ok: true,
          duplicate: false,
          xp: awardedXp,
          totalXp: fresh.xp,
          level: fresh.level,
          breakdown: breakdown,
          oneTimeAlreadyAwarded: !!breakdown.oneTimeAlreadyAwarded
        };
      } catch (error) {
        return { ok: false, xp: 0, error: 'storage-unavailable' };
      }
    }

    function recordMany(inputs) {
      if (!Array.isArray(inputs) || !inputs.length) return [];
      var stagedLedger;
      try { stagedLedger = read(); }
      catch (error) { return inputs.map(function () { return { ok: false, xp: 0, error: 'storage-unavailable' }; }); }
      var totalBefore = stagedLedger.totalXp;
      var levelBefore = levelForXp(totalBefore).level;
      var stagedStorage = {
        getItem: function (key) { return key === STORAGE_KEY ? JSON.stringify(stagedLedger) : null; },
        setItem: function (key, value) {
          if (key === STORAGE_KEY) stagedLedger = sanitizeLedger(JSON.parse(value));
        }
      };
      var staged = createLedger(stagedStorage, now, function () {});
      var receipts = inputs.map(function (input) { return staged.record(input); });
      var changed = receipts.some(function (receipt) { return receipt.ok && !receipt.duplicate; });
      if (changed) {
        if (!storage || typeof storage.setItem !== 'function') {
          return receipts.map(function (receipt) { return receipt.ok && !receipt.duplicate ? { ok: false, xp: 0, error: 'storage-unavailable' } : receipt; });
        }
        try { storage.setItem(STORAGE_KEY, JSON.stringify(stagedLedger)); }
        catch (error) {
          return receipts.map(function (receipt) { return receipt.ok && !receipt.duplicate ? { ok: false, xp: 0, error: 'storage-unavailable' } : receipt; });
        }
        var xpGained = receipts.reduce(function (sum, receipt) {
          return sum + (receipt && receipt.ok && !receipt.duplicate ? receipt.xp : 0);
        }, 0);
        var finalSummary = summary();
        var levelsCrossed = [];
        for (var nextLevel = levelBefore + 1; nextLevel <= finalSummary.level; nextLevel++) levelsCrossed.push(nextLevel);
        signal({
          type: 'award',
          module: inputs.length === 1 ? cleanString(inputs[0] && inputs[0].module) : 'multiple',
          xpGained: xpGained,
          levelBefore: levelBefore,
          levelAfter: finalSummary.level,
          levelUp: finalSummary.level > levelBefore,
          levelsCrossed: levelsCrossed,
          awardsCreated: receipts.filter(function (receipt) { return receipt && receipt.ok && !receipt.duplicate; }).length
        });
      }
      var finalLevel = levelForXp(stagedLedger.totalXp);
      return receipts.map(function (receipt) {
        return receipt.ok ? Object.assign({}, receipt, { totalXp: stagedLedger.totalXp, level: finalLevel.level }) : receipt;
      });
    }

    function exportLedger() {
      return read();
    }

    function equipReward(rewardId, kind) {
      var id = cleanString(rewardId);
      if (kind !== 'title' && kind !== 'emblem' && kind !== 'profile-effect') return { ok: false, error: 'unknown-reward-kind' };
      try {
        var ledger = read();
        if (!id) {
          if (kind === 'title') ledger.equippedTitleId = '';
          else if (kind === 'emblem') ledger.equippedEmblemId = '';
          else ledger.equippedProfileEffectId = '';
          storage.setItem(STORAGE_KEY, JSON.stringify(ledger));
          signal({ type: 'equipment-changed', rewardId: '', kind: kind });
          return { ok: true, summary: summary() };
        }
        var level = levelForXp(ledger.totalXp).level;
        var reward = REWARD_UNLOCKS.find(function (item) {
          return item.id === id && item.kind === kind && item.level <= level;
        });
        if (!reward) return { ok: false, error: 'reward-not-unlocked' };
        if (kind === 'title') ledger.equippedTitleId = id;
        else if (kind === 'emblem') ledger.equippedEmblemId = id;
        else ledger.equippedProfileEffectId = id;
        storage.setItem(STORAGE_KEY, JSON.stringify(ledger));
        signal({ type: 'equipment-changed', rewardId: id, kind: kind });
        return { ok: true, summary: summary() };
      } catch (error) {
        return { ok: false, error: 'storage-unavailable' };
      }
    }

    return { registerProject: registerProject, record: record, recordMany: recordMany, summary: summary, read: exportLedger, equipReward: equipReward };
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
  var defaultLedger = createLedger(browserStorage, Date.now, function (detail) {
    try {
      if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function' && typeof window.CustomEvent === 'function') {
        window.dispatchEvent(new window.CustomEvent('limitless:rewards-updated', { detail: detail || {} }));
      }
    } catch (error) { /* The ledger is already saved; UI notification is optional. */ }
  });

  return {
    VERSION: VERSION,
    STORAGE_KEY: STORAGE_KEY,
    BASE_EXP: BASE_EXP,
    PROJECT_EXP_RANGE: { min: PROJECT_EXP_MIN, max: PROJECT_EXP_MAX },
    DIFFICULTY: DIFFICULTY,
    EVIDENCE_TYPES: Object.keys(EVIDENCE_TYPES),
    FIRST_PASS_EXP: FIRST_PASS_EXP,
    REWARD_UNLOCKS: REWARD_UNLOCKS.map(function (reward) { return Object.assign({}, reward); }),
    unlocksForLevel: unlocksForLevel,
    nextUnlockForLevel: nextUnlockForLevel,
    calculateAward: function (input) { return calculate(input, {}); },
    levelForXp: levelForXp,
    createLedger: createLedger,
    record: defaultLedger.record,
    recordMany: defaultLedger.recordMany,
    equipReward: defaultLedger.equipReward,
    summary: defaultLedger.summary,
    read: defaultLedger.read
  };
});