"use client";

import { useMemo, useState } from "react";
import type { Topic } from "./types";

type TopicStats = { done: number; right: number; total: number };
type Props = {
  code: string;
  title: string;
  description?: string;
  topics: readonly Topic[];
  units?: readonly { id: string; title: string }[];
  totalQuestions: number;
  statsFor: (topicId: string) => TopicStats;
  onSelect: (topicId: string) => void;
};

export default function CourseChapterBrowser({
  code, title, description, topics, units = [], totalQuestions, statsFor, onSelect,
}: Props) {
  const [query, setQuery] = useState("");
  const [unit, setUnit] = useState("all");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("number");

  const unitByTopic = useMemo(() => {
    const map = new Map<string, string>();
    for (const group of units) {
      // The caller supplies topic order separately; unit labels are optional.
      map.set(group.id, group.title);
    }
    return map;
  }, [units]);

  const rows = useMemo(() => {
    let list = topics.filter((topic) => {
      const s = statsFor(topic.id);
      const q = query.trim().toLowerCase();
      const matchesQuery = !q || topic.title.toLowerCase().includes(q) || topic.id.toLowerCase().includes(q);
      const matchesUnit = unit === "all" || topic.unitId === unit;
      const pct = s.total ? s.right / Math.max(1, s.done) : 0;
      const matchesStatus =
        status === "all" ||
        (status === "not-started" && s.done === 0) ||
        (status === "in-progress" && s.done > 0 && s.done < s.total) ||
        (status === "completed" && s.total > 0 && s.done >= s.total) ||
        (status === "weak" && s.done > 0 && pct < 0.6);
      return matchesQuery && matchesUnit && matchesStatus;
    });
    if (sort === "name") list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    if (sort === "progress") list = [...list].sort((a, b) => {
      const x = statsFor(a.id), y = statsFor(b.id);
      return (x.total ? x.done / x.total : 0) - (y.total ? y.done / y.total : 0);
    });
    if (sort === "questions") list = [...list].sort((a, b) => b.count - a.count);
    return list;
  }, [topics, query, unit, status, sort, statsFor]);

  const totals = topics.reduce((acc, t) => {
    const s = statsFor(t.id);
    acc.attempted += s.done;
    acc.correct += s.right;
    return acc;
  }, { attempted: 0, correct: 0 });

  return (
    <section className="course-browser" aria-label={`${code} chapter browser`}>
      <header className="cb-heading">
        <div>
          <div className="cb-eyebrow">{code} · COURSE OVERVIEW</div>
          <h1>{title}</h1>
          <p>{description || "Choose a chapter to continue learning and practising."}</p>
        </div>
        <div className="cb-summary">
          <span><strong>{totalQuestions}</strong><small>Questions</small></span>
          <span><strong>{topics.length}</strong><small>Chapters</small></span>
          <span><strong>{totals.attempted}</strong><small>Attempted</small></span>
          <span><strong>{totals.correct}</strong><small>Correct</small></span>
        </div>
      </header>

      <div className="cb-toolbar">
        <label className="cb-search">
          <span aria-hidden="true">⌕</span>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search chapters…" />
        </label>
        <div className="cb-filters">
          {units.length > 0 && (
            <select aria-label="Filter by unit" value={unit} onChange={(e) => setUnit(e.target.value)}>
              <option value="all">All Units</option>
              {units.map((u) => <option key={u.id} value={u.id}>{u.title}</option>)}
            </select>
          )}
          <select aria-label="Filter by progress" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">All Chapters</option>
            <option value="not-started">Not Started</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="weak">Weak Chapters</option>
          </select>
          <select aria-label="Sort chapters" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="number">Chapter Order</option>
            <option value="name">Name</option>
            <option value="progress">Least Progress</option>
            <option value="questions">Question Count</option>
          </select>
        </div>
      </div>

      <div className="cb-list-head">
        <span>Showing {rows.length} of {topics.length} chapters</span>
        <span>Questions · Progress · Accuracy</span>
      </div>

      <div className="cb-chapters">
        {rows.map((topic, index) => {
          const s = statsFor(topic.id);
          const pct = s.total ? Math.round((s.done / s.total) * 100) : 0;
          const accuracy = s.done ? Math.round((s.right / s.done) * 100) : 0;
          return (
            <button className="cb-chapter" key={topic.id} onClick={() => onSelect(topic.id)}>
              <span className="cb-number">{String(topic.num || index + 1).padStart(2, "0")}</span>
              <span className="cb-name">
                <strong>{topic.title}</strong>
                {topic.subtitle && <small>{topic.subtitle}</small>}
                <span className="cb-progress"><i style={{ width: `${pct}%` }} /></span>
              </span>
              <span className="cb-metrics">
                <span>{s.done}/{s.total} <small>attempted</small></span>
                <span>{s.right} <small>correct</small></span>
                <span>{accuracy}% <small>accuracy</small></span>
              </span>
              <span className="cb-arrow" aria-hidden="true">→</span>
            </button>
          );
        })}
        {rows.length === 0 && <div className="cb-empty">No chapters match these filters.</div>}
      </div>
    </section>
  );
}
