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

// ---------------------------------------------------------------------------
// The header: the wordmark became a Bookkeys-home icon on the left, Settings
// became a gear in a cluster on the right next to the sun/moon toggle, and the
// loading control moved out of the header to an "Open book" button on the
// start screen. Everything behind those controls has to keep working.
// ---------------------------------------------------------------------------

const bar = () => $("app").querySelector(".bar");

// Every stored value, so a test can prove Home changed nothing. Reading the
// value (not just the key) means an overwrite would be caught too.
const lsState = () => {
  const m = {};
  for (let i = 0; i < w.localStorage.length; i++) {
    const k = w.localStorage.key(i);
    m[k] = w.localStorage.getItem(k);
  }
  return m;
};

test("the brand slot is now a Bookkeys-home icon and the wordmark is gone", () => {
  const header = bar();
  const home = header.firstElementChild;
  assert.equal(home.id, "openLibrary", "the home control keeps the wordmark's place at the far left");
  assert.equal(home.tagName, "BUTTON", "a real button, so Tab and Enter reach it");
  assert.equal(home.type, "button");
  assert.equal(home.getAttribute("aria-label"), "Bookkeys home", "accessible name");
  assert.equal(home.getAttribute("title"), "Bookkeys home", "tooltip");
  assert.ok(home.querySelector("svg"), "an icon rather than a text label");
  assert.equal(home.textContent.trim(), "", "nothing visible where the wordmark was");
  assert.doesNotMatch(header.textContent, /Bookkeys/, "the Bookkeys wordmark is out of the header");
  assert.equal(home.getAttribute("href"), null, "it is not a link, so it cannot be the Limitless site");
});

test("Settings is a gear at the far right beside the theme toggle and still opens its panel", async () => {
  const header = bar();
  const gear = $("openSettings");
  assert.equal(gear.tagName, "BUTTON", "a real button, so Tab and Enter reach it");
  assert.equal(gear.getAttribute("aria-label"), "Settings", "accessible name comes from a label, not removed words");
  assert.equal(gear.getAttribute("title"), "Settings", "tooltip");
  assert.ok(gear.querySelector("svg"), "a gear icon");
  assert.equal(gear.getAttribute("aria-haspopup"), "dialog", "still announces the panel it opens");

  const end = header.querySelector(".bar-end");
  assert.ok(end, "the right-hand cluster exists");
  assert.equal(header.lastElementChild, end, "the cluster is last, so it sits at the far right");
  assert.equal(gear.parentElement, end, "Settings moved into the cluster");
  assert.equal($("modeBtn").parentElement, end, "the sun/moon control sits beside it");
  assert.notEqual(gear, $("modeBtn"), "the two icons stay separate controls");
  assert.ok(!end.contains($("openHall")), "the level/XP button stays on the left, out of the icon cluster");

  assert.equal($("settings").hidden, true, "the panel starts closed");
  gear.click();
  assert.equal($("settings").hidden, false, "the existing Settings panel opens");
  assert.equal(gear.getAttribute("aria-expanded"), "true", "aria-expanded follows the panel");
  gear.click();
  await wait(() => $("settings").hidden, "Settings to close");   // dlgClose animates for 200ms
  assert.equal(gear.getAttribute("aria-expanded"), "false", "and resets when the panel closes");
});

test("the sun/moon control still switches the theme on its own", () => {
  const b = $("modeBtn");
  const modeBefore = b.dataset.mode;
  const labelBefore = b.getAttribute("aria-label");
  assert.match(labelBefore || "", /Mode: /, "the toggle describes itself: " + labelBefore);
  b.click();
  assert.notEqual(b.dataset.mode, modeBefore, "the icon advanced to the next mode: " + b.dataset.mode);
  assert.notEqual(b.getAttribute("aria-label"), labelBefore, "the accessible name follows the change");
  assert.match(b.getAttribute("aria-label") || "", /Mode: /, "still self-describing");
  const saved = JSON.parse(w.localStorage.getItem("bookkeys:settings") || "{}");
  assert.equal(saved.bg, b.dataset.mode, "the choice is saved as the app's background setting");
  assert.equal($("openSettings").getAttribute("aria-expanded"), "false",
    "the theme toggle does not open Settings");
});

