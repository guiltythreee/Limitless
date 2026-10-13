import { Fragment, type ReactNode } from "react";

/*
  Turns the plain-text mathematics in the lessons into typeset maths.
  Step 1 (findMath): decide which stretches of a sentence are maths (they hold a symbol such as ∪, =, ᵏ, 1/3 or P(A)).
  Step 2 (renderMath): inside those stretches draw stacked fractions, binomials C(n, k), roots,
          raised and lowered digits, and italic single-letter variables.
  Ordinary words are never touched.
*/

// ---------- step 1: which words belong to a formula ----------
const LETTER = "A-Za-zα-ωΑ-Ω";
const STRONG_CHARS = /[∅Ω∪∩⊆⊂⊃⊇⊔⋃⋂Σ∏∞≤≥≠≈⟹⇒⇔⟺∈∉×△∖√π⁰¹²³⁴⁵⁶⁷⁸⁹ⁿᵏⁱ⁺⁻ᶜ₀-₉ₙₖᵢⱼₐₓ₊₋^]/;
const STRONG_OTHER = new RegExp(
  `_[A-Za-z0-9(]|\\b(?:[PEC]|Var|Cov|lim)\\(|\\d\\/[\\dA-Za-z]|[A-Za-z0-9]!|^[=<>]$|^[(\\[{|]*[0-9]+\\)?[=<>]`,
);
const ATOM = `[${LETTER}]|\\d[\\d,.]*[π%]?|[+−×·÷/=<>≤≥|]|…|···|\\.\\.\\.|iff|lim|sin|cos|tan|log|ln|exp|max|min|sup|inf|mod|gcd|Var|Cov`;
const WEAK = new RegExp(`^[(\\[{|]*(?:${ATOM})[)\\]}|]*!?[,;.]?$`);
const WEAK_SET = /^[({[]*[A-Z]{1,4}[)}\]]*[,.;]?$/;
const LABEL = /^\([A-Za-z]\)[:.]?$/;

type Kind = "S" | "W" | "P";
function kindOf(word: string): Kind {
  if (LABEL.test(word)) return "P";
  const bare = word.replace(/[,.;:]+$/, "");
  if (STRONG_CHARS.test(bare) || STRONG_OTHER.test(bare)) return "S";
  if (/^[aI][,.;]?$/.test(word)) return "P";
  if (WEAK.test(word)) return "W";
  if (/[{},]/.test(word) && WEAK_SET.test(word)) return "W";
  return "P";
}

type Piece = { math: boolean; s: string };
export function findMath(text: string): Piece[] {
  const parts = text.split(/(\s+)/); // words at even positions, spaces at odd positions
  const kinds = parts.map((p, i) => (i % 2 === 0 && p ? kindOf(p) : "P"));
  const ends = (w: string) => /[.;:?]$/.test(w);
  const inSpan = new Array(parts.length).fill(false);
  const spans: [number, number][] = [];
  for (let i = 0; i < parts.length; i += 2) {
    if (kinds[i] !== "S" || inSpan[i]) continue;
    let a = i, b = i;
    while (a - 2 >= 0 && kinds[a - 2] !== "P" && !/\n/.test(parts[a - 1]) && !ends(parts[a - 2]) && !inSpan[a - 2]) a -= 2;
    while (b + 2 < parts.length && kinds[b + 2] !== "P" && !/\n/.test(parts[b + 1]) && !ends(parts[b]) && !inSpan[b + 2]) b += 2;
    // drop edge words so brackets stay balanced
    const bal = () => {
      const s = parts.slice(a, b + 1).join("");
      return (s.match(/\(/g) ?? []).length - (s.match(/\)/g) ?? []).length;
    };
    let guard = 0;
    while (bal() < 0 && a < i && guard++ < 6) a += 2; // extra ")" sits at the left edge
    while (bal() > 0 && b > i && guard++ < 12) b -= 2; // extra "(" sits at the right edge
    // a lone strong word that is just a bare symbol or number needs no special typesetting
    for (let k = a; k <= b; k++) inSpan[k] = true;
    spans.push([a, b]);
  }
  const out: Piece[] = [];
  let cursor = 0;
  for (const [a, b] of spans) {
    if (a > cursor) out.push({ math: false, s: parts.slice(cursor, a).join("") });
    let s = parts.slice(a, b + 1).join("");
    const tail = s.match(/[,.;:]+$/)?.[0] ?? "";
    if (tail) s = s.slice(0, -tail.length);
    out.push({ math: true, s });
    cursor = b + 1;
    if (tail) { out.push({ math: false, s: tail }); }
  }
  if (cursor < parts.length) out.push({ math: false, s: parts.slice(cursor).join("") });
  // merge neighbouring plain pieces
  return out.reduce<Piece[]>((acc, p) => {
    const last = acc[acc.length - 1];
    if (last && !last.math && !p.math) last.s += p.s; else acc.push({ ...p });
    return acc;
  }, []).filter((p) => p.s !== "");
}

