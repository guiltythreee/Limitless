"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { lessons, pathways, ranks, unitOf, pad2, backgroundStyle, EXPERIMENT_BACKGROUND } from "./content";
import { Illustration, Theory } from "./components/Sections";
import Practice from "./components/Practice";
import Analysis from "./components/Analysis";
import Test from "./components/Test";
import TopicTree from "./components/TopicTree";
import Coverage from "./components/Coverage";
import { allQuestions } from "./lib/questions";
import { latestByQuestion, markComplete, resetAll, useHydrated, useStore } from "./lib/store";
import { goalInfo } from "./lib/stats";

// The site is served from /probability/ when published, so image addresses need that prefix (same as backgrounds).
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const rankName = (num: number) => ranks.find((r) => r.num === num)?.name ?? "";
// Phones and narrow windows: one button that opens the same foldable chapter list.
function TopicPicker({ activeId, completed, onChoose, title, unit, pathwayId, onPathwayChange }: { activeId: string; completed: string[]; onChoose: (id: string) => void; title: string; unit: string; pathwayId: string; onPathwayChange: (id: string) => void }) {
  const [shown, setShown] = useState(false);
  return (
    <div className="md:hidden">
      <button onClick={() => setShown(!shown)} aria-expanded={shown} className="panel flex w-full items-center gap-3 px-4 py-3 text-left">
        <span className="min-w-0 flex-1"><span className="eyebrow block text-[9px]!">Topic</span><span className="mt-1 block truncate text-sm text-parchment">{unit ? `${unit} · ` : ""}{title}</span></span>
        <span className={`text-gold transition-transform ${shown ? "rotate-180" : ""}`}>▾</span>
      </button>
      {shown && <div className="panel mt-2 max-h-[65vh] overflow-y-auto p-3"><TopicTree activeId={activeId} completed={completed} onChoose={(id) => { onChoose(id); setShown(false); }} pathwayId={pathwayId} onPathwayChange={onPathwayChange} /></div>}
    </div>
  );
}

type Section = "theory" | "practice" | "test" | "illustration";

