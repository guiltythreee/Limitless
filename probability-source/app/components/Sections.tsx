import type { Lesson } from "../content";
import { Display, Para, Rich } from "../lib/rich";

export function Theory({ lesson }: { lesson: Lesson }) {
  return (
    <div className="measure theory-reading">
      <div className="theory-objective border-l-2 border-gold/60 bg-gold/4.5 px-4 py-4">
        <div className="eyebrow text-[9px]!">Learning objective</div>
        <p className="mt-2 text-base leading-7 text-body"><Rich text={lesson.objective} /></p>
      </div>

      <div className="theory mt-8 space-y-6">
        {lesson.body.map((paragraph, index) => (
          <div key={index} className="theory-reading-block">
            {lesson.topicHeadings?.filter((heading) => heading.before === index).map((heading) => (
              <h3 key={heading.title} className="theory-topic-heading">{heading.title}</h3>
            ))}
            <Para text={paragraph} />
          </div>
        ))}
      </div>

      {lesson.formulas.length > 0 && (
        <div className="subtle-grid mt-9 border border-gold/20 bg-inset/70 px-5 py-6">
          <div className="eyebrow mb-4 text-center text-[9px]!">
            {lesson.formulas.length > 1 ? "The governing relations" : "The governing relation"}
          </div>
          <div className="space-y-5">
            {lesson.formulas.map((formula, index) => (
              <div
                key={formula.label}
                className={index > 0 ? "border-t border-gold/10 pt-5 text-center" : "text-center"}
              >
                <div className="text-[10px] uppercase tracking-[.14em] text-mutedgold">
                  {lesson.formulas.length > 1 ? formula.label : ""}
                </div>
                <div className="mt-2 text-xl text-gold md:text-2xl">
                  <Display text={formula.text} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function Illustration({ lesson }: { lesson: Lesson }) {
  if (lesson.examples.length === 0) {
    return <div className="border border-dashed border-gold/25 p-8 text-center text-sm text-dim">No worked illustrations for this topic yet.</div>;
  }

  return (
    <div className="measure space-y-5">
      {lesson.examples.map((example, index) => (
        <article key={example.title + index} className="border border-gold/15 bg-inset/50 p-5">
          <div className="flex items-baseline gap-3">
            <span className="serif text-gold">{index + 1}.</span>
            <h4 className="serif text-lg">{example.title}</h4>
          </div>
          <div className="theory mt-4 text-body">
            <Para text={example.problem} />
          </div>
          <ol className="theory mt-5 space-y-4 border-l border-gold/25 pl-4 text-dim">
            {example.steps.map((step, stepIndex) => (
              <li key={stepIndex}>
                <span className="mb-1 block text-[10px] uppercase tracking-widest text-mutedgold">Step {stepIndex + 1}</span>
                <Para text={step} />
              </li>
            ))}
          </ol>
        </article>
      ))}
    </div>
  );
}
