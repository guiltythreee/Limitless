#!/usr/bin/env node
// scripts/test-qview.mjs
//
// Phase 2 rendering regression harness for the shared question renderer.
//
// It renders representative question types from ALL THREE courses through the
// real course wrappers (app/mt20*/qview.tsx -> app/platform/qview.tsx) using
// react-dom/server, and asserts the preserved behaviour:
//   - body: text / statements / match table / assertion-reason
//   - options: is-correct / is-wrong / is-picked / disabled states
//   - meta: star chips (MT201/MT202) vs difficulty chip (MT203), type chips
//   - solutions: concise/detailed/key (MT201/MT202) vs verdict/why/distractors/
//     concept (MT203)
//   - KaTeX maths actually renders
//   - MT203-specific: distractor notes, reference line, is-picked, no type="button"
//
// It also statically verifies MT203 code-splitting is intact (the renderer and
// wrappers import no question banks; app/mt203/types.ts keeps its dynamic
// imports).
//
// Read-only: writes nothing.
// Run: node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON \
//        --import ./scripts/ts-resolve-hook.mjs scripts/test-qview.mjs

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import * as M201 from "../app/mt201/qview.tsx";
import * as M202 from "../app/mt202/qview.tsx";
import * as M203 from "../app/mt203/qview.tsx";
import { TYPE_NAMES as TYPE_NAMES_201 } from "../app/mt201/types.ts";
import { TYPE_NAMES as TYPE_NAMES_202 } from "../app/mt202/types.ts";
import {
  DIFF_NAMES as DIFF_NAMES_203,
  TYPE_NAMES as TYPE_NAMES_203,
} from "../app/mt203/types.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

// ---------------------------------------------------------------- assertions
let pass = 0;
const failures = [];
const check = (cond, msg) => {
  if (cond) pass++;
  else failures.push(msg);
};
const contains = (html, s, msg) =>
  check(html.includes(s), `${msg} — expected to find ${JSON.stringify(s)}`);
const notContains = (html, s, msg) =>
  check(!html.includes(s), `${msg} — expected NOT to find ${JSON.stringify(s)}`);

// capture console output during render
const consoleIssues = [];
const origError = console.error;
const origWarn = console.warn;
console.error = (...a) => consoleIssues.push("error: " + a.map(String).join(" "));
console.warn = (...a) => consoleIssues.push("warn: " + a.map(String).join(" "));

const render = (Comp, props) => renderToStaticMarkup(createElement(Comp, props));
const wrongLabel = (q) => q.options.find((o) => o.label !== q.answer).label;

// ---------------------------------------------------------------- course data
// PHASE 3/4a/4b: all three courses render CANONICAL questions supplied by their
// course registry adapters, so load them the way the migrated pages do —
// through app/courses/entries/mt201 + mt202 + mt203 and the real app/mt20*
// loaders. The fetch stub serves the very same public/data/mt20*/*.json the
// browser fetches (MT203 is a TypeScript pipeline and needs no fetch).
globalThis.fetch = async (url) => {
  const m = String(url).match(/\/data\/(mt201|mt202)\/(ch\d+\.json)$/);
  if (!m) throw new Error(`unexpected fetch: ${url}`);
  const txt = fs.readFileSync(path.join(root, "public", "data", m[1], m[2]), "utf8");
  return { ok: true, status: 200, json: async () => JSON.parse(txt) };
};
const { MT201_ENTRY } = await import("../app/courses/entries/mt201.ts");
const { MT202_ENTRY } = await import("../app/courses/entries/mt202.ts");
const { MT203_ENTRY } = await import("../app/courses/entries/mt203.ts");
const loadAll = async (entry) =>
  (
    await Promise.all(entry.manifest.topics.map((t) => entry.adapter.loadTopic(t.id)))
  ).flatMap((c) => c.questions);

const mt201 = await loadAll(MT201_ENTRY);
const mt202 = await loadAll(MT202_ENTRY);
const mt203 = await loadAll(MT203_ENTRY);

