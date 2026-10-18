// One-off: inline JSZip and epub.js into bookkeys.html, mirroring the embedded pdf.js convention.
// Run from the repo root: node tools/typing/tests/inline-epub-libs.mjs
// The vendor sources this reads (jszip.min.js and epub.min.js beside bookkeys.html) were deleted
// after the inlining, so only one copy of each library lives in the repo. To run an update,
// download jszip@3.10.1 and epubjs@0.3.93 dist files under those names, then run this script;
// its guards refuse to double-insert or to embed anything that would break an inline script block.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const typingDir = join(here, "..");
const pagePath = join(typingDir, "bookkeys.html");

const page = readFileSync(pagePath, "utf8");
const jszip = readFileSync(join(typingDir, "jszip.min.js"), "utf8").replace(/\s+$/, "");
const epubjs = readFileSync(join(typingDir, "epub.min.js"), "utf8").replace(/\s+$/, "");

for (const [name, code] of [["jszip", jszip], ["epubjs", epubjs]]) {
  if (/<\/script/i.test(code) || code.includes("<!--")) {
    throw new Error(`${name}: source contains a sequence that would break an inline <script> block`);
  }
}
if (page.includes('<script id="epubjs-lib">')) {
  throw new Error("epub.js is already inlined; refusing to double-insert");
}

const anchor = "<!-- PDF reader: pdf.js";
const at = page.indexOf(anchor);
if (at < 0 || page.indexOf(anchor, at + 1) !== -1) throw new Error("pdf.js comment anchor not unique");

const block = [
  "<!-- EPUB reader: JSZip 3.10.1 (dual MIT/GPL, notice kept inside) by Stuart Knightley et al.,",
  "     and epub.js 0.3.93 (MIT) by fchasen. Stored here like pdf.js so Bookkeys opens",
  "     PDFs and EPUBs with no internet connection. -->",
  '<script id="jszip-lib">',
  jszip,
  "</script>",
  '<script id="epubjs-lib">',
  epubjs,
  "</script>",
  "",
].join("\n");

writeFileSync(pagePath, page.slice(0, at) + block + page.slice(at), "utf8");
console.log(`inlined jszip (${jszip.length} chars) + epub.js (${epubjs.length} chars); page is now ${page.length + block.length} chars`);
