// Lectern page. All logic lives in books.mjs; this file only draws and saves.
import {
  parseOutline, itemKey, summarize, nextUp, setMany, sectionKeys,
  emptyState, addBook, updateOutline, removeBook, sanitizeState
} from './books.mjs';
import { readPdfPages } from './pdf-read.mjs';
import { openStore } from './store.mjs';
import { openViewer } from './viewer.js';
import { detectBook, outlineText } from './detect.mjs';

const STORAGE_KEY = 'limitless.bookTracker.v1';

const EXAMPLE = `# Introduction to Probability - Ross
// "# " = book, "## " = chapter, "### " = section, lines below = problems
## Chapter 1: Combinatorial Analysis
### Problems
1-20
### Theoretical Exercises
1-15
### Self-Test Problems and Exercises
1-10
## Chapter 2: Axioms of Probability
### Problems
1-30
`;

let state = load();
let currentId = state.books[0] ? state.books[0].id : null;
let mode = state.books.length ? 'book' : 'add';   // 'book' | 'add' | 'edit' | 'read'
let hideDone = false;
let message = '';
let pendingPdf = null;      // the PDF chosen in the add form, stored once the book is added
let viewer = null;          // the open reading view, if any

// Book files live in the browser's own storage. If it is blocked, problem tracking still works.
let store = null;
let storeProblem = '';
openStore()
  .then(s => { store = s; })
  .catch(() => { storeProblem = 'Reading needs browser storage, which is blocked here.'; })
  .then(() => { if (mode === 'book') render(); });

let pdfjsPromise = null;
function loadPdfjs() {
  pdfjsPromise ||= import('./vendor/pdf.min.mjs').then(pdfjs => {
    pdfjs.GlobalWorkerOptions.workerSrc = new URL('./vendor/pdf.worker.min.mjs', import.meta.url).href;
    return pdfjs;
  });
  return pdfjsPromise;
}

function load() {
  try { return sanitizeState(JSON.parse(localStorage.getItem(STORAGE_KEY))); }
  catch { return emptyState(); }
}

function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  catch { message = 'Could not save to this browser (storage is blocked or full).'; }
}

// Small element builder. Text always goes in as text, never as HTML.
function h(tag, props = {}, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k === 'class') el.className = v;
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else if (v === true) el.setAttribute(k, '');
    else if (v !== false && v != null) el.setAttribute(k, v);
  }
  for (const kid of kids.flat()) el.append(kid);
  return el;
}

function bar(done, total) {
  const pct = total ? Math.round((done / total) * 100) : 0;
  const fill = h('span', { class: 'bt-fill' });
  fill.style.width = pct + '%';
  return h('span', { class: 'bt-bar', title: `${pct}%` }, fill);
}

const count = (done, total) => `${done} / ${total}`;

function render() {
  if (mode === 'read') return;   // the reading view draws itself
  const app = document.getElementById('app');
  app.replaceChildren(
    h('header', { class: 'bt-head' },
      h('h1', {}, 'Lectern'),
      h('div', { class: 'bt-actions' },
        h('button', { onclick: () => { mode = 'add'; message = ''; render(); } }, '+ Add book'),
        h('button', { onclick: exportData }, 'Export'),
        h('label', { class: 'bt-button' }, 'Import',
          h('input', { type: 'file', accept: 'application/json', hidden: true, onchange: importData })))),
    state.books.length ? tabs() : '',
    message ? h('p', { class: 'bt-message' }, message) : '',
    mode === 'add' ? addForm() : '',
    mode === 'edit' && currentId ? outlineForm(currentId) : '',
    mode === 'book' && currentId ? bookView() : ''
  );
}

function tabs() {
  return h('nav', { class: 'bt-tabs' }, state.books.map(b => {
    const title = parseOutline(b.outline).book.title || b.id;
    return h('button', {
      class: b.id === currentId && mode !== 'add' ? 'is-active' : '',
      onclick: () => { currentId = b.id; mode = 'book'; message = ''; render(); }
    }, title);
  }));
}

