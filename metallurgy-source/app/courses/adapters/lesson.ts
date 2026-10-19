// app/courses/adapters/lesson.ts
//
// Both MT202 (app/data/lessons.ts) and MT203 (app/data/lessons-mt203.ts)
// store lessons in the same {h,p} section shape. This maps either into the
// canonical Lesson. MT203's extra `num` field is ignored here.
//
// Read-only: never mutates the source lesson objects.

import type { Lesson, Section, Formula } from "../types";

export interface RawLesson {
  id: string;
  title: string;
  subtitle?: string;
  aim?: string;
  sections: { h: string; p: string }[];
  formulas: { name: string; expr: string; note?: string; vars?: string[] }[];
  memorise: string[];
}

export function mapLesson(raw: RawLesson | null | undefined, topicId: string): Lesson | null {
  if (!raw) return null;
  const sections: Section[] = raw.sections.map((s) => ({ heading: s.h, body: s.p }));
  const formulas: Formula[] = raw.formulas.map((f) => ({
    name: f.name,
    expr: f.expr,
    note: f.note,
    vars: f.vars,
  }));
  return {
    topicId,
    title: raw.title,
    subtitle: raw.subtitle,
    aim: raw.aim,
    sections,
    formulas,
    memorise: raw.memorise,
    examples: [], // no course ships worked-example data yet
  };
}
