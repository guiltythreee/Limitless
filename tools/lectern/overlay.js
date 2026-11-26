// Lectern overlay: draws and edits the highlights and markers on one page of the reading view.
//
// Everything is positioned in percentages of the page, so zooming or resizing the window
// needs no recalculation: an annotation stays on the same words.
import {
  COLORS, COLOR_HEX, createHighlight, createMarker, updateAnnotation,
  annotationsForPage, rectsFromSelection
} from './annotations.mjs';

function el(tag, className, ...kids) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  for (const kid of kids) node.append(kid);
  return node;
}

const pct = v => `${(v * 100).toFixed(4)}%`;

export function swatch(colorName, onPick) {
  const b = el('button', 'lc-swatch');
  b.type = 'button';
  b.dataset.color = colorName;
  b.title = colorName;
  b.setAttribute('aria-label', `${colorName} highlight`);
  b.style.background = COLOR_HEX[colorName];
  b.addEventListener('mousedown', e => e.preventDefault());   // keep the text selection
  b.addEventListener('click', onPick);
  return b;
}

// ctx: { page, bookId, api }
//   api = { list(), put(annotation), remove(id), tool(), finishTool() }  (put/remove redraw the page)
export function mountOverlay(pageEl, ctx) {
  const layer = pageEl.querySelector('.lc-overlay');
  let popover = null;

  function closePopover() {
    popover?.remove();
    popover = null;
    document.removeEventListener('mousedown', onOutside, true);
    document.removeEventListener('keydown', onKey, true);
  }
  const onOutside = e => { if (popover && !popover.contains(e.target)) closePopover(); };
  const onKey = e => { if (e.key === 'Escape') closePopover(); };

  function openPopover(annotation) {
    closePopover();
    popover = el('div', 'lc-popover');
    const anchorX = Math.min(annotation.x, 0.65);
    const anchorY = annotation.kind === 'marker' ? annotation.y + 0.01 : annotation.y + annotation.h + 0.005;
    popover.style.left = pct(anchorX);
    popover.style.top = pct(Math.min(anchorY, 0.9));

    if (annotation.kind === 'highlight') {
      const row = el('div', 'lc-swatches');
      for (const name of COLORS) {
        row.append(swatch(name, () => { closePopover(); ctx.api.put(updateAnnotation(annotation, { color: name })); }));
      }
      popover.append(row);
    } else {
      const input = el('input', 'lc-label');
      input.type = 'text';
      input.placeholder = 'Label (optional)';
      input.value = annotation.label;
      input.maxLength = 80;
      const saveLabel = () => {
        if (input.value !== annotation.label) ctx.api.put(updateAnnotation(annotation, { label: input.value.trim() }));
      };
      input.addEventListener('keydown', e => { if (e.key === 'Enter') { saveLabel(); closePopover(); } });
      input.addEventListener('blur', saveLabel);
      popover.append(input);
    }
    const del = el('button', 'lc-popover-delete', 'Delete');
    del.type = 'button';
    del.dataset.action = 'delete';
    del.addEventListener('click', () => { closePopover(); ctx.api.remove(annotation.id); });
    popover.append(del);

    layer.append(popover);
    document.addEventListener('mousedown', onOutside, true);
    document.addEventListener('keydown', onKey, true);
  }

  function render() {
    closePopover();
    layer.replaceChildren();
    for (const a of annotationsForPage(ctx.api.list(), ctx.page)) {
      if (a.kind === 'highlight') {
        for (const r of a.rects) {
          const box = el('div', 'lc-hl');
          box.dataset.id = a.id;
          box.dataset.color = a.color;
          box.style.cssText = `left:${pct(r.x)};top:${pct(r.y)};width:${pct(r.w)};height:${pct(r.h)};background:${COLOR_HEX[a.color]}`;
          layer.append(box);
        }
      } else if (a.kind === 'marker') {
        const pin = el('div', 'lc-marker');
        pin.dataset.id = a.id;
        pin.style.left = pct(a.x);
        pin.style.top = pct(a.y);
        pin.append(el('span', 'lc-pin'));
        if (a.label) pin.append(el('span', 'lc-marker-label', a.label));
        pin.addEventListener('click', e => { e.stopPropagation(); openPopover(a); });
        layer.append(pin);
      }
    }
  }

  // Clicking the page: places a marker when the marker tool is on, otherwise opens the
  // highlight under the click. Highlights are not clickable elements themselves, so that
  // the text under them can still be selected.
  pageEl.addEventListener('click', e => {
    if (popover?.contains(e.target)) return;
    const box = pageEl.getBoundingClientRect();
    const x = (e.clientX - box.left) / box.width;
    const y = (e.clientY - box.top) / box.height;

    if (ctx.api.tool() === 'marker') {
      ctx.api.finishTool();
      ctx.api.put(createMarker({ bookId: ctx.bookId, page: ctx.page, x, y }));
      return;
    }
    const selection = window.getSelection();
    if (selection && !selection.isCollapsed) return;       // the click ended a text selection
    const hit = annotationsForPage(ctx.api.list(), ctx.page).find(a =>
      a.kind === 'highlight' && a.rects.some(r => x >= r.x - 0.002 && x <= r.x + r.w + 0.002 && y >= r.y - 0.002 && y <= r.y + r.h + 0.002));
    if (hit) openPopover(hit);
  });

  render();
  return { render };
}

// Turns the current text selection into highlights (one per page the selection touches).
// Returns how many were made.
export async function highlightSelection({ pageEls, bookId, color, api }) {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return 0;
  const range = selection.getRangeAt(0);
  const clientRects = [...range.getClientRects()].filter(r => r.width > 0 && r.height > 0);
  const whole = selection.toString().replace(/\s+/g, ' ').trim();

  const groups = [];
  for (const pageEl of pageEls) {
    const box = pageEl.getBoundingClientRect();
    if (!box.height) continue;
    const inside = clientRects.filter(r => {
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const lineSized = r.height < box.height * 0.1 && r.width < box.width * 0.98;   // skips whole-layer boxes
      return lineSized && cx >= box.left && cx <= box.right && cy >= box.top && cy <= box.bottom;
    });
    if (inside.length) groups.push({ pageEl, box, inside });
  }

  let created = 0;
  for (const { pageEl, box, inside } of groups) {
    const rects = rectsFromSelection(inside, box);
    if (!rects.length) continue;
    const text = groups.length === 1
      ? whole
      : [...pageEl.querySelectorAll('.textLayer span')].filter(s => range.intersectsNode(s)).map(s => s.textContent).join(' ').replace(/\s+/g, ' ').trim();
    await api.put(createHighlight({ bookId, page: Number(pageEl.dataset.page), rects, text, color }));
    created++;
  }
  if (created) selection.removeAllRanges();
  return created;
}
