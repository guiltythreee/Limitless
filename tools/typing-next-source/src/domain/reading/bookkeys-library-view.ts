export interface BookkeysLibraryItem {
  readonly name: string;
  readonly author?: string;
  readonly added?: number;
  readonly opened?: number;
}
export type BookkeysLibrarySort = "recent" | "title-asc" | "title-desc";

/** Search the current shelf and return a sorted copy; never mutate IndexedDB metadata. */
export function filterAndSortBookkeysLibrary<T extends BookkeysLibraryItem>(
  entries: readonly T[],
  query: string,
  sort: BookkeysLibrarySort,
): T[] {
  const needle = query.trim().toLocaleLowerCase();
  const filtered = entries.filter((entry) => !needle ||
    entry.name.toLocaleLowerCase().includes(needle) ||
    (entry.author ?? "").toLocaleLowerCase().includes(needle));
  return [...filtered].sort((a, b) => {
    if (sort === "title-asc") return a.name.localeCompare(b.name);
    if (sort === "title-desc") return b.name.localeCompare(a.name);
    return (b.opened ?? b.added ?? 0) - (a.opened ?? a.added ?? 0);
  });
}
