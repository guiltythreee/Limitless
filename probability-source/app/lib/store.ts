import { useSyncExternalStore } from "react";
import { lessons } from "../content";
import { allQuestions, grade, questionByKey, type Q, type Status } from "./questions";
import type { GlobalRewardInput, RewardDifficulty } from "./reward-types";

const REWARD_ACTIVATED_AT_KEY = "limitless.reward.probability-activated-at.v1";
const PATHWAY_VERSION = "probability-current-archive-v1";
const QUESTIONS_BY_LESSON: Record<string, Q[]> = {};
for (const question of allQuestions) (QUESTIONS_BY_LESSON[question.lessonId] ??= []).push(question);
let rewardActivatedAt = 0;

function recordGlobalRewards(inputs: GlobalRewardInput[]): boolean {
  if (!inputs.length) return true;
  if (typeof window === "undefined" || !window.LimitlessRewards) return false;
  try {
    const receipts = window.LimitlessRewards.recordMany(inputs);
    return receipts.length === inputs.length && receipts.every((receipt) => receipt.ok);
  } catch {
    return false;
  }
}

function rewardDifficulty(value: string | undefined): RewardDifficulty {
  if (value === "hard") return "advanced";
  if (value === "medium") return "intermediate";
  return "foundational";
}

function difficultyForQuestions(questions: Q[]): RewardDifficulty {
  const mean = questions.length
    ? questions.reduce((sum, question) => sum + (question.difficulty === "hard" ? 3 : question.difficulty === "medium" ? 2 : 1), 0) / questions.length
    : 1;
  return mean >= 2.5 ? "advanced" : mean >= 1.5 ? "intermediate" : "foundational";
}

function stableHash(value: string): string {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}

function rewardAttempt(attempt: Attempt): GlobalRewardInput | null {
  const question = questionByKey[attempt.q];
  if (!question) return null;
  return {
    module: "probability",
    eventId: `probability:attempt:${attempt.id}`,
    contentKey: `probability:question:${attempt.q}`,
    activityClass: "micro-practice",
    evidence: "submitted-answer",
    difficulty: rewardDifficulty(question.difficulty),
    quality: attempt.score,
    reason: `Submitted answer for ${attempt.q}`,
  };
}

function rewardAssessment(t: TestRecord): GlobalRewardInput | null {
  const questions = t.results
    .map((result) => questionByKey[result.q])
    .filter((question): question is Q => Boolean(question));
  const quality = t.total > 0 ? Math.max(0, Math.min(1, t.score / t.total)) : 0;
  const meaningfulAssessment = t.total >= 5 && t.answered >= 5;
  if (!meaningfulAssessment) return null;
  const passed = quality >= 0.8;
  const poolKey = stableHash([...new Set(questions.map((question) => question.key))].sort().join("|"));
  const assessmentKey = `probability:assessment:${poolKey}`;
  return {
    module: "probability",
    eventId: `probability:test:${t.id}`,
    contentKey: assessmentKey,
    activityClass: "assessment",
    evidence: "scored-assessment",
    difficulty: difficultyForQuestions(questions),
    quality,
    passed,
    passKey: `${assessmentKey}:first-pass`,
    reason: `Finished a scored test with ${t.answered} of ${t.total} questions answered`,
  };
}

function rewardLessonMastery(lessonId: string, latest: Record<string, Attempt>): GlobalRewardInput | null {
  const questions = QUESTIONS_BY_LESSON[lessonId] ?? [];
  if (!questions.length) return null;
  const scores = questions.map((question) => latest[question.key]?.score);
  if (scores.some((score) => typeof score !== "number")) return null;
  const quality = (scores as number[]).reduce((sum, score) => sum + score, 0) / scores.length;
  if (quality < 0.8) return null;
  const lesson = lessons.find((candidate) => candidate.id === lessonId);
  if (!lesson) return null;
  const key = `probability:lesson-mastery:${lessonId}`;
  return {
    module: "probability",
    eventId: key,
    contentKey: key,
    activityClass: "milestone",
    evidence: "topic-mastery",
    difficulty: difficultyForQuestions(questions),
    quality,
    oneTimeKey: key,
    reason: `Mastered ${lesson.title}: every question attempted, with at least 80% average latest score`,
  };
}

function rewardPathwayMastery(latest: Record<string, Attempt>): GlobalRewardInput | null {
  if (!allQuestions.length) return null;
  const scores = allQuestions.map((question) => latest[question.key]?.score);
  if (scores.some((score) => typeof score !== "number")) return null;

  // Completing the archive requires every topic to meet its own mastery bar;
  // a high score in easy chapters cannot hide an unmastered advanced topic.
  for (const lessonQuestions of Object.values(QUESTIONS_BY_LESSON)) {
    const lessonScores = lessonQuestions.map((question) => latest[question.key]?.score);
    if (lessonScores.some((score) => typeof score !== "number")) return null;
    const lessonQuality = (lessonScores as number[]).reduce((sum, score) => sum + score, 0) / lessonScores.length;
    if (lessonQuality < 0.8) return null;
  }

  const quality = (scores as number[]).reduce((sum, score) => sum + score, 0) / scores.length;
  const key = `probability:pathway:${PATHWAY_VERSION}`;
  return {
    module: "probability",
    eventId: key,
    contentKey: key,
    activityClass: "course-completion",
    evidence: "pathway-complete",
    difficulty: "advanced",
    quality,
    oneTimeKey: key,
    reason: `Mastered every question-bearing topic in the current Probability archive (${allQuestions.length} questions)`,
  };
}

