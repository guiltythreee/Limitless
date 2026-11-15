import { toCodeforcesLearningAttempts } from "./learning-intelligence.mjs";
import { createCompetitionRewardAdapter } from "./competition-rewards.mjs";

export const CODEFORCES_SYNC_STORAGE_KEY = "limitless.competition.codeforces-learning.v1";
export const CODEFORCES_ACCOUNT_HISTORY_STORAGE_KEY = "limitless.competition.codeforces-learning-accounts.v1";
function removeStorageKey(storage, key) { if (typeof storage.removeItem === "function") storage.removeItem(key); else storage.setItem(key, null); }
// Incremental sync can safely fetch up to 100 pages of 1,000 submissions.
// Keep the full bounded fetch window deduplicated across the current-week overlap.
const MAX_SEEN_IDS = 100000;
// Keep the newest 5,000 attempts expanded; archive older attempts losslessly.
const MAX_ATTEMPTS = 5000;

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

const ATTEMPT_ARCHIVE_VERSION = 1;
const ATTEMPT_STRING_FIELDS = [0, 1, 2, 3, 4, 5, 7, 10, 11];
const ATTEMPT_ARCHIVE_WIDTH = 14;

function decodeCodeforcesAttemptArchive(raw) {
  if (!isRecord(raw) || raw.version !== ATTEMPT_ARCHIVE_VERSION ||
      !Array.isArray(raw.strings) || !Array.isArray(raw.records) ||
      !raw.strings.every((value) => typeof value === "string")) return [];
  const strings = raw.strings;
  const attempts = [];
  for (const tuple of raw.records) {
    if (!Array.isArray(tuple) || tuple.length !== ATTEMPT_ARCHIVE_WIDTH) continue;
    const values = tuple.slice();
    let valid = true;
    for (const index of ATTEMPT_STRING_FIELDS) {
      const dictionaryIndex = values[index];
      if ((index === 11) && dictionaryIndex === -1) {
        values[index] = null;
        continue;
      }
      if (!Number.isInteger(dictionaryIndex) || dictionaryIndex < 0 || dictionaryIndex >= strings.length) {
        valid = false;
        break;
      }
      values[index] = strings[dictionaryIndex];
    }
    if (!valid || !Array.isArray(values[6])) continue;
    const concepts = values[6].map((index) =>
      Number.isInteger(index) && index >= 0 && index < strings.length ? strings[index] : null
    );
    if (concepts.some((value) => value === null)) continue;
    const [id, disciplineId, courseId, contentId, questionId, subjectId, , outcome,
      occurredAt, elapsedMs, mode, mistakeCategory, independent, hintCount] = values;
    if (![id, disciplineId, courseId, contentId, questionId, subjectId, outcome, mode]
        .every((value) => typeof value === "string" && value.length > 0) ||
        !id.startsWith("codeforces:") ||
        !["correct", "incorrect", "partial"].includes(outcome) ||
        !Number.isFinite(occurredAt) || occurredAt <= 0 ||
        (elapsedMs !== null && (!Number.isFinite(elapsedMs) || elapsedMs <= 0)) ||
        (mistakeCategory !== null && typeof mistakeCategory !== "string") ||
        (independent !== null && typeof independent !== "boolean") ||
        (hintCount !== null && (!Number.isFinite(hintCount) || hintCount < 0))) continue;
    const attempt = {
      id, disciplineId, courseId, contentId, questionId, subjectId,
      conceptIds: concepts, outcome, occurredAt, mode,
    };
    if (elapsedMs !== null) attempt.elapsedMs = elapsedMs;
    if (mistakeCategory !== null) attempt.mistakeCategory = mistakeCategory;
    if (independent !== null) attempt.independent = independent;
    if (hintCount !== null) attempt.hintCount = hintCount;
    attempts.push(attempt);
  }
  const seen = new Set();
  return attempts.filter((attempt) => {
    if (seen.has(attempt.id)) return false;
    seen.add(attempt.id);
    return true;
  });
}

export function isValidCodeforcesAttemptArchive(raw) {
  if (raw == null) return true;
  if (!isRecord(raw) || raw.version !== ATTEMPT_ARCHIVE_VERSION ||
      !Array.isArray(raw.records) || !Array.isArray(raw.strings)) return false;
  return decodeCodeforcesAttemptArchive(raw).length === raw.records.length;
}

