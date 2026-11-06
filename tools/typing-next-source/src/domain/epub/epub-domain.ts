export interface EpubBlock {
  readonly t: "h" | "p";
  readonly text: string;
  readonly id?: string;
}
export interface EpubTocEntry {
  readonly href: string;
  readonly label: string;
  readonly subitems?: readonly EpubTocEntry[];
}
export interface EpubChapter {
  readonly p: number;
  readonly title: string;
}
export interface EpubPart {
  readonly start: number;
  readonly count: number;
  readonly title: string;
}
export interface EpubSection {
  readonly sections: EpubBlock[][];
  readonly secOf: number[];
}

export function normalize(value: unknown): string {
  return String(value ?? "")
    .replace(/\u00a0/g, " ")
    .replace(/[\u2010-\u2015\u2212]/g, "-")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/\u2026/g, "...")
    .replace(/\ufb00/g, "ff")
    .replace(/\ufb01/g, "fi")
    .replace(/\ufb02/g, "fl")
    .replace(/\ufb03/g, "ffi")
    .replace(/\ufb04/g, "ffl")
    .replace(/\s+/g, " ")
    .trim();
}

export function tidyChapters(chapters: readonly EpubChapter[]): EpubChapter[] {
  const out: EpubChapter[] = [];
  const seen = new Set<number>();
  for (const chapter of chapters) {
    if (!Number.isInteger(chapter.p) || chapter.p < 0 || seen.has(chapter.p)) continue;
    seen.add(chapter.p);
    const title = normalize(chapter.title) || `Part ${out.length + 1}`;
    out.push({ p: chapter.p, title });
  }
  return out.sort((a, b) => a.p - b.p);
}

export function evenChapters(total: number, target = 1): EpubPart[] {
  const count = Math.max(0, Math.floor(total));
  if (!count) return [];
  const size = Math.max(1, Math.floor(target));
  const out: EpubPart[] = [];
  for (let start = 0; start < count; start += size) {
    out.push({ start, count: Math.min(size, count - start), title: `Part ${out.length + 1}` });
  }
  return out;
}

export function epubHash(bytes: Uint8Array): string {
  // Two independent 32-bit rolling hashes; stable across runtimes and all bytes.
  let a = 0x811c9dc5;
  let b = 0x9e3779b9;
  for (const byte of bytes) {
    a = Math.imul(a ^ byte, 0x01000193) >>> 0;
    b = (Math.imul(b ^ byte, 0x85ebca6b) + 0xc2b2ae35) >>> 0;
  }
  return a.toString(16).padStart(8, "0") + b.toString(16).padStart(8, "0");
}

export function epubFlattenToc(entries: readonly EpubTocEntry[]): EpubTocEntry[] {
  const out: EpubTocEntry[] = [];
  const walk = (items: readonly EpubTocEntry[]) => {
    for (const item of items) {
      out.push({ href: String(item.href ?? ""), label: normalize(item.label) });
      if (Array.isArray(item.subitems)) walk(item.subitems);
    }
  };
  walk(entries);
  return out;
}

export function epubResolveRel(base: string, href: string): string {
  if (/^[a-z][a-z\d+.-]*:/i.test(href) || href.startsWith("//")) return href;
  const path = (base ? base.replace(/\\/g, "/").replace(/\/$/, "") + "/" : "") + href;
  const stack: string[] = [];
  for (const part of path.split("/")) {
    if (!part || part === ".") continue;
    if (part === "..") stack.pop();
    else stack.push(part);
  }
  return stack.join("/");
}

export function epubHrefKey(href: string): string {
  const clean = href.split("#", 1)[0].split("?", 1)[0];
  try { return decodeURIComponent(clean); } catch { return clean; }
}

export function epubSpineIndexFor(href: string, tocDir: string, urls: readonly string[]): number {
  const target = epubHrefKey(epubResolveRel(tocDir, href));
  let index = urls.findIndex((url) => epubHrefKey(url) === target);
  if (index >= 0) return index;
  const filename = target.split("/").pop();
  if (!filename) return -1;
  index = urls.findIndex((url) => epubHrefKey(url).split("/").pop() === filename);
  return index;
}

export function epubInlineText(node: Node): string {
  return normalize(node.textContent ?? "");
}

export function epubHasBlockChild(element: Element): boolean {
  return !!element.querySelector("p,h1,h2,h3,h4,h5,h6,div,section,article,blockquote,ul,ol,table");
}