// ---------------------------------------------------------------- MT201 / MT202
// Both now supply canonical questions (rawDifficulty / solution.*); the
// accessors keep the harness tolerant of either shape.
const starsOf = (q) => q.rawDifficulty ?? q.stars ?? 0;
const solOf = (q) =>
  q.solution ?? { concise: q.concise, detailed: q.detailed, keyExplanation: q.keyExplanation };

function checkStarCourse(name, mod, typeNames, all) {
  const direct = all.find((q) => q.type === "A");
  const assertQ = all.find((q) => q.type === "C" && q.assertion && q.reason);
  const match = all.find((q) => q.type === "D" && q.tableRows && q.tableRows.length > 0);
  const stmt = all.find((q) => q.type === "B" && q.statements && q.statements.length > 0);
  const math = all.find((q) => q.text && q.text.includes("$"));

  check(!!direct, `${name}: has a direct (A) question`);
  check(!!assertQ, `${name}: has an assertion-reason (C) question`);
  check(!!match, `${name}: has a match (D) question`);
  check(!!stmt, `${name}: has a statement (B) question`);

  if (direct) {
    const meta = render(mod.QuestionMeta, { q: direct });
    contains(meta, `>Q${direct.n}<`, `${name}: meta question number`);
    contains(meta, `${direct.type} · ${typeNames[direct.type]}`, `${name}: meta type chip`);
    if (starsOf(direct) > 0) contains(meta, "chip chip-gold", `${name}: meta star chip`);

    const body = render(mod.QuestionBody, { q: direct });
    contains(body, 'class="qtext"', `${name}: body question text`);

    const w = wrongLabel(direct);
    const locked = render(mod.OptionList, { q: direct, picked: w, locked: true });
    contains(locked, "is-correct", `${name}: locked marks correct option`);
    contains(locked, "is-wrong", `${name}: locked marks wrong pick`);
    const open = render(mod.OptionList, { q: direct, picked: w, locked: false });
    notContains(open, "is-picked", `${name}: unlocked has no is-picked`);
    notContains(open, "disabled", `${name}: unlocked options enabled`);
    contains(open, 'type="button"', `${name}: options keep type="button"`);

    const sol = render(mod.SolutionPanel, { q: direct });
    const sv = solOf(direct);
    if (sv.concise) contains(sol, "Concise —", `${name}: concise line`);
    if (sv.detailed) contains(sol, 'class="detailed"', `${name}: detailed body`);
    if (sv.keyExplanation) contains(sol, 'class="keyexp"', `${name}: key explanation`);
  }

  if (assertQ) {
    const body = render(mod.QuestionBody, { q: assertQ });
    contains(body, "ASSERTION (A)", `${name}: assertion box`);
    contains(body, "REASON (R)", `${name}: reason box`);
  }
  if (match) {
    const body = render(mod.QuestionBody, { q: match });
    contains(body, '<table class="mdtable">', `${name}: match table uses mdtable`);
    notContains(body, "qtable", `${name}: match table is not MT203-styled`);
  }
  if (stmt) {
    const body = render(mod.QuestionBody, { q: stmt });
    contains(body, 'class="statements"', `${name}: statement list`);
    contains(body, "st-n", `${name}: statement numbering`);
  }
  if (math) {
    const body = render(mod.QuestionBody, { q: math });
    contains(body, "katex", `${name}: KaTeX renders inline maths`);
  }
}

checkStarCourse("MT201", M201, TYPE_NAMES_201, mt201);
checkStarCourse("MT202", M202, TYPE_NAMES_202, mt202);

