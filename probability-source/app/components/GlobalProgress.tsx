"use client";

import { useEffect, useState } from "react";
import type { RewardSummary } from "../lib/reward-types";

const EMPTY: RewardSummary = {
  standard: "LSR-1",
  xp: 0,
  level: 1,
  xpIntoLevel: 0,
  xpForNextLevel: 100,
  nextLevelAt: 100,
  progress: 0,
  awardCount: 0,
};

export default function GlobalProgress() {
  const [summary, setSummary] = useState<RewardSummary>(EMPTY);
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    const refresh = () => {
      const rewards = window.LimitlessRewards;
      if (!rewards) {
        setAvailable(false);
        return;
      }
      const next = rewards.summary();
      setSummary(next);
      setAvailable(next.available !== false);
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key === window.LimitlessRewards?.STORAGE_KEY) refresh();
    };
    refresh();
    window.addEventListener("limitless:rewards-updated", refresh);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("limitless:rewards-updated", refresh);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return (
    <section className="panel mx-auto mb-8 mt-5 max-w-[1440px] px-5 py-5 md:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="eyebrow">Across every discipline</div>
          <h2 className="serif mt-2 text-2xl text-parchment">Global progression</h2>
          <p className="mt-1 text-xs leading-5 text-dim">
            {available ? "One EXP total shared by Bookkeys, Math Trainer, Probability and future disciplines." : "Global progress is temporarily unavailable because browser storage could not be read."}
          </p>
        </div>
        <div className="text-right">
          <div className="serif text-2xl text-gold">Level {summary.level}</div>
          <div className="text-xs text-dim">{summary.xp.toLocaleString()} Global EXP</div>
        </div>
      </div>
      <div className="mt-4 h-1.5 overflow-hidden bg-track" role="progressbar" aria-label="Progress to next global level" aria-valuemin={0} aria-valuemax={summary.xpForNextLevel} aria-valuenow={summary.xpIntoLevel}>
        <div className="h-full bg-gold transition-all" style={{ width: `${Math.round(summary.progress * 100)}%` }} />
      </div>
      <div className="mt-2 flex justify-between gap-3 text-[10px] uppercase tracking-[.12em] text-mutedgold">
        <span>{summary.xpIntoLevel.toLocaleString()} / {summary.xpForNextLevel.toLocaleString()} EXP</span>
        <span>Level {summary.level + 1} next</span>
      </div>
    </section>
  );
}
