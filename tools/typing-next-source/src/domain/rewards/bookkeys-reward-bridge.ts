/**
 * TypeScript port of the Bookkeys shell reward bridge.
 *
 * It observes the existing game-progress storage event. It never reads or
 * converts legacy XP totals; only a fresh page completion with visible-page
 * evidence, followed by a verified milestone save, can create LSR-1 activity.
 */

import type { BookkeysRewardAdapterOptions, RewardActivity } from "../rewards/bookkeys-reward-adapter";

const STORAGE_KEY = "bookkeys:game";

interface GameCheck {
  readonly key: string;
  readonly page: number;
}

interface GameBook {
  readonly p?: unknown;
  readonly x?: unknown;
}

interface GameState {
  readonly check?: unknown;
  readonly book?: unknown;
  readonly paid?: unknown;
}

export interface BookkeysPageEvidence {
  readonly contentSignature: string;
  readonly characterCount: number;
}

export interface BookkeysRewardBridgeAdapter {
  award(activity: RewardActivity): unknown;
}

export interface BookkeysRewardBridgeTarget extends EventTarget {
  readonly document?: Document;
}

export interface BookkeysRewardBridgeOptions extends BookkeysRewardAdapterOptions {
  readonly getPageEvidence?: (check: GameCheck) => BookkeysPageEvidence | null;
}

interface StorageChange {
  readonly key: string | null;
  readonly oldValue: string | null;
  readonly newValue: string | null;
}

