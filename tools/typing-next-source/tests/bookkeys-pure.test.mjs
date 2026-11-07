import test from "node:test";
import assert from "node:assert/strict";
import {
  normalize, pagesFromText, tidyChapters, evenChapters, withRequirements,
  xpToReach, levelForXp, pageXp, chapterXp, bookXp, streakStep, textSig,
  newGame, ACH, rankForLevel
} from "../src/lib/bookkeys/blocks.mjs";
import {
  epubHash, epubFlattenToc, epubResolveRel, epubHrefKey,
  epubLongPieces, epubExpandBlocks, epubPackSections, epubChapterList, epubErr
} from "../src/lib/bookkeys/epub.mjs";

test("text normalization preserves canonical text and applies Bookkeys punctuation rules", () => {
  assert.equal(normalize("Cafe\u0301  —  “hello”…"), 'Café - "hello"...');
  assert.equal(normalize("ﬁsh\u00adhook"), "fishhook");
});

test("plain text becomes paragraph blocks and bounded typing pages", () => {
  const pages = pagesFromText("First paragraph.\n\n" + "A long sentence. ".repeat(90));
  assert.ok(pages.length >= 2);
  assert.ok(pages.flat().every(block => block.t === "p" && block.text.length > 0));
});

test("chapter cleanup sorts, deduplicates and inserts the beginning boundary", () => {
  assert.deepEqual(tidyChapters([
    { p: 8, title: "Later" }, { p: 0, title: "Start" },
    { p: 8, title: "Duplicate" }, { p: 99, title: "Outside" }
  ], 12).map(({ p, title }) => ({ p, title })), [
    { p: 0, title: "Start" }, { p: 8, title: "Later" }
  ]);
});

test("even chapter splitting and requirement normalization retain valid boundaries", () => {
  const chapters = evenChapters(41);
  assert.equal(chapters[0].p, 0);
  assert.ok(chapters.every((chapter, i) => chapter.p >= 0 && (i === 0 || chapter.p > chapters[i - 1].p)));
  assert.ok(withRequirements([{ p: 0, title: "Beginning" }])[0].req === false);
});

test("legacy Bookkeys XP curve and integer reward rounding are stable", () => {
  assert.equal(xpToReach(1), 0);
  assert.equal(xpToReach(2), 400);
  assert.equal(levelForXp(399), 1);
  assert.equal(levelForXp(400), 2);
  assert.equal(pageXp(100, 98), 125);
  assert.equal(pageXp(100, 95), 110);
  assert.equal(pageXp(100, 85), 100);
  assert.equal(pageXp(100, 84), 80);
  assert.equal(chapterXp(1), 65);
  assert.equal(chapterXp(100), 1500);
  assert.equal(bookXp(1), 340);
  assert.equal(bookXp(1000), 25000);
  assert.equal(rankForLevel(1), "Novice Typist");
  assert.equal(ACH.length, 60);
});

test("streak updates are idempotent for today and advance only from yesterday", () => {
  assert.deepEqual(streakStep({ cur: 3, best: 4, last: "2026-11-06" }, "2026-11-07", "2026-11-06"),
    { cur: 4, best: 4, last: "2026-11-07" });
  assert.deepEqual(streakStep({ cur: 3, best: 4, last: "2026-11-07" }, "2026-11-07", "2026-11-06"),
    { cur: 3, best: 4, last: "2026-11-07" });
  assert.deepEqual(streakStep({ cur: 3, best: 4, last: "2026-11-04" }, "2026-11-07", "2026-11-06"),
    { cur: 1, best: 4, last: "2026-11-07" });
});

test("draft signatures and new-game defaults remain stable", () => {
  assert.equal(textSig("abc"), textSig("abc"));
  assert.notEqual(textSig("abc"), textSig("abd"));
  const game = newGame();
  assert.equal(game.xp, 0);
  assert.deepEqual(game.paid, {});
  assert.deepEqual(game.streak, { cur: 0, best: 0, last: "" });
});

test("EPUB hashes are deterministic and sensitive to byte changes", () => {
  assert.equal(epubHash(new Uint8Array([1, 2, 3])), epubHash(new Uint8Array([1, 2, 3])));
  assert.notEqual(epubHash(new Uint8Array([1, 2, 3])), epubHash(new Uint8Array([1, 2, 4])));
});

test("EPUB table of contents flattens depth-first and normalizes labels", () => {
  assert.deepEqual(epubFlattenToc([{ href: "a.xhtml", label: " Chapter   One ", subitems: [
    { href: "b.xhtml#part", label: "Part Two" }
  ] }]), [
    { href: "a.xhtml", label: "Chapter One" },
    { href: "b.xhtml#part", label: "Part Two" }
  ]);
});

test("EPUB relative paths and href keys resolve safely", () => {
  assert.equal(epubResolveRel("OPS/Text", "../Images/cover.jpg"), "OPS/Images/cover.jpg");
  assert.equal(epubResolveRel("OPS/Text", "./chapter.xhtml"), "OPS/Text/chapter.xhtml");
  assert.equal(epubResolveRel("OPS", "https://example.com/book"), "https://example.com/book");
  assert.equal(epubHrefKey("Text/chapter.xhtml?x=1#section"), "Text/chapter.xhtml");
});

test("EPUB long paragraphs split and preserve the original block identity once", () => {
  const long = "Sentence with enough words to split. ".repeat(80);
  const pieces = epubLongPieces(long, 500);
  assert.ok(pieces.length > 1);
  assert.ok(pieces.every(piece => piece.length <= 500));
  const expanded = epubExpandBlocks([{ t: "p", text: long, id: "anchor" }], 500);
  assert.equal(expanded[0].id, "anchor");
  assert.ok(expanded.slice(1).every(block => !("id" in block)));
});

test("EPUB section packing maps each source block to its section", () => {
  const packed = epubPackSections([
    { t: "p", text: "a".repeat(6) },
    { t: "p", text: "b".repeat(6) },
    { t: "h", text: "Chapter 2" }
  ], 10);
  assert.deepEqual(packed.secOf, [0, 0, 1]);
  assert.deepEqual(packed.sections.map(section => section.length), [2, 1]);
});

test("EPUB chapter boundaries use the same required/optional rules as PDF chapters", () => {
  const chapters = epubChapterList([
    { start: 0, count: 2, title: "Beginning" },
    { start: 4, count: 3, title: "Chapter Two" }
  ], 8);
  assert.deepEqual(chapters.map(({ p, title }) => ({ p, title })), [
    { p: 0, title: "Beginning" }, { p: 4, title: "Chapter Two" }
  ]);
});

test("EPUB errors expose concise user-facing validation messages", () => {
  assert.equal(epubErr({ epubInvalid: true }), "This file is not a valid EPUB, or it is damaged.");
  assert.equal(epubErr({ epubEmpty: true }), "This EPUB opened, but it has no readable text in it (its pages may be images only).");
});
