"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { loadTheme, saveTheme } from "../lib/progress";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const papers = [
  { id: "I", original: "MT200_Rigorous_Practice_Paper.pdf", title: "Rigorous Practice Paper", file: "papers/paper-i.txt", solution: "solutions/paper-i.txt", scope: "Full-course foundations; derivations, theory and numericals", duration: "3 hours", marks: "100 + 8 bonus" },
  { id: "II", original: "MT200_Practice_Paper_II.pdf", title: "Rigorous Practice Paper II", file: "papers/paper-ii.txt", solution: "solutions/paper-ii.txt", scope: "Torsion, impact, fatigue, creep, materials classification and mechanical behaviour", duration: "3 hours", marks: "100 + 8 bonus" },
  { id: "III", original: "MT200_Practice_Paper_III.pdf", title: "Rigorous Practice Paper III", file: "papers/paper-iii.txt", solution: "solutions/paper-iii.txt", scope: "Modules 1–3: materials world, tension/compression and hardness", duration: "3 hours", marks: "100 + 8 bonus" },
  { id: "IV", original: "MT200_Practice_Paper_IV_Exam_Format.pdf", title: "Exam-Format Practice Paper IV", file: "papers/paper-iv.txt", solution: "solutions/paper-iv.txt", scope: "Midsem-style statements, matching, empirical relations and applied curve-reading", duration: "2.5 hours", marks: "100" },
];

const modules = [
  { n: "01", title: "Introduction to Materials", points: ["Condensed matter to structural and functional engineering materials", "Atomic, crystal, micro, macro and mega structures", "Properties of metals, ceramics, polymers and composites"] },
  { n: "02", title: "Tension and Compression Testing", points: ["Testing methodology, equipment, specimens and standard procedures", "Engineering and true stress–strain curves", "Strength, ductility, toughness, resilience and brittleness"] },
  { n: "03", title: "Hardness Testing", points: ["Hardness and its correlation with strength", "Scratch, rebound and indentation methods", "Brinell, Vickers, Rockwell and microhardness tests"] },
  { n: "04", title: "Miscellaneous Testing Methods", points: ["Torsion testing", "Impact testing", "Fatigue testing", "Creep testing"] },
  { n: "05", title: "Practical Exposure", points: ["Laboratory visits and demonstrations", "Hands-on practice", "Assignments"] },
];

export default function Mt200Course() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  useEffect(() => setTheme(loadTheme()), []);
  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    saveTheme(next);
    document.documentElement.setAttribute("data-theme", next);
  };
  const asset = (name: string) => `${basePath}/data/mt200/${name}`;

  return (
    <>
      <header className="navbar">
        <Link className="brand" href="/">M&amp;M Archive</Link>
        <nav className="nav-links" aria-label="Course navigation">
          <Link href="/">Disciplines</Link>
          <button className="theme-toggle" onClick={toggle} aria-label="Switch theme">{theme === "dark" ? "◐" : "◑"}</button>
        </nav>
      </header>
      <main className="mt200-page">
        <div className="mt200-hero">
          <div className="eyebrow">MT200 · 2-0-1 · 3 credits</div>
          <h1>Testing of Materials</h1>
          <p>Understand how engineering materials respond to mechanical loading, how those responses are measured, and how test results connect to material structure and properties.</p>
          <div className="mt200-meta"><span>5 modules</span><span>4 practice papers</span><span>4 model-solution sets</span></div>
        </div>

        <section className="mt200-section">
          <div className="eyebrow">Course structure</div>
          <h2>Five modules</h2>
          <div className="mt200-modules">
            {modules.map((m) => <article className="panel mt200-module" key={m.n}>
              <div className="mt200-module-number">{m.n}</div>
              <div><h3>{m.title}</h3><ul>{m.points.map((p) => <li key={p}>{p}</li>)}</ul></div>
            </article>)}
          </div>
        </section>

        <section className="mt200-section">
          <div className="eyebrow">Practice library</div>
          <h2>Practice papers and solutions</h2>
          <p><Link className="btn btn-gold" href="/mt200/practice">Open question-by-question practice workspace</Link></p>
          <p className="mt200-note">Attempt each paper before opening its companion model solutions and marking scheme. These text editions preserve the question and solution text extracted from the supplied PDFs. Some questions refer to stress–strain curves or diagrams that are present in the original PDFs but are not reproduced in the text edition.</p>
          <div className="mt200-papers">
            {papers.map((p) => <article className="panel mt200-paper" key={p.id}>
              <div className="mt200-paper-top"><span className="chip chip-gold">Paper {p.id}</span><span className="mt200-paper-meta">{p.duration} · {p.marks}</span></div>
              <h3>{p.title}</h3>
              <p>{p.scope}</p>
              <div className="mt200-actions">
                <a className="btn btn-gold" href={asset(p.file)} target="_blank" rel="noreferrer">Open questions</a>
                <a className="btn" href={asset(p.solution)} target="_blank" rel="noreferrer">Open solutions</a>
                <a className="btn" href={asset(`originals/${p.original}`)} target="_blank" rel="noreferrer">Original PDF</a>
              </div>
            </article>)}
          </div>
        </section>

        <section className="mt200-section">
          <div className="eyebrow">Course objectives</div>
          <h2>What this course develops</h2>
          <ol>
            <li>Introduce structural engineering materials and their mechanical properties.</li>
            <li>Introduce mechanical testing methodology.</li>
            <li>Develop insight into structure–property correlations for metallic materials.</li>
            <li>Provide general practice and hands-on training in mechanical testing.</li>
          </ol>
        </section>

        <section className="mt200-section mt200-outcomes">
          <div className="eyebrow">Learning outcomes</div>
          <h2>By the end of the course</h2>
          <ol>
            <li>Understand fundamentals of structure–property correlations in engineering materials.</li>
            <li>Know mechanical testing methods, equipment and best practices.</li>
            <li>Develop numerical problem-solving skills in materials testing.</li>
            <li>Apply mechanical testing concepts in industry and research laboratories.</li>
          </ol>
          <p className="mt200-note">Evaluation in the supplied course plan: Lab 10% · Quiz 15% · Midterm 25% · End-semester 50%.</p>
          <p className="mt200-note">References: G. E. Dieter, <em>Mechanical Metallurgy</em>, McGraw Hill (1988); W. D. Callister, <em>Materials Science and Engineering</em>, Wiley-India (2009).</p>
        </section>
        <footer className="site-footer">✧ &nbsp; M&amp;M ENGINEERING ARCHIVE &nbsp;✧</footer>
      </main>
    </>
  );
}
