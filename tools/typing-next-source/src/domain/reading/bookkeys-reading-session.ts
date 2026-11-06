import { epubHash, normalize } from "../epub/epub-domain";
import type { BookkeysChapter } from "../persistence/bookkeys-v1-contracts";
import { requiredSectionsComplete } from "./bookkeys-chapters";

export interface BookkeysGameBook {
  readonly p?: readonly number[];
  readonly x?: readonly number[];
  readonly e?: readonly number[];
  readonly c?: readonly number[];
  readonly done?: number;
  readonly pageLengths?: Readonly<Record<string, number>>;
  readonly [extension: string]: unknown;
}

export interface BookkeysGameState {
  readonly xp?: number;
  readonly words?: number;
  readonly chars?: number;
  readonly pages?: number;
  readonly chapters?: number;
  readonly books?: number;
  readonly paid?: Readonly<Record<string, number>>;
  readonly check?: { key: string; page: number } | null;
  readonly book?: Readonly<Record<string, BookkeysGameBook>>;
  readonly [extension: string]: unknown;
}

export interface PageDraftV1 {
  readonly v: 1;
  readonly page: number;
  readonly sig: string;
  readonly typed: string;
  readonly ok: number;
  readonly all: number;
  readonly spent: number;
  readonly t: number;
}

export interface TypingAccuracy {
  readonly correct: number;
  readonly total: number;
  readonly percent: number;
}

export interface PageCompletion {
  readonly game: BookkeysGameState;
  readonly accuracy: TypingAccuracy;
  readonly xpAwarded: number;
  readonly alreadyCompleted: boolean;
  readonly eligibleForXp: boolean;
}

export function typingAccuracy(target: string, typed: string): TypingAccuracy {
  const total = target.length;
  const length = Math.min(total, typed.length);
  let correct = 0;
  for (let index = 0; index < length; index += 1) {
    if (target[index] === typed[index]) correct += 1;
  }
  const percent = total === 0 ? 100 : Math.floor((correct * 100 + total / 2) / total);
  return { correct, total, percent };
}

export function pageSignature(value: string): string {
  return epubHash(new TextEncoder().encode(normalize(value)));
}

export function createPageDraft(
  page: number,
  target: string,
  typed: string,
  startedAt: number,
  now = Date.now(),
): PageDraftV1 {
  const accuracy = typingAccuracy(target, typed);
  return {
    v: 1,
    page,
    sig: pageSignature(target),
    typed,
    ok: accuracy.correct,
    all: accuracy.total,
    spent: Math.max(0, now - startedAt),
    t: Math.round(now),
  };
}

export function readPageDraft(raw: string | null, page: number, target: string): PageDraftV1 | null {
  if (!raw) return null;
  try {
    const value: unknown = JSON.parse(raw);
    if (typeof value !== "object" || value === null || Array.isArray(value)) return null;
    const draft = value as Record<string, unknown>;
    if (draft.v !== 1 || draft.page !== page || draft.sig !== pageSignature(target) ||
        typeof draft.typed !== "string" || typeof draft.ok !== "number" ||
        typeof draft.all !== "number" || typeof draft.spent !== "number" ||
        typeof draft.t !== "number") return null;
    return draft as unknown as PageDraftV1;
  } catch {
    return null;
  }
}

export function accuracyMultiplier(accuracy: number): number {
  if (accuracy >= 98) return 125;
  if (accuracy >= 95) return 110;
  if (accuracy >= 85) return 100;
  return 80;
}

export function pageXp(characters: number, accuracy: number): number {
  const count = Math.max(0, Math.floor(characters));
  return Math.floor((count * accuracyMultiplier(accuracy) + 50) / 100);
}

export function chapterXp(characters: number): number {
  return Math.min(1500, Math.max(90, Math.floor(Math.max(0, characters) * 1.5)));
}

export function bookXp(characters: number): number {
  return Math.min(25000, Math.max(0, Math.floor(characters) * 70));
}

