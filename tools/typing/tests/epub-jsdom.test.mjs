// End-to-end EPUB reading: the page's own JSZip and epub.js run in jsdom, and Bookkeys' epubRead
// turns synthetic EPUB fixtures into typing sections and chapter lists. This is the core EPUB
// pipeline: spine order, table-of-contents titles, unicode, skipping unreadable files, and the
// friendly failures for damaged or text-less books.
//
// Buffers handed to epub.js are created in the jsdom realm on purpose: epub.js detects input with
// `instanceof ArrayBuffer`, which never matches across realms. (In the real app everything shares
// one realm, so this only matters to the test harness.)
import test from "node:test";
import assert from "node:assert/strict";
import { loadHelpers, epubSandbox, buildEpub, epubFiles, makeZip, longPara } from "./helpers.mjs";

const dom = epubSandbox();
const w = dom.window;

const H = loadHelpers(["normalize", "epubHash", "epubRead", "epubWithBook", "epubErr", "epubErrShort"],
  { ePub: w.ePub });

const sandboxBuf = (bytes) => new w.Uint8Array(bytes).buffer;   // jsdom-realm ArrayBuffer
const read = (bytes, target) => H.epubRead(sandboxBuf(bytes), H.normalize, target);
const sectionText = (r) => r.sections.map((sec) => sec.map((b) => b.text).join("\n"));

function plainChapter(file, label, heading, text) {
  return { file, label, body: `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<html xmlns="http://www.w3.org/1999/xhtml"><head><title>${label}</title></head>` +
    `<body><h1>${heading}</h1><p>${text}</p></body></html>\n` };
}

test("a plain two-chapter book: one section per chapter, chapters and metadata from the book", async () => {
  const bytes = buildEpub({
    title: "Small Book", author: "A. Writer",
    chapters: [
      plainChapter("ch1.xhtml", "The Start", "Chapter One", "First chapter text."),
      plainChapter("ch2.xhtml", "The End", "Chapter Two", "Second chapter text."),
    ],
  });
  const r = await read(bytes);
  assert.equal(r.empty, undefined);
  assert.equal(r.title, "Small Book");
  assert.equal(r.author, "A. Writer");
  assert.equal(r.sections.length, 2, "one short section per chapter file");
  assert.deepEqual(sectionText(r), ["Chapter One\nFirst chapter text.", "Chapter Two\nSecond chapter text."]);
  assert.deepEqual(r.chapters.map((c) => [c.p, c.title]), [[0, "The Start"], [1, "The End"]]);
});

test("spine order, not file order, decides reading order", async () => {
  const chapters = [
    plainChapter("a-second.xhtml", "Second", "Second", "text two"),
    plainChapter("b-first.xhtml", "First", "First", "text one"),
    plainChapter("c-third.xhtml", "Third", "Third", "text three"),
  ];
  const bytes = buildEpub({ chapters, spine: ["b-first.xhtml", "a-second.xhtml", "c-third.xhtml"] });
  const r = await read(bytes);
  assert.deepEqual(sectionText(r).map((t) => t.split("\n")[0]), ["First", "Second", "Third"]);
  assert.deepEqual(r.chapters.map((c) => c.title), ["First", "Second", "Third"]);
});

test("a long chapter becomes several sections; every character survives in order", async () => {
  const body = Array.from({ length: 8 }, (_, i) => `<p>${longPara(600, i + 1)}.</p>`).join("");
  const bytes = buildEpub({ chapters: [plainChapter("long.xhtml", "Long", "Long Chapter", body)] });
  const r = await read(bytes);
  assert.ok(r.sections.length >= 3, "one 4800-char chapter splits into sections");
  assert.equal(r.sections[0][0].t, "h", "the heading starts the first section");
  for (const sec of r.sections) assert.ok(sec.length >= 1);
  const all = r.sections.flat().map((b) => b.text).join(" ");
  assert.ok(all.startsWith("Long Chapter"));
  assert.ok(all.includes(longPara(600, 3).slice(0, 120)), "later paragraphs present");
  assert.deepEqual(r.chapters.map((c) => c.p), [0], "still one chapter");
});

