import { useSyncExternalStore } from "react";
import { allQuestions, grade, questionByKey, type Status } from "./questions";
import { pathways } from "../content";
import { buildRewardRecords, dispatchRewardUpdate, sanitiseRewardRecords, CHECKPOINT_PASS_THRESHOLD, type DifficultyTier, type RewardRecord } from "../../../shared/rewards.mjs";

const REWARD_ACTIVATED_AT_KEY = "limitless.reward.probability-activated-at.v1";
const PATHWAY_VERSION = "probability-lsr1-pathways-v1";
let rewardActivatedAt = 0;

/*
  All saved data lives in one localStorage entry ("hc3-progress-v3"):
    completed  - lessons marked complete
    attempts   - every submitted answer, each with its own time (a retry is a new attempt)
    bookmarks  - saved questions
    drafts     - the running stopwatch and unsent choice of a question that was left half-way
    goal       - daily goal (questions per day), goalByDay - the goal that applied on each day
  The older keys (hc3-progress-v2 and v1) are read once to carry old answers over and are never deleted.
*/
export const STORAGE_KEY = "hc3-progress-v3";

export type Attempt = {
  id: string;
  q: string; // question key
  picked: number[];
  score: number; // 0..1
  status: Exclude<Status, "unattempted">;
  ms: number; // time spent on this attempt
  ts: number; // when it was submitted (0 = carried over from an older version, date unknown)
};
export type Draft = { ms: number; picked: number[] };
export type TestRecord = {
  id: string;
  ts: number;
  label: string; // what the test covered
  total: number; // questions in the test
  answered: number;
  correct: number;
  score: number; // points earned (partial credit counts)
  ms: number; // total time
  results: { q: string; status: Status | "unattempted"; ms: number }[];
};
export type State = {
  completed: string[];
  tests: TestRecord[];
  attempts: Attempt[];
  rewardLedger: RewardRecord[];
  bookmarks: string[];
  drafts: Record<string, Draft>;
  goal: number;
  goalByDay: Record<string, number>;
  [extension: string]: unknown;
};

export const DEFAULT_GOAL = 10;
const EMPTY: State = { completed: [], tests: [], attempts: [], rewardLedger: [], bookmarks: [], drafts: {}, goal: DEFAULT_GOAL, goalByDay: {} };

export const dayKey = (ts: number) => {
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const UNCHANGED_V1 = ["conditional", "bayes", "random-variables", "distributions", "limit-theorems", "markov"];
const PROGRESS_ROOT_FIELDS = new Set([
  "completed", "tests", "attempts", "rewardLedger", "bookmarks", "drafts", "goal", "goalByDay", "answered",
]);
function unknownRootFields(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const extras: Record<string, unknown> = {};
  for (const [key, field] of Object.entries(value as Record<string, unknown>)) {
    if (!PROGRESS_ROOT_FIELDS.has(key)) extras[key] = field;
  }
  return extras;
}

function legacyAttempt(q: string, pick: number, n: number): Attempt | null {
  const item = questionByKey[q]?.item;
  if (!item || typeof pick !== "number") return null;
  const g = grade(item, [pick]);
  return { id: `legacy-${n}`, q, picked: [pick], score: g.score, status: g.status, ms: 0, ts: 0 };
}

function migrate(): State {
  const s: State = { ...EMPTY, drafts: {}, goalByDay: {} };
  let extras: Record<string, unknown> = {};
  try {
    const v2 = localStorage.getItem("hc3-progress-v2");
    const v1 = localStorage.getItem("hc3-progress-v1");
    let answered: Record<string, number> = {};
    if (v2) {
      const p = JSON.parse(v2);
      extras = unknownRootFields(p);
      if (Array.isArray(p.completed)) s.completed = p.completed;
      if (p.answered && typeof p.answered === "object") answered = p.answered;
    } else if (v1) {
      const p = JSON.parse(v1);
      extras = unknownRootFields(p);
      if (Array.isArray(p.completed)) s.completed = p.completed;
      if (p.answered && typeof p.answered === "object") {
        for (const id of UNCHANGED_V1) if (p.answered[id] !== undefined) answered[`${id}:0`] = p.answered[id];
      }
    }
    let n = 0;
    for (const [q, pick] of Object.entries(answered)) {
      const a = legacyAttempt(q, pick, n++);
      if (a) s.attempts.push(a);
    }
  } catch { /* old data unreadable: start fresh */ }
  return { ...extras, ...s };
}

function read(): State {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const p = JSON.parse(raw);
      return {
        ...unknownRootFields(p),
        completed: Array.isArray(p.completed) ? p.completed : [],
        tests: Array.isArray(p.tests) ? p.tests : [],
        attempts: Array.isArray(p.attempts) ? p.attempts : [],
        rewardLedger: sanitiseRewardRecords(p.rewardLedger),
        bookmarks: Array.isArray(p.bookmarks) ? p.bookmarks : [],
        drafts: p.drafts && typeof p.drafts === "object" ? p.drafts : {},
        goal: typeof p.goal === "number" && p.goal > 0 ? p.goal : DEFAULT_GOAL,
        goalByDay: p.goalByDay && typeof p.goalByDay === "object" ? p.goalByDay : {},
      };
    }
  } catch { /* fall through to migration */ }
  return migrate();
}

