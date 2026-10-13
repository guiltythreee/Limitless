"use client";

import { useEffect, useState } from "react";
import { lessons, ranks, unitOf, pad2 } from "../content";

const KEY = "hc3-open-chapters";

/** Chapters (sequences) that can be folded. Used by the side list and by the phone topic picker. */
export default function TopicTree({ activeId, completed, onChoose }: { activeId: string; completed: string[]; onChoose: (id: string) => void }) {
  const activeRank = lessons.find((l) => l.id === activeId)?.rank ?? 9;
  const [open, setOpen] = useState<number[]>([activeRank]);

  // Remember which chapters were open.
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) ?? "null");
      if (Array.isArray(saved)) setOpen(saved.includes(activeRank) ? saved : [...saved, activeRank]);
    } catch { /* ignore */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const save = (next: number[]) => { setOpen(next); try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* ignore */ } };
  // Opening a topic always shows its chapter.
  useEffect(() => { if (!open.includes(activeRank)) save([...open, activeRank]); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [activeRank]);

  const withLessons = ranks.filter((r) => lessons.some((l) => l.rank === r.num));
  const allOpen = withLessons.every((r) => open.includes(r.num));

  return (
    <div>
      <div className="mb-3 flex items-center justify-between px-2">
        <div className="eyebrow">Chapters of the unknown</div>
        <button onClick={() => save(allOpen ? [] : withLessons.map((r) => r.num))} className="shrink-0 whitespace-nowrap text-[10px]! uppercase tracking-[.14em] text-mutedgold hover:text-gold">{allOpen ? "Collapse all" : "Expand all"}</button>
      </div>
      <div className="space-y-2">
        {ranks.map((rank) => {
          const inRank = lessons.filter((l) => l.rank === rank.num);
          const isOpen = open.includes(rank.num);
          const done = inRank.filter((l) => completed.includes(l.id)).length;
          if (inRank.length === 0) {
            return <div key={rank.num} className="px-2 py-2 text-[10px] uppercase tracking-[.18em] text-faint">Sequence {pad2(rank.num)} · {rank.name} <span className="ml-1 normal-case tracking-normal">(sealed)</span></div>;
          }
          return (
            <div key={rank.num}>
              <button onClick={() => save(isOpen ? open.filter((n) => n !== rank.num) : [...open, rank.num])} aria-expanded={isOpen} className="flex w-full items-center gap-2 border border-gold/10 px-3 py-2.5 text-left transition hover:bg-gold/5">
                <span className={`text-[10px] text-mutedgold transition-transform ${isOpen ? "rotate-90" : ""}`}>▶</span>
                <span className="min-w-0 flex-1 text-[10px] font-bold uppercase tracking-[.16em] text-mutedgold">Sequence {pad2(rank.num)} · {rank.name}</span>
                <span className="text-[10px] text-faint">{done}/{inRank.length}</span>
              </button>
              {isOpen && (
                <div className="mt-1 space-y-1">
                  {inRank.map((lesson) => (
                    <button key={lesson.id} onClick={() => onChoose(lesson.id)} className={`flex w-full items-start gap-3 border px-3 py-3 text-left transition ${activeId === lesson.id ? "border-gold/45 bg-gold/[.07]" : "border-transparent hover:border-gold/15 hover:bg-gold/5"}`}>
                      <span className={`serif mt-0.5 text-sm ${completed.includes(lesson.id) ? "text-gold" : "text-faint"}`}>{completed.includes(lesson.id) ? "✓" : unitOf[lesson.id]}</span>
                      <span className="min-w-0 flex-1"><span className={`block text-sm ${activeId === lesson.id ? "text-parchment" : "text-soft"}`}>{lesson.title}</span><span className="mt-1 block text-[10px] uppercase tracking-widest text-faint">{lesson.minutes} min</span></span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
