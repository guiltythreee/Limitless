export type RewardActivityClass =
  | "micro-practice"
  | "standard-task"
  | "focused-practice"
  | "assessment"
  | "milestone"
  | "course-completion";

export type RewardDifficulty = "foundational" | "intermediate" | "advanced";

export type GlobalRewardInput = {
  module: string;
  eventId: string;
  contentKey: string;
  activityClass: RewardActivityClass;
  difficulty?: RewardDifficulty;
  quality?: number;
  passed?: boolean;
  passKey?: string;
  oneTimeKey?: string;
};

export type GlobalRewardReceipt = {
  ok: boolean;
  xp: number;
  duplicate?: boolean;
  error?: string;
  totalXp?: number;
  level?: number;
};

export type RewardSummary = {
  standard: string;
  xp: number;
  level: number;
  xpIntoLevel: number;
  xpForNextLevel: number;
  nextLevelAt: number;
  progress: number;
  awardCount: number;
  countsByModule?: Record<string, number>;
  available?: boolean;
};

export type GlobalRewardApi = {
  STORAGE_KEY: string;
  record: (input: GlobalRewardInput) => GlobalRewardReceipt;
  recordMany: (inputs: GlobalRewardInput[]) => GlobalRewardReceipt[];
  summary: () => RewardSummary;
};

declare global {
  interface Window {
    LimitlessRewards?: GlobalRewardApi;
  }
}

export {};
