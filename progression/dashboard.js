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
    var projectMessage = '';
    function field(labelText, name, type, required) {
      var label = element('label', 'global-project-field');
      label.appendChild(element('span', 'global-project-label', labelText));
      var input = type === 'textarea' ? document.createElement('textarea') : document.createElement('input');
      input.className = 'global-project-input';
      input.name = name;
      if (type !== 'textarea') input.type = type;
      if (required) input.required = true;
      if (name === 'projectId') {
        input.maxLength = 128;
        input.pattern = '[A-Za-z0-9][A-Za-z0-9_-]{0,127}';
        input.placeholder = 'e.g. bayes-simulation';
      } else if (name === 'title') {
        input.maxLength = 160;
        input.placeholder = 'Project name';
      } else if (name === 'scope') {
        input.maxLength = 500;
        input.placeholder = 'What work is included?';
      } else if (name === 'criteria') {
        input.maxLength = 1000;
        input.placeholder = 'What must be true before you claim completion?';
      }
      label.appendChild(input);
      return { label: label, input: input };
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

      var projectBox = element('div', 'global-projects');
      projectBox.appendChild(element('div', 'global-progress-history-heading', 'Bespoke projects · register before starting'));
      projectBox.appendChild(element('p', 'global-project-hint',
        'Choose a fixed 20–100 EXP reward and write the scope and acceptance criteria first. The definition cannot be changed after registration. Completion is a one-time self-attestation against those criteria.'));
      if (projectMessage) projectBox.appendChild(element('p', 'global-project-message', projectMessage));

      var projectForm = element('form', 'global-project-form');
      var moduleField = field('Discipline', 'module', 'text', true);
      var moduleSelect = document.createElement('select');
      moduleSelect.className = 'global-project-input';
      moduleSelect.name = 'module';
      [
        ['personal-projects', 'Personal project'],
        ['probability', 'Probability'],
        ['math-trainer', 'Math Trainer'],
        ['bookkeys', 'Bookkeys'],
        ['metallurgy', 'Metallurgy']
      ].forEach(function (pair) {
        var option = element('option', '', pair[1]);
        option.value = pair[0];
        moduleSelect.appendChild(option);
      });
      moduleField.label.removeChild(moduleField.input);
      moduleField.label.appendChild(moduleSelect);
      projectForm.appendChild(moduleField.label);

      var idField = field('Project ID (stable)', 'projectId', 'text', true);
      var titleField = field('Project title', 'title', 'text', true);
      projectForm.appendChild(idField.label);
      projectForm.appendChild(titleField.label);

      var baseLabel = element('label', 'global-project-field');
      baseLabel.appendChild(element('span', 'global-project-label', 'One-time base reward (20–100 EXP)'));
      var baseInput = document.createElement('input');
      baseInput.className = 'global-project-input';
      baseInput.name = 'baseExp';
      baseInput.type = 'number';
      baseInput.min = '20'; baseInput.max = '100'; baseInput.step = '5';
      baseInput.value = '50'; baseInput.required = true;
      baseLabel.appendChild(baseInput);
      projectForm.appendChild(baseLabel);

      var scopeField = field('Scope', 'scope', 'textarea', true);
      scopeField.input.rows = 2;
      var criteriaField = field('Acceptance criteria', 'criteria', 'textarea', true);
      criteriaField.input.rows = 3;
      projectForm.appendChild(scopeField.label);
      projectForm.appendChild(criteriaField.label);

      var submitProject = element('button', 'global-project-submit', 'Register project');
      submitProject.type = 'submit';
      projectForm.appendChild(submitProject);
      projectForm.addEventListener('submit', function (event) {
        event.preventDefault();
        var receipt = window.LimitlessRewards.registerProject({
          module: moduleSelect.value,
          projectId: idField.input.value.trim(),
          baseExp: Number(baseInput.value),
          title: titleField.input.value.trim(),
          scope: scopeField.input.value.trim(),
          criteria: criteriaField.input.value.trim()
        });
        projectMessage = receipt.ok
          ? (receipt.duplicate ? 'This exact project definition is already registered.' : 'Project registered. Its reward and criteria are now locked.')
          : 'Registration failed: ' + (receipt.error || 'unknown error') + '.';
        render();
      });
      projectBox.appendChild(projectForm);

      var registeredProjects = summary.registeredProjects || [];
      if (registeredProjects.length) {
        projectBox.appendChild(element('div', 'global-progress-history-heading', 'Registered projects'));
        var awardedProjectIds = Object.create(null);
        try {
          window.LimitlessRewards.read().awards.forEach(function (award) {
            if (award.a === 'bespoke-project') awardedProjectIds[award.id] = true;
          });
        } catch (error) { /* Keep the project definitions visible if history cannot be read. */ }
        registeredProjects.slice().reverse().forEach(function (project) {
          var completionId = 'project-completion:' + project.module + ':' + project.id;
          var completed = !!awardedProjectIds[completionId];
          var card = element('div', 'global-project-card');
          var heading = element('div', 'global-project-card-heading');
          heading.appendChild(element('div', 'global-project-card-title', project.title));
          heading.appendChild(element('div', 'global-project-card-value', '+' + project.baseExp + ' EXP'));
          card.appendChild(heading);
          card.appendChild(element('p', 'global-project-card-meta',
            project.module.replace(/-/g, ' ') + ' · registered ' + new Date(project.registeredAt).toLocaleDateString()));
          card.appendChild(element('p', 'global-project-card-copy', 'Scope: ' + project.scope));
          card.appendChild(element('p', 'global-project-card-copy', 'Complete when: ' + project.criteria));
          var finishButton = element('button', completed ? 'global-project-submit is-complete' : 'global-project-submit',
            completed ? 'Completed ✓ · reward claimed' : 'Confirm completion and claim once');
          finishButton.type = 'button';
          finishButton.disabled = completed;
          finishButton.addEventListener('click', function () {
            if (!window.confirm('Confirm that you completed the registered project and met every acceptance criterion? This one-time reward cannot be claimed again.')) return;
            var receipt = window.LimitlessRewards.record({
              module: project.module,
              eventId: completionId,
              contentKey: 'project:' + project.module + ':' + project.id,
              activityClass: 'bespoke-project',
              evidence: 'project-complete',
              projectId: project.id,
              difficulty: 'foundational',
              oneTimeKey: completionId
            });
            projectMessage = receipt.ok
              ? 'Completion recorded: +' + receipt.xp + ' global EXP.'
              : 'Completion was not recorded: ' + (receipt.error || 'unknown error') + '.';
            render();
          });
          card.appendChild(finishButton);
          projectBox.appendChild(card);
        });
      } else {
        projectBox.appendChild(element('p', 'global-project-empty', 'No bespoke projects registered yet.'));
      }
      mount.appendChild(projectBox);

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