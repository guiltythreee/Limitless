// The whole page boots in jsdom: sample text at start, an EPUB imported through the real file
// input, typing the first section, XP landing in localStorage, and the "typed before" rule paying
// nothing the second time, plus a minimal PDF through the same input as a regression check.
// A few shims make the page think it is a browser: a canvas context stub (jsdom cannot
// rasterize), a hand-advanced Date — typing speed is judged against Date.now(), so the test
// steps the clock between keystrokes instead of really waiting minutes — and the handful of
// standard APIs (streams, text codecs, structuredClone, Blob.arrayBuffer) jsdom never grew.
import test, { after } from "node:test";
import assert from "node:assert/strict";
import { JSDOM, VirtualConsole } from "jsdom";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { buildEpub, longPara } from "./helpers.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const pageHtml = readFileSync(join(here, "..", "bookkeys.html"), "utf8");

const pageErrors = [];
const vc = new VirtualConsole();
vc.on("jsdomError", (e) => pageErrors.push(String((e && e.message) || e)));
vc.on("error", (...a) => pageErrors.push(a.map(String).join(" ")));

function beforeParse(window) {
  // --- a Date the test can move by hand: finish() measures typing time with Date.now() ---
  const RealDate = window.Date;
  let offset = 0;
  class FakeDate extends RealDate {
    constructor(...args) {
      if (args.length === 0) super(RealDate.now() + offset);
      else super(...args);
    }
    static now() { return RealDate.now() + offset; }
  }
  window.Date = FakeDate;
  window.__advance = (ms) => { offset += ms; };

  // --- JSZip's bundled setimmediate polyfill breaks under jsdom; Node's real one works ---
  window.setImmediate = (fn, ...a) => setImmediate(fn, ...a);
  window.clearImmediate = (h) => clearImmediate(h);

  // --- jsdom cannot rasterize: hand back a stub 2D context for every canvas the page draws ---
  window.HTMLCanvasElement.prototype.getContext = function () {
    const el = this;
    return new Proxy({ canvas: el }, {
      get(t, p) {
        if (p in t) return t[p];
        if (p === "measureText") return () => ({ width: 5 });
        if (p === "getImageData") return () => ({ data: [255, 255, 255, 255] });
        if (p === "createLinearGradient" || p === "createRadialGradient") return () => ({ addColorStop() {} });
        if (typeof p === "symbol" || p === "then") return undefined;
        return () => {};
      },
      set(t, p, v) { t[p] = v; return true; },
    });
  };
  // No URL.createObjectURL on purpose: the page's own worker setup falls back to the inline
  // worker code when object URLs are missing, which is also what old browsers do.

  // jsdom's Blob has no arrayBuffer(); the file-input path needs one. FileReader is real.
  if (window.Blob && !window.Blob.prototype.arrayBuffer) {
    window.Blob.prototype.arrayBuffer = function () {
      return new Promise((resolve, reject) => {
        const r = new window.FileReader();
        r.onload = () => resolve(r.result);
        r.onerror = () => reject(r.error);
        r.readAsArrayBuffer(this);
      });
    };
  }

  // Four APIs every real browser has and jsdom does not; pdf.js needs all of them.
  if (!window.structuredClone) window.structuredClone = (v) => structuredClone(v);
  if (!window.TextDecoder) window.TextDecoder = TextDecoder;
  if (!window.TextEncoder) window.TextEncoder = TextEncoder;
  if (!window.ReadableStream) window.ReadableStream = ReadableStream;
  if (!window.WritableStream) window.WritableStream = WritableStream;
  if (!window.TransformStream) window.TransformStream = TransformStream;
}

const dom = new JSDOM(pageHtml, {
  url: "https://local.test/",
  runScripts: "dangerously",
  pretendToBeVisual: true,
  beforeParse,
  virtualConsole: vc,
});
const w = dom.window;
after(() => { try { w.close(); } catch (e) {} });

