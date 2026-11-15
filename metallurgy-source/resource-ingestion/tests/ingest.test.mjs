#!/usr/bin/env node
import assert from "node:assert/strict";
import { buildRecords, parseImageInventory, shouldUseOcr } from "../ingest.mjs";

const pages = [
  "POLYMER PROCESSING\n\nExtrusion is a continuous process used to shape polymer melts.\n\nStress = Force / Area\n\n- Feed zone conveys pellets\n- Compression zone melts material\n",
  "RHEOLOGY\n\nThixotropy is defined as time-dependent shear thinning at constant shear rate.\n\nProperty        Unit\nViscosity       Pa s\n",
];
const mappingHint = { course: "MT203", topic: "T11", subtopic: "Extrusion" };
assert.equal(shouldUseOcr("   "), true, "blank/scanned pages should be eligible for OCR");
assert.equal(shouldUseOcr("A sufficiently long native text extraction from a PDF page."), false);
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

const ocrRecords = buildRecords({ sourceId: "source-test", pages: ["Scanned page OCR output."], pageExtractionMethods: ["tesseract OCR (220 DPI, page segmentation mode 3)"] });
assert.equal(ocrRecords[0].extractionMethod, "tesseract OCR (220 DPI, page segmentation mode 3)");

const noMapping = buildRecords({ sourceId: "source-test", pages: ["A simple paragraph."] });
assert.equal(noMapping[0].mappingHint.course, undefined);
console.log(`Resource ingestion tests passed: ${first.length} deterministic review-only records.`);

const imageRows = parseImageInventory("page num type width height color comp bpc enc interp object ID x-ppi y-ppi size ratio\n   1   0 image 1200 800 rgb 3 8 jpeg no 12 0 300 300 120K 4%\n   1   1 smask 1200 800 gray 1 8 image no 13 0 300 300 12K 1%\n   2   2 image 900 600 rgb 3 8 jpeg no 14 0 200 200 80K 5%");
assert.deepEqual(imageRows, [{ page: 1, imageNumber: 0 }, { page: 2, imageNumber: 2 }]);
const withFigure = buildRecords({ sourceId: "source-test", pages: ["Page text"], imageAssets: [{ page: 1, imageNumber: 0, path: "assets/image-000.png" }] });
assert.equal(withFigure[0].kind, "paragraph");
assert.equal(withFigure[1].kind, "image-reference");
assert.equal(withFigure[1].candidateType, "figure");
assert.equal(withFigure[1].sourcePage, 1);
assert.equal(withFigure[1].reviewStatus, "needs-review");
console.log("PDF image inventory and page-linked figure record tests passed.");
