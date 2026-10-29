import {
  calculateReward,
  dispatchRewardUpdate,
  sanitiseRewardRecords,
  type DifficultyTier,
  type RewardInput,
  type RewardRecord,
} from "../../../shared/rewards.mjs";

export type LsrModuleId = "metallurgy-mt201" | "metallurgy-mt202" | "metallurgy-mt203";
export type LsrProgress = { rewardLedger?: unknown };
export type LsrActivityMode = "practice" | "exam";

export function difficultyTier(raw: number | undefined): DifficultyTier {
  if (raw === 4 || raw === 3) return "advanced";
  if (raw === 2) return "intermediate";
  return "foundational";
}

export function appendLsrActivity<P extends LsrProgress>(
  progress: P,
  input: RewardInput,
): { progress: P & { rewardLedger: RewardRecord[] }; record: RewardRecord } {
  const previous = sanitiseRewardRecords(progress.rewardLedger);
  const record = calculateReward(input, previous);
  return {
    progress: { ...progress, rewardLedger: [...previous, record] },
    record,
  };
}

export function questionActivity(
  moduleId: LsrModuleId,
  questionId: string,
  ts: number,
  correct: boolean,
  sequence = 0,
  difficulty = 1,
): RewardInput {
  return {
    eventId: moduleId + ":answer:" + questionId + ":" + ts + ":" + sequence,
    moduleId,
    itemId: "question:" + questionId,
    ts,
    activityClass: "micro-practice",
    difficulty: difficultyTier(difficulty),
    completionEvidence: "submitted-metallurgy-answer",
    completed: true,
    quality: correct ? 1 : 0,
  };
}

export type AssessmentInput = {
  runId: string;
  ts: number;
  total: number;
  answered: number;
  correct: number;
};

export function assessmentActivity(moduleId: LsrModuleId, input: AssessmentInput): RewardInput | null {
  const total = Number.isFinite(input.total) ? Math.floor(input.total) : 0;
  const answered = Number.isFinite(input.answered) ? Math.floor(input.answered) : 0;
  const correct = Number.isFinite(input.correct) ? Math.floor(input.correct) : -1;
  if (!input.runId || total <= 0 || answered < Math.ceil(total / 2) ||
      answered > total || correct < 0 || correct > answered) return null;
  return {
    eventId: moduleId + ":assessment:" + input.runId,
    moduleId,
    // Stable per-course item means repeated test launches cannot evade the daily repeat cap.
    itemId: "assessment:" + moduleId,
    ts: Number.isFinite(input.ts) && input.ts > 0 ? Math.round(input.ts) : Date.now(),
    activityClass: "assessment",
    difficulty: total >= 25 ? "advanced" : "intermediate",
    completionEvidence: "completed-metallurgy-assessment",
    completed: true,
    quality: correct / total,
  };
}

/** Announce only after the containing module has successfully written its progress root. */
export function announceLsrRewardWrite(): void {
  dispatchRewardUpdate();
}
