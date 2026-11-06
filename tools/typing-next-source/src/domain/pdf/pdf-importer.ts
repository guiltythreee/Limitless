import {
  PdfBlock, PdfChapter, PdfTextItem, blocksFromLines, chapterHeadsOnPage,
  extractLines, median, pickChapters,
} from "./pdf-domain";

export interface PdfPageLike {
  getViewport(options: { scale: number }): { width: number; height: number };
  getTextContent(): Promise<{ items: readonly unknown[] }>;
}

export interface PdfDocumentLike {
  readonly numPages: number;
  readonly fingerprints?: readonly string[];
  getPage(pageNumber: number): Promise<PdfPageLike>;
  getMetadata?(): Promise<{ info?: { Title?: string } }>;
  destroy?(): Promise<void> | void;
}

export interface PdfJsAdapter {
  getDocument(options: Record<string, unknown>): { promise: Promise<PdfDocumentLike> };
  GlobalWorkerOptions?: { workerSrc: string };
}

export interface PdfImportResult {
  readonly title: string;
  readonly fingerprint: string;
  readonly pages: PdfBlock[][];
  readonly chapters: PdfChapter[];
}

function pdfError(message: string, flag: "pdfInvalid" | "pdfEmpty"): Error {
  return Object.assign(new Error(message), { [flag]: true });
}

async function defaultPdfJs(): Promise<PdfJsAdapter> {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "../../../node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs",
    import.meta.url,
  ).toString();
  return pdfjs as unknown as PdfJsAdapter;
}

/** Extracts local PDF text into one typing section per original PDF page. */
export async function readPdf(
  input: ArrayBuffer | Uint8Array,
  adapter?: PdfJsAdapter,
): Promise<PdfImportResult> {
  const bytes = input instanceof Uint8Array ? new Uint8Array(input) : new Uint8Array(input);
  let document: PdfDocumentLike | null = null;
  try {
    const pdfjs = adapter ?? await defaultPdfJs();
    document = await pdfjs.getDocument({
      data: bytes,
      isEvalSupported: false,
      useWorkerFetch: false,
      disableAutoFetch: true,
      stopAtErrors: false,
    }).promise;

    const pages: PdfBlock[][] = [];
    const headsByPage: { key: string; title: string }[][] = [];
    for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber++) {
      const page = await document.getPage(pageNumber);
      const viewport = page.getViewport({ scale: 1 });
      const content = await page.getTextContent();
      const items = content.items.filter((item): item is PdfTextItem =>
        typeof item === "object" && item !== null && typeof (item as PdfTextItem).str === "string",
      );
      const lines = extractLines(items, viewport.width);
      const medianSize = median(lines.map((line) => line.size));
      pages.push(blocksFromLines(lines, medianSize, viewport.height));
      headsByPage.push(chapterHeadsOnPage(lines, medianSize, viewport.height));
    }

    if (!pages.some((page) => page.some((block) => block.text))) {
      throw pdfError("This PDF contains no readable text.", "pdfEmpty");
    }

    let title = "";
    try { title = (await document.getMetadata?.())?.info?.Title?.trim() ?? ""; } catch { /* metadata is optional */ }
    return {
      title: title || "Untitled PDF",
      fingerprint: document.fingerprints?.[0] || fallbackFingerprint(bytes),
      pages,
      chapters: pickChapters(headsByPage, pages.length),
    };
  } catch (error) {
    if (typeof error === "object" && error !== null &&
      ((error as Record<string, unknown>).pdfInvalid === true ||
       (error as Record<string, unknown>).pdfEmpty === true)) throw error;
    throw pdfError("This is not a valid PDF file, or it is damaged.", "pdfInvalid");
  } finally {
    try { await document?.destroy?.(); } catch { /* release best-effort */ }
  }
}

function fallbackFingerprint(bytes: Uint8Array): string {
  let a = 0x811c9dc5;
  let b = 0x9e3779b9;
  for (const byte of bytes) {
    a = Math.imul(a ^ byte, 0x01000193) >>> 0;
    b = Math.imul(b ^ byte, 0x01000193) >>> 0;
  }
  return a.toString(16).padStart(8, "0") + b.toString(16).padStart(8, "0");
}
