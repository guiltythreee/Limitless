import test from "node:test";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import {
  normalize, epubHash, epubFlattenToc, epubResolveRel, epubHrefKey,
  epubSpineIndexFor, epubBlocksFromRoot, epubLongPieces, epubExpandBlocks,
  epubPackSections, epubChapterList, epubErr, epubErrShort,
} from "./epub-domain";

const dom = new JSDOM("<!doctype html>");
const parser = new dom.window.DOMParser();
const xml = (body: string) => parser.parseFromString(
  `<?xml version="1.0"?><html xmlns="http://www.w3.org/1999/xhtml"><body>${body}</body></html>`,
  "application/xhtml+xml",
);
const blocks = (body: string) => epubBlocksFromRoot(xml(body));

test("normalization preserves unicode while cleaning typography", () => {
  assert.equal(normalize("Café — déjà vu, ﬁne.\u00a0"), "Café - déjà vu, fine.");
});

test("hash is stable and sensitive to unicode bytes", () => {
  const enc = new TextEncoder();
  assert.equal(epubHash(enc.encode("café")), epubHash(enc.encode("café")));
  assert.notEqual(epubHash(enc.encode("café")), epubHash(enc.encode("cafe")));
  assert.match(epubHash(enc.encode("same")), /^[0-9a-f]{16}$/);
});

test("TOC flattening is depth-first and relative hrefs resolve safely", () => {
  const toc = epubFlattenToc([{ href: "one.xhtml", label: " One ", subitems: [{ href: "one.xhtml#a", label: "One.a" }] }]);
  assert.deepEqual(toc.map(x => x.label), ["One", "One.a"]);
  assert.equal(epubResolveRel("OEBPS/nav", "../one.xhtml"), "OEBPS/one.xhtml");
  assert.equal(epubResolveRel("OEBPS", "https://example.com/a"), "https://example.com/a");
  assert.equal(epubHrefKey("ch%201.xhtml?x=1"), "ch 1.xhtml");
  assert.equal(epubSpineIndexFor("ch2.xhtml", "OEBPS", ["OEBPS/ch1.xhtml", "OEBPS/ch2.xhtml"]), 1);
});

test("XHTML becomes ordered, nonduplicated reading blocks", () => {
  assert.deepEqual(blocks("<h1>Title</h1><p>First.</p><div><p>Second.</p></div>").map(x => [x.t,x.text]), [
    ["h","Title"],["p","First."],["p","Second."],
  ]);
  assert.deepEqual(blocks("<ul><li>Item one</li><li>Item two<ul><li>Nested</li></ul></li></ul>")?.map(x=>x.text),
    ["Item one","Item two","Nested"]);
  assert.deepEqual(blocks("<script>bad()</script><nav>Contents</nav><svg><text>logo</text></svg><p>Real</p>")?.map(x=>x.text), ["Real"]);
  assert.equal(epubBlocksFromRoot(parser.parseFromString("<html><body><p>broken","application/xhtml+xml")), null);
});

test("long paragraphs split at safe boundaries and reassemble", () => {
  const text = "Sentence one is here. ".repeat(80).trim();
  const pieces = epubLongPieces(text, 1600);
  assert.ok(pieces.length > 1);
  assert.ok(pieces.every(p => p.length <= 1600));
  assert.equal(pieces.join(" "), text);
  const expanded = epubExpandBlocks([{t:"p",text:"longword ".repeat(100),id:"anchor"}], 100);
  assert.ok(expanded.length > 1);
  assert.equal(expanded[0].id, "anchor");
});

test("section packing keeps blocks intact and maps every block", () => {
  const input = [{t:"h" as const,text:"Title"},{t:"p" as const,text:"x".repeat(500)},{t:"p" as const,text:"y".repeat(500)},{t:"p" as const,text:"z".repeat(200)}];
  const packed = epubPackSections(input, 600);
  assert.deepEqual(packed.secOf, [0,0,0,1]);
  assert.deepEqual(packed.sections.flat(), input);
});

test("chapter list deduplicates positions and accepts TOC labels", () => {
  const chapters = epubChapterList([{start:0,count:3,title:"One"},{start:3,count:2,title:"Two"}],5,[{p:4,title:"Two, part 2"},{p:3,title:"duplicate"}]);
  assert.deepEqual(chapters.map(x=>x.p), [0,3,4]);
  assert.deepEqual(chapters.map(x=>x.title), ["One","Two","Two, part 2"]);
});

test("EPUB errors have stable friendly messages", () => {
  assert.match(epubErr({epubInvalid:true}), /not a valid EPUB/);
  assert.match(epubErr({epubEmpty:true}), /no readable text/);
  assert.equal(epubErrShort({epubInvalid:true}), "not a valid EPUB");
  assert.equal(epubErrShort(new Error("?")), "could not be read");
});
