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
  const [courseOpen, setCourseOpen] = useState(false);
  const [snapshots, setSnapshots] = useState<ReturnType<NonNullable<typeof METALLURGY_STUDIES_REGISTRATION.readProgress>>>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("number");
  const [semester, setSemester] = useState("3");
  const semesters = ["3", "4", "5", "6", "7", "8"];

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
            <div><strong>Metallurgy</strong><small>6 semesters · 3 courses</small></div>
          </div>
          <div className="semester-sidebar-label">SEMESTERS</div>
          <div className="semester-year-list">
            {semesters.map((number) => (
              <button key={number} className={"semester-year " + (semester === number ? "is-active" : "")} aria-pressed={semester === number} onClick={() => { setSemester(number); setCourseOpen(false); }}>
                <span className="semester-year-number">{number}</span>
                <span className="semester-year-copy"><strong>Semester {number}</strong><small>{number === "3" ? "3 courses available" : "No courses added yet"}</small></span>
                <span className="semester-year-arrow">{semester === number ? "−" : "+"}</span>
              </button>
            ))}
          </div>

          <div className="semester-sidebar-note">
            <span>PROGRAMME STRUCTURE</span>
            <strong>6 semesters</strong>
            <small>Metallurgy begins in Semester 3 and continues through Semester 8. Courses for later semesters can be added when ready.</small>
          </div>
        </aside>

        <main className="semester-main">
          {semester === "3" && !courseOpen ? <>
            <div className="semester-main-heading">
              <div className="semester-breadcrumb">LIMITLESS <span>/</span> METALLURGY <span>/</span> SEMESTER {semester}</div>
              <div className="semester-title-row">
                <div>
                  <div className="semester-eyebrow">YOUR PROGRAMME</div>
                  <h1>Semester {semester}</h1>
                  <p>Choose a course to view its chapters, questions and learning progress.</p>
                </div>
                <div className="semester-title-symbol">⚗</div>
              </div>
              <div className="semester-summary">
                <div><strong>{COURSES.length}</strong><span>Courses</span></div>
                <div><strong>{COURSES.reduce((sum, course) => sum + course.topics.length, 0)}</strong><span>Chapters</span></div>
                <div><strong>{COURSES.reduce((sum, course) => sum + totalFor(course), 0).toLocaleString("en-IN")}</strong><span>Questions</span></div>
                <div><strong>{COURSES.reduce((sum, course) => sum + courseStats(course).completed, 0)}</strong><span>Completed</span></div>
              </div>
            </div>
            <section className="semester-course-panel" aria-label={`Semester ${semester} courses`}>
              <div className="semester-panel-heading">
                <div><span className="semester-eyebrow">AVAILABLE COURSES</span><h2>Semester {semester} · Courses</h2></div>
                <span className="semester-tag">{COURSES.length} COURSES</span>
              </div>
              <div className="semester-course-grid">
                {COURSES.map((course, index) => {
                  const stats = courseStats(course);
                  const completion = course.topics.length ? Math.round((stats.completed / course.topics.length) * 100) : 0;
                  return (
                    <button
                      type="button"
                      key={course.id}
                      className="semester-course-card"
                      onClick={() => { setSelectedId(course.id); setCourseOpen(true); setQuery(""); setStatus("all"); setSort("number"); }}
                    >
                      <span className="semester-course-card-top">
                        <span className="semester-course-symbol">{course.symbol}</span>
                        <span className="semester-course-index">0{index + 1}</span>
                      </span>
                      <span className="semester-course-card-code">{course.code} · SEMESTER {semester}</span>
                      <strong>{course.title}</strong>
                      <span className="semester-course-card-subtitle">{course.subtitle}</span>
                      <span className="semester-course-card-meta">{course.topics.length} chapters <i>·</i> {totalFor(course).toLocaleString("en-IN")} questions</span>
                      {course.id === "mt202" && <span className="semester-course-card-extra">522 chapter-wise MCQs</span>}
                      <span className="semester-course-card-progress"><i style={{ width: `${completion}%` }} /></span>
                      <span className="semester-course-card-footer">{completion}% complete <b>Open course <span aria-hidden="true">→</span></b></span>
                    </button>
                  );
                })}
              </div>
            </section>
          </> : semester === "3" ? <>
          <div className="semester-course-back-row">
            <button type="button" className="semester-course-back" onClick={() => setCourseOpen(false)}>← <span>Back to Semester {semester} courses</span></button>
          </div>
          <div className="semester-main-heading">
            <div>
              <div className="semester-breadcrumb">LIMITLESS <span>/</span> METALLURGY <span>/</span> SEMESTER {semester}</div>
              <div className="semester-title-row">
                <div>
                  <div className="semester-eyebrow">{selected.code} · SEMESTER {semester}</div>
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
                <select aria-label="Semester" value={semester} onChange={(event) => { setSemester(event.target.value); setCourseOpen(false); }}>
                  {semesters.map((number) => <option key={number} value={number}>Semester {number}</option>)}
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
          </> : <section className="semester-empty-panel">
            <div className="semester-empty-icon">＋</div>
            <span className="semester-eyebrow">SEMESTER {semester}</span>
            <h1>Courses coming soon</h1>
            <p>No Metallurgy courses have been added to Semester {semester} yet.</p>
            <small>This semester is part of your six-semester programme structure and is ready for courses to be added later.</small>
          </section>}
        </main>
      </div>
    </div>
  );
}