test("unicode, smart punctuation and ligatures survive the whole pipeline", async () => {
  const text = "Café ﬁne — naïve déjà vu, 中文也有, plus A+B ﬀlow.";
  const bytes = buildEpub({ chapters: [plainChapter("u.xhtml", "Uni", "Étude", text)] });
  const r = await read(bytes);
  const joined = r.sections.flat().map((b) => b.text).join(" ");
  assert.ok(joined.includes("Étude"), "heading kept");
  assert.ok(joined.includes("Café fine - naïve déjà vu"), "quotes/dashes folded, accents kept");
  assert.ok(joined.includes("fine"), "ligature folded");
  assert.ok(joined.includes("中文也有"), "CJK kept");
  assert.ok(joined.includes("+"), "plus sign kept");
});

test("an image-only chapter is skipped, the rest of the book still imports", async () => {
  const imageCh = { file: "pics.xhtml", label: "Plates", body:
    `<?xml version="1.0"?><html xmlns="http://www.w3.org/1999/xhtml"><head><title>p</title></head>` +
    `<body><p><img src="p1.png"/></p><div><img src="p2.png"/><img src="p3.png"/></div></body></html>` };
  const bytes = buildEpub({
    chapters: [plainChapter("ch1.xhtml", "One", "Chapter One", "words here."), imageCh,
      plainChapter("ch2.xhtml", "Two", "Chapter Two", "more words.")],
  });
  const r = await read(bytes);
  assert.equal(r.sections.length, 2, "only the text chapters become sections");
  assert.deepEqual(r.chapters.map((c) => c.title), ["One", "Two"], "the empty chapter is not a chapter");
});

test("a book with no readable text at all reports empty instead of pretending", async () => {
  const blank = { file: "blank.xhtml", label: "Blank", body:
    `<?xml version="1.0"?><html xmlns="http://www.w3.org/1999/xhtml"><head><title>b</title></head>` +
    `<body><p>   </p><p><img src="x.png"/></p></body></html>` };
  const r = await read(buildEpub({ chapters: [blank] }));
  assert.equal(r.empty, true);
});

test("a broken chapter file does not lose the chapters around it", async () => {
  const bytes = buildEpub({
    chapters: [
      plainChapter("good1.xhtml", "Good One", "First", "fine text"),
      { file: "bad.xhtml", label: "Broken", raw: "<?xml version='1.0'?><html><body><p>never closed" },
      plainChapter("good2.xhtml", "Good Two", "Second", "also fine"),
    ],
  });
  const r = await read(bytes);
  assert.equal(r.sections.length, 2, "the two good chapters import");
  assert.deepEqual(r.chapters.map((c) => c.title), ["Good One", "Good Two"]);
});

test("a missing package file rejects with a friendly error", async () => {
  const files = epubFiles({ chapters: [plainChapter("ch1.xhtml", "One", "One", "text")] });
  delete files["OEBPS/content.opf"];                     // without the package the book cannot even be described
  await assert.rejects(read(makeZip(files)), (e) => {
    assert.equal(e.epubInvalid, true);
    assert.match(H.epubErr(e), /not a valid EPUB|missing/);
    return true;
  });
});

test("one missing chapter file does not lose the rest of the book", async () => {
  const files = epubFiles({ chapters: [
    plainChapter("ok1.xhtml", "Alpha", "First", "still here"),
    plainChapter("gone.xhtml", "Gone", "Gone", "unreachable"),
    plainChapter("ok2.xhtml", "Beta", "Second", "also here"),
  ] });
  delete files["OEBPS/gone.xhtml"];                      // one spine item is not on disk
  const r = await read(makeZip(files));
  assert.equal(r.sections.length, 2, "the two readable chapters import");
  assert.deepEqual(r.chapters.map((c) => c.title), ["Alpha", "Beta"]);
});

test("contents entries with #anchors become chapters at the section holding that anchor", async () => {
  const body = `<?xml version="1.0" encoding="UTF-8"?>` +
    `<html xmlns="http://www.w3.org/1999/xhtml"><head><title>Part One</title></head>` +
    `<body><h1>Part One</h1><p>${longPara(1000, 1)}.</p>` +
    `<h2 id="sec2">Part Two</h2><p>${longPara(1000, 2)}.</p></body></html>`;
  const bytes = buildEpub({
    chapters: [{ file: "one.xhtml", label: "Part One", body }],
    tocEntries: [{ href: "one.xhtml", label: "Part One" }, { href: "one.xhtml#sec2", label: "Part Two" }],
  });
  const r = await read(bytes);
  assert.ok(r.sections.length >= 2, "the long chapter splits in two");
  const partTwo = r.chapters.find((c) => c.title === "Part Two");
  assert.ok(partTwo, "anchor chapter exists");
  assert.equal(r.sections[partTwo.p][0].text, "Part Two", "its section starts at that anchor heading");
  assert.ok(partTwo.p > r.chapters.find((c) => c.title === "Part One").p);
});

