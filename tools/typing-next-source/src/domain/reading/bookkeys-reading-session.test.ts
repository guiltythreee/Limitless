import test from "node:test";
import assert from "node:assert/strict";
import {
  typingAccuracy, pageSignature, createPageDraft, readPageDraft,
  accuracyMultiplier, pageXp, chapterXp, bookXp, completeBookkeysPage, emptyBookkeysGame,
} from "./bookkeys-reading-session";

test("typing accuracy counts matching positions and rounds percentage", () => {
  assert.deepEqual(typingAccuracy("abc", "axc"), { correct: 2, total: 3, percent: 67 });
  assert.deepEqual(typingAccuracy("", ""), { correct: 0, total: 0, percent: 100 });
  assert.equal(typingAccuracy("abc", "abcd").percent, 100);
});

test("drafts retain their v1 shape and reject mismatched page content", () => {
  const draft = createPageDraft(2, "Chapter text", "Chapter", 1000, 2500);
  assert.equal(draft.v, 1);
  assert.equal(draft.spent, 1500);
  assert.equal(readPageDraft(JSON.stringify(draft), 2, "Chapter text")?.typed, "Chapter");
  assert.equal(readPageDraft(JSON.stringify(draft), 3, "Chapter text"), null);
  assert.equal(readPageDraft(JSON.stringify(draft), 2, "Changed text"), null);
});

test("accuracy multipliers and page XP retain legacy thresholds", () => {
  assert.equal(accuracyMultiplier(98), 125);
  assert.equal(accuracyMultiplier(97), 110);
  assert.equal(accuracyMultiplier(85), 100);
  assert.equal(accuracyMultiplier(84), 80);
  assert.equal(pageXp(150, 100), Math.floor((150 * 125 + 50) / 100));
});

test("a completed page updates legacy progress keys and pays once", () => {
  const initial = emptyBookkeysGame();
  const first = completeBookkeysPage(initial, "f:book", 0, "hello world", "hello world", 1000);
  assert.equal(first.xpAwarded, pageXp(11, 100));
  assert.deepEqual(first.game.book?.["f:book"]?.p, [0]);
  assert.deepEqual(first.game.book?.["f:book"]?.x, [0]);
  assert.equal(first.game.check?.key, "f:book");
  const repeat = completeBookkeysPage(first.game, "f:book", 0, "hello world", "hello world", 1000);
  assert.equal(repeat.xpAwarded, 0);
  assert.equal(repeat.alreadyCompleted, true);
  assert.equal(repeat.game.xp, first.game.xp);
});

test("fast paste is recorded as progress but earns no XP", () => {
  const result = completeBookkeysPage(emptyBookkeysGame(), "f:book", 1, "a".repeat(100), "a".repeat(100), 100);
  assert.equal(result.eligibleForXp, false);
  assert.equal(result.xpAwarded, 0);
  assert.deepEqual(result.game.book?.["f:book"]?.p, [1]);
});


test("chapter and book bonuses retain legacy caps and minimums", () => {
  assert.equal(chapterXp(2), 90);
  assert.equal(chapterXp(1000), 1500);
  assert.equal(bookXp(10), 700);
  assert.equal(bookXp(100000), 25000);
});

test("required chapter and book milestones pay once when their ranges finish", () => {
  const chapters = [{ p: 0, title: "Chapter One", req: true }];
  const result = completeBookkeysPage(
    emptyBookkeysGame(), "f:novel", 0, "abcdefghij", "abcdefghij", 1000, chapters, 1,
  );
  assert.equal(result.xpAwarded, pageXp(10, 100) + chapterXp(10) + bookXp(10));
  assert.equal(result.game.chapters, 1);
  assert.equal(result.game.books, 1);
  assert.equal(result.game.paid?.["c:f:novel:0"], chapterXp(10));
  assert.equal(result.game.paid?.["b:f:novel"], bookXp(10));
  const repeat = completeBookkeysPage(result.game, "f:novel", 0, "abcdefghij", "abcdefghij", 1000, chapters, 1);
  assert.equal(repeat.xpAwarded, 0);
});

