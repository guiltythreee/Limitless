(function () {
  'use strict';
  var links = Array.prototype.slice.call(document.querySelectorAll('[data-screen-link]'));
  var screens = Array.prototype.slice.call(document.querySelectorAll('[data-screen]'));
  // Subject roadmaps: one screen ("subject") shared by six sidebar links. The chosen
  // subject lives in the URL (#subject-graphs) and in the section's data-subject
  // attribute, which competition.js reads when it draws the roadmap.
  var SUBJECT_IDS = ['logic', 'combinatorics', 'probability', 'graphs', 'dp', 'coding'];
  var subjectLinks = Array.prototype.slice.call(document.querySelectorAll('[data-subject-link]'));
  var subjectScreen = document.getElementById('subject-roadmap');
  var subjectGroup = document.getElementById('side-subject-group');
  var subjectToggle = document.getElementById('side-subject-toggle');
  function subjectFromHash() {
    var match = /^#subject-([a-z]+)$/.exec(location.hash);
    return match && SUBJECT_IDS.indexOf(match[1]) !== -1 ? match[1] : null;
  }
  function setSubjectGroupOpen(open) {
    if (!subjectGroup || !subjectToggle) return;
    subjectToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    subjectGroup.classList.toggle('is-collapsed', !open);
  }
  var initial = subjectFromHash() ? 'subject' :
    location.hash === '#daily-plan' ? 'daily' :
    location.hash === '#roadmap' ? 'roadmap' :
    (location.hash === '#codeforces-problems' || location.hash === '#problem-review') ? 'problems' :
    location.hash === '#mock-tests' ? 'mocks' :
    (location.hash === '#resources' || location.hash === '#linked-accounts') ? 'resources' :
    location.hash === '#settings' ? 'settings' : 'overview';

  function activate(name, updateHash, subjectId) {
    var settings = document.getElementById('settings');
    if (settings) settings.open = name === 'settings';
    screens.forEach(function (node) {
      node.hidden = node.getAttribute('data-screen') !== name;
    });
    links.forEach(function (link) {
      var active = link.getAttribute('data-screen-link') === name;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    if (name === 'subject') {
      var chosen = SUBJECT_IDS.indexOf(subjectId) !== -1 ? subjectId : (subjectFromHash() || 'logic');
      if (subjectScreen) subjectScreen.setAttribute('data-subject', chosen);
      subjectId = chosen;
      setSubjectGroupOpen(true);
      // competition.js listens for this and draws the chosen subject's roadmap.
      document.dispatchEvent(new CustomEvent('competition:subject-change', { detail: { subject: chosen } }));
    }
    subjectLinks.forEach(function (link) {
      var active = name === 'subject' && link.getAttribute('data-subject-link') === subjectId;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    if (subjectGroup) subjectGroup.classList.toggle('has-active', name === 'subject');
    if (updateHash) {
      if (name === 'subject') {
        history.replaceState(null, '', '#subject-' + subjectId);
      } else {
        var target = links.find(function (link) { return link.getAttribute('data-screen-link') === name; });
        if (target) history.replaceState(null, '', target.getAttribute('href'));
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  links.forEach(function (link) {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      activate(link.getAttribute('data-screen-link'), true);
    });
  });
  subjectLinks.forEach(function (link) {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      activate('subject', true, link.getAttribute('data-subject-link'));
    });
  });
  if (subjectToggle) {
    subjectToggle.addEventListener('click', function () {
      setSubjectGroupOpen(subjectToggle.getAttribute('aria-expanded') !== 'true');
    });
  }
  // The overview subject cards are redrawn after every save, so listen on the
  // document rather than on the cards themselves.
  document.addEventListener('click', function (event) {
    var card = event.target.closest ? event.target.closest('[data-subject-roadmap]') : null;
    if (!card) return;
    event.preventDefault();
    activate('subject', true, card.getAttribute('data-subject-roadmap'));
  });
  activate(initial, false);

  var overviewGrid = document.querySelector('.overview-grid');
  var hero = document.querySelector('.competition-heading');
  if (overviewGrid && hero) hero.appendChild(overviewGrid);

  var campaignMeta = document.querySelector('.campaign-meta');
  var settingsContent = document.querySelector('.settings-card-content');
  if (campaignMeta && settingsContent) settingsContent.insertBefore(campaignMeta, settingsContent.firstChild);

  function addEntryDrawer(section, form, label, historySelector) {
    if (!section || !form) return;
    var heading = section.querySelector('.section-heading-row');
    if (!heading) return;
    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'action-button';
    button.textContent = label;
    heading.appendChild(button);
    var drawer = document.createElement('details');
    drawer.className = 'entry-drawer';
    var summary = document.createElement('summary');
    summary.textContent = label;
    drawer.appendChild(summary);
    drawer.appendChild(form);
    section.insertBefore(drawer, section.querySelector(historySelector));
    button.addEventListener('click', function () {
      drawer.open = !drawer.open;
      if (drawer.open) drawer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }
  function compactForm(form, visibleIds, summaryText) {
    if (!form) return;
    var fields = Array.prototype.slice.call(form.querySelectorAll(':scope > label'));
    var more = document.createElement('details');
    more.className = 'form-more-details';
    var summary = document.createElement('summary');
    summary.textContent = summaryText;
    more.appendChild(summary);
    fields.forEach(function (field) {
      var control = field.querySelector('input,select,textarea');
      if (control && visibleIds.indexOf(control.id) !== -1) return;
      if (control && control.id === 'problem-observation') control.required = false;
      more.appendChild(field);
    });
    var submit = form.querySelector('button[type="submit"]');
    form.insertBefore(more, submit);
  }
  var problemForm = document.getElementById('problem-form');
  var mockForm = document.getElementById('mock-form');
  addEntryDrawer(document.getElementById('problem-review'), problemForm, 'Log problem', '#problem-history');
  addEntryDrawer(document.getElementById('mock-tests'), mockForm, 'Add test', '#mock-history');
  compactForm(problemForm, ['problem-name', 'problem-datetime', 'problem-first-submitted-at', 'problem-solved-at', 'problem-attempts', 'problem-outcome', 'problem-time'], 'More details');
  compactForm(mockForm, ['mock-date', 'mock-one-score', 'mock-one-max', 'mock-two-score', 'mock-two-max', 'mock-note'], 'More details');

  document.querySelectorAll('#linked-accounts .linked-account-card > label').forEach(function (label) {
    var details = document.createElement('details');
    details.className = 'account-edit-details';
    var summary = document.createElement('summary');
    summary.textContent = 'Change account';
    details.appendChild(summary);
    label.parentNode.insertBefore(details, label);
    details.appendChild(label);
  });

  var activity = document.createElement('section');
  activity.className = 'recent-activity';
  activity.setAttribute('data-screen', 'overview');
  screens.push(activity);
  activity.innerHTML = '<div class="card-label">RECENT ACTIVITY</div><h2>Recent activity</h2><div id="overview-activity"></div>';
  var subjects = document.getElementById('subjects');
  if (subjects) subjects.parentNode.insertBefore(activity, subjects.nextSibling);

  function refreshActivity() {
    var target = document.getElementById('overview-activity');
    if (!target) return;
    var entries = Array.prototype.slice.call(document.querySelectorAll('#problem-history .problem-entry')).slice(0, 3);
    target.innerHTML = entries.length ? entries.map(function (entry) {
      var head = entry.querySelector('.problem-entry-head');
      var name = head && head.querySelector('strong');
      var subject = head && head.querySelector('span');
      var date = head && head.querySelector('small');
      return '<div class="activity-row"><strong>' + escapeHTML(name ? name.textContent : 'Problem review') +
        '</strong><span>' + escapeHTML(subject ? subject.textContent : '') +
        (date ? ' · ' + escapeHTML(date.textContent) : '') + '</span></div>';
    }).join('') : '<div class="activity-empty"><span class="activity-empty-icon" aria-hidden="true">◷</span><div><strong>Your activity timeline starts here</strong><p>Log a problem or complete a roadmap checkpoint to build a record of your preparation.</p></div><button type="button" class="activity-empty-action" data-activity-problems>Log your first problem →</button></div>';
  }
  refreshActivity();
  var activityTarget = document.getElementById('overview-activity');
  if (activityTarget) activityTarget.addEventListener('click', function(event){
    var action = event.target.closest('[data-activity-problems]');
    if (!action) return;
    activate('problems', true);
    var logButton = document.querySelector('#problem-review .section-heading-row .action-button');
    if (logButton) logButton.click();
  });
  var history = document.getElementById('problem-history');
  if (history) {
    var historyObserver = new MutationObserver(refreshActivity);
    historyObserver.observe(history, { childList: true, subtree: true });
  }
})();