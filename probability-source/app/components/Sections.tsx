import type { Lesson } from "../content";
import { Display, Para, Rich } from "../lib/rich";

export function Theory({ lesson }: { lesson: Lesson }) {
  return (
    <div className="measure">
      <div className="border-l-2 border-gold/60 bg-gold/4.5 px-4 py-3"><div className="eyebrow text-[9px]!">Learning objective</div><p className="mt-2 text-sm leading-6 text-body"><Rich text={lesson.objective} /></p></div>
      <div className="theory mt-7 space-y-4">{lesson.body.map((p, i) => <Para key={i} text={p} />)}</div>
      {lesson.formulas.length > 0 && (
        <div className="subtle-grid mt-8 border border-gold/20 bg-inset/70 px-5 py-6">
          <div className="eyebrow mb-4 text-center text-[9px]!">{lesson.formulas.length > 1 ? "The governing relations" : "The governing relation"}</div>
          <div className="space-y-5">
            {lesson.formulas.map((f, i) => (
              <div key={f.label} className={i > 0 ? "border-t border-gold/10 pt-5 text-center" : "text-center"}>
                <div className="text-[10px] uppercase tracking-[.14em] text-mutedgold">{lesson.formulas.length > 1 ? f.label : ""}</div>
                <div className="mt-2 text-xl text-gold md:text-2xl"><Display text={f.text} /></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function Illustration({ lesson }: { lesson: Lesson }) {
  if (lesson.examples.length === 0) return <div className="border border-dashed border-gold/25 p-8 text-center text-sm text-dim">No worked illustrations for this topic yet.</div>;
  return (
    <div className="measure space-y-4">
      {lesson.examples.map((ex, i) => (
        <div key={ex.title + i} className="border border-gold/15 bg-inset/50 p-5">
          <div className="flex items-baseline gap-3"><span className="serif text-gold">{i + 1}.</span><h4 className="serif text-lg">{ex.title}</h4></div>
          <div className="theory mt-3 text-[.97rem] leading-7 text-body"><Para text={ex.problem} /></div>
          <ol className="theory mt-4 space-y-3 border-l border-gold/25 pl-4 text-[.97rem] leading-7 text-dim">
            {ex.steps.map((step, j) => <li key={j}><span className="mr-2 text-[10px] uppercase tracking-widest text-mutedgold">Step {j + 1}</span><Para text={step} /></li>)}
          </ol>
        </div>
      ))}
    </div>
  );
}
