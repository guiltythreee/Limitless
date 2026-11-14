import test from "node:test";
import assert from "node:assert/strict";
import {
  BOOKKEYS_ACHIEVEMENTS, bookkeysAchievementProgress, bookkeysArchiveSummary,
  bookkeysLevelForXp, bookkeysRankForLevel, bookkeysXpToReach,
} from "./bookkeys-achievements";

test("legacy level thresholds and rank bands are preserved", () => {
  assert.equal(bookkeysXpToReach(1), 0);
  assert.equal(bookkeysXpToReach(2), 400);
  assert.equal(bookkeysXpToReach(3), 900);
  assert.equal(bookkeysLevelForXp(399), 1);
  assert.equal(bookkeysLevelForXp(400), 2);
  assert.equal(bookkeysLevelForXp(899), 2);
  assert.equal(bookkeysLevelForXp(900), 3);
  assert.equal(bookkeysRankForLevel(1), "Novice Typist");
  assert.equal(bookkeysRankForLevel(6), "Page Turner");
  assert.equal(bookkeysRankForLevel(3), "Novice Typist");
  assert.equal(bookkeysRankForLevel(50), "Typing Legend");
});

test("achievement catalogue retains stable IDs and includes legacy groups", () => {
  assert.equal(BOOKKEYS_ACHIEVEMENTS.length, 60);
  assert.ok(BOOKKEYS_ACHIEVEMENTS.some((item) => item.id === "words500"));
  assert.ok(BOOKKEYS_ACHIEVEMENTS.some((item) => item.id === "streak100"));
  assert.ok(BOOKKEYS_ACHIEVEMENTS.some((item) => item.id === "words100000000"));
  assert.equal(new Set(BOOKKEYS_ACHIEVEMENTS.map((item) => item.id)).size, BOOKKEYS_ACHIEVEMENTS.length);
});

test("archive summary reads legacy achievement data without mutating it", () => {
  const game = {
    xp: 400, words: 600, pages: 10, bestWpm: 55, perfect: 1, days: 4,
    streak: { cur: 3, best: 7, last: "2026-11-07" },
    ach: { words500: 123456789 },
  };
  const before = JSON.stringify(game);
  const summary = bookkeysArchiveSummary(game);
  assert.equal(summary.level, 2);
  assert.equal(summary.rank, "Novice Typist");
  assert.equal(summary.unlocked, 1);
  assert.equal(summary.currentStreak, 3);
  assert.equal(summary.bestStreak, 7);
  assert.equal(summary.achievements.find((item) => item.id === "words500")?.unlocked, true);
  assert.equal(summary.achievements.find((item) => item.id === "words5000")?.value, 600);
  assert.equal(JSON.stringify(game), before);
});

test("unrecorded achievements are not silently marked as unlocked", () => {
  const items = bookkeysAchievementProgress({ words: 1000000, ach: {} });
  assert.equal(items.find((item) => item.id === "words500")?.reached, true);
  assert.equal(items.find((item) => item.id === "words500")?.unlocked, false);
});
