import type { StudyContentId, StudyProgressSnapshot } from "./contracts";

export type StoredProgressRead =
  | { status: "available"; value: Record<string, unknown> }
  | { status: "invalid" };

/**
 * Read one browser-local progress payload without initialising, migrating,
 * normalising, or writing it. A missing key is a valid empty record.
 */
export function readStoredProgress(
  readItem: (key: string) => string | null,
  storageKey: string,
): StoredProgressRead {
  try {
    const raw = readItem(storageKey);
    if (raw === null) return { status: "available", value: {} };
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return { status: "invalid" };
    }
    return { status: "available", value: parsed as Record<string, unknown> };
  } catch {
    return { status: "invalid" };
  }
}

/** Produce a conservative activity-only status; activity is not mastery. */
export function activitySnapshot(
  contentId: StudyContentId,
  activityCount: number,
  lastActivityAt?: number,
): StudyProgressSnapshot {
  const snapshot: StudyProgressSnapshot = {
    contentId,
    status: activityCount > 0 ? "in-progress" : "not-started",
  };
  if (typeof lastActivityAt === "number" && Number.isFinite(lastActivityAt) && lastActivityAt > 0) {
    snapshot.lastActivityAt = lastActivityAt;
  }
  return snapshot;
}

/** Build a snapshot only when a source explicitly confirms completion. */
export function completedSnapshot(
  contentId: StudyContentId,
  lastActivityAt?: number,
): StudyProgressSnapshot {
  const snapshot: StudyProgressSnapshot = { contentId, status: "completed" };
  if (typeof lastActivityAt === "number" && Number.isFinite(lastActivityAt) && lastActivityAt > 0) {
    snapshot.lastActivityAt = lastActivityAt;
  }
  return snapshot;
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}
