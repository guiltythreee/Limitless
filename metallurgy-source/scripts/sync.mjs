// ------------------------------------------------------------------
// MT202 content sync — turns the Markdown question bank + solutions
// into per-chapter JSON the archive app fetches at runtime.
//
//   node scripts/sync.mjs [path\to\MCQ_Question_Bank]
//
// Source of truth stays the Markdown folder on disk; re-run after edits.
// ------------------------------------------------------------------

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC =
  process.argv[2] ??
  "C:\\Users\\DELL\\OneDrive\\Desktop\\MT3rdSem\\MT202PM\\MCQ_Question_Bank";
const OUT = path.join(__dirname, "..", "public", "data", "mt202");

if (!fs.existsSync(SRC)) {
  console.error("Source folder not found:", SRC);
  process.exit(1);
}

// ------------------------------------------------------------ helpers

const clean = (s) =>
  s
    .replace(/\r/g, "")
    .replace(/[ \t]+$/gm, "")
    .trim();

/** Very small inline-markdown splitter kept as-is; the client renders it. */

function parseOptions(region) {
  // Find "(a)" ... "(d)" markers at the start of an option.
  const re = /\(([a-d])\)\s*/g;
  const marks = [];
  let m;
  while ((m = re.exec(region))) marks.push({ label: m[1], at: m.index, end: re.lastIndex });
  const options = [];
  for (let i = 0; i < marks.length; i++) {
    const stop = i + 1 < marks.length ? marks[i + 1].at : region.length;
    options.push({ label: marks[i].label, text: clean(region.slice(marks[i].end, stop)).replace(/\n\s*/g, " ") });
  }
  return options;
}

/** A question block is cut at the next "**Qn.**", so the last question of a
 *  topic section swallows the "---" + "## Topic …" heading that follows its
 *  options. Stop the region at any section boundary. */
function trimSectionTail(region) {
  const keep = [];
  for (const L of region.split("\n")) {
    if (/^---\s*$/.test(L) || /^#{1,6}\s/.test(L) || /^\*\*Q\d/.test(L)) break;
    keep.push(L);
  }
  return keep.join("\n");
}

function parseQuestionBlock(block) {
  // First line: **Q12.** ★★ **[P1] [B]** question text...
  const lines = block.split("\n");
  const first = lines[0];
  const qm = first.match(/^\*\*Q(\d+)\.\*\*\s*/);
  if (!qm) return null;
  const n = Number(qm[1]);
  let rest = first.slice(qm[0].length);

  let stars = 0;
  let type = "";
  const traps = [];
  const tagM = rest.match(/^(★+\s*)?(?:\*\*((?:\[[^\]]+\]\s*)+|[A-G])\*\*)?\s*/);
  if (tagM) {
    if (tagM[1]) stars = (tagM[1].match(/★/g) || []).length;
    if (tagM[2]) {
      const bracketed = [...tagM[2].matchAll(/\[([^\]]+)\]/g)].map((x) => x[1].trim());
      if (bracketed.length) {
        for (const t of bracketed) {
          if (/^[A-G]$/.test(t)) type = t;
          else if (/^P[123]$/.test(t)) traps.push(t);
        }
      } else if (/^[A-G]$/.test(tagM[2].trim())) {
        type = tagM[2].trim();
      }
    }
    rest = rest.slice(tagM[0].length);
  }

  const bodyLines = lines.slice(1);
  // Assertion can start on the question's first line after the type tag — move it into the body.
  const firstRest = rest.trim();
  const asM = firstRest.match(/^\*\*Assertion \(A\):\*\*\s*(.*)$/);
  if (asM) {
    bodyLines.unshift("**Assertion (A):** " + asM[1]);
    rest = "";
  }
  const statements = [];
  const tableRows = [];
  let assertion = "";
  let reason = "";
  let textParts = [rest.trim()];
  let i = 0;

  // Body up to the options region: statements, match tables, A/R lines.
  for (; i < bodyLines.length; i++) {
    const L = bodyLines[i];
    if (/^\(a\)/.test(L)) break; // options begin
    if (/^\*\*Q\d/.test(L)) break; // safety
    const stmt = L.match(/^(\d+)\.\s+(.*)$/);
    if (stmt) {
      statements.push({ num: Number(stmt[1]), text: clean(stmt[2]) });
      continue;
    }
    if (/^\|/.test(L)) {
      if (/^\|[\s:-]+\|/.test(L)) continue; // separator row
      tableRows.push(
        L.split("|").slice(1, -1).map((c) => clean(c))
      );
      continue;
    }
    const ar = L.match(/^\*\*(Assertion \(A\)|Reason \(R\)):\*\*\s*(.*)$/);
    if (ar) {
      let val = ar[2];
      // continuation lines until the next marker
      while (i + 1 < bodyLines.length && !/^\*\*|^(\(a\)|\d+\.|\|)/.test(bodyLines[i + 1])) {
        val += " " + bodyLines[++i].trim();
      }
      if (ar[1].startsWith("Assertion")) assertion = clean(val);
      else reason = clean(val);
      continue;
    }
    if (L.trim()) textParts.push(L.trim());
  }

  const optionsRegion = trimSectionTail(bodyLines.slice(i).join("\n"));
  const options = parseOptions(optionsRegion);
  return {
    n,
    stars,
    type,
    traps,
    text: clean(textParts.filter(Boolean).join(" ")),
    statements,
    tableRows,
    assertion,
    reason,
    options,
  };
}

