// Reads a PDF on this device and returns its text as lines, page by page.
// Line grouping follows Bookkeys (tools/typing-next-source/src/domain/pdf/pdf-domain.ts).
// The pdf.js library is passed in, so this runs in the browser (vendor/pdf.min.mjs) and in Node tests.

const clean = s => String(s).replace(/\s+/g, ' ').trim();

// pdf.js text items -> visual lines, top of the page first.
export function linesFromItems(items, pageWidth) {
  const runs = items
    .filter(item => typeof item.str === 'string' && clean(item.str))
    .map(item => {
      const t = item.transform || [];
      const size = Math.max(1, Math.hypot(t[2] || 0, t[3] || 10));
      const text = clean(item.str);
      const x = Number(t[4] || 0);
      return { text, x, y: Number(t[5] || 0), size, right: x + Math.max(0, Number(item.width ?? text.length * size * 0.5)) };
    })
    .filter(run => run.x >= -pageWidth && run.x <= pageWidth * 2);

  runs.sort((a, b) => b.y - a.y || a.x - b.x);
  const lines = [];
  for (const run of runs) {
    const line = lines.find(c => Math.abs(c.y - run.y) <= Math.max(2, Math.min(c.size, run.size) * 0.35));
    if (!line) { lines.push({ ...run }); continue; }
    const gap = run.x - line.right;
    line.text += (gap > Math.max(1, run.size * 0.12) ? ' ' : '') + run.text;
    line.right = Math.max(line.right, run.right);
    line.size = Math.max(line.size, run.size);
    line.y = (line.y + run.y) / 2;
  }
  return lines
    .map(l => ({ text: clean(l.text), x: l.x, y: l.y, size: l.size }))
    .sort((a, b) => b.y - a.y || a.x - b.x);
}

export async function readPdfPages(data, pdfjs, onProgress = () => {}) {
  const doc = await pdfjs.getDocument({
    data: new Uint8Array(data),
    isEvalSupported: false,
    useWorkerFetch: false,
    disableAutoFetch: true,
    stopAtErrors: false
  }).promise;

  try {
    const pages = [];
    for (let n = 1; n <= doc.numPages; n++) {
      onProgress(n, doc.numPages);
      try {
        const page = await doc.getPage(n);
        const viewport = page.getViewport({ scale: 1 });
        const content = await page.getTextContent();
        pages.push({ height: viewport.height, lines: linesFromItems(content.items, viewport.width) });
      } catch {
        pages.push({ height: 800, lines: [] });   // a damaged page must not stop the rest
      }
    }
    let title = '';
    try { title = clean((await doc.getMetadata())?.info?.Title || ''); } catch { /* optional */ }
    return { title, pages };
  } finally {
    try { await doc.destroy(); } catch { /* best effort */ }
  }
}