/** Append a manual Codeforces revision result without bypassing archive compaction. */
export function appendCodeforcesRevisionAttempt(storage, questionId, outcome, now = Date.now()) {
  if (!storage || typeof storage.getItem !== "function" || typeof storage.setItem !== "function" ||
      typeof questionId !== "string" || !questionId.trim() ||
      !["correct", "incorrect"].includes(outcome) || !Number.isFinite(now) || now <= 0) {
    return { ok: false, error: "invalid-input" };
  }
  const state = readState(storage);
  if (!state) return { ok: false, error: "learning-record-unavailable" };
  if (!state.attemptsArchiveValid) return { ok: false, error: "invalid-attempts-archive" };
  const sourceAttempt = state.attempts.filter((attempt) =>
    attempt && attempt.questionId === questionId &&
    attempt.disciplineId === "competitive-programming" && attempt.courseId === "codeforces"
  ).sort((a, b) => a.occurredAt - b.occurredAt).pop();
  if (!sourceAttempt) return { ok: false, error: "source-attempt-not-found" };

  const revisionPrefix = "codeforces:revision:" + Math.round(now) + ":";
  const usedIds = new Set(state.attempts.map((attempt) => attempt.id));
  let suffix = 1;
  while (usedIds.has(revisionPrefix + suffix)) suffix += 1;
  const revision = {
    id: revisionPrefix + suffix,
    disciplineId: sourceAttempt.disciplineId,
    courseId: sourceAttempt.courseId,
    contentId: sourceAttempt.contentId,
    questionId: sourceAttempt.questionId,
    subjectId: "codeforces",
    conceptIds: Array.isArray(sourceAttempt.conceptIds) ? sourceAttempt.conceptIds : [],
    outcome,
    occurredAt: Math.round(now),
    independent: outcome === "correct",
    ...(outcome === "correct" ? { hintCount: 0 } : {}),
    mode: "revision",
  };
  const allAttempts = [...state.attempts, revision].sort((a, b) =>
    a.occurredAt - b.occurredAt || a.id.localeCompare(b.id)
  );
  const splitAt = Math.max(0, allAttempts.length - MAX_ATTEMPTS);
  const { attemptsArchiveValid, ...payload } = state;
  try {
    storage.setItem(CODEFORCES_SYNC_STORAGE_KEY, JSON.stringify({
      ...payload,
      attemptsArchive: encodeCodeforcesAttemptArchive(allAttempts.slice(0, splitAt)),
      attempts: allAttempts.slice(splitAt),
    }));
  } catch {
    return { ok: false, error: "storage-write-failed" };
  }
  return { ok: true, attempt: revision };
}

export function encodeCodeforcesAttemptArchive(attempts) {
  const strings = [];
  const indices = new Map();
  const intern = (value) => {
    if (value == null) return -1;
    if (!indices.has(value)) {
      indices.set(value, strings.length);
      strings.push(value);
    }
    return indices.get(value);
  };
  const records = attempts.map((attempt) => [
    intern(attempt.id), intern(attempt.disciplineId), intern(attempt.courseId),
    intern(attempt.contentId), intern(attempt.questionId), intern(attempt.subjectId),
    (Array.isArray(attempt.conceptIds) ? attempt.conceptIds : []).map(intern),
    intern(attempt.outcome), attempt.occurredAt,
    Number.isFinite(attempt.elapsedMs) ? attempt.elapsedMs : null,
    intern(attempt.mode), intern(attempt.mistakeCategory),
    typeof attempt.independent === "boolean" ? attempt.independent : null,
    Number.isFinite(attempt.hintCount) ? attempt.hintCount : null,
  ]);
  return { version: ATTEMPT_ARCHIVE_VERSION, strings, records };
}

