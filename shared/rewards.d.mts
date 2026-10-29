export type ActivityClass =
  | "micro-practice"
  | "standard-task"
  | "focused-practice"
  | "assessment"
  | "unit-milestone"
  | "major-completion"
  | "bespoke-project";
export type DifficultyTier = "foundational" | "intermediate" | "advanced";
export type RewardRecord = {
  policyVersion: "LSR-1";
  eventId: string;
  moduleId: string;
  itemId: string;
  ts: number;
  activityClass: ActivityClass;
  difficulty: DifficultyTier;
  completionEvidence: string;
  completed: boolean;
  eligible: boolean;
  reason: string;
  countsTowardRepeatCap: boolean;
  repeatOrdinal: number;
  baseExp: number;
  difficultyMultiplier: number;
  qualityBonus: number;
  passBonus: number;
  totalExp: number;
  checkpointId: string | null;
};
export type RewardInput = {
  eventId: string;
  moduleId: string;
  itemId: string;
  ts: number;
  activityClass: ActivityClass;
  difficulty: DifficultyTier;
  completionEvidence: string;
  completed: boolean;
  quality?: number;
  passed?: boolean;
  checkpointId?: string | null;
  assignedBaseExp?: number;
};
export const REWARD_POLICY_VERSION: "LSR-1";
export const ACTIVITY_BASE_EXP: Readonly<Record<Exclude<ActivityClass, "bespoke-project">, number>>;
export const DIFFICULTY_MULTIPLIER: Readonly<Record<DifficultyTier, number>>;
export const REPEAT_POLICY: Readonly<{ fullAwardsPerItemPerDay: number; laterRepeatExp: 0 }>;
export const CHECKPOINT_PASS_THRESHOLD: number;
export const QUALITY_BONUS_CAP: number;
export const REWARD_SOURCE_REGISTRY: readonly { moduleId: string; label: string; storageKey: string; shape: "rewardLedger" }[];
export function localDayKey(timestamp: number): string;
export function sanitiseRewardRecord(value: unknown): RewardRecord | null;
export function sanitiseRewardRecords(raw: unknown): RewardRecord[];
export function calculateReward(input: RewardInput, priorRecords?: readonly RewardRecord[]): RewardRecord;
export function levelForExp(value: number): { level: number; currentLevelStart: number; nextLevelAt: number; xpIntoLevel: number; xpForNextLevel: number; xpToNextLevel: number; progressPct: number };
export function summariseRewards(records: readonly RewardRecord[]): { totalExp: number; awardCount: number; recordCount: number; level: ReturnType<typeof levelForExp>; byModule: { moduleId: string; exp: number; awards: number }[]; recentAwards: RewardRecord[] };
export function readGlobalRewardSummary(storage: { getItem(key: string): string | null }): ReturnType<typeof summariseRewards> & { sources: { moduleId: string; label: string; exp: number; awards: number }[]; registeredModules: { moduleId: string; label: string }[] };
export function dispatchRewardUpdate(): void;
