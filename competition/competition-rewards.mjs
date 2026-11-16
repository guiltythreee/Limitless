/**
 * Verified Codeforces accepted submissions → Limitless Standard Rewards.
 * Historical submissions are excluded by the sync adapter before this module
 * is called. The ledger is separate from Competition's existing progress data.
 */
import {
  buildRewardRecords,
  dispatchRewardUpdate,
  readRewardLedger,
  decodeRewardLedgerArchive,
  sanitiseRewardRecords,
  isValidRewardLedgerArchive,
  compactRewardLedgerPayload,
} from "../shared/rewards.mjs";

export const COMPETITION_REWARD_STORAGE_KEY = "limitless-competitive-programming-lsr1-v1";
export const COMPETITION_REWARD_MODULE_ID = "competitive-programming";

const isRecord = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
const isString = (value) => typeof value === "string" && value.trim().length > 0;

export function codeforcesDifficulty(rating) {
  if (!Number.isFinite(rating) || rating < 1200) return "foundational";
  if (rating < 1800) return "intermediate";
  return "advanced";
}

export function createCompetitionRewardAdapter(storage, options = {}) {
  if (!storage || typeof storage.getItem !== "function" || typeof storage.setItem !== "function") {
    throw new TypeError("Competition rewards require getItem/setItem storage");
  }
  const now = typeof options.now === "function" ? options.now : () => Date.now();

  function loadState() {
    try {
      const raw = storage.getItem(COMPETITION_REWARD_STORAGE_KEY);
      if (raw == null) return { payload: {}, records: [], valid: true };
      const payload = JSON.parse(raw);
      if (!isRecord(payload) || !Array.isArray(payload.rewardLedger)) {
        return { payload: {}, records: [], valid: false };
      }
      const archived = payload.rewardLedgerArchive == null
        ? []
        : decodeRewardLedgerArchive(payload.rewardLedgerArchive);
      const recent = sanitiseRewardRecords(payload.rewardLedger);
      const records = readRewardLedger(payload);
      const valid = isValidRewardLedgerArchive(payload.rewardLedgerArchive) &&
        recent.length === payload.rewardLedger.length &&
        records.length === archived.length + payload.rewardLedger.length;
      return { payload, records, valid };
    } catch {
      return { payload: {}, records: [], valid: false };
    }
  }

  function awardCodeforcesSubmissions(submissions, handle) {
    if (!Array.isArray(submissions) || !isString(handle)) return null;
    const account = handle.trim().toLowerCase();
    const state = loadState();
    if (!state.valid) return null;

    const nextRecords = state.records.slice();
    const byEventId = new Map(nextRecords.map((record) => [record.eventId, record]));
    const results = [];
    let changed = false;
    for (const submission of submissions) {
      if (!isRecord(submission) || submission.verdict !== "OK" ||
          !Number.isSafeInteger(submission.id) || submission.id <= 0 ||
          !Number.isSafeInteger(submission.contestId) || submission.contestId <= 0 ||
          !isRecord(submission.problem) || typeof submission.problem.index !== "string" ||
          !/^[A-Z][0-9]*$/.test(submission.problem.index) ||
          !Number.isFinite(submission.creationTimeSeconds) || submission.creationTimeSeconds <= 0) return null;

      const eventId = "codeforces:" + account + ":" + submission.id;
      const existing = byEventId.get(eventId);
      if (existing) {
        results.push({ ...existing, created: false });
        continue;
      }

      const rating = Number.isFinite(submission.problem.rating) ? submission.problem.rating : 0;
      const activity = {
        eventId,
        moduleId: COMPETITION_REWARD_MODULE_ID,
        itemId: "codeforces-problem:" + submission.contestId + "-" + submission.problem.index,
        ts: Math.round(submission.creationTimeSeconds * 1000),
        activityClass: "focused-practice",
        difficulty: codeforcesDifficulty(rating),
        completionEvidence: "verified-codeforces-accepted-submission",
        completed: true,
        quality: 1,
      };
      if (!Number.isFinite(activity.ts) || activity.ts <= 0) return null;
      const createdRecords = buildRewardRecords(activity, nextRecords);
      const record = createdRecords[0];
      nextRecords.push(...createdRecords);
      for (const createdRecord of createdRecords) byEventId.set(createdRecord.eventId, createdRecord);
      results.push({ ...record, created: true });
      changed = true;
    }

    if (!changed) return results;
    try {
      storage.setItem(COMPETITION_REWARD_STORAGE_KEY, JSON.stringify(
        compactRewardLedgerPayload({
          ...state.payload,
          rewardLedger: nextRecords,
        })
      ));
    } catch {
      return null;
    }
    dispatchRewardUpdate();
    return results;
  }

  function awardCodeforcesSubmission(submission, handle) {
    return awardCodeforcesSubmissions([submission], handle)?.[0] ?? null;
  }

  function getRecords() {
    return loadState().records;
  }

  return { awardCodeforcesSubmission, awardCodeforcesSubmissions, getRecords };
}
