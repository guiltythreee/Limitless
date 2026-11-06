import test from "node:test";
import assert from "node:assert/strict";
import { IDBFactory } from "fake-indexeddb";
import { openBookkeysDatabase } from "./bookkeys-v1-database";
import {
  BOOKKEYS_DATABASE,
  BOOKKEYS_DATABASE_VERSION,
  type BookkeysLibraryMetadata,
} from "./bookkeys-v1-contracts";

function metadata(id: string): BookkeysLibraryMetadata {
  return {
    id,
    shelf: "default",
    name: "Test book",
    size: 4,
    pages: 1,
    added: 1,
    fp: "fingerprint",
    cover: "",
    fmt: "epub",
    retainedExtension: { legacy: true },
  };
}

test("opens the existing database name and v1 schema", async () => {
  const factory = new IDBFactory();
  const db = await openBookkeysDatabase(factory);
  assert.equal(db.raw.name, BOOKKEYS_DATABASE);
  assert.equal(db.raw.version, BOOKKEYS_DATABASE_VERSION);
  assert.deepEqual([...db.raw.objectStoreNames].sort(), ["files", "meta"]);
  db.close();
});

test("stores and retrieves metadata and original file bytes", async () => {
  const db = await openBookkeysDatabase(new IDBFactory());
  const source = new Blob(["book"], { type: "application/pdf" });
  await db.putBook(metadata("book-1"), source);

  const savedMetadata = await db.getMetadata("book-1");
  const savedFile = await db.getFile("book-1");
  assert.equal(savedMetadata?.name, "Test book");
  assert.deepEqual(savedMetadata?.retainedExtension, { legacy: true });
  assert.equal(await savedFile?.text(), "book");
  assert.equal(savedFile?.type, "application/pdf");
  db.close();
});

test("deletes metadata and file together", async () => {
  const db = await openBookkeysDatabase(new IDBFactory());
  await db.putBook(metadata("book-2"), new Blob(["data"]));
  await db.deleteBook("book-2");
  assert.equal(await db.getMetadata("book-2"), undefined);
  assert.equal(await db.getFile("book-2"), undefined);
  db.close();
});

test("preserves custom artwork entries in the original files store", async () => {
  const db = await openBookkeysDatabase(new IDBFactory());
  const art = "data:image/png;base64,AAAA";
  await db.putArtwork("art:gothic", art);
  assert.equal(await db.getArtwork("art:gothic"), art);
  assert.equal(await db.getArtwork("art:missing"), undefined);
  db.close();
});
