import { normalize } from "../epub/epub-domain";

export interface PdfTextItem {
  readonly str: string;
  readonly width?: number;
  readonly transform?: readonly number[];
  readonly fontName?: string;
}
export interface PdfLine {
  readonly text: string;
  readonly y: number;
  readonly size: number;
  readonly x: number;
  readonly right: number;
}
export interface PdfBlock {
  readonly t: "h" | "p";
  readonly text: string;
}
export interface PdfChapter {
  readonly p: number;
  readonly title: string;
}
export interface PdfChapterHead {
  readonly key: string;
  readonly title: string;
}

export function median(values: readonly number[]): number {
  if (!values.length) return 0;
  const sorted = [...values].filter(Number.isFinite).sort((a, b) => a - b);
  if (!sorted.length) return 0;
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

/** Converts pdf.js text runs into visual lines, retaining their geometry for paragraph grouping. */
export function extractLines(items: readonly PdfTextItem[], pageWidth: number): PdfLine[] {
  const runs = items
    .filter((item) => typeof item.str === "string" && normalize(item.str))
    .map((item) => {
      const transform = item.transform ?? [];
      const size = Math.max(1, Math.hypot(transform[2] ?? 0, transform[3] ?? 10));
      const x = Number(transform[4] ?? 0);
      const y = Number(transform[5] ?? 0);
      const text = normalize(item.str);
      return { text, x, y, size, right: x + Math.max(0, Number(item.width ?? text.length * size * 0.5)) };
    })
    .filter((run) => run.x >= -pageWidth && run.x <= pageWidth * 2);

  runs.sort((a, b) => b.y - a.y || a.x - b.x);
  const lines: { text: string; y: number; size: number; x: number; right: number }[] = [];
  for (const run of runs) {
    let line = lines.find((candidate) =>
      Math.abs(candidate.y - run.y) <= Math.max(2, Math.min(candidate.size, run.size) * 0.35),
    );
    if (!line) {
      line = { text: run.text, y: run.y, size: run.size, x: run.x, right: run.right };
      lines.push(line);
      continue;
    }
    const before = lines.indexOf(line);
    const chunks = line.text.split("\u0000");
    chunks.push(run.text);
    // Runs are sorted by x, so concatenation is deterministic. Preserve a separator
    // unless the glyph metrics indicate that the next run touches the previous one.
    const gap = run.x - line.right;
    line.text = line.text + (gap > Math.max(1, run.size * 0.12) ? " " : "") + run.text;
    line.right = Math.max(line.right, run.right);
    line.size = Math.max(line.size, run.size);
    line.y = (line.y + run.y) / 2;
  }
  return lines.map((line) => ({ ...line, text: normalize(line.text) }))
    .sort((a, b) => b.y - a.y || a.x - b.x);
}

export function blocksFromLines(lines: readonly PdfLine[], medianSize: number, pageHeight: number): PdfBlock[] {
  const out: PdfBlock[] = [];
  let paragraph: PdfLine[] = [];
  const flush = () => {
    if (!paragraph.length) return;
    let text = "";
    for (const line of paragraph) {
      const part = normalize(line.text);
      if (!part) continue;
      if (text.endsWith("-") && /^[a-z]/.test(part)) text = text.slice(0, -1) + part;
      else text += (text ? " " : "") + part;
    }
    text = normalize(text);
    if (text) out.push({ t: "p", text });
    paragraph = [];
  };

  for (const line of lines) {
    const isHeading = line.size >= Math.max(medianSize * 1.35, medianSize + 2) ||
      (/^(chapter|part|book)\s+/i.test(line.text) && line.size >= medianSize * 1.1);
    if (isHeading) {
      flush();
      out.push({ t: "h", text: normalize(line.text) });
      continue;
    }
    const previous = paragraph[paragraph.length - 1];
    const gap = previous ? Math.abs(previous.y - line.y) : 0;
    const sizeChange = previous ? Math.abs(previous.size - line.size) : 0;
    const columnJump = previous ? Math.abs(line.x - previous.x) > Math.max(60, pageHeight * 0.12) : false;
    if (previous && (gap > Math.max(previous.size * 1.9, 18) || sizeChange > 2 || columnJump)) flush();
    paragraph.push(line);
  }
  flush();
  return out;
}

export function pagesFromText(value: string, target = 900): PdfBlock[][] {
  const paragraphs = String(value ?? "").replace(/\r\n?/g, "\n").split(/\n\s*\n/).map(normalize).filter(Boolean);
  const blocks = paragraphs.map((text) => ({ t: "p" as const, text }));
  const pages: PdfBlock[][] = [];
  let page: PdfBlock[] = [];
  let length = 0;
  for (const block of blocks) {
    if (page.length && length + block.text.length > target) {
      pages.push(page);
      page = [];
      length = 0;
    }
    page.push(block);
    length += block.text.length;
  }
  if (page.length) pages.push(page);
  return pages;
}

const CHAPTER_RE = /^(?:chapter|chap\.?|part|book)\s+([0-9]+|[ivxlcdm]+|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)\b[\s.:—-]*(.*)$/i;
const ROMAN = /^(?=[ivxlcdm]+$)m{0,4}(?:cm|cd|d?c{0,3})(?:xc|xl|l?x{0,3})(?:ix|iv|v?i{0,3})$/i;

export function chNumOk(value: string): boolean {
  const token = normalize(value).toLowerCase();
  if (/^[1-9]\d*$/.test(token)) return true;
  if (ROMAN.test(token)) return true;
  return /^(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)$/.test(token);
}

export function chNumKey(value: string): string {
  return normalize(value).toLowerCase().replace(/\s+/g, " ");
}

export function chapterHeadsOnPage(lines: readonly PdfLine[], _medianSize: number, pageHeight: number): PdfChapterHead[] {
  const out: PdfChapterHead[] = [];
  for (const line of lines) {
    const topBand = line.y <= pageHeight * 0.22 || line.y >= pageHeight * 0.78;
    if (!topBand) continue;
    const match = line.text.match(CHAPTER_RE);
    if (!match || !chNumOk(match[1])) continue;
    const title = normalize(line.text);
    out.push({ key: chNumKey("chapter " + match[1]), title });
  }
  return out;
}

export function tidyChapters(chapters: readonly PdfChapter[], total: number): PdfChapter[] {
  const limit = Math.max(0, Math.floor(total));
  if (!limit) return [];
  const out: PdfChapter[] = [];
  const seen = new Set<number>();
  for (const chapter of [...chapters].sort((a, b) => a.p - b.p)) {
    if (!Number.isInteger(chapter.p) || chapter.p < 0 || chapter.p >= limit || seen.has(chapter.p)) continue;
    seen.add(chapter.p);
    out.push({ p: chapter.p, title: normalize(chapter.title) || `Part ${out.length + 1}` });
  }
  if (!seen.has(0)) out.unshift({ p: 0, title: "Beginning" });
  return out.sort((a, b) => a.p - b.p);
}

export function pickChapters(headsByPage: readonly (readonly PdfChapterHead[])[], total: number): PdfChapter[] {
  const found: PdfChapter[] = [];
  const seen = new Set<string>();
  headsByPage.forEach((heads, page) => {
    for (const head of heads) {
      if (seen.has(head.key)) continue;
      seen.add(head.key);
      found.push({ p: page, title: head.title });
    }
  });
  return tidyChapters(found, total);
}

export function evenChapters(total: number): PdfChapter[] {
  const count = Math.max(0, Math.floor(total));
  if (!count) return [];
  if (count < 20) return [{ p: 0, title: "Beginning" }];
  const chunks = 5;
  const step = Math.ceil(count / chunks);
  return Array.from({ length: chunks }, (_, index) => ({
    p: Math.min(count - 1, index * step),
    title: index === 0 ? "Beginning" : `Part ${index + 1}`,
  })).filter((chapter, index, all) => index === 0 || chapter.p > all[index - 1].p);
}
