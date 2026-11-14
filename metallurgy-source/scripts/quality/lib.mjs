// scripts/quality/lib.mjs
//
// Shared helpers for the MT203 semantic quality layer. The structural engine
// (scripts/validate-mt203.mjs) stays as it is; this layer sits on top of it and
// reads the same real typed sources.

import { createHash } from "node:crypto";
import { TOPIC_IDS } from "../../app/mt203/types.ts";

/** Load every real topic source, exactly as the app and validate-mt203 do. */
export async function loadBank() {
  const topics = [];
  for (const id of TOPIC_IDS) {
    const mod = await import(`../../app/data/qbank/${id}.ts`);
    topics.push(mod.default);
  }
  return topics;
}

export function flattenQuestions(topics) {
  return topics.flatMap((t) => t.questions.map((q, i) => ({ ...q, topic: t.id, n: i + 1 })));
}

/** Content fingerprint: any edit to what a reviewer judged invalidates the review. */
export function fingerprint(q) {
  const body = JSON.stringify({
    type: q.type, diff: q.diff, text: q.text ?? null, statements: q.statements ?? null,
    tableRows: q.tableRows ?? null, assertion: q.assertion ?? null, reason: q.reason ?? null,
    options: q.options, answer: q.answer, why: q.why,
  });
  return createHash("sha256").update(body).digest("hex").slice(0, 16);
}

/** { id, dim, rule, sev, msg } — sev is "error" | "warn" | "info". */
export const finding = (q, dim, rule, sev, msg) => ({ id: q.id, topic: q.topic, dim, rule, sev, msg });

// ---- text helpers -----------------------------------------------------------

export const words = (s) => String(s ?? "").trim().split(/\s+/).filter(Boolean);

const STOP = new Set(
  "a an the of in on at to for and or but is are was were be been being it its this that these those with by from as than then so not no do does did can may might will would should could which what why how when where who whom whose into onto over under between among per via also only more most less least very".split(" "),
);

export function tokens(s) {
  return String(s ?? "")
    .toLowerCase()
    .replace(/\$[^$]*\$/g, " ")
    .replace(/[^a-z0-9α-ωµ\- ]+/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP.has(w));
}

export function jaccard(a, b) {
  const A = new Set(tokens(a));
  const B = new Set(tokens(b));
  if (!A.size && !B.size) return 1;
  let inter = 0;
  for (const x of A) if (B.has(x)) inter++;
  return inter / (A.size + B.size - inter);
}

const SUB = { "₀": "0", "₁": "1", "₂": "2", "₃": "3", "₄": "4", "₅": "5", "₆": "6", "₇": "7", "₈": "8", "₉": "9" };

/** Exact-comparison form: keeps symbols (<, =, →), exponents and subscripts, drops only spacing/case. */
export const normText = (s) =>
  String(s ?? "")
    .toLowerCase()
    .replace(/\$/g, "")
    .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]+/g, (m) => "^" + [...m].map((c) => SUP[c]).join(""))
    .replace(/[₀-₉]/g, (c) => "_" + SUB[c])
    .replace(/\s+/g, "");

export const median = (xs) => {
  const s = [...xs].sort((a, b) => a - b);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

// ---- number parsing (options such as "2.0 × 10³", "1{,}130", "$6\times10^{-10}$") --

const SUP = { "⁰": "0", "¹": "1", "²": "2", "³": "3", "⁴": "4", "⁵": "5", "⁶": "6", "⁷": "7", "⁸": "8", "⁹": "9", "⁻": "-" };

function normaliseNumberText(t) {
  return String(t ?? "")
    .replace(/\$/g, "")
    .replace(/\\times|×/g, " x ")
    .replace(/\\[,;! ]/g, " ")
    .replace(/\{,\}/g, "")
    .replace(/(\d),(?=\d{3}(?!\d))/g, "$1")
    .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]+/g, (m) => "^" + [...m].map((c) => SUP[c]).join(""))
    .replace(/\^\{(-?\d+)\}/g, "^$1")
    .replace(/(?<=[A-Za-zµ°])\^-?\d+/g, "") // unit exponents (cm³, s⁻¹) are not quantities
    .replace(/−/g, "-");
}

/** Every number in a string, in order. Scientific notation is folded to one value. */
export function parseNumbers(text) {
  const s = normaliseNumberText(text);
  const out = [];
  const re = /(-?\d+(?:\.\d+)?)\s*x\s*10\^(-?\d+)|10\^(-?\d+)|(-?\d+(?:\.\d+)?)/g;
  let m;
  while ((m = re.exec(s))) {
    if (m[1] !== undefined) out.push(Number(m[1]) * 10 ** Number(m[2]));
    else if (m[3] !== undefined) out.push(10 ** Number(m[3]));
    else out.push(Number(m[4]));
  }
  return out;
}

export const decimalsOf = (text) => {
  const m = /\d+\.(\d+)/.exec(normaliseNumberText(text));
  return m ? m[1].length : 0;
};

export const relDiff = (a, b) => (a === b ? 0 : Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b)));
