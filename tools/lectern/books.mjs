// Lectern logic. No DOM and no storage here, so it runs in Node and the browser.
//
// A book is described by a plain-text outline that mirrors the book:
//
//   # Book title
//   ## Chapter 1: Combinatorial Analysis
//   ### Problems
//   1-20
//   ### Theoretical Exercises
//   1-5, 7, 9
//
// Items under a section are problem labels. "1-20" expands to 1..20; anything
// else ("3a", "1.12", "Review 4") is kept exactly as written.

const MAX_RANGE = 5000;

export function expandProblems(text) {
  const out = [];
  const tidy = String(text).replace(/(\d)\s*[-–]\s*(\d)/g, '$1-$2');
  for (const token of tidy.split(/[,;\s]+/)) {
    if (!token) continue;
    const range = /^(\d+)-(\d+)$/.exec(token);
    if (range) {
      const from = Number(range[1]);
      const to = Number(range[2]);
      if (from <= to && to - from < MAX_RANGE) {
        for (let n = from; n <= to; n++) out.push(String(n));
        continue;
      }
    }
    // Chapter-numbered problems: 1.1-1.20 means 1.1, 1.2 ... 1.20
    const dotted = /^(\d+)\.(\d+)-(\d+)\.(\d+)$/.exec(token);
    if (dotted && dotted[1] === dotted[3]) {
      const from = Number(dotted[2]);
      const to = Number(dotted[4]);
      if (from <= to && to - from < MAX_RANGE) {
        for (let n = from; n <= to; n++) out.push(`${dotted[1]}.${n}`);
        continue;
      }
    }
    out.push(token);
  }
  return out;
}

export function parseOutline(text) {
  const book = { title: '', chapters: [] };
  const errors = [];
  let chapter = null;
  let section = null;

  String(text).split(/\r?\n/).forEach((raw, index) => {
    const line = raw.trim();
    if (!line || line.startsWith('//')) return;
    const where = `Line ${index + 1}`;
    let m;

    if ((m = /^###\s+(.+)$/.exec(line))) {
      if (!chapter) { errors.push(`${where}: section "${m[1]}" comes before any chapter.`); return; }
      const title = m[1].trim();
      section = chapter.sections.find(s => s.title === title);
      if (!section) { section = { title, problems: [] }; chapter.sections.push(section); }
    } else if ((m = /^##\s+(.+)$/.exec(line))) {
      const title = m[1].trim();
      chapter = book.chapters.find(c => c.title === title);
      if (!chapter) { chapter = { title, sections: [] }; book.chapters.push(chapter); }
      section = null;
    } else if ((m = /^#\s+(.+)$/.exec(line))) {
      book.title = m[1].trim();
    } else {
      if (!chapter) { errors.push(`${where}: problems "${line}" come before any chapter.`); return; }
      if (!section) {
        section = chapter.sections.find(s => s.title === 'Problems');
        if (!section) { section = { title: 'Problems', problems: [] }; chapter.sections.push(section); }
      }
      for (const label of expandProblems(line)) {
        if (!section.problems.includes(label)) section.problems.push(label);
      }
    }
  });

  if (!book.title) errors.push('The outline needs a book title: a first line like "# Book name".');
  if (!book.chapters.length) errors.push('The outline needs at least one chapter: a line like "## Chapter 1".');
  return { book, errors };
}

// A problem is identified by its names, not its position, so you can edit the
// outline later without losing what you already ticked.
export const itemKey = (chapter, section, label) => `${chapter}::${section}::${label}`;

export function summarize(book, done = {}) {
  let total = 0;
  let finished = 0;
  const chapters = book.chapters.map(chapter => {
    let cTotal = 0;
    let cDone = 0;
    const sections = chapter.sections.map(section => {
      const sDone = section.problems.filter(p => done[itemKey(chapter.title, section.title, p)]).length;
      cTotal += section.problems.length;
      cDone += sDone;
      return { title: section.title, done: sDone, total: section.problems.length };
    });
    total += cTotal;
    finished += cDone;
    return { title: chapter.title, done: cDone, total: cTotal, sections };
  });
  return { done: finished, total, chapters };
}

// First problem, in book order, that is not done yet.
export function nextUp(book, done = {}) {
  for (const chapter of book.chapters) {
    for (const section of chapter.sections) {
      for (const label of section.problems) {
        if (!done[itemKey(chapter.title, section.title, label)]) {
          return { chapter: chapter.title, section: section.title, label };
        }
      }
    }
  }
  return null;
}

export function setMany(done, keys, value) {
  const next = { ...done };
  for (const key of keys) {
    if (value) next[key] = 1;
    else delete next[key];
  }
  return next;
}

export function sectionKeys(chapter, section) {
  return section.problems.map(p => itemKey(chapter.title, section.title, p));
}

// ---- Whole-app state: { books: [{ id, outline }], done: { [bookId]: { [key]: 1 } } } ----

export const emptyState = () => ({ books: [], done: {} });

function slug(title) {
  return String(title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'book';
}

function uniqueId(state, title) {
  const base = slug(title);
  let id = base;
  for (let n = 2; state.books.some(b => b.id === id); n++) id = `${base}-${n}`;
  return id;
}

export function addBook(state, outline) {
  const { book, errors } = parseOutline(outline);
  if (errors.length) return { state, errors };
  const id = uniqueId(state, book.title);
  return { state: { ...state, books: [...state.books, { id, outline }] }, id, errors: [] };
}

export function updateOutline(state, id, outline) {
  const { errors } = parseOutline(outline);
  if (errors.length) return { state, errors };
  return { state: { ...state, books: state.books.map(b => (b.id === id ? { ...b, outline } : b)) }, errors: [] };
}

export function removeBook(state, id) {
  const done = { ...state.done };
  delete done[id];
  return { books: state.books.filter(b => b.id !== id), done };
}

// Accepts anything (old storage, imported file) and returns a safe state.
export function sanitizeState(raw) {
  const state = emptyState();
  if (!raw || typeof raw !== 'object' || !Array.isArray(raw.books)) return state;
  for (const b of raw.books) {
    if (!b || typeof b.id !== 'string' || typeof b.outline !== 'string') continue;
    if (state.books.some(x => x.id === b.id)) continue;
    state.books.push({ id: b.id, outline: b.outline });
    const marks = raw.done && raw.done[b.id];
    if (marks && typeof marks === 'object') {
      state.done[b.id] = {};
      for (const key of Object.keys(marks)) if (marks[key]) state.done[b.id][key] = 1;
    }
  }
  return state;
}
