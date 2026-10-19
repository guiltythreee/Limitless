"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { loadTheme, saveTheme } from "./lib/progress";

// Discipline landing page — "Metallurgical and Materials Engineering".
// Every course gets one card; add a course by extending the list below.
const COURSES = [
  {
    symbol: "♨",
    name: "MT201 — Metallurgical Thermodynamics",
    desc: "289 chapter-wise MCQs across fourteen chambers — laws, potentials, entropy, solutions, Ellingham diagrams and information theory, with worked solutions and a timed exam simulator.",
    href: "/mt201/",
    status: "live" as const,
  },
  {
    symbol: "⚗",
    name: "MT202 — Physical Metallurgy",
    desc: "387 chapter-wise MCQs with concise and detailed solutions, condensed lessons, exam simulator and metallurgy calculators.",
    href: "/mt202/",
    status: "live" as const,
  },
];

export default function Landing() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => setTheme(loadTheme()), []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    saveTheme(next);
    document.documentElement.setAttribute("data-theme", next);
  };

  return (
    <>
      <header className="navbar">
        <a className="brand" href="../">Limitless</a>
        <nav className="nav-links" aria-label="Main navigation">
          <Link href="/">Home</Link>
          <Link href="/mt202/">Courses</Link>
          <button className="theme-toggle" onClick={toggle} aria-label="Switch theme">
            {theme === "dark" ? "◐" : "◑"}
          </button>
        </nav>
      </header>

      <main>
        <section className="landing">
          <div className="eyebrow">Studies &amp; Disciplines</div>
          <div className="ornament" aria-hidden="true">✧</div>
          <h1>Metallurgical and Materials&nbsp;Engineering</h1>
          <p className="sub">
            An archive of the materials-science disciplines — each course is a chamber of
            lessons, practice questions, solutions and instruments.
          </p>

          <div className="course-grid">
            {COURSES.map((c) => {
              const live = c.status === "live";
              const inner = (
                <>
                  <div className="course-symbol" aria-hidden="true">{c.symbol}</div>
                  <h3>{c.name}</h3>
                  <p>{c.desc}</p>
                  <span className={`status status-${c.status}`}>
                    {live ? "Live" : "Coming Soon"}
                  </span>
                  {live && <div className="card-cta">Open →</div>}
                </>
              );
              return live ? (
                <Link key={c.name} className="panel course-card is-live" href={c.href}>
                  {inner}
                </Link>
              ) : (
                <article key={c.name} className="panel course-card">
                  {inner}
                </article>
              );
            })}
          </div>
        </section>
      </main>

      <footer className="site-footer">✧ &nbsp; M&amp;M ENGINEERING ARCHIVE &nbsp;✧</footer>
    </>
  );
}
