import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("./codeforces-problems.js", import.meta.url), "utf8");
assert.ok(source.includes("const REPLACEMENT_SNAPSHOT_KEY = 'limitless.competition.codeforces-replacement-snapshot.v1';"),
  "the first successful account lookup must be persisted as a one-time replacement snapshot");
assert.ok(source.includes("const snapshot = readReplacementSnapshot();") &&
  source.includes("if (snapshot) {"),
  "subsequent refreshes must reuse the saved snapshot before reading the linked handle");
assert.ok(source.includes("persistReplacementSnapshot(solved, wrong);"),
  "a successful initial handle lookup must freeze solved and attempted problem keys");

assert.match(source, /state\.problems = curateProblemset\(result, new Set\(\)\);/,
  "initial catalogue rendering must not depend on the timing of the account submission request");
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
  slice("  function curateProblemset", "  async function loadProblemset")
].join("\n") + "\nreturn curateProblemset;";
const curateProblemset = new Function(code)();

const rows = [];
const stats = [];
const ratings = [
  [800, ["math", "number theory"]],
  [850, ["greedy"]],
  [900, ["dp", "math"]],
  [950, ["graphs", "dfs and similar"]],
  [1000, ["binary search"]],
  [1100, ["implementation"]],
  [1200, ["data structures"]]
];
for (const [rating, tags] of ratings) {
  for (let index = 0; index < 252; index += 1) {
    rows.push({
      contestId: rating * 10 + index,
      index: "A",
      name: "Rating " + rating + " problem " + index,
      rating,
      tags: tags.slice()
    });
    // Keep the first 250 in the curated set; the last two are available replacements.
    stats.push({solvedCount: index < 2 ? 20000 : index < 250 ? 10000 - index : 0});
  }
}
const lowBandSolved = rows
  .filter(problem => problem.rating === 900)
  .slice(0, 2);
const solvedKeys = new Set(lowBandSolved.map(problem => problem.contestId + "-" + problem.index));
const curated = curateProblemset({problems: rows, problemStatistics: stats}, solvedKeys);

assert.equal(curated.replacementCount, 2, "only the two solved 900-rated entries are replaced");
assert.equal(curated.length, ratings.length * 250, "total catalogue size is unchanged");
assert.equal(new Set(curated.map(problem => problem.contestId + "-" + problem.index)).size, curated.length,
  "the catalogue has no duplicate problem IDs");
assert.ok(curated.every(problem => !solvedKeys.has(problem.contestId + "-" + problem.index)),
  "solved low-band entries are absent after replacement");

for (const [rating] of ratings) {
  assert.equal(curated.filter(problem => problem.rating === rating).length, 250,
    "the number of problems at rating " + rating + " is unchanged");
}
for (const problem of lowBandSolved) {
  const replacement = curated.find(candidate =>
    candidate.rating === problem.rating &&
    JSON.stringify(candidate.tags.slice().sort()) === JSON.stringify(problem.tags.slice().sort()));
  assert.ok(replacement, "a replacement exists with the exact original rating and complete tag set");
  assert.notEqual(replacement.contestId + "-" + replacement.index,
    problem.contestId + "-" + problem.index, "replacement is a different problem");
}
assert.ok(curated.some(problem => problem.rating === 800), "unsolved 800-rated problems remain");
assert.ok(curated.some(problem => problem.rating === 850), "unsolved 850-rated problems remain");
assert.ok(curated.some(problem => problem.rating === 950), "unsolved 950-rated problems remain");
assert.ok(curated.some(problem => problem.rating === 1000), "unsolved 1000-rated problems remain");
assert.equal(curated.filter(problem => problem.rating === 1100).length, 250,
  "other ratings are not used as replacement pools");

// Exact-tag alternatives may already be inside the curated sample. The selector
// must move one into the solved slot and refill its former slot at the same rating.
const selectedMatchRows = [];
const selectedMatchStats = [];
for (let index = 0; index < 130; index += 1) {
  selectedMatchRows.push({
    contestId: 9100 + index,
    index: "A",
    name: "Exact-tag selected " + index,
    rating: 800,
    tags: ["math", "number theory"]
  });
  selectedMatchStats.push({solvedCount: 20000 - index});
}
for (let index = 0; index < 1000; index += 1) {
  selectedMatchRows.push({
    contestId: 9200 + index,
    index: "A",
    name: "Same-rating filler " + index,
    rating: 800,
    tags: ["math"]
  });
  selectedMatchStats.push({solvedCount: 1000 - index});
}
const selectedSolved = new Set(selectedMatchRows.slice(0, 2)
  .map(problem => problem.contestId + "-" + problem.index));
const selectedMatchCatalogue = curateProblemset(
  {problems: selectedMatchRows, problemStatistics: selectedMatchStats},
  selectedSolved
);
assert.equal(selectedMatchCatalogue.replacementCount, 2,
  "selected exact-tag alternatives are used when no unselected exact-tag alternatives exist");
assert.equal(selectedMatchCatalogue.length, 250,
  "moving selected alternatives does not change the catalogue size");
assert.equal(new Set(selectedMatchCatalogue.map(problem => problem.contestId + "-" + problem.index)).size, 250,
  "moving selected alternatives never introduces duplicate problem IDs");
assert.ok(selectedMatchCatalogue.every(problem => !selectedSolved.has(problem.contestId + "-" + problem.index)),
  "solved targets are removed when selected alternatives are moved");
for (const original of selectedMatchRows.slice(0, 2)) {
  assert.ok(selectedMatchCatalogue.some(problem =>
    problem.rating === original.rating &&
    JSON.stringify(problem.tags.slice().sort()) === JSON.stringify(original.tags.slice().sort()) &&
    problem.contestId !== original.contestId),
  "each moved replacement preserves the exact rating and complete tag set");
}
assert.equal(selectedMatchCatalogue.filter(problem => problem.rating === 800).length, 250,
  "same-rating fillers preserve the original rating count");

// If an exact rating/tag group has insufficient unsolved alternatives, fail loudly.
const insufficientRows = [];
const insufficientStats = [];
for (let index = 0; index < 252; index += 1) {
  insufficientRows.push({
    contestId: 8000 + index,
    index: "A",
    name: "Insufficient pool " + index,
    rating: 800,
    tags: ["math"]
  });
  insufficientStats.push({solvedCount: index < 250 ? 10000 - index : 0});
}
const allSelectedSolved = new Set(insufficientRows.slice(0, 250)
  .map(problem => problem.contestId + "-" + problem.index));
assert.throws(
  () => curateProblemset({problems: insufficientRows, problemStatistics: insufficientStats}, allSelectedSolved),
  /same rating and exact same tags/,
  "the selector reports an impossible exact-match replacement instead of changing rating or tags"
);

console.log("Codeforces handle-aware catalogue: all assertions passed (2 exact rating/tag replacements; all seven rating buckets preserved).");