function parseBank(text) {
  const cut = text.search(/^# ANSWER KEY/m);
  const qPart = cut === -1 ? text : text.slice(0, cut);
  const keyPart = cut === -1 ? "" : text.slice(cut);

  // Topic headings: ## Topic 1.2 — Title (Q2–Q7)
  const topics = [...qPart.matchAll(/^##\s+(Topic\s+[\d.]+)\s+[—-]\s+(.+?)(?:\s*\(Q[^)]*\))?\s*$/gm)].map(
    (m) => ({ id: m[1], title: m[2].trim() })
  );

  // Split question blocks at **Qn.**
  const starts = [...qPart.matchAll(/^\*\*Q(\d+)\.\*\*/gm)];
  const questions = [];
  for (let i = 0; i < starts.length; i++) {
    const from = starts[i].index;
    const to = i + 1 < starts.length ? starts[i + 1].index : qPart.length;
    const parsed = parseQuestionBlock(qPart.slice(from, to));
    if (parsed) questions.push(parsed);
  }

  // Answer key rows: | 3 | **(b)** | explanation... |
  const answers = {};
  for (const m of keyPart.matchAll(/^\|\s*(\d+)\s*\|\s*\*\*\(([a-d])\)\*\*\s*\|?\s*(.*?)\s*\|\s*$/gm)) {
    answers[Number(m[1])] = { letter: m[2], explanation: clean(m[3]) };
  }

  return { topics, questions, answers };
}

function parseSolutions(text) {
  // Blocks start at **Qn. Answer (x) ...**
  const starts = [...text.matchAll(/^\*\*Q(\d+)\. Answer\s*\(([a-d])\)/gm)];
  const out = {};
  for (let i = 0; i < starts.length; i++) {
    const n = Number(starts[i][1]);
    const from = starts[i].index;
    const to = i + 1 < starts.length ? starts[i + 1].index : text.length;
    let block = text.slice(from, to);

    // Trim at trailing hr / next topic header / chapter footer.
    const lines = block.split("\n");
    let concise = "";
    let detailedStart = 0;
    for (let j = 0; j < lines.length; j++) {
      const cm = lines[j].match(/^\*\*Concise:\*\*\s*(.*)$/);
      if (cm) {
        let val = cm[1];
        // continuation lines of the concise answer (rare) — stop at a blank line,
        // any **bold** marker (Detailed block) or a separator.
        while (
          j + 1 < lines.length &&
          lines[j + 1].trim() &&
          !/^\*\*/.test(lines[j + 1]) &&
          !/^---\s*$/.test(lines[j + 1])
        ) {
          val += " " + lines[++j].trim();
        }
        concise = clean(val);
      }
      if (/^\*\*Detailed:?\*\*/.test(lines[j])) {
        detailedStart = j;
        break;
      }
    }

    let detailedLines = lines.slice(detailedStart);
    if (detailedLines.length && /^\*\*Detailed/.test(detailedLines[0])) {
      detailedLines[0] = detailedLines[0].replace(/^\*\*Detailed:?\*\*\s*/, "");
    }
    // cut at trailing separators / headers / footers
    let stop = detailedLines.length;
    for (let j = 1; j < detailedLines.length; j++) {
      const L = detailedLines[j];
      if (/^---\s*$/.test(L) || /^#{1,3}\s/.test(L)) { stop = j; break; }
      if (/^\*Next:/.test(L.trim())) { stop = j; break; }
    }
    let detailed = clean(detailedLines.slice(0, stop).join("\n"));

    out[n] = { letter: starts[i][2], concise, detailed };
  }
  return out;
}

// ------------------------------------------------------------ main

const bankFiles = fs
  .readdirSync(SRC)
  .filter((f) => /^Ch\d+_.+\.md$/.test(f))
  .sort();

fs.mkdirSync(OUT, { recursive: true });

const summary = [];
let totalQ = 0;
let problems = 0;

for (const file of bankFiles) {
  const num = file.match(/^Ch(\d+)/)[1];
  const bank = parseBank(clean(fs.readFileSync(path.join(SRC, file), "utf8")));
  const solPath = path.join(SRC, "Solutions", file.replace(/\.md$/, "_Solutions.md").replace(/^Ch(\d+)_/, "Ch$1_"));
  // solution files are named Ch01_Solutions.md etc.
  const altPath = path.join(SRC, "Solutions", `Ch${num.padStart(2, "0")}_Solutions.md`);
  const solFile = fs.existsSync(solPath) ? solPath : altPath;
  const sols = fs.existsSync(solFile)
    ? parseSolutions(clean(fs.readFileSync(solFile, "utf8")))
    : {};

  const titleMatch = fs.readFileSync(path.join(SRC, file), "utf8").match(/^#\s+Chapter\s+\d+\s+[—-]\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1].trim() : file;

  const questions = [];
  for (const q of bank.questions) {
    const key = bank.answers[q.n] ?? {};
    const sol = sols[q.n] ?? {};
    const letter = key.letter ?? sol.letter ?? "";
    if (!letter) { console.log(`  !! Ch${num} Q${q.n}: no answer found`); problems++; }
    if (!q.options.length) { console.log(`  !! Ch${num} Q${q.n}: no options parsed`); problems++; }
    if (!sol.detailed) { console.log(`  !! Ch${num} Q${q.n}: no detailed solution`); problems++; }
    questions.push({
      ...q,
      answer: letter,
      keyExplanation: key.explanation ?? "",
      concise: sol.concise ?? "",
      detailed: sol.detailed ?? "",
    });
  }
  totalQ += questions.length;

  const chapter = {
    id: `ch${num.padStart(2, "0")}`,
    num: Number(num),
    title,
    topics: bank.topics,
    questions,
  };
  fs.writeFileSync(path.join(OUT, `${chapter.id}.json`), JSON.stringify(chapter));
  summary.push({ id: chapter.id, title, count: questions.length });
}

const index = {
  course: "MT202 — Physical Metallurgy",
  generated: new Date().toISOString().slice(0, 10),
  total: totalQ,
  chapters: summary,
};
fs.writeFileSync(path.join(OUT, "index.json"), JSON.stringify(index, null, 2));

// Limitless durable authored question overrides — reapplied after external bank sync.
const revisionOverridePath = path.join(__dirname, "..", "content-revisions", "mt202.json");
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

console.log("\nSynced chapters:");
for (const s of summary) console.log(`  ${s.id}  ${String(s.count).padStart(3)} questions  ${s.title}`);
console.log(`  TOTAL: ${totalQ} questions`);
if (problems) {
  console.error(`\n${problems} problem(s) — see messages above.`);
  process.exit(1);
}
console.log("All questions matched with answers + detailed solutions.");
