(function () {
  'use strict';
  var links = Array.prototype.slice.call(document.querySelectorAll('[data-screen-link]'));
  var screens = Array.prototype.slice.call(document.querySelectorAll('[data-screen]'));
  var initial = location.hash === '#roadmap' ? 'roadmap' :
    (location.hash === '#codeforces-problems' || location.hash === '#problem-review') ? 'problems' :
    location.hash === '#mock-tests' ? 'mocks' :
    (location.hash === '#resources' || location.hash === '#linked-accounts') ? 'resources' :
    location.hash === '#settings' ? 'settings' : 'overview';

  function activate(name, updateHash) {
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
    if (updateHash) {
      var target = links.find(function (link) { return link.getAttribute('data-screen-link') === name; });
      if (target) history.replaceState(null, '', target.getAttribute('href'));
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  links.forEach(function (link) {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      activate(link.getAttribute('data-screen-link'), true);
    });
  });
  document.querySelectorAll('[data-subject-roadmap]').forEach(function (link) {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      var filter = document.getElementById('roadmap-subject-filter');
      if (filter) {
        filter.value = link.getAttribute('data-subject-roadmap');
        filter.dispatchEvent(new Event('change', { bubbles: true }));
      }
      activate('roadmap', true);
    });
  });
  activate(initial, false);

  var overviewGrid = document.querySelector('.overview-grid');
  var hero = document.querySelector('.competition-heading');
  if (overviewGrid && hero) hero.appendChild(overviewGrid);

  var campaignMeta = document.querySelector('.campaign-meta');
  var settingsContent = document.querySelector('.settings-card-content');
  if (campaignMeta && settingsContent) settingsContent.insertBefore(campaignMeta, settingsContent.firstChild);

  var todayPanel = document.createElement('section');
  todayPanel.className = 'today-panel';
  todayPanel.setAttribute('data-screen', 'overview');
  screens.push(todayPanel);
  todayPanel.innerHTML = '<div class="card-label">TODAY / THIS WEEK</div><h2 id="today-week-title">This week</h2><div id="today-task-list"></div><a href="#roadmap" class="today-roadmap-link">Open full roadmap →</a>';
  if (overviewGrid) overviewGrid.parentNode.insertBefore(todayPanel, overviewGrid.nextSibling);

  function escapeHTML(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
      return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c];
    });
  }
  function renderToday() {
    var weekNode = document.querySelector('.week-card[open]') || document.querySelector('.week-card');
    var title = document.getElementById('today-week-title');
    var list = document.getElementById('today-task-list');
    if (!weekNode || !list) return;
    var weekTitle = weekNode.querySelector('.week-title');
    var currentWeek = document.getElementById('current-week');
    if (title) title.textContent = (currentWeek ? currentWeek.textContent : 'Current week') + ' · ' + (weekTitle ? weekTitle.textContent : 'Foundations');

    var dayNames = ['sunday', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    var dayKey = dayNames[new Date().getDay()];
    if (dayKey === 'sunday') {
      list.innerHTML = '<p class="today-rest">Rest or light revision today.</p>';
      return;
    }
    var dayNode = Array.prototype.slice.call(weekNode.querySelectorAll('.daily-day')).find(function (node) {
      var summary = node.querySelector('summary');
      return summary && summary.textContent.toLowerCase().indexOf(dayKey) >= 0;
    });
    if (!dayNode) {
      list.innerHTML = '<p class="today-rest">No tasks scheduled for today.</p>';
      return;
    }
    var tasks = Array.prototype.slice.call(dayNode.querySelectorAll('[data-day-task]'));
    list.innerHTML = tasks.length ? tasks.map(function (input) {
      var label = input.closest('label');
      var copy = label ? label.querySelector('span') : null;
      return '<label class="today-task-row"><input type="checkbox" data-overview-task="' +
        escapeHTML(input.dataset.dayTask) + '" ' + (input.checked ? 'checked' : '') + '><span>' +
        escapeHTML(copy ? copy.textContent : 'Study task') + '</span></label>';
    }).join('') : '<p class="today-rest">No tasks scheduled for today.</p>';

    list.querySelectorAll('[data-overview-task]').forEach(function (box) {
      box.addEventListener('change', function () {
        var original = weekNode.querySelector('[data-day-task="' + box.dataset.overviewTask + '"]');
        if (original) {
          original.checked = box.checked;
          original.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });
    });
  }
  var roadmap = document.getElementById('week-list');
  if (roadmap) {
    var roadmapObserver = new MutationObserver(renderToday);
    roadmapObserver.observe(roadmap, { childList: true, subtree: true, attributes: true, attributeFilter: ['open'] });
  }
  var weekMetric = document.getElementById('current-week');
  if (weekMetric) {
    var currentIndex = Number((weekMetric.textContent.match(/\d+/) || [])[0] || 1) - 1;
    Array.prototype.slice.call(document.querySelectorAll('.week-card')).forEach(function (card, index) {
      card.open = index === currentIndex;
    });
  }
  renderToday();
  var todayLink = todayPanel.querySelector('.today-roadmap-link');
  if (todayLink) todayLink.addEventListener('click', function (event) {
    event.preventDefault();
    activate('roadmap', true);
  });

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
  compactForm(problemForm, ['problem-name', 'problem-outcome', 'problem-time'], 'More details');
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
    }).join('') : '<p>Nothing yet. Open Problems to log your first review.</p>';
  }
  refreshActivity();
  var history = document.getElementById('problem-history');
  if (history) {
    var historyObserver = new MutationObserver(refreshActivity);
    historyObserver.observe(history, { childList: true, subtree: true });
  }
})();