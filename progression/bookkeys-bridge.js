/* Bridge Bookkeys' existing local XP/progress into the shared global ledger.
 * The 5 MB Bookkeys document is intentionally left unchanged. This bridge runs
 * in its same-origin shell and reacts only to real writes from the iframe.
 */
(function () {
  'use strict';
  var GAME_KEY = 'bookkeys:game';
  var SEEN_KEY = 'limitless.reward.bookkeys-seen.v1';
  var MODULE = 'bookkeys';

  function readJson(raw, fallback) {
    try { return raw ? JSON.parse(raw) : fallback; } catch (error) { return fallback; }
  }
  function capture(game) {
    var pages = {};
    var completedBooks = [];
    var books = game && game.book && typeof game.book === 'object' ? game.book : {};
    Object.keys(books).forEach(function (bookKey) {
      var record = books[bookKey] || {};
      var pageIndexes = Array.isArray(record.p) ? record.p.filter(function (value) {
        return typeof value === 'number' && isFinite(value) && value >= 0;
      }) : [];
      pages[bookKey] = pageIndexes;
      if (record.done === 1 || record.done === true) completedBooks.push(bookKey);
    });
    return { pages: pages, books: completedBooks };
  }
  function pageSet(snapshot) {
    var result = {};
    Object.keys(snapshot.pages || {}).forEach(function (bookKey) {
      (snapshot.pages[bookKey] || []).forEach(function (pageIndex) {
        result[bookKey + ':' + pageIndex] = { bookKey: bookKey, pageIndex: pageIndex };
      });
    });
    return result;
  }
  function saveSeen(snapshot) {
    try { localStorage.setItem(SEEN_KEY, JSON.stringify(snapshot)); } catch (error) { /* Keep Bookkeys usable if storage is blocked. */ }
  }
  function awardPage(bookKey, pageIndex) {
    if (!window.LimitlessRewards) return;
    var target = 'bookkeys:page:' + bookKey + ':' + pageIndex;
    window.LimitlessRewards.record({
      module: MODULE,
      eventId: target,
      contentKey: target,
      activityClass: 'standard-task',
      difficulty: 'foundational'
    });
  }
  function awardBook(bookKey) {
    if (!window.LimitlessRewards) return;
    var target = 'bookkeys:book:' + bookKey;
    window.LimitlessRewards.record({
      module: MODULE,
      eventId: target,
      contentKey: target,
      activityClass: 'milestone',
      difficulty: 'foundational',
      oneTimeKey: target
    });
  }
  function process(game) {
    var next = capture(game);
    var rawPrevious;
    try { rawPrevious = localStorage.getItem(SEEN_KEY); } catch (error) { return; }
    // Seed a baseline rather than retroactively awarding EXP for old books/pages.
    if (rawPrevious === null) { saveSeen(next); return; }
    var previous = readJson(rawPrevious, { pages: {}, books: [] });
    var oldPages = pageSet(previous);
    var newPages = pageSet(next);
    Object.keys(newPages).forEach(function (id) {
      if (!oldPages[id]) awardPage(newPages[id].bookKey, newPages[id].pageIndex);
    });
    var oldBooks = {};
    (previous.books || []).forEach(function (bookKey) { oldBooks[bookKey] = true; });
    (next.books || []).forEach(function (bookKey) {
      if (!oldBooks[bookKey]) awardBook(bookKey);
    });
    saveSeen(next);
  }
  function currentGame() {
    try { return readJson(localStorage.getItem(GAME_KEY), null); } catch (error) { return null; }
  }
  function init() {
    // A first install deliberately seeds old progress without paying it twice.
    process(currentGame());
    window.addEventListener('storage', function (event) {
      if (event.key === GAME_KEY) process(currentGame());
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();