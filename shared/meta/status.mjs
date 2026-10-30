import { readGlobalRewardSummary } from "../rewards.mjs";
import { readEquippedRewards } from "../profile.mjs";
import { LEVEL_NOTIFICATION_STORAGE_KEY } from "../level-notifications.mjs";

/**
 * Read-only snapshot for the shared in-app Meta surface.
 * It deliberately does not initialise notification history or write to any ledger.
 */
export function readMetaStatus(storage) {
  const summary = readGlobalRewardSummary(storage);
  const level = summary.level.level;
  const equipped = readEquippedRewards(storage, level);
  let pendingNotifications = 0;
  try {
    const raw = storage?.getItem(LEVEL_NOTIFICATION_STORAGE_KEY);
    const payload = raw ? JSON.parse(raw) : null;
    if (payload && Array.isArray(payload.notifications)) {
      pendingNotifications = payload.notifications.filter(
        (notice) => notice && Number.isInteger(notice.level) && notice.level >= 2 && notice.acknowledgedAt == null
      ).length;
    }
  } catch {
    // A malformed notification record must not prevent the progression summary rendering.
  }
  return {
    totalExp: summary.totalExp,
    level,
    xpIntoLevel: summary.level.xpIntoLevel,
    xpForNextLevel: summary.level.xpForNextLevel,
    xpToNextLevel: summary.level.xpToNextLevel,
    progressPct: summary.level.progressPct,
    nextReward: summary.nextReward,
    equipped: Object.values(equipped).filter(Boolean).map((reward) => reward.name),
    pendingNotifications,
  };
}
