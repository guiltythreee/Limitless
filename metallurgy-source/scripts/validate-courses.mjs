#!/usr/bin/env node
// scripts/validate-courses.mjs
//
// Registry + content-lock test for app/courses (Phase 1).
//
// It imports the REAL registry (Node's native type-stripping resolves the .ts
// sources), reads the REAL source data for each course, and asserts a
// three-way match:
//
//     manifest  ==  content-lock.json  ==  actual source
//
// Checks per course:
//   - topic ids and their order match the source
//   - every per-topic question count matches the source
//   - the course total matches the sum of its topics
//   - unit grouping covers every topic exactly once (MT203)
//   - every source question type is declared in the manifest taxonomy
//   - hasLesson matches whether a lesson really exists
//   - capability flags agree with the manifest (theory/tools/xp)
//   - the adapter's outline() agrees with the manifest
//
// Read-only: writes nothing.
// Run: node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON scripts/validate-courses.mjs

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, ".."); // metallurgy-source

const errors = [];
const ok = (cond, msg) => {
  if (!cond) errors.push(msg);
};

const { COURSES } = await import("../app/courses/registry.ts");
const lock = JSON.parse(fs.readFileSync(path.join(root, "app/courses/content-lock.json"), "utf8"));

const readJson = (p) => JSON.parse(fs.readFileSync(p, "utf8"));

// ------------------------------------------------------------------ sources

/** ch*.json files present on disk, sorted, ids only. */
function chapterIds(dir) {
  return fs
    .readdirSync(path.join(root, "public", "data", dir))
    .filter((f) => /^ch\d+\.json$/.test(f))
    .sort()
    .map((f) => f.replace(/\.json$/, ""));
}

function jsonSource(dir) {
  const ids = chapterIds(dir);
  const perTopic = {};
  const types = new Set();
  let emptyType = 0;
  for (const id of ids) {
    const j = readJson(path.join(root, "public", "data", dir, `${id}.json`));
    perTopic[id] = j.questions.length;
    for (const q of j.questions) {
      const t = q.type ?? "";
      if (t) types.add(t);
      else emptyType++;
    }
  }
  return { ids, perTopic, types, emptyType };
}

async function mt203Source() {
  const meta = await import("../app/data/qbank/meta.ts");
  const perTopic = {};
  const types = new Set();
  for (const t of meta.TOPIC_META) {
    const mod = await import(`../app/data/qbank/${t.id}.ts`);
    const src = mod.default;
    perTopic[t.id] = src.questions.length;
    ok(
      src.questions.length === t.count,
      `mt203/${t.id}: meta count ${t.count} != source ${src.questions.length}`
    );
    for (const q of src.questions) types.add(q.type);
  }
  return { ids: meta.TOPIC_META.map((t) => t.id), perTopic, types };
}

// ------------------------------------------------------------------- lessons

async function lessonIds(file) {
  const mod = await import(file);
  return new Set(Object.keys(mod.LESSONS));
}

// ------------------------------------------------------------------- checks

