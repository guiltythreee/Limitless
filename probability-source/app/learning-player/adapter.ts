import { grade, type Q } from "../lib/questions";
import { createProbabilityPlayerAdapter } from "./adapter-core";

/** Production bridge to Probability's existing authoritative grader. */
export const probabilityPlayerAdapter = createProbabilityPlayerAdapter<Q>(
  (question, picked) => grade(question.item, picked),
);
