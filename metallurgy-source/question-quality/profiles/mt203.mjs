import { registerProfile } from "../profiles/registry.mjs";

const commonRules = {
  optionCount: 4,
  requireExplanation: true,
  requireSource: false,
  requireDifficulty: true,
  allowMultipleCorrect: false,
};

const formats = [
  ["single-choice", {}],
  ["numerical", {}],
  ["assertion-reason", { requireAssertionReason: true }],
  ["statement-selection", { requireStatements: true }],
  ["match", { requireTableRows: true }],
  ["sequence", {}],
  ["graph-data", {}],
];

for (const [format, formatRules] of formats) {
  registerProfile({
    id: `mt203.${format}.v1`,
    version: "1.0.0",
    discipline: "polymer-science",
    format,
    rules: { ...commonRules, ...formatRules },
  });
}
