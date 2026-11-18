(function () {
  'use strict';

  var learningIntelligencePromise = import('./learning-intelligence.mjs').catch(function () { return null; });
  var practiceRecommendationsPromise = import('./practice-recommendations.mjs').catch(function () { return null; });
  var STORAGE_KEY = 'limitless.competition.regional-qualification.v1';
  var DEFAULTS = {
    startDate: '2026-11-02',
    targetDate: '2027-03-02',
    qualificationCutoff: '',
    qualificationPoolSize: '',
    rankBuffer: '',
    qualificationTrack: '',
    benchmarkSource: '',
    mastery: {},
    dayChecks: {},
    mocks: [],
    problemLog: [],
    weekChecks: {},
    resourceChecks: {},
    revisionChecks: {},
    revisionAttempts: []
  };

  var SUBJECTS = [
    { id:'logic', name:'Logical Reasoning', note:'Formal logic, proofs, deduction, invariants and constructive thinking' },
    { id:'combinatorics', name:'Combinatorics', note:'Counting principles, arrangements, identities and recurrences' },
    { id:'probability', name:'Probability', note:'Events, conditional probability, random variables and expectation' },
    { id:'graphs', name:'Graph Theory', note:'Representation, traversal, connectivity, paths, trees and graph algorithms' },
    { id:'dp', name:'Dynamic Programming', note:'State design, recurrence construction, transitions and optimization' }
  ];

  // The order is deliberate: foundations first, then core techniques, integration,
  // and finally timed competition practice. Advanced topics are stretch material,
  // not prerequisites for marking the earlier foundations as mastered.
  var WEEKS = [
    {
      title:'Programming and mathematical foundations', phase:'Foundations',
      objective:'Establish the language, notation and reasoning needed to understand the problem statements and implement simple solutions.',
      topics:[
        ['logic','Statements, truth values and connectives (AND, OR, NOT)'],
        ['combinatorics','Addition and multiplication counting principles'],
        ['probability','Random experiments, outcomes, events and sample spaces'],
        ['graphs','Vertices, edges, degree and basic graph types'],
        ['dp','Read constraints and distinguish exhaustive search from feasible algorithms'],
        ['coding','C++ variables, conditions, loops, functions, arrays/vectors and basic complexity']
      ],
      assessment:'Baseline diagnostic: attempt a short reasoning set and an introductory programming set. Record what you can solve without hints; do not use the result as a qualification prediction.'
    },
    {
      title:'Logical statements and basic counting', phase:'Foundations',
      objective:'Translate statements correctly, count simple arrangements and represent graphs and data structures.',
      topics:[
        ['logic','Implication, converse, inverse, contrapositive and negation of quantifiers'],
        ['combinatorics','Permutations and combinations; ordered versus unordered choices'],
        ['probability','Complement, union, intersection and the addition rule'],
        ['graphs','Adjacency matrix/list, walks, paths, cycles and connected components'],
        ['dp','Recursion, base cases and tracing a recursion tree'],
        ['coding','Sorting, pairs, maps/sets, frequency arrays and prefix sums']
      ]
    },
    {
      title:'Proof methods and first algorithms', phase:'Foundations',
      objective:'Learn to justify conclusions and implement the first standard graph and DP patterns.',
      topics:[
        ['logic','Direct proof, proof by cases, contradiction and contrapositive'],
        ['combinatorics','Binomial coefficients, Pascal identity and counting subsets'],
        ['probability','Conditional probability using restricted sample spaces and tree diagrams'],
        ['graphs','BFS and DFS; traversal order and visited-state handling'],
        ['dp','Define a state, base case and transition; memoization versus tabulation'],
        ['coding','Queues, stacks, recursion safety and graph adjacency lists']
      ]
    },
    {
      title:'Induction, pigeonhole and first diagnostic', phase:'Foundations',
      objective:'Consolidate the fundamentals and check whether you can transfer them to unseen questions.',
      topics:[
        ['logic','Mathematical induction, strong induction and proof by exhaustion'],
        ['combinatorics','Pigeonhole principle and simple extremal counting'],
        ['probability','Independence versus mutually exclusive events; multiplication rule'],
        ['graphs','Connected components, cycle detection and bipartite basics'],
        ['dp','One-dimensional DP: count ways and minimum/maximum cost'],
        ['coding','Implement BFS/DFS and a simple one-dimensional DP from a blank file']
      ],
      assessment:'Diagnostic 1: a 60-minute reasoning/mathematics paper followed by a 90-minute programming/problem-solving paper. Treat it as a baseline and classify mistakes by topic.'
    },
    {
      title:'Invariants and constrained counting', phase:'Core concepts',
      objective:'Move from direct counting to restricted arrangements, and from simple graph traversal to structural reasoning.',
      topics:[
        ['logic','Parity arguments, invariants and identifying what an operation preserves'],
        ['combinatorics','Arrangements with restrictions; repeated objects and complementary counting'],
        ['probability','Conditional probability with partitions and multi-step experiments'],
        ['graphs','Bipartite graphs, two-colouring and odd-cycle reasoning'],
        ['dp','One-dimensional optimization: stairs, selection and simple coin-change variants'],
        ['coding','Greedy choices as hypotheses; test with counterexamples before proving']
      ]
    },
    {
      title:'Stars and bars, Bayes and DAGs', phase:'Core concepts',
      objective:'Build the main counting and conditional-probability tools while learning directed acyclic graph structure.',
      topics:[
        ['logic','Pigeonhole applications, necessary/sufficient conditions and counterexamples'],
        ['combinatorics','Stars and bars; non-negative versus positive integer solutions'],
        ['probability','Law of total probability and Bayes theorem'],
        ['graphs','Directed acyclic graphs and topological sorting'],
        ['dp','0/1 knapsack: state meaning, transition, initialization and iteration direction'],
        ['coding','Sorting with custom comparators; safe integer and bounds handling']
      ]
    },
    {
      title:'Inclusion-exclusion, expectation and shortest paths', phase:'Core concepts',
      objective:'Handle overlapping events and sets, expected values, weighted paths and two-dimensional DP.',
      topics:[
        ['logic','Double counting and constructing a contradiction from impossible constraints'],
        ['combinatorics','Inclusion-exclusion for two and three sets'],
        ['probability','Random variables, expectation, indicators and linearity of expectation'],
        ['graphs','Shortest paths: BFS for unweighted graphs and Dijkstra for non-negative weights'],
        ['dp','Grid DP, path counting and subset-sum formulation'],
        ['coding','Priority queues, stale entries in Dijkstra and DP table reconstruction basics']
      ]
    },
    {
      title:'Core assessment and consolidation', phase:'Core concepts',
      objective:'Check the complete foundation-to-core syllabus before moving into more advanced combinations.',
      topics:[
        ['logic','Mixed proofs, parity, pigeonhole, invariants and exhaustive cases'],
        ['combinatorics','Mixed arrangements, stars and bars, binomial coefficients and inclusion-exclusion'],
        ['probability','Conditional probability, independence and expectation problems'],
        ['graphs','BFS, DFS, bipartite checks, topological sorting and shortest paths'],
        ['dp','One-dimensional, grid and knapsack DP under stated constraints'],
        ['coding','Implement standard templates from memory and explain their complexity']
      ],
      assessment:'Diagnostic 2: repeat the two-part 2.5-hour format. Compare topic-wise accuracy and time use with Diagnostic 1; do not compare raw scores unless the papers are comparable.'
    },
    {
      title:'Recurrences, distributions and graph components', phase:'Integrated problem-solving',
      objective:'Use recurrence-based counting and probability models, while adding disjoint-set structures and subsequence DP.',
      topics:[
        ['logic','Constructive arguments: build an object and prove it satisfies the conditions'],
        ['combinatorics','Recurrence relations for counting; solve and verify small cases'],
        ['probability','Bernoulli and binomial models; recognise when trials are not independent'],
        ['graphs','Disjoint Set Union: find, union, path compression and component queries'],
        ['dp','Longest increasing subsequence: quadratic DP before faster optimization'],
        ['coding','DSU implementation and coordinate/sequence handling']
      ]
    },
    {
      title:'Trees, spanning trees and expectation applications', phase:'Integrated problem-solving',
      objective:'Understand tree structure, minimum spanning trees and more involved expectation arguments.',
      topics:[
        ['logic','Exchange arguments and proving a greedy choice is safe'],
        ['combinatorics','Bijections and double counting as proof techniques'],
        ['probability','Linearity of expectation in multi-stage processes; indicator variables'],
        ['graphs','Trees, tree properties, minimum spanning trees and Kruskal'],
        ['dp','DP on DAGs and introductory tree DP on small states'],
        ['coding','Tree traversal, parent/depth arrays and MST implementation']
      ]
    },
    {
      title:'Mixed mathematical structures and advanced DP', phase:'Integrated problem-solving',
      objective:'Recognise which technique applies without being told the topic, while extending DP only where foundations are secure.',
      topics:[
        ['logic','Constraint puzzles, case splitting, truth/lie deductions and impossibility proofs'],
        ['combinatorics','Inclusion-exclusion applications, recurrence counting and binomial identities'],
        ['probability','Variance basics, total expectation and conditional reasoning'],
        ['graphs','Choose between BFS, Dijkstra, DSU, topological order and MST from constraints'],
        ['dp','Subsequence/string DP such as LCS; interval or bitmask DP only as stretch topics'],
        ['coding','Derive complexity before implementation; compare brute force with optimized solutions']
      ]
    },
    {
      title:'Integrated assessment and weakness diagnosis', phase:'Integrated problem-solving',
      objective:'Measure transfer across subjects and use the error profile to plan the final month.',
      topics:[
        ['logic','Unseen proof and deduction problems; state the key invariant or contradiction'],
        ['combinatorics','Unseen counting problems requiring two principles together'],
        ['probability','Problems combining conditional probability, counting and expectation'],
        ['graphs','Unseen graph problems requiring algorithm selection'],
        ['dp','Unseen recurrence/state-design problems; justify each transition'],
        ['coding','Full post-mortem: wrong idea, missed observation, complexity or implementation error']
      ],
      assessment:'Diagnostic 3: full two-part simulation. Identify the two weakest topics in each subject and write a specific repair task for each.'
    },
    {
      title:'Targeted repair of weak foundations', phase:'Competition readiness',
      objective:'Repair gaps revealed by the previous assessment. Do not add advanced techniques while prerequisite topics remain unstable.',
      topics:[
        ['logic','Rebuild the weakest proof method; solve fresh problems and explain the argument aloud'],
        ['combinatorics','Rebuild the weakest counting family; draw cases and verify with small enumeration'],
        ['probability','Rebuild conditional probability/expectation; define the sample space or random variable first'],
        ['graphs','Re-implement the weakest graph algorithms without copying a template'],
        ['dp','Re-derive weak states and transitions; verify on small cases before coding'],
        ['coding','Fix recurring implementation errors and re-solve previously missed problems unaided']
      ]
    },
    {
      title:'Unseen mixed problems and transfer', phase:'Competition readiness',
      objective:'Practise selecting a method from the problem structure rather than from a topic label.',
      topics:[
        ['logic','Mixed invariants, construction, counterexamples and proof by contradiction'],
        ['combinatorics','Mixed restrictions, inclusion-exclusion, recurrences and bijections'],
        ['probability','Mixed conditional models, indicator variables and expected values'],
        ['graphs','Mixed graph modelling, shortest paths, components and tree reasoning'],
        ['dp','Mixed one-dimensional, grid, knapsack, subsequence and DAG DP'],
        ['coding','Timed mixed sets; record when brute force, greedy, graph or DP is justified']
      ]
    },
    {
      title:'Competition-format simulations', phase:'Competition readiness',
      objective:'Practise the actual two-test schedule and make deliberate decisions about time allocation.',
      topics:[
        ['logic','Timed reasoning set; reserve time to verify every deduction'],
        ['combinatorics','Timed counting set; check overcounting and missing cases'],
        ['probability','Timed probability set; define events and conditional sample spaces explicitly'],
        ['graphs','Timed graph set; select algorithms from constraints and prove applicability'],
        ['dp','Timed DP set; write state, transition and complexity before implementation'],
        ['coding','Full simulation: Test 1 for 60 minutes, break/setup as applicable, Test 2 for 90 minutes']
      ],
      assessment:'Simulation 4: exact 60 + 90 minute format. Review time spent, attempted problems, accuracy and rank only against a comparable mock cohort.'
    },
    {
      title:'Final consolidation and readiness decision', phase:'Competition readiness',
      objective:'Retain reliable methods, re-solve known weak problems and enter the competition rested.',
      topics:[
        ['logic','Final review: inference, proof methods, induction, invariants and case analysis'],
        ['combinatorics','Final review: counting rules, permutations/combinations, stars and bars and inclusion-exclusion'],
        ['probability','Final review: conditional probability, independence, Bayes, random variables and expectation'],
        ['graphs','Final review: BFS/DFS, bipartite, DAG/topological, shortest paths, DSU and MST'],
        ['dp','Final review: state design, 1D, grid, knapsack, subsequence and DAG patterns'],
        ['coding','One final full simulation early in the week; then light review, sleep and logistics']
      ],
      assessment:'Final simulation and review. Readiness is based on repeated timed performance and topic mastery, not a Codeforces rating target.'
    }
  ];

  var DAILY_PLAN = [
    { id:'mon', day:'Monday', subjects:['probability','logic'] },
    { id:'tue', day:'Tuesday', subjects:['combinatorics','coding'] },
    { id:'wed', day:'Wednesday', subjects:['graphs','combinatorics'] },
    { id:'thu', day:'Thursday', subjects:['dp','logic'] },
    { id:'fri', day:'Friday', subjects:['probability','graphs'] },
    { id:'sat', day:'Saturday', subjects:[] }
  ];

  var MASTERY = [
    { value:'not-started', label:'Not started' },
    { value:'learning', label:'Learning' },
    { value:'practiced', label:'Practiced' },
    { value:'mastered', label:'Mastered' }
  ];
  var MASTERY_VALUES = ['not-started','learning','practiced','mastered'];
  var state = load();
  var $ = function (id) { return document.getElementById(id); };

  function cloneDefaults() { return JSON.parse(JSON.stringify(DEFAULTS)); }
  function load() {
    try {
      var saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (!saved || typeof saved !== 'object') return cloneDefaults();
      var merged = Object.assign(cloneDefaults(), saved);
      if (!merged.mastery || typeof merged.mastery !== 'object') merged.mastery = {};
      if (!merged.dayChecks || typeof merged.dayChecks !== 'object') merged.dayChecks = {};
      if (!Array.isArray(merged.mocks)) merged.mocks = [];
      if (!Array.isArray(merged.problemLog)) merged.problemLog = [];
      if (!Array.isArray(merged.revisionAttempts)) merged.revisionAttempts = [];
      if (!merged.weekChecks || typeof merged.weekChecks !== 'object') merged.weekChecks = {};
      if (!merged.resourceChecks || typeof merged.resourceChecks !== 'object') merged.resourceChecks = {};
      if (!merged.revisionChecks || typeof merged.revisionChecks !== 'object') merged.revisionChecks = {};
      // Migrate the old binary checklist conservatively: a checked topic becomes
      // "practiced", never "mastered", because the old tracker had no mastery test.
      if (saved.completed && typeof saved.completed === 'object') {
        Object.keys(saved.completed).forEach(function (key) {
          if (saved.completed[key] && !merged.mastery[key]) merged.mastery[key] = 'practiced';
        });
      }
      delete merged.completed;
      delete merged.weeklyTarget;
      delete merged.weekHours;
      delete merged.practice;
      delete merged.cfRating;
      delete merged.cfRatingTarget;
      return merged;
    } catch (_) { return cloneDefaults(); }
  }

  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      $('storage-note').textContent = 'Saved in this browser · Export a backup to move it to another device';
    } catch (_) {
      $('storage-note').textContent = 'Could not save to browser storage. Export a backup to protect your changes.';
    }
  }
  function saveAndRender() {
    persist();
    renderOverview();
    renderSubjects();
    renderSafety();
    renderMockHistory();
    renderProblemHistory();
    renderLearningSystem();
    renderMockAnalytics();
  }
  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }
  function localDateTimeInputValue(date) {
    var value = date || new Date();
    var pad = function (number) { return String(number).padStart(2, '0'); };
    return value.getFullYear() + '-' + pad(value.getMonth() + 1) + '-' + pad(value.getDate()) +
      'T' + pad(value.getHours()) + ':' + pad(value.getMinutes()) + ':' + pad(value.getSeconds());
  }
  function parseProblemTimestamp(value) {
    var timestamp = typeof value === 'string' ? Date.parse(value) : NaN;
    return Number.isFinite(timestamp) && timestamp > 0 ? timestamp : NaN;
  }
  function elapsedProblemTime(firstAt, solvedAt) {
    var first = parseProblemTimestamp(firstAt), solved = parseProblemTimestamp(solvedAt);
    return Number.isFinite(first) && Number.isFinite(solved) && solved >= first ? solved - first : NaN;
  }
  function formatElapsedDuration(milliseconds) {
    if (!Number.isFinite(milliseconds) || milliseconds < 0) return 'Not available';
    var seconds = Math.floor(milliseconds / 1000);
    var days = Math.floor(seconds / 86400); seconds -= days * 86400;
    var hours = Math.floor(seconds / 3600); seconds -= hours * 3600;
    var minutes = Math.floor(seconds / 60); seconds -= minutes * 60;
    var parts = [];
    if (days) parts.push(days + 'd');
    if (hours) parts.push(hours + 'h');
    if (minutes) parts.push(minutes + 'm');
    if (seconds && parts.length < 2) parts.push(seconds + 's');
    return parts.length ? parts.join(' ') : 'less than 1s';
  }
  function updateProblemElapsedPreview() {
    var first = $('problem-first-submitted-at').value;
    var solved = $('problem-solved-at').value;
    var preview = $('problem-elapsed-preview');
    if ($('problem-outcome').value === 'unsolved') {
      preview.textContent = 'Unsolved so far · elapsed-to-solve will be available when an accepted submission is recorded.';
      return;
    }
    if (!first || !solved) {
      preview.textContent = 'Enter both timestamps to calculate first-submission-to-accepted time.';
      return;
    }
    var elapsed = elapsedProblemTime(new Date(first).toISOString(), new Date(solved).toISOString());
    preview.textContent = Number.isFinite(elapsed)
      ? 'Elapsed from first submission to accepted submission: ' + formatElapsedDuration(elapsed)
      : 'Accepted submission must not be earlier than the first submission.';
  }
  function syncProblemSolvedAtField() {
    var isUnsolved = $('problem-outcome').value === 'unsolved';
    var field = $('problem-solved-at-field');
    var input = $('problem-solved-at');
    field.hidden = isUnsolved;
    input.required = !isUnsolved;
    if (!isUnsolved && !input.value) input.value = localDateTimeInputValue();
    updateProblemElapsedPreview();
  }
  function problemHistoryTimestamp(problem) {
    var precise = typeof problem.dateTime === 'string' ? Date.parse(problem.dateTime) : NaN;
    if (Number.isFinite(precise)) return precise;
    // Date-only legacy entries are interpreted as local midnight so they sort
    // naturally against new timestamped entries on the same calendar day.
    var legacyDate = typeof problem.date === 'string' ? Date.parse(problem.date + 'T00:00:00') : NaN;
    return Number.isFinite(legacyDate) ? legacyDate : 0;
  }
  function formatProblemDateTime(problem) {
    var timestamp = typeof problem.dateTime === 'string' ? Date.parse(problem.dateTime) : NaN;
    return Number.isFinite(timestamp)
      ? new Date(timestamp).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
      : (problem.date || 'Date not recorded');
  }
  function formatProblemTimestamp(value) {
    var timestamp = parseProblemTimestamp(value);
    return Number.isFinite(timestamp)
      ? new Date(timestamp).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
      : 'Not recorded';
  }
  function topicKey(week, index) { return 'w' + (week + 1) + '-t' + index; }
  function allTopics() { return WEEKS.reduce(function (all, week) { return all.concat(week.topics); }, []); }
  function currentWeekIndex() {
    var start = new Date(state.startDate + 'T00:00:00');
    var today = new Date(); today.setHours(0,0,0,0);
    if (!Number.isFinite(start.getTime()) || today < start) return 0;
    return Math.max(0, Math.min(15, Math.floor((today - start) / 604800000)));
  }
  function statusOf(key) {
    var value = state.mastery[key];
    return MASTERY_VALUES.indexOf(value) !== -1 ? value : 'not-started';
  }

  function renderOverview() {
    var topics = allTopics(), mastered = 0, practiced = 0, learning = 0;
    topics.forEach(function (_, index) {
      var status = statusOf('w' + (Math.floor(index / 6) + 1) + '-t' + (index % 6));
      if (status === 'mastered') mastered++;
      else if (status === 'practiced') practiced++;
      else if (status === 'learning') learning++;
    });
    // Show only strict mastered topics as completed mastery. Do not assign
    // arbitrary fractional weights to "learning" or "practiced".
    var pct = topics.length ? Math.round(mastered / topics.length * 100) : 0;
    $('overall-progress').textContent = pct + '%';
    $('mastery-summary').textContent = mastered + ' / ' + topics.length + ' mastered · ' + practiced + ' practiced · ' + learning + ' learning';
    $('overall-bar').style.width = pct + '%';
    var wi = currentWeekIndex();
    $('current-week').textContent = 'Week ' + (wi + 1);
    $('phase-name').textContent = WEEKS[wi].phase;
    var today = new Date(); today.setHours(0,0,0,0);
    var start = new Date(state.startDate + 'T00:00:00');
    var target = new Date(state.targetDate + 'T00:00:00');
    $('campaign-week').textContent = today < start ? 'Campaign has not started' : today > target ? 'Target competition date passed' : 'Learning focus: ' + WEEKS[wi].title;
    $('days-remaining').textContent = Number.isFinite(target.getTime()) ? Math.max(0, Math.ceil((target - today) / 86400000)) : '—';
  }

  function masteryDonut(counts, total, pct, label) {
    var values = [
      { key:'mastered', color:'#42d6c0', name:'Mastered' },
      { key:'practiced', color:'#a58aff', name:'Practiced' },
      { key:'learning', color:'#ffbd62', name:'Learning' },
      { key:'not-started', color:'#61a9e8', name:'Not started' }
    ];
    var rings = values.map(function(item,index){
      var amount = total ? counts[item.key] / total * 100 : 0;
      return '<i class="donut-ring donut-ring-' + item.key + '" style="--ring-pct:' + amount.toFixed(2) + '%;--ring-color:' + item.color + '" title="' + item.name + ': ' + counts[item.key] + '"></i>';
    }).join('');
    return '<span class="mastery-donut" role="img" aria-label="' + esc(label) + ': ' + pct + '% mastered; ' + values.map(function(item){return item.name + ' ' + counts[item.key];}).join(', ') + '">' + rings + '<span class="donut-center"><strong>' + pct + '%</strong><small>mastered</small></span></span>';
  }

  function renderSubjects() {
    var accents = {logic:'blue',combinatorics:'violet',probability:'teal',graphs:'amber',dp:'cyan'};
    var symbols = {logic:'∴',combinatorics:'✳',probability:'◉',graphs:'⌘',dp:'⌁'};
    $('subject-grid').innerHTML = SUBJECTS.map(function (subject) {
      var counts = { 'not-started':0, learning:0, practiced:0, mastered:0 };
      WEEKS.forEach(function (week, wi) {
        week.topics.forEach(function (topic, ti) {
          if (topic[0] === subject.id) counts[statusOf(topicKey(wi,ti))]++;
        });
      });
      var total = counts['not-started'] + counts.learning + counts.practiced + counts.mastered;
      var pct = total ? Math.round(counts.mastered / total * 100) : 0;
      var distribution = [
        {label:'Mastered',key:'mastered',color:'#42d6c0'},
        {label:'Practiced',key:'practiced',color:'#a58aff'},
        {label:'Learning',key:'learning',color:'#ffbd62'},
        {label:'Not started',key:'not-started',color:'#49627e'}
      ];
      var bars = distribution.map(function(item){
        var width = total ? counts[item.key] / total * 100 : 0;
        return '<span class="subject-state-bar" title="' + item.label + ': ' + counts[item.key] + '" style="width:' + width.toFixed(2) + '%;background:' + item.color + '"></span>';
      }).join('');
      return '<a class="subject-card subject-card-link subject-card-' + accents[subject.id] + '" href="#roadmap" data-subject-roadmap="' + subject.id + '" aria-label="Open ' + esc(subject.name) + ' roadmap">' +
        '<div class="subject-card-top"><span class="subject-symbol" aria-hidden="true">' + symbols[subject.id] + '</span><span class="subject-card-index">' + String(SUBJECTS.indexOf(subject)+1).padStart(2,'0') + ' / 05</span></div>' +
        '<h3>' + esc(subject.name) + '</h3><p>' + esc(subject.note) + '</p>' +
        '<div class="subject-analytics-row">' + masteryDonut(counts,total,pct,subject.name) + '<div class="subject-analytics-copy"><strong>' + counts.mastered + ' <small>/ ' + total + ' mastered</small></strong><span>' + counts.practiced + ' practiced · ' + counts.learning + ' learning</span><span>' + counts['not-started'] + ' not started</span></div></div>' +
        '<div class="subject-count"><span>Topic distribution</span><span>' + pct + '% mastery</span></div><div class="subject-state-bar-track" role="img" aria-label="Mastered, practiced, learning and not started topic distribution">' + bars + '</div>' +
        '<span class="subject-card-action">Explore subject roadmap <b aria-hidden="true">→</b></span>' +
        '</a>';
    }).join('');
  }

  // Topic-level references: keep the learning source beside the exact checkpoint.
  // Links point to stable course/book resources; chapter numbers are omitted because
  // pagination and chapter numbering vary across editions.
  var TOPIC_RESOURCES = {
    logic:[
      {label:'MIT 6.042J written notes',url:'https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-fall-2010/pages/readings/'},
    ],
    combinatorics:[
      {label:'MIT 6.042J written notes (counting)',url:'https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-fall-2010/pages/readings/'},
    ],
    probability:[
      {label:'Harvard Stat 110',url:'https://projects.iq.harvard.edu/stat110/home'},
      {label:'Blitzstein & Hwang — Introduction to Probability',url:'https://projects.iq.harvard.edu/stat110/home'}
    ],
    graphs:[
      {label:'Competitive Programmer’s Handbook',url:'https://cses.fi/book/book.pdf'},
      {label:'CP-Algorithms',url:'https://cp-algorithms.com/'},
      {label:'CSES Graph Algorithms',url:'https://cses.fi/problemset/'}
    ],
    dp:[
      {label:'Competitive Programmer’s Handbook',url:'https://cses.fi/book/book.pdf'},
      {label:'CP-Algorithms',url:'https://cp-algorithms.com/'},
      {label:'CSES Dynamic Programming',url:'https://cses.fi/problemset/'}
    ],
    coding:[
      {label:'LearnCpp',url:'https://www.learncpp.com/'},
      {label:'Competitive Programmer’s Handbook',url:'https://cses.fi/book/book.pdf'}
    ]
  };

  function topicResourceLinks(subjectId, weekIndex) {
    var links = TOPIC_RESOURCES[subjectId] || [];
    // Early weeks emphasise explanation and worked examples; later weeks add
    // structured problem practice without implying a rating-based progression.
    if (weekIndex < 4) links = links.slice(0, 2);
    return links.map(function (resource) {
      return '<a href="' + resource.url + '" target="_blank" rel="noopener noreferrer">' + esc(resource.label) + '</a>';
    }).join('<span class="resource-separator">·</span>');
  }

  var MIT_OCW = 'https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-fall-2010/';
  function mitResource(path) { return MIT_OCW + path; }
  function mitCompanionFor(subjectId, topicTitle, weekIndex) {
    var title=String(topicTitle||'').toLowerCase(),notes=[],lectures=[],sets=[];
    if(/mixed|unseen|final review|timed|weakest/.test(title)) return null;
    function note(slug,name){notes.push({label:name,url:mitResource('resources/mit6_042jf10_chap'+slug+'/')});}
    function lecture(n,slug,name){lectures.push({label:'Lecture '+n+': '+name,url:mitResource('resources/lecture-'+n+'-'+slug+'/')});}
    function ps(n){sets.push({label:'Problem Set '+n,url:mitResource('resources/mit6_042jf10_assn'+String(n).padStart(2,'0')+'/')});}
    if(subjectId==='logic'){
      if(/induction/.test(title)){note('03','Chapter 3: Induction');lecture(2,'induction','Induction');lecture(3,'strong-induction','Strong Induction');ps(2);}
      else if(/invariant/.test(title)){note('03','Chapter 3: Induction');lecture(3,'strong-induction','Strong Induction and Invariants');ps(2);}
      else if(/pigeonhole|counting|double counting/.test(title)){note('11','Chapter 11: Cardinality Rules');lecture(16,'counting-rules-i','Counting Rules I');lecture(17,'counting-rules-ii','Counting Rules II');ps(8);}
      else if(/partial order|relation/.test(title)){note('07','Chapter 7: Relations and Partial Orders');lecture(11,'relations-partial-orders-and-scheduling','Relations, Partial Orders and Scheduling');ps(6);}
      else if(/graph/.test(title)){note('05','Chapter 5: Graph Theory');lecture(6,'graph-theory-and-coloring','Graph Theory and Coloring');ps(3);}
      else if(!/unseen|mixed|final review|timed/.test(title) && /statement|truth|connective|implication|quantifier|proof|counterexample|parity|contradiction|deduction/.test(title)){note('01','Chapter 1: Propositions');note('02','Chapter 2: Patterns of Proof');lecture(1,'introduction-and-proofs','Introduction and Proofs');ps(1);}
    }else if(subjectId==='combinatorics'){
      if(/recurrence/.test(title)){note('10','Chapter 10: Recurrences');lecture(14,'divide-and-conquer-recurrences','Divide and Conquer Recurrences');lecture(15,'linear-recurrences','Linear Recurrences');ps(7);}
      else{note('11','Chapter 11: Cardinality Rules');lecture(16,'counting-rules-i','Counting Rules I');lecture(17,'counting-rules-ii','Counting Rules II');ps(8);}
    }else if(subjectId==='graphs' && !/shortest|dijkstra|mixed|unseen|timed|final review/.test(title)){
      if(/minimum spanning|kruskal|tree/.test(title)){note('05','Chapter 5: Graph Theory');lecture(8,'graph-theory-ii-minimum-spanning-trees','Graph Theory II: Minimum Spanning Trees');ps(4);}
      else if(/directed|dag|topological/.test(title)){note('06','Chapter 6: Directed Graphs');lecture(10,'graph-theory-iii','Graph Theory III: Directed Acyclic Graphs');ps(6);}
      else if(/partial order|relations/.test(title)){note('07','Chapter 7: Relations and Partial Orders');lecture(11,'relations-partial-orders-and-scheduling','Relations, Partial Orders and Scheduling');ps(6);}
      else if(/bipartite|two-colour|two-color|odd-cycle|coloring/.test(title) || (weekIndex<4 && /vertex|edge|graph|bfs|dfs|component|cycle|path/.test(title))){note('05','Chapter 5: Graph Theory');lecture(6,'graph-theory-and-coloring','Graph Theory and Coloring');ps(3);}
    }
    return notes.length||lectures.length||sets.length?{notes:notes,lectures:lectures,sets:sets}:null;
  }
  var BOOK_LINKS = {
    logic:'https://www.mheducation.com/highered/product/discrete-mathematics-and-its-applications-rosen.html',
    combinatorics:'https://www.mheducation.com/highered/product/discrete-mathematics-and-its-applications-rosen.html',
    probability:'https://probabilitybook.net/',
    graphs:'https://cses.fi/book.pdf',
    dp:'https://cses.fi/book.pdf',
    coding:'https://cses.fi/book.pdf'
  };
  function stat110CompanionFor(topicTitle) {
    var title=String(topicTitle||'').toLowerCase(), videos=[];
    function video(n,name,id){videos.push({label:'STAT 110 Lecture '+n+': '+name,url:'https://www.youtube.com/watch?v='+id});}
    if(/sample space|random experiment|outcome|event/.test(title)) video(1,'Probability and Counting','KbB0FjPg0mw');
    if(/addition rule|complement|union|intersection|inclusion-exclusion/.test(title)) video(3,'Birthday Problem, Inclusion-Exclusion and Matching','LZ5Wergp_PA');
    if(/variance|joint/.test(title)){video(12,'Discrete vs. Continuous, Variance and Standard Deviation','TD1N4hxqMzY');video(21,'Covariance, Correlation and Variance of a Sum','xiVWNkQUqKk');}
    else if(/expectation|indicator|linearity/.test(title)) video(10,'Linearity, Negative Binomial and St. Petersburg Paradox','LX2q356N2rU');
    else if(/random variable|bernoulli|binomial/.test(title)){video(7,'Gambler’s Ruin, Random Variables, Bernoulli and Binomial','PNrqCdslGi4');video(8,'Random Variables, CDFs, PMFs and Hypergeometric','k2BB0p8byGA');}
    else if(/conditional|bayes|partition|total probability|independence|mutually exclusive|multiplication rule/.test(title)){video(4,'Conditional Probability, Independence and Bayes’ Rule','P7NE4WF8j-Q');video(5,'Law of Total Probability and Conditional Independence','JzDvVgNDxo8');}
    return videos;
  }

  function dailyTasksForWeek(week,day){
    var topic=function(id){var item=week.topics.find(function(entry){return entry[0]===id;});return item?item[1]:'the assigned topic';};
    var p=topic('probability'),logic=topic('logic'),comb=topic('combinatorics'),graph=topic('graphs'),dp=topic('dp'),coding=topic('coding');
    switch(day.id){
      case 'mon':return ['Probability: study "'+p+'" from the assigned STAT 110 chapter and lecture in its checklist (about 60 min).','Probability: work through 2 guided examples, then solve 2 exercises without notes (about 40 min).','Logical reasoning: complete the named Rosen section, MIT written notes and video for "'+logic+'" (about 35 min).','Logical reasoning: complete the named MIT problem set’s proof exercises for this topic; write full proofs and check counterexamples (about 65 min).'];
      case 'tue':return ['Combinatorics: read the named Rosen section and MIT counting notes for "'+comb+'" (about 60 min).','Combinatorics: solve 4 counting exercises; state whether order/repetition matters and explain overcounting checks (about 40 min).','C++: practise the implementation skills required by "'+coding+'" (about 35 min).','C++ / implementation: solve 2 independent problems; compile and test boundary cases (about 65 min).'];
      case 'wed':return ['Graph theory: study "'+graph+'" using the named Handbook / CP-Algorithms sections in its checklist (about 60 min).','Graph theory: trace the method on a small example; record its invariant and time complexity (about 35 min).','Combinatorics: work through "'+comb+'" examples and verify small cases by enumeration (about 45 min).','Solve the linked CSES graph tasks and one independent counting problem without an editorial (about 60 min).'];
      case 'thu':return ['Dynamic programming: study "'+dp+'"; write the state, base case and transition before coding (about 60 min).','Dynamic programming: dry-run the recurrence on 3 small inputs and check boundary cases (about 35 min).','Dynamic programming: implement and test the technique for "'+dp+'" (about 50 min).','Logical reasoning: solve 2 proof / deduction exercises for "'+logic+'" and justify every step (about 55 min).'];
      case 'fri':return ['Probability: solve 3 independent problems on "'+p+'"; define events or random variables explicitly (about 55 min).','Graph theory: solve 3 independent problems on "'+graph+'"; choose the method from the constraints (about 55 min).','Mixed practice: solve one unseen problem using a key observation from this week (about 50 min).','Review every failed attempt; record the cause and the corrected reasoning (about 40 min).'];
      default:return ['Take a timed mixed contest or the week’s assessment (up to 150 min).','Upsolve missed problems without copying the editorial; write the missing observation first (about 40 min).','Update the problem-review log and write next week’s two highest-priority repair tasks (about 20 min).'];
    }
  }



  // Surface due Codeforces revisions inside today's workload without creating
  // another checklist or progress store. The existing revision queue remains
  // the only place where a re-solve result is recorded.
  var todayReviewRenderToken = 0;
  function renderTodayReviewSummary() {
    var host = $('today-panel');
    if (!host) return;
    var token = ++todayReviewRenderToken;
    learningIntelligencePromise.then(function (api) {
      if (!api || token !== todayReviewRenderToken || !host.isConnected) return;
      var stored;
      try {
        stored = JSON.parse(localStorage.getItem('limitless.competition.codeforces-learning.v1') || 'null');
      } catch (_) { return; }
      if (!stored || !Array.isArray(stored.attempts) || !stored.attempts.length) return;
      var now = Date.now();
      var analysis = api.analyzeCompetitionLearning(state.problemLog, state.revisionAttempts, now, stored.attempts);
      var candidates = analysis.revision.filter(function (item) { return item.courseId === 'codeforces'; });
      if (!candidates.length) return;
      var due = candidates.filter(function (item) { return item.dueAt <= now; });
      var next = candidates.filter(function (item) { return item.dueAt > now; })
        .sort(function (a, b) { return a.dueAt - b.dueAt; })[0];
      var summary = document.createElement('div');
      summary.className = 'today-review-summary';
      var copy = document.createElement('span');
      copy.textContent = due.length
        ? due.length + ' Codeforces problem' + (due.length === 1 ? '' : 's') + ' due for revision today'
        : 'No Codeforces reviews due today' + (next ? ' · Next review ' + new Date(next.dueAt).toLocaleDateString() : '');
      var link = document.createElement('a');
      link.href = '#codeforces-revision';
      link.textContent = due.length ? 'Review due problems ↗' : 'View review schedule ↗';
      summary.appendChild(copy);
      summary.appendChild(link);
      host.appendChild(summary);
    }).catch(function () {});
  }

  // A compact daily view reuses the exact week-plan task keys. It is a second
  // view of the same checklist, not a separate progress store.
  function renderToday() {
    var el = $('today-panel');
    if (!el) return;
    renderTodayReviewSummary();
    var today = new Date();
    today.setHours(0,0,0,0);
    var start = new Date(state.startDate + 'T00:00:00');
    var target = new Date(state.targetDate + 'T00:00:00');
    var dateLabel = today.toLocaleDateString(undefined, { weekday:'long', day:'numeric', month:'long' });
    function note(title, message) {
      el.innerHTML = '<div class="today-head"><span class="today-label">TODAY · ' + esc(dateLabel.toUpperCase()) + '</span><h3>' + esc(title) + '</h3></div><p class="today-note">' + esc(message) + '</p>';
    }
    if (!Number.isFinite(start.getTime())) return note('Set a valid start date', 'Daily tasks appear here once the campaign start date is valid.');
    if (today < start) return note('Campaign has not started', 'Daily tasks begin on ' + start.toLocaleDateString(undefined, { weekday:'long', day:'numeric', month:'long' }) + '.');
    if (Number.isFinite(target.getTime()) && today > target) return note('Target date has passed', 'Update the target date above if the competition schedule has changed.');

    var wi = currentWeekIndex();
    var dayIds = [null, 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    var dayId = dayIds[today.getDay()];
    if (!dayId) return note('Rest or light revision', 'Sunday has no completion target. Use it for recovery or optional review.');
    var day = DAILY_PLAN.find(function (item) { return item.id === dayId; });
    if (!day || !WEEKS[wi]) return note('No daily plan available', 'Check the campaign dates and weekly roadmap.');
    var week = WEEKS[wi];
    var tasks = dailyTasksForWeek(week, day);
    var keyPrefix = 'w' + (wi + 1) + '-exec2-' + day.id + '-';
    var done = tasks.filter(function (_, index) { return !!state.dayChecks[keyPrefix + index]; }).length;
    var focus = day.subjects.length ? day.subjects.map(function (id) {
      var topic = week.topics.find(function (entry) { return entry[0] === id; });
      return topic ? topic[1] : id;
    }).join(' + ') : 'Mixed contest + upsolving';
    el.innerHTML = '<div class="today-head"><span class="today-label">TODAY · ' + esc(dateLabel.toUpperCase()) + ' · WEEK ' + (wi + 1) + '</span>' +
      '<h3>' + esc(day.day + ' · ' + focus) + '</h3><span class="today-count">' + done + ' / ' + tasks.length + ' done</span></div>' +
      '<div class="today-progress-track"><span style="width:' + Math.round(done / tasks.length * 100) + '%"></span></div>' +
      '<div class="today-task-list">' + tasks.map(function (task, index) {
        var key = keyPrefix + index;
        return '<label class="daily-task"><input type="checkbox" data-today-task="' + key + '" ' + (state.dayChecks[key] ? 'checked' : '') + '><span>' + esc(task) + '</span></label>';
      }).join('') + '</div>' +
      '<button type="button" class="text-action today-open-week" data-open-current-week>Open Week ' + (wi + 1) + ' in the roadmap ↓</button>';
    el.querySelectorAll('[data-today-task]').forEach(function (input) {
      input.addEventListener('change', function () {
        state.dayChecks[input.dataset.todayTask] = input.checked;
        persist();
        renderToday();
        renderWeeks();
      });
    });
    var openWeekButton = el.querySelector('[data-open-current-week]');
    if (openWeekButton) openWeekButton.addEventListener('click', function () {
      var card = $('week-list').querySelector('[data-week-index="' + wi + '"]');
      if (!card) return;
      card.open = true;
      var schedule = card.querySelector('[data-week-compartment="w' + (wi + 1) + '-schedule"]');
      if (schedule) schedule.open = true;
      card.scrollIntoView({ behavior:'smooth', block:'start' });
    });
  }
  // Chapter-level assignments: the weekly topic is tied to a named source chapter
  // and a concrete set of exercises/problems. Checkboxes use the existing persisted
  // dayChecks store, so progress survives reloads and remains backward-compatible.
  var REFERENCE_GUIDE = {
    logic: {
      book:'Kenneth Rosen, Discrete Mathematics and Its Applications (8th ed.)',
      sections:['Ch. 1: §1.1–1.8 Logic and proofs','Ch. 5: §5.1–5.4 Mathematical induction','Ch. 6: §6.1–6.5 Counting','Ch. 9–10: Relations and graph theory'],
      link:'https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-fall-2010/pages/readings/',
      practice:['MIT 6.042J Mathematics for Computer Science: read the matching lecture notes and complete its associated problem set','Write a complete proof for each selected claim; check counterexamples and edge cases']
    },
    combinatorics: {
      book:'Kenneth Rosen, Discrete Mathematics and Its Applications (8th ed.)',
      sections:['Ch. 6: §6.1–6.5 Basic counting, permutations and combinations','Ch. 8: §8.1–8.5 Recurrence relations and advanced counting'],
      link:'https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-fall-2010/pages/readings/',
      practice:['MIT 6.042J: complete the counting / pigeonhole / recurrence problem set matching this week','For every count, state whether order matters and explain why there is no overcounting']
    },
    probability: {
      book:'Blitzstein & Hwang, Introduction to Probability (2nd ed.)',
      sections:['Ch. 1: Probability and counting','Ch. 2: Conditional probability','Ch. 3: Random variables and distributions','Ch. 4: Expectation','Ch. 5: Variance and joint distributions'],
      link:'https://projects.iq.harvard.edu/stat110/home',
      practice:['Harvard STAT 110 Strategic Practice and Homework: complete the problems under the matching concept in the official problem-set index, then attempt the corresponding homework problems','Blitzstein & Hwang, Introduction to Probability (2nd ed.): complete the end-of-chapter exercises for the assigned chapter; define the sample space / conditioning event / random variable explicitly']
    },
    graphs: {
      book:'Competitive Programmer’s Handbook (Antti Laaksonen)',
      sections:['Ch. 5: Graph algorithms — representations, traversal, components, paths and trees','CP-Algorithms: BFS, DFS, topological sorting, shortest paths, DSU and spanning trees'],
      link:'https://cses.fi/book/book.pdf',
      practice:['CSES Graph Algorithms: solve the named tasks listed for this topic below','Implement the algorithm from a blank file and state its time complexity']
    },
    dp: {
      book:'Competitive Programmer’s Handbook (Antti Laaksonen)',
      sections:['Ch. 6: Dynamic programming — introductory, grid, knapsack and optimization patterns','CP-Algorithms: Dynamic Programming'],
      link:'https://cses.fi/book/book.pdf',
      practice:['CSES Dynamic Programming: solve the named tasks listed for this topic below','For every problem, write state, transition, base case, iteration order and complexity before coding']
    },
    coding: {
      book:'Competitive Programmer’s Handbook (Antti Laaksonen) + LearnCpp',
      sections:['Ch. 2: Programming techniques','Ch. 3: Data structures','Ch. 4: Sorting and searching'],
      link:'https://cses.fi/book/book.pdf',
      practice:['Implement the week’s data structure / algorithm without copying a template','Compile with warnings; test minimum, maximum, duplicate and boundary inputs']
    }
  };
  // LearnCpp assignments are explicit per roadmap week. Chapter/section numbers
  // follow the current LearnCpp table of contents; CP-specific STL gaps are linked separately.
  var LEARNCPP_WEEKLY = [
    {sections:['1.1–1.5: Program structure, variables, initialization and cin/cout','2.1–2.6: Functions, parameters, return values and local scope','4.4–4.6, 4.9–4.12: Integer types, fixed-width integers, bool, if and casts','8.2, 8.8, 8.10–8.11: if, while, for, break and continue','16.2, 16.8: std::vector and range-based for loops'],extra:['Practise reading input, processing test cases and printing exact output.']},
    {sections:['5.7: std::string basics','13.7–13.10: Structs, aggregate initialization, passing and returning structs','16.2–16.4, 16.8: std::vector, passing vectors and range-based loops','18.2–18.3: Iterators and standard-library algorithms (LearnCpp marks this chapter under construction)'],extra:['For std::sort, std::pair, std::map and std::set, use the linked cppreference pages; LearnCpp does not provide a complete current tutorial for these CP library tools.']},
    {sections:['2.1–2.6: Function decomposition and parameters','12.3–12.6: References and pass-by-reference / const reference','13.7–13.10: Structs and adjacency-list edge records','16.2, 16.8: Vector-backed adjacency lists','20.3: Recursion'],extra:['For std::stack and std::queue, use the linked cppreference container-adaptor references.']},
    {sections:['16.2–16.4, 16.8: Vector construction, passing vectors and traversal','20.3: Recursion and call-stack behaviour','9.1–9.3: Testing and common semantic errors'],extra:['Implement visited arrays, queues and adjacency lists with std::vector; use cppreference for std::queue.']},
    {sections:['8.8, 8.10–8.11: Loop control for greedy scans','13.7–13.10: Structs for intervals and tasks','16.2, 16.8: Vectors and traversal','18.2–18.3: Iterators and standard-library algorithms (under construction)'],extra:['Use cppreference std::sort documentation for the exact sorting API and complexity; prove the greedy choice separately.']},
    {sections:['4.4–4.6: Signed integers, fixed-width types and size_t','10.1–10.8: Type conversions, narrowing, aliases and auto','11.1–11.5: Function overloading and default arguments','20.6–20.7: Lambda expressions and captures'],extra:['Use a comparator with std::sort; consult cppreference for std::sort and comparator requirements. Check integer bounds before arithmetic.']},
    {sections:['13.7–13.10: Structs and edge records','16.2–16.4: Vectors and passing large containers','11.6–11.9: Function templates (only the basics needed to read STL interfaces)'],extra:['LearnCpp does not teach std::priority_queue in its main current chapters. Read the linked cppreference priority_queue page and practise min-heap/max-heap comparators.']},
    {sections:['11.6–11.9: Function templates and template arguments','12.5–12.6: Pass by reference and const reference','20.6–20.7: Lambdas and captures','3.1–3.5: Syntax/semantic errors and debugging strategy'],extra:['Re-implement vector traversal, sorting, binary search and common container operations without copying a template.']},
    {sections:['13.7–13.10: Structs, member access and passing structs','12.5–12.6: References for DSU operations','16.2, 16.8, 16.10: Vector, traversal, resizing and capacity','4.4–4.6: Integer types and index types'],extra:['Use cppreference std::sort for coordinate compression; DSU itself is an algorithm to implement, not an STL container.']},
    {sections:['20.3: Recursion','13.7–13.10: Structs for weighted edges and tree data','16.2, 16.8: Vector adjacency lists and traversal','12.5–12.6: References and const references'],extra:['Use cppreference std::sort for Kruskal edge ordering; implement parent/depth arrays and traversal yourself.']},
    {sections:['4.4–4.6: Integer ranges and fixed-width types','9.1–9.3: Testing, code coverage and semantic errors','3.2–3.5: Debugging process and tactics'],extra:['For each solution, compare the brute-force and optimised implementations and verify the stated complexity.']},
    {sections:['3.1–3.10: Syntax/semantic errors, debugging strategy, breakpoints, watches and call stack','9.1–9.3: Testing, code coverage and common semantic errors'],extra:['Classify each failed problem as wrong idea, missed observation, complexity, boundary or implementation error.']},
    {sections:['3.2–3.5: Debugging process and tactics','9.1–9.6: Testing, semantic errors, assertions and error detection','4.4–4.6: Integer types and size_t'],extra:['Turn each recurring bug into a minimal test case; re-solve the original problem without looking at the accepted code.']},
    {sections:['8.2, 8.8, 8.10–8.11: Conditions, loops and loop control','16.2, 16.8: Vectors and range-based loops','2.1–2.6: Functions and decomposition','3.2–3.5, 9.1–9.3: Debugging and testing'],extra:['No new language topic this week: practise selecting the correct existing tool under time pressure.']},
    {sections:['8.2, 8.8, 8.10–8.11: Control flow under timed conditions','16.2, 16.8: Vector construction and traversal','2.1–2.6: Function decomposition','3.2–3.5, 9.1–9.3: Debugging and test discipline'],extra:['Prepare and reuse your own short, tested C++ starter template; do not add unfamiliar features during the simulation.']},
    {sections:['4.4–4.6: Integer types and bounds','8.8, 8.10–8.11: Loop control','16.2, 16.8: Vector and traversal','3.2–3.5, 9.1–9.3: Light debugging and testing review'],extra:['Do not start a new chapter. Review only the syntax and STL operations used in your final practice problems.']}
  ];
  function learnCppWeek(weekIndex){return LEARNCPP_WEEKLY[Math.min(weekIndex,LEARNCPP_WEEKLY.length-1)];}
  var LEARNCPP_STL_LINKS = {
    sort:'https://en.cppreference.com/w/cpp/algorithm/sort',
    map:'https://en.cppreference.com/w/cpp/container/map',
    set:'https://en.cppreference.com/w/cpp/container/set',
    queue:'https://en.cppreference.com/w/cpp/container/queue',
    stack:'https://en.cppreference.com/w/cpp/container/stack',
    priority_queue:'https://en.cppreference.com/w/cpp/container/priority_queue'
  };
  var CSES_TASKS = {
    graphs:[
      ['Building Roads','Message Route','Building Teams'],
      ['Counting Rooms','Labyrinth','Round Trip'],
      ['Course Schedule','Course Schedule II','Longest Flight Route'],
      ['Shortest Routes I','Shortest Routes II','High Score'],
      ['Road Reparation','Road Construction','Flight Routes'],
      ['Planets and Kingdoms','Flight Routes Check','Road Construction']
    ],
    dp:[
      ['Dice Combinations','Minimizing Coins','Coin Combinations I'],
      ['Coin Combinations II','Removing Digits','Grid Paths'],
      ['Book Shop','Array Description','Counting Towers'],
      ['Edit Distance','Rectangle Cutting','Money Sums'],
      ['Removal Game','Two Sets II','Projects'],
      ['Elevator Rides','Counting Tilings','Increasing Subsequence']
    ],
    coding:[
      ['Weird Algorithm','Missing Number','Repetitions'],
      ['Increasing Array','Permutations','Number Spiral'],
      ['Distinct Numbers','Apartments','Ferris Wheel'],
      ['Concert Tickets','Restaurant Customers','Movie Festival'],
      ['Sum of Two Values','Maximum Subarray Sum','Stick Lengths'],
      ['Playlist','Towers','Traffic Lights']
    ]
  };
  var CSES_TASK_LINKS = {
    'Weird Algorithm':1068,'Missing Number':1083,'Repetitions':1069,
    'Increasing Array':1094,'Permutations':1070,'Number Spiral':1071,
    'Distinct Numbers':1621,'Apartments':1084,'Ferris Wheel':1090,
    'Concert Tickets':1091,'Restaurant Customers':1619,'Movie Festival':1629,
    'Sum of Two Values':1640,'Maximum Subarray Sum':1643,'Stick Lengths':1074,
    'Playlist':1141,'Towers':1073,'Traffic Lights':1163,
    'Building Roads':1666,'Message Route':1667,'Building Teams':1668,
    'Counting Rooms':1192,'Labyrinth':1193,'Round Trip':1669,
    'Course Schedule':1679,'Course Schedule II':2534,'Longest Flight Route':1680,
    'Shortest Routes I':1671,'Shortest Routes II':1672,'High Score':1673,
    'Road Reparation':1675,'Road Construction':1676,'Flight Routes':1196,
    'Planets and Kingdoms':1683,'Flight Routes Check':1682,
    'Dice Combinations':1633,'Minimizing Coins':1634,'Coin Combinations I':1635,
    'Coin Combinations II':1636,'Removing Digits':1637,'Grid Paths':1638,
    'Book Shop':1158,'Array Description':1746,'Counting Towers':2413,
    'Edit Distance':1639,'Rectangle Cutting':1744,'Money Sums':1745,
    'Removal Game':1097,'Two Sets II':1093,'Projects':1140,
    'Elevator Rides':1653,'Counting Tilings':2181,'Increasing Subsequence':1145
  };

  function referenceFor(subjectId, weekIndex, topicTitle) {
    var guide = REFERENCE_GUIDE[subjectId], title = String(topicTitle || '').toLowerCase();
    var sectionIndex = Math.min(guide.sections.length - 1, Math.floor(weekIndex / 4));
    if (subjectId === 'logic') {
      sectionIndex = /induction|invariant|parity/.test(title) ? 1 : /pigeonhole|counting/.test(title) ? 2 : /graph/.test(title) ? 3 : 0;
    } else if (subjectId === 'combinatorics') {
      sectionIndex = /recurrence/.test(title) ? 1 : 0;
    } else if (subjectId === 'probability') {
      sectionIndex = /conditional|bayes|partition/.test(title) ? 1 : /expectation|indicator|linearity/.test(title) ? 3 : /variance|joint/.test(title) ? 4 : /random variable|bernoulli|binomial|distribution/.test(title) ? 2 : 0;
    }
    var items=[],mit=mitCompanionFor(subjectId,title,weekIndex);
    if(subjectId==='graphs'||subjectId==='dp'||subjectId==='coding'){
      var bank=CSES_TASKS[subjectId],group=bank[Math.min(bank.length-1,Math.floor(weekIndex/3))];
      items=group.map(function(name){return 'CSES: '+name;});
      if(mit&&subjectId==='graphs')items.push('MIT 6.042J '+mit.sets.map(function(set){return set.label;}).join(' / ')+': complete every question in this MIT problem set and justify the algorithm choice.');
    }else if(subjectId==='logic'||subjectId==='combinatorics'){
      if(mit){
        var setNames=mit.sets.map(function(set){return set.label;}).join(' / ');
        items=['MIT 6.042J '+setNames+': complete every question in this MIT problem set; show every proof or counting argument.'];
      }
      if(guide.practice[1])items.push(guide.practice[1]);
    }else items=guide.practice.slice();
    if (weekIndex >= 8 && (subjectId === 'logic' || subjectId === 'combinatorics' || subjectId === 'probability')) {
      items.push('Re-solve 3 previously missed questions without notes; write a one-paragraph justification for each');
    }
    if (weekIndex >= 12) items.push('Complete a 45–60 minute unseen mixed set and log every error');
    var section = guide.sections[sectionIndex];
    if (!section) throw new Error('Missing reference section for subject: ' + subjectId);
    return { guide:guide, section:section, items:items };
  }
  function renderTopicAssignments(topic,wi,ti){
    var subjectId=topic[0],ref=referenceFor(subjectId,wi,topic[1]),companion=mitCompanionFor(subjectId,topic[1],wi),statVideos=subjectId==='probability'?stat110CompanionFor(topic[1]):[];
    var baseKey='w'+(wi+1)+'-v2-ref-'+ti,chapterKey=baseKey+'-read';
    var reading='<label class="reference-task"><input type="checkbox" data-day-task="'+chapterKey+'" '+(state.dayChecks[chapterKey]?'checked':'')+'><span><b>Read:</b> '+esc(ref.guide.book)+' — '+esc(ref.section)+'</span></label>';
    var mitChecks='';
    if(companion){
      var noteNames=companion.notes.map(function(item){return item.label;}).join('; ');
      var lectureNames=companion.lectures.map(function(item){return item.label;}).join('; ');
      var noteKey=baseKey+'-mit-notes',videoKey=baseKey+'-mit-video';
      mitChecks+='<label class="reference-task"><input type="checkbox" data-day-task="'+noteKey+'" '+(state.dayChecks[noteKey]?'checked':'')+'><span><b>MIT written notes:</b> read '+esc(noteNames)+' (text notes, not a video).</span></label>';
      if(companion.lectures.length)mitChecks+='<label class="reference-task"><input type="checkbox" data-day-task="'+videoKey+'" '+(state.dayChecks[videoKey]?'checked':'')+'><span><b>MIT video lecture:</b> watch '+esc(lectureNames)+'.</span></label>';
    }
    // Exact problem-set references: keep the assignment label and the actual source link together.
    var tasks=ref.items.map(function(item,index){
      var key=baseKey+'-q'+index, taskName=item.replace(/^CSES:\s*/,'');
      var taskId=item.indexOf('CSES: ')===0?CSES_TASK_LINKS[taskName]:null;
      var taskLabel='';
      if(taskId){
        taskLabel='<a href="https://cses.fi/problemset/task/'+taskId+'" target="_blank" rel="noopener noreferrer">'+esc(taskName)+' — CSES Problemset ↗</a>';
      }else if(subjectId==='probability'){
        if(/Strategic Practice and Homework/.test(item)){
          taskLabel=esc(item)+' <a href="https://stat110.hsites.harvard.edu/strategic-practice-problems" target="_blank" rel="noopener noreferrer">[official STAT 110 problem sets] ↗</a>';
        }else{
          taskLabel=esc(item)+' <a href="https://probabilitybook.net/" target="_blank" rel="noopener noreferrer">[official textbook and chapter exercises] ↗</a>';
        }
      }else if(item.indexOf('MIT 6.042J ')===0 && companion && companion.sets.length){
        var setLinks=companion.sets.map(function(set){return '<a href="'+set.url+'" target="_blank" rel="noopener noreferrer">'+esc(set.label)+' ↗</a>';}).join(' · ');
        taskLabel=esc(item)+' — '+setLinks;
      }else{
        taskLabel=esc(item);
      }
      return '<label class="reference-task"><input type="checkbox" data-day-task="'+key+'" '+(state.dayChecks[key]?'checked':'')+'><span>'+taskLabel+'</span></label>';
    }).join('');
    var resourceLinks=[];
    if(BOOK_LINKS[subjectId]) resourceLinks.push({label:subjectId==='coding'?'Book — Competitive Programmer’s Handbook':'Book — '+ref.guide.book,url:BOOK_LINKS[subjectId]});
    if(subjectId==='coding') resourceLinks.push({label:'C++ lessons — LearnCpp',url:'https://www.learncpp.com/'});
    if(companion){
      companion.notes.forEach(function(item){resourceLinks.push({label:'MIT written notes — '+item.label,url:item.url});});
      companion.lectures.forEach(function(item){resourceLinks.push({label:'MIT video — '+item.label,url:item.url});});
      companion.sets.forEach(function(item){resourceLinks.push({label:item.label+' — exercises',url:item.url});});
    }
    if(subjectId==='probability') {
      resourceLinks.push({label:'Harvard STAT 110 — Strategic Practice and Homework problem sets (official index)',url:'https://stat110.hsites.harvard.edu/strategic-practice-problems'});
      resourceLinks.push({label:'Blitzstein & Hwang — textbook and chapter exercises',url:'https://probabilitybook.net/'});
      resourceLinks.push({label:'Harvard STAT 110 course materials',url:'https://stat110.hsites.harvard.edu/'});
      statVideos.forEach(function(item){resourceLinks.push({label:'Video — '+item.label,url:item.url});});
    } else if(!companion) resourceLinks.push({label:'Open primary reference',url:ref.guide.link});
    var links=resourceLinks.map(function(item){return '<a href="'+item.url+'" target="_blank" rel="noopener noreferrer">'+esc(item.label)+' ↗</a>';}).join('<span class="resource-separator"> · </span>');
    var statChecks=statVideos.map(function(item,index){
      var key=baseKey+'-stat-video-'+index;
      return '<label class="reference-task"><input type="checkbox" data-day-task="'+key+'" '+(state.dayChecks[key]?'checked':'')+'><span><b>Harvard STAT 110 video:</b> watch '+esc(item.label)+'.</span></label>';
    }).join('');
    return '<div class="topic-assignment"><div class="assignment-heading">Exact reading, lecture and problem assignment</div><div class="assignment-source assignment-resource-links">'+links+'</div>'+reading+mitChecks+statChecks+tasks+'</div>';
  }

  function renderWeeklyResourceShelf(week, weekIndex) {
    var groups = {};
    week.topics.forEach(function(topic) {
      var subjectId=topic[0], ref=referenceFor(subjectId,weekIndex,topic[1]), companion=mitCompanionFor(subjectId,topic[1],weekIndex);
      var book=ref.guide.book, key=book;
      if(!groups[key]) groups[key]={book:book,url:ref.guide.link,sections:[],notes:[],lectures:[],sets:[]};
      var group=groups[key];
      if(group.sections.indexOf(ref.section)===-1) group.sections.push(ref.section);
      if(companion){
        companion.notes.concat([]).forEach(function(item){if(!group.notes.some(function(x){return x.url===item.url;}))group.notes.push(item);});
        companion.lectures.forEach(function(item){if(!group.lectures.some(function(x){return x.url===item.url;}))group.lectures.push(item);});
        companion.sets.forEach(function(item){if(!group.sets.some(function(x){return x.url===item.url;}))group.sets.push(item);});
      }
      if(subjectId==='coding'){
        var cppLinks=[];
        if(/sorting|comparator|prefix sums|coordinate|sequence/i.test(topic[1]))cppLinks.push({label:'cppreference — std::sort',url:LEARNCPP_STL_LINKS.sort});
        if(/maps\/sets|frequency|sorting/i.test(topic[1])){cppLinks.push({label:'cppreference — std::map',url:LEARNCPP_STL_LINKS.map});cppLinks.push({label:'cppreference — std::set',url:LEARNCPP_STL_LINKS.set});}
        if(/queues|stacks|BFS|DFS/i.test(topic[1])){cppLinks.push({label:'cppreference — std::queue',url:LEARNCPP_STL_LINKS.queue});cppLinks.push({label:'cppreference — std::stack',url:LEARNCPP_STL_LINKS.stack});}
        if(/Priority queues|Dijkstra/i.test(topic[1]))cppLinks.push({label:'cppreference — std::priority_queue',url:LEARNCPP_STL_LINKS.priority_queue});
        if(!groups.LearnCpp){} 
        var learnKey='LearnCpp';
        if(!groups[learnKey]){var cppWeek=learnCppWeek(weekIndex);groups[learnKey]={book:'LearnCpp — C++ language reference',url:'https://www.learncpp.com/',sections:cppWeek.sections.concat(cppWeek.extra.map(function(note){return 'CP-specific note: '+note;})),notes:[],lectures:[],sets:[],extraLinks:[]};}
        cppLinks.forEach(function(item){if(!groups[learnKey].extraLinks.some(function(x){return x.url===item.url;}))groups[learnKey].extraLinks.push(item);});
      }
      if(subjectId==='probability' && !group.lectures.some(function(x){return x.url==='https://projects.iq.harvard.edu/stat110/online-learning';})){
        group.lectures.push({label:'STAT 110 video lectures',url:'https://projects.iq.harvard.edu/stat110/online-learning'});
      }
      if(subjectId==='probability'){
        var statSetUrl='https://stat110.hsites.harvard.edu/strategic-practice-problems';
        if(!group.sets.some(function(x){return x.url===statSetUrl;})){
          group.sets.push({label:'STAT 110 Strategic Practice and Homework — topic-matched problem sets',url:statSetUrl});
        }
      }
    });
    var cards=Object.keys(groups).map(function(key,groupIndex){
      var g=groups[key], resourceCheckKey='w'+(weekIndex+1)+'-resource-'+groupIndex, resourceChecked=!!state.resourceChecks[resourceCheckKey];
      var sectionHtml=g.sections.map(function(section){return '<li>'+esc(section)+'</li>';}).join('');
      var notesHtml=g.notes.map(function(x){return '<a href="'+x.url+'" target="_blank" rel="noopener noreferrer">'+esc(x.label)+'</a>';}).join('');
      var lectureHtml=g.lectures.map(function(x){return '<a href="'+x.url+'" target="_blank" rel="noopener noreferrer">'+esc(x.label)+'</a>';}).join('');
      var setsHtml=g.sets.map(function(x){return '<a href="'+x.url+'" target="_blank" rel="noopener noreferrer">'+esc(x.label)+'</a>';}).join('');
      var extraLinksHtml=(g.extraLinks||[]).map(function(x){return '<a href="'+x.url+'" target="_blank" rel="noopener noreferrer">'+esc(x.label)+'</a>';}).join('');
      return '<article class="weekly-resource-card"><div class="weekly-resource-book"><strong>'+esc(g.book)+'</strong><label class="resource-completion"><input type="checkbox" data-resource-check="'+resourceCheckKey+'" '+(resourceChecked?'checked':'')+'><span>Reading completed</span></label><a href="'+g.url+'" target="_blank" rel="noopener noreferrer">Open book / primary reference ↗</a></div>' +
        '<div class="weekly-resource-sections"><b>Read this week</b><ul>'+sectionHtml+'</ul></div>'+
        (notesHtml?'<div class="weekly-resource-links"><b>Written notes</b>'+notesHtml+'</div>':'')+
        (lectureHtml?'<div class="weekly-resource-links"><b>Video lectures</b>'+lectureHtml+'</div>':'')+
        (setsHtml?'<div class="weekly-resource-links"><b>Problem sets</b>'+setsHtml+'</div>':'')+(extraLinksHtml?'<div class="weekly-resource-links"><b>C++ library references</b>'+extraLinksHtml+'</div>':'')+'</article>';
    }).join('');
    return '<section class="weekly-resource-shelf" aria-label="Books and learning resources for this week"><h4>Books &amp; learning resources for this week</h4><p>Start here: these are the references and exact sections used by this week’s plan. Matching video lectures and MIT problem sets are placed beside the relevant book.</p><div class="weekly-resource-grid">'+cards+'</div></section>';
  }

  var MISTAKE_TYPES = [
    ['conceptual','Conceptual gap'],['observation','Missed observation'],['mathematical','Mathematical / derivation error'],
    ['implementation','Implementation error'],['time-management','Time-management error']
  ];
  var DIFFICULTY_BANDS = [
    'Basic application','Multiple-concept application','Non-obvious observation','Mathematical derivation','Unseen competition-level'
  ];
  function normalizeConceptKey(subject, concept) {
    var normalized = String(concept || '').trim().toLowerCase()
      .replace(/[^a-z0-9+#]+/g,' ').trim().replace(/\s+/g,' ');
    if (!normalized) return '';
    return String(subject || 'Other').trim().toLowerCase() + '|' + normalized;
  }
  var learningRenderToken = 0;
  function renderLearningSystem() {
    var token = ++learningRenderToken;
    var categories={};MISTAKE_TYPES.forEach(function(item){categories[item[0]]=0;});
    var subjects={},concepts={};
    state.problemLog.forEach(function(problem){
      if(problem.mistakeType && categories[problem.mistakeType]!==undefined)categories[problem.mistakeType]++;
      var subject=String(problem.subject||'Other').trim()||'Other';
      subjects[subject]=(subjects[subject]||0)+1;
      var concept=String(problem.concept||'').trim();
      var conceptKey=normalizeConceptKey(subject,concept);
      if(conceptKey){
        if(!concepts[conceptKey]) concepts[conceptKey]={label:concept,subject:subject,count:0};
        concepts[conceptKey].count++;
      }
    });
    var categoryRows=MISTAKE_TYPES.map(function(item){
      return '<div class="insight-row"><span>'+item[1]+'</span><strong>'+categories[item[0]]+'</strong></div>';
    }).join('');
    var repeatedConcepts=Object.keys(concepts).map(function(key){return concepts[key];})
      .filter(function(item){return item.count>1;})
      .sort(function(a,b){return b.count-a.count;}).slice(0,3);
    var conceptRows=repeatedConcepts.map(function(item){
      return '<div class="insight-row"><span>'+esc(item.label)+' · '+esc(item.subject)+'</span><strong>'+item.count+' logs</strong></div>';
    }).join('');
    var repeat=Object.keys(subjects).sort(function(a,b){return subjects[b]-subjects[a];})[0];
    var topMistake=MISTAKE_TYPES.slice().sort(function(a,b){return categories[b[0]]-categories[a[0]];})[0];
    var repair=repeatedConcepts.length
      ?'Recurring concept: '+repeatedConcepts[0].label+' ('+repeatedConcepts[0].count+' logs). Re-solve two problems using this concept without notes, then try one unfamiliar variation.'
      :topMistake&&categories[topMistake[0]]>0
        ?'Most frequent issue: '+topMistake[1]+'. Revisit the underlying topic and solve two fresh questions before increasing difficulty.'
        :(repeat?'Most logged practice subject: '+repeat+'. Add underlying concepts to reveal repeated weak spots.':'Log problems with a mistake category and underlying concept to identify recurring weaknesses.');
    $('mistake-analytics').innerHTML='<div class="insight-grid"><div><strong>'+state.problemLog.length+'</strong><small>problem reviews logged</small></div><div><strong>'+state.problemLog.filter(function(p){return p.outcome==='independent';}).length+'</strong><small>independent first solves</small></div><div><strong>'+state.revisionAttempts.length+'</strong><small>revision attempts recorded</small></div></div><div class="mistake-breakdown"><h4>Mistake patterns</h4>'+categoryRows+'</div>'+(conceptRows?'<div class="mistake-breakdown"><h4>Repeated concepts</h4>'+conceptRows+'</div>':'')+'<p class="repair-suggestion">'+esc(repair)+'</p><div id="concept-learning-insights"></div>';
    $('revision-queue').innerHTML='<p class="empty-state">Updating your revision schedule…</p>';
    $('revision-summary').textContent='Calculating…';
    $('revision-upcoming').textContent='Revision dates are based on recorded re-solve attempts.';
    learningIntelligencePromise.then(function(api){
      if(token!==learningRenderToken)return;
      if(!api){
        $('revision-queue').innerHTML='<p class="empty-state">Adaptive revision is temporarily unavailable. Your problem history remains saved.</p>';
        $('revision-summary').textContent='Unavailable';
        return;
      }
      var now=Date.now();
      var analysis=api.analyzeCompetitionLearning(state.problemLog,state.revisionAttempts,now);
      var byId={};
      state.problemLog.forEach(function(problem){byId[String(problem.id)]=problem;});
      var due=analysis.revision.filter(function(item){return item.dueAt<=now;});
      var upcoming=analysis.revision.filter(function(item){return item.dueAt>now;})
        .sort(function(a,b){return a.dueAt-b.dueAt;});
      $('revision-summary').textContent=due.length+' due · '+upcoming.length+' scheduled';
      $('revision-upcoming').textContent=upcoming.length
        ?'Next review: '+new Date(upcoming[0].dueAt).toLocaleDateString()+' — '+(byId[upcoming[0].questionId]||{}).name
        :'No future reviews scheduled';
      $('revision-queue').innerHTML=due.length
        ?(due.map(function(item){
          var problem=byId[item.questionId];
          if(!problem)return '';
          return '<article class="revision-item"><div><strong>'+esc(problem.name)+'</strong><small>'+esc(problem.subject)+' · '+item.failures+' unsuccessful attempt(s) · '+(item.overdueDays?'overdue by '+item.overdueDays+' day(s)':'due now')+'</small></div><div class="revision-actions"><button type="button" class="action-button" data-revision-result="correct" data-problem-id="'+esc(problem.id)+'">Solved independently</button><button type="button" class="action-button secondary-button" data-revision-result="incorrect" data-problem-id="'+esc(problem.id)+'">Still stuck</button></div></article>';
        }).join('')||'<p class="empty-state">No reviews due. Unresolved problems enter the queue after one day.</p>')
        :'<p class="empty-state">No reviews due. Unresolved problems enter the queue after one day.</p>';
      $('revision-queue').querySelectorAll('[data-revision-result]').forEach(function(button){
        button.addEventListener('click',function(){
          if (button.disabled) return;
          button.disabled = true;
          state.revisionAttempts.push({
            id:'revision-'+String(Date.now())+'-'+Math.random().toString(36).slice(2,7),
            problemId:button.dataset.problemId,
            date:new Date().toISOString(),
            outcome:button.dataset.revisionResult,
            mistakeType:button.dataset.revisionResult === 'incorrect' ? (state.problemLog.find(function(problem){return problem.id === button.dataset.problemId;}) || {}).mistakeType || '' : ''
          });
          persist();
          renderLearningSystem();
        });
      });
    }).catch(function(){
      if(token!==learningRenderToken)return;
      $('revision-queue').innerHTML='<p class="empty-state">Could not calculate the adaptive revision schedule. Your saved problem history is safe.</p>';
      $('revision-summary').textContent='Unavailable';
    });
    renderSharedConceptInsights();
  }
  var sharedInsightRenderToken = 0;
  function renderSharedConceptInsights() {
    var host = $('concept-learning-insights');
    if (!host) return;
    var token = ++sharedInsightRenderToken;
    Promise.all([learningIntelligencePromise, practiceRecommendationsPromise]).then(function (modules) {
      var api = modules[0], practiceApi = modules[1];
      if (!api || token !== sharedInsightRenderToken) return;
      var codeforcesAttempts = [];
      try {
        var synced = JSON.parse(localStorage.getItem('limitless.competition.codeforces-learning.v1') || 'null');
        if (synced && Array.isArray(synced.attempts)) codeforcesAttempts = synced.attempts;
      } catch (_) {}
      var analysis = api.analyzeCompetitionLearning(state.problemLog, state.revisionAttempts, Date.now(), codeforcesAttempts);
      var masteryRows = analysis.mastery.slice(0, 6).map(function (item) {
        var label = item.status === 'insufficient-data' ? 'Building baseline' :
          item.status === 'developing' ? 'Developing' :
          item.status === 'secure' ? 'Secure' : 'Mastered';
        return '<div class="insight-row"><span>' + esc(item.label) + '<small>' +
          item.attempts + ' attempts · ' + Math.round(item.accuracy * 100) +
          '% weighted accuracy · ' + item.independentAttempts + ' independent</small></span><strong>' +
          label + '</strong></div>';
      }).join('');
      var nextSteps = analysis.weakConcepts.slice(0, 3).map(function (item) {
        var recommendations = practiceApi ? practiceApi.getPracticeRecommendations(item.subjectId, item.label) : {codeforces:[],cses:[]};
        var links = recommendations.codeforces.concat(recommendations.cses).map(function (link) {
          return '<a href="' + esc(link.url) + '" target="_blank" rel="noopener noreferrer">' + esc(link.label) + ' ↗</a>';
        }).join(' · ');
        return '<div class="concept-practice-row"><div class="insight-row"><span>' + esc(item.label) + '</span><strong>' +
          (item.status === 'insufficient-data' ? 'Need more evidence' : 'Practise next') + '</strong></div>' +
          (links ? '<div class="concept-practice-links">' + links + '</div>' : '') + '</div>';
      }).join('');
      var mistakeGuidance = {
        conceptual: 'Re-state the definition and its conditions; test it against a counterexample.',
        observation: 'Write the key constraint or invariant before selecting an algorithm.',
        mathematical: 'Derive the equation or transition line by line, then verify boundary cases.',
        implementation: 'Dry-run a minimal case, duplicates and boundary inputs before submitting.',
        'time-management': 'Set a time checkpoint; record the blocker and return after completing easier tasks.'
      };
      var recurringMistakes = analysis.recurringMistakes.slice(0, 3).map(function (item) {
        var recommendations = practiceApi
          ? practiceApi.getPracticeRecommendations(item.subjectId, item.conceptLabel)
          : {codeforces:[],cses:[]};
        var links = recommendations.codeforces.concat(recommendations.cses).map(function (link) {
          return '<a href="' + esc(link.url) + '" target="_blank" rel="noopener noreferrer">' +
            esc(link.label) + ' ↗</a>';
        }).join(' · ');
        var category = item.category.replace(/-/g, ' ');
        var guidance = mistakeGuidance[item.category] || 'Review the reasoning, then solve a fresh problem using the same concept.';
        return '<div class="mistake-repair-row"><div class="insight-row"><span>' +
          esc(item.conceptLabel) + ' · ' + esc(category) +
          '<small>' + item.occurrences + ' recurring occurrence' + (item.occurrences === 1 ? '' : 's') + '</small></span>' +
          '<strong>Repair this</strong></div><p>' + esc(guidance) + '</p>' +
          (links ? '<div class="concept-practice-links">' + links + '</div>' : '') + '</div>';
      }).join('');
      if (token !== sharedInsightRenderToken) return;
      var codeforcesRevisionCandidates = analysis.revision.filter(function (item) {
        return item.courseId === 'codeforces';
      });
      var codeforcesReviews = codeforcesRevisionCandidates.slice(0, 5).map(function (item) {
        var questionUrl = api.getCodeforcesProblemUrl(item.questionId);
        var problemLink = questionUrl
          ? '<a href="' + esc(questionUrl) + '" target="_blank" rel="noopener noreferrer">Open problem ↗</a>'
          : '';
        var dueNow = item.dueAt <= Date.now();
        var dueLabel = dueNow ? 'Due now' : 'Due ' + new Date(item.dueAt).toLocaleDateString();
        var actions = dueNow
          ? '<div class="revision-actions"><button type="button" class="action-button" data-codeforces-revision-result="correct" data-question-id="' + esc(item.questionId) + '">Solved independently</button><button type="button" class="action-button secondary-button" data-codeforces-revision-result="incorrect" data-question-id="' + esc(item.questionId) + '">Still stuck</button></div>'
          : '';
        return '<div class="revision-item"><div class="insight-row"><span>' + esc(item.questionId.replace('codeforces:', '')) +
          '<small>' + item.failures + ' failed attempt(s) · ' + dueLabel + (problemLink ? ' · ' + problemLink : '') +
          '</small></span><strong>' + (dueNow ? 'Review' : 'Scheduled') + '</strong></div>' + actions + '</div>';
      }).join('');
      host.innerHTML = '<div class="mistake-breakdown"><h4>Concept mastery</h4>' +
        (masteryRows || '<p class="empty-state">Add an underlying concept when logging a problem to build concept-level mastery.</p>') +
        '</div>' +
        (nextSteps ? '<div class="mistake-breakdown"><h4>Suggested focus</h4>' + nextSteps + '</div>' : '') +
        (recurringMistakes ? '<div class="mistake-breakdown"><h4>Recurring mistakes · targeted repair</h4>' + recurringMistakes + '</div>' : '') +
        (codeforcesAttempts.length ? '<div class="mistake-breakdown"><h4 id="codeforces-revision">Codeforces revision</h4>' +
          (codeforcesReviews || '<p class="empty-state">No failed Codeforces problems currently need revision.</p>') + '</div>' : '');
      host.querySelectorAll('[data-codeforces-revision-result]').forEach(function (button) {
        button.addEventListener('click', function () {
          if (button.disabled) return;
          button.disabled = true;
          try {
            var questionId = button.dataset.questionId;
            var candidate = codeforcesRevisionCandidates.find(function (item) {
              return item.questionId === questionId;
            });
            var stored = JSON.parse(localStorage.getItem('limitless.competition.codeforces-learning.v1') || 'null');
            if (!candidate || !stored || !Array.isArray(stored.attempts)) {
              throw new Error('The Codeforces learning record is unavailable.');
            }
            var sourceAttempt = stored.attempts.filter(function (attempt) {
              return attempt && attempt.questionId === questionId &&
                attempt.disciplineId === 'competitive-programming' && attempt.courseId === 'codeforces';
            }).sort(function (a, b) { return a.occurredAt - b.occurredAt; }).pop();
            if (!sourceAttempt) throw new Error('The original Codeforces attempt could not be found.');
            var revision = {
              id: 'codeforces:revision:' + String(Date.now()) + ':' + Math.random().toString(36).slice(2, 8),
              disciplineId: sourceAttempt.disciplineId,
              courseId: sourceAttempt.courseId,
              contentId: sourceAttempt.contentId,
              questionId: sourceAttempt.questionId,
              subjectId: 'codeforces',
              conceptIds: Array.isArray(candidate.conceptIds) ? candidate.conceptIds : [],
              outcome: button.dataset.codeforcesRevisionResult,
              occurredAt: Date.now(),
              independent: button.dataset.codeforcesRevisionResult === 'correct',
              hintCount: button.dataset.codeforcesRevisionResult === 'correct' ? 0 : undefined,
              mode: 'revision'
            };
            stored.attempts.push(revision);
            stored.attempts.sort(function (a, b) { return a.occurredAt - b.occurredAt; });
            stored.attempts = stored.attempts.slice(-5000);
            stored.lastSyncAt = Number.isFinite(stored.lastSyncAt) ? stored.lastSyncAt : 0;
            localStorage.setItem('limitless.competition.codeforces-learning.v1', JSON.stringify(stored));
            window.dispatchEvent(new CustomEvent('limitless:codeforces-learning-updated'));
          } catch (error) {
            button.disabled = false;
            var feedback = host.querySelector('[data-codeforces-revision-feedback]');
            if (!feedback) {
              feedback = document.createElement('p');
              feedback.className = 'empty-state';
              feedback.dataset.codeforcesRevisionFeedback = 'true';
              host.appendChild(feedback);
            }
            feedback.textContent = error && error.message
              ? error.message
              : 'Could not save this Codeforces revision result.';
          }
        });
      });
    });
  }

  function renderMockAnalytics() {
    var tagged=state.mocks.filter(function(mock){return mock.subject && mock.subject!=='All subjects' && (Number(mock.oneMax)>0 || Number(mock.twoMax)>0);});
    var rows=SUBJECTS.map(function(subject){
      var subjectMocks=tagged.filter(function(mock){return mock.subject===subject.name;});
      var scored=subjectMocks.reduce(function(total,mock){return total+Number(mock.oneScore||0)+Number(mock.twoScore||0);},0);
      var max=subjectMocks.reduce(function(total,mock){return total+Number(mock.oneMax||0)+Number(mock.twoMax||0);},0);
      var related=state.problemLog.filter(function(p){return p.subject===subject.name;});
      var independent=related.filter(function(p){return p.outcome==='independent';}).length;
      var accuracy=related.length?Math.round(independent/related.length*100):null;
      var timed=related.filter(function(p){return Number(p.time)>0;});
      var averageTime=timed.length?Math.round(timed.reduce(function(total,p){return total+Number(p.time);},0)/timed.length)+' min average':'time not logged';
      return '<div class="subject-analytics-row"><span>'+esc(subject.name)+'</span><strong>'+(max?(scored/max*100).toFixed(1)+'%':'—')+'</strong><small>'+(subjectMocks.length?subjectMocks.length+' tagged tests':'No tagged tests')+' · '+(accuracy===null?'No problem log':accuracy+'% independent first solves')+' · '+averageTime+'</small></div>';
    }).join('');
    var full=state.mocks.filter(function(m){return m.type==='full-format'&&m.oneMax>0&&m.twoMax>0;}).sort(function(a,b){return a.date.localeCompare(b.date);});
    var trend=full.slice(-5).map(function(mock){var pct=(Number(mock.oneScore+mock.twoScore)/Number(mock.oneMax+mock.twoMax)*100);return '<span class="mock-trend-point"><b>'+pct.toFixed(1)+'%</b><small>'+esc(mock.date)+'</small></span>';}).join('');
    $('mock-analytics').innerHTML='<div class="subject-analytics-grid">'+rows+'</div><div class="mock-trend"><h4>Recent full-format score trend</h4>'+(trend||'<p class="empty-state">Record full-format mocks to see score progression. Scores are descriptive, not a qualification prediction.</p>')+'</div>';
  }
  function prerequisiteStatus(weekIndex, topicIndex, topic) {
    if(weekIndex===0) return '';
    var prior=weekIndex-1, priorTopic=WEEKS[prior].topics.findIndex(function(item){return item[0]===topic[0];});
    if(priorTopic<0) return '';
    var value=statusOf(topicKey(prior,priorTopic));
    var label=value==='mastered'?'Mastered':value==='practiced'?'Practiced':value==='learning'?'Learning':'Not yet checked';
    var ready=value==='mastered'||value==='practiced';
    return '<span class="prerequisite-status '+(ready?'is-ready':'needs-review')+'">Previous '+esc(topic[0]==='coding'?'C++':topic[0])+' checkpoint: '+label+(ready?'':' · review before advancing')+'</span>';
  }
  function renderWeekDeliverables(week,weekIndex) {
    var labels=['Complete required reading and lecture resources','Finish the assigned problem set and independent practice','Attempt the weekly assessment or timed mixed set','Review mistakes and schedule unresolved questions'];
    var key='w'+(weekIndex+1),checks=labels.map(function(label,index){
      var id=key+'-exit-'+index,checked=!!state.weekChecks[id];
      return '<label class="deliverable-item"><input type="checkbox" data-week-check="'+id+'" '+(checked?'checked':'')+'><span>'+label+'</span></label>';
    }).join('');
    var done=labels.filter(function(_,index){return !!state.weekChecks[key+'-exit-'+index];}).length;
    var band=weekIndex<3?0:weekIndex<6?1:weekIndex<9?2:weekIndex<12?3:4;
    var holidayUntil=new Date('2027-01-08T00:00:00'),now=new Date();now.setHours(0,0,0,0);
    var timePlan=now<=holidayUntil?'Holiday availability: plan around 5–6 hours/day. The required tasks remain the priority; use remaining time for optional upsolving.':'Regular availability: cap the plan at 3–4 hours/day. Revision replaces part of the practice block rather than adding extra hours.';
    return '<section class="week-deliverables"><div class="deliverable-heading"><div><b>Weekly completion criteria</b><small>Use evidence, not calendar position, to decide whether to move on.</small></div><strong>'+done+'/'+labels.length+'</strong></div>'+checks+'<p class="difficulty-target">Problem difficulty target: <b>'+DIFFICULTY_BANDS[band]+'</b> — independent reasoning matters more than platform rating.</p><p class="workload-guidance">'+timePlan+'</p></section>';
  }


  function renderRoadmapAnalytics() {
    var target = $('roadmap-analytics');
    if (!target) return;
    var phases = ['Foundations','Core concepts','Integrated problem-solving','Competition readiness'];
    var colors = ['#55aaff','#a58aff','#42d6c0','#ffbd62'];
    target.innerHTML = phases.map(function(phase,pi){
      var weeks = WEEKS.map(function(week,wi){return {week:week,index:wi};}).filter(function(item){return item.week.phase===phase;});
      var counts = {'not-started':0,learning:0,practiced:0,mastered:0};
      var total=0,mastered=0;
      weeks.forEach(function(item){
        item.week.topics.forEach(function(topic,ti){
          var status=statusOf(topicKey(item.index,ti));counts[status]++;total++;
          if(status==='mastered')mastered++;
        });
      });
      var pct=total?Math.round(mastered/total*100):0;
      var weekBars=weeks.map(function(item){
        var wTotal=item.week.topics.length;
        var wDone=item.week.topics.filter(function(topic,ti){return statusOf(topicKey(item.index,ti))==='mastered';}).length;
        var height=wTotal?Math.max(4,wDone/wTotal*100):4;
        return '<button type="button" class="phase-week-bar" data-phase-week="' + item.index + '" title="Week ' + (item.index+1) + ': ' + wDone + ' of ' + wTotal + ' mastered" aria-label="Open week ' + (item.index+1) + ', ' + wDone + ' of ' + wTotal + ' topics mastered"><span style="height:' + height + '%"></span><small>' + (item.index+1) + '</small></button>';
      }).join('');
      var donut=masteryDonut(counts,total,pct,phase);
      return '<article class="phase-analytics-card phase-tone-' + pi + '"><div class="phase-analytics-head"><span class="phase-index">PHASE 0' + (pi+1) + '</span><span class="phase-analytics-name">' + esc(phase) + '</span></div><div class="phase-analytics-main">' + donut + '<div><strong>' + mastered + ' / ' + total + '</strong><small>topics mastered</small><span class="phase-progress-label">' + pct + '% complete</span></div></div><div class="phase-week-chart" role="group" aria-label="' + esc(phase) + ' weekly mastery bar chart">' + weekBars + '</div><div class="phase-chart-legend"><span><i></i> Mastered topics by week</span><small>WEEK</small></div></article>';
    }).join('');
    target.querySelectorAll('[data-phase-week]').forEach(function(button){
      button.addEventListener('click',function(){
        var index=Number(button.dataset.phaseWeek);
        var cards=$('week-list').querySelectorAll('.week-card');
        var card=cards[index];
        if(card){card.open=true;card.scrollIntoView({behavior:'smooth',block:'center'});}
      });
    });
  }

  function renderWeeks() {
    renderRoadmapAnalytics();
    var openWeeks = {};
    var openCompartments = {};
    var openTopicStudies = {};
    var openDailyDays = {};
    $('week-list').querySelectorAll('.week-card').forEach(function (details, index) { openWeeks[index] = details.open; });
    $('week-list').querySelectorAll('[data-topic-study]').forEach(function (details) {
      openTopicStudies[details.getAttribute('data-topic-study')] = details.open;
    });
    $('week-list').querySelectorAll('[data-daily-detail]').forEach(function (details) {
      openDailyDays[details.getAttribute('data-daily-detail')] = details.open;
    });
    $('week-list').querySelectorAll('[data-week-compartment]').forEach(function (details) {
      var compartmentKey = details.getAttribute('data-week-compartment');
      // All compartments start collapsed on first render. Once opened, retain
      // the user's choice when a checkbox or mastery change re-renders weeks.
      openCompartments[compartmentKey] = details.open;
    });
    $('week-list').innerHTML = WEEKS.map(function (week, wi) {
      var statusOptions = function (key) {
        return MASTERY.map(function (option) {
          return '<option value="' + option.value + '" ' + (statusOf(key) === option.value ? 'selected' : '') + '>' + option.label + '</option>';
        }).join('');
      };
      var subjectFilter = $('roadmap-subject-filter').value;
      var executionOrder=['probability','logic','combinatorics','coding','graphs','dp'];
      var selectedTopics=week.topics.map(function(topic,ti){return {topic:topic,index:ti};})
        .filter(function(item){return subjectFilter==='all'||item.topic[0]===subjectFilter;})
        .sort(function(a,b){return executionOrder.indexOf(a.topic[0])-executionOrder.indexOf(b.topic[0]);});
      var topics = selectedTopics.map(function (item) {
        var topic = item.topic, ti = item.index;
        var key = topicKey(wi,ti);
        var subjectName = topic[0] === 'coding' ? 'C++ / Implementation' : SUBJECTS.find(function (s) { return s.id === topic[0]; }).name;
        return '<div class="roadmap-topic"><details class="topic-study-detail" data-topic-study="' + key + '" ' + (openTopicStudies[key] ? 'open' : '') + '><summary class="topic-study-summary"><span class="topic-study-heading"><strong>' + esc(topic[1]) + '</strong><small>' + subjectName + '</small></span><span class="topic-study-chevron" aria-hidden="true">⌄</span></summary><div class="roadmap-topic-copy">'+prerequisiteStatus(wi,ti,topic)+'<span class="topic-resources">' + topicResourceLinks(topic[0], wi) + '</span>' + renderTopicAssignments(topic, wi, ti) + '</div></details>' +
          '<select class="mastery-select" aria-label="Mastery status for ' + esc(topic[1]) + '" data-mastery="' + key + '">' + statusOptions(key) + '</select></div>';
      }).join('') || '<p class="roadmap-empty">No topic checkpoint is assigned to this subject in this week.</p>';
      var days=DAILY_PLAN.map(function(day){
        var dayKey='w'+(wi+1)+'-exec2-'+day.id,dayTasks=dailyTasksForWeek(week,day);
        var focus=day.subjects.length?day.subjects.map(function(id){var item=week.topics.find(function(entry){return entry[0]===id;});return item?item[1]:id;}).join(' + '):'Mixed contest + upsolving';
        var tasks=dayTasks.map(function(task,ti){var key=dayKey+'-'+ti,checked=!!state.dayChecks[key];return '<label class="daily-task"><input type="checkbox" data-day-task="'+key+'" '+(checked?'checked':'')+'><span>'+esc(task)+'</span></label>';}).join('');
        var done=dayTasks.filter(function(_,ti){return !!state.dayChecks[dayKey+'-'+ti];}).length;
        return '<details class="daily-day" data-daily-detail="'+dayKey+'" '+(openDailyDays[dayKey] ? 'open' : '')+'><summary><span>'+day.day+'</span><span>'+esc(focus)+'</span><small>'+done+'/'+dayTasks.length+'</small></summary><div class="daily-task-list">'+tasks+'</div></details>';
      }).join('');
      var weekStatuses = selectedTopics.map(function (item) { return statusOf(topicKey(wi,item.index)); });
      var mastered = weekStatuses.filter(function (x) { return x === 'mastered'; }).length;
      var weekPct = selectedTopics.length ? Math.round(mastered / selectedTopics.length * 100) : 0;
      var phaseClass = {'Foundations':'foundations','Core concepts':'core','Integrated problem-solving':'integration','Competition readiness':'competition'}[week.phase] || 'foundations';
      var assessment = week.assessment ? '<div class="assessment-note"><strong>Checkpoint</strong><p>' + esc(week.assessment) + '</p></div>' : '';
      var weekKey='w'+(wi+1);
      var compartment=function(id,kind,title,description,content,isOpen){
        var key=weekKey+'-'+id;
        return '<details class="week-compartment compartment-'+kind+'" data-week-compartment="'+key+'" '+(openCompartments[key] || isOpen ? 'open' : '')+'>' +
          '<summary class="week-compartment-summary"><span class="compartment-icon" aria-hidden="true">'+
          (kind==='resources'?'▤':kind==='criteria'?'✓':kind==='schedule'?'◷':'◎')+
          '</span><span class="compartment-copy"><strong>'+title+'</strong><small>'+description+'</small></span><span class="compartment-chevron" aria-hidden="true">⌄</span></summary>' +
          '<div class="week-compartment-body">'+content+'</div></details>';
      };
      var resourcesContent=renderWeeklyResourceShelf(week,wi);
      var criteriaContent=renderWeekDeliverables(week,wi);
      var scheduleContent='<div class="daily-roadmap"><p>Work through Monday to Saturday in this order. Revision reviews are included inside these study blocks. Sunday is rest or light revision.</p>' + days +
        '<div class="daily-day sunday"><strong>Sunday</strong><span>Rest or light revision — no completion target.</span></div></div>';
      var masteryContent='<div class="topic-status-guide">Mark a topic <b>Learning</b> when you can explain it, <b>Practiced</b> when you solve representative problems independently, and <b>Mastered</b> when you solve unseen mixed problems under time and justify the method.</div><div class="roadmap-topic-list">' + topics + '</div>';
      return '<details class="week-card week-phase-' + phaseClass + '" data-week-index="' + wi + '" data-phase="' + esc(week.phase) + '" ' + (openWeeks[wi] === true ? 'open' : '') + '><summary class="week-summary"><span class="week-number">WEEK ' + String(wi+1).padStart(2,'0') + '</span><span class="week-heading-copy"><span class="week-title">' + esc(week.title) + '</span><span class="week-phase">' + esc(week.phase) + '</span></span><span class="week-progress-wrap"><span class="week-progress">' + mastered + ' / ' + selectedTopics.length + ' mastered</span><span class="week-progress-track"><i style="width:' + weekPct + '%"></i></span></span><span class="week-chevron" aria-hidden="true">⌄</span></summary>' +
        '<div class="week-content"><p class="week-objective">' + esc(week.objective) + '</p>' + assessment +
        '<div class="week-compartment-grid">' +
        compartment('resources','resources','Learning resources','Books, exact readings, lectures and problem sets',resourcesContent,false) +
        compartment('criteria','criteria','Completion criteria','Four weekly requirements and workload guidance',criteriaContent,false) +
        compartment('schedule','schedule','Weekly execution plan','Daily tasks from Monday to Sunday',scheduleContent,false) +
        compartment('mastery','mastery','Topic mastery','Subject checkpoints, assignments and mastery status',masteryContent,false) +
        '</div></div></details>';
    }).join('');

    $('week-list').querySelectorAll('[data-mastery]').forEach(function (select) {
      select.addEventListener('change', function () {
        state.mastery[select.dataset.mastery] = select.value;
        saveAndRender();
        renderWeeks();
      });
    });
    $('week-list').querySelectorAll('[data-week-check]').forEach(function(input){input.addEventListener('change',function(){state.weekChecks[input.dataset.weekCheck]=input.checked;persist();renderWeeks();});});
    $('week-list').querySelectorAll('[data-resource-check]').forEach(function(input){input.addEventListener('change',function(){state.resourceChecks[input.dataset.resourceCheck]=input.checked;persist();renderWeeks();});});
    $('week-list').querySelectorAll('[data-day-task]').forEach(function (input) {
      input.addEventListener('change', function () {
        state.dayChecks[input.dataset.dayTask] = input.checked;
        persist();
        renderToday();
        renderWeeks();
      });
    });
  }

  function latestRankedFullMock() {
    return state.mocks.filter(function (mock) {
      return mock.type === 'full-format' && Number.isFinite(Number(mock.rank)) && Number(mock.rank) > 0 &&
        Number.isFinite(Number(mock.cohort)) && Number(mock.cohort) >= Number(mock.rank);
    }).sort(function (a,b) { return b.date.localeCompare(a.date); })[0] || null;
  }
  function renderSafety() {
    var cutoff = state.qualificationCutoff === '' ? NaN : Number(state.qualificationCutoff);
    var poolSize = state.qualificationPoolSize === '' ? NaN : Number(state.qualificationPoolSize);
    var buffer = state.rankBuffer === '' ? 0 : Number(state.rankBuffer);
    var validCutoff = Number.isInteger(cutoff) && cutoff > 0;
    var validPool = Number.isInteger(poolSize) && poolSize > 0 && (!validCutoff || poolSize >= cutoff);
    var validBuffer = Number.isInteger(buffer) && buffer >= 0 && (!validCutoff || buffer < cutoff);
    var safeRank = validCutoff && validBuffer ? cutoff - buffer : null;
    var targetPercent = safeRank !== null && validPool ? safeRank / poolSize : null;
    $('safe-target').textContent = targetPercent === null
      ? 'Safe target: enter a valid top-N cutoff and qualifying-pool size'
      : 'Safe target: top ' + safeRank + ' of ' + poolSize + ' (top ' + (targetPercent * 100).toFixed(2) + '%)';
    var mock = latestRankedFullMock();
    if (!validCutoff || !validPool || !validBuffer || !mock) {
      $('safety-result').innerHTML = '<strong>Comparable rank evidence needed</strong><span>' +
        (!validCutoff ? 'Enter a verified qualifying rank limit. ' : '') +
        (!validPool ? 'Enter the qualifying-pool size; it must be at least as large as the cutoff. ' : '') +
        (!validBuffer ? 'The buffer must be a whole number smaller than the cutoff. ' : '') +
        (!mock ? 'Record a full 2.5-hour mock with rank and cohort size. ' : '') +
        'The mock should represent the same selection pool; otherwise treat its percentile only as a rough diagnostic.' +
        '</span>';
      return;
    }
    var mockPercent = Number(mock.rank) / Number(mock.cohort);
    var marginPoints = (targetPercent - mockPercent) * 100;
    var projectedRank = mockPercent * poolSize;
    var status = marginPoints > 0.0001 ? 'Above the safety target' :
      marginPoints >= -0.0001 ? 'On the safety target' :
      mockPercent <= cutoff / poolSize ? 'Inside the qualifying line, buffer not reached' :
      'Outside the qualifying line';
    var detail = 'Mock rank ' + mock.rank + ' of ' + mock.cohort +
      ' = top ' + (mockPercent * 100).toFixed(2) + '%. Estimated equivalent position in the qualifying pool: ' +
      projectedRank.toFixed(0) + ' of ' + poolSize + '. Safe threshold: top ' + safeRank +
      ' (' + (targetPercent * 100).toFixed(2) + '%). Margin: ' +
      (marginPoints >= 0 ? '+' : '') + marginPoints.toFixed(2) + ' percentage points.';
    if (mock.cohortLabel) detail += ' Mock cohort: ' + esc(mock.cohortLabel) + '.';
    if (state.qualificationTrack) detail += ' Selection pool: ' + esc(state.qualificationTrack) + '.';
    if (state.benchmarkSource) detail += ' Cutoff source: ' + esc(state.benchmarkSource) + '.';
    $('safety-result').innerHTML = '<strong>' + status + '</strong><span>' + detail +
      ' This projection assumes the mock cohort is representative; it is not a guaranteed selection result.</span>';
  }

  var problemHistoryRenderToken = 0;
  function renderProblemHistory() {
    var token = ++problemHistoryRenderToken;
    var query=String($('problem-search').value||'').trim().toLowerCase();
    var subject=$('problem-filter-subject').value;
    var outcome=$('problem-filter-outcome').value;
    var band=$('problem-filter-band').value;
    var allRows=state.problemLog.slice();
    var rows = allRows.filter(function(problem){
      if(subject!=='all'&&problem.subject!==subject)return false;
      if(outcome!=='all'&&problem.outcome!==outcome)return false;
      if(band!=='all'&&problem.challengeBand!==band)return false;
      if(query){
        var haystack=[problem.name,problem.subject,problem.difficulty,problem.challengeBand,problem.concept,problem.observation,problem.missed,problem.approach].join(' ').toLowerCase();
        if(haystack.indexOf(query)===-1)return false;
      }
      return true;
    }).sort(function (a, b) { return problemHistoryTimestamp(b) - problemHistoryTimestamp(a); });
    $('problem-catalogue-count').textContent='Showing '+rows.length+' of '+allRows.length+' logged problems';
    $('problem-history').innerHTML = rows.length ? rows.map(function (problem) {
      return '<article class="problem-entry" data-result="' + esc(problem.outcome || 'unknown') + '"><div class="problem-entry-head"><strong>' + esc(problem.name) + '</strong><span>' + esc(problem.subject) + '</span><small>' + esc(formatProblemDateTime(problem)) + '</small><button type="button" data-delete-problem="' + esc(problem.id) + '">Remove</button></div>' +
        (problem.difficulty ? '<p><b>Source difficulty:</b> ' + esc(problem.difficulty) + '</p>' : '') +
        (problem.challengeBand ? '<p><b>Challenge level:</b> ' + esc(problem.challengeBand) + '</p>' : '') +
        (problem.mistakeType ? '<p><b>Mistake category:</b> ' + esc((MISTAKE_TYPES.find(function(x){return x[0]===problem.mistakeType;})||[])[1] || problem.mistakeType) + '</p>' : '') +
        (problem.time ? '<p><b>Total active solving time:</b> ' + esc(problem.time) + ' min across all attempts</p>' : '<p><b>Total active solving time:</b> Not recorded in this legacy entry</p>') +
        (problem.firstSubmissionAt
          ? '<p><b>First submission:</b> ' + esc(formatProblemTimestamp(problem.firstSubmissionAt)) + '</p>'
          : '<p><b>First submission:</b> Not recorded in this legacy entry</p>') +
        (problem.solvedAt
          ? '<p><b>Accepted submission:</b> ' + esc(formatProblemTimestamp(problem.solvedAt)) + '</p><p><b>Elapsed first-to-accepted:</b> ' + formatElapsedDuration(elapsedProblemTime(problem.firstSubmissionAt, problem.solvedAt)) + '</p>'
          : '<p><b>Elapsed first-to-accepted:</b> ' + (problem.outcome === 'unsolved' ? 'Not solved yet' : 'Not recorded in this legacy entry') + '</p>') +
        (Number.isSafeInteger(Number(problem.attempts)) && Number(problem.attempts) >= 1
          ? '<p><b>Attempts made:</b> ' + Number(problem.attempts) + (problem.outcome === 'unsolved' ? ' (unsolved so far)' : ' (including the successful attempt)') + '</p>'
          : '<p><b>Attempts made:</b> Not recorded in this legacy entry</p>') +
        '<p><b>Key observation:</b> ' + esc(problem.observation) + '</p>' +
        (problem.missed ? '<p><b>Missed insight:</b> ' + esc(problem.missed) + '</p>' : '') +
        (problem.concept ? '<p><b>Underlying concept:</b> ' + esc(problem.concept) + '</p>' : '') +
        (problem.approach ? '<p><b>Solution reasoning:</b> ' + esc(problem.approach) + '</p>' : '') +
        '<p><b>Independent re-solve:</b> ' + (problem.resolve === 'yes' ? 'Yes' : problem.resolve === 'no' ? 'Not yet' : 'Not tested') + '</p></article>';
    }).join('') : '<p class="empty-state">No problem reviews recorded yet.</p>';
    practiceRecommendationsPromise.then(function (practiceApi) {
      if (!practiceApi || token !== problemHistoryRenderToken) return;
      $('problem-history').querySelectorAll('.problem-entry').forEach(function (entry, index) {
        var problem = rows[index];
        if (!problem) return;
        var recommendations = practiceApi.getPracticeRecommendations(problem.subject, problem.concept);
        var links = recommendations.codeforces.concat(recommendations.cses);
        if (!links.length) return;
        var section = document.createElement('div');
        section.className = 'problem-practice-links';
        var heading = document.createElement('b');
        heading.textContent = 'Targeted practice: ';
        section.appendChild(heading);
        links.forEach(function (item, linkIndex) {
          if (linkIndex) section.appendChild(document.createTextNode(' · '));
          var anchor = document.createElement('a');
          anchor.href = item.url;
          anchor.target = '_blank';
          anchor.rel = 'noopener noreferrer';
          anchor.textContent = item.label + ' ↗';
          section.appendChild(anchor);
        });
        entry.appendChild(section);
      });
    });
    $('problem-history').querySelectorAll('[data-delete-problem]').forEach(function (button) {
      button.addEventListener('click', function () {
        state.problemLog = state.problemLog.filter(function (problem) { return problem.id !== button.dataset.deleteProblem; });
        state.revisionAttempts = state.revisionAttempts.filter(function (attempt) { return attempt.problemId !== button.dataset.deleteProblem; });
        saveAndRender();
      });
    });
  }

  function renderMockHistory() {
    var rows = state.mocks.slice().sort(function (a,b) { return b.date.localeCompare(a.date); });
    $('mock-history').innerHTML = rows.length ? rows.map(function (mock) {
      if (mock.score !== undefined && mock.oneScore === undefined) {
        return '<article class="mock-row"><span>' + esc(mock.date) + '</span><strong>Legacy score: ' + Number(mock.score).toFixed(1) + '%</strong><span>Old format record · no rank evidence used for safety margin</span><button type="button" data-delete-mock="' + esc(mock.id) + '">Remove</button></article>';
      }
      var one = mock.oneMax > 0 ? (Number(mock.oneScore) / Number(mock.oneMax) * 100).toFixed(1) + '%' : '—';
      var two = mock.twoMax > 0 ? (Number(mock.twoScore) / Number(mock.twoMax) * 100).toFixed(1) + '%' : '—';
      var combined = Number(mock.oneMax || 0) + Number(mock.twoMax || 0);
      var totalScore = Number(mock.oneScore || 0) + Number(mock.twoScore || 0);
      var overall = combined > 0 ? (totalScore / combined * 100).toFixed(1) + '%' : 'Score not entered';
      var rank = mock.rank ? ' · Rank ' + mock.rank + '/' + mock.cohort : '';
      return '<article class="mock-row"><span>' + esc(mock.date) + '<small>' + esc(mock.typeLabel) + (mock.subject && mock.subject !== 'All subjects' ? ' · ' + esc(mock.subject) : '') + '</small></span><span>T1 ' + one + ' · T2 ' + two + '<small>Total: ' + overall + '</small></span><strong>' + (mock.rank ? 'Rank ' + mock.rank : 'No rank') + '</strong><span>' + esc(mock.note || 'No notes') + rank + '</span><button type="button" data-delete-mock="' + esc(mock.id) + '">Remove</button></article>';
    }).join('') : '<p class="empty-state">No assessments recorded yet.</p>';
    $('mock-history').querySelectorAll('[data-delete-mock]').forEach(function (button) {
      button.addEventListener('click', function () {
        state.mocks = state.mocks.filter(function (mock) { return mock.id !== button.dataset.deleteMock; });
        saveAndRender();
      });
    });
  }

  function bindInput(id, key) {
    $(id).addEventListener('change', function () {
      state[key] = $(id).value;
      persist();
      renderOverview();
      renderSafety();
      renderToday();
    });
  }
  function validateScore(score, max, label) {
    var hasScore = score !== '', hasMax = max !== '';
    if (hasScore !== hasMax) throw new Error(label + ': enter both score and maximum, or leave both blank.');
    if (!hasScore) return;
    if (!Number.isFinite(Number(score)) || !Number.isFinite(Number(max)) || Number(score) < 0 || Number(max) <= 0 || Number(score) > Number(max)) {
      throw new Error(label + ': score must be between zero and the maximum.');
    }
  }

  function init() {
    $('start-date').value = state.startDate;
    $('target-date').value = state.targetDate;
    $('qualification-cutoff').value = state.qualificationCutoff;
    $('qualification-pool-size').value = state.qualificationPoolSize;
    $('rank-buffer').value = state.rankBuffer;
    $('qualification-track').value = state.qualificationTrack;
    $('benchmark-source').value = state.benchmarkSource;
    bindInput('start-date','startDate');
    bindInput('target-date','targetDate');
    bindInput('qualification-cutoff','qualificationCutoff');
    bindInput('qualification-pool-size','qualificationPoolSize');
    bindInput('rank-buffer','rankBuffer');
    bindInput('qualification-track','qualificationTrack');
    bindInput('benchmark-source','benchmarkSource');
    ['start-date','target-date'].forEach(function (id) { $(id).addEventListener('change', renderOverview); });
    ['qualification-cutoff','qualification-pool-size','rank-buffer','qualification-track','benchmark-source'].forEach(function (id) { $(id).addEventListener('change', renderSafety); });

    renderOverview();
    renderSubjects();
    renderToday();
    $('roadmap-subject-filter').addEventListener('change', function () {
      var labels = { all:'All five subjects plus C++ / implementation', logic:'Logical Reasoning', combinatorics:'Combinatorics', probability:'Probability', graphs:'Graph Theory', dp:'Dynamic Programming', coding:'C++ / Implementation' };
      $('roadmap-filter-note').textContent = labels[$('roadmap-subject-filter').value] + ': 16 weekly checkpoints, with topic-specific references and independent mastery tracking.';
      renderWeeks();
    });
    renderWeeks();
    renderSafety();
    renderProblemHistory();
    ['problem-search','problem-filter-subject','problem-filter-outcome','problem-filter-band'].forEach(function(id){
      $(id).addEventListener(id==='problem-search'?'input':'change',renderProblemHistory);
    });
    renderMockHistory();
    renderMockAnalytics();
    renderLearningSystem();
    window.addEventListener('limitless:codeforces-learning-updated', renderSharedConceptInsights);

    $('mock-date').value = new Date().toISOString().slice(0,10);
    $('problem-datetime').value = localDateTimeInputValue();
    $('problem-first-submitted-at').value = localDateTimeInputValue();
    $('problem-solved-at').value = localDateTimeInputValue();
    $('problem-attempts').value = '1';
    $('problem-outcome').addEventListener('change', syncProblemSolvedAtField);
    ['problem-first-submitted-at','problem-solved-at'].forEach(function (id) {
      $(id).addEventListener('input', updateProblemElapsedPreview);
      $(id).addEventListener('change', updateProblemElapsedPreview);
    });
    syncProblemSolvedAtField();
    $('problem-form').addEventListener('submit', function (event) {
      event.preventDefault();
      var dateTimeInput = $('problem-datetime').value;
      var recordedAt = new Date(dateTimeInput);
      var attemptsValue = Number($('problem-attempts').value);
      var firstSubmittedInput = $('problem-first-submitted-at').value;
      var firstSubmittedAt = new Date(firstSubmittedInput);
      var solvedInput = $('problem-solved-at').value;
      var solvedAt = solvedInput ? new Date(solvedInput) : null;
      var isUnsolved = $('problem-outcome').value === 'unsolved';
      var activeMinutes = Number($('problem-time').value);
      if (!dateTimeInput || !Number.isFinite(recordedAt.getTime())) {
        $('problem-datetime').reportValidity();
        return;
      }
      if (!firstSubmittedInput || !Number.isFinite(firstSubmittedAt.getTime())) {
        $('problem-first-submitted-at').reportValidity();
        return;
      }
      if (!isUnsolved && (!solvedInput || !solvedAt || !Number.isFinite(solvedAt.getTime()))) {
        $('problem-solved-at').reportValidity();
        return;
      }
      if (!isUnsolved && solvedAt.getTime() < firstSubmittedAt.getTime()) {
        $('problem-solved-at').setCustomValidity('Accepted submission must not be earlier than the first submission.');
        $('problem-solved-at').reportValidity();
        $('problem-solved-at').setCustomValidity('');
        return;
      }
      if (!Number.isSafeInteger(activeMinutes) || activeMinutes < 1) {
        $('problem-time').setCustomValidity('Enter total active solving time in whole minutes (at least 1).');
        $('problem-time').reportValidity();
        $('problem-time').setCustomValidity('');
        return;
      }
      if (!Number.isSafeInteger(attemptsValue) || attemptsValue < 1) {
        $('problem-attempts').setCustomValidity('Enter a whole number of attempts (at least 1).');
        $('problem-attempts').reportValidity();
        $('problem-attempts').setCustomValidity('');
        return;
      }
      state.problemLog.push({
        id:String(Date.now()) + '-' + Math.random().toString(36).slice(2,7),
        date:dateTimeInput.slice(0,10),
        dateTime:recordedAt.toISOString(),
        firstSubmissionAt:firstSubmittedAt.toISOString(),
        solvedAt:!isUnsolved && solvedAt ? solvedAt.toISOString() : null,
        attempts:attemptsValue,
        name:$('problem-name').value.trim(),
        subject:$('problem-subject').value,
        difficulty:$('problem-difficulty').value.trim(),
        challengeBand:$('problem-challenge-band').value,
        mistakeType:$('problem-mistake-type').value,
        outcome:$('problem-outcome').value,
        time:String(activeMinutes),
        observation:$('problem-observation').value.trim() || 'No observation recorded',
        missed:$('problem-missed').value.trim(),
        concept:$('problem-concept').value.trim(),
        approach:$('problem-approach').value.trim(),
        resolve:$('problem-resolve-status').value
      });
      $('problem-form').reset();
      $('problem-datetime').value = localDateTimeInputValue();
      $('problem-first-submitted-at').value = localDateTimeInputValue();
      $('problem-solved-at').value = localDateTimeInputValue();
      $('problem-attempts').value = '1';
      $('problem-time').value = '';
      syncProblemSolvedAtField();
      saveAndRender();
    });

    $('mock-form').addEventListener('submit', function (event) {
      event.preventDefault();
      try {
        validateScore($('mock-one-score').value, $('mock-one-max').value, 'Test 1');
        validateScore($('mock-two-score').value, $('mock-two-max').value, 'Test 2');
        var rank = $('mock-rank').value, cohort = $('mock-cohort').value;
        if ((rank === '') !== (cohort === '')) throw new Error('Enter both mock rank and cohort size, or leave both blank.');
        if (rank !== '' && (!Number.isInteger(Number(rank)) || !Number.isInteger(Number(cohort)) || Number(rank) < 1 || Number(cohort) < Number(rank))) {
          throw new Error('Rank must be at least 1 and cannot exceed the cohort size.');
        }
        var oneScore = $('mock-one-score').value, oneMax = $('mock-one-max').value;
        var twoScore = $('mock-two-score').value, twoMax = $('mock-two-max').value;
        if ($('mock-type').value === 'full-format' && (!oneScore || !twoScore)) throw new Error('A full-format simulation needs scores and maximums for both tests.');
        if (!oneScore && !twoScore && rank === '') throw new Error('Record at least one test score or a comparable rank.');
        var type = $('mock-type').value;
        var typeLabel = type === 'full-format' ? 'Full 2.5-hour simulation' : type === 'subject-test' ? 'Subject test' : 'Weekly diagnostic';
        state.mocks.push({
          id:String(Date.now()) + '-' + Math.random().toString(36).slice(2,7),
          date:$('mock-date').value,
          type:type,
          typeLabel:typeLabel,
          subject:$('mock-subject').value,
          oneScore:oneScore === '' ? '' : Number(oneScore),
          oneMax:oneMax === '' ? '' : Number(oneMax),
          twoScore:twoScore === '' ? '' : Number(twoScore),
          twoMax:twoMax === '' ? '' : Number(twoMax),
          rank:rank === '' ? '' : Number(rank),
          cohort:cohort === '' ? '' : Number(cohort),
          cohortLabel:$('mock-cohort-label').value.trim(),
          note:$('mock-note').value.trim()
        });
        $('mock-form').reset();
        $('mock-date').value = new Date().toISOString().slice(0,10);
        saveAndRender();
      } catch (error) {
        alert(error.message);
      }
    });

    $('export-data').addEventListener('click', async function () {
      var backupApi = await import('./competition-backup.mjs');
      var backup = backupApi.createCompetitionBackup(localStorage, state);
      var blob = new Blob([JSON.stringify(backup,null,2)], {type:'application/json'});
      var url = URL.createObjectURL(blob);
      var anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'limitless-competition-progress.json';
      anchor.click();
      URL.revokeObjectURL(url);
    });
    $('import-data').addEventListener('change', function () {
      var file = $('import-data').files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = async function () {
        try {
          var parsed = JSON.parse(reader.result), incoming = parsed.data || parsed;
          function isRecord(value) {
            return !!value && typeof value === 'object' && !Array.isArray(value);
          }
          if (!isRecord(incoming) || (!isRecord(incoming.mastery) && !isRecord(incoming.completed)) || !Array.isArray(incoming.mocks)) throw new Error('Invalid backup');
          ['mastery','completed','dayChecks','weekChecks','revisionChecks'].forEach(function(key){
            if (incoming[key] !== undefined && !isRecord(incoming[key])) throw new Error('Invalid backup');
          });
          if (incoming.problemLog !== undefined && (!Array.isArray(incoming.problemLog) || incoming.problemLog.some(function(item){
            return !isRecord(item) ||
              (item.dateTime !== undefined && (typeof item.dateTime !== 'string' || !Number.isFinite(Date.parse(item.dateTime)))) ||
              (item.firstSubmissionAt !== undefined && item.firstSubmissionAt !== null && (typeof item.firstSubmissionAt !== 'string' || !Number.isFinite(Date.parse(item.firstSubmissionAt)))) ||
              (item.solvedAt !== undefined && item.solvedAt !== null && (typeof item.solvedAt !== 'string' || !Number.isFinite(Date.parse(item.solvedAt)))) ||
              (item.firstSubmissionAt && item.solvedAt && Date.parse(item.solvedAt) < Date.parse(item.firstSubmissionAt)) ||
              (item.attempts !== undefined && (!Number.isSafeInteger(item.attempts) || item.attempts < 1));
          }))) throw new Error('Invalid backup');
          if (incoming.revisionAttempts !== undefined && (!Array.isArray(incoming.revisionAttempts) || incoming.revisionAttempts.some(function(item){return !isRecord(item) || typeof item.id !== 'string' || !item.id || typeof item.problemId !== 'string' || !item.problemId || typeof item.date !== 'string' || !Number.isFinite(Date.parse(item.date)) || ['correct','incorrect'].indexOf(item.outcome)===-1;}))) throw new Error('Invalid backup');
          if (incoming.mocks.some(function(item){return !isRecord(item) || typeof item.date !== 'string';})) throw new Error('Invalid backup');
          if (!incoming.mastery && incoming.completed) {
            incoming.mastery = {};
            Object.keys(incoming.completed).forEach(function (key) {
              if (incoming.completed[key]) incoming.mastery[key] = 'practiced';
            });
          }
          delete incoming.completed;
          var nextState = Object.assign(cloneDefaults(), incoming);
          var backupApi = await import('./competition-backup.mjs');
          var restored = backupApi.restoreCompetitionBackup(localStorage, STORAGE_KEY, nextState, parsed);
          if (!restored.ok) throw new Error('Could not safely restore all competition backup data.');
          state = nextState;
          location.reload();
        } catch (_) { alert('That file is not a valid Limitless competition backup.'); }
      };
      reader.readAsText(file);
      $('import-data').value = '';
    });
    $('reset-data').addEventListener('click', function () {
      if (!confirm('Reset all competition progress, topic mastery, mock results and settings in this browser? Export a backup first if you may need this data.')) return;
      state = cloneDefaults();
      localStorage.removeItem(STORAGE_KEY);
      location.reload();
    });

    var themeButton = $('theme-toggle');
    function paintThemeButton() {
      themeButton.textContent = document.documentElement.getAttribute('data-theme') === 'light' ? 'Dark mode' : 'Light mode';
    }
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