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
    {name:'Foundations',range:'Below 1200',min:0,max:1199,goal:'Reach and stabilise at Pupil (1200).',tasks:['Write clean C++ using arrays, strings, vectors, functions and sorting.','Estimate time and memory complexity before coding.','Solve implementation and simulation problems independently.','Use frequency maps, prefix sums and two pointers.','Apply basic greedy reasoning and test counterexamples.','Practise gcd, primes, parity, modulo and integer overflow.'],tags:'800–1100'},
    {name:'Specialist toolkit',range:'1200–1399',min:1200,max:1399,goal:'Reach Specialist (1400).',tasks:['Prove simple greedy choices using invariants or exchange arguments.','Solve binary search on answer problems.','Use maps, sets, stacks, queues and priority queues confidently.','Learn DSU and its basic applications.','Practise string frequency, hashing concepts and prefix functions.','Apply counting, combinations and modular arithmetic basics.'],tags:'1000–1400'},
    {name:'Core algorithms',range:'1400–1599',min:1400,max:1599,goal:'Reach Expert (1600).',tasks:['Implement BFS, DFS and connected components.','Solve shortest path and topological sorting problems.','Build DP states and transitions; practise knapsack, LIS and grid DP.','Use sieve, factorisation and modular exponentiation.','Implement Fenwick tree and segment tree fundamentals.','Solve constructive problems with clear invariants.'],tags:'1200–1600'},
    {name:'Advanced reasoning',range:'1600–1899',min:1600,max:1899,goal:'Reach Candidate Master (1900).',tasks:['Practise DP optimisation and less obvious state design.','Study SCC, bridges, articulation points and Dijkstra variants.','Apply inclusion–exclusion and pigeonhole arguments.','Use lazy segment trees and offline query techniques.','Solve multi-step greedy and constructive problems.','Explain proofs and complexity before implementation.'],tags:'1500–1900'},
    {name:'Mastery',range:'1900–2399',min:1900,max:2399,goal:'Reach Master (2100), then International Master (2300).',tasks:['Combine multiple algorithms in unfamiliar problems.','Develop advanced DP, tree and graph problem-solving depth.','Study flows, matching and advanced data structures as needed.','Strengthen combinatorics, probability and algebraic reasoning.','Complete virtual contests and deep upsolves consistently.','Review recurring weaknesses and improve contest decisions.'],tags:'1700–2400+'},
    {name:'Grandmaster',range:'2400+',min:2400,max:9999,goal:'Reach a peak rating of at least 2400.',tasks:['Maintain performance across varied contest formats.','Close remaining gaps in advanced algorithms and mathematics.','Improve accuracy, problem selection and implementation speed.','Review difficult rounds and turn mistakes into focused practice.'],tags:'2400+'}
  ];
  let roadmapState = {checks:{},weekly:{solved:0,contests:0},active:0,ready:[]};
  function loadRoadmap() {
    try { const saved=JSON.parse(localStorage.getItem(ROADMAP_KEY)||'{}'); roadmapState={...roadmapState,...saved,checks:saved.checks||{},weekly:saved.weekly||{solved:0,contests:0},ready:saved.ready||[]}; } catch (_) {}
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
    $('weekly-plus').addEventListener('click',()=>{roadmapState.weekly.solved=Math.min(999,(roadmapState.weekly.solved||0)+1);saveRoadmap();renderRoadmap(lastPeak);});
    $('weekly-minus').addEventListener('click',()=>{roadmapState.weekly.solved=Math.max(0,(roadmapState.weekly.solved||0)-1);saveRoadmap();renderRoadmap(lastPeak);});
    $('contest-log').addEventListener('click',()=>{roadmapState.weekly.contests=Math.min(99,(roadmapState.weekly.contests||0)+1);saveRoadmap();renderRoadmap(lastPeak);});
    $('mark-stage-done').addEventListener('click',()=>{if(!roadmapState.ready.includes(roadmapState.active))roadmapState.ready.push(roadmapState.active);saveRoadmap();renderRoadmap(lastPeak);});
    renderRoadmap(lastPeak);
  }
  let lastPeak=0;
  function updateRoadmap(peak) {
    const phases = Array.from(document.querySelectorAll('[data-phase-min]'));
    const current = phases.find(node => peak >= Number(node.dataset.phaseMin) && peak <= Number(node.dataset.phaseMax)) || phases[0];
    phases.forEach(node => node.classList.toggle('is-current', node === current));
    const heading = current.querySelector('h3');
    const copy = current.querySelector('.cr-phase-goal');
    $('roadmap-current-stage').textContent = heading ? 'Current focus: ' + heading.textContent : 'Current focus';
    $('roadmap-current-copy').textContent = copy ? copy.textContent : 'Follow the next stage of the roadmap.';
  }
  function render(peak) {
    updateRoadmap(peak);
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
    try {
      const base = 'https://codeforces.com/api/';
      const [infoResponse, ratingResponse] = await Promise.all([
        fetch(base + 'user.info?handles=' + encodeURIComponent(handle)),
        fetch(base + 'user.rating?handle=' + encodeURIComponent(handle))
      ]);
      if (!infoResponse.ok || !ratingResponse.ok) throw new Error('Codeforces API request failed.');
      const [info, ratings] = await Promise.all([infoResponse.json(), ratingResponse.json()]);
      if (info.status !== 'OK') throw new Error(info.comment || 'Codeforces handle not found.');
      if (ratings.status !== 'OK') throw new Error(ratings.comment || 'Could not load contest history.');
      const user = info.result[0], history = ratings.result;
      const peak = Number.isFinite(user.maxRating) ? user.maxRating : (Number.isFinite(user.rating) ? user.rating : 0);
      $('peak-rating').textContent = user.maxRating == null ? 'Unrated' : String(user.maxRating);
      $('current-rating').textContent = user.rating == null ? 'Unrated' : String(user.rating);
      $('current-rank').textContent = user.rank || 'Unrated';
      $('contest-count').textContent = String(history.length);
      render(peak);
      $('sync-status').textContent = 'Live data · updated just now · peak rating determines milestone completion.';
    } catch (error) {
      $('sync-status').textContent = error.message + ' Check the handle in Competition and retry.';
      $('milestone-list').innerHTML = '<p class="cr-loading">Rating data is unavailable right now. Milestones will appear when Codeforces responds.</p>';
      $('peak-rating').textContent = '—';
      $('current-rating').textContent = '—';
      $('current-rank').textContent = '—';
      $('contest-count').textContent = '—';
      $('overall-percent').textContent = '—';
      $('overall-bar').style.width = '0';
      updateRoadmap(0);
    } finally {
      $('refresh-rating').disabled = false;
    }
  }
  document.addEventListener('DOMContentLoaded', () => {
    bindRoadmap();
    $('refresh-rating').addEventListener('click', refresh);
    refresh();
  });
})();
