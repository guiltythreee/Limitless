import type {
  LearningPlayerAction,
  LearningPlayerState,
} from "./contracts";

/** A fresh question-player session always starts at question zero. */
export function createLearningPlayerState(): LearningPlayerState {
  return { index: 0, phase: "answering", elapsedMs: 0 };
}

/**
 * Pure lifecycle reducer. It owns navigation and elapsed-time state only;
 * grading, answers, persistence, and timer scheduling stay outside.
 */
export function reduceLearningPlayerState(
  state: LearningPlayerState,
  action: LearningPlayerAction
): LearningPlayerState {
  switch (action.type) {
    case "next": {
      const count = Math.max(0, Math.floor(action.questionCount));
      if (count === 0) return { ...state, index: 0 };
      return {
        ...state,
        index: Math.min(count - 1, Math.max(0, state.index + 1)),
        phase: "answering",
        elapsedMs: 0,
      };
    }
    case "previous":
      return {
        ...state,
        index: Math.max(0, state.index - 1),
        phase: "answering",
        elapsedMs: 0,
      };
    case "submit":
    case "review":
      return state.phase === "review"
        ? state
        : { ...state, phase: "review" };
    case "tick":
      return state.phase === "answering"
        ? { ...state, elapsedMs: Math.max(0, Math.round(action.elapsedMs)) }
        : state;
    case "reset-question":
      return { ...state, phase: "answering", elapsedMs: 0 };
  }
}