// MT202 production data integrity: every question is classified.
// The Markdown bank requires a type A–G (tag key + bank README §2) and a ★
// rating; the Phase 4a "empty type" rows were a text-encoding artefact of the
// old ch03 source, not a valid authored state (see the MT202 data-contract note).
const MT202_TYPE_KEYS = new Set(Object.keys(TYPE_NAMES_202));
const mt202InvalidType = mt202.filter((q) => !MT202_TYPE_KEYS.has(q.type));
check(
  mt202InvalidType.length === 0,
  `MT202: every question has a valid type A–G (invalid: ${mt202InvalidType.length}` +
    (mt202InvalidType.length
      ? `, e.g. Q${mt202InvalidType[0].n}=${JSON.stringify(mt202InvalidType[0].type)}`
      : "") +
    ")"
);
const mt202InvalidStars = mt202.filter((q) => {
  const s = starsOf(q);
  return !Number.isInteger(s) || s < 0;
});
check(
  mt202InvalidStars.length === 0,
  `MT202: every question has a non-negative integer stars value (invalid: ${mt202InvalidStars.length})`
);

// MT202 renderer resilience: an undifferentiated question (no type, no ★) must
// render safely and omit the type/star chips. This is a SYNTHETIC fixture on
// purpose — the production dataset never contains such a question (see the
// integrity checks above), so renderer defensiveness is tested without tying
// the suite to a data defect.
{
  const undifferentiated = {
    n: 1,
    type: "",
    difficulty: 0,
    rawDifficulty: 0,
    options: [],
    answer: "",
    solution: { concise: "", detailed: "", keyExplanation: "" },
  };
  const meta = render(M202.QuestionMeta, { q: undifferentiated });
  contains(meta, ">Q1<", "MT202 synthetic: question number still renders");
  notContains(meta, " · ", "MT202 synthetic: empty type renders no type chip");
  notContains(meta, "chip-gold", "MT202 synthetic: zero stars renders no star chip");
}

// ---------------------------------------------------------------- MT203
{
  const recall = mt203.find((q) => q.type === "recall");
  const assertQ = mt203.find((q) => q.type === "assertreason" && q.assertion && q.reason);
  const match = mt203.find((q) => q.type === "match" && q.tableRows && q.tableRows.length > 0);
  const stmt = mt203.find((q) => q.type === "statement" && q.statements && q.statements.length > 0);
  const dist = mt203.find(
    (q) => q.solution.distractors &&
      Object.keys(q.solution.distractors).length > 0 &&
      q.solution.concept
  );
  const tagged = mt203.find((q) => q.tags && q.tags.length > 0);
  const mathQ = mt203.find(
    (q) => (q.solution.keyExplanation ?? "").includes("$") || (q.text ?? "").includes("$")
  );

  check(!!recall, "MT203: has a recall question");
  check(!!assertQ, "MT203: has an assertion-reason question");
  check(!!match, "MT203: has a match question");
  check(!!stmt, "MT203: has a statement question");
  check(!!dist, "MT203: has a question with distractors + concept");
  check(!!mathQ, "MT203: has a question with maths");

  if (recall) {
    const meta = render(M203.QuestionMeta, { q: recall });
    contains(meta, `chip chip-diff${recall.difficulty}`, "MT203: difficulty chip class");
    contains(meta, "◆".repeat(recall.difficulty), "MT203: difficulty diamonds");
    contains(meta, DIFF_NAMES_203[recall.difficulty], "MT203: difficulty name");
    contains(meta, TYPE_NAMES_203[recall.type], "MT203: name-only type chip");

    const open = render(M203.OptionList, { q: recall, picked: recall.options[0].label, locked: false });
    contains(open, "is-picked", "MT203: unlocked marks is-picked");
    notContains(open, 'type="button"', "MT203: options keep no type attribute");
    const w = wrongLabel(recall);
    const locked = render(M203.OptionList, { q: recall, picked: w, locked: true });
    contains(locked, "is-correct", "MT203: locked marks correct option");
    contains(locked, "is-wrong", "MT203: locked marks wrong pick");
  }
  if (assertQ) {
    contains(render(M203.QuestionBody, { q: assertQ }), "ASSERTION (A)", "MT203: assertion box");
    contains(render(M203.QuestionBody, { q: assertQ }), "REASON (R)", "MT203: reason box");
  }
  if (match) {
    contains(render(M203.QuestionBody, { q: match }), '<table class="mdtable qtable">', "MT203: match table uses mdtable qtable");
  }
  if (stmt) {
    contains(render(M203.QuestionBody, { q: stmt }), 'class="statements"', "MT203: statement list");
  }
  if (tagged) {
    contains(render(M203.QuestionMeta, { q: tagged }), `[${tagged.tags[0]}]`, "MT203: tag chip");
  }
  if (mathQ) {
    const html = render(M203.QuestionBody, { q: mathQ }) + render(M203.SolutionPanel, { q: mathQ });
    contains(html, "katex", "MT203: KaTeX renders");
  }
  if (dist) {
    const w = wrongLabel(dist);
    const sWrong = render(M203.SolutionPanel, { q: dist, picked: w });
    contains(sWrong, "verdict wrong", "MT203: wrong verdict banner");
    contains(sWrong, "Incorrect — the answer is (", "MT203: incorrect banner text");
    contains(sWrong, "distractor-list", "MT203: distractor list rendered");
    for (const label of Object.keys(dist.solution.distractors)) {
      contains(sWrong, `(${label})`, `MT203: distractor note (${label})`);
    }
    contains(sWrong, "Reference:", "MT203: concept reference line");

    const sRight = render(M203.SolutionPanel, { q: dist, picked: dist.answer });
    contains(sRight, "verdict right", "MT203: correct verdict banner");
    contains(sRight, "✓ Correct", "MT203: correct banner text");

    const sNone = render(M203.SolutionPanel, { q: dist });
    contains(sNone, "Answer: (", "MT203: no-pick answer banner");
  }
}