function setRewardActivationBaseline(): number {
  try {
    const raw = localStorage.getItem(REWARD_ACTIVATED_AT_KEY);
    if (raw !== null && Number.isFinite(Number(raw))) return Number(raw);
    const activatedAt = Date.now();
    localStorage.setItem(REWARD_ACTIVATED_AT_KEY, String(activatedAt));
    return activatedAt;
  } catch {
    return Date.now();
  }
}

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
  bookmarks: string[];
  drafts: Record<string, Draft>;
  goal: number;
  goalByDay: Record<string, number>;
};

export const DEFAULT_GOAL = 10;
const EMPTY: State = { completed: [], tests: [], attempts: [], bookmarks: [], drafts: {}, goal: DEFAULT_GOAL, goalByDay: {} };

export const dayKey = (ts: number) => {
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const UNCHANGED_V1 = ["conditional", "bayes", "random-variables", "distributions", "limit-theorems", "markov"];

function legacyAttempt(q: string, pick: number, n: number): Attempt | null {
  const item = questionByKey[q]?.item;
  if (!item || typeof pick !== "number") return null;
  const g = grade(item, [pick]);
  return { id: `legacy-${n}`, q, picked: [pick], score: g.score, status: g.status, ms: 0, ts: 0 };
}

function migrate(): State {
  const s: State = { ...EMPTY, drafts: {}, goalByDay: {} };
  try {
    const v2 = localStorage.getItem("hc3-progress-v2");
    const v1 = localStorage.getItem("hc3-progress-v1");
    let answered: Record<string, number> = {};
    if (v2) {
      const p = JSON.parse(v2);
      if (Array.isArray(p.completed)) s.completed = p.completed;
      if (p.answered && typeof p.answered === "object") answered = p.answered;
    } else if (v1) {
      const p = JSON.parse(v1);
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
  return s;
}

function read(): State {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const p = JSON.parse(raw);
      return {
        completed: Array.isArray(p.completed) ? p.completed : [],
        tests: Array.isArray(p.tests) ? p.tests : [],
        attempts: Array.isArray(p.attempts) ? p.attempts : [],
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

function persist(): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}
function commit(next: State): boolean {
  state = next;
  const saved = persist();
  listeners.forEach((l) => l());
  return saved;
}
function recoverGlobalRewards() {
  if (typeof window === "undefined" || !window.LimitlessRewards) return;
  if (!rewardActivatedAt) rewardActivatedAt = setRewardActivationBaseline();
  // Re-read the canonical persisted root and the authoritative award ledger.
  // A completed activity with a missing reward is retried; a saved award is
  // skipped before batching, so focus events do not repeatedly rewrite it.
  let awardedIds: Set<string>;
  try {
    awardedIds = new Set(window.LimitlessRewards.read().awards.map((award) => award.id));
  } catch {
    return;
  }
  const persisted = read();
  const pending: GlobalRewardInput[] = [];
  const addIfMissing = (input: GlobalRewardInput | null) => {
    if (input && !awardedIds.has(input.eventId)) {
      pending.push(input);
      awardedIds.add(input.eventId);
    }
  };

  const eligibleAttempts = persisted.attempts.filter((attempt) => attempt.ts >= rewardActivatedAt);
  const latestEligible = latestByQuestion(eligibleAttempts);
  const affectedLessons = new Set<string>();
  for (const attempt of eligibleAttempts) {
    addIfMissing(rewardAttempt(attempt));
    const lessonId = questionByKey[attempt.q]?.lessonId;
    if (lessonId) affectedLessons.add(lessonId);
  }
  // Mastery is computed only from attempts created under this reward policy;
  // legacy answers can be retained for learning analytics but cannot complete
  // a newly rewardable topic/pathway on the strength of old work.
  for (const lessonId of affectedLessons) addIfMissing(rewardLessonMastery(lessonId, latestEligible));
  const eligibleTests = persisted.tests.filter((record) => record.ts >= rewardActivatedAt);
  for (const record of eligibleTests) addIfMissing(rewardAssessment(record));
  addIfMissing(rewardPathwayMastery(latestEligible));

  // Bound work and storage payloads on reloads after many study sessions.
  // The reward ledger's stable IDs make every chunk safe to retry.
  const BATCH_SIZE = 40;
  for (let offset = 0; offset < pending.length; offset += BATCH_SIZE) {
    recordGlobalRewards(pending.slice(offset, offset + BATCH_SIZE));
  }
}
function ensureLoaded() {
  if (!loaded && typeof window !== "undefined") {
    loaded = true;
    state = read();
    persist();
    rewardActivatedAt = setRewardActivationBaseline();
    recoverGlobalRewards();
    window.addEventListener("focus", recoverGlobalRewards);
    window.addEventListener("storage", (e) => {
      if (e.key === STORAGE_KEY) {
        state = read();
        recoverGlobalRewards();
        listeners.forEach((l) => l());
      }
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
export function recordAttemptsBatch(inputs: { q: string; picked: number[]; ms: number }[]): Attempt[] {
  ensureLoaded();
  if (!Array.isArray(inputs) || !inputs.length) return [];
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
  if (!attempts.length) return [];

  // One canonical write for the entire submitted batch. The reward ledger is
  // written in a single recordMany call and recovered by stable event ID.
  const saved = commit({
    ...state,
    attempts: [...state.attempts, ...attempts],
    drafts,
    goalByDay,
  });
  if (saved) recoverGlobalRewards();
  return attempts;
}

export function recordAttempt(q: string, picked: number[], ms: number): Attempt | null {
  return recordAttemptsBatch([{ q, picked, ms }])[0] ?? null;
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
export function recordTest(t: TestRecord) {
  ensureLoaded();
  const saved = commit({ ...state, tests: [...state.tests, t] });
  if (saved) recoverGlobalRewards();
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
  commit({ ...EMPTY, drafts: {}, goalByDay: {} });
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
