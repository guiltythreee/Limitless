/* Annotation logic tests.
   Run from the repository root:
     node tools/lectern/tests/test-annotations.mjs
*/
import assert from 'node:assert/strict';
import {
  COLORS, COLOR_HEX, MAX_ATTACHMENT_BYTES, newId,
  createHighlight, createMarker, createNote, updateAnnotation,
  rectsFromSelection, annotationsForPage, notesForProblem,
  sanitizeAnnotation, mergeAnnotations
} from '../annotations.mjs';

const close = (a, b, msg) => assert.ok(Math.abs(a - b) < 1e-9, `${msg || ''} expected ${b}, got ${a}`);

// ---- constants ----
assert.deepEqual(COLORS, ['yellow', 'green', 'blue', 'pink', 'orange', 'purple']);
for (const c of COLORS) assert.match(COLOR_HEX[c], /^#[0-9a-f]{6}$/i, `${c} has a hex colour`);
assert.equal(MAX_ATTACHMENT_BYTES, 26214400);

// ---- ids ----
assert.notEqual(newId(), newId());
assert.ok(newId().length >= 8);

// ---- create* ----
const note = createNote({ bookId: 'b1', page: 3, x: 0.3, y: 0.4, color: 'blue' });
assert.equal(note.kind, 'note');
assert.equal(note.bookId, 'b1');
assert.equal(note.page, 3);
assert.equal(note.color, 'blue');
close(note.w, 0.22, 'note width');
close(note.h, 0.12, 'note height');
assert.equal(note.text, '');
assert.equal(note.problemKey, null);
assert.deepEqual(note.attachmentIds, []);
assert.ok(note.created > 0 && note.updated >= note.created);

const hl = createHighlight({ bookId: 'b1', page: 2, rects: [{ x: 0.1, y: 0.1, w: 0.5, h: 0.02 }], text: 'a line', color: 'green' });
assert.equal(hl.kind, 'highlight');
assert.equal(hl.text, 'a line');
assert.deepEqual(hl.rects, [{ x: 0.1, y: 0.1, w: 0.5, h: 0.02 }]);

const mk = createMarker({ bookId: 'b1', page: 5, x: 0.5, y: 0.25 });
assert.equal(mk.kind, 'marker');
assert.equal(mk.label, '');
assert.equal(createNote({ bookId: 'b1', page: 1, x: 0, y: 0, color: 'nonsense' }).color, 'yellow', 'unknown colour falls back to yellow');

// ---- updateAnnotation: stays inside the page, keeps identity ----
close(updateAnnotation(note, { x: 0.95 }).x, 0.78, 'x is pulled back inside the page');
close(updateAnnotation(note, { y: 2 }).y, 0.88, 'y is pulled back inside the page');
close(updateAnnotation(note, { x: -1 }).x, 0, 'x never goes below 0');
close(updateAnnotation(note, { w: 0 }).w, 0.05, 'width has a minimum');
close(updateAnnotation(note, { h: 0 }).h, 0.04, 'height has a minimum');
const edited = updateAnnotation(note, { id: 'hacked', bookId: 'other', kind: 'marker', text: 'hello' });
assert.equal(edited.id, note.id);
assert.equal(edited.bookId, 'b1');
assert.equal(edited.kind, 'note');
assert.equal(edited.text, 'hello');
assert.ok(edited.updated >= note.updated);
assert.equal(note.text, '', 'the original is not changed');

// ---- rectsFromSelection ----
const pageBox = { left: 0, top: 0, width: 600, height: 800 };
const one = rectsFromSelection([{ left: 60, top: 80, width: 300, height: 16 }], pageBox);
assert.equal(one.length, 1);
close(one[0].x, 0.1); close(one[0].y, 0.1); close(one[0].w, 0.5); close(one[0].h, 0.02);

const offset = rectsFromSelection([{ left: 160, top: 180, width: 300, height: 16 }], { left: 100, top: 100, width: 600, height: 800 });
close(offset[0].x, 0.1, 'page offset on screen is subtracted'); close(offset[0].y, 0.1);

const touching = rectsFromSelection([
  { left: 60, top: 80, width: 120, height: 16 },
  { left: 180, top: 80, width: 180, height: 16 }
], pageBox);
assert.equal(touching.length, 1, 'touching rects on one line become one');
close(touching[0].w, 0.5);

assert.equal(rectsFromSelection([
  { left: 60, top: 80, width: 120, height: 16 },
  { left: 60, top: 120, width: 120, height: 16 }
], pageBox).length, 2, 'different lines stay separate');
assert.equal(rectsFromSelection([{ left: 60, top: 80, width: 0.4, height: 16 }], pageBox).length, 0, 'under 1px wide is dropped');
assert.deepEqual(rectsFromSelection([], pageBox), []);

// ---- lookups ----
const list = [note, hl, mk, { ...createNote({ bookId: 'b1', page: 3, x: 0, y: 0, color: 'pink' }), problemKey: 'Ch1::Problems::2' }];
assert.equal(annotationsForPage(list, 3).length, 2);
assert.equal(annotationsForPage(list, 99).length, 0);
const linked = notesForProblem([{ ...hl, problemKey: 'Ch1::Problems::2' }, ...list], 'Ch1::Problems::2');
assert.equal(linked.length, 1, 'only notes count, and only for that problem');
assert.equal(linked[0].kind, 'note');

// ---- sanitizeAnnotation ----
assert.equal(sanitizeAnnotation({ id: 'a' }), null);
assert.equal(sanitizeAnnotation(null), null);
assert.equal(sanitizeAnnotation({ ...note, kind: 'sticker' }), null);
assert.equal(sanitizeAnnotation({ ...note, page: 'x' }), null);
assert.equal(sanitizeAnnotation({ ...note, color: 'plaid' }).color, 'yellow');
assert.deepEqual(sanitizeAnnotation(note), note, 'a good annotation passes through unchanged');

// ---- mergeAnnotations ----
const older = { ...note, text: 'old', updated: 100 };
const newer = { ...note, text: 'new', updated: 200 };
const extra = createMarker({ bookId: 'b1', page: 1, x: 0.1, y: 0.1 });
const merged = mergeAnnotations([older], [newer, extra]);
assert.equal(merged.length, 2);
assert.equal(merged.find(a => a.id === note.id).text, 'new');
assert.equal(mergeAnnotations([newer], [older]).find(a => a.id === note.id).text, 'new', 'older incoming does not overwrite');

console.log('annotations: all tests passed');
