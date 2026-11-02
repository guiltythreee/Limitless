import type { RewardUnlock } from "../rewards.mjs";
export type MetaStatus = {
  totalExp: number;
  level: number;
  xpIntoLevel: number;
  xpForNextLevel: number;
  xpToNextLevel: number;
  progressPct: number;
  nextReward: RewardUnlock | null;
  equipped: string[];
  equippedEffect: string | null;
  pendingNotifications: number;
};
export function readMetaStatus(storage: { getItem(key: string): string | null }): MetaStatus;
