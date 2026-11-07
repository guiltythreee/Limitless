(function () {
  'use strict';
  const STORAGE_KEY = 'limitless.competition.linked-accounts.v1';
  const DEFAULT_HANDLE = 'Unwonted_contriver';
  const milestones = [
    { title:'Pupil', rating:1200, detail:'Build dependable fundamentals and solve common Div. 2 problems independently.' },
    { title:'Specialist', rating:1400, detail:'Strengthen implementation, greedy reasoning and standard data structures.' },
    { title:'Expert', rating:1600, detail:'Develop breadth across graphs, dynamic programming, number theory and data structures.' },
    { title:'Candidate Master', rating:1900, detail:'Handle harder constructive, combinatorial and multi-step problems consistently.' },
    { title:'Master', rating:2100, detail:'Improve proof quality, speed and reliability on advanced problems.' },
    { title:'International Master', rating:2300, detail:'Sustain high-level performance across difficult mixed contests.' },
    { title:'Grandmaster · Red', rating:2400, detail:'The red rank threshold. Peak rating must reach 2400.' }
  ];
  const $ = id => document.getElementById(id);
  let handle = DEFAULT_HANDLE;
  function readHandle() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      if (saved.codeforcesHandle && saved.codeforcesHandle.trim()) handle = saved.codeforcesHandle.trim();
    } catch (_) {}
    $('linked-handle').textContent = handle;
  }
  const ROADMAP_KEY = 'limitless.codeforces-red.training.v1';
  const stages = [
    {name:'Foundations',range:'Below 1200',min:0,max:1199,goal:'Build reliable implementation and core reasoning; stabilise at Pupil (1200).',tasks:[
      'C++ implementation: arrays, strings, vectors, functions, sorting, frequency counting and careful input/output.',
      'Complexity: estimate time and memory from constraints; recognise O(n), O(n log n), O(n²), and integer overflow.',
      'Complete search and simulation: enumerate small spaces, simulate operations and validate ideas with brute force.',
      'Sorting, prefix sums and two pointers: sorting invariants, prefix/range sums and sliding windows.',
      'Greedy fundamentals: prove local choices with an exchange argument or invariant; test counterexamples.',
      'Elementary number theory: GCD, LCM, primes, parity, divisibility, modulo arithmetic and safe multiplication.'
    ]},
    {name:'Specialist toolkit',range:'1200–1399',min:1200,max:1399,goal:'Develop standard data-structure and search techniques; reach Specialist (1400).',tasks:[
      'Binary search: monotonic predicates, binary search on the answer and proof of the search invariant.',
      'STL and ordered structures: map, set, multiset, stack, queue, deque, priority_queue and coordinate compression.',
      'Disjoint Set Union: path compression, union by size/rank, connectivity and Kruskal applications.',
      'String basics and hashing: prefix/suffix frequency, rolling hash, collision caveats and applications.',
      'Prefix function and KMP: compute the prefix function; solve pattern matching and border problems.',
      'Counting and modular arithmetic: combinations, binomial coefficients, modular inverses and counting arguments.'
    ]},
    {name:'Core algorithms',range:'1400–1599',min:1400,max:1599,goal:'Combine graph traversal, dynamic programming and range-query structures; reach Expert (1600).',tasks:[
      'BFS and DFS: connected components, grid traversal, bipartite checking, tree traversal and iterative DFS.',
      'Shortest paths and topological sorting: unweighted BFS, Dijkstra, DAG order and cycle detection.',
      'Dynamic programming foundations: define state, transition, base case and order; practise knapsack, LIS and grid DP.',
      'Number theory toolkit: sieve, prime factorisation, divisor counting, modular exponentiation and congruences.',
      'Fenwick and segment trees: point updates, prefix/range queries, range minimum/sum and structure selection.',
      'Constructive algorithms: build objects satisfying constraints; state invariants and verify edge cases.'
    ]},
    {name:'Advanced reasoning',range:'1600–1899',min:1600,max:1899,goal:'Handle multi-step problems and advanced graph, tree, DP and string techniques; reach Candidate Master (1900).',tasks:[
      'Bitmask DP: subset states, assignment DP, subset transitions and SOS-style reasoning.',
      'Tree algorithms: LCA and binary lifting; ancestor tables, kth ancestor and path queries.',
      'Tree rerooting: derive answers for every root using down/up DP and contribution techniques.',
      'Advanced graphs: SCC, bridges, articulation points, condensation DAGs and Dijkstra variants.',
      'DP optimisation: stronger state design, divide-and-conquer optimisation and convex-hull trick when applicable.',
      'Lazy propagation and offline queries: lazy segment trees, sweep line, coordinate compression and Mo’s algorithm.',
      'String algorithms: Z-function, tries, prefix-function applications and Aho–Corasick concepts.',
      'Game theory: winning/losing states, impartial games, Grundy numbers, mex and Sprague–Grundy theorem.'
    ]},
    {name:'Mastery',range:'1900–2399',min:1900,max:2399,goal:'Build depth across advanced algorithms and mathematics; progress through Master (2100) and International Master (2300).',tasks:[
      'Advanced DP: bitmask/profile DP, digit DP, tree DP, rerooting, optimisation proofs and state compression.',
      'Flows and cuts: residual graphs, max-flow/min-cut, Dinic and modelling constraints as flow.',
      'Matching: bipartite matching, Kuhn, Hopcroft–Karp concepts and assignment modelling.',
      'FFT and NTT: polynomial multiplication, convolution, roots of unity and number-theoretic transform.',
      'Computational geometry: orientation, cross products, segment intersection, convex hull and precision.',
      'Advanced strings: suffix array/automaton concepts, Aho–Corasick, Z-function applications and string DP.',
      'Combinatorics and probability: inclusion–exclusion, generating functions, expectation and counting bijections.',
      'Sprague–Grundy: Nim, mex, Grundy values, disjoint sums and game-state reductions.',
      'Advanced data structures: persistent structures, DSU rollback, sqrt decomposition and range-query trade-offs.',
      'Contest integration: solve unfamiliar 1900–2400 problems, write proofs and analyse failed approaches.'
    ]},
    {name:'Grandmaster',range:'2400+',min:2400,max:9999,goal:'Reach and sustain a peak rating of at least 2400; continually refine breadth, speed and judgement.',tasks:[
      'Contest performance: full rounds, deliberate problem ordering, time management and accuracy.',
      'Advanced algorithm and mathematics depth: identify personal gaps from hard rounds and study exact techniques.',
      'Editorial-to-independent-solve loop: understand the idea, close the editorial, then re-derive and implement.',
      'Long-term review: track rating variance, recurring mistakes, implementation bugs and topic weaknesses.'
    ]}
  ];
  let roadmapState = {checks:{},weekly:{solved:0,contests:0},weeklyManual:{solved:0,contests:0},active:0,ready:[]};
  function loadRoadmap() {
    try { const saved=JSON.parse(localStorage.getItem(ROADMAP_KEY)||'{}'); roadmapState={...roadmapState,...saved,checks:saved.checks||{},weekly:saved.weekly||{solved:0,contests:0},weeklyManual:saved.weeklyManual||{solved:0,contests:0},ready:saved.ready||[],nextBandCounts:saved.nextBandCounts||{}}; if(roadmapState.taskSchemaVersion!==2){roadmapState.legacyChecks=roadmapState.checks;roadmapState.checks={};roadmapState.taskSchemaVersion=2;saveRoadmap();} } catch (_) {}
  }
  function saveRoadmap() { try { localStorage.setItem(ROADMAP_KEY,JSON.stringify(roadmapState)); } catch (_) {} }
  function renderRoadmap(peak) {
    const activeByRating=stages.findIndex(s=>peak>=s.min&&peak<=s.max);
    if(activeByRating>=0 && !roadmapState.userSelected) roadmapState.active=activeByRating;
    roadmapState.active=Math.min(stages.length-1,Math.max(0,roadmapState.active));
    const active=stages[roadmapState.active], done=roadmapState.checks[roadmapState.active]||[];
    $('roadmap-current-stage').textContent=active.name;
    $('roadmap-current-copy').textContent=active.goal;
    $('roadmap-stage-range').textContent=active.range;
    const pct=Math.round(done.length/active.tasks.length*100);
    $('roadmap-stage-progress').textContent=pct+'% complete';
    $('roadmap-stage-bar').style.width=pct+'%';
    $('stage-kicker').textContent='PHASE '+String(roadmapState.active+1).padStart(2,'0');
    $('stage-title').textContent=active.name;
    $('stage-goal').textContent=active.goal;
    $('stage-rating').textContent=active.tags;
    $('task-progress-label').textContent=done.length+' / '+active.tasks.length+' complete';
    $('task-progress-bar').style.width=pct+'%';
    $('stage-task-list').innerHTML=active.tasks.map((task,i)=>'<label class="cr-task '+(done.includes(i)?'is-checked':'')+'"><input type="checkbox" data-task="'+i+'" '+(done.includes(i)?'checked':'')+'><span>'+task+'</span></label>').join('');
    $('roadmap-stage-list').innerHTML=stages.map((s,i)=>'<button type="button" class="cr-stage-tab '+(i===roadmapState.active?'is-active':'')+'" data-stage="'+i+'"><span class="cr-stage-index">'+String(i+1).padStart(2,'0')+'</span><span><b>'+s.name+'</b><small>'+s.range+'</small></span><span class="cr-stage-check">'+(roadmapState.ready.includes(i)?'✓':i===activeByRating?'●':'')+'</span></button>').join('');
    $('weekly-solved').textContent=roadmapState.weekly.solved||0;
    $('weekly-contests').textContent=roadmapState.weekly.contests||0;
    $('mark-stage-done').textContent=roadmapState.ready.includes(roadmapState.active)?'Stage marked ready':'Mark stage ready';
    if($('next-band-count')) $('next-band-count').value=(roadmapState.nextBandCounts||{})[roadmapState.active]||0;
  }
  function bindRoadmap() {
    loadRoadmap();
    document.addEventListener('click',e=>{
      const tab=e.target.closest('[data-stage]');
      if(tab){roadmapState.active=Number(tab.dataset.stage);roadmapState.userSelected=true;saveRoadmap();renderRoadmap(lastPeak);return;}
    });
    $('stage-task-list').addEventListener('change',e=>{
      if(!e.target.matches('[data-task]'))return;
      const list=roadmapState.checks[roadmapState.active]||[],id=Number(e.target.dataset.task);
      roadmapState.checks[roadmapState.active]=e.target.checked?[...new Set([...list,id])]:list.filter(x=>x!==id);
      saveRoadmap();renderRoadmap(lastPeak);
    });
    $('weekly-plus').addEventListener('click',()=>{roadmapState.weeklyManual=roadmapState.weeklyManual||{solved:0,contests:0};roadmapState.weeklyManual.solved=Math.min(999,(roadmapState.weeklyManual.solved||0)+1);roadmapState.weekly.solved=(roadmapState.weekly.solved||0)+1;saveRoadmap();renderRoadmap(lastPeak);});
    $('weekly-minus').addEventListener('click',()=>{roadmapState.weeklyManual=roadmapState.weeklyManual||{solved:0,contests:0};if((roadmapState.weeklyManual.solved||0)>0){roadmapState.weeklyManual.solved--;roadmapState.weekly.solved=Math.max(0,(roadmapState.weekly.solved||0)-1);saveRoadmap();renderRoadmap(lastPeak);}});
    $('contest-log').addEventListener('click',()=>{roadmapState.weeklyManual=roadmapState.weeklyManual||{solved:0,contests:0};roadmapState.weeklyManual.contests=Math.min(99,(roadmapState.weeklyManual.contests||0)+1);roadmapState.weekly.contests=(roadmapState.weekly.contests||0)+1;saveRoadmap();renderRoadmap(lastPeak);});
    $('contest-unlog').addEventListener('click',()=>{roadmapState.weeklyManual=roadmapState.weeklyManual||{solved:0,contests:0};if((roadmapState.weeklyManual.contests||0)>0){roadmapState.weeklyManual.contests--;roadmapState.weekly.contests=Math.max(0,(roadmapState.weekly.contests||0)-1);saveRoadmap();renderRoadmap(lastPeak);}});
    $('next-band-count').addEventListener('change',()=>{roadmapState.nextBandCounts=roadmapState.nextBandCounts||{};roadmapState.nextBandCounts[roadmapState.active]=Math.max(0,Number($('next-band-count').value||0));saveRoadmap();});
    $('mark-stage-done').addEventListener('click',()=>{
      const count=Number($('next-band-count').value||0);
      if(count<10){$('readiness-status').textContent='Solve at least 10 problems from the next rating band independently before marking this stage ready.';return;}
      if((roadmapState.checks[roadmapState.active]||[]).length<stages[roadmapState.active].tasks.length){$('readiness-status').textContent='Complete every skill checklist item before marking this stage ready.';return;}
      if(!roadmapState.ready.includes(roadmapState.active))roadmapState.ready.push(roadmapState.active);
      $('readiness-status').textContent='Readiness criteria met. Stage marked ready.';
      saveRoadmap();renderRoadmap(lastPeak);
    });
    renderRoadmap(lastPeak);
  }
  let lastPeak=0;
  function render(peak) {
    lastPeak=peak;
    renderRoadmap(peak);
    const max = Math.max(0, Math.min(100, ((peak - 800) / (2400 - 800)) * 100));
    $('overall-percent').textContent = Math.round(max) + '%';
    $('overall-bar').style.width = max + '%';
    const next = milestones.findIndex(item => peak < item.rating);
    $('milestone-list').innerHTML = milestones.map((item, index) => {
      const done = peak >= item.rating;
      const active = !done && index === next;
      const status = done ? 'Achieved' : active ? 'Next milestone' : 'Upcoming';
      return '<article class="cr-milestone ' + (done ? 'is-done' : active ? 'is-next' : '') + '">' +
        '<div class="cr-step">' + (done ? '✓' : String(index + 1)) + '</div>' +
        '<div><h3>' + item.title + '</h3><p>' + item.detail + '</p></div>' +
        '<div><div class="cr-threshold">' + item.rating + '</div><div class="cr-status">' + status + '</div></div></article>';
    }).join('');
  }
  async function refresh() {
    readHandle();
    $('sync-status').textContent = 'Refreshing public Codeforces rating data…';
    $('refresh-rating').disabled = true;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    try {
      const base = 'https://codeforces.com/api/';
      const [infoResponse, ratingResponse, statusResponse] = await Promise.all([
        fetch(base + 'user.info?handles=' + encodeURIComponent(handle), {signal: controller.signal}),
        fetch(base + 'user.rating?handle=' + encodeURIComponent(handle), {signal: controller.signal}),
        fetch(base + 'user.status?handle=' + encodeURIComponent(handle) + '&from=1&count=1000', {signal: controller.signal})
      ]);
      if (!infoResponse.ok || !ratingResponse.ok || !statusResponse.ok) throw new Error('Codeforces API request failed.');
      const [info, ratings, submissions] = await Promise.all([infoResponse.json(), ratingResponse.json(), statusResponse.json()]);
      if (info.status !== 'OK') throw new Error(info.comment || 'Codeforces handle not found.');
      if (ratings.status !== 'OK') throw new Error(ratings.comment || 'Could not load contest history.');
      if (submissions.status !== 'OK') throw new Error(submissions.comment || 'Could not load accepted submissions.');
      const user = info.result[0], history = ratings.result, accepted=submissions.result.filter(x=>x.verdict==='OK'&&x.problem&&x.problem.contestId!=null);
      const weekStart=new Date();weekStart.setHours(0,0,0,0);weekStart.setDate(weekStart.getDate()-((weekStart.getDay()+6)%7));const weekStartSec=Math.floor(weekStart.getTime()/1000);
      const weekProblems=new Set(accepted.filter(x=>x.creationTimeSeconds>=weekStartSec).map(x=>x.problem.contestId+'-'+(x.problem.index||'')));
      const weekContests=history.filter(x=>x.ratingUpdateTimeSeconds>=weekStartSec).length;
      const peak = Number.isFinite(user.maxRating) ? user.maxRating : (Number.isFinite(user.rating) ? user.rating : 0);
      $('peak-rating').textContent = user.maxRating == null ? 'Unrated' : String(user.maxRating);
      $('current-rating').textContent = user.rating == null ? 'Unrated' : String(user.rating);
      $('current-rank').textContent = user.rank || 'Unrated';
      $('contest-count').textContent = String(history.length);
      roadmapState.weekly={solved:weekProblems.size+(roadmapState.weeklyManual?.solved||0),contests:weekContests+(roadmapState.weeklyManual?.contests||0)};saveRoadmap();
      render(peak);
      $('sync-status').textContent = 'Live Codeforces data · rating, accepted problems and contest participation synced.';
    } catch (error) {
      $('sync-status').textContent = (error.name === 'AbortError' ? 'Codeforces API timed out after 15 seconds.' : (error.message || 'Unable to connect to Codeforces.')) + ' Check the handle in Competition and retry.';
      $('milestone-list').innerHTML = '<p class="cr-loading">Rating data is unavailable right now. Milestones will appear when Codeforces responds.</p>';
      $('peak-rating').textContent = '—';
      $('current-rating').textContent = '—';
      $('current-rank').textContent = '—';
      $('contest-count').textContent = '—';
      $('overall-percent').textContent = '—';
      $('overall-bar').style.width = '0';
    } finally {
      clearTimeout(timeoutId);
      $('refresh-rating').disabled = false;
    }
  }
  document.addEventListener('DOMContentLoaded', () => {
    bindRoadmap();
    $('refresh-rating').addEventListener('click', refresh);
    refresh();
  });
})();
