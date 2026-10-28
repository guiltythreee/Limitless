/* Pure progression rules for Trick Chamber; shared by the browser app and Node tests. */
(function (root) {
  'use strict';

  function isMastered(record) {
    if (!record || !record.base || !record.post) return false;
    return record.post.acc >= 0.9 &&
      Number.isFinite(record.base.med) && record.base.med > 0 &&
      Number.isFinite(record.post.med) &&
      record.post.med <= record.base.med * 0.8;
  }

  function assessmentValid(phase, count, attempts) {
    if (!Array.isArray(attempts) || !Number.isInteger(count) || count < 1) return false;
    if (phase === 'baseline' || phase === 'post') {
      // A paired measurement is valid only when every question was attempted.
      return attempts.length === count && attempts.every(function (a) {
        return a && a.result !== 'skip';
      });
    }
    if (phase === 'practice') {
      return attempts.filter(function (a) { return a && a.result !== 'skip'; }).length >= Math.ceil(count / 2);
    }
    return false;
  }

  function replaceBaseline(record, stat) {
    var hadBaseline = !!record.base;
    record.base = stat;
    record.post = null;
    record.practiceSinceBaseline = 0;
    return hadBaseline;
  }

  function canTakePostTest(record) {
    if (!record || (!record.base && !record.skipBase)) return false;
    return Number.isInteger(record.practiceSinceBaseline) && record.practiceSinceBaseline > 0;
  }

  function awardFirstMastery(record) {
    if (!isMastered(record) || record.masteryRewarded === true) return false;
    record.masteryRewarded = true;
    return true;
  }

  function migrateMasteryReward(record) {
    if (isMastered(record)) record.masteryRewarded = true;
    return record;
  }

  var api = {
    isMastered: isMastered,
    assessmentValid: assessmentValid,
    replaceBaseline: replaceBaseline,
    canTakePostTest: canTakePostTest,
    awardFirstMastery: awardFirstMastery,
    migrateMasteryReward: migrateMasteryReward
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.MathTrickProgression = api;
})(typeof window !== 'undefined' ? window : globalThis);
