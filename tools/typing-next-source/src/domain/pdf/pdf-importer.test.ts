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

test("normalizes parser failures into an invalid-PDF error", async () => {
  const adapter: PdfJsAdapter = {
    getDocument: () => ({ promise: Promise.reject(new Error("broken xref")) }),
  };
  await assert.rejects(readPdf(new Uint8Array([0]), adapter),
    (error: { pdfInvalid?: boolean; message?: string }) =>
      error.pdfInvalid === true && /not a valid PDF/.test(error.message ?? ""));
});
