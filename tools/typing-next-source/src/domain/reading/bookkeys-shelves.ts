import type { BookkeysShelf } from "../persistence/bookkeys-v1-contracts";

export const DEFAULT_BOOKKEYS_SHELF: BookkeysShelf = { id: "main", name: "Library" };

function shelfId(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function shelfName(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function normalizeShelves(value: unknown): BookkeysShelf[] {
  const found: BookkeysShelf[] = [];
  const seen = new Set<string>();
  const add = (idValue: unknown, nameValue: unknown) => {
    const id = shelfId(idValue);
    const name = shelfName(nameValue);
    if (!id || !name || seen.has(id)) return;
    seen.add(id);
    found.push({ id, name });
  };

  if (Array.isArray(value)) {
    for (const item of value) {
      if (typeof item === "string") add("shelf-" + item.toLowerCase().replace(/[^a-z0-9]+/g, "-"), item);
      else if (item && typeof item === "object") {
        const record = item as Record<string, unknown>;
        add(record.id, record.name);
      }
    }
  } else if (value && typeof value === "object") {
    for (const [id, item] of Object.entries(value as Record<string, unknown>)) {
      if (typeof item === "string") add(id, item);
      else if (item && typeof item === "object") add(id, (item as Record<string, unknown>).name);
    }
  }

  if (!seen.has(DEFAULT_BOOKKEYS_SHELF.id)) found.unshift(DEFAULT_BOOKKEYS_SHELF);
  return found;
}

export function readShelves(raw: string | null): BookkeysShelf[] {
  if (!raw) return [DEFAULT_BOOKKEYS_SHELF];
  try { return normalizeShelves(JSON.parse(raw)); } catch { return [DEFAULT_BOOKKEYS_SHELF]; }
}

export function createShelf(shelves: readonly BookkeysShelf[], nameValue: string, id: string): BookkeysShelf[] {
  const name = nameValue.trim();
  if (!name) return [...shelves];
  if (shelves.some((shelf) => shelf.name.toLowerCase() === name.toLowerCase())) return [...shelves];
  if (shelves.some((shelf) => shelf.id === id)) return [...shelves];
  return [...shelves, { id, name }];
}

export function renameShelf(shelves: readonly BookkeysShelf[], id: string, nameValue: string): BookkeysShelf[] {
  const name = nameValue.trim();
  if (!name || shelves.some((shelf) => shelf.id !== id && shelf.name.toLowerCase() === name.toLowerCase())) {
    return [...shelves];
  }
  return shelves.map((shelf) => shelf.id === id ? { ...shelf, name } : shelf);
}

export function deleteShelf(shelves: readonly BookkeysShelf[], id: string): BookkeysShelf[] {
  if (id === DEFAULT_BOOKKEYS_SHELF.id) return [...shelves];
  const remaining = shelves.filter((shelf) => shelf.id !== id);
  return remaining.some((shelf) => shelf.id === DEFAULT_BOOKKEYS_SHELF.id)
    ? remaining
    : [DEFAULT_BOOKKEYS_SHELF, ...remaining];
}
