// Zoom maths for the reading view (no DOM, so it can be tested in Node).

export const MIN_ZOOM = 0.5;
export const MAX_ZOOM = 4;

export function clampZoom(zoom) {
  return Number.isFinite(zoom) ? Math.min(Math.max(zoom, MIN_ZOOM), MAX_ZOOM) : 1;
}

// Scale that draws a page of `pageWidth` units across `hostWidth` pixels.
// zoom 1 means the page fills the width of the reading area.
export function fitScale(pageWidth, hostWidth, zoom) {
  if (!(pageWidth > 0) || !(hostWidth > 0)) return 1;
  return (hostWidth / pageWidth) * clampZoom(zoom);
}

// Which page is at the top of the screen, and how far down it (0 = its top edge, 0.5 = halfway).
// `pages` are the page positions inside the scroll area, in order. Page numbers start at 1.
// A page with less than `slack` pixels still showing counts as already passed.
export function pageAtScroll(pages, scrollTop, slack = 40) {
  if (!pages.length) return { n: 1, frac: 0 };
  let n = 1;
  while (n < pages.length && pages[n - 1].top + pages[n - 1].height < scrollTop + slack) n++;
  const page = pages[n - 1];
  return { n, frac: page.height ? (scrollTop - page.top) / page.height : 0 };
}
