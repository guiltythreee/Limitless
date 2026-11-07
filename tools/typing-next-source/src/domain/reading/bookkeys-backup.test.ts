import test from "node:test";
import assert from "node:assert/strict";
import {
  createBookkeysBackupV1, parseBookkeysBackup, restoreBookkeysBackup,
  type BookkeysStorage,
} from "./bookkeys-backup";

class MemoryStorage implements BookkeysStorage {
  readonly values = new Map<string, string>();
  failKey: string | null = null;
  get length() { return this.values.size; }
  key(index: number) { return [...this.values.keys()][index] ?? null; }
  getItem(key: string) { return this.values.get(key) ?? null; }
  setItem(key: string, value: string) {
    if (key === this.failKey) throw new Error("storage full");
    this.values.set(key, value);
  }
  removeItem(key: string) { this.values.delete(key); }
}

test("exports only Bookkeys localStorage keys in the v1 envelope", () => {
  const storage = new MemoryStorage();
  storage.setItem("bookkeys:game", '{"xp":4}');
  storage.setItem("bookkeys:settings", '{"size":12}');
  storage.setItem("limitless.typing.v1.theme", "dark");
  const backup = createBookkeysBackupV1(storage, 1234);
  assert.deepEqual(backup, {
    app: "bookkeys",
    v: 1,
    exportedAt: 1234,
    keys: {
      "bookkeys:game": '{"xp":4}',
      "bookkeys:settings": '{"size":12}',
    },
  });
});

test("accepts older v1 backup envelopes without exportedAt and rejects foreign keys", () => {
  const backup = parseBookkeysBackup(JSON.stringify({
    app: "bookkeys", v: 1,
    keys: { "bookkeys:game": '{"xp":10}' },
  }));
  assert.equal(backup.app, "bookkeys");
  assert.equal(typeof backup.exportedAt, "number");
  assert.throws(() => parseBookkeysBackup(JSON.stringify({
    app: "bookkeys", v: 1, keys: { "limitless:theme": "dark" },
  })), /not a supported Bookkeys backup/);
});

test("merge validates settings types and unions completed pages and flawless markers", () => {
  const storage = new MemoryStorage();
  storage.setItem("bookkeys:settings", JSON.stringify({ size: 10, celebrate: false, lineH: 1.5 }));
  storage.setItem("bookkeys:game", JSON.stringify({
    xp: 900, pages: 5,
    book: { "local-book": { p: [0], e: [], c: [], x: [], done: 1 } },
  }));
  const backup = parseBookkeysBackup(JSON.stringify({
    app: "bookkeys", v: 1,
    keys: {
      "bookkeys:settings": JSON.stringify({ size: 13, celebrate: "yes", lineH: "wide" }),
      "bookkeys:game": JSON.stringify({
        xp: 1,
        book: {
          "local-book": { p: [0, 9], e: [], c: [2], x: [0, 5], done: 2 },
          "backup-only-book": { p: [1], e: [2], c: [3], x: [1, 9], done: 4 },
        },
      }),
    },
  }));
  const result = restoreBookkeysBackup(storage, backup, "merge");
  assert.equal(result.written, 2);
  const settings = JSON.parse(storage.getItem("bookkeys:settings") ?? "{}");
  assert.equal(settings.size, 13);
  assert.equal(settings.celebrate, false);
  assert.equal(settings.lineH, 1.5);
  const game = JSON.parse(storage.getItem("bookkeys:game") ?? "{}");
  assert.equal(game.xp, 900);
  assert.deepEqual(game.book["local-book"].p, [0, 9]);
  assert.deepEqual(game.book["local-book"].x, [0, 5]);
  assert.deepEqual(game.book["backup-only-book"].x, [1, 9]);
});

test("merges backup-only shelves without overwriting local shelf names", () => {
  const storage = new MemoryStorage();
  storage.setItem("bookkeys:shelves", JSON.stringify([
    { id: "default", name: "Library" }, { id: "s1", name: "My Shelf" },
  ]));
  const backup = parseBookkeysBackup(JSON.stringify({
    app: "bookkeys", v: 1,
    keys: {
      "bookkeys:shelves": JSON.stringify([
        { id: "default", name: "Renamed in backup" }, { id: "s2", name: "Backup Shelf" },
      ]),
    },
  }));
  restoreBookkeysBackup(storage, backup, "merge");
  assert.deepEqual(JSON.parse(storage.getItem("bookkeys:shelves") ?? "[]"), [
    { id: "default", name: "Library" },
    { id: "s1", name: "My Shelf" },
    { id: "s2", name: "Backup Shelf" },
  ]);
});

test("merge counts only successful writes and leaves a failed key untouched", () => {
  const storage = new MemoryStorage();
  storage.setItem("bookkeys:settings", JSON.stringify({ size: 10, celebrate: false, lineH: 1 }));
  storage.setItem("bookkeys:game", JSON.stringify({ xp: 500, book: {} }));
  storage.failKey = "bookkeys:probe";
  const backup = parseBookkeysBackup(JSON.stringify({
    app: "bookkeys", v: 1,
    keys: {
      "bookkeys:settings": JSON.stringify({ size: 13, celebrate: "yes", lineH: "wide" }),
      "bookkeys:game": JSON.stringify({ xp: 1, book: { "backup-only": { p: [0], x: [0] } } }),
      "bookkeys:probe": "written-only-if-storage-works",
    },
  }));
  const result = restoreBookkeysBackup(storage, backup, "merge");
  assert.equal(result.written, 2);
  assert.equal(result.unchanged, 1);
  assert.equal(result.failed, 1);
  assert.equal(storage.getItem("bookkeys:probe"), null);
});

test("replace mode removes existing Bookkeys keys before restoring the backup", () => {
  const storage = new MemoryStorage();
  storage.setItem("bookkeys:game", '{"xp":900}');
  storage.setItem("bookkeys:settings", '{"size":10}');
  storage.setItem("limitless.typing.v1.theme", "dark");
  const backup = parseBookkeysBackup(JSON.stringify({
    app: "bookkeys", v: 1, keys: { "bookkeys:game": '{"xp":5}' },
  }));
  const result = restoreBookkeysBackup(storage, backup, "replace");
  assert.equal(result.written, 1);
  assert.equal(storage.getItem("bookkeys:game"), '{"xp":5}');
  assert.equal(storage.getItem("bookkeys:settings"), null);
  assert.equal(storage.getItem("limitless.typing.v1.theme"), "dark");
});


test("restores backup-only settings fields introduced by a newer reader version", () => {
  const storage = new MemoryStorage();
  storage.setItem("bookkeys:settings", JSON.stringify({ size: 12, celebrate: true }));
  const backup = parseBookkeysBackup(JSON.stringify({
    app: "bookkeys", v: 1,
    keys: {
      "bookkeys:settings": JSON.stringify({
        size: 15,
        celebrate: false,
        readerBackground: "aurora",
        customPreference: { enabled: true, intensity: 2 },
      }),
    },
  }));
  restoreBookkeysBackup(storage, backup, "merge");
  const settings = JSON.parse(storage.getItem("bookkeys:settings") ?? "{}");
  assert.equal(settings.size, 15);
  assert.equal(settings.celebrate, false);
  assert.equal(settings.readerBackground, "aurora");
  assert.deepEqual(settings.customPreference, { enabled: true, intensity: 2 });
});
