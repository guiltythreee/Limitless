/**
 * Generic LSR-1 ledger adapter. A discipline supplies only its module id, its
 * storage key and a mapping from its own events to an activity object; this
 * handles loading, idempotency (by eventId), the engine call, persistence and
 * the update notification. See "Adding a discipline" in shared/LSR-1.md.
 *
 * The ledger is stored as `{ ...otherModuleData, rewardLedger: [...] }` so a
 * module can keep its own data beside it (the `rewardLedger` shape used by
 * REWARD_SOURCES).
 */
import { buildRewardRecords, dispatchRewardUpdate, sanitiseRewardRecords } from "./rewards.mjs";

const isRecord = (value) => value !== null && typeof value === "object" && !Array.isArray(value);

export function createLedgerAdapter(storage, { moduleId, storageKey }) {
  if (!storage || typeof storage.getItem !== "function" || typeof storage.setItem !== "function") {
    throw new TypeError("Ledger adapter requires getItem/setItem storage");
  }
  if (typeof moduleId !== "string" || !moduleId || typeof storageKey !== "string" || !storageKey) {
    throw new TypeError("Ledger adapter requires a moduleId and a storageKey");
  }

  function load() {
    try {
      const raw = storage.getItem(storageKey);
      if (!raw) return { payload: {}, records: [] };
      const payload = JSON.parse(raw);
      if (!isRecord(payload)) return { payload: {}, records: [] };
      return { payload, records: sanitiseRewardRecords(payload.rewardLedger) };
    } catch {
      return { payload: {}, records: [] };
    }
  }

  /**
   * Award one activity. Returns the persisted record with `created: true` when
   * it was newly written, `created: false` for an idempotent repeat of the same
   * eventId, or null when the activity is invalid or storage failed.
   */
  function award(activity) {
    if (!isRecord(activity) || typeof activity.eventId !== "string" || !activity.eventId) return null;
    const state = load();
    const existing = state.records.find((record) => record.eventId === activity.eventId);
    if (existing) return { ...existing, created: false };
    const records = buildRewardRecords({ ...activity, moduleId }, state.records);
    if (!records.length) return null;
    try {
      storage.setItem(storageKey, JSON.stringify({ ...state.payload, rewardLedger: [...state.records, ...records] }));
    } catch {
      return null;
    }
    dispatchRewardUpdate();
    return { ...records[0], created: true };
  }

  return { award, getRecords: () => load().records };
}
