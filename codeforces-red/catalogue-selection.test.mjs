import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("./codeforces-problems.js", import.meta.url), "utf8");
function slice(from, to) {
  const start = source.indexOf(from);
  const end = source.indexOf(to, start);
  assert.ok(start >= 0 && end > start, "selector source must contain " + from);
  return source.slice(start, end);
}
const code = [
  slice("  const MAX_PER_RATING", "  const $ = id"),
  slice("  const CATEGORIES", "  function readSaved"),
  slice("  function categoriesFor", "  function esc("),
  slice("  function curateProblemset", "  async function readSnapshot")
].join("\n") + "\nreturn curateProblemset;";
const curateProblemset = new Function(code)();

const rows = [];
const stats = [];
let nextContestId = 10000;
function addProblem(rating, count, tagSet) {
  for (let index = 0; index < count; index += 1) {
    rows.push({
      contestId: nextContestId++,
      index: "A",
      name: "Rating " + rating + " problem " + index,
      rating,
      tags: [tagSet[index % tagSet.length]]
    });
    stats.push({solvedCount: (index * 37 + rating) % 10000});
  }
}
const topicTags = ["math", "greedy", "dp", "graphs", "binary search"];
for (const rating of [800, 850, 900, 950, 1000]) addProblem(rating, 3, topicTags);
addProblem(1100, 270, topicTags);
addProblem(1200, 270, topicTags);

const curated = curateProblemset({problems: rows, problemStatistics: stats});
const removedCount = 5 * 3;
assert.equal(curated.replacementCount, removedCount, "each selected 800–1000 item receives one replacement");
assert.equal(curated.length, 500 + removedCount, "total catalogue size remains unchanged");
assert.ok(curated.every((problem) => problem.rating < 800 || problem.rating > 1000),
  "no problem rated 800 through 1000 may remain");
assert.equal(curated.filter((problem) => problem.rating === 1100).length, 250 + removedCount,
  "replacement problems come from the lowest available higher rating first");
assert.equal(new Set(curated.map((problem) => problem.contestId + "-" + problem.index)).size, curated.length,
  "all retained and replacement problems have unique contest/problem IDs");
assert.ok(curated.filter((problem) => problem.rating > 1000).length >= removedCount);

// If the API catalogue cannot supply enough distinct replacements, fail loudly
// rather than silently shrinking the published problem set.
const tooSmall = [
  {contestId: 1, index: "A", name: "low A", rating: 800, tags: ["math"]},
  {contestId: 2, index: "A", name: "low B", rating: 900, tags: ["greedy"]},
  {contestId: 3, index: "A", name: "high A", rating: 1100, tags: ["dp"]},
];
assert.throws(
  () => curateProblemset({problems: tooSmall, problemStatistics: []}),
  /Could not replace all 2 excluded 800–1000 problems/,
  "insufficient replacement inventory must be reported"
);

console.log("Codeforces catalogue replacement: all assertions passed (" +
  removedCount + " replacements, " + curated.length + " curated problems).");
