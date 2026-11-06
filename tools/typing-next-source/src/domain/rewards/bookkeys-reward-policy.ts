import {
  buildRewardRecords,
  sanitiseRewardRecords,
  dispatchRewardUpdate,
} from "../../../../../shared/rewards.mjs";
import type { RewardPolicy } from "./bookkeys-reward-adapter";

// The shared LSR-1 policy is JavaScript by design; this adapter supplies its
// runtime functions to the typed Bookkeys persistence boundary.
// @ts-expect-error Shared policy module is maintained as plain JavaScript.
const sharedPolicy = { buildRewardRecords, sanitiseRewardRecords, dispatchRewardUpdate };

export const bookkeysRewardPolicy: RewardPolicy = {
  buildRewardRecords: (activity, prior) => sharedPolicy.buildRewardRecords(activity, prior),
  sanitiseRewardRecords: (raw) => sharedPolicy.sanitiseRewardRecords(raw),
  dispatchRewardUpdate: () => sharedPolicy.dispatchRewardUpdate(),
};