function addForm() {
  const status = h('p', { class: 'bt-hint' },
    'Choose your book as a PDF. It is read on this device and never uploaded anywhere.');
  const area = h('textarea', { class: 'bt-outline', rows: 18, spellcheck: false, placeholder: EXAMPLE, hidden: true });
  const addBtn = h('button', { hidden: true, onclick: () => submitOutline(null, area.value) }, 'Add book');
  const showText = () => { area.hidden = false; addBtn.hidden = false; };

  const onFile = async event => {
    const file = event.target.files[0];
    if (!file) return;
    message = '';
    status.textContent = 'Opening the PDF…';
    try {
      const pdfjs = await loadPdfjs();
      const data = await file.arrayBuffer();
      const { title, fingerprint, pages } = await readPdfPages(data, pdfjs,
        (n, total) => { status.textContent = `Reading page ${n} of ${total}…`; });
      // The same PDF again: open the book it already belongs to instead of making a duplicate.
      const known = store ? await store.findBookByFingerprint(fingerprint) : undefined;
      if (known && state.books.some(b => b.id === known)) {
        currentId = known;
        mode = 'book';
        message = 'This PDF is already in Lectern, so I opened that book.';
        render();
        return;
      }
      pendingPdf = { fingerprint, name: file.name, data };
      const name = title || file.name.replace(/\.pdf$/i, '').replace(/[_-]+/g, ' ').trim() || 'Untitled book';
      const { book, stats } = detectBook(pages, name);
      if (!stats.problems) {
        status.textContent = 'I could not find chapters with problems in this PDF. It may be scanned pages (pictures, not text) or use a layout I do not recognise. You can type the outline instead.';
        showText();
        return;
      }
      area.value = outlineText(book);
      showText();
      status.textContent = `Found ${stats.chapters} chapters, ${stats.sections} sections and ${stats.problems} problems. Check the list below, fix anything that is wrong, then add the book.`;
    } catch {
      status.textContent = 'That file could not be read as a PDF.';
    }
  };

  return h('section', { class: 'bt-form' },
    h('h2', {}, 'Add a book'),
    status,
    h('div', { class: 'bt-actions' },
      h('label', { class: 'bt-button' }, 'Choose PDF',
        h('input', { type: 'file', accept: 'application/pdf,.pdf', hidden: true, onchange: onFile })),
      h('button', { onclick: showText }, 'Type an outline instead'),
      state.books.length ? h('button', { onclick: () => { mode = 'book'; message = ''; render(); } }, 'Cancel') : ''),
    area,
    h('div', { class: 'bt-actions' }, addBtn));
}

function outlineForm(editId) {
  const existing = state.books.find(b => b.id === editId);
  const area = h('textarea', { class: 'bt-outline', rows: 18, spellcheck: false });
  area.value = existing ? existing.outline : '';
  return h('section', { class: 'bt-form' },
    h('h2', {}, 'Edit outline'),
    h('p', { class: 'bt-hint' },
      '# book title, ## chapter, ### section, then the problem numbers underneath (1-20, 25, 3a). Your ticks are kept when you change this.'),
    area,
    h('div', { class: 'bt-actions' },
      h('button', { onclick: () => submitOutline(editId, area.value) }, 'Save changes'),
      h('button', { onclick: () => { mode = 'book'; message = ''; render(); } }, 'Cancel'),
      h('button', { class: 'bt-danger', onclick: () => deleteBook(editId) }, 'Delete book')));
}

async function submitOutline(editId, text) {
  const result = editId ? updateOutline(state, editId, text) : addBook(state, text);
  if (result.errors.length) { message = result.errors.join(' '); render(); return; }
  state = result.state;
  if (!editId) currentId = result.id;
  mode = 'book';
  message = '';
  save();
  if (!editId && pendingPdf) {
    try {
      if (!store) throw new Error('no storage');
      await store.putFile(result.id, pendingPdf);
    } catch {
      message = 'The book was added, but its PDF could not be kept on this device, so it cannot be read here.';
    }
  }
  pendingPdf = null;
  render();
}

async function deleteBook(id) {
  if (!confirm('Delete this book and all its progress?')) return;
  try { await store?.deleteBook(id); } catch { /* the book is removed from the list either way */ }
  state = removeBook(state, id);
  currentId = state.books[0] ? state.books[0].id : null;
  mode = state.books.length ? 'book' : 'add';
  save();
  render();
}

function bookView() {
  const entry = state.books.find(b => b.id === currentId);
  if (!entry) return '';
  const { book } = parseOutline(entry.outline);
  const done = state.done[currentId] || {};
  const stats = summarize(book, done);
  const next = nextUp(book, done);

  return h('section', { class: 'bt-book' },
    h('div', { class: 'bt-summary' },
      h('h2', {}, book.title),
      h('div', { class: 'bt-total' }, bar(stats.done, stats.total), h('span', {}, count(stats.done, stats.total))),
      h('p', { class: 'bt-next' }, next
        ? `Next: ${next.chapter} › ${next.section} › ${next.label}`
        : 'Everything in this book is done.'),
      h('div', { class: 'bt-actions' },
        h('label', {}, h('input', {
          type: 'checkbox', checked: hideDone,
          onchange: e => { hideDone = e.target.checked; render(); }
        }), ' Hide done problems'),
        h('button', { onclick: openReader }, 'Read'),
        h('button', { onclick: () => { mode = 'edit'; message = ''; render(); } }, 'Edit outline'))),
    book.chapters.map((chapter, ci) => chapterView(chapter, stats.chapters[ci], done)));
}

