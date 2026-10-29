// ------------------------------------------------------------------
// MT201 content sync — turns the MT201 Thermodynamics MCQ bank (the
// standalone JS bank in the 201Thermo course folder) into per-chapter
// JSON the archive app fetches at runtime.
//
//   node scripts/sync-mt201.mjs [path\to\mt201-bank.js]
//
// Source of truth stays the JS bank on disk; re-run after edits.
//
// Conversions applied on the way in:
//   \( x \)   ->  $ x $        (the site's markdown maths delimiters)
//   \[ x \]   ->  $$ x $$      (defensive; the bank currently has none)
//   <i>x</i>  ->  *x*          (HTML is escaped by the site's renderer)
//   <b>x</b>  ->  **x**
//   bank trap text -> a :::warning container inside the detailed solution
// ------------------------------------------------------------------

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC =
  process.argv[2] ??
  "C:\\Users\\DELL\\OneDrive\\Desktop\\MT3rdSem\\201Thermo\\mt201-bank.js";
const OUT = path.join(__dirname, "..", "public", "data", "mt201");

if (!fs.existsSync(SRC)) {
  console.error("Bank file not found:", SRC);
  process.exit(1);
}

const B = String.fromCharCode(92); // backslash
const M_OPEN = B + "(";
const M_CLOSE = B + ")";
const D_OPEN = B + "[";
const D_CLOSE = B + "]";

// ------------------------------------------------------- topic chapters
// Order + titles mirror the standalone player's TOPICS list.
const TOPICS = [
  ["fundamentals", "Foundations & System Concepts"],
  ["zeroth", "Zeroth Law & Temperature"],
  ["first", "First Law, Work & Internal Energy"],
  ["enthalpy", "Enthalpy & Heat Capacity"],
  ["thermo", "Thermochemistry & Hess's Law"],
  ["second", "Second Law & Entropy"],
  ["third", "Third Law & Absolute Entropy"],
  ["freeenergy", "Free Energy, Maxwell & Gibbs-Helmholtz"],
  ["chemical", "Chemical Potential, Gibbs-Duhem, Activity & Fugacity"],
  ["solutions", "Solutions, Regular/Sub-regular & Spinodal"],
  ["ellingham", "Ellingham Diagrams & Reduction"],
  ["phase", "Phase Equilibria & Clausius-Clapeyron"],
  ["sieverts", "Gases in Metals (Sieverts) & Equilibrium"],
  ["info", "Entropy, Information & Landauer"],
];

// Bank type names -> single-letter chips (mt201's own TYPE_NAMES map).
const TYPE_MAP = {
  Direct: "A",
  Statement: "B",
  "Assertion-Reason": "C",
  "Assertion\u2013Reason": "C", // en-dash variant
  Match: "D",
  Numerical: "E",
  "True/False": "F",
};

const LABELS = ["a", "b", "c", "d", "e", "f"];

// ------------------------------------------------------- conversion

function conv(s) {
  if (!s) return "";
  let t = String(s);
  // maths delimiters first, then HTML formatting tags -> markdown
  t = t.split(D_OPEN).join("$$").split(D_CLOSE).join("$$");
  t = t.split(M_OPEN).join("$").split(M_CLOSE).join("$");
  t = t.replace(/<i>([\s\S]*?)<\/i>/g, "*$1*");
  t = t.replace(/<b>([\s\S]*?)<\/b>/g, "**$1**");
  return t.trim();
}

const TAG_RE = /<\/?[a-z]/; // html tags are lowercase in this bank

function detailBody(q) {
  const parts = [];
  if (q.exp) parts.push(conv(q.exp));
  if (q.trap) parts.push(":::warning \u26a0 Watch out\n" + conv(q.trap) + "\n:::");
  return parts.join("\n\n");
}

// ------------------------------------------------------- load the bank

globalThis.window = {};
await import(pathToFileURL(SRC).href);
const BANK = globalThis.window.MT201_BANK;
if (!Array.isArray(BANK) || !BANK.length) {
  console.error("Bank loaded but window.MT201_BANK is empty/missing.");
  process.exit(1);
}

fs.mkdirSync(OUT, { recursive: true });

let problems = 0;
const flag = (msg) => {
  console.log("  !! " + msg);
  problems++;
};

const summary = [];
let totalQ = 0;

