/**
 * Verified Codeforces accepted submissions → Limitless Standard Rewards.
 * Historical submissions are excluded by the sync adapter before this module
 * is called. The ledger is separate from Competition's existing progress data.
 */
import { createLedgerAdapter } from "../shared/ledger-adapter.mjs";

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
  const ledger = createLedgerAdapter(storage, {
    moduleId: COMPETITION_REWARD_MODULE_ID,
    storageKey: COMPETITION_REWARD_STORAGE_KEY,
  });

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

    const rating = Number.isFinite(submission.problem.rating) ? submission.problem.rating : 0;
    const activity = {
      eventId,
      moduleId: COMPETITION_REWARD_MODULE_ID,
      itemId: "codeforces-problem:" + submission.contestId + "-" + submission.problem.index,
      ts: Math.round(submission.creationTimeSeconds * 1000),
      activityClass: "rated-problem",
      problemRating: rating,
      difficulty: codeforcesDifficulty(rating),
      completionEvidence: "verified-codeforces-accepted-submission",
      completed: true,
      // Accepted is pass/fail; there is no quality signal, so no quality bonus.
      quality: 0,
    };
    if (!Number.isFinite(activity.ts) || activity.ts <= 0) return null;
    // `created` separates a new award from an idempotent lookup for sync retries.
    return ledger.award(activity);
  }

  /**
   * One-time participation award per official Codeforces contest, proven by a
   * submission whose author.participantType is CONTESTANT. Solved problems are
   * already paid per accepted submission, so this is only a small timed-
   * conditions bonus (the legacy assessment base of 25), not a second solve reward.
   */
  function awardCodeforcesContestParticipation(submission, handle) {
    if (!isRecord(submission) || !isRecord(submission.author) ||
        submission.author.participantType !== "CONTESTANT" ||
        !Number.isSafeInteger(submission.contestId) || submission.contestId <= 0 ||
        submission.contestId >= 100000 || // 100000+ are Gym contests, not official rounds
        !Number.isFinite(submission.creationTimeSeconds) || submission.creationTimeSeconds <= 0 ||
        !isString(handle)) return null;

    const account = handle.trim().toLowerCase();
    const eventId = "codeforces-contest:" + account + ":" + submission.contestId;

    const activity = {
      eventId,
      moduleId: COMPETITION_REWARD_MODULE_ID,
      itemId: "codeforces-contest:" + submission.contestId,
      ts: Math.round(submission.creationTimeSeconds * 1000),
      activityClass: "assessment",
      difficulty: "foundational",
      completionEvidence: "verified-codeforces-contest-participation",
      completed: true,
      quality: 0,
    };
    return ledger.award(activity);
  }

  return {
    awardCodeforcesSubmission,
    awardCodeforcesContestParticipation,
    getRecords: ledger.getRecords,
  };
}
