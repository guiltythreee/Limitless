"use client";

// app/platform/qview.tsx
//
// Shared question renderer for the metallurgy platform.
//
// It consumes the canonical question model (app/courses/types.ts) via the
// render-facing subset `QuestionView`, and is parameterised by a small
// `QViewVariant` so each course keeps its EXACT current rendering.
//
// The course files (app/mt201/qview.tsx, app/mt202/qview.tsx,
// app/mt203/qview.tsx) stay as thin compatibility wrappers: they keep their
// original public API and map their local question shape into `QuestionView`.
//
// Rendering parity is the contract: markup, class names, chips, option states
// and the markdown/KaTeX output must be identical to the renderers this
// replaces. Known per-course differences are the only things the variant
// switches:
//   stars    (MT201/MT202)        vs difficulty chip (MT203)
//   "A · direct" type chip        vs name-only chip (MT203)
//   is-picked on an unlocked pick (MT203 only)
//   concise/detailed/key solution vs verdict/why/distractors/concept (MT203)
//   table class "mdtable"         vs "mdtable qtable" (MT203)
//
// This module imports NO question data: it must never pull a question bank
// into a bundle. MT203 keeps its per-topic dynamic imports (app/mt203/types.ts).

import { mdInline, mdToHtml } from "../lib/md";
import type {
  QuestionOption,
  QuestionSolution,
  Statement,
} from "../courses/types";

/**
 * Render-facing subset of the canonical `Question` (app/courses/types.ts).
 * `id`/`topicId` are omitted because they are never rendered, and `difficulty`
 * is widened to `number` so star-based courses (MT201/MT202, 0–3 ★) need no
 * fabricated 1–4 classification. A canonical `Question` is assignable to this.
 */
export interface QuestionView {
  n: number;
  type: string;
  difficulty: number;
  rawDifficulty?: number;
  text?: string;
  statements?: Statement[];
  tableRows?: string[][];
  assertion?: string;
  reason?: string;
  options: QuestionOption[];
  answer: string;
  solution: QuestionSolution;
  tags?: string[];
}

/** Per-course rendering switches. Data only — no behaviour lives here. */
export interface QViewVariant {
  /** Leading meta chip: star rating or difficulty. */
  metaStyle: "stars" | "difficulty";
  /** Difficulty chip classes indexed by level, e.g. ["", "chip-diff1", ...]. */
  difficultyChipClasses?: string[];
  /** Difficulty display names indexed by level (difficulty meta only). */
  difficultyNames?: Record<number, string>;
  /** Type chip format. */
  typeChip: "code-and-name" | "name-only";
  /** Type key -> display name. */
  typeNames: Record<string, string>;
  /** Fallback name for an unknown type key (code-and-name only). */
  unknownTypeName?: string;
  /** Class applied to the match/data table. */
  tableClassName: string;
  /** Add `is-picked` to the chosen option while the question is unlocked. */
  markPickedUnlocked: boolean;
  /** Explicit button type attribute, when the source renderer set one. */
  buttonType?: "button";
  /** Solution layout. */
  solutionStyle: "concise" | "verdict";
}

const h = (s: string) => ({ __html: mdInline(s) });

export function QuestionMeta({ q, variant }: { q: QuestionView; variant: QViewVariant }) {
  const stars = q.rawDifficulty ?? 0;
  const diff = q.difficulty;
  const typeLabel =
    variant.typeChip === "code-and-name"
      ? q.type
        ? `${q.type} · ${variant.typeNames[q.type] ?? variant.unknownTypeName ?? "question"}`
        : null
      : variant.typeNames[q.type];

  return (
    <div className="qhead">
      <span className="qnum">Q{q.n}</span>
      {variant.metaStyle === "stars" ? (
        stars > 0 && <span className="chip chip-gold">{"★".repeat(stars)}</span>
      ) : (
        <span className={`chip ${(variant.difficultyChipClasses ?? [])[diff] ?? ""}`}>
          {"◆".repeat(diff)} {variant.difficultyNames?.[diff]}
        </span>
      )}
      {typeLabel != null && <span className="chip">{typeLabel}</span>}
      {(q.tags ?? []).map((t) => (
        <span key={t} className="chip chip-trap">
          [{t}]
        </span>
      ))}
    </div>
  );
}

