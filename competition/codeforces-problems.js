(function () {
  'use strict';
  const API = 'https://codeforces.com/api/';
  const STORAGE = 'limitless.competition.codeforces-problemset.v1';
  const $ = id => document.getElementById(id);
  const state = { problems: [], solved: new Set(), saved: new Set(), page: 0, pageSize: 40, loaded: false, loading: false };
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
  function categoriesFor(tags) {
    const lower = (tags || []).map(x => x.toLowerCase());
    const matches = Object.entries(CATEGORIES).filter(([, values]) => lower.some(tag => values.includes(tag))).map(([category]) => category);
    return matches.length ? matches : ['Other'];
  }
  function esc(value) { return String(value == null ? '' : value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function status(message) { $('cf-problem-status').textContent = message; }
  async function api(method, params) {
    const query = new URLSearchParams(params || {}).toString();
    const response = await fetch(API + method + (query ? '?' + query : ''));
    if (!response.ok) throw new Error(method + ' request failed (' + response.status + ').');
    const data = await response.json();
    if (data.status !== 'OK') throw new Error(data.comment || 'Codeforces API returned an error.');
    return data.result;
  }
  async function loadProblemset() {
    if (state.loading) return;
    state.loading = true; $('cf-refresh-problems').disabled = true; status('Loading the official Codeforces problem catalogue…');
    try {
      const result = await api('problemset.problems');
      state.problems = result.problems || [];
      state.loaded = true;
      populateFilters();
      await loadSolved();
      status('Loaded ' + state.problems.length.toLocaleString() + ' problems from Codeforces. Solved status checks up to the latest 10,000 submissions.');
      render();
    } catch (error) { status(error.message + ' You can retry; the filters and saved list remain available.'); }
    finally { state.loading = false; $('cf-refresh-problems').disabled = false; }
  }
  async function loadSolved() {
    const handle = $('cf-handle').value.trim();
    if (!handle) { status('Catalogue loaded. Add a Codeforces handle above to include your solved status.'); return; }
    try {
      const submissions = await api('user.status', { handle, from:1, count:10000 });
      state.solved = new Set(submissions.filter(s => s.verdict === 'OK' && s.problem).map(s => (s.problem.contestId || 'gym') + '-' + (s.problem.index || '')));
    } catch (error) { status('Problem catalogue loaded; solved status unavailable: ' + error.message); }
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
    let rows = state.problems.filter(p => {
      const rating = Number.isFinite(p.rating) ? p.rating : null;
      if (rating === null ? !$('cf-include-unrated').checked : (rating < min || rating > max)) return false;
      if (tags.length && !tags.every(t => (p.tags || []).includes(t))) return false;
      if (category && !categoriesFor(p.tags).includes(category)) return false;
      if (search && !(p.name || '').toLowerCase().includes(search) && !(String(p.contestId) + (p.index || '')).toLowerCase().includes(search)) return false;
      const key = (p.contestId || 'gym') + '-' + (p.index || '');
      if (statusFilter === 'solved' && !state.solved.has(key)) return false;
      if (statusFilter === 'unsolved' && state.solved.has(key)) return false;
      if (statusFilter === 'saved' && !state.saved.has(key)) return false;
      return true;
    });
    rows.sort((a,b) => sort === 'rating-desc' ? b.rating-a.rating || (a.name||'').localeCompare(b.name||'') : sort === 'name' ? (a.name||'').localeCompare(b.name||'') : a.rating-b.rating || (a.name||'').localeCompare(b.name||''));
    return rows;
  }
  function render() {
    if (!state.loaded) return;
    const rows = filtered(), pages = Math.max(1, Math.ceil(rows.length / state.pageSize));
    state.page = Math.min(state.page, pages - 1);
    const slice = rows.slice(state.page * state.pageSize, (state.page + 1) * state.pageSize);
    $('cf-result-count').textContent = rows.length.toLocaleString() + ' matching problems';
    $('cf-problem-list').innerHTML = slice.map(p => {
      const key = (p.contestId || 'gym') + '-' + (p.index || ''), solved = state.solved.has(key), saved = state.saved.has(key);
      const tags = (p.tags || []).map(tag => '<span class="cf-chip">' + esc(tag) + '</span>').join('');
      const isGym = Number(p.contestId) >= 100000;
      const url = p.contestId ? (isGym ? 'https://codeforces.com/gym/' + p.contestId + '/problem/' : 'https://codeforces.com/problemset/problem/' + p.contestId + '/') + encodeURIComponent(p.index || '') : 'https://codeforces.com/problemset';
      return '<article class="cf-problem-card"><div><a class="cf-problem-title" href="' + url + '" target="_blank" rel="noopener noreferrer">' + esc(p.name) + ' ↗</a><div class="cf-problem-meta"><span class="cf-chip rating">' + p.rating + '</span><span class="cf-chip">' + esc(p.contestId || 'Gym') + ' · ' + esc(p.index || '') + '</span>' + (solved ? '<span class="cf-chip solved">Solved</span>' : '') + tags + '</div></div><div class="cf-problem-right"><button class="cf-save-problem" type="button" data-save="' + esc(key) + '" aria-pressed="' + saved + '">' + (saved ? '★ Saved' : '☆ Save') + '</button></div></article>';
    }).join('') || '<p class="cf-empty">No problems match these filters. Try widening the rating range or removing a tag.</p>';
    $('cf-page-label').textContent = 'Page ' + (state.page + 1) + ' of ' + pages;
    $('cf-prev-page').disabled = state.page === 0;
    $('cf-next-page').disabled = state.page >= pages - 1;
    $('cf-problem-list').querySelectorAll('[data-save]').forEach(button => button.addEventListener('click', () => {
      const key = button.dataset.save;
      if (state.saved.has(key)) state.saved.delete(key); else state.saved.add(key);
      persistSaved(); render();
    }));
  }
  function bindFilters() {
    ['cf-rating-min','cf-rating-max','cf-tag-filter','cf-category-filter','cf-search','cf-status-filter','cf-sort'].forEach(id => $(id).addEventListener(id === 'cf-search' ? 'input' : 'change', () => { state.page = 0; render(); }));
    $('cf-prev-page').addEventListener('click', () => { state.page--; render(); });
    $('cf-next-page').addEventListener('click', () => { state.page++; render(); });
    $('cf-refresh-problems').addEventListener('click', loadProblemset);
    $('cf-refresh-solved').addEventListener('click', async () => { status('Refreshing solved submissions…'); await loadSolved(); render(); });
    $('cf-clear-filters').addEventListener('click', () => {
      $('cf-rating-min').value = '800'; $('cf-rating-max').value = '3500'; $('cf-include-unrated').checked = false; $('cf-search').value = '';
      $('cf-tag-filter').selectedIndex = -1; $('cf-category-filter').value = ''; $('cf-status-filter').value = 'all'; $('cf-sort').value = 'rating-asc'; state.page = 0; render();
    });
  }
  function init() {
    readSaved(); $('cf-rating-min').value = '800'; $('cf-rating-max').value = '3500';
    bindFilters(); loadProblemset();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();