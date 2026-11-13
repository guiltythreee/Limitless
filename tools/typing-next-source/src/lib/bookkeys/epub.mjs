import { tidyChapters } from "./blocks.mjs";

/**
 * Pure EPUB parsing and section-shaping helpers.
 * Extracted verbatim from the preserved production source blob 310da8014c6c1ca9c80a75bce89b4ff1b2aa1e28.
 * epub.js integration is injected/called by the production app; this module does not touch app state.
 */
// ----- EPUB: reading a book's spine into the same block/section shape the typing app already uses -----
// The tests extract this region the same way as BLOCKS, so it stays free of app state.
// The file reader itself is epub.js 0.3.93 (embedded in this file, next to pdf.js); this code turns
// what epub.js opens into blocks ({ t: "h" | "p", text }) and typing sections (about 900 characters).

// Stable identity for an EPUB file: a hash of its bytes (epub.js has no fingerprint like pdf.js).
// Two 32-bit FNV-1a passes with different multipliers; Math.imul keeps the maths exact.
function epubHash(bytes) {
  var a = 0x811c9dc5 | 0, b = 0x85ebca6b | 0, i, c;
  for (i = 0; i < bytes.length; i++) {
    c = bytes[i];
    a = Math.imul(a ^ c, 0x01000193) >>> 0;
    b = Math.imul(b ^ c, 0x9e3779b1) >>> 0;
  }
  return ("00000000" + a.toString(16)).slice(-8) + ("00000000" + b.toString(16)).slice(-8);
}

// The table of contents, flattened depth-first (parents before children).
function epubFlattenToc(toc, out) {
  out = out || [];
  (toc || []).forEach(function (it) {
    if (!it) return;
    if (it.href) out.push({ href: String(it.href), label: String(it.label || "").replace(/\s+/g, " ").trim().slice(0, 80) });
    if (it.subitems && it.subitems.length) epubFlattenToc(it.subitems, out);
  });
  return out;
}

// Join a relative href onto the directory of the file it lives in ("" = book root).
function epubResolveRel(dir, rel) {
  var out = dir ? String(dir).split("/").filter(Boolean) : [], parts = String(rel).split("/"), i, seg;
  if (/^[a-z][a-z0-9+.-]*:/i.test(rel)) return String(rel);   // an absolute URL: leave it alone
  for (i = 0; i < parts.length; i++) {
    seg = parts[i];
    if (!seg || seg === ".") continue;
    if (seg === "..") out.pop(); else out.push(seg);
  }
  return out.join("/");
}

// An href with its #fragment and ?query removed, decoded where possible.
function epubHrefKey(h) {
  var c = String(h).split("#")[0].split("?")[0];
  try { c = decodeURI(c); } catch (e) {}
  return c;
}

// Which spine item does a table-of-contents href point at? -1 when nothing matches.
function epubSpineIndexFor(href, navDir, spineUrls) {
  var clean = epubHrefKey(href), rel = epubResolveRel(navDir, clean), tail = rel.split("/").pop(), i, u;
  for (i = 0; i < spineUrls.length; i++) if (spineUrls[i] === clean) return i;
  for (i = 0; i < spineUrls.length; i++) if (spineUrls[i] === rel) return i;
  for (i = 0; i < spineUrls.length; i++) {   // last resort: a file with the same name
    u = spineUrls[i];
    if (u === tail || u.slice(-(tail.length + 1)) === "/" + tail) return i;
  }
  return -1;
}

// Elements that never hold reading text, and the block elements that are kept whole.
var EPUB_SKIP = { head: 1, script: 1, style: 1, noscript: 1, template: 1, iframe: 1, svg: 1, math: 1, nav: 1, audio: 1, video: 1, canvas: 1, form: 1, select: 1, button: 1 };
var EPUB_BLOCK = { p: "p", pre: "p", h1: "h", h2: "h", h3: "h", h4: "h", h5: "h", h6: "h" };

function epubTag(n) { return String((n && (n.localName || n.nodeName)) || "").toLowerCase(); }

// The words an element holds directly in itself (its own text nodes), before or between its
// block-level children: an <li> with a nested list still has words of its own worth keeping.
// Element children are left to walk(), which pushes each of them exactly once.
function epubLeadText(el, out) {
  var kids = el.childNodes || [], i;
  out = out || [];
  for (i = 0; i < kids.length; i++) if (kids[i].nodeType === 3) out.push(kids[i].nodeValue || "");
  return out.join("");
}

