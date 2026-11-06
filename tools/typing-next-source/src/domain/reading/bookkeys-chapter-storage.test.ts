import assert from "node:assert/strict";
import test from "node:test";
import {
  chapterRecordKey,
  libraryChapterKey,
} from "../persistence/bookkeys-v1-contracts";
import {
  readBookkeysChapterSettings,
  writeBookkeysChapterSettings,
} from "./bookkeys-chapter-storage";

class MemoryStorage {
  readonly values = new Map<string, string>();
  getItem(key: string): string | null { return this.values.get(key) ?? null; }
  setItem(key: string, value: string): void { this.values.set(key, value); }
}

const defaults = [{ p: 0, title: "Beginning" }, { p: 4, title: "Chapter Two" }];

test("reads the legacy library chapter record when the book record is absent", () => {
  const storage = new MemoryStorage();
  storage.setItem(libraryChapterKey("library-1"), JSON.stringify({
    v: 3,
    src: "edited",
    list: [{ p: 0, title: "Opening", req: false }, { p: 3, title: "Chapter One", req: true }],
  }));
  assert.deepEqual(
    readBookkeysChapterSettings(storage, "fingerprint-1", "library-1", defaults, 6),
    [{ p: 0, title: "Opening", req: false }, { p: 3, title: "Chapter One", req: true }],
  );
});

test("prefers the book fingerprint chapter record over the library fallback", () => {
  const storage = new MemoryStorage();
  storage.setItem(chapterRecordKey("fingerprint-1"), JSON.stringify({
    v: 3, src: "edited", list: [{ p: 0, title: "Book-specific", req: true }],
  }));
  storage.setItem(libraryChapterKey("library-1"), JSON.stringify({
    v: 3, src: "edited", list: [{ p: 0, title: "Library fallback", req: false }],
  }));
  assert.equal(
    readBookkeysChapterSettings(storage, "fingerprint-1", "library-1", defaults, 6)[0].title,
    "Book-specific",
  );
});

test("writes edited chapter settings to both v3 lookup keys", () => {
  const storage = new MemoryStorage();
  const chapters = [{ p: 0, title: "Beginning", req: false }, { p: 2, title: "Part Two", req: true }];
  writeBookkeysChapterSettings(storage, "fingerprint-1", "library-1", chapters);
  const byBook = storage.getItem(chapterRecordKey("fingerprint-1"));
  const byLibrary = storage.getItem(libraryChapterKey("library-1"));
  assert.equal(byBook, byLibrary);
  assert.deepEqual(JSON.parse(byBook!).list, chapters);
});

test("malformed book and library chapter records fall back to detected defaults", () => {
  const storage = new MemoryStorage();
  storage.setItem(chapterRecordKey("fingerprint-1"), "{broken");
  storage.setItem(libraryChapterKey("library-1"), JSON.stringify({ v: 2, list: [] }));
  assert.deepEqual(
    readBookkeysChapterSettings(storage, "fingerprint-1", "library-1", defaults, 6),
    [{ p: 0, title: "Beginning", req: false }, { p: 4, title: "Chapter Two", req: true }],
  );
});
