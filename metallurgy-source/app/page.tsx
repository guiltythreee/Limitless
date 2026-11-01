"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { loadTheme, saveTheme } from "./lib/progress";
import { METALLURGY_STUDIES_REGISTRATION } from "./studies/registration";
import { StudiesLanding } from "../../shared/studies/StudiesLanding";

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
          <Link href="/">Disciplines</Link>
          <Link href="/mt202/">Courses</Link>
          <button className="theme-toggle" onClick={toggle} aria-label="Switch theme">
            {theme === "dark" ? "◐" : "◑"}
          </button>
        </nav>
      </header>

      <StudiesLanding registration={METALLURGY_STUDIES_REGISTRATION} />

      <footer className="site-footer">✧ &nbsp; M&amp;M ENGINEERING ARCHIVE &nbsp;✧</footer>
    </>
  );
}
