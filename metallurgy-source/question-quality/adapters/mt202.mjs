/** Lossless view adapter for MT202 Physical Metallurgy chapter records.
 * Native question ids remain `chNN-qN`; source records are never mutated.
 */
const FORMAT_BY_TYPE = Object.freeze({
  A: "single-choice",
  B: "statement-selection",
  C: "assertion-reason",
  D: "match",
  E: "numerical",
  F: "true-false",
  G: "data-reading",
});

export function adaptMT202Question(question, chapter) {
  const format = FORMAT_BY_TYPE[question.type];
  if (!format) {
    throw new Error(`Unsupported MT202 question type: ${question.type}`);
  }

  const stem = question.type === "C"
    ? [question.assertion, question.reason].filter(Boolean).join("\\n")
    : question.text;

  return {
    id: `${chapter.id}-q${question.n}`,
    format,
    stem: stem || "",
    options: (question.options || []).map((option) => ({
      id: option.label,
      text: option.text,
      correct: option.label === question.answer,
    })),
    answer: question.answer,
    explanation: question.keyExplanation || question.detailed || question.concise || "",
    source: {
      course: "MT202",
      chapter: chapter.id,
    },
    difficulty: {
      level: question.stars,
      scale: 3,
    },
    metadata: {
      nativeType: question.type,
      nativeNumber: question.n,
      traps: question.traps || [],
      statements: question.statements || [],
      tableRows: question.tableRows || [],
      assertion: question.assertion || "",
      reason: question.reason || "",
      concise: question.concise || "",
      detailed: question.detailed || "",
    },
  };
}
