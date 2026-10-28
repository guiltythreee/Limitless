/* Global EXP summary for the Limitless home page. */
(function () {
  'use strict';
  function init() {
    var mount = document.getElementById('global-progress-summary');
    if (!mount || !window.LimitlessRewards) return;

    function element(tag, className, text) {
      var node = document.createElement(tag);
      if (className) node.className = className;
      if (text !== undefined) node.textContent = text;
      return node;
    }
    function render() {
      var summary = window.LimitlessRewards.summary();
      mount.textContent = '';
      var top = element('div', 'global-progress-top');
      var level = element('div', 'global-progress-level', 'Level ' + summary.level);
      var xp = element('div', 'global-progress-xp', summary.xp.toLocaleString() + ' Global EXP');
      top.appendChild(level);
      top.appendChild(xp);
      mount.appendChild(top);
      var bar = element('div', 'global-progress-track');
      bar.setAttribute('role', 'progressbar');
      bar.setAttribute('aria-label', 'Progress to next global level');
      bar.setAttribute('aria-valuemin', '0');
      bar.setAttribute('aria-valuemax', String(summary.xpForNextLevel));
      bar.setAttribute('aria-valuenow', String(summary.xpIntoLevel));
      var fill = element('div', 'global-progress-fill');
      fill.style.width = Math.round(summary.progress * 100) + '%';
      bar.appendChild(fill);
      mount.appendChild(bar);
      mount.appendChild(element('p', 'global-progress-caption',
        summary.xpIntoLevel.toLocaleString() + ' / ' + summary.xpForNextLevel.toLocaleString() +
        ' EXP toward Level ' + (summary.level + 1)));
      if (summary.nextReward) {
        mount.appendChild(element('p', 'global-progress-caption',
          'Next reward · ' + summary.nextReward.name + ' at Level ' + summary.nextReward.level));
      } else {
        mount.appendChild(element('p', 'global-progress-caption', 'All currently defined global rewards unlocked.'));
      }
      var unlocked = summary.unlockedRewards || [];
      if (unlocked.length) {
        mount.appendChild(element('p', 'global-progress-unlocked',
          'Unlocked · ' + unlocked.map(function (reward) { return reward.name; }).join(' · ')));
      }
    }
    render();
    window.addEventListener('limitless:rewards-updated', render);
    window.addEventListener('storage', function (event) {
      if (event.key === window.LimitlessRewards.STORAGE_KEY) render();
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();