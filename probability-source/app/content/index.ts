import type { Example, Lesson } from "./types";
import { pad2 } from "./types";
import { rank09 } from "./rank09";
import { rank09Extra } from "./rank09-extra";
import { legacyLessons } from "./legacy";
import { mcqByLesson } from "./rank09-mcq";
import { mcqSources } from "./rank09-meta";
import { theoryAdditions, geometricProbability, borelCantelli } from "./chapter1-theory";
import { problemsA } from "./chapter1-problems-a";
import { problemsB } from "./chapter1-problems-b";
import { problemsC } from "./chapter1-problems-c";
import { pathwayLessons } from "./pathway-lessons";
import { advancedPathwayLessons } from "./pathway-lessons-advanced";

export { pathways } from "./pathways";
export { coverageAreas } from "./coverage";

export * from "./types";
export * from "./backgrounds";

// Teaching order inside rank 09. Lessons not listed here keep their file order after the listed ones.
const rank09Order = [
  "sample-space", "events-operations", "set-theory", "mutually-exclusive", "exhaustive-partitions",
  "counting", "combinations", "multinomials",
  "axioms", "properties", "equally-likely", "probability-counting", "geometric-probability",
  "de-morgan", "continuity", "borel-cantelli",
];
const position = (l: Lesson) => {
  if (l.rank !== 9) return 0;
  const i = rank09Order.indexOf(l.id);
  return i === -1 ? rank09Order.length : i;
};

// Chapter 1 problem set (54 problems), keyed by lesson id.
const problems: Record<string, Example[]> = {};
for (const part of [problemsA, problemsB, problemsC]) {
  for (const [id, list] of Object.entries(part)) problems[id] = [...(problems[id] ?? []), ...list];
}

// Adds the textbook theory, the worked problems and the practice questions to each rank 09 lesson.
const enrich = (l: Lesson): Lesson => {
  if (l.rank !== 9) return l;
  const add = theoryAdditions[l.id];
  return {
    ...l,
    body: [...l.body, ...(add?.body ?? [])],
    formulas: [...l.formulas, ...(add?.formulas ?? [])],
    examples: [...l.examples, ...(add?.examples ?? []), ...(problems[l.id] ?? [])],
    quiz: [
      ...l.quiz.map((q) => ({ ...q, difficulty: q.difficulty ?? ("easy" as const) })),
      ...(mcqByLesson[l.id] ?? []).map((q, i) => {
        const source = mcqSources[l.id]?.[i];
        return { ...q, source, difficulty: source?.startsWith("M") ? ("medium" as const) : ("easy" as const) };
      }),
    ],
  };
};

// Lessons are listed from rank 09 down to rank 00, in teaching order.
export const lessons: Lesson[] = [...rank09, ...rank09Extra, geometricProbability, borelCantelli, ...legacyLessons, ...pathwayLessons, ...advancedPathwayLessons]
  .map(enrich)
  .sort((a, b) => b.rank - a.rank || position(a) - position(b));

// Chapter number shown in the interface, e.g. "09.1" is the first lesson of rank 09.
export const unitOf: Record<string, string> = {};
{
  const seen: Record<number, number> = {};
  for (const l of lessons) {
    seen[l.rank] = (seen[l.rank] ?? 0) + 1;
    unitOf[l.id] = `${pad2(l.rank)}.${seen[l.rank]}`;
  }
}
