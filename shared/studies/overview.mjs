import { toCompetitionLearningAttempts } from "../../competition/learning-intelligence.mjs";
import { toMathTrainerLearningAttempts } from "../../tools/math-refactored/learning-intelligence.mjs";
import {
  buildConceptMastery,
  buildConceptMistakeSummary,
  recommendConceptPractice,
} from "./intelligence.mjs";

const CATEGORIES = new Set([
  "conceptual", "observation", "mathematical", "implementation",
  "time-management", "recall", "formula-selection", "units", "procedure",
]);
const MODES = new Set(["learn", "practice", "exam", "revision", "contest"]);

function probabilityAttempts(state) {
  const rows = Array.isArray(state?.attempts) ? state.attempts : [];
  return rows.flatMap((row, index) => {
    if (!row || typeof row !== "object" || typeof row.q !== "string") return [];
    const [lessonId] = row.q.split(":");
    const occurredAt = Number(row.ts);
    if (!lessonId || !Number.isFinite(occurredAt) || occurredAt <= 0 ||
        !["correct", "partial", "incorrect"].includes(row.status)) return [];
    return [{
      id: typeof row.id === "string" ? row.id : `probability:${row.q}:${occurredAt}:${index}`,
      disciplineId: "probability",
      courseId: "probability-archive",
      contentId: lessonId,
      questionId: row.q,
      subjectId: lessonId,
      conceptIds: [lessonId],
      outcome: row.status,
      occurredAt,
      elapsedMs: Number.isFinite(Number(row.ms)) ? Number(row.ms) : undefined,
      independent: true,
      hintCount: 0,
      mistakeCategory: CATEGORIES.has(row.mistakeCategory) ? row.mistakeCategory : undefined,
      reviewedAt: Number.isFinite(Number(row.reviewedAt)) ? Number(row.reviewedAt) : undefined,
    }];
  });
}

function topicFromQuestion(courseId, questionId) {
  if (typeof questionId !== "string") return "";
  if (courseId === "mt203") return questionId.split("-")[0] || "";
  const match = /^(.+)-q\d+$/.exec(questionId);
  return match ? match[1] : "";
}

function metallurgyActivityAttempts(courseId, state, classifications) {
  if (!state || typeof state !== "object") return [];
  let rows = Array.isArray(state.activities) ? state.activities : [];
  if (!rows.length && courseId === "mt203" && Array.isArray(state.attempts)) {
    rows = state.attempts.map((attempt) => ({
      ...attempt,
      courseId,
      topicId: topicFromQuestion(courseId, attempt.q),
      picked: typeof attempt.picked === "string" ? attempt.picked : "",
    }));
  }
  if (!rows.length && state.answered && typeof state.answered === "object" && !Array.isArray(state.answered)) {
    rows = Object.entries(state.answered).map(([q, answer]) => ({
      courseId, q, topicId: topicFromQuestion(courseId, q),
      picked: answer?.choice || "", correct: answer?.correct === true,
      mode: "practice", ms: 0, ts: answer?.at, source: "legacy",
    }));
  }
  return rows.flatMap((row, index) => {
    if (!row || typeof row !== "object" || typeof row.q !== "string") return [];
    const topicId = typeof row.topicId === "string" && row.topicId
      ? row.topicId : topicFromQuestion(courseId, row.q);
    const occurredAt = Number(row.ts);
    if (!topicId || !Number.isFinite(occurredAt) || occurredAt <= 0 || typeof row.correct !== "boolean") return [];
    const mode = MODES.has(row.mode) ? row.mode : undefined;
    const picked = typeof row.picked === "string" ? row.picked : "";
    const classificationKey = [courseId, row.q, row.ts, mode || "practice", picked].join("|");
    const classification = classifications?.[classificationKey];
    const category = CATEGORIES.has(row.mistakeCategory) ? row.mistakeCategory
      : CATEGORIES.has(classification?.category) ? classification.category : undefined;
    return [{
      id: `${courseId}:${row.q}:${occurredAt}:${index}`,
      disciplineId: "metallurgy",
      courseId,
      contentId: topicId,
      questionId: row.q,
      subjectId: courseId,
      conceptIds: [courseId.toUpperCase() + " " + topicId],
      outcome: row.correct ? "correct" : "incorrect",
      occurredAt,
      elapsedMs: Number.isFinite(Number(row.ms)) && Number(row.ms) > 0 ? Number(row.ms) : undefined,
      independent: row.independent === true || row.source === "recorded",
      hintCount: Number.isFinite(Number(row.hintCount)) ? Number(row.hintCount) : row.source === "recorded" ? 0 : undefined,
      mode,
      mistakeCategory: category,
      reviewedAt: Number.isFinite(Number(classification?.reviewedAt))
        ? Number(classification.reviewedAt)
        : Number.isFinite(Number(row.reviewedAt)) ? Number(row.reviewedAt) : undefined,
    }];
  });
}

/** Build a read-only, cross-section view from the applications' existing local progress shapes. */
export function buildCrossDisciplineOverview(snapshot = {}) {
  const cp = toCompetitionLearningAttempts(snapshot.competition?.problemLog || []);
  const math = toMathTrainerLearningAttempts(snapshot.mathAttempts || [], snapshot.mathRuns || []);
  const probability = probabilityAttempts(snapshot.probability || {});
  const metallurgy = [
    metallurgyActivityAttempts("mt201", snapshot.metallurgy?.mt201, snapshot.classifications),
    metallurgyActivityAttempts("mt202", snapshot.metallurgy?.mt202, snapshot.classifications),
    metallurgyActivityAttempts("mt203", snapshot.metallurgy?.mt203, snapshot.classifications),
  ].flat();
  const attempts = [...cp, ...math, ...probability, ...metallurgy];
  const mastery = buildConceptMastery(attempts);
  const recurringMistakes = buildConceptMistakeSummary(attempts).slice(0, 8);
  const labels = {
    "competitive-programming": "Competitive Programming",
    mathematics: "Math Trainer",
    probability: "Probability",
    metallurgy: "Metallurgy",
  };
  const sections = Object.entries(labels).map(([id, label]) => {
    const sectionAttempts = attempts.filter((attempt) => attempt.disciplineId === id);
    const concepts = mastery.filter((item) => item.disciplineId === id);
    return {
      id, label, attempts: sectionAttempts.length, concepts: concepts.length,
      secure: concepts.filter((item) => item.status === "secure" || item.status === "mastered").length,
      developing: concepts.filter((item) => item.status === "developing").length,
      mastered: concepts.filter((item) => item.status === "mastered").length,
    };
  });
  return {
    attempts,
    mastery,
    sections,
    recurringMistakes,
    focus: recommendConceptPractice(mastery, 8),
    totalAttempts: attempts.length,
    trackedConcepts: mastery.length,
  };
}
