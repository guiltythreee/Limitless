// app/courses/manifests/mt202.ts
//
// MT202 — Physical Metallurgy. Data-only manifest.
// Source of truth: public/data/mt202/index.json + ch01..ch09.json, plus
// app/data/lessons.ts for the condensed theory (ch01..ch08).
// Pipeline: scripts/sync.mjs (Markdown -> per-chapter JSON)
//
// Capabilities reflect the live MT202 app: theory reader (ch01..ch08),
// quiz player, timed exam, and the four metallurgy calculators. NO XP,
// mastery, goals, or module grouping. Verified here by
// scripts/validate-courses.mjs (9 topics, 522 questions).
//
// NOTE: ch09 is the "Revision Mix (HARD)" exam pool and has no lesson.
// NOTE: the landing page once advertised "387" questions; Phase 4a corrected
// it to the real source total, which grew to 522 when the Interview & GATE
// extra-practice batches were added. The manifest always follows the source.

import type { CourseManifest } from "../types";
import { capabilities } from "../capabilities";

export const MT202_MANIFEST: CourseManifest = {
  id: "mt202",
  code: "MT202",
  title: "Physical Metallurgy",
  subtitle: "Structure, defects, deformation, strengthening & diffusion",
  description:
    "522 chapter-wise MCQs with concise and detailed solutions, condensed lessons for chapters 1–8, an exam simulator and four metallurgy calculators.",
  symbol: "⚗",
  status: "live",
  route: "mt202",
  storageKey: "mm-mt202-v1",
  contentBase: "data/mt202",
  capabilities: capabilities({
    theory: true,
    formulas: true,
    subtopics: true, // ch01..ch08 carry topic lists; ch09 does not
    practice: true,
    practiceScopes: { topic: true },
    exam: true,
    review: true,
    tools: true,
    bookmarks: true,
    timers: true,
  }),
  units: [], // MT202 has no module grouping in its source
  topics: [
    { id: "ch01", num: 1, title: "Atomic Structure and Interatomic Bonding", count: 35, hasLesson: true },
    { id: "ch02", num: 2, title: "Structure of Metals", count: 53, hasLesson: true },
    { id: "ch03", num: 3, title: "Solidification of Metals", count: 73, hasLesson: true },
    { id: "ch04", num: 4, title: "Constitution of Alloys and Alloy Solidification", count: 47, hasLesson: true },
    { id: "ch05", num: 5, title: "Crystal Defects", count: 70, hasLesson: true },
    { id: "ch06", num: 6, title: "Plastic Deformation", count: 58, hasLesson: true },
    { id: "ch07", num: 7, title: "Strengthening Mechanisms", count: 60, hasLesson: true },
    { id: "ch08", num: 8, title: "Diffusion", count: 56, hasLesson: true },
    { id: "ch09", num: 9, title: "Revision Mix (HARD)", count: 70, hasLesson: false },
  ],
  taxonomy: {
    types: [
      { key: "A", name: "single-correct" },
      { key: "B", name: "multiple-correct" },
      { key: "C", name: "assertion-reason" },
      { key: "D", name: "match" },
      { key: "E", name: "numerical" },
      { key: "F", name: "true / false" },
      { key: "G", name: "data reading" },
    ],
    difficulties: [
      { level: 1, name: "Basic" },
      { level: 2, name: "Intermediate" },
      { level: 3, name: "Advanced" },
      { level: 4, name: "Exam challenge" },
    ],
  },
  tools: [
    {
      id: "calculators",
      title: "Metallurgy calculators",
      description: "Lever rule, Schmid factor, Hall–Petch and the carburising √(Dt) solver.",
      load: () => import("../../mt202/calculators"),
    },
  ],
};
