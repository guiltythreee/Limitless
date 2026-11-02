"use client";

import Link from "next/link";
import { createElement, useEffect, useState } from "react";
import { loadTheme, saveTheme } from "./lib/progress";
import { METALLURGY_STUDIES_REGISTRATION } from "./studies/registration";
import { createStudiesLanding } from "../../shared/studies/StudiesLanding";
import type { StudyProgressSnapshot } from "../../shared/studies/contracts";

// Course copy is sourced from each manifest; MT202 keeps its verified "522 chapter-wise MCQs" description in that registration.
export default function Landing() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [snapshots, setSnapshots] = useState<readonly StudyProgressSnapshot[]>([]);
  const [progressReady, setProgressReady] = useState(false);

  useEffect(() => {
    setTheme(loadTheme());
    try {
      setSnapshots(METALLURGY_STUDIES_REGISTRATION.readProgress?.() ?? []);
    } catch {
      setSnapshots([]);
    }
    setProgressReady(true);
  }, []);

  const landing = createStudiesLanding(createElement, Link, {
    registration: METALLURGY_STUDIES_REGISTRATION,
    snapshots,
    ready: progressReady,
  });

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
          <Link href="/">Disciplines</Link>
          <Link href="/mt202/">Courses</Link>
          <button className="theme-toggle" onClick={toggle} aria-label="Switch theme">
            {theme === "dark" ? "◐" : "◑"}
          </button>
        </nav>
      </header>

      {landing}

      <footer className="site-footer">✧ &nbsp; M&amp;M ENGINEERING ARCHIVE &nbsp;✧</footer>
    </>
  );
}
