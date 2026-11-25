// Lectern storage on the device (IndexedDB). Book files, annotations and attachments live here;
// nothing is uploaded. The IndexedDB factory is passed in so tests can use an in-memory fake.
import { MAX_ATTACHMENT_BYTES } from './annotations.mjs';

const DB_NAME = 'lectern';
const DB_VERSION = 1;

function fail(code, message) {
  return Object.assign(new Error(message), { code });
}

const request = req => new Promise((resolve, reject) => {
  req.onsuccess = () => resolve(req.result);
  req.onerror = () => reject(req.error);
});

const finished = tx => new Promise((resolve, reject) => {
  tx.oncomplete = () => resolve();
  tx.onerror = () => reject(tx.error);
  tx.onabort = () => reject(tx.error || new Error('Storage transaction was cancelled.'));
});

export async function openStore(factory = globalThis.indexedDB) {
  if (!factory) throw fail('no-storage', 'This browser has no storage available for Lectern.');

  const db = await new Promise((resolve, reject) => {
    let opening;
    try { opening = factory.open(DB_NAME, DB_VERSION); }
    catch { reject(fail('no-storage', 'Browser storage is blocked.')); return; }
    opening.onupgradeneeded = () => {
      const d = opening.result;
      d.createObjectStore('files', { keyPath: 'bookId' }).createIndex('fingerprint', 'fingerprint');
      d.createObjectStore('annotations', { keyPath: 'id' }).createIndex('bookId', 'bookId');
      d.createObjectStore('attachments', { keyPath: 'id' }).createIndex('annotationId', 'annotationId');
    };
    opening.onsuccess = () => resolve(opening.result);
    opening.onerror = () => reject(fail('no-storage', 'Browser storage is blocked.'));
    opening.onblocked = () => reject(fail('no-storage', 'Browser storage is busy.'));
  });

  // One write on one object store; resolves when the transaction has really been saved.
  const one = (name, work) => {
    const tx = db.transaction(name, 'readwrite');
    work(tx.objectStore(name));
    return finished(tx);
  };

  // Runs inside a transaction: remove every attachment of one annotation.
  const dropAttachmentsOf = (tx, annotationId) => {
    const attachments = tx.objectStore('attachments');
    const keys = attachments.index('annotationId').getAllKeys(annotationId);
    keys.onsuccess = () => { for (const key of keys.result) attachments.delete(key); };
  };

  return {
    async putFile(bookId, { fingerprint, name, data }) {
      await one('files', s => s.put({ bookId, fingerprint, name, data }));
    },
    async getFile(bookId) {
      return request(db.transaction('files').objectStore('files').get(bookId));
    },
    async findBookByFingerprint(fingerprint) {
      const record = await request(db.transaction('files').objectStore('files').index('fingerprint').get(fingerprint));
      return record?.bookId;
    },

    async putAnnotation(annotation) {
      await one('annotations', s => s.put(annotation));
    },
    async listAnnotations(bookId) {
      return request(db.transaction('annotations').objectStore('annotations').index('bookId').getAll(bookId));
    },
    async deleteAnnotation(id) {
      const tx = db.transaction(['annotations', 'attachments'], 'readwrite');
      tx.objectStore('annotations').delete(id);
      dropAttachmentsOf(tx, id);
      await finished(tx);
    },

    async putAttachment({ id, annotationId, name, type, blob }) {
      if (blob.size > MAX_ATTACHMENT_BYTES) throw fail('too-large', 'This file is larger than 25 MB.');
      await one('attachments', s => s.put({ id, annotationId, name, type, blob }));
    },
    async getAttachment(id) {
      return request(db.transaction('attachments').objectStore('attachments').get(id));
    },
    async listAttachments(annotationId) {
      return request(db.transaction('attachments').objectStore('attachments').index('annotationId').getAll(annotationId));
    },
    async deleteAttachment(id) {
      await one('attachments', s => s.delete(id));
    },

    async deleteBook(bookId) {
      const tx = db.transaction(['files', 'annotations', 'attachments'], 'readwrite');
      tx.objectStore('files').delete(bookId);
      const annotations = tx.objectStore('annotations');
      const keys = annotations.index('bookId').getAllKeys(bookId);
      keys.onsuccess = () => {
        for (const id of keys.result) {
          annotations.delete(id);
          dropAttachmentsOf(tx, id);
        }
      };
      await finished(tx);
    },

    close() { db.close(); }
  };
}