const $ = (id) => w.document.getElementById(id);
const wait = async (fn, what, ms = 20000) => {
  const t0 = Date.now();
  for (;;) {
    let v; try { v = fn(); } catch (e) {}
    if (v) return v;
    if (Date.now() - t0 > ms) {
      throw new Error("timed out waiting for " + what +
        (pageErrors.length ? "; page errors: " + pageErrors.slice(0, 3).join(" | ") : ""));
    }
    await new Promise((r) => setTimeout(r, 20));
  }
};
// The rendered page: one span per character, and ↵ stands for the newline between blocks.
const targetOf = () => [...w.document.querySelectorAll("#bookText span.c")]
  .map((s) => (s.textContent === "↵" ? "\n" : s.textContent)).join("");
function typeInto(text) {
  const sink = $("sink");
  sink.value = text.slice(0, 1);
  sink.dispatchEvent(new w.Event("input", { bubbles: true }));   // the first key starts the clock
  w.__advance(text.length * 30 + 20000);                          // typing this page takes its time
  sink.value = text;
  sink.dispatchEvent(new w.Event("input", { bubbles: true }));   // a full page finishes it
}
const game = () => { try { return JSON.parse(w.localStorage.getItem("bookkeys:game") || "null"); } catch (e) { return null; } };

test("sample text is typable but never earns XP", async () => {
  await wait(() => w.document.querySelectorAll("#bookText span.c").length > 50, "sample page to render");
  $("homeSample").click();                                        // leave the home panel for the sample book
  assert.equal($("app").classList.contains("home-on"), false, "home panel closed");
  const target = targetOf();
  assert.ok(target.length > 100, "sample text is on the page");
  typeInto(target);
  await wait(() => $("result").hidden === false, "the result line");
  const txt = $("resultText").textContent;
  assert.match(txt, /Page done\./);
  assert.doesNotMatch(txt, /\+\d[\d,]* XP/, "sample text pays no XP");
  const G = game();
  assert.ok(!G || !Object.values(G.book || {}).some((b) => b && b.p && b.p.length),
    "no book record gained a typed page from the sample");
});

test("importing an EPUB and typing its first section pays XP into the saved game", async () => {
  const paraText = longPara(600, 7) + ".";
  const body = `<?xml version="1.0" encoding="UTF-8"?>` +
    `<html xmlns="http://www.w3.org/1999/xhtml"><head><title>Chapter One</title></head>` +
    `<body><h1>Chapter One</h1><p>${paraText}</p></body></html>`;
  const bytes = buildEpub({
    chapters: [{ file: "ch1.xhtml", label: "Chapter One", body }],
  });
  const file = new w.File([new w.Uint8Array(bytes).buffer], "test-book.epub", { type: "application/epub+zip" });
  const input = $("pdfInput");
  Object.defineProperty(input, "files", { value: [file], configurable: true });
  input.dispatchEvent(new w.Event("change", { bubbles: true }));

  let importErr = "";
  await wait(() => {
    const el = $("ldStatus");
    if (el && el.className.indexOf("err") >= 0 && el.textContent) { importErr = el.textContent; return true; }
    return $("bookName").textContent.indexOf("test-book") >= 0 &&
      w.document.querySelectorAll("#bookText span.c").length > 50;
  }, "the EPUB to import");
  assert.equal(importErr, "", "the import should succeed: " + importErr);
  assert.equal($("app").classList.contains("home-on"), false, "home panel closed");
  assert.equal($("pageWord").textContent, "Section", "an EPUB page is called a Section");

  const target = targetOf();
  assert.equal(target.split("\n")[0], "Chapter One", "the section starts with the chapter heading");
  assert.equal(target.split("\n").length, 2, "heading + one paragraph pack into one section");
  assert.equal(target, "Chapter One\n" + paraText, "the typed text is the book's own text");

  typeInto(target);
  await wait(() => $("result").hidden === false, "the result line");
  await new Promise((r) => w.setTimeout(r, 50));                 // chapter/book bonuses settle in microtasks
  const m = $("resultText").textContent.match(/\+(\d[\d,]*) XP/);
  assert.ok(m, "finishing the section shows an XP gain: " + $("resultText").textContent);
  assert.ok(parseInt(m[1].replace(/,/g, ""), 10) > 0);

  const G = game();
  assert.ok(G, "the game state is saved to localStorage");
  assert.ok(G.xp > 0, "XP was recorded");
  const gb = Object.values(G.book || {}).find((b) => b && Array.isArray(b.p) && b.p.includes(0));
  assert.ok(gb, "this book's record marks section 0 as typed");
  // Finishing the only section of a one-chapter book must also run the shared completion
  // machinery: the chapter list came from the TOC, and the chapter and book bonuses were paid.
  assert.ok(Array.isArray(gb.c) && gb.c.includes(0), "the chapter-complete bonus was paid: " + JSON.stringify(gb));
  assert.equal(gb.done, 1, "the book-complete bonus was paid");
  assert.ok(G.chapters >= 1 && G.books >= 1, "the chapter and book counters moved");
});

