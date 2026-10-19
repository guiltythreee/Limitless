// Shared test helpers for Bookkeys (tools/typing/bookkeys.html).
//
// The app page embeds everything it needs (pdf.js, JSZip, epub.js and the app itself) as inline
// scripts, exactly so it works from a file with no internet. These helpers read those scripts back
// out of the page: the pure helper regions are extracted between their START/END markers (the same
// technique the page's own comment promises), and the libraries are extracted by script id.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { JSDOM } from "jsdom";

const BOOKKEYS_PATH = fileURLToPath(new URL("../bookkeys.html", import.meta.url));

let pageCache = null;
export function pageSource() {
  if (pageCache === null) pageCache = readFileSync(BOOKKEYS_PATH, "utf8");
  return pageCache;
}

// The code of one <script id="..."> block in the page.
export function scriptById(id) {
  const html = pageSource();
  const open = `<script id="${id}">`;
  const i = html.indexOf(open);
  if (i < 0) throw new Error(`no <script id="${id}"> in bookkeys.html`);
  const j = html.indexOf("</script>", i);
  if (j < 0) throw new Error(`script #${id} is never closed`);
  return html.slice(i + open.length, j);
}

// The /*START*//*END*/-marked regions of the app script (BLOCKS: pure game/text helpers,
// EPUB: the EPUB-to-sections helpers, NAV: the swipe/navigation helpers). They all run without
// any app state, so Node can test them.
export function helperSource() {
  const html = pageSource();
  function region(start, end) {
    const i = html.indexOf(start), j = html.indexOf(end);
    if (i < 0 || j < 0 || j < i) throw new Error(`markers ${start} / ${end} not found`);
    return html.slice(i, j + end.length);
  }
  return region("/*BLOCKS-START*/", "/*BLOCKS-END*/") + "\n" +
         region("/*EPUB-START*/", "/*EPUB-END*/") + "\n" +
         region("/*NAV-START*/", "/*NAV-END*/") + "\n";
}

// Evaluate the helper regions in a function scope and hand back the named helpers.
// extraParams inject things the browser normally provides globally (e.g. ePub from epub.js).
export function loadHelpers(names, extraParams = {}) {
  const keys = Object.keys(extraParams);
  const fn = new Function(...keys, helperSource() + "\nreturn {" + names.join(", ") + "};");
  return fn(...keys.map((k) => extraParams[k]));
}

// A jsdom window with the page's own JSZip + epub.js evaluated into it (runScripts: "outside-only"
// so window.eval exists). URL.createObjectURL and friends are polyfilled because jsdom has no blob
// URLs; they only matter for cover extraction, not for reading a book's text.
export function epubSandbox() {
  const dom = new JSDOM("<!doctype html><html><body></body></html>", {
    runScripts: "outside-only",
    url: "https://local.test/tools/typing/bookkeys.html",
  });
  const w = dom.window;
  // jsdom provides no window.setImmediate. JSZip's bundle installs a setImmediate polyfill at
  // load time whose only working branch is the postMessage one, and jsdom never delivers that
  // message — so every .async() read would hang forever. Install a real setImmediate first: the
  // polyfill sees one already exists and skips its install entirely. Browsers are untouched;
  // this is purely a test-harness shim.
  w.setImmediate = (fn, ...a) => setImmediate(fn, ...a);
  w.clearImmediate = (h) => clearImmediate(h);
  w.eval(scriptById("jszip-lib"));
  w.eval(scriptById("epubjs-lib"));
  if (!w.JSZip) throw new Error("JSZip did not load into the jsdom sandbox");
  if (!w.ePub) throw new Error("ePub did not load into the jsdom sandbox");
  if (!w.URL.createObjectURL) w.URL.createObjectURL = () => "blob:fake";
  if (!w.URL.revokeObjectURL) w.URL.revokeObjectURL = () => {};
  if (!w.TextDecoder) w.TextDecoder = TextDecoder;
  if (!w.TextEncoder) w.TextEncoder = TextEncoder;
  return dom;
}

export function toBytes(x) {
  if (x instanceof Uint8Array) return x;
  if (x instanceof ArrayBuffer) return new Uint8Array(x);
  return new Uint8Array(x.buffer, x.byteOffset, x.byteLength);
}

// ---------------------------------------------------------------------------
// A zip writer (stored entries, no compression): enough for JSZip to open and
// for any unzip tool to read the fixtures. Deflate is not needed for tests.
// ---------------------------------------------------------------------------

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

