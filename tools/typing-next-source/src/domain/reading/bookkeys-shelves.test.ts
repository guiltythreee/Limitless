import test from "node:test";
import assert from "node:assert/strict";
import {
  readShelves, normalizeShelves, createShelf, renameShelf, deleteShelf,
} from "./bookkeys-shelves";

test("loads shelf arrays and always preserves the default library", () => {
  assert.deepEqual(readShelves(null), [{ id: "main", name: "Library" }]);
  assert.deepEqual(readShelves(JSON.stringify([{ id: "fiction", name: "Fiction" }])), [
    { id: "main", name: "Library" }, { id: "fiction", name: "Fiction" },
  ]);
});

test("normalizes legacy object-shaped shelf collections", () => {
  assert.deepEqual(normalizeShelves({
    main: "Library",
    classics: { name: "Classics" },
    empty: "",
  }), [
    { id: "main", name: "Library" },
    { id: "classics", name: "Classics" },
  ]);
});

test("creates shelves without duplicate names or IDs", () => {
  const base = readShelves(null);
  const created = createShelf(base, "Fantasy", "shelf-1");
  assert.equal(created.length, 2);
  assert.equal(createShelf(created, "fantasy", "shelf-2").length, 2);
  assert.equal(createShelf(created, "Other", "shelf-1").length, 2);
});

test("renames shelves and prevents duplicate names", () => {
  const base = [{ id: "main", name: "Library" }, { id: "s1", name: "Fantasy" }];
  assert.equal(renameShelf(base, "s1", "Speculative").find((shelf) => shelf.id === "s1")?.name, "Speculative");
  assert.deepEqual(renameShelf(base, "s1", "Library"), base);
});

test("cannot delete the default shelf and removes a custom shelf", () => {
  const base = [{ id: "main", name: "Library" }, { id: "s1", name: "Fantasy" }];
  assert.deepEqual(deleteShelf(base, "main"), base);
  assert.deepEqual(deleteShelf(base, "s1"), [{ id: "main", name: "Library" }]);
});