/** Records one completed page using the legacy Bookkeys game keys and pay-once rule. */
export function completeBookkeysPage(
  previous: BookkeysGameState,
  bookKey: string,
  page: number,
  target: string,
  typed: string,
  elapsedMs: number,
  chapters: readonly BookkeysChapter[] = [],
  totalSections = 0,
  emptyPageIndexes: readonly number[] = [],
): PageCompletion {
  const accuracy = typingAccuracy(target, typed);
  const previousBooks = previous.book && typeof previous.book === "object" ? previous.book : {};
  const previousBook: BookkeysGameBook = previousBooks[bookKey] ?? {};
  const typedPages = new Set(Array.isArray(previousBook.p) ? previousBook.p : []);
  const exactPages = new Set(Array.isArray(previousBook.x) ? previousBook.x : []);
  const emptyPages = new Set(Array.isArray(previousBook.e) ? previousBook.e : []);
  const alreadyCompleted = typedPages.has(page) || emptyPages.has(page);
  if (alreadyCompleted) {
    return { game: previous, accuracy, xpAwarded: 0, alreadyCompleted: true, eligibleForXp: false };
  }

  const isTextPage = target.length > 0;
  const eligibleForXp = isTextPage && elapsedMs >= target.length * 30;
  let earned = eligibleForXp ? pageXp(target.length, accuracy.percent) : 0;
  const paid = { ...(previous.paid ?? {}) };
  if (isTextPage) {
    const rewardId = "p:" + bookKey + ":" + page;
    if (Object.prototype.hasOwnProperty.call(paid, rewardId)) {
      return { game: previous, accuracy, xpAwarded: 0, alreadyCompleted: true, eligibleForXp };
    }
    paid[rewardId] = earned;
    typedPages.add(page);
    if (accuracy.percent === 100) exactPages.add(page);
  } else {
    emptyPages.add(page);
  }

  for (const emptyPage of emptyPageIndexes) {
    if (Number.isInteger(emptyPage) && emptyPage >= 0 && emptyPage < totalSections) emptyPages.add(emptyPage);
  }

  const pageLengths = {
    ...(previousBook.pageLengths ?? {}),
    ...(isTextPage ? { [String(page)]: target.length } : {}),
  };
  const completedChapters = new Set(Array.isArray(previousBook.c) ? previousBook.c : []);
  let chapterCount = 0;
  let bookCount = 0;
  const canCompleteMilestones = eligibleForXp || !isTextPage;

  if (canCompleteMilestones && totalSections > 0 && chapters.length) {
    const ordered = [...chapters].sort((a, b) => a.p - b.p);
    for (let index = 0; index < ordered.length; index += 1) {
      const chapter = ordered[index];
      const nextChapter = ordered[index + 1];
      const startPage = chapter.p;
      const endPage = Math.min(totalSections - 1, (nextChapter?.p ?? totalSections) - 1);
      if (startPage > endPage || completedChapters.has(startPage)) continue;
      let complete = true;
      let characters = 0;
      for (let section = startPage; section <= endPage; section += 1) {
        if (!typedPages.has(section) && !emptyPages.has(section)) { complete = false; break; }
        characters += Number(pageLengths[String(section)] ?? 0);
      }
      if (!complete || characters <= 0) continue;
      const chapterRewardId = "c:" + bookKey + ":" + startPage;
      if (!Object.prototype.hasOwnProperty.call(paid, chapterRewardId)) {
        const bonus = chapterXp(characters);
        paid[chapterRewardId] = bonus;
        earned += bonus;
        chapterCount += 1;
      }
      completedChapters.add(startPage);
    }

    if (requiredSectionsComplete(chapters, totalSections, [...typedPages], [...emptyPages])) {
      const bookRewardId = "b:" + bookKey;
      if (!Object.prototype.hasOwnProperty.call(paid, bookRewardId)) {
        const characters = Object.values(pageLengths).reduce((sum, value) => sum + Number(value || 0), 0);
        if (characters > 0) {
          const bonus = bookXp(characters);
          paid[bookRewardId] = bonus;
          earned += bonus;
          bookCount = 1;
        }
      }
    }
  }

  const isBookDone = chapters.length > 0 &&
    totalSections > 0 &&
    requiredSectionsComplete(chapters, totalSections, [...typedPages], [...emptyPages]);
  const book = {
    ...previousBook,
    p: [...typedPages].sort((a, b) => a - b),
    x: [...exactPages].sort((a, b) => a - b),
    e: [...emptyPages].sort((a, b) => a - b),
    c: [...completedChapters].sort((a, b) => a - b),
    done: isBookDone ? 1 : Number(previousBook.done ?? 0),
    pageLengths,
  };
  const next: BookkeysGameState = {
    ...previous,
    xp: Math.max(0, Number(previous.xp ?? 0)) + earned,
    chars: Math.max(0, Number(previous.chars ?? 0)) + (isTextPage ? target.length : 0),
    words: Math.max(0, Number(previous.words ?? 0)) + (isTextPage ? normalize(target).split(" ").filter(Boolean).length : 0),
    pages: Math.max(0, Number(previous.pages ?? 0)) + (isTextPage ? 1 : 0),
    chapters: Math.max(0, Number(previous.chapters ?? 0)) + chapterCount,
    books: Math.max(0, Number(previous.books ?? 0)) + bookCount,
    paid,
    check: { key: bookKey, page },
    book: { ...previousBooks, [bookKey]: book },
  };
  return { game: next, accuracy, xpAwarded: earned, alreadyCompleted: false, eligibleForXp };
}

export function emptyBookkeysGame(): BookkeysGameState {
  return {
    paid: {},
    check: null,
    base: 0,
    xp: 0,
    words: 0,
    chars: 0,
    pages: 0,
    chapters: 0,
    books: 0,
    streak: { cur: 0, best: 0, last: "" },
    day: { d: "", w: 0 },
    ach: {},
    book: {},
  };
}
