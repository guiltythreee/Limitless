// app/courses/types.ts
//
// Canonical, course-agnostic schema for the Metallurgy learning platform.
//
// Derived from the UNION of the three live courses (not from one of them):
//   MT201  JSON pipeline   app/mt201/types.ts        + public/data/mt201/*.json
//   MT202  JSON pipeline   app/mt202/types.ts        + app/data/lessons.ts
//   MT203  TypeScript pipeline  app/mt203/types.ts   + app/data/qbank/*.ts
//                                               + app/data/lessons-mt203.ts
//
// PHASE 1: this module is types-only. Nothing imports it except the registry
// and its test. No existing course page, component, storage key or data file
// is touched. Anything behind a "not built yet" capability flag defaults off.

import type { ComponentType } from "react";

/** Stable course identifier. Never reused for a different course. */
export type CourseId = string;
/** Topic identifier inside a course, e.g. "t4" (MT203) or "ch01" (MT201/MT202). */
export type TopicId = string;
/** Unit identifier (a module), e.g. "m1" (MT203 only). */
export type UnitId = string;

/** Normalised difficulty. JSON courses map their 0–3 `stars`; MT203 uses 1–4. */
export type Difficulty = 1 | 2 | 3 | 4;

// --------------------------------------------------------------- questions

export interface QuestionOption {
  label: string;
  text: string;
}

export interface Statement {
  num: number;
  text: string;
}

/**
 * Solution shape. MT201/MT202 provide {keyExplanation, concise, detailed};
 * MT203 provides {keyExplanation(=why), distractors, concept}. Only the fields
 * a course actually ships are populated.
 */
export interface QuestionSolution {
  /** Why the key is correct. MT202 `keyExplanation`; MT203 `why`. */
  keyExplanation?: string;
  /** Short solution line (MT201/MT202). */
  concise?: string;
  /** Full worked solution (MT201/MT202). */
  detailed?: string;
  /** Per-distractor explanation, keyed by option label (MT203). */
  distractors?: Record<string, string>;
  /** Governing equation / concept reference (MT203). */
  concept?: string;
}

/**
 * A single question. Question ids are PRESERVED verbatim from the source
 * (`ch01-q12` for MT201/MT202, `t4-014` for MT203) — never rewritten here.
 */
export interface Question {
  id: string;
  /** 1-based display index within its topic. */
  n: number;
  topicId: TopicId;
  /** Source taxonomy key: a letter "A".."G" (MT201/MT202) or a QType (MT203). */
  type: string;
  /** Normalised difficulty for cross-course ranking. */
  difficulty: Difficulty;
  /** Original star rating where the source has one (MT201/MT202), for lossless display. */
  rawDifficulty?: number;
  text?: string;
  statements?: Statement[];
  tableRows?: string[][];
  assertion?: string;
  reason?: string;
  options: QuestionOption[];
  /** Correct option label (single-answer across all three courses today). */
  answer: string;
  solution: QuestionSolution;
  tags?: string[];
  /** MT203: safe to serve in a timed exam. Undefined elsewhere. */
  timedOk?: boolean;
}

// ---------------------------------------------------------------- lessons

/** A theory section. Source files store {h, p}; adapted to {heading, body}. */
export interface Section {
  heading: string;
  body: string;
}

export interface Formula {
  name: string;
  expr: string;
  note?: string;
  vars?: string[];
}

/** A first-class worked example. No course populates this yet (examples: []). */
export interface Example {
  title: string;
  problem: string;
  steps: string[];
}

export interface Lesson {
  topicId: TopicId;
  title: string;
  subtitle?: string;
  aim?: string;
  sections: Section[];
  formulas: Formula[];
  memorise: string[];
  examples: Example[];
}

export interface Subtopic {
  id: string;
  title: string;
}

// ------------------------------------------------------- course structure

export interface Topic {
  id: TopicId;
  /** Present when the course groups topics into units/modules (MT203). */
  unitId?: UnitId;
  num: number;
  title: string;
  subtitle?: string;
  /** Declared question count — locked against the real source by the test. */
  count: number;
  /** Whether a theory lesson exists for this topic. */
  hasLesson: boolean;
}

/** A grouping level (module). Empty for courses whose source is a flat chapter list. */
export interface Unit {
  id: UnitId;
  num: number;
  title: string;
  topicIds: TopicId[];
}

export interface Taxonomy {
  types: { key: string; name: string }[];
  difficulties: { level: Difficulty; name: string }[];
}

// ------------------------------------------------------------ capabilities

/**
 * Explicit capability flags. `false` means "do not render this UI for the
 * course". The `pending` block deliberately defaults to false everywhere and
 * is reserved for later shared-layer work (Phase 5) — it must not be turned on
 * during Phase 1.
 */
