import test from "node:test";
import assert from "node:assert/strict";
import {
  extractLines, blocksFromLines, pagesFromText, chNumOk, chNumKey,
  chapterHeadsOnPage, tidyChapters, pickChapters, evenChapters,
} from "./pdf-domain";

function item(str: string, x: number, y: number, width: number, size = 10) {
  return { str, width, transform: [size, 0, 0, size, x, y], fontName: "F1" };
}

test("extractLines joins text runs on the same visual line", () => {
  const lines = extractLines([
    item("Hello", 10, 700, 30), item("world", 45, 700, 30),
    item("Next line.", 10, 680, 55),
  ], 100);
  assert.equal(lines.length, 2);
  assert.equal(lines[0].text, "Hello world");
  assert.equal(lines[1].text, "Next line.");
});

test("large PDF font runs become headings", () => {
  const lines = extractLines([
    item("CHAPTER 1", 10, 700, 60, 18),
    item("Body text.", 10, 680, 50, 10),
  ], 100);
  const blocks = blocksFromLines(lines, 10, 792);
  assert.equal(blocks[0].t, "h");
  assert.equal(blocks[0].text, "CHAPTER 1");
});

test("paragraph lines join and line-end hyphenation is repaired", () => {
  const blocks = blocksFromLines([
    { text: "The quick brown fox jumps over the", y: 700, size: 10, x: 10, right: 200 },
    { text: "lazy dog and then continues walk-", y: 686, size: 10, x: 10, right: 200 },
    { text: "ing down the road.", y: 672, size: 10, x: 10, right: 200 },
  ], 10, 792);
  assert.equal(blocks.length, 1);
  assert.equal(blocks[0].text, "The quick brown fox jumps over the lazy dog and then continues walking down the road.");
});

test("pasted text splits on blank lines and packs paragraphs near 900 characters", () => {
  const raw = Array.from({ length: 12 }, (_, i) => `Paragraph ${i}. ` + "lorem ".repeat(12)).join("\n\n");
  const pages = pagesFromText(raw);
  assert.ok(pages.length >= 2);
  assert.ok(pages.every((page) => page.length > 0));
  const joined = pages.flat().map((block) => block.text).join(" ");
  assert.equal(joined, raw.replace(/\n\n/g, " ").replace(/\s+/g, " ").trim());
});

test("chapter number validation accepts Arabic, Roman and word numbers", () => {
  for (const value of ["1", "IV", "twelve", "3", "II"]) assert.ok(chNumOk(value), value);
  for (const value of ["0", "onepiece", "xyz"]) assert.ok(!chNumOk(value), value);
  assert.equal(chNumKey(" CHAPTER   IV "), "chapter iv");
});

test("chapter headings are detected near the page edge", () => {
  const heads = chapterHeadsOnPage([
    { text: "CHAPTER 7", y: 60, size: 16, x: 10, right: 100 },
    { text: "It was a dark and stormy night.", y: 90, size: 10, x: 10, right: 200 },
  ], 10, 792);
  assert.equal(heads.length, 1);
  assert.equal(heads[0].key, "chapter 7");
  assert.equal(heads[0].title, "CHAPTER 7");
});

test("tidyChapters sorts, deduplicates and inserts a Beginning entry", () => {
  const chapters = tidyChapters([
    { p: 5, title: "B" }, { p: 5, title: "duplicate" }, { p: 2, title: "A" },
  ], 10);
  assert.deepEqual(chapters.map((chapter) => chapter.p), [0, 2, 5]);
  assert.deepEqual(chapters.map((chapter) => chapter.title), ["Beginning", "A", "B"]);
});

test("even chapter fallback creates five balanced parts for long books", () => {
  assert.deepEqual(evenChapters(100).map((chapter) => chapter.p), [0, 20, 40, 60, 80]);
  assert.deepEqual(evenChapters(10).map((chapter) => chapter.p), [0]);
});

test("chapter detection falls back to balanced parts when no headings are found", () => {\n  assert.deepEqual(pickChapters([[], []], 100).map((chapter) => chapter.p), [0, 20, 40, 60, 80]);\n});\n\ntest("chapter detection keeps the first occurrence of a repeated heading", () => {
  const chapters = pickChapters([
    [{ key: "chapter 1", title: "Chapter 1" }],
    [],
    [{ key: "chapter 1", title: "Chapter 1 duplicate" }, { key: "chapter 2", title: "Chapter 2" }],
  ], 3);
  assert.deepEqual(chapters.map((chapter) => [chapter.p, chapter.title]), [
    [0, "Chapter 1"], [2, "Chapter 2"],
  ]);
});
