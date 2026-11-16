#!/usr/bin/env node
import assert from "node:assert/strict";
import { assessOcrQuality, buildOcrSummary, buildRecords, mapExtractedImages, parseImageInventory, parseOcrTsv, shouldUseOcr } from "../ingest.mjs";
import { buildTesseractTsvArgs } from "../ingest.mjs";

const pages = [
  "POLYMER PROCESSING\n\nExtrusion is a continuous process used to shape polymer melts.\n\nStress = Force / Area\n\n- Feed zone conveys pellets\n- Compression zone melts material\n",
  "RHEOLOGY\n\nThixotropy is defined as time-dependent shear thinning at constant shear rate.\n\nProperty        Unit\nViscosity       Pa s\n",
];
const mappingHint = { course: "MT203", topic: "T11", subtopic: "Extrusion" };
assert.equal(hasTableContext("Property        Unit\nViscosity       Pa s"), true, "property/unit tables should be recognized");
assert.equal(hasTableContext("Table 4.5 Permeability in polymers at 25°C"), true, "captioned source tables should be recognized");
assert.equal(hasTableContext("Properties of Homopolymer Vs Copolymer\nTeflon       Polyethylene       PVC"), false, "comparison slides should not be treated as tables");
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

const layoutRecords = buildRecords({
  sourceId: "source-layout",
  pages: ["      MT203 –\n            Assistant Professor,\nProperty        Unit\nViscosity       Pa s"],
});
assert.ok(!layoutRecords.some((r) => r.kind === "table-row" && /MT203|Assistant Professor/.test(r.text)), "slide indentation must not be mistaken for table columns");
assert.ok(layoutRecords.some((r) => r.kind === "table-row" && /Property/.test(r.text)), "genuine multi-column rows must remain detectable");

const comparisonRecords = buildRecords({
  sourceId: "source-comparison",
  pages: ["Properties of Homopolymer Vs Copolymer\nTeflon       Polyethylene       PVC"],
});
assert.ok(comparisonRecords.some((r) => r.candidateType === "table" && r.reviewPriority === "routine"), "comparison content stays available without flooding the table exception queue");
const captionedTableRecords = buildRecords({
  sourceId: "source-captioned-table",
  pages: ["Permeability Data\nTable 4.5 Permeability in polymers at 25°C\nPolyethylene O2 2.2 66.5 42.7"],
});
assert.ok(captionedTableRecords.some((r) => r.candidateType === "table" && r.reviewPriority === "exception"), "captioned numeric tables must enter focused review");

const ocrRecords = buildRecords({ sourceId: "source-test", pages: ["Scanned page OCR output."], pageExtractionMethods: ["tesseract OCR (220 DPI, page segmentation mode 3)"] });
assert.equal(ocrRecords[0].extractionMethod, "tesseract OCR (220 DPI, page segmentation mode 3)");

const noMapping = buildRecords({ sourceId: "source-test", pages: ["A simple paragraph."] });
assert.equal(noMapping[0].mappingHint.course, undefined);
console.log(`Resource ingestion tests passed: ${first.length} deterministic review-only records.`);

const imageRows = parseImageInventory("page num type width height color comp bpc enc interp object ID x-ppi y-ppi size ratio\n   1   0 image 1200 800 rgb 3 8 jpeg no 12 0 300 300 120K 4%\n   1   1 smask 1200 800 gray 1 8 image no 13 0 300 300 12K 1%\n   2   2 image 900 600 rgb 3 8 jpeg no 14 0 200 200 80K 5%");
assert.deepEqual(imageRows, [{ page: 1, imageNumber: 0 }, { page: 2, imageNumber: 2 }]);
const mappedImages = mapExtractedImages(["image-000.png", "image-001.png", "image-002.png"], imageRows);
assert.deepEqual(mappedImages, [
  { page: 1, imageNumber: 0, path: "assets/image-000.png" },
  { page: 2, imageNumber: 2, path: "assets/image-002.png" },
], "soft-mask files must not shift subsequent image-to-page associations");
const withFigure = buildRecords({ sourceId: "source-test", pages: ["This is a page text fragment with punctuation."], imageAssets: [{ page: 1, imageNumber: 0, path: "assets/image-000.png" }] });
assert.equal(withFigure[0].kind, "paragraph");
assert.equal(withFigure[1].kind, "image-reference");
assert.equal(withFigure[1].candidateType, "figure");
assert.equal(withFigure[1].sourcePage, 1);
assert.equal(withFigure[1].reviewStatus, "needs-review");
assert.equal(withFigure[1].reviewPriority, "visual-reference");
console.log("PDF image inventory and page-linked figure record tests passed.");

