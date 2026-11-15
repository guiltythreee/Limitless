/**
 * Local-first Bookkeys IndexedDB adapter.
 *
 * Preserves the production database contract:
 *   database: bookkeys-lib, version: 1
 *   stores: meta (keyPath: id), files (out-of-line keys)
 *
 * The implementation is isolated and dependency-injected for deterministic tests.
 * It is not wired into the production reader yet.
 */
export function createBookkeysDatabase(indexedDBImpl = globalThis.indexedDB) {
  let connection = null;

  function open() {
    if (connection) return connection;
    connection = new Promise((resolve, reject) => {
      if (!indexedDBImpl) {
        reject(new Error("no-idb"));
        return;
      }
      const request = indexedDBImpl.open("bookkeys-lib", 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains("meta")) {
          db.createObjectStore("meta", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("files")) {
          db.createObjectStore("files");
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    return connection;
  }

  function run(stores, mode, operation) {
    return open().then(db => new Promise((resolve, reject) => {
      const transaction = db.transaction(stores, mode);
      const result = operation(transaction);
      transaction.oncomplete = () => {
        resolve(result && "result" in result ? result.result : undefined);
      };
      transaction.onerror = transaction.onabort = () => {
        reject(transaction.error || new Error("db"));
      };
    }));
  }

  return Object.freeze({
    all: () => run("meta", "readonly", tx => tx.objectStore("meta").getAll()),
    file: id => run("files", "readonly", tx => tx.objectStore("files").get(id)),
    setFile: (key, value) => run("files", "readwrite", tx => tx.objectStore("files").put(value, key)),
    delFile: key => run("files", "readwrite", tx => tx.objectStore("files").delete(key)),
    add: (metadata, blob) => run(["meta", "files"], "readwrite", tx => {
      tx.objectStore("meta").put(metadata);
      tx.objectStore("files").put(blob, metadata.id);
    }),
    put: metadata => run("meta", "readwrite", tx => tx.objectStore("meta").put(metadata)),
    del: id => run(["meta", "files"], "readwrite", tx => {
      tx.objectStore("meta").delete(id);
      tx.objectStore("files").delete(id);
    })
  });
}
