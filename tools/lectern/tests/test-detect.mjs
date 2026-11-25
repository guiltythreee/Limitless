/* Chapter / section / problem detection tests (no PDF needed: pages are built by hand).
   Run from the repository root:
     node tools/lectern/tests/test-detect.mjs
*/
import assert from 'node:assert/strict';
import { detectBook, outlineText } from '../detect.mjs';
import { parseOutline, summarize, expandProblems } from '../books.mjs';

const H = 800;
// Build a page from lines of text, top to bottom. `big` lines get a large font.
function page(...rows) {
  return {
    height: H,
    lines: rows.map((row, i) => {
      const big = typeof row === 'object';
      return { text: big ? row.big : row, x: 72, y: H - 120 - i * 18, size: big ? 24 : 11 };
    })
  };
}
const body = n => Array.from({ length: n }, (_, i) => `ordinary body text line ${i}`);

// ---- Ross-style: "CHAPTER n" + title on the next line, three sections per chapter ----
const ross = [
  page('Contents', 'Chapter 1 Combinatorial Analysis 1', 'Chapter 2 Axioms of Probability 25'),   // table of contents must be ignored
  page('CHAPTER 1', 'Combinatorial Analysis', ...body(6), 'Summary', ...body(2)),
  page('PROBLEMS', '1. A man has 3 shirts and 4 ties.', 'He picks one of each.', '2. In how many ways can 8 people sit?', '3. How many words?', '4. Four.', '5. Five.'),
  page('THEORETICAL EXERCISES', '1. Prove the binomial theorem.', '2. Prove it again.', '3. And once more.'),
  page('SELF-TEST PROBLEMS AND EXERCISES', '1. Self one.', '2. Self two.'),
  page('CHAPTER 2', 'Axioms of Probability', ...body(3), 'Problems', '1. P one.', '2. P two.', '4. P four (three is hidden by the layout).', '5. P five.'),
  { height: H, lines: [{ text: 'CHAPTER 2 Axioms of Probability', x: 72, y: H - 30, size: 9 }, { text: '7. A stray number in the header band', x: 72, y: H - 20, size: 9 }] },
  page('Answers to Selected Problems', 'CHAPTER 1', '1. 56', '2. 40320', '3. 99')
];
let { book, stats } = detectBook(ross, 'Ross');
assert.deepEqual(book.chapters.map(c => c.title), ['Chapter 1: Combinatorial Analysis', 'Chapter 2: Axioms of Probability']);
assert.deepEqual(book.chapters[0].sections.map(s => s.title), ['PROBLEMS', 'THEORETICAL EXERCISES', 'SELF-TEST PROBLEMS AND EXERCISES']);
assert.deepEqual(book.chapters[0].sections.map(s => s.problems.length), [5, 3, 2]);
assert.deepEqual(book.chapters[1].sections[0].problems, ['1', '2', '3', '4', '5'], 'a one-number gap is filled in');
assert.equal(stats.problems, 15, 'answers at the back of the book add nothing');

// ---- a running header above the real chapter heading must not become the title ----
const withHeader = [{ height: H, lines: [
  { text: 'CHAPTER 1  Running header', x: 72, y: H - 36, size: 9 },
  { text: 'CHAPTER 1', x: 72, y: H - 120, size: 28 },
  { text: 'Combinatorial Analysis', x: 72, y: H - 160, size: 24 }
] }, page('Problems', '1. one', '2. two')];
assert.equal(detectBook(withHeader, 'T').book.chapters[0].title, 'Chapter 1: Combinatorial Analysis');

// ---- the outline text feeds the tracker unchanged ----
const text = outlineText(book);
assert.ok(text.includes('### PROBLEMS\n1-5'), text);
const parsed = parseOutline(text);
assert.deepEqual(parsed.errors, []);
assert.equal(summarize(parsed.book).total, 15);

