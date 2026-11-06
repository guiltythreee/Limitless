import test from "node:test";
import assert from "node:assert/strict";
import { readPdf, PdfDocumentLike, PdfJsAdapter } from "./pdf-importer";

function item(str: string, x: number, y: number, width: number, size = 10) {
  return { str, width, transform: [size, 0, 0, size, x, y], fontName: "F1" };
}

function adapterFor(pages: ReturnType<typeof pageFixture>[], overrides: Partial<PdfDocumentLike> = {}) {
  let destroyed = false;
  const document: PdfDocumentLike = {
    numPages: pages.length,
    fingerprints: ["pdf-fingerprint-123"],
    async getPage(pageNumber) {
      const fixture = pages[pageNumber - 1];
      return {
        getViewport: () => ({ width: 612, height: 792 }),
        getTextContent: async () => ({ items: fixture.items }),
      };
    },
    async getMetadata() { return { info: { Title: "Sample PDF" } }; },
    async destroy() { destroyed = true; },
    ...overrides,
  };
  const adapter: PdfJsAdapter = {
    getDocument: () => ({ promise: Promise.resolve(document) }),
  };
  return { adapter, wasDestroyed: () => destroyed };
}

function pageFixture(items: ReturnType<typeof item>[]) {
  return { items };
}

test("reads PDF pages into sections and extracts metadata and chapter headings", async () => {
  const fake = adapterFor([
    pageFixture([item("CHAPTER 1", 40, 720, 90, 18), item("First chapter text.", 40, 690, 110)]),
    pageFixture([item("CHAPTER 2", 40, 720, 90, 18), item("Second chapter text.", 40, 690, 120)]),
  ]);
  const result = await readPdf(new Uint8Array([1, 2, 3]), fake.adapter);
  assert.equal(result.title, "Sample PDF");
  assert.equal(result.fingerprint, "pdf-fingerprint-123");
  assert.equal(result.pages.length, 2);
  assert.deepEqual(result.pages[0].map((block) => [block.t, block.text]), [
    ["h", "CHAPTER 1"], ["p", "First chapter text."],
  ]);
  assert.deepEqual(result.chapters.map((chapter) => [chapter.p, chapter.title]), [
    [0, "CHAPTER 1"], [1, "CHAPTER 2"],
  ]);
  assert.equal(fake.wasDestroyed(), true);
});

test("returns a friendly empty-text error for scanned or blank PDFs", async () => {
  const fake = adapterFor([pageFixture([])]);
  await assert.rejects(readPdf(new Uint8Array([1]), fake.adapter),
    (error: { pdfEmpty?: boolean }) => error.pdfEmpty === true);
  assert.equal(fake.wasDestroyed(), true);
});


function minimalPdf(text: string): Uint8Array {
  const stream = "BT /F1 12 Tf 72 700 Td (" + text.replace(/([\\()])/g, "\\$1") + ") Tj ET";
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>",
    null,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ];
  let source = "%PDF-1.4\n";
  const offsets: number[] = [];
  objects.forEach((object, index) => {
    offsets[index] = source.length;
    source += index === 3
      ? "4 0 obj\n<< /Length " + stream.length + " >>\nstream\n" + stream + "\nendstream\nendobj\n"
      : (index + 1) + " 0 obj\n" + object + "\nendobj\n";
  });
  const xref = source.length;
  source += "xref\n0 6\n0000000000 65535 f \n";
  offsets.forEach((offset) => { source += String(offset).padStart(10, "0") + " 00000 n \n"; });
  source += "trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n" + xref + "\n%%EOF\n";
  return new TextEncoder().encode(source);
}

test("the default PDF.js runtime can read a real local PDF byte stream", async () => {
  const result = await readPdf(minimalPdf("Hello from the PDF world."));
  assert.equal(result.pages.length, 1);
  assert.ok(result.pages[0].some((block) => block.text.includes("Hello from the PDF world.")));
  assert.ok(result.fingerprint.length > 0);
});

test("normalizes parser failures into an invalid-PDF error", async () => {
  const adapter: PdfJsAdapter = {
    getDocument: () => ({ promise: Promise.reject(new Error("broken xref")) }),
  };
  await assert.rejects(readPdf(new Uint8Array([0]), adapter),
    (error: { pdfInvalid?: boolean; message?: string }) =>
      error.pdfInvalid === true && /not a valid PDF/.test(error.message ?? ""));
});
