"use client";

// Shared rendering for a question: body (statements / match table /
// assertion–reason), option buttons and the solution reveal panel.

import { mdInline, mdToHtml } from "../lib/md";
import { Question, TYPE_NAMES } from "./types";

const h = (s: string) => ({ __html: mdInline(s) });

export function QuestionMeta({ q }: { q: Question }) {
  return (
    <div className="qhead">
      <span className="qnum">Q{q.n}</span>
      {q.stars > 0 && <span className="chip chip-gold">{"★".repeat(q.stars)}</span>}
      {q.type && <span className="chip">{q.type} · {TYPE_NAMES[q.type] ?? "question"}</span>}
      {q.traps.map((t) => (
        <span key={t} className="chip chip-trap">[{t}]</span>
      ))}
    </div>
  );
}

export function QuestionBody({ q }: { q: Question }) {
  return (
    <div>
      {q.text && <p className="qtext" dangerouslySetInnerHTML={h(q.text)} />}

      {q.statements.length > 0 && (
        <ul className="statements">
          {q.statements.map((s) => (
            <li key={s.num}>
              <span className="st-n">{s.num}.</span>
              <span dangerouslySetInnerHTML={h(s.text)} />
            </li>
          ))}
        </ul>
      )}

      {q.tableRows.length > 0 && (
        <table className="mdtable">
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
}: {
  q: Question;
  picked?: string;
  onPick?: (label: string) => void;
  locked: boolean;
}) {
  return (
    <div className="opts">
      {q.options.map((o) => {
        let cls = "opt";
        if (locked) {
          if (o.label === q.answer) cls += " is-correct";
          else if (o.label === picked) cls += " is-wrong";
        }
        return (
          <button
            key={o.label}
            type="button"
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

export function SolutionPanel({ q, showKey = true }: { q: Question; showKey?: boolean }) {
  return (
    <div className="reveal">
      {q.concise && (
        <div className="concise" dangerouslySetInnerHTML={{ __html: `<b>Concise —</b> ${mdInline(q.concise)}` }} />
      )}
      {q.detailed && (
        <div className="detailed" dangerouslySetInnerHTML={{ __html: mdToHtml(q.detailed) }} />
      )}
      {showKey && q.keyExplanation && (
        <div className="keyexp" dangerouslySetInnerHTML={{ __html: mdInline(q.keyExplanation) }} />
      )}
    </div>
  );
}