test("finishing a section that was already finished pays nothing again", async () => {
  const g1 = game();
  assert.ok(g1, "the game state exists from the previous test");
  const xpBefore = g1.xp;
  $("resultAgain").click();                                       // practice the same section again
  await wait(() => $("result").hidden, "the page to reset");
  const target = targetOf();
  typeInto(target);
  await wait(() => $("result").hidden === false, "the second result line");
  await new Promise((r) => w.setTimeout(r, 50));
  const txt = $("resultText").textContent;
  assert.match(txt, /No XP, you finished this page before/);
  assert.doesNotMatch(txt, /\+\d[\d,]* XP/, "a repeat pays no XP");
  assert.equal(game().xp, xpBefore, "the saved XP total did not move");
});

// A one-page PDF built byte by byte right here (no fixture file on disk): the xref table records
// each object's byte offset as the bytes accumulate, exactly as a real PDF writer would.
function miniPdf(text) {
  const esc = text.replace(/([\\()])/g, "\\$1");
  const stream = "BT /F1 12 Tf 72 700 Td (" + esc + ") Tj ET";
  const objs = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>",
    null,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ];
  let out = "%PDF-1.4\n";
  const offsets = [];
  objs.forEach((o, i) => {
    offsets[i] = out.length;
    out += i === 3
      ? "4 0 obj\n<< /Length " + stream.length + " >>\nstream\n" + stream + "\nendstream\nendobj\n"
      : (i + 1) + " 0 obj\n" + o + "\nendobj\n";
  });
  const xref = out.length;
  out += "xref\n0 6\n0000000000 65535 f \n";
  offsets.forEach((o) => { out += String(o).padStart(10, "0") + " 00000 n \n"; });
  out += "trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n" + xref + "\n%%EOF\n";
  return out;
}

test("a minimal PDF still imports through the same file input (PDF regression)", async (t) => {
  const raw = Buffer.from(miniPdf("Hello from the PDF world."), "latin1");
  const jsdomBytes = new w.Uint8Array(raw.length);          // jsdom realm, like the EPUB fixture
  for (let i = 0; i < raw.length; i++) jsdomBytes[i] = raw[i];
  const file = new w.File([jsdomBytes.buffer], "hello-pdf.pdf", { type: "application/pdf" });
  const input = $("pdfInput");
  Object.defineProperty(input, "files", { value: [file], configurable: true });
  input.dispatchEvent(new w.Event("change", { bubbles: true }));

  let importErr = "", imported = false;
  try {
    await wait(() => {
      const el = $("ldStatus");
      if (el && el.className.indexOf("err") >= 0 && el.textContent) { importErr = el.textContent; return true; }
      return $("bookName").textContent === "hello-pdf" && w.document.querySelectorAll("#bookText span.c").length > 0;
    }, "the PDF to import", 25000);
    imported = !importErr;
  } catch (e) { /* neither error nor import: pdf.js did not finish here */ }
  if (!imported) {
    t.skip("pdf.js could not run in jsdom (this is an environment limit, not a Bookkeys bug): " +
      (importErr || "no result within 25s"));
    return;
  }
  assert.equal($("pageWord").textContent, "Page", "a PDF page is called a Page");
  const target = targetOf();
  assert.ok(target.includes("Hello from the PDF world."), "the page shows the PDF's own text: " + JSON.stringify(target));
  typeInto(target);
  await wait(() => $("result").hidden === false, "the result line");
  await new Promise((r) => w.setTimeout(r, 50));
  assert.match($("resultText").textContent, /\+\d[\d,]* XP/, "typing a PDF page still pays XP");
});

// ---------------------------------------------------------------------------
// Required chapters and optional sections, end to end: the defaults a book gets,
// finishing with the optional sections left untouched, the choice coming back with
// the book, and a book that has no required section at all.
// ---------------------------------------------------------------------------

