import test from "node:test";
import assert from "node:assert/strict";
import "fake-indexeddb/auto";
import { createBookkeysDatabase } from "../src/lib/bookkeys/database.mjs";

test("Bookkeys v1 IndexedDB contract stores metadata and original blobs together", async () => {
  const db = createBookkeysDatabase(indexedDB);
  const blob = new Blob(["original book bytes"], { type: "application/pdf" });
  await db.add({ id: "book-1", name: "Example.pdf", pages: 12 }, blob);

  assert.deepEqual(await db.all(), [{ id: "book-1", name: "Example.pdf", pages: 12 }]);
  const stored = await db.file("book-1");
  assert.equal(stored.type, "application/pdf");
  assert.equal(await stored.text(), "original book bytes");
});

test("metadata updates and file-only operations retain their independent contracts", async () => {
  const db = createBookkeysDatabase(indexedDB);
  await db.put({ id: "book-1", name: "Renamed.pdf", pages: 12 });
  assert.equal((await db.all())[0].name, "Renamed.pdf");

  await db.setFile("art:gothic", new Blob(["artwork"], { type: "image/jpeg" }));
  assert.equal(await (await db.file("art:gothic")).text(), "artwork");
  await db.delFile("art:gothic");
  assert.equal(await db.file("art:gothic"), undefined);
});

test("deleting a library book removes both its metadata and stored file", async () => {
  const db = createBookkeysDatabase(indexedDB);
  await db.add({ id: "book-delete", name: "Delete me.epub" }, new Blob(["epub"]));
  await db.del("book-delete");
  assert.equal((await db.all()).some(book => book.id === "book-delete"), false);
  assert.equal(await db.file("book-delete"), undefined);
});

test("the adapter reports unavailable IndexedDB instead of silently losing data", async () => {
  const db = createBookkeysDatabase(null);
  await assert.rejects(db.all(), /no-idb/);
});
