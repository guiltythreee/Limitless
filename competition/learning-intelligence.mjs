import {
  buildConceptMastery,
  buildConceptMistakeSummary,
  buildRevisionCandidates,
  recommendConceptPractice,
} from "../shared/studies/intelligence.mjs";

const VALID_CATEGORIES = new Set([
  "conceptual", "observation", "mathematical", "implementation", "time-management",
]);

/** Adapt the CP tracker without changing its stored problem-log records. */
export function toCompetitionLearningAttempts(problemLog) {
  if (!Array.isArray(problemLog)) return [];
  return problemLog.flatMap((problem) => {
    if (!problem || typeof problem !== "object" || Array.isArray(problem)) return [];
    const id = typeof problem.id === "string" ? problem.id.trim() : "";
    const date = typeof problem.date === "string" ? Date.parse(problem.date + "T00:00:00Z") : NaN;
    if (!id || !Number.isFinite(date) || date <= 0) return [];
    const outcome = problem.outcome === "independent" ? "correct"
      : problem.outcome === "unsolved" ? "incorrect" : "partial";
    const concept = typeof problem.concept === "string" ? problem.concept.trim() : "";
    return [{
      id,
      disciplineId: "competitive-programming",
      courseId: "regional-qualification",
      contentId: typeof problem.subject === "string" && problem.subject ? problem.subject : "unclassified",
      questionId: id,
      subjectId: typeof problem.subject === "string" ? problem.subject : "general",
      conceptIds: concept ? [concept] : [],
      outcome,
      occurredAt: date,
      elapsedMs: Number.isFinite(Number(problem.time)) && Number(problem.time) > 0
        ? Number(problem.time) * 60_000 : undefined,
      independent: problem.outcome === "independent" && problem.resolve === "yes",
      hintCount: problem.outcome === "independent" ? 0 : problem.outcome === "hint" ? 1 : problem.outcome === "editorial" ? 2 : undefined,
      mode: "practice",
      mistakeCategory: VALID_CATEGORIES.has(problem.mistakeType) ? problem.mistakeType : undefined,
    }];
  });
}

export function analyzeCompetitionLearning(problemLog, now = Date.now()) {
  const attempts = toCompetitionLearningAttempts(problemLog);
  const mastery = buildConceptMastery(attempts);
  return {
    attempts,
    mastery,
    weakConcepts: recommendConceptPractice(mastery, 3),
    recurringMistakes: buildConceptMistakeSummary(attempts).slice(0, 3),
    revision: buildRevisionCandidates(attempts, now).slice(0, 20),
  };
}
