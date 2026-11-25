/* Lectern rename checks.
   Run from the repository root:
     node tools/lectern/tests/test-lectern-rename.mjs
*/
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8');

assert.ok(read('tools/lectern/index.html').includes('<title>Lectern'), 'new page is titled Lectern');
assert.ok(read('tools/book-tracker/index.html').includes('/tools/lectern/'), 'old URL redirects to the new one');
assert.ok(read('tools.js').includes('href: "tools/lectern/"'), 'hub card points at Lectern');
assert.ok(!read('tools.js').includes('tools/book-tracker/'), 'hub card no longer points at the old folder');
assert.ok(read('index.html').includes('tools/lectern/'), 'home sidebar points at Lectern');
assert.ok(read('tools/lectern/tracker.js').includes('limitless.bookTracker.v1'), 'existing saved books are still read');

console.log('lectern-rename: all tests passed');
