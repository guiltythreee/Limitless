/**
 * Math Trainer → Limitless Standard Rewards (LSR-1) adapter.
 *
 * This ledger is intentionally separate from Math Trainer's existing rank XP,
 * run history, attempts, preferences and export format. It records newly
 * completed activity only; historic local XP is never imported or converted.
 */
import {
  buildRewardRecords,
  sanitiseRewardRecords,
  dispatchRewardUpdate,
} from "../../shared/rewards.mjs";

export const MATH_REWARD_STORAGE_KEY = "limitless-math-lsr1-v1";
export const MATH_REWARD_MODULE_ID = "math-trainer";

const isObject = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
const isString = (value) => typeof value === "string" && value.trim().length > 0;
const finite = (value) => typeof value === "number" && Number.isFinite(value);
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function tierDifficulty(index) {
  if (finite(index) && index >= 4) return "advanced";
  if (finite(index) && index >= 2) return "intermediate";
  return "foundational";
}

/**
 * Inject storage and time so the adapter can be regression-tested without a
 * browser. It performs one synchronous write per accepted activity and keeps
 * any other fields present in its dedicated LSR-1 storage root.
 */
export function createMathRewardAdapter(storage, options = {}) {
  if (!storage || typeof storage.getItem !== "function" || typeof storage.setItem !== "function") {
    throw new TypeError("Math Trainer rewards require getItem/setItem storage");
  }
  const now = typeof options.now === "function" ? options.now : () => Date.now();

  function loadState() {
    try {
      const raw = storage.getItem(MATH_REWARD_STORAGE_KEY);
      if (!raw) return { payload: {}, records: [] };
      const parsed = JSON.parse(raw);
      if (!isObject(parsed)) return { payload: {}, records: [] };
      return { payload: parsed, records: sanitiseRewardRecords(parsed.rewardLedger) };
    } catch {
      return { payload: {}, records: [] };
    }
  }

  function appendActivity(activity) {
    const state = loadState();
    if (!isString(activity.eventId)) return null;
    const prior = state.records;
    const existing = prior.find((record) => record.eventId === activity.eventId);
    if (existing) return existing;

    const records = buildRewardRecords(activity, prior);
    const record = records[0];
    try {
      storage.setItem(MATH_REWARD_STORAGE_KEY, JSON.stringify({
        ...state.payload,
        rewardLedger: [...prior, ...records],
      }));
    } catch {
      // Keep the Math Trainer playable if localStorage is unavailable or full.
      return null;
    }
    dispatchRewardUpdate();
    return record;
  }

  function awardRun(input) {
    if (!isObject(input) || input.completed !== true || !isString(input.runId)) return null;
    const modes = new Set(["test80", "blitz", "limitless", "drill"]);
    if (!modes.has(input.mode)) return null;

    const attempted = finite(input.attempted) ? Math.floor(input.attempted) : 0;
    // A test is an assessment only after meeting its existing 60-answer gate.
    // Other run modes need at least ten non-skip answers to count as completed work.
    if (input.mode === "test80") {
      if (attempted < 60 || input.qualifying !== true) return null;
    } else if (attempted < 10) {
      return null;
    }

    const tierId = isString(input.tier) ? input.tier : (isString(input.topTier) ? input.topTier : "open-ended");
    const difficulty = tierDifficulty(input.tierIndex);
    const activityClass = input.mode === "test80"
      ? "assessment"
      : input.mode === "drill"
        ? "focused-practice"
        : "standard-task";
    const focus = Array.isArray(input.drillSkills)
      ? [...new Set(input.drillSkills.filter(isString))].sort().join("+")
      : "";
    const itemId = input.mode === "drill"
      ? "math-run:drill:" + tierId + ":" + (focus || "general")
      : "math-run:" + input.mode + ":" + tierId;
    const checkpointId = input.mode !== "drill" && input.qualifying === true && input.cleared === true
      ? "math-tier-clear:" + tierId
      : null;
    const ts = finite(input.completedAt) && input.completedAt > 0
      ? Math.round(input.completedAt)
      : Math.round(now());

    return appendActivity({
      eventId: "math-trainer:run:" + input.runId,
      moduleId: MATH_REWARD_MODULE_ID,
      itemId,
      ts,
      activityClass,
      difficulty,
      completionEvidence: "completed-" + input.mode + "-run",
      completed: true,
      quality: finite(input.accuracy) ? clamp(input.accuracy, 0, 1) : 0,
      passed: checkpointId !== null,
      checkpointId,
    });
  }

  function awardTrickPhase(input) {
    if (!isObject(input) || input.completed !== true || input.verified !== true) return null;
    if (!isString(input.runId) || !isString(input.trickId)) return null;
    if (!["baseline", "practice", "post"].includes(input.phase)) return null;
    const attempted = finite(input.attempted) ? Math.floor(input.attempted) : 0;
    const skipped = finite(input.skipped) ? Math.floor(input.skipped) : 0;
    const questionCount = finite(input.questionCount) ? Math.floor(input.questionCount) : 0;
    const requiredCount = finite(input.requiredCount) ? Math.floor(input.requiredCount) : 0;
    if (requiredCount <= 0 || questionCount <= 0 || questionCount > requiredCount ||
        attempted <= 0 || skipped < 0 || attempted + skipped !== questionCount) return null;
    if (input.phase === "baseline" || input.phase === "post") {
      // Match the app's paired-assessment rule: every expected question, no skips.
      if (questionCount !== requiredCount || attempted !== requiredCount || skipped !== 0) return null;
    } else if (attempted < Math.ceil(requiredCount / 2)) {
      // Match Trick Chamber practice's existing minimum: at least half answered.
      return null;
    }

    const firstMastery = input.phase === "post" && input.firstMastery === true;
    const checkpointId = firstMastery ? "math-trick-mastery:" + input.trickId : null;
    const ts = finite(input.completedAt) && input.completedAt > 0
      ? Math.round(input.completedAt)
      : Math.round(now());

    return appendActivity({
      eventId: "math-trainer:trick:" + input.runId,
      moduleId: MATH_REWARD_MODULE_ID,
      itemId: "math-trick:" + input.trickId + ":" + input.phase,
      ts,
      activityClass: input.phase === "practice" ? "focused-practice" : "assessment",
      difficulty: "intermediate",
      completionEvidence: "verified-trick-" + input.phase,
      completed: true,
      quality: finite(input.accuracy) ? clamp(input.accuracy, 0, 1) : 0,
      passed: firstMastery,
      checkpointId,
    });
  }

  function getRecords() {
    return loadState().records;
  }

  return { awardRun, awardTrickPhase, getRecords };
}

// Browser convenience API; game.js has a dynamic-import fallback in case module
// execution has not finished when an unusually fast session ends.
if (typeof window !== "undefined") {
  try {
    window.LimitlessMathRewards = createMathRewardAdapter(window.localStorage);
  } catch {
    window.LimitlessMathRewards = null;
  }
}