// ---- numbered chapters with chapter-prefixed problems (1.1, 1.2 ...) and big headings ----
const stewart = [
  page({ big: '1 Functions and Models' }, ...body(3)),
  page('1.1 Exercises', '1.1 Find the domain.', '1.2 Sketch the graph.', '1.3 Evaluate.', '1.4 Solve.'),
  page({ big: '2 Limits and Derivatives' }, ...body(2), 'Exercises', '2.1 First.', '2.2 Second.', '2.3 Third.'),
  page('Exercises', '3.14 is an approximation of pi, said the teacher.')
];
({ book, stats } = detectBook(stewart, 'Calc'));
assert.deepEqual(book.chapters.map(c => c.title), ['Chapter 1: Functions and Models', 'Chapter 2: Limits and Derivatives']);
assert.deepEqual(book.chapters[0].sections[0].problems, ['1.1', '1.2', '1.3', '1.4']);
assert.equal(stats.problems, 7, 'a sentence that happens to start with 3.14 is not a problem');
const stewartText = outlineText(book);
assert.ok(stewartText.includes('1.1-1.4'), stewartText);
assert.deepEqual(expandProblems('1.1-1.4'), ['1.1', '1.2', '1.3', '1.4']);
assert.equal(summarize(parseOutline(stewartText).book).total, 7);

// ---- numbering that continues across sections in one chapter ----
const continued = [
  page('CHAPTER 1', 'Basics'),
  page('Problems', '1. a', '2. b', '3. c'),
  page('Theoretical Exercises', '4. d', '5. e')
];
({ book } = detectBook(continued, 'Cont'));
assert.deepEqual(book.chapters[0].sections.map(s => s.problems), [['1', '2', '3'], ['4', '5']]);

// ---- a book with no chapter headings still gets its problems ----
({ book, stats } = detectBook([page('Problems', '1. one', '2. two')], 'Loose'));
assert.equal(book.chapters[0].title, 'All problems');
assert.equal(stats.problems, 2);

// ---- nothing recognisable ----
({ stats } = detectBook([page(...body(10))], 'Prose'));
assert.deepEqual(stats, { chapters: 0, sections: 0, problems: 0 });

// ---- "Problems for Section 1.1" + Class / Homework sub-lists + "Problem 1.2." labels (MCS style) ----
const mcs = [
  { height: H, lines: [{ text: '1 What is a Proof?', x: 72, y: H - 100, size: 24 }, ...page('Some text.', 'More text.').lines] },
  page('Problems for Section 1.1', 'Class Problems', 'Problem 1.1.', 'Prove the theorem.', '(a) first part', '(b) second part', 'Problem 1.2.', 'Another one.'),
  page('Problems for Section 1.5', 'Homework Problems', 'Problem 1.3.', 'Show it.'),
  page('Problems for Section 1.7', 'Practice Problems', 'Problem 1.4.', 'Prove by cases.', 'Class Problems', 'Problem 1.5.', 'Hint: 1. try small cases', '2. then generalise', 'Homework Problems', 'Problem 1.6.', 'Last.'),
  { height: H, lines: [{ text: '2 The Well Ordering Principle', x: 72, y: H - 100, size: 24 }] },
  page('Problems for Section 2.2', 'Class Problems', 'Problem 2.1.', 'Prove it.', 'Problem 2.2.', 'Again.', 'Problem 2.2.', 'A repeated reference to the same problem.')
];
({ book, stats } = detectBook(mcs, 'MCS'));
assert.deepEqual(book.chapters.map(c => c.sections.flatMap(s => s.problems)),
  [['1.1', '1.2', '1.3', '1.4', '1.5', '1.6'], ['2.1', '2.2']],
  'every labelled problem is found once; list items inside a problem and repeats are ignored');
assert.equal(book.chapters[0].sections.length, 5, 'one section per sub-list');
assert.ok(book.chapters[0].sections[0].title.startsWith('Problems for Section 1.1'), book.chapters[0].sections[0].title);
assert.equal(stats.problems, 8);

console.log('detect: all tests passed');
