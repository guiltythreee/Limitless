#!/usr/bin/env node
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const ALLOWED = new Set(["approved", "rejected", "corrected"]);
const DESTINATIONS = new Set(["theory", "illustration", "worked-example", "reference"]);

export function validateSourceManifest(manifest) {
  if (!manifest || typeof manifest !== "object" || Array.isArray(manifest)) {
    throw new Error("Source manifest must be an object.");
  }
  if (typeof manifest.sha256 !== "string" || !/^[a-f0-9]{64}$/i.test(manifest.sha256)) {
    throw new Error("Manifest must contain a valid 64-character SHA-256 fingerprint.");
  }
  const expectedSourceId = `source-${manifest.sha256.slice(0, 16).toLowerCase()}`;
  if (manifest.sourceId !== expectedSourceId) {
    throw new Error(`Manifest sourceId must match its SHA-256 fingerprint (${expectedSourceId}).`);
  }
  if (typeof manifest.fileName !== "string" || !manifest.fileName.trim()) {
    throw new Error("Manifest must contain a non-empty fileName.");
  }
  if (!Number.isInteger(manifest.pageCount) || manifest.pageCount < 1) {
    throw new Error("Manifest must contain a positive integer pageCount.");
  }
  return manifest;
}

export function validateReview(records, decisions, expectedSourceId = null, expectedPageCount = null) {
  if (!Array.isArray(records) || !Array.isArray(decisions)) throw new Error("Records and decisions must be arrays.");
  if (expectedPageCount !== null && (!Number.isInteger(expectedPageCount) || expectedPageCount < 1)) {
    throw new Error("Expected page count must be a positive integer.");
  }
  const byId = new Map();
  for (const record of records) {
    if (!record || typeof record.id !== "string" || !record.id.trim()) {
      throw new Error("Every source record must have a non-empty string id.");
    }
    if (byId.has(record.id)) throw new Error(`Duplicate source record id: ${record.id}.`);
    if (typeof record.sourceId !== "string" || !record.sourceId.trim()) {
      throw new Error(`Source record ${record.id} must have a non-empty sourceId.`);
    }
    if (expectedSourceId && record.sourceId !== expectedSourceId) {
      throw new Error(`Source record ${record.id} belongs to ${record.sourceId}, not manifest source ${expectedSourceId}.`);
    }
    if (!Number.isInteger(record.sourcePage) || record.sourcePage < 1 ||
        (expectedPageCount !== null && record.sourcePage > expectedPageCount)) {
      throw new Error(`Source record ${record.id} has an invalid sourcePage for the manifest.`);
    }
    if (typeof record.text !== "string" || !record.text.trim()) {
      throw new Error(`Source record ${record.id} must contain non-empty text or an asset path.`);
    }
    if (record.reviewStatus !== "needs-review") {
      throw new Error(`Source record ${record.id} is not in the required needs-review state.`);
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
  const [manifestInput, recordFile, decisions] = await Promise.all(["manifest", "records", "decisions"].map(async (key) => JSON.parse(await readFile(resolve(options[key]), "utf8"))));
  const manifest = validateSourceManifest(manifestInput);
  const records = Array.isArray(recordFile) ? recordFile : recordFile.records;
  const reviewed = validateReview(records, decisions, manifest.sourceId, manifest.pageCount);
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
