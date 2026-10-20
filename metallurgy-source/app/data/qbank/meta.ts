import type { ModuleMeta, TopicMeta } from "../../mt203/types";

/**
 * Module + topic metadata for MT203. This file is intentionally tiny so it
 * can be bundled without pulling in any question text; the real questions are
 * code-split per topic (see ../mt203/types.ts).
 *
 * The `count` fields are asserted against the real source files by
 * scripts/validate-mt203.mjs, so they can never silently drift.
 */
export const MODULE_META: ModuleMeta[] = [
  {
    id: "m1",
    num: 1,
    title: "Fundamentals, Classification & Architecture",
    topics: [
      { id: "t1", title: "Fundamentals, Classification & Architecture", count: 32 },
      { id: "t2", title: "Polymerization Mechanisms", count: 36 },
      { id: "t3", title: "Polymerization Techniques", count: 22 },
      { id: "t4", title: "Molecular Weight & Distribution", count: 30 },
      { id: "t5", title: "Polymer Crystallinity", count: 20 },
      { id: "t6", title: "Thermal Transitions: Tg, Tm & HDT", count: 22 },
      { id: "t7", title: "Polymer Chemistry of Proteins", count: 16 },
    ],
  },
  {
    id: "m2",
    num: 2,
    title: "Industrial Polymers",
    topics: [
      { id: "t8", title: "Industrial Polymers", count: 30 },
      { id: "t9", title: "Blends, Composites & Degradation", count: 24 },
    ],
  },
  {
    id: "m3",
    num: 3,
    title: "Properties of Polymers",
    topics: [{ id: "t10", title: "Mechanical & Viscoelastic Properties", count: 28 }],
  },
  {
    id: "m4",
    num: 4,
    title: "Compounding & Processing",
    topics: [{ id: "t11", title: "Compounding & Processing", count: 26 }],
  },
];

export const TOTAL_QUESTIONS = MODULE_META.reduce(
  (n, m) => n + m.topics.reduce((k, t) => k + t.count, 0),
  0,
);

// ---------------------------------------------------------------------------
// Derived indices. These let the dashboard, revision and weak-area views work
// from metadata alone (no question text has to be downloaded just to show a
// progress bar). scripts/validate-mt203.mjs asserts the counts these rely on.
// ---------------------------------------------------------------------------

export const TOPIC_META: TopicMeta[] = MODULE_META.flatMap((m) => m.topics);

/** Question ids of one topic: "t4" + 30 → ["t4-01" … "t4-30"]. */
export function topicQuestionIds(topicId: string, count: number): string[] {
  return Array.from({ length: count }, (_, i) => `${topicId}-${String(i + 1).padStart(2, "0")}`);
}

export const IDS_BY_TOPIC: Record<string, string[]> = Object.fromEntries(
  TOPIC_META.map((t) => [t.id, topicQuestionIds(t.id, t.count)]),
);

/** Every question id in the bank, in topic order. */
export const ALL_QUESTION_IDS: string[] = TOPIC_META.flatMap((t) => IDS_BY_TOPIC[t.id]);

/** question id → topic id, e.g. "t10-07" → "t10". */
export const TOPIC_OF: Record<string, string> = Object.fromEntries(
  TOPIC_META.flatMap((t) => IDS_BY_TOPIC[t.id].map((id) => [id, t.id])),
);

export function moduleQuestionIds(moduleId: string): string[] {
  const m = MODULE_META.find((x) => x.id === moduleId);
  if (!m) return [];
  return m.topics.flatMap((t) => IDS_BY_TOPIC[t.id] ?? []);
}

export function topicsOfModule(moduleId: string): string[] {
  return MODULE_META.find((x) => x.id === moduleId)?.topics.map((t) => t.id) ?? [];
}

export function moduleOfTopic(topicId: string): string {
  return MODULE_META.find((m) => m.topics.some((t) => t.id === topicId))?.id ?? "";
}
