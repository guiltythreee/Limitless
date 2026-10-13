"use client";

import { useMemo, useState } from "react";
import { setGoal, useStore } from "../lib/store";
import { PERIODS, byDifficulty, fmtTime, goalInfo, history, select, summarize, type Period, type Scope } from "../lib/stats";
import { DayBars, DiffBars } from "./Charts";

const pct = (x: number) => `${Math.round(x * 100)}%`;
const MILE = ["🥾", "🚶", "🏃", "⚡", "🏁"];

export function GoalCard() {
  const store = useStore();
  const g = goalInfo(store);
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const frac = Math.min(1, g.today / g.goal);
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div className="serif text-xl">Your Daily Goal</div>
        <button onClick={() => setOpen(!open)} className="text-sm text-gold hover:underline">{open ? "Close" : "View more ›"}</button>
      </div>
      <div className="mt-3 text-lg text-body">{g.today}/{g.goal} Qs {g.reached && <span className="ml-2 text-sm text-emerald-500">goal reached ✓</span>}</div>
      <div className="mile" aria-label={`${g.today} of ${g.goal} questions today`}>
        <div className="mile-fill" style={{ width: `${frac * 100}%` }} />
        {MILE.map((m, i) => <span key={i} className={`mile-node ${frac >= i / 4 && (i === 0 || g.today > 0) ? "mile-node-on" : ""}`}>{m}</span>)}
      </div>
      {open && (
        <form className="mt-5 flex flex-wrap items-center gap-2 border-t border-gold/10 pt-4" onSubmit={(e) => { e.preventDefault(); if (text) { setGoal(Number(text)); setText(""); } }}>
          <label htmlFor="goal" className="text-xs text-dim">Questions per day</label>
          <input id="goal" type="number" min={1} max={500} value={text} placeholder={String(store.goal)} onChange={(e) => setText(e.target.value)} className="field w-24" />
          <button className="btn-gold px-3! py-2!">Set goal</button>
          <span className="text-[11px] text-faint">Changing it affects today and the days after, not past days.</span>
        </form>
      )}
    </div>
  );
}

export function StreakCard() {
  const store = useStore();
  const g = goalInfo(store);
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div className="serif text-xl">Daily Goal Streak</div>
        <div className="text-sm text-body">{g.streak} day streak <span className="text-orange-500">🔥</span> <span className="ml-2 text-xs text-faint">best {g.best}</span></div>
      </div>
      <div className="mt-4 flex gap-1">
        {g.week.map((d) => (
          <div key={d.day} className={`weekcol ${d.met ? "weekcol-met" : ""} ${d.isToday ? "weekcol-today" : ""}`}>
            <b>{d.name}</b>
            <span className="mt-1 block">{d.future ? "--" : d.count ? `${d.count} Qs` : "--"}</span>
            <span className="mt-1 block h-4 text-base leading-none">{d.met ? "🔥" : ""}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** "History of Qs Solved": period tabs, three tiles, three difficulty charts and the day-by-day history. */
export function StatsPanel({ scope, poolSize, scopeControl }: { scope: Scope; poolSize: number; scopeControl?: React.ReactNode }) {
  const store = useStore();
  const [period, setPeriod] = useState<Period>("week");
  const key = JSON.stringify(scope);
  const list = useMemo(() => select(store.attempts, scope, period), [store.attempts, key, period]); // eslint-disable-line react-hooks/exhaustive-deps
  const sum = summarize(list);
  const d = byDifficulty(list);
  const bars = history(list, period);
  const labels = { easy: "Easy", medium: "Medium", hard: "Hard" } as const;
  const diffs = (["easy", "medium", "hard"] as const);
  return (
    <div className="space-y-5">
      <div className="card">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="serif text-xl">History of Qs Solved</div>
          {scopeControl}
        </div>
        <div className="mt-4 flex flex-wrap gap-1 rounded-full border border-gold/20 p-1">
          {PERIODS.map((p) => <button key={p.id} onClick={() => setPeriod(p.id)} className={`flex-1 rounded-full px-3 py-2 text-sm ${period === p.id ? "bg-gold/15 text-gold outline outline-1 outline-gold/50" : "text-dim hover:text-parchment"}`}>{p.label}</button>)}
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="tile" style={{ background: "color-mix(in srgb, var(--c-attempt) 12%, transparent)" }}><div className="tv" style={{ color: "var(--c-attempt)" }}>{sum.questions}</div><div className="tl">Qs Solved</div></div>
          <div className="tile" style={{ background: "color-mix(in srgb, var(--warn) 12%, transparent)" }}><div className="tv" style={{ color: "var(--warn)" }}>{sum.avgMs ? fmtTime(sum.avgMs) : "–"}</div><div className="tl">Time per Q (m:ss)</div></div>
          <div className="tile" style={{ background: "color-mix(in srgb, var(--good) 12%, transparent)" }}><div className="tv" style={{ color: "var(--good)" }}>{sum.attempts ? pct(sum.accuracy) : "–"}</div><div className="tl">Accuracy</div></div>
        </div>
        <div className="mt-5 rounded-2xl border border-gold/10 p-3">
          <DayBars bars={bars} goal={store.goalByDay[bars[bars.length - 1]?.day] ?? store.goal} />
          <div className="mt-1 flex gap-4 text-[10px] text-dim"><span><i className="mr-1 inline-block h-2 w-2" style={{ background: "var(--good)" }} />correct</span><span><i className="mr-1 inline-block h-2 w-2" style={{ background: "var(--bad)" }} />not correct</span></div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between"><div className="serif text-xl">Progress</div><div className="text-sm text-dim">{sum.questions}/{poolSize} questions · {poolSize ? (sum.questions / poolSize * 100).toFixed(1) : "0.0"}%</div></div>
        <div className="mt-3 h-2 overflow-hidden rounded bg-track"><div className="h-full rounded bg-gold" style={{ width: `${poolSize ? Math.min(100, (sum.questions / poolSize) * 100) : 0}%` }} /></div>
      </div>

      <DiffBars title="Qs Attempted" headline={`${sum.attempts} Qs`} sub="Total attempted" color="var(--c-attempt)"
        data={diffs.map((k) => ({ label: labels[k], value: d[k].attempts, tip: `Attempted : ${d[k].attempts}` }))} />
      <DiffBars title="Accuracy" headline={sum.attempts ? `${(sum.accuracy * 100).toFixed(1)}%` : "0.0%"} sub="Overall accuracy" color="var(--good)" max={1}
        data={diffs.map((k) => ({ label: labels[k], value: d[k].accuracy, tip: `Accuracy : ${(d[k].accuracy * 100).toFixed(0)}%` }))} />
      <DiffBars title="Time Per Qs" headline={sum.avgMs ? `${Math.floor(sum.avgMs / 60000)}m ${Math.round((sum.avgMs % 60000) / 1000)}s` : "0m 0s"} sub="Average time per Qs" color="var(--c-time)"
        data={diffs.map((k) => ({ label: labels[k], value: d[k].avgMs, tip: `Time : ${Math.floor(d[k].avgMs / 60000)}M ${Math.round((d[k].avgMs % 60000) / 1000)}S` }))} />
    </div>
  );
}
