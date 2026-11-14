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
export function toCompetitionLearningAttempts(problemLog, revisionAttempts = []) {
  if (!Array.isArray(problemLog)) return [];
  const problems = new Map(problemLog.filter((problem) =>
    problem && typeof problem === "object" && !Array.isArray(problem) &&
    typeof problem.id === "string" && problem.id.trim()
  ).map((problem) => [problem.id, problem]));
  const originalAttempts = [...problems.values()].flatMap((problem) => {
    const id = problem.id.trim();
    const date = typeof problem.date === "string" ? Date.parse(problem.date + "T00:00:00Z") : NaN;
    if (!Number.isFinite(date) || date <= 0) return [];
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
  const revisions = Array.isArray(revisionAttempts) ? revisionAttempts.flatMap((revision) => {
    if (!revision || typeof revision !== "object" || Array.isArray(revision)) return [];
    const problemId = typeof revision.problemId === "string" ? revision.problemId : "";
    const problem = problems.get(problemId);
    const id = typeof revision.id === "string" ? revision.id.trim() : "";
    const occurredAt = typeof revision.date === "string" ? Date.parse(revision.date) : NaN;
    if (!problem || !id || !Number.isFinite(occurredAt) || occurredAt <= 0 ||
        (revision.outcome !== "correct" && revision.outcome !== "incorrect")) return [];
    const concept = typeof problem.concept === "string" ? problem.concept.trim() : "";
    return [{
      id,
      disciplineId: "competitive-programming",
      courseId: "regional-qualification",
      contentId: typeof problem.subject === "string" && problem.subject ? problem.subject : "unclassified",
      questionId: problemId,
      subjectId: typeof problem.subject === "string" ? problem.subject : "general",
      conceptIds: concept ? [concept] : [],
      outcome: revision.outcome,
      occurredAt,
      independent: revision.outcome === "correct",
      hintCount: revision.outcome === "correct" ? 0 : undefined,
      mode: "revision",
      mistakeCategory: revision.outcome === "incorrect" && VALID_CATEGORIES.has(revision.mistakeType)
        ? revision.mistakeType : undefined,
    }];
  }) : [];
  return originalAttempts.concat(revisions).sort((a, b) => a.occurredAt - b.occurredAt || a.id.localeCompare(b.id));
}

export function analyzeCompetitionLearning(problemLog, revisionAttempts = [], now = Date.now()) {
  const attempts = toCompetitionLearningAttempts(problemLog, revisionAttempts);
  const mastery = buildConceptMastery(attempts);
  return {
    attempts,
    mastery,
    weakConcepts: recommendConceptPractice(mastery, 3),
    recurringMistakes: buildConceptMistakeSummary(attempts).slice(0, 3),
    revision: buildRevisionCandidates(attempts, now),
  };
}
