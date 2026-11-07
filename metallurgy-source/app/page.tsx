"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { loadTheme, saveTheme } from "./lib/progress";
import { MT201_MANIFEST } from "./courses/manifests/mt201";
import { MT202_MANIFEST } from "./courses/manifests/mt202";
import { MT203_MANIFEST } from "./courses/manifests/mt203";
import { METALLURGY_STUDIES_REGISTRATION } from "./studies/registration";

const COURSES = [MT201_MANIFEST, MT202_MANIFEST, MT203_MANIFEST] as const;
type CourseId = (typeof COURSES)[number]["id"];

const totalFor = (course: (typeof COURSES)[number]) =>
  course.topics.reduce((sum, topic) => sum + topic.count, 0);

export default function Landing() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [selectedId, setSelectedId] = useState<CourseId>("mt201");
  const [snapshots, setSnapshots] = useState<ReturnType<NonNullable<typeof METALLURGY_STUDIES_REGISTRATION.readProgress>>>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("number");
  const [semester, setSemester] = useState("3");

  useEffect(() => {
    setTheme(loadTheme());
    try {
      setSnapshots(METALLURGY_STUDIES_REGISTRATION.readProgress?.() ?? []);
    } catch {
      setSnapshots([]);
    }
  }, []);

  const selected = COURSES.find((course) => course.id === selectedId) ?? COURSES[0];
  const snapshotById = useMemo(
    () => new Map(snapshots.map((snapshot) => [snapshot.contentId, snapshot])),
    [snapshots],
  );

  const rows = useMemo(() => {
    let result = selected.topics.filter((topic) => {
      const textMatch = !query.trim() ||
        topic.title.toLowerCase().includes(query.trim().toLowerCase()) ||
        topic.id.toLowerCase().includes(query.trim().toLowerCase());
      const snapshot = snapshotById.get(`${selected.id}:${topic.id}`);
      const currentStatus = snapshot?.status ?? "not-started";
      const statusMatch = status === "all" || status === currentStatus;
      return textMatch && statusMatch;
    });
    if (sort === "name") result = [...result].sort((a, b) => a.title.localeCompare(b.title));
    if (sort === "questions") result = [...result].sort((a, b) => b.count - a.count);
    if (sort === "progress") {
      const rank = (id: string) => {
        const value = snapshotById.get(`${selected.id}:${id}`)?.status;
        return value === "completed" ? 2 : value === "in-progress" ? 1 : 0;
      };
      result = [...result].sort((a, b) => rank(a.id) - rank(b.id));
    }
    return result;
  }, [selected, query, status, sort, snapshotById]);

  const courseStats = (course: (typeof COURSES)[number]) => {
    const states = course.topics.map((topic) =>
      snapshotById.get(`${course.id}:${topic.id}`)?.status ?? "not-started"
    );
    return {
      completed: states.filter((value) => value === "completed").length,
      inProgress: states.filter((value) => value === "in-progress").length,
      notStarted: states.filter((value) => value === "not-started").length,
    };
  };

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    saveTheme(next);
    document.documentElement.setAttribute("data-theme", next);
  };

  return (
    <div className="semester-hub">
      <header className="navbar">
        <Link className="brand" href="/">LIMITLESS</Link>
        <nav className="nav-links" aria-label="Main navigation">
          <Link href="/">Disciplines</Link>
          <Link href="/mt202/">Courses</Link>
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Switch theme">
            {theme === "dark" ? "◐" : "◑"}
          </button>
        </nav>
      </header>

      <div className="semester-layout">
        <aside className="semester-sidebar" aria-label="Metallurgy courses">
          <Link className="semester-back" href="/">← <span>Disciplines</span></Link>
          <div className="semester-brand">
            <span className="semester-brand-mark">⚗</span>
            <div><strong>Metallurgy</strong><small>3 learning routes</small></div>
          </div>
          <div className="semester-sidebar-label">SEMESTER 3 · COURSES</div>
          <div className="semester-course-list">
            {COURSES.map((course, index) => {
              const stats = courseStats(course);
              const active = selected.id === course.id;
              return (
                <button
                  key={course.id}
                  className={`semester-course ${active ? "is-active" : ""}`}
                  aria-pressed={active}
                  onClick={() => { setSelectedId(course.id); setQuery(""); setStatus("all"); setSort("number"); }}
                >
                  <span className="semester-course-symbol">{course.symbol}</span>
                  <span className="semester-course-copy">
                    <strong>{course.code} · {course.title}</strong>
                    <small>{course.topics.length} chapters · {totalFor(course).toLocaleString("en-IN")} questions</small>
                    <span className="semester-course-progress">
                      <i style={{ width: `${course.topics.length ? (stats.completed / course.topics.length) * 100 : 0}%` }} />
                    </span>
                  </span>
                  <span className="semester-course-index">0{index + 1}</span>
                </button>
              );
            })}
          </div>
          <div className="semester-sidebar-note">
            <span>YOUR SEMESTER</span>
            <strong>Semester 3</strong>
            <small>All three Metallurgy courses are registered in the third semester.</small>
          </div>
        </aside>

        <main className="semester-main">
          <div className="semester-main-heading">
            <div>
              <div className="semester-breadcrumb">LIMITLESS <span>/</span> METALLURGY <span>/</span> SEMESTER 3</div>
              <div className="semester-title-row">
                <div>
                  <div className="semester-eyebrow">{selected.code} · SEMESTER 3</div>
                  <h1>{selected.title}</h1>
                  <p>{selected.subtitle}</p>
                </div>
                <div className="semester-title-symbol">{selected.symbol}</div>
              </div>
            </div>
            <div className="semester-summary">
              <div><strong>{totalFor(selected).toLocaleString("en-IN")}</strong><span>Questions</span></div>
              <div><strong>{selected.topics.length}</strong><span>Chapters</span></div>
              <div><strong>{courseStats(selected).completed}</strong><span>Completed</span></div>
              <div><strong>{courseStats(selected).inProgress}</strong><span>In progress</span></div>
            </div>
          </div>

          <section className="semester-chapter-panel" aria-label="Chapter browser">
            <div className="semester-panel-heading">
              <div><span className="semester-eyebrow">START LEARNING</span><h2>{selected.code} Chapters</h2></div>
              <span className="semester-tag">SEMESTER 3</span>
            </div>

            <div className="semester-toolbar">
              <label className="semester-search">
                <span aria-hidden="true">⌕</span>
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search chapters…" />
              </label>
              <div className="semester-filters">
                <select aria-label="Semester" value={semester} onChange={(event) => setSemester(event.target.value)}>
                  <option value="3">Semester 3</option>
                </select>
                <select aria-label="Filter chapter progress" value={status} onChange={(event) => setStatus(event.target.value)}>
                  <option value="all">All Chapters</option>
                  <option value="not-started">Not Started</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                <select aria-label="Sort chapters" value={sort} onChange={(event) => setSort(event.target.value)}>
                  <option value="number">Chapter Order</option>
                  <option value="name">Name</option>
                  <option value="progress">Progress</option>
                  <option value="questions">Question Count</option>
                </select>
              </div>
            </div>

            <div className="semester-list-head">
              <span>Showing {rows.length} of {selected.topics.length} chapters</span>
              <span>Questions <i>·</i> Progress <i>·</i> Status</span>
            </div>

            <div className="semester-chapters">
              {rows.map((topic, index) => {
                const currentStatus = snapshotById.get(`${selected.id}:${topic.id}`)?.status ?? "not-started";
                const statusLabel = currentStatus === "completed" ? "Completed" : currentStatus === "in-progress" ? "In progress" : "Not started";
                return (
                  <Link className="semester-chapter" key={topic.id} href={`/${selected.route}/?chapter=${encodeURIComponent(topic.id)}`}>
                    <span className="semester-chapter-number">{String(topic.num || index + 1).padStart(2, "0")}</span>
                    <span className="semester-chapter-name"><strong>{topic.title}</strong><small>{selected.code} · Chapter {topic.num || index + 1}</small></span>
                    <span className="semester-chapter-count">{topic.count.toLocaleString("en-IN")} <small>Qs</small></span>
                    <span className={`semester-chapter-status status-${currentStatus}`}>{statusLabel}</span>
                    <span className="semester-chapter-arrow">→</span>
                  </Link>
                );
              })}
              {rows.length === 0 && <div className="semester-empty">No chapters match these filters.</div>}
            </div>
            <div className="semester-panel-footer">
              <span>Progress is read from your existing course records.</span>
              <span>{totalFor(selected).toLocaleString("en-IN")} questions in this course</span>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
