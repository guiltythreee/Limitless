export type RewardActivityClass =
  | "micro-practice"
  | "standard-task"
  | "focused-practice"
  | "assessment"
  | "milestone"
  | "course-completion"
  | "bespoke-project";

export type RewardDifficulty = "foundational" | "intermediate" | "advanced";
export type RewardEvidence =
  | "submitted-answer"
  | "completed-session"
  | "typed-page"
  | "scored-assessment"
  | "topic-mastery"
  | "unit-mastery"
  | "milestone-complete"
  | "pathway-complete"
  | "project-complete";

export type GlobalRewardInput = {
  module: string;
  eventId: string;
  contentKey: string;
  activityClass: RewardActivityClass;
  evidence: RewardEvidence;
  reason?: string;
  difficulty?: RewardDifficulty;
  quality?: number;
  passed?: boolean;
  passKey?: string;
  oneTimeKey?: string;
  projectId?: string;
  projectBaseExp?: number;
};

export type RegisteredProject = {
  id: string;
  module: string;
  baseExp: number;
  title: string;
  scope: string;
  criteria: string;
  registeredAt: number;
  version: string;
};

export type RegisterProjectInput = {
  module: string;
  projectId: string;
  baseExp: number;
  title: string;
  scope: string;
  criteria: string;
};

export type RewardAwardLine = {
  id: string;
  module: string;
  contentKey: string;
  activityClass: string;
  evidence: string;
  difficulty: RewardDifficulty;
  baseExp: number;
  difficultyMultiplier: number;
  quality: number | null;
  qualityBonus: number;
  repeatMultiplier: number;
  xp: number;
  timestamp: number;
  version: string;
  reason?: string;
  bonusType?: string | null;
};

export type GlobalRewardReceipt = {
  ok: boolean;
  xp: number;
  duplicate?: boolean;
  error?: string;
  totalXp?: number;
  level?: number;
};

export type RewardUnlock = {
  level: number;
  id: string;
  name: string;
  kind: "title" | "emblem" | "profile-effect";
  description: string;
};

export type RewardAchievement = {
  id: string;
  module: string;
  contentKey: string;
  activityClass: string;
  evidence: string;
  xp: number;
  timestamp: number;
  reason: string;
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
  xpByModule?: Record<string, number>;
  registeredProjects?: RegisteredProject[];
  disciplineAchievements?: RewardAchievement[];
  recentAwards?: RewardAwardLine[];
  unlockedRewards?: RewardUnlock[];
  nextReward?: RewardUnlock | null;
  equippedTitle?: RewardUnlock | null;
  equippedEmblem?: RewardUnlock | null;
  equippedProfileEffect?: RewardUnlock | null;
  available?: boolean;
};

export type GlobalRewardApi = {
  STORAGE_KEY: string;
  REWARD_UNLOCKS: RewardUnlock[];
  record: (input: GlobalRewardInput) => GlobalRewardReceipt;
  recordMany: (inputs: GlobalRewardInput[]) => GlobalRewardReceipt[];
  registerProject: (input: RegisterProjectInput) => { ok: boolean; duplicate?: boolean; error?: string; project?: RegisteredProject };
  equipReward: (rewardId: string, kind: "title" | "emblem" | "profile-effect") => { ok: boolean; error?: string; summary?: RewardSummary };
  read: () => { totalXp: number; awards: Array<{ id: string; x: number; m?: string; c?: string; a?: string; e?: string }> };
  summary: () => RewardSummary;
};

declare global {
  interface Window {
    LimitlessRewards?: GlobalRewardApi;
  }
}

export {};
