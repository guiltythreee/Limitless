import test from "node:test";
import assert from "node:assert/strict";
import {
  createBookkeysBackupV1, parseBookkeysBackup, restoreBookkeysBackup,
  type BookkeysStorage,
} from "./bookkeys-backup";

class MemoryStorage implements BookkeysStorage {
  readonly values = new Map<string, string>();
  failKey: string | null = null;
  failRemoveKey: string | null = null;
  get length() { return this.values.size; }
  key(index: number) { return [...this.values.keys()][index] ?? null; }
  getItem(key: string) { return this.values.get(key) ?? null; }
  setItem(key: string, value: string) {
    if (key === this.failKey) throw new Error("storage full");
    this.values.set(key, value);
  }
  removeItem(key: string) {
    if (key === this.failRemoveKey) throw new Error("storage removal failed");
    this.values.delete(key);
  }
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

test("merge validates settings, preserves local typed pages and merges flawless markers", () => {
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
  assert.deepEqual(game.book["local-book"].p, [0]);
  assert.deepEqual(game.book["local-book"].x, [0, 5]);
  assert.deepEqual(game.book["backup-only-book"].x, [1, 9]);
});

test("merges backup-only shelves without overwriting local shelf names", () => {
  const storage = new MemoryStorage();
  storage.setItem("bookkeys:shelves", JSON.stringify([
    { id: "main", name: "Library" }, { id: "s1", name: "My Shelf" },
  ]));
  const backup = parseBookkeysBackup(JSON.stringify({
    app: "bookkeys", v: 1,
    keys: {
      "bookkeys:shelves": JSON.stringify([
        { id: "main", name: "Renamed in backup" }, { id: "s2", name: "Backup Shelf" },
      ]),
    },
  }));
  restoreBookkeysBackup(storage, backup, "merge");
  assert.deepEqual(JSON.parse(storage.getItem("bookkeys:shelves") ?? "[]"), [
    { id: "main", name: "Library" },
    { id: "s1", name: "My Shelf" },
    { id: "s2", name: "Backup Shelf" },
  ]);
});

test("merge counts only successful writes and leaves a failed key untouched", () => {
  const storage = new MemoryStorage();
  storage.setItem("bookkeys:settings", JSON.stringify({ size: 10, celebrate: false, lineH: 1 }));
  storage.setItem("bookkeys:game", JSON.stringify({ xp: 500, book: {} }));
  storage.setItem("bookkeys:keep", "same");
  storage.failKey = "bookkeys:probe";
  const backup = parseBookkeysBackup(JSON.stringify({
    app: "bookkeys", v: 1,
    keys: {
      "bookkeys:settings": JSON.stringify({ size: 13, celebrate: "yes", lineH: "wide" }),
      "bookkeys:game": JSON.stringify({ xp: 1, book: { "backup-only": { p: [0], x: [0] } } }),
      "bookkeys:keep": "same",
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


test("replace restore rolls back overwritten data when a storage write fails", () => {
  const storage = new MemoryStorage();
  storage.setItem("bookkeys:game", '{"xp":900,"pages":12}');
  storage.setItem("bookkeys:settings", '{"size":17}');
  storage.setItem("limitless.typing.v1.theme", "dark");
  storage.failKey = "bookkeys:probe";
  const backup = parseBookkeysBackup(JSON.stringify({
    app: "bookkeys", v: 1,
    keys: {
      "bookkeys:game": '{"xp":5,"pages":1}',
      "bookkeys:probe": "cannot-write",
    },
  }));
  const result = restoreBookkeysBackup(storage, backup, "replace");
  assert.equal(result.written, 0);
  assert.ok(result.failed >= 1);
  assert.equal(storage.getItem("bookkeys:game"), '{"xp":900,"pages":12}');
  assert.equal(storage.getItem("bookkeys:settings"), '{"size":17}');
  assert.equal(storage.getItem("bookkeys:probe"), null);
  assert.equal(storage.getItem("limitless.typing.v1.theme"), "dark");
});


test("replace restore rolls back the entire snapshot when obsolete-key cleanup fails", () => {
  const storage = new MemoryStorage();
  storage.setItem("bookkeys:game", '{"xp":900,"pages":12}');
  storage.setItem("bookkeys:settings", '{"size":17}');
  storage.setItem("bookkeys:obsolete", "keep-until-commit");
  storage.setItem("limitless.typing.v1.theme", "dark");
  storage.failRemoveKey = "bookkeys:obsolete";
  const backup = parseBookkeysBackup(JSON.stringify({
    app: "bookkeys", v: 1,
    keys: {
      "bookkeys:game": '{"xp":5,"pages":1}',
      "bookkeys:new": "new-value",
    },
  }));

  const result = restoreBookkeysBackup(storage, backup, "replace");

  assert.equal(result.written, 0);
  assert.ok(result.failed >= 1);
  assert.equal(storage.getItem("bookkeys:game"), '{"xp":900,"pages":12}');
  assert.equal(storage.getItem("bookkeys:settings"), '{"size":17}');
  assert.equal(storage.getItem("bookkeys:obsolete"), "keep-until-commit");
  assert.equal(storage.getItem("bookkeys:new"), null);
  assert.equal(storage.getItem("limitless.typing.v1.theme"), "dark");
});


test("merge keeps the newest draft while retaining local chapter and reading-position choices", () => {
  const storage = new MemoryStorage();
  storage.setItem("bookkeys:draft:book-a:2", JSON.stringify({
    v: 1, page: 2, sig: "local", typed: "local draft", ok: 6, all: 8, spent: 12, t: 200,
  }));
  storage.setItem("bookkeys:chap:book-a", JSON.stringify({
    v: 3, src: "edited", list: [{ p: 0, title: "Local chapter", req: true }],
  }));
  storage.setItem("bookkeys:book-a", "2");

  const backup = parseBookkeysBackup(JSON.stringify({
    app: "bookkeys", v: 1,
    keys: {
      "bookkeys:draft:book-a:2": JSON.stringify({
        v: 1, page: 2, sig: "backup", typed: "newer backup draft", ok: 9, all: 10, spent: 18, t: 300,
      }),
      "bookkeys:chap:book-a": JSON.stringify({
        v: 3, src: "toc", list: [{ p: 0, title: "Backup chapter", req: true }],
      }),
      "bookkeys:book-a": "0",
    },
  }));

  const result = restoreBookkeysBackup(storage, backup, "merge");

  assert.equal(result.written, 1);
  assert.equal(JSON.parse(storage.getItem("bookkeys:draft:book-a:2") ?? "{}").typed, "newer backup draft");
  assert.equal(JSON.parse(storage.getItem("bookkeys:chap:book-a") ?? "{}").list[0].title, "Local chapter");
  assert.equal(storage.getItem("bookkeys:book-a"), "2");
});

test("merge does not replace a valid local draft with an older or malformed-timestamp backup draft", () => {
  const localDraft = JSON.stringify({
    v: 1, page: 1, sig: "local", typed: "keep local", ok: 4, all: 5, spent: 9, t: 500,
  });
  const storage = new MemoryStorage();
  storage.setItem("bookkeys:draft:book-b:1", localDraft);

  const olderBackup = parseBookkeysBackup(JSON.stringify({
    app: "bookkeys", v: 1,
    keys: {
      "bookkeys:draft:book-b:1": JSON.stringify({
        v: 1, page: 1, sig: "backup", typed: "stale backup", ok: 1, all: 2, spent: 3, t: 100,
      }),
    },
  }));

  const olderResult = restoreBookkeysBackup(storage, olderBackup, "merge");
  assert.equal(olderResult.written, 0);
  assert.equal(olderResult.unchanged, 1);
  assert.equal(storage.getItem("bookkeys:draft:book-b:1"), localDraft);

  const malformedBackup = parseBookkeysBackup(JSON.stringify({
    app: "bookkeys", v: 1,
    keys: {
      "bookkeys:draft:book-b:1": JSON.stringify({
        v: 1, page: 1, sig: "backup", typed: "malformed timestamp", ok: 1, all: 2, spent: 3, t: "not-a-time",
      }),
    },
  }));

  const malformedResult = restoreBookkeysBackup(storage, malformedBackup, "merge");
  assert.equal(malformedResult.written, 0);
  assert.equal(malformedResult.unchanged, 1);
  assert.equal(storage.getItem("bookkeys:draft:book-b:1"), localDraft);
});


test("merge rejects non-finite draft timestamps and sanitizes malformed progress counters", () => {
  const localDraft = JSON.stringify({
    v: 1, page: 1, sig: "local", typed: "keep local", ok: 4, all: 5, spent: 9, t: 500,
  });
  const storage = new MemoryStorage();
  storage.setItem("bookkeys:draft:book-c:1", localDraft);
  storage.setItem("bookkeys:game", JSON.stringify({
    book: { "book-c": { p: [0], e: [], c: [], x: [], done: 3 } },
  }));

  const backup = parseBookkeysBackup(JSON.stringify({
    app: "bookkeys", v: 1,
    keys: {
      "bookkeys:draft:book-c:1": JSON.stringify({
        v: 1, page: 1, sig: "backup", typed: "invalid future draft", ok: 1, all: 2, spent: 3, t: "Infinity",
      }),
      "bookkeys:game": JSON.stringify({
        book: { "book-c": { p: [9], e: [], c: [], x: [], done: "not-a-number" } },
      }),
    },
  }));

  restoreBookkeysBackup(storage, backup, "merge");

  assert.equal(storage.getItem("bookkeys:draft:book-c:1"), localDraft);
  const game = JSON.parse(storage.getItem("bookkeys:game") ?? "{}");
  assert.equal(game.book["book-c"].done, 3);
  assert.deepEqual(game.book["book-c"].p, [0]);
});


test("first-time game restore sanitizes malformed backup completion counters", () => {
  const storage = new MemoryStorage();
  const backup = parseBookkeysBackup(JSON.stringify({
    app: "bookkeys", v: 1,
    keys: {
      "bookkeys:game": JSON.stringify({
        xp: 10,
        book: {
          "new-book": { p: [0, -1, 1.5, "2", 9007199254740992], e: "invalid", c: [2], x: [3], done: "Infinity" },
        },
      }),
    },
  }));

  restoreBookkeysBackup(storage, backup, "merge");

  const game = JSON.parse(storage.getItem("bookkeys:game") ?? "{}");
  assert.equal(game.book["new-book"].done, 0);
  assert.deepEqual(game.book["new-book"].p, [0]);
  assert.deepEqual(game.book["new-book"].e, []);
  assert.deepEqual(game.book["new-book"].c, [2]);
  assert.deepEqual(game.book["new-book"].x, [3]);
});


test("replace rollback frees newly added keys before restoring old values under quota pressure", () => {
  class QuotaStorage extends MemoryStorage {
    readonly quota = 12;
    setItem(key: string, value: string) {
      const current = this.values.get(key)?.length ?? 0;
      const total = [...this.values.values()].reduce((sum, item) => sum + item.length, 0);
      if (total - current + value.length > this.quota) throw new Error("quota exceeded");
      super.setItem(key, value);
    }
  }

  const storage = new QuotaStorage();
  storage.setItem("bookkeys:game", "0123456789");
  storage.setItem("bookkeys:obsolete", "x");

  const backup = parseBookkeysBackup(JSON.stringify({
    app: "bookkeys", v: 1,
    keys: {
      "bookkeys:game": "g",
      "bookkeys:new-a": "12345678",
      "bookkeys:new-b": "abcdefghij",
    },
  }));

  const result = restoreBookkeysBackup(storage, backup, "replace");

  assert.equal(result.written, 0);
  assert.ok(result.failed >= 1);
  assert.equal(storage.getItem("bookkeys:game"), "0123456789");
  assert.equal(storage.getItem("bookkeys:obsolete"), "x");
  assert.equal(storage.getItem("bookkeys:new-a"), null);
  assert.equal(storage.getItem("bookkeys:new-b"), null);
});


test("merge sanitizes progress arrays in backup-only and local-only books", () => {
  const storage = new MemoryStorage();
  storage.setItem("bookkeys:game", JSON.stringify({
    book: {
      "local-only": { p: "bad", e: [-1, 0, 1.5], c: [2], x: null, done: -3 },
    },
  }));
  const backup = parseBookkeysBackup(JSON.stringify({
    app: "bookkeys", v: 1,
    keys: {
      "bookkeys:game": JSON.stringify({
        book: {
          "backup-only": { p: [0, -1], e: [1], c: "bad", x: [2.5, 3], done: 2 },
        },
      }),
    },
  }));

  restoreBookkeysBackup(storage, backup, "merge");

  const game = JSON.parse(storage.getItem("bookkeys:game") ?? "{}");
  assert.deepEqual(game.book["local-only"], { p: [], e: [0], c: [2], x: [], done: 0 });
  assert.deepEqual(game.book["backup-only"], { p: [0], e: [1], c: [], x: [3], done: 2 });
});


test("malformed backup book records cannot replace valid local progress", () => {
  const storage = new MemoryStorage();
  storage.setItem("bookkeys:game", JSON.stringify({
    xp: 700,
    book: {
      "local-book": { p: [0, 1], e: [2], c: [], x: [0], done: 3, custom: "keep" },
      "local-only": { p: [4], e: [], c: [], x: [], done: 1 },
    },
  }));
  const backup = parseBookkeysBackup(JSON.stringify({
    app: "bookkeys", v: 1,
    keys: {
      "bookkeys:game": JSON.stringify({
        xp: 1,
        book: {
          "local-book": "corrupt-record",
          "invalid-backup-only": null,
          "backup-book": { p: [5], e: [], c: [], x: [5], done: 2 },
        },
      }),
    },
  }));

  restoreBookkeysBackup(storage, backup, "merge");

  const game = JSON.parse(storage.getItem("bookkeys:game") ?? "{}");
  assert.equal(game.xp, 700);
  assert.deepEqual(game.book["local-book"], {
    p: [0, 1], e: [2], c: [], x: [0], done: 3, custom: "keep",
  });
  assert.deepEqual(game.book["local-only"], {
    p: [4], e: [], c: [], x: [], done: 1,
  });
  assert.deepEqual(game.book["backup-book"], {
    p: [5], e: [], c: [], x: [5], done: 2,
  });
  assert.equal("invalid-backup-only" in game.book, false);
});


test("first-time restore skips malformed book progress records", () => {
  const storage = new MemoryStorage();
  const backup = parseBookkeysBackup(JSON.stringify({
    app: "bookkeys", v: 1,
    keys: {
      "bookkeys:game": JSON.stringify({
        xp: 10,
        book: {
          "valid-book": { p: [0], e: [], c: [], x: [], done: 1 },
          "invalid-book": "not-an-object",
          "invalid-array": [0, 1],
        },
      }),
    },
  }));

  restoreBookkeysBackup(storage, backup, "merge");

  const game = JSON.parse(storage.getItem("bookkeys:game") ?? "{}");
  assert.deepEqual(Object.keys(game.book), ["valid-book"]);
});
