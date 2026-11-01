"use client";

import { useEffect, useMemo, useState } from "react";
import type { Activity } from "../platform/learning";
import {
  clampDailyGoal,
  DEFAULT_DAILY_GOAL,
  dailyGoalInfo,
} from "../platform/learning";

export default function DailyGoalsPanel({
  activities,
  goal,
  goalByDay,
  onSetGoal,
}: {
  activities: readonly Activity[];
  goal?: number;
  goalByDay?: Record<string, number>;
  onSetGoal: (goal: number) => void;
}) {
  const currentGoal = clampDailyGoal(goal ?? DEFAULT_DAILY_GOAL);
  const [draft, setDraft] = useState(String(currentGoal));
  const info = useMemo(
    () => dailyGoalInfo(activities, currentGoal, goalByDay),
    [activities, currentGoal, goalByDay],
  );

  useEffect(() => setDraft(String(currentGoal)), [currentGoal]);

  const percent = Math.min(100, Math.round((info.todayCount / Math.max(1, info.goal)) * 100));

  return (
    <section className="panel study-utility-panel" aria-label="Daily goal and streak">
      <div className="topbar study-utility-panel__header">
        <div className="study-utility-panel__heading">
          <h2 className="study-utility-panel__title">Daily Goal &amp; Streak</h2>
          <div className="sub study-utility-panel__description">Build a steady study habit · answers are counted locally in this course</div>
        </div>
      </div>

      <div className="study-utility-metrics study-utility-metrics--goals">
        <div className="study-utility-metric">
          <span className="study-utility-metric__label">Today's progress</span>
          <strong className="study-utility-metric__value">{info.todayCount} / {info.goal}</strong>
          <span className="study-utility-metric__detail" style={{ color: info.reached ? "var(--good)" : "var(--dim)" }}>
            {info.reached ? "Goal reached" : `${Math.max(0, info.goal - info.todayCount)} more to reach today's goal`}
          </span>
          <div style={{ height: "0.45rem", width: "100%", borderRadius: "999px", background: "var(--panel-line)", overflow: "hidden", marginTop: "0.25rem" }}>
            <div style={{ height: "100%", width: `${percent}%`, background: info.reached ? "var(--good)" : "var(--gold)", transition: "width 160ms ease" }} />
          </div>
        </div>
        <div className="study-utility-metric">
          <span className="study-utility-metric__label">Current streak</span>
          <strong className="study-utility-metric__value">{info.streak} {info.streak === 1 ? "day" : "days"}</strong>
          <span className="study-utility-metric__detail">Best: {info.bestStreak} {info.bestStreak === 1 ? "day" : "days"}</span>
        </div>
      </div>

      <div className="study-utility-visual">
        <div style={{ fontWeight: 600, marginBottom: "0.65rem" }}>This week</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", gap: "0.45rem" }}>
          {info.week.map((day) => (
            <div key={day.key} style={{ minWidth: 0, textAlign: "center", padding: "0.55rem 0.15rem", borderRadius: "0.6rem", border: day.today ? "1px solid var(--gold)" : "1px solid var(--panel-line)", background: day.met ? "color-mix(in srgb, var(--good) 12%, transparent)" : "transparent", opacity: day.future ? 0.5 : 1 }}>
              <div style={{ fontSize: "0.72rem" }}>{day.label}</div>
              <div style={{ fontWeight: 700, fontSize: "0.95rem", marginTop: "0.25rem" }}>{day.count}</div>
              <div style={{ fontSize: "0.63rem", color: "var(--dim)", marginTop: "0.15rem" }}>of {day.goal}</div>
              <div style={{ fontSize: "0.7rem", marginTop: "0.15rem", color: day.met ? "var(--good)" : "var(--dim)" }}>
                {day.met ? "✓" : day.future ? "·" : "—"}
              </div>
            </div>
          ))}
        </div>
      </div>

      <form
        className="study-utility-form"
        onSubmit={(event) => {
          event.preventDefault();
          onSetGoal(clampDailyGoal(Number(draft)));
        }}
      >
        <label style={{ display: "flex", flexDirection: "column", gap: "0.35rem", fontSize: "0.85rem" }}>
          Daily target (1–200 answers)
          <input
            type="number"
            className="study-utility-control"
            min={1}
            max={200}
            inputMode="numeric"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            style={{ width: "10rem" }}
          />
        </label>
        <button className="btn btn-gold" type="submit">Save goal</button>
      </form>
      <p style={{ color: "var(--dim)", fontSize: "0.75rem", marginTop: "0.7rem" }}>
        An answer counts when it is recorded, including a submitted exam answer. Opening a lesson or viewing a solution alone does not count.
      </p>
    </section>
  );
}