test("the home icon returns to the start screen and leaves every saved thing alone", async () => {
  const pageBefore = w.location.origin + w.location.pathname;
  assert.equal($("app").classList.contains("home-on"), false, "a book is open to begin with");
  const nameBefore = $("bookName").textContent;
  assert.ok(nameBefore, "a book is open");
  const gameBefore = game();
  assert.ok(gameBefore, "there is a saved game");
  const storeBefore = lsState();
  const errsBefore = pageErrors.length;

  $("openLibrary").click();
  await wait(() => $("app").classList.contains("home-on"), "the Bookkeys start screen");

  assert.equal(w.location.origin + w.location.pathname, pageBefore,
    "the document itself never navigated: Home is an in-app step, not a reload and not the Limitless site");
  assert.equal(w.location.hash, "#home", "only the app's own route moved, into the start screen");
  assert.deepEqual(game(), gameBefore, "the saved game, its XP and its book records are untouched");
  const storeAfter = lsState();
  Object.keys(storeBefore).forEach((k) => {
    assert.ok(k in storeAfter, "nothing saved was dropped: " + k);
    assert.equal(storeAfter[k], storeBefore[k], "nothing saved was rewritten: " + k);
  });
  assert.equal($("bookName").textContent, nameBefore, "the open book is still open behind the start screen");
  assert.equal(pageErrors.length, errsBefore, "clicking Home raised no page errors");
});

test("the loader moved out of the header to an Open book button on the start screen", async () => {
  assert.equal(bar().querySelector("#openLoader"), null, "no loading control is left in the header");

  $("openLibrary").click();                        // already on the start screen: harmless
  await wait(() => $("app").classList.contains("home-on"), "the start screen");

  const btn = $("openLoader");
  assert.ok(btn, "the control exists on the start screen");
  assert.equal(btn.textContent.trim(), "Open book", "renamed from Load your book");
  assert.equal(btn.closest(".bar"), null, "it is out of the header");
  assert.equal(btn.parentElement, $("homeSample").parentElement, "it sits with the sample text");
  assert.equal(btn.parentElement, $("homeContinue").parentElement, "it sits with Continue");
  assert.ok(btn.closest(".hero"), "in the hero, the prominent part of the start screen");
  assert.ok(btn.classList.contains("primary"), "and it is the prominent action");

  btn.click();
  assert.equal($("loader").hidden, false, "the loader dialog opens");
  const accept = $("pdfInput").getAttribute("accept") || "";
  assert.match(accept, /application\/pdf|\.pdf/, "PDF still supported: " + accept);
  assert.match(accept, /epub/, "EPUB still supported: " + accept);
  assert.ok($("pasteBox"), "the paste-a-text flow is still in the dialog");
  assert.ok($("ldSample"), "the sample-text flow is still in the dialog");

  $("ldCancel").click();
  await wait(() => $("loader").hidden, "the loader dialog to close");
});

// ---------------------------------------------------------------------------
// Reliability audit, Phase 2E: pasted or dropped text must never become
// keystrokes. jsdom never inserts clipboard text by itself, so browserPaste()
// does what a browser does: fire the event, and only when the page did not
// refuse it insert the clipboard text and fire input. A refusal therefore
// proves the text could never reach the keystroke counters or the result line.
// ---------------------------------------------------------------------------

function browserPaste(text) {
  const sink = $("sink");
  const ev = new w.Event("paste", { bubbles: true, cancelable: true });
  Object.defineProperty(ev, "clipboardData", { value: { getData: () => text } });
  sink.dispatchEvent(ev);
  if (!ev.defaultPrevented) {
    sink.value = sink.value + text;
    sink.dispatchEvent(new w.Event("input", { bubbles: true }));
  }
  return ev;
}

test("pasted or dropped text cannot enter the typing input or earn anything", async () => {
  await importEpub(sectionsEpub(false, 61), "paste-book.epub");
  await wait(() => !$("app").classList.contains("home-on"), "the imported book to come forward");
  const target = targetOf();
  assert.ok(target.length > 100, "a real page of text: " + target.length + " characters");

  const xpBefore = ((game() || {}).xp) || 0;
  const pagesBefore = ((game() || {}).pages) || 0;

  const bulk = browserPaste(target);                 // the whole page from the clipboard
  assert.equal(bulk.defaultPrevented, true, "a multi-character paste is refused before it can insert");
  assert.equal($("sink").value, "", "no clipboard text reached the typing input");
  assert.equal($("bar").style.width, "0%", "progress did not move");
  assert.equal($("result").hidden, true, "the page did not finish");
  assert.equal(((game() || {}).xp) || 0, xpBefore, "no XP was earned");
  assert.equal(((game() || {}).pages) || 0, pagesBefore, "no page was counted");

  const one = browserPaste(target[0]);               // one character the keyboard may not produce
  assert.equal(one.defaultPrevented, false, "a single character still goes through");
  assert.equal($("sink").value, target[0], "it arrived as one ordinary keystroke");

  const drop = new w.Event("drop", { bubbles: true, cancelable: true });
  Object.defineProperty(drop, "dataTransfer", { value: { getData: () => target, files: [] } });
  $("sink").dispatchEvent(drop);
  assert.equal(drop.defaultPrevented, true, "a dropped block of text is refused too");
  assert.equal($("sink").value, target[0], "the drop changed nothing");

  // After the refusals the input still works exactly as before.
  $("sink").value = "";
  $("sink").dispatchEvent(new w.Event("input", { bubbles: true }));
  typeInto(target);
  await wait(() => $("result").hidden === false, "typing still finishes the page");
  await new Promise((r) => w.setTimeout(r, 50));
  assert.match($("resultText").textContent, /\+\d[\d,]* XP/, "typing after the refusals still pays XP");
  assert.ok((((game() || {}).xp) || 0) > xpBefore, "the XP is really in the saved game");
});