export function epubBlocksFromRoot(doc: Document | null, clean: (value: unknown) => string = normalize): EpubBlock[] | null {
  if (!doc?.documentElement || doc.querySelector("parsererror")) return null;
  // EPUB chapter documents are XHTML/XML, not HTML documents. In XML mode
  // document.body and getElementsByTagName("body") are not consistently set;
  // resolve the body by local name so the XHTML namespace is handled too.
  const body = doc.body
    ?? doc.getElementsByTagName("body")[0]
    ?? doc.getElementsByTagNameNS("*", "body")[0]
    ?? (doc.documentElement.localName.toLowerCase() === "body" ? doc.documentElement : null);
  if (!body) return null;
  const out: EpubBlock[] = [];
  const ignored = new Set(["SCRIPT", "STYLE", "SVG", "NAV", "NOSCRIPT"]);
  const blockTags = new Set(["P", "H1", "H2", "H3", "H4", "H5", "H6", "LI", "TD", "TH", "BLOCKQUOTE", "PRE"]);
  const visit = (node: Node): void => {
    if (node.nodeType !== 1) return;
    const element = node as Element;
    if (ignored.has(element.tagName)) return;
    if (blockTags.has(element.tagName)) {
      const nestedLists = Array.from(element.children).filter(
        (child) => child.tagName === "UL" || child.tagName === "OL",
      );
      const clone = element.cloneNode(true) as Element;
      clone.querySelectorAll("ul,ol").forEach((list) => list.remove());
      const text = clean(clone.textContent);
      if (text) out.push({ t: /^H[1-6]$/.test(element.tagName) ? "h" : "p", text, ...(element.id ? { id: element.id } : {}) });
      // Nested list items are separate reading blocks, not duplicated in their parent.
      for (const child of nestedLists) visit(child);
      return;
    }
    for (const child of Array.from(element.children)) visit(child);
  };
  visit(body);
  return out;
}

export function epubLongPieces(value: string, maxLength: number): string[] {
  const text = normalize(value);
  const limit = Math.max(1, Math.floor(maxLength));
  if (text.length <= limit) return text ? [text] : [];
  const words = text.split(" ");
  const pieces: string[] = [];
  let current = "";
  for (const word of words) {
    if (word.length > limit) {
      if (current) { pieces.push(current); current = ""; }
      for (let i = 0; i < word.length; i += limit) pieces.push(word.slice(i, i + limit));
      continue;
    }
    const candidate = current ? current + " " + word : word;
    if (candidate.length > limit) { pieces.push(current); current = word; }
    else current = candidate;
  }
  if (current) pieces.push(current);
  return pieces;
}

export function epubExpandBlocks(blocks: readonly EpubBlock[], maxLength: number): EpubBlock[] {
  const out: EpubBlock[] = [];
  for (const block of blocks) {
    if (block.t === "h" || block.text.length <= maxLength) { out.push(block); continue; }
    epubLongPieces(block.text, maxLength).forEach((text, index) => {
      out.push({ t: "p", text, ...(index === 0 && block.id ? { id: block.id } : {}) });
    });
  }
  return out;
}

export function epubPackSections(blocks: readonly EpubBlock[], target: number): EpubSection {
  const sections: EpubBlock[][] = [];
  const secOf: number[] = [];
  let current: EpubBlock[] = [];
  let length = 0;
  for (const block of blocks) {
    current.push(block);
    length += block.text.length;
    if (length >= target) {
      sections.push(current);
      const sectionIndex = sections.length - 1;
      secOf.push(...current.map(() => sectionIndex));
      current = [];
      length = 0;
    }
  }
  if (current.length) {
    sections.push(current);
    secOf.push(...current.map(() => sections.length - 1));
  }
  return { sections, secOf };
}

export function epubChapterList(
  parts: readonly EpubPart[],
  total: number,
  toc: readonly { p: number; title: string }[] = [],
): EpubChapter[] {
  const candidates: EpubChapter[] = [];
  for (const part of parts) candidates.push({ p: part.start, title: part.title });
  const partStarts = new Set(parts.map((part) => part.start));
  for (const item of toc) {
    if (item.p >= 0 && item.p < total && !partStarts.has(item.p)) candidates.push(item);
  }
  return tidyChapters(candidates);
}

export function epubNavDir(path: string): string {
  const clean = path.split(/[?#]/, 1)[0];
  return clean.includes("/") ? clean.slice(0, clean.lastIndexOf("/")) : "";
}

export function epubErr(error: unknown): string {
  if (isEpubFlag(error, "epubInvalid")) return "This is not a valid EPUB file.";
  if (isEpubFlag(error, "epubEmpty")) return "This EPUB contains no readable text.";
  const message = error instanceof Error ? error.message : String(error ?? "");
  if (/file not found in the epub/i.test(message)) return "Some files inside this EPUB are missing.";
  return message;
}

export function epubErrShort(error: unknown): string {
  if (isEpubFlag(error, "epubInvalid")) return "not a valid EPUB";
  if (isEpubFlag(error, "epubEmpty")) return "no readable text";
  return "could not be read";
}

function isEpubFlag(error: unknown, key: string): boolean {
  return typeof error === "object" && error !== null && (error as Record<string, unknown>)[key] === true;
}
