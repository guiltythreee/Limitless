/** Lossless view adapter for MT203's existing question records. */
const FORMAT_BY_TYPE = Object.freeze({
  recall: "single-choice",
  concept: "single-choice",
  compare: "single-choice",
  apply: "single-choice",
  higher: "single-choice",
  numerical: "numerical",
  assertreason: "assertion-reason",
  statement: "statement-selection",
  match: "match",
  sequence: "sequence",
  graph: "graph-data",
});

export function adaptMT203Question(q, topic) {
  const format = FORMAT_BY_TYPE[q.type];
  if (!format) {
    throw new Error(`Unsupported MT203 question type: ${q.type}`);
  }

  return {
    id: q.id,
    format,
    stem: q.text || [q.assertion, q.reason].filter(Boolean).join("\n"),
    options: (q.options || []).map((o) => ({
      id: o.label,
      text: o.text,
      correct: o.label === q.answer,
    })),
    answer: q.answer,
    explanation: q.why,
    source: { course: "MT203", chapter: q.module || topic.module, topic: topic.id, subtopic: q.sub },
    difficulty: { level: q.qsLevel ?? q.diff, scale: q.qsLevel ? 5 : 4 },
    metadata: {
      distractors: q.distractors || {},
      misconceptions: q.misconceptions || {},
      reviewerScore: q.qsScore,
      revision: q.rev ?? 1,
      legacyDifficulty: q.diff,
      legacyType: q.type,
    },
  };
}