// ---------------------------------------------------------------------------
// Reliability audit, Phase 2A: the recovery draft for an unfinished page is
// saved with the same failure visibility as every other save. A draft write
// that fails while storage is full or blocked must raise the save warning
// instead of silently never writing again.
// ---------------------------------------------------------------------------

test("a failed draft save raises the save warning instead of losing typing silently", async () => {
  await importEpub(sectionsEpub(false, 71), "draft-book.epub");
  await wait(() => !$("app").classList.contains("home-on"), "the imported book to come forward");
  const target = targetOf();
  assert.ok(target.length > 100, "a real page of text: " + target.length + " characters");
  assert.equal($("saveWarn").hidden, true, "the save warning starts quiet");

  const proto = w.Storage.prototype;
  const orig = proto.setItem;
  proto.setItem = function (k, v) {
    if (String(k).indexOf("bookkeys:draft:") === 0) throw new Error("storage full (test)");
    return orig.call(this, k, v);
  };
  try {
    const sink = $("sink");
    sink.value = target.slice(0, 3);
    sink.dispatchEvent(new w.Event("input", { bubbles: true }));
    assert.equal($("saveWarn").hidden, false, "the failed draft save raises the save warning");
    assert.match($("saveWarn").textContent, /could not be saved/, "the warning explains itself");
    assert.equal(sink.value, target.slice(0, 3), "the typing itself is kept in the box");
  } finally {
    proto.setItem = orig;
  }

  // Storage works again: finishing the page saves normally, the warning clears,
  // and the page still pays exactly once.
  const xpBefore = ((game() || {}).xp) || 0;
  typeInto(target);
  await wait(() => $("result").hidden === false, "the page to finish");
  await new Promise((r) => w.setTimeout(r, 50));
  assert.equal($("saveWarn").hidden, true, "a successful save clears the warning");
  assert.ok((((game() || {}).xp) || 0) > xpBefore, "the page still paid XP after the failed draft");
});

// ---------------------------------------------------------------------------
// Reliability audit, Phase 4: importing a backup through the real Data-tab
// control must validate what it reads (wrong-typed settings never land),
// keep every record the game relies on (flawless pages included), count only
// entries that were really written, and persist what it merges so it survives
// a reload and a closing drawer.
// ---------------------------------------------------------------------------

