export const LEVEL_NOTIFICATION_STORAGE_KEY = "limitless.global-level-notifications.v1";

function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function readPayload(storage) {
  try {
    const raw = storage?.getItem(LEVEL_NOTIFICATION_STORAGE_KEY);
    if (!raw) return null;
    const value = JSON.parse(raw);
    return isRecord(value) ? value : null;
  } catch {
    return null;
  }
}
function normalizedLevel(value) {
  return Number.isFinite(value) ? Math.max(1, Math.floor(value)) : 1;
}

/**
 * Persist durable acknowledgements for levels crossed after the notification
 * feature was first used. The first call seeds a baseline and deliberately
 * does not manufacture retroactive level-up notifications.
 */
export function syncLevelNotifications(storage, currentLevel, now = Date.now) {
  if (!storage || typeof storage.getItem !== "function" || typeof storage.setItem !== "function") {
    return { ok: false, notifications: [] };
  }
  const level = normalizedLevel(currentLevel);
  const payload = readPayload(storage);
  if (!payload || !Number.isFinite(payload.lastObservedLevel)) {
    const baseline = {
      ...(payload ?? {}),
      schemaVersion: 1,
      lastObservedLevel: level,
      notifications: Array.isArray(payload?.notifications) ? payload.notifications : [],
    };
    try {
      storage.setItem(LEVEL_NOTIFICATION_STORAGE_KEY, JSON.stringify(baseline));
      return { ok: true, initialized: true, notifications: baseline.notifications };
    } catch {
      return { ok: false, notifications: [] };
    }
  }

  const notifications = Array.isArray(payload.notifications)
    ? payload.notifications.filter((item) => isRecord(item) && Number.isInteger(item.level) && item.level >= 2)
    : [];
  const lastObserved = normalizedLevel(payload.lastObservedLevel);
  if (level <= lastObserved) {
    return { ok: true, initialized: false, notifications };
  }

  const observedAt = now();
  for (let next = lastObserved + 1; next <= level; next++) {
    notifications.push({
      id: "global-level-up:" + next,
      level: next,
      createdAt: Number.isFinite(observedAt) ? Math.round(observedAt) : Date.now(),
      acknowledgedAt: null,
    });
  }
  const nextPayload = {
    ...payload,
    schemaVersion: 1,
    lastObservedLevel: level,
    notifications,
  };
  try {
    storage.setItem(LEVEL_NOTIFICATION_STORAGE_KEY, JSON.stringify(nextPayload));
    return { ok: true, initialized: false, notifications };
  } catch {
    return { ok: false, notifications };
  }
}

export function acknowledgeLevelNotification(storage, level, now = Date.now) {
  if (!storage || typeof storage.getItem !== "function" || typeof storage.setItem !== "function") return false;
  const target = normalizedLevel(level);
  const payload = readPayload(storage);
  if (!payload || !Array.isArray(payload.notifications)) return false;
  const item = payload.notifications.find((entry) => isRecord(entry) && entry.level === target);
  if (!item || item.acknowledgedAt !== null) return false;
  const observedAt = now();
  const notifications = payload.notifications.map((entry) =>
    entry === item
      ? { ...entry, acknowledgedAt: Number.isFinite(observedAt) ? Math.round(observedAt) : Date.now() }
      : entry
  );
  try {
    storage.setItem(LEVEL_NOTIFICATION_STORAGE_KEY, JSON.stringify({ ...payload, notifications }));
    return true;
  } catch {
    return false;
  }
}
