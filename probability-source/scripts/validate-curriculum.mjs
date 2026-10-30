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

// Guard the ten original sequence placements: ranks are part of the curriculum design.
const rankChecks = [
  ["app/content/chapter1-theory.ts", "geometric-probability", 9],
  ["app/content/chapter1-theory.ts", "borel-cantelli", 2],
  ["app/content/pathway-lessons.ts", "discrete-distributions", 5],
  ["app/content/pathway-lessons-advanced.ts", "negative-binomial", 5],
  ["app/content/pathway-lessons-advanced.ts", "bayesian-inference", 6],
  ["app/content/pathway-lessons-advanced.ts", "likelihood-estimation", 2],
  ["app/content/pathway-lessons-advanced.ts", "confidence-hypothesis-tests", 2],
  ["app/content/pathway-lessons.ts", "joint-distributions", 3],
  ["app/content/pathway-lessons.ts", "conditional-expectation", 3],
  ["app/content/pathway-lessons.ts", "markov-chain-analysis", 1],
  ["app/content/pathway-lessons.ts", "poisson-processes", 1],
  ["app/content/pathway-lessons.ts", "martingales", 0],
  ["app/content/pathway-lessons-advanced.ts", "bayesian-computation", 0],
  ["app/content/pathway-lessons.ts", "monte-carlo", 0],
];
for (const [file, id, rank] of rankChecks) {
  const source = read(file);
  const pattern = new RegExp('id\\s*:\\s*"' + id + '"\\s*,\\s*rank\\s*:\\s*' + rank + '\\b');
  if (!pattern.test(source)) throw new Error("Lesson " + id + " must remain in Sequence " + String(rank).padStart(2, "0") + ".");
}
const indexSource = read("app/content/index.ts");
for (const [name, expected] of Object.entries({
  rank09Order: ["sample-space", "events-operations", "set-theory", "mutually-exclusive", "exhaustive-partitions", "counting", "combinations", "multinomials", "axioms", "properties", "equally-likely", "probability-counting", "geometric-probability", "de-morgan", "continuity"],
  rank08Order: ["advanced-counting", "occupancy-coupon", "random-permutations"],
  rank07Order: ["conditional", "conditional-independence", "total-probability"],
  rank06Order: ["bayes", "bayesian-inference"],
  rank05Order: ["random-variables", "distributions", "discrete-distributions", "negative-binomial"],
  rank04Order: ["expectation-variance", "continuous-rv", "normal-distribution", "gamma-beta-distributions"],
  rank03Order: ["joint-distributions", "conditional-expectation", "joint-transformations", "sums-convolution", "generating-functions", "order-statistics"],
  rank01Order: ["markov", "markov-chain-analysis", "random-walks", "branching-processes", "poisson-processes", "reliability-hazards"],
  rank02Order: ["limit-theorems", "limit-theorems-deep", "concentration-inequalities", "chernoff-hoeffding", "borel-cantelli", "likelihood-estimation", "confidence-hypothesis-tests"],
  rank00Order: ["martingales", "renewal-queueing", "monte-carlo", "mcmc", "bayesian-computation"],
})) {
  const match = indexSource.match(new RegExp("const " + name + " = \\[([\\s\\S]*?)\\]"));
  const actual = match ? [...match[1].matchAll(/"([^"]+)"/g)].map((item) => item[1]) : [];
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(name + " no longer matches the intended sequence teaching order.");
  }
}

