/** Shared contracts for the Limitless question-quality engine.
 * Discipline adapters map native question-bank records into this format;
 * they do not need to change their existing storage schema.
 */
export type QuestionFormat =
  | "single-choice" | "multiple-choice" | "statement-selection"
  | "assertion-reason" | "numerical" | "match" | "sequence"
  | "true-false" | "data-reading" | "graph-data" | "short-answer" | "proof";

export type Severity = "error" | "warning" | "review";

export type QualityIssue = {
  rule: string;
  severity: Severity;
  message: string;
  field?: string;
};

export type NormalizedQuestion = {
  id: string;
  format: QuestionFormat;
  stem: string;
  options?: { id: string; text: string; correct?: boolean }[];
  answer?: unknown;
  explanation?: string;
  source?: { course?: string; chapter?: string; topic?: string; subtopic?: string };
  difficulty?: { level?: number; scale?: number };
  metadata?: Record<string, unknown>;
};

export type ValidationProfile = {
  id: string;
  version: string;
  discipline: string;
  format: QuestionFormat;
  rules: {
    optionCount?: number;
    requireExplanation?: boolean;
    requireSource?: boolean;
    requireDifficulty?: boolean;
    allowMultipleCorrect?: boolean;
    forbiddenOptionPatterns?: RegExp[];
  };
  validateDomain?: (question: NormalizedQuestion) => QualityIssue[];
};

export type ValidationResult = {
  questionId: string;
  profileId: string;
  issues: QualityIssue[];
  passed: boolean;
};
