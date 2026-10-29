/**
 * Limitless Standard Rewards, version 1 (LSR-1).
 * Pure, shared policy: modules submit verified evidence; this file assigns EXP.
 * It deliberately does not read/write storage and does not calculate mastery.
 */

export const REWARD_POLICY_VERSION = "LSR-1";

export const ACTIVITY_BASE_EXP = Object.freeze({
  "micro-practice": 5,
  "standard-task": 10,
  "focused-practice": 20,
  assessment: 25,
  "unit-milestone": 50,
  "major-completion": 100,
});

export const DIFFICULTY_MULTIPLIER = Object.freeze({
  foundational: 1,
  intermediate: 1.25,
  advanced: 1.5,
});

/** Provisional repeat policy: three full-value completions per item per local day. */
export const REPEAT_POLICY = Object.freeze({
  fullAwardsPerItemPerDay: 3,
  laterRepeatExp: 0,
});

/** Provisional threshold; calibrate from real study sessions before treating it as permanent. */
export const CHECKPOINT_PASS_THRESHOLD = 0.7;
export const QUALITY_BONUS_CAP = 0.2;

export const REWARD_SOURCE_REGISTRY = Object.freeze([
  {
    moduleId: "probability",
    label: "Probability",
    storageKey: "hc3-progress-v3",
    shape: "rewardLedger",
  },
]);

const ACTIVITY_CLASSES = new Set([...Object.keys(ACTIVITY_BASE_EXP), "bespoke-project"]);
const DIFFICULTY_TIERS = new Set(Object.keys(DIFFICULTY_MULTIPLIER));

const isRecord = (value) =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const isString = (value) => typeof value === "string" && value.trim().length > 0;
const isFiniteNumber = (value) => typeof value === "number" && Number.isFinite(value);
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export function localDayKey(timestamp) {
  const d = new Date(timestamp);
  if (!Number.isFinite(d.getTime())) return "";
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("-");
}

export function sanitiseRewardRecord(value) {
  if (!isRecord(value)) return null;
  if (value.policyVersion !== REWARD_POLICY_VERSION) return null;
  if (!isString(value.eventId) || !isString(value.moduleId) || !isString(value.itemId)) return null;
  if (!isFiniteNumber(value.ts) || value.ts <= 0) return null;
  if (!isString(value.activityClass) || !ACTIVITY_CLASSES.has(value.activityClass)) return null;
  if (!isString(value.difficulty) || !DIFFICULTY_TIERS.has(value.difficulty)) return null;
  if (!isFiniteNumber(value.totalExp) || value.totalExp < 0) return null;
  if (!isFiniteNumber(value.baseExp) || value.baseExp < 0) return null;
  if (!isFiniteNumber(value.difficultyMultiplier) || value.difficultyMultiplier <= 0) return null;
  if (typeof value.eligible !== "boolean" || typeof value.countsTowardRepeatCap !== "boolean") return null;

  const exp = (candidate) => isFiniteNumber(candidate) && candidate >= 0 ? Math.round(candidate) : 0;
  return {
    policyVersion: REWARD_POLICY_VERSION,
    eventId: value.eventId,
    moduleId: value.moduleId,
    itemId: value.itemId,
    ts: Math.round(value.ts),
    activityClass: value.activityClass,
    difficulty: value.difficulty,
    completionEvidence: isString(value.completionEvidence) ? value.completionEvidence : "unspecified",
    completed: value.completed === true,
    eligible: value.eligible,
    reason: isString(value.reason) ? value.reason : (value.eligible ? "awarded" : "not-eligible"),
    countsTowardRepeatCap: value.countsTowardRepeatCap,
    repeatOrdinal: Math.max(0, Math.round(isFiniteNumber(value.repeatOrdinal) ? value.repeatOrdinal : 0)),
    baseExp: Math.round(value.baseExp),
    difficultyMultiplier: value.difficultyMultiplier,
    qualityBonus: exp(value.qualityBonus),
    passBonus: exp(value.passBonus),
    totalExp: exp(value.totalExp),
    checkpointId: isString(value.checkpointId) ? value.checkpointId : null,
  };
}