const legacySource = read("app/content/legacy.ts");
const legacyRankBlock = legacySource.slice(legacySource.indexOf("const legacyRank"));
const representedRanks = new Set();
for (const source of lessonSources) {
  for (const match of source.matchAll(/\brank:\s*(\d+)/g)) representedRanks.add(Number(match[1]));
}
for (const match of legacyRankBlock.matchAll(/:\s*(\d+)/g)) representedRanks.add(Number(match[1]));
for (let rank = 0; rank <= 9; rank++) {
  if (!representedRanks.has(rank)) throw new Error("Sequence " + String(rank).padStart(2, "0") + " has no lessons.");
}
for (const [id, rank] of Object.entries({ conditional: 7, bayes: 6, "random-variables": 5, distributions: 5, "limit-theorems": 2, markov: 1 })) {
  if (!new RegExp('"' + id + '"\\s*:\\s*' + rank + '\\b|\\b' + id + '\\s*:\\s*' + rank + '\\b').test(legacyRankBlock)) {
    throw new Error("Legacy lesson " + id + " must remain in Sequence " + String(rank).padStart(2, "0") + ".");
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
for (const id of lessonIds) {
  if (!routeIds.has(id)) throw new Error("Lesson " + id + " is not included in any learning pathway.");
}

const authored = read("app/content/pathway-lessons.ts") + "\n" + read("app/content/pathway-lessons-advanced.ts");
const starts = [...authored.matchAll(/\n  \{\n    id: "([^"]+)", rank: \d+/g)];
if (starts.length !== 33) throw new Error("Expected 33 authored expansion lessons; found " + starts.length);
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
// Sequence 09 core-extension lessons must be fully taught, not title-and-formula stubs.
const rank09ExtraSource = read("app/content/rank09-extra.ts");
const rank09ExtraStarts = [...rank09ExtraSource.matchAll(/\\n  \\{\\n    id: "([^"]+)", rank: 9/g)];
if (rank09ExtraStarts.length !== 9) {
  throw new Error("Expected nine Sequence 09 extension lessons; found " + rank09ExtraStarts.length);
}
for (let i = 0; i < rank09ExtraStarts.length; i++) {
  const start = rank09ExtraStarts[i].index;
  const end = i + 1 < rank09ExtraStarts.length ? rank09ExtraStarts[i + 1].index : rank09ExtraSource.lastIndexOf("\\n];");
  const block = rank09ExtraSource.slice(start, end);
  const id = rank09ExtraStarts[i][1];
  const examples = [...block.matchAll(/\\{\\s*title:\\s*"[^"]*",\\s*problem:/g)].length;
  const questions = [...block.matchAll(/\\{\\s*question:\\s*"[^"]*",\\s*options:/g)];
  if (examples < 2) throw new Error("Sequence 09 lesson " + id + " needs at least two worked examples.");
  if (questions.length !== 3) throw new Error("Sequence 09 lesson " + id + " needs exactly three graded questions.");
  const difficulties = new Set([...block.matchAll(/difficulty:\\s*"(easy|medium|hard)"/g)].map((m) => m[1]));
  for (const level of ["easy", "medium", "hard"]) {
    if (!difficulties.has(level)) throw new Error("Sequence 09 lesson " + id + " is missing its " + level + " question.");
  }
}
const geometricSource = read("app/content/chapter1-theory.ts");
const geometricStart = geometricSource.indexOf("export const geometricProbability");
const geometricEnd = geometricSource.indexOf("export const borelCantelli", geometricStart);
const geometricBlock = geometricSource.slice(geometricStart, geometricEnd);
if (geometricStart < 0 || geometricEnd < 0) throw new Error("Geometric probability lesson is missing.");
for (const required of ["Buffon’s needle", "Bertrand’s paradox", "P({x}) = 0"]) {
  if (!geometricBlock.includes(required)) throw new Error("Geometric probability lesson is missing: " + required);
}
const geometricExamples = [...geometricBlock.matchAll(/title:\s*"/g)].length;
const geometricQuestions = [...geometricBlock.matchAll(/question:\s*"/g)].length;
if (geometricExamples < 3 || geometricQuestions < 3) {
  throw new Error("Geometric probability needs at least three worked examples and three graded questions.");
}

const coverage = read("app/content/coverage.ts");
const coverageAreas = [...coverage.matchAll(/\{\s*area:\s*"([^"]+)"/g)].map((match) => match[1]);
if (new Set(coverageAreas).size !== coverageAreas.length) {
  throw new Error("Coverage ledger contains duplicate topic areas.");
}
if (!coverage.includes('status: "planned"') || !coverage.includes('status: "expanded"')) {
  throw new Error("Coverage ledger must distinguish current expansion from remaining work.");
}
console.log("Curriculum validation passed.");
console.log("- Unique lesson IDs: " + lessonIds.size);
console.log("- Overlapping pathways: " + routeBlocks.length);
console.log("- New lessons: " + starts.length);
console.log("- New graded questions: " + questionTotal);
console.log("- Every new lesson has two worked examples and easy/medium/hard questions with valid answer indexes.");