export default function Home() {
  const store = useStore();
  const hydrated = useHydrated();
  const [activeId, setActiveId] = useState(lessons[0].id);
  // No topic is shown until the reader picks one. (activeId still needs a lesson so the page always has data to work with.)
  const [opened, setOpened] = useState(false);
  const [section, setSection] = useState<Section>("theory");
  const [rolls, setRolls] = useState<number[]>([]);
  const [rollCount, setRollCount] = useState(100);
  const [tab, setTab] = useState<"archive" | "analysis" | "experiment" | "coverage">("archive");
  const [pathwayId, setPathwayId] = useState<string>("all");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const articleRef = useRef<HTMLElement>(null);
  const firstRender = useRef(true);

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark");
  }, []);

  // Opening another chapter (or section) always starts at its top.
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    articleRef.current?.scrollIntoView({ block: "start" });
  }, [activeId, section]);

  const completed = store.completed;
  const visibleLessons = useMemo(() => {
    const selectedPathway = pathways.find((pathway) => pathway.id === pathwayId);
    return selectedPathway ? selectedPathway.lessonIds.map((id) => lessons.find((lesson) => lesson.id === id)!) : lessons;
  }, [pathwayId]);
  const activeIndex = Math.max(0, visibleLessons.findIndex((lesson) => lesson.id === activeId));
  const activeLesson = visibleLessons[activeIndex] ?? lessons[0];
  const completedCount = lessons.filter((lesson) => completed.includes(lesson.id)).length;
  const progress = Math.round((completedCount / lessons.length) * 100);
  const latest = useMemo(() => latestByQuestion(store.attempts), [store.attempts]);
  const attempts = allQuestions.filter((q) => latest[q.key]).length;
  const averageAccuracy = attempts ? Math.round((allQuestions.reduce((s, q) => s + (latest[q.key]?.score ?? 0), 0) / attempts) * 100) : 0;
  const goal = goalInfo(store);
  const frequency = useMemo(() => {
    const counts = [0, 0, 0, 0, 0, 0];
    rolls.forEach((n) => counts[n - 1]++);
    return counts;
  }, [rolls]);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("hc3-theme", next); } catch { /* Ignore storage errors. */ }
  }
  // The picture behind the page follows the open lesson (or the experiment tab).
  const bgId = tab === "experiment" ? EXPERIMENT_BACKGROUND : activeLesson.id;
  const bgStyle = backgroundStyle(bgId);

  // Opening another topic starts at its Theory, unless the caller (e.g. Topic-wise practice) wants to stay in the same section.
  function chooseLesson(id: string, keepSection = false) {
    setActiveId(id);
    setOpened(true);
    setTab("archive");
    if (!keepSection) setSection("theory");
  }
  function changePathway(id: string) {
    const route = pathways.find((pathway) => pathway.id === id);
    const routeLessons = route ? route.lessonIds.map((lessonId) => lessons.find((lesson) => lesson.id === lessonId)!) : lessons;
    setPathwayId(id);
    if (opened && !routeLessons.some((lesson) => lesson.id === activeId)) {
      chooseLesson(routeLessons.find((lesson) => !completed.includes(lesson.id))?.id ?? routeLessons[0]?.id ?? lessons[0].id);
    }
  }
  function simulate() {
    const generated = Array.from({ length: rollCount }, () => Math.floor(Math.random() * 6) + 1);
    setRolls(generated);
  }
  function resetProgress() {
    if (window.confirm("Erase all saved progress, attempts, timers, bookmarks and streaks on this browser?")) resetAll();
  }
  const SECTIONS: { id: Section; label: string; count?: number }[] = [
    { id: "theory", label: "Theory" },
    { id: "practice", label: "Practice", count: activeLesson.quiz.length },
    { id: "test", label: "Test" },
    { id: "illustration", label: "Illustration", count: activeLesson.examples.length },
  ];

  return (
    <main className="relative isolate min-h-screen">
      {bgStyle && <div key={bgId} className="bg-layer" style={bgStyle} aria-hidden="true" />}
      <header className="sticky top-0 z-30 border-b border-gold/15 bg-ink/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-5 py-4 lg:px-10">
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Home" title="Back to the top of Probability" className="flex items-center gap-3 text-left">
            <div aria-hidden="true" className="brand-icon h-12 w-12 flex-none" style={{ "--brand-dark": `url(${BASE}/brand-icon-dark.webp)`, "--brand-light": `url(${BASE}/brand-icon-light.webp)` } as CSSProperties} />
            <div>
              <div className="serif text-lg leading-tight tracking-wide text-parchment">Home</div>
              <div className="eyebrow mt-1 text-[8px]! tracking-[.2em]!">The Probability Archive</div>
            </div>
          </button>
          <nav className="hidden items-center gap-7 text-xs uppercase tracking-[.15em] text-dim md:flex">
            <button onClick={() => setTab("archive")} className={tab === "archive" ? "text-gold" : "hover:text-parchment"}>The Archive</button>
            <button onClick={() => setTab("analysis")} className={tab === "analysis" ? "text-gold" : "hover:text-parchment"}>Analysis</button>
            <button onClick={() => setTab("experiment")} className={tab === "experiment" ? "text-gold" : "hover:text-parchment"}>Experiment</button>
            <button onClick={() => { setTab("coverage"); document.getElementById("study")?.scrollIntoView({ behavior: "smooth" }); }} className={tab === "coverage" ? "text-gold" : "hover:text-parchment"}>Coverage</button>
            <a href="/meta/" className="hover:text-parchment">Meta</a>
            <a href="#path" className="hover:text-parchment">Pathway</a>
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} aria-label="Switch between dark and light theme" className="border border-gold/30 px-3 py-2 text-[10px] uppercase tracking-[.14em] text-gold transition hover:bg-gold/10">{theme === "dark" ? "☀ Light" : "☾ Dark"}</button>
            <a href="/" className="border border-gold/30 px-3 py-2 text-[10px] uppercase tracking-[.14em] text-gold transition hover:bg-gold/10">↖ Limitless</a>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-gold/10">
        <div className="subtle-grid absolute inset-0 opacity-50" />
        <div className="pointer-events-none absolute -right-24 -top-32 h-[420px] w-[420px] rounded-full border border-gold/10" />
        <div className="pointer-events-none absolute -right-12 -top-20 h-[320px] w-[320px] rounded-full border border-gold/10" />
        <div className="relative mx-auto grid max-w-[1440px] gap-10 px-5 py-14 md:grid-cols-[1.3fr_.7fr] md:items-center md:px-10 md:py-20">
          <div className="art-text">
            <div className="eyebrow mb-5">A chamber beyond certainty</div>
            <h1 className="serif max-w-3xl text-4xl leading-[1.1] text-parchment sm:text-5xl md:text-7xl">Learn the laws<br/><span className="italic text-gold">of the uncertain.</span></h1>
            <p className="mt-6 max-w-xl text-sm leading-7 text-dim md:text-base">Enter the archive of probability. Begin with outcomes and counting, advance through Bayes and random variables, then approach the deeper machinery of limit theorems and stochastic processes.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={() => { chooseLesson(visibleLessons.find((lesson) => !completed.includes(lesson.id))?.id ?? visibleLessons[0]?.id ?? lessons[0].id); document.getElementById("study")?.scrollIntoView({ behavior: "smooth" }); }} className="border border-gold/70 bg-gold px-5 py-3 text-xs font-bold uppercase tracking-[.15em] text-ongold transition hover:bg-goldhi">Continue the path <span className="ml-2">→</span></button>
              <button onClick={() => { setTab("experiment"); document.getElementById("study")?.scrollIntoView({ behavior: "smooth" }); }} className="border border-gold/25 bg-ink/55 px-5 py-3 text-xs uppercase tracking-[.15em] text-gold transition hover:bg-gold/10">Open experiment chamber</button>
            </div>
          </div>
          <div className="panel relative mx-auto w-full max-w-md p-6 md:p-8">
            <div className="absolute right-6 top-5 text-3xl text-gold/70">☉</div>
            <div className="eyebrow">Your record</div>
            <div className="serif mt-5 text-3xl">{completedCount} <span className="text-lg text-dim">/ {lessons.length} lessons</span></div>
            <div className="mt-4 h-1.5 overflow-hidden bg-track"><div className="h-full bg-gold transition-all" style={{ width: `${progress}%` }}/></div>
            <div className="mt-2 flex justify-between text-[10px] uppercase tracking-[.12em] text-mutedgold"><span>Archive progress</span><span>{progress}%</span></div>
            <div className="gold-rule my-6"/>
            <div className="grid grid-cols-2 gap-4">
              <div><div className="serif text-2xl">{attempts}</div><div className="mt-1 text-[10px] uppercase tracking-[.12em] text-dim">Trials attempted</div></div>
              <div><div className="serif text-2xl">{averageAccuracy}%</div><div className="mt-1 text-[10px] uppercase tracking-[.12em] text-dim">Quiz accuracy</div></div>
            </div>
            <div className="gold-rule my-5"/>
            <div className="flex items-center justify-between text-xs text-dim"><span>Today <strong className="text-gold">{hydrated ? goal.today : 0} / {goal.goal}</strong></span><button onClick={() => setTab("analysis")} className="text-gold hover:underline">🔥 {hydrated ? goal.streak : 0} day streak</button></div>
            <p className="mt-4 text-xs leading-5 text-faint">Progress is saved on this browser. No account required.</p>
          </div>
        </div>
      </section>

      <section id="study" className="mx-auto max-w-[1440px] px-5 py-12 md:px-10 md:py-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="art-text"><div className="eyebrow mb-3">Choose your next revelation</div><h2 className="serif text-3xl md:text-4xl">The Archive</h2></div>
          <div className="flex max-w-full flex-wrap border border-gold/20 bg-ink/70 p-1">
            <button onClick={() => setTab("archive")} className={`px-4 py-2 text-xs uppercase tracking-[.12em] ${tab === "archive" ? "bg-gold text-ongold" : "text-dim"}`}>Lessons</button>
            <button onClick={() => setTab("analysis")} className={`px-4 py-2 text-xs uppercase tracking-[.12em] ${tab === "analysis" ? "bg-gold text-ongold" : "text-dim"}`}>Analysis</button>
            <button onClick={() => setTab("experiment")} className={`px-4 py-2 text-xs uppercase tracking-[.12em] ${tab === "experiment" ? "bg-gold text-ongold" : "text-dim"}`}>Experiments</button>
            <button onClick={() => setTab("coverage")} className={`px-4 py-2 text-xs uppercase tracking-[.12em] ${tab === "coverage" ? "bg-gold text-ongold" : "text-dim"}`}>Coverage</button>
          </div>
        </div>

        {tab === "analysis" ? (
          <Analysis />
        ) : tab === "coverage" ? (
          <Coverage />
        ) : tab === "archive" ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-[270px_minmax(0,1fr)] lg:grid-cols-[300px_minmax(0,1fr)]">
            <TopicPicker activeId={opened ? activeId : ""} completed={completed} onChoose={chooseLesson} title={opened ? activeLesson.title : "Choose a topic"} unit={opened ? unitOf[activeLesson.id] : ""} pathwayId={pathwayId} onPathwayChange={changePathway} />
            <aside className="panel hidden min-w-0 p-4 md:sticky md:top-24 md:block md:max-h-[calc(100vh-7rem)] md:self-start md:overflow-y-auto">
              <TopicTree activeId={opened ? activeId : ""} completed={completed} onChoose={(id) => chooseLesson(id)} pathwayId={pathwayId} onPathwayChange={changePathway} />
              <button onClick={resetProgress} className="mt-5 w-full border-t border-gold/15 pt-4 text-left text-[10px] uppercase tracking-[.14em] text-faint hover:text-gold">Reset saved progress</button>
            </aside>

            {!opened ? (
              <article ref={articleRef} className="panel flex min-h-[320px] min-w-0 scroll-mt-24 items-center justify-center p-8 text-center">
                <div>
                  <div className="eyebrow mb-3">The Archive</div>
                  <h3 className="serif text-2xl md:text-3xl">Choose a chapter to begin</h3>
                  <p className="mt-3 text-sm leading-6 text-dim">Open a sequence in the chapters list, then pick a topic.</p>
                </div>
              </article>
            ) : (
            <article ref={articleRef} className="panel min-w-0 scroll-mt-24 p-5 sm:p-8 md:p-10">
              <div className="flex flex-wrap items-center gap-2"><span className="eyebrow">Chapter {unitOf[activeLesson.id]}</span><span className="text-faint">·</span><span className="text-xs text-dim">Sequence {pad2(activeLesson.rank)} · {rankName(activeLesson.rank)}</span><span className="ml-auto text-xs text-dim">{activeLesson.minutes} minute read</span></div>
              <h3 className="serif mt-4 text-3xl leading-tight md:text-4xl">{activeLesson.title}</h3>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-dim">{activeLesson.description}</p>

              <div className="mt-6 flex flex-wrap gap-1 border-b border-gold/15" role="tablist">
                {SECTIONS.map((sec) => (
                  <button key={sec.id} role="tab" aria-selected={section === sec.id} onClick={() => setSection(sec.id)} className={`-mb-px border-b-2 px-4 py-3 text-xs uppercase tracking-[.14em] transition ${section === sec.id ? "border-gold text-gold" : "border-transparent text-dim hover:text-parchment"}`}>
                    {sec.label}{sec.count !== undefined && <span className="ml-2 text-[10px] text-faint">{sec.count}</span>}
                  </button>
                ))}
              </div>

              <div className="mt-7">
                {section === "theory" && <Theory lesson={activeLesson} />}
                {section === "practice" && (activeLesson.quiz.length ? <Practice key={activeLesson.id} lessonId={activeLesson.id} onSelectLesson={chooseLesson} /> : <div className="border border-dashed border-gold/25 p-8 text-center text-sm text-dim">No practice questions for this topic yet.</div>)}
                <div hidden={section !== "test"}><Test currentLessonId={activeLesson.id} pathwayId={pathwayId} /></div>
                {section === "illustration" && <Illustration lesson={activeLesson} />}
              </div>

              <div className="mt-8 flex flex-wrap gap-3 border-t border-gold/15 pt-5">
                {completed.includes(activeLesson.id) ? <span className="self-center text-xs text-gold">✓ Chapter recorded</span> : <button onClick={() => markComplete(activeLesson.id)} className="border border-transparent px-4 py-2.5 text-xs uppercase tracking-[.12em] text-dim hover:text-parchment">Mark chapter complete</button>}
              </div>

              <div className="mt-5 flex justify-between border-t border-gold/15 pt-5">
                <button onClick={() => chooseLesson(visibleLessons[Math.max(0, activeIndex - 1)].id)} disabled={activeIndex === 0} className="text-xs uppercase tracking-[.12em] text-mutedgold hover:text-gold disabled:opacity-25">← Previous</button>
                <button onClick={() => chooseLesson(visibleLessons[Math.min(visibleLessons.length - 1, activeIndex + 1)].id)} disabled={activeIndex === visibleLessons.length - 1} className="text-xs uppercase tracking-[.12em] text-gold hover:text-parchment disabled:opacity-25">Next chapter →</button>
              </div>
            </article>
            )}
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
            <div className="panel p-6 md:p-8">
              <div className="eyebrow mb-3">Experiment 001</div>
              <h3 className="serif text-3xl">The six-sided oracle</h3>
              <p className="mt-3 text-sm leading-6 text-dim">Roll a fair die repeatedly. Compare the observed frequencies with the theoretical probability of 1/6 for each face.</p>
              <label className="mt-7 block text-xs uppercase tracking-[.12em] text-mutedgold" htmlFor="rolls">Number of trials: <strong className="text-gold">{rollCount.toLocaleString()}</strong></label>
              <input id="rolls" type="range" min="10" max="5000" step="10" value={rollCount} onChange={(e) => setRollCount(Number(e.target.value))} className="mt-4 w-full accent-gold"/>
              <div className="mt-2 flex justify-between text-[10px] text-faint"><span>10 trials</span><span>5,000 trials</span></div>
              <button onClick={simulate} className="mt-7 w-full border border-gold/70 bg-gold px-5 py-3 text-xs font-bold uppercase tracking-[.15em] text-ongold transition hover:bg-goldhi">Cast {rollCount.toLocaleString()} rolls</button>
              <button onClick={() => setRolls([])} className="mt-3 w-full border border-gold/20 px-5 py-3 text-xs uppercase tracking-[.15em] text-dim hover:text-parchment">Clear experiment</button>
              <p className="mt-6 text-xs leading-5 text-faint">This simulation uses a pseudorandom number generator in your browser. Frequencies fluctuate; they are not expected to match exactly.</p>
            </div>
            <div className="panel p-6 md:p-8">
              <div className="flex items-start justify-between gap-4"><div><div className="eyebrow mb-3">Observed distribution</div><h3 className="serif text-2xl">Face frequencies</h3></div><div className="serif text-2xl text-gold">{rolls.length.toLocaleString()}<span className="ml-2 text-xs text-faint">rolls</span></div></div>
              {rolls.length === 0 ? <div className="subtle-grid mt-7 flex min-h-64 items-center justify-center border border-dashed border-gold/20 px-6 text-center"><div><div className="serif text-4xl text-gold/50">⚄</div><p className="mt-4 text-sm text-dim">The chamber is quiet.</p><p className="mt-1 text-xs text-faint">Choose a trial count and cast your first rolls.</p></div></div> : <div className="mt-7 space-y-5">{frequency.map((count, i) => { const pct = rolls.length ? count / rolls.length * 100 : 0; return <div key={i}><div className="mb-2 flex items-center justify-between text-xs"><span className="text-body">Face {i + 1}</span><span className="text-dim">{count} outcomes <span className="ml-2 text-gold">{pct.toFixed(2)}%</span></span></div><div className="relative h-3 bg-track"><div className="h-full bg-bar transition-all" style={{ width: `${pct}%` }}/><div className="absolute bottom-[-3px] top-[-3px] border-l border-dashed border-parchment/70" style={{ left: `${100/6}%` }} title="Theoretical probability: 16.67%"/></div></div>})}<div className="mt-6 border-t border-gold/15 pt-5 text-xs leading-5 text-dim">The dashed marker represents the theoretical probability of <span className="text-gold">16.67%</span>. With more trials, the relative frequencies tend to settle near this value.</div></div>}
            </div>
          </div>
        )}
      </section>

      <section id="path" className="border-y border-gold/10">
        <div className="mx-auto max-w-[1440px] px-5 py-12 md:px-10 md:py-16">
          <div className="eyebrow art-text mb-3">The ascent</div>
          <h2 className="serif art-text text-3xl md:text-4xl">A path through uncertainty</h2>
          <p className="art-text mt-3 max-w-2xl text-sm leading-6 text-dim">Master each layer before advancing. The sequences run from 09 down to 00. Sealed sequences open as their lessons are written.</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">{ranks.map((rank) => { const inRank = lessons.filter((lesson) => lesson.rank === rank.num); const done = inRank.filter((lesson) => completed.includes(lesson.id)).length; const sealed = inRank.length === 0; return <div key={rank.num} className={`panel p-5 ${sealed ? "opacity-60" : ""}`}><div className="flex items-center justify-between"><span className="serif text-2xl text-gold">{pad2(rank.num)}</span><span className="text-[9px] uppercase tracking-[.15em] text-faint">{sealed ? "Sealed" : `${done} / ${inRank.length} lessons`}</span></div><h3 className="serif mt-5 text-xl">{rank.name}</h3><p className="mt-2 text-xs leading-5 text-dim">{rank.detail}</p><div className="mt-5 h-px bg-gold/15"/></div>; })}</div>
        </div>
      </section>

      <footer className="art-text mx-auto flex max-w-[1440px] flex-col justify-between gap-3 px-5 py-8 text-xs text-faint md:flex-row md:px-10"><span className="serif text-sm tracking-wide text-mutedgold">HIDDEN CHAMBER III · THE PROBABILITY ARCHIVE</span><span>Knowledge is the only lantern in the unknown.</span></footer>
    </main>
  );
}
