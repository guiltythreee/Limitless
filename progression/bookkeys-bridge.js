/* Bridge Bookkeys' existing local XP/progress into the shared global ledger.
 * The 5 MB Bookkeys document is intentionally left unchanged. This bridge runs
 * in its same-origin shell and reacts only to real writes from the iframe.
 */
(function () {
  'use strict';
  var GAME_KEY = 'bookkeys:game';
  var SEEN_KEY = 'limitless.reward.bookkeys-seen.v1';
  var MODULE = 'bookkeys';
  var MIN_PAGES_FOR_BOOK_MILESTONE = 3;
  // Bookkeys only counts its own XP when its page completion/anti-paste rules pass.
  // The adapter requires this recorded XP delta as independent completion evidence.

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
    var savedXp = game && typeof game.xp === 'number' && isFinite(game.xp) ? Math.max(0, game.xp) : 0;
    return { pages: pages, books: completedBooks, xp: savedXp };
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
    if (!window.LimitlessRewards) return false;
    var target = 'bookkeys:page:' + bookKey + ':' + pageIndex;
    var receipt = window.LimitlessRewards.record({
      module: MODULE,
      eventId: target,
      contentKey: target,
      activityClass: 'standard-task',
      evidence: 'typed-page',
      reason: 'Bookkeys recorded a newly completed page and its own XP increased',
      difficulty: 'foundational'
    });
    return !!(receipt && receipt.ok);
  }
  function awardBook(bookKey) {
    if (!window.LimitlessRewards) return false;
    var target = 'bookkeys:book:' + bookKey;
    var receipt = window.LimitlessRewards.record({
      module: MODULE,
      eventId: target,
      contentKey: target,
      activityClass: 'milestone',
      evidence: 'milestone-complete',
      reason: 'Bookkeys verified the book as complete after at least three typed pages',
      difficulty: 'foundational',
      oneTimeKey: target
    });
    return !!(receipt && receipt.ok);
  }
  function process(game) {
    if (!window.LimitlessRewards) return;
    var next = capture(game);
    var rawPrevious;
    try { rawPrevious = localStorage.getItem(SEEN_KEY); } catch (error) { return; }
    // Seed a baseline rather than retroactively awarding EXP for old books/pages.
    if (rawPrevious === null) { saveSeen(next); return; }
    var previous = readJson(rawPrevious, { pages: {}, books: [] });
    var oldPages = pageSet(previous);
    var newPages = pageSet(next);
    // The app commits typed-page records and local XP together. Only award
    // newly seen pages if Bookkeys itself confirms a positive XP delta, which
    // excludes sample text, rejected/pasted attempts, and incomplete pages.
    var verifiedXpDelta = next.xp > (typeof previous.xp === 'number' ? previous.xp : 0);
    var allRewardsSaved = true;
    Object.keys(newPages).forEach(function (id) {
      if (!oldPages[id] && verifiedXpDelta && !awardPage(newPages[id].bookKey, newPages[id].pageIndex)) allRewardsSaved = false;
    });
    var oldBooks = {};
    (previous.books || []).forEach(function (bookKey) { oldBooks[bookKey] = true; });
    (next.books || []).forEach(function (bookKey) {
      var completedPages = (next.pages[bookKey] || []).length;
      if (!oldBooks[bookKey] && verifiedXpDelta && completedPages >= MIN_PAGES_FOR_BOOK_MILESTONE && !awardBook(bookKey)) allRewardsSaved = false;
    });
    // If localStorage rejects a reward write, keep the old baseline so a later
    // storage event or reload retries it. Successful event IDs are idempotent.
    if (allRewardsSaved) saveSeen(next);
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