function readState(storage) {
  try {
    const raw = storage?.getItem(CODEFORCES_SYNC_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (!isRecord(parsed) || parsed.version !== 1) return null;
    const archiveValid = isValidCodeforcesAttemptArchive(parsed.attemptsArchive);
    const archivedAttempts = archiveValid ? decodeCodeforcesAttemptArchive(parsed.attemptsArchive) : [];
    const recentAttempts = Array.isArray(parsed.attempts) ? parsed.attempts : [];
    const byId = new Map();
    for (const attempt of [...archivedAttempts, ...recentAttempts]) {
      if (isRecord(attempt) && typeof attempt.id === "string") byId.set(attempt.id, attempt);
    }
    return { ...parsed, attempts: [...byId.values()], attemptsArchiveValid: archiveValid };
  } catch {
    return null;
  }
}

/** Read only the isolated Codeforces learning sync record. */
export function readCodeforcesSyncState(storage) {
  const state = readState(storage);
  if (!state) return { version: 1, handle: "", baselineAt: 0, lastSyncAt: 0, seenSubmissionIds: [], attempts: [], attemptsArchiveValid: true };
  return {
    version: 1,
    handle: typeof state.handle === "string" ? state.handle : "",
    baselineAt: Number.isFinite(state.baselineAt) && state.baselineAt > 0 ? state.baselineAt : 0,
    lastSyncAt: Number.isFinite(state.lastSyncAt) && state.lastSyncAt > 0 ? state.lastSyncAt : 0,
    seenSubmissionIds: Array.isArray(state.seenSubmissionIds)
      ? [...new Set(state.seenSubmissionIds.filter((id) => Number.isSafeInteger(id) && id > 0))]
        .sort((a, b) => a - b).slice(-MAX_SEEN_IDS)
      : [],
    attempts: state.attemptsArchiveValid === false ? [] : Array.isArray(state.attempts) ? state.attempts.filter((item) =>
      isRecord(item) && typeof item.id === "string" && item.id.startsWith("codeforces:") &&
      Number.isFinite(item.occurredAt) && item.occurredAt > 0
    ) : [],
    attemptsArchiveValid: state.attemptsArchiveValid !== false,
  };
}

/** Save the outgoing account and restore the requested account without mixing histories. */
export function activateCodeforcesAccount(storage, handle) {
  const normalized = typeof handle === "string" ? handle.trim().toLowerCase() : "";
  if (!normalized || !storage || typeof storage.getItem !== "function" || typeof storage.setItem !== "function") return { ok: false, error: "invalid-input" };
  let activeRaw = null, active = null, collection = { version: 1, accounts: {} };
  try {
    activeRaw = storage.getItem(CODEFORCES_SYNC_STORAGE_KEY);
    if (activeRaw) {
      active = JSON.parse(activeRaw);
      if (!isRecord(active) || active.version !== 1 || typeof active.handle !== "string" || !Array.isArray(active.seenSubmissionIds) || !Array.isArray(active.attempts)) return { ok: false, error: "invalid-active-learning-record" };
      if (!isValidCodeforcesAttemptArchive(active.attemptsArchive)) return { ok: false, error: "invalid-attempts-archive" };
    }
    const raw = storage.getItem(CODEFORCES_ACCOUNT_HISTORY_STORAGE_KEY);
    if (raw) { collection = JSON.parse(raw); if (!isRecord(collection) || collection.version !== 1 || !isRecord(collection.accounts)) return { ok: false, error: "invalid-account-history" };
      for (const [key, value] of Object.entries(collection.accounts)) if (!isRecord(value) || value.version !== 1 || value.handle !== key || !Array.isArray(value.seenSubmissionIds) || !Array.isArray(value.attempts) || !isValidCodeforcesAttemptArchive(value.attemptsArchive)) return { ok: false, error: "invalid-account-history" };
    }
  } catch { return { ok: false, error: "invalid-account-history" }; }
  if (active && active.handle === normalized) return { ok: true, switched: false };
  const accounts = { ...collection.accounts }; if (active && active.handle) accounts[active.handle] = active;
  const target = accounts[normalized] || null, oldCollection = storage.getItem(CODEFORCES_ACCOUNT_HISTORY_STORAGE_KEY);
  try { storage.setItem(CODEFORCES_ACCOUNT_HISTORY_STORAGE_KEY, JSON.stringify({ version: 1, accounts })); if (target) storage.setItem(CODEFORCES_SYNC_STORAGE_KEY, JSON.stringify(target)); else removeStorageKey(storage, CODEFORCES_SYNC_STORAGE_KEY); }
  catch { try { if (oldCollection === null) removeStorageKey(storage, CODEFORCES_ACCOUNT_HISTORY_STORAGE_KEY); else storage.setItem(CODEFORCES_ACCOUNT_HISTORY_STORAGE_KEY, oldCollection); if (activeRaw === null) removeStorageKey(storage, CODEFORCES_SYNC_STORAGE_KEY); else storage.setItem(CODEFORCES_SYNC_STORAGE_KEY, activeRaw); } catch {} return { ok: false, error: "storage-write-failed" }; }
  return { ok: true, switched: true, restored: !!target };
}

/**
 * First successful sync establishes a no-reward historical baseline.
 * Later syncs retain only unseen submissions created after that baseline.
 * Switching handles saves and restores isolated per-account sync histories.
 */
export function syncCodeforcesSubmissions(storage, handle, submissions, now = Date.now()) {
  const normalizedHandle = typeof handle === "string" ? handle.trim().toLowerCase() : "";
  if (!normalizedHandle || !Array.isArray(submissions) || !Number.isFinite(now) || now <= 0) {
    return { ok: false, error: "invalid-input", baseline: false, added: 0 };
  }
  const activation = activateCodeforcesAccount(storage, normalizedHandle);
  if (!activation.ok) return { ok: false, error: activation.error, baseline: false, added: 0 };
  const previous = readState(storage);
  if (previous && previous.attemptsArchiveValid === false) {
    return { ok: false, error: "invalid-attempts-archive", baseline: false, added: 0 };
  }
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

  const allAttempts = [...attemptsById.values()].sort((a, b) =>
    a.occurredAt - b.occurredAt || a.id.localeCompare(b.id)
  );
  const attemptArchiveSplit = Math.max(0, allAttempts.length - MAX_ATTEMPTS);
  const next = {
    version: 1,
    handle: normalizedHandle,
    baselineAt,
    lastSyncAt: now,
    // Codeforces returns newest submissions first. Sort by monotonically
    // increasing submission ID before truncation so the retained window keeps
    // the newest IDs rather than the oldest tail of a descending API page.
    seenSubmissionIds: [...seen].sort((a, b) => a - b).slice(-MAX_SEEN_IDS),
    attemptsArchive: encodeCodeforcesAttemptArchive(allAttempts.slice(0, attemptArchiveSplit)),
    attempts: allAttempts.slice(attemptArchiveSplit),
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
