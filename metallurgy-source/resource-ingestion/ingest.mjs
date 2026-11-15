#!/usr/bin/env node
import { createHash } from "node:crypto";
import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { basename, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { pathToFileURL } from "node:url";

function run(command, args) {
  const result = spawnSync(command, args, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  if (result.error) throw new Error(`Cannot run ${command}: ${result.error.message}`);
  if (result.status !== 0) throw new Error(`${command} failed: ${(result.stderr || result.stdout || "").trim()}`);
  return result.stdout;
}

function parseArgs(argv) {
  const options = {};
  for (let i = 0; i < argv.length; i++) {
    const key = argv[i];
    if (!key.startsWith("--")) throw new Error(`Unexpected argument: ${key}`);
    const value = argv[++i];
    if (!value || value.startsWith("--")) throw new Error(`Missing value for ${key}`);
    options[key.slice(2)] = value;
  }
  if (!options.input || !options.out) throw new Error("Usage: node ingest.mjs --input <file.pdf> --out <output-dir> [--course MT203] [--topic T11] [--subtopic <name>] [--source-label <label>]");
  return options;
}

export function parseImageInventory(raw) {
  return raw.split(/\r?\n/).flatMap((line) => {
    const match = line.match(/^\s*(\d+)\s+(\d+)\s+image\b/i);
    return match ? [{ page: Number(match[1]), imageNumber: Number(match[2]) }] : [];
  });
}

export function mapExtractedImages(extractedNames, imageRows) {
  return extractedNames.flatMap((name) => {
    const imageNumber = Number(name.match(/^image-(\d+)\./)?.[1]);
    const inventoryRow = imageRows.find((row) => row.imageNumber === imageNumber);
    return inventoryRow ? [{ ...inventoryRow, path: `assets/${name}` }] : [];
  });
}

function classify(text, kind) {
  if (kind === "heading") return "unknown";
  if (kind === "equation") return "equation";
  if (kind === "table-row") return "table";
  if (/\b(definition|defined as|refers to|is called)\b/i.test(text)) return "definition";
  if (/\b(mechanism|process|occurs when|because|steps?)\b/i.test(text)) return "mechanism";
  if (/\b(example|for instance|calculate|worked)\b/i.test(text)) return "example";
  if (/\b(property|strength|modulus|hardness|density|viscosity|conductivity)\b/i.test(text)) return "property";
  return "explanation";
}

export function hasTableContext(pageText) {
  const openingLines = pageText.split(/\\r?\\n/).filter((line) => line.trim()).slice(0, 4).join(" ");
  if (/\\b(?:vs\\.?|versus)\\b/i.test(openingLines)) return false;
  const patterns = [
    /\\btable\\s+\\d+(?:\\.\\d+)?\\b/i,
    /\\bmonomer\\b[\\s\\S]{0,100}\\bpolymer\\b/i,
    /\\bfactor\\b[\\s\\S]{0,80}\\beffect\\b/i,
    /\\btype\\b[\\s\\S]{0,80}\\bexample\\b[\\s\\S]{0,80}\\btypical\\s+use\\b/i,
    /\\bcategory\\b[\\s\\S]{0,80}\\bfunction\\b/i,
    /\\bproperty\\b[\\s\\S]{0,60}\\bunit\\b/i,
    /\\bpolymer\\b[\\s\\S]{0,80}\\bpermeant\\b/i,
    /\\bsl\\.?\\s*no\\.?\\b[\\s\\S]{0,100}\\b(?:co[- ]?rotating|counter[- ]?rotating)\\b/i,
  ];
  return patterns.some((pattern) => pattern.test(pageText));
}

function classifyLine(line) {
  const trimmed = line.trim();
  if (!trimmed) return null;
  // Prioritize strong structural signals before broad heading heuristics.
  if (/[=≈≃≤≥∝∑√]|\\frac|\\sum|\b(?:MPa|GPa|kJ|mol|mm|cm)\b/.test(trimmed) && trimmed.length < 240) return "equation";
  if (/^(?:[-*•▪]|\d+[.)])\s+/.test(trimmed)) return "bullet";
  // Layout extraction indents ordinary slide text; treat a line as a table row
  // only when it contains at least two non-empty cells separated by a wide gap.
  const cells = line.split(/\t| {3,}/).map((cell) => cell.trim()).filter(Boolean);
  if (cells.length >= 2) return "table-row";
  if (/^(?:\d+(?:\.\d+)*[.)]?\s+)?[A-Z][^.!?]{2,100}$/.test(trimmed) && trimmed.length < 110) return "heading";
  return "paragraph";
}

