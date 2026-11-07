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
    $('refresh-rating').addEventListener('click', refresh);
    refresh();
  });
})();