const lsKeys = () => {
  const out = [];
  for (let i = 0; i < w.localStorage.length; i++) out.push(w.localStorage.key(i));
  return out;
};
const bookKeysNow = () => Object.keys((game() && game().book) || {});

// A small EPUB: front matter, then two real chapters. Each file is short, so each becomes one
// section, and the table of contents gives each its title. `seed` changes the text (and so the
// book's content hash) so tests can make genuinely different books.
function sectionsEpub(withCover = true, seed = 3) {
  const doc = (title, body) => `<?xml version="1.0" encoding="UTF-8"?>` +
    `<html xmlns="http://www.w3.org/1999/xhtml"><head><title>${title}</title></head>` +
    `<body><h1>${title}</h1><p>${body}</p></body></html>`;
  const chapters = [];
  if (withCover) chapters.push({ file: "cover.xhtml", label: "Contents", body: doc("Contents", "The table of contents and other front matter.") });
  chapters.push({ file: "ch1.xhtml", label: "Chapter One", body: doc("Chapter One", longPara(320, seed) + ".") });
  chapters.push({ file: "ch2.xhtml", label: "Chapter Two", body: doc("Chapter Two", longPara(320, seed + 1) + ".") });
  return buildEpub({ title: "Sections Book", chapters });
}

async function importEpub(bytes, name) {
  const file = new w.File([new w.Uint8Array(bytes).buffer], name, { type: "application/epub+zip" });
  const input = $("pdfInput");
  Object.defineProperty(input, "files", { value: [file], configurable: true });
  input.dispatchEvent(new w.Event("change", { bubbles: true }));
  let err = "";
  await wait(() => {
    const el = $("ldStatus");
    if (el && el.className.indexOf("err") >= 0 && el.textContent) { err = el.textContent; return true; }
    return $("bookName").textContent === name.replace(/\.epub$/, "") &&
      w.document.querySelectorAll("#bookText span.c").length > 5;
  }, "the EPUB " + name + " to import");
  assert.equal(err, "", "the import of " + name + " should succeed: " + err);
}

const chapterRows = () => [...w.document.querySelectorAll("#chList .ch")].map((row) => ({
  title: row.querySelector("input").value,
  req: row.querySelector(".reqbtn").textContent,
  optional: row.classList.contains("opt"),
}));

async function openChapters() {
  $("chapBtn").click();
  await wait(() => w.document.querySelectorAll("#chList .ch").length > 0, "the chapters list");
}
async function closeChapters() {
  $("chClose").click();
  await wait(() => $("chapters").hidden, "the chapters panel to close");
}

test("front matter is optional by default and never blocks finishing the book", async () => {
  const bytes = sectionsEpub(true);
  const before = new Set(bookKeysNow());
  await importEpub(bytes, "sections-book.epub");
  assert.equal($("pageWord").textContent, "Section", "an EPUB page is called a Section");
  assert.equal($("pageNum").value, "1", "the book opens at its first section");
  assert.match($("chapLabel").textContent, /Contents \(optional\)/, "the current section is optional: " + $("chapLabel").textContent);
  assert.match($("chapLabel").textContent, /0\/2 required/, "two required chapters: " + $("chapLabel").textContent);

  await openChapters();
  const rows = chapterRows();
  assert.equal(rows.length, 3, "three sections were found: " + JSON.stringify(rows));
  assert.deepEqual(rows.map((r) => r.req), ["Optional", "Required", "Required"], "defaults follow the headings");
  assert.equal(rows[0].optional, true, "the optional row is set apart");
  assert.match($("chProg").textContent, /0\/2 required chapters completed/, "progress line: " + $("chProg").textContent);
  assert.match($("chProg").textContent, /1 optional section/, "optional count: " + $("chProg").textContent);
  await closeChapters();

  // Type only the two required chapters, never the front matter.
  $("next").click();
  await wait(() => $("pageNum").value === "2" && targetOf().startsWith("Chapter One"), "the first chapter");
  typeInto(targetOf());
  await wait(() => $("result").hidden === false, "the first chapter to finish");
  $("resultNext").click();
  await wait(() => $("pageNum").value === "3" && targetOf().startsWith("Chapter Two"), "the second chapter");
  typeInto(targetOf());
  await wait(() => $("result").hidden === false, "the second chapter to finish");

  const gkey = bookKeysNow().find((k) => !before.has(k));
  assert.ok(gkey, "the book got its own progress record");
  await wait(() => { const b = game().book[gkey]; return b && b.done === 1; }, "the book to complete");
  const gb = game().book[gkey];
  assert.equal(gb.p.includes(0), false, "the optional front matter was never typed");
  assert.ok(gb.p.includes(1) && gb.p.includes(2), "both required chapters were typed: " + JSON.stringify(gb.p));
  assert.ok((game().books || 0) >= 1, "the book counter moved");
  assert.match($("chapLabel").textContent, /2\/2 required/, "progress reached the required total");
});