function splitIntoBlocks(pageText) {
  const lines = pageText.replace(/\r/g, "").split("\n");
  const blocks = [];
  let paragraph = [];
  const flush = () => {
    const text = paragraph.join(" ").trim();
    if (text) blocks.push({ kind: "paragraph", text });
    paragraph = [];
  };
  for (const line of lines) {
    if (!line.trim()) { flush(); continue; }
    const kind = classifyLine(line);
    if (kind === "paragraph") {
      paragraph.push(line.trim());
      continue;
    }
    flush();
    blocks.push({ kind, text: line.trim() });
  }
  flush();
  return blocks;
}

export function shouldUseOcr(pageText, minimumNativeCharacters = 24) {
  return pageText.replace(/\s/g, "").length < minimumNativeCharacters;
}

export function parseOcrTsv(tsv) {
  const lines = tsv.trim().split(/\r?\n/);
  if (lines.length < 2) return { wordCount: 0, meanWordConfidence: null, lowConfidenceWordCount: 0, lowConfidenceRatio: 0 };
  const headers = lines[0].split("\t");
  const confidenceIndex = headers.indexOf("conf");
  const textIndex = headers.indexOf("text");
  if (confidenceIndex < 0 || textIndex < 0) throw new Error("Tesseract TSV is missing conf/text columns.");
  const words = lines.slice(1).flatMap((line) => {
    const columns = line.split("\t");
    const text = (columns[textIndex] ?? "").trim();
    const confidence = Number(columns[confidenceIndex]);
    return text && Number.isFinite(confidence) && confidence >= 0 ? [{ text, confidence }] : [];
  });
  const lowConfidenceWordCount = words.filter((word) => word.confidence < 40).length;
  return {
    wordCount: words.length,
    meanWordConfidence: words.length ? Number((words.reduce((sum, word) => sum + word.confidence, 0) / words.length).toFixed(1)) : null,
    lowConfidenceWordCount,
    lowConfidenceRatio: words.length ? Number((lowConfidenceWordCount / words.length).toFixed(3)) : 0,
  };
}

export function buildTesseractTsvArgs(imagePath) {
  // Tesseract expects output options before the named TSV config file.
  return [imagePath, "stdout", "--psm", "3", "tsv"];
}

export function assessOcrQuality({ ocrCharacterCount, nativeCharacterCount, wordCount, meanWordConfidence, lowConfidenceRatio }) {
  const hasMoreText = ocrCharacterCount > nativeCharacterCount;
  const qualityAccepted = hasMoreText && wordCount >= 5 && meanWordConfidence !== null && meanWordConfidence >= 65 && lowConfidenceRatio <= 0.35;
  return {
    selectedMethod: hasMoreText ? "ocr" : "native",
    qualityStatus: qualityAccepted ? "candidate" : "review-required",
    qualityAccepted,
  };
}

export function buildOcrSummary(pageStats) {
  const attempted = pageStats.length;
  const replaced = pageStats.filter((page) => page.selectedMethod === "ocr").length;
  return {
    attemptedPages: attempted,
    replacedPages: replaced,
    retainedNativePages: attempted - replaced,
    failedPages: pageStats.filter((page) => page.status === "failed").map((page) => page.page),
    reviewRequiredPages: pageStats.filter((page) => page.qualityStatus === "review-required").map((page) => page.page),
    pageStats,
  };
}

