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

function classifyLine(line) {
  const trimmed = line.trim();
  if (!trimmed) return null;
  if (/^(?:\d+(?:\.\d+)*[.)]?\s+)?[A-Z][^.!?]{2,100}$/.test(trimmed) && trimmed.length < 110) return "heading";
  if (/^(?:[-*•▪]|\d+[.)])\s+/.test(trimmed)) return "bullet";
  if (/[=≈≃≤≥∝∑√]|\\frac|\\sum|\b(?:MPa|GPa|kJ|mol|mm|cm)\b/.test(trimmed) && trimmed.length < 240) return "equation";
  if (/\s{2,}|\t/.test(line)) return "table-row";
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
  return pageText.replace(/\\s/g, "").length < minimumNativeCharacters;
}\n\nexport function buildRecords({ sourceId, pages, mappingHint = {}, imageAssets = [], extractionMethod = "pdftotext -layout", pageExtractionMethods = [] }) {
  const records = [];
  pages.forEach((pageText, pageIndex) => {
    const blocks = splitIntoBlocks(pageText);
    blocks.forEach((block, blockIndex) => {
      const digest = createHash("sha256").update(`${sourceId}|page:${pageIndex + 1}|block:${blockIndex}| ${block.text}`).digest("hex").slice(0, 16);
      records.push({
        id: `src-${digest}`,
        sourceId,
        sourcePage: pageIndex + 1,
        blockIndex,
        kind: block.kind,
        text: block.text,
        candidateType: classify(block.text, block.kind),
        mappingHint,
        reviewStatus: "needs-review",
        extractionMethod,
        confidence: "unverified",
      });
    });
  });
  imageAssets.forEach((asset) => {
    const digest = createHash("sha256").update(`${sourceId}|image:${asset.imageNumber}|page:${asset.page}|${asset.path}`).digest("hex").slice(0, 16);
    records.push({ id: `src-${digest}`, sourceId, sourcePage: asset.page, blockIndex: `image-${asset.imageNumber}`, kind: "image-reference", text: asset.path, candidateType: "figure", mappingHint, reviewStatus: "needs-review", extractionMethod: "pdfimages -png", confidence: "unverified" });
  });
  return records;
}

function makeReviewPacket(manifest, records) {
  const byPage = new Map();
  for (const record of records) byPage.set(record.sourcePage, (byPage.get(record.sourcePage) ?? 0) + 1);
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
    "## Page inventory",
    "",
    "| Page | Candidate blocks |",
    "|---:|---:|",
    ...Array.from({ length: manifest.pageCount }, (_, i) => `| ${i + 1} | ${byPage.get(i + 1) ?? 0} |`),
    "",
    "## Review checklist",
    "",
    "- [ ] Verify extracted wording, symbols, units and equations against the source.",
    "- [ ] Inspect figures/tables and associate image assets with the correct page.",
    "- [ ] Confirm or correct the course/topic/subtopic mapping.",
    "- [ ] Decide whether each record belongs in theory, illustration, worked example or reference material.",
    "- [ ] Reject duplicates, incomplete fragments and low-confidence extraction.",
    "- [ ] Only after approval, prepare a separate content patch for review.",
    "- [ ] Questions remain manually authored; this pipeline does not create them.",
    "",
    "## Candidate records",
    "",
    ...records.map((r) => `### Page ${r.sourcePage} · ${r.kind} · ${r.candidateType}\n\nID: \`${r.id}\` · Status: ${r.reviewStatus}\n\n> ${r.text.replace(/\n/g, "\n> ")}\n`),
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
  let ocrStatus = "not-needed";
  const sparsePages = pages.map((page, index) => ({ page, index })).filter(({ page }) => shouldUseOcr(page));
  if (sparsePages.length) {
    const hasCommand = (command) => spawnSync(command, ["-v"], { encoding: "utf8" }).status === 0;
    if (hasCommand("pdftoppm") && hasCommand("tesseract")) {
      const tempDir = await mkdtemp(join(tmpdir(), "limitless-pdf-ocr-"));
      try {
        for (const { index } of sparsePages) {
          const pageNumber = index + 1;
          const prefix = join(tempDir, `page-${pageNumber}`);
          run("pdftoppm", ["-f", String(pageNumber), "-l", String(pageNumber), "-r", "220", "-png", input, prefix]);
          const imageName = (await readdir(tempDir)).find((name) => name.startsWith(`page-${pageNumber}-`) && name.endsWith(".png"));
          if (!imageName) continue;
          const ocrText = run("tesseract", [join(tempDir, imageName), "stdout", "--psm", "3"]).trim();
          if (ocrText.replace(/\s/g, "").length > pages[index].replace(/\s/g, "").length) {
            pages[index] = ocrText;
            pageExtractionMethods[index] = "tesseract OCR (220 DPI, page segmentation mode 3)";
          }
        }
        ocrStatus = "available";
      } finally {
        await rm(tempDir, { recursive: true, force: true });
      }
    } else {
      ocrStatus = "skipped-missing-dependency";
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
    const extractedNames = (await readdir(assetsDir)).filter((name) => /^image-\\d+\\./.test(name)).sort();
    imageAssets = extractedNames.map((name, index) => ({ ...(imageRows[index] ?? { page: null, imageNumber: index }), path: `assets/${name}` }));
  } catch (error) {
    imageInventory = `Image extraction unavailable: ${error.message}`;
  }
  const records = buildRecords({ sourceId, pages, mappingHint, imageAssets, pageExtractionMethods });
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
      text: "pdftotext -layout with optional OCR fallback",\n      ocr: ocrStatus,\n      ocrPages: pageExtractionMethods.flatMap((method, index) => method.includes("OCR") ? [index + 1] : []),
      imageInventory: imageInventory.startsWith("pdfimages unavailable") || imageInventory.startsWith("Image extraction unavailable") ? "unavailable" : "pdfimages -list and -png",
      imageInventoryRaw: imageInventory,
    },
    mappingHint,
    imageAssets,
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
