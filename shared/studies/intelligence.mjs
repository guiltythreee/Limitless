/**
 * Runtime implementation shared by browser-based CP/Maths Trainer and the
 * TypeScript Studies applications. Pure projections only; no storage writes,
 * grading, UI, or reward policy.
 */
const DAY_MS = 86_400_000;
const OUTCOMES = new Set(["correct", "partial", "incorrect", "skipped"]);
const CATEGORIES = new Set([
  "conceptual", "observation", "mathematical", "implementation",
  "time-management", "recall", "formula-selection", "units", "procedure",
]);

function validAttempt(a) {
  return !!a &&
    typeof a.id === "string" && a.id.trim() &&
    typeof a.disciplineId === "string" && a.disciplineId.trim() &&
    typeof a.courseId === "string" && a.courseId.trim() &&
    typeof a.contentId === "string" && a.contentId.trim() &&
    Array.isArray(a.conceptIds) &&
    OUTCOMES.has(a.outcome) &&
    Number.isFinite(a.occurredAt) && a.occurredAt > 0;
}

function cleanLabel(value) {
  return String(value).normalize("NFKC").trim().replace(/\s+/g, " ");
}

function normalisePart(value) {
  let result = "";
  for (const char of cleanLabel(value).toLocaleLowerCase()) {
    if (/[a-z0-9+#]/.test(char) || char.toUpperCase() !== char.toLowerCase()) result += char;
    else result += " ";
  }
  return result.replace(/\s+/g, " ").trim();
}

/** Normalise equivalent labels while preserving C++, C# and subject boundaries. */
export function normalizeConceptKey(disciplineId, subjectId, concept) {
  return [
    normalisePart(disciplineId),
    normalisePart(subjectId || "general"),
    normalisePart(concept),
  ].join("::");
}

/** A concept is mastered only with adequate accuracy and independent evidence. */
export function buildConceptMastery(attempts, options = {}) {
  const minSecure = options.minSecureAttempts ?? 5;
  const minMastery = options.minMasteryAttempts ?? 8;
  const groups = new Map();

  for (const attempt of attempts || []) {
    if (!validAttempt(attempt) || attempt.outcome === "skipped") continue;
    const subjectId = attempt.subjectId || "general";
    for (const raw of new Set(attempt.conceptIds)) {
      if (typeof raw !== "string" || !raw.trim()) continue;
      const label = cleanLabel(raw);
      const key = normalizeConceptKey(attempt.disciplineId, subjectId, label);
      const group = groups.get(key) || {
        disciplineId: attempt.disciplineId, subjectId, conceptId: key, label, attempts: [],
      };
      group.attempts.push(attempt);
      groups.set(key, group);
    }
  }

  return [...groups.entries()].map(([key, group]) => {
    const rows = group.attempts;
    const correct = rows.filter((a) => a.outcome === "correct").length;
    const partial = rows.filter((a) => a.outcome === "partial").length;
    const incorrect = rows.filter((a) => a.outcome === "incorrect").length;
    const accuracy = (correct + partial * 0.5) / rows.length;
    const independent = rows.filter((a) => a.independent === true && (a.hintCount ?? 0) === 0);
    const independentAccuracy = independent.length
      ? independent.filter((a) => a.outcome === "correct").length / independent.length
      : null;
    const status = rows.length < 3 ? "insufficient-data"
      : rows.length >= minMastery && accuracy >= 0.9 && independent.length >= 3 && independentAccuracy >= 0.85 ? "mastered"
      : rows.length >= minSecure && accuracy >= 0.75 ? "secure" : "developing";
    return {
      key, disciplineId: group.disciplineId, subjectId: group.subjectId,
      conceptId: group.conceptId, label: group.label, attempts: rows.length,
      correct, partial, incorrect, accuracy, independentAttempts: independent.length,
      independentAccuracy,
      lastPractisedAt: Math.max(...rows.map((a) => a.occurredAt)),
      status,
    };
  }).sort((a, b) =>
    a.disciplineId.localeCompare(b.disciplineId) ||
    a.subjectId.localeCompare(b.subjectId) ||
    a.label.localeCompare(b.label));
}

/** Group repeated mistakes by discipline, subject, concept and cause. */
export function buildConceptMistakeSummary(attempts) {
  const groups = new Map();
  for (const attempt of attempts || []) {
    if (!validAttempt(attempt) ||
        (attempt.outcome !== "incorrect" && attempt.outcome !== "partial") ||
        !CATEGORIES.has(attempt.mistakeCategory)) continue;
    const subjectId = attempt.subjectId || "general";
    for (const raw of new Set(attempt.conceptIds)) {
      if (typeof raw !== "string" || !raw.trim()) continue;
      const conceptLabel = cleanLabel(raw);
      const conceptId = normalizeConceptKey(attempt.disciplineId, subjectId, conceptLabel);
      const key = conceptId + "::" + attempt.mistakeCategory;
      const item = groups.get(key) || {
        key, disciplineId: attempt.disciplineId, subjectId, conceptId,
        conceptLabel, category: attempt.mistakeCategory, occurrences: 0, lastOccurredAt: 0,
      };
      item.occurrences += 1;
      item.lastOccurredAt = Math.max(item.lastOccurredAt, attempt.occurredAt);
      groups.set(key, item);
    }
  }
  return [...groups.values()].sort((a, b) =>
    b.occurrences - a.occurrences ||
    b.lastOccurredAt - a.lastOccurredAt ||
    a.key.localeCompare(b.key));
}

/**
 * Failed questions enter the queue after one day. Each successful revision
 * advances the 1/7/14/30-day ladder; another failure resets it.
 */
export function buildRevisionCandidates(attempts, now = Date.now(), intervalsDays = [1, 7, 14, 30]) {
  const groups = new Map();
  for (const attempt of attempts || []) {
    if (!validAttempt(attempt) || !attempt.questionId) continue;
    const key = [attempt.disciplineId, attempt.courseId, attempt.questionId].join("::");
    const rows = groups.get(key) || [];
    rows.push(attempt);
    groups.set(key, rows);
  }

  const result = [];
  for (const [key, rows] of groups) {
    rows.sort((a, b) => a.occurredAt - b.occurredAt);
    let lastFailure;
    let successfulRevisions = 0;
    let lastSuccessfulRevisionAt;
    let failures = 0;
    for (const row of rows) {
      if (row.outcome === "incorrect" || row.outcome === "partial") {
        lastFailure = row;
        failures += 1;
        successfulRevisions = 0;
        lastSuccessfulRevisionAt = undefined;
      } else if (row.mode === "revision" && row.outcome === "correct" &&
                 lastFailure && row.occurredAt > lastFailure.occurredAt) {
        successfulRevisions += 1;
        lastSuccessfulRevisionAt = row.occurredAt;
      }
    }
    if (!lastFailure) continue;
    const interval = intervalsDays[Math.min(successfulRevisions, intervalsDays.length - 1)] ?? 30;
    const dueAt = (lastSuccessfulRevisionAt ?? lastFailure.occurredAt) + interval * DAY_MS;
    const overdueDays = Math.max(0, Math.floor((now - dueAt) / DAY_MS));
    const candidate = {
      key, disciplineId: lastFailure.disciplineId, courseId: lastFailure.courseId,
      contentId: lastFailure.contentId, questionId: lastFailure.questionId,
      conceptIds: [...new Set(rows.flatMap((row) => row.conceptIds))],
      failures, lastFailureAt: lastFailure.occurredAt, dueAt, overdueDays,
      priority: (now >= dueAt ? 100 : 0) + failures * 10 + overdueDays,
    };
    if (lastSuccessfulRevisionAt !== undefined) candidate.lastReviewedAt = lastSuccessfulRevisionAt;
    result.push(candidate);
  }
  return result.sort((a, b) =>
    b.priority - a.priority || a.dueAt - b.dueAt || a.key.localeCompare(b.key));
}

/** Return the weakest concepts with enough evidence to be useful to practice. */
export function recommendConceptPractice(mastery, limit = 3) {
  return (mastery || [])
    .filter((item) => item.status === "developing" || item.status === "insufficient-data")
    .sort((a, b) => {
      const scoreA = a.attempts < 3 ? -1 : a.accuracy;
      const scoreB = b.attempts < 3 ? -1 : b.accuracy;
      return scoreA - scoreB || b.incorrect - a.incorrect || a.lastPractisedAt - b.lastPractisedAt;
    })
    .slice(0, Math.max(0, limit));
}
