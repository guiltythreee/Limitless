/**
 * Verified Codeforces accepted submissions → Limitless Standard Rewards.
 * Historical submissions are excluded by the sync adapter before this module
 * is called. The ledger is separate from Competition's existing progress data.
 */
import {
  appendRewardRecords,
  buildRewardRecords,
  dispatchRewardUpdate,
  sanitiseRewardArchive,
  sanitiseRewardRecords,
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
      if (!raw) return { payload: {}, records: [], archive: null };
      const payload = JSON.parse(raw);
      if (!isRecord(payload)) return { payload: {}, records: [], archive: null };
      const archive = payload.rewardArchive == null
        ? null
        : sanitiseRewardArchive(payload.rewardArchive, COMPETITION_REWARD_MODULE_ID);
      if (payload.rewardArchive != null && !archive) {
        return { payload, records: [], archive: null, invalidArchive: true };
      }
      return { payload, records: sanitiseRewardRecords(payload.rewardLedger), archive };
    } catch {
      return { payload: {}, records: [], archive: null };
    }
  }

  function awardCodeforcesSubmission(submission, handle) {
    if (!isRecord(submission) || submission.verdict !== "OK" ||
        !Number.isSafeInteger(submission.id) || submission.id <= 0 ||
        !Number.isSafeInteger(submission.contestId) || submission.contestId <= 0 ||
        !isRecord(submission.problem) || typeof submission.problem.index !== "string" ||
        !/^[A-Z][0-9]*$/.test(submission.problem.index) ||
        !Number.isFinite(submission.creationTimeSeconds) || submission.creationTimeSeconds <= 0 ||
        !isString(handle)) return null;

    const account = handle.trim().toLowerCase();
    const eventId = "codeforces:" + account + ":" + submission.id;
    const state = loadState();
    if (state.invalidArchive) return null;
    const existing = state.records.find((record) => record.eventId === eventId);
    if (existing) return { ...existing, created: false };
    if (state.archive?.eventIds.includes(eventId)) {
      return { eventId, created: false, eligible: false, totalExp: 0 };
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
    const records = buildRewardRecords(activity, state.records, state.archive);
    const record = records[0];
    try {
      const nextPayload = appendRewardRecords(
        state.payload, records, COMPETITION_REWARD_MODULE_ID, Math.round(now())
      );
      storage.setItem(COMPETITION_REWARD_STORAGE_KEY, JSON.stringify(nextPayload));
    } catch {
      return null;
    }
    dispatchRewardUpdate();
    return { ...record, created: true };
  }

  function getRecords() {
    return loadState().records;
  }

  return { awardCodeforcesSubmission, getRecords };
}
