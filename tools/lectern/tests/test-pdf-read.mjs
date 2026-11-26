/* PDF reader tests (with a tiny fake pdf.js, no real PDF needed).
   Run from the repository root:
     node tools/lectern/tests/test-pdf-read.mjs
*/
import assert from 'node:assert/strict';
import { readPdfPages, linesFromItems } from '../pdf-read.mjs';

const fakePdfjs = (docOverrides = {}) => ({
  getDocument: () => ({
    promise: Promise.resolve({
      numPages: 1,
      getPage: async () => ({
        getViewport: () => ({ width: 600, height: 800 }),
        getTextContent: async () => ({ items: [{ str: 'Hello', transform: [11, 0, 0, 11, 72, 700], width: 30 }] })
      }),
      getMetadata: async () => ({ info: { Title: 'My Book' } }),
      destroy: async () => {},
      ...docOverrides
    })
  })
});

const bytes = new Uint8Array([1, 2, 3, 4, 5]).buffer;

// the PDF's own fingerprint is returned, so the same PDF is recognised again
{
  const result = await readPdfPages(bytes, fakePdfjs({ fingerprints: ['abc123', null] }));
  assert.equal(result.fingerprint, 'abc123');
  assert.equal(result.title, 'My Book');
  assert.equal(result.pages.length, 1);
  assert.equal(result.pages[0].lines[0].text, 'Hello');
}

// without one, the fingerprint comes from the file's bytes: same bytes -> same value, other bytes -> other value
{
  const a = await readPdfPages(bytes, fakePdfjs());
  const b = await readPdfPages(bytes, fakePdfjs());
  const c = await readPdfPages(new Uint8Array([9, 9, 9]).buffer, fakePdfjs());
  assert.match(a.fingerprint, /^[0-9a-f]{16}$/);
  assert.equal(a.fingerprint, b.fingerprint);
  assert.notEqual(a.fingerprint, c.fingerprint);
}

// text items on one line are joined in reading order
{
  const lines = linesFromItems([
    { str: 'world', transform: [11, 0, 0, 11, 120, 700], width: 30 },
    { str: 'Hello', transform: [11, 0, 0, 11, 72, 700], width: 40 }
  ], 600);
  assert.equal(lines.length, 1);
  assert.equal(lines[0].text, 'Hello world');
}

console.log('pdf-read: all tests passed');
