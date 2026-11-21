import type { RewardInput, RewardRecord } from "./rewards.mjs";

export interface LedgerAdapter {
  /** `created` is true for a new award, false for an idempotent repeat; null if invalid or storage failed. */
  award(activity: Omit<RewardInput, "moduleId"> & { moduleId?: string }): (RewardRecord & { created: boolean }) | null;
  getRecords(): RewardRecord[];
}
export function createLedgerAdapter(
  storage: { getItem(key: string): string | null; setItem(key: string, value: string): void },
  options: { moduleId: string; storageKey: string },
): LedgerAdapter;