// The inline text of an element: text nodes as written, <br> as a space, skipped subtrees left out.
function epubInlineText(el, out) {
  var kids = el.childNodes || [], i, n;
  for (i = 0; i < kids.length; i++) {
    n = kids[i];
    if (n.nodeType === 3) out.push(n.nodeValue || "");
    else if (n.nodeType === 1 && !EPUB_SKIP[epubTag(n)]) {
      if (epubTag(n) === "br") out.push(" ");
      else epubInlineText(n, out);
    }
  }
  return out.join("");
}

// Does this element hold block-level children of its own? (a <ul> holds <li>, a <li> usually does not)
function epubHasBlockChild(el) {
  var kids = el.childNodes || [], i, t;
  for (i = 0; i < kids.length; i++) {
    if (kids[i].nodeType !== 1) continue;
    t = epubTag(kids[i]);
    if (EPUB_BLOCK[t] || !EPUB_SKIP[t] && t !== "br" && epubHasBlockChild(kids[i]) || /^(p|pre|h[1-6]|div|section|article|aside|main|blockquote|ul|ol|dl|li|dt|dd|table|thead|tbody|tfoot|tr|td|th|figure|figcaption|caption|header|footer|details|summary|html|body)$/.test(t)) return true;
  }
  return false;
}

function epubIdOf(n) {
  var id = "";
  try { id = (n.getAttribute && (n.getAttribute("id") || n.getAttribute("name"))) || ""; } catch (e) {}
  return String(id || n.id || "").trim();
}

// Walk one spine document's body into blocks. Returns null for a document that failed to parse:
// the XML parser's error page is not reading text, and must never become something to type.
function epubBlocksFromRoot(root, norm) {
  var blocks = [];
  if (!root || !root.childNodes) return null;
  if (epubTag(root) === "parsererror") return null;
  if (root.querySelector && root.querySelector("parsererror")) return null;
  var body = (root.querySelector && root.querySelector("body")) || root;
  function push(t, raw, id) {
    var text = norm(raw);
    if (text) blocks.push(id ? { t: t, text: text, id: id } : { t: t, text: text });
  }
  push("p", epubLeadText(body));   // words written straight into the body, outside any element
  (function walk(el) {
    var kids = el.childNodes || [], i, n, t;
    for (i = 0; i < kids.length; i++) {
      n = kids[i];
      if (n.nodeType !== 1) continue;
      t = epubTag(n);
      if (EPUB_SKIP[t]) continue;
      if (EPUB_BLOCK[t]) { push(EPUB_BLOCK[t], epubInlineText(n, []), epubIdOf(n)); continue; }
      if (epubHasBlockChild(n)) { push("p", epubLeadText(n, []), epubIdOf(n)); walk(n); continue; }
      // a container with only inline content (an li, a dd, a stray div, an unknown element): one paragraph
      push("p", epubInlineText(n, []), epubIdOf(n));
    }
  })(body);
  return blocks;
}

