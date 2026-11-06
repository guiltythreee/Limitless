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
    ? value.filter((item): item is number => Number.isInteger(item))
    : [];
}

function unionNumbers(...values: unknown[]): number[] {
  return [...new Set(values.flatMap(numberArray))].sort((a, b) => a - b);
}

function mergeGame(local: Record<string, unknown> | null, incoming: Record<string, unknown>): string {
  if (!local) return JSON.stringify(incoming);
  const localBooks = local.book && typeof local.book === "object" ? local.book as Record<string, unknown> : {};
  const backupBooks = incoming.book && typeof incoming.book === "object" ? incoming.book as Record<string, unknown> : {};
  const books: Record<string, unknown> = { ...backupBooks };
  for (const [key, backupValue] of Object.entries(backupBooks)) {
    const localValue = localBooks[key];
    if (!localValue || typeof localValue !== "object" || Array.isArray(localValue) ||
        !backupValue || typeof backupValue !== "object" || Array.isArray(backupValue)) continue;
    const current = localValue as Record<string, unknown>;
    const backup = backupValue as Record<string, unknown>;
    books[key] = {
      ...backup,
      ...current,
      // Typed-page history is local authority. A backup may contribute flawless
      // markers and chapter/empty markers, but cannot invent typed progress.
      p: numberArray(current.p),
      x: unionNumbers(current.x, backup.x),
      e: unionNumbers(current.e, backup.e),
      c: unionNumbers(current.c, backup.c),
      done: Math.max(Number(current.done ?? 0), Number(backup.done ?? 0)),
    };
  }
  const localPaid = local.paid && typeof local.paid === "object" ? local.paid as Record<string, unknown> : {};
  const backupPaid = incoming.paid && typeof incoming.paid === "object" ? incoming.paid as Record<string, unknown> : {};
  const localAch = local.ach && typeof local.ach === "object" ? local.ach as Record<string, unknown> : {};
  const backupAch = incoming.ach && typeof incoming.ach === "object" ? incoming.ach as Record<string, unknown> : {};
  return JSON.stringify({
    ...incoming,
    ...local,
    book: { ...books, ...Object.fromEntries(Object.entries(localBooks).filter(([key]) => !(key in backupBooks))) },
    paid: { ...backupPaid, ...localPaid },
    ach: { ...backupAch, ...localAch },
  });
}

function mergeSettings(local: Record<string, unknown> | null, incoming: Record<string, unknown>): string {
  if (!local) return JSON.stringify(incoming);
  const merged = { ...local };
  for (const [key, value] of Object.entries(incoming)) {
    if (!Object.prototype.hasOwnProperty.call(local, key)) continue;
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
  return Number(incoming.t ?? 0) > Number(local.t ?? 0) ? incomingRaw : localRaw;
}

function mergeShelves(localRaw: string | null, incomingRaw: string): string {
  if (!localRaw) return incomingRaw;
  const local = parseRecord(localRaw);
  const incoming = parseRecord(incomingRaw);
  if (Array.isArray(JSON.parse(localRaw)) && Array.isArray(JSON.parse(incomingRaw))) {
    const current = JSON.parse(localRaw) as unknown[];
    const backup = JSON.parse(incomingRaw) as unknown[];
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
  if (local && incoming) return localRaw;
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
  let failed = 0;
  if (mode === "replace") {
    const existing: string[] = [];
    for (let index = 0; index < storage.length; index += 1) {
      const key = storage.key(index);
      if (key && isBookkeysBackupKey(key)) existing.push(key);
    }
    for (const key of existing) {
      try { storage.removeItem(key); } catch { failed += 1; }
    }
  }

  for (const [key, incomingRaw] of Object.entries(backup.keys)) {
    if (!isBookkeysBackupKey(key) || typeof incomingRaw !== "string") continue;
    const localRaw = storage.getItem(key);
    const next = mode === "replace" ? incomingRaw : mergedValue(key, localRaw, incomingRaw);
    if (next === localRaw) continue;
    try {
      storage.setItem(key, next);
      written += 1;
    } catch {
      failed += 1;
    }
  }
  return {
    written,
    unchanged: Object.keys(backup.keys).length - written,
    failed,
  };
}
