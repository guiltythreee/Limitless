#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { ANALYSIS_SCHEMA } from "./schema.mjs";
import { validateAnalysis } from "./validate.mjs";
import { renderReviewReport } from "./report.mjs";
import { prepareMt203Patch } from "./prepare.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const COURSE_ROOT = path.join(ROOT, "metallurgy-source");
const MAX_PDF_BYTES = 50_000_000;
const DEFAULT_MODEL = process.env.OPENAI_MODEL;

function usage() {
  console.log("Limitless Resource Ingestion — local maintainer tool\n\nUsage:\n  node src/cli.mjs analyze --input <file.pdf> --course mt203 [--output-dir <dir>] [--model <model>]\n  node src/cli.mjs prepare --analysis <analysis.json> [--output <patch-plan.json>]\n\nCurrent pilot: MT203 Polymer Science and Technology; PDF only.\nEnvironment: OPENAI_API_KEY and OPENAI_MODEL are required.\nBoth commands write proposal artifacts only. They never edit course files.");
}
function arg(name, fallback) {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : fallback;
}
function responseText(payload) {
  if (typeof payload.output_text === "string") return payload.output_text;
  const chunks = [];
  for (const item of payload.output ?? []) for (const content of item.content ?? []) {
    if (content.type === "output_text" && content.text) chunks.push(content.text);
  }
  return chunks.join("\n");
}
async function api(endpoint, options = {}) {
  const response = await fetch("https://api.openai.com/v1" + endpoint, {
    ...options,
    headers: { Authorization: "Bearer " + process.env.OPENAI_API_KEY, ...(options.headers ?? {}) },
    signal: options.signal ?? AbortSignal.timeout(10 * 60 * 1000)
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error("OpenAI API " + response.status + ": " + (body.error?.message ?? JSON.stringify(body)));
  return body;
}
async function extractPdfPages(bytes) {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const document = await pdfjs.getDocument({ data: new Uint8Array(bytes), useSystemFonts: true, isEvalSupported: false }).promise;
  const pages = [];
  for (let pageNo = 1; pageNo <= document.numPages; pageNo++) {
    const page = await document.getPage(pageNo);
    const content = await page.getTextContent();
    pages.push({ page: pageNo, text: content.items.map((item) => item.str ?? "").join(" ").replace(/\s+/g, " ").trim() });
  }
  return { pages, pageCount: document.numPages };
}
async function buildMt203Context() {
  const files = [
    "app/courses/manifests/mt203.ts", "app/data/qbank/meta.ts", "app/data/lessons-mt203.ts",
    ...Array.from({ length: 11 }, (_, i) => "app/data/qbank/t" + (i + 1) + ".ts")
  ];
  const chunks = [];
  for (const relative of files) {
    const content = await fs.readFile(path.join(COURSE_ROOT, relative), "utf8");
    chunks.push("\n===== " + relative + " =====\n" + content);
  }
  return chunks.join("\n");
}
const SYSTEM_PROMPT = [
  "You are the content analyst for Limitless, a private study-resource ingestion tool.",
  "The attached PDF is the primary authority for source scope. Existing course files are context for overlap detection only.",
  "Do not invent facts, examples, diagrams, equations, answer keys, questions, or missing explanations.",
  "Extract only worked examples and questions that actually appear in the PDF. Never generate practice questions.",
  "Preserve original terminology, assumptions, symbols, units, sequence, and chapter boundaries.",
  "Map material to the existing course taxonomy. In coverage, use topic_id unmapped only when no topic fits.",
  "Compare against current theory and question bank. Mark duplicate content as duplicate/already-covered; distinguish additions from paraphrases.",
  "Every proposal must cite exact PDF page numbers. Evidence quotes for questions must be copied verbatim where possible.",
  "Do not treat text extraction failure as evidence that a page is blank: inspect PDF pages visually, especially diagrams, graphs, tables, equations, and scanned pages.",
  "If a source page is ambiguous, unreadable, contradictory, scientifically suspect, or missing data, add a review item and mark the affected record review or hold.",
  "Do not silently correct the source. Separate source content from any concern about its correctness.",
  "For worked examples, preserve every given value, equation, intermediate step, assumption, unit, and final answer. Flag missing steps or data.",
  "For extracted questions, preserve source wording and options. If the source does not provide an answer, leave answer empty and mark review.",
  "MT203 difficulty is 1–4, not generic L1–L5. Types: recall, concept, compare, apply, numerical, assertreason, statement, match, sequence, graph, higher.",
  "Return only the requested JSON schema."
].join("\n");

async function analyze() {
  const input = arg("--input");
  const course = arg("--course", "mt203");
  if (!input) throw new Error("--input <file.pdf> is required");
  if (course !== "mt203") throw new Error("The first pilot currently supports only --course mt203");
  if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is not set. Set it in your local shell; never put it in a repository file.");
  if (!process.env.OPENAI_MODEL) throw new Error("OPENAI_MODEL is not set. Choose a model enabled for your API account that supports PDF input and Structured Outputs.");
  const inputPath = path.resolve(input);
  if (path.extname(inputPath).toLowerCase() !== ".pdf") throw new Error("The first pilot accepts PDF files only.");
  const bytes = await fs.readFile(inputPath);
  if (!bytes.length || bytes.length > MAX_PDF_BYTES) throw new Error("PDF must be non-empty and under 50 MB.");
  const sourceSha256 = crypto.createHash("sha256").update(bytes).digest("hex");
  const { pages, pageCount } = await extractPdfPages(bytes);
  const courseContext = await buildMt203Context();
  const model = arg("--model", DEFAULT_MODEL);
  const outputDir = path.resolve(arg("--output-dir", path.join(path.dirname(inputPath), "limitless-ingestion-output")));
  await fs.mkdir(outputDir, { recursive: true });

  let uploadedFileId;
  try {
    const form = new FormData();
    form.append("purpose", "user_data");
    form.append("file", new Blob([bytes], { type: "application/pdf" }), path.basename(inputPath));
    const uploaded = await api("/files", { method: "POST", body: form });
    uploadedFileId = uploaded.id;
    if (!uploadedFileId) throw new Error("OpenAI file upload did not return a file ID.");

    const prompt = [
      "Analyze the attached study resource for possible additions to MT203.",
      "Source file: " + path.basename(inputPath) + "; SHA-256: " + sourceSha256 + "; pages: " + pageCount + ".",
      "Local PDF text-layer coverage; pages with fewer than 40 extracted characters require visual inspection:",
      JSON.stringify(pages.filter((page) => page.text.length < 40).map((page) => page.page)),
      "Existing MT203 manifest, theory, topic metadata and all question-bank source files:",
      courseContext,
      "Return a complete coverage map, only source-present theory updates, illustration inventory, worked examples and source questions. Do not draft new questions."
    ].join("\n\n");
    const response = await api("/responses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        max_output_tokens: 64000,
        input: [
          { role: "system", content: [{ type: "input_text", text: SYSTEM_PROMPT }] },
          { role: "user", content: [{ type: "input_file", file_id: uploadedFileId }, { type: "input_text", text: prompt }] }
        ],
        text: { format: { type: "json_schema", name: "limitless_resource_analysis", strict: true, schema: ANALYSIS_SCHEMA } }
      })
    });
    if (response.status && response.status !== "completed") throw new Error("Model response did not complete: " + JSON.stringify(response.incomplete_details ?? response.error ?? response.status));
    const raw = responseText(response);
    if (!raw) throw new Error("The model returned no structured output (possibly a refusal or incomplete response).");
    const analysis = JSON.parse(raw);
    const validation = validateAnalysis(analysis, pages);
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    const stem = path.basename(inputPath, ".pdf").replace(/[^a-z0-9-_]+/gi, "-");
    const base = stem + "-" + stamp;
    const artifact = {
      schema_version: "1.0",
      source: { filename: path.basename(inputPath), sha256: sourceSha256, page_count: pageCount },
      course: { id: "mt203", name: "Polymer Science and Technology" },
      model, analysis, validation
    };
    await fs.writeFile(path.join(outputDir, base + ".json"), JSON.stringify(artifact, null, 2) + "\n", "utf8");
    await fs.writeFile(path.join(outputDir, base + ".md"), renderReviewReport({ sourceName: path.basename(inputPath), sourceSha256, pageCount, analysis, validation }), "utf8");
    console.log("Analysis saved to: " + outputDir);
    console.log("Pages: " + pageCount + "; theory: " + analysis.theory_updates.length + "; figures: " + analysis.illustrations.length + "; examples: " + analysis.worked_examples.length + "; source questions: " + analysis.source_questions.length);
    console.log("Validation errors: " + validation.errors.length + "; review warnings: " + validation.warnings.length);
    if (validation.errors.length) process.exitCode = 2;
  } finally {
    if (uploadedFileId) {
      await api("/files/" + encodeURIComponent(uploadedFileId), { method: "DELETE" }).catch((error) => {
        console.warn("Could not delete temporary uploaded PDF from API storage: " + error.message);
      });
    }
  }
}

try {
  const command = process.argv[2];
  if (!command || command === "--help" || command === "help") usage();
  else if (command === "analyze") await analyze();\n  else if (command === "prepare") await prepare();
  else throw new Error("Unknown command: " + command);
} catch (error) {
  console.error("Resource ingestion failed: " + error.message);
  process.exitCode = 1;
}
