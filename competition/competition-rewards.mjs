/**
 * Verified Codeforces accepted submissions → Limitless Standard Rewards.
 * Historical submissions are excluded by the sync adapter before this module
 * is called. The ledger is separate from Competition's existing progress data.
 */
import {
  buildRewardRecords,
  dispatchRewardUpdate,
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
      if (!raw) return { payload: {}, records: [] };
      const payload = JSON.parse(raw);
      if (!isRecord(payload)) return { payload: {}, records: [] };
      return { payload, records: sanitiseRewardRecords(payload.rewardLedger) };
    } catch {
      return { payload: {}, records: [] };
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
    const existing = state.records.find((record) => record.eventId === eventId);
    if (existing) return existing;

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
    const records = buildRewardRecords(activity, state.records);
    const record = records[0];
    try {
      storage.setItem(COMPETITION_REWARD_STORAGE_KEY, JSON.stringify({
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

  return { awardCodeforcesSubmission, getRecords };
}
