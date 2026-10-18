// The EPUB region's pure helpers: hashing, table-of-contents href resolution, XHTML-to-blocks
// walking, section packing and chapter lists. These run against real jsdom DOM trees, exactly as
// the app feeds them epub.js's parsed documents.
import test from "node:test";
import assert from "node:assert/strict";
import { loadHelpers, epubSandbox } from "./helpers.mjs";

const dom = epubSandbox();
const { DOMParser } = dom.window;

const H = loadHelpers([
  "normalize", "tidyChapters", "evenChapters",
  "epubHash", "epubFlattenToc", "epubResolveRel", "epubHrefKey", "epubSpineIndexFor",
  "epubInlineText", "epubHasBlockChild", "epubBlocksFromRoot",
  "epubLongPieces", "epubExpandBlocks", "epubPackSections", "epubChapterList",
  "epubNavDir", "epubErr", "epubErrShort",
], { ePub: dom.window.ePub });

function xmlDoc(xhtml) {
  return new DOMParser().parseFromString(xhtml, "application/xhtml+xml");
}
function blocksOf(xhtml) {
  return H.epubBlocksFromRoot(xmlDoc(xhtml), H.normalize);
}
const page = (body) => `<?xml version="1.0" encoding="UTF-8"?><html xmlns="http://www.w3.org/1999/xhtml"><head><title>t</title></head><body>${body}</body></html>`;

// ---------------------------------------------------------------------------
// identity
// ---------------------------------------------------------------------------

test("epubHash is stable for identical bytes and differs otherwise", () => {
  const a = new TextEncoder().encode("same bytes");
  const b = new TextEncoder().encode("same bytes");
  const c = new TextEncoder().encode("other bytes");
  assert.equal(H.epubHash(a), H.epubHash(b));
  assert.notEqual(H.epubHash(a), H.epubHash(c));
  assert.match(H.epubHash(a), /^[0-9a-f]{16}$/);
});

test("epubHash depends on every byte, including unicode ones", () => {
  const enc = new TextEncoder();
  const a = enc.encode("café");
  const b = enc.encode("cafe");
  assert.notEqual(H.epubHash(a), H.epubHash(b));
  assert.equal(H.epubHash(enc.encode("café")), H.epubHash(enc.encode("café")));
});

// ---------------------------------------------------------------------------
// table of contents hrefs -> spine items
// ---------------------------------------------------------------------------

test("epubFlattenToc walks nested entries depth-first and trims labels", () => {
  const flat = H.epubFlattenToc([
    { href: "ch1.xhtml", label: "One", subitems: [
      { href: "ch1.xhtml#a", label: "  One.a  ", subitems: [] },
    ] },
    { href: "ch2.xhtml", label: "Two", subitems: [] },
  ]);
  assert.deepEqual(flat.map((t) => t.href), ["ch1.xhtml", "ch1.xhtml#a", "ch2.xhtml"]);
  assert.deepEqual(flat.map((t) => t.label), ["One", "One.a", "Two"]);
});

test("epubResolveRel joins directories and eats ../ and .", () => {
  assert.equal(H.epubResolveRel("", "ch1.xhtml"), "ch1.xhtml");
  assert.equal(H.epubResolveRel("OEBPS", "ch1.xhtml"), "OEBPS/ch1.xhtml");
  assert.equal(H.epubResolveRel("OEBPS/nav", "../ch1.xhtml"), "OEBPS/ch1.xhtml");
  assert.equal(H.epubResolveRel("OEBPS/nav", "./toc.xhtml"), "OEBPS/nav/toc.xhtml");
  assert.equal(H.epubResolveRel("a/b", "../../x.xhtml"), "x.xhtml");
  assert.equal(H.epubResolveRel("OEBPS", "https://example.com/x.xhtml"), "https://example.com/x.xhtml");
});

test("epubHrefKey strips fragments, queries and escapes", () => {
  assert.equal(H.epubHrefKey("ch1.xhtml#part2"), "ch1.xhtml");
  assert.equal(H.epubHrefKey("ch%201.xhtml?x=1"), "ch 1.xhtml");
});