const ocrSummary = buildOcrSummary([
  { page: 31, nativeCharacterCount: 0, ocrCharacterCount: 366, selectedMethod: "ocr", selectedCharacterCount: 366, status: "completed" },
  { page: 35, nativeCharacterCount: 12, ocrCharacterCount: 76, selectedMethod: "ocr", qualityStatus: "review-required", selectedCharacterCount: 76, status: "completed" },
  { page: 45, nativeCharacterCount: 0, ocrCharacterCount: 456, selectedMethod: "ocr", selectedCharacterCount: 456, status: "completed" },
  { page: 49, nativeCharacterCount: 0, ocrCharacterCount: 772, selectedMethod: "ocr", selectedCharacterCount: 772, status: "completed" },
  { page: 50, nativeCharacterCount: 10, ocrCharacterCount: 774, selectedMethod: "ocr", selectedCharacterCount: 774, status: "completed" },
]);
assert.equal(ocrSummary.attemptedPages, 5);
assert.equal(ocrSummary.replacedPages, 5);
assert.equal(ocrSummary.retainedNativePages, 0);
assert.deepEqual(ocrSummary.failedPages, []);
assert.deepEqual(ocrSummary.reviewRequiredPages, [35]);
assert.equal(ocrSummary.pageStats[3].ocrCharacterCount, 772);
const failedOcrSummary = buildOcrSummary([
  { page: 63, selectedMethod: "native", qualityStatus: "review-required", status: "failed", failureReason: "render failed" },
]);
assert.deepEqual(failedOcrSummary.failedPages, [63]);
assert.deepEqual(failedOcrSummary.reviewRequiredPages, [63]);
console.log("Page-level OCR quality summary tests passed.");

assert.deepEqual(buildTesseractTsvArgs("/tmp/page.png"), ["/tmp/page.png", "stdout", "--psm", "3", "tsv"], "Tesseract options must precede the TSV config file");

const tsv = [
  "level\tpage_num\tblock_num\tpar_num\tline_num\tword_num\tleft\ttop\twidth\theight\tconf\ttext",
  "5\t1\t1\t1\t1\t1\t10\t10\t50\t20\t90\tPolymer",
  "5\t1\t1\t1\t1\t2\t65\t10\t40\t20\t30\tchains",
].join("\n");
const confidence = parseOcrTsv(tsv);
assert.deepEqual(confidence, { wordCount: 2, meanWordConfidence: 60, lowConfidenceWordCount: 1, lowConfidenceRatio: 0.5 });
const acceptedOcr = assessOcrQuality({ ocrCharacterCount: 300, nativeCharacterCount: 0, wordCount: 20, meanWordConfidence: 82, lowConfidenceRatio: 0.1 });
assert.deepEqual(acceptedOcr, { selectedMethod: "ocr", qualityStatus: "candidate", qualityAccepted: true });
const rejectedOcr = assessOcrQuality({ ocrCharacterCount: 66, nativeCharacterCount: 23, wordCount: 9, meanWordConfidence: 41.2, lowConfidenceRatio: 0.667 });
assert.deepEqual(rejectedOcr, { selectedMethod: "ocr", qualityStatus: "review-required", qualityAccepted: false });

const triagedRecords = buildRecords({
  sourceId: "source-triage",
  pages: ["Stress = Force / Area", "A routine explanatory paragraph."],
  pageExtractionQuality: ["review-required", "candidate"],
});
assert.equal(triagedRecords[0].reviewPriority, "exception", "equations must be routed to focused review");
assert.equal(triagedRecords[0].extractionQuality, "review-required");
assert.equal(triagedRecords[1].reviewPriority, "routine", "low-risk paragraphs should not flood the exception queue");
assert.equal(triagedRecords[1].reviewStatus, "needs-review", "triage must not approve content");


import { buildPagePreviewPlan, hasTableContext } from "../ingest.mjs";

const previewPlan = buildPagePreviewPlan([
  { sourcePage: 36, candidateType: "equation" },
  { sourcePage: 154, candidateType: "table" },
  { sourcePage: 178, candidateType: "figure" },
  { sourcePage: 194, candidateType: "figure" },
  { sourcePage: 201, candidateType: "figure" },
  { sourcePage: 12, candidateType: "explanation", extractionQuality: "review-required" },
], { reviewRequiredPages: [31, 154] });
assert.deepEqual(previewPlan, [
  { page: 12, reasons: ["extraction-review-required"] },
  { page: 31, reasons: ["ocr-review-required"] },
  { page: 36, reasons: ["equation-candidate"] },
  { page: 154, reasons: ["ocr-review-required", "table-candidate"] },
  { page: 178, reasons: ["embedded-figure"] },
  { page: 194, reasons: ["embedded-figure"] },
  { page: 201, reasons: ["embedded-figure"] },
], "preview selection should cover review exceptions, equations, tables and figures once per page");
assert.deepEqual(buildPagePreviewPlan([{ sourcePage: 1, candidateType: "paragraph" }]), []);
console.log("Focused source-page preview selection tests passed.");