let state: State = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function persist(value: State = state): boolean {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(value)); return true; }
  catch { /* storage full or blocked */ return false; }
}
function commit(next: State): boolean {
  // Keep the live UI responsive even when storage is unavailable, but report
  // whether the canonical record was actually persisted before issuing rewards.
  const saved = persist(next);
  state = next;
  listeners.forEach((l) => l());
  return saved;
}
function ensureLoaded() {
  if (!loaded && typeof window !== "undefined") {
    loaded = true;
    rewardActivatedAt = setRewardActivationBaseline();
    state = read();
    persist();
    window.addEventListener("storage", (e) => {
      if (e.key === STORAGE_KEY) { state = read(); listeners.forEach((l) => l()); }
    });
  }
}

export function useStore(): State {
  return useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => listeners.delete(cb); },
    () => { ensureLoaded(); return state; },
    () => EMPTY,
  );
}
/** False while the server-rendered page is shown, true once the saved data has been read. */
export function useHydrated(): boolean {
  return useSyncExternalStore(() => () => {}, () => true, () => false);
}

// ---------- actions ----------
function rewardTier(difficulty: string | undefined): DifficultyTier {
  if (difficulty === "hard") return "advanced";
  if (difficulty === "medium") return "intermediate";
  return "foundational";
}

function setRewardActivationBaseline(): number {
  try {
    const raw = localStorage.getItem(REWARD_ACTIVATED_AT_KEY);
    if (raw !== null && Number.isFinite(Number(raw)) && Number(raw) > 0) return Number(raw);
    const activatedAt = Date.now();
    localStorage.setItem(REWARD_ACTIVATED_AT_KEY, String(activatedAt));
    return activatedAt;
  } catch {
    return Date.now();
  }
}

type QuestionRecord = (typeof allQuestions)[number];

function difficultyForQuestions(questions: QuestionRecord[]): DifficultyTier {
  const mean = questions.length
    ? questions.reduce((sum, question) => sum + (question.difficulty === "hard" ? 3 : question.difficulty === "medium" ? 2 : 1), 0) / questions.length
    : 1;
  return mean >= 2.5 ? "advanced" : mean >= 1.5 ? "intermediate" : "foundational";
}

