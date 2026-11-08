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
    problemLog: []
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
      return '<a class="subject-card subject-card-link" href="#roadmap" data-subject-roadmap="' + subject.id + '" aria-label="Open ' + esc(subject.name) + ' roadmap">' +
        '<h3>' + esc(subject.name) + '</h3><p>' + esc(subject.note) + '</p>' +
        '<div class="subject-count"><span>' + counts.mastered + ' / ' + total + ' mastered</span><span>' + pct + '% mastery</span></div>' +
        '<div class="progress-track"><span style="width:' + pct + '%"></span></div>' +
        '<div class="subject-breakdown"><span>' + counts.learning + ' learning</span><span>' + counts.practiced + ' practiced</span><span>' + counts['not-started'] + ' not started</span></div>' +
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
    function note(slug,name){notes.push({label:name,url:mitResource('resources/mit6_042jf10_chap'+slug+'/')});}
    function lecture(n,slug,name){lectures.push({label:'Lecture '+n+': '+name,url:mitResource('resources/lecture-'+n+'-'+slug+'/')});}
    function ps(n){sets.push({label:'Problem Set '+n,url:mitResource('resources/mit6_042jf10_assn'+String(n).padStart(2,'0')+'/')});}
    if(subjectId==='logic'){
      if(/induction/.test(title)){note('03','Chapter 3: Induction');lecture(2,'induction','Induction');lecture(3,'strong-induction','Strong Induction');ps(2);}
      else if(/invariant/.test(title)){note('03','Chapter 3: Induction');lecture(3,'strong-induction','Strong Induction and Invariants');ps(2);}
      else if(/pigeonhole|counting|double counting/.test(title)){note('11','Chapter 11: Cardinality Rules');lecture(16,'counting-rules-i','Counting Rules I');lecture(17,'counting-rules-ii','Counting Rules II');ps(8);}
      else if(/graph|relation|partial order/.test(title)){note('05','Chapter 5: Graph Theory');lecture(6,'graph-theory-and-coloring','Graph Theory and Coloring');ps(3);}
      else if(!/unseen|mixed|final review|timed/.test(title) && /statement|truth|connective|implication|quantifier|proof|counterexample|parity|contradiction|deduction/.test(title)){note('01','Chapter 1: Propositions');note('02','Chapter 2: Patterns of Proof');lecture(1,'introduction-and-proofs','Introduction and Proofs');ps(1);}
    }else if(subjectId==='combinatorics'){
      if(/recurrence/.test(title)){note('10','Chapter 10: Recurrences');lecture(14,'divide-and-conquer-recurrences','Divide and Conquer Recurrences');lecture(15,'linear-recurrences','Linear Recurrences');ps(7);}
      else{note('11','Chapter 11: Cardinality Rules');lecture(16,'counting-rules-i','Counting Rules I');lecture(17,'counting-rules-ii','Counting Rules II');ps(8);}
    }else if(subjectId==='graphs' && !/shortest|dijkstra|mixed|unseen|timed|final review/.test(title)){
      if(/minimum spanning|kruskal|tree/.test(title)){note('05','Chapter 5: Graph Theory');lecture(8,'graph-theory-ii-minimum-spanning-trees','Graph Theory II: Minimum Spanning Trees');ps(4);}
      else if(/directed|dag|topological|partial order|relations/.test(title)){note('06','Chapter 6: Directed Graphs');note('07','Chapter 7: Relations and Partial Orders');lecture(11,'relations-partial-orders-and-scheduling','Relations, Partial Orders and Scheduling');ps(6);}
      else if(weekIndex<4 && /vertex|edge|graph|bfs|dfs|bipartite|component|cycle|path/.test(title)){note('05','Chapter 5: Graph Theory');lecture(6,'graph-theory-and-coloring','Graph Theory and Coloring');ps(3);}
    }
    return notes.length||lectures.length||sets.length?{notes:notes,lectures:lectures,sets:sets}:null;
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

  // Chapter-level assignments: the weekly topic is tied to a named source chapter
  // and a concrete set of exercises/problems. Checkboxes use the existing persisted
  // dayChecks store, so progress survives reloads and remains backward-compatible.
  var REFERENCE_GUIDE = {
    logic: {
      book:'Kenneth Rosen, Discrete Mathematics and Its Applications (8th ed.)',
      sections:['Ch. 1: §1.1–1.8 Logic and proofs','Ch. 5: §5.1–5.4 Mathematical induction','Ch. 6: §6.1–6.5 Counting','Ch. 9–10: Relations and graph theory'],
      link:'https://courses.csail.mit.edu/6.042/spring18/mcs.pdf',
      practice:['MIT 6.042J Mathematics for Computer Science: read the matching lecture notes and complete its associated problem set','Write a complete proof for each selected claim; check counterexamples and edge cases']
    },
    combinatorics: {
      book:'Kenneth Rosen, Discrete Mathematics and Its Applications (8th ed.)',
      sections:['Ch. 6: §6.1–6.5 Basic counting, permutations and combinations','Ch. 8: §8.1–8.5 Recurrence relations and advanced counting'],
      link:'https://courses.csail.mit.edu/6.042/spring18/mcs.pdf',
      practice:['MIT 6.042J: complete the counting / pigeonhole / recurrence problem set matching this week','For every count, state whether order matters and explain why there is no overcounting']
    },
    probability: {
      book:'Blitzstein & Hwang, Introduction to Probability (2nd ed.)',
      sections:['Ch. 1: Probability and counting','Ch. 2: Conditional probability','Ch. 3: Random variables and distributions','Ch. 4: Expectation','Ch. 5: Variance and joint distributions'],
      link:'https://projects.iq.harvard.edu/stat110/home',
      practice:['Harvard STAT 110: solve the end-of-chapter problems for the chapter listed here','Use the matching STAT 110 lecture and problem set; show the sample space / conditioning event / random variable explicitly']
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
  function referenceFor(subjectId, weekIndex, topicTitle) {
    var guide = REFERENCE_GUIDE[subjectId], title = String(topicTitle || '').toLowerCase();
    var sectionIndex = Math.min(guide.sections.length - 1, Math.floor(weekIndex / 4));
    if (subjectId === 'logic') {
      sectionIndex = /induction|invariant|parity/.test(title) ? 1 : /pigeonhole|counting/.test(title) ? 2 : /graph/.test(title) ? 3 : 0;
    } else if (subjectId === 'combinatorics') {
      sectionIndex = /recurrence/.test(title) ? 1 : 0;
    } else if (subjectId === 'probability') {
      sectionIndex = /conditional|bayes|partition/.test(title) ? 1 : /expectation|indicator|random variable/.test(title) ? 3 : /variance|joint/.test(title) ? 4 : 0;
    }
    var items=[],mit=mitCompanionFor(subjectId,title,weekIndex);
    if(subjectId==='graphs'||subjectId==='dp'||subjectId==='coding'){
      var bank=CSES_TASKS[subjectId],group=bank[Math.min(bank.length-1,Math.floor(weekIndex/3))];
      items=group.map(function(name){return 'CSES: '+name;});
      if(mit&&subjectId==='graphs')items.push('MIT 6.042J '+mit.sets.map(function(set){return set.label;}).join(' / ')+': complete every question in this MIT problem set and justify the algorithm choice.');
    }else if(subjectId==='logic'||subjectId==='combinatorics'){
      var setNames=mit?mit.sets.map(function(set){return set.label;}).join(' / '):'the assigned problem set';
      items=['MIT 6.042J '+setNames+': complete every question in this MIT problem set; show every proof or counting argument.'];
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
    var subjectId=topic[0],ref=referenceFor(subjectId,wi,topic[1]),companion=mitCompanionFor(subjectId,topic[1],wi);
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
    var tasks=ref.items.map(function(item,index){var key=baseKey+'-q'+index;return '<label class="reference-task"><input type="checkbox" data-day-task="'+key+'" '+(state.dayChecks[key]?'checked':'')+'><span>'+esc(item)+'</span></label>';}).join('');
    var resourceLinks=[];
    if(companion){
      companion.notes.forEach(function(item){resourceLinks.push({label:'Written notes — '+item.label,url:item.url});});
      companion.lectures.forEach(function(item){resourceLinks.push({label:'Video — '+item.label,url:item.url});});
      companion.sets.forEach(function(item){resourceLinks.push({label:item.label+' — exercises',url:item.url});});
    }else resourceLinks.push({label:'Open primary reference',url:ref.guide.link});
    var links=resourceLinks.map(function(item){return '<a href="'+item.url+'" target="_blank" rel="noopener noreferrer">'+esc(item.label)+' ↗</a>';}).join('<span class="resource-separator"> · </span>');
    return '<div class="topic-assignment"><div class="assignment-heading">Exact reading, lecture and problem assignment</div><div class="assignment-source assignment-resource-links">'+links+'</div>'+reading+mitChecks+tasks+'</div>';
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
      var subjectFilter = $('roadmap-subject-filter').value;
      var executionOrder=['probability','logic','combinatorics','coding','graphs','dp'];
      var selectedTopics=week.topics.map(function(topic,ti){return {topic:topic,index:ti};})
        .filter(function(item){return subjectFilter==='all'||item.topic[0]===subjectFilter;})
        .sort(function(a,b){return executionOrder.indexOf(a.topic[0])-executionOrder.indexOf(b.topic[0]);});
      var topics = selectedTopics.map(function (item) {
        var topic = item.topic, ti = item.index;
        var key = topicKey(wi,ti);
        var subjectName = topic[0] === 'coding' ? 'C++ / Implementation' : SUBJECTS.find(function (s) { return s.id === topic[0]; }).name;
        return '<div class="roadmap-topic"><div class="roadmap-topic-copy"><strong>' + esc(topic[1]) + '</strong><small>' + subjectName + '</small><span class="topic-resources">' + topicResourceLinks(topic[0], wi) + '</span>' + renderTopicAssignments(topic, wi, ti) + '</div>' +
          '<select class="mastery-select" aria-label="Mastery status for ' + esc(topic[1]) + '" data-mastery="' + key + '">' + statusOptions(key) + '</select></div>';
      }).join('') || '<p class="roadmap-empty">No topic checkpoint is assigned to this subject in this week.</p>';
      var days=DAILY_PLAN.map(function(day){
        var dayKey='w'+(wi+1)+'-exec2-'+day.id,dayTasks=dailyTasksForWeek(week,day);
        var focus=day.subjects.length?day.subjects.map(function(id){var item=week.topics.find(function(entry){return entry[0]===id;});return item?item[1]:id;}).join(' + '):'Mixed contest + upsolving';
        var tasks=dayTasks.map(function(task,ti){var key=dayKey+'-'+ti,checked=!!state.dayChecks[key];return '<label class="daily-task"><input type="checkbox" data-day-task="'+key+'" '+(checked?'checked':'')+'><span>'+esc(task)+'</span></label>';}).join('');
        var done=dayTasks.filter(function(_,ti){return !!state.dayChecks[dayKey+'-'+ti];}).length;
        return '<details class="daily-day"><summary><span>'+day.day+'</span><span>'+esc(focus)+'</span><small>'+done+'/'+dayTasks.length+'</small></summary><div class="daily-task-list">'+tasks+'</div></details>';
      }).join('');
      var weekStatuses = selectedTopics.map(function (item) { return statusOf(topicKey(wi,item.index)); });
      var mastered = weekStatuses.filter(function (x) { return x === 'mastered'; }).length;
      var assessment = week.assessment ? '<div class="assessment-note"><strong>Checkpoint</strong><p>' + esc(week.assessment) + '</p></div>' : '';
      return '<details class="week-card" ' + (openWeeks[wi] || wi === 0 ? 'open' : '') + '><summary class="week-summary"><span class="week-number">WEEK ' + String(wi+1).padStart(2,'0') + '</span><span><span class="week-title">' + esc(week.title) + '</span><span class="week-phase">' + esc(week.phase) + '</span></span><span class="week-progress">' + mastered + ' / ' + selectedTopics.length + ' mastered</span></summary>' +
        '<div class="week-content"><p class="week-objective">' + esc(week.objective) + '</p>' + assessment +
        '<div class="daily-roadmap"><h4>Weekly execution plan</h4><p>Work through Monday to Saturday in this order. Each day names the exact topics; linked reading, lecture and problem checklists follow below in the same subject order. Sunday is rest or light revision.</p>' + days +
         '<div class="daily-day sunday"><strong>Sunday</strong><span>Rest or light revision — no completion target.</span></div></div>' +
         '<div class="topic-status-guide">After the daily work, mark each topic: <b>Learning</b> when you can explain it; <b>Practiced</b> when you solve representative problems independently; <b>Mastered</b> when you solve unseen mixed problems under time and justify the method.</div>' +
         '<div class="roadmap-topic-list">' + topics + '</div></div></details>';
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
      return '<article class="problem-entry" data-result="' + esc(problem.outcome || 'unknown') + '"><div class="problem-entry-head"><strong>' + esc(problem.name) + '</strong><span>' + esc(problem.subject) + '</span><small>' + esc(problem.date) + '</small><button type="button" data-delete-problem="' + esc(problem.id) + '">Remove</button></div>' +
        (problem.difficulty ? '<p><b>Source difficulty:</b> ' + esc(problem.difficulty) + '</p>' : '') +
        (problem.time ? '<p><b>Time spent:</b> ' + esc(problem.time) + ' min</p>' : '') +
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
    $('roadmap-subject-filter').addEventListener('change', function () {
      var labels = { all:'All five subjects plus C++ / implementation', logic:'Logical Reasoning', combinatorics:'Combinatorics', probability:'Probability', graphs:'Graph Theory', dp:'Dynamic Programming', coding:'C++ / Implementation' };
      $('roadmap-filter-note').textContent = labels[$('roadmap-subject-filter').value] + ': 16 weekly checkpoints, with topic-specific references and independent mastery tracking.';
      renderWeeks();
    });
    renderWeeks();
    var expandWeeksButton = $('toggle-all-weeks');
    if (expandWeeksButton) {
      expandWeeksButton.addEventListener('click', function () {
        var cards = Array.prototype.slice.call($('week-list').querySelectorAll('.week-card'));
        var shouldOpen = cards.some(function (card) { return !card.open; });
        cards.forEach(function (card) { card.open = shouldOpen; });
        expandWeeksButton.textContent = shouldOpen ? 'Close all weeks' : 'Open all weeks';
        expandWeeksButton.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
      });
    }
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
        outcome:$('problem-outcome').value,
        time:$('problem-time').value,
        observation:$('problem-observation').value.trim() || 'No observation recorded',
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