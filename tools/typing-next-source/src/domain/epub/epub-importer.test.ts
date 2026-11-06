import test from "node:test";
import assert from "node:assert/strict";
import JSZip from "jszip";
import { JSDOM } from "jsdom";
import { readEpub } from "./epub-importer";

const parser = new JSDOM("").window.DOMParser;
const makeEpub = async (options: {
  chapters?: { file: string; label: string; body: string }[];
  nav?: boolean;
  empty?: boolean;
} = {}) => {
  const zip = new JSZip();
  const chapters = options.chapters ?? [
    { file: "one.xhtml", label: "Opening", body: "<h1 id='start'>Chapter One</h1><p>First chapter text.</p>" },
    { file: "two.xhtml", label: "Ending", body: "<h1>Chapter Two</h1><p>Second chapter text.</p>" },
  ];
  zip.file("mimetype", "application/epub+zip", { compression: "STORE" });
  zip.file("META-INF/container.xml",
    '<?xml version="1.0"?><container xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles></container>');
  const manifest = chapters.map((chapter, i) =>
    `<item id="c${i}" href="${chapter.file}" media-type="application/xhtml+xml"/>`).join("");
  const spine = chapters.map((_, i) => `<itemref idref="c${i}"/>`).join("");
  const toc = options.nav
    ? '<item id="toc" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>'
    : '<item id="toc" href="toc.ncx" media-type="application/x-dtbncx+xml"/>';
  zip.file("OEBPS/content.opf",
    `<?xml version="1.0"?><package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="uid"><metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:title>Test Novel</dc:title><dc:creator>Test Author</dc:creator></metadata><manifest>${toc}${manifest}</manifest><spine toc="toc">${spine}</spine></package>`);
  if (options.nav) {
    zip.file("OEBPS/nav.xhtml",
      '<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops"><body><nav epub:type="toc"><ol><li><a href="one.xhtml">Opening</a></li><li><a href="two.xhtml">Ending</a></li></ol></nav></body></html>');
  } else {
    zip.file("OEBPS/toc.ncx",
      '<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/"><navMap><navPoint><navLabel><text>Opening</text></navLabel><content src="one.xhtml"/></navPoint><navPoint><navLabel><text>Ending</text></navLabel><content src="two.xhtml"/></navPoint></navMap></ncx>');
  }
  for (const chapter of chapters) {
    zip.file(`OEBPS/${chapter.file}`,
      `<?xml version="1.0"?><html xmlns="http://www.w3.org/1999/xhtml"><head><title>${chapter.label}</title></head><body>${chapter.body}</body></html>`);
  }
  return zip.generateAsync({ type: "uint8array", compression: "STORE" });
};

test("imports a complete EPUB in spine order with metadata and NCX chapter labels", async () => {
  const bytes = await makeEpub();
  const result = await readEpub(bytes, new parser());
  assert.equal(result.title, "Test Novel");
  assert.equal(result.author, "Test Author");
  assert.equal(result.sections.length, 2);
  assert.deepEqual(result.chapters.map((chapter) => chapter.title), ["Opening", "Ending"]);
  assert.equal(result.sections[0][0].text, "Chapter One");
  assert.match(result.hash, /^[0-9a-f]{16}$/);
});

test("reads EPUB 3 navigation documents as the table of contents", async () => {
  const result = await readEpub(await makeEpub({ nav: true }), new parser());
  assert.deepEqual(result.chapters.map((chapter) => chapter.title), ["Opening", "Ending"]);
});

test("skips unreadable chapters but keeps readable chapters", async () => {
  const result = await readEpub(await makeEpub({
    chapters: [
      { file: "bad.xhtml", label: "Broken", body: "<p>unfinished" },
      { file: "good.xhtml", label: "Good", body: "<h1>Good chapter</h1><p>Readable text</p>" },
    ],
  }), new parser());
  assert.equal(result.sections.length, 1);
  assert.equal(result.sections[0][0].text, "Good chapter");
});

test("rejects ZIP files that are not EPUBs with a friendly error flag", async () => {
  const zip = new JSZip();
  zip.file("hello.txt", "not an epub");
  await assert.rejects(readEpub(await zip.generateAsync({ type: "uint8array" }), new parser()),
    (error: { epubInvalid?: boolean }) => error.epubInvalid === true);
});

test("reports a valid EPUB with no readable chapter text as empty", async () => {
  await assert.rejects(readEpub(await makeEpub({
    chapters: [{ file: "blank.xhtml", label: "Blank", body: "<p> </p><img src='cover.jpg'/>" }],
  }), new parser()), (error: { epubEmpty?: boolean }) => error.epubEmpty === true);
});
