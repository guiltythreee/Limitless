"use client";

// MT203 dashboard — the module's home screen. Everything here reads from
// metadata + the local progress ledger, so it renders instantly without
// downloading any question text. Question chunks load only when you open a
// topic, practice set or exam.

import {
  ALL_QUESTION_IDS,
  MODULE_META,
  moduleQuestionIds,
  TOPIC_META,
  TOPIC_OF,
  TOTAL_QUESTIONS,
  topicsOfModule,
} from "../data/qbank/meta";
import { buildConceptMastery, buildConceptMistakeSummary, recommendConceptPractice } from "../../../shared/studies/intelligence.mjs";
import { MISTAKE_CATEGORIES, type MistakeCategory } from "../../../shared/studies/mistakes";
import type { LearningAttempt } from "../../../shared/studies/intelligence.mjs";
import {
  BONUS,
  dueInDays,
  moduleAgg,
  Progress,
  questionStats,
  rankFor,
  setGoal,
  streakInfo,
  topicAggregate,
  totalXp,
} from "../lib/mt203-progress";

export type DashNav = {
  study: (topicId: string) => void;
  practice: (mode: "mixed" | "weak" | "revision", scope: string) => void;
  exam: () => void;
};

export default function Dashboard({
  progress,
  onProgress,
  nav,
  lastTopic,
}: {
  progress: Progress;
  onProgress: (p: Progress) => void;
  nav: DashNav;
  lastTopic: string | null;
}) {
  const xp = totalXp(progress);
  const rank = rankFor(xp);
  const streak = streakInfo(progress);
  const stats = questionStats(progress, ALL_QUESTION_IDS);
  const byTopic = topicAggregate(progress, TOPIC_OF, ALL_QUESTION_IDS);
  const intelligenceAttempts: LearningAttempt[] = progress.attempts.flatMap((attempt, index) => {
    const topicId = TOPIC_OF[attempt.q];
    const topic = TOPIC_META.find((item) => item.id === topicId);
    if (!topic || !Number.isFinite(attempt.ts) || attempt.ts <= 0) return [];
    return [{
      id: `mt203:${attempt.q}:${attempt.ts}:${index}`,
      disciplineId: "metallurgy",
      courseId: "mt203",
      contentId: topic.id,
      questionId: attempt.q,
      subjectId: "mt203",
      conceptIds: [topic.title],
      outcome: attempt.correct ? "correct" as const : "incorrect" as const,
      occurredAt: attempt.ts,
      elapsedMs: attempt.ms,
      mode: attempt.mode,
      independent: attempt.independent === true,
      hintCount: attempt.hintCount ?? 0,
      mistakeCategory: attempt.mistakeCategory,
    }];
  });
  const sharedMastery = buildConceptMastery(intelligenceAttempts);
  const sharedWeak = recommendConceptPractice(sharedMastery, 5);
  const sharedMistakes = buildConceptMistakeSummary(intelligenceAttempts).slice(0, 3);

  const mods = MODULE_META.map((m) => ({
    meta: m,
    agg: moduleAgg(progress, m.id, moduleQuestionIds(m.id), TOPIC_OF, topicsOfModule(m.id)),
  }));

  const seen = mods.reduce((n, x) => n + x.agg.seen, 0);
  const right = mods.reduce((n, x) => n + x.agg.right, 0);
  const mastered = mods.reduce((n, x) => n + x.agg.mastered, 0);
  const acc = seen ? Math.round((right / seen) * 100) : 0;

  const due = ALL_QUESTION_IDS.filter((id) => stats[id].seen && dueInDays(stats[id]) <= 0).length;
  const weak = TOPIC_META.filter((t) => byTopic[t.id]?.weak);

  const resume = lastTopic ?? "t1";

  return (
    <div className="dash">
      {/* hero */}
      <section className="panel dash-hero">
        <div className="dash-hero-main">
          <div className="eyebrow">Polymer Science &amp; Technology</div>
          <h1>MT203 · Polymers</h1>
          <p className="sub">
            {TOTAL_QUESTIONS} questions across {TOPIC_META.length} topics and four modules —
            theory, practice, spaced revision and a timed exam.
          </p>
          <div className="dash-actions">
            <button className="btn btn-gold" onClick={() => nav.study(resume)}>
              Continue studying →
            </button>
            <button className="btn" onClick={() => nav.practice("mixed", "all")}>
              Mixed practice
            </button>
            <button className="btn" onClick={() => nav.practice("revision", "all")}>
              Revision{due > 0 ? ` · ${due} due` : ""}
            </button>
            <button className="btn" onClick={() => nav.exam()}>
              Timed exam
            </button>
          </div>
        </div>

        <div className="dash-hero-side">
          <div className="xpbig">{xp.toLocaleString()}</div>
          <div className="eyebrow">XP · {rank.name}</div>
          <div className="rankbar" title={rank.next ? `Next rank at ${rank.next} XP` : "Top rank"}>
            <i style={{ width: `${rank.pct}%` }} />
          </div>
          <div className="dash-hero-sub">
            {rank.next ? `${Math.max(0, rank.next - xp)} XP to the next rank` : "Highest rank reached"}
          </div>
          <div className="dash-hero-sub">
            🔥 {streak.streak}-day streak · today {streak.today}/{streak.goal}
            <button
              className="goal-btn"
              onClick={() => onProgress(setGoal(progress, progress.goal + 5))}
              title="Raise daily goal"
            >
              +
            </button>
            <button
              className="goal-btn"
              onClick={() => onProgress(setGoal(progress, progress.goal - 5))}
              title="Lower daily goal"
            >
              −
            </button>
          </div>
        </div>
      </section>

      {/* stat cards */}
      <section className="dash-stats">
        <Stat label="Attempted" value={`${seen}/${TOTAL_QUESTIONS}`} sub={`${Math.round((seen / TOTAL_QUESTIONS) * 100)}% of the bank`} />
        <Stat label="Accuracy" value={`${acc}%`} sub={`${right} correct on latest tries`} />
        <Stat label="Mastered" value={`${mastered}`} sub="2 correct in a row" />
        <Stat label="Exams" value={`${progress.exams.length}`} sub={progress.best ? `best ${progress.best.score}/${progress.best.total}` : "none yet"} />
      </section>

      {/* quick actions */}
      <section className="panel dash-quick">
        <div className="eyebrow" style={{ marginBottom: "0.6rem" }}>Drill</div>
        <div className="dash-actions">
          <button className="btn" onClick={() => nav.practice("weak", "all")}>
            🎯 Weak-area training {weak.length > 0 ? `· ${weak.length} topic${weak.length > 1 ? "s" : ""}` : ""}
          </button>
          <button className="btn" onClick={() => nav.practice("revision", "all")}>
            🗓 Revision {due > 0 ? `· ${due} due` : ""}
          </button>
          <button className="btn" onClick={() => nav.practice("mixed", "all")}>
            🎲 Mixed 20
          </button>
        </div>
      </section>

      {/* weak topics */}
      {weak.length > 0 && (
        <section className="panel dash-weak">
          <div className="eyebrow" style={{ marginBottom: "0.5rem" }}>Weak topics</div>
          <div className="weak-grid">
            {weak.map((t) => {
              const a = byTopic[t.id];
              return (
                <button key={t.id} className="weak-chip" onClick={() => nav.study(t.id)}>
                  <b>{t.title}</b>
                  <span>{Math.round(a.acc * 100)}% · {a.done}/{a.total}</span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Shared, discipline-neutral mastery projection. Existing MT203 mastery and revision rules remain authoritative. */}
      {sharedMastery.length > 0 && (
        <section className="panel dash-weak" aria-label="Shared learning intelligence">
          <div className="eyebrow" style={{ marginBottom: "0.5rem" }}>Learning intelligence · topic mastery</div>
          <div className="weak-grid">
            {sharedMastery.map((item) => (
              <div key={item.key} className="weak-chip">
                <b>{item.label}</b>
                <span>{item.attempts} attempts · {Math.round(item.accuracy * 100)}% · {
                  item.status === "insufficient-data" ? "Building baseline" :
                  item.status === "developing" ? "Developing" :
                  item.status === "secure" ? "Secure" : "Mastered"
                }</span>
              </div>
            ))}
          </div>
          {sharedWeak.length > 0 && (
            <p className="sub" style={{ marginTop: "0.7rem" }}>
              Suggested focus: {sharedWeak.slice(0, 3).map((item) => item.label).join(" · ")}.
            </p>
          )}
          {sharedMistakes.length > 0 && (
            <div style={{ marginTop: "0.8rem", borderTop: "1px solid var(--line)", paddingTop: "0.7rem" }}>
              <div className="eyebrow">Recurring mistake causes</div>
              {sharedMistakes.map((item) => (
                <p key={item.key} className="sub" style={{ marginTop: "0.35rem" }}>
                  {item.conceptLabel} · {MISTAKE_CATEGORIES.find((category) => category.id === (item.category as MistakeCategory))?.label ?? item.category} · {item.occurrences} repeat{item.occurrences === 1 ? "" : "s"}
                </p>
              ))}
            </div>
          )}
        </section>
      )}

      {/* modules */}
      <section>
        <div className="eyebrow" style={{ margin: "0.4rem 0 0.7rem" }}>Modules</div>
        <div className="mod-grid">
          {mods.map(({ meta, agg }) => {
            const pct = agg.total ? Math.round((agg.seen / agg.total) * 100) : 0;
            const a = agg.seen ? Math.round((agg.right / agg.seen) * 100) : 0;
            return (
              <div className="panel mod-card" key={meta.id}>
                <div className="mod-head">
                  <span className="ch-num">M{meta.num}</span>
                  <span className="mod-title">{meta.title}</span>
                </div>
                <div className="mod-meta">
                  <span>{meta.topics.reduce((n, t) => n + t.count, 0)} questions</span>
                  <span className="ch-bar">
                    <i style={{ width: `${pct}%` }} />
                  </span>
                  <span className="ch-pct">{pct}%</span>
                </div>
                <div className="stats" style={{ marginTop: "0.5rem" }}>
                  <span className="chip">{agg.seen}/{agg.total} tried</span>
                  <span className="chip">{a}% acc</span>
                  {agg.clear && <span className="chip chip-gold">cleared · +{BONUS.moduleClear(meta.num)} XP</span>}
                  {agg.mastery && <span className="chip chip-gold">★ mastery · +{BONUS.mastery(meta.num)} XP</span>}
                </div>
                <div className="dash-actions" style={{ marginTop: "0.7rem" }}>
                  <button className="btn" onClick={() => nav.study(meta.topics[0].id)}>
                    Study
                  </button>
                  <button className="btn" onClick={() => nav.practice("mixed", meta.id)}>
                    Practise M{meta.num}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* topics */}
      <section>
        <div className="eyebrow" style={{ margin: "0.4rem 0 0.7rem" }}>All topics</div>
        <div className="topic-grid">
          {TOPIC_META.map((t) => {
            const a = byTopic[t.id];
            const pct = a?.pct ?? 0;
            return (
              <button className="panel topic-card" key={t.id} onClick={() => nav.study(t.id)}>
                <div className="mod-head">
                  <span className="ch-num">{t.id.replace("t", "T")}</span>
                  <span className="mod-title">{t.title}</span>
                </div>
                <div className="mod-meta">
                  <span>{t.count} q</span>
                  <span className="ch-bar">
                    <i style={{ width: `${pct}%` }} />
                  </span>
                  <span className="ch-pct">{pct}%</span>
                </div>
                {a && a.done > 0 && (
                  <div className="stats" style={{ marginTop: "0.45rem" }}>
                    <span className="chip">{a.done}/{a.total}</span>
                    <span className={`chip ${a.weak ? "chip-trap" : ""}`}>{Math.round(a.acc * 100)}%</span>
                    {a.mastered > 0 && <span className="chip chip-gold">★ {a.mastered}</span>}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="panel stat-card">
      <div className="eyebrow">{label}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-sub">{sub}</div>
    </div>
  );
}
