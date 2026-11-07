import { epubHash, normalize } from "../epub/epub-domain";
import type { BookkeysChapter } from "../persistence/bookkeys-v1-contracts";
import { requiredSectionsComplete } from "./bookkeys-chapters";
import { BOOKKEYS_ACHIEVEMENTS, bookkeysAchievementValue } from "./bookkeys-achievements";

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
  readonly bestWpm?: number; readonly bestPct?: number; readonly perfect?: number; readonly run?: number; readonly bestRun?: number;
  readonly days?: number; readonly bestDay?: number; readonly night?: number; readonly early?: number;
  readonly beat5?: number; readonly up20?: number; readonly pro60?: number; readonly vir80?: number; readonly recs?: number; readonly hund?: number;
  readonly bigBook?: number; readonly flawlessCh?: number;
  readonly sessMax?: number;
  readonly base?: { readonly n: number; readonly sum: number };
  readonly streak?: { readonly cur: number; readonly best: number; readonly last: string };
  readonly day?: { readonly d: string; readonly w: number };
  readonly session?: { readonly n: number; readonly t: number };
  readonly ach?: Readonly<Record<string, number | false | null>>;
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
  now = Date.now(),
): PageCompletion {
  const accuracy = typingAccuracy(target, typed);
  const exact = typed === target;
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
    if (eligibleForXp && exact) exactPages.add(page);
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
  let flawlessChapter = false;
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
      if ([...typedPages].filter((section) => section >= startPage && section <= endPage).every((section) => exactPages.has(section))) flawlessChapter = true;
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
  const correctChars = accuracy.correct;
  const words = Math.max(0, Math.round(correctChars / 5));
  const date = new Date(now);
  const today = date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0") + "-" + String(date.getDate()).padStart(2, "0");
  const yesterdayDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1);
  const yesterday = yesterdayDate.getFullYear() + "-" + String(yesterdayDate.getMonth() + 1).padStart(2, "0") + "-" + String(yesterdayDate.getDate()).padStart(2, "0");
  const priorStreak = previous.streak ?? { cur: 0, best: 0, last: "" };
  const streakCount = priorStreak.last === today ? priorStreak.cur : priorStreak.last === yesterday ? priorStreak.cur + 1 : 1;
  const streak = { cur: streakCount, best: Math.max(priorStreak.best, streakCount), last: today };
  const priorDay = previous.day ?? { d: "", w: 0 };
  const day = { d: today, w: (priorDay.d === today ? priorDay.w : 0) + words };
  const priorSession = previous.session ?? { n: 0, t: 0 };
  const sessionCount = now - priorSession.t > 30 * 60 * 1000 ? 1 : priorSession.n + 1;
  const session = { n: sessionCount, t: now };
  const priorBase = previous.base ?? { n: 0, sum: 0 };
  const wpm = elapsedMs > 0 ? Math.min(999, Math.round((correctChars / 5) / (elapsedMs / 60000))) : 0;
  const hasSpeedSample = eligibleForXp && target.length >= 200;
  const priorBestWpm = Number(previous.bestWpm ?? 0);
  const priorBestPct = Number(previous.bestPct ?? 0);
  const stats: Partial<BookkeysGameState> = eligibleForXp ? {
    streak,
    days: Number(previous.days ?? 0) + (priorStreak.last === today ? 0 : 1),
    day,
    bestDay: Math.max(Number(previous.bestDay ?? 0), day.w),
    session,
    sessMax: Math.max(Number(previous.sessMax ?? 0), sessionCount),
    perfect: Number(previous.perfect ?? 0) + (exact && target.length >= 250 ? 1 : 0),
    run: accuracy.percent >= 98 ? Number(previous.run ?? 0) + 1 : 0,
    bestRun: Math.max(Number(previous.bestRun ?? 0), accuracy.percent >= 98 ? Number(previous.run ?? 0) + 1 : 0),
    night: Number(previous.night ?? 0) + (date.getHours() < 5 ? 1 : 0),
    early: Number(previous.early ?? 0) + (date.getHours() >= 5 && date.getHours() < 8 ? 1 : 0),
    ...(hasSpeedSample ? {
      bestWpm: Math.max(priorBestWpm, wpm),
      bestPct: Math.max(priorBestPct, accuracy.percent),
      beat5: Number(previous.beat5 ?? 0) || (priorBestWpm > 0 && wpm >= priorBestWpm + 5 ? 1 : 0),
      up20: Number(previous.up20 ?? 0) || (priorBase.n >= 5 && wpm >= priorBase.sum / priorBase.n + 20 ? 1 : 0),
      pro60: Number(previous.pro60 ?? 0) || (accuracy.percent >= 98 && wpm >= 60 ? 1 : 0),
      vir80: Number(previous.vir80 ?? 0) || (exact && wpm >= 80 ? 1 : 0),
      hund: Number(previous.hund ?? 0) || (exact && wpm >= 100 ? 1 : 0),
      recs: Number(previous.recs ?? 0) || (priorBestWpm > 0 && priorBestPct > 0 && wpm > priorBestWpm && accuracy.percent > priorBestPct ? 1 : 0),
      base: priorBase.n < 5 ? { n: priorBase.n + 1, sum: priorBase.sum + wpm } : priorBase,
    } : {}),
  } : {};
  const next: BookkeysGameState = {
    ...previous, ...stats,
    xp: Math.max(0, Number(previous.xp ?? 0)) + earned,
    chars: Math.max(0, Number(previous.chars ?? 0)) + (eligibleForXp ? correctChars : 0),
    words: Math.max(0, Number(previous.words ?? 0)) + (eligibleForXp ? words : 0),
    pages: Math.max(0, Number(previous.pages ?? 0)) + (eligibleForXp ? 1 : 0),
    chapters: Math.max(0, Number(previous.chapters ?? 0)) + chapterCount,
    books: Math.max(0, Number(previous.books ?? 0)) + bookCount,
    flawlessCh: Number(previous.flawlessCh ?? 0) || (flawlessChapter ? 1 : 0),
    bigBook: Number(previous.bigBook ?? 0) || (bookCount > 0 && totalSections >= 100 ? 1 : 0),
    paid, check: { key: bookKey, page }, book: { ...previousBooks, [bookKey]: book },
  };
  const achievements = { ...(previous.ach ?? {}) };
  if (eligibleForXp) for (const achievement of BOOKKEYS_ACHIEVEMENTS) {
    const previousValue = bookkeysAchievementValue(previous as Readonly<Record<string, unknown>>, achievement.metric);
    const nextValue = bookkeysAchievementValue(next as Readonly<Record<string, unknown>>, achievement.metric);
    const isLocked = achievements[achievement.id] === undefined || achievements[achievement.id] === null || achievements[achievement.id] === false;
    if (isLocked && previousValue < achievement.target && nextValue >= achievement.target) {
      achievements[achievement.id] = now;
    }
  }
  return { game: { ...next, ach: achievements }, accuracy, xpAwarded: earned, alreadyCompleted: false, eligibleForXp };;
}

export function emptyBookkeysGame(): BookkeysGameState {
  return {
    paid: {},
    check: null,
    xp: 0,
    words: 0,
    chars: 0,
    pages: 0,
    chapters: 0,
    books: 0,
    bestWpm: 0, bestPct: 0, perfect: 0, run: 0, bestRun: 0, days: 0, bestDay: 0, night: 0, early: 0,
    beat5: 0, up20: 0, pro60: 0, vir80: 0, recs: 0, hund: 0, bigBook: 0, flawlessCh: 0, sessMax: 0,
    base: { n: 0, sum: 0 }, session: { n: 0, t: 0 },
    streak: { cur: 0, best: 0, last: "" },
    day: { d: "", w: 0 },
    ach: {},
    book: {},
  };
}
