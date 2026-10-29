/**
 * Bookkeys shell bridge. Observe the existing progress key from the same-origin
 * iframe rather than rewriting its very large, embedded PDF/EPUB application.
 *
 * A fresh page award requires a newly added page plus Bookkeys' transient
 * G.check marker. Chapter/book milestones require that the matching live check
 * is cleared in a later successful progress save. Legacy backup imports do not
 * alter G.check and therefore are not mistaken for fresh typing.
 */
import { createBookkeysRewardAdapter } from "./bookkeys-rewards.mjs";

const STORAGE_KEY = "bookkeys:game";

function parseGame(raw) {
  if (typeof raw !== "string") return {};
  try {
    const value = JSON.parse(raw);
    return value && typeof value === "object" && !Array.isArray(value) ? value : {};
  } catch {
    return {};
  }
}
function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function sameCheck(a, b) {
  return !!a && !!b && typeof a.key === "string" && typeof b.key === "string" &&
    a.key === b.key && Number.isInteger(a.page) && a.page === b.page;
}
function pageSet(book, field) {
  return new Set(Array.isArray(book?.[field]) ? book[field].filter(Number.isInteger) : []);
}

function renderedPageEvidence(target, check, override) {
  try {
    if (typeof override === "function") return override(check);
    const frame = target?.document?.querySelector?.(".shell-main iframe");
    const frameDocument = frame?.contentDocument;
    if (!frameDocument) return null;
    const pageInput = frameDocument.getElementById("pageNum");
    const displayedPage = pageInput ? Number.parseInt(pageInput.value, 10) - 1 : NaN;
    if (!Number.isFinite(displayedPage) || displayedPage !== check.page) return null;
    const characters = frameDocument.querySelectorAll("#bookText span.c");
    if (!characters || !characters.length) return null;
    let raw = "";
    for (const character of characters) raw += character.textContent || "";
    const normalized = raw.replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim().toLowerCase();
    if (normalized.length < 150) return null;
    // Store only a stable content signature, never the user's book text.
    let h1 = 2166136261, h2 = 5381;
    for (let i = 0; i < normalized.length; i++) {
      const code = normalized.charCodeAt(i);
      h1 = Math.imul(h1 ^ code, 16777619) >>> 0;
      h2 = (Math.imul(h2, 33) ^ code) >>> 0;
    }
    const hex = (value) => ("00000000" + value.toString(16)).slice(-8);
    return { contentSignature: hex(h1) + hex(h2), characterCount: normalized.length };
  } catch {
    return null;
  }
}

export function installBookkeysRewardBridge(target, adapter, options = {}) {
  if (!target || typeof target.addEventListener !== "function" ||
      typeof target.removeEventListener !== "function" ||
      !adapter || typeof adapter.award !== "function") {
    throw new TypeError("Bookkeys bridge requires an event target and a reward adapter");
  }
  const clock = typeof options.now === "function" ? options.now : () => Date.now();
  const verifiedChecks = new Map();
  let pending = [];

  function submit(activity) {
    let record = null;
    try { record = adapter.award(activity); } catch {}
    if (!record) pending.push(activity);
  }
  function flushPending() {
    if (!pending.length) return;
    const retry = [];
    for (const activity of pending) {
      let record = null;
      try { record = adapter.award(activity); } catch {}
      if (!record) retry.push(activity);
    }
    pending = retry;
  }
  function awardFreshPage(previous, next, ts) {
    const check = next.check;
    if (!check || typeof check.key !== "string" ||
        !Number.isInteger(check.page) || check.page < 0) return;
    if (sameCheck(previous.check, check)) return;

    const nextBook = isRecord(next.book) ? next.book[check.key] : null;
    const previousBook = isRecord(previous.book) ? previous.book[check.key] : null;
    if (!pageSet(nextBook, "p").has(check.page) || pageSet(previousBook, "p").has(check.page)) return;

    const evidence = renderedPageEvidence(target, check, options.getPageEvidence);
    // No visible page or a short passage is not enough evidence for a global
    // reward. Bookkeys' own progress remains untouched.
    if (!evidence) return;
    const checkKey = JSON.stringify([check.key, check.page]);
    verifiedChecks.set(checkKey, { bookKey: check.key, page: check.page, expiresAt: ts + 60_000 });
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
  function awardNewMilestones(previous, next, ts) {
    const oldCheck = previous.check;
    if (!oldCheck || typeof oldCheck.key !== "string" || !Number.isInteger(oldCheck.page)) return;
    if (sameCheck(oldCheck, next.check)) return;

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
  function onStorage(event) {
    if (event.key !== STORAGE_KEY || !event.newValue) return;
    const previous = parseGame(event.oldValue);
    const next = parseGame(event.newValue);
    const ts = Math.round(clock());
    awardFreshPage(previous, next, ts);
    awardNewMilestones(previous, next, ts);
    flushPending();
    for (const [key, value] of verifiedChecks) if (value.expiresAt < ts) verifiedChecks.delete(key);
  }
  target.addEventListener("storage", onStorage);
  return () => target.removeEventListener("storage", onStorage);
}

if (typeof window !== "undefined") {
  try {
    const adapter = window.LimitlessBookkeysRewards || createBookkeysRewardAdapter(window.localStorage);
    installBookkeysRewardBridge(window, adapter);
  } catch {
    // Bookkeys must remain usable even if browser storage is unavailable.
  }
}
