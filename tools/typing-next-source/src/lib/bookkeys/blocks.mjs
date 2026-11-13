/**
 * Pure Bookkeys text, chapter and local reward helpers.
 * Extracted verbatim from the preserved production source blob 310da8014c6c1ca9c80a75bce89b4ff1b2aa1e28.
 * Keep production and this module in parity until the migration cutover is explicitly approved.
 */
var PUNCT_EXACT = false;   // Settings > Text > Quotes and dashes
function normalize(s) {
  s = s.normalize("NFC");   // an accented letter is always one character, however the PDF stored it
  if (!PUNCT_EXACT) s = s.replace(/[‘’‛]/g, "'").replace(/[“”‟]/g, '"').replace(/[–—−]/g, "-").replace(/…/g, "...");
  return s
    .replace(/­/g, "")
    .replace(/ﬀ/g, "ff").replace(/ﬁ/g, "fi").replace(/ﬂ/g, "fl")
    .replace(/ﬃ/g, "ffi").replace(/ﬄ/g, "ffl")
    .replace(/[  -​  ]/g, " ")
    .replace(/\s+/g, " ").trim();
}

// Group PDF text items into visual lines, keeping each line's position and font size.
function extractLines(items, yMin) {
  var lines = [], cur = null, prev = null;
  function close() {
    if (!cur) return;
    var text = cur.text.replace(/\s+/g, " ").trim();
    var best = 0, size = 0, total = 0, k;
    for (k in cur.sizes) { total += cur.sizes[k]; if (cur.sizes[k] > best) { best = cur.sizes[k]; size = parseFloat(k); } }
    if (text && size) lines.push({ text: text, y: cur.y - yMin, x: cur.x, right: cur.right, size: size, chars: total });
    cur = null;
  }
  items.forEach(function (it) {
    if (typeof it.str !== "string") return;
    var tr = it.transform, size = Math.abs(tr[3]) || it.height || 10, x = tr[4], y = tr[5];
    var blank = !it.str.trim();
    if (cur) {
      var newLine = Math.abs(y - cur.y) > 0.45 * Math.max(size, cur.maxSize) || (prev && prev.hasEOL) || (!blank && x < cur.lastX - 2 * size);
      if (newLine) close();
    }
    if (!cur) {
      if (blank) { prev = it; return; }
      cur = { text: "", y: y, x: x, right: x, sizes: {}, maxSize: size, lastEnd: x, lastX: x };
    }
    var gap = x - cur.lastEnd;
    if (cur.text && gap > 0.15 * size && !/\s$/.test(cur.text) && !/^\s/.test(it.str)) cur.text += " ";
    cur.text += it.str;
    if (!blank) {
      var key = Math.round(size * 2) / 2;
      cur.sizes[key] = (cur.sizes[key] || 0) + it.str.trim().length;
      if (size > cur.maxSize) cur.maxSize = size;
    }
    cur.lastX = x; cur.lastEnd = x + (it.width || 0);
    if (cur.lastEnd > cur.right) cur.right = cur.lastEnd;
    prev = it;
  });
  close();
  return lines;
}

function median(a) {
  if (!a.length) return 0;
  var s = a.slice().sort(function (p, q) { return p - q; });
  return s[Math.floor(s.length / 2)];
}

