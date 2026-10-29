'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const vm = require('node:vm');

const source = readFileSync(join(__dirname, 'bookkeys-bridge.js'), 'utf8');

function boot(initialGame, initialPage = { index: 0, text: '' }) {
  const values = new Map();
  if (initialGame !== undefined) values.set('bookkeys:game', JSON.stringify(initialGame));
  const storage = {
    getItem(key) { return values.has(key) ? values.get(key) : null; },
    setItem(key, value) { values.set(key, String(value)); }
  };
  const awards = [];
  const listeners = {};
  const page = { index: initialPage.index, text: initialPage.text };
  const pageInput = {};
  Object.defineProperty(pageInput, 'value', { get() { return String(page.index + 1); } });
  const frameDocument = {
    getElementById(id) { return id === 'pageNum' ? pageInput : null; },
    querySelectorAll(selector) {
      if (selector !== '#bookText span.c') return [];
      return Array.from(page.text, character => ({ textContent: character }));
    }
  };
  const iframe = { get contentDocument() { return frameDocument; } };
  const window = {
    LimitlessRewards: {
      record(input) {
        const receipt = { ok: true, xp: input.activityClass === 'milestone' ? 50 : 10 };
        awards.push({ ...input, id: input.eventId, m: input.module, e: input.evidence, x: receipt.xp });
        return receipt;
      },
      read() { return { awards: awards.map(award => ({ ...award })) }; }
    },
    addEventListener(name, callback) { listeners[name] = callback; }
  };
  const document = {
    readyState: 'complete',
    addEventListener() {},
    querySelector(selector) { return selector === '.shell-main iframe' ? iframe : null; }
  };
  vm.runInNewContext(source, { window, document, localStorage: storage });
  function currentGame() {
    try { return JSON.parse(storage.getItem('bookkeys:game') || 'null'); } catch { return null; }
  }
  return {
    awards,
    listeners,
    setPage(text, index) { page.text = text; page.index = index; },
    setGame(game) { storage.setItem('bookkeys:game', JSON.stringify(game)); },
    storageEvent() {
      listeners.storage({ key: 'bookkeys:game', newValue: storage.getItem('bookkeys:game') });
    },
    focus() { listeners.focus(); }
  };
}
function paidFor(...entries) {
  return Object.fromEntries(entries.map(([bookKey, pageIndex, xp]) => [
    'p:' + bookKey + ':' + pageIndex, xp
  ]));
}
function bookRecord(pages, options = {}) {
  return { p: pages, c: options.chapters || [], done: options.done ? 1 : 0 };
}
const longA = 'THE probability of an event is assessed from its outcomes. '.repeat(4);
const longB = 'A different paragraph explains how evidence changes the event model. '.repeat(4);

test('Bookkeys seeds legacy history and pays eligible new pages plus a once-only book milestone', () => {
  const key = 'book-hash';
  const app = boot({ xp: 900, paid: {}, book: { [key]: bookRecord([]) } }, { index: 0, text: longA });
  assert.equal(app.awards.length, 0, 'existing work is baseline, not new global EXP');

  app.setGame({ xp: 900, paid: paidFor([key, 0, 400]), book: { [key]: bookRecord([0]) } });
  app.storageEvent();
  assert.equal(app.awards.length, 1);
  assert.equal(app.awards[0].eventId, 'bookkeys:page:' + key + ':0');
  assert.equal(app.awards[0].activityClass, 'standard-task');
  assert.equal(app.awards[0].contentKey, app.awards[0].contentKey);

  app.setPage(longB, 1);
  app.setGame({ xp: 900, paid: paidFor([key, 0, 400], [key, 1, 400]), book: { [key]: bookRecord([0, 1]) } });
  app.storageEvent();
  assert.equal(app.awards.length, 2);
  assert.equal(app.awards[1].eventId, 'bookkeys:page:' + key + ':1');

  app.setPage('A third distinct page describes a model and its assumptions. '.repeat(4), 2);
  app.setGame({ xp: 900, paid: paidFor([key, 0, 400], [key, 1, 400], [key, 2, 200]), book: { [key]: bookRecord([0, 1, 2]) } });
  app.storageEvent();
  assert.equal(app.awards.length, 3);

  app.setGame({ xp: 900, paid: paidFor([key, 0, 400], [key, 1, 400], [key, 2, 200]), book: { [key]: bookRecord([0, 1, 2], { chapters: [0], done: true }) } });
  app.storageEvent();
  assert.equal(app.awards.length, 4);
  assert.equal(app.awards[3].eventId, 'bookkeys:book:' + key);
  assert.equal(app.awards[3].activityClass, 'milestone');
  assert.equal(app.awards[3].evidence, 'milestone-complete');

  app.storageEvent();
  assert.equal(app.awards.length, 4, 'unchanged storage state cannot pay again');
});

