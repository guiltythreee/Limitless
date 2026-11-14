import { registerProfile } from "../profiles/registry.mjs";

registerProfile({
  id: "mt203.single-choice.v1",
  version: "1.0.0",
  discipline: "polymer-science",
  format: "single-choice",
  rules: {
    optionCount: 4,
    requireExplanation: true,
    requireSource: false,
    requireDifficulty: true,
    allowMultipleCorrect: false,
    forbiddenOptionPatterns: [
      /\b(?:all|none) of the (?:above|these)\b/i,
      /\b(?:both|neither) of the above\b/i,
    ],
  },
});
