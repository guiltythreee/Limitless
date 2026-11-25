// Annotation logic for Lectern: highlights, markers and note blocks.
// No DOM and no storage here, so it runs in Node and in the browser.
//
// Positions are fractions of the page (0 to 1), never pixels, so an annotation
// stays on the same spot at any zoom or window size.

export const COLORS = ['yellow', 'green', 'blue', 'pink', 'orange', 'purple'];
export const COLOR_HEX = {
  yellow: '#f4d35e',
  green: '#7bc67b',
  blue: '#6fa8dc',
  pink: '#e88fb4',
  orange: '#f0a05a',
  purple: '#a98fd6'
};
export const MAX_ATTACHMENT_BYTES = 26214400; // 25 MB

const KINDS = ['highlight', 'marker', 'note'];
const NOTE_W = 0.22;
const NOTE_H = 0.12;
const MIN_NOTE_W = 0.05;
const MIN_NOTE_H = 0.04;

const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
const num = (v, fallback = 0) => (Number.isFinite(v) ? v : fallback);
const color = c => (COLORS.includes(c) ? c : 'yellow');

export function newId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
}

function base(kind, { bookId, page, color: c }) {
  const now = Date.now();
  return {
    id: newId(), bookId, kind, page, color: color(c),
    x: 0, y: 0, w: 0, h: 0, rects: [],
    text: '', label: '', problemKey: null, attachmentIds: [],
    created: now, updated: now
  };
}

function bounds(rects) {
  if (!rects.length) return { x: 0, y: 0, w: 0, h: 0 };
  const x = Math.min(...rects.map(r => r.x));
  const y = Math.min(...rects.map(r => r.y));
  const right = Math.max(...rects.map(r => r.x + r.w));
  const bottom = Math.max(...rects.map(r => r.y + r.h));
  return { x, y, w: right - x, h: bottom - y };
}

export function createHighlight({ bookId, page, rects, text, color: c }) {
  return { ...base('highlight', { bookId, page, color: c }), ...bounds(rects), rects: rects.map(r => ({ ...r })), text: text || '' };
}

export function createMarker({ bookId, page, x, y, label }) {
  return { ...base('marker', { bookId, page, color: 'orange' }), x, y, label: label || '' };
}

export function createNote({ bookId, page, x, y, color: c }) {
  return { ...base('note', { bookId, page, color: c }), x, y, w: NOTE_W, h: NOTE_H };
}

export function updateAnnotation(a, patch) {
  const { id, bookId, kind, ...rest } = patch;
  const next = { ...a, ...rest };
  if (a.kind === 'note') {
    next.w = clamp(num(next.w, NOTE_W), MIN_NOTE_W, 1);
    next.h = clamp(num(next.h, NOTE_H), MIN_NOTE_H, 1);
    next.x = clamp(num(next.x), 0, 1 - next.w);
    next.y = clamp(num(next.y), 0, 1 - next.h);
  } else {
    next.x = clamp(num(next.x), 0, 1);
    next.y = clamp(num(next.y), 0, 1);
  }
  if ('color' in rest) next.color = color(next.color);
  next.updated = Math.max(Date.now(), a.updated);
  return next;
}

// Screen rectangles of a text selection -> page fractions, one rectangle per line.
export function rectsFromSelection(clientRects, pageBox) {
  const rects = clientRects
    .filter(r => r.width >= 1 && r.height > 0)
    .map(r => ({
      x: (r.left - pageBox.left) / pageBox.width,
      y: (r.top - pageBox.top) / pageBox.height,
      w: r.width / pageBox.width,
      h: r.height / pageBox.height
    }))
    .sort((a, b) => a.y - b.y || a.x - b.x);

  const out = [];
  for (const r of rects) {
    const last = out[out.length - 1];
    const sameLine = last && Math.abs(last.y - r.y) <= 0.3 * Math.max(last.h, r.h);
    const touching = last && r.x <= last.x + last.w + 0.004;
    if (sameLine && touching) {
      const right = Math.max(last.x + last.w, r.x + r.w);
      const bottom = Math.max(last.y + last.h, r.y + r.h);
      last.x = Math.min(last.x, r.x);
      last.y = Math.min(last.y, r.y);
      last.w = right - last.x;
      last.h = bottom - last.y;
    } else {
      out.push({ ...r });
    }
  }
  return out;
}

export const annotationsForPage = (list, page) => list.filter(a => a.page === page);
export const notesForProblem = (list, problemKey) => list.filter(a => a.kind === 'note' && a.problemKey === problemKey);

// Accepts anything (old storage, an imported file) and returns a safe annotation or null.
export function sanitizeAnnotation(raw) {
  if (!raw || typeof raw !== 'object') return null;
  if (typeof raw.id !== 'string' || !raw.id) return null;
  if (typeof raw.bookId !== 'string' || !raw.bookId) return null;
  if (!KINDS.includes(raw.kind)) return null;
  if (!Number.isInteger(raw.page) || raw.page < 1) return null;
  const now = Date.now();
  return {
    id: raw.id, bookId: raw.bookId, kind: raw.kind, page: raw.page, color: color(raw.color),
    x: num(raw.x), y: num(raw.y), w: num(raw.w), h: num(raw.h),
    rects: Array.isArray(raw.rects)
      ? raw.rects.filter(r => r && [r.x, r.y, r.w, r.h].every(Number.isFinite)).map(r => ({ x: r.x, y: r.y, w: r.w, h: r.h }))
      : [],
    text: typeof raw.text === 'string' ? raw.text : '',
    label: typeof raw.label === 'string' ? raw.label : '',
    problemKey: typeof raw.problemKey === 'string' ? raw.problemKey : null,
    attachmentIds: Array.isArray(raw.attachmentIds) ? raw.attachmentIds.filter(id => typeof id === 'string') : [],
    created: num(raw.created, now),
    updated: num(raw.updated, now)
  };
}

// Same id in both lists: the newer one wins.
export function mergeAnnotations(existing, incoming) {
  const byId = new Map(existing.map(a => [a.id, a]));
  for (const a of incoming) {
    const have = byId.get(a.id);
    if (!have || a.updated > have.updated) byId.set(a.id, a);
  }
  return [...byId.values()];
}
