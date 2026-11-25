/* Storage tests (IndexedDB, run with an in-memory fake).
   Run from the repository root:
     (cd tools/lectern/tests && npm ci) && node tools/lectern/tests/test-store.mjs
*/
import assert from 'node:assert/strict';
import { IDBFactory } from 'fake-indexeddb';
import { openStore } from '../store.mjs';
import { createNote, createMarker, MAX_ATTACHMENT_BYTES } from '../annotations.mjs';

const fresh = () => openStore(new IDBFactory());
const bytes = (...v) => new Uint8Array(v).buffer;

// ---- no storage available ----
await assert.rejects(() => openStore(undefined), err => err.code === 'no-storage');

// ---- book files ----
{
  const store = await fresh();
  await store.putFile('b1', { fingerprint: 'fp1', name: 'ross.pdf', data: bytes(1, 2, 3, 4) });
  const file = await store.getFile('b1');
  assert.equal(file.name, 'ross.pdf');
  assert.equal(file.fingerprint, 'fp1');
  assert.deepEqual([...new Uint8Array(file.data)], [1, 2, 3, 4], 'file bytes survive storage');
  assert.equal(await store.getFile('nope'), undefined);
  assert.equal(await store.findBookByFingerprint('fp1'), 'b1');
  assert.equal(await store.findBookByFingerprint('other'), undefined);
}

// ---- annotations are listed per book ----
{
  const store = await fresh();
  await store.putAnnotation(createNote({ bookId: 'b1', page: 1, x: 0.1, y: 0.1, color: 'blue' }));
  await store.putAnnotation(createMarker({ bookId: 'b1', page: 2, x: 0.2, y: 0.2 }));
  await store.putAnnotation(createNote({ bookId: 'b2', page: 1, x: 0.1, y: 0.1, color: 'pink' }));
  assert.equal((await store.listAnnotations('b1')).length, 2);
  assert.equal((await store.listAnnotations('b2')).length, 1);
  assert.deepEqual(await store.listAnnotations('b3'), []);

  const [first] = await store.listAnnotations('b2');
  await store.putAnnotation({ ...first, text: 'edited' });
  assert.equal((await store.listAnnotations('b2'))[0].text, 'edited', 'saving the same id replaces it');
}

// ---- attachments ----
{
  const store = await fresh();
  const note = createNote({ bookId: 'b1', page: 1, x: 0.1, y: 0.1, color: 'green' });
  await store.putAnnotation(note);
  await store.putAttachment({ id: 'att1', annotationId: note.id, name: 'hint.txt', type: 'text/plain', blob: new Blob(['hello']) });
  const got = await store.getAttachment('att1');
  assert.equal(got.name, 'hint.txt');
  assert.equal(await got.blob.text(), 'hello', 'attachment content survives storage');
  assert.equal((await store.listAttachments(note.id)).length, 1);

  await assert.rejects(
    () => store.putAttachment({ id: 'big', annotationId: note.id, name: 'big.bin', type: 'application/octet-stream', blob: { size: MAX_ATTACHMENT_BYTES + 1 } }),
    err => err.code === 'too-large');
  assert.equal(await store.getAttachment('big'), undefined, 'a refused file is not stored');
  await store.putAttachment({ id: 'edge', annotationId: note.id, name: 'edge.bin', type: 'application/octet-stream', blob: { size: MAX_ATTACHMENT_BYTES } });
  assert.ok(await store.getAttachment('edge'), 'exactly 25 MB is allowed');

  await store.deleteAttachment('edge');
  assert.equal(await store.getAttachment('edge'), undefined);

  await store.deleteAnnotation(note.id);
  assert.equal(await store.getAttachment('att1'), undefined, 'deleting a note deletes its attachments');
  assert.deepEqual(await store.listAttachments(note.id), []);
  assert.deepEqual(await store.listAnnotations('b1'), []);
}

// ---- deleting a book removes everything of that book, and only that book ----
{
  const store = await fresh();
  await store.putFile('b1', { fingerprint: 'fp1', name: 'one.pdf', data: bytes(1) });
  await store.putFile('b2', { fingerprint: 'fp2', name: 'two.pdf', data: bytes(2) });
  const n1 = createNote({ bookId: 'b1', page: 1, x: 0.1, y: 0.1, color: 'blue' });
  const n2 = createNote({ bookId: 'b2', page: 1, x: 0.1, y: 0.1, color: 'blue' });
  await store.putAnnotation(n1);
  await store.putAnnotation(n2);
  await store.putAttachment({ id: 'a1', annotationId: n1.id, name: 'x.txt', type: 'text/plain', blob: new Blob(['x']) });
  await store.putAttachment({ id: 'a2', annotationId: n2.id, name: 'y.txt', type: 'text/plain', blob: new Blob(['y']) });

  await store.deleteBook('b1');
  assert.equal(await store.getFile('b1'), undefined);
  assert.equal(await store.findBookByFingerprint('fp1'), undefined);
  assert.deepEqual(await store.listAnnotations('b1'), []);
  assert.equal(await store.getAttachment('a1'), undefined);
  assert.ok(await store.getFile('b2'), 'the other book keeps its file');
  assert.equal((await store.listAnnotations('b2')).length, 1);
  assert.ok(await store.getAttachment('a2'), 'the other book keeps its attachment');
}

console.log('store: all tests passed');
