import {
  bookPositionKey,
  libraryPositionKey,
} from "../persistence/bookkeys-v1-contracts";

export interface PositionStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

function parsePosition(raw: string | null): number | null {
  if (raw === null || raw.trim() === "") return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    const value = typeof parsed === "number" ? parsed
      : typeof parsed === "string" ? Number(parsed)
      : NaN;
    return Number.isSafeInteger(value) && value >= 0 ? value : null;
  } catch {
    const value = Number(raw);
    return Number.isSafeInteger(value) && value >= 0 ? value : null;
  }
}

/** Reads the per-book position first, then the legacy library-id fallback. */
export function readBookkeysPosition(
  storage: Pick<PositionStorage, "getItem">,
  bookKey: string,
  libraryId: string,
  sectionCount: number,
): number {
  if (!Number.isSafeInteger(sectionCount) || sectionCount <= 0) return 0;
  const byBook = parsePosition(storage.getItem(bookPositionKey(bookKey)));
  const byLibrary = parsePosition(storage.getItem(libraryPositionKey(libraryId)));
  const requested = byBook ?? byLibrary ?? 0;
  return Math.min(sectionCount - 1, requested);
}

/** Keeps both original v1 position keys synchronized for old and new readers. */
export function writeBookkeysPosition(
  storage: Pick<PositionStorage, "setItem">,
  bookKey: string,
  libraryId: string,
  pageIndex: number,
): void {
  if (!Number.isSafeInteger(pageIndex) || pageIndex < 0) {
    throw new RangeError("Bookkeys page position must be a non-negative integer");
  }
  const value = JSON.stringify(pageIndex);
  storage.setItem(bookPositionKey(bookKey), value);
  storage.setItem(libraryPositionKey(libraryId), value);
}
