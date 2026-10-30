"use client";

import { useMemo, useState } from "react";
import type { Activity, AttemptMode, Period } from "../platform/learning";
import { PERIODS, dayKey, latestByQuestion, selectActivities, summarise } from "../platform/learning";

export type ActivityHistoryTopic = {
  id: string;
  title: string;
  unitId?: string;
};

const fmtElapsed = (ms: number) => {
  const seconds = Math.floor(Math.max(0, ms) / 1000);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
};

const MODE_LABEL: Record<AttemptMode | "any", string> = {
  any: "All modes",
  learn: "Learn",
  practice: "Practice",
  exam: "Exam",
  revision: "Revision",
};

export default function ActivityHistoryPanel({
  activities,
  topics,
  resolveTopic,
  onOpen,
  view = "history",
}: {
  activities: readonly Activity[];
  topics: readonly ActivityHistoryTopic[];
  resolveTopic: (questionId: string) => string | undefined;
  onOpen: (questionId: string, topicId: string) => void;
  view?: "history" | "mistakes";
}) {
  const [period, setPeriod] = useState<Period>("week");
  const [mode, setMode] = useState<AttemptMode | "any">("any");
  const topicById = useMemo(() => new Map(topics.map((topic) => [topic.id, topic])), [topics]);

  const filtered = useMemo(
    () => selectActivities(activities, { period, mode }, {}, Date.now()),
    [activities, period, mode],
  );
  const latest = useMemo(() => latestByQuestion(filtered), [filtered]);
  const rows = useMemo(() => {
    const list = view === "mistakes"
      ? Object.values(latest).filter((activity) => !activity.correct)
      : [...filtered];
    return list.sort((a, b) => b.ts - a.ts || b.q.localeCompare(a.q));
  }, [view, latest, filtered]);
  const summary = useMemo(() => summarise(filtered), [filtered]);

  const week = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Array.from({ length: 7 }, (_, index) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (6 - index));
      const key = dayKey(d.getTime());
      const matching = filtered.filter((activity) => activity.ts > 0 && dayKey(activity.ts) === key);
      return {
        key,
        label: d.toLocaleDateString(undefined, { weekday: "short" }),
        total: matching.length,
        correct: matching.filter((activity) => activity.correct).length,
      };
    });
  }, [filtered]);
  const maxDaily = Math.max(1, ...week.map((day) => day.total));

  return (
    <section className="panel" aria-label={view === "mistakes" ? "Mistakes" : "Attempt history"}>
      <div className="topbar">
        <div>
          <h2>{view === "mistakes" ? "Latest Mistakes" : "Attempt History"}</h2>
          <div className="sub">
            {view === "mistakes"
              ? "Questions whose most recent recorded attempt in this filter was incorrect"
              : "Every recorded answer, including retries · saved locally in this course"}
          </div>
        </div>
        <span className="chip">{rows.length} {view === "mistakes" ? "questions" : "entries"}</span>
      </div>

      <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", alignItems: "center", marginBottom: "1rem" }}>
        <label style={{ display: "flex", gap: "0.4rem", alignItems: "center", fontSize: "0.85rem" }}>
          Period
          <select className="field" aria-label="History period" value={period} onChange={(event) => setPeriod(event.target.value as Period)}>
            {PERIODS.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
          </select>
        </label>
        <label style={{ display: "flex", gap: "0.4rem", alignItems: "center", fontSize: "0.85rem" }}>
          Mode
          <select className="field" aria-label="Attempt mode" value={mode} onChange={(event) => setMode(event.target.value as AttemptMode | "any")}>
            {(["any", "learn", "practice", "exam", "revision"] as const).map((item) => (
              <option key={item} value={item}>{MODE_LABEL[item]}</option>
            ))}
          </select>
        </label>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(7rem, 1fr))", gap: "0.6rem", marginBottom: "1.2rem" }}>
        {[
          { label: "Attempts", value: String(summary.attempts) },
          { label: "Questions", value: String(summary.questions) },
          { label: "Accuracy", value: summary.attempts ? `${Math.round(summary.accuracy * 100)}%` : "—" },
          { label: "Timed avg.", value: summary.timed ? fmtElapsed(summary.avgMs) : "—" },
        ].map((tile) => (
          <div key={tile.label} className="chip" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "0.2rem", padding: "0.65rem 0.8rem" }}>
            <span style={{ fontSize: "0.72rem", opacity: 0.8 }}>{tile.label}</span>
            <strong style={{ fontSize: "1.1rem" }}>{tile.value}</strong>
          </div>
        ))}
      </div>

      <div style={{ border: "1px solid var(--panel-line)", borderRadius: "0.75rem", padding: "0.8rem", marginBottom: "1.2rem" }}>
        <div style={{ fontWeight: 600, marginBottom: "0.5rem" }}>Daily activity · last 7 days</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", gap: "0.45rem", alignItems: "end" }}>
          {week.map((day) => (
            <div key={day.key} style={{ minWidth: 0, textAlign: "center" }}>
              <div style={{ height: "4.5rem", display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "stretch", margin: "0 auto", maxWidth: "2rem" }} aria-label={`${day.key}: ${day.total} attempts, ${day.correct} correct`}>
                <div style={{ height: `${(day.total - day.correct) / maxDaily * 64}px`, background: "var(--bad)", minHeight: day.total > day.correct ? "2px" : 0 }} />
                <div style={{ height: `${day.correct / maxDaily * 64}px`, background: "var(--good)", minHeight: day.correct > 0 ? "2px" : 0 }} />
              </div>
              <div style={{ fontSize: "0.7rem", marginTop: "0.35rem" }}>{day.label}</div>
              <div style={{ fontSize: "0.68rem", color: "var(--dim)" }}>{day.total}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: "0.8rem", fontSize: "0.72rem", color: "var(--dim)", marginTop: "0.6rem" }}>
          <span><i style={{ display: "inline-block", width: "0.55rem", height: "0.55rem", background: "var(--good)", marginRight: "0.3rem" }} />Correct</span>
          <span><i style={{ display: "inline-block", width: "0.55rem", height: "0.55rem", background: "var(--bad)", marginRight: "0.3rem" }} />Incorrect</span>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="prose">
          <p>{view === "mistakes" ? "No latest mistakes match these filters. Keep practising." : "No attempts match these filters yet."}</p>
        </div>
      ) : (
        <div>
          {rows.map((activity, index) => {
            const topicId = resolveTopic(activity.q) ?? activity.topicId;
            const topic = topicById.get(topicId);
            return (
              <article key={`${activity.courseId}|${activity.q}|${activity.ts}|${activity.mode}|${activity.picked}|${index}`} style={{ padding: "0.85rem 0", borderBottom: "1px solid var(--panel-line)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "0.6rem", flexWrap: "wrap", alignItems: "flex-start" }}>
                  <div style={{ minWidth: 0, flex: "1 1 14rem" }}>
                    <div style={{ fontWeight: 600 }}>
                      {topic?.title ?? topicId} · {activity.q}
                    </div>
                    <div style={{ color: "var(--dim)", fontSize: "0.78rem", marginTop: "0.2rem" }}>
                      {activity.ts > 0 ? new Date(activity.ts).toLocaleString() : "Date unknown"} · {MODE_LABEL[activity.mode]} · {activity.ms > 0 ? fmtElapsed(activity.ms) : "Time unknown"}
                      {activity.source === "legacy" ? " · legacy record" : ""}
                    </div>
                    <div style={{ fontSize: "0.85rem", marginTop: "0.35rem" }}>
                      Selected: <strong>{activity.picked}</strong> · <span style={{ color: activity.correct ? "var(--good)" : "var(--bad)" }}>{activity.correct ? "Correct" : "Incorrect"}</span>
                    </div>
                  </div>
                  {topic && (
                    <button className="btn" onClick={() => onOpen(activity.q, topic.id)}>
                      Open question →
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
