import {
  isBookkeysBackupV1,
  isBookkeysBackupKey,
  type BookkeysBackupV1,
} from "../persistence/bookkeys-v1-contracts";

export interface BookkeysStorage {
  readonly length: number;
  key(index: number): string | null;
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export interface BackupRestoreResult {
  readonly written: number;
  readonly unchanged: number;
  readonly failed: number;
}

function parseRecord(raw: string | null): Record<string, unknown> | null {
  if (!raw) return null;
  try {
    const value: unknown = JSON.parse(raw);
    return value && typeof value === "object" && !Array.isArray(value)
      ? value as Record<string, unknown>
      : null;
  } catch {
    return null;
  }
}

function numberArray(value: unknown): number[] {
  return Array.isArray(value)
    ? value.filter((item): item is number => Number.isSafeInteger(item) && item >= 0)
    : [];
}

function unionNumbers(...values: unknown[]): number[] {
  return [...new Set(values.flatMap(numberArray))].sort((a, b) => a - b);
}

function nonNegativeFinite(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : 0;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function sanitizeBookProgress(value: unknown): Record<string, unknown> | null {
  if (!isRecord(value)) return null;
  return {
    ...value,
    p: numberArray(value.p),
    e: numberArray(value.e),
    c: numberArray(value.c),
    x: numberArray(value.x),
    done: nonNegativeFinite(value.done),
  };
}

function mergeGame(local: Record<string, unknown> | null, incoming: Record<string, unknown>): string {
  const localBooks = isRecord(local?.book) ? local.book : {};
  const backupBooks = isRecord(incoming.book) ? incoming.book : {};
  // Only accept book records with an object shape. A malformed backup value
  // must never replace a valid local progress record or enter the live state.
  const books: Record<string, unknown> = Object.fromEntries(
    Object.entries(backupBooks).flatMap(([key, value]) => {
      const sanitized = sanitizeBookProgress(value);
      return sanitized ? [[key, sanitized]] : [];
    }),
  );
  if (!local) {
    const restored = { ...incoming };
    if (Object.prototype.hasOwnProperty.call(incoming, "book")) restored.book = books;
    return JSON.stringify(restored);
  }
  for (const [key, backupValue] of Object.entries(backupBooks)) {
    const backup = sanitizeBookProgress(backupValue);
    if (!backup) continue;
    const current = sanitizeBookProgress(localBooks[key]);
    if (!current) {
      books[key] = backup;
      continue;
    }
    books[key] = {
      ...backup,
      ...current,
      // Typed-page history is local authority. A backup may contribute flawless
      // markers and chapter/empty markers, but cannot invent typed progress.
      p: numberArray(current.p),
      x: unionNumbers(current.x, backup.x),
      e: unionNumbers(current.e, backup.e),
      c: unionNumbers(current.c, backup.c),
      // Malformed counters must not turn the serialized progress into null.
      done: Math.max(nonNegativeFinite(current.done), nonNegativeFinite(backup.done)),
    };
  }
  const localPaid = isRecord(local.paid) ? local.paid : {};
  const backupPaid = isRecord(incoming.paid) ? incoming.paid : {};
  const localAch = isRecord(local.ach) ? local.ach : {};
  const backupAch = isRecord(incoming.ach) ? incoming.ach : {};
  const localOnlyBooks = Object.fromEntries(
    Object.entries(localBooks).flatMap(([key, value]) => {
      if (isRecord(backupBooks[key])) return [];
      const sanitized = sanitizeBookProgress(value);
      return sanitized ? [[key, sanitized]] : [];
    }),
  );
  return JSON.stringify({
    ...incoming,
    ...local,
    book: { ...books, ...localOnlyBooks },
    paid: { ...backupPaid, ...localPaid },
    ach: { ...backupAch, ...localAch },
  });
}

function mergeSettings(local: Record<string, unknown> | null, incoming: Record<string, unknown>): string {
  if (!local) return JSON.stringify(incoming);
  const merged = { ...local };
  for (const [key, value] of Object.entries(incoming)) {
    // Keep backup-only settings fields so restores across app versions do not
    // silently discard preferences introduced by a newer reader.
    if (!Object.prototype.hasOwnProperty.call(local, key)) {
      merged[key] = value;
      continue;
    }
    const current = local[key];
    if (typeof current !== typeof value) continue;
    if (typeof value === "number" && !Number.isFinite(value)) continue;
    if (value === null || (typeof value === "object" && value !== null)) continue;
    merged[key] = value;
  }
  return JSON.stringify(merged);
}

function mergeDraft(localRaw: string | null, incomingRaw: string): string {
  if (!localRaw) return incomingRaw;
  const local = parseRecord(localRaw);
  const incoming = parseRecord(incomingRaw);
  if (!local || !incoming) return localRaw;
  const localTime = typeof local.t === "number" && Number.isFinite(local.t) ? local.t : null;
  const incomingTime = typeof incoming.t === "number" && Number.isFinite(incoming.t) ? incoming.t : null;
  if (incomingTime === null) return localRaw;
  return localTime === null || incomingTime > localTime ? incomingRaw : localRaw;
}

function mergeShelves(localRaw: string | null, incomingRaw: string): string {
  if (!localRaw) return incomingRaw;
  let localValue: unknown;
  let incomingValue: unknown;
  try { localValue = JSON.parse(localRaw); incomingValue = JSON.parse(incomingRaw); } catch { return localRaw; }
  if (Array.isArray(localValue) && Array.isArray(incomingValue)) {
    const current = localValue as unknown[];
    const backup = incomingValue as unknown[];
    const merged = [...current];
    const seen = new Set(current.flatMap((item) =>
      item && typeof item === "object" && typeof (item as Record<string, unknown>).id === "string"
        ? [(item as Record<string, unknown>).id as string] : [],
    ));
    for (const item of backup) {
      const id = item && typeof item === "object" ? (item as Record<string, unknown>).id : null;
      if (typeof id === "string" && !seen.has(id)) { merged.push(item); seen.add(id); }
    }
    return JSON.stringify(merged);
  }
  if (localValue && incomingValue) return localRaw;
  return localRaw;
}

function mergedValue(key: string, localRaw: string | null, incomingRaw: string): string {
  if (key === "bookkeys:game") {
    return mergeGame(parseRecord(localRaw), parseRecord(incomingRaw) ?? {});
  }
  if (key === "bookkeys:settings") {
    return mergeSettings(parseRecord(localRaw), parseRecord(incomingRaw) ?? {});
  }
  if (key.startsWith("bookkeys:draft:")) return mergeDraft(localRaw, incomingRaw);
  if (key === "bookkeys:shelves") return mergeShelves(localRaw, incomingRaw);
  // Existing chapter choices, positions, and other local-only preferences win.
  return localRaw ?? incomingRaw;
}

export function createBookkeysBackupV1(storage: BookkeysStorage, now = Date.now()): BookkeysBackupV1 {
  const keys: Record<string, string> = {};
  for (let index = 0; index < storage.length; index += 1) {
    const key = storage.key(index);
    if (!key || !isBookkeysBackupKey(key)) continue;
    const value = storage.getItem(key);
    if (value !== null) keys[key] = value;
  }
  return { app: "bookkeys", v: 1, exportedAt: Math.round(now), keys };
}

export function parseBookkeysBackup(raw: string): BookkeysBackupV1 {
  let value: unknown;
  try { value = JSON.parse(raw); } catch { throw new Error("This is not a valid Bookkeys backup."); }
  if (!isBookkeysBackupV1(value)) throw new Error("This is not a supported Bookkeys backup.");
  return {
    app: "bookkeys",
    v: 1,
    exportedAt: typeof value.exportedAt === "number" ? value.exportedAt : Date.now(),
    keys: value.keys,
  };
}

export function restoreBookkeysBackup(
  storage: BookkeysStorage,
  backup: BookkeysBackupV1,
  mode: "merge" | "replace" = "merge",
): BackupRestoreResult {
  if (!isBookkeysBackupV1(backup)) throw new TypeError("A valid Bookkeys v1 backup is required.");
  let written = 0;
  let unchanged = 0;
  let failed = 0;

  if (mode === "replace") {
    // Snapshot first and write the replacement before deleting anything.
    // If quota or storage errors interrupt the write, restore overwritten
    // values and remove newly-created keys so the previous data survives.
    const existing = new Map<string, string>();
    for (let index = 0; index < storage.length; index += 1) {
      const key = storage.key(index);
      if (!key || !isBookkeysBackupKey(key)) continue;
      const value = storage.getItem(key);
      if (value !== null) existing.set(key, value);
    }

    for (const [key, incomingRaw] of Object.entries(backup.keys)) {
      if (!isBookkeysBackupKey(key) || typeof incomingRaw !== "string") continue;
      try {
        const replacement = key === "bookkeys:game"
          ? mergeGame(null, parseRecord(incomingRaw) ?? {})
          : incomingRaw;
        storage.setItem(key, replacement);
        written += 1;
      } catch {
        failed += 1;
        break;
      }
    }

    if (failed > 0) {
      // Remove newly introduced keys first to free quota before restoring
      // overwritten values from the pre-restore snapshot.
      for (const key of Object.keys(backup.keys)) {
        if (!isBookkeysBackupKey(key) || existing.has(key)) continue;
        try { storage.removeItem(key); } catch { failed += 1; }
      }
      for (const [key, previousRaw] of existing) {
        try { storage.setItem(key, previousRaw); } catch { failed += 1; }
      }
      return { written: 0, unchanged: 0, failed };
    }

    const incomingKeys = new Set(Object.keys(backup.keys).filter(isBookkeysBackupKey));
    for (const key of existing.keys()) {
      if (incomingKeys.has(key)) continue;
      try {
        storage.removeItem(key);
      } catch {
        failed += 1;
        break;
      }
    }

    if (failed > 0) {
      // A failed cleanup is still a failed replace. Restore the complete
      // pre-restore snapshot, including keys already removed in this pass.
      // Free space from newly introduced keys before restoring the snapshot.
      for (const key of Object.keys(backup.keys)) {
        if (!isBookkeysBackupKey(key) || existing.has(key)) continue;
        try { storage.removeItem(key); } catch { failed += 1; }
      }
      for (const [key, previousRaw] of existing) {
        try { storage.setItem(key, previousRaw); } catch { failed += 1; }
      }
      return { written: 0, unchanged: 0, failed };
    }

    return {
      written,
      unchanged: Object.keys(backup.keys).length - written,
      failed,
    };
  }

  for (const [key, incomingRaw] of Object.entries(backup.keys)) {
    if (!isBookkeysBackupKey(key) || typeof incomingRaw !== "string") continue;
    const localRaw = storage.getItem(key);
    const next = mergedValue(key, localRaw, incomingRaw);
    if (next === localRaw) { unchanged += 1; continue; }
    try {
      storage.setItem(key, next);
      written += 1;
    } catch {
      failed += 1;
    }
  }
  return {
    written,
    unchanged,
    failed,
  };
}
