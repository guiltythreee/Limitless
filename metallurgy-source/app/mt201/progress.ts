import { sanitiseRewardRecords, type RewardRecord } from "../../../shared/rewards.mjs";
import {
  appendLsrActivity,
  announceLsrRewardWrite,
  assessmentActivity,
  difficultyTier,
  questionActivity,
  type AssessmentInput,
  type LsrActivityMode,
} from "./lsr1-rewards";

// Browser-local progress for the MT201 archive. Same shape as the shared
// MT202 store, but its own key so the two courses never tangle.
// Progress: mm-mt201-v1. Theme stays shared: mm-theme-v1.

export type QState = { choice: string; correct: boolean; at: number };

export type Progress = {
  answered: Record<string, QState>; // key: "ch01-q12"
  examBest: { score: number; total: number; at: number } | null;
  /** Additive LSR-1 lifetime ledger. Absent on legacy saves, normalised to []. */
  rewardLedger: RewardRecord[];
};

const KEY = "mm-mt201-v1";
const THEME_KEY = "mm-theme-v1";

export function qid(chapterId: string, n: number) {
  return `${chapterId}-q${n}`;
}

export function loadProgress(): Progress {
  if (typeof window === "undefined") return { answered: {}, examBest: null, rewardLedger: [] };
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { answered: {}, examBest: null, rewardLedger: [] };
    const p = JSON.parse(raw) as Progress;
    return {
      answered: p.answered ?? {},
      examBest: p.examBest ?? null,
      rewardLedger: sanitiseRewardRecords(p.rewardLedger),
    };
  } catch {
    return { answered: {}, examBest: null };
  }
}

export function saveProgress(p: Progress, notifyMeta = false) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(p));
    if (notifyMeta) announceLsrRewardWrite();
  } catch {
    /* storage unavailable — progress just won't persist */
  }
}

export function recordAnswer(
  p: Progress,
  key: string,
  choice: string,
  correct: boolean,
  mode: LsrActivityMode = "practice",
  difficulty = 1,
): Progress {
  const at = Date.now();
  const fresh = p.answered[key] === undefined;
  let next: Progress = {
    ...p,
    answered: { ...p.answered, [key]: { choice, correct, at } },
  };
  if (fresh && mode === "practice") {
    const input = { ...questionActivity("metallurgy-mt201", key, at, correct), difficulty: difficultyTier(difficulty) };
    next = appendLsrActivity(next, input).progress;
    saveProgress(next, true);
  } else {
    saveProgress(next);
  }
  return next;
}

/** Save the completed exam snapshot once; individual exam answers do not pay LSR-1. */
export function recordExamAssessment(p: Progress, input: AssessmentInput): Progress {
  const activity = assessmentActivity("metallurgy-mt201", input);
  const next = activity ? appendLsrActivity(p, activity).progress : p;
  saveProgress(next, Boolean(activity));
  return next;
}

export function resetProgress() {
  const saved = loadProgress();
  saveProgress({ answered: {}, examBest: null, rewardLedger: saved.rewardLedger });
}

export function loadTheme(): "dark" | "light" {
  if (typeof window === "undefined") return "dark";
  try {
    return window.localStorage.getItem(THEME_KEY) === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
}

export function saveTheme(t: "dark" | "light") {
  try {
    window.localStorage.setItem(THEME_KEY, t);
  } catch {
    /* ignore */
  }
}
