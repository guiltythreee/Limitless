import type { BookkeysChapter } from "../persistence/bookkeys-v1-contracts";
import { normalize } from "../epub/epub-domain";

const OPTIONAL_HEADINGS = [
  "also by", "about the author", "acknowledgements", "acknowledgments",
  "author's note", "author note", "bibliography", "copyright", "contents",
  "dedication", "epigraph", "foreword", "glossary", "index", "introduction",
  "notes", "note on the text", "publication information", "references", "sources",
  "table of contents", "preface", "prologue", "epilogue", "afterword", "appendix",
  "appendices", "translator's note", "editor's note", "colophon", "footnotes", "endnotes",
] as const;

export const SECTION_OPTIONAL: ReadonlySet<string> = new Set(OPTIONAL_HEADINGS);

export function sectionBody(value: unknown): string {
  let text = normalize(value).toLowerCase();
  text = text.replace(/^(?:(?:chapter|chap\.?|part|book)\s+)?(?:\d+|[ivxlcdm]+)[.)\s:-]+/i, "");
  text = text.replace(/^(?:the|a|an)\s+/i, "");
  return normalize(text).toLowerCase();
}

function containsWholePhrase(text: string, phrase: string): boolean {
  const words = text.replace(/[^a-z0-9']+/g, " ").trim().split(/\s+/).filter(Boolean);
  const target = phrase.replace(/[^a-z0-9']+/g, " ").trim().split(/\s+/).filter(Boolean);
  if (!target.length || target.length > words.length) return false;
  for (let index = 0; index <= words.length - target.length; index += 1) {
    if (target.every((word, offset) => words[index + offset] === word)) return true;
  }
  return false;
}

export function sectionRequired(value: unknown): boolean {
  const title = sectionBody(value);
  if (!title) return true;
  return !OPTIONAL_HEADINGS.some((heading) => containsWholePhrase(title, heading));
}

export function defaultReq(chapter: Pick<BookkeysChapter, "p" | "title">): boolean {
  if (chapter.p === 0 && normalize(chapter.title).toLowerCase() === "beginning") return false;
  return sectionRequired(chapter.title);
}

export function withRequirements(
  chapters: readonly (Omit<BookkeysChapter, "req"> & { readonly req?: boolean })[],
): BookkeysChapter[] {
  return chapters.map((chapter) => ({
    p: chapter.p,
    title: normalize(chapter.title) || ("Part " + (chapter.p + 1)),
    req: typeof chapter.req === "boolean" ? chapter.req : defaultReq(chapter),
  }));
}

export function tidyChapters(
  chapters: readonly (Omit<BookkeysChapter, "req"> & { readonly req?: boolean })[],
  total: number,
): BookkeysChapter[] {
  const limit = Math.max(0, Math.floor(total));
  if (!limit) return [];
  const sorted = [...chapters].sort((a, b) => a.p - b.p);
  const out: BookkeysChapter[] = [];
  const seen = new Set<number>();
  for (const chapter of sorted) {
    if (!Number.isInteger(chapter.p) || chapter.p < 0 || chapter.p >= limit || seen.has(chapter.p)) continue;
    seen.add(chapter.p);
    const title = normalize(chapter.title) || ("Part " + (out.length + 1));
    const req = typeof chapter.req === "boolean" ? chapter.req : defaultReq({ p: chapter.p, title });
    out.push({ p: chapter.p, title, req });
  }
  if (!seen.has(0)) out.unshift({ p: 0, title: "Beginning", req: false });
  return out;
}

export function evenChapters(total: number): BookkeysChapter[] {
  const count = Math.max(0, Math.floor(total));
  if (!count) return [];
  if (count < 20) return [{ p: 0, title: "Beginning", req: true }];
  const step = Math.ceil(count / 5);
  return Array.from({ length: 5 }, (_, index) => ({
    p: Math.min(count - 1, index * step),
    title: index === 0 ? "Beginning" : ("Part " + (index + 1)),
    req: true,
  }));
}

export interface RequiredRange {
  readonly start: number;
  readonly end: number;
  readonly title: string;
}

export function requiredRanges(chapters: readonly BookkeysChapter[], total: number): RequiredRange[] {
  const count = Math.max(0, Math.floor(total));
  const ordered = [...chapters].sort((a, b) => a.p - b.p);
  const ranges: RequiredRange[] = [];
  for (let index = 0; index < ordered.length; index += 1) {
    const chapter = ordered[index];
    if (!chapter.req) continue;
    const next = ordered[index + 1];
    const start = Math.max(0, chapter.p);
    const end = Math.min(count - 1, (next?.p ?? count) - 1);
    if (start <= end) ranges.push({ start, end, title: chapter.title });
  }
  return ranges;
}

export function requiredSections(chapters: readonly BookkeysChapter[], total: number): number[] {
  return requiredRanges(chapters, total).flatMap((range) =>
    Array.from({ length: range.end - range.start + 1 }, (_, index) => range.start + index),
  );
}

export function requiredSectionsComplete(
  chapters: readonly BookkeysChapter[],
  total: number,
  typedPages: readonly number[],
  emptyPages: readonly number[] = [],
): boolean {
  const required = requiredSections(chapters, total);
  return required.length > 0 && required.every((page) => typedPages.includes(page) || emptyPages.includes(page));
}