function verifiedMasteryRewards(attempts: Attempt[], priorRecords: RewardRecord[]): RewardRecord[] {
  const eligible = attempts.filter((attempt) => attempt.ts > 0 && attempt.ts >= rewardActivatedAt);
  if (!eligible.length) return [];
  const latest = latestByQuestion(eligible);
  const records: RewardRecord[] = [];
  const existingIds = new Set(priorRecords.map((record) => record.eventId));
  const currentLatest = (questions: QuestionRecord[]) => questions.map((question) => latest[question.key]?.score);
  const hasMastery = (questions: QuestionRecord[]) => {
    const scores = currentLatest(questions);
    return questions.length > 0 && scores.every((score) => typeof score === "number") &&
      scores.reduce((sum, score) => sum + (score ?? 0), 0) / scores.length >= 0.8;
  };
  const add = (input: Parameters<typeof buildRewardRecords>[0]) => {
    if (existingIds.has(input.eventId) || records.some((record) => record.eventId === input.eventId)) return;
    const next = buildRewardRecords(input, [...priorRecords, ...records]);
    records.push(...next);
    for (const record of next) existingIds.add(record.eventId);
  };
  const timestampFor = (questions: QuestionRecord[]) =>
    Math.max(rewardActivatedAt, ...questions.map((question) => latest[question.key]?.ts ?? 0));
  const qualityFor = (questions: QuestionRecord[]) => {
    const scores = currentLatest(questions);
    return scores.length ? scores.reduce((sum, score) => sum + (score ?? 0), 0) / scores.length : 0;
  };

  for (const [lessonId, questions] of Object.entries(QUESTIONS_BY_LESSON)) {
    if (!hasMastery(questions)) continue;
    const eventId = `probability:lesson-mastery:${PATHWAY_VERSION}:${lessonId}`;
    add({
      eventId,
      moduleId: "probability",
      itemId: eventId,
      ts: timestampFor(questions),
      activityClass: "unit-milestone",
      difficulty: difficultyForQuestions(questions),
      completionEvidence: "topic-mastery",
      completed: true,
      quality: qualityFor(questions),
    });
  }

  const allLessonIds = Object.keys(QUESTIONS_BY_LESSON);
  for (const pathway of pathways) {
    const lessonQuestions = pathway.lessonIds.map((lessonId) => QUESTIONS_BY_LESSON[lessonId] ?? []);
    if (!lessonQuestions.length || lessonQuestions.some((questions) => !hasMastery(questions))) continue;
    // A pathway that is exactly the whole archive is represented by the single
    // course-completion milestone below, not two rewards for identical scope.
    const isWholeArchive = pathway.lessonIds.length === allLessonIds.length &&
      allLessonIds.every((lessonId) => pathway.lessonIds.includes(lessonId));
    if (isWholeArchive) continue;
    const questions = lessonQuestions.flat();
    const eventId = `probability:pathway-mastery:${PATHWAY_VERSION}:${pathway.id}`;
    add({
      eventId,
      moduleId: "probability",
      itemId: eventId,
      ts: timestampFor(questions),
      activityClass: "major-completion",
      difficulty: difficultyForQuestions(questions),
      completionEvidence: "pathway-complete",
      completed: true,
      quality: qualityFor(questions),
    });
  }

  const allLessonQuestions = allLessonIds.flatMap((lessonId) => QUESTIONS_BY_LESSON[lessonId]);
  if (allLessonQuestions.length && allLessonIds.every((lessonId) => hasMastery(QUESTIONS_BY_LESSON[lessonId]))) {
    const eventId = `probability:course-completion:${PATHWAY_VERSION}`;
    add({
      eventId,
      moduleId: "probability",
      itemId: eventId,
      ts: timestampFor(allLessonQuestions),
      activityClass: "major-completion",
      difficulty: "advanced",
      completionEvidence: "pathway-complete",
      completed: true,
      quality: qualityFor(allLessonQuestions),
    });
  }
  return records;
}

type AttemptInput = { q: string; picked: number[]; ms: number };

