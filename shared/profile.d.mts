import type { RewardUnlock } from "./rewards.mjs";

export const PROFILE_EQUIPMENT_STORAGE_KEY: string;
export function readEquippedRewards(
  storage: { getItem(key: string): string | null },
  level: number,
): { title: RewardUnlock | null; emblem: RewardUnlock | null; effect: RewardUnlock | null };
export function equipReward(
  storage: { getItem(key: string): string | null; setItem(key: string, value: string): void },
  rewardId: string,
  level: number,
): { ok: true; duplicate?: boolean; reward: RewardUnlock; equipped: ReturnType<typeof readEquippedRewards> } | { ok: false; error: string };
export function unequipReward(
  storage: { getItem(key: string): string | null; setItem(key: string, value: string): void },
  slot: "title" | "emblem" | "effect",
): { ok: true; duplicate?: boolean } | { ok: false; error: string };
