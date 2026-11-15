import assert from "node:assert/strict";
import test from "node:test";
import {
  bookPositionKey,
  libraryPositionKey,
} from "../persistence/bookkeys-v1-contracts";
import {
  readBookkeysPosition,
  writeBookkeysPosition,
} from "./bookkeys-position";

class MemoryStorage {
  readonly values = new Map<string, string>();
  getItem(key: string): string | null { return this.values.get(key) ?? null; }
  setItem(key: string, value: string): void { this.values.set(key, value); }
}

test("writes both original v1 position keys using a zero-based page index", () => {
  const storage = new MemoryStorage();
  writeBookkeysPosition(storage, "book-hash", "library-id", 4);
  assert.equal(storage.getItem(bookPositionKey("book-hash")), "4");
  assert.equal(storage.getItem(libraryPositionKey("library-id")), "4");
});

test("prefers the book fingerprint key and falls back to the library id key", () => {
  const storage = new MemoryStorage();
  storage.setItem(bookPositionKey("book-hash"), "3");
  storage.setItem(libraryPositionKey("library-id"), "1");
  assert.equal(readBookkeysPosition(storage, "book-hash", "library-id", 8), 3);

  storage.values.delete(bookPositionKey("book-hash"));
  assert.equal(readBookkeysPosition(storage, "book-hash", "library-id", 8), 1);
});

test("clamps stale positions and ignores malformed values", () => {
  const storage = new MemoryStorage();
  storage.setItem(bookPositionKey("book-hash"), "99");
  assert.equal(readBookkeysPosition(storage, "book-hash", "library-id", 3), 2);

  storage.setItem(bookPositionKey("book-hash"), "{broken");
  storage.setItem(libraryPositionKey("library-id"), "-2");
  assert.equal(readBookkeysPosition(storage, "book-hash", "library-id", 3), 0);
  assert.equal(readBookkeysPosition(storage, "book-hash", "library-id", 0), 0);
});

test("rejects invalid page positions instead of corrupting saved state", () => {
  const storage = new MemoryStorage();
  assert.throws(() => writeBookkeysPosition(storage, "book-hash", "library-id", -1), RangeError);
  assert.equal(storage.values.size, 0);
});