test("epubSpineIndexFor finds exact, relative and same-name targets", () => {
  const urls = ["OEBPS/ch1.xhtml", "OEBPS/ch2.xhtml", "text/ch3.xhtml"];
  assert.equal(H.epubSpineIndexFor("ch2.xhtml", "OEBPS", urls), 1, "toc href relative to the opf dir");
  assert.equal(H.epubSpineIndexFor("../ch1.xhtml", "OEBPS/nav", urls), 0, "toc in a subfolder");
  assert.equal(H.epubSpineIndexFor("ch3.xhtml", "OEBPS", urls), 2, "last-resort file name match");
  assert.equal(H.epubSpineIndexFor("ch9.xhtml", "OEBPS", urls), -1);
  assert.equal(H.epubSpineIndexFor("ch1.xhtml#sec", "OEBPS", urls), 0, "fragment ignored");
});

// ---------------------------------------------------------------------------
// XHTML -> blocks
// ---------------------------------------------------------------------------

test("epubBlocksFromRoot keeps headings and paragraphs, in order", () => {
  const blocks = blocksOf(page("<h1>Title</h1><p>First.</p><p>Second.</p><h2>Sub</h2><p>Third.</p>"));
  assert.deepEqual(blocks.map((b) => [b.t, b.text]), [
    ["h", "Title"], ["p", "First."], ["p", "Second."], ["h", "Sub"], ["p", "Third."],
  ]);
});

test("epubBlocksFromRoot never duplicates text in nested containers", () => {
  const blocks = blocksOf(page("<div><section><p>Only once.</p></section></div>"));
  assert.deepEqual(blocks.map((b) => b.text), ["Only once."]);
});

test("list items with only inline content become paragraphs, nested lists keep their items", () => {
  const blocks = blocksOf(page("<ul><li>Item one</li><li>Item two<ul><li>Nested</li></ul></li></ul>"));
  assert.deepEqual(blocks.map((b) => b.text), ["Item one", "Item two", "Nested"]);
});

test("<br> separates words, inline markup keeps its text", () => {
  const blocks = blocksOf(page("<p>line one<br/>line <em>two</em></p>"));
  assert.equal(blocks[0].text, "line one line two");
});

test("scripts, styles, inline svgs and nav elements are not reading text", () => {
  const blocks = blocksOf(page(
    "<style>p{color:red}</style><script>alert(1)</script>" +
    "<nav><ul><li><a href=\"x\">Contents</a></li></ul></nav>" +
    "<svg><text>logo</text></svg><p>Real text.</p>"));
  assert.deepEqual(blocks.map((b) => b.text), ["Real text."]);
});

test("table cells become paragraphs without repeating the whole table", () => {
  const blocks = blocksOf(page("<table><tr><td>Alpha</td><td>Beta</td></tr></table>"));
  assert.deepEqual(blocks.map((b) => b.text), ["Alpha", "Beta"]);
});

test("an image-only page yields no blocks at all", () => {
  assert.deepEqual(blocksOf(page('<p><img src="pic.png" alt=""/></p><div><img src="a.png"/><img src="b.png"/></div>')), []);
});

test("the xml parser's error page is rejected, not offered as text", () => {
  const broken = new DOMParser().parseFromString("<html><body><p>unclosed", "application/xhtml+xml");
  assert.equal(H.epubBlocksFromRoot(broken, H.normalize), null);
  assert.equal(H.epubBlocksFromRoot(null, H.normalize), null);
});

test("ids are recorded for anchors, and unicode survives normalization", () => {
  const blocks = blocksOf(page('<h2 id="part2">Deuxième partie</h2><p>Café — déjà vu, ﬁne.</p>'));
  assert.equal(blocks[0].id, "part2");
  assert.equal(blocks[0].text, "Deuxième partie");
  assert.equal(blocks[1].text, "Café - déjà vu, fine.");
});

// ---------------------------------------------------------------------------
// section packing
// ---------------------------------------------------------------------------

test("epubPackSections closes a section at the target, never splits a block, and maps block -> section", () => {
  const blocks = [
    { t: "h", text: "Title" },
    { t: "p", text: "x".repeat(500) },
    { t: "p", text: "y".repeat(500) },
    { t: "p", text: "z".repeat(200) },
  ];
  const { sections, secOf } = H.epubPackSections(blocks, 600);
  // a section closes once its running length reaches the target: title + x + y = 1005 >= 600,
  // so the third block is the one that crosses the line and it stays whole in section 0
  assert.deepEqual(secOf, [0, 0, 0, 1]);
  assert.equal(sections.length, 2);
  assert.deepEqual(sections[0].map((b) => b.text[0]), ["T", "x", "y"]);
  assert.deepEqual(sections[1].map((b) => b.text[0]), ["z"]);
  for (const sec of sections) for (const b of sec) assert.ok(blocks.includes(b), "intact block, present once");
});