export function sanitiseRewardRecords(raw) {
  if (!Array.isArray(raw)) return [];
  const seen = new Set();
  const valid = [];
  for (const item of raw) {
    const record = sanitiseRewardRecord(item);
    if (!record || seen.has(record.eventId)) continue;
    seen.add(record.eventId);
    valid.push(record);
  }
  return valid;
}

/**
 * Deterministic award calculation. A completed activity is counted even when a
 * daily repeat cap makes its EXP award zero. Duplicate event IDs never award twice.
 */
export function calculateReward(input, priorRecords = []) {
  const ts = isFiniteNumber(input?.ts) ? Math.round(input.ts) : 0;
  const activityClass = input?.activityClass;
  const difficulty = input?.difficulty;
  const moduleId = isString(input?.moduleId) ? input.moduleId : "";
  const eventId = isString(input?.eventId) ? input.eventId : "";
  const itemId = isString(input?.itemId) ? input.itemId : "";
  const completed = input?.completed === true;
  const evidence = isString(input?.completionEvidence) ? input.completionEvidence : "unspecified";
  const checkpointId = isString(input?.checkpointId) ? input.checkpointId : null;
  const quality = isFiniteNumber(input?.quality) ? clamp(input.quality, 0, 1) : 0;

  const assignedProjectBase = isFiniteNumber(input?.assignedBaseExp)
    ? clamp(Math.round(input.assignedBaseExp), 20, 100)
    : null;
  const isProject = activityClass === "bespoke-project";
  const baseExp = isProject ? (assignedProjectBase ?? 0) : (ACTIVITY_BASE_EXP[activityClass] ?? 0);
  const multiplier = DIFFICULTY_MULTIPLIER[difficulty] ?? 1;
  const prior = sanitiseRewardRecords(priorRecords);
  const duplicate = eventId !== "" && prior.some((r) => r.eventId === eventId);
  const day = ts > 0 ? localDayKey(ts) : "";
  const repeatCount = moduleId && itemId && day
    ? prior.filter((r) => r.moduleId === moduleId && r.itemId === itemId && localDayKey(r.ts) === day && r.countsTowardRepeatCap).length
    : 0;
  const repeatOrdinal = repeatCount + 1;
  const validActivityClass = isProject
    ? assignedProjectBase !== null
    : ACTIVITY_CLASSES.has(activityClass);
  const basicValid =
    isString(moduleId) && isString(eventId) && isString(itemId) && ts > 0 &&
    isString(activityClass) && validActivityClass &&
    isString(difficulty) && DIFFICULTY_TIERS.has(difficulty) && isString(evidence);

  let eligible = false;
  let reason = "invalid-activity";
  let countsTowardRepeatCap = false;
  let qualityBonus = 0;
  let passBonus = 0;
  let totalExp = 0;

  if (basicValid && duplicate) {
    reason = "duplicate-event";
  } else if (basicValid && !completed) {
    reason = "incomplete";
  } else if (basicValid && repeatOrdinal > REPEAT_POLICY.fullAwardsPerItemPerDay) {
    reason = "daily-repeat-cap";
    countsTowardRepeatCap = true;
  } else if (basicValid) {
    eligible = true;
    reason = "awarded";
    countsTowardRepeatCap = true;
    qualityBonus = Math.round(baseExp * QUALITY_BONUS_CAP * clamp((quality - CHECKPOINT_PASS_THRESHOLD) / (1 - CHECKPOINT_PASS_THRESHOLD), 0, 1));
    if (input?.passed === true && checkpointId) {
      const checkpointPreviouslyPassed = prior.some((r) => r.moduleId === moduleId && r.checkpointId === checkpointId && r.passBonus > 0);
      if (!checkpointPreviouslyPassed) passBonus = 15;
    }
    totalExp = Math.round(baseExp * multiplier + qualityBonus) + passBonus;
  }

  return sanitiseRewardRecord({
    policyVersion: REWARD_POLICY_VERSION,
    eventId: eventId || ("invalid-" + String(ts)),
    moduleId: moduleId || "unknown",
    itemId: itemId || "unknown",
    ts,
    activityClass: ACTIVITY_CLASSES.has(activityClass) || isProject ? activityClass : "micro-practice",
    difficulty: DIFFICULTY_TIERS.has(difficulty) ? difficulty : "foundational",
    completionEvidence: evidence,
    completed,
    eligible,
    reason,
    countsTowardRepeatCap,
    repeatOrdinal,
    baseExp: Math.max(0, baseExp),
    difficultyMultiplier: multiplier,
    qualityBonus,
    passBonus,
    totalExp,
    checkpointId,
  }) ?? {
    policyVersion: REWARD_POLICY_VERSION,
    eventId: eventId || ("invalid-" + String(Date.now())),
    moduleId: moduleId || "unknown",
    itemId: itemId || "unknown",
    ts: Math.max(1, ts),
    activityClass: "micro-practice",
    difficulty: "foundational",
    completionEvidence: evidence,
    completed: false,
    eligible: false,
    reason: "invalid-activity",
    countsTowardRepeatCap: false,
    repeatOrdinal: 0,
    baseExp: 0,
    difficultyMultiplier: 1,
    qualityBonus: 0,
    passBonus: 0,
    totalExp: 0,
    checkpointId: null,
  };
}

