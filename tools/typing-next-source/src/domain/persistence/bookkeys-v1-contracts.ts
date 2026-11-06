/**
 * Type-level mirror of the documented Bookkeys v1 browser persistence formats.
 * No storage reads, writes, migrations or route wiring live in this file.
 */

export type BookkeysFormat = "pdf" | "epub";

export interface BookkeysShelf {
  readonly id: string;
  readonly name: string;
}

export interface BookkeysLibraryMetadata {
  id: string;
  shelf: string;
  name: string;
  size: number;
  pages: number;
  added: number;
  fp: string;
  cover: string;
  author?: string;
  fmt?: "epub";
  opened?: number;
  /** Preserve metadata extensions written by older or future reader versions. */
  [extension: string]: unknown;
}

export interface BookkeysShelf {
  id: string;
  name: string;
}

export interface BookkeysChapter {
  /** Zero-based page or section index. */
  p: number;
  title: string;
  req: boolean;
}

export interface BookkeysChapterRecord {
  v: 3;
  src: "toc" | "bookmarks" | "headings" | "even" | "edited";
  list: BookkeysChapter[];
}

export interface BookkeysTypingDraft {
  v: 1;
  page: number;
  sig: string;
  typed: string;
  ok: number;
  all: number;
  spent: number;
  t: number;
}

export interface BookkeysBookProgress {
  p: number[];
  e: number[];
  c: number[];
  x: number[];
  done: number;
  [extension: string]: unknown;
}

export interface BookkeysGameProgress {
  paid: Record<string, number>;
  check: { key: string; page: number } | null;
  base: number;
  xp: number;
  words: number;
  chars: number;
  pages: number;
  chapters: number;
  books: number;
  streak: { cur: number; best: number; last: string };
  day: { d: string; w: number };
  ach: Record<string, boolean>;
  book: Record<string, BookkeysBookProgress>;
  [extension: string]: unknown;
}

export interface BookkeysBackupV1 {
  app: "bookkeys";
  v: 1;
  exportedAt?: number;
  /** Values are serialized localStorage strings, not parsed application records. */
  keys: Record<string, string>;
}

export const BOOKKEYS_DATABASE = "bookkeys-lib" as const;
export const BOOKKEYS_DATABASE_VERSION = 1 as const;
export const BOOKKEYS_META_STORE = "meta" as const;
export const BOOKKEYS_FILES_STORE = "files" as const;
export const BOOKKEYS_ARTWORK_KEYS = ["art:gothic", "art:garden"] as const;

/** Canonical key constructors. They intentionally retain the existing v1 namespace. */
export const bookPositionKey = (bookKey: string): string => `bookkeys:${bookKey}`;
export const chapterRecordKey = (bookKey: string): string => `bookkeys:chap:${bookKey}`;
export const libraryChapterKey = (libraryId: string): string => `bookkeys:chap:lib:${libraryId}`;
export const typingDraftKey = (bookKey: string, pageIndex: number): string =>
  `bookkeys:draft:${bookKey}:${pageIndex}`;
export const libraryPositionKey = (libraryId: string): string => `bookkeys:lib:${libraryId}`;

/**
 * The legacy backup boundary includes only localStorage keys beginning
 * "bookkeys:". IndexedDB blobs/artwork and the site-wide theme are excluded.
 */
export function isBookkeysBackupKey(key: string): boolean {
  return key.startsWith("bookkeys:");
}

/** Runtime shape guard only; merge semantics remain owned by the legacy reader. */
export function isBookkeysBackupV1(value: unknown): value is BookkeysBackupV1 {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  const candidate = value as Record<string, unknown>;
  if (candidate.app !== "bookkeys" || candidate.v !== 1 ||
      (candidate.exportedAt !== undefined &&
        (typeof candidate.exportedAt !== "number" || !Number.isFinite(candidate.exportedAt))) ||
      typeof candidate.keys !== "object" || candidate.keys === null || Array.isArray(candidate.keys)) {
    return false;
  }
  return Object.entries(candidate.keys as Record<string, unknown>)
    .every(([key, raw]) => isBookkeysBackupKey(key) && typeof raw === "string");
}
