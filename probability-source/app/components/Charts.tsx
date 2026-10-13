"use client";

import { useState } from "react";
import type { DayBar } from "../lib/stats";

/** Three bars (one per difficulty) with a hover tooltip, as in the reference dashboard. */
export function DiffBars({ title, headline, sub, data, color, max }: {
  title: string; headline: string; sub: string; color: string; max?: number;
  data: { label: string; value: number; tip: string }[];
}) {
  const [hover, setHover] = useState<number | null>(null);
  const top = max ?? Math.max(1, ...data.map((d) => d.value));
  const W = 560, H = 190, base = H - 26, plot = base - 14;
  const slot = W / data.length;
  return (
    <div className="card">
      <div className="flex items-start justify-between gap-4">
        <div className="serif text-xl">{title}</div>
        <div className="text-right"><div className="serif text-xl text-parchment">{headline}</div><div className="text-xs text-dim">{sub}</div></div>
      </div>
      <div className="relative mt-3">
        <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full text-mutedgold" role="img" aria-label={title}>
          {[0, 1, 2, 3, 4].map((i) => <line key={i} x1="0" x2={W} y1={base - (plot * i) / 4} y2={base - (plot * i) / 4} stroke="currentColor" opacity=".25" strokeDasharray="4 4" />)}
          <line x1="0" x2={W} y1={base} y2={base} stroke="currentColor" opacity=".7" />
          {data.map((d, i) => {
            const h = (d.value / top) * plot;
            const cx = slot * i + slot / 2;
            return (
              <g key={d.label} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} onClick={() => setHover(hover === i ? null : i)}>
                <rect x={slot * i} y="0" width={slot} height={H} fill="transparent" />
                <rect x={cx - 9} y={base - h} width="18" height={Math.max(h, 0)} rx="2" fill={color} />
                <text x={cx} y={H - 8} textAnchor="middle" fontSize="12" fill="currentColor">{d.label}</text>
              </g>
            );
          })}
        </svg>
        {hover !== null && (
          <div className="pointer-events-none absolute top-2 -translate-x-1/2 rounded-xl border border-gold/30 bg-panel px-3 py-2 text-sm shadow-lg" style={{ left: `${((hover + 0.5) / data.length) * 100}%` }}>
            <div className="text-body">{data[hover].label}</div>
            <div style={{ color }}>{data[hover].tip}</div>
          </div>
        )}
      </div>
    </div>
  );
}

/** Questions solved per day, split into correct and not correct, with the goal line. */
export function DayBars({ bars, goal }: { bars: DayBar[]; goal: number }) {
  const W = 760, H = 190, padL = 30, padB = 22, padT = 10;
  const max = Math.max(goal, ...bars.map((b) => b.total), 4);
  const bw = (W - padL) / bars.length;
  const y = (v: number) => padT + (H - padT - padB) * (1 - v / max);
  const every = Math.ceil(bars.length / 12);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full text-mutedgold" role="img" aria-label="Questions solved per day">
      {[0, 0.5, 1].map((f) => (
        <g key={f}>
          <line x1={padL} x2={W} y1={y(max * f)} y2={y(max * f)} stroke="currentColor" opacity=".2" strokeDasharray="4 4" />
          <text x={padL - 6} y={y(max * f) + 3} textAnchor="end" fontSize="9" fill="currentColor">{Math.round(max * f)}</text>
        </g>
      ))}
      {bars.map((b, i) => {
        const x = padL + i * bw + bw * 0.18;
        const w = Math.max(2, bw * 0.64);
        return (
          <g key={b.day}>
            <title>{`${b.day}: ${b.total} solved, ${b.correct} correct`}</title>
            <rect x={x} y={y(b.total)} width={w} height={y(0) - y(b.total)} fill="var(--bad)" opacity=".85" rx="1.5" />
            <rect x={x} y={y(b.correct)} width={w} height={y(0) - y(b.correct)} fill="var(--good)" rx="1.5" />
            {i % every === 0 && <text x={x + w / 2} y={H - 6} textAnchor="middle" fontSize="9" fill="currentColor">{b.label}</text>}
          </g>
        );
      })}
      <line x1={padL} x2={W} y1={y(goal)} y2={y(goal)} stroke="var(--gold)" strokeDasharray="5 4" />
      <text x={W} y={y(goal) - 4} textAnchor="end" fontSize="9" fill="var(--gold)">daily goal {goal}</text>
    </svg>
  );
}