// Long paragraphs: split near sentence ends, and at word boundaries as a last resort, never mid-word.
function epubLongPieces(p, max) {
  max = max || 1600;
  var sents = p.match(/[^.!?]+[.!?]+["')\]]*\s*|[^.!?]+$/g) || [p], cur = "", out = [], res = [];
  sents.forEach(function (s) { cur += s; if (cur.length >= 700) { out.push(cur.trim()); cur = ""; } });
  if (cur.trim()) out.push(cur.trim());
  out.forEach(function (t) {
    var k;
    while (t.length > max) {
      k = t.lastIndexOf(" ", max);
      if (k < max * 0.5) k = t.indexOf(" ", max);
      if (k <= 0) break;
      res.push(t.slice(0, k).trim());
      t = t.slice(k).trim();
    }
    if (t) res.push(t);
  });
  return res.length ? res : [p];
}

// Split oversized paragraphs apart, keeping each one's anchor id on its first piece.
function epubExpandBlocks(blocks, max) {
  var out = [];
  (blocks || []).forEach(function (b) {
    if (b.text.length <= (max || 1600) || b.t === "h") { out.push(b); return; }
    epubLongPieces(b.text, max).forEach(function (piece, j) {
      out.push(j === 0 && b.id ? { t: b.t, text: piece, id: b.id } : { t: b.t, text: piece });
    });
  });
  return out;
}

// Pack blocks into typing sections of about `target` characters. A block is never cut in half, so no
// word or sentence can land across a section boundary. secOf[i] = the section number of block i.
function epubPackSections(blocks, target) {
  target = target || 900;
  var sections = [], cur = [], secOf = [], len = 0, i;
  for (i = 0; i < blocks.length; i++) {
    cur.push(blocks[i]); secOf.push(sections.length); len += blocks[i].text.length;
    if (len >= target) { sections.push(cur); cur = []; len = 0; }
  }
  if (cur.length) sections.push(cur);
  return { sections: sections, secOf: secOf };
}

// Chapter list over the finished sections: one entry per text-bearing spine item (part), plus any
// table-of-contents entry that points at an anchor inside one. tidyChapters sorts, dedupes, starts at 0.
function epubChapterList(parts, total, extra) {
  var entries = [];
  parts.forEach(function (s) { if (s.count > 0) entries.push({ p: s.start, title: s.title || "" }); });
  return tidyChapters(entries.concat(extra || []), total);
}

// The directory the table of contents itself lives in ("" at the root, or e.g. "OEBPS/nav").
function epubNavDir(book) {
  var nav = "";
  try { nav = book.packaging.navPath || book.packaging.ncxPath || ""; } catch (e) {}
  var k = nav.lastIndexOf("/");
  return k < 0 ? "" : nav.slice(0, k);
}

// Read one already-opened epub.js book into { sections, chapters, title, author }, or { empty: true }
// when the book has no readable text at all (e.g. it holds only images).
function epubParseBook(book, norm, target) {
  var toc = epubFlattenToc(book.navigation && book.navigation.toc), navDir = epubNavDir(book);
  var items = (book.spine && book.spine.spineItems) || [];
  var spineUrls = items.map(function (it) { return epubHrefKey(String(it.url || it.href || "")); });
  var tocTitle = {};   // spine index -> chapter title from the first table-of-contents entry pointing at it
  toc.forEach(function (t) {
    var si = epubSpineIndexFor(t.href, navDir, spineUrls);
    if (si >= 0 && tocTitle[si] === undefined && t.label) tocTitle[si] = t.label.slice(0, 80);
  });
  var sections = [], parts = [], bySi = {};
  var chain = Promise.resolve();
  items.forEach(function (item, si) {
    chain = chain.then(function () {
      // the navigation document itself, and auxiliary (non-linear) items, are not reading content
      if (item.linear === false) return;
      if (item.properties && item.properties.indexOf("nav") >= 0) return;
      return Promise.resolve().then(function () { return item.load(book.load.bind(book)); }).then(function (contents) {
        var blocks = epubBlocksFromRoot(contents, norm);
        try { item.unload(); } catch (e) {}
        if (!blocks || !blocks.length) return;   // an empty or image-only file in the book: skipped
        blocks = epubExpandBlocks(blocks, 1600);
        var packed = epubPackSections(blocks, target || 900), start = sections.length, idMap = {}, head = "";
        Array.prototype.push.apply(sections, packed.sections);
        blocks.forEach(function (b, bi) { if (b.id && idMap[b.id] === undefined) idMap[b.id] = start + packed.secOf[bi]; });
        blocks.some(function (b) { if (b.t === "h") { head = b.text; return true; } return false; });
        var part = { start: start, count: packed.sections.length, title: (tocTitle[si] || head).slice(0, 80), idMap: idMap };
        bySi[si] = part; parts.push(part);
      }).catch(function () { /* one unreadable file must not lose the rest of the book */ });
    });
  });
  return chain.then(function () {
    if (!sections.length) return { empty: true };
    var anchors = [];   // contents entries with #anchors become chapters at the section holding that anchor
    toc.forEach(function (t) {
      var at = String(t.href).indexOf("#"), si, frag, p;
      if (at < 0) return;
      si = epubSpineIndexFor(t.href, navDir, spineUrls);
      if (si < 0 || !bySi[si]) return;
      frag = String(t.href).slice(at + 1);
      try { frag = decodeURIComponent(frag); } catch (e) {}
      p = bySi[si].idMap[frag];
      if (p !== undefined) anchors.push({ p: p, title: t.label || "" });
    });
    var meta = (book.packaging && book.packaging.metadata) || {};
    return {
      sections: sections,
      chapters: epubChapterList(parts, sections.length, anchors),
      title: String(meta.title || "").replace(/\s+/g, " ").trim().slice(0, 120),
      author: String(meta.creator || "").replace(/\s+/g, " ").trim().slice(0, 60)
    };
  });
}

// The table of contents loads alongside the opening, but `opened` does not wait for it. Chapter
// titles and #anchor entries come from it, so give it a moment: never forever, because a book with
// a broken navigation file would otherwise hang the import (and its failure must not reject either).
function epubWaitNav(book, ms) {
  return Promise.race([
    Promise.resolve(book.loaded && book.loaded.navigation).catch(function () { return null; }),
    new Promise(function (r) { setTimeout(function () { r(null); }, ms || 2500); })
  ]);
}

// Read an EPUB from its bytes. Rejects with { epubInvalid: true } when the file cannot be an EPUB.
function epubRead(buf, norm, target) {
  var head = new Uint8Array(buf, 0, Math.min(4, buf.byteLength));
  if (!(head[0] === 0x50 && head[1] === 0x4b)) return Promise.reject({ epubInvalid: true });   // not even a zip
  var book = ePub(undefined, { replacements: "none" });
  return book.open(buf).then(function () {
    // opening settles after the book is unpacked; a broken navigation file must not hang the import
    return Promise.race([Promise.resolve(book.opened), new Promise(function (r) { setTimeout(function () { r(null); }, 8000); })]);
  }).then(function () {
    return epubWaitNav(book);
  }).then(function () {
    return epubParseBook(book, norm, target);
  }).then(function (r) {
    try { book.destroy(); } catch (e) {}
    return r;
  }, function (e) {
    try { book.destroy(); } catch (e2) {}
    throw (e && e.epubInvalid) ? e : { epubInvalid: true, cause: e };
  });
}

// Open an EPUB just long enough to run fn(book), then always destroy it (used for cover and details).
function epubWithBook(buf, fn) {
  var book = ePub(undefined, { replacements: "none" });
  return book.open(buf).then(function () {
    return Promise.race([Promise.resolve(book.opened), new Promise(function (r) { setTimeout(function () { r(null); }, 8000); })]);
  }).then(function () {
    return epubWaitNav(book);
  }).then(function () {
    return fn(book);
  }).then(function (r) {
    try { book.destroy(); } catch (e) {}
    return r;
  }, function (e) {
    try { book.destroy(); } catch (e2) {}
    throw e;
  });
}

// A small cover picture from the book's own cover image, or "" when there is none.
function epubCoverOf(book) {
  return Promise.resolve().then(function () { return book.coverUrl ? book.coverUrl() : null; }).then(function (url) {
    if (!url || typeof Image === "undefined") return "";
    return new Promise(function (resolve) {
      var img = new Image();
      img.onload = function () {
        try {
          var w = img.naturalWidth || img.width || 0, h = img.naturalHeight || img.height || 0, k, cv;
          if (!w || !h) return resolve("");
          k = Math.min(1, 200 / w);
          cv = document.createElement("canvas");
          cv.width = Math.max(1, Math.round(w * k)); cv.height = Math.max(1, Math.round(h * k));
          cv.getContext("2d").drawImage(img, 0, 0, cv.width, cv.height);
          resolve(cv.toDataURL("image/jpeg", 0.72));
        } catch (e) { resolve(""); }
      };
      img.onerror = function () { resolve(""); };
      img.src = url;
    });
  }).catch(function () { return ""; });
}

function epubErr(e) {
  if (!e) return "";
  if (e.epubInvalid) return "This file is not a valid EPUB, or it is damaged.";
  if (e.epubEmpty) return "This EPUB opened, but it has no readable text in it (its pages may be images only).";
  var m = String((e && e.message) || e);
  if (/File not found in the epub/i.test(m)) return "Some of the files inside this EPUB are missing, so it could not be opened.";
  return "Could not read that file. Is it a valid EPUB?";
}
function epubErrShort(e) {
  if (e && e.epubInvalid) return "not a valid EPUB";
  if (e && e.epubEmpty) return "no readable text";
  return "could not be read";
}

export { epubHash, epubFlattenToc, epubResolveRel, epubHrefKey, epubSpineIndexFor, epubTag, epubLeadText, epubInlineText, epubHasBlockChild, epubIdOf, epubBlocksFromRoot, epubLongPieces, epubExpandBlocks, epubPackSections, epubChapterList, epubNavDir, epubParseBook, epubWaitNav, epubRead, epubWithBook, epubCoverOf, epubErr, epubErrShort };