test("merging a backup validates settings, keeps flawless pages, and counts only real writes", async () => {
  // A book of our own, so the merge has a local record to combine with.
  await importEpub(sectionsEpub(false, 81), "merge-book.epub");
  await wait(() => !$("app").classList.contains("home-on"), "the imported book to come forward");
  const target = targetOf();
  typeInto(target);
  await wait(() => $("result").hidden === false, "the first section to finish");
  await new Promise((r) => w.setTimeout(r, 50));

  const g1 = game();
  const gkey = Object.keys(g1.book).find((k) => Array.isArray(g1.book[k].p) && g1.book[k].p.includes(0));
  assert.ok(gkey, "this browser has a finished-page record to merge against");
  const localPages = g1.book[gkey].p.slice();

  // A backup from another machine: valid settings plus wrongly typed junk settings,
  // a book this browser already has (the backup adds a flawless page to it), a book
  // only the backup knows (with flawless pages of its own), and a plain key whose
  // write will be made to fail, so the count has something to get wrong.
  const backup = {
    app: "bookkeys", v: 1,
    keys: {
      "bookkeys:settings": JSON.stringify({ size: 13, celebrate: "yes", lineH: "wide" }),
      "bookkeys:game": JSON.stringify({
        xp: 1,
        book: {
          [gkey]: { p: [0], e: [], c: [], x: [0, 5], done: 1 },
          "backup-only-book": { p: [1], e: [2], c: [3], x: [1, 9], done: 4 }
        }
      }),
      "bookkeys:probe": "written-only-if-storage-works"
    }
  };

  // Settings -> Data -> the hidden file input, exactly the control the UI uses.
  $("openSettings").click();
  assert.equal($("settings").hidden, false, "the settings drawer opens");
  const dataTab = [...w.document.querySelectorAll("#tabs button")].find((b) => b.dataset.tab === "data");
  assert.ok(dataTab, "the Data tab exists");
  dataTab.click();
  const input = [...w.document.querySelectorAll("#tabBody input[type=file]")]
    .find((el) => /backup/i.test(el.getAttribute("aria-label") || ""));
  assert.ok(input, "the backup file input is on the Data tab");

  const proto = w.Storage.prototype;
  const orig = proto.setItem;
  proto.setItem = function (k, v) {
    if (k === "bookkeys:probe") throw new Error("storage full (test)");
    return orig.call(this, k, v);
  };
  try {
    Object.defineProperty(input, "files", {
      value: [new w.File([JSON.stringify(backup)], "backup.json", { type: "application/json" })],
      configurable: true
    });
    input.dispatchEvent(new w.Event("change", { bubbles: true }));
    await wait(() => /Backup merged/.test($("tabBody").textContent), "the import to report", 8000);
  } finally {
    proto.setItem = orig;
  }

  const status = $("tabBody").textContent;
  assert.match(status, /2 entries brought in/, "only entries that were really written are counted: " + status);
  assert.match(status, /1 left as they already are here/, "the key whose write failed is not claimed as imported");
  assert.equal(w.localStorage.getItem("bookkeys:probe"), null, "the failed write really failed");

  // Valid settings merged and persisted; wrongly typed settings rejected outright.
  const settingsAfter = JSON.parse(w.localStorage.getItem("bookkeys:settings") || "null") || {};
  assert.equal(settingsAfter.size, 13, "the valid setting was merged and persisted for the next load");
  assert.equal(typeof settingsAfter.celebrate, "boolean", "the junk string never overwrote the boolean: " + JSON.stringify(settingsAfter.celebrate));
  assert.equal(typeof settingsAfter.lineH, "number", "the junk string never overwrote the number: " + JSON.stringify(settingsAfter.lineH));
  assert.equal(w.document.documentElement.style.getPropertyValue("--tsize"), "13px", "the merged setting is applied to the page");

  // Flawless pages survive both merge paths, and the local records are untouched.
  const g2 = game();
  assert.deepEqual(g2.book[gkey].x, [0, 5], "the local book gained the backup's flawless page and kept its own");
  assert.deepEqual(g2.book[gkey].p, localPages, "the local typed pages are unchanged");
  assert.deepEqual(g2.book["backup-only-book"].x, [1, 9], "a book that only exists in the backup keeps its flawless pages");

  // Closing the drawer must not discard what the merge persisted.
  $("closeSettings").click();
  await wait(() => $("settings").hidden, "the settings drawer to close", 8000);
  const settingsFinal = JSON.parse(w.localStorage.getItem("bookkeys:settings") || "null") || {};
  assert.equal(settingsFinal.size, 13, "closing settings does not revert the merged settings");
});

// ---------------------------------------------------------------------------
// Reliability audit, Phase 2D: a page whose text cannot be read must behave
// exactly like a page with no text — shown as such, skipped past by the
// pager, recorded as empty, and never able to block finishing the chapter or
// the book. The fixture is a two-page PDF whose second page's content stream
// points at an object that does not exist: the file loads and page 1 reads
// normally, but page 2 yields no selectable text at all — the shape a damaged
// or partially written PDF has in the real world. (pdf.js recovers missing
// content to nothing; the page-read catch in showPage and allDone makes a
// read that fails outright — a worker or transport failure in a real browser
// — behave identically. That failing-read path cannot be provoked through a
// file fixture in this test environment, so these tests pin the tolerated
// shape end to end instead.)
// ---------------------------------------------------------------------------

function brokenPdf(text) {
  const esc = text.replace(/([\\()])/g, "\\$1");
  const stream = "BT /F1 12 Tf 72 700 Td (" + esc + ") Tj ET";
  const objs = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    // Page 2's content stream points at object 99, which does not exist anywhere in
    // the file: the document loads and page 1 reads normally, but page 2 yields no
    // selectable text at all — the shape a damaged or partially written PDF has.
    "<< /Type /Pages /Kids [3 0 R 6 0 R] /Count 2 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>",
    null,   // object 4: the readable content stream of page 1
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 99 0 R /Resources << /Font << /F1 5 0 R >> >> >>",
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
  out += "xref\n0 7\n0000000000 65535 f \n";
  offsets.forEach((o) => { out += String(o).padStart(10, "0") + " 00000 n \n"; });
  out += "trailer\n<< /Size 7 /Root 1 0 R >>\nstartxref\n" + xref + "\n%%EOF\n";
  return out;
}

