import test from "node:test";
import assert from "node:assert/strict";
import {
  sectionBody, sectionRequired, defaultReq, withRequirements, tidyChapters,
  evenChapters, requiredRanges, requiredSections, requiredSectionsComplete,
} from "./bookkeys-chapters";

test("front and back matter headings are optional by default", () => {
  for (const title of [
    "Contents", "Table of Contents", "Copyright", "Publication information", "Dedication",
    "Foreword", "Preface", "Introduction", "Prologue", "Epilogue", "Afterword", "Appendix",
    "Appendix A", "Glossary", "Bibliography", "References", "Sources", "Acknowledgements",
    "Acknowledgments", "Author's Note", "Index", "Colophon", "About the Author", "Also by",
  ]) assert.equal(sectionRequired(title), false, title);
});

test("actual chapter titles remain required by default", () => {
  for (const title of [
    "Chapter One", "Chapter 7", "Chapter 1: The Gate", "Part II", "Book Three", "1", "12", "IV",
    "The Palace", "Kalidasa", "A Gathering of Shadows", "The Beginning",
  ]) assert.equal(sectionRequired(title), true, title);
});

test("numbering is removed before optional headings are matched", () => {
  assert.equal(sectionRequired("I. The Palace"), true);
  assert.equal(sectionRequired("II. The River"), true);
  assert.equal(sectionRequired("1. Kalidasa"), true);
  assert.equal(sectionRequired("12. A Long Chapter Name"), true);
  assert.equal(sectionRequired("Part I. The Palace"), true);
  assert.equal(sectionRequired("I. Index"), false);
  assert.equal(sectionRequired("12. Notes"), false);
  assert.equal(sectionRequired("2. Introduction"), false);
});

test("leading articles do not hide front and back matter names", () => {
  assert.equal(sectionRequired("The Index"), false);
  assert.equal(sectionRequired("A Note on the Text"), false);
  assert.equal(sectionRequired("The Preface"), false);
  assert.equal(sectionRequired("The Palace"), true);
});

test("untitled sections remain required and whole words are matched", () => {
  assert.equal(sectionRequired(""), true);
  assert.equal(sectionRequired(null), true);
  assert.equal(sectionRequired(undefined), true);
  assert.equal(sectionRequired("Indexing the Stars"), true);
  assert.equal(sectionRequired("Contest of Kings"), true);
  assert.equal(sectionBody("12. Notes"), "notes");
});

test("the synthetic Beginning entry is optional only at index zero", () => {
  assert.equal(defaultReq({ p: 0, title: "Beginning" }), false);
  assert.equal(defaultReq({ p: 3, title: "Beginning" }), true);
  assert.equal(defaultReq({ p: 0, title: "Chapter One" }), true);
  assert.equal(defaultReq({ p: 4, title: "Preface" }), false);
});

test("withRequirements fills defaults but preserves a reader's explicit choice", () => {
  const chapters = withRequirements([
    { p: 0, title: "Contents" },
    { p: 1, title: "Chapter One", req: false },
    { p: 2, title: "Chapter Two", req: true },
  ]);
  assert.deepEqual(chapters.map((chapter) => chapter.req), [false, false, true]);
  assert.deepEqual(chapters.map((chapter) => chapter.title), ["Contents", "Chapter One", "Chapter Two"]);
});

test("tidyChapters adds optional Beginning and classifies the rest", () => {
  const chapters = tidyChapters([
    { p: 5, title: "Chapter One" }, { p: 5, title: "duplicate" }, { p: 8, title: "Notes" },
  ], 12);
  assert.deepEqual(chapters.map((chapter) => chapter.p), [0, 5, 8]);
  assert.deepEqual(chapters.map((chapter) => chapter.req), [false, true, false]);
});

test("even sections are all required until the reader changes them", () => {
  const chapters = evenChapters(100);
  assert.deepEqual(chapters.map((chapter) => chapter.p), [0, 20, 40, 60, 80]);
  assert.ok(chapters.every((chapter) => chapter.req));
});

test("required ranges exclude optional sections and book completion needs at least one required section", () => {
  const chapters = [
    { p: 0, title: "Beginning", req: false },
    { p: 2, title: "Chapter One", req: true },
    { p: 5, title: "Notes", req: false },
    { p: 7, title: "Chapter Two", req: true },
  ];
  assert.deepEqual(requiredRanges(chapters, 10), [
    { start: 2, end: 4, title: "Chapter One" },
    { start: 7, end: 9, title: "Chapter Two" },
  ]);
  assert.deepEqual(requiredSections(chapters, 10), [2, 3, 4, 7, 8, 9]);
  assert.equal(requiredSectionsComplete(chapters, 10, [2, 3, 4, 7, 8]), false);
  assert.equal(requiredSectionsComplete(chapters, 10, [2, 3, 4, 7, 8, 9]), true);
  assert.equal(requiredSectionsComplete([{ p: 0, title: "Contents", req: false }], 3, [0, 1, 2]), false);
});
