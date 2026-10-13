import { lessons, type Difficulty, type QuizItem } from "../content";

export type Status = "correct" | "incorrect" | "partial" | "unattempted";

export type Q = {
  key: string; // "lessonId:index" - the same key the first release used for saved answers
  lessonId: string;
  index: number;
  rank: number; // the sequence (chapter) this topic belongs to
  item: QuizItem;
  difficulty: Difficulty;
};

export const allQuestions: Q[] = lessons.flatMap((l) =>
  l.quiz.map((item, index) => ({ key: `${l.id}:${index}`, lessonId: l.id, index, rank: l.rank, item, difficulty: item.difficulty ?? "easy" })),
);
export const questionByKey: Record<string, Q> = Object.fromEntries(allQuestions.map((q) => [q.key, q]));

export const correctSet = (item: QuizItem) => item.answers ?? [item.answer];
export const isMulti = (item: QuizItem) => (item.answers?.length ?? 0) > 1;

/** Marks an answer. A normal question is right or wrong; a multi-select question earns partial credit. */
export function grade(item: QuizItem, picked: number[]): { score: number; status: Exclude<Status, "unattempted"> } {
  const right = correctSet(item);
  const hits = picked.filter((p) => right.includes(p)).length;
  const wrong = picked.length - hits;
  if (!isMulti(item)) {
    const ok = picked.length === 1 && picked[0] === item.answer;
    return { score: ok ? 1 : 0, status: ok ? "correct" : "incorrect" };
  }
  const score = Math.max(0, (hits - wrong) / right.length);
  return { score, status: score === 1 ? "correct" : score > 0 ? "partial" : "incorrect" };
}