export function levelForExp(value) {
  const exp = Math.max(0, Math.floor(isFiniteNumber(value) ? value : 0));
  let level = 1;
  let currentLevelStart = 0;
  let required = 100;
  while (exp >= currentLevelStart + required && level < 100000) {
    currentLevelStart += required;
    level += 1;
    required = 100 + 25 * (level - 1);
  }
  const nextLevelAt = currentLevelStart + required;
  return {
    level,
    currentLevelStart,
    nextLevelAt,
    xpIntoLevel: exp - currentLevelStart,
    xpForNextLevel: required,
    xpToNextLevel: Math.max(0, nextLevelAt - exp),
    progressPct: Math.round(clamp((exp - currentLevelStart) / required, 0, 1) * 100),
  };
}

export function summariseRewards(records) {
  const valid = sanitiseRewardRecords(records);
  const byModule = new Map();
  for (const record of valid) {
    if (record.totalExp <= 0 || !record.eligible) continue;
    const old = byModule.get(record.moduleId) ?? { moduleId: record.moduleId, exp: 0, awards: 0 };
    old.exp += record.totalExp;
    old.awards += 1;
    byModule.set(record.moduleId, old);
  }
  const awarded = valid.filter((record) => record.totalExp > 0 && record.eligible);
  const totalExp = awarded.reduce((sum, record) => sum + record.totalExp, 0);
  return {
    totalExp,
    awardCount: awarded.length,
    level: levelForExp(totalExp),
    byModule: [...byModule.values()].sort((a, b) => b.exp - a.exp),
    recentAwards: [...awarded].sort((a, b) => b.ts - a.ts).slice(0, 20),
    recordCount: valid.length,
  };
}

/** Read only explicitly registered LSR-1 module roots; never count legacy local XP. */
export function readGlobalRewardSummary(storage) {
  const all = [];
  const sources = [];
  for (const source of REWARD_SOURCE_REGISTRY) {
    let payload;
    try {
      const raw = storage?.getItem(source.storageKey);
      if (!raw) continue;
      payload = JSON.parse(raw);
    } catch {
      continue;
    }
    if (!isRecord(payload)) continue;
    const records = sanitiseRewardRecords(payload.rewardLedger).filter((r) => r.moduleId === source.moduleId);
    all.push(...records);
    sources.push({
      moduleId: source.moduleId,
      label: source.label,
      exp: records.filter((r) => r.eligible && r.totalExp > 0).reduce((n, r) => n + r.totalExp, 0),
      awards: records.filter((r) => r.eligible && r.totalExp > 0).length,
    });
  }
  const summary = summariseRewards(all);
  return { ...summary, sources, registeredModules: REWARD_SOURCE_REGISTRY.map(({ moduleId, label }) => ({ moduleId, label })) };
}

export function dispatchRewardUpdate() {
  if (typeof window !== "undefined" && typeof window.dispatchEvent === "function") {
    window.dispatchEvent(new Event("limitless:rewards-updated"));
  }
}
