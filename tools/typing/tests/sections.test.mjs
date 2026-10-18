// The pure helpers that decide which sections are required and which are optional, plus the two
// list builders they feed (tidyChapters and evenChapters). The app's own behaviour on top of
// these is covered by the whole-page boot test (app-boot.test.mjs).
import test from "node:test";
import assert from "node:assert/strict";
import { loadHelpers } from "./helpers.mjs";

const H = loadHelpers([
  "sectionBody", "sectionRequired", "defaultReq", "withRequirements",
  "tidyChapters", "evenChapters", "SECTION_OPTIONAL",
]);

// ---------------------------------------------------------------------------
// sectionRequired: front matter and back matter are optional by default
// ---------------------------------------------------------------------------

test("front and back matter headings are optional by default", () => {
  for (const t of [
    "Contents", "Table of Contents", "Copyright", "Publication information", "Dedication",
    "Foreword", "Preface", "Introduction", "Prologue", "Epilogue", "Afterword", "Appendix",
    "Appendix A", "Glossary", "Bibliography", "References", "Sources", "Acknowledgements",
    "Acknowledgments", "Author's Note", "Index", "Colophon", "About the Author", "Also by",
  ]) assert.equal(H.sectionRequired(t), false, t + " should be optional");
});

test("actual chapters are required by default", () => {
  for (const t of [
    "Chapter One", "Chapter 7", "Chapter 1: The Gate", "Part II", "Book Three", "1", "12", "IV",
    "The Palace", "Kalidasa", "A Gathering of Shadows", "The Beginning",
  ]) assert.equal(H.sectionRequired(t), true, t + " should be required");
});

test("Roman-numeral parts and numbered chapters keep their numbering and stay required", () => {
  assert.equal(H.sectionRequired("I. The Palace"), true);
  assert.equal(H.sectionRequired("II. The River"), true);
  assert.equal(H.sectionRequired("1. Kalidasa"), true);
  assert.equal(H.sectionRequired("12. A Long Chapter Name"), true);
  assert.equal(H.sectionRequired("Part I. The Palace"), true);
  // ... while the numbering is taken off before a front/back-matter name is matched
  assert.equal(H.sectionRequired("I. Index"), false);
  assert.equal(H.sectionRequired("12. Notes"), false);
  assert.equal(H.sectionRequired("2. Introduction"), false, "the introduction is optional even when numbered");
});

test("articles in front of a section name do not hide it", () => {
  assert.equal(H.sectionRequired("The Index"), false);
  assert.equal(H.sectionRequired("A Note on the Text"), false);
  assert.equal(H.sectionRequired("The Preface"), false);
  assert.equal(H.sectionRequired("The Palace"), true, "a real title is not mistaken for front matter");
});

test("an untitled section is required, so a whole book still counts by default", () => {
  assert.equal(H.sectionRequired(""), true);
  assert.equal(H.sectionRequired(null), true);
  assert.equal(H.sectionRequired(undefined), true);
});

test("only whole words are matched, not prefixes of unrelated titles", () => {
  assert.equal(H.sectionRequired("Indexing the Stars"), true, "'Indexing' is not 'Index'");
  assert.equal(H.sectionRequired("Contest of Kings"), true, "'Contest' is not 'Contents'");
});

// ---------------------------------------------------------------------------
// defaults and merging
// ---------------------------------------------------------------------------

test("the pages before a book's first chapter are front matter", () => {
  assert.equal(H.defaultReq({ p: 0, title: "Beginning" }), false);
  assert.equal(H.defaultReq({ p: 3, title: "Beginning" }), true, "only the synthetic start is special");
  assert.equal(H.defaultReq({ p: 0, title: "Chapter One" }), true);
  assert.equal(H.defaultReq({ p: 4, title: "Preface" }), false);
});

test("withRequirements fills in missing defaults but never overrides a choice", () => {
  const out = H.withRequirements([
    { p: 0, title: "Contents" },
    { p: 1, title: "Chapter One", req: false },   // the reader said this chapter is optional
    { p: 2, title: "Chapter Two", req: true },
  ]);
  assert.deepEqual(out.map((c) => c.req), [false, false, true]);
  assert.deepEqual(out.map((c) => c.title), ["Contents", "Chapter One", "Chapter Two"]);
});

// ---------------------------------------------------------------------------
// the list builders carry the flag
// ---------------------------------------------------------------------------

test("tidyChapters gives the synthetic start and front matter the optional default", () => {
  const out = H.tidyChapters([
    { p: 5, title: "Chapter One" }, { p: 5, title: "dup" }, { p: 8, title: "Notes" },
  ], 12);
  assert.deepEqual(out.map((c) => c.p), [0, 5, 8]);
  assert.deepEqual(out.map((c) => c.req), [false, true, false]);
});

test("evenChapters splits a book into equal chunks that are all required", () => {
  const out = H.evenChapters(100);
  assert.deepEqual(out.map((c) => c.p), [0, 20, 40, 60, 80]);
  assert.ok(out.every((c) => c.req === true), "an even split is required until the reader says otherwise");
});
