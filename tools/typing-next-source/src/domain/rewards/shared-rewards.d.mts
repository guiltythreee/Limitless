export type ActivityClass =
  | "micro-practice"
  | "standard-task"
  | "focused-practice"
  | "assessment"
  | "unit-milestone"
  | "major-completion"
  | "bespoke-project";
export type Difficulty = "foundational" | "intermediate" | "advanced";

export interface RewardInput {
  eventId: string;
  moduleId: string;
  itemId: string;
  ts?: number;
  activityClass: ActivityClass;
  difficulty: Difficulty;
  completionEvidence?: string;
  completed?: boolean;
  quality?: number;
  passed?: boolean;
  checkpointId?: string;
  assignedBaseExp?: number;
  [key: string]: unknown;
}

export interface RewardRecord {
  readonly policyVersion: string;
  readonly eventId: string;
  readonly moduleId: string;
  readonly itemId: string;
  readonly ts: number;
  readonly activityClass: ActivityClass;
  readonly difficulty: Difficulty;
  readonly completionEvidence: string;
  readonly completed: boolean;
  readonly eligible: boolean;
  readonly reason: string;
  readonly countsTowardRepeatCap: boolean;
  readonly repeatOrdinal: number;
  readonly baseExp: number;
  readonly difficultyMultiplier: number;
  readonly qualityBonus: number;
  readonly passBonus: number;
  readonly totalExp: number;
  readonly checkpointId: string | null;
  readonly [key: string]: unknown;
}

export function buildRewardRecords(
  input: RewardInput,
  priorRecords?: readonly RewardRecord[],
): RewardRecord[];
export function sanitiseRewardRecords(raw: unknown): RewardRecord[];
export interface GlobalRewardSummary {
  readonly totalExp: number;
  readonly awardCount: number;
  readonly recordCount: number;
  readonly level: {
    readonly level: number;
    readonly currentLevelStart: number;
    readonly nextLevelAt: number;
    readonly xpIntoLevel: number;
    readonly xpForNextLevel: number;
    readonly xpToNextLevel: number;
    readonly progressPct: number;
  };
}
export function readGlobalRewardSummary(storage: { getItem(key: string): string | null }): GlobalRewardSummary;
export function dispatchRewardUpdate(): void;
