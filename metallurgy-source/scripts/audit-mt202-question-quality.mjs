#!/usr/bin/env node
// Regenerate or verify the MT202 heuristic follow-up queue.
// Heuristic flags are review prompts, not confirmed question defects.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const reportPath = path.join(root, "reports", "mt202-question-quality-follow-up-queue-2026-11-13.csv");
const questions = [];

for (let chapter = 1; chapter <= 9; chapter++) {
  const id = "ch" + String(chapter).padStart(2, "0");
  const file = path.join(root, "public", "data", "mt202", id + ".json");
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  for (const question of data.questions || []) questions.push({ ...question, chapter: id });
}

const normalize = (value) =>
  (value || "")
    .toLowerCase()
    .replace(/<[^>]*>/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");

// For structured questions, generic stems such as "Which statements ...?" are
// reused legitimately. Treat items as duplicates only when the normalized stem
// and their assessed structured content (statements, match table, assertion/reason)
// also match; this avoids flagging distinct revision variants as duplicate questions.
const duplicateSignature = (question) =>
  normalize([
    question.text,
    ...(question.statements || []).map((statement) => statement.text),
    ...(question.tableRows || []).flat(),
    question.assertion,
    question.reason,
  ].filter(Boolean).join(" "));

const stemGroups = new Map();
for (const question of questions) {
  const key = duplicateSignature(question);
  if (!key) continue;
  if (!stemGroups.has(key)) stemGroups.set(key, []);
  stemGroups.get(key).push(question.chapter + " Q" + question.n);
}
const duplicateGroups = new Map([...stemGroups].filter(([, ids]) => ids.length > 1));
const duplicateMembers = new Set([...duplicateGroups.values()].flat());

const findings = [];
for (const question of questions) {
  const options = question.options || [];
  const lengths = options.map((option) => (option.text || "").length);
  if (lengths.length < 2) continue;

  const longest = Math.max(...lengths);
  const shortest = Math.min(...lengths);
  const longestCount = lengths.filter((length) => length === longest).length;
  const correctIndex = options.findIndex((option) => option.label === question.answer);
  const correctLength = correctIndex >= 0 ? lengths[correctIndex] : null;
  const flags = [];
  const evidence = [];

  const normalizedOptions = options.map((option) => (option.text || "").trim().replace(/\s+/g, " "));
  const assertionReasonCategory = (value) => {
    const normalized = value.toLowerCase();
    if (/^both\b/.test(normalized) && /\btrue\b/.test(normalized)) {
      if (/\bnot\b.*\b(correct|explain|explanation)\b/.test(normalized)) {
        return "both-true-not-explains";
      }
      if (/\b(correct|explains|explanation)\b/.test(normalized)) {
        return "both-true-explains";
      }
    }
    if (/^a\b/.test(normalized) && /\btrue\b/.test(normalized) && /\br\b/.test(normalized) && /\bfalse\b/.test(normalized)) {
      return "a-true-r-false";
    }
    if (/^both\b/.test(normalized) && /\bfalse\b/.test(normalized)) {
      return "both-false";
    }
    return null;
  };
  const assertionReasonCategories = normalizedOptions.map(assertionReasonCategory);
  const standardAssertionReason =
    options.length === 4 &&
    assertionReasonCategories.every(Boolean) &&
    new Set(assertionReasonCategories).size === 4;
  const binaryTrueFalse =
    options.length === 2 &&
    normalizedOptions.some((value) => /^true\b/i.test(value)) &&
    normalizedOptions.some((value) => /^false\b/i.test(value));

  // Standard A/R and True/False response sets intentionally have different
  // phrase lengths. Their wording is fixed by the response format, not a key cue.
  if (!standardAssertionReason && !binaryTrueFalse) {
    if (longestCount === 1) flags.push("unique-longest-option");
    if (shortest > 0 && longest >= 2 * shortest) flags.push("option-over-2x-shortest");
    if (correctLength !== null && longestCount === 1 && correctLength === longest) {
      flags.push("correct-option-uniquely-longest");
    }
    if (correctLength !== null && shortest > 0 && correctLength >= 2 * shortest) {
      flags.push("correct-option-over-2x-shortest");
    }
    evidence.push(
      "option lengths=" +
        options.map((option, index) => option.label + ":" + lengths[index]).join(", ")
    );
  } else {
    evidence.push("option-length cues skipped for standardized assertion–reason/true–false response format");
  }

  const surface = [
    question.text,
    ...(question.statements || []).map((statement) => statement.text),
    question.assertion,
    question.reason,
    ...options.map((option) => option.text),
  ]
    .filter(Boolean)
    .join(" ");

  const absoluteTerms = [
    ...new Set(
      surface.match(/\b(?:always|never|only|all|none|entirely|solely|must|impossible|every)\b/gi) || []
    ),
  ];
  if (absoluteTerms.length) {
    flags.push("absolute-wording");
    evidence.push("absolute terms=" + absoluteTerms.join(", "));
  }

  const explanation = [question.keyExplanation, question.concise, question.detailed]
    .filter(Boolean)
    .join("\n");
  const strategyCodes = [...new Set(explanation.match(/\bP[123]\b/g) || [])];
  if (strategyCodes.length) {
    flags.push("P1-P2-P3-code");
    evidence.push("explanation codes=" + strategyCodes.join(", "));
  }

  if (["B", "C", "D", "G"].includes(question.type)) {
    flags.push("structured-item-review");
    evidence.push("structured type=" + question.type);
  }

  const questionKey = question.chapter + " Q" + question.n;
  if (duplicateMembers.has(questionKey)) {
    flags.push("duplicate-stem");
    evidence.push(
      "same normalized stem and structured content as: " +
        duplicateGroups
          .get(duplicateSignature(question))
          .filter((id) => id !== questionKey)
          .join(", ")
    );
  }

  if (/\b(?:option\s*\(?[a-d]\)?|choice\s*\(?[a-d]\)?)/i.test(surface)) {
    flags.push("option-label-reference");
    evidence.push("stem/options explicitly refer to option labels");
  }

  if (!flags.length) continue;

  const bothCorrectLengthCues =
    flags.includes("correct-option-uniquely-longest") &&
    flags.includes("correct-option-over-2x-shortest");
  const high = bothCorrectLengthCues || flags.includes("duplicate-stem");
  const medium =
    flags.some((flag) => flag.startsWith("correct-option-")) ||
    flags.includes("absolute-wording") ||
    flags.includes("P1-P2-P3-code") ||
    flags.includes("option-label-reference") ||
    flags.includes("option-over-2x-shortest");
  const severity = high ? "High" : medium ? "Medium" : "Review";

  const actions = [];
  if (
    flags.some((flag) =>
      [
        "unique-longest-option",
        "option-over-2x-shortest",
        "correct-option-uniquely-longest",
        "correct-option-over-2x-shortest",
      ].includes(flag)
    )
  ) {
    actions.push(
      "Review whether option length or specificity reveals the key; improve distractor plausibility without padding options."
    );
  }
  if (flags.includes("absolute-wording")) {
    actions.push(
      "Verify universal wording is scientifically justified; qualify it where conditions or exceptions apply."
    );
  }
  if (flags.includes("P1-P2-P3-code")) {
    actions.push(
      "Check whether strategy-code references belong in the learner-facing explanation and are defined consistently."
    );
  }
  if (flags.includes("structured-item-review")) {
    actions.push(
      "Review each statement or match independently; ensure distractors represent relevant misconceptions."
    );
  }
  if (flags.includes("duplicate-stem")) {
    actions.push("Compare duplicate stems and consolidate or differentiate the learning objective.");
  }
  if (flags.includes("option-label-reference")) {
    actions.push("Verify option-label references remain aligned with the current option order and answer key.");
  }

  findings.push({
    id: "MT202/" + question.chapter + " Q" + question.n,
    severity,
    flags: flags.join("; "),
    evidence: evidence.join(" | "),
    recommended: actions.join(" "),
  });
}

const escapeCsv = (value) => '"' + String(value ?? "").replace(/"/g, '""') + '"';
const csv =
  [
    "question_id,course,severity,flags,evidence,recommended_review",
    ...findings.map((finding) =>
      [
        finding.id,
        "MT202",
        finding.severity,
        finding.flags,
        finding.evidence,
        finding.recommended,
      ]
        .map(escapeCsv)
        .join(",")
    ),
  ].join("\r\n") + "\r\n";

const counts = findings.reduce((result, finding) => {
  result[finding.severity] = (result[finding.severity] || 0) + 1;
  return result;
}, {});

if (process.argv.includes("--check")) {
  const existing = fs.readFileSync(reportPath, "utf8");
  if (existing !== csv) {
    console.error("MT202 heuristic queue is stale; regenerate it with this script.");
    process.exitCode = 1;
  } else {
    console.log(
      "MT202 heuristic queue matches " +
        findings.length +
        " flagged questions (High " +
        (counts.High || 0) +
        ", Medium " +
        (counts.Medium || 0) +
        ", Review " +
        (counts.Review || 0) +
        ")."
    );
  }
} else {
  fs.writeFileSync(reportPath, csv, "utf8");
  console.log(
    "Wrote " +
      findings.length +
      " flagged questions (High " +
      (counts.High || 0) +
      ", Medium " +
      (counts.Medium || 0) +
      ", Review " +
      (counts.Review || 0) +
      ") to " +
      path.relative(root, reportPath)
  );
}
