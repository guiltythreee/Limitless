import { lessons, pathways } from "../content";
import type { StudyDisciplineRegistration } from "../../../shared/studies/contracts";

/**
 * Probability registration for the shared Studies directory.
 *
 * This is a read-only catalogue projection. Probability continues to own its
 * lesson content, pathway definitions, question bank, grading and progress
 * store. The registration does not initialise or read local storage.
 */
export const PROBABILITY_STUDIES_REGISTRATION = {
  descriptor: {
    id: "probability",
    title: "Probability",
    description: "A structured probability curriculum from foundations and counting through distributions, inference, stochastic processes and simulation.",
    route: "/probability",
    status: "active",
    capabilities: [
      "theory",
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
      title: "Probability",
      description: "Probability theory, inference, stochastic processes and simulation.",
      route: "/probability",
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
    contentIds: [...pathway.lessonIds],
  })),
} satisfies StudyDisciplineRegistration;
