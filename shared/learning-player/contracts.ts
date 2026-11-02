/**
 * P6.0 — discipline-neutral learning-player contracts.
 *
 * These contracts intentionally do not import React, course schemas, storage,
 * or grading implementations. Course adapters retain authority over content,
 * answer controls, grading, and persistence.
 */

export type PlayerQuestionId = string;
export type PlayerCourseId = string;

/** Lossless answer shapes for the formats currently used and plausible extensions. */
export type PlayerAnswer =
  | { kind: "single-choice"; optionId: string }
  | { kind: "multi-choice"; optionIds: readonly string[] }
  | { kind: "numeric"; value: number; unit?: string }
  | { kind: "text"; value: string };

export type PlayerAnswerStatus =
  | "correct"
  | "partial"
  | "incorrect"
  | "unattempted";

export interface PlayerGrade {
  /** True only when the response is fully correct. */
  correct: boolean;
  /** Normalised points earned, inclusive 0 and 1. */
  score: number;
  status: Exclude<PlayerAnswerStatus, "unattempted">;
  /** Optional course-authored feedback; the player does not interpret it. */
  feedback?: unknown;
}

export interface PlayerQuestionRef {
  courseId: PlayerCourseId;
  questionId: PlayerQuestionId;
}

export interface PlayerSubmission<TAnswer extends PlayerAnswer = PlayerAnswer> {
  question: PlayerQuestionRef;
  answer: TAnswer;
  grade: PlayerGrade;
  /** Milliseconds; 0 means unknown/not measured. */
  elapsedMs: number;
  submittedAt: number;
  mode: "learn" | "practice" | "exam" | "revision";
}

/**
 * A course adapter bridges its existing question model and persistence.
 * It must not silently change the course's grading semantics.
 */
export interface LearningPlayerAdapter<
  TQuestion,
  TAnswer extends PlayerAnswer,
  TDraft = unknown,
> {
  readonly courseId: PlayerCourseId;
  questionId(question: TQuestion): PlayerQuestionId;
  grade(question: TQuestion, answer: TAnswer): PlayerGrade;
  /** Defaults to true; false preserves courses that lock a question after its first submission. */
  canRetry?(question: TQuestion): boolean;
  /** Course-specific draft representation; absent means drafts are unsupported. */
  saveDraft?(question: TQuestion, answer: TAnswer, elapsedMs: number): TDraft;
  restoreDraft?(question: TQuestion, draft: TDraft): {
    answer: TAnswer;
    elapsedMs: number;
  } | null;
}

/** Minimal navigation state; question content and answers remain adapter-owned. */
export interface LearningPlayerState {
  index: number;
  phase: "answering" | "review";
  elapsedMs: number;
}

export type LearningPlayerAction =
  | { type: "next"; questionCount: number }
  | { type: "previous" }
  | { type: "submit" }
  | { type: "review" }
  | { type: "tick"; elapsedMs: number }
  | { type: "reset-question" };