// ---------- step 2: draw the maths ----------
const SUP: Record<string, string> = { "⁰": "0", "¹": "1", "²": "2", "³": "3", "⁴": "4", "⁵": "5", "⁶": "6", "⁷": "7", "⁸": "8", "⁹": "9", "⁺": "+", "⁻": "−", "ⁿ": "n", "ᵏ": "k", "ⁱ": "i", "ᶜ": "c" };
const SUB: Record<string, string> = { "₀": "0", "₁": "1", "₂": "2", "₃": "3", "₄": "4", "₅": "5", "₆": "6", "₇": "7", "₈": "8", "₉": "9", "₊": "+", "₋": "−", "ₙ": "n", "ₖ": "k", "ᵢ": "i", "ⱼ": "j", "ₐ": "a", "ₓ": "x" };
const supRun = `[${Object.keys(SUP).join("")}]+`;
const subRun = `[${Object.keys(SUB).join("")}]+`;
const OP = `(?:[A-Za-z]{1,4}\\([^()]*\\)|\\([^()]*\\)|[\\w₀-₉⁰-⁹ⁿᵏⁱᶜπσωθλμ.]+)!?`;

const MASTER = new RegExp(
  [
    `(?<frac>(?<![\\w)])(${OP})[ ]?\\/[ ]?(${OP}))`, // 1: stacked fraction
    `(?<binom>\\bC\\(([^(),]+),\\s*([^()]+)\\))`, // binomial coefficient
    `(?<root>√(\\([^()]*\\)|[\\w.]+))`,
    `(?<sup>\\^\\([^()]*\\)|\\^[^\\s])`,
    `(?<sub>_\\([^()]*\\)|_[A-Za-z0-9])`,
    `(?<usup>${supRun})`,
    `(?<usub>${subRun})`,
    `(?<letter>(?<![A-Za-z])[A-Za-zα-ωΑ-Ω](?![A-Za-z]))`,
  ].join("|"),
  "gu",
);

const stripParens = (s: string) => (/^\([^()]*\)$/.test(s) ? s.slice(1, -1) : s);
let uid = 0;
const key = () => `m${uid++}`;

