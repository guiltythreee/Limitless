// app/courses/manifests/mt201.ts
//
// MT201 — Metallurgical Thermodynamics. Data-only manifest.
// Source of truth: public/data/mt201/index.json + ch01..ch14.json
// Pipeline: scripts/sync-mt201.mjs  (JS bank -> per-chapter JSON)
//
// Capabilities reflect what the live MT201 app actually ships today:
// a flat chapter list of MCQs, a quiz player and a timed exam. NO theory
// reader, NO tools, NO XP/mastery/goals. Verified against the JSON here by
// scripts/validate-courses.mjs (14 topics, 289 questions).

import type { CourseManifest } from "../types";
import { capabilities } from "../capabilities";

export const MT201_MANIFEST: CourseManifest = {
  id: "mt201",
  code: "MT201",
  title: "Metallurgical Thermodynamics",
  subtitle: "Laws, potentials, entropy, solutions & Ellingham diagrams",
  description:
    "289 chapter-wise MCQs across fourteen chapters — the laws, thermodynamic potentials, entropy, solutions, Ellingham diagrams and information theory — with worked solutions and a timed exam simulator.",
  symbol: "♨",
  status: "live",
  route: "mt201",
  storageKey: "mm-mt201-v1",
  contentBase: "data/mt201",
  capabilities: capabilities({
    subtopics: false, // chapters carry an empty topics[] array
    practice: true,
    practiceScopes: { topic: true },
    exam: true,
    review: true,
    bookmarks: true,
    timers: true,
    mistakes: true,
    attemptHistory: true,
    analyticsCharts: true,
    periodFilters: true,
    goals: true,
    streaks: true,
  }),
  units: [], // MT201 has no module grouping in its source
  topics: [
    { id: "ch01", num: 1, title: "Foundations & System Concepts", count: 15, hasLesson: false },
    { id: "ch02", num: 2, title: "Zeroth Law & Temperature", count: 8, hasLesson: false },
    { id: "ch03", num: 3, title: "First Law, Work & Internal Energy", count: 20, hasLesson: false },
    { id: "ch04", num: 4, title: "Enthalpy & Heat Capacity", count: 20, hasLesson: false },
    { id: "ch05", num: 5, title: "Thermochemistry & Hess's Law", count: 26, hasLesson: false },
    { id: "ch06", num: 6, title: "Second Law & Entropy", count: 26, hasLesson: false },
    { id: "ch07", num: 7, title: "Third Law & Absolute Entropy", count: 14, hasLesson: false },
    { id: "ch08", num: 8, title: "Free Energy, Maxwell & Gibbs-Helmholtz", count: 28, hasLesson: false },
    { id: "ch09", num: 9, title: "Chemical Potential, Gibbs-Duhem, Activity & Fugacity", count: 27, hasLesson: false },
    { id: "ch10", num: 10, title: "Solutions, Regular/Sub-regular & Spinodal", count: 27, hasLesson: false },
    { id: "ch11", num: 11, title: "Ellingham Diagrams & Reduction", count: 28, hasLesson: false },
    { id: "ch12", num: 12, title: "Phase Equilibria & Clausius-Clapeyron", count: 22, hasLesson: false },
    { id: "ch13", num: 13, title: "Gases in Metals (Sieverts) & Equilibrium", count: 12, hasLesson: false },
    { id: "ch14", num: 14, title: "Entropy, Information & Landauer", count: 16, hasLesson: false },
  ],
  taxonomy: {
    types: [
      { key: "A", name: "direct" },
      { key: "B", name: "statement" },
      { key: "C", name: "assertion-reason" },
      { key: "D", name: "match" },
      { key: "E", name: "numerical" },
      { key: "F", name: "true / false" },
    ],
    difficulties: [
      { level: 1, name: "Basic" },
      { level: 2, name: "Intermediate" },
      { level: 3, name: "Advanced" },
      { level: 4, name: "Exam challenge" },
    ],
  },
  tools: [],
};