export function crc32(bytes) {
  let c = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) c = CRC_TABLE[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function concat(parts) {
  const total = parts.reduce((s, p) => s + p.length, 0);
  const out = new Uint8Array(total);
  let at = 0;
  for (const p of parts) { out.set(p, at); at += p.length; }
  return out;
}

// files: { "path/inside.txt": "string or Uint8Array" } -> one stored (uncompressed) zip
export function makeZip(files) {
  const enc = new TextEncoder();
  const locals = [], centrals = [];
  let offset = 0;
  for (const [name, data] of Object.entries(files)) {
    const nameB = enc.encode(name);
    const dataB = typeof data === "string" ? enc.encode(data) : data;
    const crc = crc32(dataB);

    const local = new Uint8Array(30 + nameB.length + dataB.length);
    const lv = new DataView(local.buffer);
    lv.setUint32(0, 0x04034b50, true);          // local file header
    lv.setUint16(4, 20, true);                  // version needed
    lv.setUint32(14, crc, true);
    lv.setUint32(18, dataB.length, true);       // compressed size
    lv.setUint32(22, dataB.length, true);       // uncompressed size
    lv.setUint16(26, nameB.length, true);
    local.set(nameB, 30);
    local.set(dataB, 30 + nameB.length);

    const central = new Uint8Array(46 + nameB.length);
    const cv = new DataView(central.buffer);
    cv.setUint32(0, 0x02014b50, true);          // central directory header
    cv.setUint16(4, 20, true);                  // version made by
    cv.setUint16(6, 20, true);                  // version needed
    cv.setUint32(16, crc, true);
    cv.setUint32(20, dataB.length, true);
    cv.setUint32(24, dataB.length, true);
    cv.setUint16(28, nameB.length, true);
    cv.setUint32(42, offset, true);             // local header offset
    central.set(nameB, 46);

    locals.push(local);
    centrals.push(central);
    offset += local.length;
  }
  const cdSize = centrals.reduce((s, c) => s + c.length, 0);
  const eocd = new Uint8Array(22);
  const ev = new DataView(eocd.buffer);
  ev.setUint32(0, 0x06054b50, true);            // end of central directory
  ev.setUint16(8, centrals.length, true);
  ev.setUint16(10, centrals.length, true);
  ev.setUint32(12, cdSize, true);
  ev.setUint32(16, offset, true);
  return concat([...locals, ...centrals, eocd]);
}

// ---------------------------------------------------------------------------
// Synthetic EPUB fixtures. Well-formed XML throughout (real EPUB content is
// XML; entities like &nbsp; would be parse errors there too).
// ---------------------------------------------------------------------------

const XHTML_NS = 'xmlns="http://www.w3.org/1999/xhtml"';
const OPF_NS = 'xmlns="http://www.idpf.org/2007/opf"';

function xhtml(body, title = "") {
  return `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<html ${XHTML_NS}><head><title>${title}</title></head><body>${body}</body></html>\n`;
}

export function para(text) {
  return `<p>${text}</p>`;
}

// One paragraph of lorem-ish text; deterministic for a given seed.
export function longPara(chars, seed = 1) {
  const words = ["amber", "lantern", "river", "quiet", "copper", "meadow", "harbour", "winter",
    "signal", "clover", "ember", "thicket", "marble", "anchor", "willow", "cinder"];
  let out = "", n = 0, s = seed;
  while (n < chars) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const w = words[s % words.length];
    out += (out ? " " : "") + w;
    n += w.length + 1;
  }
  return out.slice(0, chars);
}

