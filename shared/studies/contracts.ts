/**
 * Discipline-neutral contracts for the Limitless Studies layer.
 *
 * These describe discovery and read projections only. Discipline-owned
 * adapters remain authoritative for content, grading, persistence and mastery.
 * No React, browser storage, course imports or reward-policy dependencies.
 */

export type StudyDisciplineId = string;
export type StudyContentId = string;
export type StudyPathwayId = string;

export type StudyContentKind =
  | "course"
  | "lesson"
  | "topic"
  | "practice-set"
  | "assessment"
  | "resource";

export type StudyCapability =
  | "theory"
  | "formulas"
  | "examples"
  | "practice"
  | "assessment"
  | "answer-review"
  | "revision"
  | "subject-tools"
  | "bookmarks"
  | "drafts"
  | "timers"
  | "attempt-history"
  | "analytics"
  | "goals"
  | "mastery";

export interface StudyDisciplineDescriptor {
  /** Stable, lowercase identifier; never reused for another discipline. */
  id: StudyDisciplineId;
  title: string;
  description: string;
  /** Existing app route or future Studies route; resolved by the host app. */
  route: string;
  status: "active" | "planned";
  /** Only capabilities that the discipline can actually provide. */
  capabilities: readonly StudyCapability[];
}

export interface StudyContentRef {
  /** Stable ID within the discipline, retained across pathway changes. */
  id: StudyContentId;
  disciplineId: StudyDisciplineId;
  kind: StudyContentKind;
  title?: string;
  description?: string;
  route?: string;
  /** Optional parent reference, e.g. a lesson's course or topic. */
  parentId?: StudyContentId;
  /** Optional narrower capability set for this course/content entry. */
  capabilities?: readonly StudyCapability[];
}

export interface StudyPathway {
  id: StudyPathwayId;
  disciplineId: StudyDisciplineId;
  title: string;
  description?: string;
  /** Ordered references to canonical content; may overlap other pathways. */
  contentIds: readonly StudyContentId[];
}

export type StudyProgressStatus =
  | "not-started"
  | "in-progress"
  | "completed";

export interface StudyProgressSnapshot {
  contentId: StudyContentId;
  status?: StudyProgressStatus;
  /** Discipline-defined mastery projection; omitted when not meaningful. */
  mastery?: {
    value: number;
    scale: "fraction" | "percent";
    label?: string;
  };
  /** Omit when the source does not know the timestamp. */
  lastActivityAt?: number;
}

export interface StudyDisciplineRegistration {
  descriptor: StudyDisciplineDescriptor;
  content: readonly StudyContentRef[];
  pathways: readonly StudyPathway[];
  /** Read-only projection from the discipline's existing canonical store. */
  readProgress?: () => readonly StudyProgressSnapshot[];
}
