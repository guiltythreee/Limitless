/**
 * Bookkeys local persistence and backup-record compatibility helpers.
 * Kept independent of UI so imports/merges can be tested without user browser data.
 */
export function createBookkeysStorage(storage = globalThis.localStorage, onWriteError = () => {}) {
  return Object.freeze({
    load(key) {
      try { return storage ? storage.getItem(key) : null; } catch { return null; }
    },
    store(key, value) {
      try {
        if (!storage) throw new Error("no-storage");
        storage.setItem(key, value);
        return true;
      } catch {
        onWriteError();
        return false;
      }
    },
    remove(key) {
      try {
        if (!storage) return false;
        storage.removeItem(key);
        return true;
      } catch {
        return false;
      }
    }
  });
}

/** Normalize a parsed shelf list and always retain the built-in Library shelf. */
export function normalizeShelves(value) {
  const shelves = Array.isArray(value) ? value.slice() : [];
  if (!shelves.some(shelf => shelf && shelf.id === "main")) {
    shelves.unshift({ id: "main", name: "Library" });
  }
  return shelves;
}

/** Merge only valid, previously unseen shelf IDs; existing shelf names are not overwritten. */
export function mergeShelves(current, serialized) {
  let imported;
  try { imported = JSON.parse(serialized) || null; } catch { return { shelves: current.slice(), changed: false, added: 0 }; }
  if (!Array.isArray(imported)) return { shelves: current.slice(), changed: false, added: 0 };
  const shelves = current.slice();
  let added = 0;
  for (const shelf of imported) {
    if (!shelf || typeof shelf !== "object" ||
        typeof shelf.id !== "string" || typeof shelf.name !== "string") continue;
    if (shelves.some(existing => existing && existing.id === shelf.id)) continue;
    shelves.push({ id: shelf.id, name: shelf.name.slice(0, 60) });
    added++;
  }
  return { shelves, changed: added > 0, added };
}

/** Merge backup settings only when their primitive type matches the canonical default. */
export function mergeSettings(defaults, current, serialized) {
  let imported;
  try { imported = JSON.parse(serialized) || null; } catch { return { settings: { ...current }, changed: 0 }; }
  if (!imported || typeof imported !== "object" || Array.isArray(imported)) {
    return { settings: { ...current }, changed: 0 };
  }
  const settings = { ...current };
  let changed = 0;
  for (const key of Object.keys(defaults)) {
    if (!Object.prototype.hasOwnProperty.call(imported, key)) continue;
    const value = imported[key];
    if (typeof value !== typeof defaults[key]) continue;
    if (typeof value === "number" && !Number.isFinite(value)) continue;
    settings[key] = value;
    changed++;
  }
  return { settings, changed };
}

/** Canonicalize the four per-book progress arrays using the original numeric/unique/sorted rule. */
export function normalizeBookProgress(source) {
  const input = source && typeof source === "object" ? source : {};
  const result = { p: [], e: [], c: [], x: [], done: +input.done || 0 };
  for (const key of ["p", "e", "c", "x"]) {
    const seen = new Set();
    result[key] = (Array.isArray(input[key]) ? input[key] : [])
      .filter(value => {
        if (typeof value !== "number" || !Number.isFinite(value) || seen.has(value)) return false;
        seen.add(value);
        return true;
      })
      .sort((a, b) => a - b);
  }
  return result;
}
