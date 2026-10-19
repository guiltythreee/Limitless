// app/courses/adapters/json.ts
//
// Read-only adapter for the JSON question pipelines used by MT201 and MT202.
// It does NOT re-implement loading: the caller injects the course's own
// `loadChapter` (from app/mt201/types.ts or app/mt202/types.ts), so the
// existing fetch/caching pipeline stays the single source of truth.
//
// Nothing is written, no storage key is read, and question ids are preserved
// verbatim as `${topicId}-q${n}` — exactly the progress key the courses
// already use.

import type {
  CourseContentAdapter,
  CourseManifest,
  CourseOutline,
  Difficulty,
  Lesson,
  Question,
  QuestionSolution,
  TopicContent,
} from "../types";
import { mapLesson, type RawLesson } from "./lesson";

/** Structural mirror of the MT201/MT202 chapter JSON (see their types.ts). */
export interface RawJsonQuestion {
  n: number;
  stars?: number;
  type?: string;
  traps?: string[];
  text?: string;
  statements?: { num: number; text: string }[];
  tableRows?: string[][];
  assertion?: string;
  reason?: string;
  options: { label: string; text: string }[];
  answer: string;
  keyExplanation?: string;
  concise?: string;
  detailed?: string;
}

export interface RawJsonChapter {
  id: string;
  num: number;
  title: string;
  topics?: { id: string; title: string }[];
  questions: RawJsonQuestion[];
}

export interface JsonAdapterOptions {
  manifest: CourseManifest;
  /** The course's existing loader, e.g. app/mt201/types.ts `loadChapter`. */
  loadChapter: (id: string) => Promise<RawJsonChapter>;
  /** Optional lesson provider (MT202). MT201 has no lessons. */
  lessonFor?: (topicId: string) => RawLesson | null | undefined;
}

/** Map a 0–3 star rating onto the canonical 1–4 difficulty scale. */
function normalizeStars(stars: number | undefined): Difficulty {
  const s = Math.round(stars ?? 0);
  return Math.min(4, Math.max(1, s)) as Difficulty;
}

const opt = (s: string | undefined): string | undefined => (s && s.length > 0 ? s : undefined);

function toQuestion(raw: RawJsonQuestion, topicId: string, n: number): Question {
  const solution: QuestionSolution = {
    keyExplanation: opt(raw.keyExplanation),
    concise: opt(raw.concise),
    detailed: opt(raw.detailed),
  };
  return {
    id: `${topicId}-q${n}`,
    n,
    topicId,
    type: raw.type ?? "",
    difficulty: normalizeStars(raw.stars),
    rawDifficulty: raw.stars,
    text: opt(raw.text),
    statements: raw.statements && raw.statements.length > 0 ? raw.statements : undefined,
    tableRows: raw.tableRows && raw.tableRows.length > 0 ? raw.tableRows : undefined,
    assertion: opt(raw.assertion),
    reason: opt(raw.reason),
    options: raw.options,
    answer: raw.answer,
    solution,
    tags: raw.traps && raw.traps.length > 0 ? raw.traps : undefined,
  };
}

export function createJsonAdapter(options: JsonAdapterOptions): CourseContentAdapter {
  const { manifest, loadChapter, lessonFor } = options;
  return {
    courseId: manifest.id,
    outline(): CourseOutline {
      return {
        courseId: manifest.id,
        units: manifest.units,
        topics: manifest.topics,
        totalQuestions: manifest.topics.reduce((sum, t) => sum + t.count, 0),
      };
    },
    async loadTopic(topicId: string): Promise<TopicContent> {
      const chapter = await loadChapter(topicId);
      const questions = chapter.questions.map((q, i) => toQuestion(q, topicId, q.n ?? i + 1));
      const lesson: Lesson | null = lessonFor ? mapLesson(lessonFor(topicId), topicId) : null;
      return { topicId, lesson, questions };
    },
  };
}