test('Bookkeys does not award sample-only or uncompleted-book activity', () => {
  const app = boot(null, { index: 0, text: 'sample text '.repeat(30) });
  assert.equal(app.awards.length, 0);
  app.setGame({ xp: 25, paid: {}, book: { sample: bookRecord([]) } });
  app.storageEvent();
  assert.equal(app.awards.length, 0);
});

test('a completed-page record alone is insufficient without a substantial page and local XP receipt', () => {
  const key = 'short-pdf';
  const app = boot({ xp: 100, paid: {}, book: { [key]: bookRecord([]) } }, { index: 0, text: 'Hello from the PDF world.' });
  app.setGame({ xp: 100, paid: paidFor([key, 0, 30]), book: { [key]: bookRecord([0], { chapters: [0], done: true }) } });
  app.storageEvent();
  assert.equal(app.awards.length, 0, 'short text cannot claim a global page reward or book milestone');
});

test('eligible page rewards do not depend on the cumulative local XP total increasing', () => {
  const key = 'long-pdf';
  const app = boot({ xp: 100, paid: {}, book: { [key]: bookRecord([]) } }, { index: 0, text: longA });
  app.setGame({ xp: 100, paid: paidFor([key, 0, 400]), book: { [key]: bookRecord([0]) } });
  app.storageEvent();
  assert.equal(app.awards.length, 1);
  assert.equal(app.awards[0].eventId, 'bookkeys:page:' + key + ':0');
  assert.equal(app.awards[0].evidence, 'typed-page');
});

test('the same normalized passage in a differently packaged file uses the same repeat-policy content key', () => {
  const first = boot({ xp: 0, paid: {}, book: { 'file-a': bookRecord([]) } }, { index: 0, text: longA });
  first.setGame({ xp: 0, paid: paidFor(['file-a', 0, 400]), book: { 'file-a': bookRecord([0]) } });
  first.storageEvent();

  // Different file identity and formatting, same normalized passage.
  first.setPage(longA.toLowerCase().replace(/\s+/g, '  '), 0);
  first.setGame({
    xp: 0,
    paid: paidFor(['file-a', 0, 400], ['file-b', 0, 400]),
    book: { 'file-a': bookRecord([0]), 'file-b': bookRecord([0]) }
  });
  first.storageEvent();
  assert.equal(first.awards.length, 2);
  assert.notEqual(first.awards[0].eventId, first.awards[1].eventId);
  assert.equal(first.awards[0].contentKey, first.awards[1].contentKey);
});

test('low local accuracy evidence does not award a global page reward', () => {
  const key = 'low-accuracy-page';
  const app = boot({ xp: 0, paid: {}, book: { [key]: bookRecord([]) } }, { index: 0, text: longA });
  app.setGame({ xp: 0, paid: paidFor([key, 0, 80]), book: { [key]: bookRecord([0]) } });
  app.storageEvent();
  assert.equal(app.awards.length, 0);
});

test('book milestone needs three globally credited eligible pages, not merely three page indexes', () => {
  const key = 'mixed-book';
  const app = boot({ xp: 0, paid: {}, book: { [key]: bookRecord([]) } }, { index: 0, text: longA });
  app.setGame({ xp: 0, paid: paidFor([key, 0, 400]), book: { [key]: bookRecord([0]) } });
  app.storageEvent();

  app.setPage('Short.', 1);
  app.setGame({ xp: 0, paid: paidFor([key, 0, 400], [key, 1, 5]), book: { [key]: bookRecord([0, 1]) } });
  app.storageEvent();

  app.setPage(longB, 2);
  app.setGame({ xp: 0, paid: paidFor([key, 0, 400], [key, 1, 5], [key, 2, 400]), book: { [key]: bookRecord([0, 1, 2], { chapters: [0], done: true }) } });
  app.storageEvent();
  assert.equal(app.awards.filter(award => award.activityClass === 'milestone').length, 0);
});
