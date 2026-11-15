import { sanitiseRewardRecords } from "../shared/rewards.mjs";
import { isValidCodeforcesAttemptArchive, CODEFORCES_ACCOUNT_HISTORY_STORAGE_KEY } from "./codeforces-sync.mjs";

export const CODEFORCES_SYNC_STORAGE_KEY = "limitless.competition.codeforces-learning.v1";
export { CODEFORCES_ACCOUNT_HISTORY_STORAGE_KEY };
export const COMPETITION_REWARD_STORAGE_KEY = "limitless-competitive-programming-lsr1-v1";

const isRecord = (value) => value !== null && typeof value === "object" && !Array.isArray(value);

function readStoredJson(storage, key) {
  try {
    const raw = storage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/** Version 3 backups include the two additive Codeforces stores. */
export function createCompetitionBackup(storage, state, exportedAt = new Date().toISOString()) {
  return {
    version: 3,
    exportedAt,
    data: state,
    codeforcesLearning: readStoredJson(storage, CODEFORCES_SYNC_STORAGE_KEY),
    codeforcesAccountHistories: readStoredJson(storage, CODEFORCES_ACCOUNT_HISTORY_STORAGE_KEY),
    codeforcesRewards: readStoredJson(storage, COMPETITION_REWARD_STORAGE_KEY),
  };
}

function validCodeforcesLearning(value) {
  return isRecord(value) &&
    value.version === 1 &&
    typeof value.handle === "string" &&
    Number.isFinite(value.baselineAt) && value.baselineAt >= 0 &&
    Number.isFinite(value.lastSyncAt) && value.lastSyncAt >= 0 &&
    Array.isArray(value.seenSubmissionIds) &&
    value.seenSubmissionIds.every((id) => Number.isSafeInteger(id) && id > 0) &&
    isValidCodeforcesAttemptArchive(value.attemptsArchive) &&
    Array.isArray(value.attempts) &&
    value.attempts.every((attempt) =>
      isRecord(attempt) &&
      typeof attempt.id === "string" && attempt.id.startsWith("codeforces:") &&
      Number.isFinite(attempt.occurredAt) && attempt.occurredAt > 0
    );
}

function validCodeforcesRewards(value) {
  if (!isRecord(value) || !Array.isArray(value.rewardLedger)) return false;
  const clean = sanitiseRewardRecords(value.rewardLedger);
  return clean.length === value.rewardLedger.length &&
    clean.every((record) => record.moduleId === "competitive-programming");
}

function inspectBackupExtras(parsed) {
  if (!isRecord(parsed)) return { ok: false, error: "invalid-backup" };
  const hasLearning = Object.prototype.hasOwnProperty.call(parsed, "codeforcesLearning");
  const hasRewards = Object.prototype.hasOwnProperty.call(parsed, "codeforcesRewards");
  const hasAccountHistories = Object.prototype.hasOwnProperty.call(parsed, "codeforcesAccountHistories");
  if (hasLearning && parsed.codeforcesLearning !== null && !validCodeforcesLearning(parsed.codeforcesLearning)) {
    return { ok: false, error: "invalid-codeforces-learning" };
  }
  if (hasAccountHistories && parsed.codeforcesAccountHistories !== null &&
      (!isRecord(parsed.codeforcesAccountHistories) || parsed.codeforcesAccountHistories.version !== 1 || !isRecord(parsed.codeforcesAccountHistories.accounts) ||
       Object.entries(parsed.codeforcesAccountHistories.accounts).some(([handle, value]) => !isRecord(value) || value.version !== 1 || value.handle !== handle ||
         !Array.isArray(value.seenSubmissionIds) || !value.seenSubmissionIds.every((id) => Number.isSafeInteger(id) && id > 0) || !isValidCodeforcesAttemptArchive(value.attemptsArchive) ||
         !Array.isArray(value.attempts) || value.attempts.some((attempt) => !isRecord(attempt) || typeof attempt.id !== "string" || !attempt.id.startsWith("codeforces:") || !Number.isFinite(attempt.occurredAt) || attempt.occurredAt <= 0))))
    return { ok: false, error: "invalid-codeforces-account-histories" };
  if (hasRewards && parsed.codeforcesRewards !== null && !validCodeforcesRewards(parsed.codeforcesRewards)) {
    return { ok: false, error: "invalid-codeforces-rewards" };
  }
  return {
    ok: true,
    hasLearning,
    hasRewards,
    hasAccountHistories,
    codeforcesAccountHistories: parsed.codeforcesAccountHistories,
    codeforcesLearning: parsed.codeforcesLearning,
    codeforcesRewards: parsed.codeforcesRewards,
  };
}

/**
 * Restore the tracker and optional Codeforces stores together. If any write
 * fails, best-effort rollback restores every key to its pre-import value.
 * Version 2/legacy backups omit the optional fields and leave those stores alone.
 */
export function restoreCompetitionBackup(storage, primaryKey, state, parsed) {
  const extras = inspectBackupExtras(parsed);
  if (!extras.ok) return extras;

  const updates = [{ key: primaryKey, value: JSON.stringify(state) }];
  if (extras.hasLearning) updates.push({
    key: CODEFORCES_SYNC_STORAGE_KEY,
    value: extras.codeforcesLearning === null ? null : JSON.stringify(extras.codeforcesLearning),
  });
  if (extras.hasAccountHistories) updates.push({ key: CODEFORCES_ACCOUNT_HISTORY_STORAGE_KEY, value: extras.codeforcesAccountHistories === null ? null : JSON.stringify(extras.codeforcesAccountHistories) });
  if (extras.hasRewards) updates.push({
    key: COMPETITION_REWARD_STORAGE_KEY,
    value: extras.codeforcesRewards === null ? null : JSON.stringify(extras.codeforcesRewards),
  });

  const previous = updates.map(({ key }) => storage.getItem(key));
  try {
    updates.forEach(({ key, value }) => {
      if (value === null) storage.removeItem(key);
      else storage.setItem(key, value);
    });
    return { ok: true };
  } catch {
    updates.forEach(({ key }, index) => {
      try {
        if (previous[index] === null) storage.removeItem(key);
        else storage.setItem(key, previous[index]);
      } catch { /* Continue best-effort rollback for the remaining keys. */ }
    });
    return { ok: false, error: "storage-write-failed" };
  }
}


/**
 * Reset Competition progress, all Codeforces account learning histories and
 * Competition-only rewards atomically. A failed removal restores every key.
 * Other modules' progress and reward ledgers are never touched.
 */
export function resetCompetitionData(storage, primaryKey) {
  if (!storage || typeof storage.getItem !== "function" ||
      typeof storage.removeItem !== "function" || typeof storage.setItem !== "function" ||
      typeof primaryKey !== "string" || !primaryKey.trim()) {
    return { ok: false, error: "invalid-storage" };
  }
  const keys = [...new Set([
    primaryKey,
    CODEFORCES_SYNC_STORAGE_KEY,
    CODEFORCES_ACCOUNT_HISTORY_STORAGE_KEY,
    COMPETITION_REWARD_STORAGE_KEY,
  ])];
  let previous;
  try {
    previous = keys.map((key) => storage.getItem(key));
  } catch {
    return { ok: false, error: "storage-read-failed" };
  }
  try {
    keys.forEach((key) => storage.removeItem(key));
    return { ok: true };
  } catch {
    keys.forEach((key, index) => {
      try {
        if (previous[index] === null) storage.removeItem(key);
        else storage.setItem(key, previous[index]);
      } catch { /* Continue best-effort rollback for the remaining keys. */ }
    });
    return { ok: false, error: "storage-write-failed" };
  }
}