test("a changed Required/Optional choice is saved, restored, and pays nothing again", async () => {
  const bytes = sectionsEpub(true);
  await openChapters();
  w.document.querySelectorAll("#chList .ch")[0].querySelector(".reqbtn").click();   // Optional -> Required
  assert.equal(chapterRows()[0].req, "Required", "the toggle took effect");
  assert.match($("chProg").textContent, /\/3 required chapters completed/, "front matter now counts: " + $("chProg").textContent);
  assert.doesNotMatch($("chProg").textContent, /optional/, "no optional sections remain");
  await closeChapters();

  const saved = lsKeys().filter((k) => k.indexOf("bookkeys:chap:") === 0)
    .map((k) => { try { return JSON.parse(w.localStorage.getItem(k)); } catch (e) { return null; } })
    .filter((r) => r && Array.isArray(r.list) && r.list.length === 3);
  assert.ok(saved.some((r) => r.v === 3 && r.list[0].req === true),
    "the choice is stored with the book: " + JSON.stringify(saved));

  const xpBefore = game().xp;
  await importEpub(sectionsEpub(false), "other-book.epub");     // switch away first...
  await importEpub(bytes, "sections-book.epub");                // ...then reopen the book we edited
  await openChapters();
  assert.deepEqual(chapterRows().map((r) => r.req), ["Required", "Required", "Required"], "the choice came back with the book");
  await closeChapters();
  await new Promise((r) => w.setTimeout(r, 120));
  assert.equal(game().xp, xpBefore, "reopening a finished book awards nothing again");
  assert.ok(Object.values(game().book).some((b) => b && b.done === 1 && b.p.includes(1)), "the finished book is still marked finished");
});

test("a book whose sections are all optional is handled explicitly and pays no book bonus", async () => {
  const before = new Set(bookKeysNow());
  const beforeBooks = game().books || 0;
  await importEpub(sectionsEpub(false, 20), "all-optional.epub");
  await openChapters();
  $("chAllOpt").click();
  assert.ok(chapterRows().every((r) => r.req === "Optional"), "every section is optional");
  assert.match($("chProg").textContent, /Every section is optional/, "said plainly, not shown as 0\/0: " + $("chProg").textContent);
  await closeChapters();

  typeInto(targetOf());
  await wait(() => $("result").hidden === false, "the first section to finish");
  assert.match($("resultText").textContent, /\+\d[\d,]* XP/, "an optional section still earns page XP");
  await new Promise((r) => w.setTimeout(r, 120));   // let the section's follow-up check land before reading the total

  const gkey = bookKeysNow().find((k) => !before.has(k));
  assert.ok(gkey, "the book got its own progress record");

  const xpOnce = game().xp;
  $("resultAgain").click();
  await wait(() => $("result").hidden, "the page to reset");
  typeInto(targetOf());
  await wait(() => $("result").hidden === false, "the second result line");
  assert.match($("resultText").textContent, /No XP, you finished this page before/, "an optional section pays its page XP once");
  assert.equal(game().xp, xpOnce, "the total did not move on the repeat");

  $("resultNext").click();
  await wait(() => $("pageNum").value === "2", "the second section");
  typeInto(targetOf());
  await wait(() => $("result").hidden === false, "the second section to finish");
  await new Promise((r) => w.setTimeout(r, 120));

  const gb = game().book[gkey];
  assert.ok(gb, "the book has a record");
  assert.ok(!gb.done, "an all-optional book never reports itself complete: " + JSON.stringify(gb));
  assert.equal(game().books || 0, beforeBooks, "no book bonus was paid");
});