// Build a complete synthetic EPUB as a zip.
// opts:
//   title, author         book metadata
//   chapters              [{ file, label, body, raw }] - `body` is the XHTML body markup,
//                         `raw` replaces the whole file verbatim (for malformed fixtures)
//   spine                 optional explicit list of chapter files (to put the nav in the spine)
//   useNav                EPUB3 <nav> document instead of an NCX table of contents
//   tocHref               href of the toc file, relative to the OPF (may live in a subfolder)
//   tocEntries            optional explicit [{ href, label }] toc rows (default: one per chapter)
//   extraFiles            more { path: content } entries merged in
//   skipMimetype          leave the mimetype entry out
export function epubFiles(opts = {}) {
  const {
    title = "Test Book",
    author = "Test Author",
    chapters = [
      { file: "ch1.xhtml", label: "Chapter One", body: xhtml("<h1>Chapter One</h1>" + para("First chapter text."), "Chapter One") },
      { file: "ch2.xhtml", label: "Chapter Two", body: xhtml("<h1>Chapter Two</h1>" + para("Second chapter text."), "Chapter Two") },
    ],
    spine = chapters.map((c) => c.file),
    useNav = false,
    tocHref = useNav ? "nav.xhtml" : "toc.ncx",
    tocEntries = null,
    extraFiles = {},
    skipMimetype = false,
  } = opts;

  const opfDir = "OEBPS";
  const tocDir = tocHref.includes("/") ? tocHref.slice(0, tocHref.lastIndexOf("/")) : "";
  const tocRelTo = (file) => {
    // href from the toc file's folder back to a chapter file (both relative to OEBPS)
    const up = tocDir ? "../".repeat(tocDir.split("/").length) : "";
    return up + file;
  };
  const entries = tocEntries || chapters.map((c) => ({ href: tocRelTo(c.file), label: c.label }));

  const manifestItems = [];
  const idFor = (f) => (useNav && f === tocHref ? "nav" : `f-${f.replace(/[^a-z0-9]/gi, "-")}`);
  for (const c of chapters) {
    manifestItems.push(`<item id="f-${c.file.replace(/[^a-z0-9]/gi, "-")}" href="${c.file}" media-type="application/xhtml+xml"/>`);
  }
  // the spine lists reading order, which may differ from file/manifest order
  const spineItems = spine
    .filter((f) => f === tocHref || chapters.some((c) => c.file === f))
    .map((f) => `<itemref idref="${idFor(f)}"/>`);
  if (useNav) {
    manifestItems.unshift(`<item id="nav" href="${tocHref}" media-type="application/xhtml+xml" properties="nav"/>`);
  } else {
    manifestItems.unshift(`<item id="ncx" href="${tocHref}" media-type="application/x-dtbncx+xml"/>`);
  }

  let tocDoc;
  if (useNav) {
    const li = (e) => `<li><a href="${e.href}">${e.label}</a></li>`;
    tocDoc = `<?xml version="1.0" encoding="UTF-8"?>\n<html ${XHTML_NS} xmlns:epub="http://www.idpf.org/2007/ops">` +
      `<head><title>Contents</title></head><body><nav epub:type="toc" id="toc"><ol>` +
      entries.map(li).join("") + `</ol></nav></body></html>\n`;
  } else {
    const np = (e, i) => `<navPoint id="n${i}" playOrder="${i + 1}"><navLabel><text>${e.label}</text></navLabel><content src="${e.href}"/></navPoint>`;
    tocDoc = `<?xml version="1.0" encoding="UTF-8"?>\n<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">` +
      `<head><meta name="dtb:uid" content="bookkeys-test"/></head><navMap>` +
      entries.map(np).join("") + `</navMap></ncx>\n`;
  }

  const opf = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<package ${OPF_NS} version="${useNav ? "3.0" : "2.0"}" unique-identifier="uid">` +
    `<metadata xmlns:dc="http://purl.org/dc/elements/1.1/">` +
    `<dc:identifier id="uid">bookkeys-test</dc:identifier>` +
    `<dc:title>${title}</dc:title><dc:creator>${author}</dc:creator>` +
    `<meta property="dcterms:modified">2024-01-01T00:00:00Z</meta>` +
    `</metadata><manifest>${manifestItems.join("")}</manifest>` +
    `<spine${useNav ? "" : ' toc="ncx"'}>${spineItems.join("")}</spine></package>\n`;

  const container = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">` +
    `<rootfiles><rootfile full-path="${opfDir}/content.opf" media-type="application/oebps-package+xml"/></rootfiles></container>\n`;

  const files = {};
  if (!skipMimetype) files["mimetype"] = "application/epub+zip";
  files["META-INF/container.xml"] = container;
  files[`${opfDir}/content.opf`] = opf;
  files[`${opfDir}/${tocHref}`] = tocDoc;
  for (const c of chapters) files[`${opfDir}/${c.file}`] = c.raw !== undefined ? c.raw : c.body;
  Object.assign(files, extraFiles);
  return files;
}

export function buildEpub(opts = {}) {
  return makeZip(epubFiles(opts));
}

export const asBuffer = (bytes) => bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
