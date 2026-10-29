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
      mount.classList.remove('global-effect-polymath-glow', 'global-effect-radiant-archive', 'global-effect-limitless-aura');
      if (summary.equippedProfileEffect) mount.classList.add('global-effect-' + summary.equippedProfileEffect.id);
      mount.textContent = '';
      var top = element('div', 'global-progress-top');
      var level = element('div', 'global-progress-level', 'Level ' + summary.level);
      var xp = element('div', 'global-progress-xp', summary.xp.toLocaleString() + ' Global EXP');
      top.appendChild(level);
      top.appendChild(xp);
      mount.appendChild(top);
      var identity = [];
      if (summary.equippedTitle) identity.push('Title · ' + summary.equippedTitle.name);
      if (summary.equippedEmblem) identity.push('Emblem · ' + summary.equippedEmblem.name);
      if (summary.equippedProfileEffect) identity.push('Effect · ' + summary.equippedProfileEffect.name);
      if (identity.length) mount.appendChild(element('p', 'global-progress-identity', identity.join(' · ')));
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

      var loadout = element('div', 'global-progress-loadout');
      loadout.appendChild(element('div', 'global-progress-history-heading', 'Equip your global rewards'));
      function addEquipmentSelector(kind, label, active) {
        var choices = unlocked.filter(function (reward) { return reward.kind === kind; });
        var row = element('label', 'global-progress-equipment');
        row.appendChild(element('span', 'global-progress-equipment-label', label));
        var select = element('select', 'global-progress-select');
        select.setAttribute('aria-label', label);
        var none = element('option', '', 'None equipped');
        none.value = '';
        select.appendChild(none);
        choices.forEach(function (reward) {
          var option = element('option', '', reward.name + ' · Level ' + reward.level);
          option.value = reward.id;
          select.appendChild(option);
        });
        select.value = active ? active.id : '';
        select.disabled = choices.length === 0;
        select.addEventListener('change', function () {
          var receipt = window.LimitlessRewards.equipReward(select.value, kind);
          if (!receipt || !receipt.ok) {
            select.value = active ? active.id : '';
            return;
          }
          render();
        });
        row.appendChild(select);
        loadout.appendChild(row);
      }
      addEquipmentSelector('title', 'Title', summary.equippedTitle);
      addEquipmentSelector('emblem', 'Emblem', summary.equippedEmblem);
      addEquipmentSelector('profile-effect', 'Profile effect', summary.equippedProfileEffect);
      mount.appendChild(loadout);

      var moduleTotals = summary.xpByModule || {};
      var moduleEntries = Object.keys(moduleTotals).map(function (module) {
        return { module: module, xp: moduleTotals[module] };
      }).sort(function (a, b) { return b.xp - a.xp; });
      if (moduleEntries.length) {
        var breakdown = element('div', 'global-progress-breakdown');
        breakdown.appendChild(element('div', 'global-progress-history-heading', 'EXP by discipline'));
        moduleEntries.forEach(function (entry) {
          var row = element('div', 'global-progress-module-row');
          row.appendChild(element('span', 'global-progress-module-name', entry.module.replace(/-/g, ' ')));
          row.appendChild(element('strong', 'global-progress-module-xp', entry.xp.toLocaleString() + ' EXP'));
          breakdown.appendChild(row);
        });
        mount.appendChild(breakdown);
      }

      var achievements = summary.disciplineAchievements || [];
      if (achievements.length) {
        var achievementBox = element('div', 'global-progress-achievements');
        achievementBox.appendChild(element('div', 'global-progress-history-heading', 'Discipline achievements'));
        achievements.slice(0, 5).forEach(function (achievement) {
          var row = element('div', 'global-progress-achievement-row');
          row.appendChild(element('div', 'global-progress-history-title',
            achievement.module.replace(/-/g, ' ') + ' · ' + String(achievement.activityClass).replace(/-/g, ' ')));
          row.appendChild(element('div', 'global-progress-history-value', '+' + achievement.xp + ' EXP'));
          row.appendChild(element('div', 'global-progress-history-reason',
            achievement.reason || achievement.contentKey || achievement.evidence));
          achievementBox.appendChild(row);
        });
        mount.appendChild(achievementBox);
      }

      var recent = summary.recentAwards || [];
      if (recent.length) {
        var history = element('div', 'global-progress-history');
        history.appendChild(element('div', 'global-progress-history-heading', 'Recent EXP awards'));
        recent.slice(0, 5).forEach(function (award) {
          var row = element('div', 'global-progress-history-row');
          var label = (award.module || 'Limitless') + ' · ' + String(award.activityClass || 'activity').replace(/-/g, ' ');
          row.appendChild(element('div', 'global-progress-history-title', label));
          row.appendChild(element('div', 'global-progress-history-value', '+' + award.xp + ' EXP'));
          var details = [award.evidence || 'recorded reward', award.difficulty || 'foundational'];
          if (award.difficultyMultiplier && award.difficultyMultiplier !== 1) details.push('×' + award.difficultyMultiplier);
          if (award.quality !== null && typeof award.quality === 'number') details.push(Math.round(award.quality * 100) + '% quality');
          if (award.repeatMultiplier < 1) details.push('repeat ×' + award.repeatMultiplier);
          row.appendChild(element('div', 'global-progress-history-detail', details.join(' · ')));
          if (award.reason) row.appendChild(element('div', 'global-progress-history-reason', award.reason));
          history.appendChild(row);
        });
        mount.appendChild(history);
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