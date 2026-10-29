'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const vm = require('node:vm');

const source = readFileSync(join(__dirname, 'bookkeys-bridge.js'), 'utf8');
function boot(initialGame) {
  const values = new Map();
  if (initialGame !== undefined) values.set('bookkeys:game', JSON.stringify(initialGame));
  const storage = {
    getItem(key) { return values.has(key) ? values.get(key) : null; },
    setItem(key, value) { values.set(key, String(value)); }
  };
  const awards = [];
  const listeners = {};
  const window = {
    LimitlessRewards: { record(input) { awards.push(input); return { ok: true, xp: 10 }; } },
    addEventListener(name, callback) { listeners[name] = callback; }
  };
  const document = { readyState: 'complete', addEventListener() {} };
  vm.runInNewContext(source, { window, document, localStorage: storage });
  return {
    awards,
    listeners,
    setGame(game) { storage.setItem('bookkeys:game', JSON.stringify(game)); },
    storageEvent() { listeners.storage({ key: 'bookkeys:game' }); }
  };
}

test('Bookkeys seeds legacy progress without retroactive rewards, then pays a new page and book milestone once', () => {
  const app = boot({ xp: 900, books: 3, book: { 'book-hash': { p: [0], c: [], done: 0 } } });
  assert.equal(app.awards.length, 0, 'existing work is baseline, not new global EXP');

  app.setGame({ xp: 940, books: 3, book: { 'book-hash': { p: [0, 1, 2], c: [], done: 0 } } });
  app.storageEvent();
  assert.equal(app.awards.length, 2);
  assert.equal(app.awards[0].eventId, 'bookkeys:page:book-hash:1');
  assert.equal(app.awards[1].eventId, 'bookkeys:page:book-hash:2');
  assert.ok(app.awards.every((award) => award.activityClass === 'standard-task'));
  assert.ok(app.awards.every((award) => award.evidence === 'typed-page'));

  app.setGame({ xp: 990, books: 3, book: { 'book-hash': { p: [0, 1, 2], c: [0], done: 1 } } });
  app.storageEvent();
  assert.equal(app.awards.length, 3);
  assert.equal(app.awards[2].eventId, 'bookkeys:book:book-hash');
  assert.equal(app.awards[2].activityClass, 'milestone');
  assert.equal(app.awards[2].evidence, 'milestone-complete');
  assert.equal(app.awards[2].oneTimeKey, 'bookkeys:book:book-hash');

  app.storageEvent();
  assert.equal(app.awards.length, 3, 'unchanged storage state cannot pay again');
});

test('Bookkeys does not award sample-only or uncompleted-book activity', () => {
  const app = boot(null);
  assert.equal(app.awards.length, 0);
  app.setGame({ xp: 25, book: { sample: { p: [], c: [], done: 0 } } });
  app.storageEvent();
  assert.equal(app.awards.length, 0);
});

test('new canonical Bookkeys completed-page records earn global EXP even when local XP is unchanged', () => {
  const app = boot({ xp: 100, book: { book: { p: [], c: [], done: 0 } } });
  app.setGame({ xp: 100, book: { book: { p: [0], c: [], done: 0 } } });
  app.storageEvent();
  assert.equal(app.awards.length, 1);
  assert.equal(app.awards[0].eventId, 'bookkeys:page:book:0');
  assert.equal(app.awards[0].evidence, 'typed-page');

  app.setGame({ xp: 100, book: { book: { p: [0, 1], c: [], done: 0 } } });
  app.storageEvent();
  assert.equal(app.awards.length, 2);
  assert.equal(app.awards[1].eventId, 'bookkeys:page:book:1');
});

test('a one-page PDF can earn its page award but not the book-completion milestone', () => {
  const app = boot(null);
  app.setGame({ xp: 80, book: { shortPdf: { p: [0], c: [0], done: 1 } } });
  app.storageEvent();
  assert.equal(app.awards.length, 1);
  assert.equal(app.awards[0].eventId, 'bookkeys:page:shortPdf:0');
});