// Turn lines into blocks: { t: "h" | "p", text }. Headings keep their own line, paragraphs are rejoined.
function blocksFromLines(lines, bodySize, pageH) {
  lines = lines.filter(function (L) {
    var edge = L.y > pageH * 0.95 || L.y < pageH * 0.05;
    var outer = L.y > pageH * 0.85 || L.y < pageH * 0.15;
    if (edge && L.text.length < 70) return false;
    if (outer && /^\d{1,4}$/.test(L.text)) return false;
    return true;
  });
  if (!lines.length) return [];
  if (!bodySize) {
    var hist = {}, best = 0;
    lines.forEach(function (L) { hist[L.size] = (hist[L.size] || 0) + L.chars; });
    for (var k in hist) if (hist[k] > best) { best = hist[k]; bodySize = parseFloat(k); }
  }
  var bodyLines = lines.filter(function (L) { return L.size <= bodySize * 1.1 && L.size >= bodySize * 0.85; });
  if (!bodyLines.length) bodyLines = lines;
  var minX = Infinity, maxW = 0;
  bodyLines.forEach(function (L) { if (L.x < minX) minX = L.x; if (L.right - L.x > maxW) maxW = L.right - L.x; });
  var gaps = [];
  for (var i = 1; i < lines.length; i++) {
    var g = lines[i - 1].y - lines[i].y;
    if (g > 0 && g < bodySize * 3 && Math.abs(lines[i].size - bodySize) < bodySize * 0.15 && Math.abs(lines[i - 1].size - bodySize) < bodySize * 0.15) gaps.push(g);
  }
  var leading = median(gaps) || bodySize * 1.3;

  // Columns: a line that sits well ABOVE the one before it starts a new column. Each column has its own left edge and width.
  var segN = 0, segMin = [], segW = [];
  lines.forEach(function (L, i) {
    if (i > 0 && L.y - lines[i - 1].y > leading * 2) segN++;
    L.seg = segN;
  });
  bodyLines.forEach(function (L) {
    if (L.seg === undefined) return;
    if (segMin[L.seg] === undefined || L.x < segMin[L.seg]) segMin[L.seg] = L.x;
    if (!(segW[L.seg] >= L.right - L.x)) segW[L.seg] = L.right - L.x;
  });
  function colMin(L) { return segMin[L.seg] !== undefined ? segMin[L.seg] : minX; }
  function colW(L) { return segW[L.seg] !== undefined ? segW[L.seg] : maxW; }

  var blocks = [], cur = null, prevL = null;
  lines.forEach(function (L) {
    var caps = L.text.length <= 70 && /[A-Z]/.test(L.text) && L.text === L.text.toUpperCase() && !/[.,;]$/.test(L.text) && L.size >= bodySize * 0.95;
    var isHead = L.size > bodySize * 1.15 || caps;
    var type = isHead ? "h" : "p";
    var gap = prevL ? prevL.y - L.y : 0;
    var startNew;
    if (!cur || type !== cur.t) startNew = true;
    else if (type === "h") startNew = gap > L.size * 1.9 || Math.abs(L.size - prevL.size) > 0.5;
    else {
      var indent = L.x - colMin(L) > bodySize * 0.8;
      var ended = /[.!?"')\]:]$/.test(cur.text);
      var prevShort = prevL && (prevL.right - prevL.x) < colW(prevL) * 0.7;
      startNew = gap > leading * 1.4 || (indent && ended) || (prevShort && ended);
    }
    if (startNew) {
      cur = { t: type, text: L.text };
      blocks.push(cur);
    } else if (cur.t === "p" && /[A-Za-z]-$/.test(cur.text) && /^[a-z]/.test(L.text)) {
      cur.text = cur.text.slice(0, -1) + L.text;
    } else {
      cur.text += " " + L.text;
    }
    prevL = L;
  });
  blocks.forEach(function (b) { b.text = normalize(b.text); });
  return blocks.filter(function (b) { return b.text; });
}

// Pasted text: blank lines separate paragraphs; long ones are split near sentence ends.
function pagesFromText(raw) {
  var paras = raw.replace(/\r/g, "").split(/\n\s*\n/).map(normalize).filter(Boolean);
  var blocks = [];
  paras.forEach(function (p) {
    if (p.length <= 1200) { blocks.push({ t: "p", text: p }); return; }
    var sents = p.match(/[^.!?]+[.!?]+["')\]]*\s*|[^.!?]+$/g) || [p], cur = "";
    sents.forEach(function (s) { cur += s; if (cur.length >= 700) { blocks.push({ t: "p", text: cur.trim() }); cur = ""; } });
    if (cur.trim()) blocks.push({ t: "p", text: cur.trim() });
  });
  var pages = [], page = [], len = 0;
  blocks.forEach(function (b) {
    page.push(b); len += b.text.length;
    if (len >= 900) { pages.push(page); page = []; len = 0; }
  });
  if (page.length) pages.push(page);
  return pages;
}
// ----- chapters: pure helpers -----
var CH_WORDS = "one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty";
var CH_RE = new RegExp("^(chapter|part|book)\\s+(\\d{1,3}|[ivxlc]{1,8}|" + CH_WORDS + ")(?![a-z0-9])\\s*[.:)\\-]*\\s*(.*)$", "i");
var ROMAN_RE = /^c{0,2}(xc|xl|l?x{0,3})(ix|iv|v?i{0,3})$/i;
function chNumOk(tok) {
  if (/^\d+$/.test(tok)) return parseInt(tok, 10) > 0;
  if (new RegExp("^(" + CH_WORDS + ")$", "i").test(tok)) return true;
  return ROMAN_RE.test(tok);
}
function chNumKey(tok) { return /^\d+$/.test(tok) ? String(parseInt(tok, 10)) : tok.toLowerCase(); }

// Chapter-looking lines on one page. Rejects dot-leader contents lines, page-edge running headers,
// and ordinary sentences that merely start with "Chapter 7".
function chapterHeadsOnPage(lines, bodySize, pageH) {
  var out = [], i, L, t, m, rest, words, caps, big, titleCase, nx, title;
  for (i = 0; i < lines.length; i++) {
    L = lines[i]; t = normalize(L.text);
    if (!t || t.length > 70) continue;
    if (pageH && (L.y > pageH * 0.95 || L.y < pageH * 0.04)) continue;
    if (/\.{3,}|(\. ){3,}/.test(t)) continue;
    m = CH_RE.exec(t);
    if (!m || !chNumOk(m[2])) continue;
    rest = m[3].trim();
    if (/\s\d{1,4}$/.test(rest)) continue;
    words = rest ? rest.split(" ") : [];
    caps = t === t.toUpperCase();
    big = !!bodySize && L.size > bodySize * 1.1;
    titleCase = words.length <= 6 && words.every(function (w) { return w.length <= 3 || /^[A-Z"'(\d]/.test(w); });
    if (!(big || caps || !rest || titleCase)) continue;
    title = t.replace(/[\s.:\-]+$/, "");
    nx = lines[i + 1];
    if (!rest && nx && /[A-Za-z]/.test(nx.text) && Math.abs(L.y - nx.y) < L.size * 3.5 && nx.text.length <= 50 &&
        !CH_RE.test(normalize(nx.text)) && (Math.abs(nx.size - L.size) < 0.6 || nx.text === nx.text.toUpperCase())) {
      title += ": " + normalize(nx.text).replace(/[\s.]+$/, "");
    }
    out.push({ key: m[1].toLowerCase() + " " + chNumKey(m[2]), title: title.slice(0, 80), y: L.y });
  }
  return out;
}

// Sort, drop duplicates and out-of-range pages, and make sure the first chapter starts on page 1 (index 0).
function tidyChapters(entries, n) {
  var seen = {}, out = [];
  entries.filter(function (e) { return isFinite(e.p) && e.p >= 0 && e.p < n; })
    .map(function (e, i) { return { p: e.p, title: e.title || "", i: i }; })
    .sort(function (a, b) { return a.p - b.p || a.i - b.i; })
    .forEach(function (e) { if (!seen[e.p]) { seen[e.p] = 1; out.push({ p: e.p, title: e.title }); } });
  if (out.length && out[0].p > 0) out.unshift({ p: 0, title: "Beginning" });
  return withRequirements(out);
}

// pageHeads[p] = chapterHeadsOnPage(...) for page p. Returns [] when it does not look like a real chapter list.
function pickChapters(pageHeads, n) {
  var byKey = {}, picks = [], p, k, occ, keep;
  for (p = 0; p < n; p++) {
    var h = pageHeads[p] || [];
    if (h.length >= 3) continue;                       // a contents page lists many chapters at once
    h.forEach(function (x) { (byKey[x.key] = byKey[x.key] || []).push({ p: p, title: x.title }); });
  }
  for (k in byKey) {
    occ = byKey[k];
    if (occ.length === 1) keep = occ[0];
    else if (occ.length === 2 && occ[1].p - occ[0].p > 1) keep = occ[1];   // contents entry first, real heading later
    else keep = occ[0];                                // repeated on many pages: a running header, keep where it first appears
    picks.push(keep);
  }
  if (picks.length < 2 || picks.length > Math.max(3, n / 2)) return [];
  return tidyChapters(picks, n);
}

// Fallback: even sections of about 20 pages. An empty title means "show the page range".
function evenChapters(n) {
  var count = Math.max(1, Math.round(n / 20)), per = Math.ceil(n / count), out = [], p;
  for (p = 0; p < n; p += per) out.push({ p: p, title: "", req: true });
  return out;
}

// ----- required chapters and optional sections -----
// A section is "required" when it is an actual narrative chapter, and "optional" when it is front
// or back matter (contents, copyright, dedication, preface, appendix ...). These are sensible
// defaults the reader can change for any section, never rules. A leading numbering is understood,
// so both "12. Kalidasa" and "I. The Palace" are chapters, while "12. Notes" is still back matter.
var SECTION_OPTIONAL = [
  "cover", "title page", "half title", "frontispiece", "copyright", "publication",
  "contents", "table of contents", "list of illustrations", "list of figures", "list of plates",
  "list of maps", "list of tables", "epigraph", "dedication", "foreword", "preface",
  "acknowledgements", "acknowledgments", "introduction", "prologue", "epilogue", "afterword",
  "appendix", "appendices", "glossary", "bibliography", "references", "sources", "endnotes",
  "notes", "footnotes", "index", "author's note", "authors note", "about the author",
  "about the authors", "about the editors", "about the contributors", "also by", "colophon",
  "errata", "abbreviations", "chronology", "timeline", "cast of characters", "dramatis personae",
  "translator's note", "translator's preface", "editor's note", "editor's preface",
  "publisher's note", "a note on the text", "a note on the translation", "how to use this book"
];
// A heading with a leading "Chapter 3" / "12." / "IV" marker taken off, so what is matched against
// the list above is the name of the section itself.
function sectionBody(title) {
  var t = normalize(String(title || "")).toLowerCase();
  var m = t.match(/^(?:(?:chapter|part|book|volume|vol|section|act|scene|canto|letter)\s+)?(?:[0-9]{1,4}|[ivxlcdm]{1,7})(?=\s|$|[.):,\-])[\s.):,\-]*/);
  return m ? t.slice(m[0].length) : t;
}
// Does a heading name an actual chapter (required by default) or front/back matter (optional)?
function sectionRequired(title) {
  var t = normalize(String(title || "")).toLowerCase(), body, forms, i, w;
  if (!t) return true;                                                        // an untitled section (an even split) is required
  if (/^[0-9]{1,4}$/.test(t) || /^[ivxlcdm]{1,7}$/.test(t)) return true;      // "12" or "IV" on its own is a chapter
  body = sectionBody(t) || t;
  forms = [body, body.replace(/^(?:the|a|an)\s+/, "")];
  for (i = 0; i < SECTION_OPTIONAL.length; i++) {
    w = SECTION_OPTIONAL[i];
    if (forms.some(function (f) { return f === w || f.indexOf(w + " ") === 0 || f.indexOf(w + ":") === 0 || f.indexOf(w + ",") === 0; })) return false;
  }
  return true;
}
// The default for one entry: the pages before a book's first chapter are front matter.
function defaultReq(c) { return (c.p === 0 && c.title === "Beginning") ? false : sectionRequired(c.title); }
// Give a chapter list its required/optional defaults, keeping any choice already made.
function withRequirements(list) {
  return list.map(function (c) { return { p: c.p, title: c.title || "", req: typeof c.req === "boolean" ? c.req : defaultReq(c) }; });
}

// ----- game: pure helpers -----
function xpToReach(L) { return L <= 1 ? 0 : 400 * (L - 1) + 50 * (L - 1) * (L - 2); }
function levelForXp(xp) { var L = 1; while (xpToReach(L + 1) <= xp) L++; return L; }
var RANKS = ["Novice Typist", "Page Turner", "Keystroke Cadet", "Wordsmith", "Scribe", "Chronicler", "Bookwright", "Loremaster", "Grand Archivist", "Typing Legend"];
function rankForLevel(L) { return RANKS[Math.min(RANKS.length - 1, Math.floor((L - 1) / 5))]; }
// Accuracy is correct keystrokes / all keystrokes, shown as a whole percent (half rounds up). The band uses that shown percent.
function accPct(ok, all) { return all ? Math.round(ok * 100 / all) : 100; }
function accMult(pct) { return pct >= 98 ? 125 : pct >= 95 ? 110 : pct >= 85 ? 100 : 80; }   // percent multipliers: 98+ x1.25, 95-97 x1.1, 85-94 x1, below 85 x0.8
// words are rounded first, then XP = words x multiplier rounded half up (whole-number maths, no floating point)
function pageXp(words, pct) { return Math.floor((words * accMult(pct) + 50) / 100); }
function chapterXp(pages) { return Math.min(1500, 40 + 25 * pages); }
function bookXp(pages) { return Math.min(25000, 300 + 40 * pages); }
function dayKey(d) { return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2); }
function streakStep(st, today, yest) {
  if (st.last === today) return { cur: st.cur, best: st.best, last: today };
  var cur = st.last === yest ? st.cur + 1 : 1;
  return { cur: cur, best: Math.max(st.best, cur), last: today };
}
// Every reward has an id: p = a page, c = a chapter (by its first page), b = a whole book. An id is paid at most once.
function rewardId(kind, bookKey, n) { return kind + ":" + bookKey + (n === undefined ? "" : ":" + n); }
// A reward may be paid only when its id has never been paid in the saved record and the caller's own marker agrees.
function payable(paid, id, alreadyPaid) { return !!paid && paid[id] === undefined && !alreadyPaid; }
// Short fingerprint of a page's text, to be sure a saved draft belongs to exactly this text.
function textSig(t) { var h = 5381, i; for (i = 0; i < t.length; i++) h = ((h * 33) ^ t.charCodeAt(i)) >>> 0; return t.length + ":" + h.toString(36); }
function newGame() {
  return { paid: {}, check: null, base: { n: 0, sum: 0 }, bestPct: 0, beat5: 0, up20: 0, pro60: 0, vir80: 0, recs: 0, hund: 0, sessMax: 0, bigBook: 0, flawlessCh: 0, xp: 0, words: 0, chars: 0, pages: 0, chapters: 0, books: 0, bestWpm: 0, perfect: 0, run: 0, bestRun: 0,
    streak: { cur: 0, best: 0, last: "" }, days: 0, day: { d: "", w: 0 }, bestDay: 0, night: 0, early: 0, ach: {}, book: {} };
}
var ACH = [];
(function () {
  // The first 43: one name each (the same in dark and light). Ids never change, so unlocked achievements stay unlocked.
  function add(cat, m, list) { list.forEach(function (x) { ACH.push({ id: m + x[0], cat: cat, m: m, t: x[0], name: x[1], desc: x[2] }); }); }
  // The 17 new ones: [id, counter, target, dark-mode name, light-mode name, requirement, icon]
  function addTwo(cat, list) { list.forEach(function (x) { ACH.push({ id: x[0], cat: cat, m: x[1], t: x[2], dn: x[3], ln: x[4], desc: x[5], icon: x[6] || "" }); }); }
  add("Words", "words", [[500, "First Inscription", "Type 500 words"], [5000, "Scribe's Initiation", "Type 5,000 words"], [25000, "Keeper of Tomes", "Type 25,000 words"], [100000, "Master of the Quill", "Type 100,000 words"], [500000, "Walking Archive", "Type 500,000 words"]]);
  add("Letters", "chars", [[10000, "Ten Thousand Sigils", "Type 10,000 letters"], [100000, "Hundred Thousand Runes", "Type 100,000 letters"], [1000000, "Millionfold Inscription", "Type 1,000,000 letters"]]);
  add("Pages", "pages", [[10, "Page Initiate", "Finish 10 pages"], [100, "Hundredfold Record", "Finish 100 pages"], [1000, "Thousandfold Chronicle", "Finish 1,000 pages"]]);
  add("Chapters", "chapters", [[1, "Chapter of Awakening", "Finish 1 chapter"], [5, "Seeker of Chapters", "Finish 5 chapters"], [25, "Chapter Conqueror", "Finish 25 chapters"], [100, "Chronicler of Legends", "Finish 100 chapters"]]);
  add("Books", "books", [[1, "Tome Completed", "Finish 1 book"], [3, "Keeper of Three Tomes", "Finish 3 books"], [10, "Seeker of Knowledge", "Finish 10 books"], [25, "Curator of the Archive", "Finish 25 books"]]);
  add("Speed", "bestWpm", [[40, "Steady Hand", "Finish a page at 40 WPM"], [60, "Swift Inscription", "Finish a page at 60 WPM"], [80, "Windborne Quill", "Finish a page at 80 WPM"], [100, "Hundredfold Velocity", "Finish a page at 100 WPM"], [120, "Lightning Inscription", "Finish a page at 120 WPM"]]);
  add("Accuracy", "perfect", [[1, "Unblemished Manuscript", "Finish a page at 100% accuracy"], [10, "Path of Perfection", "Finish 10 pages at 100% accuracy"], [50, "Immaculate Inscription", "Finish 50 pages at 100% accuracy"]]);
  add("Accuracy", "bestRun", [[5, "Fivefold Purification", "Finish 5 new pages consecutively at 98%+ accuracy"], [20, "Twentyfold Purification", "Finish 20 new pages consecutively at 98%+ accuracy"]]);
  add("Streaks", "streak", [[3, "Three-Day Vigil", "Practise 3 consecutive days"], [7, "Seven-Day Vigil", "Practise 7 consecutive days"], [14, "Fourteen-Day Vigil", "Practise 14 consecutive days"], [30, "Thirty-Day Vigil", "Practise 30 consecutive days"], [100, "Unbroken Vigil", "Practise 100 consecutive days"]]);
  add("Endurance", "bestDay", [[1000, "Daily Inscription", "Type 1,000 words in one day"], [5000, "Extended Ritual", "Type 5,000 words in one day"], [15000, "Grand Ritual", "Type 15,000 words in one day"]]);
  add("Levels", "level", [[5, "Sequence Advancement V", "Reach level 5"], [10, "Sequence Advancement X", "Reach level 10"], [25, "Sequence Advancement XXV", "Reach level 25"], [50, "Sequence Advancement L", "Reach level 50"]]);
  add("Time of day", "night", [[1, "Midnight Scribe", "Finish a new page between midnight and 5 AM"]]);
  add("Time of day", "early", [[1, "Dawn Scribe", "Finish a new page between 5 AM and 8 AM"]]);
  addTwo("Improvement and personal records", [
    ["beat5", "beat5", 1, "First Breakthrough", "A Step Beyond", "Beat previous best speed by 5 WPM"],
    ["up20", "up20", 1, "Ascendant Proficiency", "Rising Star", "Improve speed by 20 WPM over baseline"],
    ["pro60", "pro60", 1, "Precision Under Pressure", "Grace Under Pressure", "Finish at 60+ WPM and 98%+ accuracy"],
    ["vir80", "vir80", 1, "Master of the Manuscript", "Virtuoso of the Quill", "Finish at 80+ WPM and 100% accuracy"],
    ["recs", "recs", 1, "Beyond Your Limits", "Beyond the Horizon", "Set new speed and accuracy records on one page"]]);
  addTwo("Endurance and discipline", [
    ["bestDay10000", "bestDay", 10000, "Relentless Scribe", "Tireless Traveler", "Type 10,000 words in one day"],
    ["bestDay25000", "bestDay", 25000, "Grand Marathon", "Epic Journey", "Type 25,000 words in one day"],
    ["sessMax10", "sessMax", 10, "Unbroken Focus", "A Day of Discovery", "Complete 10 pages in one session"],
    ["days30", "days", 30, "Return to the Archive", "Thirty Days of Wonder", "Practise on 30 distinct days"]]);
  addTwo("Mastery and completion", [
    ["books5", "books", 5, "Scholar's Journey", "Tales of Five Journeys", "Finish 5 books"],
    ["books50", "books", 50, "Keeper of the Collection", "Curator of Wonders", "Finish 50 books"],
    ["bigBook1", "bigBook", 1, "The Long Chronicle", "An Epic Tale", "Finish a book of at least 100 pages"],
    ["flawlessCh1", "flawlessCh", 1, "Flawless Chapter", "A Chapter Perfected", "Finish every page of a chapter at 100% accuracy"]]);
  addTwo("Rare feats", [["hund1", "hund", 1, "The Hundredfold Standard", "A Hundredfold Triumph", "Finish at 100 WPM and 100% accuracy"]]);
  addTwo("The Eternal Record", [
    ["words1000000", "words", 1000000, "The Eternal Record: First Inscription", "A Thousand Thousand Words", "Reach 1,000,000 total words", "er1"],
    ["words10000000", "words", 10000000, "The Eternal Record: Thousandfold Legacy", "A Legacy in Ten Million Words", "Reach 10,000,000 total words", "er2"],
    ["words100000000", "words", 100000000, "The Eternal Record: Immortal Chronicle", "The Chronicle Beyond Time", "Reach 100,000,000 total words", "er3"]]);
})();
// Dark mode shows the dark names, light mode the light names (only the 17 new ones have two versions).
function achName(a, dark) { return a.dn ? (dark ? a.dn : a.ln) : a.name; }
function achValue(g, m) { return m === "level" ? levelForXp(g.xp) : m === "streak" ? g.streak.best : g[m] || 0; }
// Time of Day: morning 06:00-16:59, evening 17:00-19:59, night 20:00-05:59 (the computer's clock)
function todScene(h) { return (h >= 20 || h < 6) ? "pic-night" : h >= 17 ? "pic-evening" : "pic-morning"; }

export { normalize, extractLines, median, blocksFromLines, pagesFromText, chNumOk, chNumKey, chapterHeadsOnPage, tidyChapters, pickChapters, evenChapters, sectionBody, sectionRequired, defaultReq, withRequirements, xpToReach, levelForXp, rankForLevel, accPct, accMult, pageXp, chapterXp, bookXp, dayKey, streakStep, rewardId, payable, textSig, newGame, achName, achValue, todScene, RANKS, ACH, SECTION_OPTIONAL };
