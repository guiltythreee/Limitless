import { registerProfile } from "./registry.mjs";

registerProfile({
  id: "general.single-choice.v1",
  version: "1.0.0",
  discipline: "general",
  format: "single-choice",
  rules: {
    optionCount: 4,
    requireExplanation: true,
    requireSource: true,
    requireDifficulty: true,
    allowMultipleCorrect: false,
  },
});
