(function () {
  'use strict';
  var STORAGE_KEY = 'limitless.competition.regional-qualification.v1';
  var DEFAULTS = {
    startDate: '2026-11-02', targetDate: '2027-03-02', weeklyTarget: 21,
    benchmark: '', latestScore: '', safetyBuffer: 10, benchmarkSource: '',
    weekHours: {}, completed: {}, mocks: [], practice: { cf:0, cses:0, math:0 }, cfRating: '', cfRatingTarget: 1200
  };
  var SUBJECTS = [
    { id:'logic', name:'Logical Reasoning', note:'Proofs, deduction, invariants and constructive thinking' },
    { id:'combinatorics', name:'Combinatorics', note:'Counting, identities, recurrences and arrangements' },
    { id:'probability', name:'Probability', note:'Events, conditional probability and expectation' },
    { id:'graphs', name:'Graph Theory', note:'Traversal, connectivity, paths, trees and DSU' },
    { id:'dp', name:'Dynamic Programming', note:'States, transitions, recurrence and optimization' }
  ];
  var WEEKS = [
    { title:'Programming and mathematical foundations', phase:'Foundations', objective:'Build the basic tools needed to read, reason about and implement simple problems.', topics:[['logic','Statements, propositions and truth tables'],['combinatorics','Fundamental counting principle'],['probability','Sample spaces and elementary probability'],['graphs','Vertices, edges, degree and graph representation'],['dp','DP states, transitions and base cases'],['coding','C++ input/output, loops, arrays and time complexity']] },
    { title:'Mathematical reasoning and basic algorithms', phase:'Foundations', objective:'Translate statements into formal reasoning and learn the first reusable algorithmic patterns.', topics:[['logic','Implications, equivalences and quantifiers'],['combinatorics','Permutations and combinations'],['probability','Complementary events'],['graphs','Directed, undirected and weighted graphs'],['dp','Recursion and brute-force enumeration'],['coding','Sorting, frequency counting, prefix sums and binary search basics']] },
    { title:'Proofs and counting', phase:'Foundations', objective:'Learn to justify a result and recognize repeated subproblems.', topics:[['logic','Direct proof and proof by contradiction'],['combinatorics','Binomial coefficients and Pascal identity'],['probability','Addition and multiplication rules'],['graphs','Paths, cycles and connected components'],['dp','Recursion trees and overlapping subproblems'],['coding','STL vectors, maps, sets, pairs and two pointers']] },
    { title:'First assessment and graph traversal', phase:'Foundations', objective:'Consolidate the first month and independently implement graph traversal.', topics:[['logic','Mathematical induction and strong induction'],['combinatorics','Pigeonhole principle'],['probability','Conditional probability introduction'],['graphs','Breadth-first search and depth-first search'],['dp','Memoization introduction'],['coding','First mixed timed contest and error review']] },
    { title:'Combinatorial structures', phase:'Core concepts', objective:'Move from basic counting into algebraic identities and simple state-based DP.', topics:[['logic','Contrapositive and proof by cases'],['combinatorics','Binomial theorem and Pascal identity applications'],['probability','Conditional probability problems'],['graphs','Bipartite graphs'],['dp','One-dimensional DP and state transitions'],['coding','Greedy algorithms and modular arithmetic basics']] },
    { title:'Probability and graph structures', phase:'Core concepts', objective:'Understand independence and use graph ordering and simple recurrence models.', topics:[['logic','Invariants and parity arguments'],['combinatorics','Stars and bars'],['probability','Independence and Bayes theorem'],['graphs','Topological sorting and DAGs'],['dp','Fibonacci, climbing stairs and coin problems'],['coding','Queue, stack, BFS/DFS applications and tabulation']] },
    { title:'Counting and shortest paths', phase:'Core concepts', objective:'Combine counting with conditional reasoning and weighted graph algorithms.', topics:[['logic','Pigeonhole applications'],['combinatorics','Inclusion-exclusion principle'],['probability','Random variables and expectation'],['graphs','Shortest paths and Dijkstra'],['dp','Knapsack and subset sum'],['coding','Priority queues and adjacency lists']] },
    { title:'Second assessment', phase:'Core concepts', objective:'Test the core syllabus under time pressure and identify the weakest subject.', topics:[['logic','Invariants and exhaustive case analysis'],['combinatorics','Mixed counting and identity problems'],['probability','Conditional probability and expectation'],['graphs','BFS, DFS, DAGs and shortest paths'],['dp','Knapsack and introductory grid DP'],['coding','Two-hour mixed mathematics test and programming test']] },
    { title:'Advanced reasoning', phase:'Integrated practice', objective:'Learn to construct solutions when the problem does not announce its technique.', topics:[['logic','Constructive proofs and construction arguments'],['combinatorics','Advanced counting arrangements'],['probability','Law of total probability'],['graphs','Cycle detection and disjoint set union'],['dp','Longest increasing subsequence'],['coding','Mixed problems with hidden patterns']] },
    { title:'Mathematical structures', phase:'Integrated practice', objective:'Apply impossibility arguments and combine counting, probability and graph structure.', topics:[['logic','Invariants and impossibility proofs'],['combinatorics','Inclusion-exclusion applications'],['probability','Linearity of expectation'],['graphs','Minimum spanning trees and Kruskal'],['dp','Grid DP and path counting'],['coding','Binary search on answer introduction']] },
    { title:'Strategy and optimization', phase:'Integrated practice', objective:'Develop strategic reasoning and handle more complex states and graph structures.', topics:[['logic','Combinatorial games and winning strategies'],['combinatorics','Recurrences and counting sequences'],['probability','Expected-value problems'],['graphs','Trees, traversal and subtree properties'],['dp','Bitmask DP introduction'],['coding','Bit manipulation and state optimization']] },
    { title:'Third assessment', phase:'Integrated practice', objective:'Solve mixed problems where the topic is not disclosed in advance.', topics:[['logic','Mixed deduction, invariants and construction'],['combinatorics','Mixed counting under constraints'],['probability','Mixed conditional probability and expectation'],['graphs','Graph construction and traversal'],['dp','Derive and implement DP recurrences'],['coding','Full mixed assessment and detailed error analysis']] },
    { title:'Weakness correction', phase:'Competition readiness', objective:'Spend more time on the two weakest areas rather than repeating comfortable material.', topics:[['logic','Re-solve failed proof and invariant problems'],['combinatorics','Repair weak counting techniques'],['probability','Repair conditional probability and expectation gaps'],['graphs','Re-implement weak graph algorithms from memory'],['dp','Re-derive weak DP transitions'],['coding','Unseen mixed problems and implementation speed']] },
    { title:'Advanced mixed practice', phase:'Competition readiness', objective:'Practice multi-step problems and build reliable solution selection under constraints.', topics:[['logic','Unfamiliar deduction and constructive problems'],['combinatorics','Advanced counting and combinatorial identities'],['probability','Conditional probability and expectation combinations'],['graphs','Algorithm selection under graph constraints'],['dp','DP recurrence construction and optimization'],['coding','Mixed timed sets with no topic labels']] },
    { title:'Timed competition practice', phase:'Competition readiness', objective:'Rehearse the two-test, 2.5-hour structure and refine time allocation.', topics:[['logic','Timed logical reasoning set'],['combinatorics','Timed combinatorics set'],['probability','Timed probability set'],['graphs','Timed graph theory set'],['dp','Timed DP set'],['coding','Simulate 1-hour test plus 90-minute test']] },
    { title:'Final revision and qualification check', phase:'Competition readiness', objective:'Consolidate reliable methods, repeat full simulations and avoid unnecessary new topics.', topics:[['logic','Revise proofs, invariants and case analysis'],['combinatorics','Revise counting identities and inclusion-exclusion'],['probability','Revise core formulas and common traps'],['graphs','Revise BFS, DFS, shortest paths, trees and DSU'],['dp','Revise states, transitions and standard patterns'],['coding','Two full mocks, final error review and rest']] }
  ];
  var state = load();
  var $ = function (id) { return document.getElementById(id); };
  function cloneDefaults() { return JSON.parse(JSON.stringify(DEFAULTS)); }
  function load() {
    try {
      var saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      return saved && typeof saved === 'object' ? Object.assign(cloneDefaults(), saved) : cloneDefaults();
    } catch (_) { return cloneDefaults(); }
  }
  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); $('storage-note').textContent = 'Saved in this browser · Export a backup to move it to another device'; }
    catch (_) { $('storage-note').textContent = 'Could not save to browser storage. Export a backup to protect your changes.'; }
    renderOverview(); renderSubjects(); renderPractice(); renderSafety(); renderMockHistory();
  }
  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (c) {
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }
  function topicKey(week, index) { return 'w' + (week + 1) + '-t' + index; }
  function allTopics() { return WEEKS.reduce(function (a,w) { return a.concat(w.topics); }, []); }
  function countDone() { return Object.keys(state.completed).filter(function (k) { return state.completed[k]; }).length; }
  function renderOverview() {
    var total = allTopics().length, done = countDone(), pct = total ? Math.round(done / total * 100) : 0;
    $('overall-progress').textContent = pct + '%'; $('completed-topics').textContent = done + ' / ' + total + ' topics'; $('overall-bar').style.width = pct + '%';
    var start = new Date(state.startDate + 'T00:00:00'), today = new Date(); today.setHours(0,0,0,0);
    var week = Math.max(1, Math.min(16, Math.floor((today - start) / 604800000) + 1));
    var hours = Number(state.weekHours[week] || 0), target = Number(state.weeklyTarget || 21);
    $('hours-this-week').textContent = hours + 'h'; $('hours-target').textContent = 'of ' + target + 'h'; $('hours-bar').style.width = Math.min(100, target ? hours / target * 100 : 0) + '%';
    $('hours-context').textContent = hours >= target ? 'Weekly study target reached.' : (target - hours) + 'h remaining to this week’s target.';
    var end = new Date(state.targetDate + 'T00:00:00');
    $('days-remaining').textContent = Number.isNaN(end.getTime()) ? '—' : Math.max(0, Math.ceil((end - today) / 86400000));
    $('campaign-week').textContent = 'Week ' + week + ' of 16 · ' + (today < start ? 'Campaign not started' : today > end ? 'Target date passed' : 'Current campaign week');
  }
  function renderSubjects() {
    $('subject-grid').innerHTML = SUBJECTS.map(function (s) {
      var topics = [];
      WEEKS.forEach(function (w, wi) { w.topics.forEach(function (t, ti) { if (t[0] === s.id) topics.push(state.completed[topicKey(wi,ti)] ? 1 : 0); }); });
      var done = topics.reduce(function (a,b) { return a+b; },0), pct = topics.length ? Math.round(done/topics.length*100) : 0;
      return '<article class="subject-card"><h3>' + s.name + '</h3><p>' + s.note + '</p><div class="subject-count"><span>' + done + ' / ' + topics.length + ' complete</span><span>' + pct + '%</span></div><div class="progress-track"><span style="width:' + pct + '%"></span></div><a class="subject-link" href="#roadmap">View checkpoints ↓</a></article>';
    }).join('');
  }
  function renderPractice() {
    var practice = state.practice || { cf:0, cses:0, math:0 };
    var metrics = [
      { id:'cf', value:Number(practice.cf || 0), target:180 },
      { id:'cses', value:Number(practice.cses || 0), target:50 },
      { id:'math-exercises', value:Number(practice.math || 0), target:100 }
    ];
    metrics.forEach(function (m) {
      var key = m.id === 'math-exercises' ? 'math-exercises' : m.id;
      $(key + '-value').textContent = m.value;
      $(key + '-bar').style.width = Math.min(100, m.target ? m.value / m.target * 100 : 0) + '%';
    });
    $('cf-solved-target').textContent = '/ 180 problems';
    $('mock-count-value').textContent = state.mocks.length;
    $('mock-count-bar').style.width = Math.min(100, state.mocks.length / 8 * 100) + '%';
  }
  function renderWeeks() {
    var openWeeks = {};
    $('week-list').querySelectorAll('details').forEach(function (d, i) { openWeeks[i] = d.open; });
    $('week-list').innerHTML = WEEKS.map(function (w, wi) {
      var done = w.topics.filter(function (_,ti) { return !!state.completed[topicKey(wi,ti)]; }).length;
      var checks = w.topics.map(function (t,ti) {
        var key = topicKey(wi,ti), checked = !!state.completed[key];
        var subject = t[0] === 'coding' ? 'Programming' : SUBJECTS.find(function (s) { return s.id === t[0]; }).name;
        return '<label class="topic-check"><input type="checkbox" data-topic="' + key + '" ' + (checked ? 'checked' : '') + '><span>' + escapeHtml(t[1]) + '<small>' + subject + '</small></span></label>';
      }).join('');
      return '<details class="week-card" ' + (openWeeks[wi] || wi === 0 ? 'open' : '') + '><summary class="week-summary"><span class="week-number">WEEK ' + String(wi+1).padStart(2,'0') + '</span><span><span class="week-title">' + w.title + '</span><span class="week-phase">' + w.phase + '</span></span><span class="week-progress">' + done + ' / ' + w.topics.length + ' complete</span></summary><div class="week-content"><p class="week-objective">' + w.objective + '</p><div class="topic-checklist">' + checks + '</div><label class="week-hours">Actual study hours this week <input type="number" min="0" max="100" step="0.5" data-hours-week="' + (wi+1) + '" value="' + Number(state.weekHours[wi+1] || 0) + '"></label></div></details>';
    }).join('');
    $('week-list').querySelectorAll('[data-topic]').forEach(function (input) {
      input.addEventListener('change', function () { state.completed[input.dataset.topic] = input.checked; save(); renderWeeks(); });
    });
    $('week-list').querySelectorAll('[data-hours-week]').forEach(function (input) {
      input.addEventListener('change', function () { state.weekHours[input.dataset.hoursWeek] = Math.max(0, Number(input.value) || 0); save(); });
    });
  }
  function renderSafety() {
    var benchmark = Number(state.benchmark), latest = Number(state.latestScore), buffer = Number(state.safetyBuffer || 0);
    var hasBenchmark = state.benchmark !== '' && Number.isFinite(benchmark) && benchmark >= 0 && benchmark <= 100;
    var hasLatest = state.latestScore !== '' && Number.isFinite(latest) && latest >= 0 && latest <= 100;
    $('safe-target').textContent = hasBenchmark ? 'Safe target: ' + Math.min(100, benchmark * (1 + buffer / 100)).toFixed(1) + '% (' + buffer + '% buffer above benchmark)' : 'Safe target: waiting for benchmark';
    if (!hasBenchmark || !hasLatest) {
      $('safety-result').innerHTML = '<strong>Benchmark needed</strong><span>Enter a comparable qualifying benchmark and latest mock score. The safety margin will then be calculated.</span>';
      return;
    }
    var target = Math.min(100, benchmark * (1 + buffer / 100)), margin = latest - target;
    var status = margin >= 0 ? 'Above safety target' : latest >= benchmark ? 'Benchmark reached · safety buffer not reached' : 'Below qualifying benchmark';
    var detail = 'Latest mock: ' + latest.toFixed(1) + '% · Benchmark: ' + benchmark.toFixed(1) + '% · ' + (margin >= 0 ? '+' : '') + margin.toFixed(1) + ' percentage points versus safe target.';
    $('safety-result').innerHTML = '<strong>' + status + '</strong><span>' + detail + (state.benchmarkSource ? ' Source: ' + escapeHtml(state.benchmarkSource) : '') + '</span>';
  }
  function renderMockHistory() {
    var list = state.mocks.slice().sort(function (a,b) { return b.date.localeCompare(a.date); });
    $('mock-history').innerHTML = list.length ? list.map(function (m) {
      return '<div class="mock-row"><span>' + escapeHtml(m.date) + '</span><strong>' + Number(m.score).toFixed(1) + '%</strong><span>' + escapeHtml(m.note || 'Timed practice') + '</span><button class="mock-delete" type="button" data-delete-mock="' + escapeHtml(m.id) + '">Remove</button></div>';
    }).join('') : '<p class="empty-state">No mock tests recorded yet.</p>';
    $('mock-history').querySelectorAll('[data-delete-mock]').forEach(function (button) {
      button.addEventListener('click', function () {
        state.mocks = state.mocks.filter(function (m) { return m.id !== button.dataset.deleteMock; });
        if (state.mocks.length) state.latestScore = String(state.mocks.slice().sort(function(a,b){return b.date.localeCompare(a.date);})[0].score);
        else state.latestScore = '';
        $('latest-score').value = state.latestScore; save();
      });
    });
  }
  function bindInput(id, key) {
    $(id).addEventListener('change', function () { state[key] = $(id).value; save(); });
  }
  function init() {
    $('start-date').value = state.startDate; $('target-date').value = state.targetDate; $('weekly-target').value = state.weeklyTarget;
    $('cf-solved').value = state.practice.cf || 0; $('cses-solved').value = state.practice.cses || 0; $('math-exercises').value = state.practice.math || 0;
    $('cf-rating').value = state.cfRating; $('cf-rating-target').value = state.cfRatingTarget;
    $('benchmark-score').value = state.benchmark; $('latest-score').value = state.latestScore; $('safety-buffer').value = state.safetyBuffer; $('benchmark-source').value = state.benchmarkSource;
    bindInput('start-date','startDate'); bindInput('target-date','targetDate'); bindInput('weekly-target','weeklyTarget');
    $('cf-solved').addEventListener('change', function () { state.practice.cf = Math.max(0, Number(this.value) || 0); save(); });
    $('cses-solved').addEventListener('change', function () { state.practice.cses = Math.max(0, Number(this.value) || 0); save(); });
    $('math-exercises').addEventListener('change', function () { state.practice.math = Math.max(0, Number(this.value) || 0); save(); });
    bindInput('cf-rating','cfRating'); bindInput('cf-rating-target','cfRatingTarget');
    bindInput('benchmark-score','benchmark'); bindInput('latest-score','latestScore'); bindInput('safety-buffer','safetyBuffer'); bindInput('benchmark-source','benchmarkSource');
    ['start-date','target-date','weekly-target'].forEach(function (id) { $(id).addEventListener('change', renderOverview); });
    ['benchmark-score','latest-score','safety-buffer','benchmark-source'].forEach(function (id) { $(id).addEventListener('change', renderSafety); });
    renderWeeks(); renderOverview(); renderSubjects(); renderPractice(); renderSafety(); renderMockHistory();
    $('mock-date').value = new Date().toISOString().slice(0,10);
    $('mock-form').addEventListener('submit', function (event) {
      event.preventDefault(); var score = Number($('mock-score').value);
      if (!Number.isFinite(score) || score < 0 || score > 100) return;
      state.mocks.push({ id:String(Date.now()) + '-' + Math.random().toString(36).slice(2,7), date:$('mock-date').value, score:score, note:$('mock-note').value.trim() });
      state.latestScore = String(score); $('latest-score').value = state.latestScore; $('mock-score').value = ''; $('mock-note').value = ''; save();
    });
    $('export-data').addEventListener('click', function () {
      var blob = new Blob([JSON.stringify({ version:1, exportedAt:new Date().toISOString(), data:state },null,2)],{type:'application/json'});
      var url = URL.createObjectURL(blob), a = document.createElement('a'); a.href = url; a.download = 'limitless-competition-progress.json'; a.click(); URL.revokeObjectURL(url);
    });
    $('import-data').addEventListener('change', function () {
      var file = $('import-data').files[0]; if (!file) return;
      var reader = new FileReader();
      reader.onload = function () {
        try {
          var parsed = JSON.parse(reader.result), incoming = parsed.data || parsed;
          if (!incoming || typeof incoming !== 'object' || !incoming.completed || !Array.isArray(incoming.mocks)) throw new Error('Invalid backup');
          state = Object.assign(cloneDefaults(), incoming); localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); location.reload();
        } catch (_) { alert('That file is not a valid Limitless competition backup.'); }
      };
      reader.readAsText(file); $('import-data').value = '';
    });
    $('reset-data').addEventListener('click', function () {
      if (!confirm('Reset all competition progress, mock results and settings in this browser? Export a backup first if you may need this data.')) return;
      state = cloneDefaults(); localStorage.removeItem(STORAGE_KEY); location.reload();
    });
    var themeButton = $('theme-toggle');
    function paintThemeButton() { themeButton.textContent = document.documentElement.getAttribute('data-theme') === 'light' ? 'Dark mode' : 'Light mode'; }
    themeButton.addEventListener('click', function () {
      var next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme',next);
      try { localStorage.setItem('limitless.site.theme',next); } catch (_) {}
      paintThemeButton();
    });
    paintThemeButton();
  }
  init();
})();