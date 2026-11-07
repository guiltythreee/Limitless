import {
  chapterRecordKey,
  libraryChapterKey,
  type BookkeysChapter,
} from "../persistence/bookkeys-v1-contracts";
import { tidyChapters, withRequirements } from "./bookkeys-chapters";

export interface ChapterStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

/** Read the book-fingerprint record first, then the legacy library-id fallback. */
export function readBookkeysChapterSettings(
  storage: Pick<ChapterStorage, "getItem">,
  bookKey: string,
  libraryId: string,
  defaults: readonly (Omit<BookkeysChapter, "req"> & { readonly req?: boolean })[],
  totalSections: number,
): BookkeysChapter[] {
  for (const key of [chapterRecordKey(bookKey), libraryChapterKey(libraryId)]) {
    try {
      const raw = storage.getItem(key);
      if (!raw) continue;
      const value: unknown = JSON.parse(raw);
      if (typeof value !== "object" || value === null || Array.isArray(value)) continue;
      const record = value as Record<string, unknown>;
      if (record.v !== 3 || !Array.isArray(record.list)) continue;
      return tidyChapters(
        withRequirements(record.list as (Omit<BookkeysChapter, "req"> & { readonly req?: boolean })[]),
        totalSections,
      );
    } catch {
      // A malformed book-specific record may still have a valid library fallback.
    }
  }
  return tidyChapters(withRequirements(defaults), totalSections);
}

/** Keep both v3 lookup paths synchronized for compatibility with old library entries. */
export function writeBookkeysChapterSettings(
  storage: Pick<ChapterStorage, "setItem">,
  bookKey: string,
  libraryId: string,
  chapters: readonly BookkeysChapter[],
): void {
  const serialized = JSON.stringify({ v: 3, src: "edited", list: chapters });
  storage.setItem(chapterRecordKey(bookKey), serialized);
  storage.setItem(libraryChapterKey(libraryId), serialized);
}
