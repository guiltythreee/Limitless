// Lectern reading view: draws the pages of a stored PDF (canvas + selectable text layer).
// Every page has an empty overlay layer on top, where highlights, markers and notes will be drawn.
//
// Only pages near the screen are drawn, and pages that scroll far away are cleared again,
// so a 500-page book does not fill the device's memory.
import { fitScale, clampZoom, pageAtScroll } from './viewer-math.mjs';
import { COLORS } from './annotations.mjs';
import { mountOverlay, highlightSelection, swatch } from './overlay.js';

const ZOOM_STEP = 1.25;
const PAGE_PADDING = 24;     // space left and right of a page, in px
const DRAW_MARGIN = '800px 0px';

function fail(code, message) {
  return Object.assign(new Error(message), { code });
}

function el(tag, className, ...kids) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  for (const kid of kids) node.append(kid);
  return node;
}

function button(label, title, onclick) {
  const b = el('button', 'lc-btn', label);
  b.type = 'button';
  b.title = title;
  b.addEventListener('click', onclick);
  return b;
}

// opts: { bookId, store, pdfjs, getProblems }  (getProblems is used by the note blocks later)
export async function openViewer(host, { bookId, store, pdfjs }) {
  const file = await store.getFile(bookId);
  if (!file) throw fail('no-file', 'This book has no PDF stored in Lectern yet.');

  let doc;
  try {
    doc = await pdfjs.getDocument({
      data: new Uint8Array(file.data).slice(),
      isEvalSupported: false,
      useWorkerFetch: false,
      disableAutoFetch: true,
      stopAtErrors: false
    }).promise;
  } catch {
    throw fail('cannot-open', 'This PDF cannot be opened');
  }

  let zoom = 1;
  let layoutId = 0;                    // changes whenever page sizes change
  const total = doc.numPages;
  const first = await doc.getPage(1);
  const firstView = first.getViewport({ scale: 1 });
  const sizes = new Array(total).fill(null);   // page size at scale 1, filled in as pages are met
  sizes[0] = { w: firstView.width, h: firstView.height };

  // ---- structure ----
  const pageInput = el('input', 'lc-page-input');
  pageInput.type = 'number';
  pageInput.min = '1';
  pageInput.max = String(total);
  pageInput.value = '1';
  pageInput.setAttribute('aria-label', 'Page number');
  const zoomLabel = el('span', 'lc-zoom-label', '100%');

  const hint = el('span', 'lc-hint');
  hint.hidden = true;
  let hintTimer = 0;
  const showHint = text => {
    hint.textContent = text;
    hint.hidden = false;
    clearTimeout(hintTimer);
    hintTimer = setTimeout(() => { hint.hidden = true; }, 3500);
  };

  const markerButton = button('Marker', 'Click, then click the page to drop a marker', () => setTool(tool === 'marker' ? null : 'marker'));
  markerButton.dataset.tool = 'marker';
  markerButton.setAttribute('aria-pressed', 'false');

  const swatches = el('span', 'lc-swatches');
  for (const name of COLORS) swatches.append(swatch(name, () => onHighlight(name)));

  const toolbar = el('div', 'lc-toolbar',
    pageInput, el('span', 'lc-total', `/ ${total}`),
    button('−', 'Zoom out', () => setZoom(zoom / ZOOM_STEP)),
    zoomLabel,
    button('+', 'Zoom in', () => setZoom(zoom * ZOOM_STEP)),
    button('Fit', 'Fit to width', () => setZoom(1)),
    el('span', 'lc-sep'),
    swatches, markerButton, hint);

  const scroller = el('div', 'lc-scroll');
  scroller.tabIndex = 0;
  const pageEls = [];
  for (let n = 1; n <= total; n++) {
    const overlay = el('div', 'lc-overlay');
    const page = el('div', 'lc-page', overlay);
    page.dataset.page = String(n);
    pageEls.push(page);
    scroller.append(page);
  }
  host.replaceChildren(el('div', 'lc-reader', toolbar, scroller));

  // ---- highlights and markers ----
  let annotations = [];
  try { annotations = await store.listAnnotations(bookId); } catch { /* reading still works without notes */ }
  let tool = null;
  const overlays = [];

  const redraw = page => overlays[page - 1]?.render();
  const api = {
    list: () => annotations,
    tool: () => tool,
    finishTool: () => setTool(null),
    async put(annotation) {
      try {
        await store.putAnnotation(annotation);
      } catch {
        showHint('Could not save this on the device.');
        return;
      }
      annotations = [...annotations.filter(a => a.id !== annotation.id), annotation];
      redraw(annotation.page);
    },
    async remove(id) {
      const gone = annotations.find(a => a.id === id);
      try { await store.deleteAnnotation(id); } catch { showHint('Could not remove this from the device.'); return; }
      annotations = annotations.filter(a => a.id !== id);
      if (gone) redraw(gone.page);
    }
  };

  function setTool(next) {
    tool = next;
    markerButton.setAttribute('aria-pressed', String(tool === 'marker'));
    scroller.classList.toggle('is-marking', tool === 'marker');
  }

  async function onHighlight(color) {
    const made = await highlightSelection({ pageEls, bookId, color, api });
    if (!made) showHint('Select some text first, then pick a colour.');
  }

  pageEls.forEach((pageEl, i) => overlays.push(mountOverlay(pageEl, { page: i + 1, bookId, api })));

  // ---- layout and drawing ----
  const availableWidth = () => Math.max(120, scroller.clientWidth - PAGE_PADDING * 2);
  const scaleFor = n => fitScale((sizes[n - 1] || sizes[0]).w, availableWidth(), zoom);

  function sizePage(n) {
    const base = sizes[n - 1] || sizes[0];
    const scale = scaleFor(n);
    const pageEl = pageEls[n - 1];
    pageEl.style.width = `${base.w * scale}px`;
    pageEl.style.height = `${base.h * scale}px`;
    pageEl.style.setProperty('--scale-factor', String(scale));
  }

  const tokens = new Array(total).fill(0);         // newest draw request per page
  const drawnAt = new Array(total).fill(-1);       // layoutId each page was drawn for
  const visible = new Set();

  function clearPage(n) {
    tokens[n - 1]++;
    drawnAt[n - 1] = -1;
    for (const child of [...pageEls[n - 1].children]) {
      if (!child.classList.contains('lc-overlay')) child.remove();
    }
  }

  async function drawPage(n) {
    if (drawnAt[n - 1] === layoutId) return;
    const token = ++tokens[n - 1];
    drawnAt[n - 1] = layoutId;
    try {
      const page = await doc.getPage(n);
      if (token !== tokens[n - 1]) return;
      const base = page.getViewport({ scale: 1 });
      sizes[n - 1] = { w: base.width, h: base.height };
      sizePage(n);
      const scale = scaleFor(n);
      const viewport = page.getViewport({ scale });
      const ratio = window.devicePixelRatio || 1;

      const canvas = document.createElement('canvas');
      canvas.className = 'lc-canvas';
      canvas.width = Math.floor(viewport.width * ratio);
      canvas.height = Math.floor(viewport.height * ratio);
      canvas.style.width = `${viewport.width}px`;
      canvas.style.height = `${viewport.height}px`;
      await page.render({
        canvasContext: canvas.getContext('2d'),
        viewport,
        transform: ratio === 1 ? null : [ratio, 0, 0, ratio, 0, 0]
      }).promise;
      if (token !== tokens[n - 1]) return;

      const textLayer = el('div', 'textLayer');
      const pageEl = pageEls[n - 1];
      pageEl.prepend(textLayer);
      pageEl.prepend(canvas);
      await new pdfjs.TextLayer({ textContentSource: page.streamTextContent(), container: textLayer, viewport }).render();
    } catch {
      if (token === tokens[n - 1]) drawnAt[n - 1] = -1;   // try again next time it is needed
    }
  }

  function relayout() {
    layoutId++;
    for (let n = 1; n <= total; n++) { sizePage(n); if (!visible.has(n)) clearPage(n); }
    for (const n of visible) { clearPage(n); drawPage(n); }
  }

  // The page (and how far down it) is at the top of the screen, so zooming keeps your place.
  function currentPlace() {
    return pageAtScroll(pageEls.map(p => ({ top: p.offsetTop, height: p.offsetHeight })), scroller.scrollTop);
  }

  function setZoom(next) {
    const place = currentPlace();
    zoom = clampZoom(next);
    zoomLabel.textContent = `${Math.round(zoom * 100)}%`;
    relayout();
    const pageEl = pageEls[place.n - 1];
    scroller.scrollTop = pageEl.offsetTop + place.frac * pageEl.offsetHeight;
  }

  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      const n = Number(entry.target.dataset.page);
      if (entry.isIntersecting) { visible.add(n); drawPage(n); }
      else { visible.delete(n); clearPage(n); }
    }
  }, { root: scroller, rootMargin: DRAW_MARGIN });

  // ---- page number box ----
  let frame = 0;
  const onScroll = () => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      if (document.activeElement !== pageInput) pageInput.value = String(currentPlace().n);
    });
  };
  const goTo = n => {
    const page = Math.min(Math.max(Math.round(Number(n)) || 1, 1), total);
    scroller.scrollTop = pageEls[page - 1].offsetTop;
  };
  pageInput.addEventListener('change', () => goTo(pageInput.value));
  pageInput.addEventListener('keydown', e => { if (e.key === 'Enter') { goTo(pageInput.value); scroller.focus(); } });
  scroller.addEventListener('scroll', onScroll, { passive: true });

  // ---- resizing the window ----
  let lastWidth = scroller.clientWidth;
  let resizeTimer = 0;
  const resizeObserver = new ResizeObserver(() => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (scroller.clientWidth === lastWidth) return;
      lastWidth = scroller.clientWidth;
      const place = currentPlace();
      relayout();
      const pageEl = pageEls[place.n - 1];
      scroller.scrollTop = pageEl.offsetTop + place.frac * pageEl.offsetHeight;
    }, 150);
  });

  for (let n = 1; n <= total; n++) sizePage(n);
  pageEls.forEach(p => observer.observe(p));
  resizeObserver.observe(scroller);

  return {
    goTo,
    destroy() {
      observer.disconnect();
      resizeObserver.disconnect();
      clearTimeout(resizeTimer);
      clearTimeout(hintTimer);
      if (frame) cancelAnimationFrame(frame);
      tokens.fill(Infinity);
      try { doc.destroy(); } catch { /* best effort */ }
      host.replaceChildren();
    }
  };
}
