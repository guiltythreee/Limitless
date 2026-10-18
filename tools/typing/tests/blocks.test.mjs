// The pure helpers in the BLOCKS region: text extraction shaping, XP maths, chapter tidy-up,
// reward identity and draft signatures. Most of the PDF-specific behaviour of Bookkeys lives in
// these functions (the app code around them only pipes pdf.js items in and UI out), so testing
// them here is the PDF regression suite for the EPUB work.
import test from "node:test";
import assert from "node:assert/strict";
import { loadHelpers } from "./helpers.mjs";

const H = loadHelpers([
  "normalize", "extractLines", "median", "blocksFromLines", "pagesFromText",
  "chNumOk", "chNumKey", "chapterHeadsOnPage", "tidyChapters", "pickChapters", "evenChapters",
  "xpToReach", "levelForXp", "rankForLevel", "accPct", "accMult", "pageXp", "chapterXp", "bookXp",
  "dayKey", "streakStep", "rewardId", "payable", "textSig", "newGame",
]);

// ---------------------------------------------------------------------------
// normalize: Unicode and typographic noise are made predictable
// ---------------------------------------------------------------------------

test("normalize collapses whitespace and trims", () => {
  assert.equal(H.normalize("  a   b \n c  "), "a b c");
});

test("normalize is NFC: a decomposed accent becomes one character", () => {
  const decomposed = "é";          // e + combining acute
  const composed = "é";
  assert.equal(H.normalize(decomposed), composed);
});

test("normalize folds ligatures, smart quotes and dashes (the default setting)", () => {
  assert.equal(H.normalize("\uFB00ine \u2018quoted\u2019 \u201Cbig\u201D \u2014 dash \u2026 end"),
    "ffine 'quoted' \"big\" - dash ... end");   // ff ligature (U+FB00) folds to "ff"
});

test("normalize keeps CJK and emoji as-is", () => {
  assert.equal(H.normalize("你好 世界 \u{1F4D6}"), "你好 世界 \u{1F4D6}");
});

// ---------------------------------------------------------------------------
// extractLines / blocksFromLines: pdf.js items become lines, lines become blocks
// ---------------------------------------------------------------------------

function item(str, x, y, w, size = 10) {
  return { str, width: w, transform: [size, 0, 0, size, x, y], fontName: "F1" };
}

test("extractLines joins items on the same visual line", () => {
  const lines = H.extractLines([
    item("Hello", 10, 700, 30), item("world", 45, 700, 30),
    item("Next line.", 10, 680, 55),
  ], 100);
  assert.equal(lines.length, 2);
  assert.equal(lines[0].text, "Hello world");
  assert.equal(lines[1].text, "Next line.");
});

test("extractLines turns a bigger font into a heading", () => {
  const lines = H.extractLines([
    item("CHAPTER 1", 10, 700, 60, 18),
    item("Body text.", 10, 680, 50, 10),
  ], 100);
  const blocks = H.blocksFromLines(lines, 10, 792);
  assert.equal(blocks[0].t, "h");
  assert.equal(blocks[0].text, "CHAPTER 1");
});

test("blocksFromLines rejoins paragraph lines and de-breaks hyphenation", () => {
  const lines = [
    { text: "The quick brown fox jumps over the", y: 700, size: 10, x: 10, right: 200 },
    { text: "lazy dog and then continues walk-", y: 686, size: 10, x: 10, right: 200 },
    { text: "ing down the road.", y: 672, size: 10, x: 10, right: 200 },
  ];
  const blocks = H.blocksFromLines(lines, 10, 792);
  assert.equal(blocks.length, 1);
  assert.equal(blocks[0].text, "The quick brown fox jumps over the lazy dog and then continues walking down the road.");
});

// ---------------------------------------------------------------------------
// pagesFromText: pasted text becomes pages at the same ~900-char target
// ---------------------------------------------------------------------------

test("pagesFromText splits on blank lines and packs to about 900 characters", () => {
  const raw = Array.from({ length: 12 }, (_, i) => `Paragraph ${i}. ` + "lorem ".repeat(12)).join("\n\n");
  const pages = H.pagesFromText(raw);
  assert.ok(pages.length >= 2, "expected several pages");
  for (const page of pages) {
    assert.ok(page.length >= 1, "pages never empty");
    for (const b of page) assert.ok(["h", "p"].includes(b.t));
  }
  const joined = pages.flat().map((b) => b.text).join(" ");
  assert.equal(joined, raw.replace(/\n\n/g, " ").replace(/\s+/g, " ").trim());
});

// ---------------------------------------------------------------------------
// chapters: detection, tidy, even fallback
// ---------------------------------------------------------------------------

test("chNumOk accepts arabic, roman and word chapter numbers", () => {
  // chNumOk sees just the number token that CH_RE captured after chapter|part|book
  for (const t of ["1", "IV", "twelve", "3", "II"]) assert.ok(H.chNumOk(t), t);
  for (const t of ["0", "onepiece", "xyz"]) assert.ok(!H.chNumOk(t), t);
});

