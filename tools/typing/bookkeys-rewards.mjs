/**
 * Bookkeys → Limitless Standard Rewards (LSR-1) adapter.
 *
 * Only fresh, verified page/chapter/book completion events from Bookkeys call
 * this adapter. Existing bookkeys:game XP and paid IDs are never imported or
 * converted; the LSR-1 ledger is a separate localStorage root.
 */
import {
  buildRewardRecords,
  sanitiseRewardRecords,
  dispatchRewardUpdate,
} from "../../shared/rewards.mjs";

export const BOOKKEYS_REWARD_STORAGE_KEY = "bookkeys-lsr1-v1";
export const BOOKKEYS_REWARD_MODULE_ID = "bookkeys";

const isObject = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
const isString = (value) => typeof value === "string" && value.trim().length > 0;
const isFiniteNumber = (value) => typeof value === "number" && Number.isFinite(value);
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const ACTIVITY_RULES = Object.freeze({
  "finished-book-page": { activityClass: "micro-practice", difficulty: "foundational", prefix: "bookkeys:page:" },
  "completed-book-chapter": { activityClass: "unit-milestone", difficulty: "intermediate", prefix: "bookkeys:chapter:" },
  "completed-required-book-sections": { activityClass: "major-completion", difficulty: "advanced", prefix: "bookkeys:book:" },
});

/**
 * Storage is injectable for unit tests. award() is deliberately synchronous so
 * Bookkeys can queue activities after its own progress save has succeeded.
 */
export function createBookkeysRewardAdapter(storage, options = {}) {
  if (!storage || typeof storage.getItem !== "function" || typeof storage.setItem !== "function") {
    throw new TypeError("Bookkeys rewards require getItem/setItem storage");
  }
  const now = typeof options.now === "function" ? options.now : () => Date.now();

  function loadState() {
    try {
      const raw = storage.getItem(BOOKKEYS_REWARD_STORAGE_KEY);
      if (!raw) return { payload: {}, records: [] };
      const payload = JSON.parse(raw);
      if (!isObject(payload)) return { payload: {}, records: [] };
      return { payload, records: sanitiseRewardRecords(payload.rewardLedger) };
    } catch {
      return { payload: {}, records: [] };
    }
  }

  function award(input) {
    if (!isObject(input) || input.completed !== true || !isString(input.eventId)) return null;
    const rule = ACTIVITY_RULES[input.completionEvidence];
    if (!rule || input.moduleId !== BOOKKEYS_REWARD_MODULE_ID) return null;
    if (!isString(input.itemId) || !input.itemId.startsWith(rule.prefix)) return null;
    if (input.completionEvidence === "finished-book-page") {
      const signature = isString(input.contentSignature) ? input.contentSignature : "";
      const characters = isFiniteNumber(input.characterCount) ? Math.floor(input.characterCount) : 0;
      if (!/^[a-f0-9]{16}$/.test(signature) || characters < 150) return null;
      // The repeat-policy key is the page's normalized content signature, not
      // its book/page index, so re-importing a passage under another file name
      // cannot reset the daily reward cap.
      if (input.itemId !== rule.prefix + signature) return null;
    }

    const state = loadState();
    const existing = state.records.find((record) => record.eventId === input.eventId);
    if (existing) return existing;

    const activity = {
      ...input,
      moduleId: BOOKKEYS_REWARD_MODULE_ID,
      ts: isFiniteNumber(input.ts) && input.ts > 0 ? Math.round(input.ts) : Math.round(now()),
      activityClass: rule.activityClass,
      difficulty: rule.difficulty,
      quality: isFiniteNumber(input.quality) ? clamp(input.quality, 0, 1) : 0,
      completed: true,
    };
    const records = buildRewardRecords(activity, state.records);
    const record = records[0];
    try {
      storage.setItem(BOOKKEYS_REWARD_STORAGE_KEY, JSON.stringify({
        ...state.payload,
        rewardLedger: [...state.records, ...records],
      }));
    } catch {
      return null;
    }
    dispatchRewardUpdate();
    return record;
  }

  function getRecords() {
    return loadState().records;
  }

  return { award, getRecords };
}

if (typeof window !== "undefined") {
  try {
    window.LimitlessBookkeysRewards = createBookkeysRewardAdapter(window.localStorage);
    window.dispatchEvent(new Event("limitless:bookkeys-rewards-ready"));
  } catch {
    window.LimitlessBookkeysRewards = null;
  }
}