function prepareAttempts(inputs: AttemptInput[]) {
  const attempts: Attempt[] = [];
  const drafts = { ...state.drafts };
  const goalByDay = { ...state.goalByDay };
  for (const input of inputs) {
    const question = questionByKey[input.q];
    if (!question || !Array.isArray(input.picked) || input.picked.length === 0) continue;
    const ts = Date.now();
    const g = grade(question.item, input.picked);
    const attempt: Attempt = {
      id: `${ts}-${Math.random().toString(36).slice(2, 7)}`,
      q: input.q,
      picked: [...input.picked],
      score: g.score,
      status: g.status,
      ms: Math.max(0, Math.round(input.ms)),
      ts,
    };
    attempts.push(attempt);
    delete drafts[input.q];
    const today = dayKey(ts);
    if (goalByDay[today] === undefined) goalByDay[today] = state.goal;
  }
  return { attempts, drafts, goalByDay };
}

function rewardAssessment(t: TestRecord, prior: RewardRecord[]) {
  const questionKeys = [...new Set(t.results.map((result) => result.q))].sort();
  const itemId = `assessment:${questionKeys.join("|") || "empty"}`;
  const numericDifficulties = questionKeys
    .map((key) => questionByKey[key]?.difficulty ?? "easy")
    .map((difficulty) => difficulty === "hard" ? 3 : difficulty === "medium" ? 2 : 1);
  const averageDifficulty = numericDifficulties.length
    ? numericDifficulties.reduce((sum, value) => sum + value, 0) / numericDifficulties.length
    : 1;
  const difficulty: DifficultyTier = averageDifficulty >= 2.5 ? "advanced" : averageDifficulty >= 1.5 ? "intermediate" : "foundational";
  const meaningful = t.total >= 5 && t.answered >= 5;
  const completed = meaningful && t.total > 0 && t.answered === t.total;
  const quality = t.total > 0 ? Math.max(0, Math.min(1, t.score / t.total)) : 0;
  const fullArchiveCheckpoint = t.label === "All of probability" && t.total === allQuestions.length;
  const fullPathway = pathways.find((pathway) => `All of ${pathway.shortLabel}` === t.label);
  const fullPathwayQuestionCount = fullPathway
    ? allQuestions.filter((question) => fullPathway.lessonIds.includes(question.lessonId)).length
    : 0;
  const fullPathwayCheckpoint = !!fullPathway && t.total === fullPathwayQuestionCount;
  const checkpointId = fullArchiveCheckpoint
    ? "probability:full-archive"
    : fullPathwayCheckpoint && fullPathway
      ? `probability:pathway:${fullPathway.id}`
      : null;
  return buildRewardRecords({
    eventId: `probability:assessment:${t.id}`,
    moduleId: "probability",
    itemId,
    ts: t.ts,
    activityClass: "assessment",
    difficulty,
    completionEvidence: completed ? "fully-answered-assessment" : "incomplete-assessment",
    completed,
    quality,
    passed: !!checkpointId && completed && quality >= CHECKPOINT_PASS_THRESHOLD,
    checkpointId,
  }, prior);
}

export function recordAttemptsBatch(inputs: AttemptInput[], rewardActivity = true): Attempt[] {
  ensureLoaded();
  if (!Array.isArray(inputs) || !inputs.length) return [];
  const prepared = prepareAttempts(inputs);
  if (!prepared.attempts.length) return [];
  const rewards: RewardRecord[] = [];
  if (rewardActivity) {
    for (const attempt of prepared.attempts) {
      const question = questionByKey[attempt.q];
      const next = buildRewardRecords({
        eventId: `probability:attempt:${attempt.id}`,
        moduleId: "probability",
        itemId: `question:${attempt.q}`,
        ts: attempt.ts,
        activityClass: "micro-practice",
        difficulty: rewardTier(question?.difficulty),
        completionEvidence: "submitted-answer",
        completed: attempt.picked.length > 0,
        quality: attempt.score,
      }, [...state.rewardLedger, ...rewards]);
      rewards.push(...next);
    }
  }
  // A topic/pathway milestone is credited only from post-activation submitted
  // answers and only when every question in scope has a latest >=80% result.
  rewards.push(...verifiedMasteryRewards([...state.attempts, ...prepared.attempts], [...state.rewardLedger, ...rewards]));
  const nextState = {
    ...state,
    attempts: [...state.attempts, ...prepared.attempts],
    rewardLedger: rewards.length ? [...state.rewardLedger, ...rewards] : state.rewardLedger,
    drafts: prepared.drafts,
    goalByDay: prepared.goalByDay,
  };
  const saved = commit(nextState);
  if (saved && rewards.some((record) => record.eligible && record.totalExp > 0)) dispatchRewardUpdate();
  return prepared.attempts;
}

