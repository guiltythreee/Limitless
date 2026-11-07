/**
 * Typed access to the existing Bookkeys IndexedDB v1 schema.
 *
 * This is an adapter around the legacy database, not a schema redesign. It
 * opens the same database/version and keeps metadata + original file writes in
 * one transaction. It is intentionally not wired into the live HTML reader.
 */

import {
  BOOKKEYS_DATABASE,
  BOOKKEYS_DATABASE_VERSION,
  BOOKKEYS_FILES_STORE,
  BOOKKEYS_META_STORE,
  type BookkeysLibraryMetadata,
} from "./bookkeys-v1-contracts";

export interface BookkeysDatabase {
  readonly raw: IDBDatabase;
  close(): void;
  getMetadata(id: string): Promise<BookkeysLibraryMetadata | undefined>;
  listMetadata(): Promise<BookkeysLibraryMetadata[]>;
  getFile(id: string): Promise<Blob | undefined>;
  putBook(metadata: BookkeysLibraryMetadata, file: Blob): Promise<void>;
  deleteBook(id: string): Promise<void>;
  getArtwork(key: string): Promise<string | undefined>;
  putArtwork(key: string, dataUrl: string): Promise<void>;
  deleteArtwork(key: string): Promise<void>;
}

export type IndexedDbFactory = Pick<IDBFactory, "open">;

function requestResult<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("IndexedDB request failed"));
  });
}

function transactionDone(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onabort = () => reject(transaction.error ?? new Error("IndexedDB transaction aborted"));
    transaction.onerror = () => reject(transaction.error ?? new Error("IndexedDB transaction failed"));
  });
}

function openRaw(factory: IndexedDbFactory): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = factory.open(BOOKKEYS_DATABASE, BOOKKEYS_DATABASE_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      // These are the original v1 stores. Create only when the database is
      // first initialized; never bump the version or rewrite an existing store.
      if (!db.objectStoreNames.contains(BOOKKEYS_META_STORE)) {
        db.createObjectStore(BOOKKEYS_META_STORE, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(BOOKKEYS_FILES_STORE)) {
        db.createObjectStore(BOOKKEYS_FILES_STORE);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Could not open Bookkeys library"));
    request.onblocked = () => reject(new Error("Bookkeys library upgrade is blocked by another open tab"));
  });
}

export async function openBookkeysDatabase(factory: IndexedDbFactory): Promise<BookkeysDatabase> {
  if (!factory || typeof factory.open !== "function") {
    throw new TypeError("An IndexedDB factory is required");
  }
  const raw = await openRaw(factory);

  function get<T>(storeName: string, key: IDBValidKey): Promise<T | undefined> {
    const transaction = raw.transaction(storeName, "readonly");
    const done = transactionDone(transaction);
    const result = requestResult(transaction.objectStore(storeName).get(key)) as Promise<T | undefined>;
    return Promise.all([result, done]).then(([value]) => value);
  }

  return {
    raw,
    close: () => raw.close(),
    getMetadata: (id) => get<BookkeysLibraryMetadata>(BOOKKEYS_META_STORE, id),
    async listMetadata() {
      const transaction = raw.transaction(BOOKKEYS_META_STORE, "readonly");
      const done = transactionDone(transaction);
      const result = requestResult(transaction.objectStore(BOOKKEYS_META_STORE).getAll()) as Promise<BookkeysLibraryMetadata[]>;
      return Promise.all([result, done]).then(([value]) => value);
    },
    getFile: (id) => get<Blob>(BOOKKEYS_FILES_STORE, id),
    async putBook(metadata, file) {
      const transaction = raw.transaction(
        [BOOKKEYS_META_STORE, BOOKKEYS_FILES_STORE],
        "readwrite",
      );
      const done = transactionDone(transaction);
      transaction.objectStore(BOOKKEYS_META_STORE).put(metadata);
      transaction.objectStore(BOOKKEYS_FILES_STORE).put(file, metadata.id);
      await done;
    },
    async deleteBook(id) {
      const transaction = raw.transaction(
        [BOOKKEYS_META_STORE, BOOKKEYS_FILES_STORE],
        "readwrite",
      );
      const done = transactionDone(transaction);
      transaction.objectStore(BOOKKEYS_META_STORE).delete(id);
      transaction.objectStore(BOOKKEYS_FILES_STORE).delete(id);
      await done;
    },
    async getArtwork(key) {
      const value = await get<unknown>(BOOKKEYS_FILES_STORE, key);
      return typeof value === "string" ? value : undefined;
    },
    async putArtwork(key, dataUrl) {
      const transaction = raw.transaction(BOOKKEYS_FILES_STORE, "readwrite");
      const done = transactionDone(transaction);
      transaction.objectStore(BOOKKEYS_FILES_STORE).put(dataUrl, key);
      await done;
    },
    async deleteArtwork(key) {
      const transaction = raw.transaction(BOOKKEYS_FILES_STORE, "readwrite");
      const done = transactionDone(transaction);
      transaction.objectStore(BOOKKEYS_FILES_STORE).delete(key);
      await done;
    },
  };
}
