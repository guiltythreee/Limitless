// app/courses/entries/mt203.ts
//
// The MT203 course entry: its declarative manifest bound to its read-only
// content adapter.
//
// Kept in its own module (rather than inline in registry.ts) so the MT203 page
// can import ITS OWN entry without pulling the other courses' content into the
// MT203 bundle. registry.ts composes this entry with the others.
//
// CODE SPLITTING: the adapter resolves through the existing per-topic dynamic
// imports in app/mt203/types.ts, so importing this module never pulls in
// question text — the 11 topic chunks stay separate in the production build.
// Question ids ("t4-014") are preserved verbatim (mm-mt203-v1 progress keys).

import { MT203_MANIFEST } from "../manifests/mt203";
import { createMt203Adapter } from "../adapters/mt203";
import { mapLesson } from "../adapters/lesson";
import { LESSONS } from "../../data/lessons-mt203";
import type { CourseEntry, Lesson } from "../types";

export const MT203_ENTRY: CourseEntry = {
  manifest: MT203_MANIFEST,
  adapter: createMt203Adapter(MT203_MANIFEST),
};

// MT203's condensed theory is bundled (not fetched), so the page renders it on
// first paint — including in the static export — exactly as before. This is the
// same canonical `mapLesson` projection the adapter serves through loadTopic();
// exposing it synchronously keeps the theory rendering path byte-identical
// while still routing it through the shared model. Read-only: the source
// lesson objects are never mutated.
export const MT203_LESSONS: Record<string, Lesson | null> = Object.fromEntries(
  Object.entries(LESSONS).map(([id, raw]) => [id, mapLesson(raw, id)])
);