function renderMath(s: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  MASTER.lastIndex = 0;
  for (const m of s.matchAll(MASTER)) {
    const g = m.groups!;
    const i = m.index!;
    if (i > last) out.push(s.slice(last, i));
    last = i + m[0].length;
    if (g.frac) {
      // groups 3,4 hold the two operands (named groups shift numbering, so recompute)
      const sl = g.frac.search(/\/(?=[ ]?[^ ]*$)/);
      // find the slash that is not inside brackets
      let depth = 0, at = -1;
      for (let k = 0; k < g.frac.length; k++) {
        const c = g.frac[k];
        if (c === "(") depth++;
        else if (c === ")") depth--;
        else if (c === "/" && depth === 0) { at = k; break; }
      }
      void sl;
      const top = g.frac.slice(0, at).trim();
      const bottom = g.frac.slice(at + 1).trim();
      const strip = (x: string) => (x.endsWith("!") ? x : stripParens(x));
      out.push(
        <span key={key()} className="mfrac"><span className="mnum">{renderMath(strip(top))}</span><span className="mden">{renderMath(strip(bottom))}</span></span>,
      );
    } else if (g.binom) {
      const inner = g.binom.slice(2, -1);
      const comma = inner.indexOf(",");
      out.push(
        <span key={key()} className="mbinom"><span className="mparen">(</span><span className="mfrac mfrac-b"><span className="mnum">{renderMath(inner.slice(0, comma).trim())}</span><span className="mden">{renderMath(inner.slice(comma + 1).trim())}</span></span><span className="mparen">)</span></span>,
      );
    } else if (g.root) {
      out.push(<span key={key()} className="mroot">√<span className="mradicand">{renderMath(stripParens(g.root.slice(1)))}</span></span>);
    } else if (g.sup) {
      out.push(<sup key={key()} className="msup">{renderMath(stripParens(g.sup.slice(1)))}</sup>);
    } else if (g.sub) {
      out.push(<sub key={key()} className="msub">{renderMath(stripParens(g.sub.slice(1)))}</sub>);
    } else if (g.usup || g.usub) {
      const run = (g.usup ?? g.usub)!;
      const map = g.usup ? SUP : SUB;
      const text = [...run].map((c) => map[c]).join("");
      const node = /^[a-z]$/.test(text) && text !== "c" ? <i>{text}</i> : text;
      out.push(g.usup ? <sup key={key()} className="msup">{node}</sup> : <sub key={key()} className="msub">{node}</sub>);
    } else if (g.letter) {
      const next = s[i + 1];
      const upright = ("PEC".includes(g.letter) && next === "(") || g.letter === "π" || g.letter === "Ω" || g.letter === "Σ";
      out.push(upright ? g.letter : <i key={key()}>{g.letter}</i>);
    }
  }
  if (last < s.length) out.push(s.slice(last));
  return out.map((n, i) => (typeof n === "string" ? <Fragment key={`t${i}`}>{n}</Fragment> : n));
}

/** A sentence or phrase with its maths typeset. */
export function Rich({ text }: { text: string }) {
  return (
    <>
      {findMath(text).map((p, i) =>
        p.math ? <span key={i} className="math">{renderMath(p.s)}</span> : <Fragment key={i}>{p.s}</Fragment>,
      )}
    </>
  );
}

/** A formula shown on its own line (larger). */
export function Display({ text }: { text: string }) {
  return <span className="math math-display"><Rich text={text} /></span>;
}

// ---------- paragraphs: run-in headings, theorem boxes, (a)(b)(c) lists ----------
const LEADS = [
  "Definition", "Theorem", "Proposition", "Lemma", "Corollary", "Remarks?", "Proofs?", "More proofs", "Quant lens", "Intuition", "Working rule",
  "Dictionary of words, sets and indicators", "More of the dictionary", "Indicator calculus", "The laws", "More laws",
  "How to prove a set identity", "Countable operations", "Which subsets are events\\?", "Consequences", "Standard σ-algebras",
  "A σ-algebra is a state of knowledge", "A gallery of sample spaces", "Countable versus uncountable", "Choosing Ω is modelling, not truth",
  "Where the axioms come from", "Why countable additivity\\?", "Two ways to build probability spaces", "Continuous case",
  "Probability 0 is not impossible, and probability 1 is not certain", "Probabilistic corollaries", "The complement trick", "Reading them",
  "What BC1 does not need", "Recipe for a counting probability", "Bertrand’s paradox", "Chapter 1 toolkit", "Problem-solving checklist",
  "Pairwise disjoint is not “jointly empty”", "Why only for mutually exclusive events\\?", "The four possibilities, illustrated with one die roll",
  "Decomposition along a partition", "Why does it work\\?", "The fine print", "When is “equally likely” justified\\?",
];
const LEAD_RE = new RegExp(`^((?:${LEADS.join("|")})(?:\\s\\d[\\d.]*)?(?:\\s\\((?:[^()]|\\([^()]*\\))*\\))?[.?])\\s+`);

