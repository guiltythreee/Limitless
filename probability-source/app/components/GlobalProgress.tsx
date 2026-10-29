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

  function equip(kind: "title" | "emblem" | "profile-effect", id: string) {
    const api = window.LimitlessRewards;
    if (!api) return;
    const result = api.equipReward(id, kind);
    if (result.ok && result.summary) {
      setSummary(result.summary);
      setAvailable(result.summary.available !== false);
    }
  }

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

  const effectId = summary.equippedProfileEffect?.id;
  const effectStyle = effectId === "polymath-glow"
    ? { borderColor: "rgba(232, 203, 139, .7)", boxShadow: "0 0 24px rgba(232, 203, 139, .12)" }
    : effectId === "radiant-archive"
      ? { borderColor: "rgba(170, 205, 255, .75)", boxShadow: "0 0 32px rgba(170, 205, 255, .16)" }
      : effectId === "limitless-aura"
        ? { borderColor: "rgba(210, 173, 255, .85)", boxShadow: "0 0 40px rgba(190, 135, 255, .2)" }
        : undefined;

  return (
    <section className="panel mx-auto mb-8 mt-5 max-w-[1440px] px-5 py-5 transition-shadow md:px-8" style={effectStyle}>
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
      {summary.nextReward ? (
        <p className="mt-3 text-xs text-dim">Next reward · <span className="text-gold">{summary.nextReward.name}</span> at Level {summary.nextReward.level}</p>
      ) : (
        <p className="mt-3 text-xs text-dim">All currently defined global rewards unlocked.</p>
      )}
      {(summary.unlockedRewards?.length ?? 0) > 0 && (
        <p className="mt-2 text-xs leading-5 text-dim">
          Unlocked · {summary.unlockedRewards?.map((reward) => reward.name).join(" · ")}
        </p>
      )}

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <label className="block text-xs text-dim">
          <span className="mb-1 block uppercase tracking-[.12em]">Equipped title</span>
          <select className="w-full border border-gold/25 bg-ink px-3 py-2 text-xs text-body" value={summary.equippedTitle?.id ?? ""} onChange={(event) => equip("title", event.target.value)}>
            <option value="">None equipped</option>
            {(summary.unlockedRewards ?? []).filter((reward) => reward.kind === "title").map((reward) => <option key={reward.id} value={reward.id}>{reward.name}</option>)}
          </select>
        </label>
        <label className="block text-xs text-dim">
          <span className="mb-1 block uppercase tracking-[.12em]">Equipped emblem</span>
          <select className="w-full border border-gold/25 bg-ink px-3 py-2 text-xs text-body" value={summary.equippedEmblem?.id ?? ""} onChange={(event) => equip("emblem", event.target.value)}>
            <option value="">None equipped</option>
            {(summary.unlockedRewards ?? []).filter((reward) => reward.kind === "emblem").map((reward) => <option key={reward.id} value={reward.id}>{reward.name}</option>)}
          </select>
        </label>
        <label className="block text-xs text-dim">
          <span className="mb-1 block uppercase tracking-[.12em]">Profile effect</span>
          <select className="w-full border border-gold/25 bg-ink px-3 py-2 text-xs text-body" value={summary.equippedProfileEffect?.id ?? ""} onChange={(event) => equip("profile-effect", event.target.value)}>
            <option value="">None equipped</option>
            {(summary.unlockedRewards ?? []).filter((reward) => reward.kind === "profile-effect").map((reward) => <option key={reward.id} value={reward.id}>{reward.name}</option>)}
          </select>
        </label>
      </div>

      {Object.keys(summary.xpByModule ?? {}).length > 0 && (
        <div className="mt-5 border-t border-gold/15 pt-4">
          <div className="eyebrow mb-2">EXP by discipline</div>
          <div className="space-y-2">
            {Object.entries(summary.xpByModule ?? {}).sort((a, b) => b[1] - a[1]).map(([module, xp]) => (
              <div key={module} className="flex items-center justify-between gap-3 text-xs">
                <span className="capitalize text-dim">{module.replace(/-/g, " ")}</span>
                <strong className="text-body">{xp.toLocaleString()} EXP</strong>
              </div>
            ))}
          </div>
        </div>
      )}

      {(summary.disciplineAchievements?.length ?? 0) > 0 && (
        <div className="mt-5 border-t border-gold/15 pt-4">
          <div className="eyebrow mb-2">Discipline achievements</div>
          <div className="space-y-3">
            {summary.disciplineAchievements?.slice(0, 5).map((achievement) => (
              <div key={achievement.id} className="border-b border-gold/10 pb-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <span className="text-xs font-semibold capitalize text-body">{achievement.module.replace(/-/g, " ")} · {achievement.activityClass.replace(/-/g, " ")}</span>
                  <span className="text-xs font-bold text-gold">+{achievement.xp} EXP</span>
                </div>
                <p className="mt-1 text-[10px] leading-4 text-dim">{achievement.reason || achievement.contentKey}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {(summary.recentAwards?.length ?? 0) > 0 && (
        <div className="mt-5 border-t border-gold/15 pt-4">
          <div className="eyebrow mb-2">Recent global EXP awards</div>
          <div className="space-y-3">
            {summary.recentAwards?.slice(0, 5).map((award) => (
              <div key={award.id} className="border-b border-gold/10 pb-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <span className="text-xs font-semibold capitalize text-body">
                    {award.module.replace(/-/g, " ")} · {award.activityClass.replace(/-/g, " ")}
                  </span>
                  <span className="text-xs font-bold text-gold">+{award.xp} EXP</span>
                </div>
                <p className="mt-1 text-[10px] leading-4 text-dim">
                  Evidence: {award.evidence || "recorded activity"} · {award.difficulty}
                  {award.difficultyMultiplier !== 1 ? ` ×${award.difficultyMultiplier}` : ""}
                  {award.quality !== null ? ` · ${Math.round(award.quality * 100)}% quality` : ""}
                  {award.repeatMultiplier < 1 ? ` · repeat ×${award.repeatMultiplier}` : ""}
                </p>
                {award.reason && <p className="mt-1 text-[10px] leading-4 text-faint">{award.reason}</p>}
                <p className="mt-1 text-[9px] text-faint">{award.version} · {new Date(award.timestamp).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