test("optional sections do not block required-book completion and all-optional books pay no book bonus", () => {
  const chapters = [
    { p: 0, title: "Beginning", req: false },
    { p: 1, title: "Chapter One", req: true },
  ];
  const first = completeBookkeysPage(
    emptyBookkeysGame(), "f:optional", 1, "required", "required", 1000, chapters, 2,
  );
  assert.equal(first.game.books, 1);
  const allOptional = completeBookkeysPage(
    emptyBookkeysGame(), "f:all-optional", 0, "notes", "notes", 1000,
    [{ p: 0, title: "Contents", req: false }], 1,
  );
  assert.equal(allOptional.game.books, 0);
  assert.equal(allOptional.game.paid?.["b:f:all-optional"], undefined);
});


test("an unreadable required PDF page counts as empty and cannot block book completion", () => {
  const chapters = [{ p: 0, title: "Beginning", req: true }];
  const result = completeBookkeysPage(
    emptyBookkeysGame(), "pdf-fingerprint", 0, "readable page", "readable page", 1000,
    chapters, 2, [1],
  );
  assert.deepEqual(result.game.book?.["pdf-fingerprint"]?.p, [0]);
  assert.deepEqual(result.game.book?.["pdf-fingerprint"]?.e, [1]);
  assert.equal(result.game.book?.["pdf-fingerprint"]?.done, 1);
  assert.equal(result.game.books, 1);
  assert.ok((result.game.paid?.["b:pdf-fingerprint"] ?? 0) > 0);
});

test("an empty PDF page can be recorded without page XP", () => {
  const result = completeBookkeysPage(
    emptyBookkeysGame(), "pdf-fingerprint", 1, "", "", 0,
    [{ p: 0, title: "Beginning", req: true }], 2, [1],
  );
  assert.equal(result.xpAwarded, 0);
  assert.deepEqual(result.game.book?.["pdf-fingerprint"]?.e, [1]);
  assert.deepEqual(result.game.book?.["pdf-fingerprint"]?.p, []);
});

test("different pages in one book have independent reward identities", () => {
  const first = completeBookkeysPage(emptyBookkeysGame(), "f:book", 0, "a".repeat(10), "a".repeat(10), 1000);
  const second = completeBookkeysPage(first.game, "f:book", 1, "b".repeat(10), "b".repeat(10), 1000);
  assert.deepEqual(second.game.book?.["f:book"]?.p, [0, 1]);
  assert.equal(second.xpAwarded, pageXp(10, 100));
  assert.equal(pageSignature("same"), pageSignature("same"));
});


test("live archive metrics update with legacy streak, daily, session and perfect-page rules", () => {
  const day1 = new Date(2026, 10, 7, 12).getTime();
  const day2 = new Date(2026, 10, 8, 12).getTime();
  const day3 = new Date(2026, 10, 9, 12).getTime();
  const page = "a".repeat(250);
  const first = completeBookkeysPage(emptyBookkeysGame(), "metrics", 0, page, page, 50_000, [], 0, [], day1);
  assert.equal(first.game.bestWpm, 60);
  assert.equal(first.game.bestPct, 100);
  assert.equal(first.game.perfect, 1);
  assert.equal(first.game.run, 1);
  assert.equal(first.game.bestRun, 1);
  assert.equal(first.game.words, 50);
  assert.equal(first.game.chars, 250);
  assert.equal(first.game.days, 1);
  assert.equal(first.game.streak?.cur, 1);
  assert.ok(first.game.ach?.["perfect1"]);

  const second = completeBookkeysPage(first.game, "metrics", 1, page, page, 50_000, [], 0, [], day2);
  assert.equal(second.game.streak?.cur, 2);
  assert.equal(second.game.streak?.best, 2);
  assert.equal(second.game.days, 2);
  assert.equal(second.game.bestDay, 50);
  assert.equal(second.game.sessMax, 2);

  const third = completeBookkeysPage(second.game, "metrics", 2, page, page, 50_000, [], 0, [], day3);
  assert.equal(third.game.streak?.cur, 3);
  assert.ok(third.game.ach?.["streak3"]);
});

test("short eligible pages update totals and unlock page achievements without creating speed samples", () => {
  let game = emptyBookkeysGame();
  for (let page = 0; page < 10; page += 1) {
    game = completeBookkeysPage(game, "ten-pages", page, "abcdefghij", "abcdefghij", 1000, [], 0, [], new Date(2026, 10, 7, 12).getTime()).game;
  }
  assert.equal(game.pages, 10);
  assert.equal(game.bestWpm, 0);
  assert.ok(game.ach?.["pages10"]);
});
