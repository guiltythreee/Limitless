/** Discipline- and format-neutral validation runner. No file or UI access. */
export function validateQuestion(question, profile) {
  const issues = [];
  const add = (rule, severity, message, field) =>
    issues.push({ rule, severity, message, ...(field ? { field } : {}) });

  if (!question || typeof question !== "object") {
    add("CORE-000", "error", "Question record is missing");
    return { questionId: "(missing-record)", profileId: profile.id, issues, passed: false };
  }

  const rules = profile.rules || {};
  if (profile.format && question.format !== profile.format) {
    add("CORE-006", "error",
      `Profile expects format "${profile.format}"; question is "${question.format ?? "(missing)"}"`, "format");
  }

  if (!question.id) add("CORE-001", "error", "Question id is missing", "id");
  if (!question.stem?.trim()) add("CORE-002", "error", "Question stem is empty", "stem");

  if (rules.requireExplanation && !question.explanation?.trim()) {
    add("CORE-003", "error", "A worked or explanatory answer is required", "explanation");
  }
  if (rules.requireSource && !question.source?.subtopic) {
    add("CORE-004", "error", "Question must identify its source subtopic", "source.subtopic");
  }
  if (rules.requireDifficulty &&
      (!Number.isInteger(question.difficulty?.level) ||
       !Number.isInteger(question.difficulty?.scale) ||
       question.difficulty.level < 1 ||
       question.difficulty.level > question.difficulty.scale)) {
    add("CORE-005", "error", "Difficulty level must be valid for its declared scale", "difficulty");
  }

  if (question.options !== undefined && !Array.isArray(question.options)) {
    add("FORMAT-000", "error", "Options must be an array", "options");
  }
  const options = Array.isArray(question.options) ? question.options : [];
  if (rules.optionCount !== undefined && options.length !== rules.optionCount) {
    add("FORMAT-001", "error",
      `Expected ${rules.optionCount} options; found ${options.length}`, "options");
  }
  if (options.length) {
    const ids = options.map((o) => o?.id);
    if (ids.some((id) => !id) || new Set(ids).size !== ids.length) {
      add("FORMAT-002", "error", "Option identifiers must be present and unique", "options");
    }
    const correct = options.filter((o) => o?.correct === true);
    if (!rules.allowMultipleCorrect && correct.length !== 1) {
      add("FORMAT-003", "error", "Exactly one option must be marked correct", "options");
    }
    if (rules.allowMultipleCorrect && correct.length < 1) {
      add("FORMAT-004", "error", "At least one option must be marked correct", "options");
    }
    for (const option of options) {
      if (!option?.text?.trim()) add("FORMAT-005", "error", `Option ${option?.id || "?"} is empty`, "options");
      if ((rules.forbiddenOptionPatterns || []).some((pattern) => pattern.test(option?.text || ""))) {
        add("FORMAT-006", "error", "Option matches a prohibited answer-choice pattern", "options");
      }
    }
  }

  if (typeof profile.validateDomain === "function") {
    issues.push(...profile.validateDomain(question));
  }

  return {
    questionId: question.id || "(missing-id)",
    profileId: profile.id,
    issues,
    passed: !issues.some((issue) => issue.severity === "error"),
  };
}

export function validateBank(questions, profile) {
  return questions.map((question) => validateQuestion(question, profile));
}