export function splitLabelled(text: string): { pre: string; items: { label: string; text: string }[] } | null {
  // finds " (a) … (b) … (c) …" in order
  const found: { label: string; at: number; len: number }[] = [];
  let from = 0;
  for (const letter of "abcdefgh") {
    const tag = `(${letter}) `;
    const at = text.indexOf(tag, from);
    if (at === -1 || (at > 0 && text[at - 1] !== " ")) break;
    found.push({ label: letter, at, len: tag.length });
    from = at + tag.length;
  }
  if (found.length < 2 || found[0].label !== "a") return null;
  const items = found.map((f, i) => ({
    label: f.label,
    text: text.slice(f.at + f.len, i + 1 < found.length ? found[i + 1].at : undefined).trim(),
  }));
  return { pre: text.slice(0, found[0].at).trim(), items };
}

function Labelled({ text }: { text: string }) {
  const parts = splitLabelled(text);
  if (!parts) return <Rich text={text} />;
  return (
    <>
      {parts.pre && <span className="block"><Rich text={parts.pre} /></span>}
      <span className="litems">
        {parts.items.map((it) => (
          <span key={it.label} className="litem"><span className="llabel">({it.label})</span><span><Rich text={it.text} /></span></span>
        ))}
      </span>
    </>
  );
}

export function Para({ text }: { text: string }) {
  const m = text.match(LEAD_RE);
  if (!m) return <p className="para"><Labelled text={text} /></p>;
  const head = m[1];
  const rest = text.slice(m[0].length);
  const kind = /^(Definition|Theorem|Proposition|Lemma|Corollary)/.test(head) ? "box" : /^Proofs?|^More proofs/.test(head) ? "proof" : "note";
  return (
    <div className={`para para-${kind}`}>
      <span className="lead">{head}</span>{" "}
      <Labelled text={rest} />
      {kind === "proof" && <span className="qed">∎</span>}
    </div>
  );
}

// ---------- practice explanations: "Answer (B). … Why the others are wrong: (A) … (C) …" ----------
export function Explanation({ text }: { text: string }) {
  const m = text.match(/^Answer \(([A-E](?:,\s*[A-E])*)\)\.\s*([\s\S]*?)(?:\s*Why the others are wrong:\s*([\s\S]*))?$/);
  if (!m) return <p className="para"><Rich text={text} /></p>;
  const [, ans, why, others] = m;
  const items: { label: string; text: string }[] = [];
  if (others) {
    const re = /(?:^|\s)\(([A-E])\)\s/g;
    const marks = [...others.matchAll(re)];
    marks.forEach((mk, i) => {
      const start = mk.index! + mk[0].length;
      const end = i + 1 < marks.length ? marks[i + 1].index! : others.length;
      items.push({ label: mk[1], text: others.slice(start, end).trim() });
    });
  }
  return (
    <div className="space-y-3">
      <p className="para"><strong className="lead">Answer ({ans}).</strong> <Rich text={why} /></p>
      {others && (
        <div>
          <div className="lead mb-1.5">Why the others are wrong</div>
          {items.length ? (
            <span className="litems">
              {items.map((it) => <span key={it.label} className="litem"><span className="llabel">({it.label})</span><span><Rich text={it.text} /></span></span>)}
            </span>
          ) : <p className="para"><Rich text={others} /></p>}
        </div>
      )}
    </div>
  );
}
