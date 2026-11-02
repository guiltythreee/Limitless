import type {
  LearningPlayerAdapter,
  LearningPlayerState,
  PlayerAnswer,
  PlayerSubmission,
} from "./contracts";
import { createLearningPlayerState, reduceLearningPlayerState } from "./state";

export interface LearningPlayerSession<
  TQuestion,
  TAnswer extends PlayerAnswer,
> {
  readonly questions: readonly TQuestion[];
  readonly state: LearningPlayerState;
  readonly answers: Readonly<Record<string, TAnswer>>;
  readonly submissions: readonly PlayerSubmission<TAnswer>[];
}

export function createLearningPlayerSession<
  TQuestion,
  TAnswer extends PlayerAnswer,
>(questions: readonly TQuestion[]): LearningPlayerSession<TQuestion, TAnswer> {
  return {
    questions: [...questions],
    state: createLearningPlayerState(),
    answers: {},
    submissions: [],
  };
}

function currentQuestion<TQuestion, TAnswer extends PlayerAnswer>(
  session: LearningPlayerSession<TQuestion, TAnswer>,
): TQuestion | null {
  return session.questions[session.state.index] ?? null;
}

export function setPlayerAnswer<
  TQuestion,
  TAnswer extends PlayerAnswer,
>(
  session: LearningPlayerSession<TQuestion, TAnswer>,
  adapter: Pick<LearningPlayerAdapter<TQuestion, TAnswer>, "questionId" | "canRetry">,
  answer: TAnswer,
): LearningPlayerSession<TQuestion, TAnswer> {
  const question = currentQuestion(session);
  if (!question || session.state.phase !== "answering") return session;
  const id = adapter.questionId(question);
  const hasSubmission = session.submissions.some((entry) => entry.question.questionId === id);
  if (hasSubmission && adapter.canRetry?.(question) === false) return session;
  return { ...session, answers: { ...session.answers, [id]: answer } };
}

/** Grades through the course adapter; the shared runtime never calculates scores. */
/** Remove an unsent selection when a course supports toggling every option off. */
export function clearPlayerAnswer<
  TQuestion,
  TAnswer extends PlayerAnswer,
>(
  session: LearningPlayerSession<TQuestion, TAnswer>,
  adapter: Pick<LearningPlayerAdapter<TQuestion, TAnswer>, "questionId">,
): LearningPlayerSession<TQuestion, TAnswer> {
  const question = currentQuestion(session);
  if (!question || session.state.phase !== "answering") return session;
  const id = adapter.questionId(question);
  if (!(id in session.answers)) return session;
  const answers = { ...session.answers };
  delete answers[id];
  return { ...session, answers };
}

export function submitPlayerAnswer<
  TQuestion,
  TAnswer extends PlayerAnswer,
>(
  session: LearningPlayerSession<TQuestion, TAnswer>,
  adapter: LearningPlayerAdapter<TQuestion, TAnswer>,
  options: { submittedAt: number; mode: PlayerSubmission<TAnswer>["mode"] },
): {
  session: LearningPlayerSession<TQuestion, TAnswer>;
  submission: PlayerSubmission<TAnswer> | null;
} {
  const question = currentQuestion(session);
  if (!question || session.state.phase !== "answering") {
    return { session, submission: null };
  }

  const questionId = adapter.questionId(question);
  const hasSubmission = session.submissions.some((entry) => entry.question.questionId === questionId);
  if (hasSubmission && adapter.canRetry?.(question) === false) {
    return { session, submission: null };
  }
  const answer = session.answers[questionId];
  if (!answer) return { session, submission: null };

  const submission: PlayerSubmission<TAnswer> = {
    question: { courseId: adapter.courseId, questionId },
    answer,
    grade: adapter.grade(question, answer),
    elapsedMs: Math.max(0, Math.round(session.state.elapsedMs)),
    submittedAt: options.submittedAt,
    mode: options.mode,
  };

  return {
    session: {
      ...session,
      state: reduceLearningPlayerState(session.state, { type: "submit" }),
      submissions: [...session.submissions, submission],
    },
    submission,
  };
}

export function navigatePlayer<
  TQuestion,
  TAnswer extends PlayerAnswer,
>(
  session: LearningPlayerSession<TQuestion, TAnswer>,
  direction: "next" | "previous",
): LearningPlayerSession<TQuestion, TAnswer> {
  const state = direction === "next"
    ? reduceLearningPlayerState(session.state, {
        type: "next",
        questionCount: session.questions.length,
      })
    : reduceLearningPlayerState(session.state, { type: "previous" });
  return { ...session, state };
}

export function tickPlayer<
  TQuestion,
  TAnswer extends PlayerAnswer,
>(
  session: LearningPlayerSession<TQuestion, TAnswer>,
  elapsedMs: number,
): LearningPlayerSession<TQuestion, TAnswer> {
  return {
    ...session,
    state: reduceLearningPlayerState(session.state, { type: "tick", elapsedMs }),
  };
}

/** Jump to an arbitrary queue position (for question palettes and deep links). */
export function selectPlayerQuestion<
  TQuestion,
  TAnswer extends PlayerAnswer,
>(
  session: LearningPlayerSession<TQuestion, TAnswer>,
  requestedIndex: number,
): LearningPlayerSession<TQuestion, TAnswer> {
  const count = session.questions.length;
  const index = count === 0
    ? 0
    : Math.min(count - 1, Math.max(0, Math.floor(requestedIndex)));
  return {
    ...session,
    state: { index, phase: "answering", elapsedMs: 0 },
  };
}
