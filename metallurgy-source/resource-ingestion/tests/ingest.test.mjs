#!/usr/bin/env node
import assert from "node:assert/strict";
import { buildRecords } from "../ingest.mjs";

const pages = [
  "POLYMER PROCESSING\n\nExtrusion is a continuous process used to shape polymer melts.\n\nStress = Force / Area\n\n- Feed zone conveys pellets\n- Compression zone melts material\n",
  "RHEOLOGY\n\nThixotropy is defined as time-dependent shear thinning at constant shear rate.\n\nProperty        Unit\nViscosity       Pa s\n",
];
const mappingHint = { course: "MT203", topic: "T11", subtopic: "Extrusion" };
const first = buildRecords({ sourceId: "source-test", pages, mappingHint });
const second = buildRecords({ sourceId: "source-test", pages, mappingHint });

assert.equal(first.length, second.length);
assert.deepEqual(first.map((r) => r.id), second.map((r) => r.id), "record IDs must be deterministic");
assert.ok(first.every((r) => r.reviewStatus === "needs-review"), "extraction must never approve records");
assert.ok(first.every((r) => r.sourceId === "source-test"));
assert.ok(first.every((r) => r.mappingHint.course === "MT203"));
assert.ok(first.some((r) => r.sourcePage === 1 && r.kind === "heading"));
assert.ok(first.some((r) => r.sourcePage === 1 && r.kind === "bullet"));
assert.ok(first.some((r) => r.sourcePage === 1 && r.kind === "equation"));
assert.ok(first.some((r) => r.sourcePage === 2 && r.candidateType === "definition"));
assert.ok(first.some((r) => r.sourcePage === 2 && r.kind === "table-row"));
assert.ok(first.every((r) => r.confidence === "unverified"));

const noMapping = buildRecords({ sourceId: "source-test", pages: ["A simple paragraph."] });
assert.equal(noMapping[0].mappingHint.course, undefined);
console.log(`Resource ingestion tests passed: ${first.length} deterministic review-only records.`);