function checkCourse(entry, source, lessons) {
  const m = entry.manifest;
  const srcIds = source.ids;
  const manifestIds = m.topics.map((t) => t.id);

  ok(
    manifestIds.length === srcIds.length &&
      manifestIds.every((v, i) => v === srcIds[i]),
    `${m.id}: topic ids/order differ from source\n    manifest: ${manifestIds.join(", ")}\n    source  : ${srcIds.join(", ")}`
  );

  const manifestTotal = m.topics.reduce((s, t) => s + t.count, 0);
  for (const t of m.topics) {
    ok(source.perTopic[t.id] !== undefined, `${m.id}/${t.id}: topic not found in source`);
    ok(
      t.count === source.perTopic[t.id],
      `${m.id}/${t.id}: manifest count ${t.count} != source ${source.perTopic[t.id]}`
    );
  }
  const srcTotal = srcIds.reduce((s, id) => s + (source.perTopic[id] ?? 0), 0);
  ok(manifestTotal === srcTotal, `${m.id}: manifest total ${manifestTotal} != source total ${srcTotal}`);

  // unit grouping
  const covered = m.units.reduce((s, u) => s + u.topicIds.length, 0);
  if (m.units.length === 0) {
    ok(covered === 0, `${m.id}: no units but unit.topicIds present`);
    ok(m.topics.every((t) => t.unitId === undefined), `${m.id}: topic.unitId set but no units`);
  } else {
    ok(covered === m.topics.length, `${m.id}: units cover ${covered} topics, expected ${m.topics.length}`);
    for (const u of m.units) {
      for (const tid of u.topicIds) {
        const t = m.topics.find((x) => x.id === tid);
        ok(!!t, `${m.id}: unit ${u.id} references unknown topic ${tid}`);
        ok(t && t.unitId === u.id, `${m.id}/${tid}: unitId ${t?.unitId} != ${u.id}`);
      }
    }
  }

  // taxonomy must declare every source type
  const taxKeys = new Set(m.taxonomy.types.map((x) => x.key));
  for (const ty of source.types) {
    ok(taxKeys.has(ty), `${m.id}: source question type "${ty}" missing from manifest taxonomy`);
  }

  // hasLesson must match reality
  for (const t of m.topics) {
    const real = lessons ? lessons.has(t.id) : false;
    ok(t.hasLesson === real, `${m.id}/${t.id}: hasLesson=${t.hasLesson} but lesson present=${real}`);
  }

  // capability flags must agree with the manifest's own content
  const lessonExists = lessons ? lessons.size > 0 : false;
  ok(
    m.capabilities.theory === lessonExists,
    `${m.id}: capabilities.theory=${m.capabilities.theory} but lesson data present=${lessonExists}`
  );
  ok(m.capabilities.tools === m.tools.length > 0, `${m.id}: capabilities.tools disagrees with tools[]`);
  ok(m.capabilities.xp === (m.rewards !== undefined), `${m.id}: capabilities.xp disagrees with rewards`);

  // adapter outline must agree
  const outline = entry.adapter.outline();
  ok(outline.courseId === m.id, `${m.id}: adapter.courseId ${outline.courseId} != ${m.id}`);
  ok(outline.totalQuestions === manifestTotal, `${m.id}: adapter outline total ${outline.totalQuestions} != ${manifestTotal}`);
  ok(outline.topics.length === m.topics.length, `${m.id}: adapter outline topics ${outline.topics.length} != ${m.topics.length}`);

  // content-lock three-way
  const lc = lock.courses.find((c) => c.id === m.id);
  ok(!!lc, `${m.id}: missing from content-lock.json`);
  if (lc) {
    ok(lc.topics === m.topics.length, `${m.id}: lock topics ${lc.topics} != manifest ${m.topics.length}`);
    ok(lc.units === m.units.length, `${m.id}: lock units ${lc.units} != manifest ${m.units.length}`);
    ok(lc.total === manifestTotal, `${m.id}: lock total ${lc.total} != manifest ${manifestTotal}`);
    ok(lc.total === srcTotal, `${m.id}: lock total ${lc.total} != source ${srcTotal}`);
    for (const t of m.topics) {
      ok(
        lc.perTopic[t.id] === t.count,
        `${m.id}/${t.id}: lock count ${lc.perTopic[t.id]} != manifest ${t.count}`
      );
    }
    ok(
      Object.keys(lc.perTopic).length === m.topics.length,
      `${m.id}: lock has ${Object.keys(lc.perTopic).length} topics, manifest has ${m.topics.length}`
    );
  }

  return { id: m.id, topics: m.topics.length, units: m.units.length, total: manifestTotal, types: source.types.size };
}

// ---------------------------------------------------------------------- main

const mt201Lessons = null; // MT201 has no theory
const mt202Lessons = await lessonIds("../app/data/lessons.ts");
const mt203Lessons = await lessonIds("../app/data/lessons-mt203.ts");

const sources = {
  mt201: jsonSource("mt201"),
  mt202: jsonSource("mt202"),
  mt203: await mt203Source(),
};
const lessonsByCourse = { mt201: mt201Lessons, mt202: mt202Lessons, mt203: mt203Lessons };

const rows = [];
for (const entry of COURSES) {
  const id = entry.manifest.id;
  if (!sources[id]) {
    errors.push(`registry has unknown course "${id}" with no source`);
    continue;
  }
  rows.push(checkCourse(entry, sources[id], lessonsByCourse[id]));
}

// every lock entry must have a registry course
for (const lc of lock.courses) {
  ok(COURSES.some((c) => c.manifest.id === lc.id), `content-lock has "${lc.id}" with no registry course`);
}

// ------------------------------------------------------------------- report

const pad = (s, n) => String(s).padEnd(n);
console.log("validate-courses — registry vs source vs content-lock\n");
console.log(pad("course", 9) + pad("topics", 8) + pad("units", 7) + pad("total", 8) + "types");
for (const r of rows) {
  console.log(pad(r.id, 9) + pad(r.topics, 8) + pad(r.units, 7) + pad(r.total, 8) + r.types);
}

// surface undifferentiated (empty-type) questions without failing
if (sources.mt202 && sources.mt202.emptyType > 0) {
  console.log(`\nnote: mt202 has ${sources.mt202.emptyType} questions with an empty type (undifferentiated source rows) — allowed, not a failure.`);
}

if (errors.length) {
  console.error(`\n${errors.length} error(s):`);
  for (const e of errors) console.error("  ✗ " + e);
  process.exit(1);
}
console.log("\nAll course registry checks passed.");
