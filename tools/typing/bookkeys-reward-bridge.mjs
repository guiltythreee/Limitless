/**
 * Bookkeys shell bridge. The Bookkeys app itself is a very large offline-first
 * single HTML file, so this small same-origin shell observer watches its
 * existing storage events rather than rewriting the embedded PDF/EPUB app.
 *
 * A page award is accepted only when a saved progress transition adds a page
 * and carries Bookkeys' transient G.check marker. Chapter/book milestones are
 * accepted only when the matching live check is cleared in a progress save.
 * This prevents a backup import or an old record already present at startup
 * from being mistaken for fresh typing.
 */
import { createBookkeysRewardAdapter } from "./bookkeys-rewards.mjs";

const STORAGE_KEY = "bookkeys:game";
const adapter = window.LimitlessBookkeysRewards ||
  createBookkeysRewardAdapter(window.localStorage);
const verifiedChecks = new Map();

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

function awardFreshPage(previous, next, ts) {
  const check = next.check;
  if (!check || typeof check.key !== "string" || !Number.isInteger(check.page) || check.page < 0) return;
  if (sameCheck(previous.check, check)) return;

  const nextBook = isRecord(next.book) ? next.book[check.key] : null;
  const previousBook = isRecord(previous.book) ? previous.book[check.key] : null;
  const pages = pageSet(nextBook, "p");
  if (!pages.has(check.page) || pageSet(previousBook, "p").has(check.page)) return;

  const checkKey = JSON.stringify([check.key, check.page]);
  verifiedChecks.set(checkKey, { bookKey: check.key, page: check.page, expiresAt: ts + 60_000 });
  const exact = pageSet(nextBook, "x").has(check.page);
  adapter.award({
    eventId: "bookkeys:page:" + check.key + ":" + check.page,
    moduleId: "bookkeys",
    itemId: "bookkeys:page:" + check.key + ":" + check.page,
    ts,
    activityClass: "micro-practice",
    difficulty: "foundational",
    completionEvidence: "finished-book-page",
    completed: true,
    quality: exact ? 1 : 0.7,
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
      adapter.award({
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
      adapter.award({
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

window.addEventListener("storage", (event) => {
  if (event.key !== STORAGE_KEY || !event.newValue) return;
  const previous = parseGame(event.oldValue);
  const next = parseGame(event.newValue);
  const ts = Date.now();

  // The order matters: a fresh-page event establishes the check before any
  // later save clears that check and records its chapter/book milestones.
  awardFreshPage(previous, next, ts);
  awardNewMilestones(previous, next, ts);

  for (const [key, value] of verifiedChecks) {
    if (value.expiresAt < ts) verifiedChecks.delete(key);
  }
});
