import {
  buildConceptMastery,
  buildConceptMistakeSummary,
  buildRevisionCandidates,
  recommendConceptPractice,
} from "../../shared/studies/intelligence.mjs";

const VALID_CATEGORIES = new Set([
  "conceptual", "observation", "mathematical", "implementation", "time-management",
  "recall", "formula-selection", "units", "procedure",
]);

/** Adapt Math Trainer's compact attempt history without changing its storage format. */
export function toMathTrainerLearningAttempts(rawAttempts, rawRuns = []) {
  if (!Array.isArray(rawAttempts)) return [];
  const modes = new Map((Array.isArray(rawRuns) ? rawRuns : [])
    .filter((run) => run && typeof run.id === "string")
    .map((run) => [run.id, run.mode]));
  return rawAttempts.flatMap((row) => {
    if (!row || typeof row !== "object" || Array.isArray(row)) return [];
    const runId = typeof row.run === "string" ? row.run : "";
    const index = Number(row.i);
    const timestamp = Number(row.ts);
    const skill = typeof row.s === "string" ? row.s.trim() : "";
    if (!runId || !Number.isInteger(index) || index < 1 || !skill ||
        !Number.isFinite(timestamp) || timestamp <= 0) return [];
    const outcome = row.r === "correct" ? "correct" : row.r === "skip" ? "skipped" : "incorrect";
    const mode = modes.get(runId);
    return [{
      id: runId + ":" + index,
      disciplineId: "mathematics",
      courseId: "math-trainer",
      contentId: typeof row.t === "string" && row.t ? row.t : "general",
      questionId: String(row.g || runId + ":" + index),
      subjectId: "mental-arithmetic",
      conceptIds: [skill],
      outcome,
      occurredAt: timestamp + index,
      elapsedMs: Number.isFinite(Number(row.time)) && Number(row.time) >= 0
        ? Number(row.time) * 1000 : undefined,
      independent: row.independent === true,
      hintCount: Number.isFinite(Number(row.hintCount)) ? Number(row.hintCount) : undefined,
      mode: ["learn", "practice", "exam", "revision", "contest"].includes(mode) ? mode : "practice",
      mistakeCategory: VALID_CATEGORIES.has(row.mistakeCategory) ? row.mistakeCategory : undefined,
    }];
  });
}

export function analyzeMathTrainerLearning(rawAttempts, rawRuns = [], now = Date.now()) {
  const attempts = toMathTrainerLearningAttempts(rawAttempts, rawRuns);
  const mastery = buildConceptMastery(attempts);
  return {
    attempts,
    mastery,
    weakConcepts: recommendConceptPractice(mastery, 5),
    recurringMistakes: buildConceptMistakeSummary(attempts).slice(0, 5),
    revision: buildRevisionCandidates(attempts, now).slice(0, 20),
  };
}
