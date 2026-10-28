// app/courses/manifests/mt203.ts
//
// MT203 — Polymer Science and Technology. Data-only manifest.
// Source of truth: app/data/qbank/meta.ts (MODULE_META) for structure/counts,
// app/data/qbank/t1..t11.ts for questions, app/data/lessons-mt203.ts for theory.
// Pipeline: hand-authored typed TS modules, code-split per topic.
//
// Capabilities reflect the live MT203 app: theory, per-topic/unit/all practice,
// weak-area training, spaced revision, timed exam, dashboard, XP, mastery,
// goals and streaks. NO subject tools.
//
// NOTE (pre-existing divergence): MODULE_META titles for t6/t7/t8/t9/t10 differ
// from the corresponding lesson titles in app/data/lessons-mt203.ts. The
// manifest follows MODULE_META (the question-bank authority whose counts the
// test locks). The divergence is reported, not silently reconciled.
//
// IMPORTANT: this manifest carries metadata only. Question text stays behind
// the per-topic dynamic imports in app/mt203/types.ts — untouched.

import type { CourseManifest } from "../types";
import { capabilities } from "../capabilities";

export const MT203_MANIFEST: CourseManifest = {
  id: "mt203",
  code: "MT203",
  title: "Polymer Science and Technology",
  subtitle: "Fundamentals, polymerization, properties, processing",
  description:
    "286 questions across 11 topics in 4 modules — fundamentals, polymerization, molecular weight, crystallinity, Tg/Tm, industrial polymers, blends, properties and processing — with spaced revision, weak-area training, mastery tracking and a timed exam.",
  symbol: "⛓",
  status: "live",
  route: "mt203",
  storageKey: "mm-mt203-v1",
  contentBase: "app/data/qbank",
  capabilities: capabilities({
    theory: true,
    formulas: true,
    subtopics: true, // each TopicSource has a subs[] list
    units: true,
    practice: true,
    practiceScopes: { topic: true, unit: true, all: true, multiTopic: true },
    weakArea: true,
    spacedRevision: true,
    exam: true,
    review: true,
    dashboard: true,
    xp: true,
    mastery: true,
    goals: true,
    streaks: true,
    bookmarks: true,
  }),
  units: [
    {
      id: "m1",
      num: 1,
      title: "Fundamentals, Classification & Architecture",
      topicIds: ["t1", "t2", "t3", "t4", "t5", "t6", "t7"],
    },
    { id: "m2", num: 2, title: "Industrial Polymers", topicIds: ["t8", "t9"] },
    { id: "m3", num: 3, title: "Properties of Polymers", topicIds: ["t10"] },
    { id: "m4", num: 4, title: "Compounding & Processing", topicIds: ["t11"] },
  ],
  topics: [
    { id: "t1", unitId: "m1", num: 1, title: "Fundamentals, Classification & Architecture", count: 32, hasLesson: true },
    { id: "t2", unitId: "m1", num: 2, title: "Polymerization Mechanisms", count: 36, hasLesson: true },
    { id: "t3", unitId: "m1", num: 3, title: "Polymerization Techniques", count: 22, hasLesson: true },
    { id: "t4", unitId: "m1", num: 4, title: "Molecular Weight & Distribution", count: 30, hasLesson: true },
    { id: "t5", unitId: "m1", num: 5, title: "Polymer Crystallinity", count: 20, hasLesson: true },
    { id: "t6", unitId: "m1", num: 6, title: "Thermal Transitions: Tg, Tm & HDT", count: 22, hasLesson: true },
    { id: "t7", unitId: "m1", num: 7, title: "Polymer Chemistry of Proteins", count: 16, hasLesson: true },
    { id: "t8", unitId: "m2", num: 8, title: "Industrial Polymers", count: 30, hasLesson: true },
    { id: "t9", unitId: "m2", num: 9, title: "Blends, Composites & Degradation", count: 24, hasLesson: true },
    { id: "t10", unitId: "m3", num: 10, title: "Mechanical & Viscoelastic Properties", count: 28, hasLesson: true },
    { id: "t11", unitId: "m4", num: 11, title: "Compounding & Processing", count: 26, hasLesson: true },
  ],
  taxonomy: {
    types: [
      { key: "recall", name: "recall" },
      { key: "concept", name: "conceptual" },
      { key: "compare", name: "comparison" },
      { key: "apply", name: "application" },
      { key: "numerical", name: "numerical" },
      { key: "assertreason", name: "assertion-reason" },
      { key: "statement", name: "statements" },
      { key: "match", name: "match" },
      { key: "sequence", name: "sequence" },
      { key: "graph", name: "data & graphs" },
      { key: "higher", name: "exam challenge" },
    ],
    difficulties: [
      { level: 1, name: "Basic" },
      { level: 2, name: "Intermediate" },
      { level: 3, name: "Advanced" },
      { level: 4, name: "Exam challenge" },
    ],
  },
  tools: [],
  rewards: {
    payPerCorrect: { 1: 4, 2: 8, 3: 14, 4: 22 },
    unitClearBonusPerUnit: 60,
    masteryBonusPerUnit: 120,
    rankNames: [
      "Novice",
      "Apprentice",
      "Formulator",
      "Compounder",
      "Polymer Technologist",
      "Materials Engineer",
      "Polymer Master",
    ],
  },
};