export function buildRecords({ sourceId, pages, mappingHint = {}, imageAssets = [], extractionMethod = "pdftotext -layout", pageExtractionMethods = [], pageExtractionQuality = [] }) {
  const records = [];
  pages.forEach((pageText, pageIndex) => {
    const blocks = splitIntoBlocks(pageText);
    const tableContext = hasTableContext(pageText);
    blocks.forEach((block, blockIndex) => {
      const digest = createHash("sha256").update(`${sourceId}|page:${pageIndex + 1}|block:${blockIndex}| ${block.text}`).digest("hex").slice(0, 16);
      const candidateType = tableContext && block.kind === "paragraph" && /\\d/.test(block.text)
        ? "table"
        : classify(block.text, block.kind);
      records.push({
        id: `src-${digest}`,
        sourceId,
        sourcePage: pageIndex + 1,
        blockIndex,
        kind: block.kind,
        text: block.text,
        candidateType,
        mappingHint,
        reviewStatus: "needs-review",
        extractionMethod: pageExtractionMethods[pageIndex] ?? extractionMethod,
        extractionQuality: pageExtractionQuality[pageIndex] ?? "not-scored",
        reviewPriority: pageExtractionQuality[pageIndex] === "review-required" || block.kind === "equation" || (candidateType === "table" && tableContext) ? "exception" : "routine",
        confidence: "unverified",
      });
    });
  });
  imageAssets.forEach((asset) => {
    const digest = createHash("sha256").update(`${sourceId}|image:${asset.imageNumber}|page:${asset.page}|${asset.path}`).digest("hex").slice(0, 16);
    records.push({ id: `src-${digest}`, sourceId, sourcePage: asset.page, blockIndex: `image-${asset.imageNumber}`, kind: "image-reference", text: asset.path, candidateType: "figure", mappingHint, reviewStatus: "needs-review", extractionMethod: "pdfimages -png", extractionQuality: "page-mapped", reviewPriority: "visual-reference", confidence: "unverified" });
  });
  return records;
}

export function buildPagePreviewPlan(records, ocrQuality = {}) {
  const reasonsByPage = new Map();
  const addReason = (page, reason) => {
    if (!Number.isInteger(page) || page < 1) return;
    const reasons = reasonsByPage.get(page) ?? new Set();
    reasons.add(reason);
    reasonsByPage.set(page, reasons);
  };
  for (const record of records) {
    if (record.candidateType === "equation") addReason(record.sourcePage, "equation-candidate");
    if (record.candidateType === "table") addReason(record.sourcePage, "table-candidate");
    if (record.candidateType === "figure") addReason(record.sourcePage, "embedded-figure");
    if (record.extractionQuality === "review-required") addReason(record.sourcePage, "extraction-review-required");
  }
  for (const page of ocrQuality.reviewRequiredPages ?? []) addReason(page, "ocr-review-required");
  return [...reasonsByPage.entries()].sort(([a], [b]) => a - b)
    .map(([page, reasons]) => ({ page, reasons: [...reasons].sort() }));
}

function makeReviewPacket(manifest, records) {
  const byPage = new Map();
  for (const record of records) byPage.set(record.sourcePage, (byPage.get(record.sourcePage) ?? 0) + 1);
  const exceptions = records.filter((record) => record.reviewPriority === "exception");
  const routineCount = records.filter((record) => record.reviewPriority === "routine").length;
  const visualCount = records.filter((record) => record.reviewPriority === "visual-reference").length;
  const lines = [
    "# Source review packet",
    "",
    `- **Source:** ${manifest.fileName}`,
    `- **SHA-256:** \`${manifest.sha256}\``,
    `- **Pages:** ${manifest.pageCount}`,
    `- **Records:** ${records.length}`,
    `- **Mapping hint:** ${[manifest.mappingHint.course, manifest.mappingHint.topic, manifest.mappingHint.subtopic].filter(Boolean).join(" / ") || "Not supplied"}`,
    "",
    "> Nothing in this packet is approved course content. Verify against the original page before using it.",
    "",
    "## Source page previews",
    "",
    ...(manifest.pagePreviews?.length ? manifest.pagePreviews.map((preview) => preview.path ? `- [Page ${preview.page}](./${preview.path}) — ${preview.reasons.join(", ")}` : `- Page ${preview.page} — preview ${preview.status}`) : ["No page previews were generated."]),
    "",
    "## Page inventory",
    "",
    "| Page | Candidate blocks |",
    "|---:|---:|",
    ...Array.from({ length: manifest.pageCount }, (_, i) => `| ${i + 1} | ${byPage.get(i + 1) ?? 0} |`),
    "",
    "## Review checklist",
    "",
    "- [ ] Resolve low-confidence OCR, equations, table rows and other flagged exceptions.",
    "- [ ] Inspect only visual references relevant to the destination topic.",
    "- [ ] Confirm or correct the course/topic/subtopic mapping once for the source.",
    "- [ ] Approve or correct records before preparing a separate content patch.",
    "- [ ] Questions remain manually authored; this pipeline does not create them.",
    "",
    "## Triage summary",
    "",
    `- **Exception records requiring focused review:** ${exceptions.length}`,
    `- **Routine text records:** ${routineCount} (retained as unapproved candidates; not automatically applied)`,
    `- **Page-mapped visual references:** ${visualCount} (inspect selectively when figures are needed)`,
    "",
    "## Exception queue",
    "",
    ...exceptions.map((r) => `### Page ${r.sourcePage} · ${r.kind} · ${r.candidateType}\n\nID: \`${r.id}\` · Status: ${r.reviewStatus} · Priority: ${r.reviewPriority} · Extraction: ${r.extractionQuality}\n\n> ${r.text.replace(/\n/g, "\n> ")}\n`),
    "",
    "> All records remain unapproved in knowledge-records.json. Routine means lower extraction risk, not verified teaching content. No record is inserted into a course automatically.",
  ];
  return lines.join("\n");
}