export function recordAttempt(q: string, picked: number[], ms: number, rewardActivity = true): Attempt | null {
  return recordAttemptsBatch([{ q, picked, ms }], rewardActivity)[0] ?? null;
}

/** Persist submitted answers and the test record/reward ledger in one canonical root write. */
export function recordTestWithAttempts(t: TestRecord, inputs: AttemptInput[]): Attempt[] {
  ensureLoaded();
  // Repeated finish callbacks carrying the same assessment identity do not
  // append attempts, tests, or duplicate ledger rows.
  if (state.tests.some((existing) => existing.id === t.id)) return [];
  const prepared = prepareAttempts(Array.isArray(inputs) ? inputs : []);
  const rewards = rewardAssessment(t, [...state.rewardLedger]);
  rewards.push(...verifiedMasteryRewards(
    [...state.attempts, ...prepared.attempts],
    [...state.rewardLedger, ...rewards],
  ));
  const nextState = {
    ...state,
    tests: [...state.tests, t],
    attempts: [...state.attempts, ...prepared.attempts],
    rewardLedger: [...state.rewardLedger, ...rewards],
    drafts: prepared.drafts,
    goalByDay: prepared.goalByDay,
  };
  const saved = commit(nextState);
  if (saved && rewards.some((record) => record.eligible && record.totalExp > 0)) dispatchRewardUpdate();
  return prepared.attempts;
}

export function recordTest(t: TestRecord) {
  recordTestWithAttempts(t, []);
}
/** Saves a half-finished question. Does not re-render anything; it only protects against refreshes. */
export function saveDraft(q: string, draft: Draft) {
  state = { ...state, drafts: { ...state.drafts, [q]: draft } };
  persist();
}
export function clearDraft(q: string) {
  if (!state.drafts[q]) return;
  const drafts = { ...state.drafts };
  delete drafts[q];
  commit({ ...state, drafts });
}
export function toggleBookmark(q: string) {
  commit({ ...state, bookmarks: state.bookmarks.includes(q) ? state.bookmarks.filter((k) => k !== q) : [...state.bookmarks, q] });
}
export function markComplete(id: string) {
  if (!state.completed.includes(id)) commit({ ...state, completed: [...state.completed, id] });
}
export function setGoal(n: number) {
  const goal = Math.max(1, Math.min(500, Math.round(n) || DEFAULT_GOAL));
  commit({ ...state, goal, goalByDay: { ...state.goalByDay, [dayKey(Date.now())]: goal } });
}
export function resetAll() {
  // Lifetime LSR-1 awards and unknown extension fields are not ordinary study
  // data; preserve them while clearing Probability-owned study progress.
  commit({ ...unknownRootFields(state), ...EMPTY, rewardLedger: state.rewardLedger, drafts: {}, goalByDay: {} });
}

// ---------- derived data ----------
/** The most recent attempt of each question. */
export function latestByQuestion(attempts: Attempt[]): Record<string, Attempt> {
  const out: Record<string, Attempt> = {};
  for (const a of attempts) {
    const prev = out[a.q];
    if (!prev || a.ts >= prev.ts) out[a.q] = a;
  }
  return out;
}
export const totalQuestions = allQuestions.length;
