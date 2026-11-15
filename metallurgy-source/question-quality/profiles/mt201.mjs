import { registerProfile } from "../profiles/registry.mjs";

const commonRules = {
  requireExplanation: true,
  requireSource: false,
  requireDifficulty: true,
  allowMultipleCorrect: false,
};

const formats = [
  ["A", "single-choice", 4],
  ["B", "statement-selection", 4],
  ["C", "assertion-reason", 4],
  ["D", "match", 4],
  ["E", "numerical", 4],
  ["F", "true-false", 2],
];

for (const [nativeType, format, optionCount] of formats) {
  registerProfile({
    id: `mt201.${format}.v1`,
    version: "1.0.0",
    discipline: "metallurgical-thermodynamics",
    format,
    rules: { ...commonRules, optionCount },
    nativeType,
  });
}