for (let c = 0; c < TOPICS.length; c++) {
  const [key, title] = TOPICS[c];
  const id = "ch" + String(c + 1).padStart(2, "0");
  const qs = BANK.filter((q) => q.topic === key).sort((a, b) => a.n - b.n);
  if (!qs.length) {
    flag(`${key}: no questions found in bank`);
    continue;
  }

  const questions = qs.map((q, i) => {
    const n = i + 1;
    if (q.n !== n) console.log(`  note: ${key} renumbered ${q.n} -> ${n}`);

    const type = TYPE_MAP[q.type] ?? "A";
    if (!TYPE_MAP[q.type]) flag(`${key}:${q.n} unknown type "${q.type}"`);

    const options = (q.opts ?? []).map((o, k) => ({ label: LABELS[k], text: conv(o) }));
    const answer = LABELS[q.ans];
    const detailed = detailBody(q);

    if (options.length < 2) flag(`${key}:${n} only ${options.length} options`);
    if (!options.some((o) => o.label === answer)) flag(`${key}:${n} answer "${answer}" not among options`);
    if (!detailed) flag(`${key}:${n} empty detailed solution`);
    for (const [where, s] of [
      ["text", conv(q.q)],
      ["detailed", detailed],
      ...options.map((o, k) => ["opt" + k, o.text]),
    ]) {
      // strip $...$ maths before the tag hunt: "$P_2<P_1$" is not a tag
      const proseOnly = s.replace(/\$\$[\s\S]*?\$\$|\$[^$\n]+?\$/g, "");
      if (TAG_RE.test(proseOnly) || s.includes(M_OPEN) || s.includes(M_CLOSE)) {
        flag(`${key}:${n} ${where} has unconverted markup: ${s.slice(0, 70)}`);
      }
    }

    return {
      n,
      stars: q.stars ?? 0,
      type,
      traps: [],
      text: conv(q.q),
      statements: (q.statements ?? []).map((s) => ({ num: s.n, text: conv(s.t) })),
      tableRows: (q.tableRows ?? []).map((r) => r.map((c) => conv(c))),
      assertion: conv(q.assertion),
      reason: conv(q.reason),
      options,
      answer,
      keyExplanation: "",
      concise: "",
      detailed,
    };
  });

  totalQ += questions.length;
  const chapter = { id, num: c + 1, title, topics: [], questions };
  fs.writeFileSync(path.join(OUT, `${id}.json`), JSON.stringify(chapter));
  summary.push({ id, title, count: questions.length });
}

const index = {
  course: "MT201 \u2014 Metallurgical Thermodynamics",
  generated: new Date().toISOString().slice(0, 10),
  total: totalQ,
  chapters: summary,
};
fs.writeFileSync(path.join(OUT, "index.json"), JSON.stringify(index, null, 2));

// Limitless durable authored question overrides — reapplied after external bank sync.
const revisionOverridePath = path.join(__dirname, "..", "content-revisions", "mt201.json");
const revisionHash = (value) => { let h = 2166136261; for (const ch of value) h = Math.imul(h ^ ch.codePointAt(0), 16777619) >>> 0; return h.toString(16).padStart(8, "0"); };
const revisionFingerprint = (q) => revisionHash(JSON.stringify([q.text || "", q.statements || [], q.tableRows || [], q.assertion || "", q.reason || "", (q.options || []).map((o) => [o.label, o.text]), q.answer || "", q.type || ""]));
if (fs.existsSync(revisionOverridePath)) {
  const revisionOverrides = JSON.parse(fs.readFileSync(revisionOverridePath, "utf8"));
  for (const revision of revisionOverrides.replacements ?? []) {
    const chapterPath = path.join(OUT, `${revision.chapter}.json`);
    if (!fs.existsSync(chapterPath)) throw new Error(`Revision overlay chapter not found: ${revision.chapter}`);
    const chapter = JSON.parse(fs.readFileSync(chapterPath, "utf8"));
    const matches = chapter.questions.filter((q) => q.n === revision.n);
    if (matches.length !== 1) throw new Error(`Revision overlay target mismatch: ${revision.chapter} Q${revision.n}`);
    const question = matches[0];
    if (question.type !== revision.originalType) throw new Error(`Revision overlay type mismatch: ${revision.chapter} Q${revision.n}`);
    if (revisionFingerprint(question) !== revision.sourceFingerprint) throw new Error(`Revision overlay source fingerprint mismatch: ${revision.chapter} Q${revision.n}; inspect the authoritative question bank before applying this locator`);
    Object.assign(question, revision.updates);
    fs.writeFileSync(chapterPath, JSON.stringify(chapter));
  }
}

console.log("\nSynced MT201 chapters:");
for (const s of summary) console.log(`  ${s.id}  ${String(s.count).padStart(3)} questions  ${s.title}`);
console.log(`  TOTAL: ${totalQ} questions`);
if (problems) {
  console.error(`\n${problems} problem(s) - see messages above.`);
  process.exit(1);
}
console.log("All questions converted cleanly.");
