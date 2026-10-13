"use client";

import { useState } from "react";
import { lessons, ranks, pad2 } from "../content";
import { allQuestions } from "../lib/questions";
import type { Scope } from "../lib/stats";
import { GoalCard, StatsPanel, StreakCard } from "./Dashboard";

export default function Analysis() {
  const [kind, setKind] = useState<"all" | "rank" | "lesson">("all");
  const [rank, setRank] = useState(9);
  const [lessonId, setLessonId] = useState(lessons[0].id);
  const scope: Scope = kind === "all" ? { kind: "all" } : kind === "rank" ? { kind: "rank", rank } : { kind: "lesson", id: lessonId };
  const pool = allQuestions.filter((q) => kind === "all" || (kind === "rank" ? q.rank === rank : q.lessonId === lessonId)).length;
  const rankChoices = ranks.filter((r) => allQuestions.some((q) => q.rank === r.num));

  const control = (
    <div className="flex flex-wrap items-center gap-2">
      <select value={kind} onChange={(e) => setKind(e.target.value as typeof kind)} className="pill" aria-label="Scope">
        <option value="all">Complete probability</option>
        <option value="rank">One chapter (sequence)</option>
        <option value="lesson">One topic</option>
      </select>
      {kind === "rank" && <select value={rank} onChange={(e) => setRank(Number(e.target.value))} className="pill" aria-label="Sequence">{rankChoices.map((r) => <option key={r.num} value={r.num}>Sequence {pad2(r.num)} · {r.name}</option>)}</select>}
      {kind === "lesson" && <select value={lessonId} onChange={(e) => setLessonId(e.target.value)} className="pill max-w-[240px]" aria-label="Topic">{lessons.filter((l) => l.quiz.length).map((l) => <option key={l.id} value={l.id}>{l.title}</option>)}</select>}
    </div>
  );

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div className="grid gap-5 md:grid-cols-2"><GoalCard /><StreakCard /></div>
      <StatsPanel scope={scope} poolSize={pool} scopeControl={control} />
    </div>
  );
}
