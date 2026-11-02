"use client";

import { useEffect, useRef, useState } from "react";
import { lessons, pathways, ranks, unitOf, pad2 } from "../content";

const KEY = "hc3-open-chapters-session";

/** Chapters are shared by several curated learning routes. */
export default function TopicTree({
  activeId,
  completed,
  onChoose,
  pathwayId,
  onPathwayChange,
}: {
  activeId: string;
  completed: string[];
  onChoose: (id: string) => void;
  pathwayId: string;
  onPathwayChange: (id: string) => void;
}) {
  const selectedPathway = pathways.find((p) => p.id === pathwayId);
  const visibleLessons = selectedPathway
    ? selectedPathway.lessonIds.map((id) => lessons.find((lesson) => lesson.id === id)).filter((lesson) => lesson !== undefined)
    : lessons;
  const activeRank = visibleLessons.find((l) => l.id === activeId)?.rank ?? 9;
  const [open, setOpen] = useState<number[]>([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(KEY) ?? "null");
      if (Array.isArray(saved)) setOpen(saved);
    } catch { /* ignore */ }
  }, []);

  const save = (next: number[]) => {
    setOpen(next);
    try { sessionStorage.setItem(KEY, JSON.stringify(next)); } catch { /* ignore */ }
  };

  const shownId = useRef(activeId);
  useEffect(() => {
    if (shownId.current === activeId) return;
    shownId.current = activeId;
    if (!open.includes(activeRank)) save([...open, activeRank]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId]);

  const withLessons = ranks.filter((r) => visibleLessons.some((l) => l.rank === r.num));
  const allOpen = withLessons.length > 0 && withLessons.every((r) => open.includes(r.num));

  return (
    <div>
      <div className="mb-4">
        <label htmlFor="probability-pathway" className="eyebrow mb-2 block px-2">Choose a learning pathway</label>
        <select
          id="probability-pathway"
          value={pathwayId}
          onChange={(event) => onPathwayChange(event.target.value)}
          className="w-full border border-gold/20 bg-ink px-3 py-3 text-xs text-parchment outline-none focus:border-gold/60"
        >
          <option value="all">Full curriculum · all chapters</option>
          {pathways.map((pathway) => <option key={pathway.id} value={pathway.id}>{pathway.label}</option>)}
        </select>
        {selectedPathway && (
          <div className="mt-3 border-l border-gold/30 pl-3">
            <p className="text-xs leading-5 text-dim">{selectedPathway.description}</p>
            <p className="mt-2 text-[10px] leading-4 text-mutedgold">{selectedPathway.outcome}</p>
            <p className="mt-2 text-[10px] uppercase tracking-[.12em] text-faint">
              {visibleLessons.filter((lesson) => completed.includes(lesson.id)).length} / {visibleLessons.length} shared chapters completed
            </p>
          </div>
        )}
      </div>

      <div className="mb-3 flex items-center justify-between px-2">
        <div className="eyebrow">Chapters of the unknown</div>
        <button
          onClick={() => save(allOpen ? [] : withLessons.map((r) => r.num))}
          className="shrink-0 whitespace-nowrap text-[10px]! uppercase tracking-[.14em] text-mutedgold hover:text-gold"
        >
          {allOpen ? "Collapse all" : "Expand all"}
        </button>
      </div>

      <div className="space-y-2">
        {withLessons.map((rank) => {
          const inRank = visibleLessons.filter((lesson) => lesson.rank === rank.num);
          const isOpen = open.includes(rank.num);
          const done = inRank.filter((lesson) => completed.includes(lesson.id)).length;
          return (
            <div key={rank.num}>
              <button
                onClick={() => save(isOpen ? open.filter((n) => n !== rank.num) : [...open, rank.num])}
                aria-expanded={isOpen}
                className="flex w-full items-center gap-2 border border-gold/10 px-3 py-2.5 text-left transition hover:bg-gold/5"
              >
                <span className={`text-[10px] text-mutedgold transition-transform ${isOpen ? "rotate-90" : ""}`}>▶</span>
                <span className="min-w-0 flex-1 text-[10px] font-bold uppercase tracking-[.16em] text-mutedgold">
                  Sequence {pad2(rank.num)} · {rank.name}
                </span>
                <span className="text-[10px] text-faint">{done}/{inRank.length}</span>
              </button>
              {isOpen && (
                <div className="mt-1 space-y-1">
                  {inRank.map((lesson) => (
                    <button
                      key={lesson.id}
                      onClick={() => onChoose(lesson.id)}
                      className={`flex w-full items-start gap-3 border px-3 py-3 text-left transition ${activeId === lesson.id ? "border-gold/45 bg-gold/[.07]" : "border-transparent hover:border-gold/15 hover:bg-gold/5"}`}
                    >
                      <span className={`serif mt-0.5 text-sm ${completed.includes(lesson.id) ? "text-gold" : "text-faint"}`}>
                        {completed.includes(lesson.id) ? "✓" : unitOf[lesson.id]}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className={`block text-sm ${activeId === lesson.id ? "text-parchment" : "text-soft"}`}>{lesson.title}</span>
                        <span className="mt-1 block text-[10px] uppercase tracking-widest text-faint">{lesson.minutes} min</span>
                      </span>
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