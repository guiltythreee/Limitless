#!/usr/bin/env node
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const ALLOWED = new Set(["approved", "rejected", "corrected"]);
const DESTINATIONS = new Set(["theory", "illustration", "worked-example", "reference"]);

export function validateReview(records, decisions, expectedSourceId = null) {
  if (!Array.isArray(records) || !Array.isArray(decisions)) throw new Error("Records and decisions must be arrays.");
  const byId = new Map();
  for (const record of records) {
    if (!record || typeof record.id !== "string" || !record.id.trim()) {
      throw new Error("Every source record must have a non-empty string id.");
    }
    if (byId.has(record.id)) throw new Error(`Duplicate source record id: ${record.id}.`);
    if (expectedSourceId && record.sourceId !== expectedSourceId) {
      throw new Error(`Source record ${record.id} belongs to ${record.sourceId ?? "an unknown source"}, not manifest source ${expectedSourceId}.`);
    }
    byId.set(record.id, record);
  }

  const seen = new Set();
  const validated = [];
  for (const decision of decisions) {
    if (!decision || typeof decision.recordId !== "string" || !byId.has(decision.recordId)) {
      throw new Error("Every decision must reference an existing recordId.");
    }
    if (seen.has(decision.recordId)) throw new Error(`Duplicate decision for ${decision.recordId}.`);
    seen.add(decision.recordId);
    if (!ALLOWED.has(decision.status)) throw new Error(`Unsupported review status for ${decision.recordId}.`);
    const record = byId.get(decision.recordId);
    if (decision.status === "approved" && !decision.destination) {
      throw new Error(`Approved record ${decision.recordId} requires a destination.`);
    }
    if (decision.status !== "rejected" && !DESTINATIONS.has(decision.destination)) {
      throw new Error(`Invalid destination for ${decision.recordId}.`);
    }
    if (decision.status === "corrected" && (typeof decision.correctedText !== "string" || !decision.correctedText.trim())) {
      throw new Error(`Corrected record ${decision.recordId} requires non-empty string correctedText.`);
    }
    if (decision.reviewerNote != null && typeof decision.reviewerNote !== "string") {
      throw new Error(`Reviewer note for ${decision.recordId} must be a string.`);
    }
    validated.push({
      recordId: record.id,
      sourceId: record.sourceId,
      sourcePage: record.sourcePage,
      status: decision.status,
      destination: decision.status === "rejected" ? null : decision.destination,
      proposedText: decision.status === "corrected" ? decision.correctedText.trim() : record.text,
      reviewerNote: decision.reviewerNote ?? null,
    });
  }
  return validated;
}

export function buildProposedPatch(manifest, reviewedRecords, allRecords = []) {
  const approved = reviewedRecords.filter((record) => record.status === "approved" || record.status === "corrected");
  return {
    schemaVersion: "1.0.0",
    patchStatus: "proposed-not-applied",
    source: { sourceId: manifest.sourceId, sha256: manifest.sha256, fileName: manifest.fileName },
    entries: approved.map((record) => ({
      recordId: record.recordId,
      sourceId: record.sourceId,
      sourcePage: record.sourcePage,
      destination: record.destination,
      operation: "propose-addition",
      text: record.proposedText,
      reviewerNote: record.reviewerNote,
    })),
    rejectedRecordIds: reviewedRecords.filter((record) => record.status === "rejected").map((record) => record.recordId),
    unreviewedRecordIds: allRecords.map((record) => record.id).filter((id) => !reviewedRecords.some((record) => record.recordId === id)),
    safety: {
      applied: false,
      modifiesCourseContent: false,
      modifiesQuestionBanks: false,
      modifiesLearnerProgress: false,
      generatesQuestions: false,
      requiresSeparateHumanReviewBeforeApplication: true,
    },
  };
}

async function main(argv) {
  const options = {};
  for (let i = 0; i < argv.length; i += 2) {
    const key = argv[i];
    const value = argv[i + 1];
    if (!key?.startsWith("--") || !value || value.startsWith("--")) throw new Error("Usage: node review.mjs --manifest <source-manifest.json> --records <knowledge-records.json> --decisions <review-decisions.json> --out <output-dir>");
    options[key.slice(2)] = value;
  }
  for (const key of ["manifest", "records", "decisions", "out"]) if (!options[key]) throw new Error(`Missing --${key}`);
  const [manifest, recordFile, decisions] = await Promise.all(["manifest", "records", "decisions"].map(async (key) => JSON.parse(await readFile(resolve(options[key]), "utf8"))));
  const records = Array.isArray(recordFile) ? recordFile : recordFile.records;
  if (!manifest || typeof manifest.sourceId !== "string" || !manifest.sourceId.trim()) throw new Error("Manifest must contain a non-empty sourceId.");
  const reviewed = validateReview(records, decisions, manifest.sourceId);
  const patch = buildProposedPatch(manifest, reviewed, records);
  const output = resolve(options.out);
  await mkdir(output, { recursive: true });
  await writeFile(join(output, "review-results.json"), JSON.stringify({ sourceId: manifest.sourceId, decisions: reviewed }, null, 2) + "\n");
  await writeFile(join(output, "proposed-content-patch.json"), JSON.stringify(patch, null, 2) + "\n");
  const markdown = [
    "# Proposed content patch (not applied)", "",
    `- Source: ${manifest.fileName}`,
    `- SHA-256: ${manifest.sha256}`,
    `- Proposed additions: ${patch.entries.length}`,
    `- Rejected records: ${patch.rejectedRecordIds.length}`,
    "", "> This is a review artifact only. No course files, questions, or learner data were changed.", "",
    ...patch.entries.map((entry) => `## ${entry.destination} · page ${entry.sourcePage}\n\nRecord: \`${entry.recordId}\`\n\n${entry.text}\n`),
  ].join("\n");
  await writeFile(join(output, "proposed-content-patch.md"), markdown + "\n");
  process.stdout.write(`Review staged (not applied): ${patch.entries.length} proposed additions.\n`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main(process.argv.slice(2)).catch((error) => {
    process.stderr.write(`Review failed: ${error.message}\n`);
    process.exitCode = 1;
  });
}
