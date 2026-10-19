// app/courses/entries/mt201.ts
//
// The MT201 course entry: its declarative manifest bound to its read-only
// content adapter.
//
// Kept in its own module (rather than inline in registry.ts) so the MT201 page
// can import ITS OWN entry without pulling the other courses' content into the
// MT201 bundle — registry.ts statically references MT202 lessons (35 KB) and
// MT203 lessons (66 KB). registry.ts composes this entry with the others.
//
// Content pipeline is unchanged: the adapter wraps the existing
// app/mt201/types.ts `loadChapter` fetch/cache, and question ids stay
// `ch01-q12` — exactly the mm-mt201-v1 progress key.

import { MT201_MANIFEST } from "../manifests/mt201";
import { createJsonAdapter } from "../adapters/json";
import { loadChapter } from "../../mt201/types";
import type { CourseEntry } from "../types";

export const MT201_ENTRY: CourseEntry = {
  manifest: MT201_MANIFEST,
  adapter: createJsonAdapter({ manifest: MT201_MANIFEST, loadChapter }),
};
