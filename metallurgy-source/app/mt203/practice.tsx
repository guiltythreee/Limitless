"use client";

// Practice sets. Three modes, one player:
//   mixed    — random draw from a module (or the whole course)
//   weak     — questions from topics where accuracy is poor, worst first
//   revision — spaced-repetition set built from the attempt history
//
// Questions are loaded on demand through the registry adapter (dynamic import
// per topic), so opening a practice set only downloads the chunks it actually
// needs. Progress keys and XP rules are unchanged.

import { useEffect, useMemo, useState } from "react";
import {
  ALL_QUESTION_IDS,
  TOPIC_META,
  TOPIC_OF,
} from "../data/qbank/meta";
import {
  Progress,
  questionStats,
  selectRevision,
  topicAggregate,
} from "../lib/mt203-progress";
import { MT203_ENTRY } from "../courses/entries/mt203";
import Player from "./player";
import type { Question } from "../courses/types";

export type PracticeMode = "mixed" | "weak" | "revision";

const MANIFEST = MT203_ENTRY.manifest;
const adapter = MT203_ENTRY.adapter;

// PHASE 4b: questions come from the registry adapter. Whole-bank draws load it
// topic by topic, so the per-topic dynamic imports (and therefore the separate
// production chunks) stay exactly as they were.
const loadAllQuestions = async (): Promise<Question[]> => {
  const parts = await Promise.all(MANIFEST.topics.map((t) => adapter.loadTopic(t.id)));
  return parts.flatMap((c) => c.questions);
};

const loadUnitQuestions = (unitId: string): Promise<Question[]> => {
  if (!adapter.loadUnit) return Promise.reject(new Error(`no unit loader for ${unitId}`));
  return adapter.loadUnit(unitId);
};

const shuffle = <T,>(a: T[]): T[] => {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
};

const TITLES: Record<string, string> = Object.fromEntries(TOPIC_META.map((t) => [t.id, t.title]));

export default function Practice({
  mode,
  scope,
  count,
  progress,
  onProgress,
  onFinished,
  onExit,
}: {
  mode: PracticeMode;
  scope: string; // module id, or "all"
  count: number;
  progress: Progress;
  onProgress: (p: Progress) => void;
  onFinished: (p: Progress) => void;
  onExit: () => void;
}) {
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [note, setNote] = useState("");

  useEffect(() => {
    let live = true;
    setQuestions(null);
    setNote("");

    (async () => {
      let pool: Question[];

      if (mode === "mixed") {
        pool = scope === "all"
          ? await loadAllQuestions()
          : await loadUnitQuestions(scope);
        pool = shuffle(pool).slice(0, count);
      } else {
        // weak + revision both need the whole bank to judge topics
        const all = await loadAllQuestions();
        const byId = new Map(all.map((q) => [q.id, q]));
        if (mode === "revision") {
          const ids = selectRevision(progress, ALL_QUESTION_IDS, count);
          pool = ids.map((id) => byId.get(id)!).filter(Boolean);
          if (pool.length === 0) {
            // nothing seen yet → seed with a gentle mixed draw
            pool = shuffle(all).slice(0, count);
            if (live) setNote("Nothing is due yet, so here is a mixed warm-up. Answer a few and revision will populate.");
          }
        } else {
          const agg = topicAggregate(progress, TOPIC_OF, ALL_QUESTION_IDS);
          const ranked = TOPIC_META.map((t) => ({ id: t.id, a: agg[t.id] }))
            .filter((x) => x.a && x.a.done > 0)
            .sort((x, y) => x.a.acc - y.a.acc || x.a.pct - y.a.pct);
          const weakTopics = new Set(ranked.filter((x) => x.a.weak).map((x) => x.id));
          const focus = weakTopics.size > 0 ? weakTopics : new Set(ranked.slice(0, 3).map((x) => x.id));
          const stats = questionStats(progress, ALL_QUESTION_IDS);
          pool = all.filter(
            (q) =>
              focus.has(q.topicId) &&
              (!stats[q.id]?.seen || stats[q.id].correct === 0),
          );
          pool = shuffle(pool).slice(0, count);
          if (pool.length === 0) {
            if (live) setNote("No weak spots detected yet — attempt more questions and this will target them.");
            pool = shuffle(all.filter((q) => focus.has(q.topicId))).slice(0, count);
          }
        }
      }

      if (live) setQuestions(pool);
    })().catch(() => live && setQuestions([]));

    return () => {
      live = false;
    };
    // progress intentionally excluded: we only want to build once per mode/scope
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, scope, count]);

  const title = useMemo(
    () =>
      mode === "mixed"
        ? scope === "all" ? "Mixed practice — whole course" : "Mixed practice"
        : mode === "weak" ? "Weak-area training" : "Spaced revision",
    [mode, scope],
  );

  if (!questions) {
    return (
      <div className="panel prose">
        <p>Assembling your set…</p>
      </div>
    );
  }

  return (
    <>
      {note && (
        <div className="panel" style={{ padding: "0.7rem 1rem", marginBottom: "0.8rem", color: "var(--dim)", fontSize: "0.86rem" }}>
          {note}
        </div>
      )}
      <Player
        questions={questions}
        mode={mode === "revision" ? "revision" : "practice"}
        label={title}
        progress={progress}
        onProgress={onProgress}
        topicTitles={TITLES}
        onFinished={onFinished}
        onExit={onExit}
      />
    </>
  );
}
