import assert from "node:assert/strict";
import test from "node:test";
import { pagesFromText, textFingerprint } from "./bookkeys-text-importer";

test("plain text paragraphs are normalized and retained in reading order", () => {
  const pages = pagesFromText("  First paragraph.  \n\n Second   paragraph. ");
  assert.equal(pages.length, 1);
  assert.deepEqual(pages[0].map((block) => block.text), [
    "First paragraph.",
    "Second paragraph.",
  ]);
});

test("plain text is packed into multiple sections near the target size", () => {
  const source = Array.from({ length: 14 }, (_, index) =>
    "Paragraph " + index + ". " + "lorem ipsum ".repeat(10)
  ).join("\n\n");
  const pages = pagesFromText(source, 300);
  assert.ok(pages.length > 1);
  const joined = pages.flat().map((block) => block.text).join(" ");
  assert.equal(joined, source.replace(/\s+/g, " ").trim());
});

test("a single oversized paragraph is split at word boundaries without losing text", () => {
  const source = "word ".repeat(600).trim();
  const pages = pagesFromText(source, 240);
  assert.ok(pages.length > 1);
  assert.ok(pages.flat().every((block) => block.text.length <= 240));
  assert.equal(pages.flat().map((block) => block.text).join(" "), source);
});

test("empty input produces no sections", () => {
  assert.deepEqual(pagesFromText(" \n\n \t "), []);
});

test("text fingerprints are stable after whitespace normalization", () => {
  assert.equal(textFingerprint("one   two\nthree"), textFingerprint("one two three"));
  assert.notEqual(textFingerprint("one two"), textFingerprint("one three"));
});