export function QuestionBody({ q, variant }: { q: QuestionView; variant: QViewVariant }) {
  return (
    <div>
      {q.text && <p className="qtext" dangerouslySetInnerHTML={h(q.text)} />}

      {q.statements && q.statements.length > 0 && (
        <ul className="statements">
          {q.statements.map((s) => (
            <li key={s.num}>
              <span className="st-n">{s.num}.</span>
              <span dangerouslySetInnerHTML={h(s.text)} />
            </li>
          ))}
        </ul>
      )}

      {q.tableRows && q.tableRows.length > 0 && (
        <table className={variant.tableClassName}>
          <tbody>
            {q.tableRows.map((row, i) => (
              <tr key={i}>
                {row.map((c, j) => (
                  <td key={j} dangerouslySetInnerHTML={h(c)} />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {(q.assertion || q.reason) && (
        <div className="ar-boxes">
          {q.assertion && (
            <div className="ar-box">
              <b>ASSERTION (A)</b>
              <div dangerouslySetInnerHTML={h(q.assertion)} />
            </div>
          )}
          {q.reason && (
            <div className="ar-box">
              <b>REASON (R)</b>
              <div dangerouslySetInnerHTML={h(q.reason)} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function OptionList({
  q,
  picked,
  onPick,
  locked,
  variant,
}: {
  q: QuestionView;
  picked?: string;
  onPick?: (label: string) => void;
  locked: boolean;
  variant: QViewVariant;
}) {
  return (
    <div className="opts">
      {q.options.map((o) => {
        let cls = "opt";
        if (locked) {
          if (o.label === q.answer) cls += " is-correct";
          else if (o.label === picked) cls += " is-wrong";
        } else if (variant.markPickedUnlocked && o.label === picked) {
          cls += " is-picked";
        }
        return (
          <button
            key={o.label}
            type={variant.buttonType}
            className={cls}
            disabled={locked}
            onClick={() => onPick?.(o.label)}
          >
            <span className="tag">{o.label.toUpperCase()}</span>
            <span dangerouslySetInnerHTML={h(o.text)} />
          </button>
        );
      })}
    </div>
  );
}

/**
 * Solution panel.
 * - "concise" style (MT201/MT202): concise line, detailed body, optional key.
 * - "verdict" style (MT203): verdict banner, the `why`, per-option distractor
 *   notes and any governing equation/concept reference.
 */
export function SolutionPanel({
  q,
  picked,
  showKey = true,
  variant,
}: {
  q: QuestionView;
  picked?: string;
  showKey?: boolean;
  variant: QViewVariant;
}) {
  if (variant.solutionStyle === "concise") {
    const { concise, detailed, keyExplanation } = q.solution;
    return (
      <div className="reveal">
        {concise && (
          <div
            className="concise"
            dangerouslySetInnerHTML={{ __html: `<b>Concise —</b> ${mdInline(concise)}` }}
          />
        )}
        {detailed && (
          <div className="detailed" dangerouslySetInnerHTML={{ __html: mdToHtml(detailed) }} />
        )}
        {showKey && keyExplanation && (
          <div className="keyexp" dangerouslySetInnerHTML={{ __html: mdInline(keyExplanation) }} />
        )}
      </div>
    );
  }

  const right = picked === q.answer;
  const why = q.solution.keyExplanation ?? "";
  const distractors = q.solution.distractors;
  return (
    <div className="reveal">
      <div className={`verdict ${right ? "right" : "wrong"}`}>
        {right
          ? "✓ Correct"
          : picked
            ? `✗ Incorrect — the answer is (${q.answer})`
            : `Answer: (${q.answer})`}
      </div>
      <div className="concise" dangerouslySetInnerHTML={{ __html: mdToHtml(why) }} />
      {distractors && Object.keys(distractors).length > 0 && (
        <div className="distractor-list">
          {q.options
            .filter((o) => distractors[o.label])
            .map((o) => (
              <div key={o.label} className="distractor">
                <b>({o.label})</b>{" "}
                <span dangerouslySetInnerHTML={{ __html: mdToHtml(distractors[o.label]) }} />
              </div>
            ))}
        </div>
      )}
      {q.solution.concept && (
        <div className="keyexp">
          <b>Reference:</b>{" "}
          <span dangerouslySetInnerHTML={{ __html: mdInline(q.solution.concept) }} />
        </div>
      )}
    </div>
  );
}
