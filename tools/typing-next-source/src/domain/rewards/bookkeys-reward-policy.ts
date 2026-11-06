// @ts-expect-error Shared LSR-1 policy is intentionally maintained as plain JavaScript.
import {
  buildRewardRecords,
  sanitiseRewardRecords,
  dispatchRewardUpdate,
} from "../../../../../shared/rewards.mjs";
import type { RewardPolicy } from "./bookkeys-reward-adapter";

export const bookkeysRewardPolicy: RewardPolicy = {
  buildRewardRecords: (activity, prior) => buildRewardRecords(activity, prior),
  sanitiseRewardRecords: (raw) => sanitiseRewardRecords(raw),
  dispatchRewardUpdate: () => dispatchRewardUpdate(),
};
