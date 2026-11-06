import {
  buildRewardRecords,
  sanitiseRewardRecords,
  dispatchRewardUpdate,
} from "../../../../../shared/rewards.mjs";
import type { RewardPolicy } from "./bookkeys-reward-adapter";

export const bookkeysRewardPolicy: RewardPolicy = {
  // The adapter injects validated activityClass/difficulty from its evidence
  // rule immediately before calling the shared policy.
  buildRewardRecords: (activity, prior) =>
    buildRewardRecords(activity as Parameters<typeof buildRewardRecords>[0], prior),
  sanitiseRewardRecords: (raw) => sanitiseRewardRecords(raw),
  dispatchRewardUpdate: () => dispatchRewardUpdate(),
};
