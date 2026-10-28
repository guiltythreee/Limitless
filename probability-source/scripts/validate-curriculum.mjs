import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (relative) => fs.readFileSync(path.join(root, relative), "utf8");
const requiredFiles = [
  "app/content/rank09.ts",
  "app/content/rank09-extra.ts",
  "app/content/legacy.ts",
  "app/content/chapter1-theory.ts",
  "app/content/pathway-lessons.ts",
  "app/content/pathway-lessons-advanced.ts",
  "app/content/pathways.ts",
  "app/content/coverage.ts",
];
for (const file of requiredFiles) {
  if (!fs.existsSync(path.join(root, file))) throw new Error("Required curriculum file missing: " + file);
}

const sourcePaths = ["app/content/rank09.ts", "app/content/rank09-extra.ts", "app/content/legacy.ts", "app/content/chapter1-theory.ts", "app/content/pathway-lessons.ts", "app/content/pathway-lessons-advanced.ts"];
const lessonSources = sourcePaths.map(read);
const lessonIds = new Set();
const idLocations = new Map();

for (let i = 0; i < lessonSources.length; i++) {
  const file = sourcePaths[i];
  const text = lessonSources[i];
  const ids = [
    ...[...text.matchAll(/\bid:\s*"([^"]+)"\s*,\s*rank:\s*\d+/g)].map((m) => m[1]),
    ...[...text.matchAll(/\bid:\s*"([^"]+)"\s*,\s*unit:/g)].map((m) => m[1]),
  ];
  for (const id of ids) {
    if (idLocations.has(id)) throw new Error("Duplicate lesson ID " + id + " in " + file + " and " + idLocations.get(id));
    lessonIds.add(id);
    idLocations.set(id, file);
  }
}

const routeSource = read("app/content/pathways.ts");
const routeBlocks = [...routeSource.matchAll(/lessonIds:\s*\[([\s\S]*?)\]/g)];
if (routeBlocks.length !== 5) throw new Error("Expected five overlapping learning pathways.");
const routeIds = new Set();
const routeNames = [...routeSource.matchAll(/id:\s*"([^"]+)"\s*,\s*\n\s*label:/g)].map((m) => m[1]);
if (new Set(routeNames).size !== routeNames.length) throw new Error("Duplicate pathway IDs.");
for (let i = 0; i < routeBlocks.length; i++) {
  const ids = [...routeBlocks[i][1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);
  if (ids.length < 8) throw new Error("Pathway " + (routeNames[i] ?? i) + " is too short to be meaningful.");
  if (new Set(ids).size !== ids.length) throw new Error("Pathway " + (routeNames[i] ?? i) + " contains duplicate lesson IDs.");
  for (const id of ids) {
    if (!lessonIds.has(id)) throw new Error("Pathway " + (routeNames[i] ?? i) + " references unknown lesson " + id);
    routeIds.add(id);
  }
}

const authored = read("app/content/pathway-lessons.ts") + "\n" + read("app/content/pathway-lessons-advanced.ts");
const starts = [...authored.matchAll(/\n  \{\n    id: "([^"]+)", rank: \d+/g)];
if (starts.length !== 28) throw new Error("Expected 28 authored expansion lessons; found " + starts.length);
let questionTotal = 0;

for (let i = 0; i < starts.length; i++) {
  const start = starts[i].index;
  const end = i + 1 < starts.length ? starts[i + 1].index : authored.length;
  const block = authored.slice(start, end);
  const id = starts[i][1];
  const questionPattern = /\{\s*question:\s*"[^"]*",\s*options:\s*\[((?:[^"\\\]]|"(?:\\.|[^"\\])*")*)\]\s*,\s*answer:\s*(\d+),\s*difficulty:\s*"(easy|medium|hard)",\s*explanation:/g;
  const questions = [...block.matchAll(questionPattern)];
  if (questions.length !== 3) throw new Error(id + " must have three structured graded questions.");
  questionTotal += questions.length;
  const difficulties = new Set(questions.map((q) => q[3]));
  for (const level of ["easy", "medium", "hard"]) if (!difficulties.has(level)) throw new Error(id + " is missing " + level + " questions.");
  for (const q of questions) {
    const options = [...q[1].matchAll(/"(?:\\.|[^"\\])*"/g)];
    if (options.length < 2 || Number(q[2]) < 0 || Number(q[2]) >= options.length) {
      throw new Error(id + " has invalid answer index " + q[2] + " for " + options.length + " options.");
    }
  }
  const worked = [...block.matchAll(/\{\s*title:\s*"[^"]*",\s*problem:/g)].length;
  if (worked < 2) throw new Error(id + " needs at least two worked examples.");
  if (!routeIds.has(id)) throw new Error("New lesson " + id + " is not assigned to a pathway.");
}
const coverage = read("app/content/coverage.ts");
if (!coverage.includes('status: "planned"') || !coverage.includes('status: "expanded"')) {
  throw new Error("Coverage ledger must distinguish current expansion from remaining work.");
}
console.log("Curriculum validation passed.");
console.log("- Unique lesson IDs: " + lessonIds.size);
console.log("- Overlapping pathways: " + routeBlocks.length);
console.log("- New lessons: " + starts.length);
console.log("- New graded questions: " + questionTotal);
console.log("- Every new lesson has two worked examples and easy/medium/hard questions with valid answer indexes.");