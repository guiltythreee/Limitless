(function () {
  'use strict';

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
    linkedAccounts: { codeforcesHandle: 'Unwonted_contriver', csesUserId: '386335' }
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
    { id:'mon', day:'Monday', focus:'Probability + Logical Reasoning', tasks:['Probability: learn the week’s concept (about 60 min)','Probability: work through examples and derive steps (about 40 min)','Logical reasoning: one focused exercise set (about 35 min)','Independent problems and error review (about 65 min)'] },
    { id:'tue', day:'Tuesday', focus:'Combinatorics + C++ implementation', tasks:['Combinatorics: learn the week’s counting method (about 60 min)','Combinatorics: guided examples and small-case checks (about 40 min)','C++ implementation or complexity practice (about 35 min)','Independent problems and error review (about 65 min)'] },
    { id:'wed', day:'Wednesday', focus:'Graph Theory + Combinatorics', tasks:['Graph theory: learn the week’s structure/algorithm (about 60 min)','Trace the algorithm on hand-worked examples (about 35 min)','Implement and test the graph algorithm (about 45 min)','Independent graph/counting problems and review (about 60 min)'] },
    { id:'thu', day:'Thursday', focus:'Dynamic Programming + Logical Reasoning', tasks:['DP: define state, base case and transition (about 60 min)','Dry-run recurrence on small inputs (about 35 min)','Implement and test DP solutions (about 50 min)','Logical reasoning and error review (about 55 min)'] },
    { id:'fri', day:'Friday', focus:'Probability + Graph Theory integration', tasks:['Probability: independent problem set (about 55 min)','Graph theory: independent problem set (about 55 min)','Mixed problem requiring a key observation (about 50 min)','Review mistakes and write concise notes (about 40 min)'] },
    { id:'sat', day:'Saturday', focus:'Mixed contest + upsolving', tasks:['Timed mixed contest or weekly assessment (up to 150 min)','Upsolve missed problems without copying the editorial (about 40 min)','Update problem review log and next-week repair list (about 20 min)'] }
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
      if (!merged.linkedAccounts || typeof merged.linkedAccounts !== 'object') merged.linkedAccounts = cloneDefaults().linkedAccounts;
      merged.linkedAccounts = Object.assign(cloneDefaults().linkedAccounts, merged.linkedAccounts);
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
  }
  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
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

  function renderSubjects() {
    $('subject-grid').innerHTML = SUBJECTS.map(function (subject) {
      var counts = { 'not-started':0, learning:0, practiced:0, mastered:0 };
      WEEKS.forEach(function (week, wi) {
        week.topics.forEach(function (topic, ti) {
          if (topic[0] === subject.id) counts[statusOf(topicKey(wi,ti))]++;
        });
      });
      var total = counts['not-started'] + counts.learning + counts.practiced + counts.mastered;
      var pct = total ? Math.round(counts.mastered / total * 100) : 0;
      return '<article class="subject-card"><h3>' + subject.name + '</h3><p>' + subject.note + '</p>' +
        '<div class="subject-count"><span>' + counts.mastered + ' / ' + total + ' mastered</span><span>' + pct + '% mastery</span></div>' +
        '<div class="progress-track"><span style="width:' + pct + '%"></span></div>' +
        '<div class="subject-breakdown"><span>' + counts.learning + ' learning</span><span>' + counts.practiced + ' practiced</span><span>' + counts['not-started'] + ' not started</span></div>' +
        '<a class="subject-link" href="#roadmap">Open roadmap ↓</a></article>';
    }).join('');
  }

  // Topic-level references: keep the learning source beside the exact checkpoint.
  // Links point to stable course/book resources; chapter numbers are omitted because
  // pagination and chapter numbering vary across editions.
  var TOPIC_RESOURCES = {
    logic:[
      {label:'MIT discrete mathematics notes',url:'https://courses.csail.mit.edu/6.042/spring18/mcs.pdf'},
    ],
    combinatorics:[
      {label:'MIT counting & discrete math notes',url:'https://courses.csail.mit.edu/6.042/spring18/mcs.pdf'},
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

  function renderWeeks() {
    var openWeeks = {};
    $('week-list').querySelectorAll('.week-card').forEach(function (details, index) { openWeeks[index] = details.open; });
    $('week-list').innerHTML = WEEKS.map(function (week, wi) {
      var statusOptions = function (key) {
        return MASTERY.map(function (option) {
          return '<option value="' + option.value + '" ' + (statusOf(key) === option.value ? 'selected' : '') + '>' + option.label + '</option>';
        }).join('');
      };
      var topics = week.topics.map(function (topic, ti) {
        var key = topicKey(wi,ti);
        var subjectName = topic[0] === 'coding' ? 'C++ / Implementation' : SUBJECTS.find(function (s) { return s.id === topic[0]; }).name;
        return '<div class="roadmap-topic"><div class="roadmap-topic-copy"><strong>' + esc(topic[1]) + '</strong><small>' + subjectName + '</small><span class="topic-resources">' + topicResourceLinks(topic[0], wi) + '</span></div>' +
          '<select class="mastery-select" aria-label="Mastery status for ' + esc(topic[1]) + '" data-mastery="' + key + '">' + statusOptions(key) + '</select></div>';
      }).join('');
      var days = DAILY_PLAN.map(function (day) {
        var dayKey = 'w' + (wi + 1) + '-' + day.id;
        var tasks = day.tasks.map(function (task, ti) {
          var key = dayKey + '-' + ti;
          var checked = !!state.dayChecks[key];
          return '<label class="daily-task"><input type="checkbox" data-day-task="' + key + '" ' + (checked ? 'checked' : '') + '><span>' + esc(task) + '</span></label>';
        }).join('');
        var done = day.tasks.filter(function (_, ti) { return !!state.dayChecks[dayKey + '-' + ti]; }).length;
        return '<details class="daily-day"><summary><span>' + day.day + '</span><span>' + day.focus + '</span><small>' + done + '/' + day.tasks.length + '</small></summary><div class="daily-task-list">' + tasks + '</div></details>';
      }).join('');
      var weekStatuses = week.topics.map(function (_,ti) { return statusOf(topicKey(wi,ti)); });
      var mastered = weekStatuses.filter(function (x) { return x === 'mastered'; }).length;
      var assessment = week.assessment ? '<div class="assessment-note"><strong>Checkpoint</strong><p>' + esc(week.assessment) + '</p></div>' : '';
      return '<details class="week-card" ' + (openWeeks[wi] || wi === 0 ? 'open' : '') + '><summary class="week-summary"><span class="week-number">WEEK ' + String(wi+1).padStart(2,'0') + '</span><span><span class="week-title">' + esc(week.title) + '</span><span class="week-phase">' + esc(week.phase) + '</span></span><span class="week-progress">' + mastered + ' / ' + week.topics.length + ' mastered</span></summary>' +
        '<div class="week-content"><p class="week-objective">' + esc(week.objective) + '</p>' + assessment +
        '<div class="topic-status-guide">Choose <b>Learning</b> when you can explain the idea; <b>Practiced</b> when you solve representative problems independently; <b>Mastered</b> when you solve unseen mixed problems under time and can justify the method.</div>' +
        '<div class="roadmap-topic-list">' + topics + '</div>' +
        '<div class="daily-roadmap"><h4>Weekly execution plan</h4><p>Complete the actual work for each day. Adjust the topic content to the current week’s syllabus above. Sunday is rest or light revision.</p>' + days +
        '<div class="daily-day sunday"><strong>Sunday</strong><span>Rest or light revision — no completion target.</span></div></div></div></details>';
    }).join('');

    $('week-list').querySelectorAll('[data-mastery]').forEach(function (select) {
      select.addEventListener('change', function () {
        state.mastery[select.dataset.mastery] = select.value;
        saveAndRender();
        renderWeeks();
      });
    });
    $('week-list').querySelectorAll('[data-day-task]').forEach(function (input) {
      input.addEventListener('change', function () {
        state.dayChecks[input.dataset.dayTask] = input.checked;
        persist();
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

  function renderProblemHistory() {
    var rows = state.problemLog.slice().reverse();
    $('problem-history').innerHTML = rows.length ? rows.map(function (problem) {
      return '<article class="problem-entry"><div class="problem-entry-head"><strong>' + esc(problem.name) + '</strong><span>' + esc(problem.subject) + '</span><small>' + esc(problem.date) + '</small><button type="button" data-delete-problem="' + esc(problem.id) + '">Remove</button></div>' +
        (problem.difficulty ? '<p><b>Source difficulty:</b> ' + esc(problem.difficulty) + '</p>' : '') +
        '<p><b>Key observation:</b> ' + esc(problem.observation) + '</p>' +
        (problem.missed ? '<p><b>Missed insight:</b> ' + esc(problem.missed) + '</p>' : '') +
        (problem.concept ? '<p><b>Underlying concept:</b> ' + esc(problem.concept) + '</p>' : '') +
        (problem.approach ? '<p><b>Solution reasoning:</b> ' + esc(problem.approach) + '</p>' : '') +
        '<p><b>Independent re-solve:</b> ' + (problem.resolve === 'yes' ? 'Yes' : problem.resolve === 'no' ? 'Not yet' : 'Not tested') + '</p></article>';
    }).join('') : '<p class="empty-state">No problem reviews recorded yet.</p>';
    $('problem-history').querySelectorAll('[data-delete-problem]').forEach(function (button) {
      button.addEventListener('click', function () {
        state.problemLog = state.problemLog.filter(function (problem) { return problem.id !== button.dataset.deleteProblem; });
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
      return '<article class="mock-row"><span>' + esc(mock.date) + '<small>' + esc(mock.typeLabel) + '</small></span><span>T1 ' + one + ' · T2 ' + two + '<small>Total: ' + overall + '</small></span><strong>' + (mock.rank ? 'Rank ' + mock.rank : 'No rank') + '</strong><span>' + esc(mock.note || 'No notes') + rank + '</span><button type="button" data-delete-mock="' + esc(mock.id) + '">Remove</button></article>';
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

  function renderCodeforcesStats(message, isError) {
    var target = $('cf-account-stats');
    target.textContent = message;
    target.classList.toggle('account-stats-error', !!isError);
  }

  function updateLinkedProfileLinks() {
    var handle = $('cf-handle').value.trim();
    var userId = $('cses-user-id').value.trim();
    $('cf-profile-link').href = 'https://codeforces.com/profile/' + encodeURIComponent(handle || 'Unwonted_contriver');
    $('cses-profile-link').href = 'https://cses.fi/user/' + encodeURIComponent(userId || '386335');
  }

  async function refreshCodeforces(handle) {
    renderCodeforcesStats('Fetching public Codeforces contest statistics…', false);
    try {
      var base = 'https://codeforces.com/api/';
      var responses = await Promise.all([
        fetch(base + 'user.info?handles=' + encodeURIComponent(handle)),
        fetch(base + 'user.rating?handle=' + encodeURIComponent(handle))
      ]);
      if (!responses[0].ok || !responses[1].ok) throw new Error('Codeforces API request failed. Try again shortly.');
      var payloads = await Promise.all(responses.map(function (response) { return response.json(); }));
      if (payloads[0].status !== 'OK' || payloads[1].status !== 'OK') {
        throw new Error((payloads[0].comment || payloads[1].comment || 'Codeforces could not find that handle.'));
      }
      var user = payloads[0].result[0];
      var contests = payloads[1].result || [];
      var bestPlace = contests.reduce(function (best, contest) {
        return Math.min(best, Number(contest.rank) || Infinity);
      }, Infinity);
      var latest = contests.length ? contests[contests.length - 1] : null;
      var rank = user.rank || 'Unrated';
      var peakRank = user.maxRank || '—';
      var currentRating = Number.isFinite(user.rating) ? user.rating : 'Unrated';
      var peakRating = Number.isFinite(user.maxRating) ? user.maxRating : '—';
      var latestChange = latest ? (latest.newRating - latest.oldRating) : null;
      var changeText = latestChange === null ? 'No rated contests yet' : (latestChange > 0 ? '+' : '') + latestChange + ' in latest contest';
      var bestText = Number.isFinite(bestPlace) ? '#' + bestPlace : '—';
      var contestText = contests.length + (contests.length === 1 ? ' contest' : ' contests');
      var updated = latest ? new Date(latest.ratingUpdateTimeSeconds * 1000).toLocaleDateString() : '—';
      $('cf-account-stats').innerHTML =
        '<div class="account-stat-grid">' +
          '<span><small>Current rating</small><strong>' + esc(currentRating) + '</strong></span>' +
          '<span><small>Peak rating</small><strong>' + esc(peakRating) + '</strong></span>' +
          '<span><small>Current rank</small><strong>' + esc(rank) + '</strong></span>' +
          '<span><small>Peak rank</small><strong>' + esc(peakRank) + '</strong></span>' +
          '<span><small>Contests</small><strong>' + esc(contestText) + '</strong></span>' +
          '<span><small>Best place</small><strong>' + esc(bestText) + '</strong></span>' +
        '</div><p class="account-stat-foot">' + esc(changeText) + ' · Last rated contest: ' + esc(updated) + '</p>';
      $('cf-link-state').textContent = 'Connected · refreshed';
      $('cf-link-state').classList.remove('account-state-error');
    } catch (error) {
      $('cf-link-state').textContent = 'Refresh failed';
      $('cf-link-state').classList.add('account-state-error');
      renderCodeforcesStats(error && error.message ? error.message : 'Could not load Codeforces statistics.', true);
    }
  }

  function initLinkedAccounts() {
    $('cf-handle').value = state.linkedAccounts.codeforcesHandle;
    $('cses-user-id').value = state.linkedAccounts.csesUserId;
    updateLinkedProfileLinks();
    $('cf-handle').addEventListener('input', updateLinkedProfileLinks);
    $('cses-user-id').addEventListener('input', updateLinkedProfileLinks);
    $('save-linked-accounts').addEventListener('click', function () {
      var handle = $('cf-handle').value.trim();
      var userId = $('cses-user-id').value.trim();
      if (!handle) {
        $('cf-link-state').textContent = 'Enter a handle';
        $('cf-link-state').classList.add('account-state-error');
        $('cf-handle').focus();
        return;
      }
      if (!/^\\d+$/.test(userId)) {
        $('cses-link-state').textContent = 'Enter a numeric profile ID';
        $('cses-link-state').classList.add('account-state-error');
        $('cses-user-id').focus();
        return;
      }
      state.linkedAccounts = { codeforcesHandle: handle, csesUserId: userId };
      persist();
      updateLinkedProfileLinks();
      $('accounts-sync-note').textContent = 'Handles saved in this browser. Codeforces statistics are refreshed from its public API; CSES opens its public profile.';
      $('cses-link-state').textContent = 'Profile ID saved';
      $('cses-link-state').classList.remove('account-state-error');
      $('cses-account-stats').textContent = 'Profile ID saved. Open the public CSES profile to view total submissions, last activity and language breakdown.';
      refreshCodeforces(handle);
    });
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
    initLinkedAccounts();
    ['start-date','target-date'].forEach(function (id) { $(id).addEventListener('change', renderOverview); });
    ['qualification-cutoff','qualification-pool-size','rank-buffer','qualification-track','benchmark-source'].forEach(function (id) { $(id).addEventListener('change', renderSafety); });

    renderOverview();
    renderSubjects();
    renderWeeks();
    renderSafety();
    renderProblemHistory();
    renderMockHistory();

    $('mock-date').value = new Date().toISOString().slice(0,10);
    $('problem-form').addEventListener('submit', function (event) {
      event.preventDefault();
      state.problemLog.push({
        id:String(Date.now()) + '-' + Math.random().toString(36).slice(2,7),
        date:new Date().toISOString().slice(0,10),
        name:$('problem-name').value.trim(),
        subject:$('problem-subject').value,
        difficulty:$('problem-difficulty').value.trim(),
        observation:$('problem-observation').value.trim(),
        missed:$('problem-missed').value.trim(),
        concept:$('problem-concept').value.trim(),
        approach:$('problem-approach').value.trim(),
        resolve:$('problem-resolve-status').value
      });
      $('problem-form').reset();
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

    $('export-data').addEventListener('click', function () {
      var blob = new Blob([JSON.stringify({ version:2, exportedAt:new Date().toISOString(), data:state },null,2)], {type:'application/json'});
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
      reader.onload = function () {
        try {
          var parsed = JSON.parse(reader.result), incoming = parsed.data || parsed;
          if (!incoming || typeof incoming !== 'object' || (!incoming.mastery && !incoming.completed) || !Array.isArray(incoming.mocks)) throw new Error('Invalid backup');
          if (!incoming.mastery && incoming.completed) {
            incoming.mastery = {};
            Object.keys(incoming.completed).forEach(function (key) {
              if (incoming.completed[key]) incoming.mastery[key] = 'practiced';
            });
          }
          delete incoming.completed;
          state = Object.assign(cloneDefaults(), incoming);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
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