test("tidyChapters sorts, dedupes by page and guarantees a start at page 0", () => {
  const out = H.tidyChapters([{ p: 5, title: "B" }, { p: 5, title: "dup" }, { p: 2, title: "A" }], 10);
  assert.deepEqual(out.map((c) => c.p), [0, 2, 5]);
  assert.equal(out[0].title, "Beginning");      // the book before its first chapter
  assert.equal(out[1].title, "A");
  assert.equal(out[2].title, "B");
});

test("evenChapters splits a book into equal chunks", () => {
  assert.deepEqual(H.evenChapters(100).map((c) => c.p), [0, 20, 40, 60, 80]);
  assert.deepEqual(H.evenChapters(10).map((c) => c.p), [0], "a short book stays one chunk");
});

test("chapterHeadsOnPage finds 'Chapter N' lines near the top of a page", () => {
  const heads = H.chapterHeadsOnPage(
    [{ text: "CHAPTER 7", y: 60, size: 16 }, { text: "It was a dark and stormy night.", y: 90, size: 10 }],
    10, 792);
  assert.equal(heads.length, 1, "only the heading line counts");
  assert.equal(heads[0].key, "chapter 7");
  assert.equal(heads[0].title, "CHAPTER 7");
});

// ---------------------------------------------------------------------------
// XP maths, ranks, streaks
// ---------------------------------------------------------------------------

test("levels need increasing XP and ranks advance every five levels", () => {
  assert.equal(H.xpToReach(1), 0);
  assert.equal(H.levelForXp(0), 1);
  assert.equal(H.levelForXp(H.xpToReach(2) - 1), 1);
  assert.equal(H.levelForXp(H.xpToReach(2)), 2);
  assert.equal(H.rankForLevel(1), "Novice Typist");
  assert.equal(H.rankForLevel(6), "Page Turner");
  assert.equal(H.rankForLevel(999), "Typing Legend");
});

test("accuracy rounds half up and multipliers band at 98/95/85", () => {
  assert.equal(H.accPct(2, 3), 67);
  assert.equal(H.accPct(1, 2), 50);
  assert.equal(H.accPct(0, 0), 100);
  assert.equal(H.accMult(98), 125);
  assert.equal(H.accMult(97), 110);
  assert.equal(H.accMult(85), 100);
  assert.equal(H.accMult(84), 80);
});

test("page, chapter and book XP are whole numbers and capped", () => {
  assert.ok(Number.isInteger(H.pageXp(150, 100)));
  assert.equal(H.pageXp(150, 100), Math.floor((150 * 125 + 50) / 100));
  assert.equal(H.chapterXp(1000), 1500);          // cap
  assert.equal(H.chapterXp(2), 90);
  assert.equal(H.bookXp(100000), 25000);          // cap
  assert.equal(H.bookXp(10), 700);
});

test("streaks continue over one gap day and reset after two", () => {
  const day = (n) => "2026-01-" + ("0" + n).slice(-2);      // streakStep works on dayKey strings
  assert.deepEqual(H.streakStep({ cur: 3, best: 5, last: day(4) }, day(5), day(4)),
    { cur: 4, best: 5, last: day(5) });                     // yesterday and today
  assert.deepEqual(H.streakStep({ cur: 3, best: 5, last: day(3) }, day(5), day(4)),
    { cur: 1, best: 5, last: day(5) });                     // two days off restarts the streak
  assert.deepEqual(H.streakStep({ cur: 3, best: 3, last: day(5) }, day(5), day(4)),
    { cur: 3, best: 3, last: day(5) });                     // already recorded today
  assert.equal(H.dayKey(new Date(2026, 0, 5)), "2026-01-05");
});

// ---------------------------------------------------------------------------
// reward identity and the pay-once rule (EPUB shares all of this)
// ---------------------------------------------------------------------------

test("rewardId builds one stable id per reward", () => {
  assert.equal(H.rewardId("p", "f:abc", 3), "p:f:abc:3");
  assert.equal(H.rewardId("b", "f:abc"), "b:f:abc");
});

test("payable pays an id exactly once", () => {
  const paid = {};
  assert.ok(H.payable(paid, "p:f:x:1", false));
  paid["p:f:x:1"] = 12;
  assert.ok(!H.payable(paid, "p:f:x:1", false), "second call with the record updated must not pay");
  assert.ok(!H.payable(paid, "p:f:x:2", true), "the caller's own already-finished marker also blocks");
  assert.ok(H.payable(paid, "p:f:x:2", false), "an unseen section still pays");
  assert.ok(!H.payable(null, "p:f:x:3", false), "no record object: nothing is ever paid");
});

test("textSig changes when the text changes and is stable when it does not", () => {
  assert.equal(H.textSig("abc"), H.textSig("abc"));
  assert.notEqual(H.textSig("abc"), H.textSig("abd"));
  assert.equal(typeof H.textSig("x"), "string");
});

test("newGame starts at level 1 with nothing paid", () => {
  const g = H.newGame();
  assert.equal(g.xp, 0);
  assert.deepEqual(g.paid, {});
  assert.deepEqual(g.book, {});
});