function chapterView(chapter, cStats, done) {
  const details = h('details', { class: 'bt-chapter', open: cStats.done < cStats.total },
    h('summary', {}, h('span', { class: 'bt-title' }, chapter.title),
      bar(cStats.done, cStats.total), h('span', { class: 'bt-count' }, count(cStats.done, cStats.total))),
    chapter.sections.map((section, si) => sectionView(chapter, section, cStats.sections[si], done)));
  return details;
}

function sectionView(chapter, section, sStats, done) {
  const keys = sectionKeys(chapter, section);
  const labels = hideDone ? section.problems.filter(p => !done[itemKey(chapter.title, section.title, p)]) : section.problems;
  return h('div', { class: 'bt-section' },
    h('div', { class: 'bt-section-head' },
      h('strong', {}, section.title),
      h('span', { class: 'bt-count' }, count(sStats.done, sStats.total)),
      h('button', { onclick: () => mark(keys, true) }, 'All'),
      h('button', { onclick: () => mark(keys, false) }, 'None')),
    h('div', { class: 'bt-chips' }, labels.map(label => {
      const key = itemKey(chapter.title, section.title, label);
      const isDone = !!done[key];
      return h('button', {
        class: 'bt-chip' + (isDone ? ' is-done' : ''),
        'aria-pressed': String(isDone),
        onclick: () => mark([key], !isDone)
      }, label);
    })));
}

function mark(keys, value) {
  state = { ...state, done: { ...state.done, [currentId]: setMany(state.done[currentId] || {}, keys, value) } };
  save();
  render();
}

// ---- reading ----

function problemsOf(bookId) {
  const entry = state.books.find(b => b.id === bookId);
  if (!entry) return [];
  const { book } = parseOutline(entry.outline);
  return book.chapters.flatMap(chapter => chapter.sections.flatMap(section =>
    section.problems.map(label => ({
      key: itemKey(chapter.title, section.title, label),
      label: `${chapter.title} › ${section.title} › ${label}`
    }))));
}

async function openReader() {
  if (!store) { message = storeProblem || 'Reading needs browser storage, which is blocked here.'; render(); return; }
  let stored;
  try { stored = await store.getFile(currentId); } catch { stored = null; }
  if (stored) { showReader(); return; }
  // A book added from a typed outline has no PDF yet: ask for it once.
  const input = h('input', { type: 'file', accept: 'application/pdf,.pdf', hidden: true });
  input.addEventListener('change', async () => {
    const file = input.files[0];
    if (!file) return;
    try {
      const data = await file.arrayBuffer();
      const { fingerprint } = await readPdfPages(data, await loadPdfjs());
      await store.putFile(currentId, { fingerprint, name: file.name, data });
      showReader();
    } catch {
      message = 'That file could not be read as a PDF.';
      render();
    }
  });
  input.click();
}

async function showReader() {
  const entry = state.books.find(b => b.id === currentId);
  mode = 'read';
  message = '';
  const host = h('div', {});
  const back = () => { viewer?.destroy(); viewer = null; mode = 'book'; render(); };
  document.getElementById('app').replaceChildren(
    h('header', { class: 'bt-head' },
      h('h1', { class: 'lc-reader-title' }, entry ? (parseOutline(entry.outline).book.title || 'Lectern') : 'Lectern'),
      h('div', { class: 'bt-actions' }, h('button', { onclick: back }, '← Back to problems'))),
    host);
  try {
    viewer = await openViewer(host, { bookId: currentId, store, pdfjs: await loadPdfjs(), getProblems: () => problemsOf(currentId) });
  } catch (error) {
    mode = 'book';
    message = error.code === 'cannot-open' ? 'This PDF cannot be opened.' : (error.message || 'This PDF cannot be opened.');
    render();
  }
}

function exportData() {
  const link = h('a', {
    href: URL.createObjectURL(new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' })),
    download: 'lectern-backup.json'
  });
  link.click();
  URL.revokeObjectURL(link.href);
}

async function importData(event) {
  const file = event.target.files[0];
  if (!file) return;
  try {
    const imported = sanitizeState(JSON.parse(await file.text()));
    if (!imported.books.length) throw new Error('empty');
    state = imported;
    currentId = state.books[0].id;
    mode = 'book';
    message = '';
    save();
  } catch {
    message = 'That file is not a Lectern backup.';
  }
  render();
}

render();
