// app/platform/learning/index.ts
//
// Public surface of the shared learning core. Import from here in course code;
// tests may import a specific module when they need to prove a boundary.

export type {
  Activity,
  ActivityFilter,
  ActivityLog,
  ActivityLogConfig,
  ActivitySource,
  ActivitySummary,
  AnswerInput,
  AttemptMode,
  NewActivity,
  Period,
  PeriodOption,
  QuestionMeta,
  QuestionMetaIndex,
  Scope,
} from "./types";
export { ATTEMPT_MODES, MAX_ACTIVITIES } from "./types";

export { PERIODS, dayKey, periodStart, startOfDay } from "./time";

export {
  activityKey,
  appendActivities,
  deriveLegacyActivities,
  inScope,
  indexQuestionMeta,
  latestByQuestion,
  metaOfQuestion,
  questionKey,
  sanitiseActivities,
  selectActivities,
  summarise,
  toActivities,
} from "./activities";

export { createActivityLog } from "./storage";