export interface CourseCapabilities {
  // content
  theory: boolean;
  formulas: boolean;
  examples: boolean;
  subtopics: boolean;
  /** Real module grouping exists (MT203). */
  units: boolean;
  // practice
  practice: boolean;
  practiceScopes: {
    topic: boolean;
    unit: boolean;
    all: boolean;
    multiTopic: boolean;
  };
  weakArea: boolean;
  spacedRevision: boolean;
  // assessment
  exam: boolean;
  review: boolean;
  // progression
  dashboard: boolean;
  xp: boolean;
  mastery: boolean;
  goals: boolean;
  streaks: boolean;
  // subject tools
  tools: boolean;
  // ---- not built yet; default OFF (Phase 5) ----
  bookmarks: boolean;
  mistakes: boolean;
  timers: boolean;
  drafts: boolean;
  attemptHistory: boolean;
  analyticsCharts: boolean;
  periodFilters: boolean;
}

// ------------------------------------------------------------------ tools

export interface ToolDescriptor {
  id: string;
  title: string;
  description?: string;
  /** Lazy, code-split component loader (never executed by the registry test). */
  load: () => Promise<{ default: ComponentType<Record<string, never>> }>;
}

// ---------------------------------------------------------------- rewards

/**
 * Course-local reward policy. Reward economies are NOT shared across courses;
 * this only describes the policy a course already defines. MT203 is the only
 * course with one today (`mm-mt203-v1.awarded`, unchanged).
 */
export interface RewardDescriptor {
  /** XP per first-correct answer, indexed by difficulty. */
  payPerCorrect: Record<Difficulty, number>;
  /** One-time bonus per unit finished: unitNum * unitClearBonusPerUnit. */
  unitClearBonusPerUnit: number;
  /** One-time bonus per unit mastered: unitNum * masteryBonusPerUnit. */
  masteryBonusPerUnit: number;
  rankNames: string[];
}

// ------------------------------------------------------------- progress

export interface ExamBest {
  score: number;
  total: number;
  at: number;
}

/**
 * Read-only view over a course's saved progress. Implementations must never
 * migrate or rewrite storage; they only project the existing payload.
 * Storage keys are preserved exactly (`mm-mt201-v1` / `mm-mt202-v1` /
 * `mm-mt203-v1`).
 */
export interface ProgressView {
  readonly courseId: CourseId;
  readonly storageKey: string;
  answered(questionId: string): boolean;
  correct(questionId: string): boolean | undefined;
  best(): ExamBest | null;
  /** Total XP, or undefined when the course has no XP economy. */
  xp(): number | undefined;
  /** Daily goal, or undefined when the course has none. */
  goal(): number | undefined;
  /** Topics whose lesson has been marked read/complete. */
  completedTopics(): TopicId[];
}

export interface RewardProvider {
  readonly id: string;
  /** XP earned by one first-correct answer (0 when the course has no XP). */
  awardAnswer(
    question: Pick<Question, "id" | "topicId" | "difficulty">,
    correct: boolean
  ): number;
  /** Idempotent milestone settlement; returns XP granted. */
  settle?(view: ProgressView): number;
}

// ------------------------------------------------------- content adapters

export interface CourseOutline {
  courseId: CourseId;
  units: Unit[];
  topics: Topic[];
  totalQuestions: number;
}

export interface TopicContent {
  topicId: TopicId;
  lesson: Lesson | null;
  questions: Question[];
}

/**
 * Read-only adapter over a course's existing content pipeline. `outline()` is
 * cheap and synchronous (no question text). `loadTopic` is lazy so the later
 * shared player never has to load every question at once — MT203 keeps its
 * per-topic dynamic imports intact.
 */
export interface CourseContentAdapter {
  readonly courseId: CourseId;
  outline(): CourseOutline;
  loadTopic(topicId: TopicId): Promise<TopicContent>;
  /** Optional: all questions of one unit, still loaded lazily. */
  loadUnit?(unitId: UnitId): Promise<Question[]>;
}

// ------------------------------------------------------------- manifests

/** Pure data description of a course. Safe to import anywhere (no behaviour). */
export interface CourseManifest {
  id: CourseId;
  code: string;
  title: string;
  subtitle?: string;
  description: string;
  symbol?: string;
  status: "live" | "beta";
  /** Route segment under the app base path, e.g. "mt203". */
  route: string;
  /** Existing localStorage key — preserved, never rewritten. */
  storageKey: string;
  /** Where the source content lives, for reference/debugging. */
  contentBase?: string;
  capabilities: CourseCapabilities;
  units: Unit[];
  topics: Topic[];
  taxonomy: Taxonomy;
  tools: ToolDescriptor[];
  rewards?: RewardDescriptor;
}

/** A registry entry binds the declarative manifest to its content adapter. */
export interface CourseEntry {
  manifest: CourseManifest;
  adapter: CourseContentAdapter;
}
