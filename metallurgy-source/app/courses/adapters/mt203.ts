// app/courses/adapters/mt203.ts
//
// Read-only adapter for MT203's TypeScript pipeline. It wraps the course's
// own loaders (app/mt203/types.ts `loadTopic` / `loadModule`) and its lesson
// map, so behaviour is unchanged.
//
// CODE SPLITTING: `loadTopic` still resolves through the existing per-topic
// dynamic imports in app/mt203/types.ts. Importing this adapter never pulls in
// question text; only calling loadTopic(unit) fetches one topic (or unit).
// Question ids ("t4-014") are preserved verbatim.

import {
  loadTopic as loadSourceTopic,
  loadModule as loadSourceModule,
  type Question as SourceQuestion,
} from "../../mt203/types";
import { LESSONS } from "../../data/lessons-mt203";
import { mapLesson } from "./lesson";
import type {
  CourseContentAdapter,
  CourseManifest,
  CourseOutline,
  Question,
  TopicContent,
} from "../types";

function toQuestion(q: SourceQuestion): Question {
  return {
    id: q.id,
    n: q.n,
    topicId: q.topic,
    type: q.type,
    difficulty: q.diff,
    rawDifficulty: q.diff,
    text: q.text,
    statements: q.statements,
    tableRows: q.tableRows,
    assertion: q.assertion,
    reason: q.reason,
    options: q.options,
    answer: q.answer,
    solution: {
      keyExplanation: q.why,
      distractors: q.distractors,
      concept: q.concept,
    },
    tags: q.tags,
    timedOk: q.timedOk,
  };
}

export function createMt203Adapter(manifest: CourseManifest): CourseContentAdapter {
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
      const data = await loadSourceTopic(topicId);
      return {
        topicId,
        lesson: mapLesson(LESSONS[topicId], topicId),
        questions: data.questions.map(toQuestion),
      };
    },
    async loadUnit(unitId: string): Promise<Question[]> {
      const mod = await loadSourceModule(unitId);
      return mod.questions.map(toQuestion);
    },
  };
}
