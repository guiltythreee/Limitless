import test from "node:test";
import assert from "node:assert/strict";
import {
  typingAccuracy, pageSignature, createPageDraft, readPageDraft,
  accuracyMultiplier, pageXp, completeBookkeysPage, emptyBookkeysGame,
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

test("different pages in one book have independent reward identities", () => {
  const first = completeBookkeysPage(emptyBookkeysGame(), "f:book", 0, "a".repeat(10), "a".repeat(10), 1000);
  const second = completeBookkeysPage(first.game, "f:book", 1, "b".repeat(10), "b".repeat(10), 1000);
  assert.deepEqual(second.game.book?.["f:book"]?.p, [0, 1]);
  assert.equal(second.xpAwarded, pageXp(10, 100));
  assert.equal(pageSignature("same"), pageSignature("same"));
});
