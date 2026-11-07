import test from "node:test";
import assert from "node:assert/strict";
import { filterAndSortBookkeysLibrary } from "./bookkeys-library-view";

const entries = [
  { id: "1", name: "The Moon", author: "A. Writer", added: 10, opened: 20 },
  { id: "2", name: "A River", author: "B. Author", added: 30 },
  { id: "3", name: "The Archive", author: "A. Writer", added: 15, opened: 40 },
];

test("library search matches title and author without mutating the source list", () => {
  const before = [...entries];
  assert.deepEqual(filterAndSortBookkeysLibrary(entries, "writer", "recent").map((item) => item.id), ["3", "1"]);
  assert.deepEqual(filterAndSortBookkeysLibrary(entries, "river", "recent").map((item) => item.id), ["2"]);
  assert.deepEqual(filterAndSortBookkeysLibrary(entries, "not here", "recent"), []);
  assert.deepEqual(entries, before);
});

test("library sort supports recent activity and both title directions", () => {
  assert.deepEqual(filterAndSortBookkeysLibrary(entries, "", "recent").map((item) => item.id), ["3", "2", "1"]);
  assert.deepEqual(filterAndSortBookkeysLibrary(entries, "", "title-asc").map((item) => item.id), ["2", "3", "1"]);
  assert.deepEqual(filterAndSortBookkeysLibrary(entries, "", "title-desc").map((item) => item.id), ["1", "3", "2"]);
});