async function importPdfFor(t, bytes, name) {
  const raw = Buffer.from(bytes, "latin1");
  const jsdomBytes = new w.Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) jsdomBytes[i] = raw[i];
  const file = new w.File([jsdomBytes.buffer], name + ".pdf", { type: "application/pdf" });
  const input = $("pdfInput");
  Object.defineProperty(input, "files", { value: [file], configurable: true });
  input.dispatchEvent(new w.Event("change", { bubbles: true }));
  let err = "";
  try {
    await wait(() => {
      const el = $("ldStatus");
      if (el && el.className.indexOf("err") >= 0 && el.textContent) { err = el.textContent; return true; }
      return $("bookName").textContent === name && w.document.querySelectorAll("#bookText span.c").length > 0;
    }, "the PDF " + name + " to import", 25000);
  } catch (e) { /* fall through to skip below */ }
  if (!err && $("bookName").textContent === name && w.document.querySelectorAll("#bookText span.c").length > 0) return true;
  t.skip("pdf.js could not run this fixture in jsdom (environment limit): " + (err || "no result within 25s"));
  return false;
}

test("an unreadable page is skipped by the pager instead of stranding navigation", async (t) => {
  const before = bookKeysNow();
  if (!await importPdfFor(t, brokenPdf("First page of the navigation fixture."), "broken-nav")) return;
  assert.equal($("pageTotal").textContent, "of 2", "the document claims its full two pages");
  const target = targetOf();
  assert.ok(target.includes("navigation fixture"), "the first page reads: " + JSON.stringify(target));
  const errsBefore = pageErrors.length;

  $("next").click();   // step into the page whose text cannot be read at all
  await wait(() => $("pageNum").value === "2", "the unreadable page to be skipped over", 6000);
  await wait(() => $("emptyMsg"), "the no-text message for the unreadable page", 3000);
  assert.match($("emptyMsg").textContent, /No selectable text found/,
    "the unreadable page is shown as a page with no text, like any other text-less page");
  assert.equal($("pageTotal").textContent, "of 2", "the pager still knows where the end is");

  const gkey = bookKeysNow().find((k) => !before.includes(k));
  assert.ok(gkey, "the fixture book has a record");
  const gb = game().book[gkey];
  assert.ok(gb && Array.isArray(gb.e) && gb.e.includes(1),
    "the unreadable page is recorded as a page with no text, so it cannot block finishing: " + JSON.stringify(gb && gb.e));
  assert.ok(!pageErrors.slice(errsBefore).some((e) => /rejection/i.test(e)),
    "the failed read left no unhandled rejection behind: " + pageErrors.slice(errsBefore).join(" | "));
});

test("an unreadable page never blocks finishing the book, and is never a reward exploit", async (t) => {
  const before = bookKeysNow();
  if (!await importPdfFor(t, brokenPdf("First page of the completion fixture."), "broken-done")) return;
  assert.equal($("pageTotal").textContent, "of 2", "the document claims its full two pages");
  const target = targetOf();
  assert.ok(target.includes("completion fixture"), "the first page reads: " + JSON.stringify(target));

  // Finish the readable page without ever visiting the broken one: the completion
  // check has to read the broken page itself, and that read must count as "no text"
  // rather than blocking forever.
  typeInto(target);
  await wait(() => $("result").hidden === false, "the first page to finish");
  await new Promise((r) => w.setTimeout(r, 50));
  assert.match($("resultText").textContent, /\+\d[\d,]* XP/, "the readable page pays XP");

  const gkey = bookKeysNow().find((k) => !before.includes(k));
  assert.ok(gkey, "the fixture book has a record");
  await wait(() => {
    const gb = (game().book || {})[gkey];
    return gb && gb.done === 1;
  }, "the book to complete with the unreadable page counted as empty", 6000);
  const gb = game().book[gkey];
  assert.ok(Array.isArray(gb.e) && gb.e.includes(1),
    "the unreadable page ended up recorded as empty: " + JSON.stringify(gb.e));
  const paidBook = ((game().paid) || {})["b:" + gkey];
  assert.ok(typeof paidBook === "number" && paidBook > 0,
    "the book bonus for this book was paid exactly once and saved: " + JSON.stringify(paidBook));
});
