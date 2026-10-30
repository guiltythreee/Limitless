import {
  dispatchRewardUpdate,
  unlockedRewardsForLevel,
} from "./rewards.mjs";

export const PROFILE_EQUIPMENT_STORAGE_KEY = "limitless.profile-equipment.v1";
const EQUIPMENT_SLOTS = new Set(["title", "emblem", "effect"]);

function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readPayload(storage) {
  try {
    const raw = storage?.getItem(PROFILE_EQUIPMENT_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return isRecord(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

/** Read equipment without writing or changing lifetime EXP. */
export function readEquippedRewards(storage, level) {
  const payload = readPayload(storage);
  const slots = isRecord(payload.slots) ? payload.slots : {};
  const unlocked = unlockedRewardsForLevel(level);
  const result = { title: null, emblem: null, effect: null };
  for (const slot of EQUIPMENT_SLOTS) {
    const id = typeof slots[slot] === "string" ? slots[slot] : "";
    const item = unlocked.find((reward) => reward.id === id && reward.slot === slot);
    if (item) result[slot] = item;
  }
  return result;
}

export function equipReward(storage, rewardId, level) {
  if (!storage || typeof storage.getItem !== "function" || typeof storage.setItem !== "function") {
    return { ok: false, error: "storage-unavailable" };
  }
  if (typeof rewardId !== "string" || !rewardId.trim()) return { ok: false, error: "invalid-reward-id" };
  const reward = unlockedRewardsForLevel(level).find((item) => item.id === rewardId);
  if (!reward) return { ok: false, error: "reward-not-unlocked" };
  const payload = readPayload(storage);
  const slots = isRecord(payload.slots) ? payload.slots : {};
  if (slots[reward.slot] === reward.id) {
    return { ok: true, duplicate: true, reward, equipped: readEquippedRewards(storage, level) };
  }
  try {
    storage.setItem(PROFILE_EQUIPMENT_STORAGE_KEY, JSON.stringify({
      ...payload,
      schemaVersion: 1,
      slots: { ...slots, [reward.slot]: reward.id },
    }));
  } catch {
    return { ok: false, error: "storage-unavailable" };
  }
  dispatchRewardUpdate();
  return { ok: true, duplicate: false, reward, equipped: readEquippedRewards(storage, level) };
}

export function unequipReward(storage, slot) {
  if (!storage || typeof storage.getItem !== "function" || typeof storage.setItem !== "function") {
    return { ok: false, error: "storage-unavailable" };
  }
  if (!EQUIPMENT_SLOTS.has(slot)) return { ok: false, error: "invalid-equipment-slot" };
  const payload = readPayload(storage);
  const slots = isRecord(payload.slots) ? payload.slots : {};
  if (!slots[slot]) return { ok: true, duplicate: true };
  try {
    storage.setItem(PROFILE_EQUIPMENT_STORAGE_KEY, JSON.stringify({
      ...payload,
      schemaVersion: 1,
      slots: { ...slots, [slot]: null },
    }));
  } catch {
    return { ok: false, error: "storage-unavailable" };
  }
  dispatchRewardUpdate();
  return { ok: true, duplicate: false };
}
