#!/usr/bin/env node
// scripts/test-capability-truth.mjs
//
// PHASE 5.0 capability-truth gate.
//
// This does NOT flip any flag. It freezes the current capability surface and
// makes every true flag declare whether it is actually served by UI, is
// content-only, or is a known gap. A new true flag with no evidence fails, and
// an allowlisted gap that silently changes also fails.
//
// Run:
//   node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON \
//     --import ./scripts/ts-resolve-hook.mjs scripts/test-capability-truth.mjs

import assert from "node:assert/strict";

import { COURSES } from "../app/courses/registry.ts";
import { capabilities } from "../app/courses/capabilities.ts";
import { DEFAULT_CAPABILITIES } from "../app/courses/capabilities.ts";

let checks = 0;
const check = (cond, msg) => {
  assert.ok(cond, msg);
  checks++;
};

const PHASE5 = [
  "mistakes",
  "timers",
  "drafts",
  "attemptHistory",
  "analyticsCharts",
  "periodFilters",
];

const STORAGE_KEYS = {
  mt201: "mm-mt201-v1",
  mt202: "mm-mt202-v1",
  mt203: "mm-mt203-v1",
};

/**
 * Flags with a real UI consumer. Values are the file that serves them.
 * Keep this list explicit: it is the capability ledger, not a copy of the
 * manifest.
 */
const SERVED = {
  mt201: {
    practice: "app/mt201/page.tsx",
    "practiceScopes.topic": "app/mt201/page.tsx",
    exam: "app/mt201/exam.tsx",
    review: "app/mt201/quiz.tsx",
    bookmarks: "app/mt201/quiz.tsx + app/courses/BookmarksPanel.tsx",
  },
  mt202: {
    theory: "app/mt202/page.tsx",
    formulas: "app/mt202/page.tsx",
    practice: "app/mt202/quiz.tsx",
    "practiceScopes.topic": "app/mt202/page.tsx",
    exam: "app/mt202/exam.tsx",
    review: "app/mt202/quiz.tsx",
    tools: "app/mt202/page.tsx",
    bookmarks: "app/mt202/quiz.tsx + app/courses/BookmarksPanel.tsx",
  },
  mt203: {
    theory: "app/mt203/player.tsx",
    formulas: "app/mt203/player.tsx",
    units: "app/mt203/page.tsx",
    practice: "app/mt203/practice.tsx",
    "practiceScopes.topic": "app/mt203/practice.tsx",
    "practiceScopes.unit": "app/mt203/practice.tsx",
    "practiceScopes.all": "app/mt203/practice.tsx",
    weakArea: "app/mt203/practice.tsx",
    spacedRevision: "app/mt203/practice.tsx",
    exam: "app/mt203/exam.tsx",
    review: "app/mt203/practice.tsx",
    dashboard: "app/mt203/dashboard.tsx",
    xp: "app/mt203/dashboard.tsx",
    mastery: "app/mt203/dashboard.tsx",
    goals: "app/mt203/dashboard.tsx",
    streaks: "app/mt203/dashboard.tsx",
    bookmarks: "app/mt203/player.tsx + app/courses/BookmarksPanel.tsx",
  },
};

/**
 * Existing content-only / unserved flags. These are documented debt, not new
 * permission to over-claim. Each entry must remain true until the feature or
 * the flag is intentionally resolved.
 */
const KNOWN_GAPS = {
  mt202: {
    subtopics: "chapter topic lists exist; there is no subtopic UI",
  },
  mt203: {
    subtopics: "topic subs[] exist; there is no subtopic UI",
    "practiceScopes.multiTopic":
      "mixed practice exists; there is no multi-topic selector",
  },
};

/** Known under-claims. A false flag is allowed to describe a partial feature. */
const KNOWN_UNDERCLAIMS = {
  mt203: {
    timers: "exam countdown exists; per-question timing does not",
  },
};

const EXPECTED = {
  mt201: capabilities({
    subtopics: false,
    practice: true,
    practiceScopes: { topic: true },
    exam: true,
    review: true,
    bookmarks: true,
  }),
  mt202: capabilities({
    theory: true,
    formulas: true,
    subtopics: true,
    practice: true,
    practiceScopes: { topic: true },
    exam: true,
    review: true,
    tools: true,
    bookmarks: true,
  }),
  mt203: capabilities({
    theory: true,
    formulas: true,
    subtopics: true,
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
};

function flatten(obj, prefix = "") {
  const out = {};
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object") {
      Object.assign(out, flatten(value, path));
    } else {
      out[path] = value;
    }
  }
  return out;
}

function assertAllFalse(obj, prefix = "") {
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object") {
      assertAllFalse(value, path);
    } else {
      check(value === false, `DEFAULT_CAPABILITIES.${path} must be false`);
    }
  }
}

assertAllFalse(DEFAULT_CAPABILITIES);

for (const entry of COURSES) {
  const id = entry.manifest.id;
  const caps = entry.manifest.capabilities;
  const flat = flatten(caps);

  check(STORAGE_KEYS[id] !== undefined, `${id}: known course id`);
  check(
    entry.manifest.storageKey === STORAGE_KEYS[id],
    `${id}: storage key must stay ${STORAGE_KEYS[id]}`
  );
  assert.deepEqual(
    caps,
    EXPECTED[id],
    `${id}: capability surface changed without updating the truth ledger`
  );

  for (const flag of PHASE5) {
    check(flat[flag] === false, `${id}: Phase-5 flag ${flag} must remain false`);
  }

  for (const [key, value] of Object.entries(flat)) {
    if (value !== true) continue;
    const served = SERVED[id]?.[key];
    const gap = KNOWN_GAPS[id]?.[key];
    check(
      typeof served === "string" || typeof gap === "string",
      `${id}.${key} is true but has no served/gap evidence`
    );
    if (typeof served === "string") {
      check(served.length > 0, `${id}.${key} served reference is empty`);
    }
    if (typeof gap === "string") {
      check(gap.length > 0, `${id}.${key} gap reason is empty`);
    }
  }

  for (const key of Object.keys(SERVED[id] ?? {})) {
    check(flat[key] === true, `${id}.${key} is listed as served but is false`);
  }

  for (const [key, reason] of Object.entries(KNOWN_GAPS[id] ?? {})) {
    check(flat[key] === true, `${id}.${key} is a known gap but is no longer true`);
    check(typeof reason === "string" && reason.length > 0, `${id}.${key} gap reason`);
  }

  for (const [key, reason] of Object.entries(KNOWN_UNDERCLAIMS[id] ?? {})) {
    check(flat[key] === false, `${id}.${key} is a known under-claim but is true`);
    check(
      typeof reason === "string" && reason.length > 0,
      `${id}.${key} under-claim reason`
    );
  }
}

check(COURSES.length === 3, "registry must contain exactly three courses");

console.log(`test-capability-truth: ${checks} checks passed`);
