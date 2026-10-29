/* Bridge Bookkeys' verified local page completions into the shared global ledger.
 * This stays in the same-origin shell; Bookkeys itself remains local-only and is not uploaded.
 */
(function () {
  'use strict';
  var GAME_KEY = 'bookkeys:game';
  var SEEN_KEY = 'limitless.reward.bookkeys-seen.v1';
  var MODULE = 'bookkeys';
  var MIN_PAGES_FOR_BOOK_MILESTONE = 3;
  // Match Bookkeys' own character-based page reward formula. A page must be
  // substantial, and local reward XP must be at least one point per character,
  // which excludes the app's below-85% accuracy multiplier band.
  var MIN_PAGE_CHARACTERS = 150;

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
    try { localStorage.setItem(SEEN_KEY, JSON.stringify(snapshot)); return true; }
    catch (error) { return false; }
  }
  function normalizedPageText() {
    try {
      var frame = document.querySelector('.shell-main iframe');
      var frameDocument = frame && frame.contentDocument;
      if (!frameDocument) return null;
      var pageInput = frameDocument.getElementById('pageNum');
      var displayedPage = pageInput ? parseInt(pageInput.value, 10) : NaN;
      var pageIndex = displayedPage - 1;
      if (!isFinite(pageIndex) || pageIndex < 0) return null;
      var chars = frameDocument.querySelectorAll('#bookText span.c');
      if (!chars || !chars.length) return null;
      var raw = '';
      for (var i = 0; i < chars.length; i++) raw += chars[i].textContent || '';
      var text = raw.replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
      if (!text) return null;
      // Two independent 32-bit hashes give a stable content key without storing
      // or exporting any of the user's book text.
      var h1 = 2166136261, h2 = 5381;
      for (var j = 0; j < text.length; j++) {
        var code = text.charCodeAt(j);
        h1 = Math.imul(h1 ^ code, 16777619) >>> 0;
        h2 = (Math.imul(h2, 33) ^ code) >>> 0;
      }
      var hex1 = ('00000000' + h1.toString(16)).slice(-8);
      var hex2 = ('00000000' + h2.toString(16)).slice(-8);
      return { pageIndex: pageIndex, characters: text.length, signature: hex1 + hex2 };
    } catch (error) {
      return null;
    }
  }
  function localPageReward(game, bookKey, pageIndex) {
    var paid = game && game.paid && typeof game.paid === 'object' ? game.paid : {};
    var value = paid['p:' + bookKey + ':' + pageIndex];
    return typeof value === 'number' && isFinite(value) && value >= 0 ? value : null;
  }
  function awardPage(bookKey, pageIndex, evidence) {
    if (!window.LimitlessRewards) return { ok: false, xp: 0 };
    var target = 'bookkeys:page:' + bookKey + ':' + pageIndex;
    var receipt = window.LimitlessRewards.record({
      module: MODULE,
      eventId: target,
      contentKey: 'bookkeys:passage:' + evidence.signature,
      activityClass: 'standard-task',
      evidence: 'typed-page',
      reason: 'Bookkeys verified a ' + evidence.characters + '-character page at its local accuracy threshold',
      difficulty: 'foundational'
    });
    return { ok: !!(receipt && receipt.ok), xp: receipt && receipt.ok ? receipt.xp : 0 };
  }
  function creditedPagesForBook(bookKey) {
    try {
      var ledger = window.LimitlessRewards.read();
      var prefix = 'bookkeys:page:' + bookKey + ':';
      return (ledger.awards || []).filter(function (award) {
        return award.m === MODULE && award.e === 'typed-page' &&
          typeof award.id === 'string' && award.id.indexOf(prefix) === 0 && award.x > 0;
      }).length;
    } catch (error) {
      return 0;
    }
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
      reason: 'Bookkeys verified book completion after at least three eligible, rewarded pages',
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
    // Seed a baseline rather than retroactively rewarding old reading history.
    if (rawPrevious === null) {
      var initialPages = pageSet(next);
      var initialProcessed = {};
      Object.keys(initialPages).forEach(function (id) { initialProcessed[id] = 'baseline'; });
      next.processed = initialProcessed;
      saveSeen(next);
      return;
    }

    var previous = readJson(rawPrevious, { pages: {}, books: [], processed: {} });
    // Older bridge snapshots had no processed map. Treat their known pages as
    // historical baseline to avoid a retroactive payout during this upgrade.
    var processed = previous.processed && typeof previous.processed === 'object' ? previous.processed : {};
    if (!previous.processed) {
      Object.keys(pageSet(previous)).forEach(function (id) { processed[id] = 'baseline'; });
    }
    var allPages = pageSet(next);
    var evidence = normalizedPageText();
    if (evidence) {
      var matching = Object.keys(allPages).filter(function (id) {
        return !processed[id] && allPages[id].pageIndex === evidence.pageIndex;
      });
      // Only bind visible text to one newly completed page. If the document or
      // storage event cannot identify it uniquely, keep it pending for retry.
      if (matching.length === 1) {
        var id = matching[0];
        var page = allPages[id];
        var localXp = localPageReward(game, page.bookKey, page.pageIndex);
        if (evidence.characters < MIN_PAGE_CHARACTERS) {
          processed[id] = 'ineligible-short-page';
        } else if (localXp === null) {
          // Canonical page progress exists without the expected local reward
          // receipt. Do not grant global EXP from this inconsistent record.
        } else if (localXp < evidence.characters) {
          processed[id] = 'ineligible-accuracy';
        } else {
          var receipt = awardPage(page.bookKey, page.pageIndex, evidence);
          if (receipt.ok) processed[id] = receipt.xp > 0 ? 'awarded' : 'repeat-capped';
        }
      }
    }

    // Completion may precede the third credited page in a recovered/retried
    // sequence. Re-check every completed book until its one-time milestone lands.
    var books = next.books || [];
    for (var b = 0; b < books.length; b++) {
      var bookKey = books[b];
      var completedPages = (next.pages[bookKey] || []).length;
      if (completedPages >= MIN_PAGES_FOR_BOOK_MILESTONE &&
          creditedPagesForBook(bookKey) >= MIN_PAGES_FOR_BOOK_MILESTONE) {
        if (!awardBook(bookKey)) {
          // Keep retrying on focus/next storage event. Duplicate event IDs are safe.
        }
      }
    }

    next.processed = processed;
    // Pending page IDs stay absent from processed, so a later focus/storage
    // event can retry once the matching visible page and local receipt are available.
    saveSeen(next);
  }
  function currentGame() {
    try { return readJson(localStorage.getItem(GAME_KEY), null); } catch (error) { return null; }
  }
  function init() {
    process(currentGame());
    window.addEventListener('storage', function (event) {
      if (event.key === GAME_KEY) process(readJson(event.newValue, currentGame()));
    });
    window.addEventListener('focus', function () {
      process(currentGame());
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();