// ---------------------------------------------------------------- code splitting
{
  const stripComments = (s) =>
    s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, "");
  const platform = stripComments(
    fs.readFileSync(path.join(root, "app", "platform", "qview.tsx"), "utf8")
  );
  check(!/qbank/.test(platform), "platform/qview.tsx must not import the question bank");
  check(!/mt203\/types/.test(platform), "platform/qview.tsx must not import mt203/types");
  for (const c of ["mt201", "mt202", "mt203"]) {
    const w = stripComments(fs.readFileSync(path.join(root, "app", c, "qview.tsx"), "utf8"));
    check(w.includes("../platform/qview"), `${c}/qview.tsx uses the shared renderer`);
    check(!/qbank/.test(w), `${c}/qview.tsx must not import the question bank`);
  }
  const t = fs.readFileSync(path.join(root, "app", "mt203", "types.ts"), "utf8");
  const dyn = (t.match(/import\(/g) || []).length;
  check(dyn >= 12, `mt203/types.ts keeps per-topic dynamic imports (found ${dyn}, expected >= 12)`);
  const entry = stripComments(
    fs.readFileSync(path.join(root, "app", "courses", "entries", "mt203.ts"), "utf8")
  );
  check(!/qbank\/t\d/.test(entry), "entries/mt203.ts must not statically import a question chunk");
  const page = stripComments(fs.readFileSync(path.join(root, "app", "mt203", "page.tsx"), "utf8"));
  check(!/qbank\/t\d/.test(page), "mt203/page.tsx must not statically import a question chunk");
}

// ---------------------------------------------------------------- report
console.error = origError;
console.warn = origWarn;

check(consoleIssues.length === 0, `no console errors/warnings during render (${consoleIssues.slice(0, 3).join(" | ")})`);

const picks = {
  mt201: mt201.length,
  mt202: mt202.length,
  mt203: mt203.length,
};

console.log("test-qview — shared question renderer\n");
console.log(`questions available: mt201=${picks.mt201} mt202=${picks.mt202} mt203=${picks.mt203}`);
console.log(`assertions: ${pass} passed, ${failures.length} failed\n`);

if (failures.length) {
  for (const f of failures) console.log("  ✗ " + f);
  console.log("\nFAILED");
  process.exit(1);
}
console.log("All question rendering checks passed.");
