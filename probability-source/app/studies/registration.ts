import { lessons, pathways } from "../content";
import { allQuestions } from "../lib/questions";
import {
  activitySnapshot,
  completedSnapshot,
  readStoredProgress,
} from "../../../shared/studies/progress";
import type { StudyDisciplineRegistration } from "../../../shared/studies/contracts";

// Must stay aligned with the canonical key in app/lib/store.ts. Kept local to
// this adapter so the framework-neutral registry tests do not import React.
const PROBABILITY_STORAGE_KEY = "hc3-progress-v3";

/**
 * Probability registration for the shared Studies directory.
 *
 * This is a read-only catalogue projection. Probability continues to own its
 * lesson content, pathway definitions, question bank, grading and progress
 * store. Its optional progress projection reads the canonical payload directly
 * and never calls the store's mutating hydration path.
 */
export const PROBABILITY_STUDIES_REGISTRATION = {
  descriptor: {
    id: "probability",
    title: "Probability",
    description: "A structured probability curriculum from foundations and counting through distributions, inference, stochastic processes and simulation.",
    route: "/probability/studies",
    status: "active",
    capabilities: [
      "theory",
      "formulas",
      "examples",
      "practice",
      "assessment",
      "answer-review",
      "revision",
      "bookmarks",
      "drafts",
      "timers",
      "attempt-history",
      "analytics",
      "goals",
      "mastery",
    ],
  },
  content: [
    {
      id: "probability-course",
      disciplineId: "probability",
      kind: "course",
      title: "Probability Archive",
      description: "Probability theory, inference, stochastic processes and simulation.",
      route: "/",
      symbol: "◇",
      capabilities: [
        "theory", "formulas", "examples", "practice", "assessment", "answer-review",
        "revision", "bookmarks", "drafts", "timers", "attempt-history", "analytics", "goals", "mastery",
      ],
    },
    ...lessons.map((lesson) => ({
      id: lesson.id,
      disciplineId: "probability",
      kind: "lesson" as const,
      title: lesson.title,
      description: lesson.description,
      parentId: "probability-course",
    })),
  ],
  pathways: pathways.map((pathway) => ({
    id: pathway.id,
    disciplineId: "probability",
    title: pathway.label,
    description: pathway.description,
    sequenceLabel: (() => {
      const sequenceNumbers = [...new Set(
        lessons.filter((lesson) => pathway.lessonIds.includes(lesson.id)).map((lesson) => lesson.rank),
      )].sort((a, b) => b - a);
      return sequenceNumbers.length
        ? `Sequences ${sequenceNumbers.map((number) => String(number).padStart(2, "0")).join(", ")}`
        : "No sequences assigned";
    })(),
    contentIds: [...pathway.lessonIds],
  })),
  /**
   * Read only the canonical v3 payload. In particular, do not call useStore():
   * its normal hydration path may initialise reward metadata or persist a
   * migration. A missing key is an empty record; malformed data stays unknown.
   */
  readProgress: () => {
    if (typeof window === "undefined") return [];
    const stored = readStoredProgress(
      (key) => window.localStorage.getItem(key),
      PROBABILITY_STORAGE_KEY,
    );
    if (stored.status !== "available") return [];

    if (stored.value.completed !== undefined && !Array.isArray(stored.value.completed)) return [];
    if (stored.value.attempts !== undefined && !Array.isArray(stored.value.attempts)) return [];

    const completed = new Set(
      Array.isArray(stored.value.completed)
        ? stored.value.completed.filter((id): id is string => typeof id === "string")
        : [],
    );
    const questionLesson = new Map(allQuestions.map((question) => [question.key, question.lessonId]));
    const validQuestionIds = new Set(questionLesson.keys());
    const attempts = Array.isArray(stored.value.attempts)
      ? stored.value.attempts.filter((attempt): attempt is { q: string; ts: number } =>
          !!attempt && typeof attempt === "object" &&
          typeof (attempt as { q?: unknown }).q === "string" &&
          validQuestionIds.has((attempt as { q: string }).q) &&
          typeof (attempt as { ts?: unknown }).ts === "number" &&
          Number.isFinite((attempt as { ts: number }).ts),
        )
      : [];

    const byLesson = new Map<string, { count: number; lastAt?: number }>();
    for (const attempt of attempts) {
      const lessonId = questionLesson.get(attempt.q);
      if (!lessonId) continue;
      const current = byLesson.get(lessonId) ?? { count: 0 };
      current.count++;
      if (attempt.ts > 0) current.lastAt = Math.max(current.lastAt ?? 0, attempt.ts);
      byLesson.set(lessonId, current);
    }

    const snapshots = lessons.map((lesson) => {
      const activity = byLesson.get(lesson.id);
      return completed.has(lesson.id)
        ? completedSnapshot(lesson.id, activity?.lastAt)
        : activitySnapshot(lesson.id, activity?.count ?? 0, activity?.lastAt);
    });
    const completedCount = lessons.filter((lesson) => completed.has(lesson.id)).length;
    const activityCount = attempts.length;
    const lastActivityAt = attempts.reduce(
      (latest, attempt) => Math.max(latest, attempt.ts > 0 ? attempt.ts : 0),
      0,
    );
    snapshots.push(
      completedCount === lessons.length
        ? completedSnapshot("probability-course", lastActivityAt)
        : activitySnapshot("probability-course", activityCount + completedCount, lastActivityAt),
    );
    return snapshots;
  },
} satisfies StudyDisciplineRegistration;
