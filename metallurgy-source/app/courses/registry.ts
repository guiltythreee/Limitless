// app/courses/registry.ts
//
// The course registry: one entry per live course, binding its declarative
// manifest to its read-only content adapter.
//
// PHASE 3: MT201 consumes its own entry module (app/courses/entries/mt201.ts)
// directly, so the course page never bundles the other courses' content.
// PHASE 4a: MT202 does the same through app/courses/entries/mt202.ts.
// PHASE 4b: MT203 does the same through app/courses/entries/mt203.ts.
// registry.ts composes all three entries for whole-registry consumers (the
// validator today, the shared shell later). Because every course's question
// imports are dynamic, importing the registry never pulls question text into
// a bundle.

import { MT201_ENTRY } from "./entries/mt201";
import { MT202_ENTRY } from "./entries/mt202";
import { MT203_ENTRY } from "./entries/mt203";
import type { CourseEntry, CourseId, CourseManifest, Topic } from "./types";

/** Every registered course, in display order. */
export const COURSES: CourseEntry[] = [
  MT201_ENTRY,
  MT202_ENTRY,
  MT203_ENTRY,
];

export const COURSE_IDS: CourseId[] = COURSES.map((c) => c.manifest.id);

export function getCourse(id: CourseId): CourseEntry | undefined {
  return COURSES.find((c) => c.manifest.id === id);
}

export function totalQuestions(id: CourseId): number {
  const entry = getCourse(id);
  if (!entry) return 0;
  return entry.manifest.topics.reduce((sum, t) => sum + t.count, 0);
}

/** Topics belonging to one unit, in unit order. */
export function topicsOfUnit(manifest: CourseManifest, unitId: string): Topic[] {
  const unit = manifest.units.find((u) => u.id === unitId);
  if (!unit) return [];
  return unit.topicIds
    .map((tid) => manifest.topics.find((t) => t.id === tid))
    .filter((t): t is Topic => Boolean(t));
}
