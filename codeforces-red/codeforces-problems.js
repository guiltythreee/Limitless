(function () {
  'use strict';
  const API = 'https://codeforces.com/api/';
  const STORAGE = 'limitless.competition.codeforces-problemset.v2';
  const MISTAKE_STORAGE = 'limitless.competition.codeforces-mistake-tags.v1';
  const MISTAKE_TYPES = [['conceptual','Conceptual error'],['observation','Observation error'],['mathematical','Mathematical error'],['implementation','Implementation error'],['syntax-gap','Syntax gap']];
  const NOTE_STORAGE = 'limitless.competition.codeforces-notes.v1';
  const NOTE_MAX = 4000;
  const MAX_PER_RATING = 250;
  const MIN_PER_TOPIC = 6;
  const TOPIC_BALANCE = 0.6;
  const PERSONAL_REPLACEMENT_RATING_MIN = 800;
  const PERSONAL_REPLACEMENT_RATING_MAX = 1000;
  const $ = id => document.getElementById(id);
  const state = { problems: [], problemsetResult: null, solved: new Set(), wrong: new Map(), saved: new Set(), mistakeTags: {}, page: 0, pageSize: 40, loaded: false, loading: false, badgeHandle: '', badgeNote: '', shelfMissing: [], notes: {}, openNotes: new Set() };
  // Two separate jobs, kept apart on purpose:
  //   SHELF  - which problems are listed. Anything solved by a FIXED handle in
  //            SHELF_HANDLES (lord_limitless) is swapped out. Problems solved by
  //            unwonted_contriver stay listed and just show the Solved badge. Fetched fresh on every load and Sync;
  //            the last saved copy is only a fallback if the request fails.
  //   BADGES - the Solved / Wrong badges. They follow the handle linked on the page and
  //            are re-fetched every time "Sync with Codeforces" is pressed.
  const SHELF_HANDLES = ['lord_limitless'];
  const SHELF_SNAPSHOT_KEY = 'limitless.competition.codeforces-shelf-snapshot.v1';
  const REPLACEMENT_SNAPSHOT_KEY = 'limitless.competition.codeforces-replacement-snapshot.v1';
  function sameHandle(a, b) { return String(a || '').trim().toLowerCase() === String(b || '').trim().toLowerCase(); }
  // Badge snapshot: the linked handle's submissions, saved with the handle's name so that
  // it is only reused for that same handle. Sync ignores it and fetches fresh data.
  function readReplacementSnapshot() {
    try {
      const saved = JSON.parse(localStorage.getItem(REPLACEMENT_SNAPSHOT_KEY) || 'null');
      if (!saved || saved.version !== 1 || !Array.isArray(saved.solvedKeys)) return null;
      return {
        handle: typeof saved.handle === 'string' ? saved.handle : '',
        solved: new Set(saved.solvedKeys.filter(key => typeof key === 'string')),
        wrong: new Map(Array.isArray(saved.wrongEntries)
          ? saved.wrongEntries.filter(entry => Array.isArray(entry) && typeof entry[0] === 'string' && Number.isFinite(entry[1]))
          : [])
      };
    } catch (_) { return null; }
  }
  function persistReplacementSnapshot(solved, wrong, handle) {
    try {
      localStorage.setItem(REPLACEMENT_SNAPSHOT_KEY, JSON.stringify({
        version: 1,
        handle: handle,
        capturedAt: new Date().toISOString(),
        solvedKeys: [...solved],
        wrongEntries: [...wrong]
      }));
    } catch (_) {}
  }
  // Shelf snapshot: one saved set of solved problem keys per fixed handle.
  function readShelfSnapshot() {
    const out = {};
    try {
      const saved = JSON.parse(localStorage.getItem(SHELF_SNAPSHOT_KEY) || 'null');
      if (saved && saved.version === 1 && saved.handles && typeof saved.handles === 'object') {
        SHELF_HANDLES.forEach(handle => {
          const keys = saved.handles[handle];
          if (Array.isArray(keys)) out[handle] = new Set(keys.filter(key => typeof key === 'string'));
        });
      }
    } catch (_) {}
    return out;
  }
  function persistShelfSnapshot(byHandle) {
    try {
      const handles = {};
      Object.keys(byHandle).forEach(handle => { handles[handle] = [...byHandle[handle]]; });
      localStorage.setItem(SHELF_SNAPSHOT_KEY, JSON.stringify({ version: 1, capturedAt: new Date().toISOString(), handles }));
    } catch (_) {}
  }
  function linkedHandle() {
    let handle = $('linked-handle') ? $('linked-handle').textContent.trim() : '';
    if (!handle || handle === '—') {
      try { const linked = JSON.parse(localStorage.getItem('limitless.competition.linked-accounts.v1') || '{}'); handle = (linked.codeforcesHandle || '').trim(); } catch (_) {}
    }
    return handle === '—' ? '' : handle;
  }
  const CATEGORIES = {
    'Implementation & Basics':['implementation','brute force','bitmasks','strings'],
    'Mathematics':['math','number theory','combinatorics','probabilities','geometry','matrices'],
    'Greedy & Constructive':['greedy','constructive algorithms','sortings'],
    'Data Structures':['data structures','dsu','trees','binary indexed tree','segment tree','sparse table','two pointers'],
    'Graphs':['dfs and similar','graphs','graph matchings','shortest paths','flows','2-sat'],
    'Dynamic Programming':['dp'],
    'Strings':['strings','string suffix structures'],
    'Search & Techniques':['binary search','meet-in-the-middle','divide and conquer','ternary search','schedules'],
    'Games & Miscellaneous':['games','interactive','chinese remainder theorem','fft','expression parsing','hashing']
  };
  function readSaved() {
    try { const x = JSON.parse(localStorage.getItem(STORAGE) || '{}'); state.saved = new Set(Array.isArray(x.saved) ? x.saved : []); }
    catch (_) { state.saved = new Set(); }
  }
  function persistSaved() { localStorage.setItem(STORAGE, JSON.stringify({ saved:[...state.saved] })); }
  function readMistakeTags() {
    try { const value = JSON.parse(localStorage.getItem(MISTAKE_STORAGE) || '{}'); state.mistakeTags = value && typeof value === 'object' && !Array.isArray(value) ? value : {}; }
    catch (_) { state.mistakeTags = {}; }
  }
  function persistMistakeTags() { localStorage.setItem(MISTAKE_STORAGE, JSON.stringify(state.mistakeTags)); }
  function readNotes() {
    try {
      const value = JSON.parse(localStorage.getItem(NOTE_STORAGE) || '{}');
      state.notes = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
    } catch (_) { state.notes = {}; }
  }
  function persistNotes() { try { localStorage.setItem(NOTE_STORAGE, JSON.stringify(state.notes)); } catch (_) {} }
  function noteFor(key) { return typeof state.notes[key] === 'string' ? state.notes[key] : ''; }
  function noteLabel(key) { return noteFor(key).trim() ? '✎ Note ●' : '✎ Note'; }
  function noteControls(key) {
    return '<details class="cf-note-editor" data-note-details="' + esc(key) + '"' + (state.openNotes.has(key) ? ' open' : '') +
      '><summary>' + noteLabel(key) + '</summary><div class="cf-note-box"><textarea class="cf-note-text" data-note-key="' + esc(key) +
      '" maxlength="' + NOTE_MAX + '" rows="5" placeholder="Write anything about this problem…" aria-label="Note for this problem">' +
      esc(noteFor(key)) + '</textarea><small>Saved automatically in this browser.</small></div></details>';
  }
  function mistakeTagsFor(key) {
    const values = state.mistakeTags[key];
    return Array.isArray(values) ? values.filter(value => MISTAKE_TYPES.some(([id]) => id === value)) : [];
  }
  function mistakeTagControls(key) {
    const selected = new Set(mistakeTagsFor(key));
    const labels = MISTAKE_TYPES.map(([id, label]) => '<label class="cf-mistake-option"><input type="checkbox" data-mistake-key="' + esc(key) + '" data-mistake="' + id + '"' + (selected.has(id) ? ' checked' : '') + '><span>' + label + '</span></label>').join('');
    return '<details class="cf-mistake-editor"><summary>' + (selected.size ? '⚑ Tags · ' + selected.size : '⚑ Tag') + '</summary><div class="cf-mistake-options">' + labels + '</div></details>';
  }
  function categoriesFor(tags) {
    const lower = (tags || []).map(x => x.toLowerCase());
    const matches = Object.entries(CATEGORIES).filter(([, values]) => lower.some(tag => values.includes(tag))).map(([category]) => category);
    return matches.length ? matches : ['Other'];
  }
  function esc(value) { return String(value == null ? '' : value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function status(message) { $('cf-problem-status').textContent = message; }
  async function api(method, params, options) {
    const query = new URLSearchParams(params || {}).toString();
    const client = await import('../competition/codeforces-api.mjs');
    const data = await client.requestCodeforcesApi(
      API + method + (query ? '?' + query : ''),
      options && options.signal ? { signal: options.signal } : undefined
    );
    return data.result;
  }
  // `excludedKeys` = problems that must not be on the shelf (solved by the shelf handles).
  function curateProblemset(result, excludedKeys) {
    const excluded = excludedKeys instanceof Set ? excludedKeys : new Set(excludedKeys || []);
    const problems = result.problems || [], stats = result.problemStatistics || [];
    const buckets = new Map();
    problems.forEach((problem, index) => {
      if (!Number.isFinite(problem.rating)) return;
      const solvedCount = Number(stats[index] && stats[index].solvedCount) || 0;
      const row = {...problem, catalogueSolvedCount: solvedCount};
      if (!buckets.has(problem.rating)) buckets.set(problem.rating, []);
      buckets.get(problem.rating).push(row);
    });

    // Start with the original balanced catalogue: up to 250 problems at every rating.
    const curated = [];
    [...buckets.keys()].sort((a,b)=>a-b).forEach(rating => {
      curated.push(...selectBalanced(buckets.get(rating), MAX_PER_RATING));
    });

    // Swap out 800–1000 entries that are in `excluded`. Each replacement keeps the exact
    // rating, so every rating still holds the same number of problems. Tags only have to
    // match in aggregate: every pick is the unsolved same-rating problem that moves the
    // band's overall tag counts closest to what they were before any swapping.
    // Nothing here throws. If a rating runs out of unsolved problems, the leftover
    // solved entries are dropped and reported through droppedCount.
    const popular = (a, b) =>
      (b.catalogueSolvedCount || 0) - (a.catalogueSolvedCount || 0) ||
      (a.name || '').localeCompare(b.name || '');
    const pools = new Map();
    function poolFor(rating) {
      if (!pools.has(rating)) {
        pools.set(rating, (buckets.get(rating) || []).slice().sort(popular)
          .map(row => ({row, key: problemKey(row), tags: [...new Set(row.tags || [])]})));
      }
      return pools.get(rating);
    }
    const target = new Map(), current = new Map();
    const bump = (counts, tags, by) => new Set(tags || []).forEach(tag => counts.set(tag, (counts.get(tag) || 0) + by));
    const slots = [];
    curated.forEach((problem, index) => {
      if (problem.rating < PERSONAL_REPLACEMENT_RATING_MIN ||
          problem.rating > PERSONAL_REPLACEMENT_RATING_MAX) return;
      bump(target, problem.tags, 1);
      if (excluded.has(problemKey(problem))) slots.push(index);
      else bump(current, problem.tags, 1);
    });

    const taken = new Set(curated.map(problemKey));
    const removed = new Set();
    let replacementCount = 0;
    slots.forEach(index => {
      let best = null, bestScore = -Infinity;
      poolFor(curated[index].rating).forEach(candidate => {
        if (excluded.has(candidate.key) || taken.has(candidate.key)) return;
        // +1 for each tag still below its target count, -1 for each tag already at or above it.
        let score = 0;
        candidate.tags.forEach(tag => { score += (current.get(tag) || 0) < (target.get(tag) || 0) ? 1 : -1; });
        // The pool is sorted most-solved first, so ties keep the more popular problem.
        if (score > bestScore) { bestScore = score; best = candidate; }
      });
      if (!best) { removed.add(index); return; }
      taken.add(best.key);
      curated[index] = best.row;
      bump(current, best.row.tags, 1);
      replacementCount += 1;
    });

    const shelf = curated.filter((problem, index) => !removed.has(index));
    shelf.sort((a,b) => a.rating-b.rating ||
      (b.catalogueSolvedCount||0)-(a.catalogueSolvedCount||0) ||
      (a.name||'').localeCompare(b.name||''));
    Object.defineProperty(shelf, 'replacementCount', {value:replacementCount, enumerable:false});
    Object.defineProperty(shelf, 'droppedCount', {value:removed.size, enumerable:false});
    return shelf;
  }
  function problemKey(problem) {
    return String(problem.contestId || 'gym') + '-' + String(problem.index || problem.name || '');
  }
  function tagsSignature(tags) {
    return JSON.stringify([...new Set((tags || []).map(tag => String(tag)))].sort());
  }
  // Select a topic-balanced sample; within each topic, prefer the most-solved problems.
  function selectBalanced(rows, limit) {
    if (rows.length <= limit) return rows.slice();
    const popular = (a,b) => b.catalogueSolvedCount-a.catalogueSolvedCount || (a.name||'').localeCompare(b.name||'');
    const lists = new Map();
    rows.forEach(row => categoriesFor(row.tags).forEach(cat => {
      if (!lists.has(cat)) lists.set(cat, []);
      lists.get(cat).push(row);
    }));
    lists.forEach(list => list.sort(popular));
    const cats = [...lists.keys()].sort((a,b) => lists.get(a).length-lists.get(b).length);
    const weight = new Map(cats.map(cat => [cat, Math.pow(lists.get(cat).length, TOPIC_BALANCE)]));
    const total = [...weight.values()].reduce((a,b) => a+b, 0);
    const target = new Map(cats.map(cat => [cat, limit*weight.get(cat)/total]));
    const picked = new Set(), taken = new Map(cats.map(cat => [cat,0])), cursor = new Map(cats.map(cat => [cat,0]));
    function nextFree(cat) {
      const list=lists.get(cat); let i=cursor.get(cat);
      while(i<list.length && picked.has(list[i])) i++;
      cursor.set(cat,i); return i<list.length ? list[i] : null;
    }
    function takeFrom(cat) {
      const row=nextFree(cat); if(!row) return false;
      picked.add(row); taken.set(cat,taken.get(cat)+1); return true;
    }
    cats.forEach(cat => {
      if(cat==='Other') return;
      for(let n=0;n<MIN_PER_TOPIC && picked.size<limit;n++) if(!takeFrom(cat)) break;
    });
    while(picked.size<limit) {
      let best=null,gapBest=-Infinity;
      cats.forEach(cat => {
        if(!nextFree(cat)) return;
        const gap=target.get(cat)-taken.get(cat);
        if(gap>gapBest){gapBest=gap;best=cat;}
      });
      if(!best) break;
      takeFrom(best);
    }
    return rows.filter(row=>picked.has(row)).sort(popular);
  }
  function catalogueStatus() {
    const replaced = state.problems.replacementCount || 0;
    const dropped = state.problems.droppedCount || 0;
    const parts = ['Curated ' + state.problems.length.toLocaleString() + ' problems'];
    if (state.shelfMissing.length < SHELF_HANDLES.length) {
      parts.push(replaced.toLocaleString() + ' solved 800–1000 problems swapped for unsolved ones of the same rating, keeping the overall tag mix about the same');
      if (dropped) parts.push(dropped.toLocaleString() + ' removed because no unsolved problem of that rating was left');
    }
    if (state.shelfMissing.length) {
      parts.push('could not read ' + state.shelfMissing.join(', ') + (state.shelfMissing.length === SHELF_HANDLES.length ? '; no swaps were applied' : '; swaps used the other handle only') + ' (press Sync to retry)');
    }
    if (state.badgeNote) parts.push(state.badgeNote);
    return parts.join(' · ') + '.';
  }
  // Pull one handle's accepted / failed problem keys out of a user.status payload.
  function parseSubmissions(payload) {
    const solved = new Set(), wrong = new Map();
    ((payload && payload.result) || []).forEach(s => {
      if (!s.problem || !s.verdict || s.verdict === 'TESTING') return;
      const key = (s.problem.contestId || 'gym') + '-' + (s.problem.index || '');
      if (s.verdict === 'OK') solved.add(key);
      else wrong.set(key, (wrong.get(key) || 0) + 1);
    });
    return { solved, wrong };
  }
  async function fetchHandle(handle, timeoutMs) {
    const client = await import('../competition/codeforces-api.mjs');
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs || 40000);
    try {
      const payload = await client.requestCodeforcesApi(
        'https://codeforces.com/api/user.status?handle=' + encodeURIComponent(handle) + '&from=1&count=10000',
        { signal: controller.signal }
      );
      return parseSubmissions(payload);
    } finally {
      clearTimeout(timeoutId);
    }
  }
  // SHELF: solved keys of the two fixed handles. Each is fetched once and then reused
  // from the saved snapshot, so the list does not reshuffle on every Sync.
  async function loadShelfExclusions(fresh) {
    const saved = readShelfSnapshot();
    const byHandle = Object.assign({}, saved);
    const missing = [];
    const todo = fresh ? SHELF_HANDLES.slice() : SHELF_HANDLES.filter(handle => !byHandle[handle]);
    await Promise.all(todo.map(async handle => {
      try { byHandle[handle] = (await fetchHandle(handle)).solved; }
      catch (_) { if (!byHandle[handle]) missing.push(handle); } // keep the last saved copy if there is one
    }));
    if (todo.length > missing.length) persistShelfSnapshot(byHandle);
    const excluded = new Set();
    SHELF_HANDLES.forEach(handle => { if (byHandle[handle]) byHandle[handle].forEach(key => excluded.add(key)); });
    return { excluded, missing };
  }
  // BADGES: the handle linked on the page. `fresh` (the Sync button) always re-fetches.
  async function loadBadges(fresh) {
    const handle = linkedHandle();
    state.badgeHandle = handle;
    if (!handle) {
      state.solved = new Set();
      state.wrong = new Map();
      state.badgeNote = 'no handle is linked, so Solved badges are unavailable';
      return false;
    }
    const snapshot = readReplacementSnapshot();
    const snapshotMatches = !!snapshot && sameHandle(snapshot.handle, handle);
    if (!fresh && snapshotMatches) {
      state.solved = snapshot.solved;
      state.wrong = snapshot.wrong;
      state.badgeNote = 'Solved badges follow ' + handle + ' (last synced)';
      return true;
    }
    try {
      const fetched = await fetchHandle(handle);
      state.solved = fetched.solved;
      state.wrong = fetched.wrong;
      persistReplacementSnapshot(fetched.solved, fetched.wrong, handle);
      state.badgeNote = 'Solved badges follow ' + handle + ' · ' + fetched.solved.size.toLocaleString() + ' solved · ' + fetched.wrong.size.toLocaleString() + ' attempted';
      return true;
    } catch (error) {
      if (snapshotMatches) {
        state.solved = snapshot.solved;
        state.wrong = snapshot.wrong;
        state.badgeNote = 'could not refresh ' + handle + ' (' + (error.message || 'request failed') + '); showing the last synced badges';
        return true;
      }
      state.solved = new Set();
      state.wrong = new Map();
      state.badgeNote = 'solved badges unavailable: ' + (error.message || 'request failed');
      return false;
    }
  }
  async function loadProblemset(fresh) {
    if (state.loading) return;
    state.loading = true;
    $('cf-sync-codeforces').disabled = true;

    // Fetch the public catalogue independently of any account's submission history,
    // so a slow user.status response never holds the explorer on "Waiting for catalogue".
    const catalogueController = new AbortController();
    const catalogueTimeout = setTimeout(() => catalogueController.abort(), 25000);

    try {
      status('Loading the official Codeforces problem catalogue…');
      state.solved = new Set();
      state.wrong = new Map();
      state.shelfMissing = [];
      state.badgeNote = '';

      const shelfPromise = loadShelfExclusions(fresh === true);
      const badgePromise = loadBadges(fresh === true);
      const result = await api('problemset.problems', {}, { signal: catalogueController.signal });
      if (!result || !Array.isArray(result.problems)) {
        throw new Error('Codeforces returned an invalid problem catalogue.');
      }

      state.problemsetResult = result;
      // Public baseline first, so the list is usable straight away.
      state.problems = curateProblemset(result, new Set());
      state.loaded = true;
      state.page = 0;
      populateFilters();
      status('Catalogue loaded · syncing…');
      render();

      // Second pass: apply the shelf swaps and the linked handle's badges.
      const [shelf] = await Promise.all([shelfPromise, badgePromise]);
      state.shelfMissing = shelf.missing;
      try {
        state.problems = curateProblemset(result, shelf.excluded);
      } catch (error) {
        status('Catalogue loaded, but swapping solved problems failed: ' + error.message);
        render();
        return;
      }
      state.page = 0;
      populateFilters();
      status(catalogueStatus());
      render();
    } catch (error) {
      const message = error.name === 'AbortError'
        ? 'The Codeforces problem catalogue request timed out after 25 seconds.'
        : (error.message || 'Unable to load the Codeforces problem catalogue.');
      status(message + ' Use “Sync with Codeforces” to retry.');
      $('cf-result-count').textContent = 'Catalogue unavailable';
      $('cf-problem-list').innerHTML = '<p class="cf-empty">' + esc(message) + ' The explorer will remain available for another attempt.</p>';
    } finally {
      clearTimeout(catalogueTimeout);
      state.loading = false;
      $('cf-sync-codeforces').disabled = false;
    }
  }
  function populateFilters() {
    const tags = [...new Set(state.problems.flatMap(p => p.tags || []))].sort((a,b) => a.localeCompare(b));
    $('cf-tag-filter').innerHTML = tags.map(tag => '<option value="' + esc(tag) + '">' + esc(tag) + '</option>').join('');
    const categories = [...new Set(state.problems.flatMap(p => categoriesFor(p.tags)))].sort();
    $('cf-category-filter').innerHTML = '<option value="">All categories</option>' + categories.map(x => '<option value="' + esc(x) + '">' + esc(x) + '</option>').join('');
  }
  function selectedTags() { return [...$('cf-tag-filter').selectedOptions].map(o => o.value); }
  function filtered() {
    const min = $('cf-rating-min').value === '' ? -Infinity : Number($('cf-rating-min').value);
    const max = $('cf-rating-max').value === '' ? Infinity : Number($('cf-rating-max').value);
    const tags = selectedTags(), category = $('cf-category-filter').value, search = $('cf-search').value.trim().toLowerCase();
    const statusFilter = $('cf-status-filter').value, sort = $('cf-sort').value;
    const mistakeFilter = $('cf-mistake-filter').value;
    let rows = state.problems.filter(p => {
      const rating = Number.isFinite(p.rating) ? p.rating : null;
      if (rating === null ? !$('cf-include-unrated').checked : (rating < min || rating > max)) return false;
      if (tags.length && !tags.every(t => (p.tags || []).includes(t))) return false;
      if (category && !categoriesFor(p.tags).includes(category)) return false;
      if (search && !(p.name || '').toLowerCase().includes(search) && !(String(p.contestId) + (p.index || '')).toLowerCase().includes(search)) return false;
      const key = (p.contestId || 'gym') + '-' + (p.index || '');
      if (statusFilter === 'solved' && !state.solved.has(key)) return false;
      if (statusFilter === 'unsolved' && (state.solved.has(key) || state.wrong.has(key))) return false;
      if (statusFilter === 'wrong' && !state.wrong.has(key)) return false;
      if (statusFilter === 'saved' && !state.saved.has(key)) return false;
      if (statusFilter === 'noted' && !noteFor(key).trim()) return false;
      if (mistakeFilter && !mistakeTagsFor(key).includes(mistakeFilter)) return false;
      return true;
    });
    rows.sort((a,b) => {
      if (sort === 'name') return (a.name||'').localeCompare(b.name||'');
      const ar = Number.isFinite(a.rating) ? a.rating : (sort === 'rating-desc' ? -Infinity : Infinity);
      const br = Number.isFinite(b.rating) ? b.rating : (sort === 'rating-desc' ? -Infinity : Infinity);
      return (sort === 'rating-desc' ? br-ar : ar-br) || (a.name||'').localeCompare(b.name||'');
    });
    return rows;
  }
  function render() {
    if (!state.loaded) return;
    const rows = filtered(), pages = Math.max(1, Math.ceil(rows.length / state.pageSize));
    state.page = Math.min(state.page, pages - 1);
    const slice = rows.slice(state.page * state.pageSize, (state.page + 1) * state.pageSize);
    $('cf-result-count').textContent = rows.length.toLocaleString() + ' matching problems';
    $('cf-problem-list').innerHTML = slice.map(p => {
      const key = (p.contestId || 'gym') + '-' + (p.index || ''), solved = state.solved.has(key), wrongCount=state.wrong.get(key)||0, saved = state.saved.has(key);
      const tags = (p.tags || []).map(tag => '<span class="cf-chip">' + esc(tag) + '</span>').join('');
      const ratingLabel = Number.isFinite(p.rating) ? String(p.rating) : 'Unrated';
      const tagsDisclosure = tags ? '<details class="cf-problem-tags"><summary>Tags</summary><div>' + tags + '</div></details>' : '';
      const isGym = Number(p.contestId) >= 100000;
      const url = p.contestId ? (isGym ? 'https://codeforces.com/gym/' + p.contestId + '/problem/' : 'https://codeforces.com/problemset/problem/' + p.contestId + '/') + encodeURIComponent(p.index || '') : 'https://codeforces.com/problemset';
      const progressLabel=solved?'Solved':wrongCount?'Wrong submissions ('+wrongCount+')':'Unsolved';
      const progressClass=solved?'solved':wrongCount?'wrong':'unsolved';
      const wrongBadge=solved&&wrongCount?'<span class="cf-chip wrong">'+wrongCount+' failed before solve</span>':'';
      return '<article class="cf-problem-card cf-problem-row"><div class="cf-problem-main"><a class="cf-problem-title" href="' + url + '" target="_blank" rel="noopener noreferrer">' + esc(p.name) + ' ↗</a><div class="cf-problem-meta"><span class="cf-chip rating">' + ratingLabel + '</span><span class="cf-chip">' + esc(p.contestId || 'Gym') + ' · ' + esc(p.index || '') + '</span><span class="cf-chip ' + progressClass + '">' + progressLabel + '</span>' + wrongBadge + tagsDisclosure + '</div></div><div class="cf-problem-right"><button class="cf-save-problem" type="button" data-save="' + esc(key) + '" aria-pressed="' + saved + '">' + (saved ? '★ Saved' : '☆ Save') + '</button>' + mistakeTagControls(key) + noteControls(key) + '</div></article>';
    }).join('') || '<p class="cf-empty">No problems match these filters. Try widening the rating range or removing a tag.</p>';
    $('cf-page-label').textContent = 'Page ' + (state.page + 1) + ' of ' + pages;
    $('cf-prev-page').disabled = state.page === 0;
    $('cf-next-page').disabled = state.page >= pages - 1;
    $('cf-problem-list').querySelectorAll('[data-mistake]').forEach(input => input.addEventListener('change', () => {
      const key = input.dataset.mistakeKey, type = input.dataset.mistake;
      const selected = new Set(mistakeTagsFor(key));
      if (input.checked) selected.add(type); else selected.delete(type);
      if (selected.size) state.mistakeTags[key] = [...selected]; else delete state.mistakeTags[key];
      persistMistakeTags(); render();
    }));
    $('cf-problem-list').querySelectorAll('[data-note-key]').forEach(box => box.addEventListener('input', () => {
      const key = box.dataset.noteKey, text = box.value.slice(0, NOTE_MAX);
      if (text.trim()) state.notes[key] = text; else delete state.notes[key];
      persistNotes();
      // Update the label in place: a full render() here would steal focus mid-typing.
      const summary = box.closest('details').querySelector('summary');
      if (summary) summary.textContent = noteLabel(key);
    }));
    $('cf-problem-list').querySelectorAll('[data-note-details]').forEach(details => details.addEventListener('toggle', () => {
      if (details.open) state.openNotes.add(details.dataset.noteDetails); else state.openNotes.delete(details.dataset.noteDetails);
    }));
    $('cf-problem-list').querySelectorAll('[data-save]').forEach(button => button.addEventListener('click', () => {
      const key = button.dataset.save;
      if (state.saved.has(key)) state.saved.delete(key); else state.saved.add(key);
      persistSaved(); render();
    }));

  }
  function bindFilters() {
    ['cf-rating-min','cf-rating-max','cf-include-unrated','cf-tag-filter','cf-category-filter','cf-search','cf-status-filter','cf-sort','cf-mistake-filter'].forEach(id => $(id).addEventListener(id === 'cf-search' ? 'input' : 'change', () => { state.page = 0; render(); }));
    $('cf-rating-preset').addEventListener('change', () => {
      const preset = $('cf-rating-preset').value;
      if (preset === 'custom') return;
      const bounds = preset === 'any' ? ['', ''] : preset === '2000-3500' ? ['2000', '3500'] : preset.split('-');
      $('cf-rating-min').value = bounds[0];
      $('cf-rating-max').value = bounds[1];
      $('cf-include-unrated').checked = preset === 'any';
      state.page = 0; render();
    });
    ['cf-rating-min','cf-rating-max'].forEach(id => $(id).addEventListener('change', () => { $('cf-rating-preset').value = 'custom'; }));
    $('cf-prev-page').addEventListener('click', () => { state.page--; render(); });
    $('cf-next-page').addEventListener('click', () => { state.page++; render(); });
    $('cf-sync-codeforces').addEventListener('click', () => {
      // An explicit sync always re-fetches the linked handle's submissions.
      loadProblemset(true);
    });
    $('cf-clear-filters').addEventListener('click', () => {
      $('cf-rating-preset').value = '800-1200'; $('cf-rating-min').value = '800'; $('cf-rating-max').value = '1200'; $('cf-include-unrated').checked = false; $('cf-search').value = '';
      $('cf-tag-filter').selectedIndex = -1; $('cf-category-filter').value = ''; $('cf-status-filter').value = 'all'; $('cf-sort').value = 'rating-asc'; $('cf-mistake-filter').value = ''; state.page = 0; render();
    });
  }
  function init() {
    readSaved(); readMistakeTags(); readNotes(); $('cf-rating-preset').value = '800-1200'; $('cf-rating-min').value = '800'; $('cf-rating-max').value = '1200';
    bindFilters(); loadProblemset(true); // every page load syncs fresh data
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();