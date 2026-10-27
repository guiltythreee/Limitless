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

  var api = { isMastered: isMastered, assessmentValid: assessmentValid };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.MathTrickProgression = api;
})(typeof window !== 'undefined' ? window : globalThis);