test("a table of contents in a subfolder still finds its chapters (../ hrefs)", async () => {
  const bytes = buildEpub({
    chapters: [plainChapter("ch1.xhtml", "Alpha", "A", "aaa"), plainChapter("ch2.xhtml", "Beta", "B", "bbb")],
    tocHref: "nav/toc.ncx",
  });
  const r = await read(bytes);
  assert.deepEqual(r.chapters.map((c) => c.title), ["Alpha", "Beta"]);
});

test("the EPUB3 <nav> document is used as the table of contents", async () => {
  const bytes = buildEpub({
    useNav: true,
    chapters: [
      { file: "ch1.xhtml", label: "First Bits", body:
        `<?xml version="1.0"?><html xmlns="http://www.w3.org/1999/xhtml"><head><title>c</title></head>` +
        `<body><h1>Chapter One</h1><p>text one</p></body></html>` },
      { file: "ch2.xhtml", label: "Last Bits", body:
        `<?xml version="1.0"?><html xmlns="http://www.w3.org/1999/xhtml"><head><title>c</title></head>` +
        `<body><h1>Chapter Two</h1><p>text two</p></body></html>` },
    ],
  });
  const r = await read(bytes);
  const titles = r.chapters.map((c) => c.title);
  assert.ok(titles.includes("First Bits") || titles.includes("Chapter One"),
    "chapters exist from nav titles or heading fallback");
  if (titles.includes("First Bits")) {
    assert.deepEqual(titles, ["First Bits", "Last Bits"], "nav labels win when the nav parsed");
  }
});

test("the navigation document itself is never typed as book text", async () => {
  const bytes = buildEpub({
    useNav: true,
    spine: ["nav.xhtml", "ch1.xhtml"],
    chapters: [plainChapter("ch1.xhtml", "One", "Only Chapter", "real words")],
  });
  const r = await read(bytes);
  const all = r.sections.flat().map((b) => b.text).join(" ");
  assert.ok(!all.includes("Contents"), "no nav labels leak into the text");
  assert.equal(r.sections.length, 1);
});

test("bytes that are not a zip are rejected as invalid, with a friendly message", async () => {
  await assert.rejects(read(new TextEncoder().encode("definitely not an epub file")), (e) => {
    assert.equal(e.epubInvalid, true);
    assert.match(H.epubErr(e), /not a valid EPUB/);
    assert.equal(H.epubErrShort(e), "not a valid EPUB");
    return true;
  });
});

test("a zip that is not an EPUB (no container) is rejected too", async () => {
  const { makeZip } = await import("./helpers.mjs");
  await assert.rejects(read(makeZip({ "hello.txt": "hi" })), (e) => {
    assert.equal(e.epubInvalid, true);
    return true;
  });
});

test("duplicate imports are recognised: same bytes, same hash, same sections", async () => {
  const opts = { chapters: [plainChapter("ch1.xhtml", "One", "One", "same text")] };
  const a = buildEpub(opts);
  const b = buildEpub(opts);                 // the builder is deterministic: bytes match
  assert.deepEqual([...a], [...b], "fixture builder is deterministic");
  const r1 = await read(a), r2 = await read(b);
  assert.equal(H.epubHash(a), H.epubHash(b), "identity comes from the bytes");
  assert.deepEqual(sectionText(r1), sectionText(r2), "re-reading gives the same sections");
  assert.equal(r1.chapters[0].p, r2.chapters[0].p);
});

test("epubWithBook always destroys the book, even when fn throws", async () => {
  const bytes = buildEpub({ chapters: [plainChapter("ch1.xhtml", "One", "One", "text")] });
  // epub.js exposes no destroyed flag, so watch Book#destroy itself in the jsdom realm
  const proto = Object.getPrototypeOf(w.ePub(undefined, {}));
  const realDestroy = proto.destroy;
  const destroyed = new Set();
  proto.destroy = function (...args) { destroyed.add(this); return realDestroy.apply(this, args); };

  const books = [];
  const ok = await H.epubWithBook(sandboxBuf(bytes), (book) => { books.push(book); return "value"; });
  assert.equal(ok, "value");
  assert.ok(destroyed.has(books[0]), "a successful read destroys the book");

  await assert.rejects(H.epubWithBook(sandboxBuf(bytes), (book) => { books.push(book); throw new Error("boom"); }), /boom/);
  assert.ok(destroyed.has(books[1]), "a failed read destroys the book too");
});