test("epubPackSections keeps every block exactly once (no text lost or reordered)", () => {
  const blocks = Array.from({ length: 40 }, (_, i) => ({ t: "p", text: `block ${i} ` + "w".repeat(i * 37) }));
  const { sections, secOf } = H.epubPackSections(blocks, 900);
  const out = sections.flat();
  assert.deepEqual(out, blocks, "round trip must be exact");
  assert.equal(secOf.length, blocks.length);
  sections.forEach((sec, si) => sec.forEach((b) => assert.equal(blocks.indexOf(b) >= 0 && secOf[blocks.indexOf(b)], si)));
});

test("epubLongPieces splits a long paragraph at sentence ends and never mid-word", () => {
  const text = (H.normalize("Sentence one is here. ".repeat(80)));
  const pieces = H.epubLongPieces(text, 1600);
  assert.ok(pieces.length > 1);
  for (const piece of pieces) {
    assert.ok(piece.length <= 1600, "piece within limit");
    assert.ok(!/^ | $/.test(piece), "no dangling space");
    assert.ok(text.includes(piece), "piece is a clean substring");
  }
  assert.equal(pieces.join(" ").replace(/\s+/g, " "), text.replace(/\s+/g, " "));
});

test("epubLongPieces hard-splits a sentence with no punctuation at word boundaries", () => {
  const text = "word ".repeat(1200).trim();        // one giant sentence, 5999 chars
  const pieces = H.epubLongPieces(text, 1600);
  assert.ok(pieces.length >= 4);
  for (const piece of pieces) assert.ok(piece.length <= 1600);
  assert.ok(pieces.every((p) => !p.includes("  ")), "no half-words joined");
});

test("epubExpandBlocks splits oversized paragraphs but leaves short ones and headings alone", () => {
  const blocks = [
    { t: "h", text: "A heading stays whole" },
    { t: "p", text: "short" },
    { t: "p", text: "longword ".repeat(400), id: "anchor" },
  ];
  const out = H.epubExpandBlocks(blocks, 1000);
  assert.equal(out[0], blocks[0]);
  assert.equal(out[1], blocks[1]);
  assert.ok(out.length > 3, "long paragraph was split");
  assert.equal(out[2].id, "anchor", "the anchor id rides on the first piece");
  assert.equal(out.slice(2).map((b) => b.text).join(" ").replace(/\s+/g, " ").trim(),
    blocks[2].text.replace(/\s+/g, " ").trim(), "the pieces reassemble into the original text");
});

// ---------------------------------------------------------------------------
// chapter lists
// ---------------------------------------------------------------------------

test("epubChapterList makes one chapter per part, plus toc anchor entries, tidy and deduped", () => {
  const parts = [
    { start: 0, count: 3, title: "One" },
    { start: 3, count: 2, title: "Two" },
  ];
  const chapters = H.epubChapterList(parts, 5, [{ p: 4, title: "Two, part 2" }, { p: 3, title: "dup" }]);
  assert.deepEqual(chapters.map((c) => c.p), [0, 3, 4]);
  assert.deepEqual(chapters.map((c) => c.title), ["One", "Two", "Two, part 2"]);
});

test("epubChapterList falls back to the first heading when the toc has no label", () => {
  const parts = [{ start: 0, count: 1, title: "" }, { start: 1, count: 1, title: "" }];
  const chapters = H.epubChapterList(parts, 2);
  assert.deepEqual(chapters.map((c) => c.p), [0, 1]);
});

// ---------------------------------------------------------------------------
// error messages
// ---------------------------------------------------------------------------

test("epubErr and epubErrShort turn failures into friendly words", () => {
  assert.match(H.epubErr({ epubInvalid: true }), /not a valid EPUB/);
  assert.match(H.epubErr({ epubEmpty: true }), /no readable text/);
  assert.match(H.epubErr(new Error("File not found in the epub: OEBPS/x.xhtml")), /files inside this EPUB are missing/);
  assert.ok(H.epubErr(null) === "");
  assert.equal(H.epubErrShort({ epubInvalid: true }), "not a valid EPUB");
  assert.equal(H.epubErrShort({ epubEmpty: true }), "no readable text");
  assert.equal(H.epubErrShort(new Error("?")), "could not be read");
});