interface VerifiedCheck {
  readonly bookKey: string;
  readonly page: number;
  readonly expiresAt: number;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseGame(raw: string | null): GameState {
  if (typeof raw !== "string") return {};
  try {
    const value: unknown = JSON.parse(raw);
    return isRecord(value) ? value as GameState : {};
  } catch {
    return {};
  }
}

function readCheck(value: unknown): GameCheck | null {
  if (!isRecord(value) || typeof value.key !== "string" ||
      !Number.isInteger(value.page) || (value.page as number) < 0) return null;
  return { key: value.key, page: value.page as number };
}

function sameCheck(a: GameCheck | null, b: GameCheck | null): boolean {
  return !!a && !!b && a.key === b.key && a.page === b.page;
}

function pageSet(book: unknown, field: "p" | "x"): Set<number> {
  if (!isRecord(book) || !Array.isArray(book[field])) return new Set();
  return new Set((book[field] as unknown[]).filter(
    (value): value is number => Number.isInteger(value),
  ));
}

/** Stable, privacy-preserving page fingerprint compatible with the legacy shell bridge. */
export function bookkeysPageEvidenceFromText(value: string): BookkeysPageEvidence | null {
  const normalized = String(value ?? "")
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
  if (normalized.length < 150) return null;
  let h1 = 2166136261;
  let h2 = 5381;
  for (let index = 0; index < normalized.length; index += 1) {
    const code = normalized.charCodeAt(index);
    h1 = Math.imul(h1 ^ code, 16777619) >>> 0;
    h2 = (Math.imul(h2, 33) ^ code) >>> 0;
  }
  const hex = (hash: number) => ("00000000" + hash.toString(16)).slice(-8);
  return { contentSignature: hex(h1) + hex(h2), characterCount: normalized.length };
}

function renderedPageEvidence(
  target: BookkeysRewardBridgeTarget,
  check: GameCheck,
  override?: (check: GameCheck) => BookkeysPageEvidence | null,
): BookkeysPageEvidence | null {
  try {
    if (typeof override === "function") return override(check);
    const frame = target.document?.querySelector<HTMLIFrameElement>(".shell-main iframe");
    const frameDocument = frame?.contentDocument;
    if (!frameDocument) return null;
    const pageInput = frameDocument.getElementById("pageNum") as HTMLInputElement | null;
    const displayedPage = pageInput ? Number.parseInt(pageInput.value, 10) - 1 : NaN;
    if (!Number.isFinite(displayedPage) || displayedPage !== check.page) return null;
    const characters = frameDocument.querySelectorAll("#bookText span.c");
    if (!characters.length) return null;
    let raw = "";
    for (const character of characters) raw += character.textContent || "";
    return bookkeysPageEvidenceFromText(raw);
  } catch {
    return null;
  }
}

export function installBookkeysRewardBridge(
  target: BookkeysRewardBridgeTarget,
  adapter: BookkeysRewardBridgeAdapter,
  options: BookkeysRewardBridgeOptions = {},
): () => void {
  if (!target || typeof target.addEventListener !== "function" ||
      typeof target.removeEventListener !== "function" ||
      !adapter || typeof adapter.award !== "function") {
    throw new TypeError("Bookkeys bridge requires an event target and a reward adapter");
  }

  const clock = typeof options.now === "function" ? options.now : () => Date.now();
  const verifiedChecks = new Map<string, VerifiedCheck>();
  let pending: RewardActivity[] = [];

  function submit(activity: RewardActivity): void {
    let record: unknown = null;
    try { record = adapter.award(activity); } catch { /* retry after the next save */ }
    if (!record) pending.push(activity);
  }

  function flushPending(): void {
    if (!pending.length) return;
    const retry: RewardActivity[] = [];
    for (const activity of pending) {
      let record: unknown = null;
      try { record = adapter.award(activity); } catch { /* retain for retry */ }
      if (!record) retry.push(activity);
    }
    pending = retry;
  }

  function awardFreshPage(previous: GameState, next: GameState, ts: number): void {
    const check = readCheck(next.check);
    if (!check || sameCheck(readCheck(previous.check), check)) return;
    const nextBook = isRecord(next.book) ? next.book[check.key] : null;
    const previousBook = isRecord(previous.book) ? previous.book[check.key] : null;
    if (!pageSet(nextBook, "p").has(check.page) || pageSet(previousBook, "p").has(check.page)) return;
    const evidence = renderedPageEvidence(target, check, options.getPageEvidence);
    if (!evidence) return;

    const checkKey = JSON.stringify([check.key, check.page]);
    verifiedChecks.set(checkKey, {
      bookKey: check.key,
      page: check.page,
      expiresAt: ts + 60_000,
    });
    const exact = pageSet(nextBook, "x").has(check.page);
    submit({
      eventId: "bookkeys:page:" + check.key + ":" + check.page,
      moduleId: "bookkeys",
      itemId: "bookkeys:page:" + evidence.contentSignature,
      ts,
      activityClass: "micro-practice",
      difficulty: "foundational",
      completionEvidence: "finished-book-page",
      completed: true,
      quality: exact ? 1 : 0.7,
      contentSignature: evidence.contentSignature,
      characterCount: evidence.characterCount,
    });
  }

  function awardNewMilestones(previous: GameState, next: GameState, ts: number): void {
    const oldCheck = readCheck(previous.check);
    if (!oldCheck || sameCheck(oldCheck, readCheck(next.check))) return;
    const checkKey = JSON.stringify([oldCheck.key, oldCheck.page]);
    const verified = verifiedChecks.get(checkKey);
    if (!verified || verified.expiresAt < ts) return;

    const oldPaid = isRecord(previous.paid) ? previous.paid : {};
    const newPaid = isRecord(next.paid) ? next.paid : {};
    const bookKey = verified.bookKey;
    const book = isRecord(next.book) ? next.book[bookKey] : null;
    const pages = pageSet(book, "p");
    const exact = pageSet(book, "x");
    const allTypedPagesExact = pages.size > 0 && [...pages].every((page) => exact.has(page));

    for (const [paidId, legacyXp] of Object.entries(newPaid)) {
      if (Object.prototype.hasOwnProperty.call(oldPaid, paidId)) continue;
      if (typeof legacyXp !== "number" || !Number.isFinite(legacyXp) || legacyXp < 0) continue;
      if (paidId.startsWith("c:" + bookKey + ":")) {
        submit({
          eventId: "bookkeys:milestone:" + paidId,
          moduleId: "bookkeys",
          itemId: "bookkeys:chapter:" + paidId,
          ts,
          activityClass: "unit-milestone",
          difficulty: "intermediate",
          completionEvidence: "completed-book-chapter",
          completed: true,
          quality: 0.7,
        });
      } else if (paidId === "b:" + bookKey) {
        submit({
          eventId: "bookkeys:milestone:" + paidId,
          moduleId: "bookkeys",
          itemId: "bookkeys:book:" + paidId,
          ts,
          activityClass: "major-completion",
          difficulty: "advanced",
          completionEvidence: "completed-required-book-sections",
          completed: true,
          quality: allTypedPagesExact ? 1 : 0.7,
          passed: true,
          checkpointId: "bookkeys:book-completion:" + bookKey,
        });
      }
    }
    verifiedChecks.delete(checkKey);
  }

  const onStorage = (event: Event): void => {
    const change = event as StorageEvent;
    if (change.key !== STORAGE_KEY || !change.newValue) return;
    const previous = parseGame(change.oldValue);
    const next = parseGame(change.newValue);
    const ts = Math.round(clock());
    awardFreshPage(previous, next, ts);
    awardNewMilestones(previous, next, ts);
    flushPending();
    for (const [key, value] of verifiedChecks) {
      if (value.expiresAt < ts) verifiedChecks.delete(key);
    }
  };

  target.addEventListener("storage", onStorage);
  return () => target.removeEventListener("storage", onStorage);
}