export async function ingestPdf(options) {
  const input = resolve(options.input);
  const output = resolve(options.out);
  const bytes = await readFile(input);
  const sha256 = createHash("sha256").update(bytes).digest("hex");
  const sourceId = `source-${sha256.slice(0, 16)}`;
  const info = run("pdfinfo", [input]);
  const pageCount = Number(info.match(/^Pages:\s+(\d+)/m)?.[1]);
  if (!Number.isInteger(pageCount) || pageCount < 1) throw new Error("Could not determine PDF page count from pdfinfo.");
  const extracted = run("pdftotext", ["-layout", input, "-"]);
  const pages = extracted.split("\f");
  if (pages.at(-1) === "") pages.pop();
  while (pages.length < pageCount) pages.push("");
  const pageExtractionMethods = pages.map(() => "pdftotext -layout");
  const pageExtractionQuality = pages.map(() => "not-scored");
  let ocrStatus = "not-needed";
  const ocrPageStats = [];
  const sparsePages = pages.map((page, index) => ({ page, index })).filter(({ page }) => shouldUseOcr(page));
  if (sparsePages.length) {
    const hasCommand = (command) => spawnSync(command, ["-v"], { encoding: "utf8" }).status === 0;
    if (hasCommand("pdftoppm") && hasCommand("tesseract")) {
      const tempDir = await mkdtemp(join(tmpdir(), "limitless-pdf-ocr-"));
      try {
        for (const { index } of sparsePages) {
          const pageNumber = index + 1;
          const nativeCharacterCount = pages[index].replace(/\s/g, "").length;
          try {
            const prefix = join(tempDir, `page-${pageNumber}`);
            run("pdftoppm", ["-f", String(pageNumber), "-l", String(pageNumber), "-r", "220", "-png", input, prefix]);
            const imageName = (await readdir(tempDir)).find((name) => name.startsWith(`page-${pageNumber}-`) && name.endsWith(".png"));
            if (!imageName) throw new Error("Page render did not produce an image.");
            const imagePath = join(tempDir, imageName);
            const ocrText = run("tesseract", [imagePath, "stdout", "--psm", "3"]).trim();
            const ocrCharacterCount = ocrText.replace(/\s/g, "").length;
            const confidence = parseOcrTsv(run("tesseract", buildTesseractTsvArgs(imagePath)));
            const quality = assessOcrQuality({ ocrCharacterCount, nativeCharacterCount, ...confidence });
            pageExtractionQuality[index] = quality.qualityStatus;
            ocrPageStats.push({
              page: pageNumber,
              nativeCharacterCount,
              ocrCharacterCount,
              ...confidence,
              ...quality,
              selectedCharacterCount: quality.selectedMethod === "ocr" ? ocrCharacterCount : nativeCharacterCount,
              status: "completed",
            });
            if (quality.selectedMethod === "ocr") {
              pages[index] = ocrText;
              pageExtractionMethods[index] = "tesseract OCR (220 DPI, page segmentation mode 3)";
            }
          } catch (error) {
            pageExtractionQuality[index] = "review-required";
            ocrPageStats.push({
              page: pageNumber,
              nativeCharacterCount,
              ocrCharacterCount: null,
              wordCount: 0,
              meanWordConfidence: null,
              lowConfidenceWordCount: 0,
              lowConfidenceRatio: 0,
              selectedMethod: "native",
              qualityStatus: "review-required",
              qualityAccepted: false,
              selectedCharacterCount: nativeCharacterCount,
              status: "failed",
              failureReason: error.message,
            });
          }
        }
        ocrStatus = ocrPageStats.some((page) => page.status === "failed") ? "available-with-page-failures" : "available";
      } finally {
        await rm(tempDir, { recursive: true, force: true });
      }
    } else {
      ocrStatus = "skipped-missing-dependency";
      for (const { index } of sparsePages) ocrPageStats.push({
        page: index + 1,
        nativeCharacterCount: pages[index].replace(/\s/g, "").length,
        ocrCharacterCount: null,
        selectedMethod: "native",
        selectedCharacterCount: pages[index].replace(/\s/g, "").length,
        status: "skipped-missing-dependency",
      });
    }
  }
  const mappingHint = {
    course: options.course ?? null,
    topic: options.topic ?? null,
    subtopic: options.subtopic ?? null,
  };
  let imageInventory = "pdfimages unavailable; embedded image inventory not collected.";
  let imageAssets = [];
  try {
    imageInventory = run("pdfimages", ["-list", input]);
    const imageRows = parseImageInventory(imageInventory).sort((a, b) => a.imageNumber - b.imageNumber);
    const assetsDir = join(output, "assets");
    await mkdir(assetsDir, { recursive: true });
    run("pdfimages", ["-png", input, join(assetsDir, "image")]);
    const extractedNames = (await readdir(assetsDir)).filter((name) => /^image-\d+\./.test(name)).sort();
    // Match extracted files to actual image rows by PDF image number.
    imageAssets = mapExtractedImages(extractedNames, imageRows);
  } catch (error) {
    imageInventory = `Image extraction unavailable: ${error.message}`;
  }
  const records = buildRecords({ sourceId, pages, mappingHint, imageAssets, pageExtractionMethods, pageExtractionQuality });
  const previewPlan = buildPagePreviewPlan(records, buildOcrSummary(ocrPageStats));
  const pagePreviews = [];
  let pagePreviewStatus = "not-needed";
  if (previewPlan.length) {
    if (spawnSync("pdftoppm", ["-v"], { encoding: "utf8" }).status === 0) {
      const pagesDir = join(output, "assets", "pages");
      await mkdir(pagesDir, { recursive: true });
      for (const item of previewPlan) {
        const fileName = `page-${String(item.page).padStart(3, "0")}.png`;
        const outputPrefix = join(pagesDir, fileName.slice(0, -4));
        try {
          run("pdftoppm", ["-f", String(item.page), "-l", String(item.page), "-r", "120", "-png", "-singlefile", input, outputPrefix]);
          pagePreviews.push({ ...item, path: `assets/pages/${fileName}`, dpi: 120, status: "generated" });
        } catch (error) {
          pagePreviews.push({ ...item, path: null, dpi: 120, status: "failed", failureReason: error.message });
        }
      }
      pagePreviewStatus = pagePreviews.every((preview) => preview.status === "generated") ? "generated" : "generated-with-failures";
    } else {
      pagePreviewStatus = "skipped-missing-dependency";
      for (const item of previewPlan) pagePreviews.push({ ...item, path: null, dpi: 120, status: "skipped-missing-dependency" });
    }
  }
  const manifest = {
    schemaVersion: "1.0.0",
    sourceId,
    fileName: basename(input),
    sourceLabel: options["source-label"] ?? null,
    sha256,
    mimeType: "application/pdf",
    pageCount,
    extractedAt: new Date().toISOString(),
    extraction: {
      text: "pdftotext -layout with optional OCR fallback",
      ocr: ocrStatus,
      ocrPages: pageExtractionMethods.flatMap((method, index) => method.includes("OCR") ? [index + 1] : []),
      ocrQuality: buildOcrSummary(ocrPageStats),
      pagePreviews: pagePreviewStatus,
      imageInventory: imageInventory.startsWith("pdfimages unavailable") || imageInventory.startsWith("Image extraction unavailable") ? "unavailable" : "pdfimages -list and -png",
      imageInventoryRaw: imageInventory,
    },
    mappingHint,
    imageAssets,
    pagePreviews,
    approvalStatus: "unreviewed",
  };
  await mkdir(output, { recursive: true });
  await writeFile(join(output, "source-manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
  await writeFile(join(output, "knowledge-records.json"), JSON.stringify({ schemaVersion: "1.0.0", records }, null, 2) + "\n");
  await writeFile(join(output, "review-packet.md"), makeReviewPacket(manifest, records) + "\n");
  return { output, sourceId, pageCount, recordCount: records.length, sha256 };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const result = await ingestPdf(parseArgs(process.argv.slice(2)));
    process.stdout.write(`Ingestion staged (not approved): ${JSON.stringify(result, null, 2)}\n`);
  } catch (error) {
    process.stderr.write(`Ingestion failed: ${error.message}\n`);
    process.exitCode = 1;
  }
}
