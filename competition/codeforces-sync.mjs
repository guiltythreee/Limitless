import { toCodeforcesLearningAttempts } from "./learning-intelligence.mjs";
import { createCompetitionRewardAdapter } from "./competition-rewards.mjs";

export const CODEFORCES_SYNC_STORAGE_KEY = "limitless.competition.codeforces-learning.v1";
const MAX_SEEN_IDS = 5000;
const MAX_ATTEMPTS = 1000;

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function readState(storage) {
  try {
    const raw = storage?.getItem(CODEFORCES_SYNC_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (!isRecord(parsed) || parsed.version !== 1) return null;
    return parsed;
  } catch {
    return null;
  }
}

/** Read only the isolated Codeforces learning sync record. */
export function readCodeforcesSyncState(storage) {
  const state = readState(storage);
  if (!state) return { version: 1, handle: "", baselineAt: 0, lastSyncAt: 0, seenSubmissionIds: [], attempts: [] };
  return {
    version: 1,
    handle: typeof state.handle === "string" ? state.handle : "",
    baselineAt: Number.isFinite(state.baselineAt) && state.baselineAt > 0 ? state.baselineAt : 0,
    lastSyncAt: Number.isFinite(state.lastSyncAt) && state.lastSyncAt > 0 ? state.lastSyncAt : 0,
    seenSubmissionIds: Array.isArray(state.seenSubmissionIds)
      ? [...new Set(state.seenSubmissionIds.filter((id) => Number.isSafeInteger(id) && id > 0))]
        .sort((a, b) => a - b).slice(-MAX_SEEN_IDS)
      : [],
    attempts: Array.isArray(state.attempts) ? state.attempts.filter((item) =>
      isRecord(item) && typeof item.id === "string" && item.id.startsWith("codeforces:") &&
      Number.isFinite(item.occurredAt) && item.occurredAt > 0
    ).slice(-MAX_ATTEMPTS) : [],
  };
}

/**
 * First successful sync establishes a no-reward historical baseline.
 * Later syncs retain only unseen submissions created after that baseline.
 * A handle change starts a fresh baseline; no account's history transfers.
 */
export function syncCodeforcesSubmissions(storage, handle, submissions, now = Date.now()) {
  const normalizedHandle = typeof handle === "string" ? handle.trim().toLowerCase() : "";
  if (!normalizedHandle || !Array.isArray(submissions) || !Number.isFinite(now) || now <= 0) {
    return { ok: false, error: "invalid-input", baseline: false, added: 0 };
  }
  const previous = readState(storage);
  const sameAccount = previous && previous.handle === normalizedHandle;
  const baselineAt = sameAccount && Number.isFinite(previous.baselineAt) && previous.baselineAt > 0
    ? previous.baselineAt : now;
  const seen = new Set(sameAccount && Array.isArray(previous.seenSubmissionIds) ? previous.seenSubmissionIds : []);
  const firstSync = !sameAccount || !baselineAt || !previous?.baselineAt;
  const newlyObserved = [];
  const acceptedForProjection = [];

  for (const submission of submissions) {
    if (!isRecord(submission)) continue;
    const id = Number(submission.id);
    if (!Number.isSafeInteger(id) || id <= 0 || seen.has(id)) continue;
    const mapped = toCodeforcesLearningAttempts([submission]);
    // Ignore in-progress/unknown verdicts without marking them seen: Codeforces
    // can later update the same submission ID with its terminal verdict.
    if (!mapped.length) continue;
    seen.add(id);
    const seconds = Number(submission.creationTimeSeconds);
    if (!firstSync && Number.isFinite(seconds) && seconds * 1000 >= baselineAt) {
      newlyObserved.push(submission);
      acceptedForProjection.push(submission);
    }
  }

  const newAttempts = firstSync ? [] : toCodeforcesLearningAttempts(acceptedForProjection);
  let awardedExp = 0;
  let rewardAwards = 0;
  if (!firstSync) {
    const rewards = createCompetitionRewardAdapter(storage);
    // API pages are newest-first, but daily repeat caps must be assigned in
    // chronological order so the earliest accepted solve gets the first award.
    const rewardOrder = newlyObserved.slice().sort((a, b) =>
      Number(a.creationTimeSeconds) - Number(b.creationTimeSeconds) || Number(a.id) - Number(b.id)
    );
    for (const submission of rewardOrder) {
      if (submission.verdict !== "OK") continue;
      const record = rewards.awardCodeforcesSubmission(submission, normalizedHandle);
      if (!record) return { ok: false, error: "reward-ledger-write-failed", baseline: false, added: 0 };
      if (record.created && record.eligible && record.totalExp > 0) {
        awardedExp += record.totalExp;
        rewardAwards += 1;
      }
    }
  }
  const previousAttempts = sameAccount && Array.isArray(previous.attempts) ? previous.attempts : [];
  const attemptsById = new Map(previousAttempts.map((item) => [item.id, item]));
  for (const attempt of newAttempts) attemptsById.set(attempt.id, attempt);

  const next = {
    version: 1,
    handle: normalizedHandle,
    baselineAt,
    lastSyncAt: now,
    // Codeforces returns newest submissions first. Sort by monotonically
    // increasing submission ID before truncation so the retained window keeps
    // the newest IDs rather than the oldest tail of a descending API page.
    seenSubmissionIds: [...seen].sort((a, b) => a - b).slice(-MAX_SEEN_IDS),
    attempts: [...attemptsById.values()].sort((a, b) => a.occurredAt - b.occurredAt).slice(-MAX_ATTEMPTS),
  };
  try {
    storage.setItem(CODEFORCES_SYNC_STORAGE_KEY, JSON.stringify(next));
  } catch {
    return { ok: false, error: "storage-write-failed", baseline: firstSync, added: 0 };
  }
  return {
    ok: true,
    baseline: firstSync,
    added: newAttempts.length,
    rewardAwards,
    awardedExp,
    observed: submissions.length,
    state: readCodeforcesSyncState(storage),
  };
}
