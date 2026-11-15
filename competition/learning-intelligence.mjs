import {
  buildConceptMastery,
  buildConceptMistakeSummary,
  buildRevisionCandidates,
  recommendConceptPractice,
} from "../shared/studies/intelligence.mjs";

const VALID_CATEGORIES = new Set([
  "conceptual", "observation", "mathematical", "implementation", "time-management",
]);

function parseCalendarDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return NaN;
  const timestamp = Date.parse(value + "T00:00:00.000Z");
  if (!Number.isFinite(timestamp) || new Date(timestamp).toISOString().slice(0, 10) !== value) return NaN;
  return timestamp;
}

function parseRevisionTimestamp(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}T/.test(value)) return NaN;
  if (!Number.isFinite(parseCalendarDate(value.slice(0, 10)))) return NaN;
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) && timestamp > 0 ? timestamp : NaN;
}

/** Adapt the CP tracker without changing its stored problem-log records. */
export function toCompetitionLearningAttempts(problemLog, revisionAttempts = []) {
  if (!Array.isArray(problemLog)) return [];
  const problems = new Map(problemLog.filter((problem) =>
    problem && typeof problem === "object" && !Array.isArray(problem) &&
    typeof problem.id === "string" && problem.id.trim()
  ).map((problem) => [problem.id, problem]));
  const originalAttempts = [...problems.values()].flatMap((problem) => {
    const id = problem.id.trim();
    const date = parseCalendarDate(problem.date);
    // Keep malformed/legacy rows in their original history, but do not let
    // impossible calendar dates create misleading revision deadlines.
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
    const occurredAt = parseRevisionTimestamp(revision.date);
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


const CODEFORCES_VERDICTS = Object.freeze({
  OK: "correct",
  WRONG_ANSWER: "incorrect",
  TIME_LIMIT_EXCEEDED: "incorrect",
  MEMORY_LIMIT_EXCEEDED: "incorrect",
  RUNTIME_ERROR: "incorrect",
  COMPILATION_ERROR: "incorrect",
  IDLENESS_LIMIT_EXCEEDED: "incorrect",
  CRASHED: "incorrect",
  PRESENTATION_ERROR: "incorrect",
  PARTIAL: "partial",
  FAILED: "incorrect",
  REJECTED: "incorrect",
  SECURITY_VIOLATED: "incorrect",
  INPUT_PREPARATION_CRASHED: "incorrect",
});

/**
 * Convert public Codeforces API submissions into shared learning evidence.
 * Submission IDs are the stable attempt IDs; repeated API pages are deduplicated.
 * Verdicts are outcomes only: public submissions do not reveal whether a solve
 * was independent or used hints, so those fields are deliberately left unknown.
 */
export function toCodeforcesLearningAttempts(submissions) {
  if (!Array.isArray(submissions)) return [];
  const seen = new Set();
  return submissions.flatMap((submission) => {
    if (!submission || typeof submission !== "object" || Array.isArray(submission)) return [];
    const submissionId = Number(submission.id);
    const seconds = Number(submission.creationTimeSeconds);
    const contestId = Number(submission.contestId ?? submission.problem?.contestId);
    const index = typeof submission.problem?.index === "string" ? submission.problem.index.trim() : "";
    const outcome = CODEFORCES_VERDICTS[submission.verdict];
    if (!Number.isSafeInteger(submissionId) || submissionId <= 0 || seen.has(submissionId) ||
        !Number.isFinite(seconds) || seconds <= 0 || !Number.isSafeInteger(contestId) ||
        contestId <= 0 || !index || !outcome) return [];
    seen.add(submissionId);
    const occurredAt = seconds * 1000;
    if (!Number.isFinite(occurredAt)) return [];
    const tags = Array.isArray(submission.problem.tags)
      ? [...new Set(submission.problem.tags.filter((tag) => typeof tag === "string" && tag.trim()).map((tag) => tag.trim().toLowerCase()))]
      : [];
    return [{
      id: "codeforces:" + submissionId,
      disciplineId: "competitive-programming",
      courseId: "codeforces",
      contentId: contestId + index,
      questionId: "codeforces:" + contestId + index,
      subjectId: "codeforces",
      conceptIds: tags,
      outcome,
      occurredAt,
      elapsedMs: Number.isFinite(Number(submission.timeConsumedMillis)) && Number(submission.timeConsumedMillis) > 0
        ? Number(submission.timeConsumedMillis) : undefined,
      // The public API exposes verdicts, not whether a solution was independent.
      // Independent evidence is recorded only by an explicit re-solve action.
      mode: submission.author?.participantType === "CONTESTANT" ? "contest" : "practice",
    }];
  }).sort((a, b) => a.occurredAt - b.occurredAt || a.id.localeCompare(b.id));
}

/**
 * Build a navigable Codeforces problem URL from the stable learning question ID.
 * Codeforces uses the /gym route for Gym contest IDs (100000+).
 */
export function getCodeforcesProblemUrl(questionId) {
  const match = /^codeforces:(\d+)([A-Za-z][A-Za-z0-9]*)$/.exec(
    typeof questionId === "string" ? questionId : ""
  );
  if (!match) return "";
  const contestId = Number(match[1]);
  const index = match[2];
  return contestId >= 100000
    ? "https://codeforces.com/gym/" + contestId + "/problem/" + index
    : "https://codeforces.com/problemset/problem/" + contestId + "/" + index;
}

export function analyzeCompetitionLearning(problemLog, revisionAttempts = [], now = Date.now(), codeforcesSubmissions = []) {
  const storedCodeforcesAttempts = Array.isArray(codeforcesSubmissions) && codeforcesSubmissions.some((item) =>
    item && typeof item.id === "string" && item.id.startsWith("codeforces:") && item.disciplineId === "competitive-programming"
  );
  const codeforcesAttempts = storedCodeforcesAttempts
    ? codeforcesSubmissions.filter((item) => item && typeof item.id === "string" &&
      item.id.startsWith("codeforces:") && item.disciplineId === "competitive-programming" &&
      Number.isFinite(item.occurredAt) && item.occurredAt > 0 &&
      ["correct", "incorrect", "partial"].includes(item.outcome))
      // Older saved attempts used the first tag as their subject. Tags are
      // co-equal concepts, so normalize legacy records in the projection.
      .map((item) => {
        const normalized = { ...item, subjectId: "codeforces" };
        // Older projections treated every accepted verdict as an independent
        // solve. Public submission records cannot support that inference.
        if (/^codeforces:\d+$/.test(item.id)) {
          delete normalized.independent;
          delete normalized.hintCount;
        }
        return normalized;
      })
    : toCodeforcesLearningAttempts(codeforcesSubmissions);
  const attempts = toCompetitionLearningAttempts(problemLog, revisionAttempts).concat(codeforcesAttempts).sort((a, b) => a.occurredAt - b.occurredAt || a.id.localeCompare(b.id));
  // Repeated submissions and re-solves of one problem are useful attempt history,
  // but mastery requires evidence across multiple distinct problems.
  const mastery = buildConceptMastery(attempts, { minDistinctQuestions: 3 });
  return {
    attempts,
    mastery,
    weakConcepts: recommendConceptPractice(mastery, 3),
    recurringMistakes: buildConceptMistakeSummary(attempts).slice(0, 3),
    revision: buildRevisionCandidates(attempts, now),
  };
}
