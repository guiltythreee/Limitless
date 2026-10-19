// app/courses/entries/mt202.ts
//
// The MT202 course entry: its declarative manifest bound to its read-only
// content adapter.
//
// Kept in its own module (rather than inline in registry.ts) so the MT202 page
// can import ITS OWN entry without pulling the other courses' content into the
// MT202 bundle — registry.ts statically references MT201's and MT203's content.
// registry.ts composes this entry with the others.
//
// Content pipeline is unchanged: the adapter wraps the existing
// app/mt202/types.ts `loadChapter` fetch/cache, question ids stay `ch01-q12`
// (exactly the mm-mt202-v1 progress key), and the theory is the same
// app/data/lessons.ts source mapped through the shared canonical `Lesson`.

import { MT202_MANIFEST } from "../manifests/mt202";
import { createJsonAdapter } from "../adapters/json";
import { mapLesson } from "../adapters/lesson";
import { loadChapter } from "../../mt202/types";
import { LESSONS } from "../../data/lessons";
import type { CourseEntry, Lesson } from "../types";

export const MT202_ENTRY: CourseEntry = {
  manifest: MT202_MANIFEST,
  adapter: createJsonAdapter({
    manifest: MT202_MANIFEST,
    loadChapter,
    lessonFor: (topicId) => LESSONS[topicId],
  }),
};

// MT202's condensed theory is bundled (not fetched), so the page renders it on
// first paint — including in the static export — exactly as before. This is the
// same canonical `mapLesson` projection the adapter serves through loadTopic();
// exposing it synchronously keeps the theory rendering path byte-identical
// while still routing it through the shared model. Read-only: the source
// lesson objects are never mutated.
export const MT202_LESSONS: Record<string, Lesson | null> = Object.fromEntries(
  Object.entries(LESSONS).map(([id, raw]) => [id, mapLesson(raw, id)])
);
