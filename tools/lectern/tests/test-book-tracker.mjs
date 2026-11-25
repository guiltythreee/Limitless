/* Lectern logic tests.
   Run from the repository root:
     node tools/lectern/tests/test-book-tracker.mjs
*/
import assert from 'node:assert/strict';
import {
  expandProblems, parseOutline, itemKey, summarize, nextUp, setMany, sectionKeys,
  emptyState, addBook, updateOutline, removeBook, sanitizeState
} from '../books.mjs';

// ---- expandProblems ----
assert.deepEqual(expandProblems('1-4'), ['1', '2', '3', '4']);
assert.deepEqual(expandProblems('1 - 3, 7; 9'), ['1', '2', '3', '7', '9']);
assert.deepEqual(expandProblems('3a, 3b 1.12'), ['3a', '3b', '1.12']);
assert.deepEqual(expandProblems('5-3'), ['5-3'], 'a backwards range stays a literal label');
assert.deepEqual(expandProblems(''), []);

// ---- parseOutline ----
const OUTLINE = `
# Probability - Ross
// a comment
## Chapter 1: Combinatorial Analysis
### Problems
1-3
### Theoretical Exercises
1-2, 4
## Chapter 2
1-2
`;
const { book, errors } = parseOutline(OUTLINE);
assert.deepEqual(errors, []);
assert.equal(book.title, 'Probability - Ross');
assert.equal(book.chapters.length, 2);
assert.deepEqual(book.chapters[0].sections.map(s => s.title), ['Problems', 'Theoretical Exercises']);
assert.deepEqual(book.chapters[0].sections[1].problems, ['1', '2', '4']);
assert.equal(book.chapters[1].sections[0].title, 'Problems', 'bare items get a default Problems section');

assert.ok(parseOutline('## Ch\n1-2').errors.some(e => /title/.test(e)));
assert.ok(parseOutline('# T\n1-2').errors.some(e => /before any chapter/.test(e)));
assert.ok(parseOutline('# T').errors.some(e => /chapter/.test(e)));

const repeated = parseOutline('# T\n## C\n### P\n1-2\n### P\n2-3').book;
assert.deepEqual(repeated.chapters[0].sections[0].problems, ['1', '2', '3'], 'repeated section merges and dedupes');

// ---- summarize / nextUp / setMany ----
let done = {};
let s = summarize(book, done);
assert.equal(s.total, 8);
assert.equal(s.done, 0);
assert.deepEqual(nextUp(book, done), { chapter: 'Chapter 1: Combinatorial Analysis', section: 'Problems', label: '1' });

const ch1 = book.chapters[0];
done = setMany(done, sectionKeys(ch1, ch1.sections[0]), true);
s = summarize(book, done);
assert.equal(s.done, 3);
assert.equal(s.chapters[0].done, 3);
assert.equal(s.chapters[0].sections[0].done, 3);
assert.equal(s.chapters[0].sections[1].done, 0);
assert.equal(nextUp(book, done).section, 'Theoretical Exercises');

done = setMany(done, [itemKey(ch1.title, 'Problems', '2')], false);
assert.equal(summarize(book, done).done, 2);
assert.equal(nextUp(book, done).label, '2');

const everything = book.chapters.flatMap(c => c.sections.flatMap(sec => sectionKeys(c, sec)));
assert.equal(nextUp(book, setMany({}, everything, true)), null);

// ---- progress survives outline edits ----
let st = emptyState();
let added = addBook(st, OUTLINE);
assert.deepEqual(added.errors, []);
st = added.state;
const id = added.id;
assert.equal(id, 'probability-ross');
st = { ...st, done: { [id]: setMany({}, [itemKey(ch1.title, 'Problems', '1')], true) } };
const edited = updateOutline(st, id, OUTLINE.replace('1-3', '1-5'));
assert.deepEqual(edited.errors, []);
st = edited.state;
const { book: editedBook } = parseOutline(st.books[0].outline);
assert.equal(summarize(editedBook, st.done[id]).done, 1, 'earlier tick is kept after adding problems');

// ---- add / remove / sanitize ----
assert.ok(addBook(emptyState(), 'nonsense').errors.length > 0);
const second = addBook(st, OUTLINE);
assert.equal(second.id, 'probability-ross-2', 'duplicate titles get a unique id');
assert.deepEqual(removeBook(second.state, id).books.map(b => b.id), ['probability-ross-2']);
assert.equal(removeBook(second.state, id).done[id], undefined);

assert.deepEqual(sanitizeState(null), emptyState());
assert.deepEqual(sanitizeState({ books: 'x' }), emptyState());
const cleaned = sanitizeState({
  books: [{ id: 'a', outline: '# A\n## C\n1' }, { id: 5 }, { id: 'a', outline: 'dup' }],
  done: { a: { 'C::Problems::1': 1, junk: 0 }, ghost: { x: 1 } }
});
assert.deepEqual(cleaned.books, [{ id: 'a', outline: '# A\n## C\n1' }]);
assert.deepEqual(cleaned.done, { a: { 'C::Problems::1': 1 } });

console.log('book-tracker: all tests passed');
