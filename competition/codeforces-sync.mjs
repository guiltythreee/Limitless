import { toCodeforcesLearningAttempts } from "./learning-intelligence.mjs";
import { createCompetitionRewardAdapter } from "./competition-rewards.mjs";

export const CODEFORCES_SYNC_STORAGE_KEY = "limitless.competition.codeforces-learning.v1";
// Incremental sync can safely fetch up to 100 pages of 1,000 submissions.
// Keep the full bounded fetch window deduplicated across the current-week overlap.
const MAX_SEEN_IDS = 100000;
// Retain a larger learning history so old unresolved problems are not evicted quickly.
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

function encodeCodeforcesAttemptArchive(attempts) {
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
    ) : [],
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
