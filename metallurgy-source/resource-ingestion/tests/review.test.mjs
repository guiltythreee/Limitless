#!/usr/bin/env node
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildProposedPatch, validateReview } from "../review.mjs";

const manifest = { sourceId: "source-abc", sha256: "abc123", fileName: "lecture.pdf" };
const records = [
  { id: "r1", sourceId: "source-abc", sourcePage: 2, text: "Original theory text", reviewStatus: "needs-review" },
  { id: "r2", sourceId: "source-abc", sourcePage: 3, text: "Incorrect OCR text", reviewStatus: "needs-review" },
  { id: "r3", sourceId: "source-abc", sourcePage: 4, text: "Duplicate fragment", reviewStatus: "needs-review" },
  { id: "r4", sourceId: "source-abc", sourcePage: 5, text: "Not reviewed yet", reviewStatus: "needs-review" },
];
const decisions = [
  { recordId: "r1", status: "approved", destination: "theory" },
  { recordId: "r2", status: "corrected", destination: "worked-example", correctedText: "Corrected worked example" },
  { recordId: "r3", status: "rejected", reviewerNote: "Duplicate" },
];
const reviewed = validateReview(records, decisions);
const patch = buildProposedPatch(manifest, reviewed, records);
assert.equal(patch.patchStatus, "proposed-not-applied");
assert.equal(patch.entries.length, 2);
assert.equal(patch.entries[1].text, "Corrected worked example");
assert.deepEqual(patch.rejectedRecordIds, ["r3"]);
assert.deepEqual(patch.unreviewedRecordIds, ["r4"]);
assert.equal(patch.safety.applied, false);
assert.equal(patch.safety.modifiesQuestionBanks, false);
assert.throws(() => validateReview(records, [{ recordId: "missing", status: "approved", destination: "theory" }]), /existing recordId/);
assert.throws(() => validateReview(records, [{ recordId: "r1", status: "approved" }]), /requires a destination/);
assert.throws(() => validateReview(records, [{ recordId: "r1", status: "corrected", destination: "theory" }]), /requires .*correctedText/);
assert.throws(() => validateReview(records, [decisions[0], decisions[0]]), /Duplicate decision/);

assert.throws(() => validateReview(records, [{ recordId: "r1", status: "approved", destination: "unknown" }]), /Invalid destination/);
assert.throws(() => validateReview(records, [{ recordId: "r1", status: "corrected", destination: "theory", correctedText: "   " }]), /non-empty string correctedText/);
assert.throws(() => validateReview(records, [{ recordId: "r1", status: "corrected", destination: "theory", correctedText: 42 }]), /non-empty string correctedText/);
assert.throws(() => validateReview(records, [{ recordId: "r1", status: "approved", destination: "theory", reviewerNote: 42 }]), /Reviewer note.*string/);
assert.throws(() => validateReview([...records, { ...records[0] }], []), /Duplicate source record id/);
assert.throws(() => validateReview([{ text: "missing id" }], []), /non-empty string id/);
assert.throws(() => validateReview([{ ...records[0], sourceId: "another-source" }], [], "source-abc"), /belongs to another-source.*not manifest source source-abc/);

// Exercise the CLI boundary too: mismatched source records must fail before any output is created.
const tempDir = await mkdtemp(join(tmpdir(), "resource-review-source-guard-"));
try {
  const manifestPath = join(tempDir, "manifest.json");
  const recordsPath = join(tempDir, "records.json");
  const decisionsPath = join(tempDir, "decisions.json");
  const outputPath = join(tempDir, "output");
  await writeFile(manifestPath, JSON.stringify(manifest));
  await writeFile(recordsPath, JSON.stringify([{ ...records[0], sourceId: "another-source" }]));
  await writeFile(decisionsPath, JSON.stringify([]));
  const cli = spawnSync(process.execPath, [
    fileURLToPath(new URL("../review.mjs", import.meta.url)),
    "--manifest", manifestPath,
    "--records", recordsPath,
    "--decisions", decisionsPath,
    "--out", outputPath,
  ], { encoding: "utf8" });
  assert.equal(cli.status, 1, cli.stderr || cli.stdout);
  assert.match(cli.stderr, /belongs to another-source.*not manifest source source-abc/);
  assert.equal(existsSync(outputPath), false, "Rejected cross-source input must not create review output.");
} finally {
  await rm(tempDir, { recursive: true, force: true });
}

console.log("Review gate tests passed: approvals, corrections, rejections, malformed input and source-bound CLI safety.");
