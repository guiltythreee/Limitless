// app/courses/capabilities.ts
//
// Course capability flags. Every flag defaults to FALSE. A course manifest
// turns on only what its source actually ships; the "not built yet" flags
// (bookmarks, timers, drafts, analytics, …) stay false during Phase 1.
//
// Rationale: a course that has no lessons must never be handed lesson UI, and
// a course with no reward policy must never show XP — the flags are the single
// switch the shared shell reads.

import type { CourseCapabilities } from "./types";

export const DEFAULT_CAPABILITIES: CourseCapabilities = {
  // content
  theory: false,
  formulas: false,
  examples: false,
  subtopics: false,
  units: false,
  // practice
  practice: false,
  practiceScopes: { topic: false, unit: false, all: false, multiTopic: false },
  weakArea: false,
  spacedRevision: false,
  // assessment
  exam: false,
  review: false,
  // progression
  dashboard: false,
  xp: false,
  mastery: false,
  goals: false,
  streaks: false,
  // subject tools
  tools: false,
  // ---- not built yet; must remain off until Phase 5 ----
  bookmarks: false,
  mistakes: false,
  timers: false,
  drafts: false,
  attemptHistory: false,
  analyticsCharts: false,
  periodFilters: false,
};

type CapabilityPatch = Partial<Omit<CourseCapabilities, "practiceScopes">> & {
  practiceScopes?: Partial<CourseCapabilities["practiceScopes"]>;
};

/** Build a full capability set from the all-false defaults plus a small patch. */
export function capabilities(patch: CapabilityPatch): CourseCapabilities {
  return {
    ...DEFAULT_CAPABILITIES,
    ...patch,
    practiceScopes: {
      ...DEFAULT_CAPABILITIES.practiceScopes,
      ...(patch.practiceScopes ?? {}),
    },
  };
}
